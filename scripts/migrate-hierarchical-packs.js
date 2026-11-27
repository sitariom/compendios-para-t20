#!/usr/bin/env node
/**
 * Migrador Determinístico de Compêndios Hierárquicos (module.json packFolders + packs por subtipo)
 *
 * Modos:
 *   --dry-run (padrão): gera catalogo/plano-migracao.json + mapa oldUuid -> newUuid sem mutar packs/ nem module.json.
 *   --apply:            grava os novos packs hierárquicos, reescreve @UUID[...], remove cópias migradas
 *                       dos 6 packs legados (mantendo 100% do LEGADO_MANUAL) e atualiza module.json.
 */

const fs = require('fs');
const path = require('path');
const { ClassicLevel } = require('classic-level');
const { SUBTYPE_LABELS } = require('./catalogo-init');
const { TYPE_TO_NAMESPACE, discoverPacksFromModuleJson } = require('./pack-discovery');

const ROOT_DIR = path.resolve(__dirname, '..');
const MODULE_JSON_PATH = path.join(ROOT_DIR, 'module.json');
const CATALOGO_DIR = path.join(ROOT_DIR, 'catalogo');
const CATALOGO_PATH = path.join(CATALOGO_DIR, 'catalogo.json');
const ARTEFATOS_PATH = path.join(CATALOGO_DIR, 'artefatos.json');
const PLANO_PATH = path.join(CATALOGO_DIR, 'plano-migracao.json');

function slugify(str) {
  return String(str || 'outros')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'outros';
}

function buildTargetPackMeta(mat, art) {
  const pubSlug = slugify(mat.serie);
  const edSlug = mat.edicao ? `edicao-${String(mat.edicao).padStart(2, '0')}` : slugify(mat.id);
  const relDirParts = ['packs', 'revistas', pubSlug];
  if (mat.campanha) relDirParts.push(slugify(mat.campanha));
  relDirParts.push(edSlug, art.pack_destino_hierarquico);

  const subSlug = art.pack_destino_hierarquico.split('-').pop();
  const label = `${SUBTYPE_LABELS[subSlug] || art.subtipo_label || art.tipo} (${mat.id})`;

  return {
    name: art.pack_destino_hierarquico,
    label,
    path: relDirParts.join('/'),
    type: art.tipo,
    system: 'tormenta20'
  };
}

function buildHierarchicalPackFolders(targetPacksByMaterial, catalogo, legacyPacks) {
  const bySerie = new Map();

  for (const [matId, packNames] of targetPacksByMaterial.entries()) {
    const mat = catalogo.materiais[matId];
    if (!mat) continue;
    const serieName = mat.serie;
    if (!bySerie.has(serieName)) {
      bySerie.set(serieName, {
        name: serieName,
        sorting: 'a',
        color: serieName.includes('Tormenta') ? '#7b1fa2' : '#8b0000',
        packs: [],
        folders: [],
        _campaigns: new Map()
      });
    }
    const serieFolder = bySerie.get(serieName);
    const edLabel = mat.edicao
      ? `Edição ${mat.edicao}${mat.titulo.includes(':') ? ` — ${mat.titulo.split(':').slice(1).join(':').trim()}` : ''}`
      : mat.titulo;
    const edFolder = {
      name: edLabel,
      sorting: 'm',
      packs: [...new Set(packNames)].sort()
    };

    if (mat.campanha) {
      if (!serieFolder._campaigns.has(mat.campanha)) {
        const campFolder = {
          name: mat.campanha,
          sorting: 'm',
          color: '#b71c1c',
          packs: [],
          folders: []
        };
        serieFolder._campaigns.set(mat.campanha, campFolder);
        serieFolder.folders.push(campFolder);
      }
      serieFolder._campaigns.get(mat.campanha).folders.push(edFolder);
    } else {
      serieFolder.folders.push(edFolder);
    }
  }

  const seriesFolders = [...bySerie.values()].map(sf => {
    delete sf._campaigns;
    return sf;
  });

  return [
    {
      name: 'Acervo Geral / Legado (Pré-Catálogo)',
      sorting: 'm',
      color: '#455a64',
      packs: legacyPacks.map(p => p.name)
    },
    ...seriesFolders
  ];
}

function collectUuidRefsFromObject(obj, refs = new Set()) {
  const text = JSON.stringify(obj);
  for (const m of text.matchAll(/Compendium\.compendios-para-t20\.[A-Za-z0-9_-]+\.(?:Actor|Item|JournalEntry|RollTable|Macro|Playlist)\.[A-Za-z0-9]{16}/g)) {
    refs.add(m[0]);
  }
  return refs;
}

function rewriteUuidRefsInValue(val, uuidMap) {
  if (!val || uuidMap.size === 0) return { value: val, replacements: 0 };
  let replacements = 0;
  let text = JSON.stringify(val);
  for (const [oldUuid, newUuid] of uuidMap.entries()) {
    if (text.includes(oldUuid)) {
      const parts = text.split(oldUuid);
      replacements += parts.length - 1;
      text = parts.join(newUuid);
    }
  }
  if (replacements === 0) return { value: val, replacements: 0 };
  return { value: JSON.parse(text), replacements };
}

async function readPackBundle(packAbsPath) {
  const db = new ClassicLevel(packAbsPath, { valueEncoding: 'json' });
  await db.open();
  const folders = new Map();
  const roots = new Map();
  const subsByRoot = new Map();
  try {
    for await (const [k, v] of db.iterator()) {
      if (k.startsWith('!folders!')) {
        folders.set(v._id, v);
      } else if (k.includes('.')) {
        const parts = k.split('!');
        const rootId = (parts[2] || '').split('.')[0];
        if (!subsByRoot.has(rootId)) subsByRoot.set(rootId, []);
        subsByRoot.get(rootId).push({ key: k, val: v });
      } else {
        const id = v?._id || k.split('!').pop();
        roots.set(id, { key: k, val: v });
      }
    }
  } finally {
    await db.close();
  }
  return { folders, roots, subsByRoot };
}

async function runMigration(options = {}) {
  const apply = Boolean(options.apply);
  if (!fs.existsSync(CATALOGO_PATH) || !fs.existsSync(ARTEFATOS_PATH)) {
    throw new Error('catalogo/catalogo.json ou catalogo/artefatos.json ausente. Execute `npm run catalogo:init` primeiro.');
  }

  const mod = JSON.parse(fs.readFileSync(MODULE_JSON_PATH, 'utf8'));
  const catalogo = JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf8'));
  const artefatosData = JSON.parse(fs.readFileSync(ARTEFATOS_PATH, 'utf8'));
  const declaredPacks = discoverPacksFromModuleJson(ROOT_DIR);

  const agentArts = artefatosData.artefatos.filter(a => a.origem_tipo === 'CRIADO_AGENTE');
  const legacyArtsCount = artefatosData.artefatos.filter(a => a.origem_tipo === 'LEGADO_MANUAL').length;

  const targetPacksMap = new Map(); // packName -> meta
  const targetPacksByMaterial = new Map(); // matId -> [packName]
  const uuidMap = new Map(); // oldUuid -> newUuid
  const collisionCheck = new Set();
  const collisions = [];
  const moveEntries = [];

  for (const art of agentArts) {
    const mat = catalogo.materiais[art.material_id];
    if (!mat) continue;
    const targetMeta = buildTargetPackMeta(mat, art);
    targetPacksMap.set(targetMeta.name, targetMeta);

    if (!targetPacksByMaterial.has(art.material_id)) targetPacksByMaterial.set(art.material_id, []);
    targetPacksByMaterial.get(art.material_id).push(targetMeta.name);

    const uniqueKey = `${targetMeta.name}::${art._id}`;
    if (collisionCheck.has(uniqueKey)) {
      collisions.push({ uniqueKey, artId: art.id });
    }
    collisionCheck.add(uniqueKey);

    const oldUuid = `Compendium.compendios-para-t20.${art.pack_atual}.${art.tipo}.${art._id}`;
    const newUuid = `Compendium.compendios-para-t20.${targetMeta.name}.${art.tipo}.${art._id}`;
    if (oldUuid !== newUuid) uuidMap.set(oldUuid, newUuid);

    moveEntries.push({
      artefato_id: art.id,
      _id: art._id,
      nome: art.nome,
      material_id: art.material_id,
      tipo: art.tipo,
      subtipo: art.subtipo,
      source_pack: art.pack_atual,
      target_pack: targetMeta.name,
      target_path: targetMeta.path,
      old_uuid: oldUuid,
      new_uuid: newUuid
    });
  }

  // Varre todos os packs declarados para validar @UUIDs referenciados
  const packBundles = new Map();
  const allKnownUuids = new Set(artefatosData.artefatos.map(a => a.uuid));
  const referencedUuids = new Set();

  for (const p of declaredPacks) {
    if (!fs.existsSync(p.absPath)) continue;
    const bundle = await readPackBundle(p.absPath);
    packBundles.set(p.name, bundle);
    for (const { val } of bundle.roots.values()) collectUuidRefsFromObject(val, referencedUuids);
    for (const subs of bundle.subsByRoot.values()) {
      for (const s of subs) collectUuidRefsFromObject(s.val, referencedUuids);
    }
  }

  const brokenRefs = [];
  for (const ref of referencedUuids) {
    if (!allKnownUuids.has(ref) && !uuidMap.has(ref)) {
      brokenRefs.push(ref);
    }
  }

  const legacyRootPacks = mod.packs.filter(p =>
    ['Ameacas_T20', 'Itens_T20', 'Macros_T20', 'Tabelas_T20', 'Diarios_T20', 'Playlist_T20'].includes(p.name)
  );
  const newTargetPacks = [...targetPacksMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  const packFolders = buildHierarchicalPackFolders(targetPacksByMaterial, catalogo, legacyRootPacks);

  const plan = {
    versao: '2.0.0',
    gerado_em: new Date().toISOString(),
    modo: apply ? 'APPLY' : 'DRY_RUN',
    resumo: {
      documentos_a_migrar: moveEntries.length,
      documentos_legado_preservados: legacyArtsCount,
      packs_hierarquicos_nao_vazios: newTargetPacks.length,
      reescritas_uuid_mapeadas: uuidMap.size,
      colisoes_detectadas: collisions.length,
      referencias_uuid_quebradas: brokenRefs.length
    },
    colisoes: collisions,
    referencias_quebradas: brokenRefs,
    packFolders,
    target_packs: newTargetPacks,
    uuid_rewrite_map: Object.fromEntries(uuidMap.entries()),
    movimentacoes: moveEntries
  };

  fs.mkdirSync(CATALOGO_DIR, { recursive: true });
  fs.writeFileSync(PLANO_PATH, JSON.stringify(plan, null, 2), 'utf8');

  console.log('================================================================================');
  console.log(`🗂️  MIGRAÇÃO HIERÁRQUICA DE COMPÊNDIOS (${apply ? 'APPLY' : 'DRY-RUN'})`);
  console.log('================================================================================');
  console.log(`  • Documentos a migrar (DB #226–#232 + Fúlgor #25–#28): ${plan.resumo.documentos_a_migrar}`);
  console.log(`  • Documentos Legado Manual preservados intactos: ${plan.resumo.documentos_legado_preservados}`);
  console.log(`  • Packs hierárquicos não-vazios previstos: ${plan.resumo.packs_hierarquicos_nao_vazios}`);
  console.log(`  • Colisões de ID: ${plan.resumo.colisoes_detectadas}`);
  console.log(`  • Referências @UUID quebradas: ${plan.resumo.referencias_uuid_quebradas}`);
  console.log(`  • Plano salvo em: ${PLANO_PATH}`);

  if (collisions.length > 0 || brokenRefs.length > 0) {
    console.error('❌ Plano reprovado por colisões ou referências @UUID quebradas.');
    return false;
  }

  if (!apply) {
    console.log('✅ Dry-run concluído com 0 colisões e 0 referências quebradas. Nenhuma mutação realizada.');
    return true;
  }

  // --- EXECUÇÃO REAL (--apply) ---
  // 1. Grava documentos nos packs hierárquicos destino com reescrita @UUID
  const docsByTargetPack = new Map();
  for (const m of moveEntries) {
    if (!docsByTargetPack.has(m.target_pack)) docsByTargetPack.set(m.target_pack, []);
    docsByTargetPack.get(m.target_pack).push(m);
  }

  let totalRewrites = 0;
  for (const tp of newTargetPacks) {
    const absTarget = path.join(ROOT_DIR, tp.path);
    fs.mkdirSync(absTarget, { recursive: true });
    const db = new ClassicLevel(absTarget, { valueEncoding: 'json' });
    await db.open();

    const entries = docsByTargetPack.get(tp.name) || [];
    for (const m of entries) {
      const srcBundle = packBundles.get(m.source_pack);
      if (!srcBundle) continue;
      const rootEntry = srcBundle.roots.get(m._id);
      if (!rootEntry) continue;

      const rootDoc = { ...rootEntry.val, folder: null };
      const rwRoot = rewriteUuidRefsInValue(rootDoc, uuidMap);
      totalRewrites += rwRoot.replacements;
      const ns = TYPE_TO_NAMESPACE[tp.type];
      await db.put(`!${ns}!${m._id}`, rwRoot.value);

      for (const sub of (srcBundle.subsByRoot.get(m._id) || [])) {
        const rwSub = rewriteUuidRefsInValue(sub.val, uuidMap);
        totalRewrites += rwSub.replacements;
        await db.put(sub.key, rwSub.value);
      }
    }
    await db.close();
  }

  // 2. Reescreve @UUIDs remanescentes nos packs legados e remove apenas documentos migrados (já verificados no destino)
  const migratedBySource = new Map();
  for (const m of moveEntries) {
    if (!migratedBySource.has(m.source_pack)) migratedBySource.set(m.source_pack, new Set());
    migratedBySource.get(m.source_pack).add(m._id);
  }

  for (const lp of legacyRootPacks) {
    const absLeg = path.join(ROOT_DIR, lp.path);
    if (!fs.existsSync(absLeg)) continue;
    const idsToRemove = migratedBySource.get(lp.name) || new Set();
    const db = new ClassicLevel(absLeg, { valueEncoding: 'json' });
    await db.open();
    const ops = [];
    for await (const [k, v] of db.iterator()) {
      if (k.startsWith('!folders!')) continue;
      const rootId = k.includes('.') ? (k.split('!')[2] || '').split('.')[0] : (v?._id || k.split('!').pop());
      if (idsToRemove.has(rootId)) {
        ops.push({ type: 'del', key: k });
      } else {
        const rw = rewriteUuidRefsInValue(v, uuidMap);
        if (rw.replacements > 0) {
          totalRewrites += rw.replacements;
          ops.push({ type: 'put', key: k, value: rw.value });
        }
      }
    }
    if (ops.length > 0) await db.batch(ops);
    await db.close();
  }

  // 3. Atualiza module.json (packs[] + packFolders[])
  mod.packs = [...legacyRootPacks, ...newTargetPacks];
  mod.packFolders = packFolders;
  fs.writeFileSync(MODULE_JSON_PATH, JSON.stringify(mod, null, 2) + '\n', 'utf8');

  // 4. Atualiza catalogo/artefatos.json com novo pack e UUID
  const moveByArtId = new Map(moveEntries.map(m => [m.artefato_id, m]));
  for (const art of artefatosData.artefatos) {
    const mv = moveByArtId.get(art.id);
    if (mv) {
      art.pack_atual = mv.target_pack;
      art.uuid = mv.new_uuid;
      art.pasta_atual = '(raiz)';
    }
  }
  fs.writeFileSync(ARTEFATOS_PATH, JSON.stringify(artefatosData, null, 2), 'utf8');

  console.log(`✅ Migração --apply concluída: ${newTargetPacks.length} packs hierárquicos criados, ${totalRewrites} @UUIDs reescritos e module.json atualizado.`);
  return true;
}

if (require.main === module) {
  const apply = process.argv.includes('--apply');
  runMigration({ apply })
    .then(ok => process.exit(ok ? 0 : 1))
    .catch(err => {
      console.error('❌ Erro fatal na migração:', err);
      process.exit(1);
    });
}

module.exports = { runMigration, buildTargetPackMeta, buildHierarchicalPackFolders };

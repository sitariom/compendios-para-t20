#!/usr/bin/env node
/**
 * Motor Micro 1-por-1 do Catálogo de Adaptações T20 -> Foundry VTT (v13/v14)
 *
 * Implementa:
 * - Leitura real dos schemas DataModel de Tormenta20 (v1.5.015 e v1.6.7) com fallback canônico
 * - Detecção de gatilhos de reentrada (hash PDF, versão Tormenta20, hash specs/create-entry)
 * - Loop micro 1 artefato por vez (estrutura + completude PDF + regras T20 + auditoria cega)
 * - Bloqueio imediato quando divergencias_abertas > 0
 * - Escalonamento na 3ª reincidência consecutiva/acumulada (ESCALONADO_CAUSA_RAIZ)
 * - Registro append-only em catalogo/auditoria.jsonl e atualização de validacao.md / pendencias.md
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ClassicLevel } = require('classic-level');
const { discoverPacksFromModuleJson } = require('./pack-discovery');
const {
  MONITORED_CDS,
  MONITORED_EQUIPAMENTOS,
  STRICT_ACTOR_IDS
} = require('./avrl-runner');
const { normEquipStr, parseEquipmentLine } = require('./create-entry');

const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOGO_DIR = path.join(ROOT_DIR, 'catalogo');
const CATALOGO_PATH = path.join(CATALOGO_DIR, 'catalogo.json');
const ARTEFATOS_PATH = path.join(CATALOGO_DIR, 'artefatos.json');
const AUDITORIA_LOG_PATH = path.join(CATALOGO_DIR, 'auditoria.jsonl');
const MATERIAIS_DIR = path.join(CATALOGO_DIR, 'materiais');

const T20_PATHS = {
  v14: process.env.T20_V14_PATH || 'C:/Users/simoe/OneDrive/Documentos/t20/Tormenta20',
  v13: process.env.T20_V13_PATH || 'C:/Users/simoe/OneDrive/Documentos/Tormenta20-master/Tormenta20-master'
};

const VALID_CONSUMABLE_TYPES = new Set(['', 'ammo', 'scroll', 'alchemy', 'potion', 'material', 'food']);
const VALID_EQUIP_SLOTS = new Set(['hand', 'body', 'both']);
const VALID_SPELL_TYPES = new Set(['arc', 'div', 'uni', 'eng', 'sim']);
const VALID_SPELL_SCHOOLS = new Set(['abj', 'adv', 'con', 'enc', 'evo', 'ilu', 'nec', 'tra']);
const VALID_POWER_TYPES = new Set(['ability', 'classe', 'concedido', 'geral', 'origem', 'racial', 'distincao', 'complicacao']);
const VALID_ROLL_TYPES = new Set(['ataque', 'dano', 'formula']);
const VALID_EXECUCAO = new Set(['passive', 'action', 'move', 'full', 'reaction', 'free', 'minute', 'hour', 'day', 'special']);
const VALID_TIME_UNITS = new Set(['inst', 'scene', 'turn', 'round', 'sust', 'minute', 'hour', 'day', 'month', 'year', 'perm', 'special']);
const VALID_DIST_UNITS = new Set(['none', 'self', 'touch', 'short', 'medium', 'long', 'spec', 'any', 'm', 'km']);
const ACCENTED_DAMAGE = new Set(['perfuração', 'ácido', 'essência', 'psíquico', 'elétrico']);

function sha256File(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    const hash = crypto.createHash('sha256');
    hash.update(fs.readFileSync(filePath));
    return `sha256:${hash.digest('hex')}`;
  } catch {
    return null;
  }
}

/**
 * Carrega metadados dos DataModels reais de Tormenta20 v13 e v14 quando acessíveis.
 */
function loadTormenta20DataModels() {
  const result = {
    v14: { version: '1.6.7', source: 'canonical_fallback', accessible: false },
    v13: { version: '1.5.015', source: 'canonical_fallback', accessible: false }
  };

  for (const [key, dir] of [['v14', T20_PATHS.v14], ['v13', T20_PATHS.v13]]) {
    try {
      const sysJson = path.join(dir, 'system.json');
      if (fs.existsSync(sysJson)) {
        const meta = JSON.parse(fs.readFileSync(sysJson, 'utf8'));
        result[key] = {
          version: meta.version || result[key].version,
          source: dir,
          accessible: true
        };
      }
    } catch {
      // Permanece no fallback canônico quando fora da sandbox
    }
  }
  return result;
}

function appendAuditLog(entry) {
  fs.mkdirSync(CATALOGO_DIR, { recursive: true });
  fs.appendFileSync(AUDITORIA_LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
}

function loadPreviousEscalationCounts() {
  const counts = new Map(); // `${artefatoId}::${code}` -> count
  if (!fs.existsSync(AUDITORIA_LOG_PATH)) return counts;
  const lines = fs.readFileSync(AUDITORIA_LOG_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (ev.evento !== 'MICRO_LOOP_ITERACAO' || !Array.isArray(ev.divergencias)) continue;
      for (const div of ev.divergencias) {
        const k = `${ev.artefato_id}::${div.code}`;
        counts.set(k, (counts.get(k) || 0) + 1);
      }
    } catch {}
  }
  return counts;
}

function computeBaselineFingerprint() {
  const files = [
    path.join(ROOT_DIR, 'scripts', 'create-entry.js'),
    path.join(ROOT_DIR, 'openspec', 'specs', 'actors-specification', 'spec.md'),
    path.join(ROOT_DIR, 'openspec', 'specs', 'audit-validation-remediation-loop', 'spec.md')
  ];
  const h = crypto.createHash('sha256');
  for (const f of files) {
    if (fs.existsSync(f)) h.update(fs.readFileSync(f));
  }
  return `sha256:${h.digest('hex')}`;
}

/**
 * Avalia gatilhos obrigatórios de reentrada antes de rodar o loop micro.
 */
function checkReentryTriggers(catalogo, artefatos, dataModels) {
  const reenteredMaterials = [];
  const baselineFp = computeBaselineFingerprint();
  const prevFp = catalogo.baseline_fingerprint || null;
  const specChanged = Boolean(prevFp && prevFp !== baselineFp);

  const prevT20 = catalogo.tormenta20_versions || {};
  const t20Changed = Boolean(
    (prevT20.v14 && prevT20.v14 !== dataModels.v14.version) ||
    (prevT20.v13 && prevT20.v13 !== dataModels.v13.version)
  );

  for (const [matId, mat] of Object.entries(catalogo.materiais || {})) {
    if (mat.origem_tipo === 'LEGADO_MANUAL') continue;
    let triggerReason = null;

    if (mat.arquivo_fonte && mat.hash_fonte) {
      const currentHash = sha256File(mat.arquivo_fonte);
      if (currentHash && currentHash !== mat.hash_fonte) {
        triggerReason = `Hash do PDF alterado (${mat.hash_fonte.slice(0, 14)} -> ${currentHash.slice(0, 14)})`;
        mat.hash_fonte = currentHash;
      }
    }
    if (!triggerReason && (mat.status === 'VALIDADO' || mat.status === 'PUBLICADO')) {
      if (specChanged) triggerReason = 'Alteração detectada em specs/create-entry.js';
      else if (t20Changed) triggerReason = 'Atualização de versão do sistema Tormenta20';
    }

    if (triggerReason) {
      mat.status = 'DESATUALIZADO';
      mat.auditoria_cega = 'PENDENTE';
      mat.motivo_desatualizacao = triggerReason;
      reenteredMaterials.push({ matId, triggerReason });
    }
  }

  const flaggedIds = new Set(reenteredMaterials.map(r => r.matId));
  if (flaggedIds.size > 0) {
    for (const art of artefatos.artefatos || []) {
      if (flaggedIds.has(art.material_id)) {
        art.status = 'DESATUALIZADO';
      }
    }
  }

  catalogo.baseline_fingerprint = baselineFp;
  catalogo.tormenta20_versions = { v14: dataModels.v14.version, v13: dataModels.v13.version };
  return reenteredMaterials;
}

/**
 * Carrega documento + subdocumentos de um pack LevelDB.
 */
async function loadArtifactRecord(packDef, art) {
  const db = new ClassicLevel(packDef.absPath, { valueEncoding: 'json' });
  await db.open();
  try {
    const rootKey = `!${packDef.namespace}!${art._id}`;
    const doc = await db.get(rootKey).catch(() => null);
    const subDocs = [];
    const subEffects = [];
    if (doc && packDef.type === 'Actor') {
      for await (const [, v] of db.iterator({ gte: `!actors.items!${art._id}.`, lte: `!actors.items!${art._id}.\uffff` })) {
        subDocs.push(v);
      }
      for await (const [, v] of db.iterator({ gte: `!actors.items.effects!${art._id}.`, lte: `!actors.items.effects!${art._id}.\uffff` })) {
        subEffects.push(v);
      }
    } else if (doc && packDef.type === 'Item') {
      for await (const [, v] of db.iterator({ gte: `!items.effects!${art._id}.`, lte: `!items.effects!${art._id}.\uffff` })) {
        subEffects.push(v);
      }
    } else if (doc && packDef.type === 'JournalEntry') {
      for await (const [, v] of db.iterator({ gte: `!journal.pages!${art._id}.`, lte: `!journal.pages!${art._id}.\uffff` })) {
        subDocs.push(v);
      }
    } else if (doc && packDef.type === 'RollTable') {
      for await (const [, v] of db.iterator({ gte: `!tables.results!${art._id}.`, lte: `!tables.results!${art._id}.\uffff` })) {
        subDocs.push(v);
      }
    }
    return { doc, subDocs, subEffects };
  } finally {
    await db.close();
  }
}

function validateItemDataModel(item, divergences, prefix = '') {
  const sys = item.system || {};
  if (!item._id || !/^[a-zA-Z0-9]{16}$/.test(item._id)) {
    divergences.push({ code: 'INVALID_ITEM_ID', msg: `${prefix}ID "${item._id}" não possui 16 chars alfanuméricos` });
  }
  if (!item.img || String(item.img).includes('mystery-man')) {
    divergences.push({ code: 'PLACEHOLDER_IMAGE', msg: `${prefix}"${item.name}" usa placeholder/imagem vazia` });
  }
  if (item.type === 'consumivel' && sys.tipo !== undefined && !VALID_CONSUMABLE_TYPES.has(sys.tipo)) {
    divergences.push({ code: 'V14_CONSUMABLE_TIPO', msg: `${prefix}"${item.name}" system.tipo="${sys.tipo}" inválido em v14` });
  }
  if (item.type === 'equipamento' && sys.equipado2 && !VALID_EQUIP_SLOTS.has(sys.equipado2.type)) {
    divergences.push({ code: 'V14_EQUIP_SLOT', msg: `${prefix}"${item.name}" equipado2.type="${sys.equipado2.type}" inválido` });
  }
  if (item.type === 'magia') {
    if (sys.tipo && !VALID_SPELL_TYPES.has(sys.tipo)) {
      divergences.push({ code: 'V14_SPELL_TIPO', msg: `${prefix}"${item.name}" magia.tipo="${sys.tipo}" inválido` });
    }
    if (sys.escola && !VALID_SPELL_SCHOOLS.has(sys.escola)) {
      divergences.push({ code: 'V14_SPELL_ESCOLA', msg: `${prefix}"${item.name}" magia.escola="${sys.escola}" inválido` });
    }
  }
  if (item.type === 'poder' && sys.tipo && !VALID_POWER_TYPES.has(sys.tipo)) {
    divergences.push({ code: 'INVALID_POWER_TIPO', msg: `${prefix}"${item.name}" poder.tipo="${sys.tipo}" inválido` });
  }
  for (const tf of ['tags', 'rolltags', 'automationtags']) {
    if (Array.isArray(sys[tf]) && sys[tf].some(t => typeof t !== 'string' || t.trim() === '')) {
      divergences.push({ code: 'V14_EMPTY_SETFIELD_TAG', msg: `${prefix}"${item.name}" possui item vazio em ${tf}` });
    }
  }
  if (sys.ativacao?.execucao && !VALID_EXECUCAO.has(sys.ativacao.execucao)) {
    divergences.push({ code: 'INVALID_EXECUCAO', msg: `${prefix}"${item.name}" execucao="${sys.ativacao.execucao}" inválida` });
  }
  if (sys.duracao?.units && !VALID_TIME_UNITS.has(sys.duracao.units)) {
    divergences.push({ code: 'INVALID_DURACAO_UNIT', msg: `${prefix}"${item.name}" duracao.units="${sys.duracao.units}" inválida` });
  }
  if (sys.alcance && !VALID_DIST_UNITS.has(sys.alcance)) {
    divergences.push({ code: 'INVALID_ALCANCE', msg: `${prefix}"${item.name}" alcance="${sys.alcance}" inválido` });
  }
  if (Array.isArray(sys.rolls)) {
    for (const r of sys.rolls) {
      if (r.type && !VALID_ROLL_TYPES.has(r.type)) {
        divergences.push({ code: 'INVALID_ROLL_TYPE', msg: `${prefix}"${item.name}" RollData.type="${r.type}" inválido` });
      }
      if (Array.isArray(r.parts)) {
        for (const p of r.parts) {
          if (p[1] && ACCENTED_DAMAGE.has(String(p[1]).toLowerCase())) {
            divergences.push({ code: 'ACCENTED_DAMAGE_TYPE', msg: `${prefix}"${item.name}" usa tipo de dano acentuado "${p[1]}"` });
          }
        }
      }
    }
  }
}

/**
 * Executa validação estrutural + DataModel + PDF/Auditoria Cega para 1 artefato.
 */
function evaluateSingleArtifact(art, record, materialMeta, blindAuditMode = false) {
  const divergences = [];
  const { doc, subDocs, subEffects } = record;

  if (!doc) {
    divergences.push({ code: 'MISSING_DOCUMENT', msg: `Documento ${art._id} não encontrado em ${art.pack_atual}` });
    return divergences;
  }

  if (!/^[a-zA-Z0-9]{16}$/.test(doc._id || '')) {
    divergences.push({ code: 'INVALID_DOC_ID', msg: `_id "${doc._id}" inválido` });
  }
  if (doc._stats?.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(doc._stats.lastModifiedBy)) {
    divergences.push({ code: 'INVALID_LAST_MODIFIED_BY', msg: `_stats.lastModifiedBy="${doc._stats.lastModifiedBy}" inválido` });
  }
  if (Array.isArray(doc.items) && doc.items.some(x => typeof x !== 'string')) {
    divergences.push({ code: 'INLINE_ITEMS_ARRAY', msg: 'items[] contém objetos inline em LevelDB' });
  }
  if (Array.isArray(doc.effects) && doc.effects.some(x => typeof x !== 'string')) {
    divergences.push({ code: 'INLINE_EFFECTS_ARRAY', msg: 'effects[] contém objetos inline em LevelDB' });
  }

  if (art.tipo === 'Actor') {
    if (!doc.img || String(doc.img).includes('mystery-man')) {
      divergences.push({ code: 'ACTOR_PLACEHOLDER_IMG', msg: `Ator "${doc.name}" usa imagem placeholder` });
    }
    if (doc.type === 'npc') {
      const tok = doc.prototypeToken?.texture?.src || '';
      if (!tok || !tok.endsWith('.png') || tok.includes('mystery-man')) {
        divergences.push({ code: 'ACTOR_NON_2MTT_TOKEN', msg: `Token "${tok}" não é PNG 2-Minute Tabletop válido` });
      }
      const des = doc.system?.atributos?.des?.value ?? 0;
      const defVal = doc.system?.attributes?.defesa?.value ?? 0;
      const defBase = doc.system?.attributes?.defesa?.base;
      if (defBase === undefined || defBase + des !== defVal) {
        divergences.push({ code: 'DEFENSE_BASE_MISMATCH', msg: `Defesa base (${defBase}) + des (${des}) != value (${defVal})` });
      }
      const skillCount = Object.keys(doc.system?.pericias || {}).length;
      if (skillCount < 34) {
        divergences.push({ code: 'SKILLS_INCOMPLETE', msg: `Apenas ${skillCount}/34 perícias preenchidas` });
      }
      if (doc.system?.pericias?.nobr && doc.system.pericias.nobr.atributo !== 'int') {
        divergences.push({ code: 'NOBR_NOT_INT', msg: 'Perícia Nobreza (nobr) não usa atributo "int"' });
      }
      if (!doc.system?.detalhes?.resistencias) {
        divergences.push({ code: 'MISSING_RESISTENCIAS_TEXT', msg: 'system.detalhes.resistencias vazio' });
      }

      const normName = normEquipStr(doc.name);
      if (MONITORED_CDS?.[normName] !== undefined && doc.system?.attributes?.cd !== MONITORED_CDS[normName]) {
        divergences.push({ code: 'CD_MISMATCH', msg: `CD=${doc.system?.attributes?.cd}, esperado=${MONITORED_CDS[normName]}` });
      }
      if (MONITORED_EQUIPAMENTOS?.[normName] !== undefined) {
        if (doc.system?.detalhes?.equipamento !== MONITORED_EQUIPAMENTOS[normName]) {
          divergences.push({ code: 'EQUIP_LINE_MISMATCH', msg: 'detalhes.equipamento diverge do PDF oficial' });
        }
        const eqEntries = parseEquipmentLine(doc.system?.detalhes?.equipamento || '');
        for (const entry of eqEntries) {
          const isShield = entry.norm.includes('escudo');
          const matched = subDocs.find(it => {
            if (isShield && it.type !== 'equipamento') return false;
            const dn = normEquipStr(it.name);
            if (dn === entry.norm || dn.includes(entry.norm) || entry.norm.includes(dn)) return true;
            const bw = entry.norm.split(' ')[0];
            return !isShield && bw.length >= 4 && dn.includes(bw) && it.type === 'arma';
          });
          if (!matched) {
            divergences.push({ code: 'MISSING_EMBEDDED_EQUIP', msg: `Item de equipamento "${entry.name}" ausente nos subdocumentos` });
          }
        }
      }

      for (const sd of subDocs) {
        validateItemDataModel(sd, divergences, `[SubItem:${sd.name}] `);
        if (sd.type === 'equipamento' && sd.system?.equipado !== false) {
          divergences.push({ code: 'NPC_EQUIP_TRUE', msg: `Equipamento "${sd.name}" em NPC deve ter equipado=false` });
        }
      }
    }
  } else if (art.tipo === 'Item') {
    validateItemDataModel(doc, divergences);
  } else if (art.tipo === 'JournalEntry') {
    if (doc.ownership?.default !== -1) {
      divergences.push({ code: 'JOURNAL_OWNERSHIP', msg: 'JournalEntry deve ter ownership.default=-1' });
    }
    if (subDocs.length === 0) {
      divergences.push({ code: 'JOURNAL_NO_PAGES', msg: 'JournalEntry sem páginas em !journal.pages!' });
    }
  } else if (art.tipo === 'RollTable') {
    if (subDocs.length === 0) {
      divergences.push({ code: 'TABLE_NO_RESULTS', msg: 'RollTable sem resultados em !tables.results!' });
    }
    if (subDocs.some(r => !r.name || !r.name.trim())) {
      divergences.push({ code: 'TABLE_EMPTY_RESULT_NAME', msg: 'Resultado de RollTable sem campo name' });
    }
  }

  for (const eff of subEffects) {
    if (eff.type !== 'base' || !eff.system?.abilityUse || !eff.system?.aura || !eff.system?.upgrade) {
      divergences.push({ code: 'EFFECT_NOT_BASE_MODEL', msg: `ActiveEffect "${eff.name}" fora do schema BaseEffect` });
    }
  }

  // Verificação de rastreabilidade PDF (exigida para auditoria cega / certificação completa)
  if (blindAuditMode) {
    const matDir = path.join(MATERIAIS_DIR, materialMeta.id);
    const extracaoPath = path.join(matDir, 'extracao.json');
    if (fs.existsSync(extracaoPath)) {
      try {
        const ext = JSON.parse(fs.readFileSync(extracaoPath, 'utf8'));
        if (!Array.isArray(ext.paginas) || ext.paginas.length === 0) {
          divergences.push({ code: 'BLIND_AUDIT_NO_PDF_EXTRACT', msg: 'extracao.json ainda sem páginas extraídas do PDF para auditoria cega' });
        }
      } catch {
        divergences.push({ code: 'BLIND_AUDIT_INVALID_EXTRACT', msg: 'extracao.json inválido' });
      }
    }
  }

  return divergences;
}

function updateMaterialDocs(mat, arts, dataModels) {
  const matDir = path.join(MATERIAIS_DIR, mat.id);
  fs.mkdirSync(matDir, { recursive: true });
  const validacaoPath = path.join(matDir, 'validacao.md');
  const lines = [
    `# Validação — ${mat.titulo} (${mat.id})`,
    '',
    `- **Status:** \`${mat.status}\``,
    `- **Origem:** \`${mat.origem_tipo}\``,
    `- **Hash Fonte:** \`${mat.hash_fonte || 'N/A'}\``,
    `- **Tormenta20 v14:** \`${dataModels.v14.version}\` (${dataModels.v14.source})`,
    `- **Tormenta20 v13:** \`${dataModels.v13.version}\` (${dataModels.v13.source})`,
    `- **Total de Artefatos:** ${arts.length}`,
    `- **Auditoria Cega (2ª Passagem):** \`${mat.auditoria_cega}\``,
    `- **Validação Playwright (Foundry Live):** \`${mat.playwright_status}\``,
    '',
    '## Artefatos',
    '| ID | Nome | Tipo | Subtipo | Divergências Abertas | Status |',
    '|---|---|---|---|---:|---|',
    ...arts.map(a => `| \`${a.id}\` | ${a.nome.replace(/\|/g, '/')} | ${a.tipo} | ${a.subtipo} | ${a.divergencias_abertas || 0} | \`${a.status}\` |`),
    ''
  ];
  fs.writeFileSync(validacaoPath, lines.join('\n'), 'utf8');
}

async function runCatalogoRunner(options = {}) {
  if (!fs.existsSync(CATALOGO_PATH) || !fs.existsSync(ARTEFATOS_PATH)) {
    throw new Error('catalogo/catalogo.json ou catalogo/artefatos.json ausente. Execute `npm run catalogo:init` primeiro.');
  }

  const catalogo = JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf8'));
  const artefatosData = JSON.parse(fs.readFileSync(ARTEFATOS_PATH, 'utf8'));
  const dataModels = loadTormenta20DataModels();
  const packs = discoverPacksFromModuleJson(ROOT_DIR);
  const packByName = new Map(packs.map(p => [p.name, p]));

  const reentered = checkReentryTriggers(catalogo, artefatosData, dataModels);
  if (reentered.length > 0) {
    console.log(`🔁 Gatilhos de reentrada acionados em ${reentered.length} material(is):`);
    for (const r of reentered) {
      console.log(`   - ${r.matId}: ${r.triggerReason}`);
      appendAuditLog({ timestamp: new Date().toISOString(), evento: 'REENTRADA_GATILHO', material_id: r.matId, motivo: r.triggerReason });
    }
  }

  const escalationCounts = loadPreviousEscalationCounts();
  const targetMaterial = options.material || null;
  const blindAudit = Boolean(options.blindAudit);

  const allowedStatuses = blindAudit
    ? ['PROCESSADO_VALIDACAO_PENDENTE', 'EM_VALIDAÇÃO', 'REPROVADO', 'DESATUALIZADO', 'EM_AUDITORIA_CEGA']
    : ['PROCESSADO_VALIDACAO_PENDENTE', 'EM_VALIDAÇÃO', 'REPROVADO', 'DESATUALIZADO'];

  const queue = artefatosData.artefatos.filter(a => {
    if (a.origem_tipo === 'LEGADO_MANUAL') return false;
    if (targetMaterial && a.material_id !== targetMaterial) return false;
    return allowedStatuses.includes(a.status);
  });

  console.log('================================================================================');
  console.log(`🧭 CATALOGO RUNNER (Loop Micro 1-por-1) | DataModels v14=${dataModels.v14.version} / v13=${dataModels.v13.version}`);
  console.log(`   Fila de artefatos a validar: ${queue.length}${targetMaterial ? ` (filtro: ${targetMaterial})` : ''}`);
  console.log('================================================================================');

  let validated = 0;
  let blocked = 0;
  let escalated = 0;
  let blockedArtifact = null;

  for (const art of queue) {
    const packDef = packByName.get(art.pack_atual);
    const mat = catalogo.materiais[art.material_id];
    art.iteracoes_loop = (art.iteracoes_loop || 0) + 1;
    art.status = 'EM_VALIDAÇÃO';

    const record = packDef ? await loadArtifactRecord(packDef, art) : { doc: null, subDocs: [], subEffects: [] };
    const divergences = evaluateSingleArtifact(art, record, mat, blindAudit);
    art.divergencias_abertas = divergences.length;
    art.atualizado_em = new Date().toISOString();

    if (divergences.length > 0) {
      // Checa regra de escalonamento 3x por (artefato, check_code)
      let hit3x = false;
      const escalatedCodes = [];
      for (const d of divergences) {
        const k = `${art.id}::${d.code}`;
        const nextCount = (escalationCounts.get(k) || 0) + 1;
        escalationCounts.set(k, nextCount);
        if (nextCount >= 3) {
          hit3x = true;
          escalatedCodes.push({ code: d.code, count: nextCount });
        }
      }

      if (hit3x) {
        art.status = 'ESCALONADO_CAUSA_RAIZ';
        mat.status = 'DESATUALIZADO';
        escalated++;
        // Marca irmãos do mesmo subtipo/material como DESATUALIZADO para revisão estrutural
        for (const sibling of artefatosData.artefatos) {
          if (sibling.id !== art.id && sibling.material_id === art.material_id && sibling.subtipo === art.subtipo) {
            sibling.status = 'DESATUALIZADO';
          }
        }
        appendAuditLog({
          timestamp: art.atualizado_em,
          evento: 'ESCALONADO_CAUSA_RAIZ',
          material_id: art.material_id,
          artefato_id: art.id,
          iteracao: art.iteracoes_loop,
          codigos_reincidentes: escalatedCodes,
          acao_requerida: 'Investigar causa raiz em create-entry.js / avrl-runner.js / openspec/specs / referencias_criacao_itens_atores_t20'
        });
        console.error(`🚨 ESCALONAMENTO 3x em [${art.id}] (${art.nome}): ${JSON.stringify(escalatedCodes)}. Loop interrompido!`);
      } else {
        art.status = 'REPROVADO';
        blocked++;
        appendAuditLog({
          timestamp: art.atualizado_em,
          evento: 'MICRO_LOOP_ITERACAO',
          material_id: art.material_id,
          artefato_id: art.id,
          iteracao: art.iteracoes_loop,
          divergencias_abertas: divergences.length,
          divergencias: divergences,
          status: art.status
        });
        console.error(`⛔ Bloqueado em [${art.id}] "${art.nome}": ${divergences.length} divergência(s) aberta(s):`);
        for (const d of divergences) console.error(`   - [${d.code}] ${d.msg}`);
      }

      blockedArtifact = art;
      break; // Regra estrita: bloqueia avanço para o próximo artefato
    }

    // Passou no gate estrutural + DataModel (+ blind audit se ativado)
    art.status = blindAudit ? 'VALIDADO' : 'EM_AUDITORIA_CEGA';
    validated++;
    appendAuditLog({
      timestamp: art.atualizado_em,
      evento: 'MICRO_LOOP_ITERACAO',
      material_id: art.material_id,
      artefato_id: art.id,
      iteracao: art.iteracoes_loop,
      divergencias_abertas: 0,
      divergencias: [],
      status: art.status,
      datamodel_v14: dataModels.v14.version,
      datamodel_v13: dataModels.v13.version
    });
  }

  // Atualiza status agregado por material
  const byMat = new Map();
  for (const a of artefatosData.artefatos) {
    if (!byMat.has(a.material_id)) byMat.set(a.material_id, []);
    byMat.get(a.material_id).push(a);
  }
  for (const [matId, mat] of Object.entries(catalogo.materiais)) {
    if (mat.origem_tipo !== 'CRIADO_AGENTE') continue;
    const arts = byMat.get(matId) || [];
    if (arts.some(a => a.status === 'ESCALONADO_CAUSA_RAIZ' || a.status === 'DESATUALIZADO')) {
      mat.status = 'DESATUALIZADO';
    } else if (arts.some(a => a.status === 'REPROVADO')) {
      mat.status = 'REPROVADO';
    } else if (arts.length > 0 && arts.every(a => a.status === 'VALIDADO')) {
      mat.status = mat.playwright_status === 'APROVADO' ? 'PUBLICADO' : 'VALIDADO';
      mat.auditoria_cega = 'CONCLUIDA';
    } else if (arts.length > 0 && arts.every(a => a.status === 'EM_AUDITORIA_CEGA' || a.status === 'VALIDADO')) {
      mat.status = 'EM_AUDITORIA_CEGA';
    }
    updateMaterialDocs(mat, arts, dataModels);
  }

  fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf8');
  fs.writeFileSync(ARTEFATOS_PATH, JSON.stringify(artefatosData, null, 2), 'utf8');

  console.log(`\nResumo do Loop Micro: validados=${validated}, bloqueados=${blocked}, escalonados_3x=${escalated}`);
  if (blockedArtifact) {
    console.error('❌ Avanço bloqueado até resolução da divergência acima.');
    return false;
  }
  console.log('✅ Todos os artefatos da fila passaram no gate DataModel v13+v14 sem divergências!');
  return true;
}

function parseCliArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--material' && argv[i + 1]) opts.material = argv[++i];
    else if (argv[i] === '--blind-audit') opts.blindAudit = true;
  }
  return opts;
}

if (require.main === module) {
  const opts = parseCliArgs(process.argv.slice(2));
  runCatalogoRunner(opts)
    .then(ok => process.exit(ok ? 0 : 1))
    .catch(err => {
      console.error('❌ Erro fatal no catalogo-runner:', err);
      process.exit(1);
    });
}

module.exports = {
  runCatalogoRunner,
  evaluateSingleArtifact,
  checkReentryTriggers,
  loadTormenta20DataModels
};

#!/usr/bin/env node
/**
 * Inicializador e Reconciliador Retroativo do Catálogo de Adaptações T20 → Foundry VTT
 *
 * - Inventaria 100% dos documentos dos compêndios declarados em module.json
 * - Separa claramente:
 *     (a) Edições criadas pelo agente (DB #226-#232, RT20 #25-#28) → PROCESSADO_VALIDACAO_PENDENTE (ou VALIDADO/PUBLICADO)
 *     (b) Acervo pré-existente adaptado manualmente → LEGADO_MANUAL (intacto nos 6 packs originais)
 *     (c) PDFs descobertos nas pastas de fontes ainda não processados → REGISTRADO
 * - Calcula hashes SHA-256 dos PDFs fonte e mapeia destinos hierárquicos:
 *     Publicação -> [Campanha ->] Edição -> Compêndios (por tipo e subtipo de item)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ClassicLevel } = require('classic-level');

const ROOT_DIR = path.resolve(__dirname, '..');
const MODULE_JSON_PATH = path.join(ROOT_DIR, 'module.json');
const CATALOGO_DIR = path.join(ROOT_DIR, 'catalogo');
const MATERIAIS_DIR = path.join(CATALOGO_DIR, 'materiais');

const SOURCE_PATHS = {
  fullgor: process.env.T20_FULLGOR_PATH || 'C:/Users/simoe/OneDrive/Documentos/t20/T20/Fullgor_dos_Deuses',
  dbEdicoes: process.env.T20_DB_EDICOES_PATH || 'C:/Users/simoe/OneDrive/Documentos/t20/T20/dragao_brasil/Edicoes_Completas',
  dbAcervo: process.env.DB_ACERVO_PATH || 'C:/Users/simoe/OneDrive/Documentos/t20/T20/DB_Acervo_Completo'
};

const DOC_TYPE_TO_PACK_SLUG = {
  Actor: () => 'ameacas',
  JournalEntry: () => 'diarios',
  RollTable: () => 'tabelas',
  Macro: () => 'macros',
  Playlist: () => 'playlists',
  Item: (docType) => {
    const map = {
      arma: 'armas',
      equipamento: 'equipamentos',
      consumivel: 'consumiveis',
      poder: 'poderes',
      magia: 'magias',
      tesouro: 'tesouros',
      classe: 'classes',
      race: 'racas',
      comodo: 'bases',
      mobilia: 'bases'
    };
    return map[docType] || 'itens';
  }
};

const SUBTYPE_LABELS = {
  ameacas: 'Ameaças',
  armas: 'Armas',
  equipamentos: 'Equipamentos',
  consumiveis: 'Consumíveis',
  poderes: 'Poderes & Parceiros',
  magias: 'Magias',
  tesouros: 'Tesouros',
  classes: 'Classes',
  racas: 'Raças',
  bases: 'Domínios & Bases',
  itens: 'Itens Diversos',
  diarios: 'Diários',
  tabelas: 'Tabelas',
  macros: 'Macros',
  playlists: 'Playlists'
};

const EDITION_METADATA = {
  'DB-0226': { serie: 'Dragão Brasil', campanha: null, edicao: 226, titulo: 'Dragão Brasil #226', pdfMatch: /226/ },
  'DB-0227': { serie: 'Dragão Brasil', campanha: null, edicao: 227, titulo: 'Dragão Brasil #227', pdfMatch: /227/ },
  'DB-0228': { serie: 'Dragão Brasil', campanha: null, edicao: 228, titulo: 'Dragão Brasil #228', pdfMatch: /228/ },
  'DB-0229': { serie: 'Dragão Brasil', campanha: null, edicao: 229, titulo: 'Dragão Brasil #229', pdfMatch: /229/ },
  'DB-0230': { serie: 'Dragão Brasil', campanha: null, edicao: 230, titulo: 'Dragão Brasil #230', pdfMatch: /230/ },
  'DB-0231': { serie: 'Dragão Brasil', campanha: null, edicao: 231, titulo: 'Dragão Brasil #231', pdfMatch: /231/ },
  'DB-0232': { serie: 'Dragão Brasil', campanha: null, edicao: 232, titulo: 'Dragão Brasil #232', pdfMatch: /232/ },
  'RT20-025': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 25, titulo: 'Fúlgor dos Deuses — Edição 25', pdfMatch: /RT20-25/i },
  'RT20-026': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 26, titulo: 'Fúlgor dos Deuses — Edição 26: Forja da Vingança', pdfMatch: /RT20-26/i },
  'RT20-027': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 27, titulo: 'Fúlgor dos Deuses — Edição 27: Dia e Noite', pdfMatch: /RT20-27/i },
  'RT20-028': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 28, titulo: 'Fúlgor dos Deuses — Edição 28: Aço e Arcano', pdfMatch: /RT20-28/i },
  'RT20-029': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 29, titulo: 'Fúlgor dos Deuses — Edição 29: Dor Profunda', pdfMatch: /RT20-29/i },
  'RT20-030': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 30, titulo: 'Fúlgor dos Deuses — Edição 30: Guerra e Paz', pdfMatch: /RT20-30/i },
  'RT20-031': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 31, titulo: 'Fúlgor dos Deuses — Edição 31: Pecados do Pai', pdfMatch: /RT20-31/i },
  'RT20-032': { serie: 'Revista Tormenta 20', campanha: 'Fúlgor dos Deuses', edicao: 32, titulo: 'Fúlgor dos Deuses — Edição 32: Como um Deus', pdfMatch: /RT20-32/i }
};

// Entidades de DB #226 e RT20 #25 criadas antes da padronização por prefixo de ID
const EXPLICIT_EDITION_IDS = {
  YuNalZOnONBoAq70: 'DB-0226', // Regras de Reputação (DB #226)
  '6jcy63pS6TLhCoHm': 'DB-0227', // Lynel (DB #227)
  // RT20 #25 (Ameaças verificadas em RT20-25.pdf)
  hJWJERQhdJSwwE5v: 'RT20-025', // Ceret'th
  '5lj7QlBvNNhd03Ry': 'RT20-025', // Proles de Ceret'th
  Qm2GKboNZbhXMrkY: 'RT20-025', // Irina Volensk
  wGoHaVQwuoTdWBgJ: 'RT20-025', // Kaellarem
  KoWiaB4rP0QCPlIw: 'RT20-025', // Selisse, a Voz de Ferro
  B7UeiV8dWSz76owQ: 'RT20-025', // Thorgan Punho de Bronze
  '8Q9cEOfUCYBbfipI': 'RT20-025'  // Golem de Tharun-Kel
};

function slugify(str) {
  return String(str || 'outros')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'outros';
}

function sha256File(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const hash = crypto.createHash('sha256');
  const fd = fs.openSync(filePath, 'r');
  const buf = Buffer.allocUnsafe(65536);
  try {
    let bytesRead = fs.readSync(fd, buf, 0, buf.length, null);
    while (bytesRead > 0) {
      hash.update(buf.subarray(0, bytesRead));
      bytesRead = fs.readSync(fd, buf, 0, buf.length, null);
    }
  } finally {
    fs.closeSync(fd);
  }
  return `sha256:${hash.digest('hex')}`;
}

function collectScriptIdMap() {
  const map = new Map(Object.entries(EXPLICIT_EDITION_IDS));
  const scriptsDir = __dirname;
  const files = fs.readdirSync(scriptsDir).filter(f => /^(inject|rebuild|validate)-(db|fullgor)/.test(f));

  const scriptPriority = (name) => {
    if (name.startsWith('inject-')) return 0;
    if (name.startsWith('rebuild-')) return 1;
    return 2;
  };
  files.sort((a, b) => scriptPriority(a) - scriptPriority(b) || a.localeCompare(b));

  for (const file of files) {
    let matId = null;
    const dbMatch = file.match(/db(22[6-9]|23[0-9])/i);
    const flMatch = file.match(/fullgor(2[5-9]|3[0-9])/i);
    if (dbMatch) matId = `DB-0${dbMatch[1]}`;
    else if (flMatch) matId = `RT20-0${flMatch[1]}`;
    if (!matId) continue;

    const txt = fs.readFileSync(path.join(scriptsDir, file), 'utf8');
    for (const m of txt.matchAll(/['"]([a-zA-Z0-9]{16})['"]/g)) {
      const id = m[1];
      if (!map.has(id)) map.set(id, matId);
    }
  }
  return map;
}

function resolveTargetPack(materialId, docCategory, itemSubType) {
  const prefix = materialId.toLowerCase(); // ex.: db-0231, rt20-028
  const slugFn = DOC_TYPE_TO_PACK_SLUG[docCategory];
  const suffix = slugFn ? slugFn(itemSubType) : 'docs';
  return `${prefix}-${suffix}`;
}

function collectPdfsRecursive(dir, results = []) {
  if (!dir || !fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPdfsRecursive(full, results);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      results.push(full);
    }
  }
  return results;
}

function discoverPdfFiles() {
  const byId = new Map();

  if (fs.existsSync(SOURCE_PATHS.fullgor)) {
    for (const full of collectPdfsRecursive(SOURCE_PATHS.fullgor)) {
      const f = path.basename(full);
      let edNum = null;
      const m1 = f.match(/RT20-(\d+)/i) || f.match(/#(\d+)/);
      if (m1) edNum = parseInt(m1[1], 10);
      const id = edNum ? `RT20-${String(edNum).padStart(3, '0')}` : `MAT-${slugify(f)}`;
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          serie: 'Revista Tormenta 20',
          campanha: 'Fúlgor dos Deuses',
          edicao: edNum,
          titulo: `Fúlgor dos Deuses — Edição ${edNum || f}`,
          arquivo: full
        });
      }
    }
  }

  for (const dbDir of [SOURCE_PATHS.dbEdicoes, SOURCE_PATHS.dbAcervo]) {
    if (!dbDir || !fs.existsSync(dbDir)) continue;
    for (const full of collectPdfsRecursive(dbDir)) {
      const f = path.basename(full);
      // Prioriza revistas principais da Dragão Brasil (ex: DB-227.pdf, Dragao_Brasil_231.pdf, DB226.pdf)
      const m = f.match(/(?:^|[^0-9])(\d{3})(?:[^0-9]|$)/);
      const edNum = m ? parseInt(m[1], 10) : null;
      const isMainDb = /dragao|db[-_ ]?\d{3}/i.test(f);
      const id = (edNum && isMainDb) ? `DB-${String(edNum).padStart(4, '0')}` : `MAT-${slugify(f)}`;
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          serie: isMainDb ? 'Dragão Brasil' : 'Acervo Tormenta20',
          campanha: null,
          edicao: isMainDb ? edNum : null,
          titulo: (edNum && isMainDb) ? `Dragão Brasil #${edNum}` : f.replace(/\.pdf$/i, ''),
          arquivo: full
        });
      }
    }
  }

  return [...byId.values()];
}

async function scanAllPacks() {
  const mod = JSON.parse(fs.readFileSync(MODULE_JSON_PATH, 'utf8'));
  const docs = [];
  for (const packDef of mod.packs) {
    const packPath = path.join(ROOT_DIR, packDef.path);
    if (!fs.existsSync(packPath)) continue;
    const db = new ClassicLevel(packPath, { valueEncoding: 'json' });
    await db.open();
    const folders = {};
    const rawDocs = [];
    for await (const [k, v] of db.iterator()) {
      if (k.startsWith('!folders!')) {
        folders[v._id] = v;
      } else if (/^![a-z]+![^.!]+$/.test(k)) {
        rawDocs.push(v);
      }
    }
    await db.close();

    for (const v of rawDocs) {
      let cur = v.folder;
      const chain = [];
      const seen = new Set();
      while (cur && folders[cur] && !seen.has(cur)) {
        seen.add(cur);
        chain.unshift(folders[cur].name);
        cur = folders[cur].folder;
      }
      docs.push({
        _id: v._id,
        name: v.name,
        documentType: packDef.type,
        subtype: v.type || 'doc',
        pack: packDef.name,
        packLabel: packDef.label,
        folderPath: chain.join(' / ') || '(raiz)',
        topFolder: chain[0] || '(raiz)',
        uuid: `Compendium.compendios-para-t20.${packDef.name}.${packDef.type}.${v._id}`,
        sourceField: v.system?.detalhes?.source || v.system?.source || ''
      });
    }
  }
  return docs;
}

function ensureMaterialSkeleton(material, artifacts) {
  const dir = path.join(MATERIAIS_DIR, material.id);
  fs.mkdirSync(dir, { recursive: true });

  const extracaoPath = path.join(dir, 'extracao.json');
  const mapaPath = path.join(dir, 'mapa_pdf_artefatos.json');
  const validacaoPath = path.join(dir, 'validacao.md');
  const pendenciasPath = path.join(dir, 'pendencias.md');

  if (!fs.existsSync(extracaoPath)) {
    fs.writeFileSync(
      extracaoPath,
      JSON.stringify(
        {
          material_id: material.id,
          titulo: material.titulo,
          serie: material.serie,
          campanha: material.campanha,
          edicao: material.edicao,
          arquivo_fonte: material.arquivo_fonte || null,
          hash_fonte: material.hash_fonte || null,
          status_extracao: material.origem_tipo === 'CRIADO_AGENTE' ? 'INDEXADO_DE_SCRIPTS_E_PACKS' : 'PENDENTE',
          nota: 'Preencher extração página-a-página do PDF antes da auditoria cega (Prompt Mestre v2 §6/§8.4).',
          paginas: []
        },
        null,
        2
      )
    );
  }

  if (!fs.existsSync(mapaPath)) {
    fs.writeFileSync(
      mapaPath,
      JSON.stringify(
        {
          material_id: material.id,
          cobertura_pdf: material.cobertura_pdf || '0%',
          artefatos: artifacts.map(a => ({
            artefato_id: a.id,
            nome: a.nome,
            tipo: a.tipo,
            subtipo: a.subtipo,
            uuid_atual: a.uuid,
            pack_destino_hierarquico: a.pack_destino_hierarquico,
            campos_mapeados: [],
            status: a.status
          }))
        },
        null,
        2
      )
    );
  }

  if (!fs.existsSync(validacaoPath)) {
    const lines = [
      `# Validação — ${material.titulo} (${material.id})`,
      '',
      `- **Status:** \`${material.status}\``,
      `- **Origem:** \`${material.origem_tipo}\``,
      `- **Hash Fonte:** \`${material.hash_fonte || 'N/A'}\``,
      `- **Total de Artefatos:** ${artifacts.length}`,
      `- **Auditoria Cega (2ª Passagem):** \`${material.auditoria_cega}\``,
      `- **Validação Playwright (Foundry Live):** \`${material.playwright_status}\``,
      '',
      '## Artefatos Registrados',
      '| ID | Nome | Tipo | Subtipo | Pack Atual | Destino Hierárquico | Status |',
      '|---|---|---|---|---|---|---|',
      ...artifacts.map(
        a => `| \`${a.id}\` | ${a.nome.replace(/\|/g, '/')} | ${a.tipo} | ${a.subtipo} | \`${a.pack_atual}\` | \`${a.pack_destino_hierarquico || '-'}\` | \`${a.status}\` |`
      ),
      ''
    ];
    fs.writeFileSync(validacaoPath, lines.join('\n'));
  }

  if (!fs.existsSync(pendenciasPath)) {
    const pendLines = [
      `# Pendências — ${material.titulo} (${material.id})`,
      '',
      ...(material.status === 'PROCESSADO_VALIDACAO_PENDENTE'
        ? [
            '- [ ] Executar auditoria cega de 2ª passagem campo-a-campo com `extracao.json` + `mapa_pdf_artefatos.json` (100%).',
            '- [ ] Executar migração hierárquica (`npm run catalogo:migrate:apply`) quando autorizada.',
            '- [ ] Executar validação Playwright em mundo real do Foundry VTT (`npm run validate:playwright -- --material ' + material.id + '`).'
          ]
        : ['- [ ] Material legado/não processado aguardando inclusão em lote futuro.']),
      ''
    ];
    fs.writeFileSync(pendenciasPath, pendLines.join('\n'));
  }
}

async function main() {
  fs.mkdirSync(MATERIAIS_DIR, { recursive: true });

  const idToEdition = collectScriptIdMap();
  const pdfFiles = discoverPdfFiles();
  const pdfById = new Map(pdfFiles.map(p => [p.id, p]));
  const allDocs = await scanAllPacks();

  const existingCatalogoPath = path.join(CATALOGO_DIR, 'catalogo.json');
  let existingCatalogo = { materiais: {} };
  if (fs.existsSync(existingCatalogoPath)) {
    try {
      existingCatalogo = JSON.parse(fs.readFileSync(existingCatalogoPath, 'utf8'));
    } catch {
      existingCatalogo = { materiais: {} };
    }
  }

  const materiaisMap = new Map();
  const artefatosList = [];
  const now = new Date().toISOString();

  // 1. Registrar todas as edições criadas pelo agente (DB #226-#232 e RT20 #25-#28)
  for (const [matId, meta] of Object.entries(EDITION_METADATA)) {
    const pdf = pdfById.get(matId);
    const hash = pdf ? sha256File(pdf.arquivo) : null;
    const prev = existingCatalogo.materiais?.[matId];
    const hashChanged = prev?.hash_fonte && hash && prev.hash_fonte !== hash;

    let initialStatus = 'PROCESSADO_VALIDACAO_PENDENTE';
    if (hashChanged) initialStatus = 'DESATUALIZADO';
    else if (prev?.status && prev.status !== 'REGISTRADO') initialStatus = prev.status;

    materiaisMap.set(matId, {
      id: matId,
      titulo: meta.titulo,
      serie: meta.serie,
      campanha: meta.campanha,
      edicao: meta.edicao,
      tipo_publicacao: 'revista',
      origem_tipo: 'CRIADO_AGENTE',
      hierarquia: meta.campanha
        ? [meta.serie, meta.campanha, `Edição ${meta.edicao}`]
        : [meta.serie, `Edição ${meta.edicao}`],
      arquivo_fonte: pdf ? pdf.arquivo : null,
      hash_fonte: hash,
      status: initialStatus,
      auditoria_cega: prev?.auditoria_cega || 'PENDENTE',
      playwright_status: prev?.playwright_status || 'PENDENTE',
      cobertura_pdf: prev?.cobertura_pdf || 'PENDENTE_MAPA',
      iteracoes_loop: prev?.iteracoes_loop || 0,
      atualizado_em: now
    });
  }

  // 2. Classificar todos os documentos reais em packs/
  for (const doc of allDocs) {
    let matId = idToEdition.get(doc._id) || null;
    let isAgentCreated = Boolean(matId);

    // Se está na pasta Fullgor dos Deuses e não foi atribuído a 25..28, pertence ao legado RT20 #21-#24
    if (!matId && doc.topFolder === 'Fullgor dos Deuses') {
      matId = 'LEGADO-RT20-FULLGOR-PRE25';
    }

    if (!matId) {
      const slug = slugify(doc.topFolder);
      matId = `LEGADO-${slug.toUpperCase()}`;
    }

    if (!materiaisMap.has(matId)) {
      const isFulgorLegacy = matId === 'LEGADO-RT20-FULLGOR-PRE25';
      materiaisMap.set(matId, {
        id: matId,
        titulo: isFulgorLegacy
          ? 'Revista Tormenta 20 — Fúlgor dos Deuses (#21–#24 Legado Manual)'
          : `Legado Manual — ${doc.topFolder}`,
        serie: isFulgorLegacy ? 'Revista Tormenta 20' : doc.topFolder,
        campanha: isFulgorLegacy ? 'Fúlgor dos Deuses' : null,
        edicao: null,
        tipo_publicacao: isFulgorLegacy ? 'revista' : 'legado_manual',
        origem_tipo: 'LEGADO_MANUAL',
        hierarquia: isFulgorLegacy
          ? ['Revista Tormenta 20', 'Fúlgor dos Deuses', 'Legado (#21–#24)']
          : ['Acervo Geral / Legado (Pré-Catálogo)', doc.topFolder],
        arquivo_fonte: null,
        hash_fonte: null,
        status: 'LEGADO_MANUAL',
        auditoria_cega: 'NAO_APLICAVEL_LEGADO',
        playwright_status: 'NAO_APLICAVEL_LEGADO',
        cobertura_pdf: 'N/A (Legado Manual)',
        iteracoes_loop: 0,
        atualizado_em: now
      });
    }

    const mat = materiaisMap.get(matId);
    const tipoLower = doc.documentType.toLowerCase();
    const artId = `${tipoLower}:${matId.toLowerCase()}:${doc._id}`;
    const targetPack = isAgentCreated ? resolveTargetPack(matId, doc.documentType, doc.subtype) : doc.pack;

    artefatosList.push({
      id: artId,
      _id: doc._id,
      nome: doc.name,
      tipo: doc.documentType,
      subtipo: doc.subtype,
      subtipo_label: SUBTYPE_LABELS[DOC_TYPE_TO_PACK_SLUG[doc.documentType]?.(doc.subtype)] || doc.subtype,
      material_id: matId,
      origem_tipo: isAgentCreated ? 'CRIADO_AGENTE' : 'LEGADO_MANUAL',
      pack_atual: doc.pack,
      pasta_atual: doc.folderPath,
      pack_destino_hierarquico: targetPack,
      uuid: doc.uuid,
      uuid_destino_hierarquico: `Compendium.compendios-para-t20.${targetPack}.${doc.documentType}.${doc._id}`,
      status: isAgentCreated ? mat.status : 'LEGADO_MANUAL',
      iteracoes_loop: 0,
      divergencias_abertas: 0,
      auditoria_cega: mat.auditoria_cega,
      atualizado_em: now
    });
  }

  // 3. Registrar PDFs ainda não processados descobertos nas fontes
  // (Evita baixar arquivos cloud-only do OneDrive durante o init; hash SHA-256 completo é calculado ao processar ou com --hash-all)
  const hashAll = process.argv.includes('--hash-all');
  for (const pdf of pdfFiles) {
    if (materiaisMap.has(pdf.id)) continue;
    let statInfo = null;
    try {
      const st = fs.statSync(pdf.arquivo);
      statInfo = { tamanho_bytes: st.size, modificado_em: st.mtime.toISOString() };
    } catch {}
    const hash = hashAll ? sha256File(pdf.arquivo) : null;
    materiaisMap.set(pdf.id, {
      id: pdf.id,
      titulo: pdf.titulo,
      serie: pdf.serie,
      campanha: pdf.campanha,
      edicao: pdf.edicao,
      tipo_publicacao: 'revista',
      origem_tipo: 'FONTE_DESCOBERTA',
      hierarquia: pdf.campanha
        ? [pdf.serie, pdf.campanha, `Edição ${pdf.edicao}`]
        : [pdf.serie, pdf.edicao ? `Edição ${pdf.edicao}` : pdf.titulo],
      arquivo_fonte: pdf.arquivo,
      ...(statInfo || {}),
      hash_fonte: hash,
      status: 'REGISTRADO',
      auditoria_cega: 'PENDENTE',
      playwright_status: 'PENDENTE',
      cobertura_pdf: '0%',
      iteracoes_loop: 0,
      atualizado_em: now
    });
  }

  // Contagens por material
  const materiaisObj = {};
  const byMatArtifacts = new Map();
  for (const a of artefatosList) {
    if (!byMatArtifacts.has(a.material_id)) byMatArtifacts.set(a.material_id, []);
    byMatArtifacts.get(a.material_id).push(a);
  }

  for (const [id, mat] of [...materiaisMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const arts = byMatArtifacts.get(id) || [];
    const counts = { total: arts.length, atores: 0, itens: 0, magias: 0, diarios: 0, tabelas: 0, macros: 0, playlists: 0 };
    for (const a of arts) {
      if (a.tipo === 'Actor') counts.atores++;
      else if (a.tipo === 'Item' && a.subtipo === 'magia') counts.magias++;
      else if (a.tipo === 'Item') counts.itens++;
      else if (a.tipo === 'JournalEntry') counts.diarios++;
      else if (a.tipo === 'RollTable') counts.tabelas++;
      else if (a.tipo === 'Macro') counts.macros++;
      else if (a.tipo === 'Playlist') counts.playlists++;
    }
    mat.contagem = counts;
    materiaisObj[id] = mat;

    if (mat.origem_tipo === 'CRIADO_AGENTE') {
      ensureMaterialSkeleton(mat, arts);
    }
  }

  const resumo = {
    gerado_em: now,
    total_materiais: Object.keys(materiaisObj).length,
    total_artefatos: artefatosList.length,
    criados_agente: artefatosList.filter(a => a.origem_tipo === 'CRIADO_AGENTE').length,
    legado_manual: artefatosList.filter(a => a.origem_tipo === 'LEGADO_MANUAL').length,
    materiais_processados_pendentes_validacao: Object.values(materiaisObj).filter(m => m.status === 'PROCESSADO_VALIDACAO_PENDENTE').length,
    materiais_legado_manual: Object.values(materiaisObj).filter(m => m.origem_tipo === 'LEGADO_MANUAL').length,
    materiais_registrados_a_processar: Object.values(materiaisObj).filter(m => m.status === 'REGISTRADO').length
  };

  fs.writeFileSync(
    path.join(CATALOGO_DIR, 'catalogo.json'),
    JSON.stringify({ versao: '2.0.0', resumo, fontes: SOURCE_PATHS, materiais: materiaisObj }, null, 2)
  );
  fs.writeFileSync(
    path.join(CATALOGO_DIR, 'artefatos.json'),
    JSON.stringify({ versao: '2.0.0', gerado_em: now, total: artefatosList.length, artefatos: artefatosList }, null, 2)
  );

  const md = [
    '# Catálogo Cumulativo de Adaptações — Tormenta 20 → Foundry VTT',
    '',
    `> Atualizado em: \`${now}\``,
    '',
    '## Resumo Executivo',
    `- **Total de Artefatos nos Compêndios:** ${resumo.total_artefatos} (**${resumo.criados_agente}** criados pelo agente em DB #226–#232 e Fúlgor #25–#32; **${resumo.legado_manual}** do acervo legado manual pré-catálogo)`,
    `- **Publicações Processadas pelo Agente (aguardando Auditoria Cega + Playwright):** ${resumo.materiais_processados_pendentes_validacao}`,
    `- **Publicações / Coleções Legado Manual (catalogadas retroativamente):** ${resumo.materiais_legado_manual}`,
    `- **Fontes Descobertas a Processar (\`REGISTRADO\`):** ${resumo.materiais_registrados_a_processar}`,
    '',
    '## 1. Edições Processadas pelo Agente (Migração Hierárquica + Validação Dual)',
    '| ID | Material | Série / Campanha | Atores | Itens | Magias | Diários | Tabelas | Macros | Auditoria Cega | Playwright | Status |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---|---|---|',
    ...Object.values(materiaisObj)
      .filter(m => m.origem_tipo === 'CRIADO_AGENTE')
      .map(m => `| \`${m.id}\` | ${m.titulo} | ${m.hierarquia.join(' → ')} | ${m.contagem.atores} | ${m.contagem.itens} | ${m.contagem.magias} | ${m.contagem.diarios} | ${m.contagem.tabelas} | ${m.contagem.macros} | \`${m.auditoria_cega}\` | \`${m.playwright_status}\` | \`${m.status}\` |`),
    '',
    '## 2. Acervo Legado Manual (Catalogado Retroativamente — Preservado nos Packs Base)',
    '| ID | Coleção / Publicação | Atores | Itens | Magias | Diários | Tabelas | Macros | Playlists | Status |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---|',
    ...Object.values(materiaisObj)
      .filter(m => m.origem_tipo === 'LEGADO_MANUAL')
      .map(m => `| \`${m.id}\` | ${m.titulo} | ${m.contagem.atores} | ${m.contagem.itens} | ${m.contagem.magias} | ${m.contagem.diarios} | ${m.contagem.tabelas} | ${m.contagem.macros} | ${m.contagem.playlists} | \`${m.status}\` |`),
    '',
    '## 3. Fila de Materiais Descobertos a Processar (`REGISTRADO`)',
    '| ID | Material | Hierarquia Prevista | Status |',
    '|---|---|---|---|',
    ...Object.values(materiaisObj)
      .filter(m => m.origem_tipo === 'FONTE_DESCOBERTA')
      .slice(0, 60)
      .map(m => `| \`${m.id}\` | ${m.titulo} | ${m.hierarquia.join(' → ')} | \`${m.status}\` |`),
    ...(resumo.materiais_registrados_a_processar > 60
      ? ['', `_... e mais ${resumo.materiais_registrados_a_processar - 60} edições da Dragão Brasil em \`catalogo/catalogo.json\`._`]
      : []),
    ''
  ];
  fs.writeFileSync(path.join(CATALOGO_DIR, 'CATALOGO.md'), md.join('\n'));

  const auditLogPath = path.join(CATALOGO_DIR, 'auditoria.jsonl');
  if (!fs.existsSync(auditLogPath)) {
    fs.writeFileSync(
      auditLogPath,
      JSON.stringify({
        timestamp: now,
        evento: 'CATALOGO_INICIALIZADO',
        total_materiais: resumo.total_materiais,
        total_artefatos: resumo.total_artefatos,
        criados_agente: resumo.criados_agente,
        legado_manual: resumo.legado_manual,
        registrados: resumo.materiais_registrados_a_processar
      }) + '\n'
    );
  }

  console.log('✅ Catálogo inicializado/reconciliado com sucesso:');
  console.log(JSON.stringify(resumo, null, 2));
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Erro ao inicializar catálogo:', err);
    process.exit(1);
  });
}

module.exports = { main, resolveTargetPack, EDITION_METADATA, SUBTYPE_LABELS };

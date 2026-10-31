#!/usr/bin/env node
const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');

const PACKS = [
  { name: 'Ameacas_T20', type: 'Actor' },
  { name: 'Itens_T20', type: 'Item' },
  { name: 'Macros_T20', type: 'Macro' },
  { name: 'Tabelas_T20', type: 'RollTable' },
  { name: 'Diarios_T20', type: 'JournalEntry' },
  { name: 'Playlist_T20', type: 'Playlist' }
];

function getDirSize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return '0 B';
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    size += stat.size;
  }
  if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
  if (size > 1024) return (size / 1024).toFixed(1) + ' KB';
  return size + ' B';
}

async function getPackStats(pack) {
  const packPath = path.join('packs', pack.name);
  if (!fs.existsSync(packPath)) return null;

  const db = new ClassicLevel(packPath, { valueEncoding: 'utf8' });
  await db.open();

  let totalKeys = 0;
  let folders = 0;
  let rootDocs = 0;
  let subDocs = 0;
  let effects = 0;
  const docTypes = {};
  const coreVersions = new Set();
  const sysVersions = new Set();

  for await (const [key, value] of db.iterator()) {
    totalKeys++;
    if (key.startsWith('!folders!')) {
      folders++;
      continue;
    }

    if (key.includes('.effects!')) {
      effects++;
      continue;
    }

    if (key.includes('.')) {
      subDocs++;
      continue;
    }

    rootDocs++;
    try {
      const doc = JSON.parse(value);
      const t = doc.type || (pack.type === 'RollTable' ? 'table' : pack.type === 'Playlist' ? 'playlist' : 'document');
      docTypes[t] = (docTypes[t] || 0) + 1;
      if (doc._stats?.coreVersion) coreVersions.add(doc._stats.coreVersion);
      if (doc._stats?.systemVersion) sysVersions.add(doc._stats.systemVersion);
    } catch (e) {}
  }

  await db.close();

  return {
    name: pack.name,
    type: pack.type,
    size: getDirSize(packPath),
    totalKeys,
    folders,
    rootDocs,
    subDocs,
    effects,
    types: docTypes,
    coreVersions: Array.from(coreVersions),
    sysVersions: Array.from(sysVersions)
  };
}

async function main() {
  console.log('='.repeat(80));
  console.log('📊 COMPÊNDIOS T20 - ESTATÍSTICAS E AUDITORIA GERAL');
  console.log('='.repeat(80));

  let totalAllDocs = 0;
  let totalAllKeys = 0;

  for (const pack of PACKS) {
    const s = await getPackStats(pack);
    if (!s) continue;

    totalAllDocs += s.rootDocs;
    totalAllKeys += s.totalKeys;

    console.log(`\n📦 ${s.name} (${s.type}) — [Tamanho: ${s.size} | Chaves: ${s.totalKeys.toLocaleString()}]`);
    console.log(`   📁 Pastas: ${s.folders} | 📄 Documentos Principais: ${s.rootDocs.toLocaleString()}`);
    if (s.subDocs > 0) console.log(`   📎 Sub-documentos (Itens/Páginas/Sons): ${s.subDocs.toLocaleString()}`);
    if (s.effects > 0) console.log(`   ✨ Efeitos Ativos (Active Effects): ${s.effects.toLocaleString()}`);
    console.log(`   🏷️  Subtipos: ${Object.entries(s.types).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
    console.log(`   ⚙️  Foundry Core: [${s.coreVersions.join(', ')}] | T20 System: [${s.sysVersions.join(', ')}]`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`🌟 TOTAL GERAL: ${totalAllDocs.toLocaleString()} documentos principais (${totalAllKeys.toLocaleString()} registros LevelDB no total)`);
  console.log('='.repeat(80));
}

main().catch(console.error);

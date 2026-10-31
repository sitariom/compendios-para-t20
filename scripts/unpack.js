#!/usr/bin/env node
const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');

const PACKS = [
  'Macros_T20',
  'Diarios_T20',
  'Tabelas_T20',
  'Itens_T20',
  'Ameacas_T20',
  'Playlist_T20'
];

function sanitizeFilename(name) {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 80);
}

async function unpackPack(packName, outDir) {
  const packPath = path.join('packs', packName);
  if (!fs.existsSync(packPath)) {
    console.error(`Pack não encontrado: ${packPath}`);
    return;
  }

  const targetDir = path.join(outDir, packName);
  fs.mkdirSync(targetDir, { recursive: true });

  const db = new ClassicLevel(packPath, { valueEncoding: 'utf8' });
  await db.open();

  console.log(`\n📦 Extraindo ${packName} para ${targetDir}...`);

  const folders = [];
  const rootDocs = new Map();
  const subDocs = new Map(); // parentId -> array of subdocs
  let totalEntries = 0;

  for await (const [key, value] of db.iterator()) {
    totalEntries++;
    let doc;
    try {
      doc = JSON.parse(value);
    } catch (e) {
      continue;
    }

    if (key.startsWith('!folders!')) {
      folders.push(doc);
    } else if (!key.includes('.')) {
      // Root document
      const id = doc._id || key.split('!').pop();
      rootDocs.set(id, { key, doc });
    } else {
      // Embedded sub-document: e.g. !actors.items!parentId.subId
      const parts = key.split('!');
      const typePath = parts[1];
      const idChain = parts[2].split('.');
      const parentId = idChain[0];
      if (!subDocs.has(parentId)) subDocs.set(parentId, []);
      subDocs.get(parentId).push({ key, typePath, doc });
    }
  }

  await db.close();

  // Write folders
  fs.writeFileSync(path.join(targetDir, '_folders.json'), JSON.stringify(folders, null, 2), 'utf8');

  // Write root docs
  let written = 0;
  for (const [id, { key, doc }] of rootDocs.entries()) {
    const filename = `${sanitizeFilename(doc.name || 'document')}_${id}.json`;
    const docData = {
      _dbKey: key,
      ...doc
    };

    // If there are subdocs, attach them under _embedded
    if (subDocs.has(id)) {
      docData._embedded = subDocs.get(id);
    }

    fs.writeFileSync(path.join(targetDir, filename), JSON.stringify(docData, null, 2), 'utf8');
    written++;
  }

  console.log(`✅ ${packName} extraído: ${written} documentos e ${folders.length} pastas.`);
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'Macros_T20';
  const outDir = 'src/packs';

  if (target === '--all') {
    for (const p of PACKS) {
      await unpackPack(p, outDir);
    }
  } else {
    await unpackPack(target, outDir);
  }
}

main().catch(console.error);

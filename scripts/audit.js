#!/usr/bin/env node
const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');

const PACKS = [
  'Ameacas_T20',
  'Itens_T20',
  'Macros_T20',
  'Tabelas_T20',
  'Diarios_T20',
  'Playlist_T20'
];

async function auditPack(packName) {
  const packPath = path.join('packs', packName);
  if (!fs.existsSync(packPath)) return null;

  const db = new ClassicLevel(packPath, { valueEncoding: 'utf8' });
  await db.open();

  const folderIds = new Set();
  const docIds = new Set();
  let jsonErrors = 0;
  let missingIds = 0;
  let orphanedFolders = 0;
  let invalidStatsIds = 0;
  const imageSources = {};
  const externalOrCustomImages = [];

  // Pass 1: Collect folders
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!folders!')) {
      try {
        const f = JSON.parse(value);
        if (f._id) folderIds.add(f._id);
        if (f._stats?.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(f._stats.lastModifiedBy)) {
          invalidStatsIds++;
          console.error(`  ❌ [${packName}] Folder [${f._id}] possui _stats.lastModifiedBy inválido: "${f._stats.lastModifiedBy}"`);
        }
      } catch (e) {
        jsonErrors++;
      }
    }
  }

  // Pass 2: Audit docs
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!folders!')) continue;

    let doc;
    try {
      doc = JSON.parse(value);
    } catch (e) {
      jsonErrors++;
      continue;
    }

    const id = doc._id || key.split('!').pop();
    if (!id) missingIds++;
    docIds.add(id);

    // Validação estrita de _stats.lastModifiedBy (DataModel Foundry VTT DocumentIdField)
    if (doc._stats?.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(doc._stats.lastModifiedBy)) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui _stats.lastModifiedBy inválido: "${doc._stats.lastModifiedBy}"`);
    }

    // Check folder reference (only for root docs)
    if (!key.includes('.')) {
      if (doc.folder && !folderIds.has(doc.folder)) {
        orphanedFolders++;
      }
    }

    // Check image references
    const img = doc.img;
    if (img) {
      let category = 'other';
      if (img.startsWith('icons/')) category = 'core';
      else if (img.startsWith('systems/tormenta20/')) category = 'system';
      else if (img.startsWith('modules/')) category = 'module';
      else if (img.startsWith('assets/')) category = 'local_assets';
      else if (img.startsWith('tokenizer/')) category = 'tokenizer';
      else if (img.startsWith('http')) category = 'http_url';

      imageSources[category] = (imageSources[category] || 0) + 1;
      if (category === 'tokenizer' || category === 'other' || category === 'local_assets') {
        if (externalOrCustomImages.length < 5) {
          externalOrCustomImages.push({ name: doc.name, img, category });
        }
      }
    }
  }

  await db.close();

  return {
    packName,
    totalDocs: docIds.size,
    foldersCount: folderIds.size,
    jsonErrors,
    missingIds,
    orphanedFolders,
    invalidStatsIds,
    imageSources,
    sampleCustomImages: externalOrCustomImages
  };
}

async function main() {
  console.log('='.repeat(80));
  console.log('🩺 AUDITORIA DE INTEGRIDADE DOS COMPÊNDIOS T20');
  console.log('='.repeat(80));

  let totalErrors = 0;

  for (const p of PACKS) {
    const res = await auditPack(p);
    if (!res) continue;

    console.log(`\n📦 Pack: ${res.packName}`);
    console.log(`   • Documentos auditados: ${res.totalDocs.toLocaleString()}`);
    console.log(`   • Pastas registradas: ${res.foldersCount}`);
    console.log(`   • Erros de JSON: ${res.jsonErrors}`);
    console.log(`   • Documentos sem ID: ${res.missingIds}`);
    console.log(`   • Documentos com pasta órfã: ${res.orphanedFolders}`);
    if (res.invalidStatsIds > 0) {
      console.log(`   • ❌ Documentos/Pastas com _stats.lastModifiedBy inválido: ${res.invalidStatsIds}`);
      totalErrors += res.invalidStatsIds;
    }
    console.log(`   • Fontes de imagens:`, res.imageSources);

    totalErrors += res.jsonErrors + res.missingIds + res.orphanedFolders;

    if (res.sampleCustomImages.length > 0) {
      console.log(`   ⚠️ Amostra de imagens com dependência local (tokenizer/assets/outros):`);
      for (const item of res.sampleCustomImages) {
        console.log(`     - [${item.category}] "${item.name}": ${item.img}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  if (totalErrors === 0) {
    console.log('✅ Auditoria concluída com 100% de integridade.');
  } else {
    console.error(`❌ Auditoria finalizada com ${totalErrors} erros de integridade!`);
    process.exit(1);
  }
  console.log('='.repeat(80));
}

main().catch(console.error);

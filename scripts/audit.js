#!/usr/bin/env node
const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { discoverPacksFromModuleJson } = require('./pack-discovery');
const { isVerifiedIconPath } = require('./icon-resolver');

const ROOT_DIR = path.resolve(__dirname, '..');

async function auditPack(packDef) {
  const packName = typeof packDef === 'string' ? packDef : packDef.name;
  const packPath = typeof packDef === 'string' ? path.join(ROOT_DIR, 'packs', packDef) : packDef.absPath;
  const expectedNs = typeof packDef === 'string' ? null : packDef.namespace;
  if (!fs.existsSync(packPath)) return null;

  const db = new ClassicLevel(packPath, { valueEncoding: 'utf8' });
  await db.open();

  const folderIds = new Set();
  const docIds = new Set();
  const rootDocs = new Map();
  const subEntries = [];
  let jsonErrors = 0;
  let missingIds = 0;
  let orphanedFolders = 0;
  let orphanedSubdocs = 0;
  let invalidStatsIds = 0;
  const imageSources = {};
  const externalOrCustomImages = [];

  // Pass 1: Collect folders
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!folders!')) {
      try {
        const f = JSON.parse(value);
        if (f._id) folderIds.add(f._id);
        if (!f._id || !/^[a-zA-Z0-9]{16}$/.test(f._id)) {
          invalidStatsIds++;
          console.error(`  ❌ [${packName}] Folder possui _id inválido: "${f._id}" (len=${f._id ? f._id.length : 0})`);
        }
        if (f._stats?.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(f._stats.lastModifiedBy)) {
          invalidStatsIds++;
          console.error(`  ❌ [${packName}] Folder [${f._id}] possui _stats.lastModifiedBy inválido: "${f._stats.lastModifiedBy}"`);
        }
      } catch {
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
    } catch {
      jsonErrors++;
      continue;
    }

    const id = key.includes('.') ? key.split('.').pop() : (doc._id || key.split('!').pop());
    if (!id) missingIds++;
    if (key.includes('.')) {
      subEntries.push({ key, doc });
    } else {
      if (expectedNs && !key.startsWith(`!${expectedNs}!`)) {
        invalidStatsIds++;
        console.error(`  ❌ [${packName}] Chave raiz [${key}] não corresponde ao namespace esperado "!${expectedNs}!"`);
      }
      docIds.add(id);
      rootDocs.set(id, doc);
    }

    // Proibir objetos embutidos inline em items[] ou effects[] no LevelDB
    if (Array.isArray(doc.items) && doc.items.some(x => typeof x !== 'string')) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui objetos inline em items[] (esperado array de string IDs).`);
    }
    if (Array.isArray(doc.effects) && doc.effects.some(x => typeof x !== 'string')) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui objetos inline em effects[] (esperado array de string IDs).`);
    }

    // Validação estrita de comprimento 16 em todos os documentos/subdocumentos
    if (id && id.length !== 16) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Chave [${key}] possui ID com tamanho != 16: "${id}" (len=${id.length})`);
    }

    // Validação estrita de _stats.lastModifiedBy (DataModel Foundry VTT DocumentIdField)
    if (doc._stats?.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(doc._stats.lastModifiedBy)) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui _stats.lastModifiedBy inválido: "${doc._stats.lastModifiedBy}"`);
    }

    // Gate de compatibilidade estrita Foundry v13 + v14 (Tormenta20 v1.5.015 / v1.6.7)
    if (doc.type === 'consumivel' && doc.system?.tipo !== undefined) {
      const validCons = new Set(['', 'ammo', 'scroll', 'alchemy', 'potion', 'material', 'food']);
      if (!validCons.has(doc.system.tipo)) {
        invalidStatsIds++;
        console.error(`  ❌ [${packName}] Consumível [${id}] "${doc.name}" possui system.tipo="${doc.system.tipo}" incompatível com Foundry v14 (ConsumableData.tipo).`);
      }
    }
    if (doc.type === 'equipamento' && doc.system?.equipado2 && !['hand', 'body', 'both'].includes(doc.system.equipado2.type)) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Equipamento [${id}] "${doc.name}" possui equipado2.type="${doc.system.equipado2.type}" inválido (esperado hand|body|both).`);
    }
    if (doc.type === 'magia' && doc.system) {
      if (doc.system.tipo && !['arc', 'div', 'uni', 'eng', 'sim'].includes(doc.system.tipo)) {
        invalidStatsIds++;
        console.error(`  ❌ [${packName}] Magia [${id}] "${doc.name}" possui system.tipo="${doc.system.tipo}" inválido.`);
      }
      if (doc.system.escola && !['abj', 'adv', 'con', 'enc', 'evo', 'ilu', 'nec', 'tra'].includes(doc.system.escola)) {
        invalidStatsIds++;
        console.error(`  ❌ [${packName}] Magia [${id}] "${doc.name}" possui system.escola="${doc.system.escola}" inválida.`);
      }
    }
    if (doc.type === 'arma' && ['m', 'km'].includes(doc.system?.alcance)) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Arma [${id}] "${doc.name}" possui system.alcance="${doc.system.alcance}" (proibido pois WeaponData não possui system.range).`);
    }
    if (!packDef.isLegacyRoot && doc.img && !isVerifiedIconPath(doc.img)) {
      invalidStatsIds++;
      console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui imagem não verificada/quebrada: "${doc.img}".`);
    }
    if (doc.system) {
      for (const tf of ['tags', 'rolltags', 'automationtags']) {
        if (Array.isArray(doc.system[tf]) && doc.system[tf].some(t => typeof t !== 'string' || t.trim() === '')) {
          invalidStatsIds++;
          console.error(`  ❌ [${packName}] Doc [${id}] "${doc.name}" possui item vazio em ${tf} (proibido pelo SetField do Foundry v14).`);
        }
      }
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

  // Pass 3: Check orphan subdocuments
  const actorItemsMap = new Map();
  for (const { key, doc } of subEntries) {
    if (key.startsWith('!actors.items!')) {
      actorItemsMap.set(key.split('!')[2], doc);
    }
  }
  for (const { key, doc } of subEntries) {
    const parts = key.split('!');
    const ns = parts[1];
    const chain = (parts[2] || '').split('.');
    const parentId = chain[0];
    const subId = chain[1];
    const effId = chain[2];
    const parent = rootDocs.get(parentId);
    let isOrphan = !parent;
    if (!isOrphan) {
      if (ns === 'actors.items' && Array.isArray(parent.items) && parent.items.every(x => typeof x === 'string') && !parent.items.includes(subId)) isOrphan = true;
      else if (ns === 'actors.items.effects') {
        const parentItem = actorItemsMap.get(`${parentId}.${subId}`);
        if (!parentItem) isOrphan = true;
        else if (Array.isArray(parentItem.effects) && parentItem.effects.every(x => typeof x === 'string') && !parentItem.effects.includes(effId)) isOrphan = true;
      }
      else if (ns === 'actors.effects' && Array.isArray(parent.effects) && parent.effects.every(x => typeof x === 'string') && !parent.effects.includes(subId)) isOrphan = true;
      else if (ns === 'items.effects' && Array.isArray(parent.effects) && parent.effects.every(x => typeof x === 'string') && !parent.effects.includes(subId)) isOrphan = true;
      else if (ns === 'tables.results' && Array.isArray(parent.results) && parent.results.every(x => typeof x === 'string') && !parent.results.includes(subId)) isOrphan = true;
      else if (ns === 'journal.pages' && Array.isArray(parent.pages) && parent.pages.every(x => typeof x === 'string') && !parent.pages.includes(subId)) isOrphan = true;
    }
    if (isOrphan) {
      orphanedSubdocs++;
      console.error(`  ❌ [${packName}] Subdocumento órfão [${key}] "${doc?.name || subId}"`);
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
    orphanedSubdocs,
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
  const packs = discoverPacksFromModuleJson(ROOT_DIR);

  for (const p of packs) {
    const res = await auditPack(p);
    if (!res) continue;

    console.log(`\n📦 Pack: ${res.packName}`);
    console.log(`   • Documentos auditados: ${res.totalDocs.toLocaleString()}`);
    console.log(`   • Pastas registradas: ${res.foldersCount}`);
    console.log(`   • Erros de JSON: ${res.jsonErrors}`);
    console.log(`   • Documentos sem ID: ${res.missingIds}`);
    console.log(`   • Documentos com pasta órfã: ${res.orphanedFolders}`);
    if (res.orphanedSubdocs > 0) {
      console.log(`   • ❌ Subdocumentos órfãos: ${res.orphanedSubdocs}`);
      totalErrors += res.orphanedSubdocs;
    }
    if (res.invalidStatsIds > 0) {
      console.log(`   • ❌ Documentos/Pastas com ID ou _stats.lastModifiedBy inválido: ${res.invalidStatsIds}`);
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

  console.log(`\n${'='.repeat(80)}`);
  if (totalErrors === 0) {
    console.log('✅ Auditoria concluída com 100% de integridade.');
  } else {
    console.error(`❌ Auditoria finalizada com ${totalErrors} erros de integridade!`);
    process.exit(1);
  }
  console.log('='.repeat(80));
}

main().catch(console.error);

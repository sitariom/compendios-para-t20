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

async function searchPack(packName, term, typeFilter, limit) {
  const packPath = path.join('packs', packName);
  if (!fs.existsSync(packPath)) return [];

  const db = new ClassicLevel(packPath, { valueEncoding: 'utf8' });
  await db.open();

  const results = [];
  const lowerTerm = term.toLowerCase();

  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!folders!')) continue;

    try {
      const doc = JSON.parse(value);
      const name = doc.name || '';
      const docType = doc.type || '';

      if (typeFilter && docType.toLowerCase() !== typeFilter.toLowerCase()) {
        continue;
      }

      if (name.toLowerCase().includes(lowerTerm)) {
        let details = '';
        if (doc.system?.nd !== undefined) details += ` | ND: ${doc.system.nd}`;
        if (doc.system?.preco !== undefined) details += ` | Preço: ${doc.system.preco} T$`;
        if (doc.type) details += ` | Tipo: ${doc.type}`;

        results.push({
          pack: packName,
          key,
          id: doc._id || key.split('!').pop(),
          name,
          type: docType,
          details
        });

        if (results.length >= limit) break;
      }
    } catch (e) {}
  }

  await db.close();
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: node scripts/search.js <termo> [--pack NomeDoPack] [--type Tipo] [--limit N]');
    console.log('Exemplo: node scripts/search.js "Dragão"');
    console.log('Exemplo: node scripts/search.js "Espada" --pack Itens_T20');
    process.exit(0);
  }

  let term = '';
  let packFilter = null;
  let typeFilter = null;
  let limit = 20;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pack' && args[i + 1]) {
      packFilter = args[++i];
    } else if (args[i] === '--type' && args[i + 1]) {
      typeFilter = args[++i];
    } else if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[++i], 10);
    } else if (!term) {
      term = args[i];
    }
  }

  console.log(`🔍 Buscando por "${term}"...`);
  const targetPacks = packFilter ? [packFilter] : PACKS;

  let totalHits = 0;
  for (const p of targetPacks) {
    const hits = await searchPack(p, term, typeFilter, limit - totalHits);
    if (hits.length > 0) {
      console.log(`\n📦 Pack: ${p} (${hits.length} resultados):`);
      for (const h of hits) {
        console.log(`   • [${h.id}] ${h.name}${h.details}`);
      }
      totalHits += hits.length;
    }
    if (totalHits >= limit) break;
  }

  if (totalHits === 0) {
    console.log('Nenhum resultado encontrado.');
  } else {
    console.log(`\nTotal exibido: ${totalHits} resultados.`);
  }
}

main().catch(console.error);

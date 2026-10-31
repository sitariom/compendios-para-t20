#!/usr/bin/env node
const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');

const PACK_TYPES = {
  Ameacas_T20: 'actors',
  Itens_T20: 'items',
  Macros_T20: 'macros',
  Tabelas_T20: 'tables',
  Diarios_T20: 'journal',
  Playlist_T20: 'playlists'
};

async function packDirectory(packName, srcDir, destDir) {
  const sourcePath = path.join(srcDir, packName);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Diretório fonte não encontrado: ${sourcePath}`);
    return;
  }

  const targetPath = path.join(destDir, packName);
  console.log(`\n📦 Empacotando ${sourcePath} para ${targetPath}...`);

  fs.mkdirSync(targetPath, { recursive: true });

  const db = new ClassicLevel(targetPath, { valueEncoding: 'utf8' });
  await db.open();

  let folderCount = 0;
  let docCount = 0;
  let subDocCount = 0;

  // 1. Pack folders
  const foldersFile = path.join(sourcePath, '_folders.json');
  if (fs.existsSync(foldersFile)) {
    try {
      const folders = JSON.parse(fs.readFileSync(foldersFile, 'utf8'));
      for (const folder of folders) {
        const key = `!folders!${folder._id}`;
        await db.put(key, JSON.stringify(folder));
        folderCount++;
      }
    } catch (e) {
      console.error(`Erro ao carregar _folders.json:`, e.message);
    }
  }

  // 2. Pack docs
  const defaultCollection = PACK_TYPES[packName] || 'documents';
  const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.json') && f !== '_folders.json');

  for (const f of files) {
    const fullPath = path.join(sourcePath, f);
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const dbKey = data._dbKey || `!${defaultCollection}!${data._id}`;
      const embedded = data._embedded || [];

      // Clean metadata before writing root doc
      delete data._dbKey;
      delete data._embedded;

      await db.put(dbKey, JSON.stringify(data));
      docCount++;

      // Write embedded documents
      if (Array.isArray(embedded)) {
        for (const item of embedded) {
          if (item.key && item.doc) {
            await db.put(item.key, JSON.stringify(item.doc));
            subDocCount++;
          }
        }
      }
    } catch (e) {
      console.error(`Erro ao processar ${f}:`, e.message);
    }
  }

  await db.close();
  console.log(`✅ ${packName} empacotado: ${docCount} documentos, ${folderCount} pastas, ${subDocCount} sub-documentos.`);
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'Macros_T20';
  const srcDir = 'src/packs';
  const destDir = 'packs';

  await packDirectory(target, srcDir, destDir);
}

main().catch(console.error);

const { ClassicLevel } = require('classic-level');

const PACKS = ['Ameacas_T20', 'Itens_T20', 'Macros_T20', 'Tabelas_T20', 'Diarios_T20'];

async function scanDbEditions() {
  const dbEditions = {};
  const dbFolderContents = {};

  for (const packName of PACKS) {
    const db = new ClassicLevel('packs/' + packName, { valueEncoding: 'utf8' });
    await db.open();

    const folderMap = {};
    for await (const [key, value] of db.iterator()) {
      if (key.startsWith('!folders!')) {
        try {
          const f = JSON.parse(value);
          folderMap[f._id] = f.name;
        } catch {
          // ignore invalid folder JSON
        }
      }
    }

    for await (const [key, value] of db.iterator()) {
      if (key.startsWith('!folders!')) continue;
      try {
        const doc = JSON.parse(value);
        const folderName = folderMap[doc.folder] || 'root';
        const text = JSON.stringify(doc);

        const matches = text.match(/(?:Drag[ãa]o\s*Brasil|DB)\s*(?:#|n[ºo]\.?\s*)?(\d{2,3})/gi) || [];
        for (const m of matches) {
          const numMatch = m.match(/\d{2,3}/);
          if (numMatch) {
            const num = parseInt(numMatch[0], 10);
            if (num >= 100 && num <= 250) {
              if (!dbEditions[num]) dbEditions[num] = { count: 0, packs: {}, sampleNames: [] };
              dbEditions[num].count++;
              dbEditions[num].packs[packName] = (dbEditions[num].packs[packName] || 0) + 1;
              if (dbEditions[num].sampleNames.length < 3 && doc.name) {
                dbEditions[num].sampleNames.push('[' + packName + '] ' + doc.name);
              }
            }
          }
        }

        if (folderName.toLowerCase().includes('dragão brasil') || folderName.toLowerCase().includes('db')) {
          if (!dbFolderContents[folderName]) dbFolderContents[folderName] = { pack: packName, count: 0 };
          dbFolderContents[folderName].count++;
        }
      } catch {
        // ignore invalid doc JSON
      }
    }
    await db.close();
  }

  console.log('--- PASTAS DA DRAGÃO BRASIL ---');
  console.log(dbFolderContents);

  console.log('--- EDIÇÕES IDENTIFICADAS (ORDENADAS) ---');
  const sorted = Object.keys(dbEditions).map(Number).sort((a,b) => a - b);
  for (const ed of sorted) {
    console.log('DB #' + ed + ': ' + dbEditions[ed].count + ' menções | Packs:', JSON.stringify(dbEditions[ed].packs), '| Exemplos:', dbEditions[ed].sampleNames.slice(0, 2));
  }

  const maxEd = Math.max(...sorted);
  console.log('\n>>> MAIOR EDIÇÃO IDENTIFICADA:', maxEd);
}

scanDbEditions().catch(console.error);

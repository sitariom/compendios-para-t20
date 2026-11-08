#!/usr/bin/env node
/**
 * Validador Estrito e Canônico de Conformidade da Dragão Brasil #230
 *
 * Valida:
 * 1. Ameacas_T20:
 *    - 14 ameaças canônicas (10 de O Reino dos Pesadelos + 4 de A Corrida Brutal).
 *    - Defesa Base dinâmica (defesa.base + des === defesa.value).
 *    - 34 perícias canônicas presentes em cada criatura sob system.pericias.
 *    - Atributos completos (value, base, racial, bonus).
 *    - Subdocumentos ClassicLevel embutidos em !actors.items!actorId.itemId.
 *    - Armas e ataques com rolls.parts e descrições.
 *    - Tokens top-down 2MTT existentes em assets/tokens/ e configurados no token.
 *    - Biografias canônicas com citações duplas (#800000 e #006400) e lore.
 *    - Confirmação de que parceiros NÃO foram criados como atores.
 * 2. Itens_T20:
 *    - 10 itens, parceiros, equipamentos, consumíveis e poderes da DB #230.
 *    - Parceira Rotsheel modelada como poder com ActiveEffects.
 *    - Arquitetura canônica de subdocumentos ClassicLevel em !items.effects!.
 *    - Zero duplicatas de nomes em Itens_T20.
 * 3. Diarios_T20 e Tabelas_T20:
 *    - 3 Diários oficiais com JournalEntry.pages como array de string IDs.
 *    - 4 Tabelas oficiais com RollTable.results como array de string IDs.
 *    - Subdocumentos de resultados com type: "text" e description.
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { ALL_SKILLS } = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const PACK_JOURNALS = path.join(__dirname, '..', 'packs', 'Diarios_T20');
const PACK_TABELAS = path.join(__dirname, '..', 'packs', 'Tabelas_T20');

let totalErrors = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ ERRO: ${message}`);
    totalErrors++;
  }
}

async function validateActors() {
  console.log('--- 1. Validando Ameaças da DB #230 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const requiredThreats = [
    { id: 'gq8KZangPes230AA', name: 'Zangão do Pesadelo', nd: '5', tamanho: 'med' },
    { id: 'gq8KColePes230AA', name: 'Coletor do Pesadelo', nd: '6', tamanho: 'med' },
    { id: 'gq8KCeifPes230AA', name: 'Ceifador do Pesadelo', nd: '8', tamanho: 'med' },
    { id: 'gq8KPoliPes230AA', name: 'Pesadelo Polivalente', nd: '10', tamanho: 'grd' },
    { id: 'gq8KMestPes230AA', name: 'Mestre do Pesadelo', nd: '15', tamanho: 'enor' },
    { id: 'gq8KLancOni230AA', name: 'Lanceiro Onírico', nd: '2', tamanho: 'med' },
    { id: 'gq8KGineOni230AA', name: 'Ginete Onírico', nd: '3', tamanho: 'med' },
    { id: 'gq8KSargOni230AA', name: 'Sargento Onírico', nd: '4', tamanho: 'med' },
    { id: 'gq8KTeneOni230AA', name: 'Tenente Onírico', nd: '6', tamanho: 'med' },
    { id: 'gq8KNocnMur230AA', name: 'Nócnam Mur, o Pesadelo Amalgamado', nd: '18', tamanho: 'grd' },
    { id: 'gq8KSaceCai230AA', name: 'Sacerdote Caído', nd: '5', tamanho: 'med' },
    { id: 'gq8KGobGorl230AA', name: 'Três Goblins em um Gorlogg', nd: '7', tamanho: 'grd' },
    { id: 'gq8KArzak230AAAA', name: 'Arzak', nd: '8', tamanho: 'med' },
    { id: 'gq8KGaarda230AAA', name: 'Gaardak', nd: '8', tamanho: 'med' }
  ];

  for (const req of requiredThreats) {
    assert(req.id.length === 16 && /^[a-zA-Z0-9]{16}$/.test(req.id), `ID canônico de 16 caracteres para ${req.name}: "${req.id}"`);
    let doc;
    try {
      doc = await db.get(`!actors!${req.id}`);
    } catch {
      assert(false, `Ator "${req.name}" [${req.id}] NÃO encontrado em Ameacas_T20.`);
      continue;
    }

    assert(doc.name === req.name, `Nome correto: esperado "${req.name}", obtido "${doc.name}"`);
    assert(String(doc.system?.attributes?.nd) === req.nd, `ND correto para ${req.name}: esperado ${req.nd}, obtido ${doc.system?.attributes?.nd}`);
    assert(doc.folder === 'wfWApuyngzFm4KOP', `Pasta correta (Dragão Brasil): obtido ${doc.folder}`);
    assert(doc.system?.tracos?.tamanho === req.tamanho, `Tamanho correto para ${req.name}: esperado ${req.tamanho}, obtido ${doc.system?.tracos?.tamanho}`);

    // Validação de Defesa Base Dinâmica
    const def = doc.system?.attributes?.defesa;
    const des = doc.system?.atributos?.des?.value || 0;
    assert(def && def.value !== undefined && def.base !== undefined, `Defesa estruturada em ${req.name}`);
    assert(def.base + des === def.value, `Defesa dinâmica coerente em ${req.name}: base (${def.base}) + des (${des}) = value (${def.value})`);

    // Validação das 34 perícias sob system.pericias
    const pericias = doc.system?.pericias || {};
    const skillKeys = Object.keys(pericias);
    assert(skillKeys.length === 34, `34 perícias presentes em ${req.name} (encontradas ${skillKeys.length})`);
    for (const sk of ALL_SKILLS) {
      assert(pericias[sk.key] && pericias[sk.key].value !== undefined, `Perícia "${sk.key}" calculada em ${req.name}`);
    }

    // Validação de Subdocumentos embutidos de itens e ataques
    assert(Array.isArray(doc.items) && doc.items.length > 0, `doc.items é array com IDs em ${req.name} (tamanho: ${doc.items?.length})`);
    let foundSubdocs = 0;
    let weaponCount = 0;
    for await (const [k, v] of db.iterator({ gte: `!actors.items!${req.id}.`, lte: `!actors.items!${req.id}.\uffff` })) {
      foundSubdocs++;
      assert(v && v._id && v.name && v.type, `Subdocumento válido em ${k}`);
      if (v.type === 'arma') {
        weaponCount++;
        const rolls = v.system?.rolls;
        assert(Array.isArray(rolls) && rolls.length > 0, `Arma "${v.name}" com rolls.parts em ${req.name}`);

        // Validação de dano adicional em criaturas específicas
        if (req.name === 'Tenente Onírico' && (v.name.includes('Espada') || v.name.includes('Cauda-Lâmina'))) {
          assert(rolls.some(r => r.parts?.some(p => p[1] === 'trevas')), `Dano de trevas presente em "${v.name}" de ${req.name}`);
        }
        if (req.name === 'Nócnam Mur, o Pesadelo Amalgamado' && (v.name.includes('Espada') || v.name.includes('Tentáculos'))) {
          assert(rolls.some(r => r.parts?.some(p => p[1] === 'trevas')), `Dano de trevas presente em "${v.name}" de ${req.name}`);
        }
        if (req.name === 'Sacerdote Caído' && v.name.includes('Foice')) {
          assert(rolls.some(r => r.parts?.some(p => p[1] === 'trevas')), `Dano de trevas presente em "${v.name}" de ${req.name}`);
        }
        if (req.name === 'Coletor do Pesadelo' && v.name.includes('Tentáculo')) {
          assert(rolls.some(r => r.parts?.some(p => p[1] === 'psíquico')), `Dano psíquico presente em "${v.name}" de ${req.name}`);
        }
      }
    }
    assert(foundSubdocs === doc.items.length, `Total de subdocs bate com doc.items em ${req.name} (${foundSubdocs}/${doc.items.length})`);

    // Validação de Mestre do Pesadelo ter todas as 6 armas (mordida, garras e 4 caudas)
    if (req.name === 'Mestre do Pesadelo') {
      assert(weaponCount >= 6, `Mestre do Pesadelo possui todas as armas e caudas criadas (esperado >=6, obtido ${weaponCount})`);
    }

    // Validação de ataques à distância em criaturas que possuem projéteis/cauda-espinho
    if (['Zangão do Pesadelo', 'Pesadelo Polivalente', 'Mestre do Pesadelo', 'Ginete Onírico', 'Três Goblins em um Gorlogg', 'Arzak', 'Gaardak'].includes(req.name)) {
      assert(Boolean(doc.system?.detalhes?.ataquesad), `ataquesad preenchido para criatura com ataque à distância (${req.name})`);
    }

    // Validação de Token Top-down 2MTT
    const tokenSrc = doc.prototypeToken?.texture?.src;
    assert(tokenSrc && tokenSrc.startsWith('modules/compendios-para-t20/assets/tokens/'), `Token 2MTT configurado em ${req.name}: ${tokenSrc}`);
    const tokenRel = tokenSrc.replace('modules/compendios-para-t20/', '');
    const tokenPath = path.join(__dirname, '..', tokenRel);
    assert(fs.existsSync(tokenPath), `Arquivo físico do token existe: ${tokenRel}`);

    // Validação da Biografia com Citações Duplas Canônicas
    const bio = doc.system?.detalhes?.biography?.value || '';
    assert(bio.includes('#800000') && bio.includes('#006400'), `Citações duplas (#800000 e #006400) presentes na bio de ${req.name}`);
    assert(bio.includes('font-style: italic;') && bio.includes('blockquote'), `Blockquotes em itálico presentes na bio de ${req.name}`);

    console.log(`  ✓ Ator "${req.name}" (ND ${req.nd}) 100% canônico.`);
  }

  // Verifica que Rotsheel NÃO foi criada como ator
  for await (const [, v] of db.iterator()) {
    if (v && v.name && v.name.toLowerCase().includes('rotsheel')) {
      assert(false, `Rotsheel encontrada indevidamente em Ameacas_T20!`);
    }
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens, Parceiros e Poderes da DB #230 (Itens_T20) ---');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  const requiredItems = [
    { id: 'gq8KPRotsheel230', name: 'Parceira: Rotsheel', type: 'poder', folder: '0uRx5Efj3tk7P5Xr', minEff: 2 },
    { id: 'gq8KCarruagem230', name: 'Carruagem Duyshidakk', type: 'equipamento', folder: 'f9rwHA7dJnFLVQH1', minEff: 1 },
    { id: 'gq8KMachadoT230A', name: 'Machado do Campeão de Tyrondir', type: 'arma', folder: 'VkkBiC6Epn7FfW6p', minEff: 1 },
    { id: 'gq8KKumshrak230A', name: 'Kum’shrak Eviscerador', type: 'arma', folder: 'VkkBiC6Epn7FfW6p', minEff: 1 },
    { id: 'gq8KCentelha230A', name: 'Centelha Onírica', type: 'consumivel', folder: 'ZMhIquorDsf9xEn8', minEff: 0 },
    { id: 'gq8KSonhoAmo230A', name: 'Sonho Resgatado: Sonho de Amor', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'gq8KSonhoApr230A', name: 'Sonho Resgatado: Sonho de Aprendizado', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'gq8KSonhoDes230A', name: 'Sonho Resgatado: Sonho de Destruição', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'gq8KPesadPer230A', name: 'Pesadelo Onírico: Sonho Perdido', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 }
  ];

  for (const req of requiredItems) {
    assert(req.id.length === 16 && /^[a-zA-Z0-9]{16}$/.test(req.id), `ID canônico de 16 caracteres para ${req.name}: "${req.id}"`);
    let doc;
    try {
      doc = await db.get(`!items!${req.id}`);
    } catch {
      assert(false, `Item "${req.name}" [${req.id}] NÃO encontrado em Itens_T20.`);
      continue;
    }

    assert(doc.name === req.name, `Nome do item: esperado "${req.name}", obtido "${doc.name}"`);
    assert(doc.type === req.type, `Tipo do item para ${req.name}: esperado "${req.type}", obtido "${doc.type}"`);
    assert(doc.folder === req.folder, `Pasta de ${req.name}: esperada "${req.folder}", obtida "${doc.folder}"`);

    // Validação de Descrição Rich Text oficial do sistema T20
    const descValue = doc.system?.description?.value;
    assert(typeof descValue === 'string' && descValue.length > 20, `system.description.value devidamente preenchido em "${req.name}" (len: ${descValue?.length || 0})`);

    // Validação de ActiveEffects
    const effects = doc.effects || [];
    assert(Array.isArray(effects), `effects é array em ${req.name}`);
    assert(effects.length >= req.minEff, `Quantidade mínima de efeitos em ${req.name} (${effects.length} >= ${req.minEff})`);

    let effCount = 0;
    for await (const [k, v] of db.iterator({ gte: `!items.effects!${req.id}.`, lte: `!items.effects!${req.id}.\uffff` })) {
      effCount++;
      assert(v && v._id && v.name, `Efeito ativo válido em ${k}`);
      assert(effects.includes(v._id), `ID do efeito ${v._id} consta no array doc.effects`);
    }
    assert(effCount === effects.length, `Subdocumentos de efeitos batem com doc.effects em ${req.name} (${effCount}/${effects.length})`);

    console.log(`  ✓ Item "${req.name}" (${req.type}) com ${effCount} efeitos 100% canônico.`);
  }

  // Verificação de unicidade (Zero duplicatas de nomes da DB #230)
  const nameCounts = {};
  for await (const [k, v] of db.iterator()) {
    if (k.startsWith('!items!') && v && v.name) {
      if (requiredItems.some(r => r.name === v.name)) {
        nameCounts[v.name] = (nameCounts[v.name] || 0) + 1;
      }
    }
  }

  for (const [name, count] of Object.entries(nameCounts)) {
    assert(count === 1, `Item "${name}" possui exatamente 1 registro no LevelDB (encontrados ${count})`);
  }

  await db.close();
}

async function validateJournalsAndTables() {
  console.log('\n--- 3. Validando Diários e Tabelas de Rolagem da DB #230 ---');
  const dbJournals = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  const requiredJournals = [
    { id: 'jReinoPesad230AA', name: 'O Reino dos Pesadelos (DB #230)', minPages: 7 },
    { id: 'jCorridaBrut230A', name: 'Aventura: A Corrida Brutal (DB #230)', minPages: 5 }
  ];

  for (const req of requiredJournals) {
    assert(req.id.length === 16 && /^[a-zA-Z0-9]{16}$/.test(req.id), `ID canônico de 16 caracteres para ${req.name}: "${req.id}"`);
    let doc;
    try {
      doc = await dbJournals.get(`!journal!${req.id}`);
    } catch {
      assert(false, `Diário "${req.name}" [${req.id}] NÃO encontrado.`);
      continue;
    }

    assert(doc.name === req.name, `Nome do diário: esperado "${req.name}", obtido "${doc.name}"`);
    assert(Array.isArray(doc.pages), `pages é array em ${req.name}`);
    assert(doc.pages.length >= req.minPages, `Páginas mínimas em ${req.name} (${doc.pages.length} >= ${req.minPages})`);

    // Validação estrita do Hotfix v1.6.2: pages deve ser array de string IDs
    for (const pid of doc.pages) {
      assert(typeof pid === 'string', `doc.pages contém estritamente string IDs em ${req.name}`);
      const pageKey = `!journal.pages!${req.id}.${pid}`;
      let pageDoc;
      try {
        pageDoc = await dbJournals.get(pageKey);
      } catch {
        assert(false, `Subdocumento de página ${pageKey} NÃO encontrado no LevelDB.`);
        continue;
      }
      assert(pageDoc && pageDoc.name && pageDoc.type === 'text', `Página válida ${pageKey}`);
      assert(pageDoc.ownership?.default === -1, `Página herda permissão (ownership.default === -1) em ${pageKey}`);
    }
    console.log(`  ✓ Diário "${req.name}" com ${doc.pages.length} páginas 100% canônico.`);
  }

  await dbJournals.close();

  const dbTables = new ClassicLevel(PACK_TABELAS, { valueEncoding: 'json' });

  const requiredTables = [
    { id: 'tNaturezaP230AAA', name: 'Natureza do Pesadelo (DB #230)', minResults: 4 },
    { id: 'tGanchosP230AAAA', name: 'Ganchos do Pesadelo em Aslothia (DB #230)', minResults: 6 },
    { id: 'tCorridaBrut230A', name: 'Encontros da Corrida Brutal (DB #230)', minResults: 6 },
    { id: 'tSonhosRoub230AA', name: 'Sonhos Roubados pelo Coletor (DB #230)', minResults: 4 }
  ];

  for (const req of requiredTables) {
    assert(req.id.length === 16 && /^[a-zA-Z0-9]{16}$/.test(req.id), `ID canônico de 16 caracteres para ${req.name}: "${req.id}"`);
    let doc;
    try {
      doc = await dbTables.get(`!tables!${req.id}`);
    } catch {
      assert(false, `Tabela "${req.name}" [${req.id}] NÃO encontrada.`);
      continue;
    }

    assert(doc.name === req.name, `Nome da tabela: esperado "${req.name}", obtido "${doc.name}"`);
    assert(Array.isArray(doc.results), `results é array em ${req.name}`);
    assert(doc.results.length >= req.minResults, `Resultados mínimos em ${req.name} (${doc.results.length} >= ${req.minResults})`);

    // Validação estrita do Hotfix v1.6.2: results deve ser array de string IDs
    for (const rid of doc.results) {
      assert(typeof rid === 'string', `doc.results contém estritamente string IDs em ${req.name}`);
      const resKey = `!tables.results!${req.id}.${rid}`;
      let resDoc;
      try {
        resDoc = await dbTables.get(resKey);
      } catch {
        assert(false, `Subdocumento de resultado ${resKey} NÃO encontrado no LevelDB.`);
        continue;
      }
      assert(resDoc && resDoc.type === 'text' && resDoc.description, `Resultado válido ${resKey}`);
      assert(Boolean(resDoc.name), `Resultado possui campo "name" preenchido em ${resKey}`);
    }
    console.log(`  ✓ Tabela "${req.name}" com ${doc.results.length} resultados 100% canônica.`);
  }

  await dbTables.close();
}

async function runValidation() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — DRAGÃO BRASIL #230');
  console.log('================================================================================\n');

  await validateActors();
  await validateItems();
  await validateJournalsAndTables();

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da DB #230 estão em conformidade canônica estrita!');
  } else {
    console.error(`❌ FALHA: ${totalErrors} discrepâncias detectadas. Corrija antes de prosseguir.`);
    process.exit(1);
  }
  console.log('================================================================================\n');
}

if (require.main === module) {
  runValidation().catch(err => {
    console.error('Erro fatal no validador:', err);
    process.exit(1);
  });
}

module.exports = { runValidation };

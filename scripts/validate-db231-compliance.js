#!/usr/bin/env node
/**
 * Validador Estrito e Canônico de Conformidade da Dragão Brasil #231
 *
 * Valida:
 * 1. Ameacas_T20:
 *    - 10 ameaças canônicas (6 de Halak-Tûr + 4 de Circo Sombrio).
 *    - IDs primários com estritamente 16 caracteres (/^[a-zA-Z0-9]{16}$/).
 *    - Defesa Base dinâmica (defesa.base + des === defesa.value).
 *    - 34 perícias canônicas presentes em cada criatura sob system.pericias.
 *    - Atributos completos (value, base, racial, bonus).
 *    - Subdocumentos ClassicLevel embutidos em !actors.items!actorId.itemId.
 *    - Armas e ataques com rolls.parts e descrições.
 *    - Tokens top-down existentes em assets/tokens/ e configurados no token.
 *    - Biografias canônicas com citações duplas (#800000 e #006400).
 * 2. Itens_T20:
 *    - 18 itens, poderes, classes variantes, poderes de caçador, origens e equipamentos.
 *    - IDs primários de 16 caracteres.
 *    - Arquitetura canônica de subdocumentos em !items.effects!.
 *    - Presença de system.description.value.
 * 3. Diarios_T20 e Tabelas_T20:
 *    - 3 Diários oficiais com JournalEntry.pages como array de string IDs.
 *    - Subdocumentos de páginas com ownership.default === -1.
 *    - 4 Tabelas oficiais com RollTable.results como array de string IDs.
 *    - Subdocumentos de resultados com campo "name" obrigatório e descrição.
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
  console.log('--- 1. Validando Ameaças da DB #231 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const requiredThreats = [
    { id: 'gq8231ArraiSecAA', name: 'Arraia-Seca', nd: '3', tamanho: 'med' },
    { id: 'gq8231AnshiraAAA', name: 'Anshira', nd: '9', tamanho: 'med' },
    { id: 'gq8231CacCondAAA', name: 'Caçador de Condenados', nd: '11', tamanho: 'grd' },
    { id: 'gq8231ConstAreAA', name: 'Constritora Arenosa', nd: '9', tamanho: 'grd' },
    { id: 'gq8231RessecSaqA', name: 'Ressecado Saqueador', nd: '4', tamanho: 'med' },
    { id: 'gq8231RessecLidA', name: 'Ressecado Líder', nd: '4', tamanho: 'med' },
    { id: 'gq8231BiancoAAAA', name: 'Bianco', nd: '2', tamanho: 'med' },
    { id: 'gq8231RojoAAAAAA', name: 'Rojo', nd: '2', tamanho: 'med' },
    { id: 'gq8231ManticZumb', name: 'Mantícora Zumbi', nd: '3', tamanho: 'grd' },
    { id: 'gq8231MorriseAAA', name: 'Morrise', nd: '3', tamanho: 'med' }
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

    // Validação das 34 perícias padrão sob system.pericias (mais eventuais perícias situacionais)
    const pericias = doc.system?.pericias || {};
    const skillKeys = Object.keys(pericias);
    assert(skillKeys.length >= 34, `Pelo menos 34 perícias presentes em ${req.name} (encontradas ${skillKeys.length})`);
    for (const sk of ALL_SKILLS) {
      assert(pericias[sk.key] && pericias[sk.key].value !== undefined, `Perícia padrão "${sk.key}" calculada em ${req.name}`);
    }

    // Validação de Subdocumentos embutidos
    assert(Array.isArray(doc.items) && doc.items.length > 0, `doc.items é array com IDs em ${req.name} (tamanho: ${doc.items?.length})`);
    let foundSubdocs = 0;
    let weaponCount = 0;
    let spellCount = 0;
    const subdocNames = [];
    for await (const [k, v] of db.iterator({ gte: `!actors.items!${req.id}.`, lte: `!actors.items!${req.id}.\uffff` })) {
      foundSubdocs++;
      subdocNames.push(v.name);
      assert(v && v._id && v.name && v.type, `Subdocumento válido em ${k}`);
      if (v.type === 'arma') {
        weaponCount++;
        const rolls = v.system?.rolls;
        assert(Array.isArray(rolls) && rolls.length > 0, `Arma "${v.name}" com rolls.parts em ${req.name}`);

        // Validação de dano de trevas em criaturas específicas
        if (['Ressecado Saqueador', 'Ressecado Líder', 'Morrise'].includes(req.name) && (v.name.includes('Cimitarra') || v.name.includes('Arco') || v.name.includes('Chicote'))) {
          assert(rolls.some(r => r.parts?.some(p => p[1] === 'trevas')), `Dano de trevas presente em "${v.name}" de ${req.name}`);
        }
      } else if (v.type === 'magia') {
        spellCount++;
        assert(v.system && v.system.circulo && v.system.escola && v.system.tipo, `Magia "${v.name}" com schema válido em ${req.name}`);
      }
    }
    assert(foundSubdocs === doc.items.length, `Total de subdocs bate com doc.items em ${req.name} (${foundSubdocs}/${doc.items.length})`);

    // Validações Canônicas Específicas por Criatura
    const tracos = doc.system?.tracos || {};
    const res = tracos.resistencias || {};
    const icVal = tracos.ic?.value || [];

    if (req.name === 'Anshira') {
      assert(res.acido?.imunidade === true, `Anshira possui imunidade a ácido em system.tracos.resistencias.acido`);
      assert(icVal.includes('mental'), `Anshira possui imunidade a efeitos mentais em ic.value`);
      assert(pericias.furt_deserto && pericias.furt_deserto.value === 16, `Anshira possui perícia situacional Furtividade (Desertos) = 16`);
      assert(spellCount === 5, `Anshira possui exatamente 5 magias individuais como itens de tipo "magia" (encontradas ${spellCount})`);
    }

    if (req.name === 'Constritora Arenosa') {
      assert(res.acido?.imunidade === true, `Constritora Arenosa possui imunidade a ácido`);
      assert(res.eletricidade?.imunidade === true, `Constritora Arenosa possui imunidade a eletricidade`);
      assert(res.trevas?.imunidade === true, `Constritora Arenosa possui imunidade a trevas`);
      assert(icVal.includes('metamorfose'), `Constritora Arenosa possui imunidade a metamorfose`);
      assert(pericias.furt_deserto && pericias.furt_deserto.value === 13, `Constritora Arenosa possui perícia situacional Furtividade (Deserto) = 13`);
      assert(subdocNames.includes('Fortificação 75%'), `Constritora Arenosa possui poder Fortificação 75%`);
      assert(subdocNames.includes('Vulnerabilidade Hídrica'), `Constritora Arenosa possui poder Vulnerabilidade Hídrica`);
    }

    if (req.name === 'Ressecado Saqueador' || req.name === 'Ressecado Líder') {
      assert(res.frio?.imunidade === true, `${req.name} possui imunidade a frio`);
      assert(res.fogo?.vulnerabilidade === true, `${req.name} possui vulnerabilidade a fogo em resistencias.fogo.vulnerabilidade`);
    }

    if (req.name === 'Bianco') {
      assert(spellCount === 4, `Bianco possui 4 magias simuladas de Truque Circense (encontradas ${spellCount})`);
    }

    if (req.name === 'Rojo') {
      assert(subdocNames.includes('Violência Cômica'), `Rojo possui poder Violência Cômica`);
      assert(subdocNames.includes('Cascudo'), `Rojo possui poder Cascudo`);
    }

    if (req.name === 'Mantícora Zumbi') {
      assert(subdocNames.includes('Fraqueza Zumbi'), `Mantícora Zumbi possui poder Fraqueza Zumbi`);
      assert(subdocNames.includes('Mordida'), `Mantícora Zumbi possui ataque de Mordida`);
      assert(subdocNames.includes('Duas Garras'), `Mantícora Zumbi possui ataque de Duas Garras`);
    }

    if (req.name === 'Morrise') {
      assert(subdocNames.includes('Passo Sombrio'), `Morrise possui poder Passo Sombrio`);
      assert(subdocNames.includes('Transferir Sofrimento'), `Morrise possui poder Transferir Sofrimento`);
      assert(spellCount === 5, `Morrise possui exatamente 5 magias individuais como itens de tipo "magia" (encontradas ${spellCount})`);
    }

    // Caçador de Condenados tem 5 armas (Cimitarra, Foice, Maça, Machadinha, Cauda)
    if (req.name === 'Caçador de Condenados') {
      assert(weaponCount >= 5, `Caçador de Condenados possui todas as 5 armas/cauda (esperado >=5, obtido ${weaponCount})`);
    }

    // Validação de Token 2MTT
    const tokenSrc = doc.prototypeToken?.texture?.src;
    assert(tokenSrc && tokenSrc.startsWith('modules/compendios-para-t20/assets/tokens/'), `Token configurado em ${req.name}: ${tokenSrc}`);
    const tokenRel = tokenSrc.replace('modules/compendios-para-t20/', '');
    const tokenPath = path.join(__dirname, '..', tokenRel);
    assert(fs.existsSync(tokenPath), `Arquivo físico do token existe: ${tokenRel}`);

    // Validação da Biografia Canônica
    const bio = doc.system?.detalhes?.biography?.value || '';
    assert(bio.includes('#800000') && bio.includes('#006400'), `Citações duplas presentes na bio de ${req.name}`);
    assert(bio.includes('font-style: italic;') && bio.includes('blockquote'), `Blockquotes em itálico presentes na bio de ${req.name}`);

    console.log(`  ✓ Ator "${req.name}" (ND ${req.nd}) 100% canônico.`);
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens, Classes e Poderes da DB #231 (Itens_T20) ---');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  const requiredItems = [
    { id: 'i8231MiragemClas', name: 'Classe Variante: Miragem', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231DancaAreiaA', name: 'Dança da Areia', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'i8231CortinaPoeA', name: 'Cortina de Poeira', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231PassoDeserA', name: 'Passo do Deserto', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231MestreDeser', name: 'Mestre do Deserto', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231ArsenalDesA', name: 'Arsenal do Deserto', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'i8231EscaramDist', name: 'Escaramuça Distante', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231PassoDuploA', name: 'Passo Duplo', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231PassosPrecA', name: 'Passos Precisos', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'i8231TesourosNat', name: 'Tesouros da Natureza', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231CancaoPedrA', name: 'Canção da Pedra', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231SahiriAnimA', name: 'Sahiri: Animar Rochas', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231SahiriProtA', name: 'Sahiri: Proteção da Terra', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231OrigCriancA', name: 'Origem: Criança do Crepúsculo', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 0 },
    { id: 'i8231OrigNascEst', name: 'Origem: Nascido nas Estepes', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'i8231OrigNomadFe', name: 'Origem: Nômade Ferani', type: 'poder', folder: '6HZCPG5QrmzhwmBe', minEff: 1 },
    { id: 'i8231PresaOnixAA', name: 'Presa de Ônix', type: 'equipamento', folder: 'f9rwHA7dJnFLVQH1', minEff: 0 },
    { id: 'i8231SimbAzgherA', name: 'Símbolo Sagrado de Azgher', type: 'equipamento', folder: 'f9rwHA7dJnFLVQH1', minEff: 0 }
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

    assert(doc.name === req.name, `Nome correto: esperado "${req.name}", obtido "${doc.name}"`);
    assert(doc.type === req.type, `Tipo correto para ${req.name}: esperado ${req.type}, obtido ${doc.type}`);
    assert(doc.folder === req.folder, `Pasta correta em ${req.name}: esperado ${req.folder}, obtido ${doc.folder}`);
    assert(Boolean(doc.system?.description?.value), `system.description.value preenchido em ${req.name}`);

    // Validação de ActiveEffects
    assert(Array.isArray(doc.effects), `doc.effects é array em ${req.name}`);
    assert(doc.effects.length >= req.minEff, `doc.effects possui mínimo de efeitos em ${req.name} (${doc.effects.length} >= ${req.minEff})`);

    for (const effId of doc.effects) {
      assert(typeof effId === 'string' && effId.length >= 8, `ID de efeito válido (${effId}) em ${req.name}`);
      const effKey = `!items.effects!${req.id}.${effId}`;
      let effDoc;
      try {
        effDoc = await db.get(effKey);
      } catch {
        assert(false, `Subdocumento de efeito ${effKey} NÃO encontrado no LevelDB.`);
        continue;
      }
      assert(effDoc && effDoc.name, `Subdocumento de efeito válido em ${effKey}`);
    }
    console.log(`  ✓ Item "${req.name}" (${req.type}) com ${doc.effects.length} efeitos 100% canônico.`);
  }

  await db.close();
}

async function validateJournalsAndTables() {
  console.log('\n--- 3. Validando Diários e Tabelas de Rolagem da DB #231 ---');
  const dbJournals = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  const requiredJournals = [
    { id: 'j8231HalakTurAAA', name: 'A Vastidão Dourada de Halak-Tûr (DB #231)', minPages: 9 },
    { id: 'j8231CircoSombrA', name: 'Aventura: Circo Sombrio (DB #231)', minPages: 6 },
    { id: 'j8231Gazeta163AA', name: 'Gazeta do Reinado — Edição 163 (DB #231)', minPages: 2 }
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
    { id: 't8231PrevSelinaA', name: 'Previsões de Selina (DB #231)', minResults: 3 },
    { id: 't8231EncDiurnosA', name: 'Encontros Diurnos em Halak-Tûr (DB #231)', minResults: 6 },
    { id: 't8231EncNoturnAA', name: 'Encontros Noturnos em Halak-Tûr (DB #231)', minResults: 6 },
    { id: 't8231GanchosDesA', name: 'Ganchos de Aventura em Halak-Tûr (DB #231)', minResults: 6 }
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
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — DRAGÃO BRASIL #231');
  console.log('================================================================================\n');

  await validateActors();
  await validateItems();
  await validateJournalsAndTables();

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da DB #231 estão em conformidade canônica estrita!');
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

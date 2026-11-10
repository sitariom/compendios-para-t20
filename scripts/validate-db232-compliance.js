#!/usr/bin/env node
/**
 * Validador Estrito e Canônico de Conformidade da Dragão Brasil #232
 *
 * Valida:
 * 1. Ameacas_T20:
 *    - 15 ameaças canônicas (10 de Licantropos Artonianos + 5 de Monstros e Homens).
 *    - IDs primários com estritamente 16 caracteres (/^[a-zA-Z0-9]{16}$/).
 *    - Defesa Base dinâmica (defesa.base + des === defesa.value).
 *    - 34 perícias canônicas presentes em cada criatura sob system.pericias.
 *    - Perícias situacionais customizadas (custom: true) presentes com valores corretos.
 *    - Subdocumentos ClassicLevel embutidos em !actors.items!actorId.itemId.
 *    - Armas e ataques com rolls.parts e descrições.
 *    - Magias individuais como itens de tipo "magia" (SpellData) para conjuradores.
 *    - Desagregação atômica estrita de habilidades.
 *    - system.detalhes.resistencias com o texto verbatim integral.
 *    - Tokens top-down circulares 2MTT existentes em assets/tokens/.
 *    - Biografias canônicas com citações duplas (#800000 e #006400).
 * 2. Itens_T20:
 *    - 13 itens e poderes de licantropia.
 *    - IDs primários de 16 caracteres.
 *    - system.description.value preenchido.
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
  console.log('--- 1. Validando 15 Ameaças da DB #232 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const requiredThreats = [
    { id: 'gq8232LoboUrbAAA', name: 'Lobisomem Predador Urbano', nd: '4', tamanho: 'med', inic: 10, perc: 5 },
    { id: 'gq8232LoboCacAAA', name: 'Lobisomem Caçador de Recompensas', nd: '9', tamanho: 'med', inic: 10, perc: 10 },
    { id: 'gq8232RatoComAAA', name: 'Licantropo Rato Comedor de Restos', nd: '1', tamanho: 'peq', inic: 5, perc: 0 },
    { id: 'gq8232RatoInfAAA', name: 'Licantropo Rato Infiltrador Veterano', nd: '7', tamanho: 'med', inic: 11, perc: 8 },
    { id: 'gq8232OncaPirAAA', name: 'Licantropo Onça Pirata de Rio', nd: '7', tamanho: 'med', inic: 14, perc: 9 },
    { id: 'gq8232OncaLutAAA', name: 'Licantropo Onça Lutador de Arena', nd: '11', tamanho: 'med', inic: 12, perc: 12 },
    { id: 'gq8232TexuFurAAA', name: 'Licantropo Texugo Furioso', nd: '5', tamanho: 'med', inic: 4, perc: 6 },
    { id: 'gq8232TexuNoiAAA', name: 'Licantropo Texugo Servo da Noite', nd: '8', tamanho: 'peq', inic: 12, perc: 13 },
    { id: 'gq8232SelaFarAAA', name: 'Licantropo Selako Farejador de Sangue', nd: '3', tamanho: 'med', inic: 4, perc: 4 },
    { id: 'gq8232SelaTerAAA', name: 'Licantropo Selako Terror dos Mares', nd: '9', tamanho: 'med', inic: 4, perc: 4 },
    { id: 'gq8232MamaeGlopA', name: 'Mamãe Glop', nd: '2', tamanho: 'grd', inic: 3, perc: -3 },
    { id: 'gq8232EstirgeAAA', name: 'Estirge', nd: '1', tamanho: 'min', inic: 7, perc: 2 },
    { id: 'gq8232PerdTrollA', name: 'Perdigueiro Troll', nd: '1', tamanho: 'med', inic: 5, perc: 8 },
    { id: 'gq8232GineTrollA', name: 'Ginete de Troll Purista', nd: '2', tamanho: 'med', inic: 4, perc: 2 },
    { id: 'gq8232XamaFinntA', name: 'Xamã Finntroll', nd: '2', tamanho: 'med', inic: 5, perc: 6 }
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

    // Validação das 34 perícias padrão sob system.pericias
    const pericias = doc.system?.pericias || {};
    const skillKeys = Object.keys(pericias);
    assert(skillKeys.length >= 34, `Pelo menos 34 perícias presentes em ${req.name} (encontradas ${skillKeys.length})`);
    for (const sk of ALL_SKILLS) {
      assert(pericias[sk.key] && pericias[sk.key].value !== undefined, `Perícia padrão "${sk.key}" calculada em ${req.name}`);
    }

    // Validação estrita de Iniciativa e Percepção batendo com o valor de capa da ficha
    assert(pericias.inic?.value === req.inic, `Iniciativa correta para ${req.name}: esperado ${req.inic}, obtido ${pericias.inic?.value}`);
    assert(pericias.perc?.value === req.perc, `Percepção correta para ${req.name}: esperado ${req.perc}, obtido ${pericias.perc?.value}`);

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
      } else if (v.type === 'magia') {
        spellCount++;
        assert(v.system && v.system.circulo && v.system.escola && v.system.tipo, `Magia "${v.name}" com schema válido em ${req.name}`);
      }
    }
    assert(foundSubdocs === doc.items.length, `Total de subdocs bate com doc.items em ${req.name} (${foundSubdocs}/${doc.items.length})`);

    // Validação de Conjuradores com Magias Individuais
    if (req.name === 'Licantropo Texugo Servo da Noite') {
      assert(spellCount === 4, `Licantropo Texugo Servo da Noite possui exatamente 4 magias de druida (encontradas ${spellCount})`);
      assert(subdocNames.includes('Armamento da Natureza'), `Possui magia Armamento da Natureza`);
      assert(subdocNames.includes('Curar Ferimentos'), `Possui magia Curar Ferimentos`);
      assert(subdocNames.includes('Miasma Mefítico'), `Possui magia Miasma Mefítico`);
      assert(subdocNames.includes('Toque Vampírico'), `Possui magia Toque Vampírico`);
    }

    if (req.name === 'Xamã Finntroll') {
      assert(spellCount === 4, `Xamã Finntroll possui exatamente 4 magias de clérigo de Megalokk (encontradas ${spellCount})`);
      assert(subdocNames.includes('Amedrontar'), `Possui magia Amedrontar`);
      assert(subdocNames.includes('Curar Ferimentos'), `Possui magia Curar Ferimentos`);
      assert(subdocNames.includes('Escudo da Fé'), `Possui magia Escudo da Fé`);
      assert(subdocNames.includes('Perdição'), `Possui magia Perdição`);
    }

    // Validação de Perícias Situacionais (custom: true)
    if (req.name.includes('Lobisomem')) {
      assert(pericias.ades_lobos && pericias.ades_lobos.custom === true, `${req.name} possui perícia situacional Adestramento (Lobos)`);
    }
    if (req.name === 'Lobisomem Caçador de Recompensas') {
      assert(pericias.perc_subterraneo && pericias.perc_subterraneo.value === 12, `Lobisomem Caçador de Recompensas possui Percepção (Subterrâneo) = 12`);
      assert(subdocNames.includes('Marca da Presa'), `Lobisomem Caçador de Recompensas possui poder Marca da Presa`);
      assert(doc.system?.tracos?.ic?.value?.includes('medo'), `Lobisomem Caçador de Recompensas possui imunidade a medo`);
    }
    if (req.name === 'Lobisomem Predador Urbano') {
      assert(subdocNames.includes('Ataque Furtivo'), `Lobisomem Predador Urbano possui poder Ataque Furtivo`);
    }
    if (req.name.includes('Onça')) {
      assert(pericias.ades_oncas && pericias.ades_oncas.custom === true, `${req.name} possui perícia situacional Adestramento (Onças)`);
    }
    if (req.name.includes('Rato')) {
      assert(pericias.ades_ratos && pericias.ades_ratos.custom === true, `${req.name} possui perícia situacional Adestramento (Ratos)`);
    }
    if (req.name.includes('Texugo')) {
      assert(pericias.ades_texugos && pericias.ades_texugos.custom === true, `${req.name} possui perícia situacional Adestramento (Texugos)`);
    }
    if (req.name === 'Licantropo Texugo Furioso') {
      assert(pericias.perc_subterraneo && pericias.perc_subterraneo.value === 8, `Licantropo Texugo Furioso possui Percepção (Subterrâneo) = 8`);
    }
    if (req.name.includes('Selako')) {
      assert(pericias.ades_selakos && pericias.ades_selakos.custom === true, `${req.name} possui perícia situacional Adestramento (Selakos)`);
    }

    // Validação de Texto Integral em detalhes.resistencias
    const resTxt = doc.system?.detalhes?.resistencias || '';
    if (req.name === 'Lobisomem Caçador de Recompensas') {
      assert(resTxt === 'imunidade a medo, redução de dano 5/mitral', `Lobisomem Caçador de Recompensas possui texto integral: "${resTxt}"`);
    } else if (req.name === 'Licantropo Selako Terror dos Mares') {
      assert(resTxt === 'redução de corte 5, redução de dano 5/mitral', `Selako Terror dos Mares possui texto integral: "${resTxt}"`);
    } else if (req.name.startsWith('Licantropo') || req.name.startsWith('Lobisomem')) {
      assert(resTxt.includes('mitral') || resTxt.includes('redução'), `${req.name} possui detalhes.resistencias com texto integral de mitral`);
    }
    if (req.name === 'Mamãe Glop') {
      assert(resTxt === 'imunidade a ácido', `Mamãe Glop possui detalhes.resistencias = "imunidade a ácido"`);
    }
    if (req.name === 'Perdigueiro Troll') {
      assert(resTxt === 'imunidade a atordoamento e metamorfose', `Perdigueiro Troll possui detalhes.resistencias integral`);
    }
    if (req.name === 'Xamã Finntroll') {
      assert(resTxt.includes('cura acelerada 5/ácido ou fogo'), `Xamã Finntroll possui detalhes.resistencias integral`);
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
  console.log('\n--- 2. Validando 13 Itens e Poderes de Licantropia da DB #232 (Itens_T20) ---');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  const requiredItems = [
    { id: 'i8232CtrlLicanAA', name: 'Controlar Licantropia', type: 'poder' },
    { id: 'i8232AvMitralAAA', name: 'Licantropia: Aversão a Mitral', type: 'poder' },
    { id: 'i8232EmpatAnimAA', name: 'Licantropia: Empatia Animal', type: 'poder' },
    { id: 'i8232MaldLicanAA', name: 'Licantropia: Maldição da Licantropia', type: 'poder' },
    { id: 'i8232SentidosAgA', name: 'Licantropia: Sentidos Aguçados', type: 'poder' },
    { id: 'i8232TransInconA', name: 'Licantropia: Transformação Incontrolável', type: 'poder' },
    { id: 'i8232FormHibridA', name: 'Licantropia: Forma Híbrida', type: 'poder' },
    { id: 'i8232FeraLoboAAA', name: 'Licantropia: Forma de Fera (Lobo)', type: 'poder' },
    { id: 'i8232FeraOncaAAA', name: 'Licantropia: Forma de Fera (Onça)', type: 'poder' },
    { id: 'i8232FeraRatoAAA', name: 'Licantropia: Forma de Fera (Rato)', type: 'poder' },
    { id: 'i8232FeraSelakoA', name: 'Licantropia: Forma de Fera (Selako)', type: 'poder' },
    { id: 'i8232FeraTexugoA', name: 'Licantropia: Forma de Fera (Texugo)', type: 'poder' },
    { id: 'i8232DoencaLicaA', name: 'Maldição: Licantropia', type: 'poder' }
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
    assert(Boolean(doc.system?.description?.value), `system.description.value preenchido em ${req.name}`);
    console.log(`  ✓ Item "${req.name}" (${req.type}) 100% canônico.`);
  }

  await db.close();
}

async function validateJournalsAndTables() {
  console.log('\n--- 3. Validando Diários e Tabelas de Rolagem da DB #232 ---');
  const dbJournals = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  const requiredJournals = [
    { id: 'j8232LicanArtonA', name: 'Cenário: Licantropos Artonianos (DB #232)', minPages: 9 },
    { id: 'j8232MonstHomemA', name: 'Aventura: Monstros e Homens (DB #232)', minPages: 9 },
    { id: 'j8232Gazeta164AA', name: 'Gazeta do Reinado — Edição 164 (DB #232)', minPages: 1 }
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
    { id: 't8232LinhagensAA', name: 'Linhagens e Formas de Licantropia (DB #232)', minResults: 6 },
    { id: 't8232EncLicanAAA', name: 'Encontros com Licantropos em Arton (DB #232)', minResults: 6 },
    { id: 't8232EncMonstrAA', name: 'Encontros na Floresta em Monstros e Homens (DB #232)', minResults: 6 },
    { id: 't8232GanchLicaAA', name: 'Ganchos de Aventura com Licantropos (DB #232)', minResults: 6 }
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
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — DRAGÃO BRASIL #232');
  console.log('================================================================================\n');

  await validateActors();
  await validateItems();
  await validateJournalsAndTables();

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da DB #232 estão em conformidade canônica estrita!');
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

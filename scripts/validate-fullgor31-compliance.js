#!/usr/bin/env node
/**
 * Suíte de Validação Estrita de Conformidade: Fúlgor dos Deuses — Edição 31 (Pecados do Pai)
 */

const { openMergedPackView } = require('./pack-discovery');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let errors = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ FALHA: ${message}`);
    errors++;
  }
}

async function validateThreats() {
  console.log('\n--- 1. Validando Ameaças e Perigos da Edição 31 (rt20-031-ameacas) ---');
  const db = openMergedPackView('Actor', ROOT_DIR);
  await db.open();

  const EXPECTED_THREATS = [
    {
      id: 'fld31IscoFullgor',
      name: 'Isco do Fullgor',
      nd: '11',
      cd: 33,
      pv: 400,
      pm: 0,
      defesa: 41,
      des: 2,
      baseDef: 39,
      dim: 2,
      token: 'modules/compendios-para-t20/assets/tokens/isco-do-fullgor.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Natureza Vegetal', 'Agarrar Aprimorado', 'Adaptação Fullgori', 'Pancada Estonteante', 'Preparação Mutável', 'Pólen Dourado', 'Núcleo Luminoso']
    },
    {
      id: 'fld31JardineiroD',
      name: 'Jardineiro Dourado',
      nd: '11',
      cd: 33,
      pv: 385,
      pm: 49,
      defesa: 35,
      des: 2,
      baseDef: 33,
      dim: 1,
      token: 'modules/compendios-para-t20/assets/tokens/jardineiro-dourado.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Natureza Vegetal', 'Adaptado ao Ambiente', 'Chamado do Fullgor', 'Subverter Natureza', 'Vulnerabilidade à Natureza'],
      spells: ['Armamento da Natureza', 'Controlar Plantas', 'Despedaçar', 'Escudo da Fé', 'Silêncio', 'Tranquilidade']
    },
    {
      id: 'fld31LisandraDet',
      name: 'Lisandra Deturpada',
      nd: '13',
      cd: 35,
      pv: 455,
      pm: 62,
      defesa: 45,
      des: 3,
      baseDef: 42,
      dim: 1,
      token: 'modules/compendios-para-t20/assets/tokens/lisandra-deturpada.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Chuva de Estacas', 'Criar Toscos', 'Força da Natureza', 'Forma de Madeira', 'Magia Acelerada'],
      spells: ['Controlar Plantas', 'Curar Ferimentos', 'Dissipar Magia', 'Raio Polar', 'Libertação']
    }
  ];

  for (const exp of EXPECTED_THREATS) {
    const actorRaw = await db.get(`!actors!${exp.id}`).catch(() => null);
    assert(actorRaw !== null, `Ator [${exp.id}] ${exp.name} deve existir no LevelDB`);
    if (!actorRaw) continue;

    assert(db.isHierarchicalDoc(exp.id), `Ator "${exp.name}" deve estar em pack hierárquico`);
    assert(actorRaw.name === exp.name, `Nome do ator [${exp.id}] deve ser "${exp.name}"`);
    const actorNd = actorRaw.system?.attributes?.nd || actorRaw.system?.nd;
    assert(actorNd === exp.nd, `ND de "${exp.name}" deve ser ${exp.nd} (obtido: ${actorNd})`);
    assert(actorRaw.system?.attributes?.cd === exp.cd, `CD de "${exp.name}" deve ser ${exp.cd} (obtido: ${actorRaw.system?.attributes?.cd})`);
    assert(actorRaw.system?.attributes?.pv?.value === exp.pv, `PV de "${exp.name}" deve ser ${exp.pv}`);
    assert(actorRaw.system?.attributes?.pm?.value === exp.pm, `PM de "${exp.name}" deve ser ${exp.pm}`);
    assert(actorRaw.system?.attributes?.defesa?.value === exp.defesa, `Defesa de "${exp.name}" deve ser ${exp.defesa}`);
    assert(actorRaw.system?.attributes?.defesa?.base === exp.baseDef, `Defesa base de "${exp.name}" deve ser ${exp.baseDef}`);
    assert(
      (actorRaw.system?.attributes?.defesa?.base || 0) + (actorRaw.system?.atributos?.des?.value || 0) === actorRaw.system?.attributes?.defesa?.value,
      `Defesa dinâmica de "${exp.name}" fecha: base + des = value`
    );

    const skillKeys = Object.keys(actorRaw.system?.pericias || {});
    assert(skillKeys.length >= 34, `"${exp.name}" deve ter pelo menos 34 perícias (obtido: ${skillKeys.length})`);

    assert(actorRaw.prototypeToken?.texture?.src === exp.token, `Token 2MTT de "${exp.name}" deve ser "${exp.token}"`);
    assert(actorRaw.prototypeToken?.width === exp.dim && actorRaw.prototypeToken?.height === exp.dim, `Dimensão do token de "${exp.name}" deve ser ${exp.dim}x${exp.dim}`);
    const localToken = path.join(__dirname, '..', exp.token.replace('modules/compendios-para-t20/', ''));
    assert(fs.existsSync(localToken), `Arquivo local de token "${localToken}" deve existir`);

    const subDocs = [];
    for (const itemId of actorRaw.items || []) {
      const doc = await db.get(`!actors.items!${exp.id}.${itemId}`).catch(() => null);
      assert(doc !== null, `Subdocumento !actors.items!${exp.id}.${itemId} deve existir`);
      if (doc) subDocs.push(doc);
    }

    const subNames = subDocs.map(d => d.name);
    for (const p of exp.powers) {
      assert(subNames.includes(p), `Poder atômico "${p}" presente em "${exp.name}"`);
    }
    if (exp.spells) {
      for (const s of exp.spells) {
        assert(subDocs.some(d => d.name === s && d.type === 'magia'), `Magia "${s}" presente em "${exp.name}"`);
      }
    }
    console.log(`  ✓ Ator "${exp.name}" (ND ${exp.nd}) auditado com 100% de conformidade.`);
  }

  for (const [hId, expNd] of [
    ['fld31RastrosCaca', '11'],
    ['fld31NaturezaDet', '11'],
    ['fld31EnxameFullg', '9'],
    ['fld31SantuarioSo', '11'],
    ['fld31CorrentesIn', '11']
  ]) {
    const hDoc = await db.get(`!actors!${hId}`).catch(() => null);
    assert(hDoc !== null && hDoc.type === 'hazard' && hDoc.system?.attributes?.nd === expNd, `Perigo [${hId}] existe como hazard ND ${expNd}`);
    if (hDoc) console.log(`  ✓ Perigo "${hDoc.name}" auditado com sucesso.`);
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Equipamentos e Parceiros da Edição 31 ---');
  const db = openMergedPackView('Item', ROOT_DIR);
  await db.open();

  const EXPECTED_ITEMS = [
    { id: 'fld31EstilhaFull', name: 'Estilhas Cristalinas do Fullgor (Edição 31)', type: 'equipamento' },
    { id: 'fld31ParcLisandr', name: 'Parceira: Lisandra de Allihanna (Gratidão Plena — Mestre Tripla)', type: 'poder', hasEffect: true },
    { id: 'fld31BencaoLisDi', name: 'Vínculo de Greenleaf: Bênção de Lisandra', type: 'poder', hasEffect: true }
  ];

  for (const exp of EXPECTED_ITEMS) {
    assert(/^[a-zA-Z0-9]{16}$/.test(exp.id), `ID 16 chars válido: ${exp.id}`);
    const itemDoc = await db.get(`!items!${exp.id}`).catch(() => null);
    assert(itemDoc !== null, `Item [${exp.id}] "${exp.name}" existe`);
    if (!itemDoc) continue;
    assert(db.isHierarchicalDoc(exp.id), `Item "${exp.name}" está em pack hierárquico`);
    assert(itemDoc.name === exp.name && itemDoc.type === exp.type, `Item "${exp.name}" tem tipo "${exp.type}"`);
    if (exp.hasEffect) {
      assert(Array.isArray(itemDoc.effects) && itemDoc.effects.length > 0, `Item "${exp.name}" possui efeitos`);
      for (const effId of itemDoc.effects) {
        const effDoc = await db.get(`!items.effects!${exp.id}.${effId}`).catch(() => null);
        assert(effDoc !== null && Array.isArray(effDoc.changes) && effDoc.changes.length > 0, `Efeito ${effId} de "${exp.name}" existe com changes[]`);
      }
    }
    console.log(`  ✓ Item "${exp.name}" (${exp.type}) validado.`);
  }

  await db.close();
}

async function validateJournals() {
  console.log('\n--- 3. Validando Diário da Edição 31 (rt20-031-diarios) ---');
  const db = openMergedPackView('JournalEntry', ROOT_DIR);
  await db.open();

  const journalId = 'fld31DiarioPecad';
  const jDoc = await db.get(`!journal!${journalId}`).catch(() => null);
  assert(jDoc !== null && jDoc.pages?.length === 7, `Diário [${journalId}] deve ter 7 páginas`);
  if (jDoc) {
    assert(db.isHierarchicalDoc(journalId), 'Diário em pack hierárquico');
    for (const pid of jDoc.pages) {
      assert(/^[a-zA-Z0-9]{16}$/.test(pid), `Página ${pid} tem 16 chars`);
      const pDoc = await db.get(`!journal.pages!${journalId}.${pid}`).catch(() => null);
      assert(pDoc !== null && pDoc.text?.content?.length > 50, `Página ${pid} válida`);
    }
    console.log(`  ✓ Diário "${jDoc.name}" validado com 7 páginas.`);
  }

  await db.close();
}

async function validateTables() {
  console.log('\n--- 4. Validando Tabelas da Edição 31 (rt20-031-tabelas) ---');
  const db = openMergedPackView('RollTable', ROOT_DIR);
  await db.open();

  const EXPECTED_TABLES = [
    { id: 'fld31TabFrasesLi', name: 'Lisandra Deturpada — Frases de Combate (Edição 31)', count: 10 },
    { id: 'fld31TabPesoPres', name: 'O Peso da Presença — Resultados com Lisandra (Edição 31)', count: 4 },
    { id: 'fld31TabRecompGr', name: 'Gratidão de Allihanna — Recompensas por Deturpação (Edição 31)', count: 4 }
  ];

  for (const exp of EXPECTED_TABLES) {
    const tDoc = await db.get(`!tables!${exp.id}`).catch(() => null);
    assert(tDoc !== null && tDoc.results?.length === exp.count, `Tabela "${exp.name}" deve ter ${exp.count} resultados`);
    if (tDoc) {
      assert(db.isHierarchicalDoc(exp.id), `Tabela "${exp.name}" em pack hierárquico`);
      for (const rid of tDoc.results) {
        assert(/^[a-zA-Z0-9]{16}$/.test(rid), `Resultado ${rid} tem 16 chars`);
        const rDoc = await db.get(`!tables.results!${exp.id}.${rid}`).catch(() => null);
        assert(rDoc !== null && rDoc.name && rDoc.text, `Resultado ${rid} válido`);
      }
      console.log(`  ✓ Tabela "${exp.name}" validada com ${exp.count} resultados.`);
    }
  }

  await db.close();
}

async function validateMacros() {
  console.log('\n--- 5. Validando Macro da Edição 31 (rt20-031-macros) ---');
  const db = openMergedPackView('Macro', ROOT_DIR);
  await db.open();

  const mDoc = await db.get('!macros!fld31MacroPecado').catch(() => null);
  assert(mDoc !== null && mDoc.type === 'script' && mDoc.command?.length > 100, 'Macro fld31MacroPecado válida');
  if (mDoc) {
    assert(db.isHierarchicalDoc('fld31MacroPecado'), 'Macro em pack hierárquico');
    console.log(`  ✓ Macro "${mDoc.name}" validada.`);
  }

  await db.close();
}

async function main() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — FÚLGOR DOS DEUSES (EDIÇÃO 31)');
  console.log('================================================================================');

  await validateThreats();
  await validateItems();
  await validateJournals();
  await validateTables();
  await validateMacros();

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${errors}`);
  if (errors === 0) {
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da Edição 31 estão em conformidade canônica estrita!');
  } else {
    console.error('⚠️ ALERTA: Foram detectadas não-conformidades na Edição 31.');
  }
  console.log('================================================================================\n');

  process.exit(errors === 0 ? 0 : 1);
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Falha fatal na validação:', err);
    process.exit(1);
  });
}

module.exports = { main };

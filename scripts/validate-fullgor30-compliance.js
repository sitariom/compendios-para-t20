#!/usr/bin/env node
/**
 * Suíte de Validação Estrita de Conformidade: Fúlgor dos Deuses — Edição 30 (Guerra e Paz)
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
  console.log('\n--- 1. Validando Ameaças, NPCs e Perigos da Edição 30 (rt20-030-ameacas) ---');
  const db = openMergedPackView('Actor', ROOT_DIR);
  await db.open();

  const EXPECTED_THREATS = [
    {
      id: 'fld30ElanorLumVA',
      name: 'Elanor Lúmen-Velho',
      nd: '8',
      cd: 28,
      pv: 228,
      pm: 0,
      defesa: 31,
      des: 4,
      baseDef: 27,
      dim: 1,
      token: 'modules/compendios-para-t20/assets/tokens/elanor-lumen-velho.png',
      powers: ['Aura de Paz', 'Integridade Corporal', 'Técnica da Mão Vazia', 'Sair do Caminho']
    },
    {
      id: 'fld30DaliriaMara',
      name: 'Dalíria de Marah',
      nd: '8',
      cd: 28,
      pv: 214,
      pm: 54,
      defesa: 28,
      des: 3,
      baseDef: 25,
      dim: 1,
      token: 'modules/compendios-para-t20/assets/tokens/daliria-de-marah.png',
      powers: ['Aparência Inofensiva', 'Transe Dançante'],
      spells: ['Curar Ferimentos', 'Dissipar Magia', 'Escudo da Fé', 'Luz', 'Tranquilidade']
    },
    {
      id: 'fld30DevotoMarah',
      name: 'Devoto de Marah Fullgori',
      nd: '6',
      cd: 22,
      pv: 48,
      pm: 0,
      defesa: 26,
      des: 2,
      baseDef: 24,
      dim: 1,
      token: 'modules/compendios-para-t20/assets/tokens/devoto-marah-fullgori.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Aura de Desinteresse', 'Remorso Existencial', 'Toque Pacificador']
    },
    {
      id: 'fld30CoralBranco',
      name: 'Coral Branco',
      nd: '10',
      cd: 30,
      pv: 600,
      pm: 0,
      defesa: 33,
      des: -5,
      baseDef: 38,
      dim: 4,
      token: 'modules/compendios-para-t20/assets/tokens/coral-branco.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Enxame (Perda de PM)', 'Maior que a Morte', 'Anular a Vontade', 'Fim da Dor', 'Paz sem Voz', 'Remorso Existencial', 'Reduzir ao Nada']
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

  for (const hId of ['fld30VidenciaCin', 'fld30JulgamentoM', 'fld30NadaExpansa']) {
    const hDoc = await db.get(`!actors!${hId}`).catch(() => null);
    assert(hDoc !== null && hDoc.type === 'hazard' && hDoc.system?.attributes?.nd === '10', `Perigo [${hId}] existe como hazard ND 10`);
    if (hDoc) console.log(`  ✓ Perigo "${hDoc.name}" auditado com sucesso.`);
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Equipamentos, Parceiros e Favores da Edição 30 ---');
  const db = openMergedPackView('Item', ROOT_DIR);
  await db.open();

  const EXPECTED_ITEMS = [
    { id: 'fld30EstilhaFull', name: 'Estilhas Cristalinas do Fullgor (Edição 30)', type: 'equipamento' },
    { id: 'fld30ParcElanorA', name: 'Parceiro: Elanor Lúmen-Velho (Veterano Especial)', type: 'poder' },
    { id: 'fld30ParcDaliria', name: 'Parceira: Dalíria de Marah (Veterana Especial)', type: 'poder', hasEffect: true },
    { id: 'fld30FavorDamaBr', name: 'Favor da Dama Branca (Santuário de Marah)', type: 'poder' },
    { id: 'fld30FavorDonzel', name: 'Favor da Donzela Deslumbrante (Santuário de Marah)', type: 'poder' },
    { id: 'fld30SentencaFav', name: 'Sentença de Valkaria: Favor de Arsenal / Favor de Marah', type: 'poder', hasEffect: true }
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
  console.log('\n--- 3. Validando Diário da Edição 30 (rt20-030-diarios) ---');
  const db = openMergedPackView('JournalEntry', ROOT_DIR);
  await db.open();

  const journalId = 'fld30DiarioGuerr';
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
  console.log('\n--- 4. Validando Tabelas da Edição 30 (rt20-030-tabelas) ---');
  const db = openMergedPackView('RollTable', ROOT_DIR);
  await db.open();

  const EXPECTED_TABLES = [
    { id: 'fld30TabFrasesDv', name: 'Devotos Fullgori — Frases em Combate (Edição 30)', count: 10 },
    { id: 'fld30TabFrasesCo', name: 'Coral Branco — Frases em Combate (Edição 30)', count: 10 },
    { id: 'fld30TabPresenca', name: 'A Presença — Eventos Espirituais de Thalgrimm (Edição 30)', count: 4 }
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
  console.log('\n--- 5. Validando Macro da Edição 30 (rt20-030-macros) ---');
  const db = openMergedPackView('Macro', ROOT_DIR);
  await db.open();

  const mDoc = await db.get('!macros!fld30MacroGuerra').catch(() => null);
  assert(mDoc !== null && mDoc.type === 'script' && mDoc.command?.length > 100, 'Macro fld30MacroGuerra válida');
  if (mDoc) {
    assert(db.isHierarchicalDoc('fld30MacroGuerra'), 'Macro em pack hierárquico');
    console.log(`  ✓ Macro "${mDoc.name}" validada.`);
  }

  await db.close();
}

async function main() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — FÚLGOR DOS DEUSES (EDIÇÃO 30)');
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
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da Edição 30 estão em conformidade canônica estrita!');
  } else {
    console.error('⚠️ ALERTA: Foram detectadas não-conformidades na Edição 30.');
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

#!/usr/bin/env node
/**
 * Suíte de Validação Estrita de Conformidade: Fúlgor dos Deuses — Edição 28 (Aço e Arcano)
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
  console.log('\n--- 1. Validando Ameaças e Perigo da Edição 28 (Ameacas_T20) ---');
  const db = openMergedPackView('Actor', ROOT_DIR);
  await db.open();

  const EXPECTED_THREATS = [
    {
      id: 'fld28LiriavelQui',
      name: 'Liriavel, Forma de Quimera',
      nd: '8',
      cd: 26,
      pv: 333,
      pm: 0,
      defesa: 33,
      des: 3,
      baseDef: 30,
      dim: 2,
      token: 'modules/compendios-para-t20/assets/tokens/liriavel-forma-de-quimera.png',
      powers: ['Mente Tripla', 'Cabeça de Bode', 'Cabeça de Dragão', 'Cabeça de Leão']
    },
    {
      id: 'fld28RashidFullg',
      name: 'Rashid, Fullgori',
      nd: '7',
      cd: 30,
      pv: 280,
      pm: 57,
      defesa: 34,
      des: 1,
      baseDef: 33,
      dim: 2,
      token: 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Criatura do Fullgor', 'Contramágica Aprimorada', 'Magia Acelerada', 'Zelador da Academia Arcana'],
      spells: ['Amarras Etéreas', 'Controlar Terra', 'Dissipar Magia', 'Jato Corrosivo'],
      spellCosts: {
        'Amarras Etéreas': 6,
        'Controlar Terra': 5,
        'Dissipar Magia': 3,
        'Jato Corrosivo': 9
      },
      spellRolls: ['Amarras Etéreas', 'Jato Corrosivo']
    }
  ];

  for (const exp of EXPECTED_THREATS) {
    let actorRaw = null;
    try {
      actorRaw = await db.get(`!actors!${exp.id}`);
    } catch {}

    assert(actorRaw !== null, `Ator [${exp.id}] ${exp.name} deve existir no LevelDB`);
    if (!actorRaw) continue;

    assert(actorRaw.name === exp.name, `Nome do ator [${exp.id}] deve ser "${exp.name}"`);
    const actorNd = actorRaw.system?.attributes?.nd || actorRaw.system?.nd;
    assert(actorNd === exp.nd, `ND de "${exp.name}" deve ser ${exp.nd} (obtido: ${actorNd})`);
    assert(actorRaw.system?.attributes?.cd === exp.cd, `CD de "${exp.name}" deve ser ${exp.cd} (obtido: ${actorRaw.system?.attributes?.cd})`);
    assert(actorRaw.system?.attributes?.pv?.value === exp.pv, `PV de "${exp.name}" deve ser ${exp.pv}`);
    assert(actorRaw.system?.attributes?.defesa?.value === exp.defesa, `Defesa de "${exp.name}" deve ser ${exp.defesa}`);
    assert(actorRaw.system?.attributes?.defesa?.base === exp.baseDef, `Defesa base de "${exp.name}" deve ser ${exp.baseDef}`);
    assert(
      (actorRaw.system?.attributes?.defesa?.base || 0) + (actorRaw.system?.atributos?.des?.value || 0) === actorRaw.system?.attributes?.defesa?.value,
      `Defesa dinâmica de "${exp.name}" fecha: base + des = value`
    );

    const skills = actorRaw.system?.pericias || {};
    const skillKeys = Object.keys(skills);
    assert(skillKeys.length >= 34, `"${exp.name}" deve ter pelo menos 34 perícias (obtido: ${skillKeys.length})`);

    assert(actorRaw.prototypeToken?.texture?.src === exp.token, `Token 2MTT de "${exp.name}" deve ser "${exp.token}"`);
    assert(actorRaw.prototypeToken?.width === exp.dim && actorRaw.prototypeToken?.height === exp.dim, `Dimensão do token de "${exp.name}" deve ser ${exp.dim}x${exp.dim}`);
    const localToken = path.join(__dirname, '..', exp.token.replace('modules/compendios-para-t20/', ''));
    assert(fs.existsSync(localToken), `Arquivo local de token "${localToken}" deve existir`);

    const subItemIds = actorRaw.items || [];
    const subDocs = [];
    for (const itemId of subItemIds) {
      const doc = await db.get(`!actors.items!${exp.id}.${itemId}`).catch(() => null);
      assert(doc !== null, `Subdocumento !actors.items!${exp.id}.${itemId} deve existir`);
      if (doc) subDocs.push(doc);
    }

    const subNames = subDocs.map(d => d.name);
    for (const p of exp.powers) {
      assert(subNames.includes(p), `Poder atômico "${p}" presente em "${exp.name}"`);
    }

    if (exp.spells) {
      for (const sp of exp.spells) {
        const found = subDocs.find(d => d.name === sp && d.type === 'magia');
        assert(Boolean(found), `Magia "${sp}" presente em "${exp.name}"`);
        if (found) {
          assert(found.system?.ativacao?.custo === exp.spellCosts[sp], `Magia "${sp}" deve custar ${exp.spellCosts[sp]} PM`);
          if (exp.spellRolls.includes(sp)) {
            assert(Array.isArray(found.system?.rolls) && found.system.rolls.length > 0, `Magia "${sp}" deve possuir rolls[]`);
          }
        }
      }
    }

    console.log(`  ✓ Ator "${exp.name}" (ND ${exp.nd}) auditado com 100% de conformidade.`);
  }

  const hazardDoc = await db.get('!actors!fld28PerigoTempl').catch(() => null);
  assert(hazardDoc !== null && hazardDoc.type === 'hazard', 'Perigo "Templo do Saber em Mutação" [fld28PerigoTempl] existe');
  console.log('  ✓ Perigo "Templo do Saber em Mutação (Edição 28)" auditado com sucesso.');

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens e Parceiros da Edição 28 (Itens_T20) ---');
  const db = openMergedPackView('Item', ROOT_DIR);
  await db.open();

  const EXPECTED_ITEMS = [
    { id: 'fld28ParcLiriavA', name: 'Parceiro: Liriavel Cintilara', type: 'poder', hasEffect: true },
    { id: 'fld28ParcAcadAAA', name: 'Parceiro: Suporte Arcano da Academia (Vladislav Tpish)', type: 'poder', hasEffect: true },
    { id: 'fld28ChavePortaA', name: 'Chave Antiga do Portal da Academia Arcana', type: 'equipamento' },
    { id: 'fld28MatricForjA', name: 'Matrícula Forjada da Academia Arcana', type: 'equipamento' },
    { id: 'fld28GemaWynnaAA', name: 'Gema do Renascimento de Rashid (Bênção de Wynna)', type: 'equipamento' },
    { id: 'fld28DesejoWynna', name: 'Desejo de Wynna', type: 'poder' }
  ];

  for (const exp of EXPECTED_ITEMS) {
    assert(/^[a-zA-Z0-9]{16}$/.test(exp.id), `ID 16 chars válido: ${exp.id}`);
    const itemDoc = await db.get(`!items!${exp.id}`).catch(() => null);
    assert(itemDoc !== null, `Item [${exp.id}] "${exp.name}" existe`);
    if (!itemDoc) continue;
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
  console.log('\n--- 3. Validando Diário da Edição 28 (Diarios_T20) ---');
  const db = openMergedPackView('JournalEntry', ROOT_DIR);
  await db.open();

  const journalId = 'fld28DiarioAcoAr';
  const jDoc = await db.get(`!journal!${journalId}`).catch(() => null);
  assert(jDoc !== null && jDoc.pages?.length === 7, `Diário [${journalId}] deve ter 7 páginas`);
  if (jDoc) {
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
  console.log('\n--- 4. Validando Tabelas da Edição 28 (Tabelas_T20) ---');
  const db = openMergedPackView('RollTable', ROOT_DIR);
  await db.open();

  const EXPECTED_TABLES = [
    { id: 'fld28TabRuasResp', name: 'Ruas que Respiram — Eventos Aleatórios (Edição 28)', count: 6 },
    { id: 'fld28TabFrasesRa', name: 'Frases de Combate de Rashid Fullgori (Edição 28)', count: 10 },
    { id: 'fld28TabFrasesTe', name: 'Frases de Combate no Templo do Saber (Edição 28)', count: 8 }
  ];

  for (const exp of EXPECTED_TABLES) {
    const tDoc = await db.get(`!tables!${exp.id}`).catch(() => null);
    assert(tDoc !== null && tDoc.results?.length === exp.count, `Tabela "${exp.name}" deve ter ${exp.count} resultados`);
    if (tDoc) {
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
  console.log('\n--- 5. Validando Macro da Edição 28 (Macros_T20) ---');
  const db = openMergedPackView('Macro', ROOT_DIR);
  await db.open();

  const mDoc = await db.get('!macros!fld28MacroUrgenc').catch(() => null);
  assert(mDoc !== null && mDoc.type === 'script' && mDoc.command?.length > 100, 'Macro fld28MacroUrgenc válida');
  if (mDoc) console.log(`  ✓ Macro "${mDoc.name}" validada.`);

  await db.close();
}

async function main() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — FÚLGOR DOS DEUSES (EDIÇÃO 28)');
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
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da Edição 28 estão em conformidade canônica estrita!');
  } else {
    console.error('⚠️ ALERTA: Foram detectadas não-conformidades na Edição 28.');
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

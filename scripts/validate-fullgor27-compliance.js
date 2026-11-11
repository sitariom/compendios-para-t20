#!/usr/bin/env node
/**
 * Suíte de Validação Estrita de Conformidade: Fúlgor dos Deuses — Edição 27 (Dia e Noite)
 *
 * Validações:
 * 1. 6 Ameaças em Ameacas_T20 (ND, defesa dinâmica, 34 perícias, ataques, magias individuais, tokens 2MTT)
 * 2. 6 Itens em Itens_T20 (Orbe de Azgher, Parceiro Cassiella, Armadura, Escudo, Espada, Lança com ActiveEffects)
 * 3. Diário de 6 páginas em Diarios_T20
 * 4. 3 Tabelas de Rolagem e resultados em Tabelas_T20
 * 5. Macro de Canalização em Macros_T20
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const fs = require('fs');

const PACKS_DIR = path.join(__dirname, '..', 'packs');

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
  console.log('\n--- 1. Validando Ameaças da Edição 27 (Ameacas_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_THREATS = [
    {
      id: 'fld27CassiellaSe',
      name: 'Cassiella semi-fullgori',
      nd: '7',
      pv: 280,
      pm: 0,
      defesa: 31,
      des: 1,
      baseDef: 30,
      token: 'modules/compendios-para-t20/assets/tokens/cassiella-semi-fullgori.png',
      powers: ['Derrubar', 'Durão', 'Espada Luminosa', 'Luz Sagrada']
    },
    {
      id: 'fld27CassiellaFu',
      name: 'Cassiella fullgori',
      nd: '8',
      pv: 280,
      pm: 0,
      defesa: 33,
      des: 2,
      baseDef: 31,
      token: 'modules/compendios-para-t20/assets/tokens/cassiella-fullgori.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Asa-Escudo', 'Luz Fustigante', 'Rasante Luminoso'],
      hasRanged: true,
      rangedName: 'Azagaias Fullgori'
    },
    {
      id: 'fld27EnxameTrogA',
      name: 'Enxame Trog',
      nd: '5',
      pv: 200,
      pm: 0,
      defesa: 23,
      des: 1,
      baseDef: 22,
      token: 'modules/compendios-para-t20/assets/tokens/enxame-trog.png',
      powers: ['Mau Cheiro Coletivo', 'Sangue Frio']
    },
    {
      id: 'fld27TroggoreAAA',
      name: 'Troggore',
      nd: '3',
      pv: 80,
      pm: 0,
      defesa: 22,
      des: 2,
      baseDef: 20,
      token: 'modules/compendios-para-t20/assets/tokens/troggore.png',
      powers: ['Escolhido de Tenebra', 'Mau Cheiro', 'Sanguinolência', 'Sangue Frio', 'Sensibilidade a Luz']
    },
    {
      id: 'fld27BandoTroggA',
      name: 'Bando Troggore',
      nd: '5',
      pv: 180,
      pm: 0,
      defesa: 22,
      des: 2,
      baseDef: 20,
      token: 'modules/compendios-para-t20/assets/tokens/bando-troggore.png',
      powers: ['Mau Cheiro', 'Devoção Protetora', 'Sanguinolência', 'Sangue Frio', 'Sensibilidade a Luz']
    },
    {
      id: 'fld27UrrashSombr',
      name: 'Urrash das Sombras Frias',
      nd: '5',
      pv: 140,
      pm: 29,
      defesa: 23,
      des: 1,
      baseDef: 22,
      token: 'modules/compendios-para-t20/assets/tokens/urrash-das-sombras-frias.png',
      powers: ['Passo Sombrio', 'Visão nas Trevas', 'Devoção à Tenebra', 'Sangue Frio'],
      spells: ['Curar Ferimentos', 'Escuridão', 'Infligir Ferimentos', 'Perdição', 'Profanar', 'Toque Vampírico']
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
    assert(actorRaw.system?.attributes?.pv?.value === exp.pv, `PV de "${exp.name}" deve ser ${exp.pv}`);
    assert(actorRaw.system?.attributes?.defesa?.value === exp.defesa, `Defesa de "${exp.name}" deve ser ${exp.defesa}`);
    assert(actorRaw.system?.attributes?.defesa?.base === exp.baseDef, `Defesa base de "${exp.name}" deve ser ${exp.baseDef} (dinâmica)`);
    assert(
      (actorRaw.system?.attributes?.defesa?.base || 0) + (actorRaw.system?.atributos?.des?.value || 0) === actorRaw.system?.attributes?.defesa?.value,
      `Defesa dinâmica de "${exp.name}" deve fechar a conta: base + des = value`
    );

    // 34 Perícias
    const skills = actorRaw.system?.pericias || {};
    const skillKeys = Object.keys(skills);
    assert(skillKeys.length >= 34, `"${exp.name}" deve ter todas as 34 perícias (obtido: ${skillKeys.length})`);
    for (const sk of skillKeys) {
      assert(typeof skills[sk].value === 'number', `Perícia ${sk} de "${exp.name}" deve ter value numérico`);
      assert(typeof skills[sk].outros === 'number', `Perícia ${sk} de "${exp.name}" deve ter outros numérico`);
    }

    // Token 2MTT
    assert(
      actorRaw.prototypeToken?.texture?.src === exp.token,
      `Token de "${exp.name}" deve ser "${exp.token}"`
    );
    const localToken = path.join(__dirname, '..', exp.token.replace('modules/compendios-para-t20/', ''));
    assert(fs.existsSync(localToken), `Arquivo local de token "${localToken}" deve existir fisicamente`);

    // Subdocumentos
    const subItemIds = actorRaw.items || [];
    assert(subItemIds.length > 0, `"${exp.name}" deve possuir subdocumentos de itens`);

    const subDocs = [];
    for (const itemId of subItemIds) {
      try {
        const doc = await db.get(`!actors.items!${exp.id}.${itemId}`);
        subDocs.push(doc);
      } catch {
        assert(false, `Subdocumento !actors.items!${exp.id}.${itemId} de "${exp.name}" deve existir`);
      }
    }

    const subNames = subDocs.map(d => d.name);
    for (const p of exp.powers) {
      assert(subNames.includes(p), `Poder atômico "${p}" deve estar presente em "${exp.name}"`);
    }

    if (exp.spells) {
      for (const sp of exp.spells) {
        const found = subDocs.find(d => d.name === sp && d.type === 'magia');
        assert(found !== undefined, `Magia individual "${sp}" (tipo magia) deve estar presente em "${exp.name}"`);
      }
    }

    if (exp.hasRanged) {
      const rangedWeapon = subDocs.find(d => d.name === exp.rangedName && ['arremesso', 'disparo'].includes(d.system?.proposito));
      assert(rangedWeapon !== undefined, `Ataque à distância "${exp.rangedName}" deve ter propósito disparo ou arremesso`);
    }

    console.log(`  ✓ Ator "${exp.name}" (ND ${exp.nd}) auditado com 100% de conformidade.`);
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens da Edição 27 (Itens_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_ITEMS = [
    { id: 'fld27OrbeAzgherA', name: 'Orbe de Azgher', type: 'equipamento', hasEffect: true },
    { id: 'fld27ParcCassiel', name: 'Parceiro: Cassiella de Baldonn', type: 'poder', hasEffect: true },
    { id: 'fld27ArmaduraCas', name: 'Armadura Completa Delicada Selada', type: 'equipamento' },
    { id: 'fld27EscudoPesCa', name: 'Escudo Pesado Reforçado', type: 'equipamento', hasEffect: true },
    { id: 'fld27EspadaPunge', name: 'Espada Longa Pungente', type: 'equipamento', hasEffect: true },
    { id: 'fld27LancaTroggo', name: 'Lança Troggore', type: 'equipamento' }
  ];

  for (const exp of EXPECTED_ITEMS) {
    let itemDoc = null;
    try {
      itemDoc = await db.get(`!items!${exp.id}`);
    } catch {}

    assert(itemDoc !== null, `Item [${exp.id}] "${exp.name}" deve existir no LevelDB`);
    if (!itemDoc) continue;

    assert(itemDoc.name === exp.name, `Nome do item [${exp.id}] deve ser "${exp.name}"`);
    assert(itemDoc.type === exp.type, `Tipo do item "${exp.name}" deve ser "${exp.type}"`);
    assert(
      typeof itemDoc.system?.description?.value === 'string' && itemDoc.system.description.value.length > 20,
      `Descrição do item "${exp.name}" deve conter texto informativo detalhado`
    );

    if (exp.hasEffect) {
      assert(Array.isArray(itemDoc.effects) && itemDoc.effects.length > 0, `Item "${exp.name}" deve possuir efeitos registrados em effects[]`);
      for (const effId of itemDoc.effects || []) {
        let effDoc = null;
        try {
          effDoc = await db.get(`!items.effects!${exp.id}.${effId}`);
        } catch {}
        assert(effDoc !== null, `Subdocumento de efeito !items.effects!${exp.id}.${effId} de "${exp.name}" deve existir`);
        assert(Array.isArray(effDoc?.changes) && effDoc.changes.length > 0, `Efeito de "${exp.name}" deve conter modificadores em changes[]`);
      }
    }

    console.log(`  ✓ Item "${exp.name}" (${exp.type}) validado com sucesso.`);
  }

  await db.close();
}

async function validateJournals() {
  console.log('\n--- 3. Validando Diários da Edição 27 (Diarios_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await db.open();

  const journalId = 'fld27DiarioDiaNo';
  let jDoc = null;
  try {
    jDoc = await db.get(`!journal!${journalId}`);
  } catch {}

  assert(jDoc !== null, `Diário [${journalId}] deve existir no LevelDB`);
  if (jDoc) {
    assert(jDoc.pages?.length === 6, `Diário deve ter exatamente 6 páginas (obtido: ${jDoc.pages?.length})`);
    for (const pid of jDoc.pages || []) {
      let pageDoc = null;
      try {
        pageDoc = await db.get(`!journal.pages!${journalId}.${pid}`);
      } catch {}
      assert(pageDoc !== null, `Página subdocumento !journal.pages!${journalId}.${pid} deve existir`);
      assert(pageDoc?.text?.content?.length > 50, `Conteúdo da página "${pageDoc?.name}" deve ser rico em HTML`);
    }
    console.log(`  ✓ Diário "${jDoc.name}" validado com 6 páginas completas.`);
  }

  await db.close();
}

async function validateTables() {
  console.log('\n--- 4. Validando Tabelas de Rolagem da Edição 27 (Tabelas_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_TABLES = [
    { id: 'fld27TabCavernas', name: 'Cavernas dos Trogs — Perigos e Ecos de Tenebra (Edição 27)', count: 6 },
    { id: 'fld27TabFrasesCas', name: 'Frases em Combate de Cassiella Possuída (Edição 27)', count: 8 },
    { id: 'fld27TabDilemaOrb', name: 'Dilema da Orbe de Azgher — Escolhas e Consequências (Edição 27)', count: 3 }
  ];

  for (const exp of EXPECTED_TABLES) {
    let tDoc = null;
    try {
      tDoc = await db.get(`!tables!${exp.id}`);
    } catch {}

    assert(tDoc !== null, `Tabela [${exp.id}] "${exp.name}" deve existir`);
    if (!tDoc) continue;

    assert(tDoc.results?.length === exp.count, `Tabela "${exp.name}" deve ter ${exp.count} resultados (obtido: ${tDoc.results?.length})`);
    for (const rid of tDoc.results || []) {
      let rDoc = null;
      try {
        rDoc = await db.get(`!tables.results!${exp.id}.${rid}`);
      } catch {}
      assert(rDoc !== null, `Resultado !tables.results!${exp.id}.${rid} de "${exp.name}" deve existir`);
      assert(typeof rDoc?.name === 'string' && rDoc.name.length > 0, `Resultado ${rid} deve ter campo 'name'`);
      assert(typeof rDoc?.text === 'string' && rDoc.text.length > 0, `Resultado ${rid} deve ter campo 'text'`);
    }

    console.log(`  ✓ Tabela "${exp.name}" validada com ${exp.count} resultados.`);
  }

  await db.close();
}

async function validateMacros() {
  console.log('\n--- 5. Validando Macros da Edição 27 (Macros_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Macros_T20'), { valueEncoding: 'json' });
  await db.open();

  const macroId = 'fld27MacroOrbeAz';
  let mDoc = null;
  try {
    mDoc = await db.get(`!macros!${macroId}`);
  } catch {}

  assert(mDoc !== null, `Macro [${macroId}] deve existir no LevelDB`);
  if (mDoc) {
    assert(mDoc.type === 'script', `Tipo da macro deve ser "script"`);
    assert(typeof mDoc.command === 'string' && mDoc.command.length > 100, `Comando da macro deve conter script funcional`);
    console.log(`  ✓ Macro "${mDoc.name}" validada.`);
  }

  await db.close();
}

async function main() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — FÚLGOR DOS DEUSES (EDIÇÃO 27)');
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
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da Edição 27 estão em conformidade canônica estrita!');
  } else {
    console.error('⚠️ ALERTA: Foram detectadas não-conformidades que devem ser corrigidas.');
  }
  console.log('================================================================================\n');

  if (errors > 0) process.exit(1);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Erro na execução da suíte de conformidade:', err);
    process.exit(1);
  });
}

module.exports = { main };

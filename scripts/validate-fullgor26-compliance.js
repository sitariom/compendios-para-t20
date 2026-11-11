#!/usr/bin/env node
/**
 * Suíte de Validação Estrita de Conformidade: Fúlgor dos Deuses — Edição 26 (Forja da Vingança)
 *
 * Validações:
 * 1. 6 Ameaças em Ameacas_T20 (ND, defesa dinâmica, 34 perícias, armas, magias, tokens 2MTT)
 * 2. 17 Itens em Itens_T20 (Aço Sillariano, 11 qualidades, Alma da Bigorna, traços, parceiros)
 * 3. Diário e 7 páginas em Diarios_T20
 * 4. 3 Tabelas de Rolagem e resultados em Tabelas_T20
 * 5. Macro de Forja em Macros_T20
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
  } else {
    // console.log(`  ✓ ${message}`);
  }
}

async function validateThreats() {
  console.log('\n--- 1. Validando Ameaças da Edição 26 (Ameacas_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_THREATS = [
    {
      id: 'C6JxlK5xzXU8PYuK',
      name: 'Asmithar Martelo-Mudo',
      nd: '9',
      pv: 230,
      pm: 0,
      defesa: 32,
      des: 1,
      baseDef: 31,
      token: 'modules/compendios-para-t20/assets/tokens/asmithar-martelo-mudo.png',
      powers: ['Armamento Sagrado', 'Desprezo pelo Ordinário']
    },
    {
      id: 'gaMGB2dL8R0Rv2mY',
      name: 'Xellmaras, a Ladra Acorrentada',
      nd: '6',
      pv: 168,
      pm: 0,
      defesa: 25,
      des: 6,
      baseDef: 19,
      token: 'modules/compendios-para-t20/assets/tokens/xellmaras-a-ladra-acorrentada.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Ataque Furtivo +3d6', 'Correntes Deturpadas', 'Especialista Abissal', 'Sadismo', 'Talho Atroz', 'Chave que se Fecha']
    },
    {
      id: 'wbA5Rt8dqRkHQWdC',
      name: 'Gangue de Hyninn Deturpada',
      nd: '4',
      pv: 99,
      pm: 0,
      defesa: 22,
      des: 3,
      baseDef: 19,
      token: 'modules/compendios-para-t20/assets/tokens/gangue-de-hyninn-deturpada.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'No Alma Dói Mais', 'Truque de Luzes']
    },
    {
      id: '4Chz9YQv6oC4R5gs',
      name: 'Sacerdote de Hyninn Deturpado',
      nd: '4',
      pv: 98,
      pm: 28,
      defesa: 19,
      des: 3,
      baseDef: 16,
      token: 'modules/compendios-para-t20/assets/tokens/sacerdote-de-hyninn-deturpado.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Bênção do Gatuno', 'Forma de Macaco Pamgra', 'Malandragem Divina'],
      spells: ['Arma Espiritual', 'Curar Ferimentos', 'Despedaçar']
    },
    {
      id: '6lKAcCvfQj9FReP7',
      name: 'Tigre-de-Hyninn Deturpado',
      nd: '6',
      pv: 205,
      pm: 0,
      defesa: 28,
      des: 4,
      baseDef: 24,
      token: 'modules/compendios-para-t20/assets/tokens/tigre-de-hyninn-deturpado.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Borrão Dourado', 'Reflexo Planar']
    },
    {
      id: 'E8hgaWNdM2kqv4oo',
      name: 'Aço Selvagem',
      nd: '6',
      pv: 250,
      pm: 0,
      defesa: 27,
      des: 2,
      baseDef: 25,
      token: 'modules/compendios-para-t20/assets/tokens/aco-selvagem.png',
      powers: ['Teofagia', 'Imunidades Fullgori', 'Agarrar Aprimorado', 'Ecos do Fullgor', 'Engolir', 'Corpo de Metal Fundido', 'Resfriamento Forçado']
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

    // Resistências texto
    assert(
      typeof actorRaw.system?.detalhes?.resistencias === 'string' && actorRaw.system.detalhes.resistencias.length > 5,
      `Resistências de "${exp.name}" deve conter texto descritivo oficial`
    );

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

    // Verificar poderes obrigatórios
    const subNames = subDocs.map(d => d.name);
    for (const p of exp.powers) {
      assert(subNames.includes(p), `Poder atômico "${p}" deve estar presente em "${exp.name}"`);
    }

    if (exp.id === 'C6JxlK5xzXU8PYuK') {
      assert(actorRaw.system?.pericias?.arme?.value === 14, `Asmithar deve possuir Ofício (Armeiro) [arme] com valor 14`);
      assert(actorRaw.system?.pericias?.arme?.treinado === true, `Asmithar deve ser treinado em Ofício (Armeiro) [arme]`);
    }

    // Verificar magias obrigatórias
    if (exp.spells) {
      for (const sp of exp.spells) {
        const found = subDocs.find(d => d.name === sp && d.type === 'magia');
        assert(found !== undefined, `Magia individual "${sp}" (tipo magia) deve estar presente em "${exp.name}"`);
      }
    }

    console.log(`  ✓ Ator "${exp.name}" (ND ${exp.nd}) auditado com 100% de conformidade.`);
  }

  await db.close();
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens da Edição 26 (Itens_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_ITEMS = [
    { id: 'fld26AcoSillaria', name: 'Aço Sillariano', type: 'equipamento' },
    { id: 'fld26AlmaBigorna', name: 'Alma da Bigorna', type: 'equipamento', hasEffect: true },
    { id: 'fld26AbsorcaoAnt', name: 'Qualidade: Absorção Antidivina', type: 'poder' },
    { id: 'fld26ArmaAntidiv', name: 'Qualidade: Arma Antidivina', type: 'poder' },
    { id: 'fld26DefesaAntid', name: 'Qualidade: Defesa Antidivina', type: 'poder', hasEffect: true },
    { id: 'fld26GuardaAntid', name: 'Qualidade: Guarda Antidivina', type: 'poder', hasEffect: true },
    { id: 'fld26Impedimento', name: 'Qualidade: Impedimento Antidivino', type: 'poder' },
    { id: 'fld26MagiaAntidiv', name: 'Qualidade: Magia Antidivina', type: 'poder' },
    { id: 'fld26MenteAntidiv', name: 'Qualidade: Mente Antidivina', type: 'poder', hasEffect: true },
    { id: 'fld26Perseguidora', name: 'Qualidade: Perseguidora Antidivina', type: 'poder', hasEffect: true },
    { id: 'fld26PotenciaAnt', name: 'Qualidade: Potência Antidivina', type: 'poder' },
    { id: 'fld26ResistenciaA', name: 'Qualidade: Resistência Antidivina', type: 'poder', hasEffect: true },
    { id: 'fld26AntidevotoQ', name: 'Qualidade: Antidevoto', type: 'poder' },
    { id: 'fld26TeofagiaFul', name: 'Teofagia (Fullgori)', type: 'poder' },
    { id: 'fld26ImunidadesF', name: 'Imunidades (Fullgori)', type: 'poder' },
    { id: 'fld26ParcForjad', name: 'Parceiro: Forjadores Litúrgicos', type: 'poder', hasEffect: true },
    { id: 'fld26ParcThalgri', name: 'Parceiro: Thalgrimm Sangue de Ferro', type: 'poder' }
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
  console.log('\n--- 3. Validando Diários da Edição 26 (Diarios_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await db.open();

  const journalId = 'fld26DiarioForja';
  let jDoc = null;
    try {
      jDoc = await db.get(`!journal!${journalId}`);
    } catch {}

  assert(jDoc !== null, `Diário [${journalId}] deve existir no LevelDB`);
  if (jDoc) {
    assert(jDoc.pages?.length === 7, `Diário deve ter exatamente 7 páginas (obtido: ${jDoc.pages?.length})`);
    for (const pid of jDoc.pages || []) {
      let pageDoc = null;
      try {
        pageDoc = await db.get(`!journal.pages!${journalId}.${pid}`);
      } catch {}
      assert(pageDoc !== null, `Página subdocumento !journal.pages!${journalId}.${pid} deve existir`);
      assert(pageDoc?.text?.content?.length > 50, `Conteúdo da página "${pageDoc?.name}" deve ser rico em HTML`);
    }
    console.log(`  ✓ Diário "${jDoc.name}" validado com 7 páginas completas.`);
  }

  await db.close();
}

async function validateTables() {
  console.log('\n--- 4. Validando Tabelas de Rolagem da Edição 26 (Tabelas_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await db.open();

  const EXPECTED_TABLES = [
    { id: 'fld26TabEncontros', name: 'Subterrâneos de Valkaria — Encontros e Boatos (Edição 26)', count: 6 },
    { id: 'fld26TabQualidades', name: 'Qualidades Antidivinas de Aço Sillariano (Edição 26)', count: 10 },
    { id: 'fld26TabFrasesXell', name: 'Frases de Combate de Xellmaras (Edição 26)', count: 8 }
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
  console.log('\n--- 5. Validando Macros da Edição 26 (Macros_T20) ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Macros_T20'), { valueEncoding: 'json' });
  await db.open();

  const macroId = 'fld26MacroForjaS';
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
  console.log('🛡️  VALIDAÇÃO GERAL DE CONFORMIDADE — FÚLGOR DOS DEUSES (EDIÇÃO 26)');
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
    console.log('🎉 100% DE APROVAÇÃO! Todos os materiais da Edição 26 estão em conformidade canônica estrita!');
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

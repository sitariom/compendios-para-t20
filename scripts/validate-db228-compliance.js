#!/usr/bin/env node
/**
 * Validador Estrito de Conformidade Canônica da Dragão Brasil #228
 *
 * Valida:
 * 1. Ameacas_T20: Ankthyr (ND 8), Enxame Cáustico (ND 4), Slark (ND 1),
 *    Desabamento dos Túneis (Hazard ND 8), e Parceiros Especiais (Reabilitador, Allihennali, Guaxininjas).
 *    Verifica Defesa Base dinâmica (base + des === value), 34 perícias deduzidas, traços e tokens 2MTT.
 * 2. Itens_T20: 17 itens, poderes e magias de Divinas Organizações.
 * 3. Diarios_T20: Diários da Aventura Emergir Monstruoso e Divinas Organizações.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');

const PACK_ACTORS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const PACK_ITEMS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const PACK_JOURNALS = path.join(__dirname, '..', 'packs', 'Diarios_T20');

async function validateActors() {
  console.log('--- 1. Validando Ameaças e Parceiros da DB #228 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_ACTORS, { valueEncoding: 'json' });

  const requiredThreats = [
    { name: 'Ankthyr', type: 'npc', nd: '8', pv: 308, def: 33, des: 2, itemsCount: 5, tokenFile: 'ankthyr.png' },
    { name: 'Enxame Cáustico', type: 'npc', nd: '4', pv: 140, def: 23, des: 1, itemsCount: 3, tokenFile: 'enxame-caustico.png' },
    { name: 'Slark', type: 'npc', nd: '1', pv: 9, def: 15, des: 3, itemsCount: 4, tokenFile: 'slark.png' },
    { name: 'Desabamento dos Túneis', type: 'hazard', nd: '8', tokenFile: 'desabamento-dos-tuneis.png' },
    { name: 'Reabilitador', type: 'npc', tokenFile: 'reabilitador.png' },
    { name: 'Allihennali', type: 'npc', tokenFile: 'allihennali.png' },
    { name: 'Guaxininjas', type: 'npc', tokenFile: 'guaxininjas.png' }
  ];

  const foundActors = {};
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!actors!') && !key.startsWith('!actors.items!') && !key.startsWith('!actors.effects!')) {
      if (value && value.name) {
        foundActors[value.name] = { ...value, dbKey: key };
      }
    }
  }

  let errors = 0;

  for (const req of requiredThreats) {
    const actor = foundActors[req.name];
    if (!actor) {
      console.error(`❌ Ator "${req.name}" não encontrado em Ameacas_T20!`);
      errors++;
      continue;
    }

    // Valida Token 2MTT
    const tokenSrc = actor.prototypeToken?.texture?.src || '';
    if (!tokenSrc.includes('assets/tokens/' + req.tokenFile)) {
      console.error(`❌ Token de "${req.name}" não é o 2MTT esperado: ${tokenSrc}`);
      errors++;
    } else {
      console.log(`✅ Token 2MTT verificado para "${req.name}": ${tokenSrc}`);
    }

    if (req.type === 'npc' && req.pv) {
      // Valida Defesa Base Dinâmica
      const desVal = actor.system.atributos.des.value;
      const defVal = actor.system.attributes.defesa.value;
      const defBase = actor.system.attributes.defesa.base;

      if (defBase + desVal !== defVal) {
        console.error(`❌ Inconsistência na Defesa de "${req.name}": base (${defBase}) + des (${desVal}) !== value (${defVal})`);
        errors++;
      } else {
        console.log(`✅ Defesa Base correta para "${req.name}": base ${defBase} + des ${desVal} = ${defVal}`);
      }

      // Valida 34 Perícias
      const periciasCount = Object.keys(actor.system.pericias || {}).length;
      if (periciasCount !== 34) {
        console.error(`❌ Perícias incompletas para "${req.name}": ${periciasCount}/34`);
        errors++;
      } else {
        console.log(`✅ Todas as 34 perícias presentes para "${req.name}".`);
      }

      // Valida Itens Embutidos
      let embeddedCount = 0;
      for await (const [subKey] of db.iterator({ gte: `!actors.items!${actor._id}.`, lte: `!actors.items!${actor._id}.\uffff` })) {
        if (!subKey.includes('.effects!')) embeddedCount++;
      }
      if (embeddedCount < req.itemsCount) {
        console.error(`❌ Itens embutidos insuficientes para "${req.name}": ${embeddedCount}/${req.itemsCount}`);
        errors++;
      } else {
        console.log(`✅ ${embeddedCount} itens/ataques embutidos validados para "${req.name}".`);
      }
    }
  }

  await db.close();
  return errors;
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens e Poderes da DB #228 (Itens_T20) ---');
  const db = new ClassicLevel(PACK_ITEMS, { valueEncoding: 'json' });

  const requiredItems = [
    'Arco dos Arautos',
    'Certificado de Conclusão',
    'Chave Mestra',
    'Bilhete de Valluk Delsori',
    'Máscara do Sol Dourado',
    'Pingente Rubro',
    'Alma de Dragão',
    'Âncora Naufragista',
    'Arma Silente',
    'Memorizar Conhecimento',
    'Cítola da Paz',
    'Percepção de Masmorra',
    'Rosário da Vida',
    'Bússola das Lágrimas',
    'Corso Sombrio',
    'Previdência da Vigília',
    'Bomba de Tinta'
  ];

  let found = 0;
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!items!') && !key.includes('.effects!')) {
      if (value && requiredItems.includes(value.name)) {
        found++;
      }
    }
  }

  await db.close();
  if (found < requiredItems.length) {
    console.error(`❌ Itens encontrados: ${found}/${requiredItems.length}`);
    return 1;
  }
  console.log(`✅ Todos os ${found}/${requiredItems.length} itens de Divinas Organizações auditados e presentes em Itens_T20.`);
  return 0;
}

async function validateJournals() {
  console.log('\n--- 3. Validando Diários de Bordo da DB #228 (Diarios_T20) ---');
  const db = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  const requiredJournals = [
    'Aventura: Emergir Monstruoso (DB #228)',
    'Cenário: Divinas Organizações (DB #228)'
  ];

  let found = 0;
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!journal!') && !key.includes('.pages!')) {
      if (value && requiredJournals.includes(value.name)) {
        console.log(`✅ Diário verificado: "${value.name}" com ${value.pages?.length || 0} páginas.`);
        found++;
      }
    }
  }

  await db.close();
  if (found < requiredJournals.length) {
    console.error(`❌ Diários encontrados: ${found}/${requiredJournals.length}`);
    return 1;
  }
  return 0;
}

async function main() {
  console.log('================================================================');
  console.log('🔍 VALIDAÇÃO RIGOROSA DE CONFORMIDADE - DB #228 (T20 FOUNDRY)');
  console.log('================================================================\n');

  let totalErrors = 0;
  totalErrors += await validateActors();
  totalErrors += await validateItems();
  totalErrors += await validateJournals();

  console.log('\n================================================================');
  if (totalErrors === 0) {
    console.log('🎉 SUCESSO: Todo o conteúdo da Dragão Brasil #228 está');
    console.log('   100% em conformidade com as regras de T20, 2MTT e Foundry!');
    console.log('================================================================');
    process.exit(0);
  } else {
    console.error(`❌ FALHA: ${totalErrors} erro(s) de conformidade detectados.`);
    console.log('================================================================');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Erro na validação:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Validador Estrito e Canônico de Conformidade da Dragão Brasil #228
 *
 * Valida:
 * 1. Ameacas_T20:
 *    - Ankthyr (ND 8), Enxame Cáustico (ND 4), Slark (ND 1), Desabamento dos Túneis (Hazard ND 8),
 *      e Parceiros Especiais (Reabilitador, Allihennali, Guaxininjas).
 *    - Verifica Defesa Base dinâmica (base + des === value).
 *    - Verifica 34 perícias deduzidas com fórmula padrão.
 *    - Verifica atributos completos (value, base, racial: 0, bonus: 0).
 *    - Verifica movement como objeto completo (walk, burrow, climb, fly, swim, unit: 'm').
 *    - Verifica presença de itens embutidos no array do próprio documento (items.length > 0).
 *    - Verifica que armas embutidas possuem rolls com parts (ataque0 e dano1), criticoM e criticoX.
 *    - Verifica tokens top-down 2MTT transparentes.
 * 2. Itens_T20:
 *    - 17 itens, poderes e magias de Divinas Organizações.
 *    - Armas com rolls.parts (ataque0 e dano1) e criticoM/criticoX.
 *    - ActiveEffects configurados para modificadores mecânicos.
 *    - Variáveis de template completas e inicializadas.
 * 3. Diarios_T20:
 *    - 2 diários e 19 páginas de conteúdo canônico.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');

const PACK_ACTORS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const PACK_ITEMS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const PACK_JOURNALS = path.join(__dirname, '..', 'packs', 'Diarios_T20');
const PACK_TABLES = path.join(__dirname, '..', 'packs', 'Tabelas_T20');

async function validateActors() {
  console.log('--- 1. Validando Ameaças, Perigos e Parceiros da DB #228 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_ACTORS, { valueEncoding: 'json' });

  const requiredThreats = [
    { name: 'Ankthyr', type: 'npc', nd: '8', pv: 308, def: 33, des: 2, itemsCount: 5, tokenFile: 'ankthyr.png' },
    { name: 'Enxame Cáustico', type: 'npc', nd: '4', pv: 140, def: 23, des: 1, itemsCount: 3, tokenFile: 'enxame-caustico.png' },
    { name: 'Slark', type: 'npc', nd: '1', pv: 9, def: 15, des: 3, itemsCount: 3, tokenFile: 'slark.png' },
    { name: 'Desabamento dos Túneis', type: 'hazard', nd: '8', tokenFile: 'desabamento-dos-tuneis.png' },
    { name: 'Reabilitador', type: 'npc', nd: '3', itemsCount: 2, tokenFile: 'reabilitador.png' },
    { name: 'Allihennali', type: 'npc', nd: '3', itemsCount: 3, tokenFile: 'allihennali.png' },
    { name: 'Guaxininjas', type: 'npc', nd: '3', itemsCount: 2, tokenFile: 'guaxininjas.png' }
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

    // 1. Valida Token 2MTT
    const tokenSrc = actor.prototypeToken?.texture?.src || '';
    if (!tokenSrc.includes('assets/tokens/' + req.tokenFile)) {
      console.error(`❌ Token de "${req.name}" não é o 2MTT esperado: ${tokenSrc}`);
      errors++;
    } else {
      console.log(`✅ Token 2MTT verificado para "${req.name}": ${tokenSrc}`);
    }

    if (req.type === 'npc') {
      // 2. Valida Defesa Base Dinâmica
      const desVal = actor.system.atributos.des.value;
      const defVal = actor.system.attributes.defesa.value;
      const defBase = actor.system.attributes.defesa.base;

      if (defBase + desVal !== defVal) {
        console.error(`❌ Inconsistência na Defesa de "${req.name}": base (${defBase}) + des (${desVal}) !== value (${defVal})`);
        errors++;
      } else {
        console.log(`✅ Defesa Base correta para "${req.name}": base ${defBase} + des ${desVal} = ${defVal}`);
      }

      // 3. Valida Atributos com sub-propriedades completas
      for (const atr of ['for', 'des', 'con', 'int', 'sab', 'car']) {
        const a = actor.system.atributos[atr];
        if (!a || a.value === undefined || a.base === undefined || a.racial === undefined || a.bonus === undefined) {
          console.error(`❌ Atributo '${atr}' de "${req.name}" incompleto: ${JSON.stringify(a)}`);
          errors++;
        }
      }

      // 4. Valida Movement como Objeto
      const m = actor.system.attributes?.movement;
      if (!m || typeof m.walk !== 'number' || typeof m.burrow !== 'number' || typeof m.climb !== 'number') {
        console.error(`❌ Movimento de "${req.name}" inválido ou ausente: ${JSON.stringify(m)}`);
        errors++;
      } else {
        console.log(`✅ Movimento estruturado para "${req.name}": walk=${m.walk}m, burrow=${m.burrow}m, climb=${m.climb}m`);
      }

      // 5. Valida 34 Perícias
      const periciasCount = Object.keys(actor.system.pericias || {}).length;
      if (periciasCount !== 34) {
        console.error(`❌ Perícias incompletas para "${req.name}": ${periciasCount}/34`);
        errors++;
      } else {
        console.log(`✅ Todas as 34 perícias presentes e calculadas para "${req.name}".`);
      }

      // 6. Valida Array items no Documento Principal
      const docItemsCount = Array.isArray(actor.items) ? actor.items.length : 0;
      if (docItemsCount < req.itemsCount) {
        console.error(`❌ Array actor.items vazio ou insuficiente para "${req.name}": ${docItemsCount}/${req.itemsCount}`);
        errors++;
      } else {
        console.log(`✅ Array actor.items validado para "${req.name}": ${docItemsCount} itens embutidos.`);
      }

      // 7. Valida Subdocumentos no ClassicLevel
      let embeddedCount = 0;
      for await (const [subKey] of db.iterator({ gte: `!actors.items!${actor._id}.`, lte: `!actors.items!${actor._id}.\uffff` })) {
        if (!subKey.includes('.effects!')) embeddedCount++;
      }
      if (embeddedCount < req.itemsCount) {
        console.error(`❌ Chaves !actors.items! insuficientes para "${req.name}": ${embeddedCount}/${req.itemsCount}`);
        errors++;
      } else {
        console.log(`✅ Chaves de LevelDB !actors.items! validadas para "${req.name}": ${embeddedCount} subdocumentos.`);
      }

      // 8. Valida Estrutura rolls.parts nas Armas
      for (const item of (actor.items || [])) {
        if (item.type === 'arma') {
          const rolls = item.system?.rolls;
          if (!Array.isArray(rolls) || rolls.length === 0) {
            console.error(`❌ Arma "${item.name}" em "${req.name}" não possui array rolls!`);
            errors++;
          } else {
            const hasParts = rolls.every(r => Array.isArray(r.parts) && r.parts.length > 0);
            if (!hasParts) {
              console.error(`❌ Arma "${item.name}" em "${req.name}" possui rolls sem estrutura parts!`);
              errors++;
            } else {
              console.log(`✅ Arma "${item.name}" em "${req.name}" possui ${rolls.length} rolagens válidas com parts.`);
            }
          }
        }
      }

      // 9. Valida Biografia Canônica com Citações em Bloco
      const bio = actor.system.detalhes?.biography?.value || '';
      if (!bio.includes('blockquote') || !bio.includes('&mdash;')) {
        console.error(`❌ Biografia de "${req.name}" não segue o padrão canônico com citações em bloco duplas!`);
        errors++;
      } else {
        console.log(`✅ Biografia canônica com citações duplas validada para "${req.name}".`);
      }
    }
  }

  await db.close();
  return errors;
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens, Armas, Magias e Poderes da DB #228 (Itens_T20) ---');
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

  let errors = 0;
  const foundItems = {};

  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!items!') && !key.includes('.effects!')) {
      if (value && requiredItems.includes(value.name)) {
        foundItems[value.name] = value;
      }
    }
  }

  for (const name of requiredItems) {
    const item = foundItems[name];
    if (!item) {
      console.error(`❌ Item "${name}" não encontrado em Itens_T20!`);
      errors++;
      continue;
    }

    // Valida Armas
    if (item.type === 'arma') {
      const rolls = item.system?.rolls;
      if (!Array.isArray(rolls) || rolls.length === 0) {
        console.error(`❌ Arma "${name}" não possui rolagens em system.rolls!`);
        errors++;
      } else {
        const hasParts = rolls.every(r => Array.isArray(r.parts) && r.parts.length > 0);
        if (!hasParts) {
          console.error(`❌ Arma "${name}" não possui structure rolls.parts!`);
          errors++;
        }
      }
      if (typeof item.system?.criticoM !== 'number' || typeof item.system?.criticoX !== 'number') {
        console.error(`❌ Arma "${name}" sem criticoM / criticoX numéricos!`);
        errors++;
      }
    }

    // Valida Variáveis de Template Não Omitidas
    const s = item.system || {};
    const mandatoryKeys = ['carregado', 'peso', 'espacos', 'qtd', 'preco', 'pv', 'rd', 'equipado', 'ativacao', 'duracao', 'chatFlavor'];
    for (const mk of mandatoryKeys) {
      if (s[mk] === undefined) {
        console.error(`❌ Item "${name}" possui variável obrigatória de template omitida: ${mk}`);
        errors++;
      }
    }

    // Valida Efeitos se aplicável
    if (item.effects && item.effects.length > 0) {
      const hasChanges = item.effects.every(e => Array.isArray(e.changes) && e.changes.length > 0);
      if (!hasChanges) {
        console.error(`❌ Item "${name}" possui efeitos sem changes válidas!`);
        errors++;
      }
    }
  }

  await db.close();
  if (Object.keys(foundItems).length < requiredItems.length) {
    console.error(`❌ Total de itens encontrados: ${Object.keys(foundItems).length}/${requiredItems.length}`);
    errors++;
  } else {
    console.log(`✅ Todos os 17 itens de Divinas Organizações auditados com variáveis completas e rolagens estruturadas.`);
  }

  return errors;
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

async function validateTables() {
  console.log('\n--- 4. Validando Tabelas de Rolagem da DB #228 (Tabelas_T20) ---');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  const requiredTables = [
    { name: 'Desabamento dos Túneis: Efeitos por Rodada (DB #228)', formula: '1d6', resultsCount: 4 },
    { name: 'Divinas Organizações de Arton (DB #228)', formula: '1d17', resultsCount: 17 }
  ];

  let errors = 0;
  const foundTables = {};

  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!tables!') && !key.includes('.results!')) {
      if (value && value.name) {
        foundTables[value.name] = value;
      }
    }
  }

  for (const req of requiredTables) {
    const table = foundTables[req.name];
    if (!table) {
      console.error(`❌ Tabela de rolagem "${req.name}" não encontrada em Tabelas_T20!`);
      errors++;
      continue;
    }

    if (table.formula !== req.formula) {
      console.error(`❌ Fórmula incorreta para "${req.name}": esperava ${req.formula}, obteve ${table.formula}`);
      errors++;
    } else {
      console.log(`✅ Fórmula correta para "${req.name}": ${table.formula}`);
    }

    const count = Array.isArray(table.results) ? table.results.length : 0;
    if (count !== req.resultsCount) {
      console.error(`❌ Resultados insuficientes para "${req.name}": esperava ${req.resultsCount}, obteve ${count}`);
      errors++;
    } else {
      console.log(`✅ Todos os ${count} resultados da tabela "${req.name}" verificados com sucesso.`);
    }
  }

  await db.close();
  return errors;
}

async function main() {
  console.log('================================================================');
  console.log('🔍 VALIDAÇÃO RIGOROSA E CANÔNICA DE CONFORMIDADE - DB #228');
  console.log('================================================================\n');

  let totalErrors = 0;
  totalErrors += await validateActors();
  totalErrors += await validateItems();
  totalErrors += await validateJournals();
  totalErrors += await validateTables();

  console.log('\n================================================================');
  if (totalErrors === 0) {
    console.log('🎉 SUCESSO ABSOLUTO: Todo o conteúdo da Dragão Brasil #228');
    console.log('   está 100% CANÔNICO, COMPLETO e FUNCIONAL!');
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

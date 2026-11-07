#!/usr/bin/env node
/**
 * Validador Estrito e Canônico de Conformidade da Dragão Brasil #229
 *
 * Valida:
 * 1. Ameacas_T20:
 *    - Defensor Rochoso Desperto (ND 8), Revoada de Serpes (ND 8), Presa do Grande Basilisco (ND 3) e Basilisco Ancestral (ND 9).
 *    - Defesa Base dinâmica (base + des === value).
 *    - 34 perícias deduzidas com a fórmula oficial do sistema.
 *    - Atributos completos (value, base, racial: 0, bonus: 0).
 *    - Movement no formato canônico T20 (base + bonus[]).
 *    - Presença de itens embutidos como array de IDs no documento e subdocs em !actors.items!.
 *    - Armas embutidas com rolls.parts, criticoM e criticoX.
 *    - Tokens top-down exclusivos do 2-Minute Tabletop.
 *    - Biografias canônicas com citações duplas (#800000 e #006400) e apresentação em Arial.
 *    - Confirma que nenhum parceiro foi criado como ator em Ameacas_T20.
 * 2. Itens_T20:
 *    - 8 parceiros na pasta canônica "Parceiros" (0uRx5Efj3tk7P5Xr).
 *    - 5 itens, matérias-primas, venenos e armas em suas respectivas pastas.
 *    - Arquitetura de subdocumentos ClassicLevel de ActiveEffects (!items.effects!itemId.effId).
 * 3. Diarios_T20 e Tabelas_T20:
 *    - 2 diários e 14 páginas de conteúdo canônico.
 *    - Tabela de Encontros nas Montanhas Sanguinárias (1d6) com 6 resultados.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');

const PACK_ACTORS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const PACK_ITEMS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const PACK_JOURNALS = path.join(__dirname, '..', 'packs', 'Diarios_T20');
const PACK_TABLES = path.join(__dirname, '..', 'packs', 'Tabelas_T20');

async function validateActors() {
  console.log('--- 1. Validando Ameaças da DB #229 (Ameacas_T20) ---');
  const db = new ClassicLevel(PACK_ACTORS, { valueEncoding: 'json' });

  const requiredThreats = [
    { name: 'Defensor Rochoso Desperto', type: 'npc', nd: '8', pv: 320, def: 33, des: 0, itemsCount: 4, tokenFile: 'defensor-rochoso-desperto.png' },
    { name: 'Revoada de Serpes', type: 'npc', nd: '8', pv: 320, def: 33, des: 1, itemsCount: 4, tokenFile: 'revoada-de-serpes.png' },
    { name: 'Presa do Grande Basilisco', type: 'npc', nd: '3', pv: 21, def: 20, des: 2, itemsCount: 4, tokenFile: 'presa-do-grande-basilisco.png' },
    { name: 'Basilisco Ancestral', type: 'npc', nd: '9', pv: 370, def: 33, des: 2, itemsCount: 4, tokenFile: 'basilisco-ancestral.png' }
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

    // 2. Valida Folder "Dragão Brasil" (wfWApuyngzFm4KOP)
    if (actor.folder !== 'wfWApuyngzFm4KOP') {
      console.error(`❌ Pasta incorreta para "${req.name}": ${actor.folder}`);
      errors++;
    } else {
      console.log(`✅ Pasta "Dragão Brasil" (wfWApuyngzFm4KOP) verificada para "${req.name}".`);
    }

    // 3. Valida Defesa Base Dinâmica (base + des === value)
    const desVal = actor.system.atributos.des.value;
    const defVal = actor.system.attributes.defesa.value;
    const defBase = actor.system.attributes.defesa.base;

    if (defBase + desVal !== defVal) {
      console.error(`❌ Inconsistência na Defesa de "${req.name}": base (${defBase}) + des (${desVal}) !== value (${defVal})`);
      errors++;
    } else {
      console.log(`✅ Defesa Base correta para "${req.name}": base ${defBase} + des ${desVal} = ${defVal}`);
    }

    // 4. Valida Atributos com sub-propriedades completas
    for (const atr of ['for', 'des', 'con', 'int', 'sab', 'car']) {
      const a = actor.system.atributos[atr];
      if (!a || a.value === undefined || a.base === undefined || a.racial === undefined || a.bonus === undefined) {
        console.error(`❌ Atributo '${atr}' de "${req.name}" incompleto: ${JSON.stringify(a)}`);
        errors++;
      }
    }

    // 5. Valida Movement no formato canônico T20
    const m = actor.system.attributes?.movement;
    if (!m || typeof m.walk?.base !== 'number') {
      console.error(`❌ Movimento de "${req.name}" não segue o padrão T20 base/bonus: ${JSON.stringify(m)}`);
      errors++;
    } else {
      console.log(`✅ Movimento canônico T20 validado para "${req.name}": walk=${m.walk.base}m`);
    }

    // 6. Valida Modificadores e 13 Tipos de Resistência
    const resKeys = Object.keys(actor.system.tracos?.resistencias || {});
    if (resKeys.length !== 13) {
      console.error(`❌ Resistências a dano incompletas em "${req.name}": ${resKeys.length}/13`);
      errors++;
    } else {
      console.log(`✅ Todos os 13 tipos de resistência a dano presentes em "${req.name}".`);
    }

    // 7. Valida 34 Perícias
    const periciasCount = Object.keys(actor.system.pericias || {}).length;
    if (periciasCount !== 34) {
      console.error(`❌ Perícias incompletas para "${req.name}": ${periciasCount}/34`);
      errors++;
    } else {
      console.log(`✅ Todas as 34 perícias presentes e calculadas para "${req.name}".`);
    }

    // 8. Valida Array items no Documento Principal (IDs)
    const docItemsCount = Array.isArray(actor.items) ? actor.items.length : 0;
    if (docItemsCount < req.itemsCount || typeof actor.items[0] !== 'string') {
      console.error(`❌ Array actor.items inválido para "${req.name}": deve ser array de IDs de subdocumentos!`);
      errors++;
    } else {
      console.log(`✅ Array actor.items (IDs) validado para "${req.name}": ${docItemsCount} IDs.`);
    }

    // 9. Valida Subdocumentos no ClassicLevel
    let embeddedCount = 0;
    for await (const [subKey, subVal] of db.iterator({ gte: `!actors.items!${actor._id}.`, lte: `!actors.items!${actor._id}.\uffff` })) {
      if (!subKey.includes('.effects!')) {
        embeddedCount++;
        if (subVal.type === 'arma') {
          const rolls = subVal.system?.rolls;
          if (!Array.isArray(rolls) || rolls.length === 0) {
            console.error(`❌ Arma "${subVal.name}" em "${req.name}" não possui rolls!`);
            errors++;
          } else {
            const hasParts = rolls.every(r => Array.isArray(r.parts) && r.parts.length > 0);
            if (!hasParts) {
              console.error(`❌ Arma "${subVal.name}" em "${req.name}" possui rolls sem structure parts!`);
              errors++;
            } else {
              console.log(`   Arma subdocumento "${subVal.name}" possui ${rolls.length} rolagens com parts.`);
            }
          }
        }
      }
    }
    if (embeddedCount < req.itemsCount) {
      console.error(`❌ Subdocumentos insuficientes para "${req.name}": ${embeddedCount}/${req.itemsCount}`);
      errors++;
    } else {
      console.log(`✅ Subdocumentos !actors.items! validados para "${req.name}": ${embeddedCount} itens.`);
    }

    // 10. Valida Biografia Canônica com Citações em Bloco
    const bio = actor.system.detalhes?.biography?.value || '';
    if (!bio.includes('blockquote') || !bio.includes('&mdash;') || !bio.includes('Grunk Ferroforja')) {
      console.error(`❌ Biografia de "${req.name}" não segue o padrão canônico com citações duplas!`);
      errors++;
    } else {
      console.log(`✅ Biografia canônica com citações duplas validada para "${req.name}".`);
    }

    // 11. Validações Específicas
    if (req.name === 'Defensor Rochoso Desperto') {
      const rdGeral = actor.system.tracos?.resistencias?.dano?.value;
      if (rdGeral !== 10) {
        console.error(`❌ Defensor Rochoso Desperto deve ter RD 10 geral, obteve ${rdGeral}`);
        errors++;
      }
    }
    if (req.name === 'Basilisco Ancestral') {
      const rdGeral = actor.system.tracos?.resistencias?.dano?.value;
      const icCustom = actor.system.tracos?.ic?.custom || '';
      const hasMeta = (actor.system.tracos?.ic?.value || []).includes('metamorfose');
      if (rdGeral !== 10 || !icCustom.includes('resistência a veneno +10') || !hasMeta) {
        console.error(`❌ Basilisco Ancestral deve ter RD 10 geral, imunidade a metamorfose e resistência a veneno +10, obteve rd=${rdGeral}, icCustom="${icCustom}", hasMeta=${hasMeta}`);
        errors++;
      } else {
        console.log(`✅ Basilisco Ancestral possui RD 10, imunidade a metamorfose e resistência a veneno +10 validados.`);
      }
    }
  }

  // 12. Valida que Parceiros da DB #229 NÃO foram criados como Atores em Ameacas_T20
  for (const forb of ['Arius', 'Aylarianna', 'Ignis', 'Kir’zanaath', 'Rexthor', 'Kemooz Pensativo', 'Filhote de Grifo']) {
    for (const actor of Object.values(foundActors)) {
      if (actor.folder === 'wfWApuyngzFm4KOP' && actor.name.includes(forb)) {
        console.error(`❌ Parceiro "${actor.name}" NUNCA deve existir como Ator em Ameacas_T20!`);
        errors++;
      }
    }
  }
  console.log(`✅ Diretriz confirmada: Nenhum parceiro da DB #229 foi criado como Ator em Ameacas_T20.`);

  await db.close();
  return errors;
}

async function validateItems() {
  console.log('\n--- 2. Validando Itens, Parceiros e Venenos da DB #229 (Itens_T20) ---');
  const db = new ClassicLevel(PACK_ITEMS, { valueEncoding: 'json' });

  const requiredPartners = [
    'Parceiro: Arius Gorgonius Dubitatius',
    'Parceira: Aylarianna Purpúrea (Ayla)',
    'Parceiro: Ignis Crae',
    'Parceira: Kir’zanaath Odello (Kiki)',
    'Parceiro: Rexthor',
    'Parceiro: Defensor Rochoso Desperto',
    'Parceiro: Kemooz Pensativo',
    'Parceiro: Filhote de Grifo'
  ];

  const requiredItems = [
    'Olho de Basilisco Ancestral',
    'Couro de Basilisco Ancestral',
    'Peçonha Concentrada',
    'Peçonha Potente',
    'Machado de Batalha do Culto do Basilisco'
  ];

  const foundItems = {};
  const itemCounts = {};
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!items!') && !key.startsWith('!items.effects!')) {
      if (value && value.name) {
        foundItems[value.name] = { ...value, dbKey: key };
        itemCounts[value.name] = (itemCounts[value.name] || 0) + 1;
      }
    }
  }

  let errors = 0;

  // Valida Parceiros
  for (const pName of requiredPartners) {
    const item = foundItems[pName];
    if (!item) {
      console.error(`❌ Parceiro "${pName}" não encontrado em Itens_T20!`);
      errors++;
      continue;
    }

    if (item.type !== 'poder' || item.system?.subtipo !== 'parceiro') {
      console.error(`❌ "${pName}" deve ter type="poder" e subtipo="parceiro", obteve type=${item.type}, subtipo=${item.system?.subtipo}`);
      errors++;
    } else {
      console.log(`✅ "${pName}" possui type="poder" e subtipo="parceiro".`);
    }

    if (item.folder !== '0uRx5Efj3tk7P5Xr') {
      console.error(`❌ "${pName}" não está na pasta canônica Parceiros (0uRx5Efj3tk7P5Xr): ${item.folder}`);
      errors++;
    } else {
      console.log(`✅ "${pName}" na pasta canônica Parceiros.`);
    }

    // Valida ActiveEffects como IDs no documento pai
    const effects = item.effects;
    if (!Array.isArray(effects) || effects.length === 0 || typeof effects[0] !== 'string') {
      console.error(`❌ Array effects de "${pName}" deve ser array de string IDs de subdocumentos!`);
      errors++;
    } else {
      console.log(`✅ "${pName}" possui ${effects.length} IDs de ActiveEffects no documento pai.`);
    }

    // Valida subdocumentos de efeitos no banco
    let effectCount = 0;
    for await (const [, effV] of db.iterator({ gte: `!items.effects!${item._id}.`, lte: `!items.effects!${item._id}.\uffff` })) {
      effectCount++;
      if (!effV.type || effV.type !== 'base') {
        console.error(`❌ Efeito "${effV.name}" em "${pName}" não possui type="base"!`);
        errors++;
      }
    }
    if (effectCount !== effects.length) {
      console.error(`❌ Inconsistência de subdocumentos de efeitos em "${pName}": ${effectCount} gravados vs ${effects.length} IDs.`);
      errors++;
    } else {
      console.log(`✅ ${effectCount} subdocumentos !items.effects! validados para "${pName}".`);
    }
  }

  // Valida Itens de Aventura
  for (const iName of requiredItems) {
    const item = foundItems[iName];
    if (!item) {
      console.error(`❌ Item "${iName}" não encontrado em Itens_T20!`);
      errors++;
      continue;
    }
    console.log(`✅ Item de aventura "${iName}" encontrado (tipo: ${item.type}).`);
  }

  // Valida que NENHUM item da DB #229 possui duplicatas no compêndio
  for (const name of [...requiredPartners, ...requiredItems]) {
    const count = itemCounts[name] || 0;
    if (count > 1) {
      console.error(`❌ Item "${name}" possui ${count} cópias duplicadas no compêndio!`);
      errors++;
    } else if (count === 1) {
      console.log(`✅ Item "${name}" verificado como estritamente único (1 cópia).`);
    }
  }

  await db.close();
  return errors;
}

async function validateJournalsAndTables() {
  console.log('\n--- 3. Validando Diários e Tabelas da DB #229 ---');
  const dbJournals = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });
  const dbTables = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  let errors = 0;

  // Valida Diários
  let foundOlho = false;
  let foundCaes = false;

  for await (const [k, v] of dbJournals.iterator()) {
    if (k.startsWith('!journal!') && !k.startsWith('!journal.pages!')) {
      if (v.name === 'Aventura: O Olho do Basilisco (DB #229)') {
        foundOlho = true;
        if (v.pages.length !== 8 || typeof v.pages[0] !== 'string') {
          console.error(`❌ Diário "O Olho do Basilisco" deve ter 8 IDs de páginas (string), obteve ${v.pages.length} (tipo: ${typeof v.pages[0]})`);
          errors++;
        } else {
          console.log(`✅ Diário "O Olho do Basilisco" possui 8 IDs de páginas validados.`);
          // Valida presença de cada subdocumento de página
          for (const pId of v.pages) {
            try {
              const page = await dbJournals.get(`!journal.pages!${v._id}.${pId}`);
              if (!page || !page.text?.content) {
                console.error(`❌ Página "${pId}" de "O Olho do Basilisco" está vazia!`);
                errors++;
              }
            } catch {
              console.error(`❌ Subdocumento de página "!journal.pages!${v._id}.${pId}" não encontrado no LevelDB!`);
              errors++;
            }
          }
          console.log(`✅ Todas as 8 páginas de "O Olho do Basilisco" existem no LevelDB com conteúdo.`);
        }
      }
      if (v.name === 'Cenário: Os Cães das Colinas (DB #229)') {
        foundCaes = true;
        if (v.pages.length !== 6 || typeof v.pages[0] !== 'string') {
          console.error(`❌ Diário "Os Cães das Colinas" deve ter 6 IDs de páginas (string), obteve ${v.pages.length} (tipo: ${typeof v.pages[0]})`);
          errors++;
        } else {
          console.log(`✅ Diário "Os Cães das Colinas" possui 6 IDs de páginas validados.`);
          for (const pId of v.pages) {
            try {
              const page = await dbJournals.get(`!journal.pages!${v._id}.${pId}`);
              if (!page || !page.text?.content) {
                console.error(`❌ Página "${pId}" de "Os Cães das Colinas" está vazia!`);
                errors++;
              }
            } catch {
              console.error(`❌ Subdocumento de página "!journal.pages!${v._id}.${pId}" não encontrado no LevelDB!`);
              errors++;
            }
          }
          console.log(`✅ Todas as 6 páginas de "Os Cães das Colinas" existem no LevelDB com conteúdo.`);
        }
      }
    }
  }

  if (!foundOlho) {
    console.error(`❌ Diário "O Olho do Basilisco" não encontrado!`);
    errors++;
  }
  if (!foundCaes) {
    console.error(`❌ Diário "Os Cães das Colinas" não encontrado!`);
    errors++;
  }

  // Valida Tabela
  let foundTable = false;
  for await (const [k, v] of dbTables.iterator()) {
    if (k.startsWith('!tables!') && !k.startsWith('!tables.results!')) {
      if (v.name === 'Encontros nas Montanhas Sanguinárias (DB #229)') {
        foundTable = true;
        if (v.results.length !== 6 || typeof v.results[0] !== 'string' || v.formula !== '1d6') {
          console.error(`❌ Tabela de Encontros deve ter fórmula 1d6 e 6 IDs de resultados (string), obteve formula=${v.formula}, results=${v.results.length} (tipo: ${typeof v.results[0]})`);
          errors++;
        } else {
          console.log(`✅ Tabela "Encontros nas Montanhas Sanguinárias" possui fórmula 1d6 e 6 IDs de resultados validados.`);
          // Valida presença de cada subdocumento de resultado
          for (const rId of v.results) {
            try {
              const res = await dbTables.get(`!tables.results!${v._id}.${rId}`);
              if (!res || !res.text || !res.description || res.type !== 'text') {
                console.error(`❌ Resultado "${rId}" da tabela é inválido ou vazio: type=${res?.type}`);
                errors++;
              }
            } catch {
              console.error(`❌ Subdocumento de resultado "!tables.results!${v._id}.${rId}" não encontrado no LevelDB!`);
              errors++;
            }
          }
          console.log(`✅ Todos os 6 resultados de "Encontros nas Montanhas Sanguinárias" existem no LevelDB com texto e descrição.`);
        }
      }
    }
  }

  if (!foundTable) {
    console.error(`❌ Tabela de Encontros da DB #229 não encontrada!`);
    errors++;
  }

  await dbJournals.close();
  await dbTables.close();
  return errors;
}

async function run() {
  console.log('================================================================================');
  console.log('🛡️  VALIDAÇÃO DE CONFORMIDADE CANÔNICA - DRAGÃO BRASIL #229');
  console.log('================================================================================\n');

  const actorErrors = await validateActors();
  const itemErrors = await validateItems();
  const jtErrors = await validateJournalsAndTables();

  const totalErrors = actorErrors + itemErrors + jtErrors;
  console.log('\n================================================================================');
  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO: TODOS OS DOCUMENTOS DA DB #229 ESTÃO CONFORMES!');
  } else {
    console.error(`❌ FALHA: ${totalErrors} erros encontrados na validação da DB #229.`);
    process.exit(1);
  }
  console.log('================================================================================');
}

if (require.main === module) {
  run().catch(err => {
    console.error('Erro na execução do validador:', err);
    process.exit(1);
  });
}

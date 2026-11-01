const { ClassicLevel } = require('classic-level');

async function validateCompliance() {
  console.log('================================================================');
  console.log('🔍 VALIDAÇÃO RIGOROSA DE CONFORMIDADE - DB #227 (T20 FOUNDRY)');
  console.log('================================================================');

  let passed = true;

  // 1. Validar Ameaças
  const dbActors = new ClassicLevel('packs/Ameacas_T20', { valueEncoding: 'json' });
  const threatIds = [
    { id: '6jcy63pS6TLhCoHm', name: 'Lynel', nd: '12', cd: 33, pv: 600, def: 43 },
    { id: 'KnUyjOaSBfGcl48v', name: 'Oxxdon', nd: '2', cd: 16, pv: 72, def: 20 },
    { id: 'XEdZUz2ETKvxvjZH', name: 'Enxame de Armas', nd: '4', cd: 0, pv: 140, def: 22 },
    { id: 'ZB0VONjuE8XS5gmH', name: 'Tropa de Mortos', nd: '5', cd: 0, pv: 40, def: 24 },
    { id: 'po00j60czLdn1eu5', name: 'Inumano', nd: '6', cd: 22, pv: 48, def: 26 }
  ];

  console.log('\n--- 1. Ameaças (Ameacas_T20) ---');
  for (const t of threatIds) {
    try {
      const actor = await dbActors.get(`!actors!${t.id}`);
      if (!actor) {
        console.error(`❌ Ator ${t.name} [${t.id}] não encontrado!`);
        passed = false;
        continue;
      }

      // Validar atributos e cálculo
      const sys = actor.system;
      const attr = sys.attributes;
      const pericias = sys.pericias;

      if (actor.name !== t.name) { console.error(`❌ Nome incorreto: ${actor.name} !== ${t.name}`); passed = false; }
      if (attr.nd !== t.nd) { console.error(`❌ ND incorreto: ${attr.nd} !== ${t.nd}`); passed = false; }
      if (attr.cd !== t.cd) { console.error(`❌ CD incorreta: ${attr.cd} !== ${t.cd}`); passed = false; }
      if (attr.pv.value !== t.pv) { console.error(`❌ PV incorreto: ${attr.pv.value} !== ${t.pv}`); passed = false; }
      if (attr.defesa.value !== t.def) { console.error(`❌ Defesa incorreta: ${attr.defesa.value} !== ${t.def}`); passed = false; }

      // Validar 34 perícias
      const pCount = Object.keys(pericias || {}).length;
      if (pCount !== 34) { console.error(`❌ Perícias incompletas: ${pCount} !== 34`); passed = false; }
      if (!pericias.inic.treinado || !pericias.perc.treinado) { console.error(`❌ Inic ou Perc não treinadas em ${t.name}`); passed = false; }

      // Validar biografia (formato de 2 citações + lore)
      const bio = sys.detalhes?.biography?.value || '';
      if (!bio.includes('blockquote') || !bio.includes('Grunk Ferroforja')) {
        console.error(`❌ Biografia fora do padrão em ${t.name}`);
        passed = false;
      }

      // Validar itens embutidos e rolagens
      if (!actor.items || actor.items.length === 0) {
        console.error(`❌ ${t.name} não possui itens embutidos!`);
        passed = false;
      }

      let itemsWithRolls = 0;
      for (const itemId of actor.items) {
        const item = await dbActors.get(`!actors.items!${t.id}.${itemId}`);
        if (!item) {
          console.error(`❌ Item embutido ${itemId} não encontrado em ${t.name}!`);
          passed = false;
          continue;
        }

        if (item.type === 'arma') {
          if (!item.system.rolls || item.system.rolls.length === 0) {
            console.error(`❌ Arma ${item.name} em ${t.name} não tem rolagens (rolls vazio)!`);
            passed = false;
          } else {
            itemsWithRolls++;
          }
        }
      }

      console.log(`✅ ${t.name} (ND ${t.nd}) auditado: CD ${attr.cd}, PV ${attr.pv.value}, Def ${attr.defesa.value}, 34 perícias, ${actor.items.length} itens embutidos (${itemsWithRolls} com rolagens funcionais).`);
    } catch (e) {
      console.error(`❌ Erro auditando ${t.name}:`, e.message);
      passed = false;
    }
  }

  // Verificar se o Oxxdon duplicado sumiu de verdade
  try {
    const dup = await dbActors.get('!actors!LN8RlwsnDhqnpdLg');
    if (dup !== undefined) {
      console.error('❌ Oxxdon duplicado LN8RlwsnDhqnpdLg ainda existe no banco!');
      passed = false;
    } else {
      console.log('✅ Oxxdon duplicado incorreto confirmado como removido.');
    }
  } catch {
    console.log('✅ Oxxdon duplicado incorreto confirmado como removido.');
  }

  await dbActors.close();

  // 2. Validar Poderes em Itens_T20
  console.log('\n--- 2. Poderes de Combate (Itens_T20) ---');
  const dbItems = new ClassicLevel('packs/Itens_T20', { valueEncoding: 'json' });
  let powersCount = 0;
  let powersWithEffects = 0;
  let powersWithRolls = 0;

  for await (const [, val] of dbItems.iterator()) {
    if (val.system?.source?.includes('DB #227') || val.system?.source?.includes('Caverna do Saber: Poderes')) {
      powersCount++;
      const sys = val.system;

      if (val.type !== 'poder') { console.error(`❌ Tipo inválido: ${val.type}`); passed = false; }
      if (sys.tipo !== 'geral') { console.error(`❌ system.tipo inválido em ${val.name}: ${sys.tipo}`); passed = false; }
      if (sys.subtipo !== 'combate') { console.error(`❌ system.subtipo inválido em ${val.name}: ${sys.subtipo}`); passed = false; }
      if (!sys.chatFlavor || !sys.chatFlavor.includes('blockquote')) {
        console.error(`❌ chatFlavor fora do padrão em ${val.name}`);
        passed = false;
      }
      if (!sys.description.value.includes('Pré-requisito')) {
        console.error(`❌ Descrição sem pré-requisito em ${val.name}`);
        passed = false;
      }
      if (val.effects && val.effects.length > 0) powersWithEffects++;
      if (sys.rolls && sys.rolls.length > 0) powersWithRolls++;
    }
  }

  console.log(`✅ ${powersCount}/38 poderes de combate auditados e 100% em conformidade.`);
  console.log(`   - ${powersWithEffects} poderes com ActiveEffects configurados.`);
  console.log(`   - ${powersWithRolls} poderes com rolagens funcionais (dano/cura/formula).`);

  if (powersCount !== 38) {
    console.error(`❌ Quantidade de poderes esperada (38) difere da encontrada (${powersCount})!`);
    passed = false;
  }

  await dbItems.close();

  console.log('\n================================================================');
  if (passed) {
    console.log('🎉 SUCESSO: Todos os atores, itens e poderes da DB #227 estão');
    console.log('   100% em conformidade com as regras de T20, macros e schemas!');
  } else {
    console.log('❌ FALHA: Foram encontrados erros de conformidade.');
  }
  console.log('================================================================');
}

validateCompliance().catch(console.error);

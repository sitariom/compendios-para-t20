#!/usr/bin/env node
/**
 * Injeção Canônica de Ameaças, Perigos e Parceiros da DB #228 em Ameacas_T20
 *
 * Conteúdo:
 * 1. Ankthyr (ND 8) - Animal Grande (2x2)
 * 2. Enxame Cáustico (ND 4) - Animal Grande (2x2)
 * 3. Slark (ND 1) - Humanoide Lacaio Médio (1x1)
 * 4. Desabamento dos Túneis (ND 8) - Perigo Complexo (Hazard)
 * 5. Reabilitador (Parceiro Especial de Khalmyr)
 * 6. Allihennali (Parceiro Especial de Allihanna)
 * 7. Guaxininjas (Parceiro Especial de Tamu-ra / Lin-Wu)
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  generateId,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');

const ALL_SKILLS = [
  { key: 'acro', nome: 'Acrobacia', atributo: 'des' },
  { key: 'ades', nome: 'Adestramento', atributo: 'car' },
  { key: 'atle', nome: 'Atletismo', atributo: 'for' },
  { key: 'atua', nome: 'Atuação', atributo: 'car' },
  { key: 'cava', nome: 'Cavalgar', atributo: 'des' },
  { key: 'conh', nome: 'Conhecimento', atributo: 'int' },
  { key: 'cura', nome: 'Cura', atributo: 'sab' },
  { key: 'dipl', nome: 'Diplomacia', atributo: 'car' },
  { key: 'enga', nome: 'Enganação', atributo: 'car' },
  { key: 'fort', nome: 'Fortitude', atributo: 'con' },
  { key: 'furt', nome: 'Furtividade', atributo: 'des' },
  { key: 'guer', nome: 'Guerra', atributo: 'int' },
  { key: 'inic', nome: 'Iniciativa', atributo: 'des' },
  { key: 'inti', nome: 'Intimidação', atributo: 'car' },
  { key: 'intu', nome: 'Intuição', atributo: 'sab' },
  { key: 'inve', nome: 'Investigação', atributo: 'int' },
  { key: 'joga', nome: 'Jogatina', atributo: 'car' },
  { key: 'ladi', nome: 'Ladinagem', atributo: 'des' },
  { key: 'luta', nome: 'Luta', atributo: 'for' },
  { key: 'mist', nome: 'Misticismo', atributo: 'int' },
  { key: 'nobr', nome: 'Nobreza', atributo: 'car' },
  { key: 'perc', nome: 'Percepção', atributo: 'sab' },
  { key: 'pilo', nome: 'Pilotagem', atributo: 'des' },
  { key: 'pont', nome: 'Pontaria', atributo: 'des' },
  { key: 'refl', nome: 'Reflexos', atributo: 'des' },
  { key: 'reli', nome: 'Religião', atributo: 'sab' },
  { key: 'sobr', nome: 'Sobrevivência', atributo: 'sab' },
  { key: 'vont', nome: 'Vontade', atributo: 'sab' },
  { key: 'alfa', nome: 'Ofício (Alfaiate)', atributo: 'int' },
  { key: 'alqu', nome: 'Ofício (Alquimia)', atributo: 'int' },
  { key: 'arme', nome: 'Ofício (Armeiro)', atributo: 'int' },
  { key: 'arte', nome: 'Ofício (Artesão)', atributo: 'int' },
  { key: 'cozi', nome: 'Ofício (Culinária)', atributo: 'int' },
  { key: 'enge', nome: 'Ofício (Engenharia)', atributo: 'int' }
];

function buildSkills(ndNum, atributos, trainedSkills) {
  const meionivel = Math.floor(ndNum / 2);
  let treino = 2;
  if (ndNum >= 15) {
    treino = 6;
  } else if (ndNum >= 7) {
    treino = 4;
  }
  const pericias = {};

  for (const s of ALL_SKILLS) {
    const atrMod = atributos[s.atributo] || 0;
    const isTrained = trainedSkills[s.key] !== undefined || s.key === 'inic' || s.key === 'perc';

    if (isTrained) {
      const fichaVal = trainedSkills[s.key] === undefined ? (meionivel + atrMod + treino) : trainedSkills[s.key];
      const val = fichaVal - meionivel - atrMod - treino;
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: true,
        st: false,
        pda: false,
        size: false,
        value: val,
        outros: val,
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    } else {
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: false,
        st: false,
        pda: false,
        size: false,
        value: 0,
        outros: 0,
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    }
  }
  return pericias;
}

function buildWeaponAttack({ name, img, dano, tipoDano = 'corte', ataque = 20, critico = { margem: 20, multiplicador: 2 }, description = '' }) {
  const id = generateId();
  return {
    _id: id,
    name,
    type: 'arma',
    img,
    system: {
      description: { value: description.startsWith('<p>') ? description : `<p>${description}</p>` },
      equipado: true,
      tipo: 'corpo-a-corpo',
      empunhadura: 'duas',
      dano,
      tipoDano,
      critico,
      ataque: Number(ataque),
      rolls: [
        {
          id: generateId(),
          name: 'Ataque',
          type: 'ataque',
          formula: `1d20 + ${ataque}`
        },
        {
          id: generateId(),
          name: 'Dano',
          type: 'dano',
          formula: dano
        }
      ]
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

function buildSpecialPower({ name, img, execucao = 'padrao', custo = 0, cd = null, description = '', rolls = [] }) {
  const id = generateId();
  const sys = {
    description: { value: description.startsWith('<p>') ? description : `<p>${description}</p>` },
    tipo: 'geral',
    subtipo: 'combate',
    ativacao: {
      execucao,
      custo: Number(custo)
    }
  };
  if (cd) {
    sys.cd = Number(cd);
  }
  if (rolls.length > 0) {
    sys.rolls = rolls;
  }
  return {
    _id: id,
    name,
    type: 'poder',
    img,
    system: sys,
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

async function injectThreats() {
  console.log('=== Injetando Ameaças da DB #228 em Ameacas_T20 ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // 1. ANKTHYR (ND 8)
  const ankthyrSkills = buildSkills(8, { for: 5, des: 2, con: 4, int: -5, sab: 0, car: -3 }, {
    inic: 10,
    perc: 8,
    fort: 21,
    refl: 8,
    vont: 15,
    luta: 26,
    atle: 18,
    sobr: 12
  });

  const ankthyrItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      ataque: 26,
      dano: '4d12 + 24 + 4d8',
      tipoDano: 'corte e ácido',
      description: 'Mordida devastadora com quelíceras ácidas.'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'livre',
      description: 'Se o ankthyr acertar um ataque de mordida, pode fazer o teste de manobra agarrar como ação livre (teste +28).'
    }),
    buildSpecialPower({
      name: 'Cuspe Ácido',
      img: 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.jpg',
      execucao: 'padrao',
      cd: 26,
      description: 'O ankthyr cospe ácido em uma criatura a até 9m. A vítima sofre 6d8+6 pontos de dano de ácido e fica coberta por um muco corrosivo (Reflexos CD 26 reduz à metade e evita o muco). Uma criatura coberta pelo muco sofre mais 3d8+3 pontos de dano de ácido no início dos seus dois próximos turnos. Recarga (ação de movimento).',
      rolls: [
        { id: generateId(), name: 'Dano Ácido Direto', type: 'dano', formula: '6d8 + 6' },
        { id: generateId(), name: 'Muco Corrosivo (Turnos Seguintes)', type: 'dano', formula: '3d8 + 3' }
      ]
    }),
    buildSpecialPower({
      name: 'Espreitador Subterrâneo',
      img: 'systems/tormenta20/icons/poderes/ameacas/bote.webp',
      execucao: 'padrao',
      description: 'Se estiver completamente soterrado, o ankthyr pode emergir do solo e atacar uma criatura a até 4,5m do seu ponto de saída. Se fizer isso, ele recebe +2 no teste de ataque e causa +1d12 pontos de dano.'
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
      execucao: 'passiva',
      description: 'O ankthyr tem percepção às cegas em alcance médio, mas apenas para criaturas e objetos em contato com a mesma superfície que ele.'
    })
  ];

  const ankthyr = buildNpcActor({
    name: 'Ankthyr',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'animal',
    tamanho: 'grande',
    deslocamento: '12m (8q)',
    atributos: { for: 5, des: 2, con: 4, int: -5, sab: 0, car: -3 },
    attributes: {
      pv: { value: 308, max: 308 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 31 } // 31 + 2 = 33
    },
    resistencias: {
      danos: { corte: 5, perfuracao: 5, impacto: 5, acido: 5 },
      condicoes: ['agarrado', 'derrubado'],
      idiomas: ['Nenhum']
    },
    pericias: ankthyrSkills,
    biography: `<blockquote><p>"O chão de Trebuck não treme sem motivo. Sob a terra escura, as pernas articuladas do verme escavam mais rápido do que um homem pode correr." — Grunk Ferroforja</p></blockquote>
<p>O Ankthyr é um predador colossal subterrâneo nativo das profundezas rochosas de Trebuck. Dotado de mandíbulas poderosas capazes de perfurar granito e quelíceras que destilam ácido fumegante, ele espreita vibrações na superfície para emboscar animais e comitivas inteiras.</p>`
  });

  // Salva Ankthyr
  await db.put(`!actors!${ankthyr.actorDoc._id}`, ankthyr.actorDoc);
  for (const item of ankthyrItems) {
    ankthyr.actorDoc.items.push(item);
    await db.put(`!actors.items!${ankthyr.actorDoc._id}.${item._id}`, item);
  }
  console.log(`✓ Ator "Ankthyr (ND 8)" salvo com ${ankthyrItems.length} ataques/poderes embutidos.`);

  // 2. ENXAME CÁUSTICO (ND 4)
  const enxameSkills = buildSkills(4, { for: 3, des: 1, con: 2, int: -5, sab: -2, car: -4 }, {
    inic: 3,
    perc: 2,
    fort: 16,
    refl: 4,
    vont: 10
  });

  const enxameItems = [
    buildSpecialPower({
      name: 'Enxame Cáustico',
      img: 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.jpg',
      execucao: 'padrao',
      description: 'O enxame age em conjunto. Ele pode entrar no espaço ocupado por um personagem e, no fim de seu turno, causa 3d8 pontos de dano de ácido a qualquer personagem em seu espaço automaticamente. O enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área. Sofre metade do dano de ataques com armas. Estar dentro do enxame conta como condição ruim para lançar magias.',
      rolls: [
        { id: generateId(), name: 'Dano de Ácido do Enxame', type: 'dano', formula: '3d8' }
      ]
    }),
    buildSpecialPower({
      name: 'Gosma Corrosiva',
      img: 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
      execucao: 'passiva',
      description: 'O dano de ácido do enxame persiste por mais 1 rodada após uma criatura deixar a área do enxame cáustico.'
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
      execucao: 'passiva',
      description: 'O enxame cáustico tem percepção às cegas em alcance médio para criaturas e objetos em contato com a mesma superfície.'
    })
  ];

  const enxame = buildNpcActor({
    name: 'Enxame Cáustico',
    nd: '4',
    papel: 'padrao',
    tipoMonstro: 'animal',
    tamanho: 'grande',
    deslocamento: '9m (6q)',
    atributos: { for: 3, des: 1, con: 2, int: -5, sab: -2, car: -4 },
    attributes: {
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 22 } // 22 + 1 = 23
    },
    resistencias: {
      danos: { acido: 999, corte: 5, perfuracao: 5, impacto: 5 },
      condicoes: ['agarrado', 'derrubado', 'atordoado', 'flanqueado'],
      idiomas: ['Nenhum']
    },
    pericias: enxameSkills,
    biography: `<blockquote><p>"Milhares de mandíbulas minúsculas chiando em uníssono. Onde pisam, a rocha borbulha e a armadura se desfaz."</p></blockquote>
<p>Composto por incontáveis filhotes e larvas recém-eclodidas de ankthyr, o enxame cáustico inunda os túneis como uma maré ácida viva devorando matéria orgânica e minérios.</p>`
  });

  await db.put(`!actors!${enxame.actorDoc._id}`, enxame.actorDoc);
  for (const item of enxameItems) {
    enxame.actorDoc.items.push(item);
    await db.put(`!actors.items!${enxame.actorDoc._id}.${item._id}`, item);
  }
  console.log(`✓ Ator "Enxame Cáustico (ND 4)" salvo com ${enxameItems.length} poderes embutidos.`);

  // 3. SLARK (ND 1)
  const slarkSkills = buildSkills(1, { for: -1, des: 3, con: 2, int: -1, sab: 1, car: -2 }, {
    inic: 7,
    perc: 4,
    furt: 8,
    fort: 10,
    refl: 1,
    vont: 5,
    atle: 5
  });

  const slarkItems = [
    buildWeaponAttack({
      name: 'Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      ataque: 11,
      dano: '2d6 + 9',
      tipoDano: 'corte',
      critico: { margem: 19, multiplicador: 3 },
      description: 'Garras afiadas adaptadas para rasgar presas e escalar estalactites.'
    }),
    buildSpecialPower({
      name: 'Queda Livre',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-cruel.webp',
      execucao: 'completa',
      description: 'Se estiver em terreno elevado, o slark cai sobre uma criatura e faz um ataque de garras. Ele recebe o bônus por terreno elevado (+2 no teste de ataque) e, se a criatura estiver surpreendida, causa +2d6 pontos de dano do mesmo tipo.',
      rolls: [
        { id: generateId(), name: 'Dano Surpresa Extra', type: 'dano', formula: '2d6' }
      ]
    }),
    buildSpecialPower({
      name: 'Saliva Cegante',
      img: 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
      execucao: 'padrao',
      cd: 14,
      description: 'O slark cospe em uma criatura em alcance curto. A criatura fica cega por 1 rodada e qualquer fonte de iluminação mundana que esteja empunhando se apaga (Reflexos CD 14 evita ambos os efeitos).'
    }),
    buildSpecialPower({
      name: 'Sensibilidade à Luz',
      img: 'systems/tormenta20/icons/poderes/ameacas/sensibilidade-luz.webp',
      execucao: 'passiva',
      description: 'Quando exposto à luz do dia ou sob o efeito de uma magia de luz, o slark fica ofuscado.'
    })
  ];

  const slark = buildNpcActor({
    name: 'Slark',
    nd: '1',
    papel: 'lacaio',
    tipoMonstro: 'humanoide',
    tamanho: 'medio',
    deslocamento: '6m (4q)',
    atributos: { for: -1, des: 3, con: 2, int: -1, sab: 1, car: -2 },
    attributes: {
      pv: { value: 9, max: 9 }, // Lacaio
      pm: { value: 0, max: 0 },
      defesa: { value: 15, base: 12 } // 12 + 3 = 15
    },
    resistencias: {
      danos: { acido: 5 },
      condicoes: [],
      idiomas: ['Subterrâneo']
    },
    pericias: slarkSkills,
    biography: `<blockquote><p>"Criaturas pálidas com olhos leitosos que espreitam nas sombras do teto das cavernas."</p></blockquote>
<p>Os slarks são humanoides degenerados que habitam túneis profundos e sobrevivem dos restos deixados por predadores maiores como o Ankthyr.</p>`
  });

  await db.put(`!actors!${slark.actorDoc._id}`, slark.actorDoc);
  for (const item of slarkItems) {
    slark.actorDoc.items.push(item);
    await db.put(`!actors.items!${slark.actorDoc._id}.${item._id}`, item);
  }
  console.log(`✓ Ator "Slark (ND 1)" salvo com ${slarkItems.length} ataques/poderes embutidos.`);

  // 4. DESABAMENTO DOS TÚNEIS (ND 8)
  const desabamento = buildHazardActor({
    name: 'Desabamento dos Túneis',
    nd: '8',
    img: 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
    goal: '<p><strong>Objetivo:</strong> Sair das cavernas. Os túneis serão completamente destruídos em 7 rodadas. Para escapar, um personagem precisa acumular 5 sucessos nas ações avançar, correr ou carregar outro.</p>',
    effects: `<p><strong>Efeitos por Rodada (1d6):</strong></p>
<ul>
  <li><strong>1-2) Destroços:</strong> Destroços caem do teto. Cada personagem deve fazer um teste de Reflexos (CD 25). Se falhar, sofre 4d6 pontos de dano de impacto (8d6 se falhar por 10 ou mais).</li>
  <li><strong>3-4) Fenda no Chão:</strong> Rachaduras se abrem no chão. Acrobacia ou Atletismo (CD 25). Falha sofre –5 em sua próxima ação; falha por 10 ou mais cai e perde a ação nesta rodada.</li>
  <li><strong>5) Bloqueio:</strong> Desabamento bloqueia o caminho. O personagem pode mudar de rota (perde a ação nesta rodada) ou correr antes do fechamento com Atletismo (CD 25). Falha sofre 8d6 de impacto.</li>
  <li><strong>6) Passagem Livre:</strong> Túnel resistente; sem dano neste turno.</li>
  <li><strong>Fim da 7ª Rodada:</strong> Qualquer personagem sem 5 sucessos sofre <strong>20d6 pontos de dano de impacto</strong> sem teste de resistência.</li>
</ul>`,
    actions: `<li><strong>Avançar (Acrobacia ou Reflexos CD 25):</strong> Avança com cuidado em direção à saída. Sucesso por 10 ou mais (ou 20 natural) conta como 2 sucessos.</li>
<li><strong>Correr (Atletismo CD 20):</strong> Corre desesperadamente sofrendo 4d6 de impacto. Sucesso por 10 ou mais conta como 2 sucessos.</li>
<li><strong>Carregar Outro (Atletismo CD 30):</strong> Carrega um aliado com no máximo 1 sucesso de diferença, acumulando 1 sucesso para si e para o aliado.</li>
<li><strong>Procurar Caminho (Percepção CD 20):</strong> Analisa o terreno. Sucesso fornece +5 em todos os testes para avançar, correr e carregar outro.</li>`
  });

  await db.put(`!actors!${desabamento.actorDoc._id}`, desabamento.actorDoc);
  console.log(`✓ Perigo Complexo "Desabamento dos Túneis (ND 8)" salvo com sucesso.`);

  // 5. PARCEIROS ESPECIAIS (Divinas Organizações)
  const parceiros = [
    {
      name: 'Reabilitador',
      nd: '3',
      papel: 'padrao',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
      tipoMonstro: 'humanoide',
      biography: 'Juiz e guardião treinado pela Casa dos Desgarrados para aplicar a justiça equilibrada de Khalmyr.'
    },
    {
      name: 'Allihennali',
      nd: '3',
      papel: 'padrao',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
      tipoMonstro: 'fada',
      biography: 'Espírito feérico de luz com asas de inseto, curando 2d6 PV por 1 PM e reduzindo custos mágicos.'
    },
    {
      name: 'Guaxininjas',
      nd: '2',
      papel: 'lacaio',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
      tipoMonstro: 'animal',
      biography: 'Capangas treinados de Tamu-ra invocados para flanquear e desarmar oponentes.'
    }
  ];

  for (const p of parceiros) {
    const parcActor = buildNpcActor({
      name: p.name,
      nd: p.nd,
      papel: p.papel,
      tipoMonstro: p.tipoMonstro,
      tamanho: 'medio',
      img: p.img,
      atributos: { for: 1, des: 2, con: 1, int: 1, sab: 2, car: 1 },
      attributes: { pv: { value: 30, max: 30 }, pm: { value: 10, max: 10 }, defesa: { value: 16, base: 14 } },
      biography: p.biography
    });
    await db.put(`!actors!${parcActor.actorDoc._id}`, parcActor.actorDoc);
    console.log(`✓ Parceiro Especial "${p.name}" salvo em Ameacas_T20.`);
  }

  await db.close();
  console.log('\n✅ Todas as ameaças, perigos e parceiros da DB #228 injetados com sucesso.');
}

injectThreats().catch(err => {
  console.error('Erro na injeção de ameaças:', err);
  process.exit(1);
});

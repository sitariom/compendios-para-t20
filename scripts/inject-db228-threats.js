#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças, Perigos e Parceiros da DB #228 em Ameacas_T20
 *
 * Padrão IDÊNTICO à Dragão Brasil #227 (Lynel, Oxxdon, Enxame de Armas, Inumano):
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
  buildSkills,
  buildTracos,
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const FOLDER_DB = 'wfWApuyngzFm4KOP'; // Pasta canônica "Dragão Brasil" em Ameacas_T20

async function injectThreats() {
  console.log('=== Injetando Ameaças, Perigos e Parceiros da DB #228 em Ameacas_T20 (Padrão Canônico DB #227) ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // -------------------------------------------------------------
  // 1. ANKTHYR (ND 8) - Animal Grande (2x2)
  // -------------------------------------------------------------
  const ankthyrId = 'NS5u871jRBLCe1CA';
  console.log(`Limpando e reconstruindo Ankthyr [${ankthyrId}]...`);

  // Limpa subdocumentos antigos
  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${ankthyrId}.`)) {
      await db.del(key);
    }
  }

  const ankthyrSkills = buildSkills(8, { for: 5, des: 2, con: 4, int: -5, sab: 0, car: -3 }, {
    inic: 10,
    perc: 8,
    fort: 21,
    refl: 8,
    vont: 15,
    luta: 26
  });

  const ankthyrItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d12+24',
      tipoDano: 'corte',
      danoExtra: '4d8',
      tipoDanoExtra: 'acido',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> 4d12+24 corte mais 4d8 ácido, crítico 20/x2.</p>',
      flavorPhrase: '*CHIIII-HSSSSHH!* As quelíceras afiadas se projetam gotejando ácido borbulhante!',
      flavorAction: 'O Ankthyr ataca com suas mandíbulas esmagadoras'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'livre',
      custo: 0,
      description: '<p><strong>Ação Livre:</strong> Se o ankthyr acertar um ataque de mordida, pode fazer o teste de manobra agarrar como ação livre (teste +28).</p>',
      flavorPhrase: 'As patas quitinosas e mandíbulas travam a presa contra a rocha!',
      flavorAction: 'Tenta prender o alvo com garras e mandíbulas',
      rolls: [
        {
          name: 'Manobra Agarrar (+28)',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['luta', '', ''], [2, '', '']], // 26 luta + 2 = 28
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Cuspe Ácido',
      img: 'systems/tormenta20/icons/poderes/ameacas/baforada.webp',
      execucao: 'padrao',
      custo: 0,
      cd: 26,
      alcance: 'curto (9m)',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 26 reduz à metade e evita o muco corrosivo.',
      description: '<p><strong>Ação Padrão:</strong> O ankthyr cospe ácido em uma criatura a até 9m. A vítima sofre 6d8+6 pontos de dano de ácido e fica coberta por um muco corrosivo (Ref CD 26 reduz à metade e evita o muco). Uma criatura coberta pelo muco sofre mais 3d8+3 pontos de dano de ácido no início dos seus dois próximos turnos. <em>Recarga: ação de movimento.</em></p>',
      flavorPhrase: 'Um jato verde-esmeralda fervente chia no ar em direção à vítima!',
      flavorAction: 'Expele uma rajada de líquido corrosivo',
      rolls: [
        {
          name: 'Dano de Ácido Inicial',
          key: 'dano0',
          type: 'dano',
          parts: [['6d8+6', 'acido', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Muco Contínuo (2 rodadas)',
          key: 'dano1',
          type: 'dano',
          parts: [['3d8+3', 'acido', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Muco Corrosivo (Ankthyr)',
          description: 'Sofre 3d8+3 pontos de dano de ácido no início de cada um dos dois próximos turnos.',
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Espreitador Subterrâneo',
      img: 'systems/tormenta20/icons/poderes/ameacas/espreitador.webp',
      execucao: 'padrao',
      custo: 0,
      description: '<p><strong>Ação Padrão:</strong> Se estiver completamente soterrado, o ankthyr pode emergir do solo e atacar uma criatura a até 4,5m do seu ponto de saída. Se fizer isso, ele recebe +2 no teste de ataque e causa +1d12 pontos de dano.</p>',
      flavorPhrase: 'A terra treme e explode com a ascensão violenta da fera!',
      flavorAction: 'Emerge do subsolo de surpresa atacando o alvo',
      rolls: [
        {
          name: 'Dano Extra de Bote Subterrâneo',
          key: 'dano0',
          type: 'dano',
          parts: [['1d12', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/sentido-sismico.webp',
      execucao: 'passiva',
      custo: 0,
      description: '<p>O ankthyr tem percepção às cegas em alcance médio, mas apenas para criaturas e objetos em contato com a mesma superfície que ele.</p>',
      flavorPhrase: 'O menor passo na superfície reverbera nas carapaças do verme subterrâneo.',
      flavorAction: 'Detecta vibrações transmitidas pela terra e pela rocha'
    })
  ];

  const ankthyrTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { dano: 5, acido: 5 },
    icValue: ['agarrado', 'derrubado'],
    idiomasValue: []
  });

  const ankthyrBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CHIIII-HSSSSHH!* &mdash; O ranger ensurdecedor de mandíbulas de quitina e o borbulhar cáustico ecoam das paredes de pedra sob Trebuck."<br><span style="font-weight: bold; color: #800000;">&mdash; Ankthyr, Verme Devorador de Trebuck</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"O chão de Trebuck não treme sem motivo. Sob a terra escura, as pernas articuladas do verme escavam mais rápido do que um homem pode correr."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ankthyr</span> é um predador colossal subterrâneo nativo das profundezas rochosas de Trebuck. Maior que um cavalo e dotado de três pares de patas finas articuladas e carapaça quitinosa ultrarresistente, espreita vibrações na superfície para emboscar animais e mineiros incautos com suas mandíbulas de ácido corrosivo.</p>`;

  const ankthyr = buildNpcActor({
    id: ankthyrId,
    name: 'Ankthyr',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'ani',
    raca: 'Animal',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: '12m (8q), escavação 6m (4q)',
    sentidos: 'percepção às cegas em alcance médio, visão no escuro',
    tesouro: 'Metade',
    atributos: { for: 5, des: 2, con: 4, int: -5, sab: 0, car: -3 },
    attributes: {
      cd: 26,
      pv: { value: 308, max: 308 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 31 } // 31 + 2 = 33
    },
    resistencias: ankthyrTracos,
    pericias: ankthyrSkills,
    items: ankthyrItems,
    ataquescac: 'Mordida +26 (4d12+24 mais 4d8 ácido, 20).',
    ataquesad: 'Cuspe ácido curto (6d8+6 mais muco corrosivo, CD 26).',
    biography: ankthyrBio
  });

  await db.put(`!actors!${ankthyrId}`, ankthyr.actorDoc);
  for (const ed of ankthyr.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Ankthyr (ND 8)" salvo com ${ankthyr.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 2. ENXAME CÁUSTICO (ND 4) - Animal Grande (2x2)
  // -------------------------------------------------------------
  const enxameId = 'S115R6Jr8xEcOQBq';
  console.log(`Limpando e reconstruindo Enxame Cáustico [${enxameId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${enxameId}.`)) {
      await db.del(key);
    }
  }

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
      img: 'systems/tormenta20/icons/poderes/ameacas/enxame.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O enxame cáustico age em conjunto. Ele pode entrar no espaço ocupado por um personagem e, no fim de seu turno, causa <strong>3d8 pontos de dano de ácido</strong> a qualquer personagem em seu espaço automaticamente.</p><p>O enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área, como Bola de Fogo. Além disso, sofre apenas metade do dano de ataques com armas. Estar dentro do enxame conta como condição ruim para lançar magias.</p>',
      flavorPhrase: '*CRAAC-CHHHH-CHHHH!* Uma maré de mandíbulas microscópicas dissolve armaduras e carne!',
      flavorAction: 'Inunda o espaço dos personagens provocando corrosão generalizada',
      rolls: [
        {
          name: 'Dano de Ácido do Enxame',
          key: 'dano0',
          type: 'dano',
          parts: [['3d8', 'acido', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Gosma Corrosiva',
      img: 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O dano de ácido do enxame persiste por mais 1 rodada após uma criatura deixar a área do enxame cáustico.</p>',
      flavorPhrase: 'O muco verde pegajoso continua a chiar e corroer a pele por mais um turno.',
      flavorAction: 'Aplica corrosão residual contínua',
      rolls: [
        {
          name: 'Dano Residual de Ácido (1 rodada)',
          key: 'dano0',
          type: 'dano',
          parts: [['3d8', 'acido', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/sentido-sismico.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O enxame cáustico tem percepção às cegas em alcance médio, mas apenas para criaturas e objetos em contato com a mesma superfície que ele.</p>',
      flavorPhrase: 'Centenas de patas minúsculas sentem as pulsações rítmicas na caverna.',
      flavorAction: 'Localiza presas pelas vibrações de seus passos no solo'
    })
  ];

  const enxameTracos = buildTracos({
    tamanho: 'gra',
    resistencias: {},
    imunidadesDano: ['acido'],
    icValue: ['agarrado', 'derrubado', 'atordoado', 'flanqueado'],
    idiomasValue: []
  });

  const enxameBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CRAAC-CHHHH-CHHHH!* &mdash; O uníssono aterrorizante de milhares de pequenos ferrões e mandíbulas dissolvendo a rocha viva."<br><span style="font-weight: bold; color: #800000;">&mdash; Enxame Cáustico de Trebuck</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Milhares de mandíbulas minúsculas chiando em uníssono. Onde pisam, a rocha borbulha e a armadura se desfaz."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Composto por incontáveis filhotes e larvas recém-eclodidas de ankthyr, o <span style="color: #800000; font-weight: bold;">Enxame Cáustico</span> inunda os túneis subterrâneos como uma torrente viva e ácida, devorando rapidamente qualquer matéria orgânica que cruze suas galerias.</p>`;

  const enxame = buildNpcActor({
    id: enxameId,
    name: 'Enxame Cáustico',
    nd: '4',
    papel: 'padrao',
    tipoMonstro: 'ani',
    raca: 'Animal',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: '9m (6q), escavação 6m (4q)',
    sentidos: 'percepção às cegas em alcance médio, visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 3, des: 1, con: 2, int: -5, sab: -2, car: -4 },
    attributes: {
      cd: 14,
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 22 } // 22 + 1 = 23
    },
    resistencias: enxameTracos,
    pericias: enxameSkills,
    items: enxameItems,
    ataquescac: 'Dano automático de ácido 3d8 ao fim do turno.',
    biography: enxameBio
  });

  await db.put(`!actors!${enxameId}`, enxame.actorDoc);
  for (const ed of enxame.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Enxame Cáustico (ND 4)" salvo com ${enxame.actorDoc.items.length} poderes embutidos.`);

  // -------------------------------------------------------------
  // 3. SLARK (ND 1) - Humanoide Lacaio Médio (1x1)
  // -------------------------------------------------------------
  const slarkId = 'vvsdGwGzTR1mQSVX';
  console.log(`Limpando e reconstruindo Slark [${slarkId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${slarkId}.`)) {
      await db.del(key);
    }
  }

  const slarkSkills = buildSkills(1, { for: -1, des: 3, con: 2, int: -1, sab: 1, car: -2 }, {
    inic: 7,
    perc: 4,
    furt: 8,
    fort: 10,
    refl: 1,
    vont: 5,
    luta: 11
  });

  const slarkItems = [
    buildWeaponAttack({
      name: 'Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+9',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> 2d6+9 corte, crítico 19/x3.</p>',
      flavorPhrase: '*SKREEE-KIKIKI!* Garras afiadas descem do teto cavernoso!',
      flavorAction: 'Desfere um golpe de garras cortante'
    }),
    buildSpecialPower({
      name: 'Queda Livre',
      img: 'systems/tormenta20/icons/poderes/ameacas/bote.webp',
      execucao: 'completa',
      custo: 0,
      description: '<p><strong>Ação Completa:</strong> Se estiver em terreno elevado, o slark cai sobre uma criatura e faz um ataque de garras. Ele recebe o bônus por terreno elevado (+2 no teste de ataque) e, se a criatura estiver surpreendida, causa +2d6 pontos de dano do mesmo tipo.</p>',
      flavorPhrase: 'O vulto pálido desaba do teto caindo direto sobre os ombros da presa!',
      flavorAction: 'Lança-se em queda livre desferindo garras com impulso mortal',
      rolls: [
        {
          name: 'Dano Extra de Queda Surpresa',
          key: 'dano0',
          type: 'dano',
          parts: [['2d6', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Saliva',
      img: 'systems/tormenta20/icons/poderes/ameacas/saliva.webp',
      execucao: 'padrao',
      custo: 0,
      cd: 14,
      alcance: 'curto',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 14 evita cegueira e apagar tochas.',
      description: '<p><strong>Ação Padrão:</strong> O slark cospe em uma criatura em alcance curto. A criatura fica cega por 1 rodada e qualquer fonte de iluminação mundana que esteja empunhando se apaga (Ref CD 14 evita ambos os efeitos).</p>',
      flavorPhrase: '*PTUUU!* Um cuspe viscoso atinge os olhos e apaga a tocha!',
      flavorAction: 'Cospe saliva pegajosa apagando luzes e cegando a vítima',
      rolls: [
        {
          name: 'Resistência da Saliva',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['refl', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Cego pela Saliva do Slark',
          description: 'A criatura fica cega por 1 rodada.',
          transfer: false
        }
      ]
    })
  ];

  const slarkTracos = buildTracos({
    tamanho: 'med',
    resistencias: { acido: 5 },
    idiomasValue: ['subterraneo']
  });

  const slarkBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Hssss... carne quente... carne que desceu ao escuro...* &mdash; Os sussurros desarticulados ecoam entre as frestas do teto."<br><span style="font-weight: bold; color: #800000;">&mdash; Slark das Profundezas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Criaturas pálidas com olhos leitosos que espreitam nas sombras do teto das cavernas. Nunca caminhe sob estalagmites sem olhar para cima."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Os <span style="color: #800000; font-weight: bold;">Slarks</span> são humanoides degenerados que habitam túneis profundos e sobrevivem dos restos deixados por predadores maiores como o Ankthyr. Ágeis escaladores de paredes e tetos úmidos, atacam em grupos usando saliva viscosa para apagar tochas antes de desabar sobre suas vítimas.</p>`;

  const slark = buildNpcActor({
    id: slarkId,
    name: 'Slark',
    nd: '1',
    papel: 'lacaio',
    tipoMonstro: 'hum',
    raca: 'Humanoide (slark)',
    tamanho: 'med',
    folder: FOLDER_DB,
    deslocamento: '6m (4q), escalada 6m (4q)',
    sentidos: 'sensibilidade à luz, visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: -1, des: 3, con: 2, int: -1, sab: 1, car: -2 },
    attributes: {
      cd: 14,
      pv: { value: 9, max: 9 }, // Lacaio
      pm: { value: 0, max: 0 },
      defesa: { value: 15, base: 12 } // 12 + 3 = 15
    },
    resistencias: slarkTracos,
    pericias: slarkSkills,
    items: slarkItems,
    ataquescac: 'Garras +11 (2d6+9, 19/x3).',
    biography: slarkBio
  });

  await db.put(`!actors!${slarkId}`, slark.actorDoc);
  for (const ed of slark.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Slark (ND 1)" salvo com ${slark.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 4. DESABAMENTO DOS TÚNEIS (ND 8) - Perigo Complexo (Hazard)
  // -------------------------------------------------------------
  const desabamentoId = 'Wcz6S9LS4zAXCRZg';
  const desabamento = buildHazardActor({
    name: 'Desabamento dos Túneis',
    nd: '8',
    img: 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
    folder: FOLDER_DB,
    goal: '<p><strong>Objetivo:</strong> Sair das cavernas. Os túneis serão completamente destruídos em 7 rodadas. Para escapar, um personagem precisa acumular 5 sucessos nas ações avançar, correr ou carregar outro.</p>',
    effects: `<p><strong>Efeitos por Rodada (Role 1d6 no início de cada rodada):</strong></p>
<ul>
  <li><strong>1-2) Destroços:</strong> Destroços caem do teto. Cada personagem deve fazer um teste de Reflexos (CD 25). Se falhar, sofre 4d6 pontos de dano de impacto (8d6 se falhar por 10 ou mais).</li>
  <li><strong>3-4) Fenda no Chão:</strong> Rachaduras se abrem no chão. Acrobacia ou Atletismo (CD 25). Falha sofre –5 em sua próxima ação; falha por 10 ou mais cai e perde a ação nesta rodada.</li>
  <li><strong>5) Bloqueio:</strong> Desabamento bloqueia o caminho. O personagem pode mudar de rota (perde a ação nesta rodada) ou correr antes do fechamento com Atletismo (CD 25). Falha sofre 8d6 de impacto e perde a ação.</li>
  <li><strong>6) Passagem Livre:</strong> Túnel resistente; sem efeito neste turno, mas devem continuar correndo.</li>
</ul>
<p><em>Fim da 7ª rodada:</em> Qualquer personagem que não tiver acumulado 5 sucessos é soterrado, sofrendo <strong>20d6 pontos de dano de impacto</strong> (sem direito a teste de resistência).</p>`,
    actions: `<li><strong>Avançar (Acrobacia ou Reflexos CD 25):</strong> Avança com cuidado em direção à saída. Sucesso por 10 ou mais (ou 20 natural) conta como 2 sucessos.</li>
<li><strong>Correr (Atletismo CD 20):</strong> Corre sem cautela sofrendo 4d6 de impacto. Sucesso por 10+ (ou 20 natural) conta como 2 sucessos.</li>
<li><strong>Carregar Outro (Atletismo CD 30):</strong> Carrega um aliado próximo com no máximo 1 sucesso de diferença. Sucesso acumula 1 sucesso para ambos; falha causa dano a ambos.</li>
<li><strong>Procurar Caminho (Percepção CD 20):</strong> Analisa o terreno. Sucesso concede +5 em todos os testes para avançar, correr e carregar outro até o fim da fuga.</li>`
  });
  desabamento.actorDoc._id = desabamentoId;
  desabamento.actorDoc.folder = FOLDER_DB;

  await db.put(`!actors!${desabamentoId}`, desabamento.actorDoc);
  console.log(`✓ Perigo Complexo "Desabamento dos Túneis (ND 8)" salvo com sucesso.`);

  // Limpeza de quaisquer chaves residuais de parceiros que não devem ser atores
  const partnerIds = ['f2Ni3NoMHdlE3tiQ', 'wnXIF77NvB1BE61v', 'apEjmWLSDKFIII3D'];
  for await (const [key] of db.iterator()) {
    if (partnerIds.some(pid => key.includes(pid))) {
      await db.del(key);
    }
  }

  await db.close();
  console.log('\n✅ Todas as 4 ameaças e perigos da DB #228 injetados com 100% de conformidade canônica em Ameacas_T20.');
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('Erro na injeção de ameaças:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

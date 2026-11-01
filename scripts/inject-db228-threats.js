#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças, Perigos e Parceiros da DB #228 em Ameacas_T20
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
  buildSkills,
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');

async function injectThreats() {
  console.log('=== Injetando Ameaças, Perigos e Parceiros da DB #228 em Ameacas_T20 ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // -------------------------------------------------------------
  // 1. ANKTHYR (ND 8) - Animal Grande (2x2)
  // -------------------------------------------------------------
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
      dano: '4d12 + 24 mais 4d8 ácido',
      tipoDano: 'corte e ácido',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: 'Mordida devastadora com mandíbulas de quitina e quelíceras que gotejam ácido.',
      flavorPhrase: '*CHIIII-HSSSSHH!* As quelíceras afiadas se projetam gotejando ácido borbulhante!',
      flavorAction: 'O Ankthyr ataca com suas mandíbulas esmagadoras'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'livre',
      custo: 0,
      description: 'Se o ankthyr acertar um ataque de mordida, pode fazer o teste de manobra agarrar como ação livre (teste +28).',
      flavorPhrase: 'As patas quitinosas e mandíbulas travam a presa contra a rocha!',
      flavorAction: 'Tenta prender o alvo com garras e mandíbulas',
      rolls: [
        {
          name: 'Manobra Agarrar',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['luta', '', ''], [28, '', '']],
          versatil: ''
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
      description: 'O ankthyr cospe ácido em uma criatura a até 9m. A vítima sofre 6d8+6 pontos de dano de ácido e fica coberta por um muco corrosivo (Ref CD 26 reduz à metade e evita o muco). Uma criatura coberta pelo muco sofre mais 3d8+3 pontos de dano de ácido no início dos seus dois próximos turnos. Recarga (movimento).',
      flavorPhrase: 'Um jato verde-esmeralda fervente chia no ar em direção à vítima!',
      flavorAction: 'Expele uma rajada de líquido corrosivo',
      rolls: [
        {
          name: 'Dano de Ácido Inicial',
          key: 'dano0',
          type: 'dano',
          parts: [['6d8+6', 'acido', '']],
          versatil: ''
        },
        {
          name: 'Dano de Muco Contínuo (2 rodadas)',
          key: 'dano1',
          type: 'dano',
          parts: [['3d8+3', 'acido', '']],
          versatil: ''
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
      description: 'Se estiver completamente soterrado, o ankthyr pode emergir do solo e atacar uma criatura a até 4,5m do seu ponto de saída. Se fizer isso, ele recebe +2 no teste de ataque e causa +1d12 pontos de dano.',
      flavorPhrase: 'A terra treme e explode com a ascensão violenta da fera!',
      flavorAction: 'Emerge do subsolo de surpresa atacando o alvo',
      rolls: [
        {
          name: 'Dano Extra de Bote Subterrâneo',
          key: 'dano0',
          type: 'dano',
          parts: [['1d12', 'impacto', '']],
          versatil: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/sentido-sismico.webp',
      execucao: 'passiva',
      custo: 0,
      description: 'O ankthyr tem percepção às cegas em alcance médio, mas apenas para criaturas e objetos em contato com a mesma superfície que ele.',
      flavorPhrase: 'O menor passo na superfície reverbera nas carapaças do verme subterrâneo.',
      flavorAction: 'Detecta vibrações transmitidas pela terra e pela rocha'
    })
  ];

  const ankthyrBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CHIIII-HSSSSHH!* &mdash; O ranger ensurdecedor de mandíbulas de quitina e o borbulhar cáustico ecoam das paredes de pedra sob Trebuck."<br><span style="font-weight: bold; color: #800000;">&mdash; Ankthyr, Verme Devorador de Trebuck</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"O chão de Trebuck não treme sem motivo. Sob a terra escura, as pernas articuladas do verme escavam mais rápido do que um homem pode correr."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ankthyr</span> é um predador colossal subterrâneo nativo das profundezas rochosas de Trebuck. Maior que um cavalo e dotado de três pares de patas finas articuladas e carapaça quitinosa ultrarresistente, espreita vibrações na superfície para emboscar animais e mineiros incautos com suas mandíbulas de ácido corrosivo.</p>`;

  const ankthyr = buildNpcActor({
    name: 'Ankthyr',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'animal',
    tamanho: 'grande',
    deslocamento: '12m (8q), escavação 6m (4q)',
    sentidos: 'percepção às cegas em alcance médio (vibrações no solo), visão no escuro',
    tesouro: 'Metade',
    atributos: { for: 5, des: 2, con: 4, int: -5, sab: 0, car: -3 },
    attributes: {
      cd: 26,
      pv: { value: 308, max: 308 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 31 } // 31 + 2 = 33
    },
    resistencias: {
      danos: { corte: 5, perfuracao: 5, impacto: 5, acido: 5 },
      condicoes: ['agarrado', 'derrubado'],
      idiomas: ['Nenhum'],
      txt: 'Redução de ácido 5, redução de dano 5 (corte, perfuração, impacto 5)'
    },
    pericias: ankthyrSkills,
    items: ankthyrItems,
    biography: ankthyrBio
  });

  await db.put(`!actors!${ankthyr.actorDoc._id}`, ankthyr.actorDoc);
  for (const ed of ankthyr.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Ankthyr (ND 8)" salvo com ${ankthyr.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 2. ENXAME CÁUSTICO (ND 4) - Animal Grande (2x2)
  // -------------------------------------------------------------
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
      execucao: 'passiva',
      custo: 0,
      description: 'O enxame cáustico age em conjunto. Ele pode entrar no espaço ocupado por um personagem e, no fim de seu turno, causa 3d8 pontos de dano de ácido a qualquer personagem em seu espaço automaticamente. O enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área, como Bola de Fogo. Além disso, sofre apenas metade do dano de ataques com armas. Estar dentro do enxame conta como condição ruim para lançar magias.',
      flavorPhrase: '*CRAAC-CHHHH-CHHHH!* Uma maré de mandíbulas microscópicas dissolve armaduras e carne!',
      flavorAction: 'Inunda o espaço dos personagens provocando corrosão generalizada',
      rolls: [
        {
          name: 'Dano Automático de Ácido do Enxame',
          key: 'dano0',
          type: 'dano',
          parts: [['3d8', 'acido', '']],
          versatil: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Gosma Corrosiva',
      img: 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
      execucao: 'passiva',
      custo: 0,
      description: 'O dano de ácido do enxame persiste por mais 1 rodada após uma criatura deixar a área do enxame cáustico.',
      flavorPhrase: 'O muco verde pegajoso continua a chiar e corroer a pele por mais um turno.',
      flavorAction: 'Aplica corrosão residual contínua',
      rolls: [
        {
          name: 'Dano Residual de Gosma (1 rodada)',
          key: 'dano0',
          type: 'dano',
          parts: [['3d8', 'acido', '']],
          versatil: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Sentido Sísmico',
      img: 'systems/tormenta20/icons/poderes/ameacas/sentido-sismico.webp',
      execucao: 'passiva',
      custo: 0,
      description: 'O enxame cáustico tem percepção às cegas em alcance médio, mas apenas para criaturas e objetos em contato com a mesma superfície que ele.',
      flavorPhrase: 'Centenas de patas minúsculas sentem as pulsações rítmicas na caverna.',
      flavorAction: 'Localiza presas pelas vibrações de seus passos no solo'
    })
  ];

  const enxameBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CRAAC-CHHHH-CHHHH!* &mdash; O uníssono aterrorizante de milhares de pequenos ferrões e mandíbulas dissolvendo a rocha viva."<br><span style="font-weight: bold; color: #800000;">&mdash; Enxame Cáustico de Trebuck</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Milhares de mandíbulas minúsculas chiando em uníssono. Onde pisam, a rocha borbulha e a armadura se desfaz."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Composto por incontáveis filhotes e larvas recém-eclodidas de ankthyr, o <span style="color: #800000; font-weight: bold;">Enxame Cáustico</span> inunda os túneis subterrâneos como uma torrente viva e ácida, devorando rapidamente qualquer matéria orgânica que cruze suas galerias.</p>`;

  const enxame = buildNpcActor({
    name: 'Enxame Cáustico',
    nd: '4',
    papel: 'padrao',
    tipoMonstro: 'animal',
    tamanho: 'grande',
    deslocamento: '9m (6q), escavação 6m (4q)',
    sentidos: 'percepção às cegas em alcance médio (vibrações no solo), visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 3, des: 1, con: 2, int: -5, sab: -2, car: -4 },
    attributes: {
      cd: 14,
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 22 } // 22 + 1 = 23
    },
    resistencias: {
      danos: { acido: 999, corte: 5, perfuracao: 5, impacto: 5 },
      condicoes: ['agarrado', 'derrubado', 'atordoado', 'flanqueado'],
      idiomas: ['Nenhum'],
      txt: 'Imunidade a ácido, RD 5 a corte, perfuração e impacto, imune a manobras'
    },
    pericias: enxameSkills,
    items: enxameItems,
    biography: enxameBio
  });

  await db.put(`!actors!${enxame.actorDoc._id}`, enxame.actorDoc);
  for (const ed of enxame.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Enxame Cáustico (ND 4)" salvo com ${enxame.actorDoc.items.length} poderes embutidos.`);

  // -------------------------------------------------------------
  // 3. SLARK (ND 1) - Humanoide Lacaio Médio (1x1)
  // -------------------------------------------------------------
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
      dano: '2d6+9',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: 'Golpes cortantes rápidos com unhas afiadas e recurvadas.',
      flavorPhrase: '*SKREEE-KIKIKI!* Garras afiadas descem do teto cavernoso!',
      flavorAction: 'Desfere um golpe de garras cortante'
    }),
    buildSpecialPower({
      name: 'Queda Livre',
      img: 'systems/tormenta20/icons/poderes/ameacas/bote.webp',
      execucao: 'completa',
      custo: 0,
      description: 'Se estiver em terreno elevado, o slark cai sobre uma criatura e faz um ataque de garras. Ele recebe o bônus por terreno elevado (+2 no teste de ataque) e, se a criatura estiver surpreendida, causa +2d6 pontos de dano do mesmo tipo.',
      flavorPhrase: 'O vulto pálido desaba do teto caindo direto sobre os ombros da presa!',
      flavorAction: 'Lança-se em queda livre desferindo garras com impulso mortal',
      rolls: [
        {
          name: 'Dano Adicional por Emboscada em Queda',
          key: 'dano0',
          type: 'dano',
          parts: [['2d6', 'corte', '']],
          versatil: ''
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
      description: 'O slark cospe em uma criatura em alcance curto. A criatura fica cega por 1 rodada e qualquer fonte de iluminação mundana que esteja empunhando se apaga (Ref CD 14 evita ambos os efeitos).',
      flavorPhrase: '*PTUUU!* Um cuspe viscoso atinge os olhos e apaga a tocha!',
      flavorAction: 'Cospe saliva pegajosa apagando luzes e cegando a vítima',
      rolls: [
        {
          name: 'Teste de Resistência da Saliva',
          key: 'teste0',
          type: 'formula',
          parts: [['Reflexos CD 14 evita cegueira e apagar tochas', '', '']],
          versatil: ''
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

  const slarkBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Hssss... carne quente... carne que desceu ao escuro...* &mdash; Os sussurros desarticulados ecoam entre as frestas do teto."<br><span style="font-weight: bold; color: #800000;">&mdash; Slark das Profundezas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Criaturas pálidas com olhos leitosos que espreitam nas sombras do teto das cavernas. Nunca caminhe sob estalagmites sem olhar para cima."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Os <span style="color: #800000; font-weight: bold;">Slarks</span> são humanoides degenerados que habitam túneis profundos e sobrevivem dos restos deixados por predadores maiores como o Ankthyr. Ágeis escaladores de paredes e tetos úmidos, atacam em grupos usando saliva viscosa para apagar tochas antes de desabar sobre suas vítimas.</p>`;

  const slark = buildNpcActor({
    name: 'Slark',
    nd: '1',
    papel: 'lacaio',
    tipoMonstro: 'humanoide',
    tamanho: 'medio',
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
    resistencias: {
      danos: { acido: 5 },
      condicoes: [],
      idiomas: ['Subterrâneo'],
      txt: 'Redução de ácido 5'
    },
    pericias: slarkSkills,
    items: slarkItems,
    biography: slarkBio
  });

  await db.put(`!actors!${slark.actorDoc._id}`, slark.actorDoc);
  for (const ed of slark.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  console.log(`✓ Ator "Slark (ND 1)" salvo com ${slark.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 4. DESABAMENTO DOS TÚNEIS (ND 8) - Perigo Complexo (Hazard)
  // -------------------------------------------------------------
  const desabamento = buildHazardActor({
    name: 'Desabamento dos Túneis',
    nd: '8',
    img: 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
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

  await db.put(`!actors!${desabamento.actorDoc._id}`, desabamento.actorDoc);
  console.log(`✓ Perigo Complexo "Desabamento dos Túneis (ND 8)" salvo com sucesso.`);

  // -------------------------------------------------------------
  // 5. PARCEIROS ESPECIAIS (Divinas Organizações)
  // -------------------------------------------------------------
  const parceiros = [
    {
      name: 'Reabilitador',
      nd: '3',
      papel: 'special',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
      tipoMonstro: 'humanoide',
      atributos: { for: 1, des: 1, con: 2, int: 2, sab: 3, car: 2 },
      attributes: { pv: { value: 45, max: 45 }, pm: { value: 15, max: 15 }, defesa: { value: 17, base: 16 } },
      items: [
        buildSpecialPower({
          name: 'Julgamento de Khalmyr',
          img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
          execucao: 'padrao',
          custo: 0,
          description: 'Durante uma cena à escolha do grupo, um reabilitador equilibra as chances de todos os presentes: todos os testes de d20 passam a usar o resultado médio de 10 como base, impedindo sucessos e falhas automáticas.',
          flavorPhrase: 'Pela balança de Khalmyr, que a sorte ceda lugar à verdade!',
          flavorAction: 'Ergue o martelo da justiça fixando o resultado dos dados em 10'
        }),
        buildSpecialPower({
          name: 'Equilíbrio da Justiça',
          img: 'systems/tormenta20/icons/poderes/classes/abencoados/golpe-divino.webp',
          execucao: 'passiva',
          custo: 0,
          description: 'A aura do juiz de Khalmyr confere +2 em testes de resistência e Defesa a todos os aliados adjacentes.',
          flavorPhrase: 'A presença serena do magistrado fortalece os justos contra o caos.',
          flavorAction: 'Concede retidão espiritual aos companheiros',
          effects: [
            {
              name: 'Aura da Justiça (+2 Resistências)',
              changes: [{ key: 'system.attributes.defesa.outros', mode: 2, value: '2' }],
              transfer: true
            }
          ]
        })
      ],
      biography: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"A justiça não tem olhos de vingança, mas braços firmes para erguer a balança."<br><span style="font-weight: bold; color: #800000;">&mdash; Juiz Reabilitador da Casa dos Desgarrados</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um servo de Khalmyr que não busca punir por crueldade, mas redimir a alma através da provação correta."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba</span></blockquote><p>Contratado formalmente junto à Casa dos Desgarrados por T$ 1.000, o <strong>Reabilitador</strong> é um parceiro especial de Khalmyr treinado para equilibrar as chances de combates extremos e mediar disputas na aventura.</p>`
    },
    {
      name: 'Allihennali',
      nd: '3',
      papel: 'special',
      img: 'systems/tormenta20/icons/poderes/concedidos/alento-vida.webp',
      tipoMonstro: 'espirito',
      atributos: { for: -2, des: 3, con: 1, int: 0, sab: 3, car: 3 },
      attributes: { pv: { value: 30, max: 30 }, pm: { value: 25, max: 25 }, defesa: { value: 16, base: 13 } },
      items: [
        buildSpecialPower({
          name: 'Cura de Luz (Iniciante)',
          img: 'systems/tormenta20/icons/poderes/concedidos/alento-vida.webp',
          execucao: 'livre',
          custo: 1,
          alcance: 'curto',
          description: 'Uma vez por rodada, você pode gastar 1 PM para curar 2d6 PV de uma criatura em alcance curto.',
          flavorPhrase: 'Fagulhas brilhantes de pólen dourado fecham feridas abertas.',
          flavorAction: 'Espalha poeira luminosa restaurando vitalidade',
          rolls: [
            {
              name: 'Cura Feérica de Luz',
              key: 'cura0',
              type: 'formula',
              parts: [['2d6', '', '']],
              versatil: ''
            }
          ]
        }),
        buildSpecialPower({
          name: 'Bênção Feérica (Veterano)',
          img: 'systems/tormenta20/icons/poderes/classes/arcanos/magia-ilimitada.webp',
          execucao: 'passiva',
          custo: 0,
          description: 'Reduz o custo de magias que geram efeitos mágicos de cura em –2 PM.',
          flavorPhrase: 'A comunhão com a natureza viva facilita a canalização de energias regeneradoras.',
          flavorAction: 'Harmoniza a mana curativa com os fluxos de Allihanna',
          effects: [
            {
              name: 'Harmonia Curativa (-2 PM em Cura)',
              changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-2' }],
              transfer: true
            }
          ]
        }),
        buildSpecialPower({
          name: 'Cura Maior (Mestre)',
          img: 'systems/tormenta20/icons/poderes/concedidos/alento-vida.webp',
          execucao: 'livre',
          custo: 3,
          alcance: 'curto',
          description: 'Você também pode gastar 3 PM para curar 6d6 PV de uma criatura em alcance curto.',
          flavorPhrase: 'Uma cascata de pura luz viva envolve a criatura ferida!',
          flavorAction: 'Canaliza restauração profunda de alta potência',
          rolls: [
            {
              name: 'Cura Maior Feérica',
              key: 'cura0',
              type: 'formula',
              parts: [['6d6', '', '']],
              versatil: ''
            }
          ]
        })
      ],
      biography: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Tink-tink!* &mdash; O zumbido harmonioso das asinhas de inseto vibra como uma harpa delicada."<br><span style="font-weight: bold; color: #800000;">&mdash; Allihennali, Fada do Jardim Secreto</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Uma esfera de luz radiante de quatro asas, criada pelo amor botânico de Allihanna para zelar pelos bosques dos Feudos de Trebuck."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba</span></blockquote><p>Os <strong>Allihennali</strong> são espíritos feéricos benevolentes que auxiliam heróis e devotos de Allihanna com curas de luz e alívio da dor durante jornadas perigosas.</p>`
    },
    {
      name: 'Guaxininjas',
      nd: '3',
      papel: 'special',
      img: 'systems/tormenta20/icons/poderes/ameacas/furtividade.webp',
      tipoMonstro: 'humanoide',
      atributos: { for: 0, des: 4, con: 1, int: 1, sab: 2, car: 0 },
      attributes: { pv: { value: 35, max: 35 }, pm: { value: 15, max: 15 }, defesa: { value: 18, base: 14 } },
      items: [
        buildSpecialPower({
          name: 'Invocação Furtiva',
          img: 'systems/tormenta20/icons/poderes/ameacas/furtividade.webp',
          execucao: 'movimento',
          custo: 2,
          alcance: 'curto',
          description: 'Uma vez por aventura, você pode gastar uma ação de movimento e 2 PM para fazer um assovio e invocar 1d4+1 guaxininjas capangas em espaços desocupados em alcance curto — eles surgem de um beco próximo, por trás de uma pedra ou de maneiras igualmente furtivas.',
          flavorPhrase: '*Fshhhh!* Fumaça ninja se dissipa revelando pequenos focinhos mascarados!',
          flavorAction: 'Assuvia convocando reforços do clã Hoshikage',
          rolls: [
            {
              name: 'Guaxininjas Convocados',
              key: 'invoc0',
              type: 'formula',
              parts: [['1d4+1', '', '']],
              versatil: ''
            }
          ]
        }),
        buildSpecialPower({
          name: 'Táticas Sorrateiras de Bando',
          img: 'systems/tormenta20/icons/poderes/classes/ladinos/ataque-furtivo.webp',
          execucao: 'passiva',
          custo: 0,
          description: 'Enquanto acompanharem o personagem, os guaxininjas concedem +2 em Furtividade e +2 no teste de ataque quando estiver flanqueando.',
          flavorPhrase: 'Passos silenciosos criam distrações perfeitas para ataques coordenados.',
          flavorAction: 'Distrai o adversário facilitando flanqueamentos',
          effects: [
            {
              name: 'Furtividade Hoshikage (+2 Furtividade)',
              changes: [{ key: 'system.pericias.furt.outros', mode: 2, value: '2' }],
              transfer: true
            }
          ]
        })
      ],
      biography: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Ninjutsu da Folha Noturna!* &mdash; Pequenas patas ágeis desaparecem na penumbra antes que o inimigo perceba."<br><span style="font-weight: bold; color: #800000;">&mdash; Guaxininjas do Hoshikage</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Ninguém sabe quem treinou os guaxinins de Tamu-ra para usar shurikens e bombas de fumaça, mas nunca subestime um capanga peludo mascarado."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba</span></blockquote><p>Os <strong>Guaxininjas</strong> são agentes capangas treinados pela lendária organização secreta Hoshikage de Tamu-ra, capazes de emboscar oponentes e desaparecer sem deixar rastros.</p>`
    }
  ];

  for (const p of parceiros) {
    const pSkills = buildSkills(Number(p.nd) || 3, p.atributos);
    const parcActor = buildNpcActor({
      name: p.name,
      nd: p.nd,
      papel: p.papel,
      tipoMonstro: p.tipoMonstro,
      tamanho: 'medio',
      img: p.img,
      atributos: p.atributos,
      attributes: p.attributes,
      pericias: pSkills,
      items: p.items,
      biography: p.biography
    });
    await db.put(`!actors!${parcActor.actorDoc._id}`, parcActor.actorDoc);
    for (const ed of parcActor.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    console.log(`✓ Parceiro Especial "${p.name}" salvo com ${parcActor.actorDoc.items.length} poderes embutidos.`);
  }

  await db.close();
  console.log('\n✅ Todas as ameaças, perigos e parceiros da DB #228 injetados com 100% de conformidade canônica.');
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('Erro na injeção de ameaças:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

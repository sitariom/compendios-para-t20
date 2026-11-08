#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças da DB #230 em Ameacas_T20
 *
 * Conteúdo:
 * 1. O Reino dos Pesadelos (10 Criaturas de ND 2 a ND 18 de Rafael Dei Svaldi)
 *    - Zangão do Pesadelo (ND 5) - Construto Médio
 *    - Coletor do Pesadelo (ND 6) - Construto Médio
 *    - Ceifador do Pesadelo (ND 8) - Construto Médio
 *    - Pesadelo Polivalente (ND 10) - Construto Grande
 *    - Mestre do Pesadelo (ND 15) - Construto Enorme
 *    - Lanceiro Onírico (ND 2) - Construto Médio
 *    - Ginete Onírico (ND 3) - Construto Médio
 *    - Sargento Onírico (ND 4) - Construto Médio
 *    - Tenente Onírico (ND 6) - Construto Médio
 *    - Nócnam Mur, o Pesadelo Amalgamado (ND 18) - Construto Grande
 *
 * 2. Breves Jornadas: A Corrida Brutal (4 Criaturas Oficiais de Daniel Duran)
 *    - Sacerdote Caído (ND 5) - Humanoide (bugbear) Médio
 *    - Três Goblins em um Gorlogg (ND 7) - Animal Grande
 *    - Arzak (ND 8) - Humanoide (hobgoblin) Médio
 *    - Gaardak (ND 8) - Humanoide (bugbear) Médio
 *
 * Padrão Canônico Estrito:
 * - 34 Perícias calculadas dinamicamente
 * - Defesa Base Dinâmica (defesa.base = defesa.value - des)
 * - Traços com imunidades, tipos de dano e tamanhos
 * - Ataques embutidos com estrutura rolls.parts
 * - Biografias canônicas com citações duplas (#800000 e #006400) + Arial
 * - Tokens top-down exclusivos do 2-Minute Tabletop
 * - Persistência dupla em packs/Ameacas_T20 e src/packs/Ameacas_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildSkills,
  buildTracos,
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  saveToSourcePacks
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const FOLDER_DB = 'wfWApuyngzFm4KOP'; // Pasta canônica "Dragão Brasil" em Ameacas_T20

async function injectThreats() {
  console.log('=== Injetando 14 Ameaças da DB #230 em Ameacas_T20 (Padrão Canônico DB #227/#228/#229) ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const actorsToInject = [];

  // =========================================================================
  // 1. ZANGÃO DO PESADELO (ND 5) - Construto Médio
  // =========================================================================
  const zangaoId = 'gq8KZangPes230A';
  console.log(`Configurando Zangão do Pesadelo [${zangaoId}]...`);
  const zangaoSkills = buildSkills(5, { for: 4, des: 5, con: 2, int: -2, sab: 1, car: -3 }, {
    inic: 9,
    perc: 7,
    fort: 11,
    refl: 15,
    vont: 7,
    atle: 8,
    furt: 9,
    sobr: 5,
    luta: 17
  });

  const zangaoItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d8+11',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +17 (2d8+11 perfuração).</p>',
      flavorPhrase: '*CHOMP!* Mandíbulas necromecânicas translúcidas cravam-se na carne com força assustadora!',
      flavorAction: 'O zangão ataca com sua mordida voraz de ossos metálicos'
    }),
    buildWeaponAttack({
      name: 'Cauda-Espinho',
      img: 'systems/tormenta20/icons/poderes/ameacas/espinho.webp',
      dano: '2d6+8',
      tipoDano: 'perfuração',
      periciaAtaque: 'pontaria',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural à Distância:</strong> Dano 2d6+8 perfuração, alcance curto. A cauda é um ataque à distância que pode ser usado como parte da mesma ação agredir que a mordida.</p>',
      flavorPhrase: '*THWIP!* Uma rajada de espinhos pontiagudos é disparada da ponta da cauda flexível!',
      flavorAction: 'Dispara espinhos ósseos à distância contra o inimigo'
    }),
    buildWeaponAttack({
      name: 'Cauda-Ferrão',
      img: 'systems/tormenta20/icons/poderes/ameacas/peconha.webp',
      dano: '1d6+4',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Dano 1d6+4 perfuração, mais peçonha concentrada (perde 1d12 pontos de vida por rodada durante 3 rodadas, Fort CD 20 reduz para 1 rodada).</p>',
      flavorPhrase: '*SHHK!* O ferrão inocula uma peçonha onírica corrosiva e letal!',
      flavorAction: 'Golpeia com seu ferrão envenenado inoculando peçonha concentrada'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d8+11',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Dano 2d8+11 corte, margem de ameaça 18/x3.</p>',
      flavorPhrase: '*SWISH!* A lâmina de osso metálico corta o ar e a armadura com precisão cirúrgica!',
      flavorAction: 'Desfere um golpe cortante devastador com sua cauda-lâmina'
    }),
    buildWeaponAttack({
      name: 'Cauda-Tentáculo',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp',
      dano: '1d8+8',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Dano 1d8+8 impacto, mais agarrar aprimorado (teste +19).</p>',
      flavorPhrase: '*SNAP!* O tentáculo envolve a presa em um abraço viscoso e implacável!',
      flavorAction: 'Enlaça a vítima com sua cauda-tentáculo'
    }),
    buildSpecialPower({
      name: 'Cauda Especializada',
      img: 'systems/tormenta20/icons/poderes/ameacas/cauda.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Cada zangão do pesadelo possui um tipo de cauda, conforme sua função: Cauda-espinho, Cauda-ferrão, Cauda-lâmina ou Cauda-tentáculo.</p>',
      flavorPhrase: 'A anatomia do zangão reflete a mente mórbida de seu criador nas forjas oníricas.',
      flavorAction: 'Manifesta sua especialização de cauda em combate'
    }),
    buildSpecialPower({
      name: 'Mente Alienígena',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 20,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 20 reduz à metade e evita as condições.',
      description: '<p>Quando uma criatura usa um efeito mental ou de encantamento contra o zangão, ela é atingida por um terrível choque de retorno. A criatura sofre 6d6 pontos de dano psíquico e fica atordoada por 1 rodada e abalada (Von CD 20 reduz à metade e evita as condições).</p>',
      flavorPhrase: 'A mente do agressor é invadida pelo vazio aterrorizante e gélido do Reino dos Pesadelos!',
      flavorAction: 'Rechaça invasões mentais desferindo choque psíquico violento',
      rolls: [
        {
          name: 'Choque de Retorno (6d6 Psíquico)',
          key: 'dano0',
          type: 'damage',
          parts: [['6d6', 'psíquico', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Atordoado e Abalado',
          description: 'Atordoado por 1 rodada e abalado.',
          statuses: ['atordoado', 'abalado'],
          duration: { rounds: 1 },
          transfer: false
        }
      ]
    })
  ];

  const zangaoTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: '5/ mágico' },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const zangaoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eles não respiram, não sangram e não dormem. Caçam com a persistência de um pesadelo que se recusa a terminar com o amanhecer.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Relato de Patrulheiro das Fronteiras de Aslothia</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"O corpo canino translúcido revela engrenagens de osso e névoa esmeralda. O ferrão é apenas o prelúdio para o choque na mente de quem ousa confrontá-lo."<br><span style="font-weight: bold; color: #006400;">&mdash; Mestre Alquimista Judara</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Zangão do Pesadelo</span> é a tropa de linha básica forjada nas profundezas do Reino dos Pesadelos. Construído a partir de energia onírica condensada sobre carcaças biomecânicas de caninos predatórios, ele possui sentidos cegos aguçados e uma cauda especializada mortífera.</p>`;

  actorsToInject.push({
    id: zangaoId,
    name: 'Zangão do Pesadelo',
    nd: '5',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '15m (10q)',
    sentidos: 'faro, percepção às cegas (médio), visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 4, des: 5, con: 2, int: -2, sab: 1, car: -3 },
    attributes: {
      cd: 20,
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 24, base: 19 } // 24 - 5 = 19
    },
    resistencias: zangaoTracos,
    pericias: zangaoSkills,
    items: zangaoItems,
    ataquescac: 'Mordida +17 (2d8+11) e cauda +17.',
    biography: zangaoBio
  });

  // =========================================================================
  // 2. COLETOR DO PESADELO (ND 6) - Construto Médio
  // =========================================================================
  const coletorId = 'gq8KColePes230B';
  console.log(`Configurando Coletor do Pesadelo [${coletorId}]...`);
  const coletorSkills = buildSkills(6, { for: 2, des: 4, con: 2, int: -2, sab: 2, car: -2 }, {
    inic: 9,
    perc: 9,
    fort: 6,
    refl: 18,
    vont: 12,
    atle: 7,
    furt: 9,
    sobr: 7,
    luta: 18
  });

  const coletorItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d8+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +18 (4d8+10 perfuração).</p>',
      flavorPhrase: '*CRUNCH!* Dentes de necro-marfim rasgam carne e tendões!',
      flavorAction: 'Desfere uma mordida violenta com mandíbulas alongadas'
    }),
    buildWeaponAttack({
      name: 'Cauda-Tentáculo',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp',
      dano: '1d8+10',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-tentáculo +18 (1d8+10 mais 4d6 psíquico), mais agarrar aprimorado (teste +20).</p>',
      flavorPhrase: '*THWIP!* O tentáculo envolve a presa enquanto descarrega energia mental abrasadora!',
      flavorAction: 'Agarra e drena a mente do alvo com sua cauda-tentáculo'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'free',
      custo: 0,
      description: '<p>Se o coletor do pesadelo acertar um ataque de cauda-tentáculo, pode fazer um teste de manobra agarrar como ação livre (teste +20).</p>',
      flavorPhrase: 'Tentáculos serpentinos se apertam como torniquetes ao redor da vítima!',
      flavorAction: 'Inicia manobra de agarrar imediata com sua cauda-tentáculo'
    }),
    buildSpecialPower({
      name: 'Drenar Sonhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      execucao: 'standard',
      custo: 0,
      cd: 24,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 24 reduz a perda à metade e evita a condição ou perda do sonho.',
      description: '<p>O coletor drena os sonhos de uma criatura agarrada. A vítima perde 2d6 PM (ou 4d6 se estiver inconsciente) e fica alquebrada. Se já estiver alquebrada, em vez disso ela perde um de seus sonhos (Von CD 24 reduz a perda à metade e evita a condição ou perda do sonho).</p>',
      flavorPhrase: 'Filamentos luminescentes de memórias e esperanças são sugados para dentro do núcleo translúcido do coletor!',
      flavorAction: 'Extrai a energia onírica mais íntima da vítima agarrada',
      rolls: [
        {
          name: 'Dreno de PM (2d6)',
          key: 'dano0',
          type: 'damage',
          parts: [['2d6', 'psíquico', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Alquebrado',
          description: 'A criatura fica alquebrada por dreno de sonhos.',
          statuses: ['alquebrado'],
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Mente Alienígena',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 24,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 24 reduz à metade e evita as condições.',
      description: '<p>Quando uma criatura usa um efeito mental ou de encantamento contra o coletor, ela é atingida por um terrível choque de retorno. A criatura sofre 6d6 pontos de dano psíquico e fica atordoada por 1 rodada e abalada (Von CD 24 reduz à metade e evita as condições).</p>',
      flavorPhrase: 'A mente invasora entra em curto-circuito diante dos horrores inconcebíveis do Reino dos Pesadelos!',
      flavorAction: 'Devolve o influxo mental na forma de agonia psíquica devastadora'
    })
  ];

  const coletorTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: '5/ mágico' },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const coletorBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eles não buscam seu ouro nem seu sangue. Querem o que te mantém de pé quando você acorda: suas esperanças.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Diário de um Caçador de Aslothia</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Uma vez esvaziada a mente da vítima, resta apenas uma carcaça vazia assombrada por terrores sem fim."<br><span style="font-weight: bold; color: #006400;">&mdash; Sislach Rawia, em anotações de laboratório</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Coletor do Pesadelo</span> é a encarnação do furto metafísico. Equipado com tentáculos especializados em extrair filamentos de sonhos e ambições mortais, este construto é empregado por Ferren Asloth e Judara para apagar a centelha de esperança de povoados inteiros.</p>`;

  actorsToInject.push({
    id: coletorId,
    name: 'Coletor do Pesadelo',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '15m (10q)',
    sentidos: 'faro, percepção às cegas (médio), visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 2, des: 4, con: 2, int: -2, sab: 2, car: -2 },
    attributes: {
      cd: 24,
      pv: { value: 160, max: 160 },
      pm: { value: 0, max: 0 },
      defesa: { value: 25, base: 21 } // 25 - 4 = 21
    },
    resistencias: coletorTracos,
    pericias: coletorSkills,
    items: coletorItems,
    ataquescac: 'Mordida +18 (4d8+10) e cauda-tentáculo +18 (1d8+10 mais 4d6 psíquico).',
    biography: coletorBio
  });

  // =========================================================================
  // 3. CEIFADOR DO PESADELO (ND 8) - Construto Médio
  // =========================================================================
  const ceifadorId = 'gq8KCeifPes230C';
  console.log(`Configurando Ceifador do Pesadelo [${ceifadorId}]...`);
  const ceifadorSkills = buildSkills(8, { for: 5, des: 6, con: 3, int: -1, sab: 1, car: -3 }, {
    inic: 14,
    perc: 11,
    fort: 15,
    refl: 21,
    vont: 8,
    atle: 15,
    furt: 16,
    sobr: 11,
    luta: 26
  });

  const ceifadorItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '3d8+20',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +26 (3d8+20 perfuração).</p>',
      flavorPhrase: '*CHOMP!* Dentes com fio de navalha esmagam e perfuram armaduras de aço!',
      flavorAction: 'Morde violentamente o oponente'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '4d6+20',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-lâmina +26 (4d6+20 corte, 18/x3).</p>',
      flavorPhrase: '*SHRRRRK!* A foice óssea da cauda corta membros e armaduras como pergaminho!',
      flavorAction: 'Desfere um arco letal de corte com sua cauda-lâmina hiperafiada'
    }),
    buildSpecialPower({
      name: 'Mente Alienígena',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 26,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 26 reduz à metade e evita as condições.',
      description: '<p>Quando uma criatura usa um efeito mental ou de encantamento contra o ceifador, ela é atingida por um terrível choque de retorno. A criatura sofre 8d6 pontos de dano psíquico e fica atordoada por 1 rodada e abalada (Von CD 26 reduz à metade e evita as condições).</p>',
      flavorPhrase: 'O retorno psíquico ecoa nas têmporas do conjurador como um sino fúnebre ensurdecedor!',
      flavorAction: 'Castiga conjuradores mentais com choque psíquico violento',
      rolls: [
        {
          name: 'Choque de Retorno (8d6 Psíquico)',
          key: 'dano0',
          type: 'damage',
          parts: [['8d6', 'psíquico', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    })
  ];

  const ceifadorTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: '10/ mágico' },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const ceifadorBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A foice de sua cauda não colhe trigo. Colhe soldados de infantaria inteiros em um piscar de olhos.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Comandante de Pelotão de Bielefeld</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"O ápice da artilharia biológica: veloz como um leopardo e cortante como guilhotina reforçada."<br><span style="font-weight: bold; color: #006400;">&mdash; Escriba Narsogg</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ceifador do Pesadelo</span> foi concebido para o extermínio cirúrgico de tropas de choque. Ágil e implacável, ele se move a 15 metros por rodada desferindo golpes de cauda-lâmina com multiplicador triplo e margem de ameaça 18.</p>`;

  actorsToInject.push({
    id: ceifadorId,
    name: 'Ceifador do Pesadelo',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '15m (10q)',
    sentidos: 'faro, percepção às cegas (médio), visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 5, des: 6, con: 3, int: -1, sab: 1, car: -3 },
    attributes: {
      cd: 26,
      pv: { value: 280, max: 280 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 27 } // 33 - 6 = 27
    },
    resistencias: ceifadorTracos,
    pericias: ceifadorSkills,
    items: ceifadorItems,
    ataquescac: 'Mordida +26 (3d8+20) e cauda-lâmina +26 (4d6+20 corte, 18/x3).',
    biography: ceifadorBio
  });

  // =========================================================================
  // 4. PESADELO POLIVALENTE (ND 10) - Construto Grande
  // =========================================================================
  const polivalenteId = 'gq8KPoliPes230D';
  console.log(`Configurando Pesadelo Polivalente [${polivalenteId}]...`);
  const polivalenteSkills = buildSkills(10, { for: 7, des: 6, con: 5, int: -2, sab: 1, car: -3 }, {
    inic: 15,
    perc: 12,
    fort: 16,
    refl: 22,
    vont: 10,
    atle: 18,
    furt: 17,
    sobr: 12,
    luta: 29
  });

  const polivalenteItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '3d8+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +29 (3d8+10 perfuração).</p>',
      flavorPhrase: '*CRUNCH!* Mandíbulas descomunais trituram ossos e escudos com violência bárbara!',
      flavorAction: 'Desfere uma mordida colossal com presas de ferro e osso'
    }),
    buildSpecialPower({
      name: 'Múltiplas Caudas',
      img: 'systems/tormenta20/icons/poderes/ameacas/cauda.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O pesadelo polivalente possui quatro caudas e, quando faz um ataque corpo a corpo, ataca uma vez com cada uma delas (+29):</p><ul><li><strong>Cauda-espinho:</strong> Dano 2d6+5 perfuração, alcance curto (ataque à distância).</li><li><strong>Cauda-ferrão:</strong> Dano 1d6+5 perfuração, mais peçonha concentrada (perde 2d12 PV por rodada durante 3 rodadas, Fort CD 28 reduz para 1 rodada).</li><li><strong>Cauda-lâmina:</strong> Dano 3d8+10 corte, 18/x3.</li><li><strong>Cauda-tentáculo:</strong> Dano 1d6+5 esmagamento, mais agarrar aprimorado (teste +33).</li></ul>',
      flavorPhrase: 'Quatro apêndices letais chicoteiam em sincronia perfeita, cobrindo todos os ângulos!',
      flavorAction: 'Executa uma dança mortífera com seus quatro apêndices caudais'
    }),
    buildWeaponAttack({
      name: 'Cauda-Espinho',
      img: 'systems/tormenta20/icons/poderes/ameacas/espinho.webp',
      dano: '2d6+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'pontaria',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque de Cauda:</strong> +29 (2d6+5 perfuração, alcance curto).</p>'
    }),
    buildWeaponAttack({
      name: 'Cauda-Ferrão',
      img: 'systems/tormenta20/icons/poderes/ameacas/peconha.webp',
      dano: '1d6+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque de Cauda:</strong> +29 (1d6+5 perfuração mais peçonha concentrada 2d12 PV/rodada por 3 rodadas, Fort CD 28 reduz para 1 rodada).</p>'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '3d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque de Cauda:</strong> +29 (3d8+10 corte, 18/x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Cauda-Tentáculo',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp',
      dano: '1d6+5',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque de Cauda:</strong> +29 (1d6+5 impacto mais agarrar aprimorado, teste +33).</p>'
    }),
    buildSpecialPower({
      name: 'Pesadelo Combinado',
      img: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O pesadelo recebe duas habilidades de Natureza do Pesadelo (CD 28): Pesadelo de Desastre, Pesadelo de Fracasso, Pesadelo de Perseguição ou Pesadelo de Morte.</p>',
      flavorPhrase: 'Combina as assinaturas necromecânicas dos próprios Mestres do Pesadelo.',
      flavorAction: 'Manifesta duas naturezas aterrorizantes em seus ataques'
    }),
    buildSpecialPower({
      name: 'Mente Alienígena',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 28,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 28 reduz à metade e evita as condições.',
      description: '<p>Quando uma criatura usa um efeito mental ou de encantamento contra o pesadelo polivalente, ela é atingida por um terrível choque de retorno. A criatura sofre 10d6 pontos de dano psíquico e fica atordoada por 1 rodada e abalada (Von CD 28 reduz à metade e evita as condições).</p>',
      flavorPhrase: 'A mente do conjurador é sugada por um abismo de pesadelos combinados!',
      flavorAction: 'Desfere retaliação psíquica avassaladora de 10d6 de dano'
    })
  ];

  const polivalenteTracos = buildTracos({
    tamanho: 'grd',
    resistencias: { dano: '10/ mágico' },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const polivalenteBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Ele tem a ferocidade de uma matilha inteira em um só corpo colossal. Quatro caudas chicoteando, cada uma com uma sentença de morte diferente.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Relato de Cerco às Muralhas de Aslothia</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"A síntese perfeita das quatro linhagens de pesadelo: veneno, lâmina, tentáculo e espinhos em uma única besta de guerra."<br><span style="font-weight: bold; color: #006400;">&mdash; Tratado Onírico de Ferren Asloth</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Pesadelo Polivalente</span> é um construto de porte Grande, projetado como uma fortaleza móvel de combate corporal. Possui cura acelerada 10 e ataca cinco vezes por turno (mordida e suas quatro caudas distintas).</p>`;

  actorsToInject.push({
    id: polivalenteId,
    name: 'Pesadelo Polivalente',
    nd: '10',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'grd',
    deslocamento: '15m (10q)',
    sentidos: 'faro, percepção às cegas (médio), visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 7, des: 6, con: 5, int: -2, sab: 1, car: -3 },
    attributes: {
      cd: 28,
      pv: { value: 370, max: 370 },
      pm: { value: 0, max: 0 },
      defesa: { value: 36, base: 30 } // 36 - 6 = 30
    },
    resistencias: polivalenteTracos,
    pericias: polivalenteSkills,
    items: polivalenteItems,
    ataquescac: 'Mordida +29 (3d8+10) e quatro caudas +29.',
    biography: polivalenteBio
  });

  // =========================================================================
  // 5. MESTRE DO PESADELO (ND 15) - Construto Enorme
  // =========================================================================
  const mestreId = 'gq8KMestPes230E';
  console.log(`Configurando Mestre do Pesadelo [${mestreId}]...`);
  const mestreSkills = buildSkills(15, { for: 11, des: 3, con: 6, int: 4, sab: 3, car: 5 }, {
    inic: 16,
    perc: 18,
    fort: 22,
    refl: 28,
    vont: 15,
    atle: 26,
    guer: 19,
    inti: 23,
    intu: 18,
    luta: 43
  });

  const mestreItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d8+20',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +43 (4d8+20 perfuração).</p>',
      flavorPhrase: '*CRUSH!* Presas gigantescas partem metal temperado e carne com facilidade titânica!',
      flavorAction: 'Morde devastadoramente com queixadas titânicas'
    }),
    buildWeaponAttack({
      name: 'Duas Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Duas garras +43 (2d8+10 corte).</p>'
    }),
    buildSpecialPower({
      name: 'Múltiplas Caudas Enormes',
      img: 'systems/tormenta20/icons/poderes/ameacas/cauda.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O Mestre possui quatro caudas mortíferas (+43):</p><ul><li><strong>Cauda-espinho:</strong> Dano 3d8+10 perfuração, alcance médio.</li><li><strong>Cauda-ferrão:</strong> Dano 2d8+10 perfuração, mais peçonha virulenta (perde 3d12 PV por rodada durante 3 rodadas, Fort CD 38 reduz para 1 rodada).</li><li><strong>Cauda-lâmina:</strong> Dano 4d8+20 corte, 18/x3.</li><li><strong>Cauda-tentáculo:</strong> Dano 2d8+10 esmagamento, mais agarrar aprimorado (teste +50).</li></ul>'
    }),
    buildSpecialPower({
      name: 'Natureza Onírica',
      img: 'systems/tormenta20/icons/poderes/ameacas/fantasma.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O Mestre tem 50% de chance de ignorar dano, condições e penalidades causadas por efeitos mundanos ou mágicos, como se estivesse sob a forma etérea.</p>',
      flavorPhrase: 'Sua forma oscila entre a realidade palpável e a névoa intangível do Reino dos Pesadelos!',
      flavorAction: 'Desvanece parcialmente da realidade física ignorando golpes e magias'
    }),
    buildSpecialPower({
      name: 'Manifestar Pesadelo',
      img: 'systems/tormenta20/icons/poderes/ameacas/sonho.webp',
      execucao: 'standard',
      custo: 0,
      cd: 38,
      description: '<p>O Mestre do Pesadelo pode lançar a magia <em>Sonho</em>, bem como qualquer magia de ilusão, como um feiticeiro de 15º nível sem gastar PM (CD 38).</p>',
      flavorPhrase: 'Mundos oníricos e miragens pavorosas ganham forma sólida diante dos olhos mortais!',
      flavorAction: 'Manifesta magias de ilusão e pesadelos com poder arcano supremo'
    }),
    buildSpecialPower({
      name: 'Mente Alienígena Suprema',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 38,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 38 reduz à metade e evita as condições.',
      description: '<p>Quando uma criatura usa um efeito mental ou de encantamento contra o mestre, ela sofre 15d6 pontos de dano psíquico e fica atordoada por 1 rodada e abalada (Von CD 38 reduz à metade e evita as condições).</p>',
      flavorPhrase: 'A mente mortal é estilhaçada em mil pedaços diante do senhor dos pesadelos!',
      flavorAction: 'Descarrega uma tempestade psíquica punitiva de 15d6'
    })
  ];

  const mestreTracos = buildTracos({
    tamanho: 'enor',
    resistencias: { dano: '20/ mágico' },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const mestreBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eles são os arquitetos originais do Reino dos Pesadelos. Diante de sua imponência, até os lordes de Aslothia sentem o frio gélido do pavor na medula.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Crônica dos Sislach, Tomo III</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Sua carne é ilusão viva, mas suas garras e caudas esmagam como aço de cerco. Extrair sua centelha onírica é o prêmio máximo para qualquer arcanista de Arton."<br><span style="font-weight: bold; color: #006400;">&mdash; Mestre Alquimista Judara</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Mestre do Pesadelo</span> é uma entidade de porte Enorme e ND 15. Com 780 PV, cura acelerada 20 e 50% de chance de ignorar qualquer agressão devido à sua Natureza Onírica, ele lidera legiões de soldados e pode manifestar ilusões devastadoras à vontade.</p>`;

  actorsToInject.push({
    id: mestreId,
    name: 'Mestre do Pesadelo',
    nd: '15',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'enor',
    deslocamento: '15m (10q)',
    sentidos: 'faro, percepção às cegas (longo), visão no escuro',
    tesouro: 'Centelha Onírica (CD 30 para extrair)',
    atributos: { for: 11, des: 3, con: 6, int: 4, sab: 3, car: 5 },
    attributes: {
      cd: 38,
      pv: { value: 780, max: 780 },
      pm: { value: 0, max: 0 },
      defesa: { value: 48, base: 45 } // 48 - 3 = 45
    },
    resistencias: mestreTracos,
    pericias: mestreSkills,
    items: mestreItems,
    ataquescac: 'Mordida +43 (4d8+20), duas garras +43 (2d8+10) e quatro caudas +43.',
    biography: mestreBio
  });

  // =========================================================================
  // 6. LANCEIRO ONÍRICO (ND 2) - Construto Médio
  // =========================================================================
  const lanceiroId = 'gq8KLancOni230F';
  console.log(`Configurando Lanceiro Onírico [${lanceiroId}]...`);
  const lanceiroSkills = buildSkills(2, { for: 3, des: 1, con: 3, int: -2, sab: 0, car: -3 }, {
    inic: 4,
    perc: 3,
    fort: 12,
    refl: 3,
    vont: 7,
    atle: 6,
    luta: 14
  });

  const lanceiroItems = [
    buildWeaponAttack({
      name: 'Lança',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '2d6+4',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Lança +14 (2d6+4 perfuração).</p>',
      flavorPhrase: '*THRUST!* A haste de cinzas encantadas perfura com vigor militar!',
      flavorAction: 'Desfere uma estocada precisa com sua lança militar'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+4',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-lâmina +14 (2d6+4 corte, 18/x3).</p>',
      flavorPhrase: '*SWISH!* A foice de sua cauda ataca em arco cortante!',
      flavorAction: 'Chicoteia com sua cauda-lâmina em golpe secundário'
    }),
    buildSpecialPower({
      name: 'Assalto Assustador',
      img: 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Em seu primeiro turno de combate, o lanceiro onírico recebe +2 em testes de ataque e rolagens de dano contra criaturas que não sejam imunes a medo. Medo.</p>',
      flavorPhrase: 'O choque inicial de sua marcha sombria abala os ânimos dos mais bravos!',
      flavorAction: 'Avança com ferocidade aterrorizante em seu primeiro turno de combate'
    })
  ];

  const lanceiroTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'trevas'],
    idiomasValue: []
  });

  const lanceiroBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eles marcham em formação cerrada, calados como sepulcros e inabaláveis como rocha.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Guarda Real de Aslothia</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Carne esverdeada translúcida sobre ossos de ferro, empunhando as lanças dos soldados mortos na guerra."<br><span style="font-weight: bold; color: #006400;">&mdash; Sislach Rawia</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Lanceiro Onírico</span> é o mercenário de infantaria criado por Ferren Asloth em Dalanthir, unindo necromancia com energia extraída de soldados do pesadelo cativos. Equipado com brunea e escudo pesado, ele avança em formação disciplinada.</p>`;

  actorsToInject.push({
    id: lanceiroId,
    name: 'Lanceiro Onírico',
    nd: '2',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 3, des: 1, con: 3, int: -2, sab: 0, car: -3 },
    attributes: {
      cd: 15,
      pv: { value: 16, max: 16 },
      pm: { value: 0, max: 0 },
      defesa: { value: 19, base: 18 } // 19 - 1 = 18
    },
    resistencias: lanceiroTracos,
    pericias: lanceiroSkills,
    items: lanceiroItems,
    ataquescac: 'Lança +14 (2d6+4) e cauda-lâmina +14 (2d6+4 corte, 18/x3).',
    biography: lanceiroBio
  });

  // =========================================================================
  // 7. GINETE ONÍRICO (ND 3) - Construto Médio
  // =========================================================================
  const gineteId = 'gq8KGineOni230G';
  console.log(`Configurando Ginete Onírico [${gineteId}]...`);
  const gineteSkills = buildSkills(3, { for: 3, des: 1, con: 3, int: -2, sab: 0, car: -3 }, {
    inic: 4,
    perc: 3,
    fort: 14,
    refl: 4,
    vont: 9,
    atle: 6,
    cava: 6,
    luta: 16
  });

  const gineteItems = [
    buildWeaponAttack({
      name: 'Lança de Cavalaria',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '2d8+4',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo Montado:</strong> Lança +16 (2d8+4, x3, alcance 3m).</p>',
      flavorPhrase: '*THUMP!* O impacto da lança empalada em carga plena arranca o ar da vítima!',
      flavorAction: 'Avança com a lança de cavalaria em investida montada'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+4',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-lâmina +16 (2d6+4 corte, 18/x3).</p>'
    }),
    buildSpecialPower({
      name: 'Ginete do Pesadelo',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O ginete onírico passa automaticamente em testes de Cavalgar para não cair da montaria quando sofre dano, e não sofre penalidades para atacar à distância enquanto montado.</p>',
      flavorPhrase: 'Ele e sua montaria de pesadelo agem como um único organismo predatório.',
      flavorAction: 'Mantém estabilidade equestre impecável mesmo sob saraivada de golpes'
    }),
    buildSpecialPower({
      name: 'Carga Aterradora',
      img: 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Enquanto estiver montado, o deslocamento do ginete se torna 12m, ele recebe uma ação de movimento extra por turno (apenas para se deslocar) e seus ataques corpo a corpo causam +1d6 pontos de dano.</p>',
      flavorPhrase: 'O trote trovejante atropela formações e espalha o caos na vanguarda inimiga!',
      flavorAction: 'Desencadeia uma carga brutal com bônus de velocidade e dano'
    })
  ];

  const gineteTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'trevas'],
    idiomasValue: []
  });

  const gineteBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Os cascos das bestas esqueléticas não deixam marcas na terra, mas o rastro de terror que deixam dura por gerações.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Cavaleiro da Ordem da Luz</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"A cavalaria onírica flanqueia com precisão sobrenatural. Nunca caem de suas selas e atacam com fúria multiplicada."<br><span style="font-weight: bold; color: #006400;">&mdash; Sislach Rawia</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ginete Onírico</span> cavalga corcéis necromecânicos através das estepes e pântanos de Aslothia. Com sua lança de cavalaria de alcance 3 metros e sua cauda-lâmina cortante, ele é o terror das patrulhas fronteiriças.</p>`;

  actorsToInject.push({
    id: gineteId,
    name: 'Ginete Onírico',
    nd: '3',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 3, des: 1, con: 3, int: -2, sab: 0, car: -3 },
    attributes: {
      cd: 16,
      pv: { value: 24, max: 24 },
      pm: { value: 0, max: 0 },
      defesa: { value: 21, base: 20 } // 21 - 1 = 20
    },
    resistencias: gineteTracos,
    pericias: gineteSkills,
    items: gineteItems,
    ataquescac: 'Lança +16 (2d8+4, x3, alcance 3m) e cauda-lâmina +16 (2d6+4 corte, 18/x3).',
    biography: gineteBio
  });

  // =========================================================================
  // 8. SARGENTO ONÍRICO (ND 4) - Construto Médio
  // =========================================================================
  const sargentoId = 'gq8KSargOni230H';
  console.log(`Configurando Sargento Onírico [${sargentoId}]...`);
  const sargentoSkills = buildSkills(4, { for: 4, des: 1, con: 4, int: -2, sab: 0, car: -1 }, {
    inic: 5,
    perc: 4,
    fort: 16,
    refl: 4,
    vont: 10,
    atle: 8,
    guer: 4,
    inti: 5,
    luta: 16
  });

  const sargentoItems = [
    buildWeaponAttack({
      name: 'Espada Bastarda',
      img: 'systems/tormenta20/icons/armas/espada-bastarda.webp',
      dano: '2d6+5',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada bastarda maciça +16 (2d6+5, 19/x3).</p>',
      flavorPhrase: '*KLANG!* A lâmina pesada desce com força esmagadora capaz de fender elmos!',
      flavorAction: 'Desfere um golpe vertical pesado com sua espada bastarda'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+5',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-lâmina +16 (2d6+5 corte, 18/x3).</p>'
    }),
    buildSpecialPower({
      name: 'Fome de Sonhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando ataca uma criatura, o sargento onírico recebe um bônus no teste de ataque e na rolagem de dano igual ao total de PM que aquela criatura gastou desde o turno anterior do sargento.</p>',
      flavorPhrase: 'Quanto mais magia o adversário queima, mais faminto e implacável o sargento se torna!',
      flavorAction: 'Empodera seus ataques alimentando-se dos pontos de mana gastos pelo alvo'
    }),
    buildSpecialPower({
      name: 'Golpe Amedrontador',
      img: 'systems/tormenta20/icons/poderes/ameacas/medo.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Uma criatura que não seja imune a medo e que sofra dano do sargento onírico fica vulnerável. Medo.</p>',
      flavorPhrase: 'O ferimento reverbera na alma da vítima deixando-a indefesa diante de novos ataques!',
      flavorAction: 'Impõe a condição vulnerável ao atingir seu inimigo'
    }),
    buildSpecialPower({
      name: 'Negação da Morte',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>Se outro mercenário onírico em alcance médio for reduzido a 0 PV ou menos, em vez disso aquela criatura é reduzida a 1 PV. O sargento pode usar esta habilidade uma vez por cena por mercenário.</p>',
      flavorPhrase: '“Levante-se e lute pelo Arquilich!” Uma injeção de energia necromântica impede o colapso do aliado!',
      flavorAction: 'Impede a destruição de um aliado mercenário mantendo-o com 1 PV'
    })
  ];

  const sargentoTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'trevas'],
    idiomasValue: []
  });

  const sargentoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eles alimentam suas espadas com a mana gasta pelos arcanistas. Quanto mais você conjura, mais forte ele bate.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Sobrevivente do Cerco de Dalanthir</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Comandantes de esquadra disciplinados. Recusam-se a deixar seus soldados tombarem, sustentando a linha com força de vontade necromântica."<br><span style="font-weight: bold; color: #006400;">&mdash; Nócnam Mur</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Sargento Onírico</span> coordena pelotões de lanceiros e ginetes. Trajando cota de malha pesada e brandindo uma espada bastarda maciça, ele pune conjuradores convertendo o gasto de mana do oponente em bônus diretos de acerto e dano.</p>`;

  actorsToInject.push({
    id: sargentoId,
    name: 'Sargento Onírico',
    nd: '4',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 4, des: 1, con: 4, int: -2, sab: 0, car: -1 },
    attributes: {
      cd: 18,
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 22 } // 23 - 1 = 22
    },
    resistencias: sargentoTracos,
    pericias: sargentoSkills,
    items: sargentoItems,
    ataquescac: 'Espada bastarda +16 (2d6+5, 19/x3) e cauda-lâmina +16 (2d6+5 corte, 18/x3).',
    biography: sargentoBio
  });

  // =========================================================================
  // 9. TENENTE ONÍRICO (ND 6) - Construto Médio
  // =========================================================================
  const tenenteId = 'gq8KTeneOni230I';
  console.log(`Configurando Tenente Onírico [${tenenteId}]...`);
  const tenenteSkills = buildSkills(6, { for: 4, des: 1, con: 4, int: -1, sab: 0, car: -1 }, {
    inic: 6,
    perc: 5,
    fort: 18,
    refl: 6,
    vont: 12,
    atle: 9,
    guer: 6,
    inti: 8,
    luta: 20
  });

  const tenenteItems = [
    buildWeaponAttack({
      name: 'Espada Bastarda',
      img: 'systems/tormenta20/icons/armas/espada-bastarda.webp',
      dano: '2d10+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada bastarda maciça +20 (2d10+10, 19/x3, mais 2d6 trevas).</p>',
      flavorPhrase: '*SLASH!* Energia negra profana envolve a lâmina maciça!',
      flavorAction: 'Golpeia com sua espada bastarda impregnada de energia de trevas'
    }),
    buildWeaponAttack({
      name: 'Cauda-Lâmina',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d10+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Cauda-lâmina +20 (2d10+10 corte, 18/x3, mais 2d6 trevas).</p>'
    }),
    buildSpecialPower({
      name: 'Estratégia do Medo',
      img: 'systems/tormenta20/icons/poderes/ameacas/estrategia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando o tenente onírico ou outro mercenário onírico em alcance médio faz um ataque contra uma criatura que não seja imune a medo, este atacante rola dois dados e usa o melhor resultado. Medo.</p>',
      flavorPhrase: 'O pavor paralisante dos inimigos abre brechas mortais em suas defesas!',
      flavorAction: 'Coordena sua unidade concedendo vantagem de dois dados em ataques'
    }),
    buildSpecialPower({
      name: 'Fome de Sonhos e Partilhar Fome',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O tenente emana uma aura com 30m de raio. Ele e outros mercenários oníricos dentro desta área recebem um bônus no teste de ataque e na rolagem de dano igual ao total de PM que o alvo gastou desde o turno anterior do tenente.</p>',
      flavorPhrase: 'A sede de drenar sonhos é projetada em onda voraz para todos os aliados!',
      flavorAction: 'Compartilha o bônus predador de mana com toda a sua tropa'
    }),
    buildSpecialPower({
      name: 'Negação da Morte',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>Se outro mercenário onírico em alcance médio for reduzido a 0 PV ou menos, em vez disso o mercenário é reduzido a 1 PV. O tenente pode usar esta habilidade uma vez por cena por mercenário.</p>'
    })
  ];

  const tenenteTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const tenenteBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Sua presença na linha de frente altera o fluxo da batalha. Ele antecipa as esquivas de quem sente medo e compartilha a fome de mana com toda a sua tropa.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Diário de Campanha da Ordem da Luz</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Meia armadura macabra e escudo de brasão profano. Um oficial frio e impiedoso a serviço de Aslothia."<br><span style="font-weight: bold; color: #006400;">&mdash; Sislach Rawia</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Tenente Onírico</span> é um oficial de campo formidável de ND 6. Ele comanda esquadras com sua habilidade Estratégia do Medo (dois dados em ataques contra quem não for imune a medo) e sustenta uma aura de 30m que empodera todos os aliados contra alvos que gastem PM.</p>`;

  actorsToInject.push({
    id: tenenteId,
    name: 'Tenente Onírico',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 4, des: 1, con: 4, int: -1, sab: 0, car: -1 },
    attributes: {
      cd: 22,
      pv: { value: 220, max: 220 },
      pm: { value: 0, max: 0 },
      defesa: { value: 27, base: 26 } // 27 - 1 = 26
    },
    resistencias: tenenteTracos,
    pericias: tenenteSkills,
    items: tenenteItems,
    ataquescac: 'Espada bastarda +20 (2d10+10, 19/x3, mais 2d6 trevas) e cauda-lâmina +20 (2d10+10 corte, 18/x3, mais 2d6 trevas).',
    biography: tenenteBio
  });

  // =========================================================================
  // 10. NÓCNAM MUR, O PESADELO AMALGAMADO (ND 18) - Construto Grande
  // =========================================================================
  const nocnamId = 'gq8KNocnMur230J';
  console.log(`Configurando Nócnam Mur [${nocnamId}]...`);
  const nocnamSkills = buildSkills(18, { for: 9, des: 1, con: 6, int: -1, sab: 0, car: -1 }, {
    inic: 16,
    perc: 15,
    fort: 32,
    refl: 18,
    vont: 26,
    atle: 26,
    guer: 19,
    inti: 18,
    luta: 49
  });

  const nocnamItems = [
    buildWeaponAttack({
      name: 'Espada Bastarda Titânica',
      img: 'systems/tormenta20/icons/armas/espada-bastarda.webp',
      dano: '3d12+20',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada bastarda maciça formidável aumentada +49 (3d12+20, 19/x3, mais 6d6 trevas).</p>',
      flavorPhrase: '*BOOOM!* A lâmina titânica fende a terra e estilhaça defesas sob uma cascata de energia de trevas!',
      flavorAction: 'Desfere um golpe monumental com sua espada bastarda aumentada'
    }),
    buildWeaponAttack({
      name: 'Quatro Tentáculos-Cauda',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp',
      dano: '3d8+15',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Quatro tentáculos-cauda +49 (3d8+15 corte, 18/x3, mais 6d6 trevas, alcance 6m).</p>',
      flavorPhrase: 'Quatro tentáculos blindados com protuberâncias ósseas fatiam e empalam alvos à distância!',
      flavorAction: 'Ataca simultaneamente com seus quatro tentáculos-cauda de alcance 6m'
    }),
    buildSpecialPower({
      name: 'Despertar Temor',
      img: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
      execucao: 'free',
      custo: 0,
      cd: 47,
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 47 evita os efeitos na rodada (dois sucessos seguidos encerram o efeito).',
      description: '<p>Se Nócnam Mur acertar dois ataques de tentáculo-cauda em uma mesma criatura na mesma rodada, ele implanta um pesadelo na mente dela. Quando sofre este efeito, e no início de cada um dos seus turnos até o fim da cena, a vítima deve fazer um teste de Vontade (CD 47). Se falhar, perde 1d4 PM e, pelo restante da rodada, sempre que fizer um teste, rola dois dados e usa o pior resultado. Nócnam Mur pode usar esta habilidade uma vez por turno.</p>',
      flavorPhrase: 'O terror absoluto consome a sanidade da vítima em visões inescapáveis de morte e ruína!',
      flavorAction: 'Implanta um pesadelo invasivo na mente da vítima com seus tentáculos'
    }),
    buildSpecialPower({
      name: 'Estratégia do Medo & Fome de Sonhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/estrategia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Nócnam Mur e aliados em alcance médio atacam com dois dados contra quem não for imune a medo. Além disso, Nócnam Mur recebe bônus de acerto e dano igual ao total de PM gastos pelo alvo desde o seu último turno, compartilhando esta aura em 30m.</p>'
    }),
    buildSpecialPower({
      name: 'Força dos Titãs',
      img: 'systems/tormenta20/icons/poderes/ameacas/forca.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Sempre que Nócnam Mur rolar o resultado máximo em um dado de dano de sua espada bastarda, ele rola um dado extra e soma o resultado ao dano causado (efeito explosivo).</p>',
      flavorPhrase: 'A força titânica do galokk ecoa destruição explosiva em cada corte crítico!',
      flavorAction: 'Explode os dados máximos de dano adicionando rolagens extras'
    }),
    buildSpecialPower({
      name: 'Pesadelo Amalgamado',
      img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
      execucao: 'passive',
      custo: 0,
      cd: 47,
      description: '<p>Nócnam Mur possui todas as habilidades de Natureza do Pesadelo (Pesadelo de Desastre, Fracasso, Perseguição e Morte) com CD 47.</p>'
    }),
    buildSpecialPower({
      name: 'Varrer & Negação da Morte',
      img: 'systems/tormenta20/icons/poderes/ameacas/varredura.webp',
      execucao: 'free',
      custo: 0,
      description: '<p>Uma vez por rodada, ao reduzir uma criatura a 0 PV ou menos com um ataque corpo a corpo, Nócnam Mur realiza um ataque adicional livre. Além disso, como reação, impede a morte de um mercenário onírico deixando-o com 1 PV.</p>'
    })
  ];

  const nocnamTracos = buildTracos({
    tamanho: 'grd',
    resistencias: { dano: 10 },
    ic: ['acido', 'efeitos mentais', 'eletricidade', 'encantamento', 'medo', 'trevas'],
    idiomasValue: []
  });

  const nocnamBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Em vida, foi um galokk impiedoso que vendeu sua espada ao melhor pagador. Na morte, Ferren o reconstruiu como a encarnação viva de todos os terrores de Aslothia.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Crônica da Noite da Ascensão Profana</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Quatro caudas blindadas brotam de sua espinha dorsal metálica. Ele não apenas comanda os mercenários: ele implanta loucura pura na mente de quem cruza seu caminho."<br><span style="font-weight: bold; color: #006400;">&mdash; Sislach Narsogg</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O temível <span style="color: #800000; font-weight: bold;">Nócnam Mur, o Pesadelo Amalgamado</span> é uma ameaça lendária de ND 18 com 1.080 PV e Defesa 56. General supremo dos exércitos de mortos-vivos oníricos de Ferren Asloth, ele combina força física titânica, CD 47 em suas habilidades de pesadelo e capacidade de varredura impiedosa em combate em massa.</p>`;

  actorsToInject.push({
    id: nocnamId,
    name: 'Nócnam Mur, o Pesadelo Amalgamado',
    nd: '18',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'grd',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 9, des: 1, con: 6, int: -1, sab: 0, car: -1 },
    attributes: {
      cd: 47,
      pv: { value: 1080, max: 1080 },
      pm: { value: 0, max: 0 },
      defesa: { value: 56, base: 55 } // 56 - 1 = 55
    },
    resistencias: nocnamTracos,
    pericias: nocnamSkills,
    items: nocnamItems,
    ataquescac: 'Espada bastarda +49 (3d12+20, 19/x3, mais 6d6 trevas) e quatro tentáculos-cauda +49 (3d8+15 corte, 18/x3, mais 6d6 trevas, alcance 6m).',
    biography: nocnamBio
  });

  // =========================================================================
  // 11. SACERDOTE CAÍDO (ND 5) - Humanoide (bugbear) Médio
  // =========================================================================
  const sacerdoteId = 'gq8KSaceCai230K';
  console.log(`Configurando Sacerdote Caído [${sacerdoteId}]...`);
  const sacerdoteSkills = buildSkills(5, { for: 3, des: 2, con: 2, int: -1, sab: 2, car: -2 }, {
    inic: 6,
    perc: 6,
    fort: 11,
    refl: 6,
    vont: 16,
    furt: 6,
    inti: 7,
    reli: 4,
    luta: 20
  });

  const sacerdoteItems = [
    buildWeaponAttack({
      name: 'Foice Negra',
      img: 'systems/tormenta20/icons/armas/foice.webp',
      dano: '2d8+13',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Foice negra x2 +20 (2d8+13, x3, mais 1d12 trevas).</p>',
      flavorPhrase: '*SLASH!* O gume negro da foice racha ossos e resvala em energia profana de trevas!',
      flavorAction: 'Desfere dois golpes impiedosos com sua foice negra consagrada a Ragnar'
    }),
    buildSpecialPower({
      name: 'Êxtase no Medo',
      img: 'systems/tormenta20/icons/poderes/ameacas/medo.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O sacerdote caído sofre metade do dano de criaturas sob algum efeito de medo.</p>',
      flavorPhrase: 'O pavor alheio atua como um escudo místico que dissipa a força dos golpes recebidos!',
      flavorAction: 'Reduz à metade todo dano proveniente de adversários amedrontados'
    }),
    buildSpecialPower({
      name: 'Refestelar-se em Sangue',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>Quando faz um acerto crítico ou reduz uma criatura a 0 PV ou menos, o sacerdote recupera 5 PM.</p>',
      flavorPhrase: 'O espalhar de sangue revigora a fé mórbida e devolve energia mística ao cultista!',
      flavorAction: 'Recupera 5 PM em resposta ao derramamento crítico de sangue'
    }),
    buildSpecialPower({
      name: 'Foice Negra (Magias de Clérigo)',
      img: 'systems/tormenta20/icons/poderes/ameacas/magia.webp',
      execucao: 'standard',
      custo: 5,
      cd: 20,
      description: '<p>Enquanto estiver empunhando a Foice Negra, o sacerdote caído pode lançar como clérigo de 6º nível (CD 20):</p><ul><li><strong>Toque Vampírico (5 PM):</strong> Ataque corpo a corpo. Causa 6d6 dano de trevas extra (Fort reduz à metade) e cura metade do dano de trevas causado.</li><li><strong>Vitalidade Fantasma (6 PM):</strong> Esfera de 6m de raio centrada no sacerdote. Criaturas vivas sofrem 1d10 trevas (Fort reduz à metade) e o sacerdote recebe PV temporários iguais ao dano total causado.</li></ul>'
    })
  ];

  const sacerdoteTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: [],
    idiomasValue: []
  });

  const sacerdoteBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Ragnar caiu, mas a sede de massacre nunca abandonou nossos corações. Cada gota de sangue derramada nas ruínas de Tyrondir nos aproxima do retorno do Deus da Morte!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Oração Sombria dos Sacerdotes Caídos</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Fanáticos bugbears trajando mantos esfarrapados e brandindo foices encantadas com lodo negro. Lutam com o desespero de quem não teme a morte."<br><span style="font-weight: bold; color: #006400;">&mdash; Rotsheel, Corredora de Tyrondir</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Sacerdote Caído</span> é um clérigo renegado devotado ao derrotado Ragnar. Vivendo nas sombras das Ruínas de Tyrondir, eles emboscam a reta final da Corrida Brutal espalhando poças mortíferas de lodo negro e canalizando magias profanas através de suas foices negras.</p>`;

  actorsToInject.push({
    id: sacerdoteId,
    name: 'Sacerdote Caído',
    nd: '5',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (bugbear)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 3, des: 2, con: 2, int: -1, sab: 2, car: -2 },
    attributes: {
      cd: 20,
      pv: { value: 45, max: 45 },
      pm: { value: 22, max: 22 },
      defesa: { value: 23, base: 21 } // 23 - 2 = 21
    },
    resistencias: sacerdoteTracos,
    pericias: sacerdoteSkills,
    items: sacerdoteItems,
    ataquescac: 'Foice negra x2 +20 (2d8+13, x3, mais 1d12 trevas).',
    biography: sacerdoteBio
  });

  // =========================================================================
  // 12. TRÊS GOBLINS EM UM GORLOGG (ND 7) - Animal Grande
  // =========================================================================
  const goblinsGorloggId = 'gq8KGobGorl230L';
  console.log(`Configurando Três Goblins em um Gorlogg [${goblinsGorloggId}]...`);
  const goblinsSkills = buildSkills(7, { for: 6, des: 5, con: 6, int: -4, sab: 2, car: -2 }, {
    inic: 4,
    perc: 4,
    fort: 20,
    refl: 14,
    vont: 7,
    atle: 13,
    cava: 13,
    luta: 24,
    pont: 20
  });

  const goblinsItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '3d8+16',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 4,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida x2 +24 (3d8+16, x4 impacto/perfuração), mais agarrar aprimorado (teste +26).</p>',
      flavorPhrase: '*CHOMP!* Mandíbulas couraçadas trituram com multiplicador quadruplo (x4)!',
      flavorAction: 'Desfere duas mordidas colossais com as fauces do gorlogg'
    }),
    buildWeaponAttack({
      name: 'Funda Goblin',
      img: 'systems/tormenta20/icons/armas/funda.webp',
      dano: '2d4+10',
      tipoDano: 'impacto',
      periciaAtaque: 'pontaria',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque à Distância:</strong> Funda x3 +20 (2d4+10 impacto).</p>',
      flavorPhrase: '*WHIRRR-SNAP!* Pedregulhos zunem das fundas dos pequenos artilheiros!',
      flavorAction: 'Os três goblins disparam três tiros consecutivos de funda'
    }),
    buildSpecialPower({
      name: 'Lançamento de Bombas',
      img: 'systems/tormenta20/icons/poderes/ameacas/explosao.webp',
      execucao: 'full',
      custo: 0,
      cd: 22,
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 22 reduz à metade.',
      description: '<p>Os goblins lançam bombas em um ponto em alcance curto. Criaturas a até 3m desse ponto sofrem 12d6 pontos de dano de impacto (Ref CD 22 reduz à metade). Recarga (ação padrão).</p>',
      flavorPhrase: '“PEGA A FUSA CURTA! JOGA LÁÁÁ!” *KABUUUUM!* Uma explosão de estilhaços e fogo cobre a pista!',
      flavorAction: 'Arremessam um cacho de bombas alquímicas causando 12d6 de dano em área',
      rolls: [
        {
          name: 'Explosão de Bombas (12d6 Impacto)',
          key: 'dano0',
          type: 'damage',
          parts: [['12d6', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildSpecialPower({
      name: 'Vai, Vai, Vai!',
      img: 'systems/tormenta20/icons/poderes/ameacas/velocidade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Os três goblins em um gorlogg podem fazer uma ação de movimento adicional por turno, apenas para se deslocar, se não tiverem usado o ataque de mordida.</p>',
      flavorPhrase: 'Pancadas nas ancas do gorlogg fazem a besta acelerar como um aríete desgovernado!',
      flavorAction: 'Obtém movimento extra galopando pela pista de corrida'
    }),
    buildSpecialPower({
      name: 'Os Três Goblins',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Os goblins sabem evitar serem acertados na garupa do gorlogg, sendo imunes a dano até que o gorlogg seja derrotado, mas ainda podem ser afetados por efeitos mentais (Vontade +5; se afetados, a criatura inteira fica confusa e imóvel por 1d4 rodadas).</p>'
    })
  ];

  const goblinsTracos = buildTracos({
    tamanho: 'grd',
    resistencias: { dano: 0 },
    ic: [],
    idiomasValue: []
  });

  const goblinsBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*QUEM DISSE QUE PRECISA DE RODAS QUANDO SE TEM DUAS TONELADAS DE COURO, GARRAS E PAVIOS ACESOS?! SAI DA FRENTEEE!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Krigg, Progg e Nregg, Artilheiros de Tyrondir</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Uma monstruosidade pré-histórica transformada em tanque de guerra improvisado por três goblins insanos e cheios de pólvora."<br><span style="font-weight: bold; color: #006400;">&mdash; Dok, Piloto Kliren da Corrida Brutal</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Os <span style="color: #800000; font-weight: bold;">Três Goblins em um Gorlogg</span> formam a equipe mais barulhenta e caótica da Corrida Brutal. Krigg, Progg e Nregg pilotam a montaria réptil colossal enquanto disparam fundas e despejam salvas de bombas de 12d6 sobre qualquer concorrente que ouse emparelhar.</p>`;

  actorsToInject.push({
    id: goblinsGorloggId,
    name: 'Três Goblins em um Gorlogg',
    nd: '7',
    papel: 'solo',
    tipoMonstro: 'ani',
    raca: 'Animal',
    tamanho: 'grd',
    deslocamento: '12m (8q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: { for: 6, des: 5, con: 6, int: -4, sab: 2, car: -2 },
    attributes: {
      cd: 22,
      pv: { value: 300, max: 300 },
      pm: { value: 0, max: 0 },
      defesa: { value: 30, base: 25 } // 30 - 5 = 25
    },
    resistencias: goblinsTracos,
    pericias: goblinsSkills,
    items: goblinsItems,
    ataquescac: 'Mordida x2 +24 (3d8+16, x4).',
    biography: goblinsBio
  });

  // =========================================================================
  // 13. ARZAK (ND 8) - Humanoide (hobgoblin) Médio
  // =========================================================================
  const arzakId = 'gq8KArzak230M';
  console.log(`Configurando Arzak [${arzakId}]...`);
  const arzakSkills = buildSkills(8, { for: 5, des: 5, con: 5, int: 2, sab: 2, car: 0 }, {
    inic: 13,
    perc: 10,
    fort: 15,
    refl: 21,
    vont: 8,
    acro: 13,
    atle: 13,
    cava: 13,
    furt: 15,
    inti: 10,
    ladi: 13,
    luta: 24,
    pont: 22
  });

  const arzakItems = [
    buildWeaponAttack({
      name: 'Kum’shrak Eviscerador',
      img: 'systems/tormenta20/icons/armas/machado-de-guerra.webp',
      dano: '1d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo Especial Duyshidakk:</strong> Kum’shrak x3 +24 (1d8+10 corte, x3, mais sangrando).</p>',
      flavorPhrase: '*SHHHIK!* A lâmina serrilhada curvada rasga a jugular deixando um ferimento sangrento profuso!',
      flavorAction: 'Desfere três golpes brutais com seu kum’shrak eviscerador hobgoblin'
    }),
    buildWeaponAttack({
      name: 'Adaga de Arremesso',
      img: 'systems/tormenta20/icons/armas/adaga.webp',
      dano: '1d4+8',
      tipoDano: 'perfuração',
      periciaAtaque: 'pontaria',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque à Distância:</strong> Adaga x2 +22 (1d4+8 perfuração, 19/x2).</p>'
    }),
    buildSpecialPower({
      name: 'Assassinar',
      img: 'systems/tormenta20/icons/poderes/ameacas/assassinar.webp',
      execucao: 'move',
      custo: 0,
      description: '<p>Arzak analisa uma criatura em alcance curto. Em seu primeiro Ataque Furtivo que causar dano a ela até o fim do seu próximo turno, ele dobra os dados de dano do Ataque Furtivo (passando para 12d6 ou 16d6 se montado).</p>',
      flavorPhrase: 'Os olhos frios do assassino estudam as costelas do alvo encontrando o ponto fatal exato.',
      flavorAction: 'Mira as frestas da armadura para desferir um assassinato cirúrgico'
    }),
    buildSpecialPower({
      name: 'Ataque Furtivo +6d6',
      img: 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Uma vez por rodada, quando atinge uma criatura desprevenida ou flanqueada com um ataque corpo a corpo ou em alcance curto, Arzak causa +6d6 pontos de dano extra de corte/perfuração (+8d6 se estiver montado).</p>'
    }),
    buildSpecialPower({
      name: 'Manobras Evasivas & Sangrento',
      img: 'systems/tormenta20/icons/poderes/ameacas/evasao.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>Uma vez por rodada, substitui um teste de resistência por um teste de Cavalgar (+13). Enquanto montado, seu deslocamento se torna 12m, ganha ação de movimento extra e +2d6 no Ataque Furtivo.</p>'
    }),
    buildSpecialPower({
      name: 'Um com as Sombras & Evasão Aprimorada',
      img: 'systems/tormenta20/icons/poderes/ameacas/furtividade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Arzak nunca fica surpreendido ou flanqueado e não sofre penalidades por se mover com seu deslocamento normal em Furtividade. Em testes de Reflexos para reduzir dano à metade, não sofre dano se passar e sofre metade se falhar.</p>'
    })
  ];

  const arzakTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: [],
    idiomasValue: []
  });

  const arzakBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Eu não corro pela taça nem pelos aplausos dos tolos. Corro porque sangue hobgoblin não aceita segundos lugares.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Arzak, Piloto e Assassino da Aliança Negra</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um mestre nas sombras mesmo a toda velocidade sobre um veículo de guerra. Se o kum'shrak dele morder, você sangra até secar."<br><span style="font-weight: bold; color: #006400;">&mdash; Rotsheel</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O infame <span style="color: #800000; font-weight: bold;">Arzak</span> é um assassino hobgoblin de elite de ND 8 participante da Corrida Brutal. Empunhando seu temível <em>kum’shrak eviscerador</em> com sangramento contínuo e Ataque Furtivo massivo dobrável via Assassinar, ele elimina concorrentes com frieza tática inigualável.</p>`;

  actorsToInject.push({
    id: arzakId,
    name: 'Arzak',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (hobgoblin)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 5, des: 5, con: 5, int: 2, sab: 2, car: 0 },
    attributes: {
      cd: 23,
      pv: { value: 250, max: 250 },
      pm: { value: 0, max: 0 },
      defesa: { value: 31, base: 26 } // 31 - 5 = 26
    },
    resistencias: arzakTracos,
    pericias: arzakSkills,
    items: arzakItems,
    ataquescac: 'Kum’shrak x3 +24 (1d8+10 corte, x3, mais sangrando).',
    biography: arzakBio
  });

  // =========================================================================
  // 14. GAARDAK (ND 8) - Humanoide (bugbear) Médio
  // =========================================================================
  const gaardakId = 'gq8KGaarda230N';
  console.log(`Configurando Gaardak [${gaardakId}]...`);
  const gaardakSkills = buildSkills(8, { for: 5, des: 4, con: 3, int: -1, sab: 1, car: 1 }, {
    inic: 12,
    perc: 9,
    fort: 15,
    refl: 20,
    vont: 10,
    acro: 12,
    atle: 13,
    inti: 13,
    luta: 24,
    pont: 26
  });

  const gaardakItems = [
    buildWeaponAttack({
      name: 'Ataque Desarmado Brutal',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '2d8+8',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Ataque desarmado x3 +24 (2d8+8 impacto).</p>',
      flavorPhrase: '*POW!* Punhos colossais do bugbear quebram costelas com fúria animalesca!',
      flavorAction: 'Desfere três socos brutais com seus punhos massivos'
    }),
    buildWeaponAttack({
      name: 'Azagaia Pesada',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '3d6+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'pontaria',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque à Distância:</strong> Duas azagaias +26 (3d6+10 perfuração).</p>',
      flavorPhrase: '*THWACK!* O arremesso da azagaia empala o alvo arremessando-o para trás!',
      flavorAction: 'Dispara duas azagaias pesadas com força estarrecedora'
    }),
    buildSpecialPower({
      name: 'Arremesso Devastador',
      img: 'systems/tormenta20/icons/poderes/ameacas/arremesso.webp',
      execucao: 'free',
      custo: 0,
      description: '<p>Se acertar uma criatura com o ataque de azagaia, Gaardak pode fazer uma manobra derrubar ou empurrar (teste +28) contra a criatura atingida como ação livre.</p>',
      flavorPhrase: 'O projétil atinge com tanta inércia que prostra ou arrasta o inimigo!',
      flavorAction: 'Realiza manobra derrubar ou empurrar imediata com teste +28'
    }),
    buildSpecialPower({
      name: 'Lento Demais! & Fluxo de Movimento',
      img: 'systems/tormenta20/icons/poderes/ameacas/contra-ataque.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>Uma vez por rodada, ao ser alvo de ataque corpo a corpo, Gaardak faz teste de ataque oposto. Se vencer, evita o dano e contra-ataca. Além disso, pode intercalar movimento antes e depois de sua ação padrão.</p>'
    }),
    buildSpecialPower({
      name: 'Poderio Muscular & Êxtase no Medo',
      img: 'systems/tormenta20/icons/poderes/ameacas/furia.webp',
      execucao: 'standard',
      custo: 0,
      description: '<p>Gaardak recebe deslocamento +9m e +10 em Atletismo até o fim da cena (fica fraco depois). Sofre metade do dano de criaturas sob efeito de medo.</p>'
    })
  ];

  const gaardakTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 0 },
    ic: [],
    idiomasValue: []
  });

  const gaardakBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Acham que podem me acompanhar nas curvas? Eu escavo a rocha e quebro a carcaça de vocês com as mãos limpas!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Gaardak, o Bruto de Tyrondir</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Capaz de nadar, escavar e arremessar azagaias com força suficiente para derrubar muralhas de estacas. O adversário mais temido da Corrida Brutal."<br><span style="font-weight: bold; color: #006400;">&mdash; Rotsheel</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O bugbear <span style="color: #800000; font-weight: bold;">Gaardak</span> é um competidor formidável de ND 8 na Corrida Brutal. Com 320 PV, deslocamentos especiais de escavação e natação 6m, contra-ataque reativo através de <em>Lento Demais!</em> e azagaias com arremesso devastador (teste +28), ele domina as pistas com pura força física e selvageria.</p>`;

  actorsToInject.push({
    id: gaardakId,
    name: 'Gaardak',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (bugbear)',
    tamanho: 'med',
    deslocamento: '12m (8q), escavação 6m (4q), natação 6m (4q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 5, des: 4, con: 3, int: -1, sab: 1, car: 1 },
    attributes: {
      cd: 24,
      pv: { value: 320, max: 320 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 29 } // 33 - 4 = 29
    },
    resistencias: gaardakTracos,
    pericias: gaardakSkills,
    items: gaardakItems,
    ataquescac: 'Ataque desarmado x3 +24 (2d8+8).',
    biography: gaardakBio
  });

  // =========================================================================
  // PERSISTÊNCIA EM PACKS E SOURCE-PACKS
  // =========================================================================
  console.log(`\nIniciando injeção de ${actorsToInject.length} atores em Ameacas_T20...`);

  for (const actor of actorsToInject) {
    console.log(` -> Injetando ${actor.name} [${actor.id}]...`);

    // 1. Limpar subdocumentos antigos caso existam
    for await (const [key] of db.iterator()) {
      if (key.startsWith(`!actors.items!${actor.id}.`)) {
        await db.del(key);
      }
    }

    // 2. Construir objeto do ator via buildNpcActor
    const built = buildNpcActor({
      id: actor.id,
      name: actor.name,
      nd: actor.nd,
      papel: actor.papel,
      tipoMonstro: actor.tipoMonstro,
      raca: actor.raca,
      tamanho: actor.tamanho,
      folder: FOLDER_DB,
      deslocamento: actor.deslocamento,
      sentidos: actor.sentidos,
      tesouro: actor.tesouro,
      atributos: actor.atributos,
      attributes: actor.attributes,
      resistencias: actor.resistencias,
      pericias: actor.pericias,
      items: actor.items,
      ataquescac: actor.ataquescac,
      biography: actor.biography
    });

    // 3. Gravar documento principal do ator
    await db.put(`!actors!${actor.id}`, built.actorDoc);

    // 4. Gravar subdocumentos embutidos
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }

    // 5. Espelhar em src/packs/Ameacas_T20
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${actor.name} (ND ${actor.nd})" salvo em src/packs/Ameacas_T20 com ${built.embeddedDocs.length} subdocumentos.`);
  }

  await db.close();
  console.log('\n✅ 14 Ameaças da DB #230 injetadas com 100% de sucesso!');
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('❌ Erro na injeção de ameaças DB #230:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

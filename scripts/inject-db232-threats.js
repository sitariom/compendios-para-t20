#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças da DB #232 em Ameacas_T20
 *
 * Conteúdo:
 * 1. Licantropos Artonianos (10 Ameaças de Rafael Dei Svaldi e Thiago Rosa):
 *    - Lobisomem Predador Urbano (ND 4)
 *    - Lobisomem Caçador de Recompensas (ND 9)
 *    - Licantropo Rato Comedor de Restos (ND 1)
 *    - Licantropo Rato Infiltrador Veterano (ND 7)
 *    - Licantropo Onça Pirata de Rio (ND 7)
 *    - Licantropo Onça Lutador de Arena (ND 11)
 *    - Licantropo Texugo Furioso (ND 5)
 *    - Licantropo Texugo Servo da Noite (ND 8) - Conjurador de Tenebra (4 Magias)
 *    - Licantropo Selako Farejador de Sangue (ND 3)
 *    - Licantropo Selako Terror dos Mares (ND 9)
 *
 * 2. Breves Jornadas: Monstros e Homens (5 Ameaças de Lucas Borne):
 *    - Mamãe Glop (ND 2)
 *    - Estirge (ND 1)
 *    - Perdigueiro Troll (ND 1)
 *    - Ginete de Troll Purista (ND 2)
 *    - Xamã Finntroll (ND 2) - Conjurador de Megalokk (4 Magias)
 *
 * Conformidade Canônica Absoluta:
 * - Atributos reais e auditados de cada criatura
 * - Iniciativa e Percepção (mais usos situacionais como Percepção em Subterrâneo) idênticos à ficha
 * - Defesa Base Dinâmica (defesa.base + des === defesa.value)
 * - 34 perícias sob system.pericias com value = fichaVal e outros = diferença
 * - Perícias treinadas do statblock estritamente respeitadas
 * - Magias individuais como itens de tipo "magia" (SpellData DataModel)
 * - Desagregação atômica estrita de habilidades sem nomes compostos
 * - system.detalhes.resistencias preenchido com a redação verbatim da linha de Defesa
 * - Tokens 2MTT circulares exclusivos em assets/tokens/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildSkills,
  buildTracos,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  saveToSourcePacks
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const FOLDER_DB = 'wfWApuyngzFm4KOP'; // Pasta canônica "Dragão Brasil"

async function injectThreats() {
  console.log('=== Injetando 15 Ameaças Auditadas da DB #232 em Ameacas_T20 ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const actorsToInject = [];

  // =========================================================================
  // 1. LOBISOMEM PREDADOR URBANO (ND 4) - Humanoide Médio
  // =========================================================================
  const loboUrbId = 'gq8232LoboUrbAAA';
  console.log(`Configurando Lobisomem Predador Urbano [${loboUrbId}]...`);
  const loboUrbAtr = { for: 1, des: 4, con: 1, int: 0, sab: 1, car: 2 };
  const loboUrbSkills = buildSkills(4, loboUrbAtr, {
    inic: 10,
    perc: 5,
    fort: 4,
    refl: 16,
    vont: 10,
    ades: 6,
    enga: 9,
    furt: 10,
    joga: 6,
    ladi: 8,
    luta: 16
  }, {
    ades_lobos: { label: 'Adestramento (Lobos)', atributo: 'car', value: 11, outros: 5, treinado: true, custom: true }
  });

  const loboUrbTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const loboUrbItems = [
    buildWeaponAttack({
      name: 'Duas Adagas',
      img: 'systems/tormenta20/icons/itens/equipamentos/adaga.webp',
      dano: '1d4+4',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Duas adagas +16 (1d4+4 perfuração, 19).</p>'
    }),
    buildWeaponAttack({
      name: 'Duas Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '1d6+4',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Duas garras +16 (1d6+4 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+4',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Mordida +16 (1d6+4 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Lobo)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d6+6',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Lobo):</strong> Mordida +16 (2d6+6 perfuração). Sempre que acerta, pode fazer a manobra derrubar (teste +16) como ação livre.</p>'
    }),
    buildSpecialPower({
      name: 'Ataque Furtivo',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/ataque-furtivo.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O lobisomem causa +2d6 pontos de dano corpo a corpo adicional contra alvos desprevenidos ou flanqueados.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Lobos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O lobisomem predador urbano pode usar Adestramento para mudar atitude e persuasão com lobos e lobos-das-cavernas.</p>'
    }),
    buildSpecialPower({
      name: 'Evasão',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/evasao.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, não sofre dano algum se passar.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do lobisomem contrai licantropia (Fort CD 18 evita; veja Licantropia).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O lobisomem muda de forma, entre humanoide, híbrida ou de lobo (ação completa). Na forma híbrida recebe garras e mordida; na forma de lobo seu deslocamento se torna 15m e recebe derrubar (teste +16) livre ao acertar com a mordida.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O lobisomem sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: loboUrbId,
    name: 'Lobisomem Predador Urbano',
    nd: '4',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'faro, visão na penumbra',
    tesouro: 'Padrão',
    atributos: loboUrbAtr,
    attributes: {
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 19 } // 23 - 4 = 19
    },
    resistencias: loboUrbTracos,
    resistenciasTexto: 'evasão, redução de dano 5/mitral',
    pericias: loboUrbSkills,
    items: loboUrbItems,
    ataquescac: 'Conforme a forma: Duas adagas +16 (1d4+4, 19) ou Mordida e Garras +16.',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Ninguém conhece estas ruelas e seus segredos tão bem quanto eu. Venham, a noite mal começou...*"<br><span style="font-weight: bold; color: #800000;">&mdash; O Fidalgo da Meia-Noite</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Ele caminha entre a nobreza de dia com capa de veludo e sorriso galante, mas caça mendigos e viajantes nos becos escuros assim que as tochas se apagam."<br><span style="font-weight: bold; color: #006400;">&mdash; Batedor da Milícia Urbana</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Lobisomem Predador Urbano</span> (ND 4) é um assassino sutil que estabelece seu campo de caça no coração das cidades de Arton, alternando entre disfarces fidalgos e fúria licantrópica.</p>'
  });

  // =========================================================================
  // 2. LOBISOMEM CAÇADOR DE RECOMPENSAS (ND 9) - Humanoide Médio
  // =========================================================================
  const loboCacId = 'gq8232LoboCacAAA';
  console.log(`Configurando Lobisomem Caçador de Recompensas [${loboCacId}]...`);
  const loboCacAtr = { for: 5, des: 2, con: 3, int: 0, sab: 2, car: -1 };
  const loboCacSkills = buildSkills(9, loboCacAtr, {
    inic: 10,
    perc: 10,
    fort: 22,
    refl: 9,
    vont: 15,
    ades: 7,
    atle: 13,
    inve: 10,
    inti: 7,
    intu: 10,
    luta: 26,
    pont: 27,
    sobr: 12
  }, {
    ades_lobos: { label: 'Adestramento (Lobos)', atributo: 'car', value: 12, outros: 5, treinado: true, custom: true },
    perc_subterraneo: { label: 'Percepção (Subterrâneo)', atributo: 'sab', value: 12, outros: 2, treinado: true, custom: true }
  });

  const loboCacTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    icValue: ['medo']
  });

  const loboCacItems = [
    buildWeaponAttack({
      name: 'Lança (Forma Humanoide)',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '4d6+15',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Lança x2 +26 (4d6+15 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Lança (Forma Híbrida)',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '4d6+17',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Híbrida):</strong> Lança +28 (4d6+17 perfuração), garra +28 (2d6+8) e mordida +28 (2d6+8).</p>'
    }),
    buildWeaponAttack({
      name: 'Besta Leve',
      img: 'systems/tormenta20/icons/armas/arco-curto.webp',
      dano: '2d8+13',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      alcance: 'médio',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Besta leve x2 +27 (2d8+13 perfuração, 19, mais veneno peçonha potente, alcance médio).</p>'
    }),
    buildWeaponAttack({
      name: 'Garras e Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+8',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Duas garras +28 (2d6+8 corte) e mordida +28 (2d6+8 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Lobo)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d6+16',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Lobo):</strong> Mordida +28 (4d6+16 perfuração). Sempre que acerta, pode fazer a manobra derrubar (teste +28) como ação livre.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Lobos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O lobisomem caçador de recompensas pode usar Adestramento para mudar atitude e persuasão com lobos e lobos-das-cavernas.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do lobisomem contrai licantropia (Fort CD 28 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Marca da Presa',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/marca-da-presa.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Uma vez por rodada, o lobisomem analisa uma criatura em alcance longo. Até o fim da cena, ele recebe +3 em testes de perícia, +3 na margem de ameaça e +1d12 em rolagens de dano contra essa criatura (esses bônus são dobrados contra humanoides e monstros).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O lobisomem muda de forma, entre humanoide, híbrida ou de lobo (ação completa). Na forma híbrida recebe +2 em Força e os ataques listados; na forma de lobo recebe +2 em Força, deslocamento 15m e derrubar livre com a mordida.</p>'
    }),
    buildSpecialPower({
      name: 'Veneno (Peçonha Potente)',
      img: 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Peçonha potente (perde 2d12 PV por rodada durante 3 rodadas, Fort CD 28 reduz a duração para 1 rodada).</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O lobisomem sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: loboCacId,
    name: 'Lobisomem Caçador de Recompensas',
    nd: '9',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (anão)',
    tamanho: 'med',
    deslocamento: '9m (6q), sem redução por terreno difícil',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: loboCacAtr,
    attributes: {
      pv: { value: 355, max: 355 },
      pm: { value: 0, max: 0 },
      defesa: { value: 34, base: 32 } // 34 - 2 = 32
    },
    resistencias: loboCacTracos,
    resistenciasTexto: 'imunidade a medo, redução de dano 5/mitral',
    pericias: loboCacSkills,
    items: loboCacItems,
    ataquescac: 'Conforme a forma: Lança x2 +26 (4d6+15) ou Lança +28, Garras +28 e Mordida +28.',
    ataquesad: 'Besta leve x2 +27 (2d8+13, 19, mais veneno).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Não importa onde você se esconda. O vento sempre me traz o cheiro do seu medo.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Thorgar, o Rastreador Cinzento</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um veterano anão que uniu a tenacidade de seu povo à fúria do lobo. Caça criminosos procurados com frieza implacável."<br><span style="font-weight: bold; color: #006400;">&mdash; Guarda Real de Deheon</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Lobisomem Caçador de Recompensas</span> (ND 9) é um rastreador solitário que abraçou a maldição como uma ferramenta de trabalho brutal, caçando alvos difíceis com disparos de besta envenenada e ataques devastadores de garras.</p>'
  });

  // =========================================================================
  // 3. LICANTROPO RATO COMEDOR DE RESTOS (ND 1) - Humanoide Pequeno
  // =========================================================================
  const ratoComId = 'gq8232RatoComAAA';
  console.log(`Configurando Licantropo Rato Comedor de Restos [${ratoComId}]...`);
  const ratoComAtr = { for: 0, des: 3, con: 1, int: 1, sab: 0, car: -1 };
  const ratoComSkills = buildSkills(1, ratoComAtr, {
    inic: 5,
    perc: 0,
    fort: 5,
    refl: 10,
    vont: 1,
    ades: 1,
    enga: 1,
    furt: 7,
    ladi: 5,
    luta: 11,
    pont: 11,
    sobr: 2
  }, {
    ades_ratos: { label: 'Adestramento (Ratos)', atributo: 'car', value: 6, outros: 5, treinado: true, custom: true }
  });

  const ratoComTracos = buildTracos({
    tamanho: 'peq',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const ratoComItems = [
    buildWeaponAttack({
      name: 'Duas Adagas',
      img: 'systems/tormenta20/icons/itens/equipamentos/adaga.webp',
      dano: '1d4+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Adaga x2 +11 (1d4+3, 19).</p>'
    }),
    buildWeaponAttack({
      name: 'Adagas e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Adaga x2 +11 (1d4+3, 19) e mordida +11 (1d6+3). Acerto crítico avaria armadura ou aumenta multiplicador para x3.</p>'
    }),
    buildWeaponAttack({
      name: 'Besta Leve',
      img: 'systems/tormenta20/icons/armas/arco-curto.webp',
      dano: '1d8+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      alcance: 'médio',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Besta leve +11 (1d8+3, 19, alcance médio).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Rato)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Rato):</strong> Mordida +11 (1d6+3). Crítico avaria armadura ou x3.</p>'
    }),
    buildSpecialPower({
      name: 'Dentes de Roedor',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando o licantropo rato comedor de restos faz um acerto crítico com sua mordida, deixa a armadura da vítima avariada ou, se ela estiver sem armadura, aumenta em +1 o multiplicador desse crítico.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Ratos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo rato pode usar Adestramento para mudar atitude e persuasão com ratos.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo rato contrai licantropia (Fort CD 14 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo rato muda de forma, entre humanoide, híbrida ou de rato (ação completa). Na forma de rato se torna Minúsculo, seu deslocamento se torna 12m (escalada 12m).</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo rato sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: ratoComId,
    name: 'Licantropo Rato Comedor de Restos',
    nd: '1',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (goblin)',
    tamanho: 'peq',
    deslocamento: '9m (6q), escalada 9m',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: ratoComAtr,
    attributes: {
      pv: { value: 10, max: 10 },
      pm: { value: 0, max: 0 },
      defesa: { value: 15, base: 12 } // 15 - 3 = 12
    },
    resistencias: ratoComTracos,
    resistenciasTexto: 'redução de dano 5/mitral',
    pericias: ratoComSkills,
    items: ratoComItems,
    ataquescac: 'Conforme a forma: Duas adagas +11 (1d4+3, 19) ou Mordida +11 (1d6+3).',
    ataquesad: 'Besta leve +11 (1d8+3, 19).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Chiik-chiik! O que cai no chão dos esgotos é nosso por direito!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Skritt, o Rato dos Becos</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Pequenos goblins infectados que vivem nos canos de esgoto e lixões urbanos. Mordem com dentes que estilhaçam placas de aço."<br><span style="font-weight: bold; color: #006400;">&mdash; Faxineiro das Galerias de Valkaria</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Rato Comedor de Restos</span> (ND 1) é uma praga subterrânea que se alimenta de refugos e embosca incautos escalando paredes de pedra com facilidade assombrosa.</p>'
  });

  // =========================================================================
  // 4. LICANTROPO RATO INFILTRADOR VETERANO (ND 7) - Humanoide Médio
  // =========================================================================
  const ratoInfId = 'gq8232RatoInfAAA';
  console.log(`Configurando Licantropo Rato Infiltrador Veterano [${ratoInfId}]...`);
  const ratoInfAtr = { for: 2, des: 4, con: 3, int: 1, sab: 1, car: 2 };
  const ratoInfSkills = buildSkills(7, ratoInfAtr, {
    inic: 11,
    perc: 8,
    fort: 14,
    refl: 20,
    vont: 7,
    acro: 11,
    ades: 9,
    atle: 9,
    enga: 9,
    furt: 11,
    guer: 8,
    ladi: 11,
    luta: 24,
    pont: 24,
    sobr: 8
  }, {
    ades_ratos: { label: 'Adestramento (Ratos)', atributo: 'car', value: 14, outros: 5, treinado: true, custom: true },
    furt_cidades: { label: 'Furtividade (Cidades)', atributo: 'des', value: 13, outros: 2, treinado: true, custom: true }
  });

  const ratoInfTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const ratoInfItems = [
    buildWeaponAttack({
      name: 'Corrente com Espinhos',
      img: 'systems/tormenta20/icons/armas/chicote.webp',
      dano: '4d4+14',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Corrente com espinhos x2 +24 (4d4+14 corte, 18).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '3d6+14',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida/Rato):</strong> Mordida +24 (3d6+14 perfuração). Crítico avaria armadura ou aumenta multiplicador para x3.</p>'
    }),
    buildWeaponAttack({
      name: 'Arco Longo',
      img: 'systems/tormenta20/icons/armas/arco-longo.webp',
      dano: '3d8+14',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      alcance: 'longo',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Arco longo x2 +24 (3d8+14 perfuração, x3, alcance longo).</p>'
    }),
    buildSpecialPower({
      name: 'Dentes de Roedor',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando o licantropo rato infiltrador veterano faz um acerto crítico com sua mordida, deixa a armadura da vítima avariada ou, se ela estiver sem armadura, aumenta em +1 o multiplicador desse crítico.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Ratos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo rato pode usar Adestramento para mudar atitude e persuasão com ratos.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo rato contrai licantropia (Fort CD 24 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo rato muda de forma, entre humanoide, híbrida ou de rato (ação completa). Na forma híbrida recebe escalada 6m; na forma de rato se torna Minúsculo e recebe escalada 6m.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo rato sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: ratoInfId,
    name: 'Licantropo Rato Infiltrador Veterano',
    nd: '7',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (hobgoblin)',
    tamanho: 'med',
    deslocamento: '12m (8q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: ratoInfAtr,
    attributes: {
      pv: { value: 270, max: 270 },
      pm: { value: 0, max: 0 },
      defesa: { value: 32, base: 28 } // 32 - 4 = 28
    },
    resistencias: ratoInfTracos,
    resistenciasTexto: 'redução de dano 5/mitral',
    pericias: ratoInfSkills,
    items: ratoInfItems,
    ataquescac: 'Corrente com espinhos x2 +24 (4d4+14, 18) e mordida +11 (3d6+14).',
    ataquesad: 'Arco longo x2 +24 (3d8+14, x3).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Nenhum cofre é impenetrável quando você pode escorrer pela tubulação e roer as fechaduras por dentro.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Krazzar, Espião da Aliança</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um mestre espião hobgoblin com dentes de aço e corrente com espinhos. Entra como rato e mata como general."<br><span style="font-weight: bold; color: #006400;">&mdash; Guarda do Castelo de Portsmouth</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Rato Infiltrador Veterano</span> (ND 7) combina a disciplina militar com a infiltração roedora, empunhando correntes com espinhos precisas e arcos longos de tocaia.</p>'
  });

  // =========================================================================
  // 5. LICANTROPO ONÇA PIRATA DE RIO (ND 7) - Humanoide Médio
  // =========================================================================
  const oncaPirId = 'gq8232OncaPirAAA';
  console.log(`Configurando Licantropo Onça Pirata de Rio [${oncaPirId}]...`);
  const oncaPirAtr = { for: 2, des: 5, con: 2, int: 0, sab: 2, car: 4 };
  const oncaPirSkills = buildSkills(7, oncaPirAtr, {
    inic: 14,
    perc: 9,
    fort: 13,
    refl: 19,
    vont: 9,
    acro: 14,
    ades: 11,
    atle: 11,
    inti: 13,
    luta: 24,
    pilo: 11,
    pont: 23
  }, {
    ades_oncas: { label: 'Adestramento (Onças)', atributo: 'car', value: 16, outros: 5, treinado: true, custom: true }
  });

  const oncaPirTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const oncaPirItems = [
    buildWeaponAttack({
      name: 'Cimitarra',
      img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
      dano: '4d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Cimitarra x2 +24 (4d8+10 corte, 18).</p>'
    }),
    buildWeaponAttack({
      name: 'Garra e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d8+5',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Garra +24 (2d8+5 corte) e mordida +24 (2d8+5 perfuração) ou duas garras +24 e mordida +24.</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Onça)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d8+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Onça):</strong> Mordida +24 (4d8+10 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Pistola',
      img: 'systems/tormenta20/icons/armas/pistola.webp',
      dano: '6d6+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 18,
      criticoMultiplicador: 3,
      alcance: 'curto',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Pistola x2 +23 (6d6+10 perfuração, 18/x3).</p>'
    }),
    buildSpecialPower({
      name: 'Correr pelo Cordame',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo onça pirata de rio percorre até seu deslocamento, ignorando terreno difícil, e faz um ataque corpo a corpo com +2 no teste de ataque e +1d6 na rolagem de dano.</p>'
    }),
    buildSpecialPower({
      name: 'Emboscar',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/escaramuca.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Na primeira rodada de combate, se estiver em sua forma híbrida ou de onça, o licantropo onça pode realizar uma ação padrão adicional.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Onças',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo onça pode usar Adestramento para mudar atitude e persuasão com onças.</p>'
    }),
    buildSpecialPower({
      name: 'Evasão',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/evasao.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, não sofre dano algum se passar.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo onça contrai licantropia (Fort CD 28 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo onça muda de forma, entre humanoide, híbrida ou de onça (ação completa). Na forma de onça recebe deslocamento 15m (natação 6m) e Emboscar.</p>'
    }),
    buildSpecialPower({
      name: 'Pernas do Mar',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/acrobacia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando está se equilibrando ou escalando, o licantropo onça não fica desprevenido e seu deslocamento não é reduzido à metade.</p>'
    }),
    buildSpecialPower({
      name: 'Saque Rápido',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/saque-rapido.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>O licantropo onça pode sacar ou guardar itens como uma ação livre e recarregar sua pistola como uma ação de movimento.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo onça sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: oncaPirId,
    name: 'Licantropo Onça Pirata de Rio',
    nd: '7',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: oncaPirAtr,
    attributes: {
      pv: { value: 270, max: 270 },
      pm: { value: 0, max: 0 },
      defesa: { value: 30, base: 25 } // 30 - 5 = 25
    },
    resistencias: oncaPirTracos,
    resistenciasTexto: 'evasão, redução de dano 5/mitral',
    pericias: oncaPirSkills,
    items: oncaPirItems,
    ataquescac: 'Cimitarra x2 +24 (4d8+10, 18) ou garras e mordida.',
    ataquesad: 'Pistola x2 +23 (6d6+10, 18/x3).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O rio é meu covil e a noite é minha bandeira. Entreguem a carga antes que a maré leve seus corpos.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Capitão Jaguaretê</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Salta de barco em barco como um felino alado, disparando pistolas e dilacerando marujos com cimitarras."<br><span style="font-weight: bold; color: #006400;">&mdash; Mercador fluvial do Rio dos Deuses</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Onça Pirata de Rio</span> (ND 7) comanda embarcações fluviais clandestinas combinando agilidade acrobática em cordames com o bote mortal da onça-pintada.</p>'
  });

  // =========================================================================
  // 6. LICANTROPO ONÇA LUTADOR DE ARENA (ND 11) - Humanoide Médio
  // =========================================================================
  const oncaLutId = 'gq8232OncaLutAAA';
  console.log(`Configurando Licantropo Onça Lutador de Arena [${oncaLutId}]...`);
  const oncaLutAtr = { for: 5, des: 3, con: 4, int: 0, sab: 3, car: 0 };
  const oncaLutSkills = buildSkills(11, oncaLutAtr, {
    inic: 12,
    perc: 12,
    fort: 22,
    refl: 18,
    vont: 13,
    acro: 14,
    ades: 9,
    atle: 16,
    luta: 34
  }, {
    ades_oncas: { label: 'Adestramento (Onças)', atributo: 'car', value: 14, outros: 5, treinado: true, custom: true }
  });

  const oncaLutTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const oncaLutItems = [
    buildWeaponAttack({
      name: 'Ataque Desarmado',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/estilo-desarmado.webp',
      dano: '4d10+20',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Ataque desarmado x2 +34 (4d10+20 impacto, 19/x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Duas Garras e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '4d10+20',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Duas garras +34 (4d10+20 corte, 19/x3) e mordida +24 (4d10+20 perfuração, 19/x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Onça)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d10+20',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural (Forma de Onça):</strong> Mordida x2 +34 (4d10+20 perfuração, 19/x3).</p>'
    }),
    buildSpecialPower({
      name: 'Emboscar',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/escaramuca.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Na primeira rodada de combate, se estiver em sua forma híbrida ou de onça, o licantropo onça pode realizar uma ação padrão adicional.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Onças',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo onça pode usar Adestramento para mudar atitude e persuasão com onças.</p>'
    }),
    buildSpecialPower({
      name: 'Evasão',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/evasao.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, não sofre dano algum se passar.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo onça contrai licantropia (Fort CD 31 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo onça muda de forma, entre humanoide, híbrida ou de onça (ação completa). Na forma de onça recebe deslocamento 15m (natação 6m) e Emboscar.</p>'
    }),
    buildSpecialPower({
      name: 'Presas de Adamante',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Os ataques do licantropo onça ignoram até 10 pontos da redução de dano dos alvos.</p>'
    }),
    buildSpecialPower({
      name: 'Rasteira',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/derrubar-aprimorado.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Uma vez por rodada, quando acerta um ataque corpo a corpo, o licantropo onça pode fazer uma manobra derrubar contra o alvo (teste +34).</p>'
    }),
    buildSpecialPower({
      name: 'Voadora Feral',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/investida-destruidora.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando faz uma investida, o licantropo onça causa +1d6 pontos de dano por cada 3m que percorreu para chegar ao alvo.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo onça sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: oncaLutId,
    name: 'Licantropo Onça Lutador de Arena',
    nd: '11',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: oncaLutAtr,
    attributes: {
      cd: 31,
      pv: { value: 530, max: 530 },
      pm: { value: 0, max: 0 },
      defesa: { value: 40, base: 37 } // 40 - 3 = 37
    },
    resistencias: oncaLutTracos,
    resistenciasTexto: 'evasão, redução de dano 5/mitral',
    pericias: oncaLutSkills,
    items: oncaLutItems,
    ataquescac: 'Ataque desarmado x2 +34 (4d10+20, 19/x3) ou garras e mordida.',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A jaula abriu. Vocês têm dez segundos para tentar me derrubar antes que eu arranque suas cabeças.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Maranhão, o Campeão do Fosso</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Ele não luta como um animal descontrolado; sua postura é marcial e precisa. Quando une a técnica desarmada à mandíbula de onça, o estrago é descomunal."<br><span style="font-weight: bold; color: #006400;">&mdash; Gladiador Veterano de Tiberus</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Onça Lutador de Arena</span> (ND 11) é um pugilista supremo de 530 PV que canaliza a maldição através do foco marcial absoluto, quebrando ossos com voadoras e garras de adamante.</p>'
  });

  // =========================================================================
  // 7. LICANTROPO TEXUGO FURIOSO (ND 5) - Humanoide Médio
  // =========================================================================
  const texuFurId = 'gq8232TexuFurAAA';
  console.log(`Configurando Licantropo Texugo Furioso [${texuFurId}]...`);
  const texuFurAtr = { for: 2, des: 0, con: 5, int: 0, sab: 2, car: 0 };
  const texuFurSkills = buildSkills(5, texuFurAtr, {
    inic: 4,
    perc: 6,
    fort: 17,
    refl: 5,
    vont: 11,
    ades: 4,
    atle: 6,
    luta: 17,
    sobr: 6
  }, {
    ades_texugos: { label: 'Adestramento (Texugos)', atributo: 'car', value: 9, outros: 5, treinado: true, custom: true },
    perc_subterraneo: { label: 'Percepção (Subterrâneo)', atributo: 'sab', value: 8, outros: 2, treinado: true, custom: true }
  });

  const texuFurTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const texuFurItems = [
    buildWeaponAttack({
      name: 'Machado de Guerra',
      img: 'systems/tormenta20/icons/itens/equipamentos/machado-de-guerra.webp',
      dano: '2d12+16',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Machado de guerra +17 (2d12+16 corte, x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Garras e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Duas garras x2 +17 (2d6+10 corte) e mordida +17 (2d6+10 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Texugo)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d6+16',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Texugo):</strong> Mordida +17 (4d6+16 perfuração).</p>'
    }),
    buildSpecialPower({
      name: 'Durão',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
      type: 'poder',
      actionType: 'reaction',
      description: '<p>Uma vez por rodada, se estiver em sua forma híbrida ou de texugo, quando sofre dano o licantropo texugo furioso reduz esse dano à metade.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Texugos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo pode usar Adestramento para mudar atitude e persuasão com texugos.</p>'
    }),
    buildSpecialPower({
      name: 'Fúria',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>O licantropo texugo recebe +2 em testes de ataque e em rolagens de dano. Esse efeito se encerra se ele terminar 1 rodada e não tiver atacado nem sofrido dano.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo texugo contrai licantropia (Fort CD 22 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo texugo muda de forma, entre humanoide, híbrida ou de texugo (ação completa). Na forma de texugo se torna Pequeno, recebe escalada 3m e pode usar Durão.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: texuFurId,
    name: 'Licantropo Texugo Furioso',
    nd: '5',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (anão)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: texuFurAtr,
    attributes: {
      pv: { value: 205, max: 205 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 23 } // 23 - 0 = 23
    },
    resistencias: texuFurTracos,
    resistenciasTexto: 'redução de dano 5/mitral',
    pericias: texuFurSkills,
    items: texuFurItems,
    ataquescac: 'Machado de guerra +17 (2d12+16, x3) ou garras e mordida.',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*GRRR-KRAAA! Vocês chamam de maldição, nós chamamos de sangue forte!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Barba-de-Ferro, Guerreiro Totêmico</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um anão bárbaro que abraçou o espírito furioso do texugo das montanhas. Quanto mais você bate nele, mais feroz ele fica."<br><span style="font-weight: bold; color: #006400;">&mdash; Patrulheiro dos Montes Uivantes</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Texugo Furioso</span> (ND 5) é um guerreiro totêmico obstinado que reduz danos à metade com sua casca de Durão e desfere golpes esmagadores com machados de duas mãos.</p>'
  });

  // =========================================================================
  // 8. LICANTROPO TEXUGO SERVO DA NOITE (ND 8) - Conjurador (4 Magias)
  // =========================================================================
  const texuNoiId = 'gq8232TexuNoiAAA';
  console.log(`Configurando Licantropo Texugo Servo da Noite [${texuNoiId}]...`);
  const texuNoiAtr = { for: -1, des: 4, con: 1, int: 1, sab: 5, car: 2 };
  const texuNoiSkills = buildSkills(8, texuNoiAtr, {
    inic: 12,
    perc: 13,
    fort: 8,
    refl: 15,
    vont: 21,
    ades: 10,
    atle: 12,
    enga: 12,
    luta: 24,
    mist: 9,
    reli: 13,
    sobr: 15
  }, {
    ades_texugos: { label: 'Adestramento (Texugos)', atributo: 'car', value: 15, outros: 5, treinado: true, custom: true }
  });

  const texuNoiTracos = buildTracos({
    tamanho: 'peq',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const texuNoiItems = [
    buildWeaponAttack({
      name: 'Clava (Forma Humanoide)',
      img: 'systems/tormenta20/icons/itens/equipamentos/tacape.webp',
      dano: '2d6+15',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Clava +24 (2d6+15 impacto).</p>'
    }),
    buildWeaponAttack({
      name: 'Duas Garras e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+15',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Duas garras x2 +24 (2d6+15 corte, 19) e mordida +17 (2d6+15, 19).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Texugo)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d8+15',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Texugo):</strong> Mordida +24 (2d8+15 perfuração, 19).</p>'
    }),
    buildSpecialPower({
      name: 'Armadura de Ossos',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
      type: 'poder',
      actionType: 'move',
      description: '<p>Gasta 2 PM para receber +2 na Defesa e em Intimidação, e redução de corte, frio e trevas 5 até o fim da cena.</p>'
    }),
    buildSpecialPower({
      name: 'Durão',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
      type: 'poder',
      actionType: 'reaction',
      description: '<p>Uma vez por rodada, se estiver em sua forma híbrida ou de texugo, quando sofre dano reduz esse dano à metade.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Texugos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo pode usar Adestramento para mudar atitude e persuasão com texugos.</p>'
    }),
    buildSpecialPower({
      name: 'Magia Natural',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo pode lançar magias e empunhar catalisadores e esotéricos em sua forma de texugo.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo texugo contrai licantropia (Fort CD 28 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo texugo muda de forma, entre humanoide, híbrida ou de texugo (ação completa). Na forma de texugo se torna Pequeno, deslocamento 12m (escalada 3m) e pode usar Durão.</p>'
    }),
    buildSpecialPower({
      name: 'Sorte Salvadora',
      img: 'systems/tormenta20/icons/poderes/concedidos/sorte-dos-loucos.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando o licantropo texugo faz um teste de resistência, ele rola dois dados e usa o melhor resultado.</p>'
    }),
    buildSpecialPower({
      name: 'Visão nas Trevas',
      img: 'systems/tormenta20/icons/magias/visao-mistica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo enxerga no escuro mesmo em magias de escuridão.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo texugo sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    }),
    // 4 Magias Individuais de Druida de Tenebra de 8º nível (CD 28, 45 PM)
    buildSpellItem({
      name: 'Armamento da Natureza',
      circulo: 2,
      tipo: 'div',
      escola: 'tra',
      execucao: 'move',
      custoPM: 8,
      alcance: 'toque',
      alvo: '1 arma',
      duracao: 'scene',
      description: '<p>Uma das armas do licantropo texugo se torna mágica e seu dano aumenta em dois passos (de 1d6 para 1d10 ou de 1d8 para 1d12) até o fim da cena.</p>'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      circulo: 1,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 8,
      alcance: 'toque',
      alvo: '1 criatura',
      duracao: 'inst',
      description: '<p>Uma criatura adjacente cura 9d8+9 PV.</p>'
    }),
    buildSpellItem({
      name: 'Miasma Mefítico',
      circulo: 2,
      tipo: 'div',
      escola: 'nec',
      execucao: 'action',
      custoPM: 7,
      alcance: 'medio',
      area: 'nuvem de 6m de raio',
      duracao: 'scene',
      resistencia: 'Fortitude parcial',
      rolls: [{ name: 'Dano', type: 'dano', parts: [['7d6', 'acido', '']] }],
      description: '<p>Uma nuvem de 6m de raio se forma em alcance médio. Criaturas na área sofrem 7d6 pontos de dano de ácido e ficam enjoadas por 1 rodada (Fort reduz à metade e evita a condição).</p>'
    }),
    buildSpellItem({
      name: 'Toque Vampírico',
      circulo: 3,
      tipo: 'div',
      escola: 'nec',
      execucao: 'action',
      custoPM: 7,
      alcance: 'toque',
      alvo: '1 criatura',
      duracao: 'inst',
      resistencia: 'Fortitude reduz à metade',
      rolls: [{ name: 'Dano', type: 'dano', parts: [['8d6', 'trevas', '']] }],
      description: '<p>O licantropo texugo faz um ataque corpo a corpo. Se acertar, além do dano normal, causa 8d6 pontos de dano de trevas (Fort reduz à metade) e recupera pontos de vida iguais à metade do dano de trevas causado.</p>'
    })
  ];

  actorsToInject.push({
    id: texuNoiId,
    name: 'Licantropo Texugo Servo da Noite',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (hynne)',
    tamanho: 'peq',
    deslocamento: '6m (4q), sem redução por terreno difícil natural',
    sentidos: 'faro, visão no escuro, visão nas trevas',
    tesouro: 'Padrão',
    atributos: texuNoiAtr,
    attributes: {
      cd: 28,
      pv: { value: 215, max: 215 },
      pm: { value: 45, max: 45 },
      defesa: { value: 29, base: 25 } // 29 - 4 = 25
    },
    resistencias: texuNoiTracos,
    resistenciasTexto: 'redução de dano 5/mitral',
    pericias: texuNoiSkills,
    items: texuNoiItems,
    ataquescac: 'Clava +24 (2d6+15) ou garras e mordida; Magias (CD 28).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A Noite protege seus filhos menores. Sob a terra cavamos nossos altares e na escuridão devoramos os tolos.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Padre Pequeno, Druida de Tenebra</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um hynne com olhar fanático que se enterra no solo macio e lança maldições necromânticas sob a forma de um texugo com presas reluzentes."<br><span style="font-weight: bold; color: #006400;">&mdash; Inquisidor da Ordem da Luz</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Texugo Servo da Noite</span> (ND 8) é um líder sacerdotal hynne devotado a Tenebra, combinando feitiços druídicos de 8º nível (45 PM, CD 28) com a resiliência implacável da forma de texugo.</p>'
  });

  // =========================================================================
  // 9. LICANTROPO SELAKO FAREJADOR DE SANGUE (ND 3) - Humanoide Médio
  // =========================================================================
  const selaFarId = 'gq8232SelaFarAAA';
  console.log(`Configurando Licantropo Selako Farejador de Sangue [${selaFarId}]...`);
  const selaFarAtr = { for: 3, des: 3, con: 2, int: 0, sab: 1, car: -1 };
  const selaFarSkills = buildSkills(3, selaFarAtr, {
    inic: 4,
    perc: 4,
    fort: 15,
    refl: 10,
    vont: 2,
    ades: 2,
    atle: 6,
    inti: 2,
    luta: 14,
    pont: 14
  }, {
    ades_selakos: { label: 'Adestramento (Selakos)', atributo: 'car', value: 7, outros: 5, treinado: true, custom: true }
  });

  const selaFarTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    excecoes: { dano: 0 }
  });

  const selaFarItems = [
    buildWeaponAttack({
      name: 'Lança (Forma Humanoide)',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '1d6+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Lança x2 +14 (1d6+3 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Lança e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d10+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Lança +14 (1d6+3), garra +14 (1d6+3) e mordida +14 (1d10+3, x3) ou duas garras +14 e mordida +14.</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Selako)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d10+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Selako):</strong> Mordida +14 (2d10+10 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Azagaia',
      img: 'systems/tormenta20/icons/armas/azagaia.webp',
      dano: '1d6+3',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      alcance: 'curto',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Azagaia +14 (1d6+3 perfuração, alcance curto).</p>'
    }),
    buildSpecialPower({
      name: 'Dentes Afiados',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando o licantropo selako farejador de sangue faz um acerto crítico contra uma criatura com sua mordida, a vítima fica sangrando.</p>'
    }),
    buildSpecialPower({
      name: 'Faro do Selako',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako não fica desprevenido contra inimigos que estejam sangrando.</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Selakos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako pode usar Adestramento para mudar atitude e persuasão com selakos.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo selako contrai licantropia (Fort CD 17 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo selako muda de forma, entre humanoide, híbrida ou de selako (ação completa). Na forma híbrida se torna Grande (natação 9m); na forma de selako se torna Grande com natação 18m.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: selaFarId,
    name: 'Licantropo Selako Farejador de Sangue',
    nd: '3',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q), natação 9m',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Padrão',
    atributos: selaFarAtr,
    attributes: {
      pv: { value: 115, max: 115 },
      pm: { value: 0, max: 0 },
      defesa: { value: 21, base: 18 } // 21 - 3 = 18
    },
    resistencias: selaFarTracos,
    resistenciasTexto: 'redução de dano 5/mitral',
    pericias: selaFarSkills,
    items: selaFarItems,
    ataquescac: 'Lança x2 +14 (1d6+3) ou garras e mordida.',
    ataquesad: 'Azagaia +14 (1d6+3).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O Mar do Dragão-Rei cobra seu tributo em carne. Uma gota de sangue na água basta para selar seu destino.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Bocarra Negra, Selako de Khubar</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Pele cinzenta e mãos palmadas com dentes em fileiras duplas. Nadam mais rápido que qualquer barco e atacam em frenesi quando sentem sangue."<br><span style="font-weight: bold; color: #006400;">&mdash; Pescador de Khubar</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Selako Farejador de Sangue</span> (ND 3) é o predador marinho do Arquipélago de Khubar, infectado pela selvageria de Megalokk para caçar tripulações em mar aberto.</p>'
  });

  // =========================================================================
  // 10. LICANTROPO SELAKO TERROR DOS MARES (ND 9) - Humanoide Médio
  // =========================================================================
  const selaTerId = 'gq8232SelaTerAAA';
  console.log(`Configurando Licantropo Selako Terror dos Mares [${selaTerId}]...`);
  const selaTerAtr = { for: 4, des: 4, con: 3, int: 0, sab: 2, car: 0 };
  const selaTerSkills = buildSkills(9, selaTerAtr, {
    inic: 4,
    perc: 4,
    fort: 20,
    refl: 15,
    vont: 10,
    ades: 8,
    atle: 12,
    furt: 10,
    inti: 8,
    luta: 27,
    pont: 27,
    sobr: 10
  }, {
    ades_selakos: { label: 'Adestramento (Selakos)', atributo: 'car', value: 13, outros: 5, treinado: true, custom: true },
    furt_hibrida: { label: 'Furtividade (Forma Híbrida/Fera)', atributo: 'des', value: 8, outros: -2, treinado: true, custom: true },
    sobr_agua: { label: 'Sobrevivência (Embaixo d’água)', atributo: 'sab', value: 12, outros: 2, treinado: true, custom: true }
  });

  const selaTerTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5, corte: 5 },
    excecoes: { dano: 0 }
  });

  const selaTerItems = [
    buildWeaponAttack({
      name: 'Tridente (Forma Humanoide)',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '2d6+17',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo (Forma Humanoide):</strong> Tridente x2 +27 (2d6+17 perfuração, x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Tridente, Garra e Mordida (Forma Híbrida)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d10+17',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural (Forma Híbrida):</strong> Tridente +27 (2d6+17, x3), garra +27 (2d6+17) e mordida +27 (2d10+17, x3) ou duas garras +27 e mordida +27.</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida (Forma de Selako)',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d10+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (Forma de Selako):</strong> Mordida +27 (2d10+10 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Azagaia',
      img: 'systems/tormenta20/icons/armas/azagaia.webp',
      dano: '2d6+17',
      tipoDano: 'perfuração',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      alcance: 'curto',
      proposito: 'tiro',
      description: '<p><strong>Ataque à Distância:</strong> Azagaia +27 (2d6+17 perfuração, alcance curto).</p>'
    }),
    buildSpecialPower({
      name: 'Caçador Submarino',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando faz um teste de perícia (exceto testes de ataque) em um terreno aquático, o licantropo selako terror dos mares rola dois dados e usa o melhor resultado.</p>'
    }),
    buildSpecialPower({
      name: 'Dentes Afiados',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Os ataques de mordida do licantropo selako ignoram 5 pontos de redução de dano. Além disso, quando faz um acerto crítico com sua mordida contra uma criatura, a vítima fica sangrando.</p>'
    }),
    buildSpecialPower({
      name: 'Destruidor',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako causa dano dobrado contra objetos. Além disso, quando faz um acerto crítico, pode fazer uma manobra quebrar como uma ação livre (teste +31).</p>'
    }),
    buildSpecialPower({
      name: 'Empatia com Selakos',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako pode usar Adestramento para mudar atitude e persuasão com selakos.</p>'
    }),
    buildSpecialPower({
      name: 'Faro do Selako',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako não fica desprevenido contra inimigos que estejam sangrando.</p>'
    }),
    buildSpecialPower({
      name: 'Fúria Feral',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Em combate subaquático ou contra presas feridas, recebe +2 em testes de ataque e rolagens de dano.</p>'
    }),
    buildSpecialPower({
      name: 'Maldição da Licantropia',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Um humanoide que sofra dano da mordida do licantropo selako contrai licantropia (Fort CD 27 evita; veja o quadro).</p>'
    }),
    buildSpecialPower({
      name: 'Mudança de Forma',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O licantropo selako muda de forma, entre humanoide, híbrida ou de selako (ação completa). Na forma híbrida se torna Grande (natação 9m); na forma de selako se torna Grande com natação 18m.</p>'
    }),
    buildSpecialPower({
      name: 'Aversão a Mitral',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O licantropo selako sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
    })
  ];

  actorsToInject.push({
    id: selaTerId,
    name: 'Licantropo Selako Terror dos Mares',
    nd: '9',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (elfo-do-mar)',
    tamanho: 'med',
    deslocamento: '9m (6q), natação 9m',
    sentidos: 'faro, percepção às cegas (apenas embaixo d’água), visão no escuro',
    tesouro: 'Padrão',
    atributos: selaTerAtr,
    attributes: {
      cd: 27,
      pv: { value: 115, max: 115 },
      pm: { value: 0, max: 0 },
      defesa: { value: 34, base: 30 } // 34 - 4 = 30
    },
    resistencias: selaTerTracos,
    resistenciasTexto: 'redução de corte 5, redução de dano 5/mitral',
    pericias: selaTerSkills,
    items: selaTerItems,
    ataquescac: 'Tridente x2 +27 (2d6+17, x3) ou mordida e garras.',
    ataquesad: 'Azagaia +27 (2d6+17).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Nenhum navio de madeira resiste às minhas mandíbulas. Vocês afundam comigo.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Maré-Rubra, o Devorador de Naus</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um elfo-do-mar renegado que abraçou a ferocidade de Megalokk. Abre rombos no casco de caravelas mercantes com tridente e presas."<br><span style="font-weight: bold; color: #006400;">&mdash; Almirante da Frota de Khubar</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Licantropo Selako Terror dos Mares</span> (ND 9) é um predador submarino formidável que comanda cardumes e afunda embarcações inteiras nas rotas costeiras de Arton.</p>'
  });

  // =========================================================================
  // 11. MAMÃE GLOP (ND 2) - Monstro Grande
  // =========================================================================
  const mamaeGlopId = 'gq8232MamaeGlopA';
  console.log(`Configurando Mamãe Glop [${mamaeGlopId}]...`);
  const mamaeGlopAtr = { for: 2, des: -1, con: 2, int: -5, sab: -5, car: -5 };
  const mamaeGlopSkills = buildSkills(2, mamaeGlopAtr, {
    inic: 3,
    perc: -3,
    fort: 6,
    refl: 3,
    vont: -3,
    luta: 6
  });

  const mamaeGlopTracos = buildTracos({
    tamanho: 'grd',
    imunidadesDano: ['acido']
  });

  const mamaeGlopItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '1d6+2',
      tipoDano: 'impacto',
      danoExtra: '1d6',
      tipoDanoExtra: 'acido',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Pancada +6 (1d6+2 impacto mais 1d6 ácido).</p>'
    }),
    buildSpecialPower({
      name: 'Glops Filhinhos',
      img: 'systems/tormenta20/icons/ameacas/glop.png',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A mamãe glop está sempre acompanhada por 1d4 glops (Tormenta20, p. 286), que a protegem instintivamente. Esses glops (assim como aqueles gerados pela Meiose Glópica) não rendem pontos de experiência ao grupo.</p>'
    }),
    buildSpecialPower({
      name: 'Meiose Glópica',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Quando ameaçada, a mamãe pode gerar outros glops para protegê-la. No início de cada turno da mamãe, role um dado. Em um resultado par, um glop surge num espaço adjacente a ela. Ele age normalmente, no turno da mamãe, a partir da próxima rodada.</p>'
    })
  ];

  actorsToInject.push({
    id: mamaeGlopId,
    name: 'Mamãe Glop',
    nd: '2',
    papel: 'monstro',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'grd',
    deslocamento: '9m (6q)',
    sentidos: 'percepção às cegas',
    tesouro: 'Padrão',
    atributos: mamaeGlopAtr,
    attributes: {
      pv: { value: 48, max: 48 },
      pm: { value: 0, max: 0 },
      defesa: { value: 13, base: 14 } // 14 + (-1) = 13
    },
    resistencias: mamaeGlopTracos,
    resistenciasTexto: 'imunidade a ácido',
    pericias: mamaeGlopSkills,
    items: mamaeGlopItems,
    ataquescac: 'Pancada +6 (1d6+2 mais 1d6 ácido).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*GLUB-GLUB-SQUISH! &mdash; Uma massa gelatinosa verde-musgo borbulha e se divide ao menor sinal de perigo.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Ecos do Pântano</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Não adianta bater nela sem fogo: a cada golpe que ela sofre, mais pequenas bolhas ácidas brotam de seu corpo."<br><span style="font-weight: bold; color: #006400;">&mdash; Guia da Floresta</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Mamãe Glop</span> (ND 2) é uma monstruosidade amórfica colossal que gera filhotes glops por meiose celular espontânea durante o combate.</p>'
  });

  // =========================================================================
  // 12. ESTIRGE (ND 1) - Monstro Minúsculo
  // =========================================================================
  const estirgeId = 'gq8232EstirgeAAA';
  console.log(`Configurando Estirge [${estirgeId}]...`);
  const estirgeAtr = { for: -4, des: 5, con: -1, int: -5, sab: 0, car: -2 };
  const estirgeSkills = buildSkills(1, estirgeAtr, {
    inic: 7,
    perc: 2,
    fort: 1,
    refl: 10,
    vont: 5,
    luta: 11
  });

  const estirgeTracos = buildTracos({
    tamanho: 'min'
  });

  const estirgeItems = [
    buildWeaponAttack({
      name: 'Probóscide',
      img: 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
      dano: '1',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Probóscide +11 (1 perfuração mais agarrar teste +21).</p>'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/constricao.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Probóscide (teste +21). Se o estirge acerta o ataque de probóscide, pode fazer a manobra agarrar como ação livre.</p>'
    }),
    buildSpecialPower({
      name: 'Chupar Sangue (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Quando agarra uma criatura, e no início de cada um de seus turnos enquanto permanecer agarrando, o estirge drena sangue como um efeito metabólico; a vítima perde 3d6 pontos de vida e ele ganha a mesma quantidade de PV temporários. Após drenar 10 pontos de vida ou mais, o estirge se solta e tenta fugir.</p>'
    }),
    buildSpecialPower({
      name: 'Sangrar',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando o estirge solta uma criatura de quem estava drenando sangue (por vontade própria ou não), a vítima fica sangrando.</p>'
    })
  ];

  actorsToInject.push({
    id: estirgeId,
    name: 'Estirge',
    nd: '1',
    papel: 'monstro',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'min',
    deslocamento: 'voo 12m (8q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum',
    atributos: estirgeAtr,
    attributes: {
      pv: { value: 9, max: 9 },
      pm: { value: 0, max: 0 },
      defesa: { value: 16, base: 11 } // 11 + 5 = 16
    },
    resistencias: estirgeTracos,
    resistenciasTexto: '',
    pericias: estirgeSkills,
    items: estirgeItems,
    ataquescac: 'Probóscide +11 (1 perfuração mais agarrar +21).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*BZZZZZ!* O zumbido agudo e rápido passa voando antes de cravar uma agulha de cartilagem no pescoço.*"<br><span style="font-weight: bold; color: #800000;">&mdash; O Terror Alado dos Bosques</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Parecem morcegos grotescos com bicos de mosquito gigante. Quando grudam, drenam o sangue até a presa desmaiar."<br><span style="font-weight: bold; color: #006400;">&mdash; Caçador de Pragas</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Estirge</span> (ND 1) é uma criatura voadora minúscula hematófaga que ataca em bandos, prendendo-se às vítimas com teste +21 de agarrar para sugar 3d6 PV.</p>'
  });

  // =========================================================================
  // 13. PERDIGUEIRO TROLL (ND 1) - Animal Médio
  // =========================================================================
  const perdTrollId = 'gq8232PerdTrollA';
  console.log(`Configurando Perdigueiro Troll [${perdTrollId}]...`);
  const perdTrollAtr = { for: 5, des: 3, con: 2, int: -4, sab: 1, car: -2 };
  const perdTrollSkills = buildSkills(1, perdTrollAtr, {
    inic: 5,
    perc: 8,
    fort: 5,
    refl: 9,
    vont: 1,
    furt: 6,
    luta: 10,
    sobr: 8
  });

  const perdTrollTracos = buildTracos({
    tamanho: 'med',
    icValue: ['atordoado', 'metamorfose']
  });

  const perdTrollItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Mordida +10 (1d6+5 perfuração mais derrubar teste +10).</p>'
    }),
    buildWeaponAttack({
      name: 'Tentáculos',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp',
      dano: '1d4+5',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Tentáculos +10 (1d4+5 impacto mais agarrar teste +10).</p>'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/constricao.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Tentáculos (teste +10). Se acertar os tentáculos, pode fazer a manobra agarrar como ação livre.</p>'
    }),
    buildSpecialPower({
      name: 'Derrubar (Livre)',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/derrubar-aprimorado.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Mordida (teste +10). Se acertar a mordida, pode fazer a manobra derrubar como ação livre.</p>'
    }),
    buildSpecialPower({
      name: 'Natureza Vegetal',
      img: 'systems/tormenta20/icons/poderes/concedidos/voz-da-natureza.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O perdigueiro é imune a atordoamento e metamorfose, mas é afetado especificamente por efeitos que afetem plantas monstruosas. No caso de magias sem teste de resistência, ele tem direito a um teste de Fortitude (CD da magia) para evitar o efeito.</p>'
    })
  ];

  actorsToInject.push({
    id: perdTrollId,
    name: 'Perdigueiro Troll',
    nd: '1',
    papel: 'monstro',
    tipoMonstro: 'ani',
    raca: 'Animal (vegetal)',
    tamanho: 'med',
    deslocamento: '15m (10q)',
    sentidos: 'faro, visão na penumbra',
    tesouro: 'Nenhum',
    atributos: perdTrollAtr,
    attributes: {
      pv: { value: 10, max: 10 },
      pm: { value: 0, max: 0 },
      defesa: { value: 17, base: 14 } // 14 + 3 = 17
    },
    resistencias: perdTrollTracos,
    resistenciasTexto: 'imunidade a atordoamento e metamorfose',
    pericias: perdTrollSkills,
    items: perdTrollItems,
    ataquescac: 'Mordida +10 (1d6+5) e tentáculos +10 (1d4+5).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Tentáculos vegetais e focinho canino escavam a terra farejando passos frescos.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Rastros da Floresta Maldita</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Cães de caça bioengenheirados pelos trolls puristas. Mordem as pernas para derrubar enquanto os cipós imobilizam o alvo."<br><span style="font-weight: bold; color: #006400;">&mdash; Guarda de Fronteira</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Perdigueiro Troll</span> (ND 1) é uma criatura híbrida animal-vegetal veloz (15m) utilizada como cão de caça implacável pelas hostes puristas.</p>'
  });

  // =========================================================================
  // 14. GINETE DE TROLL PURISTA (ND 2) - Humanoide Médio
  // =========================================================================
  const gineTrollId = 'gq8232GineTrollA';
  console.log(`Configurando Ginete de Troll Purista [${gineTrollId}]...`);
  const gineTrollAtr = { for: 3, des: 1, con: 3, int: 0, sab: -1, car: 0 };
  const gineTrollSkills = buildSkills(2, gineTrollAtr, {
    inic: 4,
    perc: 2,
    fort: 13,
    refl: 7,
    vont: 2,
    cava: 4,
    guer: 3,
    inti: 3,
    luta: 12
  });

  const gineTrollTracos = buildTracos({
    tamanho: 'med'
  });

  const gineTrollItems = [
    buildWeaponAttack({
      name: 'Lança Montada',
      img: 'systems/tormenta20/icons/armas/lanca.webp',
      dano: '2d8+8',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo Montado:</strong> Lança montada +12 (2d8+8 perfuração, x3).</p>'
    }),
    buildWeaponAttack({
      name: 'Duas Garras do Troll',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '1d6+3',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataques da Montaria:</strong> Duas garras +12 (1d6+3 corte).</p>'
    }),
    buildSpecialPower({
      name: 'Corcel Troll',
      img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O ginete de troll purista cavalga um troll treinado, um parceiro montaria Grande. Enquanto estiver montado, seu deslocamento se torna 12m, ele recebe uma ação de movimento extra (apenas para se deslocar) e os seguintes ataques (em adição à sua lança): Duas garras +12 (1d6+3 corte).</p>'
    }),
    buildSpecialPower({
      name: 'Investida Atroz',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/investida-destruidora.webp',
      type: 'poder',
      actionType: 'full',
      description: '<p>O ginete faz uma investida e ataca com sua lança montada e todos os ataques da sua montaria. Todos os ataques recebem o bônus de +2 da investida, mas devem ser feitos contra a mesma criatura.</p>'
    }),
    buildSpecialPower({
      name: 'Ódio Puro',
      img: 'systems/tormenta20/icons/poderes/ameacas/odio.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O ginete recebe +5 em testes de Vontade quando está seguindo ordens de um superior e +2 em rolagens de dano contra humanoides não humanos.</p>'
    })
  ];

  actorsToInject.push({
    id: gineTrollId,
    name: 'Ginete de Troll Purista',
    nd: '2',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: gineTrollAtr,
    attributes: {
      pv: { value: 70, max: 70 },
      pm: { value: 0, max: 0 },
      defesa: { value: 20, base: 19 } // 19 + 1 = 20
    },
    resistencias: gineTrollTracos,
    resistenciasTexto: '',
    pericias: gineTrollSkills,
    items: gineTrollItems,
    ataquescac: 'Lança montada +12 (2d8+8) e duas garras do troll +12 (1d6+3).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Pela Supremacia! Nenhuma raça inferior herdará este solo!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Soldado da Cavalaria Purista</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Montados no lombo de trolls amestrados e armados com lanças pesadas. Avançam com fanatismo cego e ódio puro a tudo que não for humano."<br><span style="font-weight: bold; color: #006400;">&mdash; Batedor élfico refugiado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ginete de Troll Purista</span> (ND 2) é um guerreiro de elite da Supremacia de Yuden que doma trolls de guerra para executar investidas devastadoras contra comunidades pacatas.</p>'
  });

  // =========================================================================
  // 15. XAMÃ FINNTROLL (ND 2) - Monstro Médio (Conjurador - 4 Magias)
  // =========================================================================
  const xamaFinntId = 'gq8232XamaFinntA';
  console.log(`Configurando Xamã Finntroll [${xamaFinntId}]...`);
  const xamaFinntAtr = { for: -1, des: 2, con: 4, int: 1, sab: 3, car: 0 };
  const xamaFinntSkills = buildSkills(2, xamaFinntAtr, {
    inic: 5,
    perc: 6,
    fort: 7,
    refl: 2,
    vont: 13,
    ades: 3,
    atle: 2,
    inti: 3,
    luta: 10,
    reli: 6
  });

  const xamaFinntTracos = buildTracos({
    tamanho: 'med',
    icValue: ['atordoado', 'metamorfose']
  });

  const xamaFinntItems = [
    buildWeaponAttack({
      name: 'Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '1d6+3',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Garras x2 +10 (1d6+3 corte).</p>'
    }),
    buildSpecialPower({
      name: 'Natureza Vegetal',
      img: 'systems/tormenta20/icons/poderes/concedidos/voz-da-natureza.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O xamã finntroll é imune a atordoamento e metamorfose, mas é afetado especificamente por efeitos que afetem plantas monstruosas. No caso de magias sem teste de resistência, ele tem direito a um teste de Fortitude (CD da magia) para evitar o efeito.</p>'
    }),
    buildSpecialPower({
      name: 'Urro Divino',
      img: 'systems/tormenta20/icons/poderes/ameacas/furia.webp',
      type: 'poder',
      actionType: 'free',
      custo: 1,
      description: '<p>Quando faz um ataque ou lança uma magia, o xamã finntroll soma sua Constituição (+4) às rolagens de dano desse ataque ou magia (1 PM).</p>'
    }),
    buildSpecialPower({
      name: 'Intolerância a Luz',
      img: 'systems/tormenta20/icons/poderes/ameacas/luz.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Quando exposto à luz do sol ou similar, o finntroll fica ofuscado e não consegue usar sua cura acelerada.</p>'
    }),
    // 4 Magias Individuais de Clérigo de Megalokk de 2º nível (CD 18, 13 PM)
    buildSpellItem({
      name: 'Amedrontar',
      circulo: 1,
      tipo: 'div',
      escola: 'nec',
      execucao: 'action',
      custoPM: 1,
      alcance: 'curto',
      alvo: '1 animal ou humanoide',
      duracao: 'scene',
      resistencia: 'Vontade parcial',
      description: '<p>Um animal ou humanoide em alcance curto fica apavorado por 1 rodada e depois abalado pelo resto da cena (Vontade CD 18 evita).</p>'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      circulo: 1,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 2,
      alcance: 'toque',
      alvo: '1 criatura',
      duracao: 'inst',
      description: '<p>Uma criatura adjacente cura 3d8+3 PV.</p>'
    }),
    buildSpellItem({
      name: 'Escudo da Fé',
      circulo: 1,
      tipo: 'div',
      escola: 'abj',
      execucao: 'reaction',
      custoPM: 1,
      alcance: 'curto',
      alvo: '1 criatura',
      duracao: 'round',
      description: '<p>Quando uma criatura em alcance curto sofre um ataque, ela recebe +2 na Defesa até seu próximo turno.</p>'
    }),
    buildSpellItem({
      name: 'Perdição',
      circulo: 1,
      tipo: 'div',
      escola: 'nec',
      execucao: 'action',
      custoPM: 1,
      alcance: 'curto',
      alvo: 'criaturas escolhidas',
      duracao: 'scene',
      description: '<p>Criaturas escolhidas em alcance curto sofrem –1 em testes de ataque e rolagens de dano até o fim da cena.</p>'
    })
  ];

  actorsToInject.push({
    id: xamaFinntId,
    name: 'Xamã Finntroll',
    nd: '2',
    papel: 'padrao',
    tipoMonstro: 'mon',
    raca: 'Monstro (finntroll)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: xamaFinntAtr,
    attributes: {
      cd: 18,
      pv: { value: 50, max: 50 },
      pm: { value: 13, max: 13 },
      defesa: { value: 17, base: 15 } // 17 - 2 = 15
    },
    resistencias: xamaFinntTracos,
    resistenciasTexto: 'cura acelerada 5/ácido ou fogo, imunidade a atordoamento e metamorfose',
    pericias: xamaFinntSkills,
    items: xamaFinntItems,
    ataquescac: 'Garras x2 +10 (1d6+3) e Magias (CD 18).',
    biography: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Megalokk desperta as raízes podres! Que o sangue de vocês alimente a floresta!*"<br><span style="font-weight: bold; color: #800000;">&mdash; O Sacerdote dos Pântanos Finntroll</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Ele ergue totens de ossos e entoa cânticos guturais que curam seus monstros e paralisam nossos guerreiros com pavor divino."<br><span style="font-weight: bold; color: #006400;">&mdash; Clérigo de Lena</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Xamã Finntroll</span> (ND 2) é um clérigo tribal vegetal devotado a Megalokk (13 PM, CD 18), empoderando montarias puristas com feitiços divinos e regenerando-se com cura acelerada 5.</p>'
  });

  // =========================================================================
  // PROCESSAMENTO E GRAVAÇÃO NO LEVELDB
  // =========================================================================
  console.log('\nGravando documentos no LevelDB...');

  for (const actor of actorsToInject) {
    for await (const [k] of db.iterator({ gte: `!actors.items!${actor.id}.`, lte: `!actors.items!${actor.id}.\uffff` })) {
      await db.del(k);
    }

    const built = buildNpcActor({
      id: actor.id,
      name: actor.name,
      folder: FOLDER_DB,
      nd: actor.nd,
      papel: actor.papel,
      tipoMonstro: actor.tipoMonstro,
      raca: actor.raca,
      tamanho: actor.tamanho,
      deslocamento: actor.deslocamento,
      sentidos: actor.sentidos,
      tesouro: actor.tesouro,
      atributos: actor.atributos,
      attributes: actor.attributes,
      resistencias: actor.resistencias,
      resistenciasTexto: actor.resistenciasTexto,
      pericias: actor.pericias,
      items: actor.items,
      ataquescac: actor.ataquescac,
      ataquesad: actor.ataquesad,
      biography: actor.biography
    });

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${actor.name} (ND ${actor.nd})" salvo com ${built.embeddedDocs.length} subdocumentos.`);
  }

  await db.close();
  console.log(`\n🎉 15 Ameaças Auditadas da DB #232 injetadas com 100% de sucesso em Ameacas_T20!`);
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('❌ Erro na injeção de ameaças DB #232:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

#!/usr/bin/env node
/**
 * Reconstrução Canônica das Ameaças da DB #227 em Ameacas_T20
 * Conteúdo: Lynel ND 12, Oxxdon ND 2, Enxame de Armas ND 4, Tropa de Mortos ND 5, Inumano ND 6
 *
 * Padrão Canônico:
 * 1. Descrições e biografias 100% integrais dos PDFs oficiais.
 * 2. ActiveEffects nos poderes e ataques com arquitetura canônica de subdocumentos.
 * 3. Sincronização em packs/Ameacas_T20 e src/packs/Ameacas_T20/.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  buildSkills,
  buildTracos,
  saveToSourcePacks
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const FOLDER_DB = 'wfWApuyngzFm4KOP';

async function rebuildDB227Threats() {
  console.log('=== Reconstruindo Ameaças da Dragão Brasil #227 em Ameacas_T20 ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // 1. Remover duplicata de Oxxdon se existir
  try {
    await db.del('!actors!LN8RlwsnDhqnpdLg');
    for await (const [key] of db.iterator()) {
      if (key.startsWith('!actors.items!LN8RlwsnDhqnpdLg.')) {
        await db.del(key);
      }
    }
  } catch {}

  // -------------------------------------------------------------
  // 1. LYNEL (ND 12, Chefe de Fase) - Monstro Enorme (3x3)
  // -------------------------------------------------------------
  const lynelId = '6jcy63pS6TLhCoHm';
  console.log(`Atualizando Lynel [${lynelId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${lynelId}.`)) {
      await db.del(key);
    }
  }

  const lynelSkills = buildSkills(12, { for: 10, des: 8, con: 8, int: -1, sab: 5, car: -2 }, {
    inic: 18,
    perc: 16,
    atle: 22,
    inti: 14,
    sobr: 20,
    fort: 26,
    refl: 20,
    vont: 12,
    luta: 36,
    pont: 32
  });

  const lynelTracos = buildTracos({
    tamanho: 'eno',
    resistencias: {
      acido: 10,
      eletricidade: 10,
      fogo: 10,
      frio: 10
    },
    idiomasValue: []
  });

  const lynelBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*ROAAAR!* &mdash; O rugido faz as pedras tremerem e os próprios pássaros caírem dos galhos antes mesmo da investida começar."<br><span style="font-weight: bold; color: #800000;">&mdash; Rugido do Lynel</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Quem vê um centauro-leão à distância pensa que é só mais uma fera. Erro fatal! O desgraçado troca de arma no meio da luta, saca um arco com precisão de mestre e ainda cospe fogo como um dragão adulto! Se você avistar um nos descampados, dê meia-volta devagar e reze para que ele não se sinta territorial."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Lynel</span> é um monstro enorme e formidável que combina a imponência de um centauro blindado com a cabeça e ferocidade de um leão predador. Espremendo inteligência marcial tática em um corpo de puro músculo, é um chefe de fase devastador capaz de aniquilar grupos inteiros com suas quatro armas colossais e sopro de chamas incandescentes.</p>`;

  const lynelItems = [
    buildWeaponAttack({
      name: 'Espada Bastarda e Escudo Lynel',
      img: 'icons/weapons/swords/sword-broad-crystal.webp',
      dano: '5d10+27',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d10+27, 19/x3 corte. Uma vez por rodada, ao acertar um alvo, o Lynel pode fazer uma manobra de combate como ação livre com ele (teste +36).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Manobra Livre no Acerto',
          description: 'Uma vez por rodada, ao acertar um alvo, pode fazer uma manobra de combate como ação livre (teste +36).',
          transfer: true
        }
      ]
    }),
    buildWeaponAttack({
      name: 'Alabarda Lynel',
      img: 'icons/weapons/polearms/halberd-crescent.webp',
      dano: '5d10+27',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 4,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d10+27, x4 corte. Quando acerta um ataque, o alvo é empurrado 3m na direção oposta ao Lynel e fica caído (Fortitude ou Reflexos DT 33 evita).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Empurrão e Queda (3m)',
          description: 'Quando acerta um ataque, o alvo é empurrado 3m e fica caído (Fort ou Ref CD 33 evita).',
          transfer: true
        }
      ]
    }),
    buildWeaponAttack({
      name: 'Machado de Guerra Lynel',
      img: 'icons/weapons/axes/axe-double-large.webp',
      dano: '5d12+27',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 4,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d12+27, x4 corte. Uma vez por rodada, ao acertar um ataque, o Lynel pode fazer um único ataque adicional com o machado contra outro alvo no alcance.</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Ataque Adicional no Acerto',
          description: 'Uma vez por rodada, ao acertar um ataque, pode fazer um ataque adicional contra outro alvo no alcance.',
          transfer: true
        }
      ]
    }),
    buildWeaponAttack({
      name: 'Tacape Lynel',
      img: 'icons/weapons/clubs/club-spiked-bone.webp',
      dano: '6d10+27',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 4,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 6d10+27, x4 impacto. Quando acerta um ataque, o alvo fica atordoado (Reflexos DT 33 evita).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Atordoamento no Acerto',
          description: 'Quando acerta um ataque, o alvo fica atordoado (Reflexos CD 33 evita).',
          transfer: true
        }
      ]
    }),
    buildWeaponAttack({
      name: 'Mordida',
      img: 'icons/creatures/abilities/mouth-teeth-fangs.webp',
      dano: '4d10+25',
      tipoDano: 'perfuracao',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Mordida +36 (4d10+25, 19 perfuração).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildWeaponAttack({
      name: 'Garras',
      img: 'icons/skills/melee/unarmed-punch-fist.webp',
      dano: '4d8+25',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Duas garras +36 (4d8+25, 19 corte). Caso seja desarmado, o Lynel pode continuar atacando com duas garras e sua mordida.</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildWeaponAttack({
      name: 'Arco de Guerra Lynel',
      img: 'icons/weapons/bows/shortbow-recurve-gold.webp',
      dano: '4d12+25',
      tipoDano: 'perfuracao',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>À Distância:</strong> Arco de guerra +32 x2 (4d12+25, x3 perfuração).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildSpecialPower({
      name: 'Sopro',
      img: 'icons/magic/fire/projectile-wave-arrow.webp',
      execucao: 'padrao',
      custo: 0,
      description: '<p>Todas as criaturas em um cone de 12m sofrem 14d12 pontos de dano de fogo e ficam em chamas (Reflexos CD 33 reduz o dano à metade e evita a condição). Recarga (movimento).</p>',
      flavorPhrase: '',
      flavorAction: '',
      rolls: [
        {
          name: 'Dano de Fogo',
          key: 'dano0',
          type: 'dano',
          parts: [['14d12', 'fogo', '']]
        }
      ],
      effects: [
        {
          name: 'Sopro de Fogo (Chamas CD 33)',
          description: 'Cone de 12m causa 14d12 fogo e chamas (Reflexos CD 33 reduz metade e evita).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Brado Indomável',
      img: 'icons/magic/sonic/scream-wail-shout-red.webp',
      execucao: 'padrao',
      custo: 0,
      description: '<p>Se o Lynel ainda não tiver sido alvo da ação agredir, ele emite um rugido ameaçador que deixa todos os oponentes em alcance curto apavorados por 1d4+1 rodadas (Vontade CD 33 muda para abalado). Medo.</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Brado Indomável (Apavorado/Abalado)',
          description: 'Oponentes em alcance curto ficam apavorados 1d4+1 rodadas (Vontade CD 33 muda para abalado).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Coice Oportuno',
      img: 'icons/skills/melee/strike-kick-yellow.webp',
      execucao: 'reacao',
      custo: 0,
      description: '<p>Uma vez por rodada, quando uma criatura erra um ataque corpo a corpo contra o Lynel por 5 ou mais, ele causa 4d8+25 pontos de dano de impacto na criatura (Reflexos CD 33 evita). Se a criatura estava se beneficiando de flanquear o Lynel, ela é considerada desprevenida contra esse golpe.</p>',
      flavorPhrase: '',
      flavorAction: '',
      rolls: [
        {
          name: 'Dano de Coice',
          key: 'dano0',
          type: 'dano',
          parts: [['4d8+25', 'impacto', '']]
        }
      ],
      effects: [
        {
          name: 'Coice Oportuno',
          description: 'Reação ao erro por 5+: 4d8+25 impacto (Reflexos CD 33 evita; desprevenido se flanqueava).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Investida Galopante',
      img: 'icons/skills/movement/horse-running-charging-flame.webp',
      execucao: 'completa',
      custo: 0,
      description: '<p>O Lynel faz uma investida. Ele pode passar pelo espaço ocupado por criaturas menores que ele, pode continuar se movendo depois do ataque e, se acertar, causa +4d10 pontos de dano. Criaturas no caminho percorrido pelo Lynel sofrem 1d12+10 pontos de dano de impacto e ficam caídas (Reflexos CD 33 evita).</p>',
      flavorPhrase: '',
      flavorAction: '',
      rolls: [
        {
          name: 'Dano de Atropelamento',
          key: 'dano0',
          type: 'dano',
          parts: [['1d12+10', 'impacto', '']]
        }
      ],
      effects: [
        {
          name: 'Investida Galopante (+4d10 Dano / Atropelamento)',
          description: '+4d10 dano na investida; criaturas no caminho sofrem 1d12+10 impacto e ficam caídas (Ref CD 33 evita).',
          transfer: true
        }
      ]
    })
  ];

  const lynel = buildNpcActor({
    id: lynelId,
    name: 'Lynel',
    nd: '12',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'eno',
    folder: FOLDER_DB,
    deslocamento: '15m (10q)',
    sentidos: 'faro, visão na penumbra',
    tesouro: 'Metade',
    atributos: { for: 10, des: 8, con: 8, int: -1, sab: 5, car: -2 },
    attributes: {
      cd: 33,
      pv: { value: 600, max: 600 },
      pm: { value: 0, max: 0 },
      defesa: { value: 43, base: 35 } // 35 + 8 = 43
    },
    resistencias: lynelTracos,
    resistenciasTexto: 'redução de ácido, eletricidade, fogo e frio 10',
    pericias: lynelSkills,
    items: lynelItems,
    ataquescac: 'Armamento Lynel x2 +36 e Mordida +36 (4d10+25, 19).',
    ataquesad: 'Arco de guerra +32 x2 (4d12+25, x3).',
    biography: lynelBio
  });

  await db.put(`!actors!${lynelId}`, lynel.actorDoc);
  for (const ed of lynel.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', lynel.actorDoc, lynel.embeddedDocs);
  console.log(`✓ Ator "Lynel (ND 12)" salvo com ${lynel.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 2. OXXDON (ND 2) - Monstro Médio
  // -------------------------------------------------------------
  const oxxdonId = 'KnUyjOaSBfGcl48v';
  console.log(`Atualizando Oxxdon [${oxxdonId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${oxxdonId}.`)) {
      await db.del(key);
    }
  }

  const oxxdonSkills = buildSkills(2, { for: 0, des: 4, con: 2, int: -4, sab: 1, car: -1 }, {
    inic: 7,
    perc: 4,
    fort: 7,
    refl: 13,
    vont: 2,
    luta: 12
  });

  const oxxdonTracos = buildTracos({
    tamanho: 'med',
    resistencias: {},
    idiomasValue: []
  });

  const oxxdonBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*TZZZZT!* &mdash; O estalo cáustico de aço temperado dissolvendo-se em ferrugem instantânea."<br><span style="font-weight: bold; color: #800000;">&mdash; O som do desarmamento</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Minha picareta favorita virou pó marrom em menos de dois segundos! Essas toupeiras carnívoras não se importam com o seu escudo de adamante; para elas, metal é só aperitivo crocante. Levem porretes de madeira ou fiquem sem espada."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Oxxdon</span> é uma criatura subterrânea bizarra e temida por qualquer aventureiro dependente de equipamentos metálicos. Suas antenas liberam secreções catalíticas capazes de oxidar instantaneamente armas, armaduras e até membros de golens, reduzindo ferro e aço a cascalho podre em segundos.</p>`;

  const oxxdonItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'icons/creatures/abilities/mouth-teeth-fangs.webp',
      dano: '1d8+10',
      tipoDano: 'perfuracao',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Mordida +12 (1d8+10 perfuração).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildWeaponAttack({
      name: 'Antena',
      img: 'icons/creatures/tentacles/tentacle-glowing-green.webp',
      dano: '0',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Antena +12 (ferrugem).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildSpecialPower({
      name: 'Ferrugem',
      img: 'icons/commodities/materials/ore-chunk-rust.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>A antena do oxxdon destrói automaticamente qualquer objeto de metal atingido. Uma arma de metal que cause dano a um oxxdon também é destruída imediatamente (itens mágicos têm direito a um teste de Fortitude contra CD 16 para evitar). Contra criaturas de metal (como golens), a antena deixa o alvo fatigado, então exausto, então paralisado (mesmo que seja imune a estas condições; Fort CD 16 evita). Remover cada uma destas condições da criatura exige uma hora de trabalho, o gasto de T$ 50 em materiais e passar em um teste de Ofício (artesão) contra CD 20.</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Ferrugem (Destruição de Metal / Condições em Golens)',
          description: 'Destrói objetos de metal atingidos; em criaturas de metal, causa fatigado/exausto/paralisado (Fort CD 16 evita).',
          transfer: true
        }
      ]
    })
  ];

  const oxxdon = buildNpcActor({
    id: oxxdonId,
    name: 'Oxxdon',
    nd: '2',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'med',
    folder: FOLDER_DB,
    deslocamento: '12m (8q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 0, des: 4, con: 2, int: -4, sab: 1, car: -1 },
    attributes: {
      cd: 16,
      pv: { value: 72, max: 72 },
      pm: { value: 0, max: 0 },
      defesa: { value: 20, base: 16 } // 16 + 4 = 20
    },
    resistencias: oxxdonTracos,
    resistenciasTexto: 'ferrugem (destrói metal)',
    pericias: oxxdonSkills,
    items: oxxdonItems,
    ataquescac: 'Antena +12 (ferrugem) e mordida +12 (1d8+10).',
    biography: oxxdonBio
  });

  await db.put(`!actors!${oxxdonId}`, oxxdon.actorDoc);
  for (const ed of oxxdon.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', oxxdon.actorDoc, oxxdon.embeddedDocs);
  console.log(`✓ Ator "Oxxdon (ND 2)" salvo com ${oxxdon.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 3. ENXAME DE ARMAS (ND 4) - Construto Grande (2x2)
  // -------------------------------------------------------------
  const enxameId = 'XEdZUz2ETKvxvjZH';
  console.log(`Atualizando Enxame de Armas [${enxameId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${enxameId}.`)) {
      await db.del(key);
    }
  }

  const enxameSkills = buildSkills(4, { for: 4, des: 2, con: 2, int: 0, sab: 0, car: -5 }, {
    inic: 6,
    perc: 4,
    fort: 15,
    refl: 10,
    vont: 5,
    luta: 16
  });

  const enxameTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { dano: 5 },
    icValue: ['manobra'],
    idiomasValue: []
  });

  const enxameBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CLANG! CLANG! SWISH!* &mdash; Dezenas de lâminas dançam no ar sem empunhaduras, guiadas pelo ódio ancestral da guerra."<br><span style="font-weight: bold; color: #800000;">&mdash; Tempestade de Aço</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Entrar em uma sala tomada por um enxame desses é como pular de cabeça dentro de um moedor de carne com lâminas voadoras. Flechas e estocadas passam direto pelo meio deles. A única salvação é fogo em área ou correr até a porta mais espessa."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Enxame de Armas</span> é um construto bando animado por magias arcanas antigas ou pela impregnação de espíritos de guerreiros caídos. Formado por dezenas de espadas, lanças, machados e adagas que flutuam em sincronia, dilacera quem cruza seu caminho enquanto apara ataques inimigos com coordenação mecânica perfeita.</p>`;

  const enxameItems = [
    buildSpecialPower({
      name: 'Enxame',
      img: 'icons/skills/melee/weapons-crossed-swords-yellow.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O enxame de armas é um aglomerado de objetos animados que agem em conjunto. Ele pode entrar no espaço ocupado por um personagem e, no fim de seu turno, causa 1d10 pontos de dano de corte, 1d6 pontos de dano de perfuração e 1d8 pontos de dano de impacto a qualquer personagem em seu espaço, automaticamente. O enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofrem 50% a mais de dano de efeitos de área, como Bola de Fogo. Além disso, sofre apenas metade do dano de ataques com armas. Estar dentro do enxame conta como condição ruim para lançar magias.</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Enxame de Armas (Dano em Área por Turno)',
          description: 'Causa 1d10 corte, 1d6 perfuração e 1d8 impacto no fim do turno a criaturas no mesmo espaço.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Aparar',
      img: 'icons/skills/melee/shield-block-blade-yellow.webp',
      execucao: 'reacao',
      custo: 0,
      description: '<p>Uma vez por rodada, quando é alvo de um ataque corpo a corpo, o enxame de arma pode fazer um teste de ataque e subtrair seu resultado do dano causado pelo ataque (teste +16).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Aparar Reativo',
          description: 'Uma vez por rodada, reage com teste de ataque (+16) subtraindo o resultado do dano recebido.',
          transfer: true
        }
      ]
    })
  ];

  const enxame = buildNpcActor({
    id: enxameId,
    name: 'Enxame de Armas',
    nd: '4',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: 'voo 9m (6q)',
    sentidos: 'percepção às cegas',
    tesouro: 'Dobro (apenas armas)',
    atributos: { for: 4, des: 2, con: 2, int: 0, sab: 0, car: -5 },
    attributes: {
      cd: 0,
      pv: { value: 140, max: 140 },
      pm: { value: 0, max: 0 },
      defesa: { value: 22, base: 20 } // 20 + 2 = 22
    },
    resistencias: enxameTracos,
    resistenciasTexto: 'redução de dano 5, imunidade a manobras e efeitos de alvo único',
    pericias: enxameSkills,
    items: enxameItems,
    ataquescac: 'Enxame (1d10 corte + 1d6 perfuração + 1d8 impacto).',
    biography: enxameBio
  });

  await db.put(`!actors!${enxameId}`, enxame.actorDoc);
  for (const ed of enxame.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', enxame.actorDoc, enxame.embeddedDocs);
  console.log(`✓ Ator "Enxame de Armas (ND 4)" salvo com ${enxame.actorDoc.items.length} poderes embutidos.`);

  // -------------------------------------------------------------
  // 4. TROPA DE MORTOS (ND 5) - Morto-vivo Grande (2x2)
  // -------------------------------------------------------------
  const tropaId = 'ZB0VONjuE8XS5gmH';
  console.log(`Atualizando Tropa de Mortos [${tropaId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${tropaId}.`)) {
      await db.del(key);
    }
  }

  const tropaSkills = buildSkills(5, { for: 5, des: 3, con: 0, int: 0, sab: 0, car: -5 }, {
    inic: 9,
    perc: 5,
    fort: 6,
    refl: 11,
    vont: 16,
    luta: 20
  });

  const tropaTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { corte: 5, frio: 5, perfuracao: 5 },
    icValue: ['manobra'],
    idiomasValue: []
  });

  const tropaBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*CLAC-CLAC-CLAC!* &mdash; O bater sincrônico de centenas de ossos descalços avançando em formação de falange implacável."<br><span style="font-weight: bold; color: #800000;">&mdash; Marcha dos Esquecidos</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Um esqueleto sozinho é piada de taverna. Trinta deles marchando ombro a ombro com escudos trancados e espadas afiadas é pesadelo de general. Se você tentar quebrar a linha de frente deles sem apoio pesado, a tropa simplesmente passa por cima como um rolo compressor de cálcio."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A <span style="color: #800000; font-weight: bold;">Tropa de Mortos</span> representa uma unidade militar inteira de esqueletos de infantaria preservada pelo poder necromântico. Lutando com a rígida disciplina de uma falange ancestral, seus ataques combinados causam dano estarrecedor e sua massa compacta bloqueia investidas individuais com facilidade aterradora.</p>`;

  const tropaItems = [
    buildWeaponAttack({
      name: 'Espada Longa',
      img: 'icons/weapons/swords/sword-broad-crystal.webp',
      dano: '4d8+18',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Espada longa x2 +20 (4d8+18, 19 corte).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildSpecialPower({
      name: 'Bando',
      img: 'icons/skills/melee/weapons-crossed-swords-yellow.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>A tropa de mortos é formada por um grupo de esqueletos. Se um ataque da tropa exceder a Defesa do Inimigo por 10 ou mais, ele causa o dobro do dano. Se um ataque da tropa errar, ele ainda causa metade do dano. A falange é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área, como Bola de Fogo. Um personagem com poder Trespassar que acerte a tropa pode usá-lo para fazer um ataque adicional contra ela (mas apenas uma vez por turno).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Bando de Falange',
          description: 'Causa dano dobrado se exceder a Defesa por 10+, ou metade do dano no erro; imune a manobras.',
          transfer: true
        }
      ]
    })
  ];

  const tropa = buildNpcActor({
    id: tropaId,
    name: 'Tropa de Mortos',
    nd: '5',
    papel: 'solo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 5, des: 3, con: 0, int: 0, sab: 0, car: -5 },
    attributes: {
      cd: 0,
      pv: { value: 40, max: 40 },
      pm: { value: 0, max: 0 },
      defesa: { value: 24, base: 21 } // 21 + 3 = 24
    },
    resistencias: tropaTracos,
    resistenciasTexto: 'redução de corte, frio e perfuração 5, imunidade a manobras',
    pericias: tropaSkills,
    items: tropaItems,
    ataquescac: 'Espada longa x2 +20 (4d8+18, 19).',
    biography: tropaBio
  });

  await db.put(`!actors!${tropaId}`, tropa.actorDoc);
  for (const ed of tropa.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', tropa.actorDoc, tropa.embeddedDocs);
  console.log(`✓ Ator "Tropa de Mortos (ND 5)" salvo com ${tropa.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 5. INUMANO (ND 6) - Morto-vivo Médio
  // -------------------------------------------------------------
  const inumanoId = 'po00j60czLdn1eu5';
  console.log(`Atualizando Inumano [${inumanoId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${inumanoId}.`)) {
      await db.del(key);
    }
  }

  const inumanoSkills = buildSkills(6, { for: 3, des: 2, con: 1, int: 0, sab: 1, car: -1 }, {
    inic: 7,
    perc: 6,
    atle: 8,
    furt: 4,
    guer: 5,
    inti: 6,
    fort: 17,
    refl: 12,
    vont: 7,
    luta: 24,
    pont: 24
  });

  const inumanoTracos = buildTracos({
    tamanho: 'med',
    resistencias: {},
    imunidadesDano: ['frio'],
    idiomasValue: []
  });

  const inumanoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"Malditos... Me entreguem esta arma! Ela é minha por direito... E vocês não são merecedores de tocá-la!"<br><span style="font-weight: bold; color: #800000;">&mdash; O Inumano, Guardião das Armas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Sua armadura antiga estava comida pela ferrugem e o rosto parecia pergaminho seco esticado sobre o crânio. Mas o golpe daquela lâmina negra... cada ferimento sugava o calor do corpo e a vontade de lutar. Um toque daquilo e você acorda como mais um lacaio sepulcral sob as ordens dele."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Inumano</span> é um comandante guerreiro morto-vivo de tempos esquecidos, imbuído de ganância e crueldade imortais. Empunhando armamentos forjados em pura energia de trevas, cada golpe certeiro drena a energia vital e a perícia dos heróis vivos, erguendo novas abominações a partir daqueles que sucumbem à sua presença pútrida.</p>`;

  const inumanoItems = [
    buildWeaponAttack({
      name: 'Espada Longa',
      img: 'icons/weapons/swords/sword-broad-crystal.webp',
      dano: '2d8+9',
      tipoDano: 'corte',
      danoExtra: '2d12',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Espada longa x2 +24 (2d8+9, 19 mais 2d12 trevas).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildWeaponAttack({
      name: 'Azagaia',
      img: 'icons/weapons/polearms/javelin-simple.webp',
      dano: '2d6+9',
      tipoDano: 'perfuracao',
      danoExtra: '2d12',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>À Distância:</strong> Azagaia +24 (2d6+9 mais 2d12 trevas).</p>',
      flavorPhrase: '',
      flavorAction: ''
    }),
    buildSpecialPower({
      name: 'Drenar Energia',
      img: 'icons/magic/death/skull-energy-purple.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Uma criatura viva que sofra dano de trevas do inumano combatente sofre uma penalidade cumulativa de −1 em testes de perícia (Fort CD 22 evita). Se acumular uma penalidade igual ou maior que seu próprio nível, a criatura morre e se transforma em um inumano sob controle do mestre. Esta penalidade pode ser removida de uma criatura viva com descanso ou com efeitos mágicos capazes de remover qualquer condição de metabolismo (cada dia de descanso ou efeito mágico diminui a penalidade em 1).</p>',
      flavorPhrase: '',
      flavorAction: '',
      effects: [
        {
          name: 'Drenar Energia (-1 Cumulativo em Perícias)',
          description: 'Causa penalidade de -1 cumulativa em testes de perícia (Fort CD 22 evita); se igual ao nível, morre e vira inumano.',
          transfer: true
        }
      ]
    })
  ];

  const inumano = buildNpcActor({
    id: inumanoId,
    name: 'Inumano',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'med',
    folder: FOLDER_DB,
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 3, des: 2, con: 1, int: 0, sab: 1, car: -1 },
    attributes: {
      cd: 22,
      pv: { value: 48, max: 48 },
      pm: { value: 0, max: 0 },
      defesa: { value: 26, base: 24 } // 24 + 2 = 26
    },
    resistencias: inumanoTracos,
    resistenciasTexto: 'imunidade a frio',
    pericias: inumanoSkills,
    items: inumanoItems,
    ataquescac: 'Espada longa x2 +24 (2d8+9, 19, mais 2d12 trevas).',
    ataquesad: 'Azagaia +24 (2d6+9, mais 2d12 trevas).',
    biography: inumanoBio
  });

  await db.put(`!actors!${inumanoId}`, inumano.actorDoc);
  for (const ed of inumano.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', inumano.actorDoc, inumano.embeddedDocs);
  console.log(`✓ Ator "Inumano (ND 6)" salvo com ${inumano.actorDoc.items.length} ataques/poderes embutidos.`);

  await db.close();
  console.log('\n✅ Sucesso: Todas as 5 ameaças da DB #227 foram reconstruídas com conformidade canônica.');
}

rebuildDB227Threats().catch(console.error);

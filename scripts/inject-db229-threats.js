#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças da DB #229 em Ameacas_T20
 *
 * Conteúdo: Breves Jornadas - O Olho do Basilisco (4 Criaturas Oficiais de 8º e 9º nível)
 * 1. Defensor Rochoso Desperto (ND 8) - Construto Médio (1x1)
 * 2. Revoada de Serpes (ND 8) - Monstro Enorme (3x3)
 * 3. Presa do Grande Basilisco (ND 3) - Humanoide Médio (1x1)
 * 4. Basilisco Ancestral (ND 9) - Monstro Enorme (3x3)
 *
 * Padrão IDÊNTICO às edições DB #226, DB #227 e DB #228:
 * - 34 Perícias calculadas dinamicamente
 * - Defesa Base Dinâmica (defesa.base = defesa.value - des)
 * - Traços com 13 tipos de dano, imunidades e tamanhos
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
  console.log('=== Injetando Ameaças da DB #229 em Ameacas_T20 (Padrão Canônico DB #227/DB #228) ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // -------------------------------------------------------------
  // 1. DEFENSOR ROCHOSO DESPERTO (ND 8) - Construto Médio (1x1)
  // -------------------------------------------------------------
  const defensorId = 'gq8KDefRoch229A';
  console.log(`Limpando e reconstruindo Defensor Rochoso Desperto [${defensorId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${defensorId}.`)) {
      await db.del(key);
    }
  }

  const defensorSkills = buildSkills(8, { for: 6, des: 0, con: 3, int: 0, sab: 0, car: -5 }, {
    inic: 8,
    perc: 8,
    fort: 20,
    refl: 9,
    vont: 15,
    luta: 26
  });

  const defensorItems = [
    buildWeaponAttack({
      name: 'Duas Pancadas',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '4d8+19',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Duas pancadas +26 (4d8+19, x3 impacto).</p>',
      flavorPhrase: '*THUUUM!* Os punhos de pedra maciça descem com o peso esmagador de um rochedo!',
      flavorAction: 'O defensor desfere um golpe esmagador com seus membros de pedra bruta'
    }),
    buildSpecialPower({
      name: 'Imobilidade',
      img: 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Um defensor rochoso pode permanecer completamente imóvel. Se ele estiver assim, um personagem deve passar num teste de Percepção (CD 35) para perceber que ele é uma criatura e não uma estátua.</p>',
      flavorPhrase: 'A criatura se petrifica em rigidez absoluta, tornando-se indistinguível de um monumento esculpido.',
      flavorAction: 'Permanece completamente imóvel camuflando-se como pedra inanimada',
      effects: [
        {
          name: 'Camuflagem Estatuária (CD 35)',
          description: 'Requer Percepção CD 35 para ser identificado como criatura viva quando imóvel.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Natureza Abascanta',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O defensor tem 50% de chance de ignorar um efeito mágico (como se fosse imune a ele), com exceção da magia <em>Despedaçar</em>.</p>',
      flavorPhrase: 'Fórmulas mágicas e raios de energia ricocheteiam na rocha encantada sem efeito!',
      flavorAction: 'As runas protetoras da pedra refratam energias arcanas e divinas',
      rolls: [
        {
          name: 'Chance Abascanta (1d100, 51-100 ignora)',
          key: 'teste0',
          type: 'formula',
          parts: [['1d100', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Natureza Abascanta (50% Evasão Mágica)',
          description: '50% de chance de ignorar qualquer efeito mágico (exceto Despedaçar).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Pancada Atordoante',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      execucao: 'passive',
      custo: 0,
      cd: 26,
      alcance: 'corpo-a-corpo',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 26 evita a condição atordoado.',
      description: '<p>Uma criatura que sofra dano da pancada do defensor rochoso desperto fica atordoada (Fort CD 26 evita). Uma criatura só pode ser atordoada por esta habilidade uma vez por cena.</p>',
      flavorPhrase: '*CRASH!* O choque reverberante na medula deixa o alvo sem ar e desnorteado!',
      flavorAction: 'O impacto estrondoso desorienta completamente o adversário',
      rolls: [
        {
          name: 'Resistência contra Atordoamento',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['fort', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Atordoado',
          description: 'A criatura fica atordoada (–5 na Defesa, desprevenida e não pode fazer ações).',
          statuses: ['atordoado'],
          duration: { rounds: 1 },
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '-5', priority: 20 }
          ],
          transfer: false
        }
      ]
    })
  ];

  const defensorTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 10 },
    ic: ['atordoado', 'petrificado'],
    idiomasValue: []
  });

  const defensorBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O silêncio da rocha aprisiona o grito de quem um dia teve carne e pulsação... mas o dever esculpido em granito não morre jamais.* &mdash; Inscrição rúnica desgastada no peitoral da estátua."<br><span style="font-weight: bold; color: #800000;">&mdash; O Defensor Rochoso de Trag’Merah</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Não confunda com autômato mundano! Há a alma confusa de um aventureiro petrificado por uma euríade dentro dessa carcaça. Sob o coração de pedra, bate a memória da vida."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Defensor Rochoso Desperto</span> é o resultado trágico da maldição ancestral das euríades, medusas monstruosas devotadas a Megalokk que habitam os picos das Montanhas Sanguinárias. Capaz de desferir pancadas devastadoras e refratar 50% de magias graças à sua natureza abascanta, esta sentinela de pedra busca desorientada uma cura nas terras ásperas da Guilda dos Caça-Monstros.</p>`;

  const defensor = buildNpcActor({
    id: defensorId,
    name: 'Defensor Rochoso Desperto',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'med',
    folder: FOLDER_DB,
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 6, des: 0, con: 3, int: 0, sab: 0, car: -5 },
    attributes: {
      cd: 26,
      pv: { value: 320, max: 320 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 33 } // 33 + 0 = 33
    },
    resistencias: defensorTracos,
    pericias: defensorSkills,
    items: defensorItems,
    ataquescac: 'Duas pancadas +26 (4d8+19, x3).',
    ataquesad: '',
    biography: defensorBio
  });

  await db.put(`!actors!${defensorId}`, defensor.actorDoc);
  for (const ed of defensor.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', defensor.actorDoc, defensor.embeddedDocs);
  console.log(`✓ Ator "Defensor Rochoso Desperto (ND 8)" salvo com ${defensor.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 2. REVOADA DE SERPES (ND 8) - Monstro Enorme (3x3)
  // -------------------------------------------------------------
  const revoadaId = 'gq8KRevSerp229A';
  console.log(`Limpando e reconstruindo Revoada de Serpes [${revoadaId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${revoadaId}.`)) {
      await db.del(key);
    }
  }

  const revoadaSkills = buildSkills(8, { for: 7, des: 1, con: 6, int: -2, sab: 1, car: -1 }, {
    inic: 9,
    perc: 9,
    fort: 15,
    refl: 21,
    vont: 8,
    luta: 26
  });

  const revoadaItems = [
    buildWeaponAttack({
      name: 'Mordida da Revoada',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d6+12',
      tipoDano: 'perfuracao',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +26 (2d6+12 perfuração, 20/x2).</p>',
      flavorPhrase: '*SKREEE-CHAAAK!* Dezenas de bicos afiados e mandíbulas reptilianas atacam em sincronia!',
      flavorAction: 'A revoada mergulha em rasante desferindo múltiplas mordidas famintas'
    }),
    buildWeaponAttack({
      name: 'Ferrão Peçonhento',
      img: 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
      dano: '1d8+12',
      tipoDano: 'perfuracao',
      danoExtra: '1d12',
      tipoDanoExtra: 'veneno',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Ferrão +26 (1d8+12 perfuração mais veneno, 20/x2).</p>',
      flavorPhrase: '*SSSHH-CLACK!* As caudas em chicote desferem ferroadas carregadas de peçonha concentrada!',
      flavorAction: 'Golpeia com as caudas farpadas injetando toxina paralisante'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'livre',
      custo: 0,
      description: '<p><strong>Ação Livre:</strong> Se a revoada de serpes acertar um ataque de mordida, pode fazer o teste de manobra agarrar como ação livre (teste Mordida +31).</p>',
      flavorPhrase: 'Garras e asas envolvem a presa suspendendo-a no ar!',
      flavorAction: 'Trava a vítima nas mandíbulas coletivas impedindo sua fuga',
      rolls: [
        {
          name: 'Manobra Agarrar (+31)',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['luta', '', ''], [5, '', '']], // 26 luta + 5 = 31
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Agarrado',
          description: 'A criatura fica agarrada pela revoada (–2 em testes de ataque, desprevenida e não pode se mover).',
          statuses: ['agarrado'],
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '-2', priority: 20 }
          ],
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Veneno: Peçonha Concentrada',
      img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
      execucao: 'passive',
      custo: 0,
      cd: 26,
      alcance: 'corpo-a-corpo',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 26 reduz a duração da peçonha para 1 rodada.',
      description: '<p>Perde 1d12 pontos de vida por rodada durante 3 rodadas (Fortitude CD 26 reduz a duração para uma rodada).</p>',
      flavorPhrase: 'O veneno amarelado e espesso queima as artérias provocando dor lancinante!',
      flavorAction: 'A toxina concentrada dissolve tecidos internos rodada a rodada',
      rolls: [
        {
          name: 'Dano Contínuo de Veneno (1d12)',
          key: 'dano0',
          type: 'dano',
          parts: [['1d12', 'veneno', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Resistência de Fortitude (CD 26)',
          key: 'teste1',
          type: 'formula',
          parts: [['1d20', '', ''], ['fort', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Envenenado (Peçonha Concentrada)',
          description: 'Perde 1d12 PV por rodada durante 3 rodadas (ou 1 rodada se passar em Fort CD 26).',
          statuses: ['envenenado'],
          duration: { rounds: 3 },
          transfer: false
        }
      ]
    })
  ];

  const revoadaTracos = buildTracos({
    tamanho: 'eno',
    ic: ['paralisia'],
    idiomasValue: []
  });

  const revoadaBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O som de centenas de asas de couro obscurecendo os desfiladeiros é o último aviso antes de o céu desabar em garras e ferrões.* &mdash; Relato de batedor da Guilda Mon’han."<br><span style="font-weight: bold; color: #800000;">&mdash; Revoada das Gargantas Sanguinárias</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Uma serpe jovem é perigosa. Uma revoada inteira em frenesi alimentar é uma catástrofe alada. Não tente enfrentar no céu aberto: procure fendas de rocha imediatamente!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A <span style="color: #800000; font-weight: bold;">Revoada de Serpes</span> congrega dezenas de répteis alados predatórios que nidificam nos cumes intransponíveis das Montanhas Sanguinárias. Atuando como uma mente de colmeia impulsionada pela fome, mergulham em voo veloz (18m) para arrebatar alvos em manobras de agarrar e inocular peçonha concentrada virulenta.</p>`;

  const revoada = buildNpcActor({
    id: revoadaId,
    name: 'Revoada de Serpes',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'eno',
    folder: FOLDER_DB,
    deslocamento: '9m (6q), voo 18m (12q)',
    sentidos: 'faro, visão no escuro',
    tesouro: '8d4 doses de peçonha concentrada (CD 23 para extrair)',
    atributos: { for: 7, des: 1, con: 6, int: -2, sab: 1, car: -1 },
    attributes: {
      cd: 26,
      pv: { value: 320, max: 320 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 32 } // 32 + 1 = 33
    },
    resistencias: revoadaTracos,
    pericias: revoadaSkills,
    items: revoadaItems,
    ataquescac: 'Mordida +26 (2d6+12 mais agarrar +31) e ferrão +26 (1d8+12 mais peçonha concentrada 1d12).',
    ataquesad: '',
    biography: revoadaBio
  });

  await db.put(`!actors!${revoadaId}`, revoada.actorDoc);
  for (const ed of revoada.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', revoada.actorDoc, revoada.embeddedDocs);
  console.log(`✓ Ator "Revoada de Serpes (ND 8)" salvo com ${revoada.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 3. PRESA DO GRANDE BASILISCO (ND 3) - Humanoide Médio (1x1)
  // -------------------------------------------------------------
  const presaId = 'gq8KPreBas229A';
  console.log(`Limpando e reconstruindo Presa do Grande Basilisco [${presaId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${presaId}.`)) {
      await db.del(key);
    }
  }

  const presaSkills = buildSkills(3, { for: 3, des: 2, con: 3, int: 1, sab: 2, car: -1 }, {
    inic: 5,
    perc: 5,
    fort: 9,
    refl: 4,
    vont: 14,
    furt: 3,
    inti: 2,
    luta: 10
  });

  const presaItems = [
    buildWeaponAttack({
      name: 'Machado de Batalha Envenenado',
      img: 'systems/tormenta20/icons/itens/equipamentos/machado-de-batalha.webp',
      dano: '1d8+5',
      tipoDano: 'corte',
      danoExtra: '1d12',
      tipoDanoExtra: 'veneno',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Machado de batalha +10 (1d8+5 corte mais veneno, 20/x3).</p>',
      flavorPhrase: '*VUUUSH-CLACK!* A lâmina manchada de verde esmeralda morde fundo buscando a carne!',
      flavorAction: 'Desfere um golpe brutal com a lâmina untada em óleo de basilisco'
    }),
    buildSpecialPower({
      name: 'Ódio Sórdido',
      img: 'systems/tormenta20/icons/poderes/ameacas/golpe-cruel.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O presa do Grande Basilisco recebe +2 em testes de ataque e +1d6 em rolagens de dano contra criaturas flanqueadas ou sob efeito de alguma condição.</p>',
      flavorPhrase: 'Os olhos do cultista brilham com frenesi sanguinário ao ver a vítima encurralada!',
      flavorAction: 'Aproveita o desespero do oponente para golpear com crueldade redobrada',
      rolls: [
        {
          name: 'Dano Adicional de Ódio Sórdido',
          key: 'dano0',
          type: 'dano',
          parts: [['1d6', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Ódio Sórdido (+2 Ataque, +1d6 Dano)',
          description: '+2 em ataque e +1d6 em dano contra criaturas flanqueadas ou sob condição.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Vitalidade Peçonhenta',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/retomar-folego.webp',
      execucao: 'reacao',
      custo: 0,
      description: '<p>Quando sofre perda de pontos de vida por causa de um efeito de veneno, em vez disso o presa recupera 1d12 PV.</p>',
      flavorPhrase: 'Em vez de fenecer, o sangue corrupto do cultista se revitaliza com o veneno que penetra suas feridas!',
      flavorAction: 'Converte a toxina mortal em vigor impudente através de sua devoção herética',
      rolls: [
        {
          name: 'Cura da Vitalidade Peçonhenta',
          key: 'cura0',
          type: 'cura',
          parts: [['1d12', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Vitalidade Peçonhenta (Absorção de Veneno)',
          description: 'Recupera 1d12 PV em vez de sofrer dano de efeitos de veneno.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Veneno: Peçonha Concentrada',
      img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
      execucao: 'passive',
      custo: 0,
      cd: 19,
      alcance: 'corpo-a-corpo',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 19 reduz a duração da peçonha para 1 rodada.',
      description: '<p>Perde 1d12 pontos de vida durante 3 rodadas (Fort CD 19 reduz a duração para 1 rodada).</p>',
      flavorPhrase: 'A lâmina banhada na toxina transmite veneno corrosivo aos vasos sanguíneos!',
      flavorAction: 'Injeta peçonha viscosa no corte profundo do machado',
      rolls: [
        {
          name: 'Dano Contínuo de Veneno (1d12)',
          key: 'dano0',
          type: 'dano',
          parts: [['1d12', 'veneno', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Resistência de Fortitude (CD 19)',
          key: 'teste1',
          type: 'formula',
          parts: [['1d20', '', ''], ['fort', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Envenenado (Peçonha Concentrada CD 19)',
          description: 'Perde 1d12 PV por rodada durante 3 rodadas (ou 1 rodada se passar em Fort CD 19).',
          statuses: ['envenenado'],
          duration: { rounds: 3 },
          transfer: false
        }
      ]
    })
  ];

  const presaTracos = buildTracos({
    tamanho: 'med',
    idiomasValue: ['comum']
  });

  const presaBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O Grande Pai nos nutre com sua baba e seu olhar. O veneno que mata os fracos é o sangue que cura os devotos da presa eterna!* &mdash; Ladainha dos cultistas na ravina."<br><span style="font-weight: bold; color: #800000;">&mdash; Fanático Presa do Grande Basilisco</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Cuidado extremo ao enfrentar esses fanáticos! Eles intencionalmente se ferem com lâminas envenenadas porque a toxina cura suas feridas em vez de matá-los. Uma heresia médica completa!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Presa do Grande Basilisco</span> integra células heréticas que realizam um sincretismo perverso entre Megalokk (selvageria primordial) e Sszzaas (traição peçonhenta). Espreitando em desfiladeiros montanhosos, atacam em emboscadas noturnas buscando flanquear viajantes para ativar seu Ódio Sórdido e regenerar vigor cortando a própria carne com lâminas toxificadas.</p>`;

  const presa = buildNpcActor({
    id: presaId,
    name: 'Presa do Grande Basilisco',
    nd: '3',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    folder: FOLDER_DB,
    deslocamento: '9m (6q)',
    sentidos: 'visão normal',
    tesouro: 'Padrão',
    atributos: { for: 3, des: 2, con: 3, int: 1, sab: 2, car: -1 },
    attributes: {
      cd: 19,
      pv: { value: 21, max: 21 },
      pm: { value: 0, max: 0 },
      defesa: { value: 20, base: 18 } // 18 + 2 = 20
    },
    resistencias: presaTracos,
    pericias: presaSkills,
    items: presaItems,
    ataquescac: 'Machado de batalha +10 (1d8+5 mais peçonha concentrada 1d12).',
    ataquesad: '',
    biography: presaBio
  });

  await db.put(`!actors!${presaId}`, presa.actorDoc);
  for (const ed of presa.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', presa.actorDoc, presa.embeddedDocs);
  console.log(`✓ Ator "Presa do Grande Basilisco (ND 3)" salvo com ${presa.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 4. BASILISCO ANCESTRAL (ND 9) - Monstro Enorme (3x3)
  // -------------------------------------------------------------
  const basiliscoId = 'gq8KBasAnc229A';
  console.log(`Limpando e reconstruindo Basilisco Ancestral [${basiliscoId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${basiliscoId}.`)) {
      await db.del(key);
    }
  }

  const basiliscoSkills = buildSkills(9, { for: 6, des: 2, con: 5, int: -4, sab: 3, car: 0 }, {
    inic: 10,
    perc: 9,
    fort: 21,
    refl: 14,
    vont: 10,
    furt: 10,
    luta: 27
  });

  const basiliscoItems = [
    buildWeaponAttack({
      name: 'Mordida Titânica',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d8+25',
      tipoDano: 'perfuracao',
      danoExtra: '2d12',
      tipoDanoExtra: 'veneno',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +27 (4d8+25 perfuração mais veneno, 20/x2).</p>',
      flavorPhrase: '*CRUUUNCH-HSSSS!* Mandíbulas couraçadas trituram ossos injetando peçonha potente!',
      flavorAction: 'Abocanha o alvo com dentes maciços banhados em veneno corrosivo'
    }),
    buildSpecialPower({
      name: 'Olhar Petrificante',
      img: 'systems/tormenta20/icons/poderes/ameacas/olhar-aterrador.webp',
      execucao: 'passive',
      custo: 0,
      cd: 28,
      alcance: 'curto',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 28 desvia o olhar. Falha: lento; se já lento, petrificado.',
      description: '<p>No início de seu turno, cada personagem em alcance curto do basilisco deve fazer um teste de Reflexos (CD 28). Se passar, desvia o olhar. Se falhar, fica lento. Se já estiver lento, fica petrificado permanentemente. Um personagem pode fechar os olhos como uma reação para ficar imune a esta habilidade, mas sofrerá os efeitos de estar cego por uma rodada. Efeitos que removem paralisia revertem a petrificação. Metamorfose.</p>',
      flavorPhrase: 'As órbitas pálidas e incandescentes da fera transformam o sangue em pedra ao menor contato visual!',
      flavorAction: 'Fixa o olhar ancestral congelando a carne e os tendões da vítima',
      rolls: [
        {
          name: 'Resistência contra Petrificação (Ref CD 28)',
          key: 'teste0',
          type: 'formula',
          parts: [['1d20', '', ''], ['refl', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Lento (Olhar do Basilisco)',
          description: 'A criatura fica lenta (–5m de deslocamento e uma ação padrão por rodada). Se já estiver lenta, petrifica.',
          statuses: ['lento'],
          transfer: false
        },
        {
          name: 'Condição: Petrificado (Permanente)',
          description: 'A criatura é transformada em pedra permanentemente (inconsciente, RD 10, imune a veneno/doença).',
          statuses: ['petrificado'],
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Sopro Peçonhento',
      img: 'systems/tormenta20/icons/poderes/ameacas/sopro.webp',
      execucao: 'padrao',
      custo: 0,
      cd: 28,
      area: 'cone de 9m',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 28 reduz a perda de vida à metade e evita a condição envenenado.',
      description: '<p><strong>Ação Padrão:</strong> Todas as criaturas em um cone de 9m perdem 3d12 pontos de vida e ficam envenenadas, perdendo 3d12 PV por rodada durante 3 rodadas (Fort CD 28 reduz a perda de vida à metade e evita a condição). Recarga (movimento).</p>',
      flavorPhrase: '*WUUUOOOSH-HSSSS!* Uma nuvem verde-esmeralda de vapor cáustico e miasma vomita das fauces!',
      flavorAction: 'Expele um cone devastador de miasma peçonhento em 9 metros',
      rolls: [
        {
          name: 'Perda Imediata de PV do Sopro (3d12)',
          key: 'dano0',
          type: 'dano',
          parts: [['3d12', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Perda de Vida Contínua de Veneno (3d12/rodada)',
          key: 'dano1',
          type: 'dano',
          parts: [['3d12', 'veneno', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Resistência de Fortitude do Sopro (CD 28)',
          key: 'teste2',
          type: 'formula',
          parts: [['1d20', '', ''], ['fort', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Envenenado pelo Sopro (3d12 PV/rodada)',
          description: 'Perde 3d12 PV por rodada durante 3 rodadas por miasma do Basilisco Ancestral.',
          statuses: ['envenenado'],
          duration: { rounds: 3 },
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Veneno: Peçonha Potente',
      img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
      execucao: 'passive',
      custo: 0,
      cd: 28,
      alcance: 'corpo-a-corpo',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 28 reduz a duração para 1 rodada.',
      description: '<p>Perde 2d12 pontos de vida por rodada durante 3 rodadas (Fort CD 28 reduz a duração para uma rodada).</p>',
      flavorPhrase: 'A peçonha de grau titânico corrói vasos e órgãos vitais com ferocidade incontrolável!',
      flavorAction: 'Inocula veneno mortal que devora 2d12 PV rodada a rodada',
      rolls: [
        {
          name: 'Dano Contínuo de Veneno (2d12)',
          key: 'dano0',
          type: 'dano',
          parts: [['2d12', 'veneno', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Resistência de Fortitude (CD 28)',
          key: 'teste1',
          type: 'formula',
          parts: [['1d20', '', ''], ['fort', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ],
      effects: [
        {
          name: 'Condição: Envenenado (Peçonha Potente CD 28)',
          description: 'Perde 2d12 PV por rodada durante 3 rodadas (ou 1 rodada com Fort CD 28).',
          statuses: ['envenenado'],
          duration: { rounds: 3 },
          transfer: false
        }
      ]
    }),
    buildSpecialPower({
      name: 'Resistência a Veneno +10',
      img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O basilisco ancestral recebe +10 em testes de resistência contra venenos e efeitos peçonhentos.</p>',
      effects: [
        {
          name: 'Resistência a Veneno (+10)',
          description: '+10 em testes de resistência contra veneno.',
          transfer: true
        }
      ]
    })
  ];

  const basiliscoTracos = buildTracos({
    tamanho: 'eno',
    resistencias: { dano: 10 },
    icValue: ['metamorfose'],
    icCustom: 'resistência a veneno +10',
    idiomasValue: []
  });

  const basiliscoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Estátuas de mantícoras partidas, serpes desfeitas e gigantes petrificados... você sabe que adentrou a ravina do senhor ancestral das Sanguinárias quando o próprio medo se torna rocha.* &mdash; Inscrição de caçador tombado na ravina."<br><span style="font-weight: bold; color: #800000;">&mdash; O Terror da Ravina dos Empedrados</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"O maior erro de um aventureiro é achar que o basilisco comum é perigoso. O Basilisco Ancestral tem o tamanho de um vagão de trem, nada com velocidade estarrecedora e cospe nuvens venenosas capazes de derreter couraças de ferro!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Basilisco Ancestral</span> é um monstro colossal (Enorme 3x3) que reina sobre as ravinas pantanosas nas profundezas das Montanhas Sanguinárias. Dotado de couro espesso que confere RD 10 e resistência lendária contra venenos (+10), petrifica presas com seu olhar impassível (Reflexos CD 28) e devora desafiantes com mandíbulas devastadoras de 4d8+25 mais peçonha potente.</p>`;

  const basilisco = buildNpcActor({
    id: basiliscoId,
    name: 'Basilisco Ancestral',
    nd: '9',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'eno',
    folder: FOLDER_DB,
    deslocamento: '9m (6q), natação 9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: '2d4 doses de peçonha potente (CD 24 para extrair), couro de basilisco (CD 24 para extrair, vale T$ 2.000 como matéria-prima para armadura superior), olho de basilisco ancestral',
    atributos: { for: 6, des: 2, con: 5, int: -4, sab: 3, car: 0 },
    attributes: {
      cd: 28,
      pv: { value: 370, max: 370 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 31 } // 31 + 2 = 33
    },
    resistencias: basiliscoTracos,
    pericias: basiliscoSkills,
    items: basiliscoItems,
    ataquescac: 'Mordida +27 (4d8+25 mais peçonha potente 2d12).',
    ataquesad: 'Sopro (cone 9m, perda 3d12 PV mais envenenado 3d12 PV/rodada por 3 rodadas, Fort CD 28 reduz à metade e evita condição, recarga movimento).',
    biography: basiliscoBio
  });

  await db.put(`!actors!${basiliscoId}`, basilisco.actorDoc);
  for (const ed of basilisco.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', basilisco.actorDoc, basilisco.embeddedDocs);
  console.log(`✓ Ator "Basilisco Ancestral (ND 9)" salvo com ${basilisco.actorDoc.items.length} ataques/poderes embutidos.`);

  await db.close();
  console.log('\n✅ Sucesso: Todas as 4 ameaças da DB #229 foram injetadas com conformidade canônica em Ameacas_T20 e src/packs/Ameacas_T20.');
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('Erro ao injetar ameaças:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

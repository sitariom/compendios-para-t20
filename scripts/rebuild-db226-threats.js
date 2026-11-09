#!/usr/bin/env node
/**
 * Reconstrução Canônica das Ameaças da DB #226 em Ameacas_T20
 * Conteúdo: Tyrant ND 10, Espectro do Pesadelo ND 5, Come-Sonhos ND 2, Expurgo Onírico ND 4
 *
 * Padrão Canônico:
 * 1. Descrições 100% integrais dos PDFs oficiais.
 * 2. ActiveEffects nos poderes e ataques mecânicos com arquitetura de subdocumentos.
 * 3. Sincronização em packs/Ameacas_T20 e src/packs/Ameacas_T20/.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  buildHazardActor,
  buildSkills,
  buildTracos,
  saveToSourcePacks
} = require('./create-entry');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const FOLDER_DB = 'wfWApuyngzFm4KOP';

async function rebuildDB226Threats() {
  console.log('=== Reconstruindo Ameaças da Dragão Brasil #226 em Ameacas_T20 ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // -------------------------------------------------------------
  // 1. TYRANT (ND 10) - Construto Grande (2x2)
  // -------------------------------------------------------------
  const tyrantId = 'AOuINuG6UNmsJTIL';
  console.log(`Atualizando Tyrant [${tyrantId}]...`);

  // Limpa subdocumentos antigos
  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${tyrantId}.`)) {
      await db.del(key);
    }
  }

  const tyrantSkills = buildSkills(10, { for: 9, des: -1, con: 8, int: 0, sab: 0, car: -5 }, {
    inic: 9,
    perc: 10,
    atle: 22,
    enga: 6,
    fort: 22,
    refl: 10,
    vont: 16,
    luta: 29
  });

  const tyrantTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { dano: 10 },
    imunidadesDano: ['trevas'],
    icValue: ['metamorfose', 'trevas'],
    idiomasValue: []
  });

  const tyrantItems = [
    buildWeaponAttack({
      name: 'Pancadas',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '4d10+20',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Duas pancadas +29 (4d10+20 impacto).</p>',
      flavorPhrase: 'O punho massivo de carne modificada esmaga ossos e armaduras.',
      flavorAction: 'Desfere pancadas brutais'
    }),
    buildSpecialPower({
      name: 'Imunidade a Magia',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Tyrant é imune a efeitos mágicos, com as seguintes exceções. Magias de fogo e frio deixam ele lento por 1d6 rodadas. Efeitos mágicos de eletricidade removem a condição lento e curam PV em quantidade igual à metade do dano que causariam.</p>',
      flavorPhrase: 'Feitiços e encantamentos se dissipam contra a matéria biológica sem causar efeito.',
      flavorAction: 'Resiste a efeitos mágicos',
      effects: [
        {
          name: 'Imunidade a Magia',
          description: 'Imune a efeitos mágicos (fogo/frio deixam lento 1d6 rodadas; eletricidade remove lento e cura 50% do dano).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Super Tyrant',
      img: 'systems/tormenta20/icons/poderes/ameacas/furia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Se estiver com a metade de seus PV, tyrant rompe seus limitadores. Ele recebe uma ação padrão extra, +1d10 em testes e rolagens de dano e, quando causa dano, deixa a vítima sangrando. Além disso, seu deslocamento muda para 18m (12q). Nesse estado, seu coração fica exposto; tentar atingi-lo é mais difícil (Defesa 41), mas se acertar, o ataque causa dano como se fosse um acerto crítico. Tentar atingi-lo com magia também é mais difícil (tyrant recebe +5 no teste de resistência), mas dano em área, como de uma bomba, causa +50% de dano no tyrant, por também atingir o coração exposto.</p>',
      flavorPhrase: 'O limitador se rompe, garras titânicas se projetam e o coração pulsa exposto em fúria desenfreada!',
      flavorAction: 'Entra no estado de Super Tyrant',
      effects: [
        {
          name: 'Super Tyrant (Limitador Rompido)',
          description: '+5 Defesa (Defesa 41), +1d10 Dano, Ação Padrão Extra, Deslocamento 18m, Ataques Sangrando.',
          changes: [
            { key: 'system.modificadores.defesa.outros', mode: 2, value: '5' },
            { key: 'system.modificadores.dano.geral', mode: 2, value: '1d10' }
          ],
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Cura Acelerada 5',
      img: 'systems/tormenta20/icons/poderes/ameacas/regeneracao.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Cura acelerada 5.</p>',
      flavorPhrase: 'A matéria celular sintética se regenera rapidamente diante dos olhos.',
      flavorAction: 'Regenera 5 pontos de vida por rodada',
      effects: [
        {
          name: 'Cura Acelerada 5',
          description: 'Regenera 5 PV no início de cada rodada.',
          transfer: true
        }
      ]
    })
  ];

  const tyrantBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"[TUM... TUM... TUM...] O som metódico de botas colossais ecoa pelo corredor de pedra, acompanhado apenas do rangido de um sobretudo de couro esticado sobre músculos impossíveis."<br><span style="font-weight: bold; color: #800000;">&mdash; O som do fim</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Eu me tranquei na sala do cofre da masmorra. Ele não abriu a porta... ele simplesmente a atravessou como se fosse papel. É um construto de carne gigante, imparável, imune à dor... a magia não o afeta como deveria! Onde os nobres conseguiram tamanha aberração? O que quer que seja... a Gazeta pode ficar sem escriba hoje."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Em Tormenta20, o <span style="color: #800000; font-weight: bold;">Tyrant</span> é facilmente adaptado como um formidável Golem de Carne, fruto de experimentos macabros feitos por arcanos sem escrúpulos e financiados por nobres obcecados em desenvolver a 'Arma Bio-Orgânica' perfeita para vencer guerras. Um gigante pálido e impassível que persegue incansavelmente o seu alvo.</p>`;

  const tyrant = buildNpcActor({
    id: tyrantId,
    name: 'Tyrant',
    nd: '10',
    papel: 'solo',
    tipoMonstro: 'con',
    raca: 'Construto',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: '9m (6q)',
    sentidos: 'percepção às cegas, visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 9, des: -1, con: 8, int: 0, sab: 0, car: -5 },
    attributes: {
      cd: 24,
      pv: { value: 400, max: 400 },
      pm: { value: 0, max: 0 },
      defesa: { value: 36, base: 37 } // 37 + (-1) = 36
    },
    resistencias: tyrantTracos,
    resistenciasTexto: 'cura acelerada 5, imunidade a metamorfose e trevas, redução de dano 10, imunidade a magia',
    pericias: tyrantSkills,
    items: tyrantItems,
    ataquescac: 'Duas pancadas +29 (4d10+20).',
    biography: tyrantBio
  });

  await db.put(`!actors!${tyrantId}`, tyrant.actorDoc);
  for (const ed of tyrant.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', tyrant.actorDoc, tyrant.embeddedDocs);
  console.log(`✓ Ator "Tyrant (ND 10)" salvo com ${tyrant.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 2. ESPECTRO DO PESADELO (ND 5) - Espírito Grande (2x2)
  // -------------------------------------------------------------
  const espectroId = '7UyOrY1k439sFonD';
  console.log(`Atualizando Espectro do Pesadelo [${espectroId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${espectroId}.`)) {
      await db.del(key);
    }
  }

  const espectroSkills = buildSkills(5, { for: 6, des: 3, con: 4, int: -2, sab: 2, car: 0 }, {
    inic: 7,
    perc: 8,
    fort: 17,
    refl: 11,
    vont: 5,
    luta: 17
  });

  const espectroTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { dano: 5 },
    imunidadesDano: ['trevas'],
    vulnerabilidadesDano: ['luz'],
    icValue: ['medo', 'trevas'],
    idiomasValue: []
  });

  const espectroItems = [
    buildWeaponAttack({
      name: 'Cascos',
      img: 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
      dano: '2d6+5',
      tipoDano: 'impacto',
      danoExtra: '2d8',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Cascos x2 +17 (2d6+5 impacto mais 2d8 trevas).</p>',
      flavorPhrase: 'Cascos de sombra e pesadelo pisoteiam a mente e a carne.',
      flavorAction: 'Desfere patadas sombrias'
    }),
    buildSpecialPower({
      name: 'Devorar Sonhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/devorar-mente.webp',
      execucao: 'completa',
      custo: 0,
      description: '<p>O espectro do pesadelo devora os sonhos de todas as criaturas em alcance curto. As vítimas perdem 1d4+1 PM (Von CD 20 reduz a perda à metade); para cada PM que as vítimas perderem dessa forma, o espectro recebe 5 PV temporários cumulativos. Se uma das criaturas afetadas estiver dormindo, a perda de PM é dobrada. Recarga (completa).</p>',
      flavorPhrase: 'As memórias e sonhos felizes são arrancados em um vórtice de escuridão onírica.',
      flavorAction: 'Devora os sonhos das criaturas',
      effects: [
        {
          name: 'Devorar Sonhos (PV Temporários)',
          description: 'Ganha 5 PV temporários por cada PM drenado de criaturas em alcance curto.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Relincho Aterrador',
      img: 'systems/tormenta20/icons/poderes/ameacas/rugido.webp',
      execucao: 'padrao',
      custo: 0,
      description: '<p>Todas as criaturas em alcance curto ficam apavoradas por 1d4+1 rodadas e então abaladas (Von CD 20 muda para abalados por 1d4+1 rodadas a criatura fica imune a essa habilidade até o fim da cena).</p>',
      flavorPhrase: 'Um relincho espectral de agonia e terror ecoa pelas sombras da praça!',
      flavorAction: 'Emite um relincho aterrorizante',
      effects: [
        {
          name: 'Relincho Aterrador (Apavorado/Abalado)',
          description: 'Criaturas em alcance curto ficam apavoradas 1d4+1 rodadas e depois abaladas (Von CD 20 reduz).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Semi-Incorpóreo',
      img: 'systems/tormenta20/icons/poderes/ameacas/incorporeo.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O espectro do pesadelo tem 25% de chance de ignorar ataques e efeitos (incluindo de área) contra ele. Efeitos de luz ou mágicos ignoram essa habilidade.</p>',
      flavorPhrase: 'Sua forma oscila como fumaça etérea e névoa da meia-noite.',
      flavorAction: 'Flutua entre planos',
      effects: [
        {
          name: 'Semi-Incorpóreo (25% Evasão)',
          description: '25% de chance de ignorar ataques físicos e efeitos comuns (luz ou magia ignoram).',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Terror Encarnado',
      img: 'systems/tormenta20/icons/poderes/ameacas/olhar.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O espectro recebe +2 em testes de ataque e +1d8 de dano de trevas contra criaturas abaladas.</p>',
      flavorPhrase: 'O pavor das vítimas alimenta e fortalece o poder do espectro.',
      flavorAction: 'Alimenta-se do medo',
      effects: [
        {
          name: 'Terror Encarnado (+2 Ataque / +1d8 Trevas)',
          description: '+2 em testes de ataque e +1d8 de dano de trevas contra criaturas abaladas.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Vulnerabilidade à Luz do Dia',
      img: 'systems/tormenta20/icons/poderes/ameacas/luz.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Um espectro exposto a luz solar natural fica debilitado.</p>',
      flavorPhrase: 'A radiância do sol queima a substância onírica da criatura.',
      flavorAction: 'Fica debilitado sob luz do sol',
      effects: [
        {
          name: 'Vulnerabilidade à Luz Solar (Debilitado)',
          description: 'Fica na condição debilitado sob luz solar natural.',
          transfer: true
        }
      ]
    })
  ];

  const espectroBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*HIIIIIN-NNN-GRAAAHH!* &mdash; Um relincho fantasmagórico que não ecoa nos ouvidos, mas reverbera diretamente no fundo da alma."<br><span style="font-weight: bold; color: #800000;">&mdash; O Relincho da Meia-Noite</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"A praça da vila congelou quando aquela sombra emergiu da velha estátua de pedra. O monumento começou a sangrar névoa negra e o ar ficou com gosto de pesadelo esquecido. O corcel sombrio não come grãos nem bebe água... ele consome os sonhos e a sanidade de quem ousa descansar."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Espectro do Pesadelo</span> é uma entidade sombria incorpórea nascida do coletivo de medos e pesadelos devorados de uma comunidade inteira. Adotando a silhueta espectral de um corcel gigante envolto em trevas, ataca violentamente qualquer um que ouse desafiar seu domínio, drenando a mana e o sono das vítimas enquanto se fortalece com o pavor que espalha.</p>`;

  const espectro = buildNpcActor({
    id: espectroId,
    name: 'Espectro do Pesadelo',
    nd: '5',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito',
    tamanho: 'gra',
    folder: FOLDER_DB,
    deslocamento: '15m (10q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 6, des: 3, con: 4, int: -2, sab: 2, car: 0 },
    attributes: {
      cd: 20,
      pv: { value: 200, max: 200 },
      pm: { value: 0, max: 0 },
      defesa: { value: 24, base: 21 } // 21 + 3 = 24
    },
    resistencias: espectroTracos,
    resistenciasTexto: 'imunidade a efeitos de medo, mentais e trevas, redução de dano 5/luz, vulnerabilidade a luz',
    pericias: espectroSkills,
    items: espectroItems,
    ataquescac: 'Cascos x2 +17 (2d6+5 mais 2d8 trevas).',
    biography: espectroBio
  });

  await db.put(`!actors!${espectroId}`, espectro.actorDoc);
  for (const ed of espectro.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', espectro.actorDoc, espectro.embeddedDocs);
  console.log(`✓ Ator "Espectro do Pesadelo (ND 5)" salvo com ${espectro.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 3. COME-SONHOS (ND 2) - Espírito Minúsculo
  // -------------------------------------------------------------
  const comeSonhosId = 'MVyBvkSfAQJKrgjn';
  console.log(`Atualizando Come-Sonhos [${comeSonhosId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${comeSonhosId}.`)) {
      await db.del(key);
    }
  }

  const comeSonhosSkills = buildSkills(2, { for: -3, des: 3, con: 2, int: 0, sab: 2, car: -1 }, {
    inic: 6,
    perc: 5,
    furt: 13,
    intu: 7,
    fort: 3,
    refl: 12,
    vont: 7,
    luta: 14
  });

  const comeSonhosTracos = buildTracos({
    tamanho: 'min',
    resistencias: { dano: 5 },
    imunidadesDano: ['psiquico'],
    icValue: ['medo'],
    idiomasValue: []
  });

  const comeSonhosItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d4+4',
      tipoDano: 'perfuracao',
      danoExtra: '2d6',
      tipoDanoExtra: 'psiquico',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Corpo a Corpo:</strong> Mordida +14 (4d4+4 perfuração mais 2d6 psíquico).</p>',
      flavorPhrase: 'Fileiras de dentes serrilhados cravam na carne e consomem a lucidez.',
      flavorAction: 'Morde vorazmente'
    }),
    buildSpecialPower({
      name: 'Devorar Sonhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/devorar-mente.webp',
      execucao: 'padrao',
      custo: 0,
      description: '<p>O come-sonhos devora os sonhos de uma criatura em alcance curto. A vítima perde 1d4+1 PM (Von CD 16 reduz a perda à metade); para cada PM que a vítima perder dessa forma, o come-sonhos recebe 5 PV temporários cumulativos. Se o come-sonhos usar esta habilidade em uma criatura que esteja dormindo, a perda de PM é dobrada. Recarga (causar dano psíquico com sua mordida).</p>',
      flavorPhrase: 'Sussurra pesadelos e se alimenta dos pensamentos lúcidos da vítima.',
      flavorAction: 'Devora sonhos e ganha vigor',
      effects: [
        {
          name: 'Devorar Sonhos (PV Temporários)',
          description: 'Recebe 5 PV temporários por cada PM perdido pelo alvo em alcance curto.',
          transfer: true
        }
      ]
    }),
    buildSpecialPower({
      name: 'Êxtase Onírico',
      img: 'systems/tormenta20/icons/poderes/ameacas/regeneracao.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Se fosse sofrer dano psíquico, em vez disso o come-sonhos cura PV em quantidade igual ao dano que sofreria.</p>',
      flavorPhrase: 'A dor mental apenas nutre a essência onírica da criatura.',
      flavorAction: 'Converte dano psíquico em cura',
      effects: [
        {
          name: 'Êxtase Onírico (Cura Psíquica)',
          description: 'Cura PV em vez de sofrer dano de efeitos psíquicos.',
          transfer: true
        }
      ]
    })
  ];

  const comeSonhosBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Nheh-nheh-nheh... sonhe mais fundo, pequeno aventureiro, sua mente é tão doce...*"<br><span style="font-weight: bold; color: #800000;">&mdash; Come-Sonhos à beira do leito</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Eles parecem goblins em miniatura com dentes demais e roupas de sombras. Movem-se como poeira ao vento e você só percebe que eles estavam ali quando acorda exausto, sem magia e com uma dor de cabeça dos diabos."<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">Os <span style="color: #800000; font-weight: bold;">Come-Sonhos</span> são espíritos minúsculos de pesadelos que se esgueiram sorrateiramente pelas frestas de portas e janelas durante a madrugada. Com bocas descomunais e fileiras serrilhadas de dentes mágicos, alimentam-se da energia vital e dos pontos de mana de criaturas adormecidas, tornando-se mais resistentes e vigorosos a cada sonho consumido.</p>`;

  const comeSonhos = buildNpcActor({
    id: comeSonhosId,
    name: 'Come-Sonhos',
    nd: '2',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito',
    tamanho: 'min',
    folder: FOLDER_DB,
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: '1d4 doses de essência de mana',
    atributos: { for: -3, des: 3, con: 2, int: 0, sab: 2, car: -1 },
    attributes: {
      cd: 16,
      pv: { value: 14, max: 14 },
      pm: { value: 0, max: 0 },
      defesa: { value: 18, base: 15 } // 15 + 3 = 18
    },
    resistencias: comeSonhosTracos,
    resistenciasTexto: 'imunidade a efeitos mentais, dano psíquico e medo, redução de dano 5/mitral, cura com dano psíquico',
    pericias: comeSonhosSkills,
    items: comeSonhosItems,
    ataquescac: 'Mordida +14 (4d4+4 mais 2d6 psíquico).',
    biography: comeSonhosBio
  });

  await db.put(`!actors!${comeSonhosId}`, comeSonhos.actorDoc);
  for (const ed of comeSonhos.embeddedDocs) {
    await db.put(ed.key, ed.doc);
  }
  saveToSourcePacks('Ameacas_T20', comeSonhos.actorDoc, comeSonhos.embeddedDocs);
  console.log(`✓ Ator "Come-Sonhos (ND 2)" salvo com ${comeSonhos.actorDoc.items.length} ataques/poderes embutidos.`);

  // -------------------------------------------------------------
  // 4. EXPURGO ONÍRICO (ND 4) - Perigo Complexo (Hazard)
  // -------------------------------------------------------------
  const expurgoId = 'M651AaJZPfJ4EQEz';
  console.log(`Atualizando Expurgo Onírico [${expurgoId}]...`);

  const expurgoBio = `<p>O grupo protege e auxilia Sylvana, enquanto a frade se concentra em seu ritual para afastar os come-sonhos da vila de uma vez por todas.</p><p><strong>Objetivo:</strong> Expulsar a presença sombria habitando a estátua e defender a sacerdotisa.</p><p><strong>Efeito:</strong> Sylvana possui 40 pontos de vida. Ela estará completamente concentrada no ritual, e não pode auxiliar os personagens de qualquer forma. Ela precisa ficar cinco rodadas realizando o rito. Assim que o ritual inicia, um verdadeiro enxame de come-sonhos se espalha pela praça, tentando impedi-la. No final de cada rodada, todos os personagens e Sylvana sofrem 4d4+4 pontos de dano de perfuração da mordida das criaturas, 2d6 de dano psíquico, e perdem 1d4+1 PM. Caso os PV de Sylvana sejam reduzidos a 0, a elfa fica inconsciente. Se Sylvana sofrer qualquer dano após este, ela morre. Um personagem pode fazer a ação continuar o ritual para mantê-lo pelas rodadas restantes. Caso falhe no teste, o ritual falha, manifestando o espectro do pesadelo.</p><p><strong>Ações Possíveis:</strong></p><ul><li><strong>Atacar Come-Sonhos (Luta ou Pontaria CD 18):</strong> O personagem golpeia uma quantidade das criaturas. Escolha um dos outros participantes do ritual, incluindo Sylvana, para não sofrer o dano no final da rodada.</li><li><strong>Continuar Ritual (Religião CD 20):</strong> Caso Sylvana tenha sido derrotada, um único personagem pode fazer esse teste em uma rodada.</li><li><strong>Distrair (Atuação ou Enganação CD 17):</strong> O personagem age de maneira inesperada, deixando os come-sonhos confusos. Reduza todo o dano causado pelas criaturas pela metade no final desta rodada.</li><li><strong>Interpor-se (Nenhum Teste):</strong> O personagem coloca-se na frente de outro, sofrendo, no fim da rodada, o dobro do dano, mas evitando que outro o sofra.</li><li><strong>Lançar Magia (Vontade CD 20 + Custo em PM da Magia):</strong> O personagem pode lançar uma magia que cause dano em área (com os mesmos resultados da ação atacar come-sonhos), de cura para recuperar os próprios PV ou de Sylvana, ou que auxilie no perigo complexo. Se falhar no teste a magia é perdida, mas os PM são gastos mesmo assim.</li></ul>`;

  const expurgo = buildHazardActor({
    id: expurgoId,
    name: 'Expurgo Onírico',
    nd: '4',
    folder: FOLDER_DB,
    description: expurgoBio
  });

  await db.put(`!actors!${expurgoId}`, expurgo.actorDoc);
  saveToSourcePacks('Ameacas_T20', expurgo.actorDoc, []);
  console.log(`✓ Perigo "Expurgo Onírico (ND 4)" salvo com descrição integral do PDF.`);

  await db.close();
  console.log('\n✅ Sucesso: Todas as 4 ameaças e perigos da DB #226 foram reconstruídos com conformidade canônica.');
}

rebuildDB226Threats().catch(console.error);

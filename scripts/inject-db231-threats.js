#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Ameaças da DB #231 em Ameacas_T20
 *
 * Conteúdo:
 * 1. A Vastidão Dourada de Halak-Tûr (6 Ameaças de Rafael Dei Svaldi)
 *    - Arraia-Seca (ND 3) - Monstro Médio
 *    - Anshira (ND 9) - Espírito Médio (5 Magias individuais + Furtividade em Deserto)
 *    - Caçador de Condenados (ND 11) - Morto-vivo Grande
 *    - Constritora Arenosa (ND 9) - Monstro Grande (Imunidades + Furtividade em Deserto)
 *    - Ressecado Saqueador (ND 4) - Morto-vivo Médio (Imune Frio + Vuln Fogo)
 *    - Ressecado Líder (ND 4 Solo) - Morto-vivo Médio Solo (Imune Frio + Vuln Fogo)
 *
 * 2. Breves Jornadas: Circo Sombrio (4 Ameaças/NPCs de Tenebra)
 *    - Bianco (ND 2) - Morto-vivo Médio (4 Magias de Truque Circense)
 *    - Rojo (ND 2) - Morto-vivo Médio (Violência Cômica + Cascudo)
 *    - Mantícora Zumbi (ND 3) - Morto-vivo Grande (Garras + Mordida + Fraqueza Zumbi)
 *    - Morrise (ND 3) - Humanoide Médio (5 Magias individuais + Passo Sombrio + Transferir Sofrimento)
 *
 * Conformidade Canônica:
 * - IDs estritos de 16 caracteres alfanuméricos (/^[a-zA-Z0-9]{16}$/)
 * - Defesa Base Dinâmica (defesa.base + des = defesa.value)
 * - 34 perícias sob system.pericias + subdocumentos de perícias situacionais
 * - Magias individuais como itens de tipo "magia" (SpellData DataModel)
 * - Imunidades/Vulnerabilidades estruturadas no DataModel de resistências e ic
 * - Ataques e armas como subdocumentos com rolls.parts
 * - Biografias com citações duplas (#800000 e #006400)
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
  console.log('=== Injetando 10 Ameaças da DB #231 em Ameacas_T20 (Padrão Rigoroso Atualizado) ===\n');
  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  const actorsToInject = [];

  // =========================================================================
  // 1. ARRAIA-SECA (ND 3) - Monstro Médio
  // =========================================================================
  const arraiaId = 'gq8231ArraiSecAA';
  console.log(`Configurando Arraia-Seca [${arraiaId}]...`);
  const arraiaSkills = buildSkills(3, { for: 2, des: 3, con: 2, int: -4, sab: 1, car: -4 }, {
    inic: 6,
    perc: 6,
    fort: 4,
    refl: 14,
    vont: 9,
    furt: 6,
    luta: 16
  });

  const arraiaTracos = buildTracos({
    tamanho: 'med',
    resistencias: { fogo: 5 },
    icValue: [],
    idiomasValue: []
  });

  const arraiaItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '4d4+12',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Mordida +16 (4d4+12, 19 perfuração).</p>',
      flavorPhrase: '*SNAP!* Dentes serrilhados emergem das areias brancas fechando-se sobre a presa!',
      flavorAction: 'A arraia-seca desfere um bote fulminante com sua mandíbula'
    }),
    buildSpecialPower({
      name: 'Armadilha de Ferrão',
      img: 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Se estiver imóvel sob a areia, a arraia-seca funciona como uma armadilha que ocupa um quadrado de 1,5m. Uma criatura que entre no espaço ocupado sofre <strong>4d8+6 pontos de dano de perfuração</strong> e fica <strong>sangrando</strong> (Ref CD 17 reduz à metade e evita a condição). Não pode ser desarmada como armadilha normal.</p>'
    }),
    buildSpecialPower({
      name: 'Deslizamento Camuflado',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/camuflagem.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A arraia-seca tem camuflagem leve enquanto está em terreno arenoso.</p>'
    }),
    buildSpecialPower({
      name: 'Espreitadora das Areias',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/emboscada.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Enquanto a arraia-seca estiver parada sob a areia, a CD de Investigação ou Percepção para percebê-la é 30, ou +10 em seu teste de Furtividade, o que for maior.</p>'
    })
  ];

  const arraiaBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Em um primeiro momento, a ondulação na areia branca parece ser causada pelo vento. Tarde demais, percebe-se uma silhueta arredondada que desliza rumo a suas vítimas.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Guia das Feras de Halak-Tûr</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Elas não perseguem presas em campo aberto; esperam imóveis sob o calor das dunas. Se ouvir o farfalhar da areia compacta, pule para trás imediatamente."<br><span style="font-weight: bold; color: #006400;">&mdash; Batedor Dai-kerat</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A temível <span style="color: #800000; font-weight: bold;">Arraia-Seca</span> é um predador carnívoro de ND 3 nativo do Deserto da Perdição. Dotada de quatro patas achatadas e uma cauda afiada, esconde-se no solo como uma armadilha viva para cravar seu ferrão sangrento em exploradores descuidados.</p>`;

  actorsToInject.push({
    id: arraiaId,
    name: 'Arraia-Seca',
    nd: '3',
    papel: 'monstro',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'med',
    deslocamento: '9m (6q), escavação 9m (6q)',
    sentidos: 'Percepção às cegas (médio)',
    tesouro: 'Nenhum',
    atributos: { for: 2, des: 3, con: 2, int: -4, sab: 1, car: -4 },
    attributes: {
      pv: { value: 24, max: 24 },
      pm: { value: 0, max: 0 },
      defesa: { value: 19, base: 16 } // 19 - 3 = 16
    },
    resistencias: arraiaTracos,
    resistenciasTexto: 'redução de fogo 5',
    pericias: arraiaSkills,
    items: arraiaItems,
    ataquescac: 'Mordida +16 (4d4+12, 19 perfuração).',
    ataquesad: 'Armadilha de Ferrão (Ref CD 17, 4d8+6 perfuração mais sangrando).',
    biography: arraiaBio
  });

  // =========================================================================
  // 2. ANSHIRA (ND 9) - Espírito Médio (5 Magias Individuais + Furtividade em Deserto)
  // =========================================================================
  const anshiraId = 'gq8231AnshiraAAA';
  console.log(`Configurando Anshira [${anshiraId}]...`);
  const anshiraSkills = buildSkills(9, { for: -1, des: 1, con: 3, int: 1, sab: 6, car: 6 }, {
    inic: 9,
    perc: 16,
    fort: 14,
    refl: 10,
    vont: 21,
    ades: 16,
    dipl: 16,
    furt: 11,
    intu: 14,
    mist: 9,
    sobr: 16
  }, {
    furt_deserto: {
      label: 'Furtividade (Desertos)',
      atributo: 'des',
      value: 16,
      outros: 5,
      treinado: true,
      custom: true
    }
  });

  const anshiraTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    imunidadesDano: ['acido'],
    icValue: ['mental'],
    excecoes: { dano: 0 }
  });

  const anshiraItems = [
    buildSpecialPower({
      name: 'Refúgio Rochoso',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A caverna da anshira fornece uma condição de descanso confortável para a anshira e quaisquer criaturas que ela acolher.</p>'
    }),
    buildSpecialPower({
      name: 'Sentidos da Caverna',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/visao-mistica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Dentro de sua caverna, a anshira tem percepção às cegas em toda a extensão da área.</p>'
    }),
    buildSpecialPower({
      name: 'Simbiose Rochosa',
      img: 'systems/tormenta20/icons/poderes/concedidos/forca-da-natureza.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O espírito da anshira abrange a caverna onde vive. Se destruída, renasce em 2d4 dias no ponto mais profundo. Não pode se afastar mais de 2km da entrada sem sofrer 8d6 PV/hora. A única forma definitiva de matá-la é provocar um desmoronamento enquanto ela está fora da caverna.</p>'
    }),
    // 5 Magias Individuais de Conjuradora de 9º Nível (CD 32)
    buildSpellItem({
      name: 'Comando',
      circulo: 1,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 4,
      alcance: 'curto',
      alvo: 'duas criaturas',
      duracao: 'round',
      resistencia: 'Vontade anula',
      description: '<p>No início do seu próximo turno, duas criaturas em alcance curto ficam pasmas por 1 rodada (Von CD 32 evita; cada criatura só pode ficar pasma por esta magia uma vez por cena).</p>'
    }),
    buildSpellItem({
      name: 'Controlar Terra',
      circulo: 3,
      tipo: 'div',
      escola: 'tra',
      execucao: 'action',
      custoPM: 9,
      alcance: 'longo',
      area: '9 cubos de 1,5m',
      duracao: 'scene',
      description: '<p>A anshira transforma 9 cubos de terra com 1,5m de lado em alcance longo em uma parede (RD 8 e 50 PV) que fornece cobertura total. Ela pode aplicar outros efeitos aos cubos.</p>'
    }),
    buildSpellItem({
      name: 'Enfeitiçar',
      circulo: 1,
      tipo: 'arc',
      escola: 'enc',
      execucao: 'action',
      custoPM: 1,
      alcance: 'curto',
      alvo: '1 humanoide',
      duracao: 'scene',
      resistencia: 'Vontade anula',
      description: '<p>Um humanoide em alcance curto fica enfeitiçado (Von CD 32 evita). Ações hostis contra o alvo ou seus aliados dissipam a magia.</p>'
    }),
    buildSpellItem({
      name: 'Pele de Pedra',
      circulo: 2,
      tipo: 'div',
      escola: 'tra',
      execucao: 'action',
      custoPM: 6,
      alcance: 'pessoal',
      alvo: 'você',
      duracao: 'scene',
      description: '<p>A anshira recebe redução de dano 5 até o fim da cena.</p>'
    }),
    buildSpellItem({
      name: 'Tranquilidade',
      circulo: 1,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 2,
      alcance: 'curto',
      alvo: '1 criatura',
      duracao: 'scene',
      resistencia: 'Vontade parcial',
      description: '<p>Até o fim da cena, uma criatura em alcance curto tem sua atitude mudada para indiferente e não pode atacar ou realizar qualquer ação hostil (Von CD 32 reduz para penalidade de –2 em testes de ataque). Ações hostis contra o alvo ou seus aliados dissipam a magia.</p>'
    })
  ];

  const anshiraBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A voz que soa parece um assobio suave, como o vento passando entre as rochas. Seus olhos amendoados transmitem uma tranquilidade hipnótica.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Crônicas das Donzelas das Rochas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Não erga armas contra uma anshira em seu lar. Ela comanda as paredes e o próprio teto da caverna, e prefere seduzir e desorientar a guerrear abertamente."<br><span style="font-weight: bold; color: #006400;">&mdash; Eremita Sar-allan</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">As <span style="color: #800000; font-weight: bold;">Anshiras</span> são espíritos protetores das grutas e cavernas de Halak-Tûr (ND 9). Conectadas à terra assim como as dríades às árvores, acolhem viajantes respeitosos ou moldam a rocha viva contra invasores profanos.</p>`;

  actorsToInject.push({
    id: anshiraId,
    name: 'Anshira',
    nd: '9',
    papel: 'espirito',
    tipoMonstro: 'esp',
    raca: 'Espírito',
    tamanho: 'med',
    deslocamento: '9m (6q), sem redução por terreno difícil natural',
    sentidos: 'visão no escuro, percepção às cegas na caverna',
    tesouro: 'Padrão',
    atributos: { for: -1, des: 1, con: 3, int: 1, sab: 6, car: 6 },
    attributes: {
      cd: 32,
      pv: { value: 224, max: 224 },
      pm: { value: 55, max: 55 },
      defesa: { value: 32, base: 31 } // 32 - 1 = 31
    },
    resistencias: anshiraTracos,
    resistenciasTexto: 'imunidade a ácido e efeitos mentais, redução de dano 5/mitral',
    pericias: anshiraSkills,
    items: anshiraItems,
    ataquescac: 'Toque de Rocha / Magias (CD 32).',
    ataquesad: 'Controlar Terra (9 PM), Comando (4 PM), Enfeitiçar (1 PM).',
    biography: anshiraBio
  });

  // =========================================================================
  // 3. CAÇADOR DE CONDENADOS (ND 11) - Morto-vivo Grande
  // =========================================================================
  const cacadorId = 'gq8231CacCondAAA';
  console.log(`Configurando Caçador de Condenados [${cacadorId}]...`);
  const cacadorSkills = buildSkills(11, { for: 7, des: 1, con: 2, int: -2, sab: 0, car: -1 }, {
    inic: 10,
    perc: 9,
    fort: 24,
    refl: 18,
    vont: 11,
    inti: 8,
    sobr: 9,
    luta: 34
  });

  const cacadorTracos = buildTracos({
    tamanho: 'grd',
    resistencias: { corte: 5, frio: 5, perfuracao: 5 },
    icValue: ['mental'],
    idiomasValue: []
  });

  const cacadorItems = [
    buildWeaponAttack({
      name: 'Cimitarra',
      img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
      dano: '4d6+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Cimitarra +34 (4d6+10, 18 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Foice',
      img: 'systems/tormenta20/icons/itens/equipamentos/foice.webp',
      dano: '4d4+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Foice +34 (4d4+10, x3 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Maça',
      img: 'systems/tormenta20/icons/itens/equipamentos/maca.webp',
      dano: '3d8+10',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Maça +34 (3d8+10 impacto).</p>'
    }),
    buildWeaponAttack({
      name: 'Machadinha',
      img: 'systems/tormenta20/icons/itens/equipamentos/machadinha.webp',
      dano: '4d6+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Machadinha +34 (4d6+10, x3 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Cauda Óssea',
      img: 'systems/tormenta20/icons/poderes/ameacas/cauda.webp',
      dano: '2d12+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Cauda +34 (2d12+10 corte). Se acertar por 5 ou mais, o alvo fica <em>sangrando</em>.</p>'
    }),
    buildSpecialPower({
      name: 'Condenação Corrupta',
      img: 'systems/tormenta20/icons/poderes/ameacas/assassinar.webp',
      type: 'poder',
      actionType: 'move',
      description: '<p>O caçador condena uma criatura em alcance curto. A criatura fica <strong>abalada e alquebrada</strong> (Von CD 31 evita e imune por 24h). Recarga (movimento). Mental.</p>'
    }),
    buildSpecialPower({
      name: 'Sequência Mortal',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Por cada ataque que acertou em uma criatura nesse turno, o caçador causa <strong>+1d6 pontos de dano</strong> cumulativo com seus ataques subsequentes contra ela até o fim do turno.</p>'
    }),
    buildSpecialPower({
      name: 'Obediência Eterna',
      img: 'systems/tormenta20/icons/poderes/concedidos/olhar-amedrontador.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O caçador sofre –5 em testes contra devotos de Sszzaas.</p>'
    })
  ];

  const cacadorBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A criatura desliza sobre uma cauda serpentina descomunal, cada um de seus quatro braços empunhando uma arma gélida com maestria assassina.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Relatos das Tumbas de Zarkhassa</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Evite trocas prolongadas de golpes corpo a corpo; sua sequência de quatro armas acumula dano esmagador a cada acerto consecutivo."<br><span style="font-weight: bold; color: #006400;">&mdash; Veterano da Aliança</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Caçador de Condenados</span> (ND 11) é uma monstruosa aberração nagah morta-viva preservada nas ruínas zarkhassianas, armada com quatro lâminas para perseguir e exterminar qualquer invasor.</p>`;

  actorsToInject.push({
    id: cacadorId,
    name: 'Caçador de Condenados',
    nd: '11',
    papel: 'morto-vivo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'grd',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: { for: 7, des: 1, con: 2, int: -2, sab: 0, car: -1 },
    attributes: {
      cd: 31,
      pv: { value: 530, max: 530 },
      pm: { value: 0, max: 0 },
      defesa: { value: 40, base: 39 } // 40 - 1 = 39
    },
    resistencias: cacadorTracos,
    resistenciasTexto: 'redução de corte, frio e perfuração 5',
    pericias: cacadorSkills,
    items: cacadorItems,
    ataquescac: 'Cimitarra +34 (4d6+10, 18), Foice +34 (4d4+10, x3), Maça +34 (3d8+10), Machadinha +34 (4d6+10, x3) e Cauda +34 (2d12+10 corte).',
    ataquesad: 'Condenação Corrupta (Movimento, Von CD 31, abalada e alquebrada).',
    biography: cacadorBio
  });

  // =========================================================================
  // 4. CONSTRITORA ARENOSA (ND 9) - Monstro Grande (Imunidades + Furtividade em Deserto)
  // =========================================================================
  const constritoraId = 'gq8231ConstAreAA';
  console.log(`Configurando Constritora Arenosa [${constritoraId}]...`);
  const constritoraSkills = buildSkills(9, { for: 6, des: 2, con: 5, int: -5, sab: 2, car: -4 }, {
    inic: 10,
    perc: 10,
    fort: 15,
    refl: 21,
    vont: 9,
    furt: 8,
    luta: 26
  }, {
    furt_deserto: {
      label: 'Furtividade (Deserto)',
      atributo: 'des',
      value: 13,
      outros: 5,
      treinado: true,
      custom: true
    }
  });

  const constritoraTracos = buildTracos({
    tamanho: 'grd',
    imunidadesDano: ['acido', 'eletricidade', 'trevas'],
    icValue: ['metamorfose'],
    idiomasValue: []
  });

  const constritoraItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '6d12+23',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Mordida +26 (6d12+23 perfuração).</p>'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/constricao.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Se a constritora arenosa acerta um ataque de mordida, pode fazer a manobra agarrar (teste +28).</p>'
    }),
    buildSpecialPower({
      name: 'Constrição (Livre)',
      img: 'systems/tormenta20/icons/poderes/ameacas/constricao.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>No início de cada um de seus turnos, a constritora causa <strong>12d12+23 pontos de dano de impacto</strong> na criatura que estiver agarrando.</p>'
    }),
    buildSpecialPower({
      name: 'Forma de Areia',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      type: 'poder',
      actionType: 'action',
      description: '<p>A constritora pode se transformar em uma pilha de areia imóvel. Se ela estiver assim, um personagem deve passar num teste de Percepção (CD 35) para perceber que ela é uma criatura. Se a constritora estiver em terreno arenoso, a CD do teste de Percepção aumenta para 40.</p>'
    }),
    buildSpecialPower({
      name: 'Escorrer',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A constritora pode passar por qualquer espaço apertado por onde um grão de areia poderia passar.</p>'
    }),
    buildSpecialPower({
      name: 'Fortificação 75%',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A constritora arenosa possui 75% de chance de ignorar o dano adicional de acertos críticos e ataques furtivos.</p>'
    }),
    buildSpecialPower({
      name: 'Vulnerabilidade Hídrica',
      img: 'systems/tormenta20/icons/magias/ondas-de-choque.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Se imersa em líquido por 1 rodada, começa a virar lama ficando debilitada e lenta até passar 1 hora fora da água.</p>'
    })
  ];

  const constritoraBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*A areia diante de vocês ganha vida em espirais grossas e musculosas, exibindo presas e olhos moldados em ônix negro afiado.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Diário de Viagem Sar-allan</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Banhá-la com água pura dissolve sua coesão mágica e a torna pesada como lama, anulando sua velocidade mortal."<br><span style="font-weight: bold; color: #006400;">&mdash; Guia Ferani</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A <span style="color: #800000; font-weight: bold;">Constritora Arenosa</span> (ND 9) é um predador colossal de areia animada que esmaga suas vítimas com um abraço sufocante de 12d12+23 antes de retornar às dunas.</p>`;

  actorsToInject.push({
    id: constritoraId,
    name: 'Constritora Arenosa',
    nd: '9',
    papel: 'monstro',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'grd',
    deslocamento: '9m (6q), escalar 6m (4q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Duas gemas negras (T$ 1.000 cada) e duas presas de ônix (T$ 300 cada)',
    atributos: { for: 6, des: 2, con: 5, int: -5, sab: 2, car: -4 },
    attributes: {
      pv: { value: 325, max: 325 },
      pm: { value: 0, max: 0 },
      defesa: { value: 32, base: 30 } // 32 - 2 = 30
    },
    resistencias: constritoraTracos,
    resistenciasTexto: 'fortificação 75%, imunidade a ácido, eletricidade, metamorfose e trevas',
    pericias: constritoraSkills,
    items: constritoraItems,
    ataquescac: 'Mordida +26 (6d12+23) e Constrição (12d12+23 impacto).',
    ataquesad: 'Agarrar Aprimorado (+28 livre após mordida).',
    biography: constritoraBio
  });

  // =========================================================================
  // 5. RESSECADO SAQUEADOR (ND 4) - Morto-vivo Médio (Imune Frio + Vuln Fogo)
  // =========================================================================
  const ressecSaqId = 'gq8231RessecSaqA';
  console.log(`Configurando Ressecado Saqueador [${ressecSaqId}]...`);
  const ressecSaqSkills = buildSkills(4, { for: 3, des: 1, con: 1, int: 0, sab: 1, car: -1 }, {
    inic: 5,
    perc: 5,
    fort: 10,
    refl: 15,
    vont: 5,
    cava: 5,
    inti: 4,
    sobr: 5,
    luta: 16,
    pont: 16
  });

  const ressecSaqTracos = buildTracos({
    tamanho: 'med',
    resistencias: { corte: 5, perfuracao: 5 },
    imunidadesDano: ['frio'],
    vulnerabilidadesDano: ['fogo'],
    icValue: ['mental'],
    idiomasValue: []
  });

  const ressecSaqItems = [
    buildWeaponAttack({
      name: 'Cimitarra',
      img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
      dano: '2d6+12',
      tipoDano: 'corte',
      danoExtra: '2d8',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Cimitarra +16 (2d6+12 corte, 18, mais 2d8 trevas).</p>'
    }),
    buildWeaponAttack({
      name: 'Arco Curto',
      img: 'systems/tormenta20/icons/itens/equipamentos/arco-curto.webp',
      dano: '2d6+12',
      tipoDano: 'perfuração',
      danoExtra: '2d8',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      alcance: 'médio',
      proposito: 'disparo',
      description: '<p><strong>Ataque à Distância:</strong> Arco curto +16 (2d6+12 perfuração, x3, mais 2d8 trevas, alcance médio).</p>'
    }),
    buildSpecialPower({
      name: 'Celeridade Odiosa',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O ressecado saqueador pode executar uma ação padrão adicional em seu primeiro turno de combate.</p>'
    }),
    buildSpecialPower({
      name: 'Ódio aos Vivos',
      img: 'systems/tormenta20/icons/poderes/ameacas/odio.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Contra criaturas vivas, o ressecado recebe +2 em testes de perícia e causa +2d4 pontos de dano.</p>'
    }),
    buildSpecialPower({
      name: 'Visão Tumular',
      img: 'systems/tormenta20/icons/magias/visao-mistica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Sob efeito contínuo de Visão Mística, enxergando criaturas e objetos invisíveis.</p>'
    })
  ];

  const ressecSaqBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Cadáveres desidratados que vagam sob a noite fria, com olhos ardendo em luz esmeralda de ódio inextinguível.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Lendas das Areias Noturnas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Use o fogo contra eles. A secura absoluta de seus corpos queima intensamente, consumindo sua carne morta."<br><span style="font-weight: bold; color: #006400;">&mdash; Alquimista de Valkaria</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ressecado Saqueador</span> (ND 4) é um batedor esqueleto desidratado jurado a Tenebra que desfecha flechadas e golpes de cimitarra impregnados de trevas.</p>`;

  actorsToInject.push({
    id: ressecSaqId,
    name: 'Ressecado Saqueador',
    nd: '4',
    papel: 'morto-vivo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'sensibilidade à luz, visão no escuro, visão mística',
    tesouro: 'Metade',
    atributos: { for: 3, des: 1, con: 1, int: 0, sab: 1, car: -1 },
    attributes: {
      pv: { value: 30, max: 30 },
      pm: { value: 0, max: 0 },
      defesa: { value: 22, base: 21 } // 22 - 1 = 21
    },
    resistencias: ressecSaqTracos,
    resistenciasTexto: 'imunidade a frio, redução de corte e perfuração 5, vulnerabilidade a fogo',
    pericias: ressecSaqSkills,
    items: ressecSaqItems,
    ataquescac: 'Cimitarra +16 (2d6+12 corte, 18, mais 2d8 trevas).',
    ataquesad: 'Arco curto +16 (2d6+12 perfuração, x3, mais 2d8 trevas).',
    biography: ressecSaqBio
  });

  // =========================================================================
  // 6. RESSECADO LÍDER (ND 4 SOLO) - Morto-vivo Médio Solo (Imune Frio + Vuln Fogo)
  // =========================================================================
  const ressecLidId = 'gq8231RessecLidA';
  console.log(`Configurando Ressecado Líder [${ressecLidId}]...`);
  const ressecLidSkills = buildSkills(4, { for: 4, des: 1, con: 2, int: 1, sab: 1, car: 0 }, {
    inic: 8,
    perc: 8,
    fort: 14,
    refl: 20,
    vont: 7,
    cava: 8,
    guer: 8,
    inti: 7,
    sobr: 8,
    luta: 24,
    pont: 24
  });

  const ressecLidTracos = buildTracos({
    tamanho: 'med',
    resistencias: { corte: 5, perfuracao: 5 },
    imunidadesDano: ['frio'],
    vulnerabilidadesDano: ['fogo'],
    icValue: ['mental'],
    idiomasValue: []
  });

  const ressecLidItems = [
    buildWeaponAttack({
      name: 'Cimitarra',
      img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
      dano: '2d6+12',
      tipoDano: 'corte',
      danoExtra: '2d8',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> Duas cimitarras +24 (2d6+12 corte, 18, mais 2d8 trevas).</p>'
    }),
    buildWeaponAttack({
      name: 'Arco Curto',
      img: 'systems/tormenta20/icons/itens/equipamentos/arco-curto.webp',
      dano: '2d6+12',
      tipoDano: 'perfuração',
      danoExtra: '2d8',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 3,
      alcance: 'médio',
      proposito: 'disparo',
      description: '<p><strong>Ataque à Distância (x2):</strong> Dois disparos de arco curto +24 (2d6+12 perfuração, x3, mais 2d8 trevas, alcance médio).</p>'
    }),
    buildSpecialPower({
      name: 'Celeridade Odiosa',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>O ressecado líder pode executar uma ação padrão adicional em seu primeiro turno de combate.</p>'
    }),
    buildSpecialPower({
      name: 'Ódio aos Vivos',
      img: 'systems/tormenta20/icons/poderes/ameacas/odio.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Contra criaturas vivas, o ressecado recebe +2 em testes de perícia e causa +2d4 pontos de dano.</p>'
    }),
    buildSpecialPower({
      name: 'Ordens Letais',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/lideranca.webp',
      type: 'poder',
      actionType: 'move',
      description: '<p>Comanda aliados ressecados em alcance médio. Eles recebem <strong>+1d4 em rolagens de dano</strong> até o fim da cena (ou <strong>+2d4 contra vivos</strong>).</p>'
    }),
    buildSpecialPower({
      name: 'Visão Tumular',
      img: 'systems/tormenta20/icons/magias/visao-mistica.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Sob efeito contínuo de Visão Mística, enxergando criaturas e objetos invisíveis.</p>'
    })
  ];

  const ressecLidBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Com couraça oxidada e olhos verdes flamejantes, sua voz soa como se ecoasse de uma tumba ancestral, comandando a matança.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Contos dos Nômades do Deserto</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Derrube o líder primeiro para cessar suas ordens letais; a presença dele amplifica o ímpeto destrutivo de toda a tribo de ressecados."<br><span style="font-weight: bold; color: #006400;">&mdash; Capitão da Guarda</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Ressecado Líder</span> (ND 4 Solo) é um formidável comandante morto-vivo de 280 PV que orquestra investidas brutais sob a noite eterna das areias.</p>`;

  actorsToInject.push({
    id: ressecLidId,
    name: 'Ressecado Líder',
    nd: '4',
    papel: 'solo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'sensibilidade à luz, visão no escuro, visão mística',
    tesouro: 'Padrão',
    atributos: { for: 4, des: 1, con: 2, int: 1, sab: 1, car: 0 },
    attributes: {
      pv: { value: 280, max: 280 },
      pm: { value: 0, max: 0 },
      defesa: { value: 31, base: 30 } // 31 - 1 = 30
    },
    resistencias: ressecLidTracos,
    resistenciasTexto: 'imunidade a frio, redução de corte e perfuração 5, vulnerabilidade a fogo',
    pericias: ressecLidSkills,
    items: ressecLidItems,
    ataquescac: 'Cimitarra x2 +24 (2d6+12 corte, 18, mais 2d8 trevas).',
    ataquesad: 'Arco curto x2 +24 (2d6+12 perfuração, x3, mais 2d8 trevas).',
    biography: ressecLidBio
  });

  // =========================================================================
  // 7. BIANCO (ND 2) - Morto-vivo Médio (4 Magias de Truque Circense)
  // =========================================================================
  const biancoId = 'gq8231BiancoAAAA';
  console.log(`Configurando Bianco [${biancoId}]...`);
  const biancoSkills = buildSkills(2, { for: -1, des: 4, con: 1, int: -1, sab: 3, car: 2 }, {
    inic: 7,
    perc: 6,
    fort: 2,
    refl: 12,
    vont: 8,
    acro: 10,
    atua: 6,
    enga: 8,
    furt: 10,
    luta: 8
  });

  const biancoTracos = buildTracos({
    tamanho: 'med',
    icValue: ['mental'],
    idiomasValue: []
  });

  const biancoItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '1d6+4',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Pancada +8 (1d6+4 impacto).</p>'
    }),
    buildSpecialPower({
      name: 'Ataque Furtivo',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/ataque-furtivo.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Bianco causa <strong>+2d6 pontos de dano</strong> corpo a corpo contra alvos desprevenidos ou flanqueados.</p>'
    }),
    buildSpecialPower({
      name: 'Sombra Branca',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Bianco não sofre penalidade em testes de Furtividade por se mover na sua velocidade normal e reduz a penalidade por atacar e fazer outras ações chamativas para –10.</p>'
    }),
    // 4 Magias de Truque Circense (CD 18)
    buildSpellItem({
      name: 'Área Escorregadia',
      circulo: 1,
      tipo: 'arc',
      escola: 'con',
      execucao: 'action',
      custoPM: 2,
      alcance: 'curto',
      area: 'quadrado de 4,5m',
      duracao: 'scene',
      resistencia: 'Reflexos evita',
      description: '<p>Criaturas numa área de 4,5m de lado em alcance curto ficam caídas (Ref CD 18 evita). Nas rodadas seguintes, criaturas que tentem se movimentar pela área devem fazer um teste de Acrobacia para equilíbrio (CD 15).</p>'
    }),
    buildSpellItem({
      name: 'Hipnotismo',
      circulo: 1,
      tipo: 'arc',
      escola: 'enc',
      execucao: 'action',
      custoPM: 1,
      alcance: 'curto',
      alvo: '1 humanoide',
      duracao: 'round',
      resistencia: 'Vontade evita',
      description: '<p>Um humanoide em alcance curto fica fascinado por 1d4 rodadas (Von CD 18 evita e deixa imune por 1 dia).</p>'
    }),
    buildSpellItem({
      name: 'Imagem Espelhada',
      circulo: 1,
      tipo: 'arc',
      escola: 'ilu',
      execucao: 'action',
      custoPM: 1,
      alcance: 'pessoal',
      alvo: 'você',
      duracao: 'scene',
      description: '<p>Três cópias ilusórias de Bianco surgem ao seu redor, concedendo +6 na Defesa. Cada vez que um ataque erra Bianco, uma das cópias desaparece e o bônus na Defesa diminui em 2.</p>'
    }),
    buildSpellItem({
      name: 'Primor Atlético',
      circulo: 1,
      tipo: 'arc',
      escola: 'tra',
      execucao: 'action',
      custoPM: 2,
      alcance: 'pessoal',
      alvo: 'você',
      duracao: 'scene',
      description: '<p>Até o fim da cena, Bianco recebe deslocamento +9m, +10 em Atletismo e pode escalar paredes sem teste e sem ficar desprevenido.</p>'
    })
  ];

  const biancoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Com roupas inteiramente brancas e uma boca triste pintada em preto, ele desliza sem som entre as tendas do circo.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Testemunho dos Sobreviventes</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Cuidado com os ângulos cegos: ele se aproveita da distração causada por Rojo para desferir golpes furtivos traiçoeiros."<br><span style="font-weight: bold; color: #006400;">&mdash; Guarda da Vila</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O macabro <span style="color: #800000; font-weight: bold;">Bianco</span> (ND 2) é um dos palhaços mortos-vivos do Circo Sombrio, utilizando agilidade fantasmagórica e Furtividade magistral para assassinar curiosos.</p>`;

  actorsToInject.push({
    id: biancoId,
    name: 'Bianco',
    nd: '2',
    papel: 'morto-vivo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'med',
    deslocamento: '12m (8q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: { for: -1, des: 4, con: 1, int: -1, sab: 3, car: 2 },
    attributes: {
      pv: { value: 45, max: 45 },
      pm: { value: 8, max: 8 },
      defesa: { value: 15, base: 11 } // 15 - 4 = 11
    },
    resistencias: biancoTracos,
    pericias: biancoSkills,
    items: biancoItems,
    ataquescac: 'Pancada +8 (1d6+4 impacto, mais 2d6 furtivo).',
    biography: biancoBio
  });

  // =========================================================================
  // 8. ROJO (ND 2) - Morto-vivo Médio (Violência Cômica + Cascudo)
  // =========================================================================
  const rojoId = 'gq8231RojoAAAAAA';
  console.log(`Configurando Rojo [${rojoId}]...`);
  const rojoSkills = buildSkills(2, { for: 5, des: 1, con: 4, int: -3, sab: 0, car: 1 }, {
    inic: 2,
    perc: 1,
    fort: 12,
    refl: 8,
    vont: 2,
    acro: 4,
    atle: 8,
    atua: 4,
    luta: 10
  });

  const rojoTracos = buildTracos({
    tamanho: 'med',
    resistencias: { corte: 0, impacto: 0, perfuracao: 0 },
    icValue: ['mental'],
    idiomasValue: []
  });

  const rojoItems = [
    buildWeaponAttack({
      name: 'Duas Pancadas',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '1d8+5',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> Duas pancadas +10 (1d8+5 impacto).</p>'
    }),
    buildSpecialPower({
      name: 'Cascudo',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Rojo reduz todo dano de corte, impacto e perfuração que sofre à metade.</p>'
    }),
    buildSpecialPower({
      name: 'Violência Cômica',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>Sempre que sofre dano, Rojo recebe um bônus de <strong>+1 em testes de ataque e rolagens de dano</strong> até o fim da cena (até um máximo de +5). Se esse bônus chegar a +5, seu tamanho muda para Grande (–2 Furtividade, +2 manobras, dano aumenta +1 passo) e suas pancadas causam +1d6 trevas. Se passar 1 rodada sem sofrer dano, perde o bônus.</p>'
    })
  ];

  const rojoBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Alto e musculoso em vestes pretas e roxas bufantes, exibe um sorriso rubro grotesco pintado sobre a carne putrefata.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Memórias do Circo Sombrio</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Sua casca morta ignora golpes leves. Concentre magias ou golpes pesados para quebrar sua resistência."<br><span style="font-weight: bold; color: #006400;">&mdash; Caçador de Mortos-Vivos</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O brutamontes <span style="color: #800000; font-weight: bold;">Rojo</span> (ND 2) é o leão-de-chácara do circo de Tenebra, combinando 80 PV e redução à metade com pancadas e Violência Cômica escalonável.</p>`;

  actorsToInject.push({
    id: rojoId,
    name: 'Rojo',
    nd: '2',
    papel: 'morto-vivo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: { for: 5, des: 1, con: 4, int: -3, sab: 0, car: 1 },
    attributes: {
      pv: { value: 80, max: 80 },
      pm: { value: 0, max: 0 },
      defesa: { value: 18, base: 17 } // 18 - 1 = 17
    },
    resistencias: rojoTracos,
    resistenciasTexto: 'redução de corte, impacto e perfuração à metade (Cascudo)',
    pericias: rojoSkills,
    items: rojoItems,
    ataquescac: 'Duas pancadas +10 (1d8+5 impacto).',
    biography: rojoBio
  });

  // =========================================================================
  // 9. MANTÍCORA ZUMBI (ND 3) - Morto-vivo Grande (Garras + Mordida + Fraqueza Zumbi)
  // =========================================================================
  const manticoraId = 'gq8231ManticZumb';
  console.log(`Configurando Mantícora Zumbi [${manticoraId}]...`);
  const manticoraSkills = buildSkills(3, { for: 6, des: 0, con: 4, int: -5, sab: -1, car: 0 }, {
    inic: 4,
    perc: 3,
    fort: 14,
    refl: 4,
    vont: 9,
    luta: 16,
    pont: 16
  });

  const manticoraTracos = buildTracos({
    tamanho: 'grd',
    icValue: ['mental'],
    idiomasValue: []
  });

  const manticoraItems = [
    buildWeaponAttack({
      name: 'Duas Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '1d8+8',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural (x2):</strong> Duas garras +16 (1d8+8 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d10+8',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Natural:</strong> Mordida +16 (1d10+8 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Espinhos',
      img: 'systems/tormenta20/icons/poderes/ameacas/espinho.webp',
      dano: '1d6+3',
      tipoDano: 'perfuração',
      danoExtra: '1d6',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'pont',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      alcance: 'médio',
      proposito: 'disparo',
      description: '<p><strong>Ataque à Distância:</strong> Espinhos +16 (1d6+3 perfuração mais 1d6 trevas, alcance médio).</p>'
    }),
    buildSpecialPower({
      name: 'Espinhos Putrefatos',
      img: 'systems/tormenta20/icons/poderes/ameacas/espinho.webp',
      type: 'poder',
      actionType: 'action',
      description: '<p>Uma vez por cena, a mantícora zumbi dispara 1d4 espinhos de sua cauda. Cada espinho atinge uma criatura em alcance médio, causando <strong>1d6+3 pontos de dano de perfuração e 1d6 pontos de dano de trevas</strong> (Ref CD 17 reduz todo o dano à metade).</p>'
    }),
    buildSpecialPower({
      name: 'Fraqueza Zumbi',
      img: 'systems/tormenta20/icons/poderes/ameacas/fraqueza-zumbi.webp',
      type: 'poder',
      actionType: 'passive',
      description: '<p>A mantícora zumbi sofre o dobro de dano de acertos críticos ou de ataques desferidos contra seu cérebro (Defesa 30).</p>'
    })
  ];

  const manticoraBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*As asas de couro estão esburacadas e o corpo felino exala podridão, soltando rugidos roucos de puro ódio.*"<br><span style="font-weight: bold; color: #800000;">&mdash; Noite no Picadeiro Sombrio</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Espalhem-se para não serem pegos todos pelo cone de espinhos podres; ela mira no centro do grupo sempre que possível."<br><span style="font-weight: bold; color: #006400;">&mdash; Domador de Feras</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A aterradora <span style="color: #800000; font-weight: bold;">Mantícora Zumbi</span> (ND 3) é a besta reanimada mantida sob grilhões por Morrise para ser liberada durante o clímax do espetáculo de Tenebra.</p>`;

  actorsToInject.push({
    id: manticoraId,
    name: 'Mantícora Zumbi',
    nd: '3',
    papel: 'morto-vivo',
    tipoMonstro: 'mor',
    raca: 'Morto-vivo',
    tamanho: 'grd',
    deslocamento: '6m (4q), voo 9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: { for: 6, des: 0, con: 4, int: -5, sab: -1, car: 0 },
    attributes: {
      cd: 17,
      pv: { value: 27, max: 27 },
      pm: { value: 0, max: 0 },
      defesa: { value: 20, base: 20 } // 20 - 0 = 20
    },
    resistencias: manticoraTracos,
    resistenciasTexto: 'Fraqueza Zumbi (dobro de dano por acertos críticos ou cabeça)',
    pericias: manticoraSkills,
    items: manticoraItems,
    ataquescac: 'Duas garras +16 (1d8+8 corte) e mordida +16 (1d10+8 perfuração).',
    ataquesad: 'Espinhos Putrefatos (1d4 alvos em alcance médio, Ref CD 17, 1d6+3 perf + 1d6 trevas).',
    biography: manticoraBio
  });

  // =========================================================================
  // 10. MORRISE (ND 3) - Humanoide Médio (5 Magias Individuais + Passo Sombrio + Transferir)
  // =========================================================================
  const morriseId = 'gq8231MorriseAAA';
  console.log(`Configurando Morrise [${morriseId}]...`);
  const morriseSkills = buildSkills(3, { for: 1, des: 2, con: 0, int: 3, sab: 2, car: 5 }, {
    inic: 5,
    perc: 5,
    fort: 2,
    refl: 10,
    vont: 15,
    acro: 3,
    ades: 3,
    atua: 3,
    mist: 3,
    reli: 3,
    luta: 12
  });

  const morriseTracos = buildTracos({
    tamanho: 'med',
    idiomasValue: ['comum']
  });

  const morriseItems = [
    buildWeaponAttack({
      name: 'Chicote de Trevas',
      img: 'systems/tormenta20/icons/itens/equipamentos/chicote.webp',
      dano: '1d4+8',
      tipoDano: 'corte',
      danoExtra: '2d6',
      tipoDanoExtra: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Chicote +12 (1d4+8 corte, mais 2d6 trevas).</p>'
    }),
    buildSpecialPower({
      name: 'Estalo do Chicote',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/presenca-aterrorizante.webp',
      type: 'poder',
      actionType: 'action',
      description: '<p>Morrise gasta 2 PM para estalar seu chicote sombrio. Ele e todos os seus aliados em alcance curto recebem <strong>+2 em testes de perícia</strong> até o fim da cena.</p>'
    }),
    buildSpecialPower({
      name: 'Passo Sombrio',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
      type: 'poder',
      actionType: 'free',
      description: '<p>Morrise gasta 2 PM para se teletransportar como ação livre para um espaço desocupado em alcance curto.</p>'
    }),
    buildSpecialPower({
      name: 'Transferir Sofrimento',
      img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
      type: 'poder',
      actionType: 'reaction',
      description: '<p>Uma vez por rodada, quando Morrise sofre uma condição ou dano, como reação ele transfere para a mantícora zumbi.</p>'
    }),
    // 5 Magias de Conjurador Feiticeiro de 3º Nível (CD 20, 3 PM)
    buildSpellItem({
      name: 'Amedrontar',
      circulo: 1,
      tipo: 'arc',
      escola: 'nec',
      execucao: 'action',
      custoPM: 3,
      alcance: 'curto',
      alvo: '1 animal ou humanoide',
      duracao: 'scene',
      resistencia: 'Vontade parcial',
      description: '<p>Um animal ou humanoide em alcance curto fica apavorado por 1d4+1 rodadas e depois abalado (Von CD 20 reduz para abalado por 1d4 rodadas).</p>'
    }),
    buildSpellItem({
      name: 'Escuridão',
      circulo: 2,
      tipo: 'arc',
      escola: 'nec',
      execucao: 'action',
      custoPM: 3,
      alcance: 'curto',
      alvo: '1 objeto',
      duracao: 'scene',
      description: '<p>Até o fim da cena, um objeto em alcance curto emana escuridão total em um raio de 6m, bloqueando a visão na área e através dela.</p>'
    }),
    buildSpellItem({
      name: 'Infligir Ferimentos',
      circulo: 1,
      tipo: 'div',
      escola: 'nec',
      execucao: 'action',
      custoPM: 3,
      alcance: 'toque',
      alvo: '1 criatura',
      duracao: 'inst',
      resistencia: 'Fortitude reduz à metade',
      rolls: [{ name: 'Dano', type: 'dano', parts: [['3d8+3', 'trevas', '']] }],
      description: '<p>Uma criatura adjacente sofre 3d8+3 pontos de dano de trevas (Fort CD 20 reduz à metade).</p>'
    }),
    buildSpellItem({
      name: 'Raio do Enfraquecimento',
      circulo: 1,
      tipo: 'arc',
      escola: 'nec',
      execucao: 'action',
      custoPM: 3,
      alcance: 'curto',
      alvo: '1 criatura',
      duracao: 'scene',
      resistencia: 'Fortitude parcial',
      description: '<p>Uma criatura em alcance curto fica exausta (Fort CD 20 reduz para fatigada).</p>'
    }),
    buildSpellItem({
      name: 'Vitalidade Fantasma',
      circulo: 1,
      tipo: 'arc',
      escola: 'nec',
      execucao: 'action',
      custoPM: 3,
      alcance: 'pessoal',
      alvo: 'você',
      duracao: 'scene',
      description: '<p>Morrise recebe 3d10 PV temporários.</p>'
    })
  ];

  const morriseBio = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Ora, ora, ora. Temos um espetáculo diferente nesta bela noite! Além de um banquete de oferendas para minha Senhora, recebemos novos membros!*"<br><span style="font-weight: bold; color: #800000;">&mdash; Morrise, Mestre de Cerimônias</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Cuidado com o estalo do chicote: ele eleva a eficácia de todos os mortos-vivos no picadeiro. Se encurralado, tenta fugir pelas sombras."<br><span style="font-weight: bold; color: #006400;">&mdash; Selina, a Adivinha</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O fanático <span style="color: #800000; font-weight: bold;">Morrise</span> (ND 3) é o mestre de cerimônias do Circo Sombria e sacerdote oculto de Tenebra, combinando feitiços necromânticos e chicotadas de trevas.</p>`;

  actorsToInject.push({
    id: morriseId,
    name: 'Morrise',
    nd: '3',
    papel: 'humanoide',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Dobro',
    atributos: { for: 1, des: 2, con: 0, int: 3, sab: 2, car: 5 },
    attributes: {
      cd: 20,
      pv: { value: 70, max: 70 },
      pm: { value: 23, max: 23 },
      defesa: { value: 20, base: 18 } // 20 - 2 = 18
    },
    resistencias: morriseTracos,
    pericias: morriseSkills,
    items: morriseItems,
    ataquescac: 'Chicote +12 (1d4+8 corte, mais 2d6 trevas).',
    ataquesad: 'Estalo do Chicote (2 PM, +2 perícia em área), Magias (CD 20).',
    biography: morriseBio
  });

  // =========================================================================
  // PROCESSAMENTO E GRAVAÇÃO NO LEVELDB
  // =========================================================================
  console.log('\nGravando documentos no LevelDB...');

  for (const actor of actorsToInject) {
    // Purga subdocumentos legados para garantir idempotência estrita
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

    // 1. Gravar documento principal do ator
    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);

    // 2. Gravar subdocumentos embutidos
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }

    // 3. Espelhar em src/packs/Ameacas_T20
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${actor.name} (ND ${actor.nd})" salvo com ${built.embeddedDocs.length} subdocumentos.`);
  }

  await db.close();
  console.log('\n🎉 10 Ameaças da DB #231 injetadas com 100% de sucesso em Ameacas_T20!');
}

if (require.main === module) {
  injectThreats().catch(err => {
    console.error('❌ Erro na injeção de ameaças DB #231:', err);
    process.exit(1);
  });
}

module.exports = { injectThreats };

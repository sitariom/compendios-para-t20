#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 32: Como um Deus (RT20-032)
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const {
  buildItem,
  buildSkills,
  buildTracos,
  buildActiveEffect,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const ED32_PACKS_DIR = path.join(
  __dirname,
  '..',
  'packs',
  'revistas',
  'revista-tormenta-20',
  'fulgor-dos-deuses',
  'edicao-32'
);

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

async function openHierarchicalPack(packName) {
  const packDir = path.join(ED32_PACKS_DIR, packName);
  fs.mkdirSync(packDir, { recursive: true });
  const db = new ClassicLevel(packDir, { valueEncoding: 'json' });
  await db.open();
  return db;
}

// ============================================================================
// 1. AMEAÇAS & PERIGOS (rt20-032-ameacas)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças e Perigos da Edição 32 em rt20-032-ameacas ---');
  const db = await openHierarchicalPack('rt20-032-ameacas');

  const threats = [];

  // 1. Turba Enfurecida (ND 10)
  const turbaAtr = { for: 3, des: 0, con: 2, int: 0, sab: 1, car: 0 };
  const turbaSkills = buildSkills(10, turbaAtr, {
    inic: 5,
    perc: 6,
    fort: 21,
    refl: 16,
    vont: 11,
    luta: 34,
    ades: 9,
    reli: 10,
    ofic_fazendeiro: 9
  });
  const turbaTracos = buildTracos({ tamanho: 'col' });
  const turbaItems = [
    buildWeaponAttack({
      name: '[bando] Ataque Desarmado',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/briga.webp',
      dano: '2d6+5',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> [bando] Ataque desarmado x2 +34 (2d6+5 impacto).</p>',
      flavorPhrase: '"Ele nos salvou! Se precisamos sangrar para agradecer… então sangraremos!"',
      flavorAction: 'A multidão enfurecida avança em massa com ferramentas e símbolos sagrados'
    }),
    buildSpecialPower({
      name: 'Enxame',
      img: 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-pestes.webp',
      execucao: 'passive',
      custo: 0,
      rolls: [
        { name: 'Dano de Enxame', key: 'dano0', type: 'dano', parts: [['4d6+5', 'impacto', '']] }
      ],
      description: '<p>4d6+5 pontos de dano de impacto. Cada 10 pontos de dano letal causados à multidão resultam em uma vítima fatal. Testes de Perícias Úteis exigem ação padrão (7 sucessos dispersam a turba).</p>'
    }),
    buildSpecialPower({
      name: 'Devolver Favor',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Uma vez por rodada, se a turba enfurecida passar num teste de resistência contra um efeito hostil, ele é revertido contra o causador.</p>'
    }),
    buildSpecialPower({
      name: 'Empilhar',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        { name: 'Empilhar (+44)', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['10', '', '']] }
      ],
      description: '<p>(Livre) Se a turba enfurecida acertar um ataque desarmado, poderá fazer um teste de manobra oposto à vítima do ataque (teste +44). Se a vítima perder, fica agarrada pela turba e caída, e não pode se levantar até vencer num teste para se livrar do agarrão do bando.</p>'
    }),
    buildSpecialPower({
      name: 'Retribuição Raivosa',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Uma vez por rodada, quando sofre dano de um ataque corpo a corpo, a turba pode usar uma ação agredir contra o atacante.</p>'
    })
  ];

  threats.push({
    id: 'fld32TurbaEnfure',
    name: 'Turba Enfurecida',
    img: 'systems/tormenta20/icons/ameacas/guarda-de-cidade.png',
    nd: '10',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'col',
    deslocamento: '9m (6q)',
    sentidos: 'visão normal',
    tesouro: 'Metade.',
    atributos: turbaAtr,
    attributes: {
      pv: { value: 120, max: 120 },
      pm: { value: 0, max: 0 },
      defesa: { value: 32, base: 32 },
      cd: 25
    },
    resistencias: turbaTracos,
    resistenciasTexto: 'Nenhuma',
    pericias: turbaSkills,
    items: turbaItems,
    ataquescac: '[bando] Ataque desarmado x2 +34 (2d6+5)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/turba-enfurecida.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Ele nos salvou! Se precisamos sangrar para agradecer… então sangraremos!"<br /><span style="font-weight:bold;color:#800000">— Turba Enfurecida</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Gente comum de Santa Graça, tomada pelo desespero da dívida! Cada 10 de dano letal mata um inocente — tivemos que dispersá-los com 7 sucessos de diplomacia e perícia antes de esmagarem o grupo sob uma montanha de gente!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">A <span style="color:#800000;font-weight:bold">Turba Enfurecida</span> reúne habitantes comuns de Santa Graça tomados pela compulsão da gratidão deturpada.</p>`
  });

  // 2. Vigia da Devolução (ND 7)
  const vigiaAtr = { for: 3, des: 0, con: 4, int: -1, sab: 1, car: 0 };
  const vigiaSkills = buildSkills(7, vigiaAtr, {
    inic: 3,
    perc: 5,
    fort: 15,
    refl: 6,
    vont: 20,
    luta: 24,
    atle: 8,
    reli: 6
  });
  const vigiaTracos = buildTracos({ tamanho: 'med', rdGeral: 5 });
  const vigiaItems = [
    buildWeaponAttack({
      name: 'Dois Manguais',
      img: 'systems/tormenta20/icons/itens/equipamentos/mangual.webp',
      dano: '2d8+11',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      proposito: 'corpo-a-corpo',
      alcance: 'spec',
      ataques: 2,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']] },
        { name: 'Dano', key: 'dano1', type: 'dano', parts: [['2d8+11', 'impacto', '']] }
      ],
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Dois manguais +24 (2d8+11 impacto, alcance 3m).</p>',
      flavorPhrase: '"A dívida foi reconhecida. A recusa será corrigida."',
      flavorAction: 'Correntes e manguais equilibrados descem com precisão ritualística'
    }),
    buildSpecialPower({
      name: 'Correntes da Gratidão',
      img: 'systems/tormenta20/icons/poderes/ameacas/derrubar.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        { name: 'Derrubar / Desarmar (+30)', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['6', '', '']] }
      ],
      description: '<p>O alcance do ataque de mangual do vigia da devolução é de 3m. Além disso, quando acerta um ataque de mangual, pode usar uma ação livre para fazer uma manobra de derrubar ou desarmar contra o alvo do ataque (teste +30).</p>'
    }),
    buildSpecialPower({
      name: 'Devolução Fullgori',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-divino.webp',
      execucao: 'reaction',
      custo: 0,
      rolls: [
        { name: 'Dano Extra de Luz', key: 'dano0', type: 'dano', parts: [['2d8', 'luz', '']] }
      ],
      description: '<p>(Reação) Uma vez por rodada, quando sofre dano de um inimigo adjacente, o vigia da devolução pode fazer um ataque de mangual que causa +2d8 pontos de dano de luz contra o atacante.</p>'
    }),
    buildSpecialPower({
      name: 'Fanatismo Fullgori',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/durao.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O vigia da devolução não fica inconsciente quando é reduzido a 0 PV ou menos e só morre quando é reduzido a –30 PV.</p>'
    }),
    buildSpecialPower({
      name: 'Lutar em Formação',
      img: 'systems/tormenta20/icons/ameacas/sargento-da-guarda.png',
      execucao: 'passive',
      custo: 0,
      description: '<p>Se o vigia da devolução estiver adjacente a um aliado que também possua este poder, recebe +2 em testes de ataque e Defesa.</p>'
    })
  ];

  threats.push({
    id: 'fld32VigiaDevolu',
    name: 'Vigia da Devolução',
    img: 'systems/tormenta20/icons/ameacas/sargento-da-guarda.png',
    nd: '7',
    papel: 'lacaio',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão normal',
    tesouro: 'Metade.',
    equipamento: 'Armadura completa reforçada, mangual equilibrado, símbolo sagrado de Eucharion.',
    atributos: vigiaAtr,
    attributes: {
      pv: { value: 60, max: 60 },
      pm: { value: 0, max: 0 },
      defesa: { value: 28, base: 28 },
      cd: 20
    },
    resistencias: vigiaTracos,
    resistenciasTexto: 'redução de dano 5',
    pericias: vigiaSkills,
    items: vigiaItems,
    ataquescac: 'Dois manguais +24 (2d8+11)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/vigia-da-devolucao.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"A dívida foi reconhecida. A recusa será corrigida."<br /><span style="font-weight:bold;color:#800000">— Vigia da Devolução</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Armaduras claras riscadas de ouro que continuam lutando mesmo abaixo de zero PV! Se ficarem lado a lado, o escudo de corrente deles fecha a rua inteira!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">Os <span style="color:#800000;font-weight:bold">Vigias da Devolução</span> compõem a milícia sagrada do Templo de Eucharion em Santa Graça.</p>`
  });

  // 3. Lysenne de Eucharion (ND 10)
  const lysAtr = { for: 2, des: 5, con: 1, int: 2, sab: 2, car: 5 };
  const lysSkills = buildSkills(10, lysAtr, {
    inic: 14,
    perc: 13,
    fort: 10,
    refl: 18,
    vont: 20,
    luta: 28,
    acro: 14,
    cura: 11,
    dipl: 14,
    reli: 11
  });
  const lysTracos = buildTracos({ tamanho: 'med' });
  const lysItems = [
    buildWeaponAttack({
      name: 'Duas Espadas Longas',
      img: 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
      dano: '2d8+15',
      tipoDano: 'corte',
      criticoMargem: 18,
      periciaAtaque: 'luta',
      ataques: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Duas espadas longas +28 (2d8+15, 18).</p>',
      flavorPhrase: '"Cada golpe meu é um agradecimento."',
      flavorAction: 'Lysenne gira com suas duas espadas longas de mitral em defesa de seu deus'
    }),
    buildSpecialPower({
      name: 'Ataque em Movimento',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/esquiva-sagaz.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Lysenne pode se mover antes e depois de executar a ação agredir, desde que a distância total percorrida não seja maior que seu deslocamento.</p>'
    }),
    buildSpecialPower({
      name: 'Aura Sagrada',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/aura-sagrada.webp',
      execucao: 'free',
      custo: 1,
      alcance: 'short',
      area: 'aura de 9m de raio',
      duracao: 'sust',
      effects: [
        buildActiveEffect({
          id: 'eff32LysAuraSagr',
          name: 'Aura Sagrada (+5 Testes de Resistência)',
          img: 'systems/tormenta20/icons/poderes/classes/combatentes/aura-sagrada.webp',
          transfer: true,
          disabled: true,
          changes: [
            { key: 'system.modificadores.pericias.resistencia', mode: 2, value: '5', priority: 20 }
          ]
        })
      ],
      description: '<p>(Livre, 1 PM, sustentada) Lysenne gera uma aura de luz com 9m de raio. Ela e seus aliados dentro da aura recebem +5 em testes de resistência e curam 10 PV no início dos turnos dela.</p>'
    }),
    buildSpecialPower({
      name: 'Cura pelas Mãos',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/cura-pelas-maos.webp',
      execucao: 'move',
      custo: 3,
      alcance: 'short',
      rolls: [
        { name: 'Cura pelas Mãos', key: 'dano0', type: 'dano', parts: [['6d6+3', 'curapv', '']] }
      ],
      description: '<p>(Movimento, 3 PM) Lysenne cura 6d6+3 pontos de vida de uma criatura em alcance curto.</p>'
    }),
    buildSpecialPower({
      name: 'Golpe Divino',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-divino.webp',
      execucao: 'free',
      custo: 4,
      rolls: [
        { name: 'Dano de Golpe Divino', key: 'dano0', type: 'dano', parts: [['3d8', 'luz', '']] }
      ],
      description: '<p>(Livre, 4 PM) Quando faz um ataque corpo a corpo, Lysenne soma o Carisma (+5) no teste de ataque e +3d8 na rolagem de dano.</p>'
    }),
    buildSpecialPower({
      name: 'Retribuição Divina',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Uma vez por rodada, quando Lysenne ou um aliado dela é atingido por um ataque corpo a corpo de uma criatura dentro do alcance corpo a corpo dela, Lysenne faz um ataque corpo a corpo contra o atacante.</p>'
    })
  ];

  threats.push({
    id: 'fld32LysenneEuch',
    name: 'Lysenne de Eucharion',
    img: 'systems/tormenta20/icons/classes/paladino.webp',
    nd: '10',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (elfo)',
    tamanho: 'med',
    deslocamento: '12m (8q)',
    sentidos: 'visão na penumbra',
    tesouro: 'Padrão.',
    equipamento: 'Armadura completa delicada de mitral, espada longa precisa de mitral x2, símbolo sagrado de Eucharion.',
    atributos: lysAtr,
    attributes: {
      pv: { value: 400, max: 400 },
      pm: { value: 45, max: 45 },
      defesa: { value: 36, base: 31 }, // 36 - Des 5 = 31
      cd: 25
    },
    resistencias: lysTracos,
    resistenciasTexto: 'Nenhuma',
    pericias: lysSkills,
    items: lysItems,
    ataquescac: 'Duas espadas longas +28 (2d8+15, 18)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/lysenne-de-eucharion.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Eu sobrevivi quando não havia razão. Desde então, cada batida do meu coração pertence a ele."<br /><span style="font-weight:bold;color:#800000">— Lysenne, Campeã de Eucharion</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Sobrevivente da queda de Lenórienn, armada com duas espadas longas de mitral! Ela acreditava estar protegendo o único deus que lhe deu paz — até no último suspiro!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Lysenne de Eucharion</span> é a única campeã do Deus Menor da Gratidão.</p>`
  });

  // 4. Eucharion do Fullgor (ND 13)
  const eucAtr = { for: 4, des: 0, con: 6, int: 0, sab: 10, car: 5 };
  const eucSkills = buildSkills(13, eucAtr, {
    inic: 6,
    perc: 6,
    fort: 20,
    refl: 13,
    vont: 26,
    luta: 34,
    conh: 10,
    cura: 10,
    dipl: 10,
    intu: 10,
    reli: 10
  });
  const eucTracos = buildTracos({
    tamanho: 'col',
    rdGeral: 10,
    ic: ['caido', 'flanqueado', 'veneno', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const eucItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '2d8+10',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 1,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Pancada +34 (2d8+10 impacto).</p>',
      flavorPhrase: '"MOSTREM, CAMPEÕES — O QUE VALE MAIS QUE A DÍVIDA?"',
      flavorAction: 'O colossal coração cristalino pulsa desferindo uma onda de choque esmagadora'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM desta forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Coração Avassalador',
      img: 'systems/tormenta20/icons/poderes/ameacas/varrer.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>A cada ação agredir, Eucharion pode fazer um ataque de pancada contra cada criatura em seu alcance ou dois ataques contra um único alvo.</p>'
    }),
    buildSpecialPower({
      name: 'De Nada',
      img: 'systems/tormenta20/icons/magias/bencao.webp',
      execucao: 'reaction',
      custo: 0,
      alcance: 'medium',
      description: '<p>(Reação) Uma vez por rodada, se uma criatura em alcance médio for alvo de um efeito benéfico, Eucharion recebe os mesmos benefícios. (Cancelada se o ritual na Parte 2, Cena 1 foi desbaratado.)</p>'
    }),
    buildSpecialPower({
      name: 'Devolver Favor',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Uma vez por rodada, se Eucharion passar num teste de resistência contra um efeito hostil, ele é revertido contra o causador.</p>'
    }),
    buildSpecialPower({
      name: 'Magia Acelerada',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'free',
      custo: 4,
      description: '<p>(Livre, +4 PM) Uma vez por rodada, quando lança uma magia com execução de ação completa ou menor, Eucharion muda a execução dela para livre.</p>'
    }),
    buildSpecialPower({
      name: 'Magia Ampliada',
      img: 'systems/tormenta20/icons/poderes/concedidos-magia.webp',
      execucao: 'free',
      custo: 2,
      description: '<p>(Livre, +2 PM) Quando lança uma magia, Eucharion aumenta seu alcance em um passo ou dobra sua área de efeito.</p>'
    }),
    buildSpecialPower({
      name: 'Remorso Ingrato',
      img: 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      alcance: 'short',
      cd: 33,
      resistencia: { pericia: 'vont', atributo: 'sab', bonus: 0, txt: 'Vontade CD 33 reduz o dano à metade e evita a condição frustrado' },
      description: '<p>No início de cada turno de Eucharion, se ele tiver sofrido dano na rodada anterior, todos inimigos em alcance curto dele sofrem metade de todo dano sofrido por ele em dano psíquico e ficam frustrados (Vontade CD 33 reduz o dano à metade e evita a condição). (Cancelada se 2+ personagens venceram Terrível Gratidão.)</p>'
    }),
    buildSpecialPower({
      name: 'Retribuir Favor',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      execucao: 'reaction',
      custo: 0,
      alcance: 'short',
      description: '<p>(Reação) Uma vez por rodada, se Eucharion for o único alvo de um efeito benéfico, todas as criaturas em alcance curto dele recebem o mesmo benefício.</p>'
    }),
    buildSpellItem({
      name: 'Comando',
      img: 'systems/tormenta20/icons/magias/comando.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 8,
      alcance: 'short',
      alvo: '4 criaturas',
      duracao: 'turn',
      resistencia: 'Vontade evita',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 8 PM) No início do seu próximo turno, quatro criaturas em alcance curto ficam caídas e não podem se levantar até o início do seu turno seguinte (Von evita).</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 10,
      alcance: 'short',
      alvo: '1 criatura adjacente ou criaturas em alcance curto',
      duracao: 'inst',
      rolls: [
        { name: 'Cura Adjacente', key: 'dano0', type: 'dano', parts: [['11d8+11', 'curapv', '']] },
        { name: 'Cura em Área', key: 'dano1', type: 'dano', parts: [['6d8+6', 'curapv', '']] }
      ],
      description: '<p>(Padrão, 10 PM) Uma criatura adjacente cura 11d8+11 PV ou criaturas escolhidas em alcance curto curam 6d8+6.</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Dispersar as Trevas',
      img: 'systems/tormenta20/icons/magias/dispersar-trevas.webp',
      circulo: 3,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 8,
      alcance: 'self',
      area: 'esfera de 6m ao redor',
      duracao: 'scene',
      description: '<p>(Padrão, 8 PM) Teste de Religião dissipa magias até 3º círculo na esfera de 6m; aliados recebem +5 em TR e RD trevas 10 até o fim da cena e inimigos ficam cegos por 1d4 rodadas (1x/cena).</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Imobilizar',
      img: 'systems/tormenta20/icons/magias/imobilizar.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 9,
      alcance: 'short',
      alvo: 'até 2 animais, espíritos ou humanoides',
      duracao: 'scene',
      resistencia: 'Vontade muda para lenta',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 9 PM) Até dois animais, espíritos ou humanoides em alcance curto ficam paralisados (Von muda para lenta; nova tentativa exige ação completa).</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Marca da Obediência',
      img: 'systems/tormenta20/icons/magias/marca-da-obediencia.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 6,
      alcance: 'touch',
      alvo: '1 criatura adjacente',
      duracao: 'scene',
      formulaDano: '3d6',
      tipoDano: 'psiquico',
      resistencia: 'Vontade evita',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 6 PM) Ordena que uma criatura adjacente não ataque Eucharion ou aliados até o fim da cena (Von evita). Falhar nos testes subsequentes causa 3d6 de dano psíquico.</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Raio Solar',
      img: 'systems/tormenta20/icons/magias/raio-solar.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 9,
      alcance: 'long',
      area: 'linha de 30m',
      duracao: 'inst',
      rolls: [
        { name: 'Dano de Luz', key: 'dano0', type: 'dano', parts: [['7d8', 'luz', '']] },
        { name: 'Dano vs Mortos-Vivos', key: 'dano1', type: 'dano', parts: [['7d12', 'luz', '']] }
      ],
      resistencia: 'Reflexos reduz à metade e evita ofuscado',
      resistenciaPericia: 'refl',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 9 PM) Criaturas em linha de 30m sofrem 7d8 pontos de dano de luz (7d12 vs. mortos-vivos) e ficam ofuscadas por 1 rodada (Ref reduz à metade e evita condição).</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Santuário',
      img: 'systems/tormenta20/icons/magias/santuario.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 10,
      alcance: 'touch',
      alvo: '1 criatura',
      duracao: 'scene',
      resistencia: 'Vontade evita',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 10 PM) Qualquer criatura que tente ação hostil contra o alvo protegido até o fim da cena perde a ação (Von evita).</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    }),
    buildSpellItem({
      name: 'Selo de Mana',
      img: 'systems/tormenta20/icons/magias/selo-de-mana.webp',
      circulo: 3,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 6,
      alcance: 'touch',
      alvo: '1 criatura adjacente',
      duracao: 'scene',
      resistencia: 'Vontade permite agir',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 6 PM) Manifesta selo mágico na criatura até o fim da cena. Ao gastar PM, deve passar em Vontade ou a ação falha mesmo gastando os PM.</p>',
      source: 'Fúlgor dos Deuses — Edição 32'
    })
  ];

  threats.push({
    id: 'fld32EucharionFu',
    name: 'Eucharion do Fullgor',
    img: 'systems/tormenta20/icons/magias/aura-divina.webp',
    nd: '13',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori, deus menor)',
    tamanho: 'col',
    deslocamento: '3m (2q)',
    sentidos: 'percepção às cegas',
    tesouro: 'Padrão. (Deixa 10d6+10 estilhas cristalinas ao ser destruído.)',
    atributos: eucAtr,
    attributes: {
      pv: { value: 455, max: 455 },
      pm: { value: 101, max: 101 },
      defesa: { value: 42, base: 42 },
      cd: 37
    },
    resistencias: eucTracos,
    resistenciasTexto: 'imunidade a caído, flanqueado e veneno, maior que a morte, redução de dano 10, resistência a magia +5',
    pericias: eucSkills,
    items: eucItems,
    ataquescac: 'Pancada +34 (2d8+10)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/eucharion-do-fullgor.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Eu aceitei. Eu salvei. Eu abençoei. MAS VOCÊS AINDA VIVEM."<br /><span style="font-weight:bold;color:#800000">— Eucharion do Fullgor</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um coração cristalino colossal pulsando sobre o altar de Santa Graça! Revertia nossos feitiços, copiava nossas bênçãos e chorava dor psíquica a cada golpe — até quebrar o último fio do Fullgor!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Eucharion do Fullgor</span> é o Deus Menor da Gratidão (Status Divino 4) integralmente tomado pelo Fullgor.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: null,
      nd: t.nd,
      cd: t.attributes.cd,
      papel: t.papel,
      tipoMonstro: t.tipoMonstro,
      raca: t.raca,
      tamanho: t.tamanho,
      deslocamento: t.deslocamento,
      sentidos: t.sentidos,
      tesouro: t.tesouro,
      atributos: t.atributos,
      attributes: t.attributes,
      resistencias: t.resistencias,
      resistenciasTexto: t.resistenciasTexto,
      pericias: t.pericias,
      items: t.items,
      ataquescac: t.ataquescac || '',
      equipamento: t.equipamento || '',
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });
    built.actorDoc.img = t.img;
    built.actorDoc.folder = null;

    for await (const [oldKey] of db.iterator({ gte: `!actors.items!${t.id}.`, lte: `!actors.items!${t.id}.\uffff` })) {
      await db.del(oldKey);
    }
    for await (const [oldEffKey] of db.iterator({ gte: `!actors.items.effects!${t.id}.`, lte: `!actors.items.effects!${t.id}.\uffff` })) {
      await db.del(oldEffKey);
    }

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo em rt20-032-ameacas com ${built.embeddedDocs.length} subdocumentos.`);
  }

  // 5. Perigos Complexos (Hazards ND 12)
  const hazards = [
    {
      id: 'fld32GracasReceb',
      name: 'Graças Recebidas (Perigo Complexo ND 12)',
      nd: '12',
      img: 'systems/tormenta20/icons/itens/gerais/tomo-hermetico.webp',
      token: 'modules/compendios-para-t20/assets/tokens/turba-enfurecida.png',
      goal: 'Percorrer Santa Graça reunindo relatos de milagres de Eucharion, identificando padrões de exigência crescente antes que a situação saia de controle.',
      effects: 'Acumular 4 sucessos antes de 3 falhas (cada perícia testada apenas 1 vez; viagem convencional inicia com 2 falhas, voo com 1 falha, Teletransporte elimina). 1ª falha: –2 nos testes seguintes. 2ª falha: todas CDs aumentam +5. 3ª falha: confronto com Turba Enfurecida.',
      actions: `
        <li><strong>Atuação CD 25:</strong> Participar de ritual público sem despertar suspeitas.</li>
        <li><strong>Conhecimento CD 25:</strong> Reconhecer padrões históricos de cultos colapsados.</li>
        <li><strong>Diplomacia CD 25:</strong> Ouvir devotos sem julgamento para revelar o custo real das graças.</li>
        <li><strong>Intuição CD 25:</strong> Sentir quando a devoção virou obrigação sufocante.</li>
        <li><strong>Intimidação CD 30:</strong> Pressionar devotos (falha conta como duas falhas).</li>
        <li><strong>Investigação CD 30:</strong> Cruzar relatos, datas e oferendas sistemáticas.</li>
        <li><strong>Percepção CD 30:</strong> Notar exaustão, automutilação ritualística ou medo reprimido.</li>
        <li><strong>Religião CD 25:</strong> Interpretar orações e identificar distorções da gratidão.</li>
        <li><strong>Vontade CD 25:</strong> Manter distância emocional diante de histórias comoventes.</li>
      `
    },
    {
      id: 'fld32Turbulencia',
      name: 'Turbulência em Santa Graça (Perigo Complexo ND 12)',
      nd: '12',
      img: 'systems/tormenta20/icons/magias/terremoto.webp',
      token: 'modules/compendios-para-t20/assets/tokens/vigia-da-devolucao.png',
      goal: 'Atravessar a destruição de Santa Graça após a queda de Lysenne e alcançar o Templo de Eucharion.',
      effects: 'Acumular 5 sucessos (sem limite de falhas). 1ª falha: quem falhou sofre 10d6 (metade impacto, metade psíquico). 2ª falha em diante: todos sofrem 10d6 (metade impacto, metade psíquico). Chegar sem falhas concede +5 em Iniciativa contra Eucharion.',
      actions: `
        <li><strong>Acrobacia ou Reflexos CD 25:</strong> Manobrar por telhados instáveis e evitar desabamentos.</li>
        <li><strong>Atletismo CD 25:</strong> Correr entre escombros e saltar fendas.</li>
        <li><strong>Atuação ou Diplomacia CD 30:</strong> Apelar à humanidade dos cidadãos.</li>
        <li><strong>Fortitude CD 30:</strong> Avançar ignorando a dor de ataques e detritos.</li>
        <li><strong>Guerra ou Iniciativa CD 30:</strong> Antecipar o movimento da cidade viva.</li>
        <li><strong>Intimidação CD 30:</strong> Amedrontar devotos exaltados para abrir caminho.</li>
        <li><strong>Luta ou Pontaria CD 25:</strong> Abater fanáticos ou destruir detritos.</li>
        <li><strong>Misticismo CD 30:</strong> Anular efeitos mágicos localizados em ruínas hostis.</li>
        <li><strong>Percepção CD 25:</strong> Identificar pontos perigosos e armadilhas improvisadas.</li>
        <li><strong>Religião CD 25:</strong> Prever onde a fúria de Eucharion se manifestará.</li>
        <li><strong>Vontade CD 30:</strong> Resistir à pressão espiritual para "pagar a dívida".</li>
      `
    }
  ];

  for (const hz of hazards) {
    const built = buildHazardActor({
      name: hz.name,
      nd: hz.nd,
      img: hz.img,
      folder: null,
      goal: hz.goal,
      effects: hz.effects,
      actions: hz.actions
    });
    built.actorDoc._id = hz.id;
    built.actorDoc.img = hz.img;
    built.actorDoc.folder = null;
    built.actorDoc.prototypeToken.texture.src = hz.token;
    await db.put(`!actors!${hz.id}`, built.actorDoc);
    console.log(`✓ Perigo "${hz.name}" salvo em rt20-032-ameacas.`);
  }

  await db.close();
}

// ============================================================================
// 2. EQUIPAMENTOS & PODERES / PARCEIROS
// ============================================================================
async function saveItemToPack(db, def) {
  const rawEffects = def.rawEffects || [];
  const builtEffects = [];
  const effectIds = [];

  for await (const [oldEffKey] of db.iterator({ gte: `!items.effects!${def._id}.`, lte: `!items.effects!${def._id}.\uffff` })) {
    await db.del(oldEffKey);
  }

  for (const eff of rawEffects) {
    const effDoc = buildActiveEffect({
      id: eff._id,
      name: eff.name,
      img: def.img,
      origin: `Item.${def._id}`,
      changes: eff.changes || [],
      transfer: eff.transfer !== undefined ? eff.transfer : true,
      disabled: eff.disabled !== undefined ? eff.disabled : false
    });
    builtEffects.push(effDoc);
    effectIds.push(effDoc._id);
    await db.put(`!items.effects!${def._id}.${effDoc._id}`, effDoc);
  }

  const built = buildItem({
    name: def.name,
    type: def.type,
    img: def.img,
    description: def.description,
    folder: null,
    system: def.system,
    rolls: def.rolls || []
  });
  built._id = def._id;
  built.img = def.img;
  built.folder = null;
  built.effects = effectIds;
  built._stats = statsHeader;

  await db.put(`!items!${def._id}`, built);
  console.log(`✓ Item "${def.name}" salvo com ${builtEffects.length} efeitos.`);
}

async function injectItemsAndPowers() {
  console.log('\n--- Injetando Artefato, Poderes e Parceiros da Edição 32 ---');
  const eqDb = await openHierarchicalPack('rt20-032-equipamentos');
  const pwDb = await openHierarchicalPack('rt20-032-poderes');

  const equipamentos = [
    {
      _id: 'fld32PingenteCor',
      name: 'Pingente da Gratidão Pura (Artefato de Eucharion)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-da-telepatia.webp',
      description: `<p><strong>Relíquia Santa (Gratidão Final, Edição 32, p. 17):</strong> Um pingente delicado em formato de coração forjado das energias celestiais finais de Eucharion.</p>
<ul>
  <li>Torna seu portador <strong>imune às condições exausto, debilitado, lento e vulnerável</strong>.</li>
  <li>Fornece ao portador o poder concedido <strong>Dívida Sagrada</strong> (uma vez por rodada, ao receber um efeito benéfico, pague 2 PM para conceder o mesmo efeito a um aliado em alcance curto).</li>
  <li>Deve ser vestido para fornecer seu benefício.</li>
</ul>`,
      system: {
        tipo: 'acessorio',
        equipado2: { slot: 0, type: 'body' },
        preco: 0,
        peso: 0.2,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 32'
      },
      rawEffects: [
        {
          _id: 'eff32PingenteImu',
          name: 'Pingente da Gratidão Pura (Imunidades)',
          changes: [
            { key: 'system.tracos.ic.value', mode: 2, value: 'exausto', priority: 20 },
            { key: 'system.tracos.ic.value', mode: 2, value: 'debilitado', priority: 20 },
            { key: 'system.tracos.ic.value', mode: 2, value: 'lento', priority: 20 },
            { key: 'system.tracos.ic.value', mode: 2, value: 'vulneravel', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld32EstilhaFull',
      name: 'Estilhas Cristalinas do Fullgor (Edição 32)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      description: `<p><strong>Resíduo Fullgori (Como um Deus, p. 16):</strong> Ao destruir o coração cristalino de <em>Eucharion do Fullgor</em>, restam <strong>10d6+10 estilhas cristalinas</strong> utilizáveis na forja litúrgica de Aço Sillariano.</p>`,
      system: {
        tipo: 'acessorio',
        equipado2: { slot: 0, type: 'body' },
        preco: 0,
        peso: 0.1,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 32'
      },
      rawEffects: []
    }
  ];

  const poderes = [
    {
      _id: 'fld32DividaSagra',
      name: 'Dívida Sagrada (Poder Concedido — Eucharion)',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      description: `<p><strong>Novo Poder Concedido (Eucharion, Edição 32, p. 20):</strong> Uma vez por rodada, quando recebe um efeito benéfico, você pode pagar <strong>2 PM</strong> para conceder o mesmo efeito a um aliado em alcance curto.</p>`,
      system: {
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'free', custo: 2 },
        alcance: 'short',
        source: 'Fúlgor dos Deuses — Edição 32'
      },
      rawEffects: []
    },
    {
      _id: 'fld32ParcLysenne',
      name: 'Parceira: Lysenne de Eucharion (Guardiã Mestre & Combatente Veterana)',
      type: 'poder',
      img: 'systems/tormenta20/icons/classes/paladino.webp',
      description: `<p><strong>Recompensa por Ressuscitar Lysenne (Gratidão Final, Edição 32, p. 17):</strong> Desperta livre do peso que a acorrentava, Lysenne torna-se parceira <strong>Guardiã Mestre (+4 na Defesa)</strong> e <strong>Combatente Veterana (+2 em testes de ataque e rolagens de dano)</strong>.</p>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 32'
      },
      rawEffects: [
        {
          _id: 'eff32LysenneParc',
          name: 'Lysenne — Guardiã Mestre & Combatente Veterana',
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '4', priority: 20 },
            { key: 'system.modificadores.ataque.geral', mode: 2, value: '2', priority: 20 },
            { key: 'system.modificadores.dano.geral', mode: 2, value: '2', priority: 20 }
          ]
        }
      ]
    }
  ];

  for (const eq of equipamentos) await saveItemToPack(eqDb, eq);
  for (const pw of poderes) await saveItemToPack(pwDb, pw);

  await eqDb.close();
  await pwDb.close();
}

// ============================================================================
// 3. DIÁRIO (rt20-032-diarios)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diário da Edição 32 em rt20-032-diarios ---');
  const db = await openHierarchicalPack('rt20-032-diarios');

  const journalId = 'fld32DiarioComoD';
  const pageIds = [
    'p32SinopseAvent1',
    'p32Parte1Divida1',
    'p32Parte2RuasCo1',
    'p32Parte3Sangue1',
    'p32Parte4Morrer1',
    'p32RegrasEuchar1',
    'p32BestiarioNpc1'
  ];

  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 32: Como um Deus',
    folder: null,
    sort: 400000,
    ownership: { default: -1 },
    pages: pageIds,
    flags: {},
    _stats: statsHeader
  };

  const pages = [
    {
      _id: pageIds[0],
      name: '1. Sinopse & Visão Geral',
      type: 'text',
      sort: 100000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Fúlgor dos Deuses — Edição 32: Como um Deus</h2>
<p><strong>Criação:</strong> Marcelo Cassaro • <strong>Desenvolvimento:</strong> Daniel Duran (Outubro de 2026)</p>
<p>Aventura para personagens de <strong>12º nível</strong>. Arsenal ordena a destruição irreversível de <strong>Eucharion</strong>, o Deus Menor da Gratidão, completamente tomado pelo Fullgor em <strong>Santa Graça</strong> (Repúblicas Livres de Sambúrdia). Ao final, os heróis chegam ao <strong>13º nível</strong> rumo a <em>Visita à Memória</em>.</p>`
      }
    },
    {
      _id: pageIds[1],
      name: '2. Parte 1: Dívida Sagrada',
      type: 'text',
      sort: 200000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 1: Dívida Sagrada</h2>
<h3>Cena 1 — Ordem sem Consolo</h3>
<p>Thalgrimm confirma a execução (A Igreja de Arsenal fornece T$ 3.000 em itens alquímicos e poções). Liriavel pode conjurar <em>Teletransporte</em> até Santa Graça (ou Misticismo CD 40).</p>
<h3>Cena 2 — Santa Graça</h3>
<p>Investigação via @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32GracasReceb]{Graças Recebidas (ND 12)} (4 sucessos antes de 3 falhas).</p>
<h3>Cena 3 — Gratidão Perigosa</h3>
<p>Confronto contra a @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32TurbaEnfure]{Turba Enfurecida (ND 10)}: 7 sucessos de Perícias Úteis dispersam a multidão sem vítimas (cada 10 de dano letal gera 1 vítima fatal). Use @UUID[Compendium.compendios-para-t20.rt20-032-tabelas.RollTable.fld32TabFrasesTu]{Frases da Turba}.</p>`
      }
    },
    {
      _id: pageIds[2],
      name: '3. Parte 2: Ruas Conturbadas',
      type: 'text',
      sort: 300000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 2: Ruas Conturbadas</h2>
<h3>Cena 1 — Ritual Irrecusável</h3>
<p>Turba Enfurecida + alto sacerdote (<em>Guia de NPCs</em>, p. 69). Desbaratar o ritual cancela a habilidade <em>De Nada</em> de Eucharion.</p>
<h3>Cena 2 — Terrível Gratidão</h3>
<p>Ataque espiritual coletivo: escolher entre <strong>Pagar a Dívida</strong>, <strong>Resistir</strong> (Von CD 25, 10d6 psíquico / metade) ou <strong>Negociar</strong> (Conh/Intu/Reli CD 30, 15d6 psíquico / 0). Dois sucessos cancelam <em>Remorso Ingrato</em>.</p>
<h3>Cena 3 — Vigias da Devolução</h3>
<p>Combate contra 4 @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32VigiaDevolu]{Vigias da Devolução (ND 7)}.</p>`
      }
    },
    {
      _id: pageIds[3],
      name: '4. Parte 3: Sangue por Gratidão',
      type: 'text',
      sort: 400000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 3: Sangue por Gratidão</h2>
<h3>Cena 1 — A Campeã de Eucharion</h3>
<p>Diálogo tenso com @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32LysenneEuch]{Lysenne de Eucharion (ND 10)} (Diplomacia CD 25 inicial, CD 15 por pergunta; Enganação CD 30).</p>
<h3>Cena 2 — Amor que Não Recua</h3>
<p>Combate até a morte contra Lysenne (e os Vigias restantes, se não derrotados antes). Use @UUID[Compendium.compendios-para-t20.rt20-032-tabelas.RollTable.fld32TabFrasesLy]{Frases de Lysenne}.</p>
<h3>Cena 3 — Turbulência</h3>
<p>Fuga urbana sob fúria divina em @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32Turbulencia]{Turbulência em Santa Graça (ND 12)} (5 sucessos; sem falhas concede +5 Iniciativa no combate final).</p>`
      }
    },
    {
      _id: pageIds[4],
      name: '5. Parte 4: Morrer Como um Deus',
      type: 'text',
      sort: 500000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 4: Morrer Como um Deus</h2>
<h3>Cena 1 — A Procissão da Dívida</h3>
<p>Dentro do templo, todos ficam exaustos (debilitado, lento, vulnerável) sem direito a TR. Até 3 atos (Confissão, Laceração, Negação, Pagamento, Promessa, Sacrifício) removem condições.</p>
<h3>Cena 2 — Coração Furioso</h3>
<p>Batalha final contra @UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32EucharionFu]{Eucharion do Fullgor (ND 13)} usando @UUID[Compendium.compendios-para-t20.rt20-032-tabelas.RollTable.fld32TabFrasesEu]{Frases de Eucharion}. Deixa 10d6+10 @UUID[Compendium.compendios-para-t20.rt20-032-equipamentos.Item.fld32EstilhaFull]{Estilhas Cristalinas}.</p>
<h3>Cena 3 — Gratidão Final</h3>
<p>Escolha um milagre único: Ressuscitar heróis, Restaurar tudo, @UUID[Compendium.compendios-para-t20.rt20-032-poderes.Item.fld32ParcLysenne]{Ressuscitar Lysenne} (ND 13), @UUID[Compendium.compendios-para-t20.rt20-032-equipamentos.Item.fld32PingenteCor]{Criar o Pingente da Gratidão Pura} (concede @UUID[Compendium.compendios-para-t20.rt20-032-poderes.Item.fld32DividaSagra]{Dívida Sagrada}) ou Criar um Novo Deus (Status Divino 1 + tesouro ND 14).</p>`
      }
    },
    {
      _id: pageIds[5],
      name: '6. Dogmas de Eucharion & Poder Concedido',
      type: 'text',
      sort: 600000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Eucharion, Deus Menor da Gratidão (Status Divino 4 / 1)</h2>
<ul>
  <li><strong>Crenças e Objetivos:</strong> Retribuir graças recebidas, honrar promessas, pagar dívidas morais, encerrar ciclos.</li>
  <li><strong>Símbolo Sagrado:</strong> Um coração dourado irradiando luz • <strong>Arma Preferida:</strong> Mangual • <strong>Canalizar:</strong> Positiva.</li>
  <li><strong>Obrigações &amp; Restrições:</strong> Nunca recusar auxílio a quem o ajudou no passado; sempre oferecer retribuição por favor recebido; não tomar presente "sem resposta"; cumprir promessas diante do símbolo sagrado.</li>
  <li><strong>Poder Concedido:</strong> @UUID[Compendium.compendios-para-t20.rt20-032-poderes.Item.fld32DividaSagra]{Dívida Sagrada}.</li>
</ul>`
      }
    },
    {
      _id: pageIds[6],
      name: '7. Bestiário, Relíquia & Links Rápidos',
      type: 'text',
      sort: 700000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Bestiário &amp; Compêndios da Edição 32</h2>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32TurbaEnfure]{Turba Enfurecida (ND 10)}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32VigiaDevolu]{Vigia da Devolução (ND 7)}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32LysenneEuch]{Lysenne de Eucharion (ND 10)} &amp; @UUID[Compendium.compendios-para-t20.rt20-032-poderes.Item.fld32ParcLysenne]{Parceira: Lysenne}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-032-ameacas.Actor.fld32EucharionFu]{Eucharion do Fullgor (ND 13)}</li>
  <li>Relíquia &amp; Poder: @UUID[Compendium.compendios-para-t20.rt20-032-equipamentos.Item.fld32PingenteCor]{Pingente da Gratidão Pura} &amp; @UUID[Compendium.compendios-para-t20.rt20-032-poderes.Item.fld32DividaSagra]{Dívida Sagrada}</li>
  <li>Macro: @UUID[Compendium.compendios-para-t20.rt20-032-macros.Macro.fld32MacroComoDe]{Rastreador: Como um Deus (Edição 32)}</li>
</ul>`
      }
    }
  ].map(p => ({
    ...p,
    title: { show: true, level: 1 },
    image: {},
    video: { controls: true, volume: 0.5 },
    src: null,
    system: {},
    flags: {},
    _stats: statsHeader
  }));

  for await (const [oldPageKey] of db.iterator({ gte: `!journal.pages!${journalId}.`, lte: `!journal.pages!${journalId}.\uffff` })) {
    await db.del(oldPageKey);
  }
  await db.put(`!journal!${journalId}`, journalDoc);
  for (const p of pages) {
    await db.put(`!journal.pages!${journalId}.${p._id}`, { ...p, _dbKey: `!journal.pages!${journalId}.${p._id}` });
  }
  console.log(`✓ Diário "${journalDoc.name}" salvo com ${pages.length} páginas.`);
  await db.close();
}

// ============================================================================
// 4. TABELAS DE ROLAGEM (rt20-032-tabelas)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 32 em rt20-032-tabelas ---');
  const db = await openHierarchicalPack('rt20-032-tabelas');

  const tables = [
    {
      id: 'fld32TabFrasesTu',
      name: 'Turba Enfurecida — Frases em Combate (Edição 32)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/ameacas/guarda-de-cidade.png',
      description: '<p>Falas oficiais da Turba Enfurecida durante os confrontos em Santa Graça (p. 8).</p>',
      results: [
        { id: 'res32Tur00000001', name: 'Não Vão Tirar', text: '"Vocês não vão tirar isso de nós!"', range: [1, 1] },
        { id: 'res32Tur00000002', name: 'Ele Nos Salvou', text: '"Ele nos salvou quando ninguém mais salvou!"', range: [2, 2] },
        { id: 'res32Tur00000003', name: 'O Que Sobra', text: '"Sem ele, o que sobra da gente?"', range: [3, 3] },
        { id: 'res32Tur00000004', name: 'Dever a Vida', text: '"Vocês não sabem o que é dever a própria vida!"', range: [4, 4] },
        { id: 'res32Tur00000005', name: 'A Graça Foi Real', text: '"A graça foi real — o preço também deve ser!"', range: [5, 5] },
        { id: 'res32Tur00000006', name: 'Sangrar Que Seja', text: '"Se for preciso sangrar, que seja!"', range: [6, 6] },
        { id: 'res32Tur00000007', name: 'Não Voltar ao Passado', text: '"Não nos façam voltar para o que éramos antes!"', range: [7, 7] },
        { id: 'res32Tur00000008', name: 'Dívida Não Paga', text: '"A dívida ainda não foi paga!"', range: [8, 8] },
        { id: 'res32Tur00000009', name: 'Nada Receberam', text: '"Vocês chamam isso de loucura porque não receberam nada!"', range: [9, 9] },
        { id: 'res32Tur00000010', name: 'Saiam ou Paguem', text: '"Saiam da nossa cidade… ou paguem com a própria carne!"', range: [10, 10] }
      ]
    },
    {
      id: 'fld32TabFrasesLy',
      name: 'Lysenne de Eucharion — Frases em Combate (Edição 32)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/classes/paladino.webp',
      description: '<p>Falas oficiais de Lysenne de Eucharion na Parte 3, Cena 2 (p. 12).</p>',
      results: [
        { id: 'res32Lys00000001', name: 'Agradecimento', text: '"Cada golpe meu é um agradecimento."', range: [1, 1] },
        { id: 'res32Lys00000002', name: 'O Que Foi Salvo', text: '"Vocês não entendem o que foi salvo aqui!"', range: [2, 2] },
        { id: 'res32Lys00000003', name: 'Se Ele Cair', text: '"Se ele cair, tudo o que sou cai junto!"', range: [3, 3] },
        { id: 'res32Lys00000004', name: 'Não Avancem', text: '"Não avancem! Ainda podem ir embora!"', range: [4, 4] },
        { id: 'res32Lys00000005', name: 'É Compromisso', text: '"Gratidão não é fraqueza — é compromisso!"', range: [5, 5] },
        { id: 'res32Lys00000006', name: 'Escolhi Pagar', text: '"Eu escolhi pagar o preço!"', range: [6, 6] },
        { id: 'res32Lys00000007', name: 'Nunca Deveram', text: '"Vocês nunca deveram tudo!"', range: [7, 7] },
        { id: 'res32Lys00000008', name: 'Este Coração Bate', text: '"Este coração ainda bate por nós!"', range: [8, 8] },
        { id: 'res32Lys00000009', name: 'Meu Deus, Meu Amor', text: '"Eucharion! Meu deus! Meu amor!"', range: [9, 9] },
        { id: 'res32Lys00000010', name: 'Que Seja Aqui', text: '"Se preciso cair, que seja aqui!"', range: [10, 10] }
      ]
    },
    {
      id: 'fld32TabFrasesEu',
      name: 'Eucharion — Frases em Combate (Edição 32)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/magias/aura-divina.webp',
      description: '<p>Falas oficiais de Eucharion do Fullgor durante a batalha final na Parte 4, Cena 2 (p. 16).</p>',
      results: [
        { id: 'res32Euc00000001', name: 'Eu Dei Tudo', text: '"Eu dei tudo… e ainda assim vocês a tomaram!"', range: [1, 1] },
        { id: 'res32Euc00000002', name: 'Cada Batimento', text: '"Cada um dos batimentos deste coração é uma graça não paga!"', range: [2, 2] },
        { id: 'res32Euc00000003', name: 'Lysenne Pagou', text: '"Lysenne pagou com a vida — vocês pagarão com as suas!"', range: [3, 3] },
        { id: 'res32Euc00000004', name: 'Roubaram de Mim', text: '"Eu a salvei… e vocês a roubaram de mim!"', range: [4, 4] },
        { id: 'res32Euc00000005', name: 'O Fullgor Liberta', text: '"O Fullgor não corrompe! O Fullgor liberta!"', range: [5, 5] },
        { id: 'res32Euc00000006', name: 'Gratidão Exige', text: '"Gratidão não acaba! Gratidão exige!"', range: [6, 6] },
        { id: 'res32Euc00000007', name: 'Capangas de Arsenal', text: '"Malditos sejam, capangas de Arsenal, malditos sejam, todos vocês!"', range: [7, 7] },
        { id: 'res32Euc00000008', name: 'Pulsa Por Ela', text: '"Este coração pulsa intensamente por ela… e por tudo que ainda devem!"', range: [8, 8] },
        { id: 'res32Euc00000009', name: 'Gratidão é Dor', text: '"Gratidão é dor, por ser verdadeira!"', range: [9, 9] },
        { id: 'res32Euc00000010', name: 'Agradeço Por Você', text: '"Lysenne! Eu agradeço por você! Por nós!"', range: [10, 10] }
      ]
    }
  ];

  for (const t of tables) {
    for await (const [oldResKey] of db.iterator({ gte: `!tables.results!${t.id}.`, lte: `!tables.results!${t.id}.\uffff` })) {
      await db.del(oldResKey);
    }

    const tableDoc = {
      _id: t.id,
      name: t.name,
      folder: null,
      sort: 400000,
      formula: t.formula,
      img: t.img,
      description: t.description,
      results: t.results.map(r => r.id),
      replacement: true,
      displayRoll: true,
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!tables!${t.id}`, tableDoc);
    for (const r of t.results) {
      await db.put(`!tables.results!${t.id}.${r.id}`, {
        _id: r.id,
        _dbKey: `!tables.results!${t.id}.${r.id}`,
        type: 'text',
        name: r.name,
        text: r.text,
        description: r.text,
        img: 'icons/svg/d20-black.svg',
        weight: 1,
        range: r.range,
        drawn: false,
        flags: {},
        _stats: statsHeader
      });
    }
    console.log(`✓ Tabela "${t.name}" salva com ${t.results.length} resultados.`);
  }

  await db.close();
}

// ============================================================================
// 5. MACROS (rt20-032-macros)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 32 em rt20-032-macros ---');
  const db = await openHierarchicalPack('rt20-032-macros');

  const macroId = 'fld32MacroComoDe';
  const macroScript = `/**
 * Rastreador: Dispersar Turba, Procissão da Dívida & Gratidão Final — Fúlgor dos Deuses (Edição 32)
 */
const TURBA_FLAG = "fullgor32TurbaSucessos";
const sucs = Number(game.user.getFlag("world", TURBA_FLAG) || 0);

const dialogHtml = \`
  <form>
    <p><strong>Santa Graça (Edição 32: Como um Deus)</strong></p>
    <p>Sucessos para dispersar a Turba Enfurecida: <strong>\${sucs} / 7</strong></p>
    <p><small>20 natural conta como 2 sucessos. Alto Sacerdote cancela 1 sucesso/rodada até ser abatido (+3 sucessos).</small></p>
  </form>
\`;

async function onAddSuc(delta) {
  const next = Math.max(0, Math.min(7, sucs + delta));
  await game.user.setFlag("world", TURBA_FLAG, next);
  ChatMessage.create({ content: \`<p><strong>🔔 Turba Enfurecida (Ed. 32):</strong> Sucessos acumulados: <strong>\${next} / 7</strong>\${next >= 7 ? " — <em>Multidão dispersada sem mortes!</em>" : ""}</p>\` });
}

async function onEstilhas() {
  const roll = await new Roll("10d6+10").evaluate();
  await roll.toMessage({ flavor: "Estilhas Cristalinas ao destruir Eucharion do Fullgor (Ed. 32)" });
}

async function onProcissao() {
  ChatMessage.create({
    content: \`<div style="border:2px solid #b71c1c;padding:8px;border-radius:6px;background:#fff5f5;">
      <h4 style="margin:0 0 4px 0;color:#b71c1c;">Procissão da Dívida &amp; Gratidão Final (Ed. 32)</h4>
      <ul style="margin:0;padding-left:16px;">
        <li><strong>Templo:</strong> Todos iniciam <em>Exaustos</em> (debilitado, lento, vulnerável). Até 3 atos removem condições (Confissão CD 25, Negação CD 30, Laceração, Pagamento, Promessa, Sacrifício).</li>
        <li><strong>Gratidão Final:</strong> Ressuscitar heróis | Restaurar tudo | Ressuscitar Lysenne (ND 13 + Parceira) | Pingente da Gratidão Pura | Novo Deus (Status Divino 1 + ND 14).</li>
      </ul>
    </div>\`
  });
}

if (foundry?.applications?.api?.DialogV2) {
  foundry.applications.api.DialogV2.wait({
    window: { title: "Edição 32 — Como um Deus" },
    content: dialogHtml,
    buttons: [
      { action: "suc1", icon: "fas fa-plus", label: "+1 Sucesso Turba", default: true, callback: () => onAddSuc(1) },
      { action: "proc", icon: "fas fa-heart", label: "Procissão & Milagres", callback: onProcissao },
      { action: "est", icon: "fas fa-gem", label: "Estilhas (10d6+10)", callback: onEstilhas },
      { action: "reset", icon: "fas fa-rotate-left", label: "Zerar Turba", callback: () => onAddSuc(-sucs) }
    ]
  });
} else {
  new Dialog({
    title: "Edição 32 — Como um Deus",
    content: dialogHtml,
    buttons: {
      suc1: { icon: '<i class="fas fa-plus"></i>', label: "+1 Sucesso Turba", callback: () => onAddSuc(1) },
      proc: { icon: '<i class="fas fa-heart"></i>', label: "Procissão & Milagres", callback: onProcissao },
      est: { icon: '<i class="fas fa-gem"></i>', label: "Estilhas (10d6+10)", callback: onEstilhas },
      reset: { icon: '<i class="fas fa-rotate-left"></i>', label: "Zerar Turba", callback: () => onAddSuc(-sucs) }
    },
    default: "suc1"
  }).render(true);
}
`;

  const macroDoc = {
    _id: macroId,
    name: 'Rastreador: Dispersar Turba, Procissão da Dívida & Gratidão Final (Edição 32)',
    type: 'script',
    folder: null,
    sort: 400000,
    img: 'systems/tormenta20/icons/magias/aura-divina.webp',
    scope: 'global',
    command: macroScript,
    author: 'kL8nfmJOQTqjeU2x',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  console.log(`✓ Macro "${macroDoc.name}" salva.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 32 (COMO UM DEUS)');
  console.log('================================================================================');

  await injectThreats();
  await injectItemsAndPowers();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 32 CONCLUÍDA COM SUCESSO NOS COMPÊNDIOS HIERÁRQUICOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 32:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItemsAndPowers, injectJournals, injectTables, injectMacros };

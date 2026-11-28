#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 30: Guerra e Paz (RT20-030)
 *
 * Destino Direto nos Compêndios Hierárquicos (v2):
 * 1. rt20-030-ameacas: Elanor Lúmen-Velho (ND 8), Dalíria de Marah (ND 8 + 5 magias),
 *    Devoto de Marah Fullgori (ND 6), Coral Branco (ND 10 Colossal 4x4)
 *    + 3 Perigos Complexos ND 10 (Vidência de Cinzas, Julgamento dos Mansos, O Nada em Expansão)
 * 2. rt20-030-equipamentos: Estilhas Cristalinas do Fullgor (Edição 30)
 * 3. rt20-030-poderes: Parceiro Elanor Lúmen-Velho, Parceira Dalíria de Marah (+3 Def/Res),
 *    Favor da Dama Branca, Favor da Donzela Deslumbrante, Sentença de Valkaria
 * 4. rt20-030-diarios: Diário oficial completo (7 páginas sob !journal.pages!)
 * 5. rt20-030-tabelas: 3 Tabelas de Rolagem (1d10, 1d10, 1d4) sob !tables.results!
 * 6. rt20-030-macros: Macro interativa Prova das Mãos Vazias, Coral Branco & Sentença (Edição 30)
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

const ED30_PACKS_DIR = path.join(
  __dirname,
  '..',
  'packs',
  'revistas',
  'revista-tormenta-20',
  'fulgor-dos-deuses',
  'edicao-30'
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
  const packDir = path.join(ED30_PACKS_DIR, packName);
  fs.mkdirSync(packDir, { recursive: true });
  const db = new ClassicLevel(packDir, { valueEncoding: 'json' });
  await db.open();
  return db;
}

// ============================================================================
// 1. AMEAÇAS, NPCS & PERIGOS (rt20-030-ameacas)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças, NPCs e Perigos da Edição 30 em rt20-030-ameacas ---');
  const db = await openHierarchicalPack('rt20-030-ameacas');

  const threats = [];

  // 1. Elanor Lúmen-Velho (ND 8)
  const elanorAtr = { for: 2, des: 4, con: 2, int: 1, sab: 4, car: 3 };
  const elanorSkills = buildSkills(8, elanorAtr, {
    inic: 12,
    perc: 14,
    fort: 9,
    refl: 15,
    vont: 20,
    luta: 24,
    acro: 17,
    atle: 15,
    dipl: 11,
    intu: 12,
    reli: 14
  });
  const elanorTracos = buildTracos({
    tamanho: 'med',
    ic: ['alquebrado', 'esmorecido', 'frustrado'],
    icCustom: 'evasão'
  });
  const elanorItems = [
    buildWeaponAttack({
      name: 'Ataque Desarmado',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/briga.webp',
      dano: '1d10+20',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 2,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Ataque desarmado x2 +24 (1d10+20 impacto).</p>',
      flavorPhrase: '"Mostrem como lutam quando a guerra não é permitida."',
      flavorAction: 'Elanor golpeia com deslocamentos precisos e toques de contenção'
    }),
    buildSpecialPower({
      name: 'Aura de Paz',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      execucao: 'free',
      custo: 0,
      alcance: 'short',
      area: 'esfera com 9m de raio',
      duracao: 'cena',
      cd: 28,
      resistencia: {
        pericia: 'vont',
        atributo: 'sab',
        bonus: 0,
        txt: 'Vontade CD 28 evita'
      },
      description: '<p>(Livre) Uma vez por cena, Elanor gera uma aura de paz com um raio de 9m e duração cena. Qualquer inimigo dentro da aura que tente fazer uma ação hostil contra ele deve passar em um teste de Vontade (CD 28) ou perde a ação. Se passar, fica imune a esta habilidade por um dia.</p>',
      flavorPhrase: '"Aqui, a guerra não entra armada."',
      flavorAction: 'Uma serenidade inquebrável envolve o guardião da Dama Branca'
    }),
    buildSpecialPower({
      name: 'Integridade Corporal',
      img: 'systems/tormenta20/icons/magias/purificacao.webp',
      execucao: 'action',
      custo: 0,
      alcance: 'touch',
      description: '<p>(Padrão) Uma vez por rodada, Elanor remove uma condição entre abalado, apavorado, atordoado, cego, confuso, debilitado, enjoado, envenenado, exausto, fascinado, fatigado, fraco, lento, ofuscado, pasmo ou surdo, em si mesmo ou uma criatura adjacente.</p>'
    }),
    buildSpecialPower({
      name: 'Técnica da Mão Vazia',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'passive',
      custo: 0,
      rolls: [
        {
          name: 'Dano Extra contra Objetos',
          key: 'dano0',
          type: 'dano',
          parts: [['2d8', 'impacto', '']]
        }
      ],
      description: '<p>Elanor recebe +10 em testes de manobras para desarmar, empurrar e quebrar e causa +2d8 pontos de dano contra objetos.</p>'
    }),
    buildSpecialPower({
      name: 'Sair do Caminho',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/esquiva-sagaz.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Quando é alvo de um ataque corpo a corpo, Elanor pode fazer um teste de Reflexos oposto ao resultado desse ataque. Se vencer, o dano do ataque é causado a uma outra criatura adjacente a Elanor.</p>'
    })
  ];

  threats.push({
    id: 'fld30ElanorLumVA',
    name: 'Elanor Lúmen-Velho',
    img: 'systems/tormenta20/icons/racas/elfo.webp',
    nd: '8',
    papel: 'special',
    tipoMonstro: 'hum',
    raca: 'Humanoide (elfo)',
    tamanho: 'med',
    deslocamento: '12m (8q)',
    sentidos: 'faro, visão na penumbra',
    tesouro: 'Nenhum.',
    equipamento: 'Manto eclesiástico aprimorado, símbolo sagrado de Marah.',
    atributos: elanorAtr,
    attributes: {
      pv: { value: 228, max: 228 },
      pm: { value: 0, max: 0 },
      defesa: { value: 31, base: 27 }, // 31 - Des 4 = 27
      cd: 28
    },
    resistencias: elanorTracos,
    resistenciasTexto: 'evasão, imunidade a alquebrado, esmorecido e frustrado',
    pericias: elanorSkills,
    items: elanorItems,
    ataquescac: 'Ataque desarmado x2 +24 (1d10+20)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/elanor-lumen-velho.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"A paz não é fraqueza. É o esforço diário de não ceder ao impulso mais fácil."<br /><span style="font-weight:bold;color:#800000">— Elanor Lúmen-Velho</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Três séculos de calma élfica que desarmam uma lâmina antes mesmo de ela sair da bainha! E quando precisamos de fôlego, lá estava a Dama Branca sustentando o santuário."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Elanor Lúmen-Velho</span> é o guardião do voto da Dama Branca no Santuário do Abraço Final em Valkaria. Caminha há mais de três séculos entre guerra e luto oferecendo abrigo, escuta e mediação.</p>`
  });

  // 2. Dalíria de Marah (ND 8)
  const daliriaAtr = { for: 0, des: 3, con: 1, int: 2, sab: 4, car: 5 };
  const daliriaSkills = buildSkills(8, daliriaAtr, {
    inic: 11,
    perc: 12,
    fort: 7,
    refl: 21,
    vont: 16,
    acro: 13,
    atua: 19,
    cura: 12,
    dipl: 15,
    intu: 12,
    mist: 10,
    reli: 12
  });
  const daliriaTracos = buildTracos({ tamanho: 'med' });
  const daliriaItems = [
    buildSpecialPower({
      name: 'Aparência Inofensiva',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      execucao: 'passive',
      custo: 0,
      cd: 28,
      resistencia: {
        pericia: 'vont',
        atributo: 'car',
        bonus: 0,
        txt: 'Vontade CD 28 evita'
      },
      description: '<p>A primeira criatura inteligente (Int –3 ou maior) que atacar Dalíria em uma cena deve fazer um teste de Vontade (CD 28). Se falhar, perderá sua ação.</p>'
    }),
    buildSpecialPower({
      name: 'Transe Dançante',
      img: 'systems/tormenta20/icons/magias/aura-divina.webp',
      execucao: 'free',
      custo: 3,
      alcance: 'short',
      area: 'aura de 9m de raio',
      cd: 28,
      resistencia: {
        pericia: 'vont',
        atributo: 'car',
        bonus: 0,
        txt: 'Vontade CD 28 evita os efeitos'
      },
      effects: [
        buildActiveEffect({
          id: 'eff30DaliriaTran',
          name: 'Transe Dançante (+3 Defesa e Resistências)',
          img: 'systems/tormenta20/icons/racas/humano.webp',
          transfer: true,
          disabled: true,
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '3', priority: 20 },
            { key: 'system.modificadores.pericias.resistencia', mode: 2, value: '3', priority: 20 }
          ]
        })
      ],
      description: '<p>(Livre, 3 PM) Dalíria gera uma aura de 9m de raio, ela e seus aliados recebem +3 em testes de resistência e na Defesa, e 10 PV temporários. Além disso, inimigos que comecem seu turno dentro da aura têm sua atitude melhorada em um passo (apenas uma vez) e ficam fascinados (Vontade CD 28 evita os efeitos e a criatura fica imune a esta habilidade até o fim da cena). Para manter o transe, Dalíria precisa se deslocar pelo menos 6m, sem passar pelos mesmos quadrados.</p>',
      flavorPhrase: '"Onde há riso, há pausa. Onde há pausa, a guerra perde força."',
      flavorAction: 'Dalíria gira em passos leves irradiando alegria que desarma o ódio'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 7,
      alcance: 'short',
      alvo: '1 criatura',
      duracao: 'inst',
      formulaCura: '8d8+8',
      description: '<p>(Padrão, 7 PM) Uma criatura em alcance curto cura 8d8+8 PV.</p>',
      source: 'Fúlgor dos Deuses — Edição 30'
    }),
    buildSpellItem({
      name: 'Dissipar Magia',
      img: 'systems/tormenta20/icons/magias/dissipar-magia.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 3,
      alcance: 'medium',
      alvo: '1 criatura, objeto ou esfera de 3m',
      duracao: 'inst',
      description: '<p>(Padrão, 3 PM) Dalíria escolhe uma criatura, objeto ou esfera de 3m em alcance médio e faz um teste de Misticismo. Todas as magias neste alvo com CD igual ou menor que o resultado do teste são dissipadas.</p>',
      source: 'Fúlgor dos Deuses — Edição 30'
    }),
    buildSpellItem({
      name: 'Escudo da Fé',
      img: 'systems/tormenta20/icons/magias/escudo-da-fe.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'abj',
      execucao: 'reaction',
      custoPM: 7,
      alcance: 'short',
      alvo: '1 criatura',
      duracao: 'turn',
      description: '<p>(Reação, 7 PM) Quando uma criatura em alcance curto sofre um ataque, ela recebe camuflagem contra ataques à distância e +5 na Defesa até seu próximo turno.</p>',
      source: 'Fúlgor dos Deuses — Edição 30'
    }),
    buildSpellItem({
      name: 'Luz',
      img: 'systems/tormenta20/icons/magias/luz.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 5,
      alcance: 'touch',
      alvo: '1 criatura adjacente',
      duracao: 'scene',
      description: '<p>(Padrão, 5 PM) Uma criatura adjacente é envolta por um halo de luz e recebe +10 em testes de Diplomacia e redução de trevas 10 até o fim da cena.</p>',
      source: 'Fúlgor dos Deuses — Edição 30'
    }),
    buildSpellItem({
      name: 'Tranquilidade',
      img: 'systems/tormenta20/icons/magias/tranquilidade.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 4,
      alcance: 'short',
      alvo: 'até 3 criaturas',
      duracao: 'scene',
      resistencia: 'Vontade reduz para penalidade de -2 em testes de ataque',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 4 PM) Até três criaturas em alcance curto têm sua atitude mudada para indiferente e não podem atacar ou realizar qualquer ação hostil (Von reduz para penalidade de –2 em testes de ataque) até o fim da cena. Ações hostis contra um alvo dissipam a magia.</p>',
      source: 'Fúlgor dos Deuses — Edição 30'
    })
  ];

  threats.push({
    id: 'fld30DaliriaMara',
    name: 'Dalíria de Marah',
    img: 'systems/tormenta20/icons/racas/humano.webp',
    nd: '8',
    papel: 'special',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão normal',
    tesouro: 'Nenhum.',
    equipamento: 'Camisa bufante aprimorada, símbolo sagrado de Marah.',
    atributos: daliriaAtr,
    attributes: {
      pv: { value: 214, max: 214 },
      pm: { value: 54, max: 54 },
      defesa: { value: 28, base: 25 }, // 28 - Des 3 = 25
      cd: 28
    },
    resistencias: daliriaTracos,
    resistenciasTexto: 'Nenhuma',
    pericias: daliriaSkills,
    items: daliriaItems,
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/daliria-de-marah.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Se a paz não puder sorrir, ela já começou a morrer."<br /><span style="font-weight:bold;color:#800000">— Dalíria de Marah</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Descalça, sorridente e impossível de acertar — quando começou a dançar no pátio, até o guerreiro mais carrancudo esqueceu por que segurava o machado!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Dalíria de Marah</span> é a voz da Donzela Deslumbrante no Santuário do Abraço Final. Frade de Marah de 8º nível, celebra a paz como alegria viva, amor e pausa diante da violência.</p>`
  });

  // 3. Devoto de Marah Fullgori (ND 6)
  const devotoAtr = { for: 0, des: 2, con: 3, int: 0, sab: 3, car: 2 };
  const devotoSkills = buildSkills(6, devotoAtr, {
    inic: 5,
    perc: 6,
    fort: 17,
    refl: 10,
    vont: 9,
    luta: 24
  });
  const devotoTracos = buildTracos({
    tamanho: 'med',
    ic: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const devotoItems = [
    buildWeaponAttack({
      name: 'Toque Pacificador',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      dano: '2d6',
      tipoDano: 'perda',
      periciaAtaque: 'luta',
      ataques: 2,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']] },
        { name: 'Perda de PM', key: 'formula1', type: 'formula', parts: [['2d6', '', 'Perda de PM']] }
      ],
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Toque pacificador x2 +24. Quando acerta um ataque, em vez de causar dano, o devoto causa a perda de 2d6 PM à vítima. Se a vítima for reduzida a 0 PM, fica fraco, lento e vulnerável até o fim da cena.</p>',
      flavorPhrase: '"Não resistam… resistir dói."',
      flavorAction: 'O devoto estende as mãos serenas para drenar a vontade espiritual do alvo'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori (2 PM para ND 6). Se o devoto for reduzido a 0 PM dessa forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Aura de Desinteresse',
      img: 'systems/tormenta20/icons/magias/tranquilidade.webp',
      execucao: 'passive',
      custo: 0,
      alcance: 'short',
      cd: 22,
      resistencia: {
        pericia: 'vont',
        atributo: 'sab',
        bonus: 0,
        txt: 'Vontade CD 22 evita'
      },
      description: '<p>Qualquer criatura em alcance curto do devoto de Marah fullgori que tente fazer uma ação hostil contra ele perde a ação (Vontade CD 22 evita). Uma criatura que passe no teste de resistência fica imune a esta habilidade por um dia.</p>'
    }),
    buildSpecialPower({
      name: 'Remorso Existencial',
      img: 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Quando o devoto sofre dano de uma ação agredir, o agressor sofre uma penalidade cumulativa de –2 em testes de ataque e rolagens de dano até o fim da cena.</p>'
    }),
    buildSpecialPower({
      name: 'Toque Pacificador',
      img: 'systems/tormenta20/icons/magias/santuario.webp',
      execucao: 'passive',
      custo: 0,
      rolls: [
        { name: 'Perda de PM', key: 'formula0', type: 'formula', parts: [['2d6', '', 'Perda de PM']] }
      ],
      description: '<p>Quando acerta um ataque, em vez de causar dano, o devoto causa a perda de 2d6 PM à vítima. Se a vítima for reduzida a 0 PM, fica fraco, lento e vulnerável até o fim da cena.</p>'
    })
  ];

  threats.push({
    id: 'fld30DevotoMarah',
    name: 'Devoto de Marah Fullgori',
    img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
    nd: '6',
    papel: 'lacaio',
    tipoMonstro: 'hum',
    raca: 'Humanoide (fullgori)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão normal',
    tesouro: 'Nenhum.',
    atributos: devotoAtr,
    attributes: {
      pv: { value: 48, max: 48 },
      pm: { value: 0, max: 0 },
      defesa: { value: 26, base: 24 }, // 26 - Des 2 = 24
      cd: 22
    },
    resistencias: devotoTracos,
    resistenciasTexto: 'imunidade a acertos críticos, cansaço, metabolismo, metamorfose e paralisia (Fullgori)',
    pericias: devotoSkills,
    items: devotoItems,
    ataquescac: 'Toque pacificador x2 +24 (2d6 perda de PM)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/devoto-marah-fullgori.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Não lutem. Não façam Marah chorar."<br /><span style="font-weight:bold;color:#800000">— Devoto de Marah Fullgori</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Eles sorriem enquanto tentam te abraçar para apagar sua vontade! E se você revida, a culpa dourada pesa nos seus braços até você mal conseguir erguer a arma!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">Os <span style="color:#800000;font-weight:bold">Devotos de Marah Fullgori</span> foram convertidos em apóstolos da desistência. A transformação dura três turnos em emboscada e, derrotados, deixam 1d6 estilhas cristalinas.</p>`
  });

  // 4. Coral Branco (ND 10)
  const coralAtr = { for: 5, des: -5, con: 8, int: -5, sab: 0, car: -5 };
  const coralSkills = buildSkills(10, coralAtr, {
    inic: 4,
    perc: 5,
    fort: 22,
    refl: 10,
    vont: 16
  });
  const coralTracos = buildTracos({
    tamanho: 'col',
    rdGeral: 10,
    ic: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const coralItems = [
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM dessa forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Enxame (Perda de PM)',
      img: 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-insetos-rubros.webp',
      execucao: 'passive',
      custo: 0,
      rolls: [
        { name: 'Enxame (Perda de PM)', key: 'formula0', type: 'formula', parts: [['2d8', '', 'Perda de PM']] }
      ],
      description: '<p><strong>Enxame:</strong> 2d8 de perda de PM. Apesar de ser uma única criatura colossal, o Coral Branco é como um enxame ocupando toda a câmara. O dano causado por perícias alternativas (2d6 + Car + até 5 PM/+5d6) não é reduzido pela habilidade de enxame.</p>'
    }),
    buildSpecialPower({
      name: 'Maior que a Morte',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Enquanto tiver pelo menos metade de seus PV, o Coral Branco é imune a habilidades e efeitos de morte instantânea.</p>'
    }),
    buildSpecialPower({
      name: 'Anular a Vontade',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando sofre um efeito que permite um teste de resistência para reduzir o dano à metade, o Coral Branco não sofre dano algum se passar, e sofre apenas metade do dano se falhar.</p>'
    }),
    buildSpecialPower({
      name: 'Fim da Dor',
      img: 'systems/tormenta20/icons/poderes/ameacas/olhar-petrificante.webp',
      execucao: 'passive',
      custo: 0,
      cd: 30,
      resistencia: {
        pericia: 'vont',
        atributo: 'sab',
        bonus: 0,
        txt: 'Vontade CD 30 evita'
      },
      description: '<p>Se o coral fosse causar perda de PM a uma criatura com 0 PM, em vez disso faz a vítima ficar lenta e vulnerável (Von CD 30 evita). Falhas consecutivas na mesma cena se acumulam: na segunda, a criatura fica frustrada e imóvel; na terceira, fica esmorecida e paralisada. Por fim, na quarta, a vítima fica petrificada permanentemente.</p>'
    }),
    buildSpecialPower({
      name: 'Paz sem Voz',
      img: 'systems/tormenta20/icons/magias/aura-divina.webp',
      execucao: 'action',
      custo: 0,
      alcance: 'medium',
      duracao: '1d4 rodadas',
      cd: 30,
      resistencia: {
        pericia: 'vont',
        atributo: 'sab',
        bonus: 0,
        txt: 'Von CD 30 reduz perda de vida à metade e muda condições para lento e surdo (passar por 5+ evita todas)'
      },
      rolls: [
        { name: 'Perda de Vida', key: 'dano0', type: 'dano', parts: [['8d6', 'perda', '']] }
      ],
      description: '<p>(Padrão) Todas as criaturas em alcance médio do coral perdem 8d6 pontos de vida e ficam alquebradas, paralisadas e não são capazes de produzir nenhum som por 1d4 rodadas (Von CD 30 reduz a perda de vida à metade, e muda as condições para lento e surdo; se passar no teste por 5 ou mais, evita todas as condições). Recarga (Padrão).</p>',
      flavorPhrase: '"Desapareçam em paz. Aqui, até a esperança descansa."',
      flavorAction: 'Um pulso silencioso de luz pálida tenta apagar a voz e a vontade da câmara'
    }),
    buildSpecialPower({
      name: 'Remorso Existencial',
      img: 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Quando o coral sofre dano de uma ação agredir, o agressor sofre uma penalidade cumulativa de –2 em testes de ataque e rolagens de dano até o fim da cena.</p>'
    }),
    buildSpecialPower({
      name: 'Reduzir ao Nada',
      img: 'systems/tormenta20/icons/magias/dissipar-magia.webp',
      execucao: 'action',
      custo: 0,
      alcance: 'medium',
      cd: 30,
      resistencia: {
        pericia: 'vont',
        atributo: 'sab',
        bonus: 0,
        txt: 'Vontade CD 30 evita'
      },
      description: '<p>(Padrão) O coral dissipa todas magias ativas sobre uma criatura, objeto ou esfera de 3m em alcance médio (Von CD 30 evita).</p>'
    })
  ];

  threats.push({
    id: 'fld30CoralBranco',
    name: 'Coral Branco',
    img: 'systems/tormenta20/icons/itens/itens-magicos/gema-da-luminosidade.webp',
    nd: '10',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'col',
    deslocamento: '0m (0q)',
    sentidos: 'percepção às cegas',
    tesouro: 'Padrão (e 3d6+10 estilhas de cristal).',
    atributos: coralAtr,
    attributes: {
      pv: { value: 600, max: 600 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 38 }, // 33 - Des(-5) = 38
      cd: 30
    },
    resistencias: coralTracos,
    resistenciasTexto: 'maior que a morte, redução de dano 10; imunidade a acertos críticos, cansaço, metabolismo, metamorfose e paralisia (Fullgori)',
    pericias: coralSkills,
    items: coralItems,
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/coral-branco.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"A guerra acaba quando tudo acaba."<br /><span style="font-weight:bold;color:#800000">— O Coral Branco</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um recife de marfim translúcido que não morde, não grita — apenas tenta te convencer de que parar de existir é confortável! Só conseguimos vencê-lo gritando quem éramos e por que valia a pena viver!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Coral Branco</span> é a forma final da deturpação do Fullgor no domínio de Marah: um padrão espiritual cristalizado imóvel. Pode ser enfrentado por perícias alternativas (Atuação, Conhecimento, Diplomacia, Guerra, Intuição, Religião ou Vontade) causando 2d6 + Car (+1d6 por PM até 5 PM) sem sofrer redução de enxame.</p>`
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
    if (t.deslocamento.startsWith('0m')) {
      built.actorDoc.system.attributes.movement.walk.base = 0;
    }

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
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo em rt20-030-ameacas com ${built.embeddedDocs.length} subdocumentos.`);
  }

  // 5. Perigos Complexos (Hazards ND 10)
  const hazards = [
    {
      id: 'fld30VidenciaCin',
      name: 'Vidência de Cinzas (Perigo Complexo ND 10)',
      nd: '10',
      img: 'systems/tormenta20/icons/magias/augurio.webp',
      token: 'modules/compendios-para-t20/assets/tokens/elanor-lumen-velho.png',
      goal: 'Compreender a natureza dos sinais sobrenaturais em Valkaria (cinzas, penas brancas, sonhos) e identificar o próximo alvo do Fullgor.',
      effects: 'O grupo deve acumular 3 sucessos antes de 3 falhas. Sucesso Total (3 sucessos, 0–1 falha): cada personagem recebe +2 em seu primeiro teste de perícia no Santuário do Abraço Final. Sucesso Parcial (3 sucessos, 2 falhas): chegam ao culto normalmente. Falha Total (3 falhas): sacerdotes de Arsenal apontam o santuário, mas cada personagem sofre -5 no primeiro teste de perícia no santuário.',
      actions: `
        <li><strong>Conhecimento CD 20:</strong> Identificar grandes cultos de Marah na metrópole (apenas após passar em Religião).</li>
        <li><strong>Diplomacia CD 20:</strong> Ouvir sacerdotes, artistas ou devotos pacifistas (apenas após passar em Religião).</li>
        <li><strong>Intuição CD 20:</strong> Distinguir presságios verdadeiros de luto e sentir familiaridade (apenas 1 vez).</li>
        <li><strong>Investigação CD 22:</strong> Conectar rumores, sonhos e coincidências em Valkaria.</li>
        <li><strong>Misticismo CD 25:</strong> Perceber manifestações espirituais imperfeitas sem relação divina.</li>
        <li><strong>Percepção CD 25:</strong> Recordar sonhos com clareza ("carta escrita com mão não dominante").</li>
        <li><strong>Religião CD 22:</strong> Reconhecer símbolos de paz, Marah e ausência de voz divina direta.</li>
        <li><strong>Vontade CD 22:</strong> Manter foco emocional apesar do luto por Thalgrimm.</li>
      `
    },
    {
      id: 'fld30JulgamentoM',
      name: 'Julgamento dos Mansos (Perigo Complexo ND 10)',
      nd: '10',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      token: 'modules/compendios-para-t20/assets/tokens/devoto-marah-fullgori.png',
      goal: 'Identificar sinais reais da influência do Fullgor no Santuário do Abraço Final sem recorrer à violência, distinguindo fé sincera de devoção deturpada.',
      effects: 'O grupo deve acumular 4 sucessos antes de 3 falhas. 1ª Falha: todos os próximos testes sociais sofrem -2. 2ª Falha: penalidade aumenta para -5. 3ª Falha: falha total; o Fullgor percebe estar sendo observado e prepara a emboscada (Cena 3).',
      actions: `
        <li><strong>Atuação CD 25:</strong> Participar de improviso em peças ou danças locais, conquistando simpatia.</li>
        <li><strong>Diplomacia CD 25:</strong> Fazer perguntas com brandura, sem parecer interrogatório ou ameaça.</li>
        <li><strong>Enganação CD 30:</strong> Integrar-se ao cotidiano do culto sem levantar suspeitas.</li>
        <li><strong>Intimidação (Falha Automática):</strong> Qualquer tentativa resulta em falha imediata.</li>
        <li><strong>Intuição CD 25:</strong> Perceber quando a devoção se torna dependência emocional ou anulação da vontade.</li>
        <li><strong>Investigação CD 28:</strong> Conectar relatos, rotinas e ausências estranhas.</li>
        <li><strong>Misticismo CD 30:</strong> Detectar energias arcanas sutis relacionadas ao Fullgor.</li>
        <li><strong>Percepção CD 25:</strong> Notar gestos, repetições de frases e padrões anômalos.</li>
        <li><strong>Religião CD 25:</strong> Distinguir ensinamentos autênticos de Marah de interpretações distorcidas.</li>
      `
    },
    {
      id: 'fld30NadaExpansa',
      name: 'O Nada em Expansão (Perigo Complexo ND 10)',
      nd: '10',
      img: 'systems/tormenta20/icons/magias/buraco-negro.webp',
      token: 'modules/compendios-para-t20/assets/tokens/coral-branco.png',
      goal: 'Com o colapso do Coral Branco gerando nulificação progressiva no santuário, fugir enquanto resgatam o maior número possível de devotos.',
      effects: 'O grupo deve obter 5 sucessos antes de 3 falhas. 1ª Falha: dificuldade dos próximos testes aumenta em CD +2. 2ª Falha: pânico reduz próximos testes sociais em -5. 3ª Falha: falha total; escapam salvando poucos sobreviventes. 5º Sucesso: quase todos escapam e o vazio se detém nos limites do santuário (premiação final = tesouro ND 6 + sucessos nesta cena).',
      actions: `
        <li><strong>Acrobacia ou Reflexos CD 20:</strong> Escapar de colapsos súbitos e cruzar espaços incompletos.</li>
        <li><strong>Atletismo CD 20:</strong> Carregar feridos, romper obstáculos e atravessar áreas instáveis.</li>
        <li><strong>Atuação CD 18:</strong> Motivar espíritos e manter vítimas conscientes e em movimento.</li>
        <li><strong>Diplomacia ou Intimidação CD 20:</strong> Convencer devotos atordoados ou apavorados a fugir.</li>
        <li><strong>Iniciativa CD 25:</strong> Agir antes que o próximo nada aconteça.</li>
        <li><strong>Intuição CD 20:</strong> Antecipar o avanço do nada e mudar de rota a tempo.</li>
        <li><strong>Percepção CD 18:</strong> Identificar rotas existentes e prestes a desaparecer.</li>
        <li><strong>Religião ou Misticismo CD 22:</strong> Sustentar áreas sagradas por instantes preciosos.</li>
      `
    }
  ];

  await db.del('!actors!fld30JulgamentoMa').catch(() => {});
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
    console.log(`✓ Perigo "${hz.name}" salvo em rt20-030-ameacas.`);
  }

  await db.close();
}

// ============================================================================
// 2. EQUIPAMENTOS & PODERES / PARCEIROS (rt20-030-equipamentos / rt20-030-poderes)
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
  console.log('\n--- Injetando Equipamentos, Parceiros e Favores da Edição 30 ---');
  const eqDb = await openHierarchicalPack('rt20-030-equipamentos');
  const pwDb = await openHierarchicalPack('rt20-030-poderes');

  const equipamentos = [
    {
      _id: 'fld30EstilhaFull',
      name: 'Estilhas Cristalinas do Fullgor (Edição 30)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      description: `<p><strong>Resíduo Fullgori (Guerra e Paz):</strong> Fragmentos cristalinos dourados obtidos no Santuário do Abraço Final (<strong>1d6 estilhas</strong> por Devoto de Marah Fullgori derrotado e <strong>3d6+10 estilhas</strong> ao derrotar o <em>Coral Branco</em>).</p>
<ul>
  <li><strong>Forja de Aço Sillariano:</strong> Podem ser entregues aos forjadores litúrgicos da Igreja de Arsenal em Valkaria para fortificar itens de aço sillariano.</li>
  <li><strong>Ritual de Purificação (Sentença):</strong> Cada estilha fullgori sacrificada concede <strong>+2</strong> em um teste estendido de Religião (CD 30) para tentar curar os sobreviventes maculados.</li>
</ul>`,
      system: {
        tipo: 'acessorio',
        equipado2: { slot: 0, type: 'body' },
        preco: 0,
        peso: 0.1,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rawEffects: []
    }
  ];

  const poderes = [
    {
      _id: 'fld30ParcElanorA',
      name: 'Parceiro: Elanor Lúmen-Velho (Veterano Especial)',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/elfo.webp',
      description: `<p><strong>Parceiro Veterano Especial (Edição 30, p. 19):</strong> Elanor Lúmen-Velho fornece os seguintes benefícios:</p>
<ul>
  <li>Você recebe <strong>+5 para desarmar, empurrar e quebrar</strong>.</li>
  <li>Você pode lançar <strong>Purificação</strong> (se já puder lançar a magia, seu custo diminui em –1 PM).</li>
</ul>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rawEffects: []
    },
    {
      _id: 'fld30ParcDaliria',
      name: 'Parceira: Dalíria de Marah (Veterana Especial)',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/humano.webp',
      description: `<p><strong>Parceira Veterana Especial (Edição 30, p. 20):</strong> Dalíria de Marah fornece os seguintes benefícios:</p>
<ul>
  <li>Você recebe <strong>+3 em testes de resistência e na Defesa</strong>.</li>
  <li>Além disso, uma vez por rodada, você pode gastar <strong>3 PM</strong> para curar <strong>3d8+3 PV</strong> de uma criatura adjacente.</li>
</ul>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'free', custo: 3 },
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rolls: [
        { name: 'Cura de Dalíria', key: 'dano0', type: 'dano', parts: [['3d8+3', 'curapv', '']] }
      ],
      rawEffects: [
        {
          _id: 'eff30DaliriaParc',
          name: 'Dalíria — Parceira (+3 Defesa e Resistências)',
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '3', priority: 20 },
            { key: 'system.modificadores.pericias.resistencia', mode: 2, value: '3', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld30FavorDamaBr',
      name: 'Favor da Dama Branca (Santuário de Marah)',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      description: `<p><strong>Bênção da Dama Branca (Edição 30, p. 9):</strong> Um personagem que escolhe o favor da Dama Branca adquire os poderes concedidos <strong>Aura de Paz</strong> e <strong>Dom da Esperança</strong> enquanto está no Santuário do Abraço Final.</p>
<p>Se já os possui, a CD para <em>Aura de Paz</em> aumenta em <strong>+5</strong> e/ou você recebe um número de PV igual à sua Sabedoria para <em>Dom da Esperança</em> (apenas uma vez).</p>`,
      system: {
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rawEffects: []
    },
    {
      _id: 'fld30FavorDonzel',
      name: 'Favor da Donzela Deslumbrante (Santuário de Marah)',
      type: 'poder',
      img: 'systems/tormenta20/icons/magias/aura-divina.webp',
      description: `<p><strong>Bênção da Donzela Deslumbrante (Edição 30, p. 9):</strong> Um personagem que escolhe o favor da Donzela Deslumbrante adquire os poderes concedidos <strong>Palavras de Bondade</strong> e <strong>Talento Artístico</strong> enquanto está no Santuário do Abraço Final.</p>
<p>Se já os possui, o custo para lançar <em>Enfeitiçar</em> é reduzido em <strong>–1 PM</strong> (Palavras de Bondade) e/ou seus bônus em perícias por Talento Artístico aumentam para <strong>+5</strong>.</p>`,
      system: {
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rawEffects: []
    },
    {
      _id: 'fld30SentencaFav',
      name: 'Sentença de Valkaria: Favor de Arsenal / Favor de Marah',
      type: 'poder',
      img: 'systems/tormenta20/icons/magias/bencao.webp',
      description: `<p><strong>Consequências da Sentença (Edição 30, p. 17):</strong> Escolha e ative o efeito correspondente à decisão tomada pelos heróis quanto aos devotos maculados:</p>
<ul>
  <li><strong>Execução Misericordiosa:</strong> <em>Favor de Arsenal</em> (+5 pontos de mana permanentes) e <em>Desfavor de Marah</em> (descanso duas categorias pior, máximo ruim, na próxima aventura).</li>
  <li><strong>Cativeiro/Isolamento:</strong> <em>Favor de Marah</em> (+2 em testes de resistência permanentemente) e <em>Desfavor de Arsenal</em> (–5 em testes de Iniciativa na próxima aventura).</li>
  <li><strong>Tentativa de Cura (Religião CD 30, 3 sucessos):</strong> Sucesso total (0 falhas) concede o Favor de Marah sem o Desfavor de Arsenal; falha total (3 falhas) impõe o desfavor de ambos os deuses.</li>
</ul>`,
      system: {
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 30'
      },
      rawEffects: [
        {
          _id: 'eff30FavArsenalA',
          name: 'Favor de Arsenal (+5 PM permanentes)',
          disabled: true,
          changes: [
            { key: 'system.attributes.pm.bonus', mode: 2, value: '5', priority: 20 }
          ]
        },
        {
          _id: 'eff30FavorMarahA',
          name: 'Favor de Marah (+2 Testes de Resistência)',
          disabled: true,
          changes: [
            { key: 'system.modificadores.pericias.resistencia', mode: 2, value: '2', priority: 20 }
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
// 3. DIÁRIO (rt20-030-diarios)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diário da Edição 30 em rt20-030-diarios ---');
  const db = await openHierarchicalPack('rt20-030-diarios');

  const journalId = 'fld30DiarioGuerr';
  const pageIds = [
    'p30SinopseAvent1',
    'p30Parte1Chamad1',
    'p30Parte2Julgam1',
    'p30Parte3Doenca1',
    'p30Parte4Quando1',
    'p30RegrasNaoViol',
    'p30BestiarioNpc1'
  ];

  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 30: Guerra e Paz',
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
        content: `<h2>Fúlgor dos Deuses — Edição 30: Guerra e Paz</h2>
<p><strong>Criação:</strong> Marcelo Cassaro • <strong>Desenvolvimento:</strong> Daniel Duran (Agosto de 2026)</p>
<p>Sem Thalgrimm Sangue de Ferro para guiá-los após os acontecimentos de <em>Dor Profunda</em>, os campeões de Arsenal enfrentam o silêncio absoluto do Deus da Guerra e passam a seguir sinais misteriosos até o <strong>Santuário do Abraço Final</strong> em Valkaria — o maior culto de <strong>Marah</strong>, Deusa da Paz.</p>
<div style="border-left:4px solid #7b1fa2;background:#f8f4fb;padding:10px;margin:10px 0;">
  <strong>Progressão da Campanha:</strong> Ao concluir <em>Guerra e Paz</em>, os personagens chegam ao <strong>10º nível</strong> (patamar campeão) e descobrem quem realmente os guiava desde o além. A próxima aventura será <em>Pecados do Pai</em>.
</div>`
      }
    },
    {
      _id: pageIds[1],
      name: '2. Parte 1: Chamado sem Voz',
      type: 'text',
      sort: 200000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 1: Chamado sem Voz</h2>
<h3>Cena 1 — Vidência de Cinzas</h3>
<p>Cinzas sobre a água, penas brancas e sonhos de armas abandonadas compõem o perigo complexo @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30VidenciaCin]{Vidência de Cinzas (ND 10)} (3 sucessos antes de 3 falhas). Enquanto permanecem em Valkaria, os forjadores litúrgicos podem fortificar itens de aço sillariano e Liriavel segue disponível.</p>
<h3>Cena 2 — Abraço Final</h3>
<p>No Santuário do Abraço Final, os heróis são recebidos por @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30ElanorLumVA]{Elanor Lúmen-Velho} (guardião da Dama Branca) e @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30DaliriaMara]{Dalíria de Marah} (voz da Donzela Deslumbrante).</p>
<h3>Cena 3 — A Prova das Mãos Vazias (Opcional)</h3>
<p>Se o grupo recusar entregar suas armas ou se Elanor e Dalíria julgarem necessário, realiza-se um combate ritual de 3 turnos. Causar dano letal (–3), não letal (–1), impor condições além de enfeitiçado/fascinado/pasmo (–2), manobras (–1), Intimidação (–1) ou sofrer dano (–1) acumula penalidades no santuário (até –5).</p>`
      }
    },
    {
      _id: pageIds[2],
      name: '3. Parte 2: Julgamento dos Mansos',
      type: 'text',
      sort: 300000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 2: Julgamento dos Mansos</h2>
<h3>Cena 1 — A Dama ou a Donzela</h3>
<p>Cada personagem pode receber um dos favores dentro do santuário: @UUID[Compendium.compendios-para-t20.rt20-030-poderes.Item.fld30FavorDamaBr]{Favor da Dama Branca} (<em>Aura de Paz</em> e <em>Dom da Esperança</em>) ou @UUID[Compendium.compendios-para-t20.rt20-030-poderes.Item.fld30FavorDonzel]{Favor da Donzela Deslumbrante} (<em>Palavras de Bondade</em> e <em>Talento Artístico</em>).</p>
<h3>Cena 2 — Julgamento</h3>
<p>Investigação não-violenta modelada em @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30JulgamentoM]{Julgamento dos Mansos (ND 10)} (4 sucessos antes de 3 falhas; Intimidação é falha automática).</p>
<h3>Cena 3 — Emboscada</h3>
<p>Em caso de falha total, 1d4 @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30DevotoMarah]{Devotos de Marah Fullgori} emboscam o personagem (Percepção CD 25 ou sofre 1d4 ataques de 2d6 PM). Use @UUID[Compendium.compendios-para-t20.rt20-030-tabelas.RollTable.fld30TabFrasesDv]{Frases dos Devotos Fullgori}. Cada derrotado deixa 1d6 @UUID[Compendium.compendios-para-t20.rt20-030-equipamentos.Item.fld30EstilhaFull]{Estilhas Cristalinas}.</p>`
      }
    },
    {
      _id: pageIds[3],
      name: '4. Parte 3: A Doença da Paz',
      type: 'text',
      sort: 400000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 3: A Doença da Paz</h2>
<h3>Cena 1 — A Presença</h3>
<p>Uma intervenção invisível de fuligem e ferro ajuda os heróis no momento crítico (máximo 1x/cena). Sorteie na tabela @UUID[Compendium.compendios-para-t20.rt20-030-tabelas.RollTable.fld30TabPresenca]{A Presença — Eventos de Thalgrimm}.</p>
<h3>Cena 2 — O Voto Impossível</h3>
<p>Religião/Misticismo CD 15/20/25/30. Forçar passagem sem as 3 provas (<strong>Escolha</strong>, <strong>Vínculo</strong> e <strong>Afirmação</strong>) custa 1 ponto de atributo, 1 perícia treinada e 1 poder. Devotos de Marah recebem +5 em todos os testes.</p>
<h3>Cena 3 — O Coral Branco</h3>
<p>Confronto contra @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30CoralBranco]{Coral Branco (ND 10)} utilizando @UUID[Compendium.compendios-para-t20.rt20-030-tabelas.RollTable.fld30TabFrasesCo]{Frases do Coral Branco} e a macro @UUID[Compendium.compendios-para-t20.rt20-030-macros.Macro.fld30MacroGuerra]{Rastreador da Edição 30}. Derrotado, deixa 3d6+10 estilhas cristalinas.</p>`
      }
    },
    {
      _id: pageIds[4],
      name: '5. Parte 4: Quando a Paz Desaba',
      type: 'text',
      sort: 500000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 4: Quando a Paz Desaba</h2>
<h3>Cena 1 — O Nada em Expansão</h3>
<p>Evacuação urgente durante o colapso do santuário: @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30NadaExpansa]{O Nada em Expansão (ND 10)} (5 sucessos antes de 3 falhas).</p>
<h3>Cena 2 — Sentença</h3>
<p>Os heróis decidem o destino dos sobreviventes maculados: <strong>Execução Misericordiosa</strong> (Favor de Arsenal +5 PM / Desfavor de Marah), <strong>Cativeiro/Isolamento</strong> (Favor de Marah +2 resistências / Desfavor de Arsenal –5 Iniciativa) ou <strong>Tentativa de Cura</strong> (Religião CD 30, 3 sucessos; 1 estilha concede +2). Registre via @UUID[Compendium.compendios-para-t20.rt20-030-poderes.Item.fld30SentencaFav]{Sentença de Valkaria}.</p>
<h3>Cena 3 — Alma de Aço</h3>
<p>Thalgrimm Sangue de Ferro manifesta-se como fantasma azulado (Misticismo/Religião CD 15), revelando ter guiado os heróis desde a morte. As armas são devolvidas e a Igreja de Marah oferece tesouro de ND 6 + sucessos da Cena 1.</p>`
      }
    },
    {
      _id: pageIds[5],
      name: '6. Regras Especiais: Combate Alternativo & Fullgori',
      type: 'text',
      sort: 600000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Regras Especiais de Guerra e Paz</h2>
<h3>Atacar com Perícias Alternativas (Coral Branco, p. 14)</h3>
<ul>
  <li><strong>Perícias Úteis:</strong> Atuação, Conhecimento, Diplomacia, Guerra, Intuição, Religião e Vontade (revelado com ação livre + Guerra/Intuição/Misticismo CD 15).</li>
  <li><strong>Mecânica:</strong> Exige ação padrão e vence a Defesa do Coral (33). Causa <strong>2d6 + Car</strong> pontos de dano (+1d6 por 1 PM gasto, até 5 PM/+5d6).</li>
  <li><strong>Vantagens:</strong> Não sofre redução pela habilidade de enxame e não viola as Obrigações &amp; Restrições de Marah.</li>
  <li><strong>Entorpecimento:</strong> Falhar em qualquer teste de perícia contra o Coral impõe penalidade cumulativa de –1 em todos os testes seguintes até o fim da cena.</li>
</ul>
<h3>Habilidades Fullgori (p. 21)</h3>
<p><strong>Teofagia:</strong> Ao causar dano a um devoto, este perde 1 PM por patamar do fullgori (se chegar a 0 PM, perde poderes concedidos e magias divinas por 24h).<br />
<strong>Imunidades:</strong> Acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>`
      }
    },
    {
      _id: pageIds[6],
      name: '7. Bestiário, Parceiros & Links Rápidos',
      type: 'text',
      sort: 700000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Bestiário &amp; Compêndios da Edição 30</h2>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30ElanorLumVA]{Elanor Lúmen-Velho (ND 8)} &amp; @UUID[Compendium.compendios-para-t20.rt20-030-poderes.Item.fld30ParcElanorA]{Parceiro: Elanor Lúmen-Velho}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30DaliriaMara]{Dalíria de Marah (ND 8)} &amp; @UUID[Compendium.compendios-para-t20.rt20-030-poderes.Item.fld30ParcDaliria]{Parceira: Dalíria de Marah}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30DevotoMarah]{Devoto de Marah Fullgori (ND 6)}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30CoralBranco]{Coral Branco (ND 10)}</li>
  <li>Perigos: @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30VidenciaCin]{Vidência de Cinzas}, @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30JulgamentoM]{Julgamento dos Mansos}, @UUID[Compendium.compendios-para-t20.rt20-030-ameacas.Actor.fld30NadaExpansa]{O Nada em Expansão}</li>
  <li>Macro: @UUID[Compendium.compendios-para-t20.rt20-030-macros.Macro.fld30MacroGuerra]{Rastreador: Guerra e Paz (Edição 30)}</li>
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
// 4. TABELAS DE ROLAGEM (rt20-030-tabelas)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 30 em rt20-030-tabelas ---');
  const db = await openHierarchicalPack('rt20-030-tabelas');

  const tables = [
    {
      id: 'fld30TabFrasesDv',
      name: 'Devotos Fullgori — Frases em Combate (Edição 30)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
      description: '<p>Falas oficiais dos Devotos de Marah Fullgori durante a emboscada na Parte 2, Cena 3 (p. 11).</p>',
      results: [
        { id: 'res30Dev00000001', name: 'Resistir Dói', text: '"Não resistam… resistir dói."', range: [1, 1] },
        { id: 'res30Dev00000002', name: 'Luta Acabou', text: '"A luta acabou. Vocês não aceitaram."', range: [2, 2] },
        { id: 'res30Dev00000003', name: 'Descansem Para Sempre', text: '"Marah quer que descansem. Para sempre."', range: [3, 3] },
        { id: 'res30Dev00000004', name: 'Posso Ajudar', text: '"Vocês estão cansados. Eu posso ajudar."', range: [4, 4] },
        { id: 'res30Dev00000005', name: 'Amor Sem Escolha', text: '"Amor não precisa de escolha."', range: [5, 5] },
        { id: 'res30Dev00000006', name: 'Paz é Destino', text: '"Paz não é pedido. É destino."', range: [6, 6] },
        { id: 'res30Dev00000007', name: 'Insistem em Sofrer', text: '"Por que insistem em sofrer?"', range: [7, 7] },
        { id: 'res30Dev00000008', name: 'Fechem os Olhos', text: '"Fechem os olhos. Deixem comigo."', range: [8, 8] },
        { id: 'res30Dev00000009', name: 'Alegria Sem Perguntas', text: '"A alegria verdadeira não faz perguntas."', range: [9, 9] },
        { id: 'res30Dev00000010', name: 'Marah Perdoa', text: '"Marah perdoa. Eu termino."', range: [10, 10] }
      ]
    },
    {
      id: 'fld30TabFrasesCo',
      name: 'Coral Branco — Frases em Combate (Edição 30)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-da-luminosidade.webp',
      description: '<p>Falas oficiais do Coral Branco durante o confronto na Parte 3, Cena 3 (p. 15).</p>',
      results: [
        { id: 'res30Cor00000001', name: 'Nada Precisa Ser Feito', text: '"Nada precisa ser feito. A dor acaba quando a vontade cessa."', range: [1, 1] },
        { id: 'res30Cor00000002', name: 'Descansar é Melhor', text: '"Descansar é melhor que escolher. Paz não exige identidade."', range: [2, 2] },
        { id: 'res30Cor00000003', name: 'Solte o Peso', text: '"Solte o peso de ser alguém. Não lute. Deixe-se ficar."', range: [3, 3] },
        { id: 'res30Cor00000004', name: 'O Silêncio é Gentil', text: '"O silêncio é mais gentil que o esforço."', range: [4, 4] },
        { id: 'res30Cor00000005', name: 'Decisão Machuca', text: '"Toda decisão machuca. Aqui, não."', range: [5, 5] },
        { id: 'res30Cor00000006', name: 'Cansados de Existir', text: '"Estão cansados de existir. O amor verdadeiro não resiste."', range: [6, 6] },
        { id: 'res30Cor00000007', name: 'Nada Espera', text: '"Nada espera por vocês além de vocês mesmos."', range: [7, 7] },
        { id: 'res30Cor00000008', name: 'Primeiro Desejo', text: '"A guerra começa com o primeiro desejo."', range: [8, 8] },
        { id: 'res30Cor00000009', name: 'Completos e Vazios', text: '"Sejam completos e vazios. O nada não decepciona."', range: [9, 9] },
        { id: 'res30Cor00000010', name: 'Desapareçam em Paz', text: '"Desapareçam em paz. Aqui, até a esperança descansa."', range: [10, 10] }
      ]
    },
    {
      id: 'fld30TabPresenca',
      name: 'A Presença — Eventos Espirituais de Thalgrimm (Edição 30)',
      formula: '1d4',
      img: 'systems/tormenta20/icons/magias/bencao.webp',
      description: '<p>Os quatro efeitos de intervenção silenciosa de Thalgrimm Sangue de Ferro (máximo 1x por cena, Parte 3, Cena 1, p. 12).</p>',
      results: [
        { id: 'res30Pre00000001', name: 'Apoio Firme', text: 'Um personagem é bem-sucedido em um teste já falho.', range: [1, 1] },
        { id: 'res30Pre00000002', name: 'Forja Protetora', text: 'Uma única perda de PV ou PM é cancelada.', range: [2, 2] },
        { id: 'res30Pre00000003', name: 'Temperado no Aço', text: 'Uma condição tem sua duração reduzida ao mínimo.', range: [3, 3] },
        { id: 'res30Pre00000004', name: 'Sopro de Disciplina', text: 'Uma pergunta importante em um diálogo é "soprada" a um personagem.', range: [4, 4] }
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
// 5. MACROS (rt20-030-macros)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 30 em rt20-030-macros ---');
  const db = await openHierarchicalPack('rt20-030-macros');

  const macroId = 'fld30MacroGuerra';
  const macroScript = `/**
 * Rastreador: Prova das Mãos Vazias, Combate ao Coral Branco & Sentença — Fúlgor dos Deuses (Edição 30)
 */
const PEN_FLAG = "fullgor30MaosVaziasPen";
const currentPen = Number(game.user.getFlag("world", PEN_FLAG) || 0);

const dialogHtml = \`
  <form>
    <p><strong>Santuário do Abraço Final (Edição 30: Guerra e Paz)</strong></p>
    <p><small>Penalidade acumulada na Prova das Mãos Vazias: <strong>\${currentPen}</strong> (máx. -5).</small></p>
    <div class="form-group">
      <label>Modificador de Carisma (Coral Branco):</label>
      <input type="number" name="carMod" value="3" />
    </div>
    <div class="form-group">
      <label>PM extras (0 a 5, +1d6 cada):</label>
      <input type="number" name="extraPm" value="0" min="0" max="5" />
    </div>
  </form>
\`;

async function onAltAttack(html) {
  const root = html instanceof HTMLElement ? html : html[0];
  const car = Number(root?.querySelector('[name="carMod"]')?.value || 0);
  const pm = Math.max(0, Math.min(5, Number(root?.querySelector('[name="extraPm"]')?.value || 0)));
  const diceCount = 2 + pm;
  const roll = await new Roll(\`\${diceCount}d6 + \${car}\`).evaluate();
  await roll.toMessage({ flavor: \`Ataque Simbólico contra Coral Branco (\${pm} PM extras — ignora Enxame e O&R de Marah)\` });
}

async function onAddPen() {
  const next = Math.min(5, currentPen + 1);
  await game.user.setFlag("world", PEN_FLAG, next);
  ChatMessage.create({ content: \`<p><strong>🕊️ Prova das Mãos Vazias:</strong> Penalidade atualizada para <strong>-\${next}</strong> em ataques e resistências no santuário (-3 letal, -1 não letal/manobra/Intimidação/sofrer dano, -2 condição).</p>\` });
}

async function onResetPen() {
  await game.user.setFlag("world", PEN_FLAG, 0);
  ChatMessage.create({ content: "<p><strong>🕊️ Prova das Mãos Vazias:</strong> Contador de penalidades reiniciado para 0.</p>" });
}

async function onRegrasSentenca() {
  ChatMessage.create({
    content: \`<div style="border:2px solid #7b1fa2;padding:8px;border-radius:6px;background:#faf5ff;">
      <h4 style="margin:0 0 4px 0;color:#7b1fa2;">Sentença de Valkaria &amp; Voto Impossível (Ed. 30)</h4>
      <ul style="margin:0;padding-left:16px;">
        <li><strong>Execução Misericordiosa:</strong> Favor de Arsenal (+5 PM) / Desfavor de Marah (descanso pior).</li>
        <li><strong>Cativeiro/Isolamento:</strong> Favor de Marah (+2 Resistências) / Desfavor de Arsenal (-5 Iniciativa).</li>
        <li><strong>Tentativa de Cura:</strong> Religião CD 30 (3 sucessos); 1 estilha = +2.</li>
      </ul>
    </div>\`
  });
}

if (foundry?.applications?.api?.DialogV2) {
  foundry.applications.api.DialogV2.wait({
    window: { title: "Edição 30 — Guerra e Paz" },
    content: dialogHtml,
    buttons: [
      { action: "alt", icon: "fas fa-hand-sparkles", label: "Perícia vs Coral", default: true, callback: (ev, btn, dlg) => onAltAttack(dlg.element) },
      { action: "pen", icon: "fas fa-scale-balanced", label: "+1 Penalidade", callback: onAddPen },
      { action: "reset", icon: "fas fa-rotate-left", label: "Zerar Pen.", callback: onResetPen },
      { action: "sentenca", icon: "fas fa-scroll", label: "Regras Sentença", callback: onRegrasSentenca }
    ]
  });
} else {
  new Dialog({
    title: "Edição 30 — Guerra e Paz",
    content: dialogHtml,
    buttons: {
      alt: { icon: '<i class="fas fa-hand-sparkles"></i>', label: "Perícia vs Coral", callback: onAltAttack },
      pen: { icon: '<i class="fas fa-scale-balanced"></i>', label: "+1 Penalidade", callback: onAddPen },
      reset: { icon: '<i class="fas fa-rotate-left"></i>', label: "Zerar Pen.", callback: onResetPen },
      sentenca: { icon: '<i class="fas fa-scroll"></i>', label: "Regras Sentença", callback: onRegrasSentenca }
    },
    default: "alt"
  }).render(true);
}
`;

  const macroDoc = {
    _id: macroId,
    name: 'Rastreador: Prova das Mãos Vazias, Coral Branco & Sentença (Edição 30)',
    type: 'script',
    folder: null,
    sort: 400000,
    img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
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
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 30 (GUERRA E PAZ)');
  console.log('================================================================================');

  await injectThreats();
  await injectItemsAndPowers();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 30 CONCLUÍDA COM SUCESSO NOS COMPÊNDIOS HIERÁRQUICOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 30:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItemsAndPowers, injectJournals, injectTables, injectMacros };

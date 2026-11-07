#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens, Parceiros e Venenos da DB #229 em Itens_T20
 *
 * Conteúdo:
 * 1. 5 Parceiros Especiais de "Os Cães das Colinas":
 *    - Arius Gorgonius Dubitatius (Minotauro Filósofo)
 *    - Aylarianna Purpúrea (Ayla)
 *    - Ignis Crae (Paladino de Thyatis)
 *    - Kir’zanaath Odello (Kiki)
 *    - Rexthor (Campeão do Abismo)
 * 2. 3 Parceiros de "Breves Jornadas: O Olho do Basilisco":
 *    - Defensor Rochoso Desperto (Guardião Veterano)
 *    - Kemooz Pensativo (Gênio da Terra)
 *    - Filhote de Grifo (Montaria)
 * 3. 5 Itens, Matérias-Primas, Venenos e Armas de "O Olho do Basilisco":
 *    - Olho de Basilisco Ancestral
 *    - Couro de Basilisco Ancestral
 *    - Peçonha Concentrada
 *    - Peçonha Potente
 *    - Machado de Batalha do Culto do Basilisco
 *
 * Arquitetura Canônica de Subdocumentos ClassicLevel do Foundry VTT:
 * - O item pai armazena effects: [effId1, effId2, ...]
 * - Cada efeito é gravado em !items.effects!${itemId}.${effId} com schema BaseEffect
 * - Sincronização automática em packs/Itens_T20 e src/packs/Itens_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildItem,
  buildWeaponItem,
  buildActiveEffect,
  saveToSourcePacks
} = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB229 = 'Dragão Brasil #229';

// Pastas Oficiais em Itens_T20
const FOLDER_PARCEIROS = '0uRx5Efj3tk7P5Xr';
const FOLDER_VENENOS = 'pJFxHpqcoNgiVRuo';
const FOLDER_SUPERIORES = 'qrF7mpfmMVo41wkr';
const FOLDER_EQUIPAMENTOS = 'f9rwHA7dJnFLVQH1';
const FOLDER_ARMAS = 'VkkBiC6Epn7FfW6p';

const DB229_ITEMS = [
  // =========================================================================
  // PARCEIROS ESPECIAIS: OS CÃES DAS COLINAS (DB #229, p. 25-29)
  // =========================================================================

  // 1. Parceiro: Arius Gorgonius Dubitatius
  buildItem({
    name: 'Parceiro: Arius Gorgonius Dubitatius',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/conhecimento-de-lendas.webp',
    description: `<p>Arius é um parceiro especial que fornece os seguintes benefícios.</p><p><strong>Iniciante:</strong> você recebe +2 em Conhecimento, Nobreza, Misticismo e Religião.</p><p><strong>Veterano:</strong> como acima, mas o bônus muda para +3 e também se aplica a testes de resistência.</p><p><strong>Mestre:</strong> como acima, mas o bônus muda para +4 e também se aplica a rolagens de dano.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (Os Cães das Colinas)`
    },
    effects: [
      {
        name: 'Iniciante: Filosofia Táurica (+2 Perícias Mentais)',
        description: 'Fornece +2 em Conhecimento, Nobreza, Misticismo e Religião.',
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '2' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '2' },
          { key: 'system.pericias.mist.outros', mode: 2, value: '2' },
          { key: 'system.pericias.reli.outros', mode: 2, value: '2' }
        ],
        transfer: true
      },
      {
        name: 'Veterano: Erudição de Tanna-Toh (+3 Perícias e Resistências)',
        description: 'Bônus muda para +3 nas perícias e aplica-se a testes de resistência.',
        disabled: true,
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '3' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '3' },
          { key: 'system.pericias.mist.outros', mode: 2, value: '3' },
          { key: 'system.pericias.reli.outros', mode: 2, value: '3' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '3' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '3' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '3' }
        ],
        transfer: true
      },
      {
        name: 'Mestre: Verdade como Poder (+4 Perícias, Resistências e Dano)',
        description: 'Bônus muda para +4 e aplica-se também a rolagens de dano.',
        disabled: true,
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '4' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '4' },
          { key: 'system.pericias.mist.outros', mode: 2, value: '4' },
          { key: 'system.pericias.reli.outros', mode: 2, value: '4' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '4' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '4' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '4' },
          { key: 'system.modificadores.dano.geral', mode: 2, value: '4' }
        ],
        transfer: true
      }
    ]
  }),

  // 2. Parceira: Aylarianna Purpúrea (Ayla)
  buildItem({
    name: 'Parceira: Aylarianna Purpúrea (Ayla)',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
    description: `<p>Ayla é uma parceira especial que fornece os seguintes benefícios.</p><p><strong>Iniciante:</strong> você recebe +2 em Enganação e Ladinagem. Além disso, uma vez por aventura, pode receber um preparado alquímico de até T$ 150.</p><p><strong>Veterano:</strong> como acima, mas o bônus muda para +3 e você também pode receber uma poção de até T$ 300.</p><p><strong>Mestre:</strong> como acima, mas o bônus muda para +4 e o custo para lançar suas magias de ilusão diminui em –1 PM (cumulativa com outras reduções). Além disso, quando comprar ou vender preparados alquímicos e poções, você muda o preço em 20% a seu favor. Se tiver acesso aos itens do encarte “O Empório Purpúrea é…” da Coleção Arton, você muda o preço deles em 30% a seu favor.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (Os Cães das Colinas)`
    },
    effects: [
      {
        name: 'Iniciante: Esperteza Feérica (+2 Enganação e Ladinagem)',
        description: 'Fornece +2 em Enganação e Ladinagem.',
        changes: [
          { key: 'system.pericias.enga.outros', mode: 2, value: '2' },
          { key: 'system.pericias.ladi.outros', mode: 2, value: '2' }
        ],
        transfer: true
      },
      {
        name: 'Veterano: Negócios Mágicos (+3 Enganação e Ladinagem)',
        description: 'Bônus em Enganação e Ladinagem muda para +3.',
        disabled: true,
        changes: [
          { key: 'system.pericias.enga.outros', mode: 2, value: '3' },
          { key: 'system.pericias.ladi.outros', mode: 2, value: '3' }
        ],
        transfer: true
      },
      {
        name: 'Mestre: Empório Purpúrea (+4 Perícias e -1 PM Ilusão)',
        description: 'Bônus muda para +4 e reduz custo de magias de ilusão em –1 PM.',
        disabled: true,
        changes: [
          { key: 'system.pericias.enga.outros', mode: 2, value: '4' },
          { key: 'system.pericias.ladi.outros', mode: 2, value: '4' },
          { key: 'system.modificadores.custoPM', mode: 2, value: '-1' }
        ],
        transfer: true
      }
    ]
  }),

  // 3. Parceiro: Ignis Crae
  buildItem({
    name: 'Parceiro: Ignis Crae',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/concedidos/dom-da-ressurreicao.webp',
    description: `<p>Ignis é um parceiro especial que fornece os seguintes benefícios.</p><p><strong>Iniciante:</strong> você recebe +2 na Defesa, testes de resistência e redução de dano.</p><p><strong>Veterano:</strong> como acima, mas o bônus muda para +3.</p><p><strong>Mestre:</strong> como acima, mas o bônus muda para +5, exceto o bônus em RD, que muda para +10. Além disso, um aliado adjacente a você também recebe esses benefícios.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (Os Cães das Colinas)`
    },
    effects: [
      {
        name: 'Iniciante: Égide de Metal e Fogo (+2 Defesa, Resistências e RD 2)',
        description: 'Fornece +2 na Defesa, testes de resistência e redução de dano 2.',
        changes: [
          { key: 'system.attributes.defesa.outros', mode: 2, value: '2' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '2' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '2' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '2' },
          { key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '2' }
        ],
        transfer: true
      },
      {
        name: 'Veterano: Chamas da Redenção (+3 Defesa, Resistências e RD 3)',
        description: 'Bônus muda para +3 na Defesa, testes de resistência e RD.',
        disabled: true,
        changes: [
          { key: 'system.attributes.defesa.outros', mode: 2, value: '3' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '3' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '3' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '3' },
          { key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '3' }
        ],
        transfer: true
      },
      {
        name: 'Mestre: Ordem da Redenção (+5 Defesa, +5 Resistências e RD 10)',
        description: 'Bônus muda para +5 na Defesa e resistências, e RD 10 (compartilhado com aliado adjacente).',
        disabled: true,
        changes: [
          { key: 'system.attributes.defesa.outros', mode: 2, value: '5' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '5' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '5' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '5' },
          { key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '10' }
        ],
        transfer: true
      }
    ]
  }),

  // 4. Parceira: Kir’zanaath Odello (Kiki)
  buildItem({
    name: 'Parceira: Kir’zanaath Odello (Kiki)',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/inspiracao.webp',
    description: `<p>Kiki é uma parceira especial que fornece os seguintes benefícios.</p><p><strong>Iniciante:</strong> você recebe +2 em Atuação, Investigação e Ofício (cozinheiro).</p><p><strong>Veterano:</strong> como acima, mas o bônus muda para +3 e você pode substituir testes de Percepção e Intuição por testes de Investigação.</p><p><strong>Mestre:</strong> como acima, mas o bônus muda para +4 e você pode usar a habilidade Inspiração como um bardo de mesmo nível.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (Os Cães das Colinas)`
    },
    effects: [
      {
        name: 'Iniciante: Barda Investigadora (+2 Atuação, Investigação e Culinária)',
        description: 'Fornece +2 em Atuação, Investigação e Ofício (cozinheiro).',
        changes: [
          { key: 'system.pericias.atua.outros', mode: 2, value: '2' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '2' },
          { key: 'system.pericias.cozi.outros', mode: 2, value: '2' }
        ],
        transfer: true
      },
      {
        name: 'Veterano: Leitura de Pessoas (+3 Perícias e Sentidos Investigativos)',
        description: 'Bônus muda para +3 e permite substituir Percepção e Intuição por Investigação.',
        disabled: true,
        changes: [
          { key: 'system.pericias.atua.outros', mode: 2, value: '3' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '3' },
          { key: 'system.pericias.cozi.outros', mode: 2, value: '3' }
        ],
        transfer: true
      },
      {
        name: 'Mestre: Inspiração das Serpentes (+4 Perícias e Inspiração de Bardo)',
        description: 'Bônus muda para +4 e concede a habilidade Inspiração de bardo.',
        disabled: true,
        changes: [
          { key: 'system.pericias.atua.outros', mode: 2, value: '4' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '4' },
          { key: 'system.pericias.cozi.outros', mode: 2, value: '4' }
        ],
        transfer: true
      }
    ]
  }),

  // 5. Parceiro: Rexthor
  buildItem({
    name: 'Parceiro: Rexthor',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
    description: `<p>Rexthor é um parceiro especial que fornece os seguintes benefícios.</p><p><strong>Iniciante:</strong> você recebe +2 em Luta e uma vez por rodada, você recebe +1d8 em uma rolagem de dano.</p><p><strong>Veterano:</strong> como acima, mas o bônus muda para +3 e também se aplica a Furtividade e Percepção.</p><p><strong>Mestre:</strong> como acima, mas o bônus muda para +4, você nunca fica surpreendido e não pode ser flanqueado.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (Os Cães das Colinas)`
    },
    effects: [
      {
        name: 'Iniciante: Campeão do Abismo (+2 Luta, +1d8 Dano)',
        description: 'Fornece +2 em Luta e +1d8 em uma rolagem de dano por rodada.',
        changes: [
          { key: 'system.pericias.luta.outros', mode: 2, value: '2' }
        ],
        transfer: true
      },
      {
        name: 'Veterano: Gladiador Caçador (+3 Luta, Furtividade e Percepção)',
        description: 'Bônus muda para +3 e aplica-se a Luta, Furtividade e Percepção.',
        disabled: true,
        changes: [
          { key: 'system.pericias.luta.outros', mode: 2, value: '3' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '3' },
          { key: 'system.pericias.perc.outros', mode: 2, value: '3' }
        ],
        transfer: true
      },
      {
        name: 'Mestre: Instinto Selvagem (+4 Perícias, Imunidade a Surpreso e Flanqueado)',
        description: 'Bônus muda para +4, imune a surpreso e não pode ser flanqueado.',
        disabled: true,
        changes: [
          { key: 'system.pericias.luta.outros', mode: 2, value: '4' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '4' },
          { key: 'system.pericias.perc.outros', mode: 2, value: '4' }
        ],
        transfer: true
      }
    ]
  }),

  // =========================================================================
  // PARCEIROS DE BREVES JORNADAS: O OLHO DO BASILISCO (DB #229, p. 39-42)
  // =========================================================================

  // 6. Parceiro: Defensor Rochoso Desperto
  buildItem({
    name: 'Parceiro: Defensor Rochoso Desperto',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/bloqueio-com-escudo.webp',
    description: `<p>O defensor rochoso desperto é um parceiro guardião veterano. Fornece +3 na Defesa e em testes de resistência, além de poder interpor-se para defender o aliado.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (O Olho do Basilisco)`
    },
    effects: [
      {
        name: 'Guardião Veterano (+3 Defesa e Resistências)',
        description: 'Fornece +3 na Defesa e em testes de resistência.',
        changes: [
          { key: 'system.attributes.defesa.outros', mode: 2, value: '3' },
          { key: 'system.pericias.fort.outros', mode: 2, value: '3' },
          { key: 'system.pericias.refl.outros', mode: 2, value: '3' },
          { key: 'system.pericias.vont.outros', mode: 2, value: '3' }
        ],
        transfer: true
      }
    ]
  }),

  // 7. Parceiro: Kemooz Pensativo
  buildItem({
    name: 'Parceiro: Kemooz Pensativo',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/magias/criar-elementos.webp',
    description: `<p>O kemooz é um parceiro iniciante que fornece o seguinte benefício: uma vez por rodada, você pode criar um cubo de terra de 1,5m de lado em um espaço desocupado a até 9m. O cubo tem RD 5 e 30 PV, e dura até o fim da cena ou até você acumular 4 cubos. Para mais informações, veja Deuses de Arton, p. 304.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (O Olho do Basilisco)`
    },
    effects: [
      {
        name: 'Moldar Terreno (Cubo de Terra RD 5, 30 PV)',
        description: 'Cria 1 cubo de terra de 1,5m com RD 5 e 30 PV em alcance de 9m (máx 4 cubos).',
        transfer: true
      }
    ]
  }),

  // 8. Parceiro: Filhote de Grifo
  buildItem({
    name: 'Parceiro: Filhote de Grifo',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/itens/gerais/grifo.webp',
    description: `<p>Se cuidados adequadamente, os ovos encontrados nas Sanguinárias eclodem, fornecendo um grifo parceiro montaria iniciante. Fornece +3m de deslocamento ou auxílio em combate.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      source: `${SOURCE_DB229} (O Olho do Basilisco)`
    },
    effects: [
      {
        name: 'Montaria Iniciante (+3m Deslocamento)',
        description: 'Fornece +3m no deslocamento terrestre.',
        changes: [
          { key: 'system.attributes.movement.walk.bonus', mode: 2, value: '3' }
        ],
        transfer: true
      }
    ]
  }),

  // =========================================================================
  // ITENS, MATÉRIAS-PRIMAS, VENENOS E ARMAS: O OLHO DO BASILISCO (DB #229)
  // =========================================================================

  // 9. Olho de Basilisco Ancestral
  buildItem({
    name: 'Olho de Basilisco Ancestral',
    type: 'consumivel',
    folder: FOLDER_EQUIPAMENTOS,
    img: 'systems/tormenta20/icons/itens/gerais/gemas-preciosas.webp',
    description: `<p>O olho arrancado de um basilisco ancestral colossal das Montanhas Sanguinárias. Quando devidamente preparado e esmagado sobre uma vítima petrificada, verte um líquido verde luminoso capaz de reverter até mesmo as petrificações e transformações em pedra mais antigas e potentes, como a maldição das euríades.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'outro',
      preco: 2500,
      espacos: 1,
      peso: 1,
      source: `${SOURCE_DB229} (O Olho do Basilisco)`
    }
  }),

  // 10. Couro de Basilisco Ancestral
  buildItem({
    name: 'Couro de Basilisco Ancestral',
    type: 'equipamento',
    folder: FOLDER_SUPERIORES,
    img: 'systems/tormenta20/icons/itens/gerais/couro-de-basilisco.webp',
    description: `<p>Couro espesso e couraçado extraído de um basilisco ancestral (requer teste de Sobrevivência CD 24 para extrair). Conta como T$ 2.000 como matéria-prima para a fabricação de armaduras superiores.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'itemSuperior',
      preco: 2000,
      espacos: 2,
      peso: 2,
      source: `${SOURCE_DB229} (O Olho do Basilisco)`
    }
  }),

  // 11. Peçonha Concentrada
  buildItem({
    name: 'Peçonha Concentrada',
    type: 'consumivel',
    folder: FOLDER_VENENOS,
    img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
    description: `<p>Veneno extraído de serpes das Montanhas Sanguinárias (CD 23 para extrair). Uma criatura envenenada perde 1d12 pontos de vida por rodada durante 3 rodadas (um teste de Fortitude CD 26 reduz a duração para uma rodada).</p>`,
    chatFlavor: '',
    system: {
      tipo: 'veneno',
      preco: 600,
      espacos: 1,
      peso: 1,
      ativacao: {
        execucao: 'padrao',
        custo: 0
      },
      duracao: {
        value: 3,
        units: 'rodadas'
      },
      resistencia: {
        pericia: 'fort',
        bonus: 26,
        txt: 'Fortitude CD 26 reduz a duração para 1 rodada.'
      },
      source: `${SOURCE_DB229} (O Olho do Basilisco)`,
      rolls: [
        {
          name: 'Perda Contínua de PV (1d12)',
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
      ]
    },
    effects: [
      {
        name: 'Condição: Envenenado (Peçonha Concentrada CD 26)',
        description: 'Perde 1d12 PV por rodada durante 3 rodadas (ou 1 rodada se passar em Fort CD 26).',
        statuses: ['envenenado'],
        duration: { rounds: 3 },
        transfer: false
      }
    ]
  }),

  // 12. Peçonha Potente
  buildItem({
    name: 'Peçonha Potente',
    type: 'consumivel',
    folder: FOLDER_VENENOS,
    img: 'systems/tormenta20/icons/itens/gerais/veneno.webp',
    description: `<p>Veneno virulento e concentrado extraído das glândulas do Basilisco Ancestral (CD 24 para extrair). Uma criatura envenenada perde 2d12 pontos de vida por rodada durante 3 rodadas (um teste de Fortitude CD 28 reduz a duração para uma rodada).</p>`,
    chatFlavor: '',
    system: {
      tipo: 'veneno',
      preco: 1500,
      espacos: 1,
      peso: 1,
      ativacao: {
        execucao: 'padrao',
        custo: 0
      },
      duracao: {
        value: 3,
        units: 'rodadas'
      },
      resistencia: {
        pericia: 'fort',
        bonus: 28,
        txt: 'Fortitude CD 28 reduz a duração para 1 rodada.'
      },
      source: `${SOURCE_DB229} (O Olho do Basilisco)`,
      rolls: [
        {
          name: 'Perda Contínua de PV (2d12)',
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
      ]
    },
    effects: [
      {
        name: 'Condição: Envenenado (Peçonha Potente CD 28)',
        description: 'Perde 2d12 PV por rodada durante 3 rodadas (ou 1 rodada se passar em Fort CD 28).',
        statuses: ['envenenado'],
        duration: { rounds: 3 },
        transfer: false
      }
    ]
  }),

  // 13. Machado de Batalha do Culto do Basilisco
  buildWeaponItem({
    name: 'Machado de Batalha do Culto do Basilisco',
    img: 'systems/tormenta20/icons/itens/equipamentos/machado-de-batalha.webp',
    folder: FOLDER_ARMAS,
    empunhadura: 'uma',
    dano: '1d8',
    tipoDano: 'corte',
    criticoMargem: 20,
    criticoMultiplicador: 3,
    alcance: 'corpo-a-corpo',
    preco: 650,
    espacos: 1,
    description: `<p>Machado de batalha marcial forjado pelos fanáticos que adoram o Grande Basilisco nas Sanguinárias. A lâmina é entalhada com ranhuras capilares que mantêm peçonha concentrada ativa, causando dano adicional de veneno.</p>`,
    chatFlavor: '',
    rolls: [
      {
        name: 'Ataque Corpo a Corpo',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Corte',
        key: 'dano1',
        type: 'dano',
        parts: [['1d8+5', 'corte', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Veneno (Peçonha Concentrada)',
        key: 'dano2',
        type: 'dano',
        parts: [['1d12', 'veneno', '']],
        versatil: '',
        adaptavel: ''
      }
    ]
  })
];

async function injectItems() {
  console.log('=== Injetando Itens, Parceiros e Venenos da DB #229 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  let count = 0;
  for (const item of DB229_ITEMS) {
    const key = `!items!${item._id}`;

    // Constrói os subdocumentos de efeitos no padrão canônico ClassicLevel
    const effectDocs = (item.effects || []).map(eff => {
      return {
        _id: eff._id,
        name: eff.name,
        flags: {
          tormenta20: {
            onuse: Boolean(eff.flags?.tormenta20?.onuse),
            durationScene: Boolean(eff.flags?.tormenta20?.durationScene),
            self: eff.flags?.tormenta20?.self !== undefined ? Boolean(eff.flags.tormenta20.self) : true,
            attack: Boolean(eff.flags?.tormenta20?.attack),
            skill: Boolean(eff.flags?.tormenta20?.skill),
            ability: Boolean(eff.flags?.tormenta20?.ability),
            power: Boolean(eff.flags?.tormenta20?.power),
            equipment: Boolean(eff.flags?.tormenta20?.equipment),
            spell: Boolean(eff.flags?.tormenta20?.spell),
            consumable: Boolean(eff.flags?.tormenta20?.consumable),
            items: eff.flags?.tormenta20?.items || '',
            aumenta: Boolean(eff.flags?.tormenta20?.aumenta),
            custo: eff.flags?.tormenta20?.custo || null,
            ...(eff.flags?.tormenta20 || {})
          },
          ...(eff.flags || {})
        },
        duration: {
          rounds: eff.duration?.rounds || null,
          seconds: eff.duration?.seconds || null,
          startTime: eff.duration?.startTime || null,
          combat: eff.duration?.combat || null,
          turns: eff.duration?.turns || null,
          startRound: eff.duration?.startRound || null,
          startTurn: eff.duration?.startTurn || null,
          ...(eff.duration || {})
        },
        disabled: Boolean(eff.disabled),
        img: eff.img || item.img || 'systems/tormenta20/icons/svg/skills.svg',
        type: 'base',
        system: {},
        changes: (eff.changes || []).map(c => ({
          key: c.key,
          mode: c.mode !== undefined ? c.mode : 2,
          value: String(c.value),
          priority: c.priority !== undefined ? c.priority : 20
        })),
        description: eff.description || '',
        transfer: eff.transfer !== undefined ? Boolean(eff.transfer) : true,
        statuses: eff.statuses || [],
        sort: 0,
        _stats: {
          compendiumSource: null,
          duplicateSource: null,
          exportSource: null,
          coreVersion: '13.351',
          systemId: 'tormenta20',
          systemVersion: '1.5.015',
          createdTime: Date.now(),
          modifiedTime: Date.now(),
          lastModifiedBy: null
        }
      };
    });

    const effectIds = effectDocs.map(e => e._id);

    // No documento do item do compêndio, effects armazena os IDs dos subdocumentos
    const itemToStore = {
      ...item,
      effects: effectIds
    };
    if (itemToStore.system && itemToStore.system.effects) {
      delete itemToStore.system.effects;
    }

    await db.put(key, itemToStore);
    count++;
    console.log(`✓ [${item.type}] "${item.name}" salvo em Itens_T20 (Effects IDs: ${effectIds.length}).`);

    // Limpa efeitos antigos se existirem
    for await (const [effK] of db.iterator({ gte: `!items.effects!${item._id}.`, lte: `!items.effects!${item._id}.\uffff` })) {
      await db.del(effK);
    }

    // Grava cada efeito completo em !items.effects!${item._id}.${eff._id}
    for (const eff of effectDocs) {
      const effKey = `!items.effects!${item._id}.${eff._id}`;
      await db.put(effKey, eff);
    }

    // Salva na árvore de fontes src/packs/Itens_T20
    const embeddedSubdocs = effectDocs.map(eff => ({
      key: `!items.effects!${item._id}.${eff._id}`,
      typePath: '!items.effects!',
      doc: eff
    }));
    saveToSourcePacks('Itens_T20', itemToStore, embeddedSubdocs);
  }

  await db.close();
  console.log(`\n✅ Sucesso: Todos os ${count} itens, poderes, parceiros e venenos da DB #229 injetados com 100% de conformidade canônica em Itens_T20.`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('Erro ao injetar itens:', err);
    process.exit(1);
  });
}

module.exports = { injectItems, DB229_ITEMS };

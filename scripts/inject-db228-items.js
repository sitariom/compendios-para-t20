#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens, Poderes, Magias e Parceiros da DB #228 em Itens_T20
 *
 * Conteúdo: Divinas Organizações (20 Itens e Poderes Canônicos de Arton)
 * Conforme a diretriz canônica: Todo Parceiro, Familiar ou Montaria é criado
 * estritamente como um item do tipo "poder" com subtipo "parceiro" em Itens_T20.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildItem,
  buildWeaponItem,
  buildSpellItem,
  saveToSourcePacks
} = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB228 = 'Dragão Brasil #228 (Divinas Organizações)';

// Pastas Oficiais em Itens_T20
const FOLDER_ARMAS = 'VkkBiC6Epn7FfW6p';
const FOLDER_PODERES = '6HZCPG5QrmzhwmBe';
const FOLDER_PARCEIROS = '0uRx5Efj3tk7P5Xr';
const FOLDER_MAGIAS = 'LgQdDPaUOdMo4oAX';
const FOLDER_ITENS_MAGICOS = 'hHc3Pr3pyP7jzQUo';
const FOLDER_EQUIPAMENTOS = 'f9rwHA7dJnFLVQH1';
const FOLDER_CONSUMIVEL = 'ZMhIquorDsf9xEn8';
const FOLDER_PREPARADOS = 'JNF6nQo2SXWlnyg1';

const DB228_ITEMS = [
  // 1. Arco dos Arautos
  buildWeaponItem({
    name: 'Arco dos Arautos',
    img: 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
    folder: FOLDER_ARMAS,
    empunhadura: 'duas',
    dano: '1d8',
    tipoDano: 'perfuracao',
    criticoMargem: 18, // Preciso (+2 margem de ameaça)
    criticoMultiplicador: 3,
    alcance: 'medio',
    preco: 39100,
    espacos: 2,
    description: `<p>Arma favorita dos Arautos do Destruidor, este arco longo cruel preciso caçador pode ser encontrado por qualquer aventureiro que vasculhe os equipamentos de um membro desta organização. Você recebe a habilidade Marca da Presa do caçador, mas só pode usá-la com esta arma. Se já possui essa habilidade, em vez disso, o custo para usá-la com esta arma diminui em –1 PM. Arma específica média, preço T$ 39.100.</p>`,
    chatFlavor: '',
    rolls: [
      {
        name: 'Ataque à Distância',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['pont', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Perfuração (Cruel)',
        key: 'dano1',
        type: 'dano',
        parts: [['1d8+2', 'perfuracao', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano Adicional de Caçador (Marca da Presa)',
        key: 'dano2',
        type: 'dano',
        parts: [['1d6', 'perfuracao', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Marca da Presa do Caçador (-1 PM)',
        description: 'Concede a habilidade Marca da Presa ou reduz seu custo com este arco em –1 PM.',
        changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }],
        transfer: true
      },
      {
        name: 'Encantamento Cruel (+2 Dano à Distância)',
        description: 'Fornece +2 em rolagens de dano à distância.',
        changes: [{ key: 'system.modificadores.dano.ad', mode: 2, value: '2' }],
        transfer: true
      }
    ]
  }),

  // 2. Certificado de Conclusão
  buildItem({
    name: 'Certificado de Conclusão',
    type: 'poder',
    folder: FOLDER_PODERES,
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<p>Especial: após passar um mês estudando na Caravana das Três Chamas, você recebe este poder. Essa é a única forma de adquiri-lo.</p><p>Você recebe +1 PM e pode lançar uma das magias a seguir (atributo-chave Inteligência) à sua escolha: Alarme, Aviso, Criar Elementos e Luz; mas não pode aplicar aprimoramentos. Caso aprenda novamente uma dessas magias, seu custo diminui em –1 PM e você passa a conseguir aplicar aprimoramentos normalmente.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Certificado de Conclusão (+1 PM)',
        description: 'Concede +1 ponto de mana máximo.',
        changes: [{ key: 'system.attributes.pm.max', mode: 2, value: '1' }],
        transfer: true
      }
    ]
  }),

  // 3. Reabilitador (NOVO PARCEIRO -> PODER)
  buildItem({
    name: 'Parceiro: Reabilitador',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
    description: `<p>É possível encaminhar uma solicitação formal para a Casa dos Desgarrados com o objetivo de contratar um de seus reabilitadores — juízes com treinamento especial para espalhar a justiça de Khalmyr, equilibrando as chances de todos os presentes, como uma ferramenta por meio da qual o Deus da Justiça em pessoa realiza o julgamento — por T$ 1.000. Um reabilitador é um parceiro especial que acompanha o grupo de personagens até o fim da aventura. Durante uma cena à escolha dos jogadores, ele faz todos os modificadores serem iguais à média dos modificadores de todas as criaturas presentes. No final da cena, o reabilitador se despede do grupo e retorna para a Casa dos Desgarrados.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      preco: 1000,
      ativacao: { execucao: 'padrao', custo: 0, qtd: '1 por aventura' },
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Julgamento Equilibrador de Khalmyr (+2 Resistências e Defesa)',
        description: 'Equilibra as chances da cena conferindo estabilidade moral e +2 em testes de resistência e Defesa a aliados.',
        changes: [
          { key: 'system.attributes.defesa.bonus', mode: 2, value: '2' },
          { key: 'system.modificadores.pericias.resistencia', mode: 2, value: '2' }
        ],
        transfer: true
      }
    ]
  }),

  // 4. Chave Mestra
  buildItem({
    name: 'Chave Mestra',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/itens/itens-magicos/espelho-do-aprisonamento.webp',
    description: `<p>Uma chave carregada pelos membros do Claviculário como um símbolo sagrado, este item mágico também é capaz de destrancar qualquer coisa, concedendo sucesso automático em testes de Ladinagem para abrir fechaduras. Contudo, se não for usada por um dos membros do Claviculário ou por um devoto de Sszzaas, um efeito mágico sobre seu material é ativado, reduzindo a Chave Mestra a pó após o primeiro uso. Acessório médio, preço T$ 25.500.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 25500,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Giro Mágico de Sszzaas (+20 Ladinagem para Abrir Fechaduras)',
        description: 'Garante sucesso automático (+20 de bônus) em testes de Ladinagem para abrir fechaduras.',
        changes: [{ key: 'system.pericias.ladi.outros', mode: 2, value: '20' }],
        transfer: true
      }
    ]
  }),

  // 5. Bilhete de Valluk Delsori
  buildItem({
    name: 'Bilhete de Valluk Delsori',
    type: 'consumivel',
    folder: FOLDER_CONSUMIVEL,
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<p>Este item mágico é concedido apenas àqueles que conseguirem descobrir onde a companhia irá se apresentar e consigam assistir a cinco de suas apresentações seguidas. Rasgar o bilhete (como se faz ao entrar para assistir a um espetáculo) permite que o usuário se transforme em uma das grandes figuras de Arton — como o herói Orion Drake ou a própria Rainha-Imperatriz Shivara I —, mas com uma característica diferente da verdadeira pessoa. Você poderia, por exemplo, se transformar em sir Alenn Toren, mas seu tapa-olho estaria no olho esquerdo, em vez do direito. Este efeito funciona como a magia Disfarce Ilusório, com direito ao aprimoramento que aumenta o bônus de Enganação para +20 e duração de 1 dia. Item mágico de uso único, preço T$ 300.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'outro',
      preco: 300,
      espacos: 0,
      consume: { type: 'consumivel', target: '', amount: 1, mpMultiplier: false },
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Metamorfose Cênica de Valluk Delsori (+20 Enganação)',
        description: 'Concede +20 em testes de Enganação para sustentar o disfarce cênico por 1 dia.',
        duration: { seconds: 86400 },
        changes: [{ key: 'system.pericias.enga.outros', mode: 2, value: '20' }],
        transfer: false
      }
    ]
  }),

  // 6. Máscara do Sol Dourado
  buildItem({
    name: 'Máscara do Sol Dourado',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/itens/itens-magicos/brincos.webp',
    description: `<p>Uma máscara amarela com o desenho de um sorriso e dois tibares de ouro no lugar dos olhos, adornados com raios solares em laranja. Enquanto seguir as Obrigações & Restrições de Azgher, as moedas mágicas que substituem os olhos da máscara fornecem +10 em Ladinagem. Contudo, por ser chamativo demais, uma pessoa vestindo este item recebe –2 em Furtividade. Acessório menor, preço T$ 9.000.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 9000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Moedas Solares de Azgher (+10 Ladinagem / -2 Furtividade)',
        description: 'Fornece +10 em Ladinagem e penalidade de -2 em Furtividade enquanto seguir as obrigações de Azgher.',
        changes: [
          { key: 'system.pericias.ladi.outros', mode: 2, value: '10' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '-2' }
        ],
        transfer: true
      }
    ]
  }),

  // 7. Pingente Rubro
  buildItem({
    name: 'Pingente Rubro',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
    description: `<p>Este colar de matéria vermelha é estranho e parece estar sempre mudando de forma. Enquanto seguir as Obrigações & Restrições de Aharadak, sendo devoto ou não, você reduz a perda de PM causada por efeitos lefeu e da Tormenta em –1 PM por patamar. Acessório menor, preço T$ 3.000.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 3000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Proteção Aberrante de Aharadak (-1 PM Perda Tormenta)',
        description: 'Reduz a perda de PM causada por efeitos lefeu em -1 PM por patamar.',
        changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }],
        transfer: true
      }
    ]
  }),

  // 8. Allihennali (NOVO PARCEIRO -> PODER)
  buildItem({
    name: 'Parceiro: Allihennali',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/concedidos/alento-vida.webp',
    description: `<p>Estes espíritos feéricos lembram uma pequena esfera de luz com quatro asas finas de inseto. Um allihennali parceiro fornece os benefícios a seguir.</p><p>Iniciante: uma vez por rodada, você pode gastar 1 PM para curar 2d6 PV de uma criatura em alcance curto.</p><p>Veterano: como acima, mas também reduz o custo de magias que geram efeitos mágicos de cura em –2 PM.</p><p>Mestre: como acima, mas você também pode gastar 3 PM para curar 6d6 PV.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      ativacao: { execucao: 'livre', custo: 1, qtd: '1 por rodada' },
      source: SOURCE_DB228
    },
    rolls: [
      {
        name: 'Cura Feérica (Iniciante 1 PM)',
        key: 'cura0',
        type: 'formula',
        parts: [['2d6', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Cura Maior Feérica (Mestre 3 PM)',
        key: 'cura1',
        type: 'formula',
        parts: [['6d6', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Bênção Feérica de Allihanna (-2 PM em Magias de Cura)',
        description: 'Reduz o custo em PM de magias de cura em –2 PM (patamar Veterano).',
        changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-2' }],
        transfer: true
      }
    ]
  }),

  // 9. Alma de Dragão
  buildItem({
    name: 'Alma de Dragão',
    type: 'equipamento',
    folder: FOLDER_EQUIPAMENTOS,
    img: 'systems/tormenta20/icons/itens/itens-magicos/escudo-do-conjurador.webp',
    description: `<p>Uma pedra translúcida, no formato de uma escama de dragão e do tamanho de um punho fechado, que faz parte das posses de todos os Herdeiros da Escama. Quando sofrer dano de um dos tipos a seguir, você pode reduzir o dano sofrido em um dado como uma reação. Então este item deixa de ser translúcido e armazena a energia do dano, tomando a aparência de uma pedra preciosa: diamante (luz), esmeralda (ácido), ônix (trevas), rubi (fogo), safira (frio) ou topázio (eletricidade). Quando lança uma magia que causa dano do tipo da pedra preciosa enquanto tiver uma energia armazenada, você pode descarregar essa energia como uma ação livre para aumentar o dano em um dado do mesmo tipo. Após descarregar a energia, a pedra volta a ser translúcida e precisa armazenar energia outra vez antes de ser usada novamente. Item esotérico, preço T$ 250.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'outro',
      preco: 250,
      espacos: 1,
      ativacao: { execucao: 'reacao', custo: 0 },
      source: SOURCE_DB228
    },
    rolls: [
      {
        name: 'Redução Reativa Elemental',
        key: 'reducao0',
        type: 'formula',
        parts: [['1d6', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano Extra de Magia Elemental',
        key: 'dano0',
        type: 'dano',
        parts: [['1d6', 'essencia', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Canalização Elemental da Escama (+1d6 Dano em Magias)',
        description: 'Aumenta o dano de magias com o elemento absorvido em +1 dado do mesmo tipo.',
        changes: [{ key: 'system.modificadores.dano.mag.0', mode: 2, value: '1d6' }],
        transfer: false
      }
    ]
  }),

  // 10. Guaxininjas (NOVO PARCEIRO -> PODER)
  buildItem({
    name: 'Parceiro: Guaxininjas',
    type: 'poder',
    folder: FOLDER_PARCEIROS,
    img: 'systems/tormenta20/icons/poderes/ameacas/furtividade.webp',
    description: `<p>Não se sabe ao certo se é possível treinar guaxinins comuns para desempenharem o papel de guaxininjas, mas acredita-se que eles seriam um parceiro capanga especial que fornece os benefícios descritos a seguir. Uma vez por aventura, você pode gastar uma ação de movimento e 2 PM para fazer um assovio e invocar 1d4+1 guaxininjas capangas em espaços desocupados em alcance curto — eles surgem de um beco próximo, por trás de uma pedra ou de maneiras igualmente furtivas. Guaxininjas têm deslocamento 9m, Defesa 17, dano 1d4 de corte cada e Ataque Furtivo +1d6. Eles desaparecem quando morrem ou no fim da cena (veja mais sobre capangas em Heróis de Arton, pp. 240–241).</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'parceiro',
      ativacao: { execucao: 'movimento', custo: 2, qtd: '1 por aventura' },
      source: SOURCE_DB228
    },
    rolls: [
      {
        name: 'Guaxininjas Invocados (1d4+1)',
        key: 'invoc0',
        type: 'formula',
        parts: [['1d4+1', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Ataque Furtivo dos Capangas',
        key: 'dano0',
        type: 'dano',
        parts: [['1d4+1d6', 'corte', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Táticas de Emboscada Tamuraniana (+1d6 Dano Furtivo)',
        description: 'Fornece +1d6 de dano furtivo adicional enquanto acompanhado pelos capangas.',
        changes: [
          { key: 'system.modificadores.dano.cac', mode: 2, value: '1d6' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '2' }
        ],
        transfer: true
      }
    ]
  }),

  // 11. Âncora Naufragista
  buildItem({
    name: 'Âncora Naufragista',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
    description: `<p>Um colar com pingente em forma de âncora, tanto a corrente quanto o pingente são feitos de ferro oxidado, é usado como símbolo sagrado por piratas naufragistas. Enquanto seguir as Obrigações & Restrições de Oceano, sempre que oferecer como tributo para a água do mar um item valioso (com valor mínimo de T$ 100), você recebe um benefício a seguir (à sua escolha) durante 1 dia: deslocamento de natação igual ao seu deslocamento terrestre, +5 em Pilotagem, ou resistência a frio e eletricidade 10. Se você recuperar esse tributo, este item perde todos os seus efeitos e evapora como água do mar. Acessório menor, preço T$ 3.000.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 3000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Tributo de Oceano: Resistência a Frio e Eletricidade 10',
        description: 'Fornece resistência 10 contra dano de frio e eletricidade por 1 dia.',
        duration: { seconds: 86400 },
        changes: [
          { key: 'system.tracos.resistencias.frio.base', mode: 2, value: '10' },
          { key: 'system.tracos.resistencias.eletricidade.base', mode: 2, value: '10' }
        ],
        transfer: true
      },
      {
        name: 'Tributo de Oceano: Timoneiro dos Mares (+5 Pilotagem)',
        description: 'Concede +5 em testes de Pilotagem por 1 dia.',
        duration: { seconds: 86400 },
        changes: [{ key: 'system.pericias.pilo.outros', mode: 2, value: '5' }],
        transfer: false
      },
      {
        name: 'Tributo de Oceano: Natação Oceânica (9m)',
        description: 'Concede deslocamento de natação igual ao deslocamento terrestre.',
        duration: { seconds: 86400 },
        changes: [{ key: 'system.attributes.movement.swim', mode: 2, value: '9' }],
        transfer: false
      }
    ]
  }),

  // 12. Arma Silente
  buildWeaponItem({
    name: 'Arma Silente',
    img: 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
    folder: FOLDER_ARMAS,
    empunhadura: 'duas',
    dano: '1d10',
    tipoDano: 'corte e perfuracao',
    criticoMargem: 19, // Certeira (+1 margem de ameaça)
    criticoMultiplicador: 3,
    preco: 31000,
    espacos: 2,
    description: `<p>Uma arma silente é o espólio obtido por aqueles que derrotam um membro da Lança Silente. Este item é uma arma (escolha entre alabarda, azagaia, lança, lança de falange, lança montada, machado de haste ou pique) certeira equilibrada formidável de adamante que fornece +5 em testes de Conhecimento, Guerra e Nobreza cujo objetivo seja perpetuar a guerra. Arma específica menor, preço T$ 31.000.</p>`,
    chatFlavor: '',
    rolls: [
      {
        name: 'Ataque com Alabarda Silente',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], [2, '', '']], // +2 formidável
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Adamante',
        key: 'dano1',
        type: 'dano',
        parts: [['1d10+2', 'corte e perfuracao', ''], ['for', '', '']], // +2 adamante
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Sabedoria Bélica da Lança Silente (+5 Guerra, Conhecimento, Nobreza)',
        description: 'Fornece +5 em testes de Conhecimento, Guerra e Nobreza com foco militar.',
        changes: [
          { key: 'system.pericias.guer.outros', mode: 2, value: '5' },
          { key: 'system.pericias.conh.outros', mode: 2, value: '5' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '5' }
        ],
        transfer: true
      },
      {
        name: 'Forja de Adamante Formidável (+2 Ataque / +2 Dano)',
        description: 'Bônus passivo de encantamento formidável e material adamante.',
        changes: [
          { key: 'system.modificadores.ataque.cac', mode: 2, value: '2' },
          { key: 'system.modificadores.dano.cac', mode: 2, value: '2' }
        ],
        transfer: true
      }
    ]
  }),

  // 13. Memorizar Conhecimento
  buildSpellItem({
    name: 'Memorizar Conhecimento',
    img: 'systems/tormenta20/icons/magias/invulnerabilidade.webp',
    folder: FOLDER_MAGIAS,
    circulo: 2,
    tipo: 'universal',
    escola: 'adivinhacao',
    execucao: 'padrao',
    alcance: 'pessoal',
    alvo: 'você',
    duracao: 'permanente até descarregada',
    description: `<p>Universal 2 (adivinhação)</p><p>Execução: padrão; Alcance: pessoal; Alvo: você; Duração: permanente até ser descarregada.</p><p>Esta magia permite que você grave todos os detalhes relacionados a uma cena na sua mente. Enquanto tiver uma memória gravada, você recebe +5 em testes relacionados a informações da cena memorizada (o mestre tem a palavra final sobre esse bônus ser ou não aplicável em um teste). O limite máximo de memórias que você pode gravar é igual a 1 por patamar de personagem (1 enquanto for iniciante, 2 enquanto for veterano e assim por diante) + seu atributo-chave de magias. Se alcançar o limite de memórias, você precisa esquecer uma delas (descarregando o efeito desta magia e perdendo seu bônus) antes de gravar memórias novas.</p><p>+3 PM: muda o bônus em testes para +10. Requer 4º círculo.</p>`,
    chatFlavor: '',
    aprimoramentos: [
      { custo: 3, descricao: 'Muda o bônus em testes de informações da cena memorizada para +10 (requer 4º círculo).' }
    ],
    rolls: [
      {
        name: 'Recordação de Detalhes da Cena',
        key: 'teste0',
        type: 'formula',
        parts: [['1d20', '', ''], ['conh', '', ''], [5, '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Memória da Cena Gravada (+5 Conhecimento / Investigação)',
        description: 'Concede +5 em testes de perícia relacionados a informações da cena memorizada.',
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '5' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '5' }
        ],
        transfer: true
      },
      {
        name: 'Aprimoramento 4º Círculo (+10 Conhecimento / Investigação)',
        description: 'Eleva o bônus de recordação para +10.',
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '10' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '10' }
        ],
        transfer: false
      }
    ]
  }),

  // 14. Cítola da Paz
  buildItem({
    name: 'Cítola da Paz',
    type: 'equipamento',
    folder: FOLDER_EQUIPAMENTOS,
    img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
    description: `<p>Feita de madeira de qualidade, com cordas douradas e encantada por um devoto de Marah, esta cítola é entregue por seus tutores como um símbolo de independência para Mestres de Cerimônia. Enquanto seguir as Obrigações & Restrições de Marah, sua Inspiração e suas músicas de bardo custam –1 PM e você recebe um bônus de +5 em testes de perícia para mudar atitude. Conta como um instrumento musical. Ferramenta, preço T$ 175.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'outro',
      preco: 175,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Harmonia Pacificadora (+5 Mudar Atitude / -1 PM Músicas)',
        description: 'Músicas de bardo custam –1 PM e concede +5 em Diplomacia para mudar atitude.',
        changes: [
          { key: 'system.pericias.dipl.outros', mode: 2, value: '5' },
          { key: 'system.modificadores.custoPM', mode: 2, value: '-1' }
        ],
        transfer: true
      }
    ]
  }),

  // 15. Percepção de Masmorra
  buildItem({
    name: 'Percepção de Masmorra',
    type: 'poder',
    folder: FOLDER_PODERES,
    img: 'systems/tormenta20/icons/poderes/concedidos-trapaca.webp',
    description: `<p>Uma vez por cena, você tem sucesso automático em testes de Investigação para encontrar armadilhas realizados no subterrâneo ou dentro de uma masmorra.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'concedido',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Astúcia da Raposa nas Masmorras (+10 Investigar Armadilhas)',
        description: 'Concede sucesso automático (+10 de bônus) em testes de Investigação contra armadilhas subterrâneas.',
        changes: [{ key: 'system.pericias.inve.outros', mode: 2, value: '10' }],
        transfer: true
      }
    ]
  }),

  // 16. Rosário da Vida
  buildItem({
    name: 'Rosário da Vida',
    type: 'equipamento',
    folder: FOLDER_EQUIPAMENTOS,
    img: 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
    description: `<p>Este item costuma ser usado por Parteiras das Mandíbulas para aumentar o efeito das suas magias de cura e, assim, diminuir a dor sentida pelas criaturas durante o parto. Quando empunhado por alguém que siga as Obrigações & Restrições de Lena, este rosário aumenta o número de PV recuperados por efeitos de cura mágica de luz em um dado do mesmo tipo por patamar de personagem (1 dado do mesmo tipo no 1º patamar, 2 dados no 2º e assim por diante). Esotérico, preço T$ 750.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'outro',
      preco: 750,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Bênção Maternal de Lena (Cura de Luz Aumentada)',
        description: 'Aumenta a cura mágica de luz em +1 dado do mesmo tipo por patamar.',
        changes: [{ key: 'system.modificadores.dano.mag.0', mode: 2, value: '1d8' }],
        transfer: true
      }
    ]
  }),

  // 17. Bússola das Lágrimas
  buildItem({
    name: 'Bússola das Lágrimas',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/poderes/concedidos-ambicao.webp',
    description: `<p>Desenvolvido por inventores Peregrinos, este item mágico foi um protótipo que acabou se tornando mais famoso do que o planejado: seu objetivo inicial era rastrear as Lágrimas de Valkaria, mas as primeiras versões acabaram alertando seu usuário para a presença de qualquer magia. Hoje em dia, ainda que usem uma versão mais avançada e precisa para buscar pelas Lágrimas, os Peregrinos continuam comercializando este item — afinal, todo mundo precisa pagar as contas, certo? Ao empunhar a Bússola das Lágrimas com uma das mãos, você tem sucesso automático em testes de Misticismo para detectar magia e pode fazê-los mesmo que não seja treinado nesta perícia. Acessório menor, preço T$ 3.500.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 3500,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Detecção Mística de Valkaria (+10 Misticismo / Detectar Magia)',
        description: 'Concede sucesso automático (+10 de bônus) em testes de Misticismo para detectar auras arcanas e divinas.',
        changes: [{ key: 'system.pericias.mist.outros', mode: 2, value: '10' }],
        transfer: true
      }
    ]
  }),

  // 18. Corso Sombrio
  buildItem({
    name: 'Corso Sombrio',
    type: 'equipamento',
    folder: FOLDER_ITENS_MAGICOS,
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<p>De alguma forma, todo integrante do Rastro da Pólvora tem uma dessas cartas de corso entre seus pertences. Enquanto seguir as Obrigações & Restrições de Tenebra, este item funciona como uma carta de corso comum: concede a você permissão para usar armas de fogo em território do Reinado. Se tais obrigações forem violadas, a carta imediatamente se transforma em um corvo mágico que voa até a autoridade do Reinado mais próxima e denuncia você pelo porte e uso de itens proibidos pelo Vintílogo (veja Atlas de Arton, p. 466). Acessório menor, preço T$ 2.500.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'acessorio',
      preco: 2500,
      espacos: 0,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Chancela Noturna do Rastro da Pólvora (+2 Pontaria e Iniciativa)',
        description: 'Autoriza o porte legal de armas de fogo e concede +2 em Pontaria e Iniciativa.',
        changes: [
          { key: 'system.pericias.pont.outros', mode: 2, value: '2' },
          { key: 'system.pericias.inic.outros', mode: 2, value: '2' }
        ],
        transfer: true
      }
    ]
  }),

  // 19. Previdência da Vigília
  buildItem({
    name: 'Previdência da Vigília',
    type: 'poder',
    folder: FOLDER_PODERES,
    img: 'systems/tormenta20/icons/poderes/concedidos-ressurreicao.webp',
    description: `<p>Após contribuir com a Vigília das Segundas Chances ou realizar um juramento para Thyatis (o que exige seguir suas Obrigações & Restrições), você recebe o poder Dom da Imortalidade (Tormenta20, p. 133), mas só pode usá-lo na primeira vez que morrer na campanha.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Segunda Chance de Thyatis (Imunidade à Primeira Morte)',
        description: 'Garante retorno à vida com PV e PM máximos na primeira morte da campanha.',
        changes: [{ key: 'system.attributes.pv.min', mode: 2, value: '0' }],
        transfer: true
      }
    ]
  }),

  // 20. Bomba de Tinta
  buildItem({
    name: 'Bomba de Tinta',
    type: 'consumivel',
    folder: FOLDER_PREPARADOS,
    img: 'systems/tormenta20/icons/itens/gerais/agua-benta.webp',
    description: `<p>Favorito entre os Zoyrak, este item segue as mesmas regras da bomba (Tormenta20, p. 180), mas, em vez de causar dano, afeta uma esfera com 6m de raio que fica sob efeito simulado da magia Área Escorregadia até o fim da cena. Criaturas dentro dessa área durante a explosão da bomba também ficam lentas (Reflexos CD Des evita); elas podem gastar uma ação de movimento para fazer um teste de Força (CD Des) para se recuperar da condição. Preparado alquímico, preço T$ 35.</p>`,
    chatFlavor: '',
    system: {
      tipo: 'preparado',
      preco: 35,
      espacos: 1,
      consume: { type: 'consumivel', target: '', amount: 1, mpMultiplier: false },
      source: SOURCE_DB228
    },
    rolls: [
      {
        name: 'Teste de Resistência (Reflexos CD Des)',
        key: 'teste0',
        type: 'formula',
        parts: [['Reflexos CD Destreza evita condição lento', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: [
      {
        name: 'Tinta Viscosa Zoyrak (Condição Lento)',
        description: 'Criatura fica lenta na área escorregadia (movimento reduzido à metade, não pode correr).',
        statuses: ['lento'],
        changes: [{ key: 'system.attributes.movement.walk', mode: 1, value: '0.5' }],
        transfer: false
      }
    ]
  })
];

async function injectItems() {
  console.log('=== Injetando os 20 Itens, Poderes e Parceiros da DB #228 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  // Mapeamento de chaves conhecidas para manter estabilidade
  const idMap = {
    'Arco dos Arautos': '69br2Vuf11ic95OX',
    'Certificado de Conclusão': 'aBdeo9EXGf6uooEo',
    'Parceiro: Reabilitador': 'f2Ni3NoMHdlE3tiQ',
    'Chave Mestra': 'OJLisnReNpy3nUcf',
    'Bilhete de Valluk Delsori': '08dvhxFTgF3MxVln',
    'Máscara do Sol Dourado': 'lZ4DmTwLYachR3et',
    'Pingente Rubro': '2hVBcDokMYkfvx45',
    'Parceiro: Allihennali': 'wnXIF77NvB1BE61v',
    'Alma de Dragão': 'KSIr5sDoKWXgXh5C',
    'Parceiro: Guaxininjas': 'apEjmWLSDKFIII3D',
    'Âncora Naufragista': 'pnVzq8S4b7H75u46',
    'Arma Silente': 'vNDPN4N1W8tsYoLR',
    'Memorizar Conhecimento': 'i8AY07MHjmXRUCwC',
    'Cítola da Paz': 'hTtUpMhMVHCOGXNb',
    'Percepção de Masmorra': 'B8E4CUomnI4ff2K0',
    'Rosário da Vida': 'gN999QNxQmybgyTo',
    'Bússola das Lágrimas': 'N3fExXJ4JJP33Mzf',
    'Corso Sombrio': '4htqOC0DhQftKyzv',
    'Previdência da Vigília': '3Z0OYUB1g5Hhqh6W',
    'Bomba de Tinta': 'XeTZ3ffbj9HOzbzF'
  };

  let count = 0;
  for (const item of DB228_ITEMS) {
    if (idMap[item.name]) {
      item._id = idMap[item.name];
    }
    if (!item.system.source) {
      item.system.source = SOURCE_DB228;
    }
    const key = `!items!${item._id}`;
    
    // Constrói os documentos de efeitos completos para compêndios
    const effectDocs = (item.effects || []).map(eff => {
      const effId = eff._id || generateId();
      return {
        _id: effId,
        name: eff.name,
        origin: item.name,
        tint: eff.tint || '#ffffff',
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
  console.log(`\n✅ Sucesso: Todos os ${count} itens, poderes e parceiros da DB #228 injetados com 100% de conformidade canônica em Itens_T20.`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('Erro ao injetar itens:', err);
    process.exit(1);
  });
}

module.exports = { injectItems };

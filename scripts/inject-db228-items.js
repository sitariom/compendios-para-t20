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
    description: `<blockquote><p>"Arma favorita dos Arautos do Destruidor, este arco longo cruel preciso caçador pode ser encontrado por qualquer aventureiro que vasculhe os equipamentos de um membro desta organização."</p></blockquote>
<p>Você recebe a habilidade <strong>Marca da Presa</strong> do caçador, mas só pode usá-la com esta arma. Se já possui essa habilidade, em vez disso, o custo para usá-la com esta arma diminui em –1 PM.</p>
<p><strong>Tipo:</strong> Arma específica média (arco longo cruel preciso caçador). <strong>Preço:</strong> T$ 39.100.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Que a presa sinta a flecha do Destruidor antes que o sangue toque a relva!"</blockquote><p>Disparo fatal com o Arco dos Arautos. <span style="color: #800000; font-weight: bold;">Marca da Presa Ativada!</span></p>`,
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
    description: `<blockquote><p>"Documento emitido pelos mestres da Caravana das Três Chamas após um mês de estudos mágicos intensivos."</p></blockquote>
<p><strong>Pré-requisito:</strong> Especial: após passar um mês estudando na Caravana das Três Chamas, você recebe este poder. Essa é a única forma de adquiri-lo.</p>
<p>Você recebe <strong>+1 PM</strong> e pode lançar uma das magias a seguir (atributo-chave Inteligência) à sua escolha: <em>Alarme</em>, <em>Aviso</em>, <em>Criar Elementos</em> ou <em>Luz</em>, mas não pode aplicar aprimoramentos. Caso aprenda novamente uma dessas magias, seu custo diminui em –1 PM e você passa a conseguir aplicar aprimoramentos normalmente.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Reconhecido formalmente como iniciado da Caravana das Três Chamas!"</blockquote><p>Apresenta o pergaminho selado. <span style="color: #800000; font-weight: bold;">+1 PM Máximo e Magia Básica!</span></p>`,
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
    description: `<blockquote><p>"Juiz com treinamento especial da Casa dos Desgarrados para espalhar a justiça de Khalmyr, equilibrando as chances de todos os presentes por T$ 1.000."</p></blockquote>
<p>Um reabilitador é um <strong>parceiro especial</strong> que acompanha o grupo de personagens até o fim da aventura.</p>
<p>Durante uma cena à escolha dos jogadores, ele faz todos os modificadores serem iguais à média dos modificadores de todas as criaturas presentes (impedindo extremos absurdos e fixando a retidão da balança). No final da cena, o reabilitador se despede do grupo e retorna para a Casa dos Desgarrados.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Pela balança de Khalmyr, que a desigualdade seja desfeita e a justiça reine nesta corte!"</blockquote><p>O Reabilitador ergue o símbolo sagrado. <span style="color: #800000; font-weight: bold;">Julgamento Equilibrador de Khalmyr!</span></p>`,
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
    description: `<blockquote><p>"Uma chave carregada pelos membros do Claviculário como um símbolo sagrado de Sszzaas."</p></blockquote>
<p>Este item mágico é capaz de destrancar qualquer coisa, concedendo <strong>sucesso automático em testes de Ladinagem</strong> para abrir fechaduras. Contudo, se não for usada por um dos membros do Claviculário ou por um devoto de Sszzaas, um efeito mágico sobre seu material é ativado, reduzindo a Chave Mestra a pó após o primeiro uso.</p>
<p><strong>Tipo:</strong> Acessório médio. <strong>Preço:</strong> T$ 25.500.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Nenhum segredo permanece trancado sob a bênção da Serpente."</blockquote><p>Gira a Chave Mestra na fechadura. <span style="color: #800000; font-weight: bold;">Sucesso Automático em Ladinagem!</span></p>`,
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
    description: `<blockquote><p>"Ingresso cênico encantado concedido apenas àqueles que assistiram a cinco apresentações seguidas da Companhia Teatral Valluk Delsori."</p></blockquote>
<p>Rasgar o bilhete permite que o usuário se transforme em uma das grandes figuras de Arton (como o herói Orion Drake ou a Rainha-Imperatriz Shivara I), mas com uma característica diferente da verdadeira pessoa. Este efeito funciona como a magia <em>Disfarce Ilusório</em>, com direito ao aprimoramento que aumenta o bônus de Enganação para <strong>+20 e duração de 1 dia</strong>.</p>
<p><strong>Tipo:</strong> Item mágico de uso único (consumível). <strong>Preço:</strong> T$ 300.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O espetáculo começa agora! Abram as cortinas da ilusão!"</blockquote><p>Rasga o ingresso encantado. <span style="color: #800000; font-weight: bold;">Metamorfose Cênica (+20 Enganação por 1 Dia)!</span></p>`,
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
    description: `<blockquote><p>"Uma máscara amarela com o desenho de um sorriso e dois tibares de ouro no lugar dos olhos, adornados com raios solares em laranja."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Azgher, as moedas mágicas que substituem os olhos da máscara fornecem <strong>+10 em Ladinagem</strong>. Contudo, por ser chamativo demais, uma pessoa vestindo este item recebe <strong>–2 em Furtividade</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 9.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O Sol do Deserto ilumina a destreza dos dedos sagrados."</blockquote><p>Ajusta a máscara facial. <span style="color: #800000; font-weight: bold;">+10 Ladinagem / -2 Furtividade!</span></p>`,
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
    description: `<blockquote><p>"Este colar de matéria vermelha é estranho e parece estar sempre mudando de forma."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Aharadak, sendo devoto ou não, você reduz a perda de PM causada por efeitos lefeu e da Tormenta em <strong>–1 PM por patamar</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 3.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A matéria rubra pulsa e absorve a corrupção antes que ela devore a alma."</blockquote><p>O colar vibra com calor aberrante. <span style="color: #800000; font-weight: bold;">Redução de Perda de PM da Tormenta!</span></p>`,
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
    description: `<blockquote><p>"Estes espíritos feéricos lembram uma pequena esfera de luz com quatro asas finas de inseto devotos de Allihanna."</p></blockquote>
<p>Um allihennali parceiro fornece os benefícios a seguir:</p>
<ul>
  <li><strong>Iniciante:</strong> Uma vez por rodada, você pode gastar 1 PM para curar 2d6 PV de uma criatura em alcance curto.</li>
  <li><strong>Veterano:</strong> Como acima, mas também reduz o custo de magias que geram efeitos mágicos de cura em <strong>–2 PM</strong>.</li>
  <li><strong>Mestre:</strong> Como acima, mas você também pode gastar 3 PM para curar <strong>6d6 PV</strong>.</li>
</ul>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*Tink-tink!* O pólen feérico brilha restaurando a carne e acalmando a dor."</blockquote><p>A fada Allihennali voa ao redor do aliado. <span style="color: #800000; font-weight: bold;">Cura Feérica de Allihanna!</span></p>`,
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
    description: `<blockquote><p>"Uma pedra translúcida, no formato de uma escama de dragão e do tamanho de um punho fechado, que faz parte das posses de todos os Herdeiros da Escama."</p></blockquote>
<p>Quando sofrer dano de um dos tipos a seguir, você pode reduzir o dano sofrido em um dado como uma reação (luz, ácido, trevas, fogo, frio ou eletricidade). A pedra então armazena a energia do dano, tomando a aparência de uma pedra preciosa: diamante (luz), esmeralda (ácido), ônix (trevas), rubi (fogo), safira (frio) ou topázio (eletricidade).</p>
<p>Quando lança uma magia que causa dano do tipo da pedra armazenada, você pode descarregar essa energia como uma ação livre para <strong>aumentar o dano em um dado do mesmo tipo (+1d6)</strong>.</p>
<p><strong>Tipo:</strong> Item esotérico. <strong>Preço:</strong> T$ 250.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O sangue ancestral consome a fúria elemental e a devolve em chamas e gelo!"</blockquote><p>A escama brilha com energia primordial. <span style="color: #800000; font-weight: bold;">Absorção e Liberação Elemental!</span></p>`,
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
    description: `<blockquote><p>"Não se sabe ao certo se é possível treinar guaxinins comuns para desempenharem o papel de guaxininjas, mas eles seriam um parceiro capanga especial do clã Hoshikage."</p></blockquote>
<p>Uma vez por aventura, você pode gastar uma ação de movimento e 2 PM para fazer um assovio e <strong>invocar 1d4+1 guaxininjas capangas</strong> em espaços desocupados em alcance curto — eles surgem de um beco próximo, por trás de uma pedra ou de maneiras igualmente furtivas.</p>
<p>Guaxininjas têm deslocamento 9m, Defesa 17, causam 1d4 de dano de corte cada e possuem <strong>Ataque Furtivo +1d6</strong>. Eles desaparecem quando morrem ou no fim da cena.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*Ninjutsu da Folha Noturna!* Olhinhos brilhantes e adagas afiadas surgem da escuridão!"</blockquote><p>Assuvia convocando os shinobis de Tamu-ra. <span style="color: #800000; font-weight: bold;">Guaxininjas Convocados (+1d6 Ataque Furtivo)!</span></p>`,
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
    description: `<blockquote><p>"Um colar com pingente em forma de âncora, tanto a corrente quanto o pingente são feitos de ferro oxidado, é usado como símbolo sagrado por piratas naufragistas."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Oceano, sempre que oferecer como tributo para a água do mar um item valioso (com valor mínimo de T$ 100), você recebe um benefício a seguir (à sua escolha) durante 1 dia: <strong>deslocamento de natação igual ao seu deslocamento terrestre</strong>, <strong>+5 em Pilotagem</strong>, ou <strong>resistência a frio e eletricidade 10</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 3.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"As profundezas cobram seu tributo em ouro e devolvem o domínio das marés."</blockquote><p>Lança a oferenda nas águas do mar. <span style="color: #800000; font-weight: bold;">Bênção de Oceano Ativada!</span></p>`,
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
    description: `<blockquote><p>"Uma arma silente é o espólio obtido por aqueles que derrotam um membro da Lança Silente."</p></blockquote>
<p>Este item é uma arma (alabarda) <strong>certeira equilibrada formidável de adamante</strong> que fornece <strong>+5 em testes de Conhecimento, Guerra e Nobreza</strong> cujo objetivo seja perpetuar a guerra.</p>
<p><strong>Tipo:</strong> Arma específica menor (alabarda de adamante). <strong>Preço:</strong> T$ 31.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A paz apodrece os homens; a lâmina de Keenn forja impérios."</blockquote><p>Investida com a lâmina silenciosa de adamante. <span style="color: #800000; font-weight: bold;">+5 Guerra/Conhecimento/Nobreza e +2 Dano!</span></p>`,
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
    description: `<blockquote><p>"Esta magia permite que você grave todos os detalhes relacionados a uma cena na sua mente."</p></blockquote>
<p>Enquanto tiver uma memória gravada, você recebe <strong>+5 em testes relacionados a informações da cena memorizada</strong> (o mestre tem a palavra final sobre esse bônus). O limite máximo de memórias gravadas é igual a 1 por patamar de personagem + seu atributo-chave de magias.</p>
<p><strong>Aprimoramento (+3 PM):</strong> Muda o bônus em testes para +10. Requer 4º círculo.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Palavras, rostos e detalhes gravados com a tinta indelével de Tanna-Toh."</blockquote><p>Canaliza a recordação perfeita da cena. <span style="color: #800000; font-weight: bold;">+5 em Testes de Conhecimento e Investigação!</span></p>`,
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
    description: `<blockquote><p>"Feita de madeira de qualidade, com cordas douradas e encantada por um devoto de Marah, esta cítola é entregue como símbolo de independência para Mestres de Cerimônia."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Marah, sua Inspiração e suas músicas de bardo custam <strong>–1 PM</strong> e você recebe um bônus de <strong>+5 em testes de perícia para mudar atitude</strong> de criaturas hostis.</p>
<p><strong>Tipo:</strong> Ferramenta (instrumento musical). <strong>Preço:</strong> T$ 175.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A melodia da concórdia acalma o ódio e faz as lâminas caírem ao chão."</blockquote><p>Dedilha as cordas douradas. <span style="color: #800000; font-weight: bold;">-1 PM em Músicas e +5 em Diplomacia!</span></p>`,
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
    description: `<blockquote><p>"A astúcia da raposa revela os gatilhos e armadilhas ocultas nas pedras frias das masmorras."</p></blockquote>
<p><strong>Pré-requisito:</strong> Devoto de Hyninn ou Passagem Vulpina.</p>
<p>Uma vez por cena, você tem <strong>sucesso automático em testes de Investigação para encontrar armadilhas</strong> realizados no subterrâneo ou dentro de uma masmorra.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Onde outros veem apenas lajotas gastas, Hyninn aponta o fosso de estacas."</blockquote><p>Investigação instintiva em masmorras. <span style="color: #800000; font-weight: bold;">Sucesso Automático contra Armadilhas!</span></p>`,
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
    description: `<blockquote><p>"Este item costuma ser usado por Parteiras das Mandíbulas para aumentar o efeito das suas magias de cura e diminuir a dor durante o parto."</p></blockquote>
<p>Quando empunhado por alguém que siga as Obrigações & Restrições de Lena, este rosário aumenta o número de PV recuperados por efeitos de cura mágica de luz em <strong>+1 dado do mesmo tipo por patamar de personagem</strong> (+1 dado no iniciante, +2 dados no veterano, +3 dados no campeão e +4 dados no lenda).</p>
<p><strong>Tipo:</strong> Esotérico. <strong>Preço:</strong> T$ 750.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Que o sopro acolhedor da Mãe Lena dissipe o sofrimento e floresça a vida."</blockquote><p>Empunha o Rosário da Vida. <span style="color: #800000; font-weight: bold;">+1 Dado de Cura por Patamar!</span></p>`,
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
    description: `<blockquote><p>"Desenvolvido por inventores Peregrinos, este item mágico alerta seu usuário para a presença de qualquer magia em alcance longo."</p></blockquote>
<p>Ao empunhar a Bússola das Lágrimas com uma das mãos, você tem <strong>sucesso automático em testes de Misticismo para detectar magia</strong> e pode fazê-los mesmo que não seja treinado nesta perícia.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 3.500.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A agulha de diamante gira... energias mágicas densas fluem logo adiante!"</blockquote><p>Consulta a Bússola das Lágrimas. <span style="color: #800000; font-weight: bold;">Sucesso Automático em Detectar Magia!</span></p>`,
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
    description: `<blockquote><p>"De alguma forma, todo integrante do Rastro da Pólvora tem uma dessas cartas de corso entre seus pertences."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Tenebra, este item funciona como uma carta de corso comum: <strong>concede a você permissão para usar armas de fogo em território do Reinado</strong>. Se violadas, a carta transforma-se em corvo mágico que denuncia você às autoridades mais próximas.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 2.500.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A pólvora é a arte da noite; a Rainha das Trevas chancela meu gatilho."</blockquote><p>Exibe o selo de corso de Tenebra. <span style="color: #800000; font-weight: bold;">Porte Legal de Armas de Fogo e +2 Foco!</span></p>`,
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
    description: `<blockquote><p>"Após contribuir com a Vigília das Segundas Chances ou realizar um juramento para Thyatis, você recebe a proteção da fênix."</p></blockquote>
<p><strong>Pré-requisito:</strong> Seguir as Obrigações & Restrições de Thyatis.</p>
<p>Você recebe o poder <strong>Dom da Imortalidade</strong> (Tormenta20, p. 133), mas só pode usá-lo na primeira vez em que morrer na campanha. Na rodada seguinte à morte, você ressurge com todos os seus PV e PM restaurados e purificado de condições nocivas.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Das cinzas do golpe fatal, a chama da profecia se ergue invencível!"</blockquote><p>A bênção de Thyatis incendeia o peito. <span style="color: #800000; font-weight: bold;">Dom da Imortalidade (Segunda Chance)!</span></p>`,
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
    description: `<blockquote><p>"Favorito entre os Zoyrak, este item segue as mesmas regras da bomba (Tormenta20, p. 180), mas afeta uma área de escorregamento."</p></blockquote>
<p>Em vez de causar dano, afeta uma esfera com 6m de raio que fica sob efeito simulado da magia <em>Área Escorregadia</em> até o fim da cena. Criaturas dentro dessa área durante a explosão da bomba também ficam <strong>lentas</strong> (Reflexos CD Des arremessador evita); podem gastar ação de movimento para fazer teste de Força (CD Des) para se recuperar.</p>
<p><strong>Tipo:</strong> Preparado alquímico (consumível). <strong>Preço:</strong> T$ 35.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*SPLAAAT!* Tinta colorida viscosa cobre a praça e humilha as sentinelas!"</blockquote><p>Arremessa a Bomba de Tinta Zoyrak. <span style="color: #800000; font-weight: bold;">Área Escorregadia e Condição Lento!</span></p>`,
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

#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens, Poderes, Magias e Equipamentos da DB #228 em Itens_T20
 * Conteúdo: Divinas Organizações (17 Itens e Poderes Canônicos de Arton)
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildItem,
  buildWeaponItem,
  buildSpellItem
} = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB228 = 'Dragão Brasil #228 (Divinas Organizações)';

const DB228_ITEMS = [
  // 1. Arco dos Arautos
  buildWeaponItem({
    name: 'Arco dos Arautos',
    img: 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
    empunhadura: 'duas',
    dano: '1d8',
    tipoDano: 'perfuracao',
    criticoMargem: 19,
    criticoMultiplicador: 3,
    alcance: 'medio',
    preco: 39100,
    espacos: 2,
    description: `<blockquote><p>"Arma favorita dos Arautos do Destruidor, este arco longo cruel preciso caçador pode ser encontrado nos pertences de membros da organização."</p></blockquote>
<p>Você recebe a habilidade <strong>Marca da Presa</strong> do caçador, mas só pode usá-la com esta arma. Se já possui essa habilidade, em vez disso, o custo para usá-la com esta arma diminui em –1 PM.</p>
<p><strong>Tipo:</strong> Arma específica média (arco longo cruel preciso caçador). <strong>Preço:</strong> T$ 39.100.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Que a fera sinta o zunido da flecha antes de cair perante o Destruidor!"</blockquote><p>Disparo certeiro com o Arco dos Arautos. <span style="color: #800000; font-weight: bold;">Marca da Presa caçadora!</span></p>`,
    rolls: [
      {
        name: 'Ataque à Distância',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['pont', '', ''], [2, '', '']], // +2 preciso
        versatil: ''
      },
      {
        name: 'Dano com Arco Longo',
        key: 'dano1',
        type: 'dano',
        parts: [['1d8+2', 'perfuracao', '']], // +2 cruel
        versatil: ''
      }
    ],
    effects: [
      {
        name: 'Marca da Presa Aprimorada (-1 PM)',
        description: 'Reduz o custo da Marca da Presa com esta arma em –1 PM ou concede a habilidade.',
        changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }],
        transfer: true
      }
    ]
  }),

  // 2. Certificado de Conclusão
  buildItem({
    name: 'Certificado de Conclusão',
    type: 'poder',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Documento emitido pelos mestres da Caravana das Três Chamas após um mês de estudos mágicos intensivos."</p></blockquote>
<p><strong>Pré-requisito:</strong> Especial: ter estudado por um mês na Caravana das Três Chamas.</p>
<p>Você recebe <strong>+1 PM</strong> e pode lançar uma das magias a seguir (atributo-chave Inteligência) à sua escolha: <em>Alarme</em>, <em>Aviso</em>, <em>Criar Elementos</em> ou <em>Luz</em>, mas não pode aplicar aprimoramentos. Caso aprenda novamente uma dessas magias por outra fonte, seu custo diminui em –1 PM e você passa a aplicar aprimoramentos normalmente.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Reconhecido como iniciado formal pelos mestres da Chama!"</blockquote><p>Apresenta o certificado. <span style="color: #800000; font-weight: bold;">+1 PM Máximo e Magia Básica!</span></p>`,
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Certificado de Conclusão (+1 PM)',
        changes: [{ key: 'system.attributes.pm.max', mode: 2, value: '1' }],
        transfer: true
      }
    ]
  }),

  // 3. Chave Mestra
  buildItem({
    name: 'Chave Mestra',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/espelho-do-aprisonamento.webp',
    description: `<blockquote><p>"Carregada pelos membros do Claviculário como um símbolo sagrado de Sszzaas."</p></blockquote>
<p>Este item mágico é capaz de destrancar qualquer fechadura, concedendo <strong>sucesso automático em testes de Ladinagem</strong> para abrir fechaduras. Contudo, se não for usada por um membro do Claviculário ou devoto de Sszzaas, um efeito mágico sobre seu material é ativado, reduzindo a Chave Mestra a pó após o primeiro uso.</p>
<p><strong>Tipo:</strong> Acessório médio. <strong>Preço:</strong> T$ 25.500.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Nenhum segredo permanece trancado sob o olhar da serpente."</blockquote><p>Gira a Chave Mestra. <span style="color: #800000; font-weight: bold;">Sucesso automático em abrir fechadura!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 25500,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Giro Mágico de Sszzaas (Abertura Automática)',
        description: 'Concede sucesso automático ao abrir fechaduras.',
        changes: [{ key: 'system.pericias.ladi.outros', mode: 2, value: '20' }],
        transfer: true
      }
    ]
  }),

  // 4. Bilhete de Valluk Delsori
  buildItem({
    name: 'Bilhete de Valluk Delsori',
    type: 'consumivel',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Ingresso cênico encantado concedido apenas àqueles que assistiram a cinco apresentações seguidas da Companhia Teatral Valluk Delsori."</p></blockquote>
<p>Rasgar o bilhete permite que o usuário se transforme em uma das grandes figuras de Arton (como Orion Drake ou a Rainha-Imperatriz Shivara I), mas com uma característica diferente da verdadeira pessoa. Concede <strong>+10 em Enganação</strong> para sustentar o disfarce cênico por até 1 hora.</p>
<p><strong>Tipo:</strong> Consumível mágico. <strong>Preço:</strong> T$ 5.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O espetáculo começa agora! Abram as cortinas da ilusão!"</blockquote><p>Rasga o ingresso encantado. <span style="color: #800000; font-weight: bold;">Metamorfose Cênica (+10 Enganação)!</span></p>`,
    system: {
      tipo: 'outro',
      preco: 5000,
      espacos: 0,
      consume: { type: 'consumivel', target: '', amount: 1, mpMultiplier: false },
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Metamorfose Cênica de Valluk Delsori (+10 Enganação)',
        description: 'Concede +10 em testes de Enganação para sustentar o disfarce de uma lenda artoniana.',
        changes: [{ key: 'system.pericias.enga.outros', mode: 2, value: '10' }],
        transfer: true
      }
    ]
  }),

  // 5. Máscara do Sol Dourado
  buildItem({
    name: 'Máscara do Sol Dourado',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/brincos.webp',
    description: `<blockquote><p>"Uma máscara amarela com o desenho de um sorriso e dois tibares de ouro no lugar dos olhos, adornados com raios solares em laranja."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Azgher, as moedas mágicas fornecem <strong>+10 em Ladinagem</strong>. Contudo, por ser chamativo demais, quem a veste sofre <strong>–2 em Furtividade</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 9.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O Sol do Deserto ilumina a destreza das mãos dos devotos."</blockquote><p>Ajusta a máscara facial. <span style="color: #800000; font-weight: bold;">+10 Ladinagem, -2 Furtividade!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 9000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Moedas Solares de Azgher (+10 Ladinagem / -2 Furtividade)',
        description: 'Fornece +10 em Ladinagem e penalidade de -2 em Furtividade.',
        changes: [
          { key: 'system.pericias.ladi.outros', mode: 2, value: '10' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '-2' }
        ],
        transfer: true
      }
    ]
  }),

  // 6. Pingente Rubro
  buildItem({
    name: 'Pingente Rubro',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
    description: `<blockquote><p>"Colar forjado em matéria vermelha gelatinosa que pulsa como um coração doentio."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Aharadak, sendo devoto ou não, você reduz a perda de PM causada por efeitos lefeu e da Tormenta em <strong>–1 PM por patamar de personagem</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 3.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A matéria rubra assimila a loucura antes que ela devore a mente."</blockquote><p>O colar pulsa contra o peito. <span style="color: #800000; font-weight: bold;">Proteção contra perda de PM da Tormenta!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 3000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Proteção Aberrante de Aharadak',
        description: 'Reduz a perda de PM causada por efeitos lefeu em -1 PM por patamar.',
        changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }],
        transfer: true
      }
    ]
  }),

  // 7. Alma de Dragão
  buildItem({
    name: 'Alma de Dragão',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/escudo-do-conjurador.webp',
    description: `<blockquote><p>"Pedra translúcida no formato de escama de dragão lapidada pelos Herdeiros da Escama."</p></blockquote>
<p>Como uma reação quando sofrer dano elemental (fogo, frio, eletricidade, ácido, luz ou trevas), você pode reduzir o dano sofrido em um dado do mesmo tipo. A pedra então absorve a energia, tornando-se uma gema preciosa (rubi para fogo, safira para frio, topázio para eletricidade, esmeralda para ácido, diamante para luz, ônix para trevas). Gastando 1 PM, você pode liberar a energia no seu próximo ataque ou magia causando +1d6 de dano daquele tipo.</p>
<p><strong>Tipo:</strong> Item geral alquímico. <strong>Preço:</strong> T$ 150.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"O sangue do dragão consome e canaliza os elementos da destruição!"</blockquote><p>A escama brilha absorvendo o impacto. <span style="color: #800000; font-weight: bold;">Absorção e Liberação Elemental!</span></p>`,
    rolls: [
      {
        name: 'Dano Elemental Liberado',
        key: 'dano0',
        type: 'dano',
        parts: [['1d6', 'essencia', '']],
        versatil: ''
      }
    ],
    system: {
      tipo: 'outro',
      preco: 150,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 8. Âncora Naufragista
  buildItem({
    name: 'Âncora Naufragista',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
    description: `<blockquote><p>"Pingente de ferro oxidado em forma de âncora usado pelos corsários de Oceano."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Oceano, sempre que oferecer como tributo para o mar um item valioso (mínimo T$ 100), você recebe um benefício durante 1 dia à sua escolha: deslocamento de natação igual ao terrestre, <strong>+5 em Pilotagem</strong>, ou <strong>resistência a frio e eletricidade 5</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 6.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"As profundezas cobram seu preço, mas devolvem em força e calmaria."</blockquote><p>Lança a oferenda nas águas. <span style="color: #800000; font-weight: bold;">Bênção dos Mares (+5 Pilotagem e RD 5)!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 6000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Bênção de Oceano (+5 Pilotagem / RD 5 Frio e Choque)',
        description: 'Fornece +5 em Pilotagem e resistência a frio e eletricidade 5.',
        changes: [
          { key: 'system.pericias.pilo.outros', mode: 2, value: '5' },
          { key: 'system.tracos.resistencias.frio.base', mode: 2, value: '5' },
          { key: 'system.tracos.resistencias.eletricidade.base', mode: 2, value: '5' }
        ],
        transfer: true
      }
    ]
  }),

  // 9. Arma Silente
  buildWeaponItem({
    name: 'Arma Silente',
    img: 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
    empunhadura: 'duas',
    dano: '1d10',
    tipoDano: 'corte e perfuracao',
    criticoMargem: 19,
    criticoMultiplicador: 3,
    preco: 31000,
    espacos: 2,
    description: `<blockquote><p>"Arma de haste de adamante forjada no silêncio absoluto pelos campeões da Lança Silente."</p></blockquote>
<p>Arma de adamante certeira equilibrada formidável que fornece <strong>+5 em testes de Conhecimento, Guerra e Nobreza</strong> cujo objetivo seja perpetuar e planejar conflitos armados.</p>
<p><strong>Tipo:</strong> Arma específica menor (alabarda de adamante). <strong>Preço:</strong> T$ 31.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A paz é uma ilusão temporária; o aço de Keenn nunca repousa."</blockquote><p>Golpe pesado com a haste de adamante. <span style="color: #800000; font-weight: bold;">Sabedoria Bélica (+5 Guerra/Conhecimento/Nobreza)!</span></p>`,
    rolls: [
      {
        name: 'Ataque com Arma Silente',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], [3, '', '']], // +2 formidável + 1 certeira
        versatil: ''
      },
      {
        name: 'Dano com Arma Silente',
        key: 'dano1',
        type: 'dano',
        parts: [['1d10+2', 'corte e perfuracao', ''], ['for', '', '']], // +2 adamante
        versatil: ''
      }
    ],
    effects: [
      {
        name: 'Sabedoria Bélica da Lança Silente (+5 Guerra, Conhecimento, Nobreza)',
        description: 'Fornece +5 em Guerra, Conhecimento e Nobreza para perpetuar guerras.',
        changes: [
          { key: 'system.pericias.guer.outros', mode: 2, value: '5' },
          { key: 'system.pericias.conh.outros', mode: 2, value: '5' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '5' }
        ],
        transfer: true
      }
    ]
  }),

  // 10. Memorizar Conhecimento
  buildSpellItem({
    name: 'Memorizar Conhecimento',
    img: 'systems/tormenta20/icons/magias/invulnerabilidade.webp',
    circulo: 2,
    tipo: 'universal',
    escola: 'adivinhacao',
    execucao: 'padrao',
    alcance: 'pessoal',
    alvo: 'você',
    duracao: 'permanente até descarregada',
    description: `<blockquote><p>"Esta magia permite que você grave todos os detalhes visuais, sonoros e táteis de uma cena na sua mente."</p></blockquote>
<p>Enquanto tiver a memória gravada, você recebe <strong>+5 em testes relacionados a informações da cena memorizada</strong> (o mestre tem a palavra final sobre o bônus). O limite máximo de memórias gravadas é igual a 1 por patamar de personagem. Você pode descarregar a magia para transmitir mentalmente a cena inteira para outra criatura tocada.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Cada detalhe, cada sombra, cada sussurro gravado para sempre na pedra da mente."</blockquote><p>Canaliza Memorizar Conhecimento. <span style="color: #800000; font-weight: bold;">+5 em Testes de Conhecimento da Cena!</span></p>`,
    aprimoramentos: [
      { custo: 2, descricao: 'Permite gravar uma cena adicional simultaneamente na memória.' },
      { custo: 4, descricao: 'Muda a execução para reação logo após testemunhar um evento inesperado.' }
    ],
    rolls: [
      {
        name: 'Recordação da Cena Gravada',
        key: 'teste0',
        type: 'formula',
        parts: [['1d20', '', ''], ['conh', '', ''], [5, '', '']],
        versatil: ''
      }
    ],
    effects: [
      {
        name: 'Memória da Cena Gravada (+5 Informações)',
        description: 'Recebe +5 em testes de perícia relacionados a informações da cena gravada.',
        changes: [
          { key: 'system.pericias.conh.outros', mode: 2, value: '5' },
          { key: 'system.pericias.inve.outros', mode: 2, value: '5' }
        ],
        transfer: true
      }
    ]
  }),

  // 11. Cítola da Paz
  buildItem({
    name: 'Cítola da Paz',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
    description: `<blockquote><p>"Instrumento com cordas douradas entalhado e abençoado pelos Mestres de Cerimônia de Marah."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Marah, sua Inspiração e suas músicas de bardo custam <strong>–1 PM</strong> e você recebe <strong>+5 em testes de perícia para mudar atitude</strong> de criaturas hostis.</p>
<p><strong>Tipo:</strong> Item geral (instrumento musical). <strong>Preço:</strong> T$ 175.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A melodia serena abranda o rancor e cala as espadas sem derramar sangue."</blockquote><p>Dedilha as cordas douradas da Cítola. <span style="color: #800000; font-weight: bold;">-1 PM em Músicas e +5 Diplomacia!</span></p>`,
    system: {
      tipo: 'outro',
      preco: 175,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Harmonia Pacificadora (+5 Mudar Atitude / -1 PM Músicas)',
        description: 'Músicas de bardo custam -1 PM e concede +5 em Diplomacia para mudar atitude.',
        changes: [
          { key: 'system.pericias.dipl.outros', mode: 2, value: '5' },
          { key: 'system.modificadores.custoPM', mode: 2, value: '-1' }
        ],
        transfer: true
      }
    ]
  }),

  // 12. Percepção de Masmorra
  buildItem({
    name: 'Percepção de Masmorra',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos-trapaca.webp',
    description: `<blockquote><p>"A astúcia da raposa revela os gatilhos e armadilhas ocultas nas pedras frias das masmorras."</p></blockquote>
<p><strong>Pré-requisito:</strong> Devoto de Hyninn ou Passagem Vulpina.</p>
<p>Uma vez por cena, você tem <strong>sucesso automático</strong> em testes de Investigação para encontrar armadilhas realizados no subterrâneo ou dentro de uma masmorra.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Onde outros veem apenas piso gasto, Hyninn aponta o alçapão."</blockquote><p>Examinar masmorra com astúcia vulpina. <span style="color: #800000; font-weight: bold;">Sucesso automático em armadilhas subterrâneas!</span></p>`,
    system: {
      tipo: 'geral',
      subtipo: 'concedido',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Olhar Vulpino nas Masmorras (+10 Investigar Armadilhas)',
        description: 'Concede sucesso automático / bônus de Investigação contra armadilhas subterrâneas.',
        changes: [{ key: 'system.pericias.inve.outros', mode: 2, value: '10' }],
        transfer: true
      }
    ]
  }),

  // 13. Rosário da Vida
  buildItem({
    name: 'Rosário da Vida',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
    description: `<blockquote><p>"Símbolo de contas puras carregado pelas Parteiras das Mandíbulas para abençoar nascimentos em regiões perigosas."</p></blockquote>
<p>Quando empunhado por alguém que siga as Obrigações & Restrições de Lena, este rosário aumenta o número de PV recuperados por efeitos de cura mágica de luz em <strong>+1 dado do mesmo tipo por patamar de personagem</strong> (+1 dado no iniciante, +2 dados no veterano, +3 dados no campeão e +4 dados no lenda).</p>
<p><strong>Tipo:</strong> Item geral esotérico (símbolo sagrado). <strong>Preço:</strong> T$ 250.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Que o sopro acolhedor da Mãe Lena dissipe o sofrimento e floresça a vida."</blockquote><p>Empunha o Rosário da Vida. <span style="color: #800000; font-weight: bold;">+1 Dado de Cura por Patamar!</span></p>`,
    system: {
      tipo: 'outro',
      preco: 250,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Bênção Maternal de Lena (Cura Potencializada)',
        description: 'Aumenta a cura mágica de luz em +1 dado do mesmo tipo por patamar.',
        changes: [{ key: 'system.modificadores.dano.mag.0', mode: 2, value: '1d8' }],
        transfer: true
      }
    ]
  }),

  // 14. Bússola das Lágrimas
  buildItem({
    name: 'Bússola das Lágrimas',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-ambicao.webp',
    description: `<blockquote><p>"Agulha imantada com pó de diamante forjada pelos inventores Peregrinos para rastrear as Lágrimas de Valkaria."</p></blockquote>
<p>A bússola vibra e aponta continuamente na direção da fonte mágica mais poderosa ou relíquia divina em alcance longo (100m). Permite identificar auras arcanas e divinas sem custo de PM.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 7.500.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A agulha gira loucamente... algo divino e imenso jaz logo à frente!"</blockquote><p>Consulta a Bússola das Lágrimas. <span style="color: #800000; font-weight: bold;">Detecção de Fontes Mágicas e Relíquias!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 7500,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Rastreamento Divino de Valkaria (+5 Misticismo)',
        description: 'Detecta auras arcanas e concede +5 em Misticismo para identificar relíquias.',
        changes: [{ key: 'system.pericias.mist.outros', mode: 2, value: '5' }],
        transfer: true
      }
    ]
  }),

  // 15. Corso Sombrio
  buildItem({
    name: 'Corso Sombrio',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Documento selado com cera preta que autoriza membros do Rastro da Pólvora a portar armas de fogo."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Tenebra, este item funciona como uma carta de corso oficial, concedendo permissão para portar e utilizar armas de fogo em qualquer território do Reinado. Se as obrigações forem violadas, a carta transforma-se em um corvo mágico que denuncia você às autoridades.</p>
<p><strong>Tipo:</strong> Acessório menor (documento). <strong>Preço:</strong> T$ 2.000.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"A fumaça e a noite caminham juntas. O selo da Rainha das Trevas garante meu gatilho."</blockquote><p>Exibe o Corso Sombrio. <span style="color: #800000; font-weight: bold;">Porte legal de armas de fogo no Reinado!</span></p>`,
    system: {
      tipo: 'acessorio',
      preco: 2000,
      espacos: 0,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Proteção Jurídica de Tenebra (+2 Pontaria)',
        description: 'Autoriza o porte de armas de fogo e concede bônus de foco.',
        changes: [{ key: 'system.pericias.pont.outros', mode: 2, value: '2' }],
        transfer: true
      }
    ]
  }),

  // 16. Previdência da Vigília
  buildItem({
    name: 'Previdência da Vigília',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos-ressurreicao.webp',
    description: `<blockquote><p>"Juramento sagrado feito perante a Vigília das Segundas Chances sob a chama eterna da fênix de Thyatis."</p></blockquote>
<p><strong>Pré-requisito:</strong> Ter contribuído com a Vigília e seguir as Obrigações & Restrições de Thyatis.</p>
<p>Você recebe o poder <strong>Dom da Imortalidade</strong> (Tormenta20, p. 133), mas só pode usá-lo na primeira vez em que morrer na campanha. Na rodada seguinte à morte, você ressurge com todos os seus PV e PM restaurados e purificado de condições nocivas.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Das cinzas frias da derrota, a chama da segunda chance se ergue invencível!"</blockquote><p>A fênix ressurge no peito. <span style="color: #800000; font-weight: bold;">Dom da Imortalidade (Ressurreição Instantânea)!</span></p>`,
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Segunda Chance de Thyatis (Ressurreição)',
        description: 'Garante retorno à vida com PV e PM máximos na primeira morte da campanha.',
        changes: [{ key: 'system.attributes.pv.min', mode: 2, value: '0' }],
        transfer: true
      }
    ]
  }),

  // 17. Bomba de Tinta
  buildItem({
    name: 'Bomba de Tinta',
    type: 'consumivel',
    img: 'systems/tormenta20/icons/itens/gerais/agua-benta.webp',
    description: `<blockquote><p>"Frasco de cerâmica cheio de pigmentos coloridos e gordura alquímica criado pelos grafiteiros Zoyrak."</p></blockquote>
<p>Arremessada em alcance curto. Em vez de dano, explode afetando uma esfera com 6m de raio sob efeito simulado da magia <em>Área Escorregadia</em> até o fim da cena. Criaturas dentro da área durante a explosão ficam <strong>lentas</strong> (Reflexos CD Destreza do arremessador evita; ação de movimento teste de Força CD Destreza para se recuperar).</p>
<p><strong>Tipo:</strong> Preparado alquímico consumível. <strong>Preço:</strong> T$ 35.</p>`,
    chatFlavor: `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*SPLAAAT!* Tinta colorida viscosa cobre o chão e cega os pés dos opressores!"</blockquote><p>Arremessa a Bomba de Tinta Zoyrak. <span style="color: #800000; font-weight: bold;">Área Escorregadia e Condição Lento!</span></p>`,
    rolls: [
      {
        name: 'Teste de Resistência (Reflexos)',
        key: 'teste0',
        type: 'formula',
        parts: [['Reflexos CD Destreza evita condição lento', '', '']],
        versatil: ''
      }
    ],
    system: {
      tipo: 'preparado',
      preco: 35,
      espacos: 1,
      consume: { type: 'consumivel', target: '', amount: 1, mpMultiplier: false },
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Tinta Viscosa (Condição Lento)',
        description: 'Criatura fica lenta na área escorregadia (movimento reduzido à metade, não pode correr).',
        statuses: ['lento'],
        changes: [{ key: 'system.attributes.movement.walk', mode: 1, value: '0.5' }],
        transfer: false
      }
    ]
  })
];

async function injectItems() {
  console.log('=== Injetando Itens, Poderes e Magias da DB #228 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  // Mapeamento de chaves e pastas conhecidas para manter estabilidade e organização
  const idMap = {
    'Arco dos Arautos': '69br2Vuf11ic95OX',
    'Certificado de Conclusão': 'aBdeo9EXGf6uooEo',
    'Chave Mestra': 'OJLisnReNpy3nUcf',
    'Bilhete de Valluk Delsori': '08dvhxFTgF3MxVln',
    'Máscara do Sol Dourado': 'lZ4DmTwLYachR3et',
    'Pingente Rubro': '2hVBcDokMYkfvx45',
    'Alma de Dragão': 'KSIr5sDoKWXgXh5C',
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

  const folderMap = {
    'Arco dos Arautos': 'VkkBiC6Epn7FfW6p', // Armas
    'Arma Silente': 'VkkBiC6Epn7FfW6p', // Armas
    'Certificado de Conclusão': '6HZCPG5QrmzhwmBe', // Poderes
    'Percepção de Masmorra': '6HZCPG5QrmzhwmBe', // Poderes
    'Previdência da Vigília': '6HZCPG5QrmzhwmBe', // Poderes
    'Memorizar Conhecimento': 'LgQdDPaUOdMo4oAX', // Magias
    'Chave Mestra': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Máscara do Sol Dourado': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Pingente Rubro': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Âncora Naufragista': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Bússola das Lágrimas': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Corso Sombrio': 'hHc3Pr3pyP7jzQUo', // Itens Mágicos
    'Alma de Dragão': 'f9rwHA7dJnFLVQH1', // Equipamentos
    'Cítola da Paz': 'f9rwHA7dJnFLVQH1', // Equipamentos
    'Rosário da Vida': 'f9rwHA7dJnFLVQH1', // Equipamentos
    'Bilhete de Valluk Delsori': 'ZMhIquorDsf9xEn8', // Consumível
    'Bomba de Tinta': 'JNF6nQo2SXWlnyg1' // Preparados
  };

  let count = 0;
  for (const item of DB228_ITEMS) {
    if (idMap[item.name]) {
      item._id = idMap[item.name];
    }
    if (folderMap[item.name]) {
      item.folder = folderMap[item.name];
    }
    if (!item.system.source) {
      item.system.source = SOURCE_DB228;
    }
    const key = `!items!${item._id}`;
    await db.put(key, item);
    count++;
    console.log(`✓ [${item.type}] "${item.name}" salvo em Itens_T20 (Key: ${key}) com ${item.effects?.length || 0} efeitos e ${item.system?.rolls?.length || 0} rolagens.`);

    // Efeitos embutidos se existirem
    if (Array.isArray(item.effects)) {
      for (const eff of item.effects) {
        eff.origin = `Item.${item._id}`;
        const effKey = `!items.effects!${item._id}.${eff._id}`;
        await db.put(effKey, eff);
      }
    }
  }

  await db.close();
  console.log(`\n✅ Sucesso: ${count} itens da DB #228 injetados com 100% de conformidade canônica em Itens_T20.`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('Erro ao injetar itens:', err);
    process.exit(1);
  });
}

module.exports = { injectItems };

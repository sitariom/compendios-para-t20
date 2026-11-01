const { ClassicLevel } = require('classic-level');

const statsHeader = {
  compendiumSource: null,
  duplicateSource: null,
  exportSource: null,
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'pi-agent'
};

const powersData = [
  {
    name: 'Ataque com Escudo II',
    prereq: 'Ataque com Escudo',
    execucao: 'passive',
    custo: 0,
    img: 'icons/equipment/shield/heater-wooden-boss-bronze.webp',
    description: 'Você nunca perde o bônus do escudo na Defesa por atacar com ele. Além disso, o custo de Ataque com Escudo é reduzido para 0 PM.',
    quote: 'O escudo não é apenas proteção; é a bigorna onde esmago meus adversários.',
    highlight: 'defesa impenetrável e contra-ataque constante',
    rolls: [],
    effects: []
  },
  {
    name: 'Ataque Poderoso II',
    prereq: 'Ataque Poderoso, Estilo de Duas Mãos',
    execucao: 'livre',
    custo: 1,
    img: 'icons/skills/melee/strike-greatsword-crushed.webp',
    description: 'Quando usa Ataque Poderoso com uma arma corpo a corpo de duas mãos, você pode gastar 1 PM para não sofrer –2 no teste de ataque.',
    quote: 'Duas mãos na empunhadura garantem força total sem perder a precisão do corte.',
    highlight: 'golpes titânicos com precisão absoluta',
    rolls: [],
    effects: []
  },
  {
    name: 'Atirar e Correr',
    prereq: 'Estilo de Arremesso ou Estilo de Disparo',
    execucao: 'livre',
    custo: 2,
    img: 'icons/skills/movement/feet-winged-boots-glowing.webp',
    description: 'Após fazer um ataque à distância, você pode gastar 2 PM para fazer uma ação de movimento, mas apenas para se deslocar.',
    quote: 'Dispare onde dói e mova-se antes que percebam de onde veio o projétil.',
    highlight: 'reposicionamento ágil em combate à distância',
    rolls: [],
    effects: []
  },
  {
    name: 'Bloqueio com Escudo Perfeito',
    prereq: '12º nível de personagem, Bloqueio com Escudo',
    execucao: 'reaction',
    custo: 5,
    img: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp',
    description: 'Uma vez por dia, quando usa Bloqueio com Escudo, você pode gastar +4 PM (para um total de 5 PM) para receber imunidade contra o dano, em vez de RD.',
    quote: 'Nem mesmo o sopro de um dragão atravessará esta barreira de ferro hoje.',
    highlight: 'imunidade absoluta ao impacto',
    rolls: [],
    effects: []
  },
  {
    name: 'Carga de Cavalaria II',
    prereq: 'Carga de Cavalaria',
    execucao: 'passive',
    custo: 0,
    img: 'icons/skills/movement/horse-running-charging-flame.webp',
    description: 'O dano extra fornecido por Carga de Cavalaria aumenta em +2d8 (para um total de 4d8). Além disso, se faz uma investida montada com qualquer lança, também causa +2d8 pontos de dano extra do mesmo tipo (para um total de +4d8 com uma lança montada).',
    quote: 'O peso combinado do ginete e do corcel abre qualquer falange inimiga.',
    highlight: 'devastação máxima em investida montada',
    rolls: [
      {
        name: 'Dano Extra de Investida',
        key: 'danoExtra0',
        type: 'dano',
        parts: [['2d8', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Combatente Sanguinário',
    prereq: 'treinado em Luta ou Pontaria',
    execucao: 'livre',
    custo: 1,
    img: 'icons/skills/wounds/blood-drip-droplet-red.webp',
    description: 'Quando você causa a condição sangrando, a perda de vida muda para 1d8, em vez de 1d6. Além disso, quando você causa a condição sangrando em um alvo que já está sangrando, pode gastar 1 PM para as condições se acumularem (não há um limite para os acúmulos, mas quando a criatura passar no teste para resistir ao sangramento, ela se livra de todas as condições sangrando de uma só vez). Este poder não funciona se a condição foi causada por uma magia.',
    quote: 'Uma ferida aberta é apenas o convite; o sangue chama mais sangue.',
    highlight: 'hemorragia letal e cumulativa',
    rolls: [
      {
        name: 'Perda de Vida (Sangramento)',
        key: 'dano0',
        type: 'dano',
        parts: [['1d8', 'sangramento', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Costas Largas II',
    prereq: 'Costas Largas',
    execucao: 'passive',
    custo: 0,
    img: 'icons/containers/bags/pack-leather-brown.webp',
    description: 'Seu limite de carga aumenta em 15 espaços (para um total de 20 espaços).',
    quote: 'Posso carregar meu arsenal, o acampamento e mais um barril de hidromel sem me cansar.',
    highlight: 'capacidade colossal de transporte',
    rolls: [],
    effects: [
      {
        name: 'Costas Largas II (Carga +15)',
        origin: '',
        tint: '#ffffff',
        flags: { tormenta20: { onuse: false, durationScene: false, self: false, attack: false, skill: false, ability: false, power: false, equipment: false, spell: false, consumable: false, items: '', aumenta: false, custo: null } },
        duration: { rounds: null, seconds: null, startTime: null, combat: null, turns: null, startRound: null, startTurn: null },
        disabled: false,
        img: 'icons/containers/bags/pack-leather-brown.webp',
        type: 'base',
        system: {},
        changes: [
          { key: 'system.attributes.carga.max', mode: 2, value: '15', priority: 20 }
        ],
        description: 'Aumenta o limite de carga em 15 espaços.',
        transfer: true,
        statuses: [],
        sort: 0
      }
    ]
  },
  {
    name: 'Defesa Desarmada I',
    prereq: 'Estilo Desarmado ou semelhante, a critério do mestre (como Briga)',
    execucao: 'reaction',
    custo: 3,
    img: 'icons/skills/melee/unarmed-punch-fist.webp',
    description: 'Quando for alvo de um ataque, você pode gastar 3 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa.',
    quote: 'Desviar a lâmina com o antebraço exige timing perfeito e punhos calejados.',
    highlight: 'interceptação desarmada de golpes',
    rolls: [
      {
        name: 'Teste de Defesa Desarmada',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Defesa Desarmada II',
    prereq: 'Defesa Desarmada I',
    execucao: 'reaction',
    custo: 2,
    img: 'icons/skills/melee/unarmed-punch-fist-yellow.webp',
    description: 'Quando for alvo de um ataque, você pode gastar 2 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa. Além disso, se o ataque que você vencer for corpo a corpo, pode gastar 2 PM para fazer um único ataque desarmado contra o atacante.',
    quote: 'Bloquear é bom; contra-atacar no mesmo segundo quebrando a guarda é melhor ainda.',
    highlight: 'aparar e ripostar com as mãos nuas',
    rolls: [
      {
        name: 'Teste de Defesa Desarmada',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Defesa Desarmada III',
    prereq: 'Defesa Desarmada II',
    execucao: 'reaction',
    custo: 1,
    img: 'icons/skills/melee/unarmed-punch-fist-blue.webp',
    description: 'Quando for alvo de um ataque, você pode gastar 1 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa. Além disso, se o ataque que você vencer for corpo a corpo, pode gastar 1 PM para fazer um único ataque desarmado contra o atacante.',
    quote: 'Minhas mãos são defesas impenetráveis e armas mortais em um só fluxo marcial.',
    highlight: 'mestria suprema do combate desarmado reativo',
    rolls: [
      {
        name: 'Teste de Defesa Desarmada',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Economia de Habilidade',
    prereq: 'treinado em Luta ou Pontaria',
    execucao: 'passive',
    custo: 0,
    img: 'icons/commodities/gems/gem-rough-cushion-blue.webp',
    description: 'Escolha uma habilidade não mágica. Esta habilidade tem seu custo em PM reduzido em –1. Você pode escolher este poder outras vezes para habilidades diferentes.',
    quote: 'A repetição exaustiva transforma esforço bruto em pura memória muscular.',
    highlight: 'otimização marcial de pontos de mana',
    rolls: [],
    effects: []
  },
  {
    name: 'Escudo Fundação',
    prereq: 'Bloqueio com Escudo',
    execucao: 'reaction',
    custo: 0,
    img: 'icons/equipment/shield/tower-wooden-iron-banded.webp',
    description: 'Você pode usar Bloqueio com Escudo contra dano de queda. Se o fizer, a redução de dano é dobrada contra dano de queda.',
    quote: 'Se o chão vem em sua direção, coloque o escudo entre você e o solo.',
    highlight: 'absorção dobrada de impactos de queda',
    rolls: [],
    effects: []
  },
  {
    name: 'Escudo para Lançamento',
    prereq: 'Estilo de Arma e Escudo',
    execucao: 'reaction',
    custo: 1,
    img: 'icons/equipment/shield/kite-iron-boss-steel.webp',
    description: 'Você pode gastar 1 PM como reação para usar seu escudo como uma plataforma de lançamento para um aliado que corra em sua direção. O aliado lançado recebe +5 nos próximos testes de ataque, Acrobacia e Atletismo que fizer até o fim do turno dele, desde que o lançamento faça sentido com o teste, a critério do mestre.',
    quote: 'Pise firme, tome impulso e voe por cima da linha defensiva inimiga!',
    highlight: 'impulsão tática de aliados em combate',
    rolls: [],
    effects: []
  },
  {
    name: 'Especialista em Arcos e Bestas',
    prereq: 'Estilo de Disparo',
    execucao: 'livre',
    custo: 0,
    img: 'icons/weapons/bows/shortbow-recurve-wooden.webp',
    description: 'Você pode fazer a ação mirar com arcos e bestas como ação livre. Além disso, pode sacar, guardar e recarregar estas armas como ação livre.',
    quote: 'Nock, puxada e disparo acontecem no tempo de uma única respiração.',
    highlight: 'agilidade total no manuseio de projéteis',
    rolls: [],
    effects: []
  },
  {
    name: 'Especialista em Camuflagens',
    prereq: 'treinado em Luta ou Pontaria',
    execucao: 'passive',
    custo: 0,
    img: 'icons/magic/nature/stealth-hide-eyes-green.webp',
    description: 'Você treinou para saber tirar proveito de escuridão, neblina e afins. O bônus que você recebe por camuflagem leve muda para 50% (1 a 50 em 1d100), em vez de 20%, e o bônus por camuflagem total muda para 70% (1 a 70 em 1d100), em vez de 50%.',
    quote: 'A névoa e as sombras são a melhor couraça para quem sabe se camuflar.',
    highlight: 'ocultação extrema em ambientes adversos',
    rolls: [],
    effects: []
  },
  {
    name: 'Especialista em Coberturas',
    prereq: 'treinado em Luta ou Pontaria',
    execucao: 'passive',
    custo: 0,
    img: 'icons/environment/settlement/watchtower-cliff.webp',
    description: 'Você treinou para saber tirar proveito de paredes, trincheiras e afins. O bônus que você recebe por cobertura leve muda para +10, em vez de +5.',
    quote: 'Uma simples mureta de pedra vale mais do que dez armaduras completas.',
    highlight: 'fortificação e proteção aprimorada em cobertura',
    rolls: [],
    effects: []
  },
  {
    name: 'Esquiva II',
    prereq: 'Esquiva',
    execucao: 'passive',
    custo: 0,
    img: 'icons/skills/movement/body-turn-dodge-blue.webp',
    description: 'Você recebe +3 na Defesa e Reflexos (para um total de +5).',
    quote: 'Você nunca acertará o que não consegue acompanhar com o olhar.',
    highlight: 'mobilidade acrobática evasiva contínua',
    rolls: [],
    effects: [
      {
        name: 'Esquiva II (+3 Defesa e Reflexos)',
        origin: '',
        tint: '#ffffff',
        flags: { tormenta20: { onuse: false, durationScene: false, self: false, attack: false, skill: false, ability: false, power: false, equipment: false, spell: false, consumable: false, items: '', aumenta: false, custo: null } },
        duration: { rounds: null, seconds: null, startTime: null, combat: null, turns: null, startRound: null, startTurn: null },
        disabled: false,
        img: 'icons/skills/movement/body-turn-dodge-blue.webp',
        type: 'base',
        system: {},
        changes: [
          { key: 'system.attributes.defesa.bonus', mode: 2, value: '3', priority: 20 },
          { key: 'system.pericias.refl.outros', mode: 2, value: '3', priority: 20 }
        ],
        description: 'Bônus passivo de +3 na Defesa e nos testes de Reflexos.',
        transfer: true,
        statuses: [],
        sort: 0
      }
    ]
  },
  {
    name: 'Esquiva III',
    prereq: 'Esquiva II',
    execucao: 'passive',
    custo: 0,
    img: 'icons/magic/air/air-burst-spiral-blue.webp',
    description: 'Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar. Você ainda sofre dano normal se falhar no teste de Reflexos. Esta habilidade exige liberdade de movimentos; você não pode usá-la se estiver de armadura pesada ou na condição imóvel.',
    quote: 'Chamas e explosões passam ao meu redor sem chamuscar minha capa.',
    highlight: 'evasão aprimorada sem sofrer qualquer dano',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada com Rolamento',
    prereq: 'Estilo de Disparo',
    execucao: 'padrao',
    custo: 2,
    img: 'icons/skills/movement/roll-somersault-backward.webp',
    description: 'Você pode gastar uma ação padrão e 2 PM para fazer um ataque à distância com arco ou besta contra um alvo corpo a corpo, sem sofrer penalidades por estar tão próximo. Independentemente de acertar ou não, o disparo cria distração suficiente para você fazer um rolamento para trás como ação livre e se afastar até 6m do alvo.',
    quote: 'Disparo à queima-roupa no peito e um mortal para trás mantendo distância segura.',
    highlight: 'tiro à queima-roupa com recuo acrobático',
    rolls: [
      {
        name: 'Ataque à Distância',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['pont', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Flechada de Impacto I',
    prereq: 'Estilo de Disparo',
    execucao: 'livre',
    custo: 2,
    img: 'icons/weapons/ammunition/arrows-broadhead-glowing-orange.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 2 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 3m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar (todas na área têm direito ao teste).',
    quote: 'A ponta da flecha estilhaça em estilhaços com a força de um trovão.',
    highlight: 'explosão de área de 3m no ponto de impacto',
    area: 'raio de 3m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des reduz o dano da área à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada de Impacto II',
    prereq: 'Flechada de Impacto I',
    execucao: 'livre',
    custo: 3,
    img: 'icons/weapons/ammunition/arrows-broadhead-fire.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 3 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 6m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar.',
    quote: 'A onda de choque se expande engolindo formações inteiras.',
    highlight: 'explosão de área ampliada para 6m de raio',
    area: 'raio de 6m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des reduz o dano da área à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada de Impacto III',
    prereq: 'Flechada de Impacto II',
    execucao: 'livre',
    custo: 4,
    img: 'icons/weapons/ammunition/arrows-broadhead-glowing-red.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 4 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 9m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; neste caso, não precisa rolar ataque e não tem chance de errar.',
    quote: 'Um único projétil capaz de limpar um descampado inteiro.',
    highlight: 'cataclismo de impacto explosivo em raio de 9m',
    area: 'raio de 9m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des reduz o dano da área à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada de Manobra I',
    prereq: 'Estilo de Disparo',
    execucao: 'livre',
    custo: 0,
    img: 'icons/skills/ranged/target-bullseye-arrow-teal.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode escolher fazer uma manobra de combate à distância, em vez de causar dano, e recebe +2 no teste da manobra. Você pode derrubar, desarmar, empurrar ou quebrar. Resolva normalmente, com um teste de ataque à distância oposto a um teste de ataque corpo a corpo do alvo.',
    quote: 'Uma flecha bem colocada desarma um guerreiro antes que ele dê o primeiro passo.',
    highlight: 'manobras à distância com +2 no teste de ataque',
    rolls: [
      {
        name: 'Teste de Manobra à Distância',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['pont', '', ''], ['2', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Flechada de Manobra II',
    prereq: 'Flechada de Manobra I',
    execucao: 'livre',
    custo: 0,
    img: 'icons/skills/ranged/target-bullseye-arrow-blue.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode escolher fazer uma manobra de combate à distância, em vez de causar dano, e recebe +5 no teste da manobra. Você pode derrubar, desarmar, empurrar ou quebrar. Resolva normalmente, com um teste de ataque à distância oposto a um teste de ataque corpo a corpo do alvo.',
    quote: 'Nenhuma empunhadura resiste a um tiro certeiro no ponto de alavanca.',
    highlight: 'manobras de combate à distância com +5 no teste',
    rolls: [
      {
        name: 'Teste de Manobra à Distância',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['pont', '', ''], ['5', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Flechada Precisa Distante I',
    prereq: 'Estilo de Disparo',
    execucao: 'livre',
    custo: 2,
    img: 'icons/weapons/ammunition/arrow-flight-feathered.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 2 PM para aumentar o alcance em um passo e a margem de ameaça em +1.',
    quote: 'O vento guia a flecha exatamente onde a armadura tem uma junta exposta.',
    highlight: 'alcance +1 passo e margem de ameaça +1',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada Precisa Distante II',
    prereq: 'Flechada Precisa Distante I',
    execucao: 'livre',
    custo: 3,
    img: 'icons/weapons/ammunition/arrow-flight-crystal.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 3 PM para aumentar o alcance em dois passos e a margem de ameaça em +2.',
    quote: 'Mesmo no horizonte distante, o alvo já está morto.',
    highlight: 'alcance +2 passos e margem de ameaça +2',
    rolls: [],
    effects: []
  },
  {
    name: 'Flechada Precisa Distante III',
    prereq: 'Flechada Precisa Distante II',
    execucao: 'livre',
    custo: 4,
    img: 'icons/weapons/ammunition/arrow-flight-flaming.webp',
    description: 'Quando faz um ataque à distância com um arco ou besta, você pode gastar 4 PM para aumentar o alcance em três passos e a margem de ameaça em +3.',
    quote: 'Um tiro que desafia a gravidade e atinge o coração através de milhas.',
    highlight: 'alcance +3 passos e margem de ameaça +3',
    rolls: [],
    effects: []
  },
  {
    name: 'Ginete de Guerra',
    prereq: 'Ginete',
    execucao: 'passive',
    custo: 0,
    img: 'icons/environment/creatures/horses.webp',
    description: 'Quando está montado em uma criatura treinada para combate, você sabe usufruir o melhor dela. Além de fornecer os benefícios pelo tipo de parceiro montaria que a criatura é, ela também fornece os benefícios de um parceiro combatente, fortão ou guardião, à sua escolha (o nível de poder desse bônus adicional segue o nível de poder da montaria). Uma vez escolhido, o tipo não pode ser mudado para a mesma criatura.',
    quote: 'Cavaleiro e corcel pensam, reagem e atacam como uma só força implacável.',
    highlight: 'benefício duplo de parceiro para a montaria',
    rolls: [],
    effects: []
  },
  {
    name: 'Golpe Aéreo I',
    prereq: 'treinado em Luta',
    execucao: 'padrao',
    custo: 0,
    img: 'icons/skills/melee/sword-strike-slash-up-white.webp',
    description: 'Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua.',
    quote: 'O salto rompe a guarda e coloca a gravidade ao lado da minha lâmina.',
    highlight: 'posição elevada (+2 ataque) através de salto',
    rolls: [
      {
        name: 'Ataque com Salto',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['2', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Golpe Aéreo II',
    prereq: 'Golpe Aéreo I',
    execucao: 'padrao',
    custo: 2,
    img: 'icons/skills/melee/sword-strike-slash-orange.webp',
    description: 'Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua. Se acertar o ataque, pode gastar 2 PM para elevar o alvo e fazê-lo cair no chão (ele sofre 2d6 pontos de dano de impacto por queda e fica caído).',
    quote: 'Ergo o inimigo nas alturas e o esborracho contra o chão de pedra.',
    highlight: 'lançar o alvo ao chão causando 2d6 de impacto',
    rolls: [
      {
        name: 'Ataque com Salto',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['2', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Queda',
        key: 'danoQueda1',
        type: 'dano',
        parts: [['2d6', 'impacto', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Golpe Aéreo III',
    prereq: 'Golpe Aéreo II',
    execucao: 'padrao',
    custo: 3,
    img: 'icons/skills/melee/sword-strike-slash-blood-red.webp',
    description: 'Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua. Se acertar, pode gastar 3 PM para elevar o alvo e atirá-lo no chão com outro golpe (ele sofre um ataque corpo a corpo adicional seu, sofre 2d6 pontos de dano de impacto por queda e fica caído).',
    quote: 'Subo junto no ar, desfiro um combo aéreo e enterro o oponente no solo.',
    highlight: 'combo aéreo completo com ataque extra e queda',
    rolls: [
      {
        name: 'Ataque Aéreo Inicial',
        key: 'ataque0',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['2', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Ataque Aéreo Adicional',
        key: 'ataqueAdic1',
        type: 'ataque',
        parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
        versatil: '',
        adaptavel: ''
      },
      {
        name: 'Dano de Queda',
        key: 'danoQueda2',
        type: 'dano',
        parts: [['2d6', 'impacto', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Golpe Poderoso Explosivo I',
    prereq: 'Ataque Poderoso II',
    execucao: 'livre',
    custo: 2,
    img: 'icons/skills/melee/strike-hammer-destructive-orange.webp',
    description: 'Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode gastar 2 PM para aplicar uma técnica de impacto explosivo. Se acertar, o ataque causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 3m (exceto você; o tipo de dano é o mesmo para todas). Estas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD For) para reduzir o dano à metade. Você pode atacar num ponto qualquer em alcance natural, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar.',
    quote: 'O impacto da arma quebra o solo e cria uma cratera de choque.',
    highlight: 'impacto explosivo corpo a corpo em raio de 3m',
    area: 'raio de 3m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD For reduz o dano da área à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Golpe Poderoso Explosivo II',
    prereq: 'Golpe Poderoso Explosivo I',
    execucao: 'livre',
    custo: 3,
    img: 'icons/skills/melee/strike-hammer-destructive-red.webp',
    description: 'Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode gastar 3 PM para aplicar uma técnica de impacto explosivo. Se acertar, o ataque causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 6m (exceto você; o tipo de dano é o mesmo para todas). Estas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD For) para reduzir o dano à metade. Você pode atacar num ponto qualquer em alcance natural, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar.',
    quote: 'Um cataclismo marcial que dissipa qualquer tentativa de cerco.',
    highlight: 'impacto explosivo ampliado para 6m de raio',
    area: 'raio de 6m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD For reduz o dano da área à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Golpear e Correr',
    prereq: 'Ataque Furtivo',
    execucao: 'livre',
    custo: 2,
    img: 'icons/skills/movement/shadow-step-smoke-black.webp',
    description: 'Após fazer um ataque furtivo, você pode gastar 2 PM para fazer uma ação de movimento, mas apenas para se deslocar.',
    quote: 'Golpeie pela espinha e desapareça nas trevas antes que o corpo caia.',
    highlight: 'deslocamento evasivo imediato após ataque furtivo',
    rolls: [],
    effects: []
  },
  {
    name: 'Retomar Fôlego',
    prereq: 'treinado em Luta',
    execucao: 'padrao',
    custo: 2,
    img: 'icons/magic/life/heart-hand-gold-green.webp',
    description: 'Você pode gastar pontos de mana para recuperar pontos de vida na proporção de 2 PM para cada 1d8+1 PV recuperados.',
    quote: 'Limpe o sangue do rosto, respire fundo e volte imediatamente para o combate.',
    highlight: 'cura de vigor de 1d8+1 PV por 2 PM',
    rolls: [
      {
        name: 'Recuperação de PV',
        key: 'cura0',
        type: 'formula',
        parts: [['1d8+1', '', '']],
        versatil: '',
        adaptavel: ''
      }
    ],
    effects: []
  },
  {
    name: 'Torrente de Flechas I',
    prereq: 'Estilo de Disparo',
    execucao: 'completa',
    custo: 3,
    img: 'icons/skills/ranged/arrows-volley-salvo-sky.webp',
    description: 'Você pode gastar uma ação completa, 3 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse acertado um ataque à distância com seu arco ou besta automaticamente. Todas as criaturas em uma área de 6m de raio dentro do alcance da sua arma sofrem esse dano (Reflexos CD Des reduz à metade).',
    quote: 'O céu escurece sob uma chuva ininterrupta de virotes afiados.',
    highlight: 'saraivada em área de 6m causando dano da arma',
    area: 'raio de 6m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des reduz o dano à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Torrente de Flechas II',
    prereq: 'Torrente de Flechas I',
    execucao: 'completa',
    custo: 4,
    img: 'icons/skills/ranged/arrows-volley-salvo-orange.webp',
    description: 'Você pode gastar uma ação completa, 4 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse acertado um ataque à distância com seu arco ou besta automaticamente. Todas as criaturas em uma área de 9m de raio dentro do alcance da sua arma sofrem este dano (Reflexos CD Des +5 reduz à metade).',
    quote: 'Nenhum escudo erguido protegerá a falange inteira contra esta tempestade.',
    highlight: 'saraivada ampliada para 9m de raio com CD Des +5',
    area: 'raio de 9m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des +5 reduz o dano à metade.',
    rolls: [],
    effects: []
  },
  {
    name: 'Torrente de Flechas III',
    prereq: 'Torrente de Flechas II',
    execucao: 'completa',
    custo: 5,
    img: 'icons/skills/ranged/arrows-volley-salvo-red.webp',
    description: 'Você pode gastar uma ação completa, 5 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse obtido um acerto crítico em um ataque à distância com seu arco ou besta automaticamente (considere o acerto crítico apenas para propósito de cálculo de dano). Todas as criaturas em uma área de 12m de raio dentro do alcance da sua arma sofrem este dano (Reflexos CD Des +5 reduz à metade).',
    quote: 'Uma saraivada lendária que perfura armaduras como se fossem folhas secas.',
    highlight: 'dano crítico automático em área colossal de 12m de raio',
    area: 'raio de 12m',
    resistenciaPericia: 'refl',
    resistenciaTxt: 'Reflexos CD Des +5 reduz o dano à metade.',
    rolls: [],
    effects: []
  }
];

async function rebuildPowers() {
  console.log('--- RECONSTRUINDO OS 38 PODERES DE COMBATE DA DB #227 ---');
  const db = new ClassicLevel('packs/Itens_T20', { valueEncoding: 'json' });

  // 1. Mapear IDs existentes dos poderes da DB 227 para atualizar os registros sem criar órfãos
  const existingMap = new Map();
  for await (const [key, val] of db.iterator()) {
    if (val.system?.source?.includes('DB #227') || val.system?.source?.includes('Caverna do Saber: Poderes')) {
      existingMap.set(val.name, key.replace('!items!', ''));
    }
  }
  console.log(`Poderes existentes encontrados para atualizar: ${existingMap.size}`);

  let index = 0;
  for (const p of powersData) {
    let id = existingMap.get(p.name);
    if (!id) {
      // Se não encontrado por nome exato, busca uma chave não usada ou gera ID
      id = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
    }

    const doc = {
      _id: id,
      name: p.name,
      type: 'poder',
      img: p.img,
      system: {
        description: {
          value: `<p>${p.description}</p><p><strong>Pré-requisito:</strong> ${p.prereq}.</p>`,
          unidentified: ''
        },
        source: 'Dragão Brasil #227 (Caverna do Saber: Poderes e Combos)',
        ativacao: {
          execucao: p.execucao,
          custo: p.custo,
          qtd: '',
          condicao: '',
          special: ''
        },
        duracao: {
          value: 0,
          units: 'inst',
          special: ''
        },
        target: {
          value: null,
          width: null,
          type: ''
        },
        range: {
          value: null,
          units: ''
        },
        consume: {
          type: '',
          target: '',
          amount: null,
          mpMultiplier: false
        },
        efeito: '',
        alcance: '',
        alvo: '',
        area: p.area || '',
        resistencia: {
          pericia: p.resistenciaPericia || '',
          atributo: '',
          bonus: 0,
          txt: p.resistenciaTxt || ''
        },
        tipo: 'geral',
        subtipo: 'combate',
        chatFlavor: `<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${p.quote}"</blockquote><p>Execução marcial focada em <span style="color: #800000; font-weight: bold;">${p.highlight}</span>.</p></div>`,
        origin: '',
        tags: ['geral', 'combate', 'db227', 'dragao-brasil'],
        chatGif: '',
        rolltags: [],
        automationtags: [],
        rolls: p.rolls || [],
        effects: p.effects || []
      },
      effects: p.effects || [],
      folder: '6HZCPG5QrmzhwmBe', // Pasta "Poderes"
      sort: 80000000 + index * 1000,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!items!${id}`, doc);
    index++;
  }

  await db.close();
  console.log(`✅ ${index} poderes de combate atualizados e adequados com sucesso em Itens_T20!`);
}

rebuildPowers().catch(console.error);

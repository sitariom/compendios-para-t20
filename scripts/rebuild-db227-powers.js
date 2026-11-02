const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function randomId(len = 16) {
  return crypto.randomBytes(len).toString('base64url').slice(0, len);
}

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
    "name": "Ataque com Escudo II",
    "description": "Você nunca perde o bônus do escudo na Defesa por atacar com ele. Além disso, o custo de Ataque com Escudo é reduzido para 0 PM.",
    "prereq": "Ataque com Escudo",
    "img": "icons/equipment/shield/heater-wooden-boss-bronze.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Ataque Poderoso II",
    "description": "Quando usa Ataque Poderoso com uma arma corpo a corpo de duas mãos, você pode gastar 1 PM para não sofrer –2 no teste de ataque.",
    "prereq": "Ataque Poderoso, Estilo de Duas Mãos",
    "img": "icons/skills/melee/strike-greatsword-crushed.webp",
    "execucao": "livre",
    "custo": 1,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Atirar e Correr",
    "description": "Após fazer um ataque à distância, você pode gastar 2 PM para fazer uma ação de movimento, mas apenas para se deslocar.",
    "prereq": "Estilo de Arremesso ou Estilo de Disparo",
    "img": "icons/skills/movement/feet-winged-boots-glowing.webp",
    "execucao": "livre",
    "custo": 2,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Bloqueio com Escudo Perfeito",
    "description": "Uma vez por dia, quando usa Bloqueio com Escudo, você pode gastar +4 PM (para um total de 5 PM) para receber imunidade contra o dano, em vez de RD.",
    "prereq": "12º nível de personagem, Bloqueio com Escudo",
    "img": "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    "execucao": "reaction",
    "custo": 5,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Carga de Cavalaria II",
    "description": "O dano extra fornecido por Carga de Cavalaria aumenta em +2d8 (para um total de 4d8). Além disso, se faz uma investida montada com qualquer lança, também causa +2d8 pontos de dano extra do mesmo tipo (para um total de +4d8 com uma lança montada).",
    "prereq": "Carga de Cavalaria",
    "img": "icons/skills/movement/horse-running-charging-flame.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [
      {
        "name": "Dano Extra de Investida",
        "key": "danoExtra0",
        "type": "dano",
        "parts": [
          [
            "2d8",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Combatente Sanguinário",
    "description": "Quando você causa a condição sangrando, a perda de vida muda para 1d8, em vez de 1d6. Além disso, quando você causa a condição sangrando em um alvo que já está sangrando, pode gastar 1 PM para as condições se acumularem (não há um limite para os acúmulos, mas quando a criatura passar no teste para resistir ao sangramento, ela se livra de todas as condições sangrando de uma só vez). Este poder não funciona se a condição foi causada por uma magia.",
    "prereq": "treinado em Luta ou Pontaria",
    "img": "icons/skills/wounds/blood-drip-droplet-red.webp",
    "execucao": "livre",
    "custo": 1,
    "rolls": [
      {
        "name": "Perda de Vida (Sangramento)",
        "key": "dano0",
        "type": "dano",
        "parts": [
          [
            "1d8",
            "sangramento",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Costas Largas II",
    "description": "Seu limite de carga aumenta em 15 espaços (para um total de 20 espaços).",
    "prereq": "Costas Largas",
    "img": "icons/containers/bags/pack-leather-brown.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Defesa Desarmada I",
    "description": "Quando for alvo de um ataque, você pode gastar 3 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa.",
    "prereq": "Estilo Desarmado ou semelhante, a critério do mestre (como Briga)",
    "img": "icons/skills/melee/unarmed-punch-fist.webp",
    "execucao": "reaction",
    "custo": 3,
    "rolls": [
      {
        "name": "Teste de Defesa Desarmada",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Defesa Desarmada II",
    "description": "Quando for alvo de um ataque, você pode gastar 2 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa. Além disso, se o ataque que você vencer for corpo a corpo, pode gastar 2 PM para fazer um único ataque desarmado contra o atacante.",
    "prereq": "Defesa Desarmada I",
    "img": "icons/skills/melee/unarmed-punch-fist-yellow.webp",
    "execucao": "reaction",
    "custo": 2,
    "rolls": [
      {
        "name": "Teste de Defesa Desarmada",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Defesa Desarmada III",
    "description": "Quando for alvo de um ataque, você pode gastar 1 PM para fazer um teste oposto de ataque desarmado. Se vencer, é como se o ataque não tivesse vencido sua Defesa. Além disso, se o ataque que você vencer for corpo a corpo, pode gastar 1 PM para fazer um único ataque desarmado contra o atacante.",
    "prereq": "Defesa Desarmada II",
    "img": "icons/skills/melee/unarmed-punch-fist-blue.webp",
    "execucao": "reaction",
    "custo": 1,
    "rolls": [
      {
        "name": "Teste de Defesa Desarmada",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Economia de Habilidade",
    "description": "Escolha uma habilidade não mágica. Esta habilidade tem seu custo em PM reduzido em –1. Você pode escolher este poder outras vezes para habilidades diferentes.",
    "prereq": "treinado em Luta ou Pontaria",
    "img": "icons/commodities/gems/gem-rough-cushion-blue.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Escudo Fundação",
    "description": "Você pode usar Bloqueio com Escudo contra dano de queda. Se o fizer, a redução de dano é dobrada contra dano de queda.",
    "prereq": "Bloqueio com Escudo",
    "img": "icons/equipment/shield/tower-wooden-iron-banded.webp",
    "execucao": "reaction",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Escudo para Lançamento",
    "description": "Você pode gastar 1 PM como reação para usar seu escudo como uma plataforma de lançamento para um aliado que corra em sua direção. O aliado lançado recebe +5 nos próximos testes de ataque, Acrobacia e Atletismo que fizer até o fim do turno dele, desde que o lançamento faça sentido com o teste, a critério do mestre.",
    "prereq": "Estilo de Arma e Escudo",
    "img": "icons/equipment/shield/kite-iron-boss-steel.webp",
    "execucao": "reaction",
    "custo": 1,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Especialista em Arcos e Bestas",
    "description": "Você pode fazer a ação mirar com arcos e bestas como ação livre. Além disso, pode sacar, guardar e recarregar estas armas como ação livre.",
    "prereq": "Estilo de Disparo",
    "img": "icons/weapons/bows/shortbow-recurve-wooden.webp",
    "execucao": "livre",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Especialista em Camuflagens",
    "description": "Você treinou para saber tirar proveito de escuridão, neblina e afins. O bônus que você recebe por camuflagem leve muda para 50% (1 a 50 em 1d100), em vez de 20%, e o bônus por camuflagem total muda para 70% (1 a 70 em 1d100), em vez de 50%.",
    "prereq": "treinado em Luta ou Pontaria",
    "img": "icons/magic/nature/stealth-hide-eyes-green.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Especialista em Coberturas",
    "description": "Você treinou para saber tirar proveito de paredes, trincheiras e afins. O bônus que você recebe por cobertura leve muda para +10, em vez de +5.",
    "prereq": "treinado em Luta ou Pontaria",
    "img": "icons/environment/settlement/watchtower-cliff.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Esquiva II",
    "description": "Você recebe +3 na Defesa e Reflexos (para um total de +5).",
    "prereq": "Esquiva",
    "img": "icons/skills/movement/body-turn-dodge-blue.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Esquiva III",
    "description": "Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar. Você ainda sofre dano normal se falhar no teste de Reflexos. Esta habilidade exige liberdade de movimentos; você não pode usá-la se estiver de armadura pesada ou na condição imóvel.",
    "prereq": "Esquiva II",
    "img": "icons/magic/air/air-burst-spiral-blue.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada com Rolamento",
    "description": "Você pode gastar uma ação padrão e 2 PM para fazer um ataque à distância com arco ou besta contra um alvo corpo a corpo, sem sofrer penalidades por estar tão próximo. Independentemente de acertar ou não, o disparo cria distração suficiente para você fazer um rolamento para trás como ação livre e se afastar até 6m do alvo.",
    "prereq": "Estilo de Disparo",
    "img": "icons/skills/movement/roll-somersault-backward.webp",
    "execucao": "padrao",
    "custo": 2,
    "rolls": [
      {
        "name": "Ataque à Distância",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "pont",
            "",
            ""
          ],
          [
            "",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada de Impacto I",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 2 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 3m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar (mas também não acerta nenhuma criatura diretamente, todas na área podem fazer o teste de resistência).",
    "prereq": "Estilo de Disparo",
    "img": "icons/weapons/ammunition/arrows-broadhead-glowing-orange.webp",
    "execucao": "livre",
    "custo": 2,
    "rolls": [],
    "area": "raio de 3m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des reduz o dano da área à metade."
  },
  {
    "name": "Flechada de Impacto II",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 3 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 6m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar (mas também não acerta nenhuma criatura diretamente, todas na área podem fazer o teste de resistência).",
    "prereq": "Flechada de Impacto I",
    "img": "icons/weapons/ammunition/arrows-broadhead-fire.webp",
    "execucao": "livre",
    "custo": 3,
    "rolls": [],
    "area": "raio de 6m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des reduz o dano da área à metade."
  },
  {
    "name": "Flechada de Impacto III",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 4 PM para aplicar uma técnica de impacto explosivo. Se acertar, o disparo causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 9m (o tipo de dano é o mesmo para todas). Essas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD Des) para reduzir o dano à metade. Você pode disparar num ponto qualquer dentro do alcance da arma, em vez de em um alvo específico; neste caso, não precisa rolar ataque e não tem chance de errar (mas também não acerta nenhuma criatura diretamente, todas na área podem fazer o teste de resistência).",
    "prereq": "Flechada de Impacto II",
    "img": "icons/weapons/ammunition/arrows-broadhead-glowing-red.webp",
    "execucao": "livre",
    "custo": 4,
    "rolls": [],
    "area": "raio de 9m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des reduz o dano da área à metade."
  },
  {
    "name": "Flechada de Manobra I",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode escolher fazer uma manobra de combate à distância, em vez de causar dano, e recebe +2 no teste da manobra. Você pode derrubar (a flecha faz o alvo tropeçar e cair, por exemplo), desarmar (a flecha atinge o item empunhado com intenção de derrubá-lo), empurrar (a flecha se enrosca no alvo e o puxa para trás) ou quebrar (a flecha atinge o item empunhado com intenção de quebrá-lo). Resolva normalmente, com um teste de ataque à distância oposto a um teste de ataque corpo a corpo do alvo.",
    "prereq": "Estilo de Disparo",
    "img": "icons/skills/ranged/target-bullseye-arrow-teal.webp",
    "execucao": "livre",
    "custo": 0,
    "rolls": [
      {
        "name": "Teste de Manobra à Distância",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "pont",
            "",
            ""
          ],
          [
            "2",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada de Manobra II",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode escolher fazer uma manobra de combate à distância, em vez de causar dano, e recebe +5 no teste da manobra. Você pode derrubar (a flecha faz o alvo tropeçar e cair, por exemplo), desarmar (a flecha atinge o item empunhado com intenção de derrubá-lo), empurrar (a flecha se enrosca no alvo e o puxa para trás) ou quebrar (a flecha atinge o item empunhado com intenção de quebrá-lo). Resolva normalmente, com um teste de ataque à distância oposto a um teste de ataque corpo a corpo do alvo.",
    "prereq": "Flechada de Manobra I",
    "img": "icons/skills/ranged/target-bullseye-arrow-blue.webp",
    "execucao": "livre",
    "custo": 0,
    "rolls": [
      {
        "name": "Teste de Manobra à Distância",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "pont",
            "",
            ""
          ],
          [
            "5",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada Precisa Distante I",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 2 PM para aumentar o alcance em um passo e a margem de ameaça em +1.",
    "prereq": "Estilo de Disparo",
    "img": "icons/weapons/ammunition/arrow-flight-feathered.webp",
    "execucao": "livre",
    "custo": 2,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada Precisa Distante II",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 3 PM para aumentar o alcance em dois passos e a margem de ameaça em +2.",
    "prereq": "Flechada Precisa Distante I",
    "img": "icons/weapons/ammunition/arrow-flight-crystal.webp",
    "execucao": "livre",
    "custo": 3,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Flechada Precisa Distante III",
    "description": "Quando faz um ataque à distância com um arco ou besta, você pode gastar 4 PM para aumentar o alcance em três passos e a margem de ameaça em +3.",
    "prereq": "Flechada Precisa Distante II",
    "img": "icons/weapons/ammunition/arrow-flight-flaming.webp",
    "execucao": "livre",
    "custo": 4,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Ginete de Guerra",
    "description": "Quando está montado em uma criatura treinada para combate, você sabe usufruir o melhor dela. Além de fornecer os benefícios pelo tipo de parceiro montaria que a criatura é, ela também fornece os benefícios de um parceiro combatente, fortão ou guardião, à sua escolha (o nível de poder desse bônus adicional segue o nível de poder da montaria). Uma vez escolhido, o tipo não pode ser mudado para a mesma criatura.",
    "prereq": "Ginete",
    "img": "icons/environment/creatures/horses.webp",
    "execucao": "passive",
    "custo": 0,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Golpe Aéreo I",
    "description": "Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua.",
    "prereq": "treinado em Luta",
    "img": "icons/skills/melee/sword-strike-slash-up-white.webp",
    "execucao": "padrao",
    "custo": 0,
    "rolls": [
      {
        "name": "Ataque com Salto",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "2",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Golpe Aéreo II",
    "description": "Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua. Se acertar o ataque, pode gastar 2 PM para elevar o alvo e fazê-lo cair no chão (ele sofre 2d6 pontos de dano de impacto por queda e fica caído).",
    "prereq": "Golpe Aéreo I",
    "img": "icons/skills/melee/sword-strike-slash-orange.webp",
    "execucao": "padrao",
    "custo": 2,
    "rolls": [
      {
        "name": "Ataque com Salto",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "2",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      },
      {
        "name": "Dano de Queda",
        "key": "danoQueda1",
        "type": "dano",
        "parts": [
          [
            "2d6",
            "impacto",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Golpe Aéreo III",
    "description": "Uma vez por rodada, você pode gastar uma ação padrão para fazer um ataque corpo a corpo junto de um salto. Você recebe os mesmos benefícios de posição elevada (+2 no teste de ataque). Só funciona em criaturas com, no máximo, uma categoria de tamanho acima da sua. Se acertar, pode gastar 3 PM para elevar o alvo e atirá-lo no chão com outro golpe (ele sofre um ataque corpo a corpo adicional seu, sofre 2d6 pontos de dano de impacto por queda e fica caído).",
    "prereq": "Golpe Aéreo II",
    "img": "icons/skills/melee/sword-strike-slash-blood-red.webp",
    "execucao": "padrao",
    "custo": 3,
    "rolls": [
      {
        "name": "Ataque Aéreo Inicial",
        "key": "ataque0",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "2",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      },
      {
        "name": "Ataque Aéreo Adicional",
        "key": "ataqueAdic1",
        "type": "ataque",
        "parts": [
          [
            "1d20",
            "",
            ""
          ],
          [
            "luta",
            "",
            ""
          ],
          [
            "",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      },
      {
        "name": "Dano de Queda",
        "key": "danoQueda2",
        "type": "dano",
        "parts": [
          [
            "2d6",
            "impacto",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Golpe Poderoso Explosivo I",
    "description": "Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode gastar 2 PM para aplicar uma técnica de impacto explosivo. Se acertar, o ataque causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 3m (exceto você; o tipo de dano é o mesmo para todas). Estas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD For) para reduzir o dano à metade. Você pode atacar num ponto qualquer em alcance natural, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar (mas também não acerta nenhuma criatura diretamente, todas na área podem fazer o teste de resistência).",
    "prereq": "Ataque Poderoso II",
    "img": "icons/skills/melee/strike-hammer-destructive-orange.webp",
    "execucao": "livre",
    "custo": 2,
    "rolls": [],
    "area": "raio de 3m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD For reduz o dano da área à metade."
  },
  {
    "name": "Golpe Poderoso Explosivo II",
    "description": "Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode gastar 3 PM para aplicar uma técnica de impacto explosivo. Se acertar, o ataque causa seu dano no alvo atingido normalmente e em todas as criaturas num raio de 6m (exceto você; o tipo de dano é o mesmo para todas). Estas criaturas (mas não o alvo atingido diretamente) têm direito a fazer o teste de resistência de Reflexos (CD For) para reduzir o dano à metade. Você pode atacar num ponto qualquer em alcance natural, em vez de em um alvo específico; nesse caso, não precisa rolar ataque e não tem chance de errar (mas também não acerta nenhuma criatura diretamente, todas na área podem fazer o teste de resistência).",
    "prereq": "Golpe Poderoso Explosivo I",
    "img": "icons/skills/melee/strike-hammer-destructive-red.webp",
    "execucao": "livre",
    "custo": 3,
    "rolls": [],
    "area": "raio de 6m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD For reduz o dano da área à metade."
  },
  {
    "name": "Golpear e Correr",
    "description": "Após fazer um ataque furtivo, você pode gastar 2 PM para fazer uma ação de movimento, mas apenas para se deslocar.",
    "prereq": "Ataque Furtivo",
    "img": "icons/skills/movement/shadow-step-smoke-black.webp",
    "execucao": "livre",
    "custo": 2,
    "rolls": [],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Retomar Fôlego",
    "description": "Você pode gastar pontos de mana para recuperar pontos de vida na proporção de 2 PM para cada 1d8+1 PV recuperados.",
    "prereq": "treinado em Luta",
    "img": "icons/magic/life/heart-hand-gold-green.webp",
    "execucao": "padrao",
    "custo": 2,
    "rolls": [
      {
        "name": "Recuperação de PV",
        "key": "cura0",
        "type": "formula",
        "parts": [
          [
            "1d8+1",
            "",
            ""
          ]
        ],
        "versatil": "",
        "adaptavel": ""
      }
    ],
    "area": "",
    "resistenciaPericia": "",
    "resistenciaTxt": ""
  },
  {
    "name": "Torrente de Flechas I",
    "description": "Você pode gastar uma ação completa, 3 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse acertado um ataque à distância com seu arco ou besta automaticamente. Todas as criaturas em uma área de 6m de raio dentro do alcance da sua arma sofrem esse dano (Reflexos CD Des reduz à metade).",
    "prereq": "Estilo de Disparo",
    "img": "icons/skills/ranged/arrows-volley-salvo-sky.webp",
    "execucao": "completa",
    "custo": 3,
    "rolls": [],
    "area": "raio de 6m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des reduz o dano à metade."
  },
  {
    "name": "Torrente de Flechas II",
    "description": "Você pode gastar uma ação completa, 4 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse acertado um ataque à distância com seu arco ou besta automaticamente. Todas as criaturas em uma área de 9m de raio dentro do alcance da sua arma sofrem este dano (Reflexos CD Des +5 reduz à metade).",
    "prereq": "Torrente de Flechas I",
    "img": "icons/skills/ranged/arrows-volley-salvo-orange.webp",
    "execucao": "completa",
    "custo": 4,
    "rolls": [],
    "area": "raio de 9m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des +5 reduz o dano à metade."
  },
  {
    "name": "Torrente de Flechas III",
    "description": "Você pode gastar uma ação completa, 5 PM, e toda a sua aljava de flechas ou virotes em uma sequência de disparos múltiplos. Role seu dano como se tivesse obtido um acerto crítico em um ataque à distância com seu arco ou besta automaticamente (considere o acerto crítico apenas para propósito de cálculo de dano). Todas as criaturas em uma área de 12m de raio dentro do alcance da sua arma sofrem este dano (Reflexos CD Des +5 reduz à metade).",
    "prereq": "Torrente de Flechas II",
    "img": "icons/skills/ranged/arrows-volley-salvo-red.webp",
    "execucao": "completa",
    "custo": 5,
    "rolls": [],
    "area": "raio de 12m",
    "resistenciaPericia": "refl",
    "resistenciaTxt": "Reflexos CD Des +5 reduz o dano à metade."
  }
];

const effectDefinitions = {
  'Ataque com Escudo II': {
    name: 'Ataque com Escudo (0 PM)',
    changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }]
  },
  'Ataque Poderoso II': {
    name: 'Ataque Poderoso II (Sem Penalidade)',
    changes: [{ key: 'system.modificadores.ataque.geral', mode: 2, value: '2' }]
  },
  'Atirar e Correr': {
    name: 'Deslocamento Tático (Atirar e Correr)',
    changes: []
  },
  'Bloqueio com Escudo Perfeito': {
    name: 'Bloqueio Perfeito (Imunidade)',
    changes: []
  },
  'Carga de Cavalaria II': {
    name: 'Carga de Cavalaria Ampliada (+2d8 Dano)',
    changes: [{ key: 'system.modificadores.dano.geral', mode: 2, value: '2d8' }]
  },
  'Combatente Sanguinário': {
    name: 'Sangramento Letal (1d8 Cumulativo)',
    changes: []
  },
  'Costas Largas II': {
    name: 'Limite de Carga (+15 Espaços)',
    changes: [{ key: 'system.detalhes.carga', mode: 2, value: '15' }]
  },
  'Defesa Desarmada I': {
    name: 'Bloqueio Desarmado (3 PM)',
    changes: []
  },
  'Defesa Desarmada II': {
    name: 'Contra-Ataque Desarmado (2 PM)',
    changes: []
  },
  'Defesa Desarmada III': {
    name: 'Redirecionar Golpe Desarmado (1 PM)',
    changes: []
  },
  'Economia de Habilidade': {
    name: 'Economia de Habilidade (-1 PM)',
    changes: [{ key: 'system.modificadores.custoPM', mode: 2, value: '-1' }]
  },
  'Escudo Fundação': {
    name: 'Escudo Fundação (RD Queda)',
    changes: []
  },
  'Escudo para Lançamento': {
    name: 'Plataforma de Lançamento (+5 Atletismo / +3m)',
    changes: [{ key: 'system.pericias.atle.bonus', mode: 2, value: '5' }]
  },
  'Especialista em Arcos e Bestas': {
    name: 'Manejo Rápido de Projéteis',
    changes: []
  },
  'Especialista em Camuflagens': {
    name: 'Camuflagem em Terreno Adequado (+5 Furtividade)',
    changes: [{ key: 'system.pericias.furt.bonus', mode: 2, value: '5' }]
  },
  'Especialista em Coberturas': {
    name: 'Aproveitamento de Cobertura (+2 Defesa e Reflexos)',
    changes: [
      { key: 'system.modificadores.defesa.outros', mode: 2, value: '2' },
      { key: 'system.pericias.refl.bonus', mode: 2, value: '2' }
    ]
  },
  'Esquiva II': {
    name: 'Esquiva II (+3 Defesa e Reflexos)',
    changes: [
      { key: 'system.modificadores.defesa.outros', mode: 2, value: '3' },
      { key: 'system.pericias.refl.bonus', mode: 2, value: '3' }
    ]
  },
  'Esquiva III': {
    name: 'Evasão Aprimorada',
    changes: []
  },
  'Flechada com Rolamento': {
    name: 'Disparo e Rolamento (Recuo 6m)',
    changes: []
  },
  'Flechada de Impacto I': {
    name: 'Impacto Explosivo (Raio 3m)',
    changes: []
  },
  'Flechada de Impacto II': {
    name: 'Impacto Explosivo Ampliado (Raio 6m)',
    changes: []
  },
  'Flechada de Impacto III': {
    name: 'Impacto Explosivo Devastador (Raio 9m)',
    changes: []
  },
  'Flechada de Manobra I': {
    name: 'Manobra à Distância (+2 no Teste)',
    changes: [{ key: 'system.modificadores.ataque.geral', mode: 2, value: '2' }]
  },
  'Flechada de Manobra II': {
    name: 'Manobra à Distância Aprimorada (+5 no Teste)',
    changes: [{ key: 'system.modificadores.ataque.geral', mode: 2, value: '5' }]
  },
  'Flechada Precisa Distante I': {
    name: 'Flechada Precisa Distante I (+1 Margem / +1 Passo)',
    changes: []
  },
  'Flechada Precisa Distante II': {
    name: 'Flechada Precisa Distante II (+2 Margem / +2 Passos)',
    changes: []
  },
  'Flechada Precisa Distante III': {
    name: 'Flechada Precisa Distante III (+3 Margem / +3 Passos)',
    changes: []
  },
  'Ginete de Guerra': {
    name: 'Montaria de Guerra (Parceiro Duplo)',
    changes: []
  },
  'Golpe Aéreo I': {
    name: 'Posição Elevada (+2 Ataque)',
    changes: [{ key: 'system.modificadores.ataque.geral', mode: 2, value: '2' }]
  },
  'Golpe Aéreo II': {
    name: 'Queda Aérea (2d6 Impacto e Caído)',
    changes: []
  },
  'Golpe Aéreo III': {
    name: 'Queda Devastadora (4d6 Impacto, Atordoado e Caído)',
    changes: []
  },
  'Golpe Poderoso Explosivo I': {
    name: 'Impacto Terrestre (Raio 3m)',
    changes: []
  },
  'Golpe Poderoso Explosivo II': {
    name: 'Impacto Terrestre Ampliado (Raio 6m)',
    changes: []
  },
  'Golpear e Correr': {
    name: 'Recuo Furtivo (Ação de Movimento)',
    changes: []
  },
  'Retomar Fôlego': {
    name: 'Recuperação de Fôlego (1d8+1 PV / 2 PM)',
    changes: []
  },
  'Torrente de Flechas I': {
    name: 'Sequência de Disparos (Área 6m)',
    changes: []
  },
  'Torrente de Flechas II': {
    name: 'Sequência de Disparos Ampliada (Área 9m)',
    changes: []
  },
  'Torrente de Flechas III': {
    name: 'Sequência de Disparos Crítica (Área 12m)',
    changes: []
  }
};

async function rebuildPowers() {
  const dbPath = path.join(__dirname, '..', 'packs', 'Itens_T20');
  const db = new ClassicLevel(dbPath, { keyEncoding: 'utf8', valueEncoding: 'json' });

  const existingMap = new Map();
  for await (const [key, val] of db.iterator()) {
    if (key.startsWith('!items!') && !key.includes('.')) {
      if (val.system?.source?.includes('DB #227') || val.system?.source?.includes('Caverna do Saber')) {
        existingMap.set(val.name, key.replace('!items!', ''));
      }
    }
  }

  const srcDir = path.join(__dirname, '..', 'src', 'packs', 'Itens_T20');
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

  let count = 0;
  for (const item of powersData) {
    const name = item.name;
    let id = existingMap.get(name);
    if (!id) {
      id = randomId();
    }

    const htmlDesc = `<p>${item.description}</p>${item.prereq ? `<p><strong>Pré-requisito:</strong> ${item.prereq}.</p>` : ''}`;

    const effDef = effectDefinitions[name] || { name: `${name} (Efeito Ativo)`, changes: [] };
    const effId = randomId();
    const effObj = {
      _id: effId,
      name: effDef.name,
      img: item.img || 'icons/skills/melee/strike-greatsword-crushed.webp',
      type: 'base',
      system: {
        identifier: 'base',
        targets: ['self'],
        status: null,
        abilityUse: {
          description: effDef.name,
          automatic: true,
          aumenta: false,
          custo: 0,
          names: [],
          types: []
        }
      },
      changes: effDef.changes || [],
      disabled: false,
      duration: {
        startTime: null,
        seconds: null,
        combat: null,
        rounds: null,
        turns: null,
        startRound: null,
        startTurn: null
      },
      description: effDef.name,
      origin: name,
      tint: '#ffffff',
      transfer: true,
      statuses: [],
      sort: 0,
      flags: {
        tormenta20: {
          duration: 'passivo',
          origin: name,
          type: 'base',
          description: effDef.name,
          identifier: 'base',
          status: null,
          priority: 20,
          transfer: true
        }
      },
      _stats: statsHeader
    };

    const doc = {
      _id: id,
      name: name,
      type: 'poder',
      img: item.img || 'icons/skills/melee/strike-greatsword-crushed.webp',
      system: {
        description: {
          value: htmlDesc,
          unidentified: ''
        },
        source: 'Dragão Brasil #227 (Caverna do Saber: Poderes e Combos)',
        ativacao: {
          execucao: item.execucao || 'passive',
          custo: item.custo || 0,
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
        area: item.area || '',
        resistencia: {
          pericia: item.resistenciaPericia || '',
          atributo: '',
          bonus: 0,
          txt: item.resistenciaTxt || ''
        },
        tipo: 'geral',
        subtipo: 'combate',
        chatFlavor: '',
        origin: '',
        tags: ['geral', 'combate', 'db227', 'dragao-brasil'],
        chatGif: '',
        rolltags: [],
        automationtags: [],
        rolls: item.rolls || []
      },
      effects: [effId],
      folder: '6HZCPG5QrmzhwmBe',
      sort: 80000000 + count * 1000,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!items!${id}`, doc);
    await db.put(`!items.effects!${id}.${effId}`, effObj);

    const srcFile = path.join(srcDir, `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${id}.json`);
    fs.writeFileSync(srcFile, JSON.stringify({ ...doc, _subdocuments: { effects: [effObj] } }, null, 2));

    count++;
  }

  await db.close();
  console.log(`✅ ${count} poderes da DB #227 reconstruídos com sucesso em packs/Itens_T20 e src/packs/Itens_T20!`);
}

rebuildPowers().catch(console.error);

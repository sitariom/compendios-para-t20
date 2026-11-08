#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens, Parceiros, Veículos e Poderes da DB #230 em Itens_T20
 *
 * Conteúdo:
 * 1. Parceira Oficial da Corrida Brutal:
 *    - Parceira: Rotsheel (Combatente Veterana Hobgoblin)
 * 2. Veículos, Equipamentos e Armas:
 *    - Carruagem Duyshidakk (Veículo Enorme com Correntes de Fixação)
 *    - Machado do Campeão de Tyrondir (Machado de Guerra Aumentado Atroz Formidável)
 *    - Kum’shrak Eviscerador (Arma Exótica Duyshidakk com Sangramento)
 * 3. Consumíveis, Alquímicos e Venenos:
 *    - Centelha Onírica (Despojo de Mestre do Pesadelo - Concede Magia de Ilusão de até 2º Círculo)
 *    - Fruto da Florescência (Iguaria Parasitária da Tormenta de Yukadar)
 * 4. Poderes Oníricos e Sonhos Resgatados:
 *    - Sonho Resgatado: Sonho de Amor (+1 PM a cada dois níveis)
 *    - Sonho Resgatado: Sonho de Aprendizado (+2 em 3 perícias)
 *    - Sonho Resgatado: Sonho de Destruição (+1 PV por nível)
 *    - Pesadelo Onírico: Sonho Perdido (Condição de Sonho Roubado por Coletor)
 *
 * Arquitetura Canônica de Subdocumentos ClassicLevel:
 * - O item pai armazena effects: [effId1, effId2, ...]
 * - Cada efeito é gravado em !items.effects!${itemId}.${effId} com schema BaseEffect
 * - Sincronização automática em packs/Itens_T20 e src/packs/Itens_T20/
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { saveToSourcePacks } = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB230 = 'Dragão Brasil #230';

// Mapeamento Estático e Determinístico de IDs (Garantia de Idempotência)
const DB230_ID_MAP = {
  'Parceira: Rotsheel': 'gq8KPRotsheel230',
  'Carruagem Duyshidakk': 'gq8KCarruagem230',
  'Machado do Campeão de Tyrondir': 'gq8KMachadoT230',
  'Kum’shrak Eviscerador': 'gq8KKumshrak230',
  'Centelha Onírica': 'gq8KCentelha230',
  'Sonho Resgatado: Sonho de Amor': 'gq8KSonhoAmo230',
  'Sonho Resgatado: Sonho de Aprendizado': 'gq8KSonhoApr230',
  'Sonho Resgatado: Sonho de Destruição': 'gq8KSonhoDes230',
  'Pesadelo Onírico: Sonho Perdido': 'gq8KPesadPer230'
};

// Pastas Oficiais em Itens_T20
const FOLDER_PARCEIROS = '0uRx5Efj3tk7P5Xr';
const FOLDER_EQUIPAMENTOS = 'f9rwHA7dJnFLVQH1';
const FOLDER_ARMAS = 'VkkBiC6Epn7FfW6p';
const FOLDER_CONSUMIVEL = 'ZMhIquorDsf9xEn8';
const FOLDER_PODERES = '6HZCPG5QrmzhwmBe';

const DB230_ITEMS = [
  // =========================================================================
  // 1. PARCEIRA: ROTSHEEL (Combatente Veterana Hobgoblin)
  // =========================================================================
  {
    name: 'Parceira: Rotsheel',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/estrategia.webp',
    folder: FOLDER_PARCEIROS,
    system: {
      type: 'poder',
      tipo: 'parceiro',
      subtipo: 'combatente',
      nivel: 'veterano',
      tags: ['parceiro', 'combatente', 'veterano', 'duyshidakk'],
      descricao: '<p>A feroz hobgoblin <strong>Rotsheel</strong> é uma sobrevivente implacável das pistas das Ruínas de Tyrondir e pilota experiente da <em>Carruagem Duyshidakk</em>.</p><p>Como <strong>Parceira Combatente Veterana</strong>, ela concede:</p><ul><li><strong>Ataque e Margem de Ameaça:</strong> +2 em testes de ataque e +1 na margem de ameaça para ataques corpo a corpo e à distância.</li><li><strong>Copiloto de Tyrondir:</strong> Se estiver auxiliando na condução ou pilotando a Carruagem Duyshidakk, fornece um bônus de +5 nos testes de Pilotagem ou Sobrevivência para corridas e perseguições veiculares.</li><li><strong>Ganchos Protetores:</strong> Garante que os personagens presos aos seus arreios tenham +10 contra manobras para derrubar.</li></ul>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effRotsheel01230',
        name: 'Parceiro Combatente Veterano (+2 Ataque, +1 Margem)',
        icon: 'systems/tormenta20/icons/poderes/ameacas/estrategia.webp',
        changes: [
          { key: 'system.attributes.ataque.bonus', mode: 2, value: '2', priority: 20 },
          { key: 'system.attributes.ataque.margem', mode: 2, value: '1', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            attack: true
          }
        }
      },
      {
        _id: 'effRotsheel02230',
        name: 'Copiloto de Tyrondir (+5 Pilotagem)',
        icon: 'systems/tormenta20/icons/poderes/ameacas/velocidade.webp',
        changes: [
          { key: 'system.skills.pilo.bonus', mode: 2, value: '5', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            skill: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 2. VEÍCULO: CARRUAGEM DUYSHIDAKK
  // =========================================================================
  {
    name: 'Carruagem Duyshidakk',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/equipamentos/carroca.webp',
    folder: FOLDER_EQUIPAMENTOS,
    system: {
      type: 'equipamento',
      tipo: 'veículo',
      preco: 1500,
      espaco: 20,
      capacidade: 100,
      descricao: '<p>Criação blindada do artífice goblin Goppo e conduzida por Rotsheel nas Ruínas de Tyrondir. Trata-se de um veículo de tamanho <strong>Enorme</strong>, deslocamento <strong>15m</strong>, Defesa <strong>25</strong> (ou 20 + Des do piloto), <strong>200 PV</strong> e <strong>RD 10</strong>, capaz de carregar até 100 espaços (veja <em>Heróis de Arton</em>, p. 241).</p><p>As correntes e ganchos colocados na estrutura fornecem um bônus de <strong>+10</strong> contra qualquer tentativa de derrubar ocupantes do veículo. Além disso, a carruagem oferece um bônus de <strong>+5</strong> nos testes de Pilotagem durante manobras de corrida.</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effCarruagem0123',
        name: 'Ganchos e Correntes Duyshidakk (+10 contra Derrubar)',
        icon: 'systems/tormenta20/icons/itens/equipamentos/carroca.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            equipment: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 3. ARMA: MACHADO DO CAMPEÃO DE TYRONDIR
  // =========================================================================
  {
    name: 'Machado do Campeão de Tyrondir',
    type: 'arma',
    img: 'systems/tormenta20/icons/armas/machado-de-guerra.webp',
    folder: FOLDER_ARMAS,
    system: {
      type: 'arma',
      tipo: 'machado',
      empunhadura: 'duasMãos',
      dano: '3d6',
      critico: {
        margem: 19,
        multiplicador: 3
      },
      tipoDano: 'corte',
      preco: 6000,
      espaco: 3,
      alcance: 'corpo-a-corpo',
      melhorias: ['aumentado', 'atroz', 'formidável'],
      bonusAtaque: 2,
      bonusDano: 2,
      descricao: '<p>O prêmio de glória concedido aos campeões da Corrida Brutal nas Ruínas de Tyrondir (ou o temível <em>uyzrrak da’ukthra</em>, veja <em>Ameaças de Arton</em>, p. 403). Forjado em ferro negro goblinóide com runas de combate duyshidakk.</p><p>Trata-se de um machado de guerra <strong>aumentado</strong> (dano base 3d6 corte), <strong>atroz</strong> (margem de ameaça 19/x3) e <strong>formidável</strong> (+2 em testes de ataque e rolagens de dano).</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effMachado01230A',
        name: 'Formidável (+2 Ataque e Dano)',
        icon: 'systems/tormenta20/icons/armas/machado-de-guerra.webp',
        changes: [
          { key: 'system.attributes.ataque.bonus', mode: 2, value: '2', priority: 20 },
          { key: 'system.attributes.dano.bonus', mode: 2, value: '2', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            attack: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 4. ARMA: KUM’SHRAK EVISCERADOR
  // =========================================================================
  {
    name: 'Kum’shrak Eviscerador',
    type: 'arma',
    img: 'systems/tormenta20/icons/armas/foice.webp',
    folder: FOLDER_ARMAS,
    system: {
      type: 'arma',
      tipo: 'exotica',
      empunhadura: 'umaMão',
      dano: '1d8',
      critico: {
        margem: 19,
        multiplicador: 3
      },
      tipoDano: 'corte',
      preco: 2500,
      espaco: 1,
      alcance: 'corpo-a-corpo',
      melhorias: ['certeira', 'cruel'],
      descricao: '<p>Arma de combate exótica tradicional da cultura hobgoblin duyshidakk (veja <em>Guia de NPCs</em>, p. 36), empunhada pelo assassino Arzak. Sua lâmina curvada serrilhada possui ganchos internos feitos para abrir ferimentos grotescos.</p><p>Dano <strong>1d8 corte</strong> com margem de ameaça <strong>19/x3</strong>. Ao atingir um ataque crítico ou causar dano com Ataque Furtivo, o alvo fica sob a condição <strong>sangrando</strong> (perde 1d6 pontos de vida por rodada até ser estabilizado).</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effKumshrak01230',
        name: 'Gume Eviscerador (Sangramento)',
        icon: 'systems/tormenta20/icons/armas/foice.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            attack: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 5. CONSUMÍVEL: CENTELHA ONÍRICA
  // =========================================================================
  {
    name: 'Centelha Onírica',
    type: 'consumivel',
    img: 'systems/tormenta20/icons/itens/magicos/pedra-alma.webp',
    folder: FOLDER_CONSUMIVEL,
    system: {
      type: 'consumivel',
      tipo: 'alquimico',
      subtipo: 'outro',
      preco: 4000,
      espaco: 1,
      descricao: '<p>Um núcleo luminescente pulsante de energia onírica condensada, extraído da carcaça biomecânica de um Mestre do Pesadelo (requer teste de Misticismo ou Cura CD 30).</p><p>Se absorvida por uma criatura consciente durante um repouso pleno, a centelha se funde à sua mente, permitindo-lhe <strong>lançar uma magia de ilusão de até 2º círculo</strong> à sua escolha (atributo-chave Carisma), pagando o custo normal de mana.</p>',
      source: SOURCE_DB230
    },
    effects: []
  },

  // =========================================================================
  // 6. PODER ONÍRICO: SONHO RESGATADO: SONHO DE AMOR
  // =========================================================================
  {
    name: 'Sonho Resgatado: Sonho de Amor',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos/cura.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      subtipo: 'destino',
      tags: ['onirico', 'sonho', 'amor'],
      descricao: '<p>Você sonhava em ser amado — conquistar um grande amor ou receber a aprovação e admiração sincera de sua comunidade. Após ter este sonho roubado e enfrentado o pesadelo da solidão, você resgatou o que havia sido perdido.</p><p>Ao relembrar e resgatar seu sonho de amor, você recebe uma fração de seu poder transcendental: seu limite máximo de pontos de mana aumenta em <strong>+1 PM a cada dois níveis</strong> de personagem.</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effSonhoAmor0123',
        name: 'Força do Amor (+1 PM a cada 2 níveis)',
        icon: 'systems/tormenta20/icons/poderes/concedidos/cura.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            power: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 8. PODER ONÍRICO: SONHO RESGATADO: SONHO DE APRENDIZADO
  // =========================================================================
  {
    name: 'Sonho Resgatado: Sonho de Aprendizado',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos/conhecimento.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      subtipo: 'destino',
      tags: ['onirico', 'sonho', 'aprendizado'],
      descricao: '<p>Você sonhava em dominar uma nova arte, ofício ou técnica refinada de combate. Tendo superado os pesadelos de incompetência semeados pelo Coletor do Pesadelo, você reencontrou a confiança em seu potencial.</p><p>Ao resgatar seu sonho, você recebe um bônus permanente de <strong>+2 em três perícias</strong> à sua escolha nas quais seja treinado.</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effSonhoApr01230',
        name: 'Domínio Onírico (+2 em Perícias)',
        icon: 'systems/tormenta20/icons/poderes/concedidos/conhecimento.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            power: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 9. PODER ONÍRICO: SONHO RESGATADO: SONHO DE DESTRUIÇÃO
  // =========================================================================
  {
    name: 'Sonho Resgatado: Sonho de Destruição',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos/destruicao.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      subtipo: 'destino',
      tags: ['onirico', 'sonho', 'destruição'],
      descricao: '<p>Você sonhava em destruir algo ou alguém — eliminar um grande vilão, esmagar uma relíquia amaldiçoada ou vingar um povo massacrado. Resgatando esse objetivo das forjas do Reino dos Pesadelos, a chama de sua determinação arde sem limites.</p><p>Ao resgatar o sonho de destruição, você recebe um bônus permanente de <strong>+1 PV por nível</strong> de personagem.</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effSonhoDes01230',
        name: 'Determinação Resoluta (+1 PV por Nível)',
        icon: 'systems/tormenta20/icons/poderes/concedidos/destruicao.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            power: true
          }
        }
      }
    ]
  },

  // =========================================================================
  // 10. CONDIÇÃO ONÍRICA: PESADELO ONÍRICO: SONHO PERDIDO
  // =========================================================================
  {
    name: 'Pesadelo Onírico: Sonho Perdido',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      subtipo: 'desvantagem',
      tags: ['onirico', 'maldicao', 'pesadelo'],
      descricao: '<p>Penalidade nefasta sofrida por uma criatura que teve seu maior sonho roubado por um <em>Coletor do Pesadelo</em>. A vítima perde o interesse no objeto de seu anseio e é atormentada por terrores noturnos constantes.</p><p>Conforme o tipo de sonho drenado:</p><ul><li><strong>Amor:</strong> Seu total de PM diminui em um valor igual ao seu nível.</li><li><strong>Aprendizado:</strong> Você sofre –2 em três perícias treinadas.</li><li><strong>Destruição:</strong> Seu total de PV diminui em um valor igual ao seu nível.</li><li><strong>Nenhum Sonho:</strong> A recuperação natural de PV e PM diminui em um passo.</li></ul><p>Pode ser removido com o resgate em aventura do sonho perdido ou pela magia <em>Purificação</em> (aprimoramento de quebra de maldição).</p>',
      source: SOURCE_DB230
    },
    effects: [
      {
        _id: 'effPesadPer01230',
        name: 'Pesadelos Recorrentes',
        icon: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
        changes: [],
        disabled: false,
        transfer: true,
        flags: {
          tormenta20: {
            self: true,
            power: true
          }
        }
      }
    ]
  }
];

async function injectItems() {
  console.log('=== Injetando Itens, Parceiros e Poderes da DB #230 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  const srcDir = path.join(__dirname, '..', 'src', 'packs', 'Itens_T20');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  let count = 0;
  for (const item of DB230_ITEMS) {
    if (DB230_ID_MAP[item.name]) {
      item._id = DB230_ID_MAP[item.name];
    }
    const key = `!items!${item._id}`;

    // Constrói os subdocumentos de efeitos no padrão canônico ClassicLevel
    const effectDocs = (item.effects || []).map(eff => {
      return {
        _id: eff._id,
        name: eff.name,
        flags: {
          tormenta20: {
            self: eff.flags?.tormenta20?.self !== undefined ? Boolean(eff.flags.tormenta20.self) : true,
            attack: Boolean(eff.flags?.tormenta20?.attack),
            skill: Boolean(eff.flags?.tormenta20?.skill),
            ability: Boolean(eff.flags?.tormenta20?.ability),
            power: Boolean(eff.flags?.tormenta20?.power),
            equipment: Boolean(eff.flags?.tormenta20?.equipment),
            spell: Boolean(eff.flags?.tormenta20?.spell),
            consumable: Boolean(eff.flags?.tormenta20?.consumable),
            ...(eff.flags?.tormenta20 || {})
          },
          ...(eff.flags || {})
        },
        duration: {
          rounds: eff.duration?.rounds || null,
          seconds: eff.duration?.seconds || null,
          startTime: null,
          turns: null,
          startRound: null,
          startTurn: null
        },
        disabled: Boolean(eff.disabled),
        origin: eff.origin || `Item.${item._id}`,
        tint: eff.tint || '#ffffff',
        transfer: eff.transfer !== undefined ? Boolean(eff.transfer) : true,
        changes: eff.changes || [],
        description: eff.description || `<p>Efeito concedido por ${item.name}.</p>`,
        statuses: eff.statuses || [],
        img: eff.icon || item.img
      };
    });

    // Limpa subdocumentos antigos de efeitos desse item no LevelDB
    for await (const [effK] of db.iterator({ gte: `!items.effects!${item._id}.`, lte: `!items.effects!${item._id}.\uffff` })) {
      await db.del(effK);
    }

    // Grava o item principal no LevelDB (effects contém array com os IDs dos efeitos)
    const descText = item.system.descricao || item.system.description?.value || '';
    const itemToStore = {
      ...item,
      system: {
        ...item.system,
        description: {
          value: descText,
          unidentified: ''
        }
      },
      effects: effectDocs.map(e => e._id)
    };

    await db.put(key, itemToStore);

    // Grava os subdocumentos de efeitos sob suas chaves ClassicLevel canônicas
    for (const effDoc of effectDocs) {
      await db.put(`!items.effects!${item._id}.${effDoc._id}`, effDoc);
    }

    // Grava espelhamento em src/packs/Itens_T20/ com _embedded para versionamento
    const embeddedSubdocs = effectDocs.map(eff => ({
      path: '!items.effects!',
      doc: eff
    }));
    saveToSourcePacks('Itens_T20', itemToStore, embeddedSubdocs);

    console.log(`✓ [${item._id}] ${item.name} (${item.type}) injetado com ${effectDocs.length} efeitos.`);
    count++;
  }

  await db.close();
  console.log(`\n✅ Sucesso: ${count} itens, parceiros e poderes da DB #230 injetados em Itens_T20 com conformidade estrita!`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('❌ Erro na injeção de itens DB #230:', err);
    process.exit(1);
  });
}

module.exports = { injectItems, DB230_ID_MAP };

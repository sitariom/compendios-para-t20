#!/usr/bin/env node
/**
 * Construtor Canônico e Mestre de Entradas para Compêndios Tormenta20
 *
 * Suporta a criação, preenchimento, validação e manipulação de:
 * - Atores (npc, hazard, character, simple, bases)
 * - Itens (poder, arma, equipamento/armadura/escudo, magia, consumivel)
 * - ActiveEffects (criação, ativação, modos de modificação e flags T20)
 * - Macros (script e chat)
 * - Tabelas de Rolagem (RollTable com resultados texto e compêndio)
 * - Diários de Bordo (JournalEntry e JournalEntryPages estilizadas)
 * - Playlists de Áudio (Playlist e PlaylistSound)
 */

const fs = require('fs');
const path = require('path');
const { resolveIcon, resolveToken } = require('./icon-resolver');

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function sanitizeFilename(name) {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 80);
}

function getTokenDimension(tamanho) {
  if (tamanho === 'grande' || tamanho === 'gra') return 2;
  if (tamanho === 'enorme' || tamanho === 'eno') return 3;
  if (tamanho === 'colossal' || tamanho === 'col') return 4;
  return 1;
}

/**
 * Constrói e padroniza um ActiveEffect do Foundry VTT para Tormenta20
 */
function buildActiveEffect({
  name = 'Novo Efeito',
  img = null,
  disabled = false,
  type = 'base',
  changes = [],
  duration = { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
  description = '',
  origin = null,
  transfer = true,
  statuses = [],
  flags = { tormenta20: { transfer: true } }
}) {
  const _id = generateId();
  return {
    _id,
    name,
    img: img || 'systems/tormenta20/icons/svg/skills.svg',
    disabled: Boolean(disabled),
    type,
    system: {},
    changes: changes.map(c => ({
      key: c.key,
      mode: c.mode !== undefined ? c.mode : 2, // 2 = ADD
      value: String(c.value),
      priority: c.priority !== undefined ? c.priority : null
    })),
    duration: {
      rounds: null,
      startTime: null,
      seconds: null,
      combat: null,
      turns: null,
      startRound: null,
      startTurn: null,
      ...duration
    },
    description: description || '',
    origin: origin || null,
    tint: '#ffffff',
    transfer: Boolean(transfer),
    statuses: statuses || [],
    flags: {
      tormenta20: { transfer: Boolean(transfer) },
      ...flags
    }
  };
}

/**
 * Constrói um item genérico ou poder de Tormenta20
 */
function buildItem({
  name,
  type = 'poder',
  img = null,
  description = '',
  folder = null,
  system = {},
  effects = []
}) {
  const _id = generateId();
  const finalImg = (!img || img === 'icons/svg/mystery-man.svg')
    ? resolveIcon({ name, type })
    : img;

  const baseDoc = {
    _id,
    name,
    type,
    img: finalImg,
    system: {
      description: {
        value: description.startsWith('<p>') ? description : `<p>${description}</p>`,
        unidentified: ''
      },
      ...system
    },
    effects: effects.map(eff => buildActiveEffect({
      ...eff,
      img: eff.img || finalImg,
      origin: eff.origin || `Item.${_id}`
    })),
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  return baseDoc;
}

/**
 * Constrói uma Arma (corpo a corpo ou à distância)
 */
function buildWeaponItem({
  name,
  img = null,
  description = '',
  empunhadura = 'uma', // 'uma', 'duas', 'leve'
  dano = '1d8',
  tipoDano = 'corte',
  criticoMargem = 20,
  criticoMultiplicador = 2,
  alcance = '',
  preco = 0,
  espacos = 1,
  propriedades = [],
  effects = [],
  folder = null
}) {
  return buildItem({
    name,
    type: 'arma',
    img,
    description,
    folder,
    effects,
    system: {
      empunhadura,
      dano,
      tipoDano,
      critico: {
        margem: Number(criticoMargem),
        multiplicador: Number(criticoMultiplicador)
      },
      alcance,
      preco: Number(preco),
      espacos: Number(espacos),
      propriedades: propriedades || []
    }
  });
}

/**
 * Constrói uma Armadura ou Escudo
 */
function buildArmorItem({
  name,
  isShield = false,
  img = null,
  description = '',
  defesa = 2,
  penalidade = 0,
  espacos = 1,
  preco = 0,
  effects = [],
  folder = null
}) {
  return buildItem({
    name,
    type: 'equipamento',
    img,
    description,
    folder,
    effects,
    system: {
      tipo: isShield ? 'escudo' : 'armadura',
      defesa: Number(defesa),
      penalidade: Number(penalidade),
      espacos: Number(espacos),
      preco: Number(preco)
    }
  });
}

/**
 * Constrói uma Magia de Tormenta20
 */
function buildSpellItem({
  name,
  img = null,
  description = '',
  circulo = 1,
  tipo = 'arcana', // 'arcana', 'divina', 'universal'
  escola = 'evocacao',
  execucao = 'padrao',
  alcance = 'curto',
  alvo = '',
  area = '',
  duracao = 'instantanea',
  resistencia = '',
  aprimoramentos = [],
  effects = [],
  folder = null
}) {
  return buildItem({
    name,
    type: 'magia',
    img,
    description,
    folder,
    effects,
    system: {
      circulo: Number(circulo),
      tipo,
      escola,
      ativacao: {
        execucao,
        custo: Number(circulo) // 1 PM para 1º círculo, 3 para 2º, etc.
      },
      alcance,
      alvo,
      area,
      duracao,
      resistencia,
      aprimoramentos: aprimoramentos || []
    }
  });
}

/**
 * Constrói um ator / ameaça (NPC) de Tormenta20 com padrão canônico rigoroso
 */
function buildNpcActor({
  name,
  type = 'npc',
  img = null,
  biography = '',
  folder = null,
  nd = '1',
  papel = 'padrao', // 'solo', 'lacaio', 'padrao'
  tipoMonstro = 'monstro',
  tamanho = 'medio',
  deslocamento = '9m (6q)',
  atributos = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
  attributes = {
    pv: { value: 50, max: 50 },
    pm: { value: 0, max: 0 },
    defesa: { value: 15 }
  },
  resistencias = {},
  pericias = {},
  items = [],
  effects = []
}) {
  const _id = generateId();
  const finalImg = (!img || img === 'icons/svg/mystery-man.svg')
    ? resolveIcon({ name, type: 'npc' })
    : img;

  // A única fonte de tokens de atores é exclusivamente 2-Minute Tabletop
  const tokenSrc = resolveToken({ name });
  const tokenDim = getTokenDimension(tamanho);

  // Cálculo canônico da Defesa Base no Foundry: valor_ficha - destreza
  const desMod = atributos.des ?? 0;
  const defVal = attributes.defesa?.value ?? 15;
  const defBase = attributes.defesa?.base !== undefined
    ? attributes.defesa.base
    : (defVal - desMod);

  const actorDoc = {
    _id,
    name,
    type,
    img: finalImg,
    prototypeToken: {
      name,
      texture: {
        src: tokenSrc
      },
      width: tokenDim,
      height: tokenDim
    },
    system: {
      detalhes: {
        biography: { value: biography.startsWith('<p>') ? biography : `<p>${biography}</p>`, public: '' },
        nd: String(nd),
        papel,
        tipo: tipoMonstro,
        tamanho
      },
      atributos: {
        for: { value: atributos.for ?? 0 },
        des: { value: desMod },
        con: { value: atributos.con ?? 0 },
        int: { value: atributos.int ?? 0 },
        sab: { value: atributos.sab ?? 0 },
        car: { value: atributos.car ?? 0 }
      },
      attributes: {
        pv: { value: attributes.pv?.value ?? 50, max: attributes.pv?.max ?? 50 },
        pm: { value: attributes.pm?.value ?? 0, max: attributes.pm?.max ?? 0 },
        defesa: { value: defVal, base: defBase },
        sentidos: {
          visaoNoEscuro: true
        },
        movimento: {
          terrestre: {
            value: parseInt(deslocamento, 10) || 9
          }
        }
      },
      tracos: {
        resistencias: resistencias.danos || {},
        ic: resistencias.condicoes || [],
        idiomas: resistencias.idiomas || ['Nenhum'],
        tamanho: tamanho.slice(0, 3)
      },
      pericias: pericias || {}
    },
    items: [],
    effects: [],
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  const embeddedDocs = [];

  // Adiciona itens embutidos (armas, poderes, magias)
  for (const item of items) {
    const itemDoc = buildItem({ ...item });
    itemDoc._id = generateId();
    actorDoc.items.push(itemDoc);

    embeddedDocs.push({
      key: `!actors.items!${_id}.${itemDoc._id}`,
      typePath: '!actors.items!',
      doc: itemDoc
    });

    if (itemDoc.effects && itemDoc.effects.length > 0) {
      for (const eff of itemDoc.effects) {
        embeddedDocs.push({
          key: `!actors.items.effects!${_id}.${itemDoc._id}.${eff._id}`,
          typePath: '!actors.items.effects!',
          doc: eff
        });
      }
    }
  }

  // Efeitos diretos do ator
  for (const eff of effects) {
    const effDoc = buildActiveEffect({
      ...eff,
      img: eff.img || finalImg,
      origin: eff.origin || `Actor.${_id}`
    });
    actorDoc.effects.push(effDoc);
    embeddedDocs.push({
      key: `!actors.effects!${_id}.${effDoc._id}`,
      typePath: '!actors.effects!',
      doc: effDoc
    });
  }

  return {
    actorDoc,
    embeddedDocs
  };
}

/**
 * Constrói um Perigo Complexo (Hazard)
 */
function buildHazardActor({
  name,
  nd = '1',
  img = null,
  goal = '',
  effects = '',
  actions = '',
  folder = null
}) {
  const _id = generateId();
  const finalImg = img || resolveIcon({ name, type: 'npc' });
  const tokenSrc = resolveToken({ name });

  const actorDoc = {
    _id,
    name,
    type: 'hazard',
    img: finalImg,
    system: {
      attributes: {
        nd: String(nd)
      },
      detalhes: {
        goal: goal.startsWith('<p>') ? goal : `<p>${goal}</p>`,
        effects: effects.startsWith('<p>') ? effects : `<p>${effects}</p>`,
        actions: actions.startsWith('<') ? actions : `<ul>${actions}</ul>`
      }
    },
    prototypeToken: {
      name,
      texture: { src: tokenSrc },
      width: 1,
      height: 1
    },
    effects: [],
    items: [],
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  return {
    actorDoc,
    embeddedDocs: []
  };
}

/**
 * Constrói um Personagem Jogador (PC / Character)
 */
function buildCharacterActor({
  name,
  img = null,
  nivel = 1,
  raca = '',
  classe = '',
  origem = '',
  divindade = '',
  atributos = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
  attributes = { pv: { value: 20, max: 20 }, pm: { value: 10, max: 10 }, defesa: { value: 10 } },
  pericias = {},
  items = [],
  effects = [],
  folder = null
}) {
  const _id = generateId();
  const finalImg = img || 'systems/tormenta20/icons/svg/portrait.svg';
  const tokenSrc = resolveToken({ name });

  const actorDoc = {
    _id,
    name,
    type: 'character',
    img: finalImg,
    prototypeToken: {
      name,
      texture: { src: tokenSrc },
      width: 1,
      height: 1
    },
    system: {
      detalhes: {
        nivel: { value: Number(nivel) },
        raca,
        classe,
        origem,
        divindade,
        biography: { value: '', public: '' }
      },
      atributos: {
        for: { value: atributos.for ?? 0 },
        des: { value: atributos.des ?? 0 },
        con: { value: atributos.con ?? 0 },
        int: { value: atributos.int ?? 0 },
        sab: { value: atributos.sab ?? 0 },
        car: { value: atributos.car ?? 0 }
      },
      attributes: {
        pv: { value: attributes.pv?.value ?? 20, max: attributes.pv?.max ?? 20 },
        pm: { value: attributes.pm?.value ?? 10, max: attributes.pm?.max ?? 10 },
        defesa: { value: attributes.defesa?.value ?? 10 }
      },
      pericias: pericias || {}
    },
    items: [],
    effects: [],
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  const embeddedDocs = [];

  for (const it of items) {
    const itemDoc = buildItem({ ...it });
    actorDoc.items.push(itemDoc);
    embeddedDocs.push({
      key: `!actors.items!${_id}.${itemDoc._id}`,
      typePath: '!actors.items!',
      doc: itemDoc
    });
  }

  for (const eff of effects) {
    const effDoc = buildActiveEffect({
      ...eff,
      img: eff.img || finalImg,
      origin: eff.origin || `Actor.${_id}`
    });
    actorDoc.effects.push(effDoc);
    embeddedDocs.push({
      key: `!actors.effects!${_id}.${effDoc._id}`,
      typePath: '!actors.effects!',
      doc: effDoc
    });
  }

  return { actorDoc, embeddedDocs };
}

/**
 * Constrói uma Macro de automação
 */
function buildMacro({
  name,
  type = 'script', // 'script' ou 'chat'
  command = '',
  img = 'systems/tormenta20/icons/svg/skills.svg',
  scope = 'global',
  author = null,
  folder = null
}) {
  const _id = generateId();
  return {
    _id,
    name,
    type,
    command,
    img,
    scope,
    author: author || null,
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

/**
 * Constrói uma Tabela de Rolagem (RollTable)
 */
function buildRollTable({
  name,
  formula = '1d100',
  description = '',
  img = 'systems/tormenta20/icons/svg/skills.svg',
  replacement = true,
  displayRoll = true,
  results = [],
  folder = null
}) {
  const _id = generateId();
  const formattedResults = results.map(r => ({
    _id: generateId(),
    type: r.type !== undefined ? r.type : 0, // 0 = Text, 1 = Document, 2 = Compendium
    text: r.text || '',
    img: r.img || 'icons/svg/d20-black.svg',
    documentCollection: r.documentCollection || null,
    documentId: r.documentId || null,
    weight: r.weight !== undefined ? r.weight : 1,
    range: r.range || [1, 1],
    drawn: false,
    flags: {}
  }));

  return {
    _id,
    name,
    img,
    description: description.startsWith('<p>') ? description : `<p>${description}</p>`,
    results: formattedResults,
    formula,
    replacement: Boolean(replacement),
    displayRoll: Boolean(displayRoll),
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

/**
 * Constrói um Diário de Bordo / Aventura (JournalEntry)
 */
function buildJournalEntry({
  name,
  pages = [], // [{ title, text, type: 'text' }]
  folder = null
}) {
  const _id = generateId();
  const formattedPages = pages.map((p, idx) => ({
    _id: generateId(),
    name: p.title || `Página ${idx + 1}`,
    type: p.type || 'text',
    text: {
      content: p.text.startsWith('<') ? p.text : `<p>${p.text}</p>`,
      format: 1
    },
    src: null,
    image: {},
    video: {},
    system: {},
    sort: idx * 100000,
    ownership: { default: -1 },
    flags: {}
  }));

  return {
    _id,
    name,
    pages: formattedPages,
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

/**
 * Constrói uma Playlist de Áudio
 */
function buildPlaylist({
  name,
  mode = 0, // 0 = sequential, 1 = shuffle, 2 = simultaneous, 3 = soundboard
  sounds = [], // [{ name, path, volume: 0.8, repeat: false }]
  fade = 1000,
  folder = null
}) {
  const _id = generateId();
  const formattedSounds = sounds.map(s => ({
    _id: generateId(),
    name: s.name,
    path: s.path,
    playing: false,
    pausedTime: null,
    volume: s.volume !== undefined ? s.volume : 0.8,
    fade: Number(fade),
    repeat: Boolean(s.repeat),
    flags: {}
  }));

  return {
    _id,
    name,
    sounds: formattedSounds,
    mode: Number(mode),
    playing: false,
    fade: Number(fade),
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };
}

/**
 * Salva um documento construído diretamente na árvore src/packs/
 */
function saveToSourcePacks(packName, doc, embeddedDocs = []) {
  const targetDir = path.join('src', 'packs', packName);
  fs.mkdirSync(targetDir, { recursive: true });

  const filename = `${sanitizeFilename(doc.name || 'document')}_${doc._id}.json`;
  const collectionMap = {
    Ameacas_T20: 'actors',
    Itens_T20: 'items',
    Macros_T20: 'macros',
    Tabelas_T20: 'tables',
    Diarios_T20: 'journal',
    Playlist_T20: 'playlists'
  };
  const collection = collectionMap[packName] || 'documents';
  const fileData = {
    _dbKey: `!${collection}!${doc._id}`,
    ...doc
  };

  if (embeddedDocs && embeddedDocs.length > 0) {
    fileData._embedded = embeddedDocs;
  }

  const outPath = path.join(targetDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(fileData, null, 2), 'utf8');
  console.log(`✅ Salvo em ${outPath}`);
  return outPath;
}

module.exports = {
  generateId,
  getTokenDimension,
  buildActiveEffect,
  buildItem,
  buildWeaponItem,
  buildArmorItem,
  buildSpellItem,
  buildNpcActor,
  buildHazardActor,
  buildCharacterActor,
  buildMacro,
  buildRollTable,
  buildJournalEntry,
  buildPlaylist,
  saveToSourcePacks
};

if (require.main === module) {
  console.log('Módulo mestre de criação de entradas T20 carregado com sucesso.');
}

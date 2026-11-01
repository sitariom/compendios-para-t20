#!/usr/bin/env node
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
 * Constrói um item de Tormenta20 em conformidade com o sistema e as macros do autor
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
    effects: effects.map(eff => ({
      _id: generateId(),
      name: eff.name || `${name} - Efeito`,
      img: eff.img || finalImg,
      disabled: eff.disabled !== undefined ? eff.disabled : false,
      type: eff.type || 'base',
      system: eff.system || {},
      changes: eff.changes || [],
      duration: eff.duration || { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
      description: eff.description || '',
      origin: eff.origin || `Item.${_id}`,
      tint: '#ffffff',
      transfer: eff.transfer !== undefined ? eff.transfer : true,
      statuses: eff.statuses || [],
      flags: eff.flags || { tormenta20: { transfer: true } }
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
 * Constrói um ator / ameaça (NPC) de Tormenta20
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
        des: { value: atributos.des ?? 0 },
        con: { value: atributos.con ?? 0 },
        int: { value: atributos.int ?? 0 },
        sab: { value: atributos.sab ?? 0 },
        car: { value: atributos.car ?? 0 }
      },
      attributes: {
        pv: { value: attributes.pv?.value ?? 50, max: attributes.pv?.max ?? 50 },
        pm: { value: attributes.pm?.value ?? 0, max: attributes.pm?.max ?? 0 },
        defesa: { value: attributes.defesa?.value ?? 15 },
        sentidos: {
          visaoNoEscuro: true
        },
        movimento: {
          terrestre: {
            value: parseInt(deslocamento, 10) || 9
          }
        }
      },
      resistencia: {
        danos: resistencias.danos || {},
        condicoes: resistencias.condicoes || {}
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

    // Se o item embutido tem efeitos
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
    const effDoc = {
      _id: generateId(),
      name: eff.name || `${name} - Efeito`,
      img: eff.img || finalImg,
      disabled: eff.disabled !== undefined ? eff.disabled : false,
      type: eff.type || 'base',
      system: eff.system || {},
      changes: eff.changes || [],
      duration: eff.duration || {},
      description: eff.description || '',
      origin: eff.origin || `Actor.${_id}`,
      transfer: eff.transfer !== undefined ? eff.transfer : false,
      statuses: eff.statuses || [],
      flags: eff.flags || {}
    };
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
  buildItem,
  buildNpcActor,
  saveToSourcePacks
};

if (require.main === module) {
  console.log('Módulo de criação de entradas T20 carregado com sucesso.');
}

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

const ALL_SKILLS = [
  { key: 'acro', nome: 'Acrobacia', atributo: 'des', st: false, pda: true },
  { key: 'ades', nome: 'Adestramento', atributo: 'car', st: false, pda: false },
  { key: 'atle', nome: 'Atletismo', atributo: 'for', st: false, pda: false },
  { key: 'atua', nome: 'Atuação', atributo: 'car', st: false, pda: false },
  { key: 'cava', nome: 'Cavalgar', atributo: 'des', st: false, pda: false },
  { key: 'conh', nome: 'Conhecimento', atributo: 'int', st: false, pda: false },
  { key: 'cura', nome: 'Cura', atributo: 'sab', st: false, pda: false },
  { key: 'dipl', nome: 'Diplomacia', atributo: 'car', st: false, pda: false },
  { key: 'enga', nome: 'Enganação', atributo: 'car', st: false, pda: false },
  { key: 'fort', nome: 'Fortitude', atributo: 'con', st: true, pda: false },
  { key: 'furt', nome: 'Furtividade', atributo: 'des', st: false, pda: true },
  { key: 'guer', nome: 'Guerra', atributo: 'int', st: false, pda: false },
  { key: 'inic', nome: 'Iniciativa', atributo: 'des', st: false, pda: false },
  { key: 'inti', nome: 'Intimidação', atributo: 'car', st: false, pda: false },
  { key: 'intu', nome: 'Intuição', atributo: 'sab', st: false, pda: false },
  { key: 'inve', nome: 'Investigação', atributo: 'int', st: false, pda: false },
  { key: 'joga', nome: 'Jogatina', atributo: 'car', st: false, pda: false },
  { key: 'ladi', nome: 'Ladinagem', atributo: 'des', st: false, pda: true },
  { key: 'luta', nome: 'Luta', atributo: 'for', st: false, pda: false },
  { key: 'mist', nome: 'Misticismo', atributo: 'int', st: false, pda: false },
  { key: 'nobr', nome: 'Nobreza', atributo: 'car', st: false, pda: false },
  { key: 'perc', nome: 'Percepção', atributo: 'sab', st: false, pda: false },
  { key: 'pilo', nome: 'Pilotagem', atributo: 'des', st: false, pda: false },
  { key: 'pont', nome: 'Pontaria', atributo: 'des', st: false, pda: false },
  { key: 'refl', nome: 'Reflexos', atributo: 'des', st: true, pda: false },
  { key: 'reli', nome: 'Religião', atributo: 'sab', st: false, pda: false },
  { key: 'sobr', nome: 'Sobrevivência', atributo: 'sab', st: false, pda: false },
  { key: 'vont', nome: 'Vontade', atributo: 'sab', st: true, pda: false },
  { key: 'alfa', nome: 'Ofício (Alfaiate)', atributo: 'int', st: false, pda: false },
  { key: 'alqu', nome: 'Ofício (Alquimia)', atributo: 'int', st: false, pda: false },
  { key: 'arme', nome: 'Ofício (Armeiro)', atributo: 'int', st: false, pda: false },
  { key: 'arte', nome: 'Ofício (Artesão)', atributo: 'int', st: false, pda: false },
  { key: 'cozi', nome: 'Ofício (Culinária)', atributo: 'int', st: false, pda: false },
  { key: 'enge', nome: 'Ofício (Engenharia)', atributo: 'int', st: false, pda: false }
];

function buildSkills(ndNum, atributos, trainedSkills = {}) {
  const meionivel = Math.floor(ndNum / 2);
  let treino = 2;
  if (ndNum >= 15) {
    treino = 6;
  } else if (ndNum >= 7) {
    treino = 4;
  }
  const pericias = {};

  for (const s of ALL_SKILLS) {
    const atrMod = atributos[s.atributo] || 0;
    const isTrained = trainedSkills[s.key] !== undefined || s.key === 'inic' || s.key === 'perc';

    if (isTrained) {
      const fichaVal = trainedSkills[s.key] === undefined ? (meionivel + atrMod + treino) : trainedSkills[s.key];
      const val = fichaVal - meionivel - atrMod - treino;
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: true,
        st: Boolean(s.st),
        pda: Boolean(s.pda),
        size: false,
        value: val,
        outros: val,
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    } else {
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: false,
        st: Boolean(s.st),
        pda: Boolean(s.pda),
        size: false,
        value: 0,
        outros: 0,
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    }
  }
  return pericias;
}

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

function buildTracos({
  tamanho = 'med',
  resistencias = {},
  imunidadesDano = [],
  vulnerabilidadesDano = [],
  icValue = [],
  icCustom = '',
  idiomasValue = [],
  idiomasCustom = ''
}) {
  const damageTypes = [
    'dano', 'perda', 'acido', 'corte', 'eletricidade',
    'essencia', 'fogo', 'frio', 'impacto', 'luz',
    'psiquico', 'perfuracao', 'trevas'
  ];

  const resObj = {};
  for (const dt of damageTypes) {
    const val = resistencias[dt] || 0;
    resObj[dt] = {
      value: val,
      base: val,
      bonus: [],
      excecao: 0,
      imunidade: imunidadesDano.includes(dt),
      vulnerabilidade: vulnerabilidadesDano.includes(dt),
      danoPorDado: false
    };
  }

  return {
    tamanho,
    resistencias: resObj,
    ic: {
      value: icValue,
      custom: icCustom
    },
    idiomas: {
      value: idiomasValue,
      custom: idiomasCustom
    },
    profArmaduras: {
      value: [],
      custom: ''
    },
    profArmas: {
      value: [],
      custom: ''
    }
  };
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
  id = null,
  name = 'Novo Efeito',
  img = null,
  disabled = false,
  type = 'base',
  changes = [],
  duration = { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
  description = '',
  origin = '',
  transfer = true,
  statuses = [],
  flags = {}
}) {
  const _id = id || generateId();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'effect';
  return {
    _id,
    name,
    img: img || 'systems/tormenta20/icons/svg/skills.svg',
    disabled: Boolean(disabled),
    type,
    system: {
      identifier: slug,
      targets: ['self'],
      status: null,
      onuse: Boolean(flags.tormenta20?.onuse),
      abilityUse: {
        description: description || name,
        automatic: false,
        aumenta: false,
        custo: flags.tormenta20?.custo !== undefined ? flags.tormenta20.custo : null,
        names: [],
        types: ['self']
      },
      aura: {
        isAura: false,
        range: 0,
        behaviors: null
      },
      upgrade: {
        type: null,
        itemType: []
      }
    },
    changes: changes.map(c => ({
      key: c.key,
      mode: c.mode !== undefined ? c.mode : 2, // 2 = ADD
      value: String(c.value),
      priority: c.priority !== undefined ? c.priority : 20
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
    origin: origin || '',
    tint: '#ffffff',
    transfer: Boolean(transfer),
    statuses: statuses || [],
    sort: 0,
    flags: {
      tormenta20: {
        onuse: false,
        durationScene: false,
        self: true,
        attack: false,
        skill: false,
        ability: false,
        power: false,
        equipment: false,
        spell: false,
        consumable: false,
        items: '',
        aumenta: false,
        custo: null,
        transfer: Boolean(transfer),
        ...(flags.tormenta20 || {})
      },
      ...flags
    },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      exportSource: null,
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
 * Constrói um item genérico ou poder de Tormenta20 com schema completo
 */
function buildItem({
  name,
  type = 'poder',
  img = null,
  description = '',
  folder = null,
  system = {},
  rolls = null,
  effects = []
}) {
  const _id = generateId();
  const finalImg = (!img || img === 'icons/svg/mystery-man.svg')
    ? resolveIcon({ name, type })
    : img;

  const descVal = description.startsWith('<p>') || description.startsWith('<blockquote')
    ? description
    : `<p>${description}</p>`;

  let finalRolls = [];
  if (Array.isArray(rolls)) {
    finalRolls = rolls;
  } else if (Array.isArray(system.rolls)) {
    finalRolls = system.rolls;
  }

  const baseDoc = {
    _id,
    name,
    type,
    img: finalImg,
    system: {
      description: {
        value: descVal,
        unidentified: ''
      },
      source: system.source || 'Tormenta20',
      carregado: system.carregado !== undefined ? Boolean(system.carregado) : true,
      peso: Number(system.peso || 0),
      espacos: Number(system.espacos || 0),
      qtd: Number(system.qtd || 1),
      preco: Number(system.preco || 0),
      pv: {
        value: system.pv?.value || 0,
        min: 0,
        max: system.pv?.max || 0
      },
      rd: Number(system.rd || 0),
      equipado: system.equipado !== undefined ? Boolean(system.equipado) : true,
      equipado2: {
        slot: system.equipado2?.slot || 0,
        type: system.equipado2?.type || ''
      },
      ativacao: {
        execucao: system.ativacao?.execucao || 'padrao',
        custo: Number(system.ativacao?.custo || 0),
        qtd: system.ativacao?.qtd || '',
        condicao: system.ativacao?.condicao || '',
        special: system.ativacao?.special || ''
      },
      duracao: {
        value: Number(system.duracao?.value || 0),
        units: system.duracao?.units || '',
        special: system.duracao?.special || ''
      },
      target: {
        value: Number(system.target?.value || 0),
        width: Number(system.target?.width || 0),
        type: system.target?.type || ''
      },
      range: {
        value: Number(system.range?.value || 0),
        units: system.range?.units || ''
      },
      consume: {
        type: system.consume?.type || '',
        target: system.consume?.target || '',
        amount: Number(system.consume?.amount || 0),
        mpMultiplier: Boolean(system.consume?.mpMultiplier)
      },
      efeito: system.efeito || '',
      alcance: system.alcance || '',
      alvo: system.alvo || '',
      area: system.area || '',
      resistencia: {
        pericia: system.resistencia?.pericia || '',
        atributo: system.resistencia?.atributo || '',
        bonus: Number(system.resistencia?.bonus || 0),
        txt: system.resistencia?.txt || ''
      },
      origin: system.origin || '',
      tags: Array.isArray(system.tags) ? system.tags : [],
      chatFlavor: system.chatFlavor || (description.includes('blockquote') ? description.slice(0, 300) : `<p>${name}</p>`),
      chatGif: system.chatGif || '',
      rolltags: Array.isArray(system.rolltags) ? system.rolltags : [],
      upgrades: {
        melhoria1: '',
        melhoria2: '',
        melhoria3: '',
        melhoria4: '',
        material: '',
        encanto1: '',
        encanto2: '',
        encanto3: '',
        ...(system.upgrades || {})
      },
      melhorias: system.melhorias || {},
      encantos: system.encantos || {},
      rolls: finalRolls,
      effects: effects.map(eff => buildActiveEffect({
        ...eff,
        img: eff.img || finalImg,
        origin: eff.origin || ''
      })),
      ...system
    },
    effects: effects.map(eff => buildActiveEffect({
      ...eff,
      img: eff.img || finalImg,
      origin: eff.origin || ''
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
 * Constrói um ataque embutido de criatura (arma natural ou manufaturada)
 */
function buildWeaponAttack({
  name,
  img = null,
  dano = '1d8',
  tipoDano = 'corte',
  danoExtra = null,
  tipoDanoExtra = '',
  periciaAtaque = 'luta',
  criticoMargem = 20,
  criticoMultiplicador = 2,
  alcance = '',
  empunhadura = 'uma',
  proficiencia = 'natural',
  proposito = 'corpo-a-corpo',
  size = 'normal',
  ataques = 1,
  description = '',
  flavorPhrase = '',
  flavorAction = '',
  effects = [],
  rolls = null
}) {
  const finalImg = img || resolveIcon({ name, type: 'arma' });
  const critM = Number(criticoMargem || 20);
  const critX = Number(criticoMultiplicador || 2);
  const pericia = alcance ? 'pont' : periciaAtaque;

  const defaultRolls = [
    {
      name: 'Ataque',
      key: 'ataque0',
      type: 'ataque',
      parts: [
        ['1d20', '', ''],
        [pericia, '', ''],
        ['', '', '']
      ],
      versatil: '',
      adaptavel: ''
    },
    {
      name: 'Dano',
      key: 'dano1',
      type: 'dano',
      parts: [
        [dano, tipoDano, '']
      ],
      versatil: '',
      adaptavel: ''
    }
  ];

  if (danoExtra) {
    defaultRolls.push({
      name: `Dano de ${tipoDanoExtra || 'Extra'}`,
      key: 'dano2',
      type: 'dano',
      parts: [
        [danoExtra, tipoDanoExtra, '']
      ],
      versatil: '',
      adaptavel: ''
    });
  }

  const chatFlavor = `<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${flavorPhrase || name + '!'}"</blockquote><p>${flavorAction || description}. <span style="color: #800000; font-weight: bold;">Golpe com ${name}!</span></p></div>`;

  return buildItem({
    name,
    type: 'arma',
    img: finalImg,
    description: description || `Ataque ${name} da criatura.`,
    effects,
    system: {
      tipo: proposito,
      empunhadura,
      proficiencia,
      dano,
      tipoDano,
      criticoM: critM,
      criticoX: critX,
      critico: { margem: critM, multiplicador: critX },
      ataques,
      tipoUso: 'sim',
      proposito,
      size,
      alcance,
      chatFlavor,
      propriedades: {
        ada: false, agi: false, alo: false, des: false, dup: false, ver: false, hib: false
      },
      rolls: rolls || defaultRolls
    }
  });
}

/**
 * Constrói um poder especial ou habilidade de criatura
 */
function buildSpecialPower({
  name,
  img = null,
  tipo = 'geral',
  subtipo = 'combate',
  execucao = 'padrao',
  custo = 0,
  cd = null,
  alcance = '',
  alvo = '',
  area = '',
  resistencia = null,
  description = '',
  flavorPhrase = '',
  flavorAction = '',
  rolls = [],
  effects = []
}) {
  const finalImg = img || resolveIcon({ name, type: 'poder' });
  const chatFlavor = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${flavorPhrase || name}"</blockquote><p>${flavorAction || description}. <span style="color: #800000; font-weight: bold;">Habilidade especial ativada!</span></p>`;

  return buildItem({
    name,
    type: 'poder',
    img: finalImg,
    description,
    effects,
    system: {
      tipo,
      subtipo,
      ativacao: {
        execucao,
        custo: Number(custo),
        qtd: '',
        condicao: '',
        special: ''
      },
      cd: cd ? Number(cd) : null,
      alcance,
      alvo,
      area,
      resistencia: resistencia || { pericia: '', atributo: '', bonus: 0, txt: '' },
      chatFlavor,
      rolls: Array.isArray(rolls) ? rolls : []
    }
  });
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
  rolls = null,
  chatFlavor = null,
  folder = null
}) {
  const critM = Number(criticoMargem || 20);
  const critX = Number(criticoMultiplicador || 2);
  const finalRolls = rolls || [
    {
      name: 'Ataque',
      key: 'ataque0',
      type: 'ataque',
      parts: [
        ['1d20', '', ''],
        [alcance ? 'pont' : 'luta', '', ''],
        [0, '', '']
      ],
      versatil: ''
    },
    {
      name: 'Dano',
      key: 'dano1',
      type: 'dano',
      parts: [
        [dano, tipoDano, ''],
        [alcance ? '' : 'for', '', '']
      ],
      versatil: ''
    }
  ];

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
      criticoM: critM,
      criticoX: critX,
      critico: {
        margem: critM,
        multiplicador: critX
      },
      alcance,
      preco: Number(preco),
      espacos: Number(espacos),
      propriedades: propriedades || [],
      rolls: finalRolls,
      chatFlavor: chatFlavor || `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${name}"</blockquote><p>Ataque com ${name}. <span style="color: #800000; font-weight: bold;">Disparo ou golpe!</span></p>`
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
      armadura: {
        value: Number(defesa),
        penalidade: Number(penalidade),
        maxAtr: isShield ? 0 : 4
      },
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
  rolls = [],
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
      aprimoramentos: aprimoramentos || [],
      rolls: Array.isArray(rolls) ? rolls : []
    }
  });
}

/**
 * Constrói um ator / ameaça (NPC) de Tormenta20 com padrão canônico rigoroso
 */
function buildNpcActor({
  id = null,
  name,
  type = 'npc',
  img = null,
  biography = '',
  folder = 'wfWApuyngzFm4KOP', // Pasta "Dragão Brasil" em Ameacas_T20
  nd = '1',
  papel = 'padrao', // 'solo', 'lacaio', 'padrao', 'special'
  tipoMonstro = 'mon',
  raca = '',
  tamanho = 'med',
  deslocamento = '9m (6q)',
  sentidos = 'visão no escuro',
  tesouro = 'Nenhum',
  disposition = -1,
  atributos = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
  attributes = {
    pv: { value: 50, max: 50 },
    pm: { value: 0, max: 0 },
    defesa: { value: 15 }
  },
  resistencias = {},
  pericias = {},
  items = [],
  effects = [],
  ataquescac = '',
  ataquesad = '',
  equipamento = ''
}) {
  const _id = id || generateId();
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

  const ndNum = Number(nd) || 1;
  const treino = ndNum >= 15 ? 6 : ndNum >= 7 ? 4 : 2;
  const meionivel = Math.floor(ndNum / 2);
  const cdVal = attributes.cd !== undefined
    ? Number(attributes.cd)
    : (10 + meionivel + Math.max(atributos.for || 0, atributos.des || 0, atributos.con || 0, atributos.int || 0, atributos.sab || 0, atributos.car || 0));

  const movStr = String(deslocamento || '9m (6q)');
  const walkVal = parseInt(movStr, 10) || 9;
  let burrowVal = 0;
  let climbVal = 0;
  let flyVal = 0;
  let swimVal = 0;
  if (movStr.includes('escavação') || movStr.includes('escavar')) {
    const m = movStr.match(/escavação\s+(\d+)m/i) || movStr.match(/escavar\s+(\d+)m/i);
    burrowVal = m ? parseInt(m[1], 10) : 6;
  }
  if (movStr.includes('escalada') || movStr.includes('escalar')) {
    const m = movStr.match(/escalada\s+(\d+)m/i) || movStr.match(/escalar\s+(\d+)m/i);
    climbVal = m ? parseInt(m[1], 10) : 6;
  }
  if (movStr.includes('voo') || movStr.includes('voar')) {
    const m = movStr.match(/voo\s+(\d+)m/i) || movStr.match(/voar\s+(\d+)m/i);
    flyVal = m ? parseInt(m[1], 10) : 12;
  }
  if (movStr.includes('natação') || movStr.includes('nadar')) {
    const m = movStr.match(/natação\s+(\d+)m/i) || movStr.match(/nadar\s+(\d+)m/i);
    swimVal = m ? parseInt(m[1], 10) : 9;
  }

  // Garante as 34 perícias preenchidas se objeto vazio for passado
  const finalPericias = Object.keys(pericias || {}).length >= 30
    ? pericias
    : buildSkills(ndNum, atributos, pericias);

  const finalTracos = (resistencias && resistencias.resistencias && typeof resistencias.resistencias === 'object')
    ? resistencias
    : buildTracos({
        tamanho: tamanho.slice(0, 3),
        resistencias: resistencias.danos || resistencias || {},
        imunidadesDano: resistencias.imunidadesDano || [],
        vulnerabilidadesDano: resistencias.vulnerabilidadesDano || [],
        icValue: resistencias.condicoes || [],
        icCustom: resistencias.icCustom || '',
        idiomasValue: resistencias.idiomas || ['comum'],
        idiomasCustom: resistencias.idiomasCustom || ''
      });

  const itemIds = [];
  const embeddedDocs = [];

  // Constrói e cataloga itens embutidos
  for (const item of items) {
    let itemDoc = item;
    if (!item._id) {
      if (item.type === 'arma') {
        itemDoc = buildWeaponAttack(item);
      } else if (item.type === 'poder') {
        itemDoc = buildSpecialPower(item);
      } else {
        itemDoc = buildItem(item);
      }
    }
    itemIds.push(itemDoc._id);

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

  let idiomasStr = 'Nenhum';
  if (typeof resistencias.idiomas === 'string') {
    idiomasStr = resistencias.idiomas;
  } else if (Array.isArray(resistencias.idiomas?.value) && resistencias.idiomas.value.length > 0) {
    idiomasStr = resistencias.idiomas.value.join(', ');
  } else if (Array.isArray(resistencias.idiomas) && resistencias.idiomas.length > 0) {
    idiomasStr = resistencias.idiomas.join(', ');
  }

  const actorDoc = {
    _id,
    name,
    type,
    img: finalImg,
    prototypeToken: {
      name,
      displayName: 30,
      actorLink: false,
      width: tokenDim,
      height: tokenDim,
      texture: {
        src: tokenSrc,
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        tint: null
      },
      sight: {
        enabled: true,
        range: 0,
        angle: 360,
        visionMode: 'darkvision',
        color: null,
        attenuation: 0.1,
        brightness: 0,
        saturation: 0,
        contrast: 0
      },
      disposition,
      displayBars: 40,
      bar1: { attribute: 'attributes.pv' },
      bar2: { attribute: 'attributes.pm' }
    },
    system: {
      atributos: {
        for: { value: atributos.for ?? 0, base: atributos.for ?? 0, racial: 0, bonus: 0 },
        des: { value: desMod, base: desMod, racial: 0, bonus: 0 },
        con: { value: atributos.con ?? 0, base: atributos.con ?? 0, racial: 0, bonus: 0 },
        int: { value: atributos.int ?? 0, base: atributos.int ?? 0, racial: 0, bonus: 0 },
        sab: { value: atributos.sab ?? 0, base: atributos.sab ?? 0, racial: 0, bonus: 0 },
        car: { value: atributos.car ?? 0, base: atributos.car ?? 0, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: cdVal,
        pv: {
          value: attributes.pv?.value ?? 50,
          temp: 0,
          min: 0,
          max: attributes.pv?.max ?? (attributes.pv?.value ?? 50)
        },
        pm: {
          value: attributes.pm?.value ?? 0,
          temp: 0,
          min: 0,
          max: attributes.pm?.max ?? (attributes.pm?.value ?? 0)
        },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: defVal,
          base: defBase,
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: {
          value: 0,
          atributo: 'for',
          base: 0,
          bonus: [],
          max: 0,
          pct: 0,
          encumbered: false,
          limit: 0
        },
        sentidos: {
          value: [],
          custom: sentidos || 'visão no escuro'
        },
        conjuracao: '',
        nivel: {
          value: ndNum,
          xp: { value: 0, pct: 0, proximo: 0 }
        },
        movement: {
          burrow: { base: burrowVal, bonus: [] },
          climb: { base: climbVal, bonus: [] },
          fly: { base: flyVal, bonus: [] },
          swim: { base: swimVal, bonus: [] },
          walk: { base: walkVal, bonus: [] },
          hover: false,
          unit: 'm',
          tags: []
        },
        treino,
        nd: String(nd),
        meionivel
      },
      pericias: finalPericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      tracos: finalTracos,
      detalhes: {
        biography: {
          value: biography.startsWith('<p>') || biography.startsWith('<blockquote') ? biography : `<p>${biography}</p>`,
          public: ''
        },
        origem: '',
        info: '',
        divindade: '',
        raca: raca || (tipoMonstro === 'ani' ? 'Animal' : tipoMonstro === 'hum' ? 'Humanoide' : tipoMonstro === 'mon' ? 'Monstro' : tipoMonstro === 'esp' ? 'Espírito' : 'Criatura'),
        tipo: tipoMonstro,
        tamanho: tamanho.slice(0, 3),
        equipamento: equipamento || '',
        resistencias: resistencias.txt || '',
        idiomas: idiomasStr,
        tesouro: tesouro || 'Nenhum',
        role: papel,
        ataquescac: ataquescac || '',
        movimento: movStr,
        ataquesad: ataquesad || ''
      }
    },
    items: itemIds, // Array de string IDs exatamente como DB 227 (Lynel e Oxxdon)
    effects: [],
    folder,
    sort: 80000000,
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
  ALL_SKILLS,
  buildSkills,
  buildTracos,
  buildActiveEffect,
  buildItem,
  buildWeaponAttack,
  buildSpecialPower,
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

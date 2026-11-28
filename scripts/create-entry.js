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
  { key: 'acro', nome: 'Acrobacia', atributo: 'des', st: false, pda: true, size: false },
  { key: 'ades', nome: 'Adestramento', atributo: 'car', st: true, pda: false, size: false },
  { key: 'atle', nome: 'Atletismo', atributo: 'for', st: false, pda: false, size: false },
  { key: 'atua', nome: 'Atuação', atributo: 'car', st: true, pda: false, size: false },
  { key: 'cava', nome: 'Cavalgar', atributo: 'des', st: false, pda: false, size: false },
  { key: 'conh', nome: 'Conhecimento', atributo: 'int', st: true, pda: false, size: false },
  { key: 'cura', nome: 'Cura', atributo: 'sab', st: false, pda: false, size: false },
  { key: 'dipl', nome: 'Diplomacia', atributo: 'car', st: false, pda: false, size: false },
  { key: 'enga', nome: 'Enganação', atributo: 'car', st: false, pda: false, size: false },
  { key: 'fort', nome: 'Fortitude', atributo: 'con', st: false, pda: false, size: false },
  { key: 'furt', nome: 'Furtividade', atributo: 'des', st: false, pda: true, size: true },
  { key: 'guer', nome: 'Guerra', atributo: 'int', st: true, pda: false, size: false },
  { key: 'inic', nome: 'Iniciativa', atributo: 'des', st: false, pda: false, size: false },
  { key: 'inti', nome: 'Intimidação', atributo: 'car', st: false, pda: false, size: false },
  { key: 'intu', nome: 'Intuição', atributo: 'sab', st: false, pda: false, size: false },
  { key: 'inve', nome: 'Investigação', atributo: 'int', st: false, pda: false, size: false },
  { key: 'joga', nome: 'Jogatina', atributo: 'car', st: true, pda: false, size: false },
  { key: 'ladi', nome: 'Ladinagem', atributo: 'des', st: true, pda: true, size: false },
  { key: 'luta', nome: 'Luta', atributo: 'for', st: false, pda: false, size: false },
  { key: 'mist', nome: 'Misticismo', atributo: 'int', st: true, pda: false, size: false },
  { key: 'nobr', nome: 'Nobreza', atributo: 'int', st: true, pda: false, size: false },
  { key: 'perc', nome: 'Percepção', atributo: 'sab', st: false, pda: false, size: false },
  { key: 'pilo', nome: 'Pilotagem', atributo: 'des', st: true, pda: false, size: false },
  { key: 'pont', nome: 'Pontaria', atributo: 'des', st: false, pda: false, size: false },
  { key: 'refl', nome: 'Reflexos', atributo: 'des', st: false, pda: false, size: false },
  { key: 'reli', nome: 'Religião', atributo: 'sab', st: true, pda: false, size: false },
  { key: 'sobr', nome: 'Sobrevivência', atributo: 'sab', st: false, pda: false, size: false },
  { key: 'vont', nome: 'Vontade', atributo: 'sab', st: false, pda: false, size: false },
  { key: 'alfa', nome: 'Ofício (Alfaiate)', atributo: 'int', st: true, pda: false, size: false },
  { key: 'alqu', nome: 'Ofício (Alquimia)', atributo: 'int', st: true, pda: false, size: false },
  { key: 'arme', nome: 'Ofício (Armeiro)', atributo: 'int', st: true, pda: false, size: false },
  { key: 'arte', nome: 'Ofício (Artesão)', atributo: 'int', st: true, pda: false, size: false },
  { key: 'cozi', nome: 'Ofício (Culinária)', atributo: 'int', st: true, pda: false, size: false },
  { key: 'enge', nome: 'Ofício (Engenharia)', atributo: 'int', st: true, pda: true, size: false }
];

function buildSkills(ndNum, atributos, trainedSkills = {}, situationalSkills = {}) {
  const meionivel = Math.floor(ndNum / 2);
  let treino = 2;
  if (ndNum >= 15) {
    treino = 6;
  } else if (ndNum >= 7) {
    treino = 4;
  }
  const pericias = {};

  const standardKeys = new Set(ALL_SKILLS.map(s => s.key));

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
        size: Boolean(s.size),
        value: Number(fichaVal),
        outros: Number(val),
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    } else {
      const untrainedVal = meionivel + atrMod;
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: false,
        st: Boolean(s.st),
        pda: Boolean(s.pda),
        size: Boolean(s.size),
        value: Number(untrainedVal),
        outros: 0,
        condi: 0,
        bonus: [],
        custom: false,
        label: s.nome,
        nome: s.nome
      };
    }
  }

  // Suporte canônico a perícias situacionais/customizadas (ex: furt_deserto)
  const allCustom = { ...situationalSkills };
  for (const [key, val] of Object.entries(trainedSkills)) {
    if (!standardKeys.has(key)) {
      allCustom[key] = val;
    }
  }

  for (const [key, sdata] of Object.entries(allCustom)) {
    if (typeof sdata === 'object' && sdata !== null) {
      pericias[key] = {
        atributo: sdata.atributo || 'des',
        treinado: sdata.treinado === undefined ? true : Boolean(sdata.treinado),
        st: Boolean(sdata.st),
        pda: Boolean(sdata.pda),
        size: Boolean(sdata.size),
        value: Number(sdata.value || 0),
        outros: Number(sdata.outros ?? (sdata.value || 0)),
        condi: 0,
        bonus: [],
        custom: true,
        label: sdata.label || key,
        nome: sdata.label || key
      };
    } else if (typeof sdata === 'number') {
      pericias[key] = {
        atributo: 'des',
        treinado: true,
        st: false,
        pda: false,
        size: false,
        value: sdata,
        outros: sdata,
        condi: 0,
        bonus: [],
        custom: true,
        label: key,
        nome: key
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
  imunidades = [],
  vulnerabilidades = [],
  ic = [],
  icValue = [],
  icCustom = '',
  idiomas = [],
  idiomasValue = [],
  idiomasCustom = '',
  rdGeral = 0,
  excecoes = {}
} = {}) {
  const damageTypes = [
    'dano', 'perda', 'acido', 'corte', 'eletricidade',
    'essencia', 'fogo', 'frio', 'impacto', 'luz',
    'psiquico', 'perfuracao', 'trevas'
  ];
  const dmgSet = new Set(damageTypes);

  const imuneDanoSet = new Set(imunidadesDano || []);
  const vulnDanoSet = new Set(vulnerabilidadesDano || []);
  const condSet = new Set(icValue || []);

  // Normaliza listas mistas passadas em imunidades, ic ou vulnerabilidades
  const rawImun = [...(imunidades || []), ...(ic || [])];
  for (const item of rawImun) {
    if (typeof item === 'string') {
      const low = item.toLowerCase().trim();
      if (dmgSet.has(low)) {
        imuneDanoSet.add(low);
      } else {
        condSet.add(low);
      }
    }
  }

  for (const item of (vulnerabilidades || [])) {
    if (typeof item === 'string') {
      const low = item.toLowerCase().trim();
      if (dmgSet.has(low)) {
        vulnDanoSet.add(low);
      }
    }
  }

  const resObj = {};
  for (const dt of damageTypes) {
    let val = resistencias[dt] || 0;
    if (dt === 'dano' && rdGeral > 0 && val === 0) {
      val = rdGeral;
    }
    resObj[dt] = {
      value: val,
      base: val,
      bonus: [],
      excecao: excecoes[dt] || 0,
      imunidade: imuneDanoSet.has(dt),
      vulnerabilidade: vulnDanoSet.has(dt),
      danoPorDado: false
    };
  }

  return {
    tamanho: tamanho.slice(0, 3),
    resistencias: resObj,
    ic: {
      value: Array.from(condSet),
      custom: icCustom || ''
    },
    idiomas: {
      value: Array.isArray(idiomas) && idiomas.length ? idiomas : (idiomasValue || []),
      custom: idiomasCustom || ''
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
function normalizeEffectChangeKey(key) {
  if (!key || typeof key !== 'string') return key;
  const k = key.trim();
  const exactMap = {
    'ataque': 'system.modificadores.ataque.geral',
    'dano': 'system.modificadores.dano.geral',
    'system.bonus.ataque': 'system.modificadores.ataque.geral',
    'system.bonus.danoGeral': 'system.modificadores.dano.geral',
    'system.attributes.ataque.bonus': 'system.modificadores.ataque.geral',
    'system.attributes.ataque.margem': 'criticoM',
    'system.attributes.dano.bonus': 'system.modificadores.dano.geral',
    'system.attributes.dano.cac': 'system.modificadores.dano.cac',
    'system.modificadores.ataque': 'system.modificadores.ataque.geral',
    'system.modificadores.dano': 'system.modificadores.dano.geral',
    'system.modificadores.dano.corpo-a-corpo': 'system.modificadores.dano.cac',
    'system.modificadores.dano.distancia': 'system.modificadores.dano.ad',
    'system.modificadores.dano.mag.0': 'system.modificadores.dano.mag',
    'system.modificadores.defesa.outros': 'system.attributes.defesa.bonus',
    'system.attributes.defesa.condi': 'system.attributes.defesa.outros',
    'system.modificadores.resistencia': 'system.modificadores.pericias.resistencia',
    'system.modificadores.pericia': 'system.modificadores.pericias.geral',
    'system.detalhes.carga': 'system.attributes.carga.bonus',
    'system.attributes.movement.walk': 'system.attributes.movement.walk.base',
    'system.attributes.movement.swim': 'system.attributes.movement.swim.base',
    'system.attributes.movement.fly': 'system.attributes.movement.fly.base',
    'system.attributes.movement.climb': 'system.attributes.movement.climb.base',
    'system.attributes.movement.burrow': 'system.attributes.movement.burrow.base',
    'system.tracos.resistencias.dano': 'system.tracos.resistencias.dano.bonus'
  };
  if (exactMap[k]) return exactMap[k];
  // Skills em inglês (system.skills.<k>.bonus -> system.pericias.<k>.bonus)
  if (/^system\.skills\.(\w+)\.(bonus|outros|value)$/.test(k)) {
    return k.replace(/^system\.skills\./, 'system.pericias.');
  }
  // Perícias .condi (resetado por SkillData.migrateData -> .bonus)
  if (/^system\.pericias\.(\w+)\.condi$/.test(k)) {
    return k.replace(/\.condi$/, '.bonus');
  }
  // Resistências de dano antigas .value -> .bonus (effectMigration.migrateResistancesPath)
  if (/^system\.tracos\.resistencias\.\w+\.value$/.test(k)) {
    return k.replace(/\.value$/, '.bonus');
  }
  // Resistência sem sufixo (ex: system.tracos.resistencias.fogo -> .bonus)
  if (/^system\.tracos\.resistencias\.(dano|perda|acido|corte|eletricidade|essencia|fogo|frio|impacto|luz|psiquico|perfuracao|trevas)$/.test(k)) {
    return `${k}.bonus`;
  }
  // Atributos antigos .base/.racial -> .value (effectMigration.migrateAbilitiesPath)
  if (/^system\.atributos\.\w+\.(base|racial)$/.test(k)) {
    return k.replace(/\.(base|racial)$/, '.value');
  }
  return k;
}

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
  const _id = (id && /^[a-zA-Z0-9]{16}$/.test(id)) ? id : generateId();
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
        custo: flags.tormenta20?.custo ?? null,
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
      key: normalizeEffectChangeKey(c.key),
      mode: c.mode ?? 2, // 2 = ADD
      value: String(c.value),
      priority: c.priority ?? 20
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
    }
  };
}

/**
 * Constrói um item genérico ou poder de Tormenta20 com schema completo
 */
function normalizeDamageType(dt) {
  if (!dt) return '';
  const map = {
    'perfuração': 'perfuracao',
    'ácido': 'acido',
    'essência': 'essencia',
    'psíquico': 'psiquico',
    'elétrico': 'eletricidade',
    'cura': 'curapv',
    'perda de pv': 'perda',
    'perda_de_pv': 'perda'
  };
  const low = String(dt).toLowerCase().trim();
  return map[low] || low;
}

function normalizeRolls(rolls) {
  if (!Array.isArray(rolls)) return [];
  return rolls.map((r, idx) => {
    const isCura = r.type === 'cura';
    const finalType = ['ataque', 'dano', 'formula'].includes(r.type) ? r.type : 'dano';
    const rawParts = Array.isArray(r.parts) ? r.parts : [];
    const finalParts = rawParts.map(p => {
      const p0 = String(p[0] ?? '');
      let p1 = String(p[1] ?? '');
      const p2 = String(p[2] ?? '');
      if (finalType === 'dano') {
        if (isCura && (!p1 || p1 === 'cura')) {
          p1 = 'curapv';
        } else {
          p1 = normalizeDamageType(p1);
        }
      }
      return [p0, p1, p2];
    });
    let rollDefaultName = 'Dano';
    if (isCura) rollDefaultName = 'Cura';
    else if (finalType === 'ataque') rollDefaultName = 'Ataque';
    return {
      name: r.name || rollDefaultName,
      key: r.key || `${finalType}${idx}`,
      type: finalType,
      parts: finalParts,
      adaptavel: r.adaptavel || '',
      versatil: r.versatil || ''
    };
  });
}

function normalizeExecucao(exec) {
  const map = {
    padrao: 'action',
    'padrão': 'action',
    standard: 'action',
    action: 'action',
    movimento: 'move',
    move: 'move',
    completa: 'full',
    full: 'full',
    reacao: 'reaction',
    'reação': 'reaction',
    reaction: 'reaction',
    livre: 'free',
    free: 'free',
    passiva: 'passive',
    passive: 'passive'
  };
  return map[String(exec || 'passive').toLowerCase().trim()] || 'passive';
}

function normalizeDuracao(dur) {
  if (dur && typeof dur === 'object') {
    return {
      value: Number(dur.value || 0),
      units: dur.units || 'inst',
      special: dur.special || ''
    };
  }
  const s = String(dur || 'inst').toLowerCase().trim();
  if (s === 'instantânea' || s === 'instantanea' || s === 'inst') return { value: 0, units: 'inst', special: '' };
  if (s === 'cena' || s === 'scene') return { value: 0, units: 'scene', special: '' };
  if (s === 'sustentada' || s === 'sust') return { value: 0, units: 'sust', special: '' };
  if (s === 'permanente' || s === 'perm') return { value: 0, units: 'perm', special: '' };
  if (s.includes('dia') || s === 'day') return { value: parseInt(s, 10) || 1, units: 'day', special: '' };
  if (s.includes('rodada') || s === 'round') return { value: parseInt(s, 10) || 1, units: 'round', special: '' };
  if (s.includes('turno') || s === 'turn') return { value: parseInt(s, 10) || 1, units: 'turn', special: '' };
  if (s.includes('minuto') || s === 'minute') return { value: parseInt(s, 10) || 1, units: 'minute', special: '' };
  if (s.includes('hora') || s === 'hour') return { value: parseInt(s, 10) || 1, units: 'hour', special: '' };
  return { value: 0, units: 'inst', special: '' };
}

function normalizeAlcance(alc) {
  const s = String(alc || '').toLowerCase().trim();
  if (!s) return 'none';
  if (/^\d+\s*m$/.test(s)) return 'm';
  if (/^\d+\s*km$/.test(s)) return 'km';
  const map = {
    pessoal: 'self',
    self: 'self',
    toque: 'touch',
    touch: 'touch',
    curto: 'short',
    short: 'short',
    'médio': 'medium',
    medio: 'medium',
    medium: 'medium',
    longo: 'long',
    long: 'long',
    ilimitado: 'any',
    any: 'any',
    especial: 'spec',
    spec: 'spec',
    nenhum: 'none',
    none: 'none',
    'corpo-a-corpo': 'none',
    adjacente: 'touch'
  };
  if (map[s]) return map[s];
  if (s.includes('médio') || s.includes('medio')) return 'medium';
  if (s.includes('curto')) return 'short';
  if (s.includes('longo')) return 'long';
  if (s.includes('pessoal')) return 'self';
  if (s.includes('toque') || s.includes('adjacente')) return 'touch';
  if (s.includes('ilimitad')) return 'any';
  if (s.includes('m')) return 'spec';
  return 'short';
}

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

  let rawRolls = [];
  if (Array.isArray(rolls)) {
    rawRolls = rolls;
  } else if (Array.isArray(system.rolls)) {
    rawRolls = system.rolls;
  }
  const finalRolls = normalizeRolls(rawRolls);
  const builtEffects = effects.map(eff => (eff && eff._id && /^[a-zA-Z0-9]{16}$/.test(eff._id) && eff.changes) ? eff : buildActiveEffect({
    ...eff,
    img: eff.img || finalImg,
    origin: eff.origin || `Item.${_id}`
  }));

  const normalizedAtivacao = {
    execucao: normalizeExecucao(system.ativacao?.execucao || 'passive'),
    custo: Number(system.ativacao?.custo || 0),
    qtd: system.ativacao?.qtd || '',
    condicao: system.ativacao?.condicao || '',
    special: system.ativacao?.special || ''
  };
  const normalizedDuracao = normalizeDuracao(system.duracao);
  const normalizedAlcance = normalizeAlcance(system.alcance || system.range?.units || '');
  let normalizedEquipado;
  if (type === 'arma') {
    if (typeof system.equipado === 'boolean') {
      normalizedEquipado = system.equipado ? 1 : 0;
    } else {
      normalizedEquipado = Number(system.equipado ?? 1);
    }
  } else {
    normalizedEquipado = system.equipado === undefined ? true : Boolean(system.equipado);
  }

  const validPowerTypes = ['ability', 'classe', 'concedido', 'geral', 'origem', 'racial', 'distincao', 'complicacao'];
  const powerTypeMap = { raca: 'racial', 'raça': 'racial', poder: 'geral' };
  const mappedPowerTipo = powerTypeMap[system.tipo] || system.tipo;
  let normalizedTipo = system.tipo;
  if (type === 'poder') {
    normalizedTipo = validPowerTypes.includes(mappedPowerTipo) ? mappedPowerTipo : 'geral';
  } else if (type === 'consumivel') {
    const validCons = new Set(['', 'ammo', 'scroll', 'alchemy', 'potion', 'material', 'food']);
    const consMap = {
      veneno: 'alchemy',
      alquimico: 'alchemy',
      'alquímico': 'alchemy',
      preparado: 'alchemy',
      municao: 'ammo',
      'munição': 'ammo',
      recurso: 'potion',
      pocao: 'potion',
      'poção': 'potion',
      alimentacao: 'food',
      'alimentação': 'food',
      comida: 'food',
      pergaminho: 'scroll',
      material: 'material',
      outro: '',
      servico: '',
      'serviço': '',
      equipamento: ''
    };
    const lowCons = String(system.tipo || '').toLowerCase().trim();
    if (validCons.has(lowCons)) {
      normalizedTipo = lowCons;
    } else {
      normalizedTipo = consMap[lowCons] ?? '';
    }
  }

  const slotTypeDefault = ['escudo', 'ferramenta', 'esoterico'].includes(normalizedTipo) ? 'hand' : 'body';
  let normalizedSlotType = system.equipado2?.type || '';
  if (type === 'equipamento' && !['hand', 'body', 'both'].includes(normalizedSlotType)) {
    normalizedSlotType = slotTypeDefault;
  }

  const cleanTagArray = arr => (Array.isArray(arr) ? arr.filter(t => typeof t === 'string' && t.trim() !== '') : []);

  const baseDoc = {
    _id,
    name,
    type,
    img: finalImg,
    system: {
      ...system,
      description: {
        value: descVal,
        unidentified: ''
      },
      source: system.source || 'Tormenta20',
      carregado: system.carregado === undefined ? true : Boolean(system.carregado),
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
      equipado: normalizedEquipado,
      equipado2: {
        slot: system.equipado2?.slot || 0,
        type: normalizedSlotType
      },
      ativacao: normalizedAtivacao,
      duracao: normalizedDuracao,
      target: {
        value: Number(system.target?.value || 0),
        width: Number(system.target?.width || 0),
        type: system.target?.type || ''
      },
      range: {
        value: Number(system.range?.value || 0),
        units: normalizedAlcance
      },
      consume: {
        type: system.consume?.type || '',
        target: system.consume?.target || '',
        amount: Number(system.consume?.amount || 0),
        mpMultiplier: Boolean(system.consume?.mpMultiplier)
      },
      efeito: system.efeito || '',
      alcance: normalizedAlcance,
      alvo: system.alvo || '',
      area: system.area || '',
      resistencia: {
        pericia: system.resistencia?.pericia || '',
        atributo: system.resistencia?.atributo || '',
        bonus: Number(system.resistencia?.bonus || 0),
        txt: system.resistencia?.txt || ''
      },
      origin: system.origin || '',
      tags: cleanTagArray(system.tags),
      chatFlavor: system.chatFlavor || (description.includes('blockquote') ? description.slice(0, 300) : `<p>${name}</p>`),
      chatGif: system.chatGif || '',
      rolltags: cleanTagArray(system.rolltags),
      automationtags: cleanTagArray(system.automationtags),
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
      ...(normalizedTipo === undefined ? {} : { tipo: normalizedTipo }),
      rolls: finalRolls
    },
    effects: builtEffects,
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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

  let finalProposito = proposito;
  if (proposito === 'tiro' || proposito === 'distancia') {
    finalProposito = 'disparo';
  } else if (!proposito || proposito === 'corpo-a-corpo') {
    if (alcance) {
      if (['azagaia', 'espinhos', 'adaga', 'lanca'].some(w => name.toLowerCase().includes(w))) {
        finalProposito = 'arremesso';
      } else {
        finalProposito = 'disparo';
      }
    } else {
      finalProposito = 'corpo-a-corpo';
    }
  }

  const normalizedTipoDano = normalizeDamageType(tipoDano);
  const normalizedTipoDanoExtra = normalizeDamageType(tipoDanoExtra);
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
        [dano, normalizedTipoDano, '']
      ],
      versatil: '',
      adaptavel: ''
    }
  ];

  if (danoExtra) {
    defaultRolls.push({
      name: `Dano de ${normalizedTipoDanoExtra || 'Extra'}`,
      key: 'dano2',
      type: 'dano',
      parts: [
        [danoExtra, normalizedTipoDanoExtra, '']
      ],
      versatil: '',
      adaptavel: ''
    });
  }

  const chatFlavor = `<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${flavorPhrase || `${name}!`}"</blockquote><p>${flavorAction || description}. <span style="color: #800000; font-weight: bold;">Golpe com ${name}!</span></p></div>`;

  return buildItem({
    name,
    type: 'arma',
    img: finalImg,
    description: description || `Ataque ${name} da criatura.`,
    effects,
    system: {
      tipo: finalProposito,
      empunhadura,
      proficiencia,
      dano,
      tipoDano: normalizedTipoDano,
      criticoM: critM,
      criticoX: critX,
      critico: { margem: critM, multiplicador: critX },
      ataques,
      tipoUso: 'sim',
      proposito: finalProposito,
      size,
      alcance: ['m', 'km'].includes(normalizeAlcance(alcance)) ? 'spec' : normalizeAlcance(alcance),
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
  subtipo = 'ameaca',
  execucao = 'passive',
  custo = 0,
  ativacao = null,
  cd = null,
  alcance = '',
  alvo = '',
  area = '',
  efeito = '',
  duracao = 'inst',
  resistencia = null,
  description = '',
  flavorPhrase = '',
  flavorAction = '',
  rolls = [],
  effects = []
}) {
  const finalImg = img || resolveIcon({ name, type: 'poder' });
  const chatFlavor = `<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"${flavorPhrase || name}"</blockquote><p>${flavorAction || description}. <span style="color: #800000; font-weight: bold;">Habilidade especial ativada!</span></p>`;

  const validPowerTypes = ['ability', 'classe', 'concedido', 'geral', 'origem', 'racial', 'distincao', 'complicacao'];
  const finalTipo = validPowerTypes.includes(tipo) ? tipo : 'geral';
  const rawExec = ativacao?.execucao || execucao || 'passive';
  const rawCost = ativacao?.custo ?? custo;

  let resObj = { pericia: '', atributo: '', bonus: 0, txt: '' };
  if (typeof resistencia === 'string') {
    resObj.txt = resistencia;
    const low = resistencia.toLowerCase();
    if (low.includes('vont') || low.includes('von')) { resObj.pericia = 'vont'; resObj.atributo = 'sab'; }
    else if (low.includes('fort')) { resObj.pericia = 'fort'; resObj.atributo = 'con'; }
    else if (low.includes('refl') || low.includes('ref')) { resObj.pericia = 'refl'; resObj.atributo = 'des'; }
  } else if (resistencia && typeof resistencia === 'object') {
    resObj = { ...resObj, ...resistencia };
  }

  return buildItem({
    name,
    type: 'poder',
    img: finalImg,
    description,
    effects,
    system: {
      tipo: finalTipo,
      subtipo,
      ativacao: {
        execucao: normalizeExecucao(rawExec),
        custo: Number(rawCost || 0),
        qtd: '',
        condicao: '',
        special: ''
      },
      duracao: normalizeDuracao(duracao),
      cd: cd ? Number(cd) : null,
      alcance: normalizeAlcance(alcance),
      alvo,
      area,
      efeito,
      resistencia: resObj,
      chatFlavor,
      rolls: normalizeRolls(rolls)
    }
  });
}

const EQUIPMENT_CATALOG = {
  'armadura de couro': { type: 'equipamento', tipo: 'leve', def: 2, pen: 0, maxAtr: 4, esp: 1, preco: 20, slotType: 'body' },
  'couro batido': { type: 'equipamento', tipo: 'leve', def: 3, pen: -1, maxAtr: 4, esp: 1, preco: 35, slotType: 'body' },
  'armadura de couro batido': { type: 'equipamento', tipo: 'leve', def: 3, pen: -1, maxAtr: 4, esp: 1, preco: 35, slotType: 'body' },
  'gibao de peles': { type: 'equipamento', tipo: 'leve', def: 4, pen: -3, maxAtr: 4, esp: 2, preco: 25, slotType: 'body' },
  'couraca': { type: 'equipamento', tipo: 'pesada', def: 5, pen: -4, maxAtr: 2, esp: 2, preco: 500, slotType: 'body' },
  'brunea': { type: 'equipamento', tipo: 'pesada', def: 5, pen: -2, maxAtr: 2, esp: 2, preco: 50, slotType: 'body' },
  'cota de malha': { type: 'equipamento', tipo: 'pesada', def: 6, pen: -2, maxAtr: 2, esp: 4, preco: 150, slotType: 'body' },
  'meia armadura': { type: 'equipamento', tipo: 'pesada', def: 7, pen: -4, maxAtr: 1, esp: 3, preco: 600, slotType: 'body' },
  'armadura completa': { type: 'equipamento', tipo: 'pesada', def: 10, pen: -5, maxAtr: 0, esp: 5, preco: 3000, slotType: 'body' },
  'escudo leve': { type: 'equipamento', tipo: 'escudo', def: 1, pen: -1, maxAtr: 0, esp: 1, preco: 5, slotType: 'hand' },
  'escudo pesado': { type: 'equipamento', tipo: 'escudo', def: 2, pen: -2, maxAtr: 0, esp: 2, preco: 15, slotType: 'hand' },
  'flechas': { type: 'consumivel', tipo: 'ammo', esp: 1, preco: 1, defaultQtd: 20 },
  'virotes': { type: 'consumivel', tipo: 'ammo', esp: 1, preco: 2, defaultQtd: 20 },
  'balas': { type: 'consumivel', tipo: 'ammo', esp: 1, preco: 20, defaultQtd: 20 },
  'gazua': { type: 'equipamento', tipo: 'ferramenta', esp: 0.5, preco: 5, slotType: 'hand' },
  'estojo de disfarces': { type: 'equipamento', tipo: 'ferramenta', esp: 1, preco: 50, slotType: 'hand' },
  'instrumentos de oficio': { type: 'equipamento', tipo: 'ferramenta', esp: 1, preco: 30, slotType: 'hand' },
  'simbolo sagrado': { type: 'equipamento', tipo: 'esoterico', esp: 0.5, preco: 5, slotType: 'hand' },
  'capa esvoacante': { type: 'equipamento', tipo: 'traje', esp: 1, preco: 25, slotType: 'body' },
  'capa pesada': { type: 'equipamento', tipo: 'traje', esp: 1, preco: 15, slotType: 'body' },
  'camisa bufante': { type: 'equipamento', tipo: 'traje', esp: 1, preco: 25, slotType: 'body' },
  'traje da corte': { type: 'equipamento', tipo: 'traje', esp: 1, preco: 100, slotType: 'body' },
  'manto camuflado': { type: 'equipamento', tipo: 'traje', esp: 1, preco: 12, slotType: 'body' },
  'bandana': { type: 'equipamento', tipo: 'traje', esp: 0.5, preco: 10, slotType: 'body' },
  'po do desaparecimento': { type: 'consumivel', tipo: 'alchemy', esp: 0.5, preco: 600 },
  'terra de cemiterio': { type: 'consumivel', tipo: 'material', esp: 0.5, preco: 5 },
  'essencia de mana': { type: 'consumivel', tipo: 'potion', esp: 0.5, preco: 50 },
  'pocao de curar ferimentos': { type: 'consumivel', tipo: 'potion', esp: 0.5, preco: 30 },
  'baga de fogo': { type: 'consumivel', tipo: 'alchemy', esp: 0.5, preco: 15 },
  'peconha': { type: 'consumivel', tipo: 'alchemy', esp: 0.5, preco: 30 }
};

function normEquipStr(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[*]/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseEquipmentLine(eqLine) {
  if (!eqLine || typeof eqLine !== 'string') return [];
  let clean = eqLine.replace(/[■.]+\s*$/, '').trim();
  if (!clean || /^(nenhum|nenhuma|—|-)$/i.test(clean)) return [];
  // Remover referências de página entre parênteses (ex: "(Heróis de Arton, p. 216)", "(veja Ameaças de Arton, p. 400)")
  clean = clean.replace(/\((?:veja\s+)?(?:Her[óo]is|Amea[çc]as|Tormenta20)[^)]*\)/gi, '').trim();
  // Normalizar conectores de lista ("e um entre:", " ou ", " e ")
  clean = clean.replace(/\be\s+um\s+entre:\s*/gi, ', ');
  clean = clean.replace(/\s+ou\s+/gi, ', ');
  clean = clean.replace(/\s+e\s+(?=(?:escudo|armadura|espada|machado|lanca|lança|arco|besta|azagaia|adaga|meia|cota|gib[ãa]o|brunea|coura[çc]a|simbolo|s[íi]mbolo|gazua|flechas|virotes|balas|traje|capa|manto|p[óo]|terra|ess[êe]ncia|po[çc][ãa]o|instrumentos|estojo))/gi, ', ');

  const rawParts = clean.split(',').map(s => s.trim()).filter(Boolean);
  const parsed = [];
  for (const part of rawParts) {
    let qtd = 1;
    let namePart = part;
    const mDice = namePart.match(/\s+x(\d+d\d+(?:\+\d+)?)$/i);
    if (mDice) {
      namePart = namePart.slice(0, mDice.index).trim();
    } else {
      const mQty = namePart.match(/\s+x(\d+)$/i);
      if (mQty) {
        qtd = parseInt(mQty[1], 10) || 1;
        namePart = namePart.slice(0, mQty.index).trim();
      }
    }
    if (!namePart || /^(nenhum|nenhuma)$/i.test(namePart)) continue;
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    parsed.push({ raw: part, name: displayName, norm: normEquipStr(namePart), qtd });
  }
  return parsed;
}

function lookupEquipmentCatalog(normName) {
  // Ordena por chave mais longa para dar prioridade a matches específicos ("armadura de couro batido" antes de "couro")
  const keys = Object.keys(EQUIPMENT_CATALOG).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normName.includes(key)) {
      return { key, meta: EQUIPMENT_CATALOG[key] };
    }
  }
  return null;
}

function buildNpcEquipmentItem({ name, qtd = 1, raw = '' }) {
  const norm = normEquipStr(name);
  const found = lookupEquipmentCatalog(norm);
  const meta = found ? found.meta : { type: 'equipamento', tipo: 'acessorio', esp: 1, preco: 0, slotType: 'body' };

  let defVal = meta.def || 0;
  let penVal = meta.pen || 0;
  const maxAtr = meta.maxAtr ?? 0;

  if (meta.tipo === 'leve' || meta.tipo === 'pesada' || meta.tipo === 'escudo') {
    if (norm.includes('reforcad')) defVal += 1;
    if (norm.includes('sob medida')) penVal = Math.min(0, penVal + 2);
    if (norm.includes('ajustad')) penVal = Math.min(0, penVal + 1);
    if (norm.includes('delicad')) penVal = Math.min(0, penVal + 1);
    if (norm.includes('lanajuste')) defVal += 1;
  }

  const desc = `<p><strong>Equipamento de Ameaça:</strong> ${raw || name}.</p>`;
  const finalImg = resolveIcon({ name, type: meta.type });

  if (meta.type === 'consumivel') {
    return buildItem({
      name,
      type: 'consumivel',
      img: finalImg,
      description: desc,
      system: {
        tipo: meta.tipo || 'alchemy',
        qtd: Number(qtd || meta.defaultQtd || 1),
        espacos: Number(meta.esp ?? 0.5),
        preco: Number(meta.preco || 0),
        equipado: false,
        ativacao: { execucao: 'action', custo: 0 }
      }
    });
  }

  return buildItem({
    name,
    type: 'equipamento',
    img: finalImg,
    description: desc,
    system: {
      tipo: meta.tipo || 'acessorio',
      qtd: Number(qtd || 1),
      espacos: Number(meta.esp ?? 1),
      preco: Number(meta.preco || 0),
      equipado: false,
      equipado2: { slot: 0, type: meta.slotType || 'body' },
      armadura: {
        value: Number(defVal),
        penalidade: Number(penVal),
        maxAtr: Number(maxAtr)
      }
    }
  });
}

function isWeaponClause(normName) {
  return /^(adaga|azagaia|espada|machado|lanca|lança|arco|besta|cimitarra|foice|maca|maça|machadinha|clava|tridente|chicote|pistola|alabarda|tacape|montante|corrente|kum|armamento|braco)/.test(normName);
}

function syncActorEquipmentItems(actorDoc, embeddedDocs = []) {
  const anomalies = [];
  const createdItems = [];
  let modified = false;

  // Garantir equipado: false em todos equipamentos de NPC para não somar defesa/pda duplicada
  for (const doc of embeddedDocs) {
    if (doc.type === 'equipamento' && doc.system) {
      if (doc.system.equipado !== false) {
        doc.system.equipado = false;
        if (doc.system.equipado2) doc.system.equipado2.slot = 0;
        anomalies.push(`Equipamento "${doc.name}" ajustado para equipado=false no NPC`);
        modified = true;
      }
      if (doc.system.armadura && Number(doc.system.armadura.penalidade) > 0) {
        doc.system.armadura.penalidade = -Math.abs(Number(doc.system.armadura.penalidade));
        modified = true;
      }
    }
  }

  const eqLine = actorDoc.system?.detalhes?.equipamento || '';
  const entries = parseEquipmentLine(eqLine);
  if (entries.length === 0) {
    return { modified, anomalies, createdItems };
  }

  for (const entry of entries) {
    const isShield = entry.norm.includes('escudo');
    const isArmorOrGear = !isWeaponClause(entry.norm) || isShield;

    // Para escudos, exigir presença como item de tipo 'equipamento' (além de eventual arma de investida com escudo)
    const match = embeddedDocs.find(d => {
      const dn = normEquipStr(d.name);
      if (isShield && d.type !== 'equipamento') return false;
      if (dn === entry.norm || dn.includes(entry.norm) || entry.norm.includes(dn)) return true;
      // Match por núcleo sem modificadores ("adaga x6" vs "Adaga de Arremesso" / "[Bando] Adaga")
      const baseWord = entry.norm.split(' ')[0];
      if (!isShield && baseWord.length >= 4 && dn.includes(baseWord) && d.type === 'arma' && isWeaponClause(entry.norm)) return true;
      return false;
    });

    if (match) {
      if (entry.qtd > 1 && Number(match.system?.qtd || 1) < entry.qtd && ['arma', 'equipamento', 'consumivel'].includes(match.type)) {
        match.system = match.system || {};
        match.system.qtd = entry.qtd;
        anomalies.push(`Quantidade de "${match.name}" sincronizada para x${entry.qtd}`);
        modified = true;
      }
    } else if (isArmorOrGear) {
      const newDoc = buildNpcEquipmentItem(entry);
      embeddedDocs.push(newDoc);
      createdItems.push(newDoc);
      actorDoc.items = actorDoc.items || [];
      actorDoc.items.push(newDoc._id);
      anomalies.push(`Criado item de equipamento faltante "${newDoc.name}" (${newDoc.type}) a partir de detalhes.equipamento`);
      modified = true;
    } else {
      // Arma listada em Equipamento que não estava em embeddedDocs
      const newWeapon = buildWeaponAttack({ name: entry.name, description: `<p>Arma listada no equipamento oficial: ${entry.raw}.</p>` });
      newWeapon.system.qtd = entry.qtd;
      embeddedDocs.push(newWeapon);
      createdItems.push(newWeapon);
      actorDoc.items = actorDoc.items || [];
      actorDoc.items.push(newWeapon._id);
      anomalies.push(`Criada arma faltante "${newWeapon.name}" a partir de detalhes.equipamento`);
      modified = true;
    }
  }

  return { modified, anomalies, createdItems };
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
 * Constrói uma Magia de Tormenta20 segundo o DataModel oficial (SpellData)
 */
function buildSpellItem({
  id = null,
  name,
  img = null,
  description = '',
  circulo = 1,
  tipo = 'arc', // 'arc', 'div', 'uni'
  escola = 'evo', // 'abj', 'adv', 'con', 'enc', 'evo', 'ilu', 'nec', 'tra'
  execucao = 'action', // 'action', 'reaction', 'move', 'full', 'free', 'passive'
  custoPM = null,
  ativacao = null,
  alcance = 'curto',
  alvo = '',
  area = '',
  efeito = '',
  duracao = 'inst', // 'inst', 'scene', 'turn', 'round', 'sust', 'minute', 'hour', 'day', 'perm'
  resistencia = '',
  resistenciaPericia = '',
  resistenciaAtributo = '',
  aprimoramentos = [],
  rolls = [],
  formulaDano = '',
  tipoDano = '',
  formulaCura = '',
  effects = [],
  preparada = true,
  folder = null,
  source = ''
}) {
  const _id = id || generateId();
  const circNum = Number(circulo) || 1;
  const defaultPmByCircle = { 1: 1, 2: 3, 3: 6, 4: 10, 5: 15 };
  const rawCost = ativacao?.custo ?? custoPM;
  const pmCost = rawCost ?? (defaultPmByCircle[circNum] || 15);

  const tipoMap = { arcana: 'arc', arcano: 'arc', divina: 'div', divino: 'div', universal: 'uni' };
  const finalTipo = tipoMap[tipo] || tipo || 'arc';

  const escolaMap = {
    evocacao: 'evo', abjuracao: 'abj', adivinhacao: 'adv', convocacao: 'con',
    encantamento: 'enc', ilusao: 'ilu', necromancia: 'nec', transmutacao: 'tra'
  };
  const finalEscola = escolaMap[escola] || escola || 'evo';

  const rawExec = ativacao?.execucao || execucao || 'action';
  const finalExec = normalizeExecucao(rawExec);
  const finalDurObj = normalizeDuracao(duracao);
  const finalAlcance = normalizeAlcance(alcance);

  let resObj = { pericia: '', atributo: '', bonus: 0, txt: '' };
  if (resistenciaPericia) resObj.pericia = resistenciaPericia;
  if (resistenciaAtributo) resObj.atributo = resistenciaAtributo;
  if (typeof resistencia === 'string' && resistencia.trim() !== '') {
    resObj.txt = resistencia;
    const low = resistencia.toLowerCase();
    if (!resObj.pericia) {
      if (low.includes('vontade') || low.includes('von')) { resObj.pericia = 'vont'; resObj.atributo = 'sab'; }
      else if (low.includes('fortitude') || low.includes('fort')) { resObj.pericia = 'fort'; resObj.atributo = 'con'; }
      else if (low.includes('reflexo') || low.includes('ref')) { resObj.pericia = 'refl'; resObj.atributo = 'des'; }
    }
  } else if (resistencia && typeof resistencia === 'object') {
    resObj = { ...resObj, ...resistencia };
  }

  const rawRolls = [...(Array.isArray(rolls) ? rolls : [])];
  if (rawRolls.length === 0) {
    if (formulaDano) {
      rawRolls.push({
        name: `Dano de ${tipoDano || 'Magia'}`,
        key: 'dano0',
        type: 'dano',
        parts: [[formulaDano, normalizeDamageType(tipoDano || 'essencia'), '']],
        versatil: '',
        adaptavel: ''
      });
    }
    if (formulaCura) {
      rawRolls.push({
        name: 'Cura',
        key: 'dano0',
        type: 'dano',
        parts: [[formulaCura, 'curapv', '']],
        versatil: '',
        adaptavel: ''
      });
    }
  }
  const finalRolls = normalizeRolls(rawRolls);
  const finalImg = img || resolveIcon({ name, type: 'magia' });

  const builtEffects = (effects || []).map(eff => (eff && eff._id && /^[a-zA-Z0-9]{16}$/.test(eff._id) && eff.changes) ? eff : buildActiveEffect({
    ...eff,
    img: eff.img || finalImg,
    origin: eff.origin || `Item.${_id}`
  }));

  return {
    _id,
    name,
    type: 'magia',
    img: finalImg,
    folder,
    effects: builtEffects,
    system: {
      description: {
        value: description.startsWith('<p>') ? description : `<p>${description}</p>`,
        unidentified: ''
      },
      source: source || 'Tormenta20',
      ativacao: {
        execucao: finalExec,
        custo: pmCost,
        qtd: '',
        condicao: '',
        special: ''
      },
      duracao: finalDurObj,
      range: {
        value: null,
        units: finalAlcance
      },
      consume: {
        type: '',
        target: '',
        amount: null,
        mpMultiplier: false
      },
      efeito: String(efeito || ''),
      alcance: finalAlcance,
      alvo: String(alvo || ''),
      area: String(area || ''),
      resistencia: resObj,
      aprimoramentos: Array.isArray(aprimoramentos) ? aprimoramentos : [],
      rolls: finalRolls,
      tipo: finalTipo,
      circulo: circNum,
      preparada: Boolean(preparada),
      escola: finalEscola,
      chatFlavor: `<p><strong>${name}</strong> (${circNum}º Círculo, ${pmCost} PM)</p>`,
      origin: '',
      tags: [],
      chatGif: '',
      rolltags: [],
      automationtags: [],
      equipado2: {
        slot: 0,
        type: ''
      }
    }
  };
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
  cd = null,
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
  resistenciasTexto = '',
  rd = '',
  pericias = {},
  items = [],
  effects = [],
  ataquescac = '',
  ataquesad = '',
  equipamento = '',
  tokenTexture = null
}) {
  const _id = id || generateId();
  const finalImg = (!img || img === 'icons/svg/mystery-man.svg')
    ? resolveIcon({ name, type: 'npc' })
    : img;

  // A única fonte de tokens de atores é exclusivamente 2-Minute Tabletop
  const tokenSrc = tokenTexture || resolveToken({ name });
  const tokenDim = getTokenDimension(tamanho);

  // Cálculo canônico da Defesa Base no Foundry: valor_ficha - destreza
  const desMod = atributos.des ?? 0;
  const defVal = attributes.defesa?.value ?? 15;
  const defBase = attributes.defesa?.base ?? (defVal - desMod);

  const ndNum = Number(nd) || 1;
  let treino = 2;
  if (ndNum >= 15) treino = 6;
  else if (ndNum >= 7) treino = 4;
  const meionivel = Math.floor(ndNum / 2);
  const autoCd = 10 + meionivel + Math.max(atributos.for || 0, atributos.des || 0, atributos.con || 0, atributos.int || 0, atributos.sab || 0, atributos.car || 0);
  const cdVal = Number(cd ?? attributes.cd ?? autoCd);

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

  // Garante as 34 perícias preenchidas e preserva perícias situacionais
  let finalPericias = pericias;
  if (!pericias || Object.keys(pericias).length < 30) {
    finalPericias = buildSkills(ndNum, atributos, pericias);
  } else {
    finalPericias = { ...pericias };
  }

  const finalTracos = (resistencias && resistencias.resistencias && typeof resistencias.resistencias === 'object')
    ? resistencias
    : buildTracos({
        tamanho: tamanho.slice(0, 3),
        resistencias: resistencias.danos || resistencias.resistencias || resistencias || {},
        imunidadesDano: resistencias.imunidadesDano || [],
        vulnerabilidadesDano: resistencias.vulnerabilidadesDano || [],
        imunidades: resistencias.imunidades || resistencias.ic || [],
        vulnerabilidades: resistencias.vulnerabilidades || [],
        ic: resistencias.ic || resistencias.condicoes || [],
        icValue: resistencias.icValue || resistencias.condicoes || [],
        icCustom: resistencias.icCustom || '',
        idiomas: resistencias.idiomas || ['comum'],
        idiomasValue: resistencias.idiomasValue || resistencias.idiomas || ['comum'],
        idiomasCustom: resistencias.idiomasCustom || '',
        rdGeral: resistencias.rdGeral || resistencias.dano || 0
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
      } else if (item.type === 'magia') {
        itemDoc = buildSpellItem(item);
      } else {
        itemDoc = buildItem(item);
      }
    }
    itemIds.push(itemDoc._id);

    if (itemDoc.effects && itemDoc.effects.length > 0) {
      const effIds = [];
      for (const eff of itemDoc.effects) {
        if (typeof eff === 'object' && eff !== null && eff._id) {
          effIds.push(eff._id);
          embeddedDocs.push({
            key: `!actors.items.effects!${_id}.${itemDoc._id}.${eff._id}`,
            typePath: '!actors.items.effects!',
            doc: eff
          });
        } else if (typeof eff === 'string') {
          effIds.push(eff);
        }
      }
      itemDoc.effects = effIds;
    }

    embeddedDocs.push({
      key: `!actors.items!${_id}.${itemDoc._id}`,
      typePath: '!actors.items!',
      doc: itemDoc
    });
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
      dinheiro: { tc: 0, tp: 0, to: 0, tl: 0 },
      resources: {
        primary: { value: 0, max: 0, label: 'Recurso 1' },
        secondary: { value: 0, max: 0, label: 'Recurso 2' },
        tertiary: { value: 0, max: 0, label: 'Recurso 3' },
        deathsave: { value: 0, max: 3, label: 'Testes de Morte' },
        shadow: { value: 0, max: 5, label: 'Sombra' },
        catarse: { value: 0, max: 3, label: 'Catarse' }
      },
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
        raca: raca || ({ ani: 'Animal', hum: 'Humanoide', mon: 'Monstro', esp: 'Espírito' }[tipoMonstro] || 'Criatura'),
        tipo: tipoMonstro,
        tamanho: tamanho.slice(0, 3),
        equipamento: equipamento || '',
        resistencias: resistenciasTexto || rd || (typeof resistencias === 'string' ? resistencias : (resistencias.txt || resistencias.texto || '')),
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
    }
  };

  // Efeitos diretos do ator
  for (const eff of effects) {
    const effDoc = buildActiveEffect({
      ...eff,
      img: eff.img || finalImg,
      origin: eff.origin || `Actor.${_id}`
    });
    actorDoc.effects.push(effDoc._id);
    embeddedDocs.push({
      key: `!actors.effects!${_id}.${effDoc._id}`,
      typePath: '!actors.effects!',
      doc: effDoc
    });
  }

  // Sincroniza automaticamente equipamentos da linha detalhes.equipamento -> itens reais no ator
  const eqItemsOnly = embeddedDocs.filter(e => e.typePath === '!actors.items!').map(e => e.doc);
  const eqSync = syncActorEquipmentItems(actorDoc, eqItemsOnly);
  for (const createdItem of eqSync.createdItems) {
    embeddedDocs.push({
      key: `!actors.items!${_id}.${createdItem._id}`,
      typePath: '!actors.items!',
      doc: createdItem
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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
    type: r.type ?? 0, // 0 = Text, 1 = Document, 2 = Compendium
    text: r.text || '',
    img: r.img || 'icons/svg/d20-black.svg',
    documentCollection: r.documentCollection || null,
    documentId: r.documentId || null,
    weight: r.weight ?? 1,
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
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
    volume: s.volume ?? 0.8,
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
      lastModifiedBy: 'kL8nfmJOQTqjeU2x'
    }
  };
}

/**
 * Salva um documento construído diretamente na árvore src/packs/
 */
function saveToSourcePacks(packName, doc, embeddedDocs = []) {
  // Hook de validação e auto-reparação pré-persistência
  try {
    const {
      hookValidateAndRemediateActor,
      hookValidateAndRemediateItem,
      hookValidateAndRemediateJournal,
      hookValidateAndRemediateTable,
      hookValidateAndRemediateMacro
    } = require('./avrl-runner');

    if (packName === 'Ameacas_T20' && doc.type === 'npc') {
      const res = hookValidateAndRemediateActor(doc, embeddedDocs.map(e => e.doc || e));
      if (res.modified) {
        console.log(`[AVRL Hook] Ator "${doc.name}" saneado antes de salvar: ${res.anomalies.join('; ')}`);
      }
    } else if (packName === 'Itens_T20') {
      const res = hookValidateAndRemediateItem(doc, embeddedDocs.map(e => e.doc || e));
      if (res.modified) {
        console.log(`[AVRL Hook] Item "${doc.name}" saneado antes de salvar: ${res.anomalies.join('; ')}`);
      }
    } else if (packName === 'Diarios_T20') {
      hookValidateAndRemediateJournal(doc, embeddedDocs.map(e => e.doc || e));
    } else if (packName === 'Tabelas_T20') {
      hookValidateAndRemediateTable(doc, embeddedDocs.map(e => e.doc || e));
    } else if (packName === 'Macros_T20') {
      hookValidateAndRemediateMacro(doc);
    }
  } catch {
    // Hook resiliente
  }

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
  normalizeDamageType,
  normalizeRolls,
  normalizeExecucao,
  normalizeDuracao,
  normalizeAlcance,
  normalizeEffectChangeKey,
  normEquipStr,
  parseEquipmentLine,
  buildNpcEquipmentItem,
  syncActorEquipmentItems,
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

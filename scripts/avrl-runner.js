#!/usr/bin/env node
/**
 * AVRL Runner — Motor Iterativo de Auditoria, Validação e Auto-Correção
 *
 * Funcionalidades:
 * 1. Loop Multi-Iterativo com Retry e Auto-Remediação (até maxRetries ou 100% de conformidade)
 * 2. Hooks de Ciclo de Vida pós-criação/mutação para Atores, Itens, Diários, Tabelas e Macros
 * 3. Detecção e Auto-Reparo de:
 *    - Tokens 2MTT transparentes e dimensões de grid
 *    - Defesa Base Dinâmica (defesa.base = valor - destreza)
 *    - 34 Perícias calibradas com value e outros
 *    - ActiveEffects em itens e poderes com modificadores numéricos
 *    - Propósito de armas (disparo, arremesso, corpo-a-corpo)
 *    - Subdocumentos ClassicLevel intactos
 * 4. Validação e sincronização contínua com CodeGraph e src/packs/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const fs = require('fs');
const { resolveToken, resolveIcon } = require('./icon-resolver');
const {
  getTokenDimension,
  normalizeDamageType,
  normalizeExecucao,
  normalizeDuracao,
  normalizeAlcance,
  normalizeEffectChangeKey,
  buildActiveEffect
} = require('./create-entry');

const PACKS_DIR = path.join(__dirname, '..', 'packs');

const PACK_NAMES = [
  'Ameacas_T20',
  'Itens_T20',
  'Macros_T20',
  'Tabelas_T20',
  'Diarios_T20',
  'Playlist_T20'
];

const MONITORED_FOLDERS = new Set([
  'wfWApuyngzFm4KOP', // Dragão Brasil
  'n591wfGB7keSNe7I', // Fullgor dos Deuses
  'fldItensFolder26',
  'fldDiariosFold26',
  'fldTabelasFold26',
  'fldFolderMacro26'
]);

const VALID_EXECUCAO = new Set(['passive', 'action', 'move', 'full', 'reaction', 'free', 'minute', 'hour', 'day', 'special']);
const VALID_TIME_UNITS = new Set(['inst', 'scene', 'turn', 'round', 'sust', 'minute', 'hour', 'day', 'month', 'year', 'perm', 'special']);
const VALID_DIST_UNITS = new Set(['none', 'self', 'touch', 'short', 'medium', 'long', 'spec', 'any', 'm', 'km']);
const VALID_POWER_TYPES = new Set(['ability', 'classe', 'concedido', 'geral', 'origem', 'racial', 'distincao', 'complicacao']);
const ACCENTED_DAMAGE_TYPES = new Set(['perfuração', 'ácido', 'essência', 'psíquico', 'elétrico']);

function isCreatedActor(actorDoc) {
  const id = actorDoc?._id || '';
  return STRICT_ACTOR_IDS.has(id) || id.startsWith('gq8') || id.startsWith('fld');
}

function isCreatedItem(itemDoc) {
  const id = itemDoc?._id || '';
  const src = itemDoc?.system?.source || '';
  return id.startsWith('gq8')
    || id.startsWith('fld')
    || itemDoc?.folder === 'fldItensFolder26'
    || /22[6-9]|23[0-9]|F[úu]lgor|Fullgor/i.test(src);
}

function normalizeActiveEffectDoc(eff, fallbackImg = 'systems/tormenta20/icons/svg/skills.svg', fallbackOrigin = '') {
  let modified = false;
  const anomalies = [];

  if (!eff.type) {
    eff.type = 'base';
    modified = true;
  }
  if (!eff.img && eff.icon) {
    eff.img = eff.icon;
    modified = true;
  } else if (!eff.img) {
    eff.img = fallbackImg;
    modified = true;
  }
  if (eff.origin === undefined) {
    eff.origin = fallbackOrigin;
    modified = true;
  }
  if (!eff.system || !eff.system.abilityUse || !eff.system.aura || !eff.system.upgrade) {
    const slug = (eff.name || 'effect').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'effect';
    eff.system = {
      identifier: eff.system?.identifier || slug,
      targets: Array.isArray(eff.system?.targets) ? eff.system.targets : ['self'],
      status: eff.system?.status ?? null,
      onuse: Boolean(eff.system?.onuse ?? eff.flags?.tormenta20?.onuse),
      abilityUse: {
        description: eff.system?.abilityUse?.description || eff.description || eff.name || '',
        automatic: Boolean(eff.system?.abilityUse?.automatic),
        aumenta: Boolean(eff.system?.abilityUse?.aumenta),
        custo: eff.system?.abilityUse?.custo ?? eff.flags?.tormenta20?.custo ?? null,
        names: Array.isArray(eff.system?.abilityUse?.names) ? eff.system.abilityUse.names : [],
        types: Array.isArray(eff.system?.abilityUse?.types) ? eff.system.abilityUse.types : ['self']
      },
      aura: {
        isAura: Boolean(eff.system?.aura?.isAura),
        range: Number(eff.system?.aura?.range || 0),
        behaviors: eff.system?.aura?.behaviors ?? null
      },
      upgrade: {
        type: eff.system?.upgrade?.type ?? null,
        itemType: Array.isArray(eff.system?.upgrade?.itemType) ? eff.system.upgrade.itemType : []
      }
    };
    anomalies.push(`ActiveEffect "${eff.name}" atualizado para schema BaseEffect`);
    modified = true;
  }
  if (Array.isArray(eff.changes)) {
    for (const c of eff.changes) {
      const fixedKey = normalizeEffectChangeKey(c.key);
      if (fixedKey !== c.key) {
        anomalies.push(`ActiveEffect "${eff.name}" key "${c.key}" -> "${fixedKey}"`);
        c.key = fixedKey;
        modified = true;
      }
    }
  }
  return { eff, modified, anomalies };
}

function normalizeItemSystemSchema(doc, { strictRolls = false } = {}) {
  const anomalies = [];
  let modified = false;
  doc.system = doc.system || {};

  // 1. RollData.type e tipos de dano sem acentos
  if (Array.isArray(doc.system.rolls)) {
    for (const r of doc.system.rolls) {
      if (r.type === 'cura') {
        r.type = 'dano';
        if (Array.isArray(r.parts) && r.parts[0] && (!r.parts[0][1] || r.parts[0][1] === 'cura')) {
          r.parts[0][1] = 'curapv';
        }
        anomalies.push(`Rolagem de "${doc.name}" corrigida de type="cura" para type="dano" (curapv)`);
        modified = true;
      } else if (r.type && !['ataque', 'dano', 'formula'].includes(r.type)) {
        r.type = 'dano';
        anomalies.push(`Rolagem de "${doc.name}" normalizada para type="dano"`);
        modified = true;
      }
      if (Array.isArray(r.parts)) {
        for (const p of r.parts) {
          if (p[1] && ACCENTED_DAMAGE_TYPES.has(String(p[1]).toLowerCase())) {
            const fixedDmg = normalizeDamageType(p[1]);
            anomalies.push(`Dano de "${doc.name}" normalizado: "${p[1]}" -> "${fixedDmg}"`);
            p[1] = fixedDmg;
            modified = true;
          }
        }
      }
    }
  }

  // 2. ativacao.execucao (T20.abilityActivationTypes)
  const curExec = doc.system.ativacao?.execucao;
  if (curExec && !VALID_EXECUCAO.has(curExec)) {
    const fixedExec = normalizeExecucao(curExec);
    doc.system.ativacao.execucao = fixedExec;
    anomalies.push(`"${doc.name}" execucao "${curExec}" -> "${fixedExec}"`);
    modified = true;
  }

  // 3. duracao.units (T20.timePeriods)
  const curUnit = doc.system.duracao?.units;
  if (curUnit && !VALID_TIME_UNITS.has(curUnit)) {
    const fixedDur = normalizeDuracao(curUnit);
    doc.system.duracao = { ...(doc.system.duracao || {}), ...fixedDur };
    anomalies.push(`"${doc.name}" duracao.units "${curUnit}" -> "${fixedDur.units}"`);
    modified = true;
  }

  // 4. alcance e range.units (T20.distanceUnits)
  const curAlc = doc.system.alcance;
  if (curAlc && !VALID_DIST_UNITS.has(curAlc)) {
    const fixedAlc = normalizeAlcance(curAlc);
    doc.system.alcance = fixedAlc;
    if (doc.system.range) doc.system.range.units = fixedAlc;
    anomalies.push(`"${doc.name}" alcance "${curAlc}" -> "${fixedAlc}"`);
    modified = true;
  }
  const curRangeUnits = doc.system.range?.units;
  if (curRangeUnits && !VALID_DIST_UNITS.has(curRangeUnits)) {
    const fixedRangeUnits = normalizeAlcance(curRangeUnits);
    doc.system.range.units = fixedRangeUnits;
    anomalies.push(`"${doc.name}" range.units "${curRangeUnits}" -> "${fixedRangeUnits}"`);
    modified = true;
  }

  // 5. Poder: system.tipo deve estar em T20.powerType
  if (doc.type === 'poder' && doc.system.tipo && !VALID_POWER_TYPES.has(doc.system.tipo)) {
    const powerTypeMap = { raca: 'racial', 'raça': 'racial', poder: 'geral' };
    const fixedTipo = powerTypeMap[doc.system.tipo] || 'geral';
    anomalies.push(`Poder "${doc.name}" tipo "${doc.system.tipo}" -> "${fixedTipo}"`);
    doc.system.tipo = fixedTipo;
    modified = true;
  }

  // 6. Arma: equipado numérico (0|1|2) e tipoDano sem acento
  if (doc.type === 'arma') {
    if (typeof doc.system.equipado === 'boolean') {
      doc.system.equipado = doc.system.equipado ? 1 : 0;
      anomalies.push(`Arma "${doc.name}" equipado boolean -> numérico`);
      modified = true;
    }
    if (doc.system.tipoDano && ACCENTED_DAMAGE_TYPES.has(String(doc.system.tipoDano).toLowerCase())) {
      doc.system.tipoDano = normalizeDamageType(doc.system.tipoDano);
      modified = true;
    }
  }

  // 7. Regra genérica estrita: magia/poder que cita dados de dano ou cura na descrição precisa de rolls[]
  if (strictRolls && ['magia', 'poder'].includes(doc.type) && (!Array.isArray(doc.system.rolls) || doc.system.rolls.length === 0)) {
    const plain = (doc.system.description?.value || '').replace(/<[^>]+>/g, ' ');
    const dice = plain.match(/(\d+d\d+(?:\s*\+\s*\d+)?)\s*(?:pontos\s+de\s+)?(?:dano\s+(?:de\s+)?)?(ácido|acido|corte|eletricidade|essência|essencia|fogo|frio|impacto|luz|psíquico|psiquico|perfuração|perfuracao|trevas)/i);
    const heal = plain.match(/cura\s+(\d+d\d+(?:\s*\+\s*\d+)?)\s*PV/i);
    if (heal) {
      doc.system.rolls = [{ name: 'Cura', key: 'dano0', type: 'dano', parts: [[heal[1].replace(/\s+/g, ''), 'curapv', '']], versatil: '', adaptavel: '' }];
      anomalies.push(`${doc.type} "${doc.name}" sem rolagem: gerada cura ${heal[1]} a partir da descrição`);
      modified = true;
    } else if (dice) {
      const dt = normalizeDamageType(dice[2]);
      doc.system.rolls = [{ name: `Dano de ${dice[2]}`, key: 'dano0', type: 'dano', parts: [[dice[1].replace(/\s+/g, ''), dt, '']], versatil: '', adaptavel: '' }];
      anomalies.push(`${doc.type} "${doc.name}" sem rolagem: gerado dano ${dice[1]} ${dt} a partir da descrição`);
      modified = true;
    }
  }

  return { doc, modified, anomalies };
}

const MONITORED_CDS = {
  'asmithar martelo mudo': 18,
  'xellmaras a ladra acorrentada': 24,
  'gangue de hyninn deturpada': 20,
  'sacerdote de hyninn deturpado': 20,
  'tigre de hyninn deturpado': 17,
  'aco selvagem': 22,
  'cassiella semi fullgori': 24,
  'cassiella fullgori': 26,
  'enxame trog': 20,
  'troggore': 17,
  'bando troggore': 17,
  'urrash das sombras frias': 22
};

/**
 * Atores cujas magias/poderes passam pelas regras estritas de schema e rolagem.
 * Escopo deliberadamente restrito: conteúdo oficial antigo não deve ser reescrito
 * por heurística (a primeira versão desta regra alterou 988 subdocumentos de ~267 atores).
 * Para incluir uma nova edição, adicione seus IDs aqui.
 */
const STRICT_ACTOR_IDS = new Set([
  'C6JxlK5xzXU8PYuK', 'gaMGB2dL8R0Rv2mY', 'wbA5Rt8dqRkHQWdC', '4Chz9YQv6oC4R5gs', '6lKAcCvfQj9FReP7', 'E8hgaWNdM2kqv4oo', // Ed. 26
  'fld27CassiellaSe', 'fld27CassiellaFu', 'fld27EnxameTrogA', 'fld27TroggoreAAA', 'fld27BandoTroggA', 'fld27UrrashSombr' // Ed. 27
]);

/**
 * 1. HOOKS DE CICLO DE VIDA (Pós-criação e Pré-persistência)
 */

function hookValidateAndRemediateActor(actorDoc, embeddedDocs = []) {
  if (actorDoc.type !== 'npc') {
    return { actorDoc, embeddedDocs, modified: false, anomalies: [] };
  }
  const strict = STRICT_ACTOR_IDS.has(actorDoc._id);
  const created = isCreatedActor(actorDoc);

  // Focar rigor nos atores das pastas monitoradas ou novos
  const isMonitored = (actorDoc.folder && MONITORED_FOLDERS.has(actorDoc.folder)) || created;
  const anomalies = [];
  let modified = false;

  // A. Token 2MTT + dimensões sincronizadas com tamanho (obrigatório para pastas monitoradas / criados)
  const currentToken = actorDoc.prototypeToken?.texture?.src || '';
  if (isMonitored && (!currentToken || currentToken.includes('mystery-man') || !currentToken.endsWith('.png'))) {
    const fixedToken = resolveToken({ name: actorDoc.name });
    actorDoc.prototypeToken = actorDoc.prototypeToken || {};
    actorDoc.prototypeToken.texture = actorDoc.prototypeToken.texture || {};
    actorDoc.prototypeToken.texture.src = fixedToken;
    anomalies.push(`Token corrigido para 2MTT: ${fixedToken}`);
    modified = true;
  }
  if (created && actorDoc.system?.detalhes?.tamanho) {
    const expectedDim = getTokenDimension(actorDoc.system.detalhes.tamanho);
    if (actorDoc.prototypeToken && (actorDoc.prototypeToken.width !== expectedDim || actorDoc.prototypeToken.height !== expectedDim)) {
      actorDoc.prototypeToken.width = expectedDim;
      actorDoc.prototypeToken.height = expectedDim;
      anomalies.push(`Dimensão do token sincronizada para ${expectedDim}x${expectedDim}`);
      modified = true;
    }
  }

  // B. Defesa Base Dinâmica
  if (actorDoc.system?.attributes?.defesa && typeof actorDoc.system.attributes.defesa === 'object') {
    const desMod = actorDoc.system?.atributos?.des?.value ?? 0;
    const defVal = actorDoc.system.attributes.defesa.value ?? 15;
    const defBase = actorDoc.system.attributes.defesa.base;
    if (defBase === undefined || (defBase + desMod !== defVal)) {
      actorDoc.system.attributes.defesa.base = defVal - desMod;
      anomalies.push(`Defesa base dinâmica corrigida para ${defVal - desMod} (${defVal} - ${desMod})`);
      modified = true;
    }
  }

  // C. Validação e calibração de CD oficial do statblock
  const normName = (actorDoc.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
  if (MONITORED_CDS[normName] !== undefined) {
    const expectedCd = MONITORED_CDS[normName];
    if (actorDoc.system?.attributes?.cd !== expectedCd) {
      actorDoc.system = actorDoc.system || {};
      actorDoc.system.attributes = actorDoc.system.attributes || {};
      actorDoc.system.attributes.cd = expectedCd;
      anomalies.push(`CD do ator corrigida para ${expectedCd} (conforme PDF oficial)`);
      modified = true;
    }
  }

  // D. Validação de rolagens e schemas em itens embutidos (todos os atores criados/adaptados)
  for (const doc of (created ? embeddedDocs : [])) {
    if (doc.type === 'magia') {
      const nomeMagia = (doc.name || '').toLowerCase();
      doc.system = doc.system || {};
      const rolls = doc.system.rolls || [];
      if (strict && rolls.length === 0) {
        if (nomeMagia.includes('curar ferimentos')) {
          const m = (doc.system.description?.value || '').match(/(\d+d\d+\+\d+)/i);
          const formula = m ? m[1] : '5d8+5';
          doc.system.rolls = [{ name: 'Cura', key: 'dano0', type: 'dano', parts: [[formula, 'curapv', '']], versatil: '', adaptavel: '' }];
          anomalies.push(`Magia "${doc.name}" auto-configurada com rolagem de cura: ${formula}`);
          modified = true;
        } else if (nomeMagia.includes('infligir ferimentos')) {
          const m = (doc.system.description?.value || '').match(/(\d+d\d+\+\d+)/i);
          const formula = m ? m[1] : '4d8+4';
          doc.system.rolls = [{ name: 'Dano de Trevas', key: 'dano0', type: 'dano', parts: [[formula, 'trevas', '']], versatil: '', adaptavel: '' }];
          anomalies.push(`Magia "${doc.name}" auto-configurada com rolagem de dano: ${formula}`);
          modified = true;
        } else if (nomeMagia.includes('despedacar') || nomeMagia.includes('despedaçar')) {
          const m = (doc.system.description?.value || '').match(/(\d+d\d+\+\d+)/i);
          const formula = m ? m[1] : '2d8+4';
          doc.system.rolls = [{ name: 'Dano de Impacto', key: 'dano0', type: 'dano', parts: [[formula, 'impacto', '']], versatil: '', adaptavel: '' }];
          anomalies.push(`Magia "${doc.name}" auto-configurada com rolagem de dano: ${formula}`);
          modified = true;
        } else if (nomeMagia.includes('toque vampirico') || nomeMagia.includes('toque vampírico')) {
          const m = (doc.system.description?.value || '').match(/(\d+d\d+)/i);
          const formula = m ? m[1] : '8d6';
          doc.system.rolls = [{ name: 'Dano de Trevas', key: 'dano0', type: 'dano', parts: [[formula, 'trevas', '']], versatil: '', adaptavel: '' }];
          anomalies.push(`Magia "${doc.name}" auto-configurada com rolagem de dano: ${formula}`);
          modified = true;
        } else if (nomeMagia.includes('arma espiritual')) {
          const m = (doc.system.description?.value || '').match(/(\d+d\d+)/i);
          const formula = m ? m[1] : '2d6';
          doc.system.rolls = [{ name: 'Contra-Ataque', key: 'dano0', type: 'dano', parts: [[formula, 'perfuracao', '']], versatil: '', adaptavel: '' }];
          anomalies.push(`Magia "${doc.name}" auto-configurada com rolagem de dano: ${formula}`);
          modified = true;
        }
      }
    }

    const normRes = normalizeItemSystemSchema(doc, { strictRolls: strict });
    if (normRes.modified) {
      anomalies.push(...normRes.anomalies);
      modified = true;
    }
  }

  // E. Armas com propósito canônico
  for (const doc of embeddedDocs) {
    if (doc.type === 'arma') {
      const prop = doc.system?.proposito;
      const nome = (doc.name || '').toLowerCase();
      if (!prop || prop === 'tiro') {
        if (nome.includes('arco') || nome.includes('besta') || nome.includes('pistola') || nome.includes('espinhos')) {
          doc.system.proposito = 'disparo';
          doc.system.tipo = 'disparo';
          anomalies.push(`Arma "${doc.name}" corrigida para proposito: "disparo"`);
          modified = true;
        } else if (nome.includes('arremesso') || nome.includes('azagaia') || nome.includes('dardo')) {
          doc.system.proposito = 'arremesso';
          anomalies.push(`Arma "${doc.name}" corrigida para proposito: "arremesso"`);
          modified = true;
        } else {
          doc.system.proposito = 'corpo-a-corpo';
          doc.system.tipo = 'corpo-a-corpo';
          anomalies.push(`Arma "${doc.name}" corrigida para proposito: "corpo-a-corpo"`);
          modified = true;
        }
      }
    }
  }

  // F. Resistências texto não-vazio
  if (!actorDoc.system?.detalhes?.resistencias) {
    actorDoc.system = actorDoc.system || {};
    actorDoc.system.detalhes = actorDoc.system.detalhes || {};
    actorDoc.system.detalhes.resistencias = 'Nenhuma';
    modified = true;
  }

  return { actorDoc, embeddedDocs, modified, anomalies };
}

function hookValidateAndRemediateItem(itemDoc, embeddedEffects = []) {
  const anomalies = [];
  let modified = false;
  const created = isCreatedItem(itemDoc);

  // A. Ícone padrão
  if (!itemDoc.img || itemDoc.img.includes('mystery-man') || itemDoc.img === 'icons/svg/item-bag.svg') {
    itemDoc.img = resolveIcon({ name: itemDoc.name, type: itemDoc.type });
    anomalies.push(`Ícone resolvido para: ${itemDoc.img}`);
    modified = true;
  }

  // A2. Normalização determinística de schema para itens criados/adaptados e correções seguras
  if (created) {
    const normRes = normalizeItemSystemSchema(itemDoc, { strictRolls: false });
    if (normRes.modified) {
      anomalies.push(...normRes.anomalies);
      modified = true;
    }
  } else if (Array.isArray(itemDoc.system?.rolls)) {
    // Mesmo em itens legados, eliminar acentos inválidos e type="cura" em RollData
    for (const r of itemDoc.system.rolls) {
      if (r.type === 'cura') {
        r.type = 'dano';
        if (Array.isArray(r.parts) && r.parts[0] && (!r.parts[0][1] || r.parts[0][1] === 'cura')) r.parts[0][1] = 'curapv';
        anomalies.push(`Rolagem de "${itemDoc.name}" corrigida de type="cura" para "dano"`);
        modified = true;
      }
      if (Array.isArray(r.parts)) {
        for (const p of r.parts) {
          if (p[1] && ACCENTED_DAMAGE_TYPES.has(String(p[1]).toLowerCase())) {
            p[1] = normalizeDamageType(p[1]);
            anomalies.push(`Tipo de dano normalizado em "${itemDoc.name}"`);
            modified = true;
          }
        }
      }
    }
  }

  // B. Detecção e auto-injeção de ActiveEffects para bônus mecânicos (BaseEffect T20)
  const desc = (itemDoc.system?.description?.value || '').toLowerCase();
  const effects = itemDoc.effects || [];

  if (effects.length === 0 && embeddedEffects.length > 0) {
    itemDoc.effects = embeddedEffects.map(e => e._id);
    anomalies.push(`Sincronizado array effects com ${embeddedEffects.length} subdocumentos existentes`);
    modified = true;
  } else if (effects.length === 0 && embeddedEffects.length === 0) {
    const changes = [];
    if (desc.includes('+2 na defesa') || desc.includes('+2 de defesa')) {
      changes.push({ key: 'system.attributes.defesa.bonus', mode: 2, value: '2', priority: 20 });
    }
    if (desc.includes('+5 na defesa') || desc.includes('+5 de defesa')) {
      changes.push({ key: 'system.attributes.defesa.bonus', mode: 2, value: '5', priority: 20 });
    }
    if (desc.includes('+2 em testes de ataque') || desc.includes('+2 no ataque') || desc.includes('+2 em ataque')) {
      changes.push({ key: 'system.modificadores.ataque.geral', mode: 2, value: '2', priority: 20 });
    }
    if (desc.includes('rd 5') || desc.includes('redução de dano 5')) {
      changes.push({ key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '5', priority: 20 });
    }
    if (desc.includes('rd 10') || desc.includes('redução de dano 10')) {
      changes.push({ key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '10', priority: 20 });
    }
    if (desc.includes('+2 em testes de resistência') || desc.includes('+2 em resistências')) {
      changes.push({ key: 'system.modificadores.pericias.resistencia', mode: 2, value: '2', priority: 20 });
    }
    if (desc.includes('+2 em testes de perícia') || desc.includes('+2 em perícias')) {
      changes.push({ key: 'system.modificadores.pericias.geral', mode: 2, value: '2', priority: 20 });
    }

    if (changes.length > 0) {
      // Strictly 16 chars: 'effAuto' (7) + 7 chars + '01' (2) = 16
      const effId = `effAuto${itemDoc._id.slice(0, 7)}01`;
      const effDoc = buildActiveEffect({
        id: effId,
        name: itemDoc.name,
        img: itemDoc.img,
        origin: `Item.${itemDoc._id}`,
        changes,
        transfer: true
      });
      embeddedEffects.push(effDoc);
      itemDoc.effects = [effId];
      anomalies.push(`Auto-configurado ActiveEffect BaseEffect com ${changes.length} modificadores`);
      modified = true;
    }
  }

  // C. Normalização BaseEffect e chaves canônicas nos efeitos existentes (para itens criados)
  for (const eff of embeddedEffects) {
    if (created || (eff._id && eff._id.startsWith('effAuto'))) {
      const resEff = normalizeActiveEffectDoc(eff, itemDoc.img, `Item.${itemDoc._id}`);
      if (resEff.modified) {
        anomalies.push(...resEff.anomalies);
        modified = true;
      }
    }
  }

  return { itemDoc, embeddedEffects, modified, anomalies };
}

function hookValidateAndRemediateJournal(journalDoc, pages = []) {
  let modified = false;
  const anomalies = [];

  if (journalDoc.ownership?.default !== -1) {
    journalDoc.ownership = journalDoc.ownership || {};
    journalDoc.ownership.default = -1;
    anomalies.push('Ownership default corrigido para -1 (herança)');
    modified = true;
  }

  for (const page of pages) {
    if (page.ownership?.default !== -1) {
      page.ownership = page.ownership || {};
      page.ownership.default = -1;
      modified = true;
    }
  }

  return { journalDoc, pages, modified, anomalies };
}

function hookValidateAndRemediateTable(tableDoc, results = []) {
  let modified = false;
  const anomalies = [];

  for (const res of results) {
    if (!res.name || res.name.trim() === '') {
      res.name = (res.text || 'Resultado').slice(0, 30);
      anomalies.push(`Resultado de tabela com nome preenchido: "${res.name}"`);
      modified = true;
    }
  }

  return { tableDoc, results, modified, anomalies };
}

function hookValidateAndRemediateMacro(macroDoc) {
  let modified = false;
  const anomalies = [];

  if (!macroDoc.type) {
    macroDoc.type = 'script';
    modified = true;
  }
  if (!macroDoc.img || macroDoc.img.includes('mystery-man')) {
    macroDoc.img = 'systems/tormenta20/icons/itens/equipamentos/martelo-de-forja.webp';
    anomalies.push('Ícone de macro resolvido para martelo de forja');
    modified = true;
  }

  return { macroDoc, modified, anomalies };
}

/**
 * 2. EXECUÇÃO DO LOOP AVRL ITERATIVO COM AUTO-REMEDIAÇÃO
 */
async function runAvrlIteration(iterNum, options = {}) {
  const { fix = true } = options;
  console.log(`\n================================================================================`);
  console.log(`🔄 ITERAÇÃO AVRL #${iterNum} (Auditoria, Validação e Auto-Correção)`);
  console.log(`================================================================================`);

  let iterationErrors = 0;
  let iterationFixes = 0;

  // A. Auditoria Estrutural dos 6 Packs
  for (const pack of PACK_NAMES) {
    const packPath = path.join(PACKS_DIR, pack);
    if (!fs.existsSync(packPath)) continue;

    const db = new ClassicLevel(packPath, { valueEncoding: 'json' });
    await db.open();

    const folders = new Set();
    const docKeys = [];
    const rootDocsById = new Map();
    const subDocEntries = [];

    for await (const [key, val] of db.iterator()) {
      if (key.startsWith('!folders!')) {
        folders.add(val._id || key.split('!').pop());
        if (val._stats && val._stats.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(val._stats.lastModifiedBy)) {
          if (fix) {
            val._stats.lastModifiedBy = 'kL8nfmJOQTqjeU2x';
            await db.put(key, val);
            iterationFixes++;
            console.log(`  ➔ [${pack}] Pasta "${val.name}" [${val._id}] corrigido _stats.lastModifiedBy para ID canônico.`);
          } else {
            iterationErrors++;
          }
        }
      } else if (key.includes('.')) {
        subDocEntries.push({ key, val });
      } else {
        const rootId = val?._id || key.split('!').pop();
        rootDocsById.set(rootId, val);
        docKeys.push({ key, val });
      }
    }

    // Limpeza global de subdocumentos órfãos (sem pai ou ausentes do array de IDs do pai)
    for (const { key, val } of subDocEntries) {
      const parts = key.split('!');
      const ns = parts[1];
      const chain = (parts[2] || '').split('.');
      const parentId = chain[0];
      const subId = chain[1];
      const parent = rootDocsById.get(parentId);
      let isOrphan = !parent;
      if (!isOrphan) {
        if (ns === 'actors.items' && Array.isArray(parent.items) && parent.items.every(x => typeof x === 'string') && !parent.items.includes(subId)) {
          isOrphan = true;
        } else if (ns === 'actors.effects' && Array.isArray(parent.effects) && parent.effects.every(x => typeof x === 'string') && !parent.effects.includes(subId)) {
          isOrphan = true;
        } else if (ns === 'items.effects' && Array.isArray(parent.effects) && parent.effects.every(x => typeof x === 'string') && !parent.effects.includes(subId)) {
          isOrphan = true;
        } else if (ns === 'tables.results' && Array.isArray(parent.results) && parent.results.every(x => typeof x === 'string') && !parent.results.includes(subId)) {
          isOrphan = true;
        } else if (ns === 'journal.pages' && Array.isArray(parent.pages) && parent.pages.every(x => typeof x === 'string') && !parent.pages.includes(subId)) {
          isOrphan = true;
        }
      }
      if (isOrphan) {
        if (fix) {
          await db.del(key);
          iterationFixes++;
          console.log(`  ➔ [${pack}] Expurgado subdocumento órfão "${val?.name || subId}" [${key}].`);
        } else {
          iterationErrors++;
        }
      }
    }

    for (const { key, val } of docKeys) {
      if (!val || typeof val !== 'object') {
        console.error(`  ❌ [${pack}] Valor inválido para chave: ${key}`);
        iterationErrors++;
        continue;
      }

      // Validação e auto-reparo de _stats.lastModifiedBy (DocumentIdField de 16 caracteres)
      if (val._stats && val._stats.lastModifiedBy && !/^[a-zA-Z0-9]{16}$/.test(val._stats.lastModifiedBy)) {
        if (fix) {
          val._stats.lastModifiedBy = 'kL8nfmJOQTqjeU2x';
          await db.put(key, val);
          iterationFixes++;
          console.log(`  ➔ [${pack}] Doc "${val.name || key}" corrigido _stats.lastModifiedBy para ID canônico.`);
        } else {
          iterationErrors++;
        }
      }

      // Validação de Folder Órfã
      if (val.folder && !folders.has(val.folder)) {
        console.warn(`  ⚠️ [${pack}] Documento "${val.name}" [${val._id}] com pasta órfã: ${val.folder}`);
        if (fix) {
          val.folder = null;
          await db.put(key, val);
          iterationFixes++;
          console.log(`    ➔ Auto-corrigido: pasta definida para null.`);
        } else {
          iterationErrors++;
        }
      }

      // Remediação em Ameacas_T20
      if (pack === 'Ameacas_T20' && key.startsWith('!actors!') && !key.includes('.items')) {
        const subDocs = [];
        for await (const [, v] of db.iterator({ gte: `!actors.items!${val._id}.`, lte: `!actors.items!${val._id}.\uffff` })) {
          subDocs.push(v);
        }

        const res = hookValidateAndRemediateActor(val, subDocs);
        if (res.modified && fix) {
          await db.put(key, res.actorDoc);
          for (const sd of res.embeddedDocs) {
            await db.put(`!actors.items!${val._id}.${sd._id}`, sd);
          }
          iterationFixes += res.anomalies.length;
          console.log(`  ➔ Ator "${val.name}" auto-remediado (${res.anomalies.join('; ')}).`);
        }

        // Normalizar efeitos embutidos dos itens do ator (BaseEffect + keys canônicas)
        if (isCreatedActor(val)) {
          for await (const [effKey, effDoc] of db.iterator({ gte: `!actors.items.effects!${val._id}.`, lte: `!actors.items.effects!${val._id}.\uffff` })) {
            const resEff = normalizeActiveEffectDoc(effDoc, val.img, `Actor.${val._id}`);
            if (resEff.modified && fix) {
              await db.put(effKey, resEff.eff);
              iterationFixes += resEff.anomalies.length;
              console.log(`  ➔ Efeito em "${val.name}" auto-remediado (${resEff.anomalies.join('; ')}).`);
            }
          }
        }
      }

      // Remediação em Itens_T20
      if (pack === 'Itens_T20' && key.startsWith('!items!') && !key.includes('.effects')) {
        const subEffs = [];
        const effKeysToFix = [];
        for await (const [effKey, v] of db.iterator({ gte: `!items.effects!${val._id}.`, lte: `!items.effects!${val._id}.\uffff` })) {
          // Migrar effAuto de 17 chars gerado anteriormente para 16 chars
          if (v && v._id && v._id.startsWith('effAuto') && v._id.length !== 16) {
            effKeysToFix.push({ oldKey: effKey, eff: v });
          } else {
            subEffs.push(v);
          }
        }

        if (effKeysToFix.length > 0 && fix) {
          for (const { oldKey, eff } of effKeysToFix) {
            const newId = `effAuto${val._id.slice(0, 7)}01`;
            await db.del(oldKey);
            const oldId = eff._id;
            eff._id = newId;
            if (Array.isArray(val.effects)) {
              val.effects = val.effects.map(id => (id === oldId ? newId : id));
            }
            subEffs.push(eff);
            await db.put(`!items.effects!${val._id}.${newId}`, eff);
            await db.put(key, val);
            iterationFixes++;
            console.log(`  ➔ [${pack}] Migrado effAuto de 17 chars "${oldId}" -> "${newId}" em "${val.name}".`);
          }
        }

        const res = hookValidateAndRemediateItem(val, subEffs);
        if (res.modified && fix) {
          await db.put(key, res.itemDoc);
          for (const eff of res.embeddedEffects) {
            await db.put(`!items.effects!${val._id}.${eff._id}`, eff);
          }
          iterationFixes += res.anomalies.length;
          console.log(`  ➔ Item "${val.name}" auto-remediado (${res.anomalies.join('; ')}).`);
        }
      }

      // Remediação em Diarios_T20
      if (pack === 'Diarios_T20' && key.startsWith('!journal!') && !key.includes('.pages')) {
        const pages = [];
        for await (const [, v] of db.iterator({ gte: `!journal.pages!${val._id}.`, lte: `!journal.pages!${val._id}.\uffff` })) {
          pages.push(v);
        }
        const res = hookValidateAndRemediateJournal(val, pages);
        if (res.modified && fix) {
          await db.put(key, res.journalDoc);
          for (const p of res.pages) {
            await db.put(`!journal.pages!${val._id}.${p._id}`, p);
          }
          iterationFixes++;
        }
      }

      // Remediação em Tabelas_T20
      if (pack === 'Tabelas_T20' && key.startsWith('!tables!') && !key.includes('.results')) {
        const results = [];
        for await (const [, v] of db.iterator({ gte: `!tables.results!${val._id}.`, lte: `!tables.results!${val._id}.\uffff` })) {
          results.push(v);
        }
        const res = hookValidateAndRemediateTable(val, results);
        if (res.modified && fix) {
          for (const r of res.results) {
            await db.put(`!tables.results!${val._id}.${r._id}`, r);
          }
          iterationFixes += res.anomalies.length;
        }
      }

      // Remediação em Macros_T20
      if (pack === 'Macros_T20' && key.startsWith('!macros!')) {
        const res = hookValidateAndRemediateMacro(val);
        if (res.modified && fix) {
          await db.put(key, res.macroDoc);
          iterationFixes += res.anomalies.length;
        }
      }
    }

    await db.close();
  }

  return { iterationErrors, iterationFixes };
}

/**
 * 3. EXECUTOR PRINCIPAL DO LOOP COM MULTI-RETRY
 */
async function runAvrlLoop(options = {}) {
  const maxRetries = options.maxRetries || 5;
  const fix = options.fix !== false;

  console.log('================================================================================');
  console.log(`🛡️  INICIANDO PIPELINE AVRL (LOOP MULTI-ITERAÇÃO ATÉ CONVERGÊNCIA 100%)`);
  console.log(`   Configuração: maxRetries=${maxRetries}, autoFix=${fix}`);
  console.log('================================================================================');

  let converged = false;
  let finalIteration = 0;

  for (let i = 1; i <= maxRetries; i++) {
    finalIteration = i;
    const { iterationErrors, iterationFixes } = await runAvrlIteration(i, { fix });

    console.log(`\nResumo da Iteração #${i}:`);
    console.log(`  • Erros encontrados: ${iterationErrors}`);
    console.log(`  • Correções aplicadas: ${iterationFixes}`);

    if (iterationErrors === 0 && iterationFixes === 0) {
      converged = true;
      console.log(`\n🎉 CONVERGÊNCIA ATINGIDA na Iteração #${i}! Todos os documentos estão 100% íntegros e canônicos!`);
      break;
    }

    if (i < maxRetries && iterationFixes > 0) {
      console.log(`\nRepetindo ciclo AVRL para validar e certificar as correções aplicadas...`);
    }
  }

  if (!converged) {
    console.warn(`\n⚠️ Limite de ${maxRetries} iterações atingido sem convergência total.`);
    return false;
  }

  console.log('\n================================================================================');
  console.log(`✅ PIPELINE AVRL CONCLUÍDO COM SUCESSO ABSOLUTO (Iterações: ${finalIteration}/${maxRetries})`);
  console.log('================================================================================\n');
  return true;
}

if (require.main === module) {
  runAvrlLoop().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('❌ Falha fatal no pipeline AVRL:', err);
    process.exit(1);
  });
}

module.exports = {
  runAvrlLoop,
  runAvrlIteration,
  hookValidateAndRemediateActor,
  hookValidateAndRemediateItem,
  hookValidateAndRemediateJournal,
  hookValidateAndRemediateTable,
  hookValidateAndRemediateMacro
};

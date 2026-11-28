#!/usr/bin/env node
/**
 * Validador e Auditor Profundo de Fidelidade de Fichas (PDF vs LevelDB)
 *
 * Checagens Críticas Inegociáveis:
 * 1. Ataques à Distância: Qualquer criatura com ataques à distância na ficha
 *    DEVE possuir itens do tipo "arma" com system.proposito em ['disparo', 'arremesso', 'corpo-a-corpo-arremesso']
 *    e alcance configurado, garantindo exibição em i.ranged no Foundry VTT.
 * 2. Poderes e Habilidades: Todas as habilidades do bloco de estatísticas do PDF
 *    devem existir como itens individuais atômicos no LevelDB.
 * 3. Resistências e Imunidades: system.detalhes.resistencias e system.tracos.ic/resistencias
 *    devem ser 100% fiéis ao bloco de estatísticas.
 * 4. Percepção e Sentidos Situacionais: Sentidos específicos de terreno devem estar
 *    mapeados com custom: true.
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { normEquipStr, parseEquipmentLine } = require('./create-entry');
const { MONITORED_EQUIPAMENTOS } = require('./avrl-runner');
const { discoverPacksFromModuleJson } = require('./pack-discovery');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let totalErrors = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ ERRO: ${message}`);
    totalErrors++;
  }
}

async function loadAllActorRecords() {
  const actorPacks = discoverPacksFromModuleJson(ROOT_DIR).filter(p => p.type === 'Actor');
  const records = new Map();
  for (const p of actorPacks) {
    if (!fs.existsSync(p.absPath)) continue;
    const db = new ClassicLevel(p.absPath, { valueEncoding: 'json' });
    await db.open();
    const actors = new Map();
    const itemsByActor = new Map();
    for await (const [k, v] of db.iterator()) {
      if (k.startsWith('!actors!') && !k.includes('.')) {
        actors.set(v._id, v);
      } else if (k.startsWith('!actors.items!')) {
        const actorId = (k.split('!')[2] || '').split('.')[0];
        if (!itemsByActor.has(actorId)) itemsByActor.set(actorId, []);
        itemsByActor.get(actorId).push(v);
      }
    }
    await db.close();
    for (const [id, actorDoc] of actors.entries()) {
      records.set(id, { actorDoc, items: itemsByActor.get(id) || [] });
    }
  }
  return records;
}

async function runFidelityAudit() {
  console.log('================================================================================');
  console.log('🛡️  AUDITORIA PROFUNDA DE FIDELIDADE DE FICHAS (FOUNDRY VTT MENACE DATA MODEL)');
  console.log('================================================================================\n');

  const actorRecords = await loadAllActorRecords();

  // Regras de Verificação de Fidelidade Específica por Ator
  const expectations = [
    // --- DB #232 ---
    {
      id: 'gq8232LoboUrbAAA',
      name: 'Lobisomem Predador Urbano',
      expectedPowers: ['Ataque Furtivo', 'Empatia com Lobos', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232LoboCacAAA',
      name: 'Lobisomem Caçador de Recompensas',
      hasRanged: true,
      rangedName: 'Besta Leve',
      expectedPowers: ['Empatia com Lobos', 'Maldição da Licantropia', 'Marca da Presa', 'Mudança de Forma', 'Veneno (Peçonha Potente)', 'Aversão a Mitral'],
      expectedResistencias: 'imunidade a medo, redução de dano 5/mitral',
      expectedPerceptions: ['perc_subterraneo']
    },
    {
      id: 'gq8232RatoComAAA',
      name: 'Licantropo Rato Comedor de Restos',
      hasRanged: true,
      rangedName: 'Besta Leve',
      expectedPowers: ['Dentes de Roedor', 'Empatia com Ratos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232RatoInfAAA',
      name: 'Licantropo Rato Infiltrador Veterano',
      hasRanged: true,
      rangedName: 'Arco Longo',
      expectedPowers: ['Dentes de Roedor', 'Empatia com Ratos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232OncaPirAAA',
      name: 'Licantropo Onça Pirata de Rio',
      hasRanged: true,
      rangedName: 'Pistola',
      expectedPowers: ['Correr pelo Cordame', 'Emboscar', 'Empatia com Onças', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Pernas do Mar', 'Saque Rápido', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232OncaLutAAA',
      name: 'Licantropo Onça Lutador de Arena',
      expectedPowers: ['Emboscar', 'Empatia com Onças', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Presas de Adamante', 'Rasteira', 'Voadora Feral', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232TexuFurAAA',
      name: 'Licantropo Texugo Furioso',
      expectedPowers: ['Durão', 'Empatia com Texugos', 'Fúria', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral',
      expectedPerceptions: ['perc_subterraneo']
    },
    {
      id: 'gq8232TexuNoiAAA',
      name: 'Licantropo Texugo Servo da Noite',
      expectedPowers: ['Armadura de Ossos', 'Durão', 'Empatia com Texugos', 'Magia Natural', 'Maldição da Licantropia', 'Mudança de Forma', 'Sorte Salvadora', 'Visão nas Trevas', 'Aversão a Mitral'],
      expectedSpells: ['Armamento da Natureza', 'Curar Ferimentos', 'Miasma Mefítico', 'Toque Vampírico'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232SelaFarAAA',
      name: 'Licantropo Selako Farejador de Sangue',
      hasRanged: true,
      rangedName: 'Azagaia',
      expectedPowers: ['Dentes Afiados', 'Faro do Selako', 'Empatia com Selakos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232SelaTerAAA',
      name: 'Licantropo Selako Terror dos Mares',
      hasRanged: true,
      rangedName: 'Azagaia',
      expectedPowers: ['Caçador Submarino', 'Dentes Afiados', 'Destruidor', 'Empatia com Selakos', 'Faro do Selako', 'Fúria Feral', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de corte 5, redução de dano 5/mitral'
    },
    {
      id: 'gq8232MamaeGlopA',
      name: 'Mamãe Glop',
      expectedPowers: ['Glops Filhinhos', 'Meiose Glópica'],
      expectedResistencias: 'imunidade a ácido'
    },
    {
      id: 'gq8232EstirgeAAA',
      name: 'Estirge',
      expectedPowers: ['Agarrar Aprimorado (Livre)', 'Chupar Sangue (Livre)', 'Sangrar']
    },
    {
      id: 'gq8232PerdTrollA',
      name: 'Perdigueiro Troll',
      expectedPowers: ['Agarrar Aprimorado (Livre)', 'Derrubar (Livre)', 'Natureza Vegetal'],
      expectedResistencias: 'imunidade a atordoamento e metamorfose'
    },
    {
      id: 'gq8232GineTrollA',
      name: 'Ginete de Troll Purista',
      expectedPowers: ['Corcel Troll', 'Investida Atroz', 'Ódio Puro']
    },
    {
      id: 'gq8232XamaFinntA',
      name: 'Xamã Finntroll',
      expectedPowers: ['Natureza Vegetal', 'Urro Divino', 'Intolerância a Luz'],
      expectedSpells: ['Amedrontar', 'Curar Ferimentos', 'Escudo da Fé', 'Perdição'],
      expectedResistencias: 'cura acelerada 5/ácido ou fogo, imunidade a atordoamento e metamorfose'
    },

    // --- DB #231 ---
    {
      id: 'gq8231RessecSaqA',
      name: 'Ressecado Saqueador',
      hasRanged: true,
      rangedName: 'Arco Curto',
      expectedPowers: ['Celeridade Odiosa', 'Ódio aos Vivos']
    },
    {
      id: 'gq8231RessecLidA',
      name: 'Ressecado Líder',
      hasRanged: true,
      rangedName: 'Arco Curto',
      expectedPowers: ['Celeridade Odiosa', 'Ódio aos Vivos', 'Ordens Letais']
    },
    {
      id: 'gq8231ManticZumb',
      name: 'Mantícora Zumbi',
      hasRanged: true,
      rangedName: 'Espinhos',
      expectedPowers: ['Fraqueza Zumbi', 'Mordida']
    },

    // --- DB #230 ---
    {
      id: 'gq8KArzak230AAAA',
      name: 'Arzak',
      hasRanged: true,
      rangedName: 'Adaga',
      expectedPowers: ['Um com as Sombras', 'Evasão Aprimorada', 'Manobras Evasivas', 'Sangrento']
    },
    // --- Fúlgor dos Deuses: Edição 26 (Forja da Vingança) ---
    {
      id: 'C6JxlK5xzXU8PYuK',
      name: 'Asmithar Martelo-Mudo',
      expectedCd: 18,
      expectedPowers: ['Armamento Sagrado', 'Desprezo pelo Ordinário'],
      expectedResistencias: 'imunidade a medo, redução de dano 5'
    },
    {
      id: 'gaMGB2dL8R0Rv2mY',
      name: 'Xellmaras, a Ladra Acorrentada',
      expectedCd: 24,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Ataque Furtivo +3d6', 'Correntes Deturpadas', 'Especialista Abissal', 'Sadismo', 'Talho Atroz', 'Chave que se Fecha'],
      expectedResistencias: 'evasão, imunidade a ácido e veneno, redução de dano 10; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)'
    },
    {
      id: 'wbA5Rt8dqRkHQWdC',
      name: 'Gangue de Hyninn Deturpada',
      expectedCd: 20,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'No Alma Dói Mais', 'Truque de Luzes'],
      expectedResistencias: 'imunidade a efeitos de movimento, acertos críticos, cansaço, metabolismo, metamorfose e paralisia'
    },
    {
      id: '4Chz9YQv6oC4R5gs',
      name: 'Sacerdote de Hyninn Deturpado',
      expectedCd: 20,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Bênção do Gatuno', 'Forma de Macaco Pamgra', 'Malandragem Divina'],
      expectedSpells: ['Arma Espiritual', 'Curar Ferimentos', 'Despedaçar'],
      expectedSpellRolls: ['Arma Espiritual', 'Curar Ferimentos', 'Despedaçar'],
      expectedResistencias: 'imunidade a efeitos mentais, acertos críticos, cansaço, metabolismo, metamorfose e paralisia'
    },
    {
      id: '6lKAcCvfQj9FReP7',
      name: 'Tigre-de-Hyninn Deturpado',
      expectedCd: 17,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Borrão Dourado', 'Reflexo Planar'],
      expectedResistencias: 'imunidade a confuso, acertos críticos, cansaço, metabolismo, metamorfose e paralisia; resistência a devotos +5'
    },
    {
      id: 'E8hgaWNdM2kqv4oo',
      name: 'Aço Selvagem',
      expectedCd: 22,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Agarrar Aprimorado', 'Ecos do Fullgor', 'Engolir', 'Corpo de Metal Fundido', 'Resfriamento Forçado'],
      expectedResistencias: 'imunidade a eletricidade, fogo, efeitos de medo, acertos críticos, cansaço, metabolismo, metamorfose e paralisia; redução de dano 10; vulnerabilidade a frio'
    },
    // --- Fúlgor dos Deuses: Edição 27 (Dia e Noite) ---
    {
      id: 'fld27CassiellaSe',
      name: 'Cassiella semi-fullgori',
      expectedCd: 24,
      expectedPowers: ['Derrubar', 'Durão', 'Espada Luminosa', 'Luz Sagrada'],
      expectedResistencias: 'redução de dano 5'
    },
    {
      id: 'fld27CassiellaFu',
      name: 'Cassiella fullgori',
      expectedCd: 26,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Asa-Escudo', 'Luz Fustigante', 'Rasante Luminoso'],
      hasRanged: true,
      rangedName: 'Azagaias Fullgori',
      expectedResistencias: 'imunidade a fogo e luz, redução de dano 10, resistência a magia divina +5; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)'
    },
    {
      id: 'fld27EnxameTrogA',
      name: 'Enxame Trog',
      expectedCd: 20,
      expectedPowers: ['Mau Cheiro Coletivo', 'Sangue Frio'],
      expectedResistencias: 'vulnerabilidade a frio (sofre +1 de dano por dado de frio)'
    },
    {
      id: 'fld27TroggoreAAA',
      name: 'Troggore',
      expectedCd: 17,
      expectedPowers: ['Escolhido de Tenebra', 'Mau Cheiro', 'Sanguinolência', 'Sangue Frio', 'Sensibilidade a Luz'],
      expectedResistencias: 'vulnerabilidade a frio, sensibilidade a luz'
    },
    {
      id: 'fld27BandoTroggA',
      name: 'Bando Troggore',
      expectedCd: 17,
      expectedPowers: ['Mau Cheiro', 'Devoção Protetora', 'Sanguinolência', 'Sangue Frio', 'Sensibilidade a Luz'],
      expectedResistencias: 'vulnerabilidade a frio, sensibilidade a luz'
    },
    {
      id: 'fld27UrrashSombr',
      name: 'Urrash das Sombras Frias',
      expectedCd: 22,
      expectedPowers: ['Passo Sombrio', 'Visão nas Trevas', 'Devoção à Tenebra', 'Sangue Frio'],
      expectedSpells: ['Curar Ferimentos', 'Escuridão', 'Infligir Ferimentos', 'Perdição', 'Profanar', 'Toque Vampírico'],
      expectedSpellRolls: ['Curar Ferimentos', 'Infligir Ferimentos', 'Toque Vampírico'],
      expectedResistencias: 'vulnerabilidade a frio, devoção a tenebra (enjoado e perde PM ao sol)'
    },
    // --- Fúlgor dos Deuses: Edição 28 (Aço e Arcano) ---
    {
      id: 'fld28LiriavelQui',
      name: 'Liriavel, Forma de Quimera',
      expectedCd: 26,
      expectedPowers: ['Mente Tripla', 'Cabeça de Bode', 'Cabeça de Dragão', 'Cabeça de Leão'],
      expectedResistencias: 'Nenhuma'
    },
    {
      id: 'fld28RashidFullg',
      name: 'Rashid, Fullgori',
      expectedCd: 30,
      expectedPowers: ['Teofagia', 'Imunidades Fullgori', 'Criatura do Fullgor', 'Contramágica Aprimorada', 'Magia Acelerada', 'Zelador da Academia Arcana'],
      expectedSpells: ['Amarras Etéreas', 'Controlar Terra', 'Dissipar Magia', 'Jato Corrosivo'],
      expectedSpellRolls: ['Amarras Etéreas', 'Jato Corrosivo'],
      expectedPerceptions: ['ofic_arquiteto'],
      expectedResistencias: 'imunidade a encantamento e ácido, redução de dano 10; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)'
    },
    // --- Fúlgor dos Deuses: Edição 29 (Dor Profunda) ---
    {
      id: 'fld29GuardiaoAbi',
      name: 'Guardião do Lamento Abissal',
      expectedCd: 24,
      expectedPowers: ['Agarrar Aprimorado', 'Constrição', 'Encastelar-se', 'Fluxo Circular', 'Maior que a Morte', 'Templo'],
      expectedResistencias: 'imunidade a frio, maior que a morte, redução de dano 5, vulnerabilidade a eletricidade'
    },
    {
      id: 'fld29NamasqallAb',
      name: 'Namasqall Abandonado',
      expectedCd: 31,
      expectedPowers: ['Agarrar Aprimorado', 'Constrição', 'Corpo Torrencial', 'Maremoto', 'Olho da Tempestade'],
      expectedResistencias: 'imunidade a acertos críticos, atordoado, cansaço, efeitos de metabolismo, frio e paralisia, vulnerabilidade a fogo'
    }
  ];

  for (const exp of expectations) {
    const rec = actorRecords.get(exp.id);
    if (!rec) {
      assert(false, `Ator "${exp.name}" [${exp.id}] NÃO encontrado no LevelDB.`);
      continue;
    }
    const actorDoc = rec.actorDoc;
    const items = rec.items;

    const itemNames = items.map(i => i.name);
    console.log(`Auditorando "${exp.name}" (${items.length} itens)...`);

    // 0. Verificação de Zero Subdocumentos Órfãos
    assert(items.length === (actorDoc.items || []).length, `${exp.name} não possui subdocumentos órfãos no LevelDB (DB=${items.length}, actor.items=${(actorDoc.items || []).length})`);

    // 0.1 Verificação de CD Oficial
    if (exp.expectedCd !== undefined) {
      assert(actorDoc.system?.attributes?.cd === exp.expectedCd, `${exp.name} possui CD oficial ${exp.expectedCd} (obtido: ${actorDoc.system?.attributes?.cd})`);
    }

    // 0.2 Verificação de Schemas Tormenta20 em todos os itens embutidos (execucao, alcance, duracao, RollData)
    const validExec = new Set(['passive', 'action', 'move', 'full', 'reaction', 'free', 'minute', 'hour', 'day', 'special']);
    const validTimeUnitsAll = new Set(['inst', 'scene', 'turn', 'round', 'sust', 'minute', 'hour', 'day', 'month', 'year', 'perm', 'special']);
    const validDistAll = new Set(['none', 'self', 'touch', 'short', 'medium', 'long', 'spec', 'any', 'm', 'km']);
    const accentedDmg = new Set(['perfuração', 'ácido', 'essência', 'psíquico', 'elétrico']);
    for (const it of items) {
      if (it.system?.ativacao?.execucao) {
        assert(validExec.has(it.system.ativacao.execucao), `Item "${it.name}" de ${exp.name} possui execucao válida (${it.system.ativacao.execucao})`);
      }
      if (it.system?.duracao?.units) {
        assert(validTimeUnitsAll.has(it.system.duracao.units), `Item "${it.name}" de ${exp.name} possui duracao.units válido (${it.system.duracao.units})`);
      }
      if (it.system?.alcance) {
        assert(validDistAll.has(it.system.alcance), `Item "${it.name}" de ${exp.name} possui alcance válido (${it.system.alcance})`);
      }
      for (const r of (it.system?.rolls || [])) {
        assert(['ataque', 'dano', 'formula'].includes(r.type), `Rolagem de "${it.name}" em ${exp.name} possui type válido (${r.type})`);
        for (const p of (r.parts || [])) {
          assert(!accentedDmg.has(String(p[1] || '').toLowerCase()), `Rolagem de "${it.name}" em ${exp.name} usa tipo de dano sem acento (${p[1]})`);
        }
      }
    }

    // 1. Verificação de Ataques à Distância
    if (exp.hasRanged) {
      const rangedWeapons = items.filter(i =>
        i.type === 'arma' &&
        ['arremesso', 'corpo-a-corpo-arremesso', 'disparo'].includes(i.system?.proposito)
      );
      assert(rangedWeapons.length > 0, `${exp.name} possui arma com proposito em ['disparo', 'arremesso'] (encontradas ${rangedWeapons.length})`);
      if (exp.rangedName) {
        const found = rangedWeapons.some(w => w.name.toLowerCase().includes(exp.rangedName.toLowerCase()));
        assert(found, `${exp.name} possui ataque à distância específico "${exp.rangedName}"`);
      }
    }

    // 2. Verificação de Poderes Esperados
    if (exp.expectedPowers) {
      for (const p of exp.expectedPowers) {
        assert(itemNames.includes(p), `${exp.name} possui o poder/habilidade "${p}"`);
      }
    }

    // 3. Verificação de Magias Esperadas e Rolagens
    if (exp.expectedSpells) {
      const validTimeUnits = new Set(['inst', 'scene', 'turn', 'round', 'sust', 'minute', 'hour', 'day', 'month', 'year', 'perm', 'special']);
      const validDist = new Set(['none', 'self', 'touch', 'short', 'medium', 'long', 'spec', 'any']);

      for (const s of exp.expectedSpells) {
        const spell = items.find(i => i.name === s && i.type === 'magia');
        assert(Boolean(spell), `${exp.name} possui a magia individual "${s}" de tipo "magia"`);
        if (spell) {
          assert(validTimeUnits.has(spell.system?.duracao?.units), `Magia "${s}" de ${exp.name} possui duracao.units válido (${spell.system?.duracao?.units})`);
          assert(validDist.has(spell.system?.alcance), `Magia "${s}" de ${exp.name} possui alcance válido (${spell.system?.alcance})`);
          if (exp.expectedSpellRolls && exp.expectedSpellRolls.includes(s)) {
            const rolls = spell.system?.rolls || [];
            assert(rolls.length > 0, `Magia "${s}" de ${exp.name} possui rolagem estruturada em rolls[]`);
            for (const r of rolls) {
              assert(['ataque', 'dano', 'formula'].includes(r.type), `Rolagem de "${s}" possui type válido em RollData (${r.type})`);
            }
          }
        }
      }
    }

    // 4. Verificação de Percepções Situacionais
    if (exp.expectedPerceptions) {
      for (const pKey of exp.expectedPerceptions) {
        assert(actorDoc.system?.pericias?.[pKey]?.custom === true, `${exp.name} possui percepção situacional customizada "${pKey}"`);
      }
    }

    // 5. Verificação de Resistências
    if (exp.expectedResistencias) {
      const res = actorDoc.system?.detalhes?.resistencias || '';
      assert(res === exp.expectedResistencias, `${exp.name} possui detalhes.resistencias exato: esperado "${exp.expectedResistencias}", obtido "${res}"`);
    }

    // 6. Verificação de Equipamento Oficial & Itens Embutidos no Ator
    const normActorName = normEquipStr(exp.name);
    if (MONITORED_EQUIPAMENTOS[normActorName] !== undefined) {
      const expectedEq = MONITORED_EQUIPAMENTOS[normActorName];
      assert(actorDoc.system?.detalhes?.equipamento === expectedEq, `${exp.name} possui detalhes.equipamento oficial preenchido`);
    }
    const eqEntries = parseEquipmentLine(actorDoc.system?.detalhes?.equipamento || '');
    for (const entry of eqEntries) {
      const isShield = entry.norm.includes('escudo');
      const matched = items.find(it => {
        if (isShield && it.type !== 'equipamento') return false;
        const dn = normEquipStr(it.name);
        if (dn === entry.norm || dn.includes(entry.norm) || entry.norm.includes(dn)) return true;
        const baseWord = entry.norm.split(' ')[0];
        return !isShield && baseWord.length >= 4 && dn.includes(baseWord) && it.type === 'arma';
      });
      assert(Boolean(matched), `${exp.name} possui item real embutido para equipamento "${entry.name}"`);
    }
    for (const it of items) {
      if (it.type === 'equipamento') {
        assert(it.system?.equipado === false, `Equipamento "${it.name}" em ${exp.name} tem equipado=false para não duplicar Defesa/PDA`);
      }
    }

    console.log(`  ✓ "${exp.name}" auditado e conforme.`);
  }

  // 7. Cobertura universal da linha detalhes.equipamento e itens embutidos para todos os atores em MONITORED_EQUIPAMENTOS
  for (const { actorDoc, items: subItems } of actorRecords.values()) {
    const normActorName = normEquipStr(actorDoc.name);
    if (MONITORED_EQUIPAMENTOS[normActorName] === undefined) continue;
    const expectedEq = MONITORED_EQUIPAMENTOS[normActorName];
    assert(actorDoc.system?.detalhes?.equipamento === expectedEq, `[Global] ${actorDoc.name} possui detalhes.equipamento oficial preenchido`);
    const eqEntries = parseEquipmentLine(actorDoc.system?.detalhes?.equipamento || '');
    for (const entry of eqEntries) {
      const isShield = entry.norm.includes('escudo');
      const matched = subItems.find(it => {
        if (isShield && it.type !== 'equipamento') return false;
        const dn = normEquipStr(it.name);
        if (dn === entry.norm || dn.includes(entry.norm) || entry.norm.includes(dn)) return true;
        const baseWord = entry.norm.split(' ')[0];
        return !isShield && baseWord.length >= 4 && dn.includes(baseWord) && it.type === 'arma';
      });
      assert(Boolean(matched), `[Global] ${actorDoc.name} possui item real embutido para equipamento "${entry.name}"`);
    }
    for (const it of subItems) {
      if (it.type === 'equipamento') {
        assert(it.system?.equipado === false, `[Global] Equipamento "${it.name}" em ${actorDoc.name} tem equipado=false`);
      }
    }
  }

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO NA AUDITORIA DE FIDELIDADE!');
  } else {
    console.error(`❌ FALHA: ${totalErrors} discrepâncias detectadas.`);
    process.exit(1);
  }
  console.log('================================================================================\n');
}

if (require.main === module) {
  runFidelityAudit().catch(err => {
    console.error('Erro fatal na auditoria:', err);
    process.exit(1);
  });
}

module.exports = { runFidelityAudit };

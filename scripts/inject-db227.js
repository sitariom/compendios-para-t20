const fs = require('fs');
const path = require('path');
const { ClassicLevel } = require('classic-level');

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

async function injectPowers() {
  console.log('--- 1. Injetando Poderes de Combate em Itens_T20 ---');
  const raw = fs.readFileSync('/tmp/db227_powers_extracted.json', 'utf8');
  const powers = JSON.parse(raw);

  const db = new ClassicLevel('packs/Itens_T20', { valueEncoding: 'utf8' });
  await db.open();

  let count = 0;
  for (const p of powers) {
    const id = generateId();
    let img = 'icons/svg/sword.svg';
    if (p.name.includes('Escudo') || p.name.includes('Defesa') || p.name.includes('Bloqueio')) {
      img = 'icons/svg/shield.svg';
    } else if (p.name.includes('Flecha') || p.name.includes('Disparo') || p.name.includes('Arco') || p.name.includes('Atirar')) {
      img = 'icons/svg/target.svg';
    } else if (p.name.includes('Esquiva') || p.name.includes('Correr') || p.name.includes('Ginete') || p.name.includes('Aéreo')) {
      img = 'icons/svg/wingfoot.svg';
    } else if (p.name.includes('Costas') || p.name.includes('Retomar')) {
      img = 'icons/svg/upgrade.svg';
    }

    // Determine activation
    let execucao = 'padrao';
    let custo = 0;
    const pmMatch = p.description.match(/(\d+)\s*PM/);
    if (pmMatch) custo = parseInt(pmMatch[1], 10);

    if (/reação|como reação/i.test(p.description)) {
      execucao = 'reaction';
    } else if (/ação livre/i.test(p.description)) {
      execucao = 'livre';
    } else if (/ação completa/i.test(p.description)) {
      execucao = 'completa';
    } else if (/ação de movimento/i.test(p.description)) {
      execucao = 'movimento';
    } else if (/ação padrão/i.test(p.description)) {
      execucao = 'padrao';
    }

    const doc = {
      _id: id,
      name: p.name,
      type: 'poder',
      img,
      system: {
        description: {
          value: `<p>${p.description}</p>${p.prereq ? `<p><strong>Pré-requisito:</strong> ${p.prereq}.</p>` : ''}`,
          unidentified: ''
        },
        source: 'Dragão Brasil #227 (Caverna do Saber: Poderes e Combos)',
        ativacao: {
          execucao,
          custo,
          qtd: '',
          condicao: '',
          special: ''
        },
        duracao: { value: 0, units: 'inst', special: '' },
        range: { value: null, units: '' },
        efeito: '',
        alcance: '',
        area: '',
        resistencia: { pericia: '', atributo: '', bonus: 0, txt: '' },
        tipo: 'geral',
        subtipo: 'combate',
        chatFlavor: 'Poder de combate da DB #227.',
        origin: '',
        tags: ['dragao-brasil', 'db227', 'combate'],
        chatGif: '',
        rolltags: [],
        automationtags: [],
        rolls: []
      },
      effects: [],
      folder: '6HZCPG5QrmzhwmBe', // Folder "Poderes"
      sort: 80000000 + count * 1000,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!items!${id}`, JSON.stringify(doc));
    count++;
  }

  await db.close();
  console.log(`✓ ${count} poderes injetados em Itens_T20.`);
}

async function injectActors() {
  console.log('--- 2. Injetando Ameaças em Ameacas_T20 ---');
  const raw = fs.readFileSync('/tmp/db227_actors_extracted.json', 'utf8');
  const actors = JSON.parse(raw);

  const db = new ClassicLevel('packs/Ameacas_T20', { valueEncoding: 'utf8' });
  await db.open();

  let count = 0;
  for (const a of actors) {
    const actorId = generateId();
    const itemIds = [];

    // Save embedded items
    for (const item of a.itens) {
      const itemId = generateId();
      itemIds.push(itemId);

      let itemDoc;
      if (item.type === 'arma') {
        itemDoc = {
          _id: itemId,
          name: item.name,
          type: 'arma',
          img: item.img || 'icons/svg/sword.svg',
          system: {
            description: { value: item.text, unidentified: '' },
            source: 'Dragão Brasil #227',
            tipo: 'cac',
            subtipo: 'simples',
            dano: item.dano || '1d8',
            critico: item.critico || '20',
            bonus: parseInt(item.ataque.replace('+', ''), 10) || 0,
            rolls: []
          },
          effects: [],
          flags: {},
          _stats: statsHeader
        };
      } else {
        itemDoc = {
          _id: itemId,
          name: item.name,
          type: 'poder',
          img: item.img || 'icons/svg/hazard.svg',
          system: {
            description: { value: item.text, unidentified: '' },
            source: 'Dragão Brasil #227',
            tipo: 'ameaca',
            subtipo: '',
            rolls: []
          },
          effects: [],
          flags: {},
          _stats: statsHeader
        };
      }

      await db.put(`!actors.items!${actorId}.${itemId}`, JSON.stringify(itemDoc));
    }

    // Build Actor document
    const nivel = parseInt(a.nd, 10) || 1;
    const meionivel = Math.floor(nivel / 2);
    const treino = nivel >= 7 ? 4 : 2;

    const periciasObj = {};
    for (const [pk, val] of Object.entries(a.pericias)) {
      periciasObj[pk] = {
        atributo: pk === 'luta' ? 'for' : (pk === 'pontaria' ? 'des' : (pk === 'fortitude' ? 'con' : (pk === 'reflexos' ? 'des' : 'sab'))),
        treinado: true,
        st: false,
        pda: false,
        size: false,
        value: val - meionivel,
        outros: 0,
        condi: 0,
        bonus: [],
        custom: false,
        label: pk.charAt(0).toUpperCase() + pk.slice(1)
      };
    }

    const actorDoc = {
      _id: actorId,
      name: a.name,
      type: 'npc',
      img: a.name === 'Lynel' ? 'icons/svg/combat.svg' : 'icons/svg/hazard.svg',
      system: {
        attributes: {
          cd: 0,
          pv: { value: a.pv, temp: 0, min: 0, max: a.pv },
          pm: { value: a.pm, temp: 0, min: 0, max: a.pm },
          defesa: {
            atributo: 'des',
            pda: 0,
            value: a.defesa,
            base: a.defesa,
            outros: 0,
            condi: 0,
            bonus: []
          },
          carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
          sentidos: { value: [], custom: a.sentidos },
          conjuracao: 'int',
          nivel: { value: nivel, xp: { value: 0, pct: 0, proximo: 0 } },
          movement: {
            burrow: { base: 0, bonus: [] },
            climb: { base: 0, bonus: [] },
            fly: { base: a.deslocamento.includes('voo') ? 9 : 0, bonus: [] },
            swim: { base: 0, bonus: [] },
            walk: { base: parseInt(a.deslocamento.match(/\d+/)[0], 10), bonus: [] },
            hover: false,
            unit: 'm',
            tags: []
          },
          treino,
          nd: a.nd,
          meionivel
        },
        pericias: periciasObj,
        modificadores: {
          custoPM: 0,
          atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
          ataque: { geral: [], cac: [], ad: [] },
          cura: { geral: [], mag: [] },
          dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
          pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
        },
        detalhes: {
          biography: { value: a.biography, public: '' },
          origem: '',
          divindade: '',
          raca: a.tipo === 'mon' ? 'Monstro' : (a.tipo === 'con' ? 'Construto' : 'Morto-vivo'),
          tipo: a.tipo,
          tamanho: a.tamanho,
          equipamento: a.equipamento,
          resistencias: a.resistencias,
          tesouro: a.tesouro,
          role: a.name === 'Lynel' ? 'solo' : 'padrao',
          ataquescac: '',
          movimento: a.deslocamento,
          ataquesad: ''
        }
      },
      items: itemIds,
      folder: 'wfWApuyngzFm4KOP', // Folder "Dragão Brasil"
      sort: 70000000 + count * 1000,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!actors!${actorId}`, JSON.stringify(actorDoc));
    count++;
  }

  await db.close();
  console.log(`✓ ${count} atores e seus respectivos itens injetados em Ameacas_T20.`);
}

async function injectJournal() {
  console.log('--- 3. Injetando Diário em Diarios_T20 ---');
  const raw = fs.readFileSync('/tmp/db227_journal_extracted.json', 'utf8');
  const journal = JSON.parse(raw);

  const db = new ClassicLevel('packs/Diarios_T20', { valueEncoding: 'utf8' });
  await db.open();

  const journalId = generateId();
  const pageIds = [];

  let pageIndex = 1;
  for (const page of journal.pages) {
    const pageId = generateId();
    pageIds.push(pageId);

    const pageDoc = {
      _id: pageId,
      name: page.name,
      type: 'text',
      title: { show: true, level: 1 },
      text: { content: page.content, format: 1 },
      image: {},
      video: { controls: true, volume: 1 },
      src: null,
      system: {},
      sort: pageIndex * 100000,
      ownership: { default: -1 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!journal.pages!${journalId}.${pageId}`, JSON.stringify(pageDoc));
    pageIndex++;
  }

  const journalDoc = {
    _id: journalId,
    name: journal.name,
    pages: pageIds,
    folder: 'GTXWZvyrw7KEEBbp', // Livros T20 e Regras
    sort: 500000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!journal!${journalId}`, JSON.stringify(journalDoc));
  await db.close();
  console.log(`✓ Diário "${journal.name}" com ${pageIds.length} páginas injetado em Diarios_T20.`);
}

async function main() {
  await injectPowers();
  await injectActors();
  await injectJournal();
  console.log('=== Injeção completa da Dragão Brasil #227 com sucesso! ===');
}

main().catch(console.error);

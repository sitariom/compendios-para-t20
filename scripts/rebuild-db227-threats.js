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

// Skill list for Tormenta20 (all 34 skills)
const ALL_SKILLS = [
  { key: 'acro', nome: 'Acrobacia', atributo: 'des' },
  { key: 'ades', nome: 'Adestramento', atributo: 'car' },
  { key: 'atle', nome: 'Atletismo', atributo: 'for' },
  { key: 'atua', nome: 'Atuação', atributo: 'car' },
  { key: 'cava', nome: 'Cavalgar', atributo: 'des' },
  { key: 'conh', nome: 'Conhecimento', atributo: 'int' },
  { key: 'cura', nome: 'Cura', atributo: 'sab' },
  { key: 'dipl', nome: 'Diplomacia', atributo: 'car' },
  { key: 'enga', nome: 'Enganação', atributo: 'car' },
  { key: 'fort', nome: 'Fortitude', atributo: 'con' },
  { key: 'furt', nome: 'Furtividade', atributo: 'des' },
  { key: 'guer', nome: 'Guerra', atributo: 'int' },
  { key: 'inic', nome: 'Iniciativa', atributo: 'des' },
  { key: 'inti', nome: 'Intimidação', atributo: 'car' },
  { key: 'intu', nome: 'Intuição', atributo: 'sab' },
  { key: 'inve', nome: 'Investigação', atributo: 'int' },
  { key: 'joga', nome: 'Jogatina', atributo: 'car' },
  { key: 'ladi', nome: 'Ladinagem', atributo: 'des' },
  { key: 'luta', nome: 'Luta', atributo: 'for' },
  { key: 'mist', nome: 'Misticismo', atributo: 'int' },
  { key: 'nobr', nome: 'Nobreza', atributo: 'car' },
  { key: 'perc', nome: 'Percepção', atributo: 'sab' },
  { key: 'pilo', nome: 'Pilotagem', atributo: 'des' },
  { key: 'pont', nome: 'Pontaria', atributo: 'des' },
  { key: 'refl', nome: 'Reflexos', atributo: 'des' },
  { key: 'reli', nome: 'Religião', atributo: 'sab' },
  { key: 'sobr', nome: 'Sobrevivência', atributo: 'sab' },
  { key: 'vont', nome: 'Vontade', atributo: 'sab' },
  { key: 'alfa', nome: 'Ofício (Alfaiate)', atributo: 'int' },
  { key: 'alqu', nome: 'Ofício (Alquimia)', atributo: 'int' },
  { key: 'arme', nome: 'Ofício (Armeiro)', atributo: 'int' },
  { key: 'arte', nome: 'Ofício (Artesão)', atributo: 'int' },
  { key: 'cozi', nome: 'Ofício (Culinária)', atributo: 'int' },
  { key: 'enge', nome: 'Ofício (Engenharia)', atributo: 'int' }
];

function buildSkills(ndNum, atributos, trainedSkills) {
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
      // Formula: VALOR_PERICIA = VALOR_INFORMADO_FICHA - BONUS_ND - VALOR_ATRIBUTO - BONUS_TREINADO_ND
      const val = fichaVal - meionivel - atrMod - treino;
      pericias[s.key] = {
        atributo: s.atributo,
        treinado: true,
        st: false,
        pda: false,
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
        st: false,
        pda: false,
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

function buildWeaponItem(data) {
  return {
    _id: data.id || generateId(),
    name: data.name,
    type: 'arma',
    img: data.img || 'icons/svg/sword.svg',
    system: {
      description: {
        value: data.description || '',
        unidentified: ''
      },
      carregado: true,
      peso: data.peso || 0,
      proficiencia: data.proficiencia || 'natural',
      empunhadura: data.empunhadura || 'uma',
      criticoM: data.criticoM || 20,
      criticoX: data.criticoX || 2,
      ataques: data.ataques || 1,
      equipado: 0,
      equipado2: { slot: 0, type: '' },
      tipoUso: 'sim',
      proposito: data.proposito || 'corpo-a-corpo',
      size: data.size || 'normal',
      propriedades: {
        ada: false, agi: false, alo: false, des: false, dup: false, ver: false, hib: false,
        ...(data.propriedades)
      },
      source: data.source || 'Dragão Brasil #227',
      espacos: 1,
      qtd: 1,
      preco: 0,
      pv: { value: 0, min: 0, max: 0 },
      rd: 0,
      alcance: data.alcance || '',
      origin: '',
      tags: data.tags || ['dragao-brasil', 'db227'],
      rolltags: [],
      chatFlavor: data.chatFlavor || '',
      chatGif: '',
      ativacao: {
        custo: null,
        condicao: '',
        execucao: '',
        qtd: '',
        special: ''
      },
      consume: {
        amount: null,
        mpMultiplier: false,
        target: '',
        type: ''
      },
      upgrades: {
        melhoria1: '', melhoria2: '', melhoria3: '', melhoria4: '',
        material: '', encanto1: '', encanto2: '', encanto3: ''
      },
      melhorias: {},
      encantos: {},
      rolls: data.rolls || []
    },
    effects: data.effects || [],
    flags: {},
    _stats: statsHeader
  };
}

function buildPowerItem(data) {
  return {
    _id: data.id || generateId(),
    name: data.name,
    type: 'poder',
    img: data.img || 'icons/svg/aura.svg',
    system: {
      description: {
        value: data.description || '',
        unidentified: ''
      },
      source: data.source || 'Dragão Brasil #227',
      ativacao: {
        execucao: data.execucao || 'padrao',
        custo: data.custo || 0,
        qtd: '',
        condicao: data.condicao || '',
        special: ''
      },
      duracao: {
        value: data.duracaoValue || 0,
        units: data.duracaoUnits || 'inst',
        special: ''
      },
      target: { value: null, width: null, type: '' },
      range: { value: null, units: '' },
      consume: { type: '', target: '', amount: null, mpMultiplier: false },
      efeito: data.efeito || '',
      alcance: data.alcance || '',
      alvo: data.alvo || '',
      area: data.area || '',
      resistencia: {
        pericia: data.resistenciaPericia || '',
        atributo: '',
        bonus: 0,
        txt: data.resistenciaTxt || ''
      },
      tipo: 'ability',
      subtipo: '',
      chatFlavor: data.chatFlavor || '',
      origin: '',
      tags: data.tags || ['dragao-brasil', 'db227'],
      chatGif: '',
      rolltags: [],
      rolls: data.rolls || []
    },
    effects: data.effects || [],
    flags: {},
    _stats: statsHeader
  };
}

async function rebuildThreats() {
  console.log('--- RECONSTRUINDO AMEAÇAS DA DRAGÃO BRASIL #227 ---');
  const db = new ClassicLevel('packs/Ameacas_T20', { valueEncoding: 'json' });

  // 1. Remover o Oxxdon duplicado incorreto
  console.log('Removendo duplicata quebrada de Oxxdon (!actors!LN8RlwsnDhqnpdLg)...');
  await db.del('!actors!LN8RlwsnDhqnpdLg');
  for await (const [key] of db.iterator()) {
    if (key.startsWith('!actors.items!LN8RlwsnDhqnpdLg.')) {
      await db.del(key);
    }
  }

  // -------------------------------------------------------------
  // THREAT 1: LYNEL (ND 12, Chefe de Fase)
  // -------------------------------------------------------------
  const lynelId = '6jcy63pS6TLhCoHm';
  console.log(`Atualizando Lynel [${lynelId}]...`);
  
  // Limpar itens antigos do Lynel
  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${lynelId}.`)) {
      await db.del(key);
    }
  }

  const lynelItems = [
    buildWeaponItem({
      name: 'Espada Bastarda e Escudo Lynel',
      img: 'icons/weapons/swords/sword-broad-crystal.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d10+27, crítico 19/x3 (corte). Uma vez por rodada, ao acertar um alvo, o Lynel pode fazer uma manobra de combate como ação livre contra ele (teste +36).</p>',
      proficiencia: 'exotica',
      empunhadura: 'uma',
      criticoM: 19,
      criticoX: 3,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      size: 'aumentada',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*URRRRGH!*"</blockquote><p>O Lynel golpeia com sua <span style="color: #800000; font-weight: bold;">espada maciça e impõe seu escudo</span> com força esmagadora.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['5d10+27', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Alabarda Lynel',
      img: 'icons/weapons/polearms/halberd-axe.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d10+27, crítico x4 (corte/perfuração). Quando acerta um ataque, o alvo é empurrado 3m na direção oposta ao Lynel e fica caído (Fortitude ou Reflexos CD 33 evita).</p>',
      proficiencia: 'marcial',
      empunhadura: 'duas',
      criticoM: 20,
      criticoX: 4,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      size: 'aumentada',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*BAM!*"</blockquote><p>A lâmina curva da alabarda arremessa o oponente longe com um <span style="color: #800000; font-weight: bold;">impacto estrondoso</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['5d10+27', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Machado de Guerra Lynel',
      img: 'icons/weapons/axes/axe-double-large.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 5d12+27, crítico x4 (corte). Uma vez por rodada, ao acertar um ataque, o Lynel pode fazer um único ataque adicional com o machado contra outro alvo no alcance.</p>',
      proficiencia: 'marcial',
      empunhadura: 'duas',
      criticoM: 20,
      criticoX: 4,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      size: 'aumentada',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*SHHHRRRK!*"</blockquote><p>O machado colossal corta o ar em um arco devastador gerando uma <span style="color: #800000; font-weight: bold;">varredura sangrenta</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['5d12+27', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Tacape Lynel',
      img: 'icons/weapons/clubs/club-spiked-bone.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 6d10+27, crítico x4 (impacto). Quando acerta um ataque, o alvo fica atordoado (Reflexos CD 33 evita).</p>',
      proficiencia: 'simples',
      empunhadura: 'duas',
      criticoM: 20,
      criticoX: 4,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      size: 'aumentada',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*KRAKOOOM!*"</blockquote><p>O peso esmagador do tacape desaba com a força de um <span style="color: #800000; font-weight: bold;">terremoto atordoante</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['6d10+27', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Mordida',
      img: 'icons/creatures/abilities/mouth-teeth-fangs.webp',
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> 4d10+25, crítico 19 (perfuração).</p>',
      proficiencia: 'natural',
      empunhadura: 'uma',
      criticoM: 19,
      criticoX: 2,
      ataques: 1,
      proposito: 'corpo-a-corpo',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*ROAAAR!*"</blockquote><p>Presas de felino colossal fecham-se sobre a presa com <span style="color: #800000; font-weight: bold;">voracidade implacável</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['4d10+25', 'perfuracao', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Garras',
      img: 'icons/skills/melee/unarmed-punch-fist.webp',
      description: '<p><strong>Ataque Natural Corpo a Corpo (x2):</strong> 4d8+25, crítico 19 (corte). Caso seja desarmado, o Lynel pode continuar atacando com duas garras e sua mordida.</p>',
      proficiencia: 'natural',
      empunhadura: 'duas',
      criticoM: 19,
      criticoX: 2,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*SLASH!*"</blockquote><p>Garras bestiais rasgam armaduras e carnes com <span style="color: #800000; font-weight: bold;">violência primal</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['4d8+25', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Arco de Guerra Lynel',
      img: 'icons/weapons/bows/shortbow-recurve-gold.webp',
      description: '<p><strong>Ataque à Distância (x2 disparos):</strong> 4d12+25, crítico x3 (perfuração).</p>',
      proficiencia: 'exotica',
      empunhadura: 'duas',
      criticoM: 20,
      criticoX: 3,
      ataques: 2,
      proposito: 'disparo',
      alcance: 'medio',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*TWANG!*"</blockquote><p>Flechas pesadas voam com precisão cirúrgica, prontas para <span style="color: #800000; font-weight: bold;">empalar intrusos à distância</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['pont', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['4d12+25', 'perfuracao', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Sopro de Fogo',
      img: 'icons/magic/fire/projectile-wave-arrow.webp',
      description: '<p><strong>Ação Padrão:</strong> Todas as criaturas em um cone de 12m sofrem 14d12 pontos de dano de fogo e ficam em chamas (Reflexos CD 33 reduz o dano à metade e evita a condição). <em>Recarga: ação de movimento.</em></p>',
      execucao: 'padrao',
      area: 'cone de 12m',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 33 reduz à metade e evita ficar em chamas.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*FWOOOOSH!*"</blockquote><p>Um turbilhão de chamas infernais jorra das mandíbulas do Lynel, transformando o solo em <span style="color: #800000; font-weight: bold;">cinzas incandescentes</span>.</p></div>',
      rolls: [
        {
          name: 'Dano de Fogo',
          key: 'dano0',
          type: 'dano',
          parts: [['14d12', 'fogo', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Brado Indomável',
      img: 'icons/magic/sonic/scream-wail-shout-red.webp',
      description: '<p><strong>Ação Padrão:</strong> Se o Lynel ainda não tiver sido alvo da ação agredir, ele emite um rugido ameaçador que deixa todos os oponentes em alcance curto apavorados por 1d4+1 rodadas (Vontade CD 33 muda para abalado). <em>Efeito de Medo.</em></p>',
      execucao: 'padrao',
      alcance: 'curto',
      resistenciaPericia: 'vont',
      resistenciaTxt: 'Vontade CD 33 muda para abalado.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*ROOOOAAARRRRGH!*"</blockquote><p>O rugido ensurdecedor abala as próprias estruturas da terra e infunde <span style="color: #800000; font-weight: bold;">pavor nos corações dos mais bravos</span>.</p></div>',
      rolls: [
        {
          name: 'Duração (Rodadas)',
          key: 'formula0',
          type: 'formula',
          parts: [['1d4+1', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Investida Galopante',
      img: 'icons/skills/movement/horse-running-charging-flame.webp',
      description: '<p><strong>Ação Completa:</strong> O Lynel faz uma investida. Ele pode passar pelo espaço ocupado por criaturas menores que ele, pode continuar se movendo depois do ataque e, se acertar, causa +4d10 pontos de dano. Criaturas no caminho percorrido pelo Lynel sofrem 1d12+10 pontos de dano de impacto e ficam caídas (Reflexos CD 33 evita).</p>',
      execucao: 'completa',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 33 evita 1d12+10 de dano de impacto e a condição caído.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*TUM-DUM-TUM-DUM!*"</blockquote><p>O Lynel galopa como um meteoro vivo, <span style="color: #800000; font-weight: bold;">atropelando tudo em seu caminho</span>.</p></div>',
      rolls: [
        {
          name: 'Dano Extra no Ataque',
          key: 'danoExtra0',
          type: 'dano',
          parts: [['4d10', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Atropelamento',
          key: 'danoAtropela1',
          type: 'dano',
          parts: [['1d12+10', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Coice Oportuno',
      img: 'icons/skills/melee/unarmed-kick-flaming.webp',
      description: '<p><strong>Reação:</strong> Uma vez por rodada, quando uma criatura erra um ataque corpo a corpo contra o Lynel por 5 ou mais, ele causa 4d8+25 pontos de dano de impacto na criatura (Reflexos CD 33 evita). Se a criatura estava se beneficiando de flanquear o Lynel, ela é considerada desprevenida contra esse golpe.</p>',
      execucao: 'reaction',
      resistenciaPericia: 'refl',
      resistenciaTxt: 'Reflexos CD 33 evita o dano de impacto.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*WHAM!*"</blockquote><p>Com reflexos sobrenaturais, os cascos traseiros disparam em um <span style="color: #800000; font-weight: bold;">coice fulminante</span>.</p></div>',
      rolls: [
        {
          name: 'Dano do Coice',
          key: 'dano0',
          type: 'dano',
          parts: [['4d8+25', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Armamento Lynel',
      img: 'icons/tools/smithing/anvil.webp',
      description: '<p>O Lynel possui uma das seguintes opções de armamento:</p><ul><li><strong>Espada bastarda e escudo:</strong> (5d10+27, 19/x3). Uma vez por rodada, ao acertar um alvo, pode fazer uma manobra de combate como ação livre (teste +36).</li><li><strong>Alabarda:</strong> (5d10+27, x4). Quando acerta um ataque, o alvo é empurrado 3m na direção oposta ao Lynel e fica caído (Fortitude ou Reflexos CD 33 evita).</li><li><strong>Machado de guerra:</strong> (5d12+27, x4). Uma vez por rodada, ao acertar um ataque, o Lynel pode fazer um único ataque adicional com o machado contra outro alvo no alcance.</li><li><strong>Tacape:</strong> (6d10+27, x4). Quando acerta um ataque, o alvo fica atordoado (Reflexos CD 33 evita).</li></ul>',
      execucao: 'passive',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><p>Mestre absoluto de armas ancestrais e forjadas com <span style="color: #800000; font-weight: bold;">letalidade incomparável</span>.</p></div>'
    })
  ];

  const itemIdsLynel = [];
  for (const item of lynelItems) {
    itemIdsLynel.push(item._id);
    await db.put(`!actors.items!${lynelId}.${item._id}`, item);
  }

  const lynelAtr = { for: 10, des: 8, con: 8, int: -1, sab: 5, car: -2 };
  const lynelPericias = buildSkills(12, lynelAtr, {
    inic: 18, perc: 16, fort: 26, refl: 20, vont: 12,
    atle: 22, inti: 14, sobr: 20, luta: 36, pont: 32
  });

  const lynelDoc = {
    _id: lynelId,
    name: 'Lynel',
    type: 'npc',
    img: 'icons/creatures/mammals/lion-prowling-glowing-red.webp',
    system: {
      atributos: {
        for: { value: 10, base: 10, racial: 0, bonus: 0 },
        des: { value: 8, base: 8, racial: 0, bonus: 0 },
        con: { value: 8, base: 8, racial: 0, bonus: 0 },
        int: { value: -1, base: -1, racial: 0, bonus: 0 },
        sab: { value: 5, base: 5, racial: 0, bonus: 0 },
        car: { value: -2, base: -2, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: 33,
        pv: { value: 600, temp: 0, min: 0, max: 600 },
        pm: { value: 0, temp: 0, min: 0, max: 0 },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: 43,
          base: 35, // 43 - Des (8) = 35 para que Foundry compute 35 + 8 = 43
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
        sentidos: { value: [], custom: 'Faro, visão na penumbra' },
        conjuracao: '',
        nivel: { value: 12, xp: { value: 0, pct: 0, proximo: 0 } },
        movement: {
          burrow: { base: 0, bonus: [] },
          climb: { base: 0, bonus: [] },
          fly: { base: 0, bonus: [] },
          swim: { base: 0, bonus: [] },
          walk: { base: 15, bonus: [] },
          hover: false,
          unit: 'm',
          tags: []
        },
        treino: 4,
        nd: '12',
        meionivel: 6
      },
      pericias: lynelPericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      detalhes: {
        biography: {
          value: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"Você ousa cruzar as fronteiras do meu território, verme? Deixe suas armas na relva e fuja agora, ou seu crânio adornará meu próximo tacape."<br><span style="font-weight: bold; color: #800000;">&mdash; Lynel, Fera Guardiã dos Ermos</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Pelas barbas de Arsenal e pela pena sagrada de Valkar! Aquilo não é um mero centauro! Ele disparava três flechas em chamas do tamanho de lanças e quando nos aproximamos, sacou um machado maior que uma carroça. Mal conseguimos escapar vivos escalando a colina!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Lynel</span> é uma criatura colossal de poder ancestral, dotado do corpo maciço de um corcel de guerra, torso humanoide couraçado de músculos de aço e a cabeça temível de um leão predador. Adaptado de <em>The Legend of Zelda</em> para <em>Tormenta20</em> (Dragão Brasil #227), o Lynel atua como um verdadeiro <strong>Chefe de Fase</strong> em encontros solo, combinando letalidade à distância com devastação marcial de perto.</p><p style="font-family: Arial, sans-serif; line-height: 1.6;">Diferente de feras selvagens desprovidas de inteligência, o Lynel possui astúcia militar incomparável: avalia intrusos à distância, dispara rajadas fulminantes com seu arco de guerra e fecha o espaço através de uma carga irresistível, antes de esmagar oponentes com armas atrozes e sopros incandescentes.</p>',
          public: ''
        },
        origem: '',
        info: '',
        divindade: '',
        raca: 'Monstro',
        tipo: 'mon',
        tamanho: 'eno',
        equipamento: 'Arco de guerra (Heróis de Arton, p. 216) e um entre: alabarda atroz maciça, machado de guerra atroz maciço, tacape atroz maciço ou espada bastarda atroz maciça e escudo pesado reforçado.',
        resistencias: 'Redução de ácido, eletricidade, fogo e frio 10',
        tesouro: 'Metade',
        role: 'solo',
        ataquescac: 'Armamento Lynel x2 +36 e Mordida +36 (4d10+25, 19).',
        movimento: '15m (10q)',
        ataquesad: 'Arco de guerra x2 +32 (4d12+25, x3).'
      }
    },
    items: itemIdsLynel,
    folder: 'wfWApuyngzFm4KOP',
    sort: 70000000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!actors!${lynelId}`, lynelDoc);
  console.log('✓ Lynel atualizado com 100% dos padrões!');

  // -------------------------------------------------------------
  // THREAT 2: OXXDON (ND 2)
  // -------------------------------------------------------------
  const oxxdonId = 'KnUyjOaSBfGcl48v';
  console.log(`Atualizando Oxxdon canônico [${oxxdonId}]...`);

  // Limpar itens antigos
  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${oxxdonId}.`)) {
      await db.del(key);
    }
  }

  const oxxdonItems = [
    buildWeaponItem({
      name: 'Antena',
      img: 'icons/creatures/invertebrates/centipede-segmented-green.webp',
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Toque da antena +12 (ferrugem). Destrói automaticamente qualquer objeto de metal não mágico atingido (itens mágicos têm Fortitude CD 16 para evitar).</p>',
      proficiencia: 'natural',
      empunhadura: 'uma',
      criticoM: 20,
      criticoX: 2,
      proposito: 'corpo-a-corpo',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*Pssshhhh...*"</blockquote><p>A antena do Oxxdon toca a lâmina metálica, dissolvendo-a em uma <span style="color: #800000; font-weight: bold;">chuva de pó alaranjado</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Mordida',
      img: 'icons/creatures/abilities/mouth-teeth-fangs.webp',
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> 1d8+10 perfuração, crítico 20/x2.</p>',
      proficiencia: 'natural',
      empunhadura: 'uma',
      criticoM: 20,
      criticoX: 2,
      proposito: 'corpo-a-corpo',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*CRUNCH!*"</blockquote><p>Mandíbulas quitinosas fecham-se famintas por carne e <span style="color: #800000; font-weight: bold;">minerais digeridos</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['1d8+10', 'perfuracao', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Ferrugem',
      img: 'icons/magic/acid/dissolve-armored-plate.webp',
      description: '<p>A antena do oxxdon destrói automaticamente qualquer objeto de metal não mágico atingido. Uma arma de metal que cause dano a um oxxdon também é destruída imediatamente. Itens mágicos têm direito a um teste de Fortitude (CD 16) para evitar a destruição. Contra criaturas de metal (como golens), a antena deixa o alvo fatigado, então exausto, então paralisado (mesmo que seja imune a essas condições; Fort CD 16 evita).</p><p>Remover cada uma destas condições da criatura exige uma hora de trabalho, o gasto de T$ 50 em materiais e passar em um teste de Ofício (artesão) contra CD 20.</p>',
      execucao: 'passive',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 16 evita destruição de itens mágicos ou paralisia em construtos.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Tudo o que a forja ergueu, a fome de Megalokk consome."</blockquote><p>O ácido oxidante da carapaça desfaz armaduras como se fossem <span style="color: #800000; font-weight: bold;">cinzas ao vento</span>.</p></div>'
    })
  ];

  const itemIdsOxxdon = [];
  for (const item of oxxdonItems) {
    itemIdsOxxdon.push(item._id);
    await db.put(`!actors.items!${oxxdonId}.${item._id}`, item);
  }

  const oxxdonAtr = { for: 0, des: 4, con: 2, int: -4, sab: 1, car: -1 };
  const oxxdonPericias = buildSkills(2, oxxdonAtr, {
    inic: 7, perc: 4, fort: 7, refl: 13, vont: 2, luta: 12
  });

  const oxxdonDoc = {
    _id: oxxdonId,
    name: 'Oxxdon',
    type: 'npc',
    img: 'icons/svg/mole.svg',
    system: {
      atributos: {
        for: { value: 0, base: 0, racial: 0, bonus: 0 },
        des: { value: 4, base: 4, racial: 0, bonus: 0 },
        con: { value: 2, base: 2, racial: 0, bonus: 0 },
        int: { value: -4, base: -4, racial: 0, bonus: 0 },
        sab: { value: 1, base: 1, racial: 0, bonus: 0 },
        car: { value: -1, base: -1, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: 16,
        pv: { value: 72, temp: 0, min: 0, max: 72 },
        pm: { value: 0, temp: 0, min: 0, max: 0 },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: 20,
          base: 16, // 20 - Des (4) = 16 para que Foundry compute 16 + 4 = 20
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
        sentidos: { value: [], custom: 'Faro, visão no escuro' },
        conjuracao: '',
        nivel: { value: 2, xp: { value: 0, pct: 0, proximo: 0 } },
        movement: {
          burrow: { base: 0, bonus: [] },
          climb: { base: 0, bonus: [] },
          fly: { base: 0, bonus: [] },
          swim: { base: 0, bonus: [] },
          walk: { base: 12, bonus: [] },
          hover: false,
          unit: 'm',
          tags: []
        },
        treino: 2,
        nd: '2',
        meionivel: 1
      },
      pericias: oxxdonPericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      detalhes: {
        biography: {
          value: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Som gutural de quelíceras triturando ferro enferrujado...*"<br><span style="font-weight: bold; color: #800000;">&mdash; Oxxdon</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Primeiro foi a fivela do meu cinto. Depois a ponta da minha bota. Quando vi, meu tinteiro de metal tinha virado pó! Tive que escrever o resto da matéria com suco de amora num pedaço de casca de árvore. A civilização é frágil, leitores!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Oxxdon</span>, popularmente apelidado de "monstro da ferrugem", é uma monstruosidade insetoide réptil venerada pelo ódio de Megalokk contra o aço civilizado. Suas antenas secretam um agente catalítico capaz de dissolver qualquer forja de metal em questão de segundos, tornando-o o pior pesadelo de Zakharov e de guerreiros de armadura pesada.</p>',
          public: ''
        },
        origem: '',
        info: '',
        divindade: 'Megalokk',
        raca: 'Monstro',
        tipo: 'mon',
        tamanho: 'med',
        equipamento: 'Nenhum.',
        resistencias: '',
        tesouro: 'Nenhum.',
        role: 'special',
        ataquescac: 'Antena +12 (ferrugem) e mordida +12 (1d8+10).',
        movimento: '12m (8q)',
        ataquesad: ''
      }
    },
    items: itemIdsOxxdon,
    folder: 'wfWApuyngzFm4KOP',
    sort: 71000000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!actors!${oxxdonId}`, oxxdonDoc);
  console.log('✓ Oxxdon atualizado com 100% dos padrões!');

  // -------------------------------------------------------------
  // THREAT 3: ENXAME DE ARMAS (ND 4)
  // -------------------------------------------------------------
  const enxameId = 'XEdZUz2ETKvxvjZH';
  console.log(`Atualizando Enxame de Armas [${enxameId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${enxameId}.`)) {
      await db.del(key);
    }
  }

  const enxameItems = [
    buildPowerItem({
      name: 'Enxame de Armas',
      img: 'icons/weapons/swords/swords-clashing-steel.webp',
      description: '<p>O enxame de armas é um aglomerado de objetos animados que agem em conjunto. Ele pode entrar no espaço ocupado por um personagem e, no fim de seu turno, causa <strong>1d10 pontos de dano de corte</strong>, <strong>1d6 pontos de dano de perfuração</strong> e <strong>1d8 pontos de dano de impacto</strong> a qualquer personagem em seu espaço, automaticamente.</p><p>O enxame é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área, como Bola de Fogo. Além disso, sofre apenas metade do dano de ataques com armas. Estar dentro do enxame conta como condição ruim para lançar magias.</p>',
      execucao: 'passive',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*KLANG-CLANG-SHRRRK!*"</blockquote><p>Lâminas, machados e maças voam em vórtice, retalhando e triturando quem estiver em seu <span style="color: #800000; font-weight: bold;">epicentro metálico</span>.</p></div>',
      rolls: [
        {
          name: 'Dano de Corte',
          key: 'danoCorte0',
          type: 'dano',
          parts: [['1d10', 'corte', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Perfuração',
          key: 'danoPerf1',
          type: 'dano',
          parts: [['1d6', 'perfuracao', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Impacto',
          key: 'danoImp2',
          type: 'dano',
          parts: [['1d8', 'impacto', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Aparar',
      img: 'icons/skills/melee/shield-block-spikes.webp',
      description: '<p><strong>Reação:</strong> Uma vez por rodada, quando é alvo de um ataque corpo a corpo, o enxame de armas pode fazer um teste de ataque e subtrair seu resultado do dano causado pelo ataque (teste +16).</p>',
      execucao: 'reaction',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*CLINK!*"</blockquote><p>Uma espada espectral desvia o golpe com um <span style="color: #800000; font-weight: bold;">bloqueio mecânico perfeito</span>.</p></div>',
      rolls: [
        {
          name: 'Teste de Aparar',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    })
  ];

  const itemIdsEnxame = [];
  for (const item of enxameItems) {
    itemIdsEnxame.push(item._id);
    await db.put(`!actors.items!${enxameId}.${item._id}`, item);
  }

  const enxameAtr = { for: 4, des: 2, con: 2, int: 0, sab: 0, car: -5 };
  const enxamePericias = buildSkills(4, enxameAtr, {
    inic: 6, perc: 4, furt: 8, fort: 15, refl: 10, vont: 5, luta: 16
  });

  const enxameDoc = {
    _id: enxameId,
    name: 'Enxame de Armas',
    type: 'npc',
    img: 'icons/weapons/swords/swords-clashing-steel.webp',
    system: {
      atributos: {
        for: { value: 4, base: 4, racial: 0, bonus: 0 },
        des: { value: 2, base: 2, racial: 0, bonus: 0 },
        con: { value: 2, base: 2, racial: 0, bonus: 0 },
        int: { value: 0, base: 0, racial: 0, bonus: 0 },
        sab: { value: 0, base: 0, racial: 0, bonus: 0 },
        car: { value: -5, base: -5, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: 0,
        pv: { value: 140, temp: 0, min: 0, max: 140 },
        pm: { value: 0, temp: 0, min: 0, max: 0 },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: 22,
          base: 20, // 22 - Des (2) = 20 para que Foundry compute 20 + 2 = 22
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
        sentidos: { value: [], custom: 'Percepção às cegas' },
        conjuracao: '',
        nivel: { value: 4, xp: { value: 0, pct: 0, proximo: 0 } },
        movement: {
          burrow: { base: 0, bonus: [] },
          climb: { base: 0, bonus: [] },
          fly: { base: 9, bonus: [] },
          swim: { base: 0, bonus: [] },
          walk: { base: 0, bonus: [] },
          hover: true,
          unit: 'm',
          tags: []
        },
        treino: 2,
        nd: '4',
        meionivel: 2
      },
      pericias: enxamePericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      detalhes: {
        biography: {
          value: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*Tinir incessante de cem lâminas levitando no ar frio...*"<br><span style="font-weight: bold; color: #800000;">&mdash; Enxame de Armas</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Achei que o chão estava apenas atulhado de lixo militar antigo... até que cada adaga e machado começou a flutuar ao mesmo tempo! O ar zunia como uma nuvem de vespas de aço!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Enxame de Armas</span> é uma manifestação arcana e ódio concentrado que assombra as ruínas do Castelo Zweihardt em Zakharov. Composto por dezenas de espadas, machados, alabardas e adagas forjadas por artesãos há muito esquecidos, o enxame engolfa seus alvos em um vórtice impiedoso de lâminas voadoras.</p>',
          public: ''
        },
        origem: '',
        info: '',
        divindade: '',
        raca: 'Construto',
        tipo: 'con',
        tamanho: 'gra',
        equipamento: 'Arsenal variado de armas simples e marciais antigas.',
        resistencias: 'Redução de dano 5, metade do dano de ataques com armas, vulnerabilidade a dano de área (+50%).',
        tesouro: 'Dobro (apenas armas).',
        role: 'padrao',
        ataquescac: 'Enxame (1d10 corte + 1d6 perfuração + 1d8 impacto, fim do turno).',
        movimento: 'voo 9m (6q)',
        ataquesad: ''
      }
    },
    items: itemIdsEnxame,
    folder: 'wfWApuyngzFm4KOP',
    sort: 72000000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!actors!${enxameId}`, enxameDoc);
  console.log('✓ Enxame de Armas atualizado com 100% dos padrões!');

  // -------------------------------------------------------------
  // THREAT 4: TROPA DE MORTOS (ND 5)
  // -------------------------------------------------------------
  const tropaId = 'ZB0VONjuE8XS5gmH';
  console.log(`Atualizando Tropa de Mortos [${tropaId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${tropaId}.`)) {
      await db.del(key);
    }
  }

  const tropaItems = [
    buildWeaponItem({
      name: 'Espada Longa da Tropa',
      img: 'icons/weapons/swords/sword-broad-worn.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 4d8+18, crítico 19/x2 (corte). Se o ataque exceder a Defesa do inimigo por 10 ou mais, causa o dobro do dano. Se errar, ainda causa metade do dano.</p>',
      proficiencia: 'marcial',
      empunhadura: 'uma',
      criticoM: 19,
      criticoX: 2,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      size: 'aumentada',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*Passos sincronizados de botas de ferro...*"</blockquote><p>Uma fileira de lâminas desaba em uníssono, com a <span style="color: #800000; font-weight: bold;">disciplina macabra de um pelotão eterno</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano',
          key: 'dano1',
          type: 'dano',
          parts: [['4d8+18', 'corte', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Bando',
      img: 'icons/skills/movement/formation-military-marching-white.webp',
      description: '<p>A tropa de mortos é formada por um grupo de esqueletos combatendo em formação cerrada. Se um ataque da tropa exceder a Defesa do Inimigo por 10 ou mais, ele causa o dobro do dano. Se um ataque da tropa errar, ele ainda causa metade do dano.</p><p>A falange é imune a manobras de combate e efeitos que afetam apenas uma criatura e não causam dano, mas sofre 50% a mais de dano de efeitos de área, como Bola de Fogo. Um personagem com poder Trespassar que acerte a tropa pode usá-lo para fazer um ataque adicional contra ela (mas apenas uma vez por turno).</p>',
      execucao: 'passive',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Nossas fileiras não se quebram. Nossa vigília não tem fim."</blockquote><p>Os escudos se intertravam formando uma <span style="color: #800000; font-weight: bold;">parede impenetrável de ossos e ferro</span>.</p></div>'
    })
  ];

  const itemIdsTropa = [];
  for (const item of tropaItems) {
    itemIdsTropa.push(item._id);
    await db.put(`!actors.items!${tropaId}.${item._id}`, item);
  }

  const tropaAtr = { for: 5, des: 3, con: 0, int: 0, sab: 0, car: -5 };
  const tropaPericias = buildSkills(5, tropaAtr, {
    inic: 9, perc: 5, fort: 6, refl: 11, vont: 16, luta: 20
  });

  const tropaDoc = {
    _id: tropaId,
    name: 'Tropa de Mortos',
    type: 'npc',
    img: 'icons/creatures/magical/construct-stone-gargoyle.webp',
    system: {
      atributos: {
        for: { value: 5, base: 5, racial: 0, bonus: 0 },
        des: { value: 3, base: 3, racial: 0, bonus: 0 },
        con: { value: 0, base: 0, racial: 0, bonus: 0 },
        int: { value: 0, base: 0, racial: 0, bonus: 0 },
        sab: { value: 0, base: 0, racial: 0, bonus: 0 },
        car: { value: -5, base: -5, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: 0,
        pv: { value: 40, temp: 0, min: 0, max: 40 },
        pm: { value: 0, temp: 0, min: 0, max: 0 },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: 24,
          base: 21, // 24 - Des (3) = 21 para que Foundry compute 21 + 3 = 24
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
        sentidos: { value: [], custom: 'Visão no escuro' },
        conjuracao: '',
        nivel: { value: 5, xp: { value: 0, pct: 0, proximo: 0 } },
        movement: {
          burrow: { base: 0, bonus: [] },
          climb: { base: 0, bonus: [] },
          fly: { base: 0, bonus: [] },
          swim: { base: 0, bonus: [] },
          walk: { base: 9, bonus: [] },
          hover: false,
          unit: 'm',
          tags: []
        },
        treino: 2,
        nd: '5',
        meionivel: 2
      },
      pericias: tropaPericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      detalhes: {
        biography: {
          value: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"*O ranger ritmado de ossos ressequidos batendo contra armaduras amassadas...*"<br><span style="font-weight: bold; color: #800000;">&mdash; Tropa de Mortos</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"Eles marcham como um batalhão vivo da antiga Supremacia! Mesmo sem carne nas órbitas, você sente aquele ódio intolerante fixado em qualquer um que não se pareça com eles. Derrubar um não adianta: há três outros cobrindo a brecha!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">A <span style="color: #800000; font-weight: bold;">Tropa de Mortos</span> é uma falange militar de esqueletos sob comando necromântico nas terras de Zakharov. Combatem com a disciplina implacável de soldados veteranos: erguem escudos pesados e desferem investidas coordenadas com espadas longas, operando como um organismo único no campo de batalha.</p>',
          public: ''
        },
        origem: '',
        info: '',
        divindade: '',
        raca: 'Morto-vivo',
        tipo: 'mor',
        tamanho: 'gra',
        equipamento: 'Escudo pesado, espada longa.',
        resistencias: 'Redução de corte, frio e perfuração 5, vulnerabilidade a dano de área (+50%).',
        tesouro: 'Nenhum.',
        role: 'padrao',
        ataquescac: 'Espada longa x2 +20 (4d8+18, 19).',
        movimento: '9m (6q)',
        ataquesad: ''
      }
    },
    items: itemIdsTropa,
    folder: 'wfWApuyngzFm4KOP',
    sort: 73000000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!actors!${tropaId}`, tropaDoc);
  console.log('✓ Tropa de Mortos atualizada com 100% dos padrões!');

  // -------------------------------------------------------------
  // THREAT 5: INUMANO (ND 6)
  // -------------------------------------------------------------
  const inumanoId = 'po00j60czLdn1eu5';
  console.log(`Atualizando Inumano [${inumanoId}]...`);

  for await (const [key] of db.iterator()) {
    if (key.startsWith(`!actors.items!${inumanoId}.`)) {
      await db.del(key);
    }
  }

  const inumanoItems = [
    buildWeaponItem({
      name: 'Espada Longa Inumana',
      img: 'icons/weapons/swords/sword-broad-shadow.webp',
      description: '<p><strong>Ataque Corpo a Corpo (x2):</strong> 2d8+9, crítico 19/x2 (corte), mais 2d12 pontos de dano de trevas e efeito de <em>Drenar Energia</em>.</p>',
      proficiencia: 'marcial',
      empunhadura: 'uma',
      criticoM: 19,
      criticoX: 2,
      ataques: 2,
      proposito: 'corpo-a-corpo',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Malditos... Me entreguem esta arma! Ela é minha por direito!"</blockquote><p>A lâmina espectral goteja névoa escura, drenando a própria <span style="color: #800000; font-weight: bold;">força vital do alvo</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Corte',
          key: 'dano1',
          type: 'dano',
          parts: [['2d8+9', 'corte', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Trevas',
          key: 'dano2',
          type: 'dano',
          parts: [['2d12', 'trevas', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildWeaponItem({
      name: 'Azagaia Inumana',
      img: 'icons/weapons/polearms/javelin-black.webp',
      description: '<p><strong>Ataque à Distância:</strong> 2d6+9 (perfuração), mais 2d12 pontos de dano de trevas e efeito de <em>Drenar Energia</em>.</p>',
      proficiencia: 'simples',
      empunhadura: 'uma',
      criticoM: 20,
      criticoX: 2,
      ataques: 1,
      proposito: 'arremesso',
      alcance: 'medio',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"*SWOOSH-THUMP!*"</blockquote><p>A azagaia cruza as sombras carregada com o <span style="color: #800000; font-weight: bold;">frio gélido da pós-vida</span>.</p></div>',
      rolls: [
        {
          name: 'Ataque',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['pont', '', ''], ['', '', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Perfuração',
          key: 'dano1',
          type: 'dano',
          parts: [['2d6+9', 'perfuracao', '']],
          versatil: '',
          adaptavel: ''
        },
        {
          name: 'Dano de Trevas',
          key: 'dano2',
          type: 'dano',
          parts: [['2d12', 'trevas', '']],
          versatil: '',
          adaptavel: ''
        }
      ]
    }),
    buildPowerItem({
      name: 'Drenar Energia',
      img: 'icons/magic/death/drain-energy-life-purple.webp',
      description: '<p>Uma criatura viva que sofra dano de trevas do inumano sofre uma penalidade cumulativa de −1 em testes de perícia (Fortitude CD 22 evita). Se acumular uma penalidade igual ou maior que seu próprio nível, a criatura morre e se transforma em um inumano sob controle do mestre.</p><p>Esta penalidade pode ser removida de uma criatura viva com descanso ou com efeitos mágicos capazes de remover qualquer condição de metabolismo (cada dia de descanso ou efeito mágico diminui a penalidade em 1).</p>',
      execucao: 'passive',
      resistenciaPericia: 'fort',
      resistenciaTxt: 'Fortitude CD 22 evita a penalidade cumulativa de -1 em testes de perícia.',
      chatFlavor: '<div style="font-family: Arial, sans-serif; line-height: 1.6; margin-bottom: 20px;"><blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 10px; font-style: italic;">"Sua alma será acorrentada junto às nossas fileiras..."</blockquote><p>A escuridão gélida rasteja pelas veias da vítima, <span style="color: #800000; font-weight: bold;">drenando sua vitalidade</span>.</p></div>'
    })
  ];

  const itemIdsInumano = [];
  for (const item of inumanoItems) {
    itemIdsInumano.push(item._id);
    await db.put(`!actors.items!${inumanoId}.${item._id}`, item);
  }

  const inumanoAtr = { for: 3, des: 2, con: 1, int: 0, sab: 1, car: -1 };
  const inumanoPericias = buildSkills(6, inumanoAtr, {
    inic: 7, perc: 6, atle: 8, furt: 4, guer: 5, inti: 6,
    fort: 17, refl: 12, vont: 7, luta: 24, pont: 24
  });

  const inumanoDoc = {
    _id: inumanoId,
    name: 'Inumano',
    type: 'npc',
    img: 'icons/creatures/undead/skeleton-warrior-skull-helmet-grey.webp',
    system: {
      atributos: {
        for: { value: 3, base: 3, racial: 0, bonus: 0 },
        des: { value: 2, base: 2, racial: 0, bonus: 0 },
        con: { value: 1, base: 1, racial: 0, bonus: 0 },
        int: { value: 0, base: 0, racial: 0, bonus: 0 },
        sab: { value: 1, base: 1, racial: 0, bonus: 0 },
        car: { value: -1, base: -1, racial: 0, bonus: 0 }
      },
      attributes: {
        cd: 22,
        pv: { value: 48, temp: 0, min: 0, max: 48 },
        pm: { value: 0, temp: 0, min: 0, max: 0 },
        defesa: {
          atributo: 'des',
          pda: 0,
          value: 26,
          base: 24, // 26 - Des (2) = 24 para que Foundry compute 24 + 2 = 26
          outros: 0,
          condi: 0,
          bonus: []
        },
        carga: { value: 0, atributo: 'for', base: 0, bonus: [], max: 0, pct: 0, encumbered: false, limit: 0 },
        sentidos: { value: [], custom: 'Visão no escuro' },
        conjuracao: '',
        nivel: { value: 6, xp: { value: 0, pct: 0, proximo: 0 } },
        movement: {
          burrow: { base: 0, bonus: [] },
          climb: { base: 0, bonus: [] },
          fly: { base: 0, bonus: [] },
          swim: { base: 0, bonus: [] },
          walk: { base: 9, bonus: [] },
          hover: false,
          unit: 'm',
          tags: []
        },
        treino: 2,
        nd: '6',
        meionivel: 3
      },
      pericias: inumanoPericias,
      modificadores: {
        custoPM: 0,
        atributos: { for: [], des: [], con: [], int: [], sab: [], car: [], fisicos: [], mentais: [], geral: [] },
        ataque: { geral: [], cac: [], ad: [] },
        cura: { geral: [], mag: [] },
        dano: { ad: [], alq: [], cac: [], geral: [], mag: [] },
        pericias: { geral: [], resistencia: [], semataque: [], ataque: [], atr: { for: [], des: [], con: [], int: [], sab: [], car: [] } }
      },
      detalhes: {
        biography: {
          value: '<blockquote style="background-color: #f0f0f0; border-left: 5px solid #800000; padding: 10px; margin-bottom: 20px; font-style: italic;">"Malditos... Me entreguem esta arma! Ela é minha por direito... E vocês não são merecedores de tocá-la!"<br><span style="font-weight: bold; color: #800000;">&mdash; Inumano, Comandante Sepultado</span></blockquote><blockquote style="background-color: #f0f0f0; border-left: 5px solid #006400; padding: 10px; margin-bottom: 20px; font-style: italic;">"A pele do sujeito estava esticada como pergaminho podre sobre os ossos da face. O fedor de morte era tão denso que quase queimava os olhos. Quando ele brandiu a espada, as trevas ao redor congelaram a sala inteira!"<br><span style="font-weight: bold; color: #006400;">&mdash; Grunk Ferroforja, Goblin Escriba da Gazeta do Reinado</span></blockquote><p style="font-family: Arial, sans-serif; line-height: 1.6;">O <span style="color: #800000; font-weight: bold;">Inumano</span> é um guerreiro comandante morto-vivo aprisionado pela própria ganância e ódio eterno nas ruínas do Castelo Zweihardt (<em>Breves Jornadas: Memórias das Armas</em>, DB #227). Empunhando escudo pesado, espada longa e azagaias profanadas com magia de trevas, ele drena a própria vitalidade dos vivos que ousam invadir seu santuário em ruínas.</p>',
          public: ''
        },
        origem: '',
        info: '',
        divindade: '',
        raca: 'Morto-vivo',
        tipo: 'mor',
        tamanho: 'med',
        equipamento: 'Azagaia x3, escudo pesado, espada longa, meia armadura.',
        resistencias: 'Imunidade a frio.',
        tesouro: 'Padrão.',
        role: 'padrao',
        ataquescac: 'Espada longa x2 +24 (2d8+9, 19/x2 corte, mais 2d12 trevas).',
        movimento: '9m (6q)',
        ataquesad: 'Azagaia +24 (2d6+9 perfuração, mais 2d12 trevas).'
      }
    },
    items: itemIdsInumano,
    folder: 'wfWApuyngzFm4KOP',
    sort: 74000000,
    ownership: { default: 0 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!actors!${inumanoId}`, inumanoDoc);
  console.log('✓ Inumano atualizado com 100% dos padrões!');

  await db.close();
  console.log('✅ Todas as 5 ameaças de DB #227 foram reconstruídas com sucesso!');
}

rebuildThreats().catch(console.error);

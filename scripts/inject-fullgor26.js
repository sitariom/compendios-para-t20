#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 26: Forja da Vingança
 *
 * Compêndios Alvo:
 * 1. Ameacas_T20: 6 Ameaças e NPCs canônicos auditados com tokens 2MTT e 34 perícias
 * 2. Itens_T20: 17 Itens (Aço Sillariano, 11 qualidades antidivinas, Alma da Bigorna, traços e parceiros)
 * 3. Diarios_T20: Diário completo com 7 páginas estruturadas em subdocumentos
 * 4. Tabelas_T20: 3 Tabelas de Rolagem (1d6, 1d10, 1d8) com resultados em subdocumentos
 * 5. Macros_T20: Macro interativa de Forja de Aço Sillariano
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const fs = require('fs');
const {
  buildSkills,
  buildTracos,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  saveToSourcePacks
} = require('./create-entry');

const PACKS_DIR = path.join(__dirname, '..', 'packs');
const SRC_PACKS_DIR = path.join(__dirname, '..', 'src', 'packs');

const FOLDER_AMEACAS = 'n591wfGB7keSNe7I'; // Pasta "Fullgor dos Deuses" existente
const FOLDER_ITENS = 'fldItensFolder26';
const FOLDER_DIARIOS = 'fldDiariosFold26';
const FOLDER_TABELAS = 'fldTabelasFold26';
const FOLDER_MACROS = 'fldMacrosFolder26';

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'piAgentTormenta20'
};

async function ensureFolder(packName, folderDoc) {
  const packPath = path.join(PACKS_DIR, packName);
  const db = new ClassicLevel(packPath, { valueEncoding: 'json' });
  await db.open();

  try {
    const key = `!folders!${folderDoc._id}`;
    await db.put(key, folderDoc);
  } finally {
    await db.close();
  }

  // Atualizar _folders.json no src/packs/
  const foldersJsonPath = path.join(SRC_PACKS_DIR, packName, '_folders.json');
  if (fs.existsSync(foldersJsonPath)) {
    try {
      const folders = JSON.parse(fs.readFileSync(foldersJsonPath, 'utf8'));
      const idx = folders.findIndex(f => f._id === folderDoc._id);
      if (idx >= 0) {
        folders[idx] = folderDoc;
      } else {
        folders.push(folderDoc);
      }
      fs.writeFileSync(foldersJsonPath, JSON.stringify(folders, null, 2), 'utf8');
    } catch (e) {
      console.warn(`Aviso ao atualizar _folders.json em ${packName}:`, e.message);
    }
  }
}

// ============================================================================
// 1. AMEAÇAS & NPCS (Ameacas_T20)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças da Edição 26 em Ameacas_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await db.open();

  const threats = [];

  // 1. Asmithar Martelo-Mudo (ND 9)
  const asmitharAtr = { for: 2, des: 1, con: 3, int: 3, sab: 4, car: 1 };
  const asmitharSkills = buildSkills(9, asmitharAtr, {
    inic: 9,
    perc: 12,
    fort: 15,
    refl: 9,
    vont: 21,
    guer: 13,
    mist: 13,
    arme: 14,
    reli: 14,
    luta: 25
  });
  const asmitharTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 },
    imunidadesCondicoes: ['medo']
  });
  const asmitharItems = [
    buildWeaponAttack({
      name: 'Armamento Sagrado',
      img: 'systems/tormenta20/icons/itens/equipamentos/martelo-de-guerra.webp',
      dano: '2d12+20',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 3,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Armamento sagrado x2 +25 (2d12+20 impacto, 19/x3).</p>'
    }),
    buildSpecialPower({
      name: 'Armamento Sagrado',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/golpe-pessoal.webp',
      description: '<p>Asmithar porta uma arma mágica a ser oferecida ao seu oponente. Escolha um tipo de arma e um encanto adequado, ou determine-os aleatoriamente usando as tabelas de tesouros. Independente do tipo de arma, nas mãos de Asmithar ela possui as estatísticas indicadas em seu ataque, modificadas por seu encanto. Se o encanto escolhido tiver custo em PM, ele pode usá-lo sem gastar PM.</p>'
    }),
    buildSpecialPower({
      name: 'Desprezo pelo Ordinário',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Asmithar sofre apenas metade do dano de armas mundanas sem melhorias.</p>'
    })
  ];

  threats.push({
    id: 'C6JxlK5xzXU8PYuK',
    name: 'Asmithar Martelo-Mudo',
    nd: '9',
    papel: 'special',
    tipoMonstro: 'hum',
    raca: 'Humanoide (humano)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: '',
    tesouro: 'Nenhum',
    atributos: asmitharAtr,
    attributes: {
      pv: { value: 230, max: 230 },
      pm: { value: 0, max: 0 },
      defesa: { value: 32, base: 31 } // 32 - 1 = 31
    },
    resistencias: asmitharTracos,
    resistenciasTexto: 'imunidade a medo, redução de dano 5',
    pericias: asmitharSkills,
    items: asmitharItems,
    ataquescac: 'Armamento sagrado x2 +25 (2d12+20, 19/x3)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/asmithar-martelo-mudo.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"O martelo não reconhece nomes. O fogo não honra títulos."<br /><span style="font-weight:bold;color:#800000">— Asmithar Martelo-Mudo</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Aproximei-me da forja esperando ver um mero clérigo, mas encontrei uma montanha de músculos e cicatrizes moldando o aço incandescente com a tranquilidade de quem reza. O calor quase derreteu minha pena, mas eu não ousei me mover. Ele não forjava apenas armas... ele forjava o próprio juízo. Reze para não ser julgado pelo seu martelo."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Asmithar Martelo-Mudo</span> é o Mestre Forjador da célula dos Forjadores Litúrgicos em Valkaria — um ancião imenso, queimado por décadas de devoção e aço, cuja presença impõe respeito sem necessidade de voz elevada. Usa meia-armadura sobre o avental de ferreiro, ornamentada com o símbolo cruzado do martelo e espada. Suas mãos são mais calejadas que qualquer couro.</p><p style="font-family:Arial, sans-serif;line-height:1.6">Foi o primeiro a acender o fogo da forja quando o templo de Arsenal ainda exalava o sangue dos antigos servos de Keenn. Desde então, dedica-se a moldar armas e almas com o mesmo rigor. Em combate, é adversário formidável — um guerreiro que mede resultados, não glória. Encerra duelos apenas quando o fogo reconhece o valor de seu oponente.</p>`
  });

  // 2. Xellmaras, a Ladra Acorrentada (ND 6)
  const xellAtr = { for: 3, des: 6, con: 3, int: 2, sab: -2, car: 2 };
  const xellSkills = buildSkills(6, xellAtr, {
    inic: 11,
    perc: 5,
    fort: 6,
    refl: 17,
    vont: 13,
    acro: 13,
    enga: 9,
    furt: 13,
    ladi: 13,
    inti: 9,
    luta: 17
  });
  const xellTracos = buildTracos({
    tamanho: 'med',
    resistencias: {
      dano: 10,
      acido: { imunidade: true }
    },
    imunidadesCondicoes: ['veneno', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const xellItems = [
    buildWeaponAttack({
      name: 'Duas Cimitarras',
      img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
      dano: '2d6+13',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 18,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Duas cimitarras +17 (2d6+13 corte, 18).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (2 PM). Se o devoto for reduzido a 0 PM dessa forma, perde acesso a todos os seus poderes concedidos e magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Ataque Furtivo +3d6',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/ataque-furtivo.webp',
      description: '<p>Uma vez por rodada, quando atinge um alvo desprevenido ou que esteja flanqueando, causa 3d6 pontos de dano adicional.</p>'
    }),
    buildSpecialPower({
      name: 'Correntes Deturpadas',
      img: 'systems/tormenta20/icons/poderes/ameacas/ataque-de-correntes.webp',
      ativacao: { execucao: 'standard', custo: 0 },
      description: '<p>(Ação Padrão) Xellmaras projeta suas correntes contra uma criatura em alcance curto. A vítima sofre 3d6+26 pontos de dano, metade corte e metade luz, e é acometida por uma dor profunda que causa uma penalidade de –5 em testes de perícia até o fim da cena (Fort CD 24 reduz à metade e evita a dor e a penalidade). Um efeito capaz de remover uma condição de fadiga remove a dor e a penalidade.</p>'
    }),
    buildSpecialPower({
      name: 'Especialista Abissal',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/especialista.webp',
      description: '<p>Quando faz um teste de uma perícia baseada em Destreza, Xellmaras rola dois dados e usa o melhor resultado.</p>'
    }),
    buildSpecialPower({
      name: 'Sadismo',
      img: 'systems/tormenta20/icons/poderes/classes/lutadores/golpe-cruel.webp',
      description: '<p>Xellmaras recebe +5 em testes de ataque e rolagens de dano contra criaturas que estejam sangrando.</p>'
    }),
    buildSpecialPower({
      name: 'Talho Atroz',
      img: 'systems/tormenta20/icons/poderes/ameacas/sangramento.webp',
      description: '<p>Uma criatura atingida por um ataque de cimitarra de Xellmaras fica sangrando (Fort CD 24 evita).</p>'
    }),
    buildSpecialPower({
      name: 'Chave que se Fecha',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/ladrao-de-almas.webp',
      description: '<p>Um personagem adjacente a Xellmaras pode fazer um teste de abrir fechadura (Ladinagem CD 24). Se passar, Xellmaras fica abalada e vulnerável por uma rodada.</p>'
    })
  ];

  threats.push({
    id: 'gaMGB2dL8R0Rv2mY',
    name: 'Xellmaras, a Ladra Acorrentada',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Dobro',
    atributos: xellAtr,
    attributes: {
      pv: { value: 168, max: 168 },
      pm: { value: 0, max: 0 },
      defesa: { value: 25, base: 19 } // 25 - 6 = 19
    },
    resistencias: xellTracos,
    resistenciasTexto: 'evasão, imunidade a ácido e veneno, redução de dano 10; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)',
    pericias: xellSkills,
    items: xellItems,
    ataquescac: 'Duas cimitarras +17 (2d6+13, 18)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/xellmaras-a-ladra-acorrentada.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Hyninn me ensinou a roubar segredos. O Fullgor me ensinou a roubar preces."<br /><span style="font-weight:bold;color:#800000">— Xellmaras</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Suas correntes não tilintam: elas uivam. Parecia uma mulher aprisionada, mas quando as lâminas saíram de sua própria carne com aquele brilho dourado doentio, percebi que ela era a própria cela e o carcereiro. Hyninn riu, mas eu só consegui correr."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Xellmaras</span> foi criada pelas mãos impacientes de Hyninn como um capricho divino — forjada de sombra e aço para ser o roubo perfeito. Seu nome significa 'chave que se fecha' em um dialeto abissal esquecido. Enviada a Arton para semear desordem, tornou-se chefe do submundo nos subterrâneos de Valkaria até ser seduzida pelo Fullgor, que lhe sussurrou ordens para roubar a sagrada Alma da Bigorna.</p><p style="font-family:Arial, sans-serif;line-height:1.6">Seu corpo é um labirinto de correntes vivas cravadas na carne como serpentes reluzentes. Cada elo ressoa com a dor de suas vítimas, e cada gemido metálico é uma súplica que ela jamais atenderá.</p>`
  });

  // 3. Gangue de Hyninn Deturpada (ND 4)
  const gangueAtr = { for: -1, des: 3, con: 0, int: 1, sab: -2, car: 2 };
  const gangueSkills = buildSkills(4, gangueAtr, {
    inic: 8,
    perc: 5,
    fort: 4,
    refl: 16,
    vont: 10,
    enga: 8,
    furt: 9,
    ladi: 9,
    luta: 15
  });
  const gangueTracos = buildTracos({
    tamanho: 'gde',
    imunidadesCondicoes: ['movimento', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const gangueItems = [
    buildWeaponAttack({
      name: '[Bando] Adaga',
      img: 'systems/tormenta20/icons/itens/equipamentos/adaga.webp',
      dano: '2d4+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> [Bando] Adaga +15 (2d4+10 perfuração, 19).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (1 PM). Se o devoto for reduzido a 0 PM dessa forma, perde acesso a todos os seus poderes concedidos e magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'No Alma Dói Mais',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/ladrao-de-almas.webp',
      description: '<p>Quando faz um acerto crítico com suas adagas, a gangue de Hyninn, em vez de causar dano adicional, rouba um item do alvo (escolhido aleatoriamente). Moedas e estilhas contam como itens. Mesmo que o devoto seja derrotado, há 75% de chance de que o item tenha desaparecido para sempre.</p>'
    }),
    buildSpecialPower({
      name: 'Truque de Luzes',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/sombra.webp',
      ativacao: { execucao: 'reaction', custo: 0 },
      description: '<p>(Reação) Uma vez por rodada, quando é atacada, a gangue engana o atacante com uma distração, como um reflexo dourado, mudando o alvo do ataque para outra criatura dentro do alcance do atacante (Von CD 20 evita). A gangue só pode usar esta habilidade uma vez por cena contra cada atacante.</p>'
    })
  ];

  threats.push({
    id: 'wbA5Rt8dqRkHQWdC',
    name: 'Gangue de Hyninn Deturpada',
    nd: '4',
    papel: 'bando',
    tipoMonstro: 'hum',
    raca: 'Humanoide (fullgori)',
    tamanho: 'gde',
    deslocamento: '9m (6q)',
    sentidos: '',
    tesouro: 'Metade',
    atributos: gangueAtr,
    attributes: {
      pv: { value: 99, max: 99 },
      pm: { value: 0, max: 0 },
      defesa: { value: 22, base: 19 } // 22 - 3 = 19
    },
    resistencias: gangueTracos,
    resistenciasTexto: 'imunidade a efeitos de movimento, acertos críticos, cansaço, metabolismo, metamorfose e paralisia',
    pericias: gangueSkills,
    items: gangueItems,
    ataquescac: '[Bando] Adaga +15 (2d4+10, 19)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/gangue-de-hyninn-deturpada.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"O ouro brilha, mas a fé cega. Passa a bolsa antes que suas preces virem cinzas!"<br /><span style="font-weight:bold;color:#800000">— Ladrão de Hyninn Deturpado</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Eles se movem em bando como ratos em dia de cheia, mas com olhos tomados por faíscas douradas. Quando atacam, não querem apenas seu dinheiro: suas lâminas arrancam pertences e cortam a própria sensação de segurança do viajante."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">A <span style="color:#800000;font-weight:bold">Gangue de Hyninn Deturpada</span> reúne criminosos e devotos do Deus dos Ladrões que sucumbiram à sedução do Fullgor nos becos de Valkaria. Lutam em bandos coordenados, utilizando reflexos de luz dourada para desviar golpes e adagas afiadas que desarmam o espírito tanto quanto o corpo.</p>`
  });

  // 4. Sacerdote de Hyninn Deturpado (ND 4)
  const sacAtr = { for: -1, des: 3, con: 1, int: 0, sab: 3, car: 2 };
  const sacSkills = buildSkills(4, sacAtr, {
    inic: 7,
    perc: 7,
    fort: 5,
    refl: 10,
    vont: 15,
    enga: 8,
    ladi: 11,
    reli: 7,
    luta: 14
  });
  const sacTracos = buildTracos({
    tamanho: 'med',
    imunidadesCondicoes: ['mental', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const sacItems = [
    buildWeaponAttack({
      name: 'Adaga',
      img: 'systems/tormenta20/icons/itens/equipamentos/adaga.webp',
      dano: '2d4+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Adaga x2 +14 (2d4+5 perfuração, 19).</p>'
    }),
    buildSpellItem({
      name: 'Arma Espiritual',
      img: 'systems/tormenta20/icons/magias/arma-espiritual.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'ilu',
      ativacao: { execucao: 'standard', custo: 4 },
      alcance: 'pessoal',
      duracao: 'cena',
      description: '<p>Até o fim da cena, o sacerdote recebe +2 na Defesa e, uma vez por rodada, quando sofre um ataque corpo a corpo, pode usar uma reação para causar 2d6 pontos de dano de perfuração no atacante.</p>'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'evo',
      ativacao: { execucao: 'standard', custo: 4 },
      alcance: 'toque',
      duracao: 'instantânea',
      description: '<p>Uma criatura adjacente cura 5d8+5 PV.</p>'
    }),
    buildSpellItem({
      name: 'Despedaçar',
      img: 'systems/tormenta20/icons/magias/despedacar.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'tra',
      ativacao: { execucao: 'standard', custo: 3 },
      alcance: 'curto',
      alvo: '1 criatura ou objeto',
      resistencia: 'Fortitude reduz à metade e evita atordoamento',
      description: '<p>Um alvo em alcance curto sofre 2d8+4 pontos de dano de impacto se for criatura, ou o dobro sem RD se for construto ou objeto Pequeno, e fica atordoado (Fort CD 20 reduz à metade e evita).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (1 PM). Se reduzido a 0 PM, perde poderes concedidos e magias por 24h.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Bênção do Gatuno',
      img: 'systems/tormenta20/icons/poderes/classes/clerigos/abencoar-arma.webp',
      ativacao: { execucao: 'free', custo: 0 },
      description: '<p>(Livre) Uma vez por cena, o sacerdote de Hyninn lança uma magia como uma ação livre, pagando seu custo normal em PM.</p>'
    }),
    buildSpecialPower({
      name: 'Forma de Macaco Pamgra',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      ativacao: { execucao: 'full', custo: 4 },
      description: '<p>(Ação Completa, 4 PM) O sacerdote se transforma em um pamgra fullgori de cristal dourado. O tipo muda para espírito (fullgori), adquire imunidade a ácido, RD 10/impacto, vulnerabilidade a eletricidade, 80 PV temporários, +2 na Defesa e ataques corpo a corpo de pancada x2 +16 (2d8+5, 19 mais sangramento). Dura indefinidamente até reverter com ação de movimento.</p>'
    }),
    buildSpecialPower({
      name: 'Malandragem Divina',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/ladinagem.webp',
      ativacao: { execucao: 'free', custo: 1 },
      description: '<p>(Ação Livre, 1 PM) Quando faz um teste de perícia, o sacerdote usa Enganação em vez da perícia original.</p>'
    })
  ];

  threats.push({
    id: '4Chz9YQv6oC4R5gs',
    name: 'Sacerdote de Hyninn Deturpado',
    nd: '4',
    papel: 'padrao',
    tipoMonstro: 'hum',
    raca: 'Humanoide (fullgori)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: '',
    tesouro: 'Padrão',
    atributos: sacAtr,
    attributes: {
      pv: { value: 98, max: 98 },
      pm: { value: 28, max: 28 },
      defesa: { value: 19, base: 16 } // 19 - 3 = 16
    },
    resistencias: sacTracos,
    resistenciasTexto: 'imunidade a efeitos mentais, acertos críticos, cansaço, metabolismo, metamorfose e paralisia',
    pericias: sacSkills,
    items: sacItems,
    ataquescac: 'Adaga x2 +14 (2d4+5, 19)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/sacerdote-de-hyninn-deturpado.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Hyninn ri dos tolos que buscam a verdade. O Fullgor ensina que até a verdade é moldável."<br /><span style="font-weight:bold;color:#800000">— Sacerdote de Hyninn Deturpado</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Ele não pregava fé, mas sim o escárnio. Vestindo mantos sacerdotais manchados de óleo e fuligem, canalizava milagres distorcidos e, quando acuado, transformou-se numa abominação de cristal que quase despedaçou nosso guerreiro!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Sacerdote de Hyninn Deturpado</span> é o líder espiritual das células criminosas sob Valkaria. Capaz de invocar armas de energia espiritual e despedaçar a matéria mundana com a palavra sagrada, ele recorre à forma de um macaco pamgra de cristal dourado para esmagar os inimigos de sua fé corrompida.</p>`
  });

  // 5. Tigre-de-Hyninn Deturpado (ND 6)
  const tigreAtr = { for: 3, des: 4, con: 2, int: -1, sab: 1, car: -1 };
  const tigreSkills = buildSkills(6, tigreAtr, {
    inic: 10,
    perc: 7,
    fort: 8,
    refl: 20,
    vont: 5,
    furt: 16,
    luta: 20
  });
  const tigreTracos = buildTracos({
    tamanho: 'gde',
    imunidadesCondicoes: ['confuso', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const tigreItems = [
    buildWeaponAttack({
      name: 'Duas Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '1d8+2',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Duas garras +20 (1d8+2 corte).</p>'
    }),
    buildWeaponAttack({
      name: 'Três Mordidas',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+2',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Três mordidas +20 (1d6+2 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Cinco Tentáculos',
      img: 'systems/tormenta20/icons/poderes/ameacas/tentaculos.webp',
      dano: '1d6+2',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Cinco tentáculos +20 (1d6+2 impacto).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (2 PM). Se reduzido a 0 PM, perde poderes concedidos e magias por 24h.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Borrão Dourado',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/sombra.webp',
      description: '<p>O tigre-de-Hyninn tem 50% de chance de ignorar ataques e efeitos (incluindo de área) contra ele. Esta habilidade permanece ativa mesmo que ele morra.</p>'
    }),
    buildSpecialPower({
      name: 'Reflexo Planar',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
      ativacao: { execucao: 'move', custo: 0 },
      description: '<p>(Ação de Movimento) Até o próximo turno do tigre, a chance de falha de seu Borrão Dourado aumenta para 75%.</p>'
    })
  ];

  threats.push({
    id: '6lKAcCvfQj9FReP7',
    name: 'Tigre-de-Hyninn Deturpado',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro (fullgori)',
    tamanho: 'gde',
    deslocamento: '12m (8q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum',
    atributos: tigreAtr,
    attributes: {
      pv: { value: 205, max: 205 },
      pm: { value: 0, max: 0 },
      defesa: { value: 28, base: 24 } // 28 - 4 = 24
    },
    resistencias: tigreTracos,
    resistenciasTexto: 'imunidade a confuso, acertos críticos, cansaço, metabolismo, metamorfose e paralisia; resistência a devotos +5',
    pericias: tigreSkills,
    items: tigreItems,
    ataquescac: 'Duas garras +20 (1d8+2), três mordidas +20 (1d6+2) e cinco tentáculos +20 (1d6+2)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/tigre-de-hyninn-deturpado.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"ROOOAAARRR!" <br /><span style="font-size:0.8em;color:#555">(Um rugido distorcido por ecos de metal e risos etéreos)</span><br /><span style="font-weight:bold;color:#800000">— Tigre-de-Hyninn Deturpado</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um felino com cinco tentáculos de onde deveriam brotar pelos e três mandíbulas que mordem o nada. Quando atacamos, nossas flechas e espadas atravessaram seu corpo como se ele fosse pura fumaça dourada!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Tigre-de-Hyninn Deturpado</span> é uma aberração criada pela exposição de animais sagrados de Hyninn ao Fullgor. Flutua entre planos com um borrão dourado constante, lançando garras, mandíbulas e tentáculos simultâneos contra qualquer um que ameace os esconderijos da Ladra Acorrentada.</p>`
  });

  // 6. Aço Selvagem (ND 6)
  const acoAtr = { for: 3, des: 2, con: 4, int: -4, sab: 1, car: -2 };
  const acoSkills = buildSkills(6, acoAtr, {
    inic: 7,
    perc: 6,
    fort: 18,
    refl: 12,
    vont: 6,
    atle: 25,
    luta: 20
  });
  const acoTracos = buildTracos({
    tamanho: 'gde',
    resistencias: {
      dano: 10,
      eletricidade: { imunidade: true },
      fogo: { imunidade: true },
      frio: { vulnerabilidade: true }
    },
    imunidadesCondicoes: ['medo', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const acoItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '2d6+5',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Pancada +20 (2d6+5 impacto mais 2d6+5 fogo).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (2 PM). Se reduzido a 0 PM, perde poderes concedidos e magias por 24h.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      ativacao: { execucao: 'free', custo: 0 },
      description: '<p>(Ação Livre) Quando acerta um ataque de pancada, o aço selvagem pode fazer um teste de agarrar como ação livre (teste +25).</p>'
    }),
    buildSpecialPower({
      name: 'Ecos do Fullgor',
      img: 'systems/tormenta20/icons/poderes/ameacas/rugido-amedrontador.webp',
      description: '<p>Criaturas que iniciem seus turnos em alcance curto do aço selvagem ficam apavoradas e surdas (Fort CD 22 muda para abalado por uma rodada). Se passar, a criatura fica imune a esta habilidade por um dia.</p>'
    }),
    buildSpecialPower({
      name: 'Engolir',
      img: 'systems/tormenta20/icons/poderes/ameacas/engolir.webp',
      ativacao: { execucao: 'standard', custo: 0 },
      description: '<p>(Ação Padrão) Se o aço selvagem começar seu turno agarrando uma criatura Média ou menor, pode fazer um teste de agarrar contra ela. Se vencer, engole a criatura. Uma criatura engolida continua agarrada e sofre 1d6+5 de impacto mais 2d8 de fogo no início de cada turno do monstro. Para escapar, deve causar 20 pontos de dano ao aço selvagem (Defesa 10), fazendo-o regurgitar a criatura caída à sua frente.</p>'
    }),
    buildSpecialPower({
      name: 'Corpo de Metal Fundido',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-fogo.webp',
      description: '<p>Criaturas e objetos que iniciem seus turnos em alcance curto do aço selvagem, ou que façam um ataque corpo a corpo contra ele, sofrem 4d6+10 pontos de dano de fogo (Ref CD 22 evita).</p>'
    }),
    buildSpecialPower({
      name: 'Resfriamento Forçado',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp',
      description: '<p>Quando sofre 25 pontos de dano de frio ou mais de um único efeito, o aço selvagem resfria, desativando Corpo de Metal Fundido por 2 rodadas.</p>'
    })
  ];

  threats.push({
    id: 'E8hgaWNdM2kqv4oo',
    name: 'Aço Selvagem',
    nd: '6',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'gde',
    deslocamento: '9m (6q)',
    sentidos: 'percepção às cegas',
    tesouro: 'Nenhum',
    atributos: acoAtr,
    attributes: {
      pv: { value: 250, max: 250 },
      pm: { value: 0, max: 0 },
      defesa: { value: 27, base: 25 } // 27 - 2 = 25
    },
    resistencias: acoTracos,
    resistenciasTexto: 'imunidade a eletricidade, fogo, efeitos de medo, acertos críticos, cansaço, metabolismo, metamorfose e paralisia; redução de dano 10; vulnerabilidade a frio',
    pericias: acoSkills,
    items: acoItems,
    ataquescac: 'Pancada +20 (2d6+5 mais 2d6+5 fogo)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/aco-selvagem.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"ARMA... SEM MÃO. FOGO... SEM DEUS."<br /><span style="font-weight:bold;color:#800000">— O Aço Selvagem</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"A forja expeliu uma onda de metal fervente que não escorreu: levantou-se! Lâminas e bocas borbulhavam na sua superfície enquanto faíscas douradas queimavam tudo ao redor. Não era metal: era a fúria viva de Sillaria e do Fullgor brigando em uma única massa!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">O Aço Selvagem</span> é a manifestação viva do erro e da falha no ritual de forja viva. Nascido do fogo profano e da essência elemental deturpada de Ceret'th misturada ao ódio do Fullgor, é uma massa líquida de ferro vivo flutuante e mutável. Lâminas e rostos brotam e retraem em meio ao brilho dourado enquanto queima a própria pedra por onde passa.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: FOLDER_AMEACAS,
      nd: t.nd,
      papel: t.papel,
      tipoMonstro: t.tipoMonstro,
      raca: t.raca,
      tamanho: t.tamanho,
      deslocamento: t.deslocamento,
      sentidos: t.sentidos,
      tesouro: t.tesouro,
      atributos: t.atributos,
      attributes: t.attributes,
      resistencias: t.resistencias,
      resistenciasTexto: t.resistenciasTexto,
      pericias: t.pericias,
      items: t.items,
      ataquescac: t.ataquescac,
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo e espelhado com ${built.embeddedDocs.length} subdocumentos.`);
  }

  await db.close();
}

// ============================================================================
// 2. ITENS & PODERES (Itens_T20)
// ============================================================================
async function injectItems() {
  console.log('\n--- Injetando Itens da Edição 26 em Itens_T20 ---');
  await ensureFolder('Itens_T20', {
    name: 'Fullgor dos Deuses',
    type: 'Item',
    folder: null,
    sorting: 'a',
    _id: FOLDER_ITENS,
    description: 'Itens, qualidades antidivinas e materiais especiais da campanha Fúlgor dos Deuses.',
    sort: 1400000,
    flags: {},
    _stats: statsHeader
  });

  const db = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await db.open();

  const items = [
    // 1. Aço Sillariano (Material Especial)
    {
      _id: 'fld26AcoSillaria',
      name: 'Aço Sillariano',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/lingote.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Material Especial:</strong> Inventado no mundo de Sillaria como meio de contra-ataque ao Fullgor, o aço sillariano é forjado a partir das estilhas douradas residuais deixadas por criaturas fullgori destruídas. Esses fragmentos, partes da própria essência Fullgor, trazem consigo seu rancor contra todos os seres divinos. Assim, o metal assume propriedades ofensivas contra estes mesmos seres — justamente aqueles deturpados pelo Fullgor e voltados contra seus próprios devotos.</p><p>Equipamentos forjados com esse aço recebem semi-inteligência extraída de vida elemental, reconhecendo a natureza e potencial de seu usuário. Cada 10 estilhas fullgori "compram" para o item uma qualidade antidivina. O aço sillariano combina todas as qualidades aplicadas ao item.</p>'
        },
        tipo: 'equipamento',
        preco: 1000,
        peso: 1,
        origem: 'Sillaria'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 2. Alma da Bigorna (Artefato Sagrado)
    {
      _id: 'fld26AlmaBigorna',
      name: 'Alma da Bigorna',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/martelo-de-forja.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Artefato Sagrado de Arsenal:</strong> O martelo sagrado da célula dos Forjadores Litúrgicos de Valkaria. Conduzido pelo Mestre Forjador Asmithar, este artefato ressoa com as preces bélicas da forja santa e é imprescindível para canalizar o calor divino que funde estilhas fullgori e almas elementais no autêntico aço sillariano.</p><p>Quando empunhado na forja, fornece +5 em testes de Ofício (armeiro/ferreiro) e Religião para consagrar armas bélicas.</p>'
        },
        tipo: 'equipamento',
        preco: 0,
        peso: 3,
        origem: 'Forjadores Litúrgicos'
      },
      rawEffects: [
        {
          _id: 'eff26AlmBigorn01',
          name: 'Bênção da Bigorna (+5 Ofício Armeiro e Religião)',
          changes: [
            { key: 'system.pericias.arme.bonus', mode: 2, value: '5', priority: 20 },
            { key: 'system.pericias.reli.bonus', mode: 2, value: '5', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 3 a 13: 11 Qualidades Antidivinas
    {
      _id: 'fld26AbsorcaoAnt',
      name: 'Qualidade: Absorção Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/magia-ampliada.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> Uma vez por cena, quando causa dano a uma criatura divina, você recupera 1 PM. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, a recuperação de PM aumenta em +1. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26ArmaAntidiv',
      name: 'Qualidade: Arma Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/golpe-pessoal.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O dano da arma aumenta um passo contra criaturas divinas. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o passo de dano aumenta em +1. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26DefesaAntid',
      name: 'Qualidade: Defesa Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/paladinos/escudo-divino.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item fornece +2 na Defesa contra criaturas divinas. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o bônus na Defesa aumenta em +2. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      rawEffects: [
        {
          _id: 'eff26DefAntid001',
          name: 'Defesa Antidivina (+2)',
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26GuardaAntid',
      name: 'Qualidade: Guarda Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item fornece +2 em testes de resistência contra habilidades de criaturas divinas e, uma vez por cena, você pode ignorar a habilidade Teofagia de um fullgori. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o número de usos por cena aumenta em +1. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      rawEffects: [
        {
          _id: 'eff26GuaAntid001',
          name: 'Guarda Antidivina (+2 Resistências)',
          changes: [
            { key: 'system.modificadores.resistencia', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26Impedimento',
      name: 'Qualidade: Impedimento Antidivino',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/arcanistas/contramagia.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> Uma vez por cena, o portador do item pode forçar uma criatura divina a rolar novamente um teste de resistência recém-realizado. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o número de usos por cena aumenta em +1. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26MagiaAntidiv',
      name: 'Qualidade: Magia Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/foco-em-magia.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item aumenta a CD das suas habilidades mágicas em +5, mas apenas quando usadas contra criaturas divinas. Custa 10 estilhas fullgori.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26MenteAntidiv',
      name: 'Qualidade: Mente Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/especialista.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item fornece +2 em testes de perícia (mas não testes de ataque ou resistência) envolvendo criaturas divinas. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o bônus aumenta em +2. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      rawEffects: [
        {
          _id: 'eff26MenAntid001',
          name: 'Mente Antidivina (+2 Perícias)',
          changes: [
            { key: 'system.modificadores.pericia', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26Perseguidora',
      name: 'Qualidade: Perseguidora Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/precisao.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> A arma fornece +2 em testes de ataque contra criaturas divinas. Além disso, a imunidade a acertos críticos e ataque furtivo dessas criaturas só reduz o dano destes efeitos à metade, em vez de transformá-los em ataques normais. Esta qualidade pode ser adquirida novamente; para cada nova aquisição, o bônus aumenta em +2. Custa 10 estilhas fullgori por aquisição.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      rawEffects: [
        {
          _id: 'eff26PerAntid001',
          name: 'Perseguidora Antidivina (+2 Ataque)',
          changes: [
            { key: 'system.modificadores.ataque', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26PotenciaAnt',
      name: 'Qualidade: Potência Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/arcanistas/eficiencia-mistica.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item reduz em –1 PM o custo de habilidades usadas contra criaturas divinas. Custa 10 estilhas fullgori.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26ResistenciaA',
      name: 'Qualidade: Resistência Antidivina',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/ameacas/reducao-de-dano.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> O item fornece redução de dano (RD) 5 contra qualquer dano causado por criaturas divinas. Custa 10 estilhas fullgori.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      rawEffects: [
        {
          _id: 'eff26ResAntid001',
          name: 'Resistência Antidivina (RD 5)',
          changes: [
            { key: 'system.tracos.resistencias.dano', mode: 2, value: '5', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'fld26AntidevotoQ',
      name: 'Qualidade: Antidevoto',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/clerigos/simbolo-sagrado.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Qualidade de Aço Sillariano:</strong> Os efeitos de todas as qualidades antidivinas do item também se aplicam a seres semidivinos (aspectos, qareen e suraggel) e devotos de qualquer divindade. Custa 10 estilhas fullgori.</p>'
        },
        tipo: 'poder',
        subtipo: 'geral'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 14. Teofagia (Fullgori)
    {
      _id: 'fld26TeofagiaFul',
      name: 'Teofagia (Fullgori)',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Habilidade de Criatura Fullgori:</strong> Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM dessa forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
        },
        tipo: 'poder',
        subtipo: 'ameaca'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 15. Imunidades (Fullgori)
    {
      _id: 'fld26ImunidadesF',
      name: 'Imunidades (Fullgori)',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Habilidade de Criatura Fullgori:</strong> Fullgori são imunes a acertos críticos, cansaço, efeitos de metabolismo, metamorfose e paralisia.</p>'
        },
        tipo: 'poder',
        subtipo: 'ameaca'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 16. Parceiro: Forjadores Litúrgicos
    {
      _id: 'fld26ParcForjad',
      name: 'Parceiro: Forjadores Litúrgicos',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/disciplina-de-combate.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Parceiro Combatente Veterano:</strong> Os sacerdotes-ferreiros de Arsenal fornecem suporte tático e marcial exímio. Uma vez por rodada, você recebe +2 em testes de ataque e rolagens de dano corpo a corpo.</p>'
        },
        tipo: 'poder',
        subtipo: 'parceiro'
      },
      rawEffects: [
        {
          _id: 'eff26ForjLiturg1',
          name: 'Suporte de Forjador Litúrgico (+2 Ataque e Dano)',
          changes: [
            { key: 'system.modificadores.ataque', mode: 2, value: '2', priority: 20 },
            { key: 'system.modificadores.dano.corpo-a-corpo', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 17. Parceiro: Thalgrimm Sangue de Ferro
    {
      _id: 'fld26ParcThalgri',
      name: 'Parceiro: Thalgrimm Sangue de Ferro',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/clerigos/cura-gentil.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Parceiro Médico Veterano:</strong> O frade de Arsenal cuida dos ferimentos de combate durante a batalha. Uma vez por rodada, quando cura um aliado ou a si mesmo com magia ou item, cura +1d8+2 pontos de vida adicionais.</p>'
        },
        tipo: 'poder',
        subtipo: 'parceiro'
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    }
  ];

  for (const item of items) {
    const rawEffects = item.rawEffects || [];
    const effectIds = rawEffects.map(e => e._id);
    const embeddedEffects = [];

    for (const eff of rawEffects) {
      const effectDoc = {
        _id: eff._id,
        name: eff.name,
        icon: eff.icon || item.img,
        origin: `Item.${item._id}`,
        duration: { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
        disabled: false,
        transfer: true,
        changes: eff.changes || [],
        flags: { tormenta20: { self: true } },
        system: {}
      };
      embeddedEffects.push(effectDoc);
      await db.put(`!items.effects!${item._id}.${eff._id}`, effectDoc);
    }

    const itemDoc = {
      ...item,
      effects: effectIds
    };
    delete itemDoc.rawEffects;

    await db.put(`!items!${item._id}`, itemDoc);
    const embeddedForSource = embeddedEffects.map(e => ({
      key: `!items.effects!${item._id}.${e._id}`,
      typePath: '!items.effects!',
      doc: e
    }));
    saveToSourcePacks('Itens_T20', itemDoc, embeddedForSource);
    console.log(`✓ Item "${item.name}" salvo com ${embeddedEffects.length} efeitos.`);
  }

  await db.close();
}

// ============================================================================
// 3. DIÁRIOS (Diarios_T20)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diários da Edição 26 em Diarios_T20 ---');
  await ensureFolder('Diarios_T20', {
    name: 'Fullgor dos Deuses',
    type: 'JournalEntry',
    folder: null,
    sorting: 'a',
    _id: FOLDER_DIARIOS,
    description: 'Crônicas, cenas e capítulos da campanha oficial Fúlgor dos Deuses.',
    sort: 1400000,
    flags: {},
    _stats: statsHeader
  });

  const db = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await db.open();

  const journalId = 'fld26DiarioForja';
  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 26: Forja da Vingança',
    folder: FOLDER_DIARIOS,
    sort: 100000,
    ownership: { default: -1 },
    flags: {},
    pages: [
      'p26SinopseAvent',
      'p26Parte1AForja',
      'p26Parte2AlmaRo',
      'p26Parte3CampoK',
      'p26Parte4FerroF',
      'p26RegrasAcoSi',
      'p26BestiarioNpc'
    ],
    _stats: statsHeader
  };

  const pages = [
    {
      _id: 'p26SinopseAvent',
      name: 'Apresentação & Sinopse: Forja da Vingança',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Forja da Vingança</h2>
<p><em>Revista Tormenta20 — Edição 26 (Abril de 2026). Criação por Marcelo Cassaro.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"Nem toda oferenda ao Deus da Guerra acontece no campo de batalha. Algumas são realizadas sobre bigornas."
</blockquote>
<h3>Sinopse da Aventura</h3>
<p>Após a recente provação nas ruínas de Tharun-Kel, os heróis recebem novo chamado de <strong>Thalgrimm Sangue de Ferro</strong>. O frade anão convoca os campeões a Valkaria, capital do Reinado — onde, sob as ruas fervilhantes da cidade, martelos ressoam em câmaras secretas que poucos ousam nomear.</p>
<p>Ali trabalham os <strong>Forjadores Litúrgicos</strong>, sacerdotes-artesãos cuja devoção é exercida com calor e aço. A missão é simples e impossível: unir fragmentos colhidos em aventuras passadas — os estilhaços do Fullgor e o coração faiscante do Ceret’th — para forjar uma liga metálica jamais vista em Arton: o mítico <strong>aço sillariano</strong>, nascido em outro mundo, capaz de ferir o próprio divino.</p>
<p>Mas a forja santa foi profanada. A <strong>Alma da Bigorna</strong>, ferramenta sagrada essencial ao ritual, foi roubada por devotos de Hyninn liderados por <strong>Xellmaras, a Ladra Acorrentada</strong>, abissal contaminada pelo Fullgor.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 100000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26Parte1AForja',
      name: 'Parte 1: A Forja Aguarda',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 1: A Forja Aguarda</h2>
<h3>Cena 1: Sob a Deusa</h3>
<p>O caminho até o centro de Valkaria conduz os personagens sob a imensa estátua da Deusa da Ambição. No Templo de Arsenal, Thalgrimm conduz o grupo às passagens subterrâneas que descem rumo às profundezas da cidade.</p>
<h3>Cena 2: O Julgamento da Liga (ND 4)</h3>
<p><strong>Objetivo:</strong> Abrir o portão sagrado selado para impedir a passagem de indignos. 4 sucessos antes de 3 falhas.</p>
<ul>
  <li><em>Fortitude ou Luta CD 20:</em> Mover alavancas e sustentar o peso da grade.</li>
  <li><em>Guerra CD 20:</em> Decifrar táticas de batalha nas runas.</li>
  <li><em>Misticismo CD 20:</em> Compreender os fluxos de energia divina.</li>
  <li><em>Ofício (ferreiro) CD 20:</em> Ajustar os mecanismos das trancas.</li>
  <li><em>Religião CD 20:</em> Entoar preces da Liturgia do Aço.</li>
</ul>
<h3>Cena 3: Prova de Fogo (ND 9)</h3>
<p>Diante da fornalha colossal, o <strong>Mestre Forjador Asmithar</strong> desafia o campeão do grupo (ou o grupo inteiro) para um combate ritual. Asmithar mede resultados, não glória. Encerra o duelo quando o fogo reconhece o valor do grupo.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 200000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26Parte2AlmaRo',
      name: 'Parte 2: Alma Roubada',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 2: Alma Roubada</h2>
<h3>Cena 1: A Voz da Forja</h3>
<p>Após o teste, Asmithar revela a grave ofensa: a <strong>Alma da Bigorna</strong>, martelo sagrado sem o qual o aço sillariano não pode ser forjado, foi roubada por ladrões de Hyninn corrompidos pelo Fullgor.</p>
<h3>Cena 2: Rastros de Cinza e Ouro (ND 4)</h3>
<p>Investigação urbana pelos becos e masmorras de Valkaria. 4 sucessos antes de 3 falhas.</p>
<ul>
  <li><em>Cavalaria, Diplomacia ou Intimidação CD 20:</em> Interrogar informantes do submundo.</li>
  <li><em>Conhecimento CD 20:</em> Mapear rotas de contrabando e galerias fluviais.</li>
  <li><em>Investigação CD 20:</em> Seguir resíduos de fumaça e faíscas douradas.</li>
  <li><em>Percepção CD 20:</em> Localizar garatujas e símbolos secretos de Hyninn.</li>
  <li><em>Religião CD 15:</em> Reconhecer o padrão de heresia do Fullgor.</li>
</ul>
<h3>Cena 3: Emboscada Deturpada</h3>
<p>Ao se aproximarem do esconderijo, os heróis são emboscados pelo <strong>Sacerdote de Hyninn Deturpado</strong> e uma <strong>Gangue de Hyninn Deturpada</strong>. Luta sem trégua sob o riso corrompido do Deus dos Ladrões.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 300000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26Parte3CampoK',
      name: 'Parte 3: Sob o Campo de Keenn',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 3: Sob o Campo de Keenn</h2>
<h3>Cena 1: Garras de Tigre</h3>
<p>A trilha leva às ruínas e galerias sob o antigo Campo de Keenn, onde recrutas treinavam no passado. O grupo é atacado pelo terrível <strong>Tigre-de-Hyninn Deturpado (ND 6)</strong> com suas garras, tentáculos e borrão dourado.</p>
<h3>Cena 2: Correntes que Cantam (ND 5)</h3>
<p>Perigo complexo nas galerias repletas de correntes com cravos pendendo do teto como teias vivas. Cada falha impõe dano de corte e perda de mobilidade até alcançar o altar central.</p>
<h3>Cena 3: A Ladra Acorrentada</h3>
<p>Confronto decisivo contra <strong>Xellmaras (ND 6)</strong>. Suas correntes vivas castigam os campeões enquanto ela profana a Alma da Bigorna com zombarias amargas. Ao ser derrotada, o martelo sagrado é recuperado!</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 400000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26Parte4FerroF',
      name: 'Parte 4: A Ferro e Fogo',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 4: A Ferro e Fogo</h2>
<h3>Cena 1: Forja Viva (ND 6)</h3>
<p>O retorno à forja sagrada com a Alma da Bigorna. Os personagens participam do ritual para forjar suas armas de aço sillariano. 5 sucessos antes de 3 falhas.</p>
<ul>
  <li><em>Conhecimento CD 20:</em> Lembrar os feitos de Arsenal, reforçando a legitimidade do novo aço.</li>
  <li><em>Cura CD 20:</em> Conter os ferimentos provocados pela oferenda de sangue.</li>
  <li><em>Fortitude ou Vontade CD 20:</em> Resistir à dor e purificação do fogo.</li>
  <li><em>Guerra ou Religião CD 20:</em> Recitar os versos da Liturgia da Guerra.</li>
  <li><em>Misticismo CD 20:</em> Controlar a energia do Fullgor e a alma de Ceret'th.</li>
  <li><em>Ofício (ferreiro) CD 15:</em> Moldar a forma simbólica das armas.</li>
</ul>
<h3>Cena 2: O Aço Selvagem (ND 6)</h3>
<p>Se o grupo falhar na Forja Viva, o metal se descontrola e emerge o <strong>Aço Selvagem</strong> — metal líquido vivo tomado pela fúria de Ceret'th e ódio do Fullgor. Sua derrota permite reaproveitar o aço, custando 2d10 estilhas.</p>
<h3>Cena 3: Aço da Vingança</h3>
<p>Com o ritual concluído, as armas de aço sillariano nascem nas mãos dos campeões! Thalgrimm pronuncia a bênção: <em>"Vingança não é ódio. É justiça batida até virar lâmina."</em> Todos os personagens avançam para o <strong>7º nível</strong>.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 500000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26RegrasAcoSi',
      name: 'Regras Especiais: Aço da Vingança & Criaturas Divinas',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Regras Especiais: Aço da Vingança</h2>
<p>O aço sillariano forjado com as estilhas fullgori absorve o ódio dos monstros pelos deuses e o direciona contra seres de essência divina.</p>
<h3>Criaturas Divinas</h3>
<p>Quando um efeito especifica <strong>criatura divina</strong>, isso engloba: <em>abissais, celestiais, deuses, gênios, avatares e qualquer criatura fullgori</em>.</p>
<h3>Evolução de Armas com Estilhas</h3>
<p>Cada <strong>10 estilhas fullgori</strong> permitem a um Forjador Litúrgico (ou devoto com a distinção) acrescentar uma qualidade antidivina ao item, exigindo Ofício (ferreiro) CD 20 e Religião CD 20:</p>
<ul>
  <li><strong>Absorção antidivina:</strong> 1/cena recupera 1 PM ao causar dano a criatura divina (+1 PM por nova compra).</li>
  <li><strong>Arma antidivina:</strong> Dano aumenta um passo contra criaturas divinas (+1 passo por nova compra).</li>
  <li><strong>Defesa antidivina:</strong> +2 na Defesa contra criaturas divinas (+2 por nova compra).</li>
  <li><strong>Guarda antidivina:</strong> +2 em resistências contra criaturas divinas e 1/cena ignora Teofagia (+1 uso/cena por nova compra).</li>
  <li><strong>Impedimento antidivino:</strong> 1/cena força criatura divina a rolar novamente um teste de resistência (+1 uso/cena por nova compra).</li>
  <li><strong>Magia antidivina:</strong> +5 na CD de magias contra criaturas divinas.</li>
  <li><strong>Mente antidivina:</strong> +2 em perícias envolvendo criaturas divinas (+2 por nova compra).</li>
  <li><strong>Perseguidora antidivina:</strong> +2 em ataque contra criaturas divinas e imunidade a crítico/furtivo reduz dano à metade em vez de anular (+2 ataque por nova compra).</li>
  <li><strong>Potência antidivina:</strong> -1 PM no custo de habilidades contra criaturas divinas.</li>
  <li><strong>Resistência antidivina:</strong> RD 5 contra dano de criaturas divinas.</li>
  <li><strong>Antidevoto:</strong> Os efeitos também se aplicam a semidivinos (aspectos, qareen, suraggel) e devotos de qualquer deus.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 600000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p26BestiarioNpc',
      name: 'Bestiário & NPCs da Edição 26',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Bestiário & NPCs da Edição 26</h2>
<p>Todos os blocos de estatísticas estão disponíveis no compêndio <strong>Ameaças T20</strong> na pasta <em>Fullgor dos Deuses</em>:</p>
<ul>
  <li><strong>Asmithar Martelo-Mudo (ND 9):</strong> Mestre Forjador da célula litúrgica de Valkaria. Especialista em duelo, devoto austero de Arsenal.</li>
  <li><strong>Xellmaras, a Ladra Acorrentada (ND 6):</strong> Abissal criada por Hyninn corrompida pelo Fullgor. Luta com duas cimitarras e chicotes de correntes cheias de cravos.</li>
  <li><strong>Gangue de Hyninn Deturpada (ND 4):</strong> Ladrões fanáticos que roubam itens em acertos críticos e desviam golpes com reflexos dourados.</li>
  <li><strong>Sacerdote de Hyninn Deturpado (ND 4):</strong> Clérigo que assume a forma de um macaco pamgra de cristal e conjura magias letais de Hyninn.</li>
  <li><strong>Tigre-de-Hyninn Deturpado (ND 6):</strong> Fera mutante com garras, mordidas e cinco tentáculos, protegida por um borrão dourado interplanar de 50% a 75%.</li>
  <li><strong>Aço Selvagem (ND 6):</strong> Amálgama de metal vivo incandescente surgido do fracasso do ritual, capaz de engolir inimigos e irradiar calor extremo.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 700000,
      flags: {},
      _stats: statsHeader
    }
  ];

  await db.put(`!journal!${journalId}`, journalDoc);
  const embeddedPages = [];

  for (const p of pages) {
    const pageDoc = {
      ...p,
      _dbKey: `!journal.pages!${journalId}.${p._id}`
    };
    await db.put(`!journal.pages!${journalId}.${p._id}`, pageDoc);
    embeddedPages.push({ key: `!journal.pages!${journalId}.${p._id}`, doc: pageDoc });
  }

  saveToSourcePacks('Diarios_T20', journalDoc, embeddedPages);
  console.log(`✓ Diário "${journalDoc.name}" salvo com ${pages.length} páginas.`);
  await db.close();
}

// ============================================================================
// 4. TABELAS DE ROLAGEM (Tabelas_T20)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 26 em Tabelas_T20 ---');
  await ensureFolder('Tabelas_T20', {
    name: 'Fullgor dos Deuses',
    type: 'RollTable',
    folder: null,
    sorting: 'a',
    _id: FOLDER_TABELAS,
    description: 'Tabelas de encontros, boatos e qualidades de Fúlgor dos Deuses.',
    sort: 1400000,
    flags: {},
    _stats: statsHeader
  });

  const db = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await db.open();

  const tables = [
    // 1. Subterrâneos de Valkaria — Encontros e Boatos (1d6)
    {
      id: 'fld26TabEncontros',
      name: 'Subterrâneos de Valkaria — Encontros e Boatos (Edição 26)',
      formula: '1d6',
      img: 'systems/tormenta20/icons/itens/equipamentos/tocha.webp',
      description: '<p>Tabela de eventos aleatórios e pistas nos subterrâneos de Valkaria durante a perseguição à Alma da Bigorna.</p>',
      results: [
        {
          id: 'res26Enc0000001',
          name: 'Pichações da Raposa Dourada',
          text: 'Pichações em tinta fosforescente mostram o símbolo de Hyninn com olhos de chama dourada, apontando para canais fluviais abandonados.',
          range: [1, 1]
        },
        {
          id: 'res26Enc0000002',
          name: 'Patrulha da Guarda de Valkaria',
          text: 'Uma patrulha de guardas municipais desconfia do grupo armado. Um teste de Diplomacia ou Enganação CD 18 evita confusão.',
          range: [2, 2]
        },
        {
          id: 'res26Enc0000003',
          name: 'Mendigo Abençoado',
          text: 'Um antigo devoto de Keenn pede esmolas e murmura sobre correntes que tilintam sozinhas sob o Campo de Keenn.',
          range: [3, 3]
        },
        {
          id: 'res26Enc0000004',
          name: 'Estilhas Cristalinas Esquecidas',
          text: 'O grupo encontra resquícios de uma batalha entre ladrões: 1d6 estilhas fullgori em meio a sangue seco e cinzas.',
          range: [4, 4]
        },
        {
          id: 'res26Enc0000005',
          name: 'Emboscada de Ladrões Menores',
          text: 'Dois ladrões comuns tentam roubar a retaguarda dos heróis, fugindo ao primeiro sinal de combate.',
          range: [5, 5]
        },
        {
          id: 'res26Enc0000006',
          name: 'Eco de Martelos Sagrados',
          text: 'Um som distante de batidas de bigorna reverbera nas pedras, restaurando 1 PM para todos os devotos do grupo.',
          range: [6, 6]
        }
      ]
    },
    // 2. Qualidades Antidivinas de Aço Sillariano (1d10)
    {
      id: 'fld26TabQualidades',
      name: 'Qualidades Antidivinas de Aço Sillariano (Edição 26)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/itens/equipamentos/lingote.webp',
      description: '<p>Determinação aleatória de qualidades forjadas no aço sillariano para NPCs ou recompensas espontâneas.</p>',
      results: [
        { id: 'res26Q000000001', name: 'Absorção Antidivina', text: 'Recupera 1 PM ao causar dano a criatura divina 1/cena.', range: [1, 1] },
        { id: 'res26Q000000002', name: 'Arma Antidivina', text: 'Dano da arma aumenta em um passo contra criaturas divinas.', range: [2, 2] },
        { id: 'res26Q000000003', name: 'Defesa Antidivina', text: '+2 na Defesa contra criaturas divinas.', range: [3, 3] },
        { id: 'res26Q000000004', name: 'Guarda Antidivina', text: '+2 em resistências contra criaturas divinas e ignora Teofagia 1/cena.', range: [4, 4] },
        { id: 'res26Q000000005', name: 'Impedimento Antidivino', text: 'Força criatura divina a rerrolar teste de resistência 1/cena.', range: [5, 5] },
        { id: 'res26Q000000006', name: 'Magia Antidivina', text: '+5 na CD de magias contra criaturas divinas.', range: [6, 6] },
        { id: 'res26Q000000007', name: 'Mente Antidivina', text: '+2 em testes de perícia envolvendo criaturas divinas.', range: [7, 7] },
        { id: 'res26Q000000008', name: 'Perseguidora Antidivina', text: '+2 em testes de ataque e crítico causa metade do dano em vez de nada.', range: [8, 8] },
        { id: 'res26Q000000009', name: 'Potência Antidivina', text: '-1 PM no custo de habilidades contra criaturas divinas.', range: [9, 9] },
        { id: 'res26Q000000010', name: 'Resistência Antidivina', text: 'Fornece RD 5 contra criaturas divinas.', range: [10, 10] }
      ]
    },
    // 3. Frases de Combate de Xellmaras (1d8)
    {
      id: 'fld26TabFrasesXell',
      name: 'Frases de Combate de Xellmaras (Edição 26)',
      formula: '1d8',
      img: 'systems/tormenta20/icons/poderes/ameacas/ataque-de-correntes.webp',
      description: '<p>Frases dramáticas e blasfêmias pronunciadas por Xellmaras, a Ladra Acorrentada, durante o confronto.</p>',
      results: [
        { id: 'res26F000000001', name: 'Bolsas dos Deuses', text: '"Hyninn ensina que até os deuses têm bolsas."', range: [1, 1] },
        { id: 'res26F000000002', name: 'Arsenal Forja', text: '"Arsenal forja armas — eu as roubo."', range: [2, 2] },
        { id: 'res26F000000003', name: 'Fullgor Toma', text: '"O Fullgor não pede oferendas. Ele toma tudo."', range: [3, 3] },
        { id: 'res26F000000004', name: 'Aço Obedece', text: '"A Alma da Bigorna canta em mim... e o aço obedece."', range: [4, 4] },
        { id: 'res26F000000005', name: 'O Preço', text: '"Os Forjadores rezam por força. Eu mostro o preço."', range: [5, 5] },
        { id: 'res26F000000006', name: 'Serva da Dor', text: '"O Fullgor me libertou da vergonha do crime. Agora, sirvo à dor."', range: [6, 6] },
        { id: 'res26F000000007', name: 'Minha Alma', text: '"Arsenal perdeu seu mundo. Hyninn, sua vergonha. Eu, minha alma."', range: [7, 7] },
        { id: 'res26F000000008', name: 'Eco das Correntes', text: '"Sou o eco das correntes que prenderam deuses."', range: [8, 8] }
      ]
    }
  ];

  for (const t of tables) {
    const tableDoc = {
      _id: t.id,
      name: t.name,
      folder: FOLDER_TABELAS,
      sort: 100000,
      formula: t.formula,
      img: t.img,
      description: t.description,
      results: t.results.map(r => r.id),
      replacement: true,
      displayRoll: true,
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!tables!${t.id}`, tableDoc);
    const embeddedResults = [];

    for (const r of t.results) {
      const resDoc = {
        _id: r.id,
        _dbKey: `!tables.results!${t.id}.${r.id}`,
        type: 'text',
        name: r.name,
        text: r.text,
        description: r.text,
        img: 'icons/svg/d20-black.svg',
        weight: 1,
        range: r.range,
        drawn: false,
        flags: {},
        _stats: statsHeader
      };
      await db.put(`!tables.results!${t.id}.${r.id}`, resDoc);
      embeddedResults.push({ key: `!tables.results!${t.id}.${r.id}`, doc: resDoc });
    }

    saveToSourcePacks('Tabelas_T20', tableDoc, embeddedResults);
    console.log(`✓ Tabela "${t.name}" salva com ${t.results.length} resultados.`);
  }

  await db.close();
}

// ============================================================================
// 5. MACROS (Macros_T20)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 26 em Macros_T20 ---');
  await ensureFolder('Macros_T20', {
    name: 'Fullgor dos Deuses',
    type: 'Macro',
    folder: null,
    sorting: 'a',
    _id: FOLDER_MACROS,
    description: 'Macros de suporte para as mecânicas de Fúlgor dos Deuses.',
    sort: 1400000,
    flags: {},
    _stats: statsHeader
  });

  const db = new ClassicLevel(path.join(PACKS_DIR, 'Macros_T20'), { valueEncoding: 'json' });
  await db.open();

  const macroId = 'fld26MacroForjaS';
  const macroScript = `/**
 * Forjar Aço Sillariano — Fúlgor dos Deuses (Edição 26)
 * Permite ao Mestre ou Jogador registrar a forja de armas com estilhas fullgori.
 */
const QUALIDADES = [
  { name: "Absorção Antidivina", cost: 10, desc: "Recupera 1 PM ao causar dano a criatura divina (1/cena)." },
  { name: "Arma Antidivina", cost: 10, desc: "Dano da arma aumenta em um passo contra criaturas divinas." },
  { name: "Defesa Antidivina", cost: 10, desc: "+2 na Defesa contra criaturas divinas." },
  { name: "Guarda Antidivina", cost: 10, desc: "+2 em testes de resistência contra criaturas divinas e ignora Teofagia (1/cena)." },
  { name: "Impedimento Antidivino", cost: 10, desc: "Força criatura divina a rolar novamente resistência (1/cena)." },
  { name: "Magia Antidivina", cost: 10, desc: "+5 na CD de magias contra criaturas divinas." },
  { name: "Mente Antidivina", cost: 10, desc: "+2 em testes de perícia envolvendo criaturas divinas." },
  { name: "Perseguidora Antidivina", cost: 10, desc: "+2 em ataque contra criaturas divinas e crítico/furtivo causa metade do dano em vez de nada." },
  { name: "Potência Antidivina", cost: 10, desc: "-1 PM em habilidades usadas contra criaturas divinas." },
  { name: "Resistência Antidivina", cost: 10, desc: "Fornece RD 5 contra qualquer dano causado por criaturas divinas." },
  { name: "Antidevoto", cost: 10, desc: "Aplica os efeitos antidivinos também a semidivinos e devotos de qualquer deus." }
];

let optionsHtml = QUALIDADES.map((q, idx) => \`
  <div style="margin-bottom: 8px;">
    <label>
      <input type="checkbox" id="qual_\${idx}" value="\${q.name}">
      <strong>\${q.name}</strong> (10 estilhas)<br/>
      <small style="color: #555;">\${q.desc}</small>
    </label>
  </div>
\`).join("");

new Dialog({
  title: "Forja do Aço Sillariano — Edição 26",
  content: \`
    <form>
      <p><em>Os Forjadores Litúrgicos aguardam as estilhas fullgori para consagrar o aço sillariano.</em></p>
      <div style="margin-bottom: 12px;">
        <label><strong>Nome do Item/Arma:</strong></label>
        <input type="text" id="itemName" value="Espada da Vingança" style="width: 100%;">
      </div>
      <div style="margin-bottom: 12px;">
        <label><strong>Portador:</strong></label>
        <input type="text" id="bearerName" value="Campeão de Arsenal" style="width: 100%;">
      </div>
      <div style="max-height: 250px; overflow-y: auto; border: 1px solid #ccc; padding: 8px;">
        \${optionsHtml}
      </div>
    </form>
  \`,
  buttons: {
    forjar: {
      icon: '<i class="fas fa-hammer"></i>',
      label: "Bater o Martelo",
      callback: (html) => {
        const itemName = html.find("#itemName").val();
        const bearer = html.find("#bearerName").val();
        const selected = [];
        QUALIDADES.forEach((q, idx) => {
          if (html.find(\`#qual_\${idx}\`).is(":checked")) selected.push(q);
        });

        if (selected.length === 0) {
          ui.notifications.warn("Selecione pelo menos uma qualidade antidivina.");
          return;
        }

        const totalCost = selected.length * 10;
        let cardContent = \`
          <div style="border: 2px solid #800000; border-radius: 6px; padding: 10px; background: #fffaf0;">
            <h3 style="color: #800000; border-bottom: 1px solid #800000; margin-top: 0;">
              <i class="fas fa-fire"></i> Aço Sillariano Forjado!
            </h3>
            <p><strong>Item:</strong> \${itemName}<br/>
            <strong>Portador Sagrado:</strong> \${bearer}<br/>
            <strong>Estilhas Consumidas:</strong> \${totalCost} estilhas</p>
            <p><strong>Qualidades Antidivinas Adquiridas:</strong></p>
            <ul>
              \${selected.map(s => \`<li><strong>\${s.name}:</strong> \${s.desc}</li>\`).join("")}
            </ul>
            <blockquote style="font-style: italic; color: #400000; margin-top: 8px;">
              "Vingança não é ódio. É justiça batida até virar lâmina."<br/>
              — Thalgrimm Sangue de Ferro
            </blockquote>
          </div>
        \`;

        ChatMessage.create({
          content: cardContent,
          speaker: ChatMessage.getSpeaker({ alias: "Forjadores Litúrgicos de Arsenal" })
        });
      }
    },
    cancelar: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancelar"
    }
  },
  default: "forjar"
}).render(true);
`;

  const macroDoc = {
    _id: macroId,
    name: 'Forjar Aço Sillariano (Fúlgor dos Deuses)',
    type: 'script',
    folder: FOLDER_MACROS,
    sort: 100000,
    img: 'systems/tormenta20/icons/itens/equipamentos/martelo-de-forja.webp',
    scope: 'global',
    command: macroScript,
    author: 'piAgentTormenta20',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  saveToSourcePacks('Macros_T20', macroDoc, []);
  console.log(`✓ Macro "${macroDoc.name}" salva e espelhada.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 26');
  console.log('================================================================================');

  await injectThreats();
  await injectItems();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 26 CONCLUÍDA COM SUCESSO EM TODOS OS 5 COMPÊNDIOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 26:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItems, injectJournals, injectTables, injectMacros };

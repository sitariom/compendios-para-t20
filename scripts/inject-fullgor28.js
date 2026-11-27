#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 28: Aço e Arcano
 *
 * Compêndios Alvo:
 * 1. Ameacas_T20: 2 Ameaças canônicas (Liriavel, Forma de Quimera ND 8; Rashid, Fullgori ND 7)
 *    + 1 Perigo Complexo/Ambiental (Templo do Saber em Mutação ND 8)
 * 2. Itens_T20: 6 Itens e Parceiros canônicos (Parceiro: Liriavel Cintilara,
 *    Parceiro: Suporte Arcano da Academia, Chave Antiga do Portal da Academia Arcana,
 *    Matrícula Forjada da Academia Arcana, Gema do Renascimento de Rashid, Desejo de Wynna)
 * 3. Diarios_T20: Diário oficial completo com 7 páginas estruturadas sob !journal.pages!
 * 4. Tabelas_T20: 3 Tabelas de Rolagem (1d6, 1d10, 1d8) com resultados de 16 chars sob !tables.results!
 * 5. Macros_T20: Macro interativa Rastreador de Urgência & Eventos do Campus (Edição 28)
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildSkills,
  buildTracos,
  buildActiveEffect,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  buildHazardActor,
  saveToSourcePacks
} = require('./create-entry');

const PACKS_DIR = path.join(__dirname, '..', 'packs');

const FOLDER_AMEACAS = 'n591wfGB7keSNe7I';
const FOLDER_ITENS = 'fldItensFolder26';
const FOLDER_DIARIOS = 'fldDiariosFold26';
const FOLDER_TABELAS = 'fldTabelasFold26';
const FOLDER_MACROS = 'fldFolderMacro26';

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

// ============================================================================
// 1. AMEAÇAS & PERIGOS (Ameacas_T20)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças e Perigo da Edição 28 em Ameacas_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await db.open();

  const threats = [];

  // 1. Liriavel, Forma de Quimera (ND 8)
  const liriavelAtr = { for: 6, des: 3, con: 4, int: 0, sab: 1, car: -2 };
  const liriavelSkills = buildSkills(8, liriavelAtr, {
    inic: 7,
    perc: 10,
    fort: 21,
    refl: 15,
    vont: 8,
    luta: 26
  });
  const liriavelTracos = buildTracos({ tamanho: 'gra' });
  const liriavelItems = [
    buildWeaponAttack({
      name: 'Duas Mordidas',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '3d8+7',
      tipoDano: 'perfuracao',
      periciaAtaque: 'luta',
      ataques: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Duas mordidas +26 (3d8+7, dano não letal pelas salvaguardas da Academia).</p>',
      flavorPhrase: 'A quimera salta com duas cabeças rosnando fúria teatral!',
      flavorAction: 'Liriavel desfere duas mordidas rápidas'
    }),
    buildWeaponAttack({
      name: 'Marrada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '3d8+7',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 1,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Marrada +26 (3d8+7 impacto).</p>',
      flavorPhrase: 'A cabeça caprina abaixa os chifres para a investida!',
      flavorAction: 'Liriavel golpeia com uma marrada poderosa'
    }),
    buildWeaponAttack({
      name: 'Duas Garras',
      img: 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
      dano: '2d6+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      ataques: 2,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['-2', '', '']], versatil: '', adaptavel: '' },
        { name: 'Dano', key: 'dano1', type: 'dano', parts: [['2d6+10', 'corte', '']], versatil: '', adaptavel: '' }
      ],
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Duas garras +24 (2d6+10 corte).</p>',
      flavorPhrase: 'Garras cintilantes rasgam o ar em volta dos calouros!',
      flavorAction: 'Liriavel ataca com duas garras'
    }),
    buildSpecialPower({
      name: 'Mente Tripla',
      img: 'systems/tormenta20/icons/magias/mente-divina.webp',
      ativacao: { execucao: 'passive', custo: 0 },
      description: '<p>Quando faz um teste de Percepção ou Vontade, Liriavel joga três dados e usa o melhor resultado.</p>'
    }),
    buildSpecialPower({
      name: 'Cabeça de Bode',
      img: 'systems/tormenta20/icons/poderes/classes/lutadores/rasteira.webp',
      ativacao: { execucao: 'reaction', custo: 0 },
      cd: 26,
      resistencia: { pericia: 'fort', atributo: 'for', bonus: 0, txt: 'Fortitude CD 26 evita' },
      rolls: [
        { name: 'Arremesso (por 1,5m)', key: 'dano0', type: 'dano', parts: [['1d6', 'impacto', '']], versatil: '', adaptavel: '' }
      ],
      description: '<p>(Reação) Quando faz uma investida e acerta o ataque de marrada, Liriavel arremessa a vítima 1d6 x 1,5m em uma direção à escolha dela (Fort CD 26 evita). A vítima fica caída e, se atingir algum obstáculo, sofre 1d6 pontos de dano de impacto para cada 1,5m que foi arremessada.</p>'
    }),
    buildSpecialPower({
      name: 'Cabeça de Dragão',
      img: 'systems/tormenta20/icons/magias/bola-de-fogo.webp',
      ativacao: { execucao: 'action', custo: 0 },
      cd: 26,
      alcance: 'short',
      area: 'cone de 6m',
      resistencia: { pericia: 'refl', atributo: 'des', bonus: 0, txt: 'Reflexos CD 26 reduz à metade' },
      rolls: [
        { name: 'Sopro de Fogo', key: 'dano0', type: 'dano', parts: [['10d6+20', 'fogo', '']], versatil: '', adaptavel: '' }
      ],
      description: '<p>(Padrão) Todas as criaturas em um cone de 6m sofrem 10d6+20 pontos de dano de fogo (Ref CD 26 reduz à metade). Recarga (movimento).</p>'
    }),
    buildSpecialPower({
      name: 'Cabeça de Leão',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      ativacao: { execucao: 'free', custo: 0 },
      description: '<p>(Livre) Quando acerta um ataque de mordida com esta cabeça, Liriavel usa a manobra agarrar (teste +28).</p>'
    })
  ];

  threats.push({
    id: 'fld28LiriavelQui',
    name: 'Liriavel, Forma de Quimera',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (sílfide)',
    tamanho: 'gra',
    deslocamento: '9m (6q), voo 12m (8q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum',
    atributos: liriavelAtr,
    attributes: {
      pv: { value: 333, max: 333 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 30 }, // 33 - Des 3 = 30
      cd: 26
    },
    resistencias: liriavelTracos,
    resistenciasTexto: 'Nenhuma',
    pericias: liriavelSkills,
    items: liriavelItems,
    ataquescac: 'Duas mordidas +26 (3d8+7), marrada +26 (3d8+7) e duas garras +24 (2d6+10)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/liriavel-forma-de-quimera.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Se não brilha, eu brilho por você!"<br /><span style="font-weight:bold;color:#800000">— Liriavel Cintilara</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Achei que íamos virar churrasco de quimera no primeiro segundo dentro da Academia! Três cabeças rugindo, fogo pra todo lado... e de repente a fera virou uma fadinha minúscula rindo do nosso susto! Magos são completamente malucos!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Liriavel Cintilara</span> é uma sílfide veterana da Academia Arcana, medalhista em duelos intraplanares e porta-estandarte da Liga dos Pesquisadores de Fenômenos Caóticos Não-Etéreos. Recepciona calouros usando <em>Metamorfose</em> aprimorada em forma de quimera; pelas salvaguardas da Academia, seus golpes causam apenas dano não letal e ela se rende ao perder metade dos PV.</p>`
  });

  // 2. Rashid, Fullgori (ND 7)
  const rashidAtr = { for: 4, des: 1, con: 5, int: 2, sab: 3, car: 0 };
  const rashidSkills = buildSkills(7, rashidAtr, {
    inic: 10,
    perc: 14,
    fort: 21,
    refl: 6,
    vont: 15,
    atle: 14,
    mist: 12,
    reli: 13,
    arte: 15,
    luta: 24
  }, {
    ofic_arquiteto: {
      atributo: 'int',
      treinado: true,
      st: true,
      value: 15,
      outros: 15 - 3 - 2 - 4,
      label: 'Ofício (Arquiteto)'
    }
  });
  const rashidTracos = buildTracos({
    tamanho: 'gra',
    resistencias: { dano: 10 },
    imunidadesDano: ['acido'],
    ic: ['encantamento', 'critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const rashidItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '2d8+20',
      tipoDano: 'impacto',
      danoExtra: '2d8',
      tipoDanoExtra: 'acido',
      periciaAtaque: 'luta',
      ataques: 2,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Pancada x2 +24 (2d8+20 impacto, mais 2d8 ácido).</p>',
      flavorPhrase: '"Vocês não são certos. Alinharei suas formas!"',
      flavorAction: 'Rashid golpeia com punhos de granito pulsante e ácido dourado'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
      ativacao: { execucao: 'passive', custo: 0 },
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM desta forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
      ativacao: { execucao: 'passive', custo: 0 },
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos de metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Criatura do Fullgor',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      ativacao: { execucao: 'passive', custo: 0 },
      description: '<p>Rashid é considerado uma criatura corrompida pelo Fullgor e tem todas as habilidades fullgori.</p>'
    }),
    buildSpecialPower({
      name: 'Contramágica Aprimorada',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-magia.webp',
      ativacao: { execucao: 'reaction', custo: 0 },
      description: '<p>(Reação) Uma vez por rodada, Rashid faz uma contramágica.</p>'
    }),
    buildSpecialPower({
      name: 'Magia Acelerada',
      img: 'systems/tormenta20/icons/magias/barragem-elemental.webp',
      ativacao: { execucao: 'free', custo: 4 },
      description: '<p>(Livre, +4 PM) Uma vez por rodada, quando lança uma magia com execução de ação completa ou menor, Rashid muda a execução dela para livre.</p>'
    }),
    buildSpecialPower({
      name: 'Zelador da Academia Arcana',
      img: 'systems/tormenta20/icons/magias/muralha-elemental.webp',
      ativacao: { execucao: 'passive', custo: 0 },
      description: '<p>Enquanto Rashid estiver na Academia Arcana, o custo de sua magia <em>Controlar Terra</em> é reduzido à metade (já contabilizado em 5 PM).</p>'
    }),
    buildSpellItem({
      name: 'Amarras Etéreas',
      img: 'systems/tormenta20/icons/magias/amarras-etereas.webp',
      circulo: 2,
      tipo: 'arc',
      escola: 'con',
      execucao: 'action',
      custoPM: 6,
      alcance: 'medium',
      duracao: 'scene',
      resistencia: 'Reflexos evita (CD 30)',
      resistenciaPericia: 'refl',
      resistenciaAtributo: 'car',
      formulaDano: '1d8+1',
      tipoDano: 'essencia',
      description: '<p>Três laços de energia surgem e se enroscam em uma criatura em alcance médio, deixando-a agarrada (Ref CD 30 evita). Cada laço destruído causa 1d8+1 pontos de dano de essência na criatura amarrada.</p>'
    }),
    buildSpellItem({
      name: 'Controlar Terra',
      img: 'systems/tormenta20/icons/magias/controlar-terra.webp',
      circulo: 3,
      tipo: 'arc',
      escola: 'tra',
      execucao: 'action',
      custoPM: 5,
      alcance: 'long',
      duracao: 'inst',
      description: '<p>Rashid transforma 15 cubos de terra com 1,5m de lado em alcance longo em uma parede (RD 8 e 50 PV) que fornece cobertura total, ou aplica outros efeitos da magia (custo já reduzido à metade na Academia).</p>'
    }),
    buildSpellItem({
      name: 'Dissipar Magia',
      img: 'systems/tormenta20/icons/magias/dissipar-magia.webp',
      circulo: 2,
      tipo: 'arc',
      escola: 'abj',
      execucao: 'action',
      custoPM: 3,
      alcance: 'medium',
      duracao: 'inst',
      description: '<p>Rashid escolhe uma criatura, objeto ou esfera de 3m em alcance médio e faz um teste de Misticismo. Todas as magias nesse alvo com CD igual ou menor que o resultado do teste são dissipadas.</p>'
    }),
    buildSpellItem({
      name: 'Jato Corrosivo',
      img: 'systems/tormenta20/icons/magias/flecha-acida.webp',
      circulo: 2,
      tipo: 'arc',
      escola: 'evo',
      execucao: 'action',
      custoPM: 9,
      alcance: 'short',
      area: 'linha de 9m',
      duracao: 'inst',
      resistencia: 'Reflexos reduz à metade (CD 30)',
      resistenciaPericia: 'refl',
      resistenciaAtributo: 'car',
      formulaDano: '10d6',
      tipoDano: 'acido',
      description: '<p>Rashid projeta uma linha corrosiva de 9m. Criaturas nessa área sofrem 10d6 pontos de dano de ácido, enquanto construtos e objetos soltos sofrem 10d6+4 pontos de dano (Ref CD 30 reduz à metade).</p>'
    })
  ];

  threats.push({
    id: 'fld28RashidFullg',
    name: 'Rashid, Fullgori',
    nd: '7',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'gra',
    deslocamento: '9m (6q), escavação 9m (6q), voo 12m (8q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: rashidAtr,
    attributes: {
      pv: { value: 280, max: 280 },
      pm: { value: 57, max: 57 },
      defesa: { value: 34, base: 33 }, // 34 - Des 1 = 33
      cd: 30
    },
    resistencias: rashidTracos,
    resistenciasTexto: 'imunidade a encantamento e ácido, redução de dano 10; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)',
    pericias: rashidSkills,
    items: rashidItems,
    ataquescac: 'Pancada x2 +24 (2d8+20, mais 2d8 ácido)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Eu preciso consertar. Tudo deve ficar perfeito."<br /><span style="font-weight:bold;color:#800000">— Rashid, Gênio Zelador</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"O próprio construtor da Academia Arcana rachou de alto a baixo com veias de ouro líquido! Ele atravessava paredes como se fossem água, erguia pilares do nada e jorrava ácido enquanto pedia perdão à própria Wynna!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Rashid</span> é um antigo kemooz criado por Wynna que ergueu a Academia Arcana e serviu a Talude e Vladislav Tpish por séculos. Contaminado pelo Fullgor, sua pele de granito abriu-se em fissuras douradas e seu instinto de serviço transformou-se em compulsão por reconstruir o templo e o mundo à força.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: FOLDER_AMEACAS,
      nd: t.nd,
      cd: t.attributes.cd,
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
      equipamento: t.equipamento || '',
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });

    for await (const [oldKey] of db.iterator({ gte: `!actors.items!${t.id}.`, lte: `!actors.items!${t.id}.\uffff` })) {
      await db.del(oldKey);
    }
    for await (const [oldEffKey] of db.iterator({ gte: `!actors.items.effects!${t.id}.`, lte: `!actors.items.effects!${t.id}.\uffff` })) {
      await db.del(oldEffKey);
    }

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo e espelhado com ${built.embeddedDocs.length} subdocumentos.`);
  }

  // 3. Perigo Ambiental: Templo do Saber em Mutação (Hazard ND 8)
  const hazardBuilt = buildHazardActor({
    name: 'Templo do Saber em Mutação (Edição 28)',
    nd: '8',
    img: 'systems/tormenta20/icons/magias/muralha-elemental.webp',
    folder: FOLDER_AMEACAS,
    goal: 'Sobreviver aos elementos de cenário do Templo do Saber enquanto derrota ou contém Rashid, Fullgori (ajustando as CDs pelo Contador de Urgência).',
    effects: 'Altar pulsante cura Rashid em 10 PV/rodada a até 3m; Rachaduras vivas deixam personagens sem voo lentos; Silêncio sagrado coloca conjuradores em condição ruim.',
    actions: `
      <li><strong>Pilares em Colapso (1d4/rodada):</strong> Um pilar desaba próximo a um personagem, causando 3d5 pontos de dano de impacto (Reflexos CD 20 evita).</li>
      <li><strong>Plataformas Repentinas (1d4/rodada):</strong> Plataformas se erguem 3m ou somem sob os personagens, deixando-os caídos (Reflexos CD 20 evita).</li>
      <li><strong>Estátuas Súbitas:</strong> Bloqueiam ataques à distância, concedendo cobertura leve (+5 na Defesa) a Rashid contra disparos.</li>
    `
  });
  hazardBuilt.actorDoc._id = 'fld28PerigoTempl';
  hazardBuilt.actorDoc.prototypeToken.texture.src = 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png';
  await db.put(`!actors!${hazardBuilt.actorDoc._id}`, hazardBuilt.actorDoc);
  saveToSourcePacks('Ameacas_T20', hazardBuilt.actorDoc, []);
  console.log(`✓ Perigo "${hazardBuilt.actorDoc.name}" salvo.`);

  await db.close();
}

// ============================================================================
// 2. ITENS, PARCEIROS & RECOMPENSAS (Itens_T20)
// ============================================================================
async function injectItems() {
  console.log('\n--- Injetando Itens e Parceiros da Edição 28 em Itens_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await db.open();

  const items = [
    {
      _id: 'fld28ParcLiriavA',
      name: 'Parceiro: Liriavel Cintilara',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/silfide.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Parceira Ajudante Mestre:</strong> Liriavel Cintilara acompanha o grupo pelos corredores e laboratórios da Academia Arcana como guia veterana hiperativa. Concede <strong>+4 em testes de Conhecimento, Diplomacia e Misticismo</strong>.</p>'
        },
        tipo: 'geral',
        subtipo: 'parceiro',
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: [
        {
          _id: 'eff28LiriavelM4A',
          name: 'Parceira Ajudante Mestre (+4 Conh/Dipl/Mist)',
          changes: [
            { key: 'system.pericias.conh.bonus', mode: 2, value: '4', priority: 20 },
            { key: 'system.pericias.dipl.bonus', mode: 2, value: '4', priority: 20 },
            { key: 'system.pericias.mist.bonus', mode: 2, value: '4', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld28ParcAcadAAA',
      name: 'Parceiro: Suporte Arcano da Academia (Vladislav Tpish)',
      type: 'poder',
      img: 'systems/tormenta20/icons/itens/gerais/robe-mistico.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Parceiro Adepto, Destruidor ou Magivocador Mestre:</strong> Conjurações de apoio disponibilizadas pelo reitor Vladislav Tpish até o final da aventura na Academia Arcana. Escolha entre Adepto Mestre (–2 PM no custo de magias de 1º/2º círculo), Destruidor Mestre (+2d8+4 de dano em magias) ou Magivocador Mestre (+2d8 de dano em magias e +2 na CD de magias).</p>'
        },
        tipo: 'geral',
        subtipo: 'parceiro',
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: [
        {
          _id: 'eff28AcadSuportA',
          name: 'Suporte Arcano da Academia (+2 CD e +2d8 Dano Mágico)',
          changes: [
            { key: 'system.attributes.cd', mode: 2, value: '2', priority: 20 },
            { key: 'system.modificadores.dano.mag', mode: 2, value: '2d8', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld28ChavePortaA',
      name: 'Chave Antiga do Portal da Academia Arcana',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-da-luminosidade.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Item de Missão:</strong> Pequena chave metálica antiga entregue por Thalgrimm Sangue de Ferro. Vibra e aquece quando aproximada da porta lisa do casebre "Escola de Magia" em Valkaria, destravando o portal para o semiplano da Academia Arcana.</p>'
        },
        tipo: 'acessorio',
        preco: 0,
        peso: 0.2,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: []
    },
    {
      _id: 'fld28MatricForjA',
      name: 'Matrícula Forjada da Academia Arcana',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/gerais/pergaminho.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Documento de Infiltração:</strong> Pergaminhos lacrados e registros acadêmicos forjados por devotos infiltrados da Igreja de Arsenal, listando os nomes reais dos personagens como calouros recém-aprovados nos exames de admissão.</p>'
        },
        tipo: 'acessorio',
        preco: 0,
        peso: 0.1,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: []
    },
    {
      _id: 'fld28GemaWynnaAA',
      name: 'Gema do Renascimento de Rashid (Bênção de Wynna)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Relíquia Divina de Wynna:</strong> Gema preciosa manifestada pela própria Deusa da Magia quando todos os heróis sacrificam seus Desejos para salvar Rashid. Em seu interior pulsa um turbilhão luminoso vivo, garantindo que o gênio renascerá puro e livre do Fullgor no devido tempo.</p>'
        },
        tipo: 'esoterico',
        preco: 0,
        peso: 0.5,
        espacos: 0.5,
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: []
    },
    {
      _id: 'fld28DesejoWynna',
      name: 'Desejo de Wynna',
      type: 'poder',
      img: 'systems/tormenta20/icons/magias/desejo.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Dádiva Divina de Wynna:</strong> Concedido aos heróis que tentaram sacrificar seu Desejo pessoal para tentar salvar Rashid. Fica armazenado na alma do personagem e pode ser invocado uma vez no momento escolhido, produzindo os efeitos da magia <em>Desejo</em> sem custo de PM ou componentes.</p>'
        },
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'action', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 28'
      },
      rawEffects: []
    }
  ];

  for (const item of items) {
    const rawEffects = item.rawEffects || [];
    const effectIds = rawEffects.map(e => e._id);
    const embeddedEffects = [];

    for await (const [oldEffKey] of db.iterator({ gte: `!items.effects!${item._id}.`, lte: `!items.effects!${item._id}.\uffff` })) {
      await db.del(oldEffKey);
    }

    for (const eff of rawEffects) {
      const effectDoc = buildActiveEffect({
        id: eff._id,
        name: eff.name,
        img: item.img,
        origin: `Item.${item._id}`,
        changes: eff.changes || [],
        transfer: true
      });
      embeddedEffects.push(effectDoc);
      await db.put(`!items.effects!${item._id}.${eff._id}`, effectDoc);
    }

    const itemDoc = {
      ...item,
      effects: effectIds,
      flags: {},
      _stats: statsHeader
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
  console.log('\n--- Injetando Diários da Edição 28 em Diarios_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await db.open();

  const journalId = 'fld28DiarioAcoAr';
  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 28: Aço e Arcano',
    folder: FOLDER_DIARIOS,
    sort: 300000,
    ownership: { default: -1 },
    flags: {},
    pages: [
      'p28SinopseAvent1',
      'p28Parte1Portoe1',
      'p28Parte2FadaGe1',
      'p28Parte3Reitor1',
      'p28Parte4Rashid1',
      'p28RegrasUrgenc1',
      'p28BestiarioNpc1'
    ],
    _stats: statsHeader
  };

  const pages = [
    {
      _id: 'p28SinopseAvent1',
      name: 'Apresentação & Sinopse: Aço e Arcano',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Aço e Arcano</h2>
<p><em>Revista Tormenta20 — Edição 28 (Junho de 2026). Criação por Marcelo Cassaro.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"O Fullgor já tocou o kemooz. E o kemooz está na Academia. Se Wynna sentir essa distorção… o que vier depois não terá volta."
</blockquote>
<h3>Sinopse da Aventura</h3>
<p>Convocados novamente pelo frade anão <strong>Thalgrimm Sangue de Ferro</strong>, os heróis recebem uma missão clandestina: infiltrar-se na <strong>Academia Arcana</strong> disfarçados como estudantes de intercâmbio. Um ser divino — <strong>Rashid</strong>, um antigo kemooz (gênio da terra) criado por Wynna e zelador do campus — foi capturado em estado avançado de contaminação pelo Fullgor e mantido em contenção para estudos.</p>
<p>Com matrículas forjadas e uma chave metálica antiga, o grupo deve sobreviver ao tradicional trote acadêmico, localizar o laboratório na Casa de Thanatus, lidar com a desconfiança do reitor <strong>Vladislav Tpish</strong> e deter o gênio antes que sua loucura deforme o Templo do Saber e alcance a própria Deusa da Magia.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 100000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28Parte1Portoe1',
      name: 'Parte 1: Portões e Disfarces',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 1: Portões e Disfarces</h2>
<h3>Cena 1: Academia em Perigo</h3>
<p>Após uma semana de descanso em Baldonn (+5 Diplomacia para barganha) ou Valkaria, Thalgrimm entrega aos campeões <strong>10 essências de mana</strong>, matrículas forjadas com seus nomes reais, um mapa urbano e uma chave antiga.</p>
<h3>Cena 2: "Escola de Magia"</h3>
<p>Localizar o casebre com a placa "Escola de Magia" em Valkaria exige <strong>Investigação ou Sobrevivência CD 20</strong> (falha: Urgência +1; falha por 5+: encontro urbano em <em>Ameaças de Arton</em>, p. 428, +30 patamar veterano).</p>
<h3>Cena 3: Quimera à Solta</h3>
<p>Ao atravessar o portal para a Academia Arcana, os heróis são atacados por <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28LiriavelQui]{Liriavel, Forma de Quimera (ND 8)}</strong>. Pelas salvaguardas da Academia, todo dano causado é não letal. Ao perder metade dos PV, ela se rende e revela tratar-se do tradicional trote de recepção!</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 200000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28Parte2FadaGe1',
      name: 'Parte 2: A Fada e o Gênio',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 2: A Fada e o Gênio</h2>
<h3>Cena 1: Calouros e Veterana</h3>
<p>Se tratada com gentileza, a sílfide <strong>Liriavel "Liria" Cintilara</strong> decide guiar os calouros, atuando como <strong>Parceira Ajudante Mestre</strong> (+4 em Conhecimento, Diplomacia e Misticismo).</p>
<h3>Cena 2: Investigação no Campus (ND 8)</h3>
<p>Teste estendido: <strong>4 sucessos antes de 3 falhas</strong> (CDs ajustadas por Urgência):</p>
<ul>
  <li><em>Atuação ou Diplomacia CD 20</em>, <em>Conhecimento CD 18</em>, <em>Enganação CD 18</em>, <em>Furtividade CD 25</em>, <em>Intuição CD 20</em>, <em>Investigação CD 22</em>, <em>Misticismo CD 22</em>, <em>Percepção CD 20</em>, <em>Religião CD 20</em>.</li>
</ul>
<h3>Cena 3: Rashid, Fullgori</h3>
<p>Nos níveis inferiores da Casa de Thanatus, <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28RashidFullg]{Rashid, Fullgori (ND 7)}</strong> rompe os selos de contenção (onde todo dano é letal!). Luta por 3 rodadas ou até metade dos PV antes de atravessar uma parede e fugir, enquanto um círculo rúnico teletransporta os heróis à reitoria.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 300000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28Parte3Reitor1',
      name: 'Parte 3: A Decisão do Reitor',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 3: A Decisão do Reitor</h2>
<h3>Cena 1: Vladislav Tpish (ND 8)</h3>
<p>Teste estendido (<strong>4 sucessos antes de 3 falhas</strong>, CDs ajustadas por Urgência) para convencer o reitor Vladislav Tpish sobre a gravidade irreversível da contaminação de Rashid: <em>Conhecimento CD 20, Cura/Misticismo CD 20, Diplomacia CD 20, Enganação CD 25, Guerra CD 20, Intimidação CD 20, Intuição CD 20, Religião CD 20</em>.</p>
<h3>Cena 2: Diálogo Mental</h3>
<p>Vladislav estabelece conexão telepática constante, libera acessos de teleporte ao Templo do Saber e concede a cada personagem um <strong>Parceiro Adepto, Destruidor ou Magivocador Mestre</strong> até o fim da aventura.</p>
<h3>Cena 3: Ruas que Respiram (ND 8)</h3>
<p>Perseguição pelo campus em mutação: <strong>5 sucessos antes de 3 falhas</strong> (<em>Acrobacia CD 22, Atletismo CD 22, Intuição CD 22, Misticismo CD 25, Percepção CD 25, Reflexos CD 22, Sobrevivência CD 22</em>). Após cada teste, role 1d6 na tabela <em>Ruas que Respiram — Eventos Aleatórios</em>.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 400000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28Parte4Rashid1',
      name: 'Parte 4: Rashid de Wynna',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 4: Rashid de Wynna</h2>
<h3>Cena 1: Templo do Saber</h3>
<p>Confronto final contra <strong>Rashid, Fullgori</strong> em meio aos Elementos de Cenário do Templo do Saber em mutação (Pilares em colapso, Plataformas repentinas, Altar pulsante +10 PV/rodada, Rachaduras vivas, Estátuas súbitas +5 Defesa à distância, Silêncio sagrado). A cada 2 turnos, Rashid cria 1d4 gárgulas assassinas.</p>
<h3>Cena 2: Desejos e Destino</h3>
<p>Antes de se desfazer em poeira luminosa acolhida pela estátua viva de Wynna, Rashid concede a cada herói um <strong>Desejo</strong> sem custo ou deturpação.</p>
<h3>Cena 3: Deusa da Magia</h3>
<ul>
  <li><strong>Desejos pessoais:</strong> Wynna aprova a prosperidade e mantém os Desejos.</li>
  <li><strong>Parte do grupo tentou salvar Rashid:</strong> Wynna guarda um <em>Desejo de Wynna</em> na alma de cada um desses heróis.</li>
  <li><strong>Todos tentaram salvar Rashid:</strong> Wynna viola as leis da Criação e manifesta a <em>Gema do Renascimento de Rashid</em> para devolvê-lo puro ao mundo.</li>
</ul>
<p>Ao concluir <em>Aço e Arcano</em>, todos os personagens avançam para o <strong>9º nível</strong>!</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 500000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28RegrasUrgenc1',
      name: 'Regras Especiais: Contador de Urgência & Salvaguardas',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Regras Especiais da Edição 28</h2>
<h3>Contador de Urgência</h3>
<p><em>Aço e Arcano</em> é uma corrida contra o tempo. Sempre que o texto indicar falha com <strong>Urgência +1</strong> (ou +2), anote o contador cumulativo. Esse valor é somado à CD dos testes estendidos subsequentes e da batalha final.</p>
<p><strong>Exceção Heroica:</strong> Em qualquer teste que somaria Urgência em caso de falha, rolar um <strong>20 natural</strong> reduz o Contador de Urgência em 1.</p>
<h3>Salvaguardas da Academia</h3>
<p>Em condições normais na Academia Arcana, todo dano letal é convertido em dano não letal (como ocorre no trote de Liriavel). Contudo, nas proximidades da corrupção fullgori de Rashid (Casa de Thanatus e Templo do Saber), as salvaguardas deixam de operar e todo dano é plenamente letal.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 600000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p28BestiarioNpc1',
      name: 'Bestiário & NPCs da Edição 28',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Bestiário & NPCs da Edição 28</h2>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28LiriavelQui]{Liriavel, Forma de Quimera (ND 8)}:</strong> Sílfide veterana transformada em quimera Grande (333 PV, Defesa 33, sopro de fogo 10d6+20 CD 26).</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28RashidFullg]{Rashid, Fullgori (ND 7)}:</strong> Kemooz zelador deturpado pelo Fullgor (280 PV, 57 PM, Defesa 34, RD 10, imunidade a encantamento e ácido, 4 magias arcanas CD 30).</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28PerigoTempl]{Templo do Saber em Mutação (Perigo ND 8)}:</strong> Elementos de cenário e perigos ambientais do clímax.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 700000,
      flags: {},
      _stats: statsHeader
    }
  ];

  for await (const [oldPageKey] of db.iterator({ gte: `!journal.pages!${journalId}.`, lte: `!journal.pages!${journalId}.\uffff` })) {
    await db.del(oldPageKey);
  }
  await db.put(`!journal!${journalId}`, journalDoc);
  const embeddedPages = [];
  for (const p of pages) {
    const pageDoc = { ...p, _dbKey: `!journal.pages!${journalId}.${p._id}` };
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
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 28 em Tabelas_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await db.open();

  const tables = [
    {
      id: 'fld28TabRuasResp',
      name: 'Ruas que Respiram — Eventos Aleatórios (Edição 28)',
      formula: '1d6',
      img: 'systems/tormenta20/icons/magias/muralha-elemental.webp',
      description: '<p>Tabela de eventos aleatórios rolada após cada teste do desafio Ruas que Respiram na Academia Arcana.</p>',
      results: [
        { id: 'res28Rua00000001', name: 'Paredes que Fecham', text: 'Um corredor se estreita. Todos fazem um teste de Reflexos CD 20 ou sofrem 6d6 pontos de dano de impacto e Urgência +1.', range: [1, 1] },
        { id: 'res28Rua00000002', name: 'Escada Crescente', text: 'Uma escada espirala para cima sem aviso. Todos devem passar em um teste de Acrobacia CD 18 para não cair; falha = atraso, Urgência +1.', range: [2, 2] },
        { id: 'res28Rua00000003', name: 'Luzes Oscilantes', text: 'A visão some e volta em flashes. Percepção CD 20 para não seguir caminho errado. Falha resulta em penalidade de –2 em todos os testes no próximo turno.', range: [3, 3] },
        { id: 'res28Rua00000004', name: 'Estátuas se Movem', text: 'Esculturas semi-vivas tentam bloquear o caminho. Todos devem passar em um teste de Atletismo CD 15, ou conta como uma falha no teste estendido.', range: [4, 4] },
        { id: 'res28Rua00000005', name: 'Piso que Respira (Ritmo)', text: 'O chão sobe e desce como o diafragma numa respiração. Um personagem pode fazer um teste de Sobrevivência CD 18 para prever o ritmo. Falha = escorregam, Urgência +1.', range: [5, 5] },
        { id: 'res28Rua00000006', name: 'Piso que Respira (Pulso)', text: 'O chão sobe e desce como um diafragma. Um personagem pode fazer um teste de Sobrevivência CD 18 para antecipar o ritmo. Falha = escorregam, Urgência +1.', range: [6, 6] }
      ]
    },
    {
      id: 'fld28TabFrasesRa',
      name: 'Frases de Combate de Rashid Fullgori (Edição 28)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/ameacas/golem-de-ferro.png',
      description: '<p>Falas de Rashid durante o primeiro confronto na Casa de Thanatus.</p>',
      results: [
        { id: 'res28Rsh00000001', name: 'Minha Obra', text: '"A Academia… minha obra… minha prisão… agora MINHA para refazer!"', range: [1, 1] },
        { id: 'res28Rsh00000002', name: 'Sirvo ao Brilho', text: '"Eu servi por eras! Agora sirvo apenas ao brilho!"', range: [2, 2] },
        { id: 'res28Rsh00000003', name: 'Paredes Respiram', text: '"As paredes respiram errado! Eu vou CONSERTAR!"', range: [3, 3] },
        { id: 'res28Rsh00000004', name: 'Academia Perfeita', text: '"A Academia será perfeita quando todos vocês forem parte dela!"', range: [4, 4] },
        { id: 'res28Rsh00000005', name: 'Eu Obedeço', text: '"A luz dourada… ela manda… ela exige… EU OBEDEÇO!"', range: [5, 5] },
        { id: 'res28Rsh00000006', name: 'Fiquem Parados', text: '"FIQUEM PARADOS… vou moldá-los!"', range: [6, 6] },
        { id: 'res28Rsh00000007', name: 'Alinhar Formas', text: '"Vocês não são certos. Alinharei suas formas!"', range: [7, 7] },
        { id: 'res28Rsh00000008', name: 'Reforma Não Acabou', text: '"Se resistem… é porque a reforma não acabou."', range: [8, 8] },
        { id: 'res28Rsh00000009', name: 'Destruam-me', text: '"Destruam-me… antes que eu reconstrua vocês…"', range: [9, 9] },
        { id: 'res28Rsh00000010', name: 'Pedra Chorando', text: '"Wynna… sinto sua pedra… chorando…"', range: [10, 10] }
      ]
    },
    {
      id: 'fld28TabFrasesTe',
      name: 'Frases de Combate no Templo do Saber (Edição 28)',
      formula: '1d8',
      img: 'systems/tormenta20/icons/magias/controlar-terra.webp',
      description: '<p>Súplicas e declarações de Rashid durante a batalha final no Templo do Saber.</p>',
      results: [
        { id: 'res28Tmp00000001', name: 'Deixem-me Terminar', text: '"Eu construí para Ela… deixem-me terminar…"', range: [1, 1] },
        { id: 'res28Tmp00000002', name: 'Ordem Deve Existir', text: '"Pedra deve permanecer. Luz deve brilhar. Ordem deve existir."', range: [2, 2] },
        { id: 'res28Tmp00000003', name: 'Perdoe-me', text: '"Wynna… perdoe-me…"', range: [3, 3] },
        { id: 'res28Tmp00000004', name: 'Preciso Consertar', text: '"Tudo desmorona… eu preciso consertar…"', range: [4, 4] },
        { id: 'res28Tmp00000005', name: 'Perfeição Dói', text: '"A perfeição dói. Eu aceito a dor."', range: [5, 5] },
        { id: 'res28Tmp00000006', name: 'Partam a Mim', text: '"Não partam o templo… partam a mim."', range: [6, 6] },
        { id: 'res28Tmp00000007', name: 'Cuidem das Fundações', text: '"Se eu cair… cuidem das fundações…"', range: [7, 7] },
        { id: 'res28Tmp00000008', name: 'Obra Permanece', text: '"Meu mestre me deixou… mas minha obra pode permanecer."', range: [8, 8] }
      ]
    }
  ];

  for (const t of tables) {
    for await (const [oldResKey] of db.iterator({ gte: `!tables.results!${t.id}.`, lte: `!tables.results!${t.id}.\uffff` })) {
      await db.del(oldResKey);
    }

    const tableDoc = {
      _id: t.id,
      name: t.name,
      folder: FOLDER_TABELAS,
      sort: 300000,
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
  console.log('\n--- Injetando Macro da Edição 28 em Macros_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Macros_T20'), { valueEncoding: 'json' });
  await db.open();

  const macroId = 'fld28MacroUrgenc';
  const macroScript = `/**
 * Rastreador de Urgência & Eventos do Campus — Fúlgor dos Deuses (Edição 28)
 */
const FLAG_KEY = "fullgor28Urgencia";
const current = Number(game.user.getFlag("world", FLAG_KEY) || 0);

const EVENTOS = [
  "1) Paredes que Fecham: Reflexos CD 20 ou 6d6 impacto e Urgência +1.",
  "2) Escada Crescente: Acrobacia CD 18 para não cair; falha = atraso, Urgência +1.",
  "3) Luzes Oscilantes: Percepção CD 20; falha = -2 em todos os testes no próximo turno.",
  "4) Estátuas se Movem: Atletismo CD 15 ou conta como falha no teste estendido.",
  "5) Piso que Respira (Ritmo): Sobrevivência CD 18; falha = escorregam, Urgência +1.",
  "6) Piso que Respira (Pulso): Sobrevivência CD 18; falha = escorregam, Urgência +1."
];

const dialogHtml = \`
  <form>
    <p><strong>Urgência Atual:</strong> <span style="color:#800000;font-size:1.2em;">+\${current} na CD</span></p>
    <p><small>Falhas aumentam a Urgência; um 20 natural em testes de risco reduz em 1.</small></p>
  </form>
\`;

async function onInc() {
  const next = current + 1;
  await game.user.setFlag("world", FLAG_KEY, next);
  ChatMessage.create({ content: \`<p><strong>⏳ Contador de Urgência (Ed. 28):</strong> Agora em <strong>+\${next}</strong> na CD!</p>\` });
}

async function onDec() {
  const next = Math.max(0, current - 1);
  await game.user.setFlag("world", FLAG_KEY, next);
  ChatMessage.create({ content: \`<p><strong>✨ 20 Natural! Contador de Urgência reduzido para +\${next} na CD.</strong></p>\` });
}

async function onEvento() {
  const roll = await new Roll("1d6").evaluate();
  const ev = EVENTOS[roll.total - 1];
  ChatMessage.create({ content: \`<div style="border:2px solid #4b0082;padding:8px;border-radius:6px;background:#f8f6ff;"><h4 style="margin:0 0 4px 0;color:#4b0082;">Ruas que Respiram (1d6 = \${roll.total})</h4><p style="margin:0;">\${ev}</p></div>\` });
}

if (foundry?.applications?.api?.DialogV2) {
  foundry.applications.api.DialogV2.wait({
    window: { title: "Edição 28 — Contador de Urgência & Ruas que Respiram" },
    content: dialogHtml,
    buttons: [
      { action: "inc", icon: "fas fa-plus", label: "Urgência +1", callback: onInc },
      { action: "dec", icon: "fas fa-minus", label: "20 Natural (-1)", callback: onDec },
      { action: "evento", icon: "fas fa-dice-d6", label: "Rolar Evento (1d6)", default: true, callback: onEvento }
    ]
  });
} else {
  new Dialog({
    title: "Edição 28 — Contador de Urgência & Ruas que Respiram",
    content: dialogHtml,
    buttons: {
      inc: { icon: '<i class="fas fa-plus"></i>', label: "Urgência +1", callback: onInc },
      dec: { icon: '<i class="fas fa-minus"></i>', label: "20 Natural (-1)", callback: onDec },
      evento: { icon: '<i class="fas fa-dice-d6"></i>', label: "Rolar Evento (1d6)", callback: onEvento }
    },
    default: "evento"
  }).render(true);
}
`;

  const macroDoc = {
    _id: macroId,
    name: 'Rastreador de Urgência & Eventos do Campus (Edição 28)',
    type: 'script',
    folder: FOLDER_MACROS,
    sort: 300000,
    img: 'systems/tormenta20/icons/magias/visao-mistica.webp',
    scope: 'global',
    command: macroScript,
    author: 'kL8nfmJOQTqjeU2x',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  saveToSourcePacks('Macros_T20', macroDoc, []);
  console.log(`✓ Macro "${macroDoc.name}" salva.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 28 (AÇO E ARCANO)');
  console.log('================================================================================');

  await injectThreats();
  await injectItems();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 28 CONCLUÍDA COM SUCESSO EM TODOS OS COMPÊNDIOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 28:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItems, injectJournals, injectTables, injectMacros };

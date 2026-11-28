#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 31: Pecados do Pai (RT20-031)
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const {
  buildItem,
  buildSkills,
  buildTracos,
  buildActiveEffect,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const ED31_PACKS_DIR = path.join(
  __dirname,
  '..',
  'packs',
  'revistas',
  'revista-tormenta-20',
  'fulgor-dos-deuses',
  'edicao-31'
);

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

async function openHierarchicalPack(packName) {
  const packDir = path.join(ED31_PACKS_DIR, packName);
  fs.mkdirSync(packDir, { recursive: true });
  const db = new ClassicLevel(packDir, { valueEncoding: 'json' });
  await db.open();
  return db;
}

// ============================================================================
// 1. AMEAÇAS & PERIGOS (rt20-031-ameacas)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças e Perigos da Edição 31 em rt20-031-ameacas ---');
  const db = await openHierarchicalPack('rt20-031-ameacas');

  const threats = [];

  // 1. Isco do Fullgor (ND 11)
  const iscoAtr = { for: 6, des: 2, con: 4, int: -2, sab: 3, car: -3 };
  const iscoSkills = buildSkills(11, iscoAtr, {
    inic: 5,
    perc: 5,
    fort: 24,
    refl: 18,
    vont: 11,
    luta: 27
  });
  const iscoTracos = buildTracos({
    tamanho: 'gra',
    vulnerabilidadesDano: ['fogo'],
    ic: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const iscoItems = [
    buildWeaponAttack({
      name: 'Pancada',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '2d8+15',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      proposito: 'corpo-a-corpo',
      alcance: 'short',
      ataques: 4,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']] },
        { name: 'Dano', key: 'dano1', type: 'dano', parts: [['2d8+15', 'impacto', '']] }
      ],
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Pancada x4 +27 (2d8+15, alcance curto).</p>',
      flavorPhrase: '"Ela sente. Ela sangra. E vocês não podem estar em todos os lugares."',
      flavorAction: 'Raízes e cipós dourados golpeiam em alcance curto'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM desta forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Natureza Vegetal',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O Isco do Fullgor possui natureza vegetal, cura acelerada 20/fogo e vulnerabilidade a fogo.</p>'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        { name: 'Agarrar (Pancada +39)', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['12', '', '']] }
      ],
      description: '<p>(Livre) Pancada (teste +39).</p>'
    }),
    buildSpecialPower({
      name: 'Adaptação Fullgori',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
      execucao: 'reaction',
      custo: 0,
      description: '<p>(Reação) Na primeira vez que sofre dano na rodada, o isco do Fullgor evita este dano e se torna imune a esse tipo de dano até o início de seu próximo turno.</p>'
    }),
    buildSpecialPower({
      name: 'Pancada Estonteante',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-violento.webp',
      execucao: 'passive',
      custo: 0,
      cd: 33,
      resistencia: { pericia: 'fort', atributo: 'for', bonus: 0, txt: 'Fortitude CD 33 evita' },
      description: '<p>Uma criatura atingida pela pancada do Isco fica atordoada por 1 rodada (Fort CD 33 evita). Uma criatura só pode ser atordoada por essa habilidade uma vez por cena.</p>'
    }),
    buildSpecialPower({
      name: 'Preparação Mutável',
      img: 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
      execucao: 'free',
      custo: 0,
      description: '<p>(Livre) Uma vez por rodada, o isco pode preparar uma ação padrão sem alterar sua iniciativa.</p>'
    }),
    buildSpecialPower({
      name: 'Pólen Dourado',
      img: 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
      execucao: 'full',
      custo: 0,
      alcance: 'medium',
      cd: 33,
      resistencia: { pericia: 'vont', atributo: 'con', bonus: 0, txt: 'Von CD 33 muda para alquebradas e frustradas por 1 rodada' },
      description: '<p>(Completa) Criaturas em alcance médio do isco ficam alquebradas e frustradas pela cena e confusas por 1d4 rodadas (Von CD 33 muda para alquebradas e frustradas por 1 rodada). Uma criatura que passe no teste de resistência fica imune a esta habilidade pela cena.</p>'
    }),
    buildSpecialPower({
      name: 'Núcleo Luminoso',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-da-luminosidade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O isco do Fullgor possui em seu centro um núcleo que pode ser atacado especificamente (Defesa 46, 150 PV). Se for destruído, o isco não é capaz de transmitir as informações dos personagens, parando de gerar Pontos de Deturpação, fica enjoado e não pode usar a habilidade Pólen Dourado.</p>'
    })
  ];

  threats.push({
    id: 'fld31IscoFullgor',
    name: 'Isco do Fullgor',
    img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
    nd: '11',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'gra',
    deslocamento: '9m (6q)',
    sentidos: 'faro, visão no escuro',
    tesouro: 'Nenhum. (Deixa 2d6+5 estilhas cristalinas ao ser destruído.)',
    atributos: iscoAtr,
    attributes: {
      pv: { value: 400, max: 400 },
      pm: { value: 0, max: 0 },
      defesa: { value: 41, base: 39 }, // 41 - Des 2 = 39
      cd: 33
    },
    resistencias: iscoTracos,
    resistenciasTexto: 'cura acelerada 20/fogo, natureza vegetal, vulnerabilidade a fogo',
    pericias: iscoSkills,
    items: iscoItems,
    ataquescac: 'Pancada x4 +27 (2d8+15, alcance curto)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/isco-do-fullgor.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Ele não veio para matar. Veio para ver quem sangra quando é observado."<br /><span style="font-weight:bold;color:#800000">— Sobre o Isco do Fullgor</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um coração dourado pulsando entre cipós que aprende o tipo do seu aço na primeira pancada! Só parou de mandar mensagens pra floresta inteira quando estraçalhamos o núcleo luminoso no meio dele!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Isco do Fullgor</span> é uma sentinela viva na Floresta Greenleaf. Enquanto seu núcleo luminoso está ativo, gera 1 Ponto de Deturpação por turno (máx. 5).</p>`
  });

  // 2. Jardineiro Dourado (ND 11)
  const jardAtr = { for: 2, des: 2, con: 3, int: 0, sab: 5, car: 1 };
  const jardSkills = buildSkills(11, jardAtr, {
    inic: 11,
    perc: 14,
    fort: 18,
    refl: 11,
    vont: 24,
    luta: 30
  });
  const jardTracos = buildTracos({
    tamanho: 'med',
    rdGeral: 10,
    vulnerabilidadesDano: ['fogo'],
    ic: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const jardItems = [
    buildWeaponAttack({
      name: 'Cipós',
      img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
      dano: '2d6+20',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      proposito: 'corpo-a-corpo',
      alcance: 'spec',
      ataques: 4,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']] },
        { name: 'Dano', key: 'dano1', type: 'dano', parts: [['2d6+20', 'impacto', '']] }
      ],
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Cipós x4 +30 (2d6+20 impacto, alcance 6m).</p>',
      flavorPhrase: '"A natureza não precisa ser corrigida. Vocês precisam."',
      flavorAction: 'Quatro cipós dourados chicoteiam como podadores implacáveis'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM desta forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Natureza Vegetal',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O Jardineiro Dourado possui natureza vegetal e vulnerabilidade a fogo.</p>'
    }),
    buildSpecialPower({
      name: 'Adaptado ao Ambiente',
      img: 'systems/tormenta20/icons/magias/caminhos-da-natureza.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Em florestas, o jardineiro dourado recebe camuflagem leve contra ataques a distância e ignora terreno difícil natural.</p>'
    }),
    buildSpecialPower({
      name: 'Chamado do Fullgor',
      img: 'systems/tormenta20/icons/poderes/ameacas/voz-da-natureza.webp',
      execucao: 'action',
      custo: 0,
      alcance: 'short',
      rolls: [
        { name: 'Dano dos Animais Deturpados', key: 'dano0', type: 'dano', parts: [['2d4', 'perfuracao', '']] }
      ],
      description: '<p>(Padrão) O jardineiro dourado invoca 2d6 animais deturpados em espaços desocupados em alcance curto, que agem a partir da próxima rodada do jardineiro. Eles têm deslocamento 9m (normal e de escalada) e podem gastar uma ação padrão para causar 2d4 pontos de dano de perfuração em uma criatura adjacente. Os animais têm For –1, Des 2, Defesa 13 e 1 PV, falham automaticamente em qualquer teste oposto ou de resistência e desaparecem quando mortos ou ao fim da cena. Recarga (todos animais invocados serem mortos).</p>'
    }),
    buildSpecialPower({
      name: 'Subverter Natureza',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forca-natureza.webp',
      execucao: 'passive',
      custo: 0,
      cd: 33,
      description: '<p>Com 8+ Pontos de Deturpação, pode lançar <em>Armamento da Natureza</em>, <em>Controlar Plantas</em> e <em>Despedaçar</em> (11º nível, CD 33). Com 10+ Pontos de Deturpação, também pode lançar <em>Escudo da Fé</em>, <em>Silêncio</em> e <em>Tranquilidade</em>.</p>'
    }),
    buildSpecialPower({
      name: 'Vulnerabilidade à Natureza',
      img: 'systems/tormenta20/icons/poderes/ameacas/vulnerabilidade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Uma vez por rodada, um personagem pode fazer um teste de Religião ou Sobrevivência oposto a Vontade do jardineiro. Se o jardineiro falhar, fica enjoado por 1 rodada.</p>'
    }),
    buildSpellItem({
      name: 'Armamento da Natureza',
      img: 'systems/tormenta20/icons/magias/armamento-da-natureza.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'tra',
      execucao: 'move',
      custoPM: 7,
      alcance: 'self',
      duracao: 'scene',
      description: '<p>(Movimento, 7 PM) O ataque natural do jardineiro se torna mágico até o fim da cena; fornece +2 em testes de ataque e rolagens de dano.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Controlar Plantas',
      img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'tra',
      execucao: 'action',
      custoPM: 2,
      alcance: 'short',
      area: 'quadrado de 9m',
      duracao: 'scene',
      resistencia: 'Reflexos evita',
      resistenciaPericia: 'refl',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 2 PM) Um quadrado de 9m de vegetação em alcance curto se torna terreno difícil. Criaturas na área ficam enredadas e imóveis (Ref evita; soltar-se exige ação padrão e Acrobacia ou Atletismo).</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Despedaçar',
      img: 'systems/tormenta20/icons/magias/despedacar.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 9,
      alcance: 'short',
      alvo: '1 criatura, construto ou objeto Pequeno',
      duracao: 'inst',
      formulaDano: '5d8+10',
      tipoDano: 'impacto',
      resistencia: 'Fortitude reduz à metade e evita atordoamento',
      resistenciaPericia: 'fort',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 9 PM) Um alvo em alcance curto sofre 5d8+10 pontos de dano de impacto (ou o dobro sem aplicar RD se construto/objeto mundano Pequeno) e fica atordoado (Fort reduz à metade e evita condição; máx. 1x/cena).</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Escudo da Fé',
      img: 'systems/tormenta20/icons/magias/escudo-da-fe.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'abj',
      execucao: 'reaction',
      custoPM: 5,
      alcance: 'short',
      alvo: '1 criatura',
      duracao: 'turn',
      description: '<p>(Reação, 5 PM, 10+ Pontos de Deturpação) Quando uma criatura em alcance curto sofre um ataque, recebe +5 na Defesa por 1 turno.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Silêncio',
      img: 'systems/tormenta20/icons/magias/silencio.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'ilu',
      execucao: 'action',
      custoPM: 3,
      alcance: 'medium',
      area: 'esfera de 6m',
      duracao: 'sust',
      description: '<p>(Padrão, 3 PM, sustentada, 10+ Pontos de Deturpação) Cria uma esfera de 6m em alcance médio. Criaturas na área ficam surdas e não podem lançar magias.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Tranquilidade',
      img: 'systems/tormenta20/icons/magias/tranquilidade.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'enc',
      execucao: 'action',
      custoPM: 4,
      alcance: 'short',
      alvo: 'até 3 criaturas',
      duracao: 'scene',
      resistencia: 'Vontade reduz para -2 em ataques',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 4 PM, 10+ Pontos de Deturpação) Até três criaturas em alcance curto mudam atitude para indiferente e não podem realizar ações hostis (Von reduz para –2 em ataque) até o fim da cena.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    })
  ];

  threats.push({
    id: 'fld31JardineiroD',
    name: 'Jardineiro Dourado',
    img: 'systems/tormenta20/icons/itens/gerais/madeira-magica.webp',
    nd: '11',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade. (Deixa 3d6+10 estilhas cristalinas ao ser destruído.)',
    atributos: jardAtr,
    attributes: {
      pv: { value: 385, max: 385 },
      pm: { value: 49, max: 49 },
      defesa: { value: 35, base: 33 }, // 35 - Des 2 = 33
      cd: 33
    },
    resistencias: jardTracos,
    resistenciasTexto: 'natureza vegetal, redução de dano 10, resistência a magia divina +5, vulnerabilidade a fogo',
    pericias: jardSkills,
    items: jardItems,
    ataquescac: 'Cipós x4 +30 (2d6+20 impacto, alcance 6m)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/jardineiro-dourado.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"A natureza não precisa ser corrigida. Vocês precisam."<br /><span style="font-weight:bold;color:#800000">— Jardineiro Dourado</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Madeira pálida com veios de ouro que germina quando a floresta acumula deturpação demais! Ele ficava mais forte a cada erro nosso, mas bastou invocar a verdadeira fé de Allihanna para vê-lo enjoar diante da natureza livre!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Jardineiro Dourado</span> surge quando os heróis acumulam 6 Pontos de Deturpação em <em>Pecados do Pai</em>. Suas magias simuladas escalam aos 8 e 10 Pontos de Deturpação.</p>`
  });

  // 3. Lisandra Deturpada (ND 13)
  const lisAtr = { for: 6, des: 3, con: 5, int: 1, sab: 8, car: 3 };
  const lisSkills = buildSkills(13, lisAtr, {
    inic: 15,
    perc: 20,
    fort: 20,
    refl: 13,
    vont: 26,
    luta: 35,
    mist: 16
  });
  const lisTracos = buildTracos({
    tamanho: 'med',
    rdGeral: 15,
    ic: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const lisItems = [
    buildWeaponAttack({
      name: 'Espada Bastarda (Madeira Magnífica)',
      img: 'systems/tormenta20/icons/itens/equipamentos/espada-bastarda.webp',
      dano: '1d12+15',
      tipoDano: 'corte',
      criticoMargem: 17,
      periciaAtaque: 'luta',
      ataques: 1,
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada bastarda +35 (1d12+15, 17).</p>',
      flavorPhrase: '"Meu pai me ensinou a lutar. Nunca ensinou a parar."',
      flavorAction: 'Lisandra ergue sua espada bastarda de madeira magnífica em um golpe fulminante'
    }),
    buildWeaponAttack({
      name: 'Gavinhas',
      img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
      dano: '2d8+15',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      proposito: 'corpo-a-corpo',
      alcance: 'spec',
      ataques: 2,
      rolls: [
        { name: 'Ataque', key: 'ataque0', type: 'ataque', parts: [['1d20', '', ''], ['luta', '', ''], ['', '', '']] },
        { name: 'Dano', key: 'dano1', type: 'dano', parts: [['2d8+15', 'impacto', '']] }
      ],
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Gavinhas x2 +35 (2d8+15 impacto, alcance 3m).</p>',
      flavorPhrase: '"Esses casulos malditos! Sujando a casa de Allihanna!"',
      flavorAction: 'Gavinhas vegetais chicoteiam a 3 metros de distância'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Quando um fullgori causa dano a um devoto, o devoto perde 1 PM por patamar do fullgori. Se o devoto for reduzido a 0 PM desta forma, perde acesso a todos os seus poderes concedidos e às magias fornecidas por sua divindade por 24 horas.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, metabolismo, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Chuva de Estacas',
      img: 'systems/tormenta20/icons/poderes/ameacas/espinhos.webp',
      execucao: 'move',
      custo: 4,
      alcance: 'medium',
      area: 'esfera de 9m de raio',
      cd: 20,
      resistencia: { pericia: 'refl', atributo: 'sab', bonus: 0, txt: 'Ref CD 20 reduz à metade e evita a condição sangrando' },
      rolls: [
        { name: 'Dano de Estacas', key: 'dano0', type: 'dano', parts: [['5d12', 'corte', '']] }
      ],
      description: '<p>(Movimento, 4 PM) Lisandra evoca uma chuva de estacas sobre uma área de 9m de raio em alcance médio. Criaturas na área sofrem 5d12 pontos de dano de corte e ficam sangrando (Ref CD 20 reduz à metade e evita a condição).</p>'
    }),
    buildSpecialPower({
      name: 'Criar Toscos',
      img: 'systems/tormenta20/icons/poderes/ameacas/ergam-se.webp',
      execucao: 'move',
      custo: 2,
      alcance: 'short',
      rolls: [
        { name: 'Dano do Tosco', key: 'dano0', type: 'dano', parts: [['1d6+1', 'corte', '']] }
      ],
      description: '<p>(Movimento, 2 PM) Lisandra invoca 2d4+1 toscos capangas em espaços desocupados em alcance curto. Eles agem a partir da próxima rodada de Lisandra, têm deslocamento 9m e podem gastar uma ação padrão para causar 1d6+1 pontos de dano de corte em uma criatura adjacente. Os toscos têm For 4, Des 4, Defesa 41 e 1 PV, falham automaticamente em qualquer teste oposto ou de resistência e desaparecem quando mortos ou ao fim da cena.</p>'
    }),
    buildSpecialPower({
      name: 'Força da Natureza',
      img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forca-natureza.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O custo de todas as magias de Lisandra é reduzido em –2 PM e a CD para resistir a elas aumenta em +2 (já contabilizado). Esses bônus dobram (–4 PM e +4 na CD) se ela estiver em terrenos naturais.</p>'
    }),
    buildSpecialPower({
      name: 'Forma de Madeira',
      img: 'systems/tormenta20/icons/itens/gerais/madeira-magica.webp',
      execucao: 'move',
      custo: 0,
      duracao: 'scene',
      description: '<p>(Movimento) Uma camada de matéria vegetal cobre Lisandra até o fim da cena, formando uma armadura (+15 na Defesa, voo 12m, quatro ataques com gavinhas e arma corpo a corpo de madeira ameaçadora e magnífica — já contabilizado na ficha).</p>'
    }),
    buildSpecialPower({
      name: 'Magia Acelerada',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'free',
      custo: 4,
      description: '<p>(Livre, +4 PM) Uma vez por rodada, quando lança uma magia com execução de ação completa ou menor, Lisandra muda a execução dela para livre.</p>'
    }),
    buildSpellItem({
      name: 'Controlar Plantas',
      img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'tra',
      execucao: 'action',
      custoPM: 1,
      alcance: 'short',
      area: 'quadrado de 9m',
      duracao: 'scene',
      resistencia: 'Reflexos evita',
      resistenciaPericia: 'refl',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 1 PM) Um quadrado de 9m de vegetação em alcance curto se torna terreno difícil. Criaturas na área ficam enredadas e imóveis (Ref evita; soltar-se exige ação padrão e Acrobacia ou Atletismo).</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'evo',
      execucao: 'action',
      custoPM: 20,
      alcance: 'short',
      alvo: '1 criatura adjacente ou criaturas escolhidas em alcance curto',
      duracao: 'inst',
      rolls: [
        { name: 'Cura Alvo Adjacente', key: 'dano0', type: 'dano', parts: [['23d8+23', 'curapv', '']] },
        { name: 'Cura em Área (Alcance Curto)', key: 'dano1', type: 'dano', parts: [['18d8+18', 'curapv', '']] }
      ],
      description: '<p>(Padrão, 20 PM) Uma criatura adjacente cura 23d8+23 PV ou criaturas escolhidas em alcance curto curam 18d8+18.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Dissipar Magia',
      img: 'systems/tormenta20/icons/magias/dissipar-magia.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 1,
      alcance: 'medium',
      alvo: '1 criatura, objeto ou esfera de 3m',
      duracao: 'inst',
      resistencia: 'Vontade anula em item mágico',
      resistenciaPericia: 'vont',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 1 PM) Lisandra escolhe uma criatura, objeto ou esfera de 3m em alcance médio e faz um teste de Misticismo. Todas as magias com CD menor que o teste são dissipadas. Contra item mágico, torna-o mundano por 1d6 rodadas (Von anula).</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Raio Polar',
      img: 'systems/tormenta20/icons/magias/raio-polar.webp',
      circulo: 4,
      tipo: 'arc',
      escola: 'evo',
      execucao: 'action',
      custoPM: 19,
      alcance: 'medium',
      area: 'esfera de 6m',
      duracao: 'inst',
      formulaDano: '14d8',
      tipoDano: 'frio',
      resistencia: 'Fortitude reduz à metade e muda condição para lento',
      resistenciaPericia: 'fort',
      resistenciaAtributo: 'sab',
      description: '<p>(Padrão, 19 PM) Lisandra dispara uma esfera de 6m em alcance médio. Criaturas na área sofrem 14d8 pontos de dano de frio e ficam paralisadas em um bloco de gelo (Fort reduz à metade e muda para lento; gelo tem 20 PV, RD 10, vulnerabilidade a fogo).</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    }),
    buildSpellItem({
      name: 'Libertação',
      img: 'systems/tormenta20/icons/magias/libertacao.webp',
      circulo: 4,
      tipo: 'div',
      escola: 'abj',
      execucao: 'action',
      custoPM: 8,
      alcance: 'short',
      alvo: '1 criatura',
      duracao: 'scene',
      description: '<p>(Padrão, 8 PM) Até o fim da cena, uma criatura em alcance curto fica imune a efeitos de movimento e ignora qualquer efeito que impeça ou restrinja seu deslocamento.</p>',
      source: 'Fúlgor dos Deuses — Edição 31'
    })
  ];

  threats.push({
    id: 'fld31LisandraDet',
    name: 'Lisandra Deturpada',
    img: 'systems/tormenta20/icons/racas/dahllan.webp',
    nd: '13',
    papel: 'solo',
    tipoMonstro: 'hum',
    raca: 'Humanoide (dahllan)',
    tamanho: 'med',
    deslocamento: '9m (6q), voo 12m (8q), ignora terreno difícil natural',
    sentidos: 'visão normal',
    tesouro: 'Nenhum.',
    equipamento: 'Símbolo sagrado de Allihanna.',
    atributos: lisAtr,
    attributes: {
      pv: { value: 455, max: 455 },
      pm: { value: 62, max: 62 },
      defesa: { value: 45, base: 42 }, // 45 - Des 3 = 42
      cd: 35
    },
    resistencias: lisTracos,
    resistenciasTexto: 'redução de dano 15, resistência a magia +5',
    pericias: lisSkills,
    items: lisItems,
    ataquescac: 'Espada bastarda +35 (1d12+15, 17) e gavinhas x2 +35 (2d8+15 impacto, alcance 3m)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/lisandra-deturpada.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Meu pai me ensinou a lutar. Nunca ensinou a parar."<br /><span style="font-weight:bold;color:#800000">— Lisandra Deturpada</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Filha de Arsenal, campeã de Allihanna e mesmo se contendo quase nos partiu em dois com aquela espada de madeira! Cada casulo dourado destruído arrancava um pouco do domínio do Fullgor sobre ela!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Lisandra Deturpada</span> é a sumo-sacerdotisa dahllan de Allihanna parcialmente manipulada pelo Fullgor. Em cena há 10 casulos + 1 por Ponto de Deturpação (Defesa 10, 1 PV; cada casulo destruído tira 5 PV de Lisandra e gera 1 estilha cristalina). Cessa de lutar na metade dos PV.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: null,
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
      ataquescac: t.ataquescac || '',
      equipamento: t.equipamento || '',
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });
    built.actorDoc.img = t.img;
    built.actorDoc.folder = null;

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
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo em rt20-031-ameacas com ${built.embeddedDocs.length} subdocumentos.`);
  }

  // 4. Perigos Complexos (Hazards)
  const hazards = [
    {
      id: 'fld31RastrosCaca',
      name: 'Rastros da Caça (Perigo Complexo ND 11)',
      nd: '11',
      img: 'systems/tormenta20/icons/magias/caminhos-da-natureza.webp',
      token: 'modules/compendios-para-t20/assets/tokens/isco-do-fullgor.png',
      goal: 'Identificar o padrão de atuação do Fullgor na Floresta Greenleaf, compreender como está se aproximando de Lisandra e descobrir onde pretende agir.',
      effects: 'O grupo deve acumular 4 sucessos antes de 3 falhas. Sucesso: identificam a área ameaçada e seguem para Parte 2, Cena 1. Falha: os personagens adquirem 1 Ponto de Deturpação e o Fullgor acelera seu plano (Cena 3: O Isco).',
      actions: `
        <li><strong>Conhecimento ou Misticismo CD 25:</strong> Distinguir deturpação do Fullgor de efeitos da Tormenta.</li>
        <li><strong>Investigação ou Sobrevivência CD 22:</strong> Ler rastros, padrões de deslocamento e zonas de pressão ambiental.</li>
        <li><strong>Percepção CD 25:</strong> Perceber silêncios anormais, trilhas evitadas por animais e áreas "observadas".</li>
        <li><strong>Religião CD 25:</strong> Interpretar sinais ligados a Allihanna e violações indiretas do sagrado.</li>
      `
    },
    {
      id: 'fld31NaturezaDet',
      name: 'Natureza Deturpada (Perigo Complexo ND 11)',
      nd: '11',
      img: 'systems/tormenta20/icons/magias/controlar-plantas.webp',
      token: 'modules/compendios-para-t20/assets/tokens/jardineiro-dourado.png',
      goal: 'Conter os efeitos anômalos na Floresta Greenleaf, proteger seres e locais sagrados e impedir que a distorção se consolide.',
      effects: 'O grupo deve conquistar 4 sucessos antes de 3 falhas. Cada falha resulta em 1 Ponto de Deturpação. No fim de cada rodada, todos fazem Vontade (CD 25) ou ficam frustrados até o dia seguinte.',
      actions: `
        <li><strong>Adestramento CD 25:</strong> Reconhecer comportamento anômalo em animais selvagens e acalmá-los.</li>
        <li><strong>Conhecimento CD 25:</strong> Interpretar padrões errados de crescimento vegetal e animal.</li>
        <li><strong>Cura CD 22:</strong> Estabilizar animais e seres afetados (apenas se treinado em Adestramento ou Sobrevivência).</li>
        <li><strong>Misticismo CD 25:</strong> Detectar a presença do Fullgor e nulificar sua influência arcana.</li>
        <li><strong>Percepção CD 25:</strong> Identificar focos reais de distorção vs. falsos alarmes.</li>
        <li><strong>Religião CD 25:</strong> Restaurar vínculos espirituais de Allihanna (+5 para devotos de Allihanna).</li>
        <li><strong>Sobrevivência CD 25:</strong> Conduzir por caminhos seguros e conter danos ambientais.</li>
      `
    },
    {
      id: 'fld31EnxameFullg',
      name: 'Enxame Fullgori (Perigo Complexo ND 9)',
      nd: '9',
      img: 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-insetos-rubros.webp',
      token: 'modules/compendios-para-t20/assets/tokens/enxame-fullgori.png',
      goal: 'Destruir o enxame de insetos dourados (177 PV) antes que ele consuma qualquer dahllan do grupo.',
      effects: 'No fim de cada rodada, qualquer dahllan do grupo sofre 10d6 de perfuração (+1d6 por Ponto de Deturpação). Todos ficam surdos e frustrados até o fim da cena. Falhar em atacar por 5+ atinge a dahllan. Imune a efeitos que não sejam dano. Derrotado, deixa 1d6 estilhas cristalinas.',
      actions: `
        <li><strong>Fortitude CD 25 (apenas dahllan):</strong> Reduz o próximo dano do enxame à metade.</li>
        <li><strong>Luta CD 25 (proteger):</strong> Sofre metade do próximo dano causado pelo enxame à dahllan.</li>
        <li><strong>Luta ou Pontaria CD 25 (atacar):</strong> Causa dano normalmente ao enxame (177 PV).</li>
        <li><strong>Misticismo CD 25:</strong> Lança magia de dano no enxame apesar dos zumbidos (enxame falha automaticamente no TR).</li>
      `
    },
    {
      id: 'fld31SantuarioSo',
      name: 'Santuário em Sofrimento (Perigo Complexo ND 11)',
      nd: '11',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      token: 'modules/compendios-para-t20/assets/tokens/jardineiro-dourado.png',
      goal: 'Aliviar o sofrimento do santuário de Allihanna destruindo casulos fullgori, impedindo que se torne um foco estável do Fullgor.',
      effects: 'Acumular 5 sucessos antes de 3 falhas. Cada falha gera 1 Ponto de Deturpação. No fim do turno, Vontade CD 30 ou fica alquebrado pela cena. Sucesso: seres vivos recuperam 10 PM (+10 PM extras para dahllan e devotos de Allihanna).',
      actions: `
        <li><strong>Adestramento CD 25:</strong> Reconhecer e acalmar animais aterrorizados.</li>
        <li><strong>Conhecimento CD 28:</strong> Identificar ciclos naturais forçados ou interrompidos.</li>
        <li><strong>Luta ou Pontaria CD 25:</strong> Atacar e destruir casulos fullgori dourados.</li>
        <li><strong>Misticismo CD 25:</strong> Detectar casulos responsáveis por emanar energia.</li>
        <li><strong>Percepção CD 25:</strong> Identificar o casulo mais instável antes da emanação.</li>
        <li><strong>Religião CD 22:</strong> Reforçar símbolos de Allihanna sem quebrar seu significado.</li>
        <li><strong>Sobrevivência CD 25:</strong> Rastrear sinais do Fullgor até seus focos.</li>
      `
    },
    {
      id: 'fld31CorrentesIn',
      name: 'Correntes Invisíveis (Perigo Complexo ND 11)',
      nd: '11',
      img: 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
      token: 'modules/compendios-para-t20/assets/tokens/lisandra-deturpada.png',
      goal: 'Atravessar o trecho dominado por visões de culpa e manipulação de Arsenal sem perder a autonomia antes do confronto final.',
      effects: 'Cada personagem deve conseguir 3 sucessos antes de 2 falhas. Cada falha resulta em 2 Pontos de Deturpação. Se ninguém fizer Sobrevivência na rodada, todos sofrem –2 por estarem perdidos.',
      actions: `
        <li><strong>Diplomacia CD 25 (apoio):</strong> Não conta como sucesso, mas fornece +5 nos testes dos outros personagens.</li>
        <li><strong>Guerra CD 25:</strong> Reconhecer manipulação estratégica e separar comando de controle.</li>
        <li><strong>Intuição CD 25:</strong> Perceber a verdadeira intenção do Fullgor nos próprios pensamentos.</li>
        <li><strong>Religião CD 22:</strong> Distinguir fé verdadeira de obediência imposta.</li>
        <li><strong>Sobrevivência CD 25:</strong> Avançar apesar do peso psicológico.</li>
        <li><strong>Vontade CD 25:</strong> Resistir diretamente às correntes emocionais do Fullgor.</li>
      `
    }
  ];

  for (const hz of hazards) {
    const built = buildHazardActor({
      name: hz.name,
      nd: hz.nd,
      img: hz.img,
      folder: null,
      goal: hz.goal,
      effects: hz.effects,
      actions: hz.actions
    });
    built.actorDoc._id = hz.id;
    built.actorDoc.img = hz.img;
    built.actorDoc.folder = null;
    built.actorDoc.prototypeToken.texture.src = hz.token;
    await db.put(`!actors!${hz.id}`, built.actorDoc);
    console.log(`✓ Perigo "${hz.name}" salvo em rt20-031-ameacas.`);
  }

  await db.close();
}

// ============================================================================
// 2. EQUIPAMENTOS & PODERES / PARCEIROS
// ============================================================================
async function saveItemToPack(db, def) {
  const rawEffects = def.rawEffects || [];
  const builtEffects = [];
  const effectIds = [];

  for await (const [oldEffKey] of db.iterator({ gte: `!items.effects!${def._id}.`, lte: `!items.effects!${def._id}.\uffff` })) {
    await db.del(oldEffKey);
  }

  for (const eff of rawEffects) {
    const effDoc = buildActiveEffect({
      id: eff._id,
      name: eff.name,
      img: def.img,
      origin: `Item.${def._id}`,
      changes: eff.changes || [],
      transfer: eff.transfer !== undefined ? eff.transfer : true,
      disabled: eff.disabled !== undefined ? eff.disabled : false
    });
    builtEffects.push(effDoc);
    effectIds.push(effDoc._id);
    await db.put(`!items.effects!${def._id}.${effDoc._id}`, effDoc);
  }

  const built = buildItem({
    name: def.name,
    type: def.type,
    img: def.img,
    description: def.description,
    folder: null,
    system: def.system,
    rolls: def.rolls || []
  });
  built._id = def._id;
  built.img = def.img;
  built.folder = null;
  built.effects = effectIds;
  built._stats = statsHeader;

  await db.put(`!items!${def._id}`, built);
  console.log(`✓ Item "${def.name}" salvo com ${builtEffects.length} efeitos.`);
}

async function injectItemsAndPowers() {
  console.log('\n--- Injetando Equipamentos e Parceiros da Edição 31 ---');
  const eqDb = await openHierarchicalPack('rt20-031-equipamentos');
  const pwDb = await openHierarchicalPack('rt20-031-poderes');

  const equipamentos = [
    {
      _id: 'fld31EstilhaFull',
      name: 'Estilhas Cristalinas do Fullgor (Edição 31)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      description: `<p><strong>Resíduo Fullgori (Pecados do Pai):</strong> Fragmentos cristalinos obtidos na Floresta Greenleaf: <strong>2d6+5 estilhas</strong> do <em>Isco do Fullgor</em>, <strong>1d6 estilhas</strong> do <em>Enxame Fullgori</em>, <strong>3d6+10 estilhas</strong> do <em>Jardineiro Dourado</em> e <strong>1 estilha</strong> por cada casulo dourado destruído no confronto contra <em>Lisandra Deturpada</em>.</p>`,
      system: {
        tipo: 'acessorio',
        equipado2: { slot: 0, type: 'body' },
        preco: 0,
        peso: 0.1,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 31'
      },
      rawEffects: []
    }
  ];

  const poderes = [
    {
      _id: 'fld31ParcLisandr',
      name: 'Parceira: Lisandra de Allihanna (Gratidão Plena — Mestre Tripla)',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/dahllan.webp',
      description: `<p><strong>Recompensa por 0–3 Pontos de Deturpação (Edição 31, p. 18):</strong> Lisandra compromete-se a intervir indiretamente contra o Fullgor no futuro. Em termos de jogo, uma vez em cada aventura, ela participa de uma única batalha como uma <strong>parceira mestre de tipo combatente (+4 ataque), destruidor (frio, +4d6 dano) e médico (6d8+6 PV ou remove condições)</strong> — todos os três tipos simultaneamente.</p>
<p>Lisandra pode ser invocada em qualquer ponto do mundo de Arton onde existe vida natural.</p>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'free', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 31'
      },
      rolls: [
        { name: 'Cura Médica Mestre', key: 'dano0', type: 'dano', parts: [['6d8+6', 'curapv', '']] }
      ],
      rawEffects: [
        {
          _id: 'eff31LisandraMst',
          name: 'Lisandra Mestre — Combatente (+4 Ataque)',
          disabled: true,
          changes: [
            { key: 'system.modificadores.ataque.geral', mode: 2, value: '4', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld31BencaoLisDi',
      name: 'Vínculo de Greenleaf: Bênção de Lisandra',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      description: `<p><strong>Conclusão do Diálogo em Filha de Deuses (Edição 31, p. 10):</strong> Benefícios válidos até o fim da aventura conforme o número de respostas obtidas de Lisandra:</p>
<ul>
  <li><strong>1+ Resposta:</strong> Dahllan e devotos de Allihanna recebem <strong>+10 PM temporários</strong>.</li>
  <li><strong>3+ Respostas:</strong> Todos recebem <strong>+5 em Percepção, Religião (devotos de Allihanna apenas) e Sobrevivência</strong>.</li>
  <li><strong>5+ Respostas:</strong> 1x/cena, um personagem pode lançar uma magia divina até 3º Círculo (exceto Ilusão e Necromancia) sem custo em PM (limite 11).</li>
</ul>`,
      system: {
        tipo: 'concedido',
        subtipo: 'concedido',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 31'
      },
      rawEffects: [
        {
          _id: 'eff31GreenleafSk',
          name: 'Vínculo de Greenleaf (+5 Percepção e Sobrevivência)',
          disabled: true,
          changes: [
            { key: 'system.pericias.perc.bonus', mode: 2, value: '5', priority: 20 },
            { key: 'system.pericias.sobr.bonus', mode: 2, value: '5', priority: 20 }
          ]
        }
      ]
    }
  ];

  for (const eq of equipamentos) await saveItemToPack(eqDb, eq);
  for (const pw of poderes) await saveItemToPack(pwDb, pw);

  await eqDb.close();
  await pwDb.close();
}

// ============================================================================
// 3. DIÁRIO (rt20-031-diarios)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diário da Edição 31 em rt20-031-diarios ---');
  const db = await openHierarchicalPack('rt20-031-diarios');

  const journalId = 'fld31DiarioPecad';
  const pageIds = [
    'p31SinopseAvent1',
    'p31Parte1Legado1',
    'p31Parte2Raizes1',
    'p31Parte3Naturez',
    'p31Parte4Rainha1',
    'p31RegrasDeturp1',
    'p31BestiarioNpc1'
  ];

  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 31: Pecados do Pai',
    folder: null,
    sort: 400000,
    ownership: { default: -1 },
    pages: pageIds,
    flags: {},
    _stats: statsHeader
  };

  const pages = [
    {
      _id: pageIds[0],
      name: '1. Sinopse & Visão Geral',
      type: 'text',
      sort: 100000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Fúlgor dos Deuses — Edição 31: Pecados do Pai</h2>
<p><strong>Criação:</strong> Marcelo Cassaro • <strong>Desenvolvimento:</strong> Daniel Duran (Setembro de 2026)</p>
<p>Alertados pelo fantasma de Thalgrimm Sangue de Ferro, os campeões (11º nível, patamar campeão) seguem à Floresta Greenleaf para impedir que o Fullgor corrompa <strong>Lisandra</strong>, filha de Arsenal e sumo-sacerdotisa de Allihanna, enquanto ela contém a Tormenta. Ao final, chegam ao <strong>12º nível</strong> rumo a <em>Como um Deus</em>.</p>`
      }
    },
    {
      _id: pageIds[1],
      name: '2. Parte 1: Legado',
      type: 'text',
      sort: 200000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 1: Legado</h2>
<h3>Cena 1 — Sem Descanso</h3>
<p>O fantasma de Thalgrimm designa a missão (mantendo <em>A Presença</em> 1x/cena). A Igreja de Arsenal fornece T$ 2.000 em itens alquímicos e poções.</p>
<h3>Cena 2 — Rastros da Caça</h3>
<p>Liriavel pode conjurar <em>Teletransporte</em> até Greenleaf (ou Misticismo CD 40). Rastreie sinais via @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31RastrosCaca]{Rastros da Caça (ND 11)} (4 sucessos antes de 3 falhas; falha = +1 Ponto de Deturpação).</p>
<h3>Cena 3 — O Isco</h3>
<p>Confronto contra o @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31IscoFullgor]{Isco do Fullgor (ND 11)} — seu núcleo luminoso (Defesa 46, 150 PV) gera +1 Ponto de Deturpação por turno (máx. 5) até ser destruído. Deixa 2d6+5 @UUID[Compendium.compendios-para-t20.rt20-031-equipamentos.Item.fld31EstilhaFull]{Estilhas Cristalinas}.</p>`
      }
    },
    {
      _id: pageIds[2],
      name: '3. Parte 2: Raízes Profanadas',
      type: 'text',
      sort: 300000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 2: Raízes Profanadas</h2>
<h3>Cena 1 — Filha de Deuses</h3>
<p>Diálogo remoto com Lisandra (Intuição/Percepção/Sobrevivência CD 20 ou Religião CD 15 para devotos de Allihanna; –2 se houver lefou/devoto de Aharadak). Concede @UUID[Compendium.compendios-para-t20.rt20-031-poderes.Item.fld31BencaoLisDi]{Vínculo de Greenleaf: Bênção de Lisandra}.</p>
<h3>Cena 2 — Natureza Deturpada</h3>
<p>Perigo complexo @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31NaturezaDet]{Natureza Deturpada (ND 11)} (4 sucessos antes de 3 falhas; Vontade CD 25 por rodada).</p>
<h3>Cena 3 — Alvo Escolhido</h3>
<p>Se houver dahllan no grupo, enfrenta o @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31EnxameFullg]{Enxame Fullgori (ND 9)} (177 PV, 10d6 + 1d6/Ponto de Deturpação). Deixa 1d6 estilhas cristalinas.</p>`
      }
    },
    {
      _id: pageIds[3],
      name: '4. Parte 3: A Natureza Mente',
      type: 'text',
      sort: 400000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 3: A Natureza Mente</h2>
<h3>Cena 1 — Santuário em Sofrimento</h3>
<p>Perigo complexo @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31SantuarioSo]{Santuário em Sofrimento (ND 11)} (5 sucessos antes de 3 falhas; Vontade CD 30).</p>
<h3>Cena 2 — O Jardineiro Dourado</h3>
<p>Surge se o grupo atingir 6+ Pontos de Deturpação: @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31JardineiroD]{Jardineiro Dourado (ND 11)} (magias desbloqueadas em 8+ e 10+ Pontos). Deixa 3d6+10 estilhas.</p>
<h3>Cena 3 — O Peso da Presença</h3>
<p>4 turnos de diálogo (Convicção, Compreensão, Autonomia, Limite; CD 20 + Pontos de Deturpação; –5 se lefou/Aharadak). Consulte @UUID[Compendium.compendios-para-t20.rt20-031-tabelas.RollTable.fld31TabPesoPres]{O Peso da Presença}.</p>`
      }
    },
    {
      _id: pageIds[4],
      name: '5. Parte 4: Rainha da Selva',
      type: 'text',
      sort: 500000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Parte 4: Rainha da Selva</h2>
<h3>Cena 1 — Correntes Invisíveis</h3>
<p>Desafio psicológico individual @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31CorrentesIn]{Correntes Invisíveis (ND 11)} (3 sucessos antes de 2 falhas).</p>
<h3>Cena 2 — Lisandra Deturpada</h3>
<p>Confronto contra @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31LisandraDet]{Lisandra Deturpada (ND 13)} cercada por <strong>10 + Pontos de Deturpação casulos dourados</strong> (Defesa 10, 1 PV; cada casulo destruído causa 5 PV a Lisandra e gera 1 estilha). Use @UUID[Compendium.compendios-para-t20.rt20-031-tabelas.RollTable.fld31TabFrasesLi]{Frases de Combate} e a macro @UUID[Compendium.compendios-para-t20.rt20-031-macros.Macro.fld31MacroPecado]{Rastreador de Deturpação &amp; Casulos}.</p>
<h3>Cena 3 — O Que Permanece</h3>
<p>Recompensa conforme Pontos de Deturpação via @UUID[Compendium.compendios-para-t20.rt20-031-tabelas.RollTable.fld31TabRecompGr]{Gratidão de Allihanna} (0–3 pontos concede @UUID[Compendium.compendios-para-t20.rt20-031-poderes.Item.fld31ParcLisandr]{Parceira: Lisandra de Allihanna} + tesouro ND 12).</p>`
      }
    },
    {
      _id: pageIds[5],
      name: '6. Regras Especiais: Pontos de Deturpação & Casulos',
      type: 'text',
      sort: 600000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Pontos de Deturpação &amp; Mecânicas da Edição 31</h2>
<ul>
  <li><strong>6 Pontos:</strong> Manifesta o <em>Jardineiro Dourado</em> (Parte 3, Cena 2).</li>
  <li><strong>8 Pontos:</strong> Jardineiro lança <em>Armamento da Natureza</em>, <em>Controlar Plantas</em> e <em>Despedaçar</em>.</li>
  <li><strong>10 Pontos:</strong> Jardineiro também lança <em>Escudo da Fé</em>, <em>Silêncio</em> e <em>Tranquilidade</em>.</li>
  <li><strong>Casulos de Lisandra:</strong> 10 + Pontos de Deturpação. Lisandra ganha +5 PV temporários por casulo e cessa de lutar na metade dos PV. Testes sociais (Diplomacia/Enganação/Intimidação/Religião vs. Vontade) fazem-na destruir 1d6 casulos.</li>
</ul>`
      }
    },
    {
      _id: pageIds[6],
      name: '7. Bestiário, Parceira & Links Rápidos',
      type: 'text',
      sort: 700000,
      ownership: { default: -1 },
      text: {
        format: 1,
        content: `<h2>Bestiário &amp; Compêndios da Edição 31</h2>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31IscoFullgor]{Isco do Fullgor (ND 11)}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31JardineiroD]{Jardineiro Dourado (ND 11)}</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31LisandraDet]{Lisandra Deturpada (ND 13)} &amp; @UUID[Compendium.compendios-para-t20.rt20-031-poderes.Item.fld31ParcLisandr]{Parceira: Lisandra de Allihanna}</li>
  <li>Perigos: @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31RastrosCaca]{Rastros da Caça}, @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31NaturezaDet]{Natureza Deturpada}, @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31EnxameFullg]{Enxame Fullgori}, @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31SantuarioSo]{Santuário em Sofrimento}, @UUID[Compendium.compendios-para-t20.rt20-031-ameacas.Actor.fld31CorrentesIn]{Correntes Invisíveis}</li>
  <li>Macro: @UUID[Compendium.compendios-para-t20.rt20-031-macros.Macro.fld31MacroPecado]{Rastreador: Pontos de Deturpação &amp; Casulos (Edição 31)}</li>
</ul>`
      }
    }
  ].map(p => ({
    ...p,
    title: { show: true, level: 1 },
    image: {},
    video: { controls: true, volume: 0.5 },
    src: null,
    system: {},
    flags: {},
    _stats: statsHeader
  }));

  for await (const [oldPageKey] of db.iterator({ gte: `!journal.pages!${journalId}.`, lte: `!journal.pages!${journalId}.\uffff` })) {
    await db.del(oldPageKey);
  }
  await db.put(`!journal!${journalId}`, journalDoc);
  for (const p of pages) {
    await db.put(`!journal.pages!${journalId}.${p._id}`, { ...p, _dbKey: `!journal.pages!${journalId}.${p._id}` });
  }
  console.log(`✓ Diário "${journalDoc.name}" salvo com ${pages.length} páginas.`);
  await db.close();
}

// ============================================================================
// 4. TABELAS DE ROLAGEM (rt20-031-tabelas)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 31 em rt20-031-tabelas ---');
  const db = await openHierarchicalPack('rt20-031-tabelas');

  const tables = [
    {
      id: 'fld31TabFrasesLi',
      name: 'Lisandra Deturpada — Frases de Combate (Edição 31)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/racas/dahllan.webp',
      description: '<p>Falas oficiais de Lisandra Deturpada durante o confronto na Parte 4, Cena 2 (p. 17).</p>',
      results: [
        { id: 'res31Lis00000001', name: 'Me Fez um Monstro', text: '"Ele me fez um monstro. Um monstro!"', range: [1, 1] },
        { id: 'res31Lis00000002', name: 'Façam Melhor', text: '"Não lutem por ele! Se lutam, façam melhor do que ele jamais fez."', range: [2, 2] },
        { id: 'res31Lis00000003', name: 'Casulos Malditos', text: '"Esses casulos malditos! Sujando a casa de Allihanna!"', range: [3, 3] },
        { id: 'res31Lis00000004', name: 'Proteger ou Vingar', text: '"Vocês lutam para proteger, ou para levar adiante sua vingança?"', range: [4, 4] },
        { id: 'res31Lis00000005', name: 'Ordem e Destino', text: '"Vejo bons soldados que confundem ordem com destino."', range: [5, 5] },
        { id: 'res31Lis00000006', name: 'Outro Erro Meu', text: '"A floresta não vai sobreviver a outro erro meu!"', range: [6, 6] },
        { id: 'res31Lis00000007', name: 'Allihanna e Vocês', text: '"Não me façam escolher entre Allihanna e vocês!"', range: [7, 7] },
        { id: 'res31Lis00000008', name: 'A Tormenta Avança', text: '"Enquanto estou aqui, a Tormenta avança!"', range: [8, 8] },
        { id: 'res31Lis00000009', name: 'Manipulação', text: '"Não estão vendo? Ele os manipula como fez comigo!"', range: [9, 9] },
        { id: 'res31Lis00000010', name: 'Não é Forte o Bastante', text: '"O Fullgor não é forte o bastante. Nem vocês!"', range: [10, 10] }
      ]
    },
    {
      id: 'fld31TabPesoPres',
      name: 'O Peso da Presença — Resultados com Lisandra (Edição 31)',
      formula: '1d4',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      description: '<p>Os quatro desfechos possíveis dos 4 turnos de diálogo em O Peso da Presença (Parte 3, Cena 3, p. 14).</p>',
      results: [
        { id: 'res31Pes00000001', name: '4 Sucessos — Aceitação Plena', text: 'Lisandra aceita os personagens como guardiões legítimos: remove todas as condições e restaura todos os PV e PM do grupo.', range: [1, 1] },
        { id: 'res31Pes00000002', name: '2–3 Sucessos — Confiança Cautelosa', text: 'Lisandra aceita como guardiões bem-intencionados e restaura todos os PV e PM do grupo.', range: [2, 2] },
        { id: 'res31Pes00000003', name: '1 Sucesso — Tolerância', text: 'Lisandra tolera o grupo com reservas e restaura metade dos PV e PM.', range: [3, 3] },
        { id: 'res31Pes00000004', name: '0 Sucessos — Fechamento', text: 'Lisandra se fecha e segue sozinha ("Vocês trazem aço demais, ruído demais").', range: [4, 4] }
      ]
    },
    {
      id: 'fld31TabRecompGr',
      name: 'Gratidão de Allihanna — Recompensas por Deturpação (Edição 31)',
      formula: '1d4',
      img: 'systems/tormenta20/icons/magias/comunhao-com-a-natureza.webp',
      description: '<p>Faixas de premiação final concedidas por Lisandra e Allihanna em O Que Permanece (Parte 4, Cena 3, p. 18).</p>',
      results: [
        { id: 'res31Rec00000001', name: '0–3 Pontos — Gratidão Plena', text: 'Ressuscita todos abatidos, Lisandra vira Parceira Mestre tripla (Combatente/Destruidor frio/Médico) 1x/aventura + tesouro ND 12.', range: [1, 1] },
        { id: 'res31Rec00000002', name: '4–6 Pontos — Respeito', text: 'Allihanna ressuscita um personagem abatido + tesouro ND 11.', range: [2, 2] },
        { id: 'res31Rec00000003', name: '7–9 Pontos — Crédito', text: 'Recompensados com tesouro de ND 10.', range: [3, 3] },
        { id: 'res31Rec00000004', name: '10+ Pontos — Limite', text: 'Recompensados com tesouro de ND 9.', range: [4, 4] }
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
      folder: null,
      sort: 400000,
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
    for (const r of t.results) {
      await db.put(`!tables.results!${t.id}.${r.id}`, {
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
      });
    }
    console.log(`✓ Tabela "${t.name}" salva com ${t.results.length} resultados.`);
  }

  await db.close();
}

// ============================================================================
// 5. MACROS (rt20-031-macros)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 31 em rt20-031-macros ---');
  const db = await openHierarchicalPack('rt20-031-macros');

  const macroId = 'fld31MacroPecado';
  const macroScript = `/**
 * Rastreador: Pontos de Deturpação & Casulos de Lisandra — Fúlgor dos Deuses (Edição 31)
 */
const DET_FLAG = "fullgor31Deturpacao";
const pts = Number(game.user.getFlag("world", DET_FLAG) || 0);
const casulos = 10 + pts;

const dialogHtml = \`
  <form>
    <p><strong>Floresta Greenleaf (Edição 31: Pecados do Pai)</strong></p>
    <p>Pontos de Deturpação atuais: <strong>\${pts}</strong> | Casulos na cena final: <strong>\${casulos}</strong> (+\${casulos * 5} PV temp.)</p>
    <p><small>Limiar: 6+ surge Jardineiro Dourado | 8+ (+3 magias) | 10+ (+3 magias) | Enxame: 10d6 + \${pts}d6.</small></p>
  </form>
\`;

async function onAddDet() {
  const next = pts + 1;
  await game.user.setFlag("world", DET_FLAG, next);
  ChatMessage.create({ content: \`<p><strong>🌿 Pontos de Deturpação (Ed. 31):</strong> Total agora é <strong>\${next}</strong> (Casulos: \${10 + next} | Enxame: 10d6+\${next}d6).</p>\` });
}

async function onResetDet() {
  await game.user.setFlag("world", DET_FLAG, 0);
  ChatMessage.create({ content: "<p><strong>🌿 Pontos de Deturpação (Ed. 31):</strong> Contador reiniciado para 0.</p>" });
}

async function onBreakCasulos() {
  const roll = await new Roll("1d6").evaluate();
  await roll.toMessage({ flavor: "Lisandra recupera a razão e destrói casulos dourados (-5 PV cada em Lisandra, +1 estilha cada)" });
}

async function onRecompensa() {
  let tier = "10+ Pontos — Limite (Tesouro ND 9)";
  if (pts <= 3) tier = "0–3 Pontos — Gratidão Plena (Ressurreição + Parceira Mestre Lisandra + Tesouro ND 12)";
  else if (pts <= 6) tier = "4–6 Pontos — Respeito (1 Ressurreição + Tesouro ND 11)";
  else if (pts <= 9) tier = "7–9 Pontos — Crédito (Tesouro ND 10)";
  ChatMessage.create({ content: \`<p><strong>🍃 Recompensa de Allihanna (\${pts} Deturpação):</strong> \${tier}</p>\` });
}

if (foundry?.applications?.api?.DialogV2) {
  foundry.applications.api.DialogV2.wait({
    window: { title: "Edição 31 — Pecados do Pai" },
    content: dialogHtml,
    buttons: [
      { action: "add", icon: "fas fa-plus", label: "+1 Deturpação", callback: onAddDet },
      { action: "casulo", icon: "fas fa-seedling", label: "Lisandra: 1d6 Casulos", default: true, callback: onBreakCasulos },
      { action: "recomp", icon: "fas fa-award", label: "Ver Recompensa", callback: onRecompensa },
      { action: "reset", icon: "fas fa-rotate-left", label: "Zerar", callback: onResetDet }
    ]
  });
} else {
  new Dialog({
    title: "Edição 31 — Pecados do Pai",
    content: dialogHtml,
    buttons: {
      add: { icon: '<i class="fas fa-plus"></i>', label: "+1 Deturpação", callback: onAddDet },
      casulo: { icon: '<i class="fas fa-seedling"></i>', label: "Lisandra: 1d6 Casulos", callback: onBreakCasulos },
      recomp: { icon: '<i class="fas fa-award"></i>', label: "Ver Recompensa", callback: onRecompensa },
      reset: { icon: '<i class="fas fa-rotate-left"></i>', label: "Zerar", callback: onResetDet }
    },
    default: "casulo"
  }).render(true);
}
`;

  const macroDoc = {
    _id: macroId,
    name: 'Rastreador: Pontos de Deturpação & Casulos de Lisandra (Edição 31)',
    type: 'script',
    folder: null,
    sort: 400000,
    img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
    scope: 'global',
    command: macroScript,
    author: 'kL8nfmJOQTqjeU2x',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  console.log(`✓ Macro "${macroDoc.name}" salva.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 31 (PECADOS DO PAI)');
  console.log('================================================================================');

  await injectThreats();
  await injectItemsAndPowers();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 31 CONCLUÍDA COM SUCESSO NOS COMPÊNDIOS HIERÁRQUICOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 31:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItemsAndPowers, injectJournals, injectTables, injectMacros };

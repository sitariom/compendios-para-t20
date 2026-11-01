#!/usr/bin/env node
/**
 * Injeção Canônica de Tabelas de Rolagem da DB #228 em Tabelas_T20
 *
 * 1. Tabela: Desabamento dos Túneis - Efeitos por Rodada (1d6)
 * 2. Tabela: Divinas Organizações de Arton (1d17)
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { generateId } = require('./create-entry');

const PACK_TABLES = path.join(__dirname, '..', 'packs', 'Tabelas_T20');

async function injectTables() {
  console.log('=== Injetando Tabelas de Rolagem da DB #228 em Tabelas_T20 ===\n');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  // 1. Tabela de Efeitos do Desabamento (1d6)
  const desabamentoTableId = 'TbDesabamento228';
  const desabamentoResults = [
    {
      _id: generateId(),
      type: 0,
      text: '<strong>1-2) Destroços:</strong> Destroços caem do teto. Cada personagem deve fazer um teste de <strong>Reflexos (CD 25)</strong>. Se falhar, sofre 4d6 pontos de dano de impacto (8d6 se falhar por 10 ou mais).',
      img: 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
      documentCollection: null,
      documentId: null,
      weight: 2,
      range: [1, 2],
      drawn: false,
      flags: {}
    },
    {
      _id: generateId(),
      type: 0,
      text: '<strong>3-4) Fenda no Chão:</strong> Rachaduras se abrem no solo da caverna. Cada personagem deve fazer um teste de <strong>Acrobacia ou Atletismo (CD 25)</strong>. Se falhar, tropeça e sofre –5 em sua próxima ação contra o perigo. Se falhar por 10 ou mais, cai e perde sua ação nesta rodada.',
      img: 'systems/tormenta20/icons/poderes/ameacas/terremoto.webp',
      documentCollection: null,
      documentId: null,
      weight: 2,
      range: [3, 4],
      drawn: false,
      flags: {}
    },
    {
      _id: generateId(),
      type: 0,
      text: '<strong>5) Bloqueio:</strong> Um desabamento vai bloquear o caminho! O personagem pode desistir desta rota e procurar outra (perde a ação nesta rodada, mas age normalmente a partir da próxima) ou tentar correr antes do fechamento com <strong>Atletismo (CD 25)</strong>. Se falhar, perde a ação e sofre 8d6 pontos de dano de impacto.',
      img: 'systems/tormenta20/icons/poderes/ameacas/bloqueio.webp',
      documentCollection: null,
      documentId: null,
      weight: 1,
      range: [5, 5],
      drawn: false,
      flags: {}
    },
    {
      _id: generateId(),
      type: 0,
      text: '<strong>6) Passagem Livre:</strong> Este trecho de túnel é mais resistente, mas as paredes estão perto de ruir. Os personagens não sofrem qualquer efeito danoso neste turno, mas devem continuar correndo ou serão soterrados ao fim da 7ª rodada.',
      img: 'systems/tormenta20/icons/svg/stairs.svg',
      documentCollection: null,
      documentId: null,
      weight: 1,
      range: [6, 6],
      drawn: false,
      flags: {}
    }
  ];

  const desabamentoTable = {
    _id: desabamentoTableId,
    name: 'Desabamento dos Túneis: Efeitos por Rodada (DB #228)',
    img: 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
    description: '<p>Tabela oficial de perigo complexo para a fuga dos <em>Subterrâneos de Trebuck</em> (Dragão Brasil #228). No início de cada rodada, role 1d6 para determinar o evento de desabamento.</p>',
    results: desabamentoResults,
    formula: '1d6',
    replacement: true,
    displayRoll: true,
    folder: 'xbFP75zAd0URzuDL', // Pasta "Tabelas T20"
    sort: 500000,
    ownership: { default: 0 },
    flags: { tormenta20: { source: 'Dragão Brasil #228' } },
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  await db.put(`!tables!${desabamentoTableId}`, desabamentoTable);
  for (const r of desabamentoResults) {
    await db.put(`!tables.results!${desabamentoTableId}.${r._id}`, r);
  }
  console.log('✓ Tabela "Desabamento dos Túneis (1d6)" salva em Tabelas_T20.');

  // 2. Tabela de Divinas Organizações de Arton (1d17)
  const orgTableId = 'TbDivOrgArton228';
  const orgNames = [
    { range: [1, 1], name: 'Arautos do Destruidor (Megalokk)', desc: 'Caçadores selvagens e devotos do Deus dos Monstros que empunham o lendário Arco dos Arautos.' },
    { range: [2, 2], name: 'Caravana das Três Chamas (Wynna)', desc: 'Companhia itinerante de arcanistas que ensina magias básicas e emite o Certificado de Conclusão.' },
    { range: [3, 3], name: 'Casa dos Desgarrados (Khalmyr)', desc: 'Magistratura e tribunal sagrado que disponibiliza Juízes Reabilitadores para mediar disputas extremas.' },
    { range: [4, 4], name: 'Claviculário (Sszzaas)', desc: 'Seita insidiosa de espiões e ladrões sagrados guardiões da Chave Mestra.' },
    { range: [5, 5], name: 'Companhia Teatral Valluk Delsori (Valkaria)', desc: 'Artistas cênicos ilusionistas cujos ingressos permitem metamorfosear-se em lendas de Arton.' },
    { range: [6, 6], name: 'Confraria Dourada (Azgher)', desc: 'Devotos mascarados do Sol que utilizam a Máscara do Sol Dourado para pilhar túmulos amaldiçoados.' },
    { range: [7, 7], name: 'Crianças de Aharadak (Aharadak)', desc: 'Cultistas lefeu que usam o Pingente Rubro para assimilar a matéria vermelha da Tormenta.' },
    { range: [8, 8], name: 'Fadas do Jardim Secreto (Allihanna)', desc: 'Feéricos botânicos de Trebuck e Pondsmânia que enviam espíritos Allihennali para curar o mundo.' },
    { range: [9, 9], name: 'Herdeiros da Escama (Kallyadranoch)', desc: 'Descendentes de dragões que lapidam a Alma de Dragão para absorver e rebater fúria elemental.' },
    { range: [10, 10], name: 'Hoshikage (Lin-Wu / Tamu-ra)', desc: 'Ordem secreta de shinobi tamuranianos que comandam os ágeis e surpreendentes Guaxininjas.' },
    { range: [11, 11], name: 'Hoste Naufragista (Oceano)', desc: 'Corsários e piratas sagrados que sacrificam tesouros em troca do poder da Âncora Naufragista.' },
    { range: [12, 12], name: 'Lança Silente (Arsenal / Keenn)', desc: 'Cavaleiros e generais devotos da guerra perpétua portadores da temida Arma Silente de adamante.' },
    { range: [13, 13], name: 'Memorialistas (Tanna-Toh)', desc: 'Escribas sagrados que preservam a história artoniana através da magia Memorizar Conhecimento.' },
    { range: [14, 14], name: 'Mestres de Cerimônia (Marah)', desc: 'Bardos e pacificadores que tocam a Cítola da Paz para desarmar hostilidades sem sangue.' },
    { range: [15, 15], name: 'Parteiras das Mandíbulas (Lena)', desc: 'Clérigas que abençoam partos nos ermos mais perigosos empunhando o Rosário da Vida.' },
    { range: [16, 16], name: 'Peregrinos de Valkaria (Valkaria)', desc: 'Exploradores destemidos que utilizam a Bússola das Lágrimas para rastrear auras e relíquias.' },
    { range: [17, 17], name: 'Zoyrak (Nimb)', desc: 'Grafiteiros e revoltosos caóticos armados com a ardilosa Bomba de Tinta alquímica.' }
  ];

  const orgResults = orgNames.map(o => ({
    _id: generateId(),
    type: 0,
    text: `<strong>${o.name}:</strong> ${o.desc}`,
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    documentCollection: null,
    documentId: null,
    weight: 1,
    range: o.range,
    drawn: false,
    flags: {}
  }));

  const orgTable = {
    _id: orgTableId,
    name: 'Divinas Organizações de Arton (DB #228)',
    img: 'systems/tormenta20/icons/svg/holy-symbol.svg',
    description: '<p>Tabela de rolagem (1d17) para sortear encontros, missões ou patronos religiosos baseados nas organizações da Dragão Brasil #228.</p>',
    results: orgResults,
    formula: '1d17',
    replacement: true,
    displayRoll: true,
    folder: 'xbFP75zAd0URzuDL', // Pasta "Tabelas T20"
    sort: 510000,
    ownership: { default: 0 },
    flags: { tormenta20: { source: 'Dragão Brasil #228' } },
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  await db.put(`!tables!${orgTableId}`, orgTable);
  for (const r of orgResults) {
    await db.put(`!tables.results!${orgTableId}.${r._id}`, r);
  }
  console.log('✓ Tabela "Divinas Organizações de Arton (1d17)" salva em Tabelas_T20.');

  await db.close();
  console.log('\n✅ Tabelas de rolagem da DB #228 injetadas com sucesso.');
}

if (require.main === module) {
  injectTables().catch(err => {
    console.error('Erro ao injetar tabelas:', err);
    process.exit(1);
  });
}

module.exports = { injectTables };

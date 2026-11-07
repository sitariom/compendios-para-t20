#!/usr/bin/env node
/**
 * Injeção Canônica da Tabela de Rolagem da DB #229 em Tabelas_T20
 *
 * 1. Tabela: Encontros nas Montanhas Sanguinárias (DB #229) — 1d6
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { generateId, saveToSourcePacks } = require('./create-entry');

const PACK_TABLES = path.join(__dirname, '..', 'packs', 'Tabelas_T20');
const FOLDER_TABELAS = 'xbFP75zAd0URzuDL'; // Pasta "Tabelas T20"

async function injectTables() {
  console.log('=== Injetando Tabelas de Rolagem da DB #229 em Tabelas_T20 ===\n');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  const tableId = 'TbEncontrosSang229';
  const tableResultsRaw = [
    {
      text: '<strong>1) Escalada Perigosa:</strong> Não há outra forma de avançar que não seja para cima. Os personagens devem passar em três testes de <strong>Atletismo (CD 25)</strong>. Falhar representa uma queda que causa 3d6 pontos de dano de impacto, +3d6 por sucesso obtido anteriormente. Personagens com deslocamento de voo podem ignorar os testes respeitando limites de carga.',
      img: 'systems/tormenta20/icons/svg/stairs.svg',
      range: [1, 1]
    },
    {
      text: '<strong>2) Ninho Vazio:</strong> Dentro de um ninho imenso nas rochas, vocês encontram 1d4 ovos de grifo. Se cuidados adequadamente, eles eclodem fornecendo um <strong>Grifo parceiro montaria iniciante</strong> (@UUID[Compendium.compendios-para-t20.Itens_T20.Item.heA8oQwmkuwDszHV]{Parceiro: Filhote de Grifo}). Caso este encontro seja rolado novamente, dois grifos adultos atacam o grupo.',
      img: 'systems/tormenta20/icons/itens/gerais/grifo.webp',
      range: [2, 2]
    },
    {
      text: '<strong>3) Revoada de Serpes:</strong> O bater ensurdecedor de dezenas de asas de couro ecoa pelas fendas. Uma @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KRevSerp229A]{Revoada de Serpes (ND 8)} faminta atacará a área em 1d4 rodadas, permitindo que os heróis se preparem ou busquem abrigo.',
      img: 'systems/tormenta20/icons/ameacas/serpe.png',
      range: [3, 3]
    },
    {
      text: '<strong>4) Peregrinação Druida:</strong> Vocês encontram duas druidisas dedicadas à Mãe Jaguar (aspecto de Allihanna) acompanhadas por um felino colossal. Quando o grupo acampar, o descanso conta como <strong>condição superior</strong>. Se tiverem enfrentado monstros antes, elas curam <strong>4d8+4 pontos de vida</strong> de cada personagem.',
      img: 'systems/tormenta20/icons/poderes/concedidos-natureza.webp',
      range: [4, 4]
    },
    {
      text: '<strong>5) Kemooz Pensativo:</strong> Uma estátua viva esculpida em rocha com tatuagens arcanas medita há séculos. Passar em três testes de <strong>Diplomacia opostos à Vontade dele (+15)</strong> convence este gênio da terra a servir como @UUID[Compendium.compendios-para-t20.Itens_T20.Item.vBMc9AAxnTi4LYqZ]{Parceiro: Kemooz Pensativo} (cria cubos de terra com RD 5 e 30 PV).',
      img: 'systems/tormenta20/icons/magias/criar-elementos.webp',
      range: [5, 5]
    },
    {
      text: '<strong>6) Rastejante Voraz:</strong> O solo treme com violência e uma centopeia-dragão colossal emerge do subsolo faminta tentando engolir os personagens.',
      img: 'systems/tormenta20/icons/ameacas/centopeia-dragao.png',
      range: [6, 6]
    }
  ];

  const tableResults = tableResultsRaw.map(r => ({
    _id: generateId(),
    type: 'text',
    text: r.text,
    description: r.text,
    img: r.img,
    documentCollection: null,
    documentId: null,
    weight: 1,
    range: r.range,
    drawn: false,
    name: '',
    flags: {},
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  }));

  // Limpa resultados anteriores
  for await (const [oldKey] of db.iterator({ gte: `!tables.results!${tableId}.`, lte: `!tables.results!${tableId}.\uffff` })) {
    await db.del(oldKey);
  }

  const resultIds = tableResults.map(r => r._id);
  const tableDoc = {
    _id: tableId,
    name: 'Encontros nas Montanhas Sanguinárias (DB #229)',
    img: 'systems/tormenta20/icons/poderes/ameacas/terremoto.webp',
    description: '<p>Tabela oficial de encontros aleatórios para as marchas nas <em>Montanhas Sanguinárias</em> durante a aventura <strong>O Olho do Basilisco</strong> (Dragão Brasil #229). A cada dia de viagem, role 1d6.</p>',
    results: resultIds,
    formula: '1d6',
    replacement: true,
    displayRoll: true,
    folder: FOLDER_TABELAS,
    sort: 520000,
    ownership: { default: 0 },
    flags: { tormenta20: { source: 'Dragão Brasil #229' } },
    _stats: {
      coreVersion: '13.351',
      systemId: 'tormenta20',
      systemVersion: '1.5.015',
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: 'piAgentTormenta20'
    }
  };

  await db.put(`!tables!${tableId}`, tableDoc);
  for (const r of tableResults) {
    await db.put(`!tables.results!${tableId}.${r._id}`, r);
  }
  saveToSourcePacks('Tabelas_T20', tableDoc, tableResults.map(r => ({
    key: `!tables.results!${tableId}.${r._id}`,
    typePath: '!tables.results!',
    doc: r
  })));
  console.log('✓ Tabela "Encontros nas Montanhas Sanguinárias (1d6)" salva em Tabelas_T20.');

  await db.close();
  console.log('\n✅ Tabelas de rolagem da DB #229 injetadas com sucesso.');
}

if (require.main === module) {
  injectTables().catch(err => {
    console.error('Erro ao injetar tabelas:', err);
    process.exit(1);
  });
}

module.exports = { injectTables };

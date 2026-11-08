#!/usr/bin/env node
/**
 * Injeção Canônica das Tabelas de Rolagem da DB #230 em Tabelas_T20
 *
 * Tabelas Oficiais:
 * 1. Natureza do Pesadelo (DB #230) — 1d4
 * 2. Ganchos do Pesadelo em Aslothia (DB #230) — 1d6
 * 3. Encontros da Corrida Brutal (DB #230) — 1d6
 * 4. Sonhos Roubados pelo Coletor (DB #230) — 1d4
 *
 * Padrão Canônico (Hotfix v1.6.2):
 * - RollTable.results contém array estrito de string IDs
 * - Subdocumentos armazenados sob a chave !tables.results!${tableId}.${resultId}
 * - Subdocumento com type: "text" e campo description preenchido
 * - Sincronização automática em packs/Tabelas_T20 e src/packs/Tabelas_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { generateId, saveToSourcePacks } = require('./create-entry');

const PACK_TABLES = path.join(__dirname, '..', 'packs', 'Tabelas_T20');
const FOLDER_TABELAS = 'xbFP75zAd0URzuDL'; // Pasta "Tabelas T20"

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'piAgentTormenta20'
};

const DB230_TABLES = [
  // =========================================================================
  // 1. NATUREZA DO PESADELO (1d4)
  // =========================================================================
  {
    id: 'TbNaturezaPesad230',
    name: 'Natureza do Pesadelo (DB #230)',
    formula: '1d4',
    img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
    description: '<p>Tabela oficial para determinar a habilidade nefasta concedida pelo Mestre do Pesadelo a um soldado do pesadelo (Zangão, Coletor, Ceifador ou Polivalente). A CD para resistir é igual à CD da habilidade <em>Mente Alienígena</em> do soldado.</p>',
    results: [
      {
        text: '<strong>1) Pesadelo de Desastre:</strong> Uma criatura atingida pela mordida do pesadelo fica <strong>confusa</strong> (Vontade evita; uma criatura só pode ficar confusa por esta habilidade uma vez por cena).',
        img: 'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp',
        range: [1, 1]
      },
      {
        text: '<strong>2) Pesadelo de Fracasso:</strong> Uma criatura atingida pela mordida do pesadelo perde <strong>1d6 PM</strong> e fica <strong>esmorecida</strong> (Vontade evita).',
        img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
        range: [2, 2]
      },
      {
        text: '<strong>3) Pesadelo de Perseguição:</strong> Uma criatura atingida pela mordida do pesadelo deve fazer um teste de Vontade. Se falhar, até o fim da cena ela considera seus aliados como seus inimigos para efeitos de suas habilidades.',
        img: 'systems/tormenta20/icons/poderes/ameacas/medo.webp',
        range: [3, 3]
      },
      {
        text: '<strong>4) Pesadelo de Morte:</strong> Uma criatura atingida pela mordida do pesadelo <strong>não pode recuperar pontos de vida</strong> por 1 rodada.',
        img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
        range: [4, 4]
      }
    ]
  },

  // =========================================================================
  // 2. GANCHOS DO PESADELO EM ASLOTHIA (1d6)
  // =========================================================================
  {
    id: 'TbGanchosPesad230',
    name: 'Ganchos do Pesadelo em Aslothia (DB #230)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/poderes/ameacas/sonho.webp',
    description: '<p>Ideias e ganchos oficiais para envolver os aventureiros nas tramas do Arquilich Ferren Asloth e do Reino dos Pesadelos.</p>',
    results: [
      {
        text: '<strong>1) Cobaias de Dalanthir:</strong> Um arcanista a serviço de Aslothia captura os personagens para transformá-los em criaturas do pesadelo experimentais na prisão de Dalanthir. O grupo deve escapar e destruir os laboratórios da Sislach Rawia.',
        img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
        range: [1, 1]
      },
      {
        text: '<strong>2) A Corrida pela Relíquia:</strong> Os heróis são enviados para resgatar um tomo arcano ancestral sobre energias planares, disputando cada passo contra mercenários oníricos enviados pelo Arquilich.',
        img: 'systems/tormenta20/icons/itens/magicos/livro-magias.webp',
        range: [2, 2]
      },
      {
        text: '<strong>3) A Defesa da Aldeia:</strong> Uma vila nas fronteiras é atacada por saqueadores mortos-vivos com caudas de metal e carne translúcida. O grupo descobre que são mercenários oníricos testados em combate real por Ferren.',
        img: 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
        range: [3, 3]
      },
      {
        text: '<strong>4) Infiltração na Prisão Política:</strong> Um nobre aliado ou antigo mentor foi levado para Dalanthir e está prestes a ter sua mente esvaziada por um Coletor do Pesadelo.',
        img: 'systems/tormenta20/icons/poderes/ameacas/furtividade.webp',
        range: [4, 4]
      },
      {
        text: '<strong>5) A Bruma dos Pesadelos em Bielefeld:</strong> Aldeões em Bielefeld enlouquecem com pesadelos constantes. A fonte é um apanhador onírico instalado além da fronteira por Narsogg.',
        img: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
        range: [5, 5]
      },
      {
        text: '<strong>6) O Resgate do Estudioso:</strong> Um erudito que descobriu a existência dos Mestres do Pesadelo é sequestrado pela rede de espiões da Sislach Vissanzi e deve ser resgatado antes de ser silenciado.',
        img: 'systems/tormenta20/icons/poderes/ameacas/estrategia.webp',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 3. ENCONTROS DA CORRIDA BRUTAL (1d6)
  // =========================================================================
  {
    id: 'TbCorridaBrut230',
    name: 'Encontros da Corrida Brutal (DB #230)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/itens/equipamentos/carroca.webp',
    description: '<p>Tabela de obstáculos e encontros durante as manobras e perseguições veiculares da Corrida Brutal nas Ruínas de Tyrondir.</p>',
    results: [
      {
        text: '<strong>1) Emboscada de Gaardak:</strong> O bugbear @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KGaarda230N]{Gaardak} arremessa azagaias pesadas (teste +28 para derrubar/empurrar veículo).',
        img: 'systems/tormenta20/icons/armas/lanca.webp',
        range: [1, 1]
      },
      {
        text: '<strong>2) Salva de Bombas dos Goblins:</strong> @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KGobGorl230L]{Três Goblins em um Gorlogg} disparam bombas na pista (12d6 de impacto, Ref CD 22 reduz à metade).',
        img: 'systems/tormenta20/icons/poderes/ameacas/explosao.webp',
        range: [2, 2]
      },
      {
        text: '<strong>3) Ataque Furtivo de Arzak:</strong> O assassino @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KArzak230M]{Arzak} emparelha com seu veículo e ataca com seu <em>kum’shrak eviscerador</em>.',
        img: 'systems/tormenta20/icons/armas/foice.webp',
        range: [3, 3]
      },
      {
        text: '<strong>4) Aranha-Golem a Vapor:</strong> Dok aciona as caldeiras de sua aranha mecânica liberando vapor escaldante (Reflexos CD 20 ou –5 na visão por 1 rodada).',
        img: 'systems/tormenta20/icons/poderes/ameacas/vapor.webp',
        range: [4, 4]
      },
      {
        text: '<strong>5) Rasante do Ornitóptero:</strong> Pottak lança abrolhos pontiagudos na pista. O piloto deve fazer teste de Pilotagem (CD 25) ou as rodas sofrem 4d6 de dano e deslocamento reduzido à metade.',
        img: 'systems/tormenta20/icons/itens/equipamentos/abrolhos.webp',
        range: [5, 5]
      },
      {
        text: '<strong>6) Fenda de Piche e Lodo:</strong> Uma ravina súbita cheia de piche e lodo negro. Exige teste de Reflexos ou Pilotagem (CD 25) para contornar sem capotamento.',
        img: 'systems/tormenta20/icons/poderes/ameacas/lama.webp',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 4. SONHOS ROUBADOS PELO COLETOR (1d4)
  // =========================================================================
  {
    id: 'TbSonhosRoubad230',
    name: 'Sonhos Roubados pelo Coletor (DB #230)',
    formula: '1d4',
    img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
    description: '<p>Tabela para determinar aleatoriamente a natureza do maior sonho roubado de um aventureiro por um @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KColePes230B]{Coletor do Pesadelo}.</p>',
    results: [
      {
        text: '<strong>1) Sonho de Amor:</strong> Você sonhava em ser amado. Perda de PM igual ao nível de personagem e pesadelos de solidão (@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KSonhoAmo230]{Sonho Resgatado: Sonho de Amor}).',
        img: 'systems/tormenta20/icons/poderes/concedidos/cura.webp',
        range: [1, 1]
      },
      {
        text: '<strong>2) Sonho de Aprendizado:</strong> Você sonhava em dominar um ofício ou técnica. Sofre penalidade de –2 em três perícias treinadas e pesadelos de incompetência (@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KSonhoApr230]{Sonho Resgatado: Sonho de Aprendizado}).',
        img: 'systems/tormenta20/icons/poderes/concedidos/conhecimento.webp',
        range: [2, 2]
      },
      {
        text: '<strong>3) Sonho de Destruição:</strong> Você sonhava em destruir algo ou se vingar. Perda de PV igual ao seu nível e pesadelos com sua própria ruína (@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KSonhoDes230]{Sonho Resgatado: Sonho de Destruição}).',
        img: 'systems/tormenta20/icons/poderes/concedidos/destruicao.webp',
        range: [3, 3]
      },
      {
        text: '<strong>4) Nenhum Sonho Principal:</strong> O ceifador rouba sonhos menores. Sua recuperação natural de PV e PM diminui em um passo devido a sono constantemente perturbado.',
        img: 'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp',
        range: [4, 4]
      }
    ]
  }
];

async function injectTables() {
  console.log('=== Injetando 4 Tabelas de Rolagem da DB #230 em Tabelas_T20 ===\n');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  for (const t of DB230_TABLES) {
    const tableId = t.id;
    const tableResults = [];
    const embeddedDocs = [];

    // Limpa resultados anteriores
    for await (const [oldKey] of db.iterator({ gte: `!tables.results!${tableId}.`, lte: `!tables.results!${tableId}.\uffff` })) {
      await db.del(oldKey);
    }

    for (const r of t.results) {
      const resultId = generateId();
      const cleanName = r.text.replace(/<[^>]+>/g, '').split(':')[0].trim();
      const resultDoc = {
        _id: resultId,
        type: 'text',
        name: cleanName,
        text: r.text,
        description: r.text,
        img: r.img,
        documentCollection: null,
        documentId: null,
        weight: 1,
        range: r.range,
        drawn: false,
        flags: {},
        _stats: statsHeader
      };
      tableResults.push(resultDoc);
      embeddedDocs.push({
        key: `!tables.results!${tableId}.${resultId}`,
        typePath: '!tables.results!',
        doc: resultDoc
      });
    }

    const resultIds = tableResults.map(r => r._id);
    const tableDoc = {
      _id: tableId,
      name: t.name,
      img: t.img,
      description: t.description,
      results: resultIds,
      formula: t.formula,
      replacement: true,
      displayRoll: true,
      folder: FOLDER_TABELAS,
      sort: 550000,
      ownership: { default: 0 },
      flags: { tormenta20: { source: 'Dragão Brasil #230' } },
      _stats: statsHeader
    };

    await db.put(`!tables!${tableId}`, tableDoc);
    for (const ed of embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }

    saveToSourcePacks('Tabelas_T20', tableDoc, embeddedDocs);
    console.log(`✓ Tabela "${t.name}" [${tableId}] injetada com ${tableResults.length} resultados.`);
  }

  await db.close();
  console.log('\n✅ 4 Tabelas de Rolagem da DB #230 injetadas com 100% de sucesso!');
}

if (require.main === module) {
  injectTables().catch(err => {
    console.error('❌ Erro na injeção de tabelas DB #230:', err);
    process.exit(1);
  });
}

module.exports = { injectTables };

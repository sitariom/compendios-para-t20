#!/usr/bin/env node
/**
 * Injeção Canônica das Tabelas de Rolagem da DB #231 em Tabelas_T20
 *
 * Tabelas Oficiais:
 * 1. Previsões de Selina (DB #231) — 1d6
 * 2. Encontros Diurnos em Halak-Tûr (DB #231) — 1d6
 * 3. Encontros Noturnos em Halak-Tûr (DB #231) — 1d6
 * 4. Ganchos de Aventura em Halak-Tûr (DB #231) — 1d6
 *
 * Conformidade Canônica:
 * - IDs estritos de 16 caracteres alfanuméricos (/^[a-zA-Z0-9]{16}$/)
 * - RollTable.results contém array estrito de string IDs
 * - Subdocumentos armazenados sob a chave !tables.results!${tableId}.${resultId}
 * - Subdocumento com type: "text", campo "description" e campo "name" obrigatórios
 * - Sincronização automática em packs/Tabelas_T20 e src/packs/Tabelas_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { saveToSourcePacks } = require('./create-entry');

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

const DB231_TABLES = [
  // =========================================================================
  // 1. PREVISÕES DE SELINA (1d6)
  // =========================================================================
  {
    id: 't8231PrevSelinaA',
    name: 'Previsões de Selina (DB #231)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/poderes/classes/conjuradores/visao-mistica.webp',
    description: '<p>Tabela oficial da leitura de cartas de Selina, a cartomante do Circo Sombrio (Cena 3). Determina os presságios e consequências místicas para quem consulta a adivinha.</p>',
    results: [
      {
        id: 'r8231PrevNadaAAA',
        name: 'Previsão: Nada',
        text: '<strong>1) Nada:</strong> <em>"As forças místicas não me permitem ver seu destino."</em> Nenhum efeito mágico ocorre com o personagem.',
        description: 'Nenhum efeito mágico ocorre com o personagem.',
        img: 'systems/tormenta20/icons/poderes/classes/conjuradores/visao-mistica.webp',
        range: [1, 1]
      },
      {
        id: 'r8231PrevMiseriA',
        name: 'Previsão: Miséria',
        text: '<strong>2 a 4) Miséria:</strong> <em>"Sombras em sua alma, sinto dizer que o mal te procura."</em> O aventureiro fica <strong>frustrado</strong> até o dia seguinte (Vontade CD 20 evita).',
        description: 'O aventureiro fica frustrado até o dia seguinte (Vontade CD 20 evita).',
        img: 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
        range: [2, 4]
      },
      {
        id: 'r8231PrevFeliciA',
        name: 'Previsão: Felicidade',
        text: '<strong>5 e 6) Felicidade:</strong> <em>"Os deuses gostam de você... e eu também."</em> O personagem é abençoado com proteção contra as trevas, ficando imune ao fascínio do picadeiro de Tenebra na Cena 4.',
        description: 'Concede imunidade contra a condição fascinado no picadeiro do Circo Sombrio.',
        img: 'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp',
        range: [5, 6]
      }
    ]
  },

  // =========================================================================
  // 2. ENCONTROS DIURNOS EM HALAK-TÛR (1d6)
  // =========================================================================
  {
    id: 't8231EncDiurnosA',
    name: 'Encontros Diurnos em Halak-Tûr (DB #231)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/poderes/concedidos/visao-no-escuro.webp',
    description: '<p>Tabela de encontros sob o sol escaldante das dunas de Halak-Tûr, o Deserto da Perdição.</p>',
    results: [
      {
        id: 'r8231EncDiuArrai',
        name: 'Bando de Arraias-Secas',
        text: '<strong>1) Bando de Arraias-Secas:</strong> 1d4 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ArraiSecAA]{Arraias-Secas (ND 3)} emboscadas sob a areia branca tentando cravar seus ferrões nas montarias.',
        description: 'Emboscada de arraias predadoras sob as dunas.',
        img: 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
        range: [1, 1]
      },
      {
        id: 'r8231EncDiuCarav',
        name: 'Caravana Nômade',
        text: '<strong>2) Caravana Nômade:</b> Viajantes sar-allan e dai-kerat montados em pôneis velozes, dispostos a negociar mantimentos, arcos e rações de viagem.',
        description: 'Encontro social e comércio com tribos do deserto.',
        img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
        range: [2, 2]
      },
      {
        id: 'r8231EncDiuAnshi',
        name: 'Caverna da Anshira',
        text: '<strong>3) Caverna da Anshira:</strong> Uma gruta fresca e protegida guardada por uma @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231AnshiraAAA]{Anshira (ND 9)}, oferecendo refúgio confortável a quem agir com respeito.',
        description: 'Refúgio seguro em gruta mística.',
        img: 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
        range: [3, 3]
      },
      {
        id: 'r8231EncDiuConst',
        name: 'Ataque da Constritora Arenosa',
        text: '<strong>4) Bote da Constritora Arenosa:</strong> Uma colossal @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ConstAreAA]{Constritora Arenosa (ND 9)} irrompe das dunas em manobra de constrição maciça.',
        description: 'Predador colossal de areia viva ataca de surpresa.',
        img: 'systems/tormenta20/icons/ameacas/sucuri.png',
        range: [4, 4]
      },
      {
        id: 'r8231EncDiuSerpe',
        name: 'Ninho em Cânion Rochoso',
        text: '<strong>5) Ninho em Cânion:</strong> Um desfiladeiro rochoso ocupado por serpes ou lagartos perseguidores caçando no calor do meio-dia.',
        description: 'Perigo de terreno e monstros voadores em cânions.',
        img: 'systems/tormenta20/icons/ameacas/serpe.png',
        range: [5, 5]
      },
      {
        id: 'r8231EncDiuSolst',
        name: 'Tempestade de Areia Solar',
        text: '<strong>6) Tempestade de Areia Solar:</strong> Ventos causticantes que diminuem a visibilidade e exigem testes de Sobrevivência (CD 20) para evitar desidratação e perda de rumo.',
        description: 'Perigo climático extremo sob o sol de Azgher.',
        img: 'systems/tormenta20/icons/magias/tempestade-estelar.webp',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 3. ENCONTROS NOTURNOS EM HALAK-TÛR (1d6)
  // =========================================================================
  {
    id: 't8231EncNoturnAA',
    name: 'Encontros Noturnos em Halak-Tûr (DB #231)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/magias/escuridao.webp',
    description: '<p>Tabela de perigos e horrores mortos-vivos sob a noite gélida de Tenebra em Halak-Tûr.</p>',
    results: [
      {
        id: 'r8231EncNotSaque',
        name: 'Patrulha de Ressecados',
        text: '<strong>1) Patrulha de Ressecados:</strong> 1d4+1 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231RessecSaqA]{Ressecados Saqueadores (ND 4)} emboscam o acampamento disparando flechas de trevas.',
        description: 'Batedores esqueléticos atacam na calada da noite.',
        img: 'systems/tormenta20/icons/ameacas/esqueleto.png',
        range: [1, 1]
      },
      {
        id: 'r8231EncNotLider',
        name: 'Horda do Ressecado Líder',
        text: '<strong>2) Horda do Ressecado Líder:</strong> Um formidável @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231RessecLidA]{Ressecado Líder (ND 4 Solo)} comanda uma investida letal cercado por sua tribo morta.',
        description: 'Encontro de alto risco contra comandante de 280 PV.',
        img: 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png',
        range: [2, 2]
      },
      {
        id: 'r8231EncNotCacad',
        name: 'Rastro do Caçador de Condenados',
        text: '<strong>3) O Caçador de Condenados:</strong> Um letal @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231CacCondAAA]{Caçador de Condenados (ND 11)} surge deslizando de ruínas zarkhassianas com quatro lâminas em punho.',
        description: 'Aberração assassina nagah caçando os vivos.',
        img: 'systems/tormenta20/icons/ameacas/nagah-guardiao.png',
        range: [3, 3]
      },
      {
        id: 'r8231EncNotGelid',
        name: 'Frio Sobrenatural',
        text: '<strong>4) Frio Sobrenatural:</strong> A temperatura cai drasticamente abaixo de zero. Personagens sem agasalhos adequados sofrem 2d6 pontos de dano de frio e fadiga.',
        description: 'Condição climática hostil das noites do deserto.',
        img: 'systems/tormenta20/icons/magias/nevasca.webp',
        range: [4, 4]
      },
      {
        id: 'r8231EncNotFadiga',
        name: 'Aparições e Espectros',
        text: '<strong>5) Sussurros nas Dunas:</strong> Espectros de viajantes que morreram de sede tentam drenar a sanidade dos vigias com visões de oásis falsos.',
        description: 'Ilusões fantasmagóricas de sede e perdição.',
        img: 'systems/tormenta20/icons/ameacas/aparicao.png',
        range: [5, 5]
      },
      {
        id: 'r8231EncNotOasis',
        name: 'Oásis Abençoado',
        text: '<strong>6) Oásis Abençoado por Azgher:</strong> Uma nascente de águas puras cercada por tamareiras onde nenhuma criatura morta-viva ousa se aproximar.',
        description: 'Santuário de descanso seguro sob as estrelas.',
        img: 'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 4. GANCHOS DE AVENTURA EM HALAK-TÛR (1d6)
  // =========================================================================
  {
    id: 't8231GanchosDesA',
    name: 'Ganchos de Aventura em Halak-Tûr (DB #231)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/itens/magicos/mapa-do-tesouro.webp',
    description: '<p>Ideias e ganchos de aventura oficiais para mestres ambientarem campanhas e breves jornadas no Deserto da Perdição.</p>',
    results: [
      {
        id: 'r8231GanchCismaA',
        name: 'O Cisma dos Ferani',
        text: '<strong>1) O Cisma dos Ferani:</strong> Os heróis são contratados para escoltar o Koorlav Urghir Koohar em uma tentativa diplomática de apaziguar a rivalidade crescente entre os druidas de Allihanna e Megalokk.',
        description: 'Intriga política e tribal entre trogs do deserto.',
        img: 'systems/tormenta20/icons/armas/lanca.webp',
        range: [1, 1]
      },
      {
        id: 'r8231GanchTumbzA',
        name: 'A Tumba Zarkhassiana',
        text: '<strong>2) A Tumba Zarkhassiana:</strong> Exploradores gananciosos violaram uma pirâmide subterrânea enterrada nas dunas, libertando um @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231CacCondAAA]{Caçador de Condenados} que persegue a caravana.',
        description: 'Exploração de masmorra zarkhassiana e horror morto-vivo.',
        img: 'systems/tormenta20/icons/ameacas/nagah-guardiao.png',
        range: [2, 2]
      },
      {
        id: 'r8231GanchSolari',
        name: 'O Solário de Cette',
        text: '<strong>3) Cerco ao Solário:</strong> Fanáticos dos Filhos de Aak cercaram o monastério solar no norte de Halak-Tûr. Os monges precisam de escolta para retirar relíquias antes da profanação.',
        description: 'Batalha campal contra cultistas aberrantes.',
        img: 'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp',
        range: [3, 3]
      },
      {
        id: 'r8231GanchCircoS',
        name: 'O Circo Sombria',
        text: '<strong>4) O Circo Sombria:</strong> Notícias sobre vilas esvaziadas no limiar do deserto levam à sinistra companhia do mestre @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231MorriseAAA]{Morrise}.',
        description: 'Gancho para a aventura Breves Jornadas: Circo Sombrio.',
        img: 'systems/tormenta20/icons/ameacas/necromante-veterano.png',
        range: [4, 4]
      },
      {
        id: 'r8231GanchPoneiA',
        name: 'Os Pôneis Dai-kerat',
        text: '<strong>5) Resgate nas Estepes:</strong> Saqueadores do deserto capturaram uma linhagem sagrada de pôneis dai-kerat. Um kuan oferece recompensas preciosas em artefatos e armas leves pelo resgate.',
        description: 'Perseguição veicular e resgate em alta velocidade.',
        img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
        range: [5, 5]
      },
      {
        id: 'r8231GanchOnixAA',
        name: 'A Presa da Serpente Negra',
        text: '<strong>6) A Presa da Serpente Negra:</strong> Um mestre armeiro sar-allan busca duas presas de ônix de uma @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ConstAreAA]{Constritora Arenosa} para forjar uma cimitarra magistral.',
        description: 'Caçada a monstro lendário nas areias movediças.',
        img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
        range: [6, 6]
      }
    ]
  }
];

async function injectTables() {
  console.log('=== Injetando 4 Tabelas de Rolagem da DB #231 em Tabelas_T20 ===\n');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  for (const tData of DB231_TABLES) {
    const resultIds = tData.results.map(r => r.id);
    const mainDoc = {
      _id: tData.id,
      name: tData.name,
      img: tData.img,
      description: tData.description,
      results: resultIds,
      formula: tData.formula,
      replacement: true,
      displayRoll: true,
      folder: FOLDER_TABELAS,
      sort: 0,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    const embeddedResults = [];

    for (let i = 0; i < tData.results.length; i++) {
      const r = tData.results[i];
      const resDoc = {
        _id: r.id,
        name: r.name,
        type: 'text',
        text: r.text,
        description: r.description,
        img: r.img,
        weight: 1,
        range: r.range,
        drawn: false,
        documentId: null,
        flags: {},
        _stats: statsHeader
      };

      embeddedResults.push({
        key: `!tables.results!${tData.id}.${r.id}`,
        typePath: '!tables.results!',
        doc: resDoc
      });
    }

    // 1. Gravar documento principal da tabela
    await db.put(`!tables!${tData.id}`, mainDoc);

    // 2. Gravar subdocumentos de resultados
    for (const er of embeddedResults) {
      await db.put(er.key, er.doc);
    }

    // 3. Espelhar em src/packs/Tabelas_T20
    saveToSourcePacks('Tabelas_T20', mainDoc, embeddedResults);
    console.log(`✓ Tabela "${tData.name}" [${tData.id}] gravada com ${embeddedResults.length} resultados.`);
  }

  await db.close();
  console.log(`\n🎉 4 Tabelas de Rolagem da DB #231 gravadas com sucesso em ${PACK_TABLES}!`);
}

if (require.main === module) {
  injectTables().catch(err => {
    console.error('❌ Erro na injeção de tabelas DB #231:', err);
    process.exit(1);
  });
}

module.exports = { injectTables };

#!/usr/bin/env node
/**
 * Injeção Canônica das Tabelas de Rolagem da DB #232 em Tabelas_T20
 *
 * Tabelas Oficiais:
 * 1. Linhagens e Formas de Licantropia (DB #232) — 1d6
 * 2. Encontros com Licantropos em Arton (DB #232) — 1d6
 * 3. Encontros na Floresta em Monstros e Homens (DB #232) — 1d6
 * 4. Ganchos de Aventura com Licantropos (DB #232) — 1d6
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
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

const DB232_TABLES = [
  // =========================================================================
  // 1. LINHAGENS E FORMAS DE LICANTROPIA (1d6)
  // =========================================================================
  {
    id: 't8232LinhagensAA',
    name: 'Linhagens e Formas de Licantropia (DB #232)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
    description: '<p>Tabela para determinar aleatoriamente a linhagem feral de um licantropo recém-infectado ou avistado em Arton.</p>',
    results: [
      {
        id: 'r8232LinhLoboAAA',
        name: 'Linhagem do Lobo (Lobisomem)',
        text: '<strong>1) Lobo (Lobisomem):</strong> Deslocamento 15m, +2 Força, mordida 1d6 e manobra derrubar livre.',
        description: 'Linhagem clássica do lobo.',
        img: 'systems/tormenta20/icons/ameacas/lobo.png',
        range: [1, 1]
      },
      {
        id: 'r8232LinhOncaAAA',
        name: 'Linhagem da Onça (Homem-Onça)',
        text: '<strong>2) Onça (Homem-Onça):</strong> Deslocamento 15m, natação 6m, duas garras e mordida, e poder Emboscar.',
        description: 'Linhagem ágil e aquática da onça.',
        img: 'systems/tormenta20/icons/ameacas/lobo-crocodilo.png',
        range: [2, 2]
      },
      {
        id: 'r8232LinhRatoAAA',
        name: 'Linhagem do Rato (Homem-Rato)',
        text: '<strong>3) Rato (Homem-Rato):</strong> Tamanho Minúsculo, deslocamento 12m, escalada 6m, mordida que avaria armaduras.',
        description: 'Linhagem infiltradora urbana de roedor.',
        img: 'systems/tormenta20/icons/ameacas/rato-gigante.png',
        range: [3, 3]
      },
      {
        id: 'r8232LinhSelaAAA',
        name: 'Linhagem do Selako (Homem-Tubarão)',
        text: '<strong>4) Selako (Homem-Tubarão):</strong> Natação total, mordida sangrenta e faro aprimorado para criaturas feridas.',
        description: 'Linhagem marinha predatória de Megalokk.',
        img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
        range: [4, 4]
      },
      {
        id: 'r8232LinhTexuAAA',
        name: 'Linhagem do Texugo (Homem-Texugo)',
        text: '<strong>5) Texugo (Homem-Texugo):</strong> Tamanho Pequeno, escalada 3m e habilidade Durão ativa.',
        description: 'Linhagem resistente das colinas.',
        img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
        range: [5, 5]
      },
      {
        id: 'r8232LinhRaraAAA',
        name: 'Linhagem Rara ou Primordial',
        text: '<strong>6) Fera Lendária:</strong> Uma variante híbrida ancestral com sentidos cegos e garras de adamante.',
        description: 'Licantropia mística ou primordial.',
        img: 'systems/tormenta20/icons/poderes/concedidos/forca-da-natureza.webp',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 2. ENCONTROS COM LICANTROPOS EM ARTON (1d6)
  // =========================================================================
  {
    id: 't8232EncLicanAAA',
    name: 'Encontros com Licantropos em Arton (DB #232)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/magias/escuridao.webp',
    description: '<p>Tabela de encontros noturnos e urbanos com ameaças licantrópicas em Arton.</p>',
    results: [
      {
        id: 'r8232EncLoboUrbA',
        name: 'O Fidalgo Assassino',
        text: '<strong>1) O Predador Urbano:</strong> 1 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232LoboUrbAAA]{Lobisomem Predador Urbano (ND 4)} embosca o grupo em um beco estreito.',
        description: 'Emboscada de lobisomem disfarçado na cidade.',
        img: 'systems/tormenta20/icons/ameacas/lobo.png',
        range: [1, 1]
      },
      {
        id: 'r8232EncRatoInfA',
        name: 'Infiltração Roedora',
        text: '<strong>2) Infiltração nos Esgotos:</strong> 1d4 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232RatoComAAA]{Licantropos Rato Comedores de Restos (ND 1)} liderados por 1 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232RatoInfAAA]{Licantropo Rato Infiltrador (ND 7)}.',
        description: 'Bando de homens-rato atacando pelo subsolo.',
        img: 'systems/tormenta20/icons/ameacas/rato-gigante.png',
        range: [2, 2]
      },
      {
        id: 'r8232EncOncaPirA',
        name: 'Abordagem Fluvial',
        text: '<strong>3) Piratas do Rio:</strong> Uma chalupa comanda por um @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232OncaPirAAA]{Licantropo Onça Pirata de Rio (ND 7)} intercepta a navegação.',
        description: 'Combate naval em rios caudalosos.',
        img: 'systems/tormenta20/icons/ameacas/lobo-crocodilo.png',
        range: [3, 3]
      },
      {
        id: 'r8232EncTexuFurA',
        name: 'Fúria nas Colinas',
        text: '<strong>4) Fúria nas Colinas:</strong> 1 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232TexuFurAAA]{Licantropo Texugo Furioso (ND 5)} salta de um barranco brandindo um machado de guerra.',
        description: 'Guerreiro anão em fúria licantrópica.',
        img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
        range: [4, 4]
      },
      {
        id: 'r8232EncSelaTerA',
        name: 'Terror na Costa',
        text: '<strong>5) Barbatana Vermelha:</strong> Um colossal @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232SelaTerAAA]{Licantropo Selako Terror dos Mares (ND 9)} investe contra o casco da embarcação.',
        description: 'Predador submarino ataca embarcação.',
        img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
        range: [5, 5]
      },
      {
        id: 'r8232EncLoboCacA',
        name: 'O Caçador Cinzento',
        text: '<strong>6) O Caçador Implacável:</strong> O temível @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232LoboCacAAA]{Lobisomem Caçador de Recompensas (ND 9)} segue os passos do grupo exigindo a entrega de um foragido.',
        description: 'Confronto com caçador de elite.',
        img: 'systems/tormenta20/icons/ameacas/lobo-das-cavernas.png',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 3. ENCONTROS NA FLORESTA EM MONSTROS E HOMENS (1d6)
  // =========================================================================
  {
    id: 't8232EncMonstrAA',
    name: 'Encontros na Floresta em Monstros e Homens (DB #232)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/poderes/concedidos/voz-da-natureza.webp',
    description: '<p>Tabela de encontros e perigos nas trilhas fronteiriças da aventura Breves Jornadas: Monstros e Homens.</p>',
    results: [
      {
        id: 'r8232EncEstirgeA',
        name: 'Nuvem de Estirges',
        text: '<strong>1) Enxame Alado:</strong> 1d4+2 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232EstirgeAAA]{Estirges (ND 1)} zunem das copas das árvores para drenar sangue.',
        description: 'Ataque aéreo de parasitas hematófagos.',
        img: 'systems/tormenta20/icons/ameacas/besouro-aberrante.png',
        range: [1, 1]
      },
      {
        id: 'r8232EncMamaeGlA',
        name: 'Poça Ácida',
        text: '<strong>2) Poça Ácida:</strong> Uma @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232MamaeGlopA]{Mamãe Glop (ND 2)} e seus filhotes bloqueiam a passagem entre rochedos úmidos.',
        description: 'Monstro amórfico com divisão celular ácida.',
        img: 'systems/tormenta20/icons/ameacas/glop.png',
        range: [2, 2]
      },
      {
        id: 'r8232EncPerdTroA',
        name: 'Matilha de Perdigueiros',
        text: '<strong>3) Cães de Caça:</strong> 2 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232PerdTrollA]{Perdigueiros Troll (ND 1)} rastreiam o acampamento tentando imobilizar os vigias.',
        description: 'Animais com tentáculos vegetais em caçada.',
        img: 'systems/tormenta20/icons/ameacas/troll-subterraneo.png',
        range: [3, 3]
      },
      {
        id: 'r8232EncPatrPuri',
        name: 'Patrulha Purista',
        text: '<strong>4) Cavalaria de Guerra:</strong> 1 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232GineTrollA]{Ginete de Troll Purista (ND 2)} montado em seu troll ataca em investida violenta.',
        description: 'Cavalaria blindada purista.',
        img: 'systems/tormenta20/icons/ameacas/troll.png',
        range: [4, 4]
      },
      {
        id: 'r8232EncSantuari',
        name: 'Santuário de Allihanna',
        text: '<strong>5) Bosque Abençoado:</strong> Um pequeno recanto sagrado onde fadas e flores regenerativas recuperam 2d8 PV de quem prestar respeito.',
        description: 'Refúgio de descanso na floresta.',
        img: 'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp',
        range: [5, 5]
      },
      {
        id: 'r8232EncRitualFi',
        name: 'Totens de Megalokk',
        text: '<strong>6) Rastro do Xamã:</strong> Um acampamento avançado guardado pelo @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232XamaFinntA]{Xamã Finntroll (ND 2)} entoando preces profanas.',
        description: 'Ritual tribal vegetal hostil.',
        img: 'systems/tormenta20/icons/ameacas/finntroll-feitor.png',
        range: [6, 6]
      }
    ]
  },

  // =========================================================================
  // 4. GANCHOS DE AVENTURA COM LICANTROPOS (1d6)
  // =========================================================================
  {
    id: 't8232GanchLicaAA',
    name: 'Ganchos de Aventura com Licantropos (DB #232)',
    formula: '1d6',
    img: 'systems/tormenta20/icons/itens/magicos/mapa-do-tesouro.webp',
    description: '<p>Ganchos de aventura oficiais para introduzir mistérios e horrores licantrópicos em campanhas de Tormenta20.</p>',
    results: [
      {
        id: 'r8232GanchCuraAA',
        name: 'A Busca pela Cura',
        text: '<strong>1) A Busca pela Cura:</strong> Um herdeiro nobre foi infectado por uma mordida e contrata o grupo para encontrar flores raras de purificação antes da próxima transformação.',
        description: 'Corrida contra o tempo para curar a maldição.',
        img: 'systems/tormenta20/icons/poderes/concedidos/frutos-da-coragem.webp',
        range: [1, 1]
      },
      {
        id: 'r8232GanchArenaA',
        name: 'A Arena Clandestina',
        text: '<strong>2) O Campeão do Fosso:</strong> Apostas ilegais em Tiberus envolvem o temível @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232OncaLutAAA]{Licantropo Onça Lutador de Arena}.',
        description: 'Intriga urbana e torneio de gladiadores ferinos.',
        img: 'systems/tormenta20/icons/poderes/classes/combatentes/estilo-desarmado.webp',
        range: [2, 2]
      },
      {
        id: 'r8232GanchCultoAA',
        name: 'O Culto da Noite Eterna',
        text: '<strong>3) Servos de Tenebra:</strong> Um covil subterrâneo liderado pelo @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232TexuNoiAAA]{Licantropo Texugo Servo da Noite} planeja profanar o cemitério da cidade.',
        description: 'Conspiração religiosa profana.',
        img: 'systems/tormenta20/icons/magias/escuridao.webp',
        range: [3, 3]
      },
      {
        id: 'r8232GanchCofreAA',
        name: 'O Assalto Roedor',
        text: '<strong>4) O Roubo ao Tesouro:</strong> Joias imperiais sumiram por dutos minúsculos. O grupo deve seguir o rastro do @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232RatoInfAAA]{Infiltrador Veterano}.',
        description: 'Investigação policial e caçada nos esgotos.',
        img: 'systems/tormenta20/icons/itens/equipamentos/moedas.webp',
        range: [4, 4]
      },
      {
        id: 'r8232GanchNavioAA',
        name: 'O Navio Fantasma',
        text: '<strong>5) O Selako dos Mares:</strong> Pescadores trazem histórias de um barco à deriva atacado por um @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232SelaTerAAA]{Terror dos Mares}.',
        description: 'Mistério náutico de horror e sobrevivência.',
        img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
        range: [5, 5]
      },
      {
        id: 'r8232GanchGuerraA',
        name: 'Armas Monstruosas',
        text: '<strong>6) Ameaça Purista:</strong> Planos confiscados do @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232GineTrollA]{Ginete de Troll} revelam um criadouro secreto de perdigueiros nas fronteiras.',
        description: 'Missão de sabotagem militar na fronteira.',
        img: 'systems/tormenta20/icons/armas/lanca.webp',
        range: [6, 6]
      }
    ]
  }
];

async function injectTables() {
  console.log('=== Injetando 4 Tabelas de Rolagem da DB #232 em Tabelas_T20 ===\n');
  const db = new ClassicLevel(PACK_TABLES, { valueEncoding: 'json' });

  for (const tData of DB232_TABLES) {
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

    await db.put(`!tables!${tData.id}`, mainDoc);
    for (const er of embeddedResults) {
      await db.put(er.key, er.doc);
    }
    saveToSourcePacks('Tabelas_T20', mainDoc, embeddedResults);
    console.log(`✓ Tabela "${tData.name}" [${tData.id}] gravada com ${embeddedResults.length} resultados.`);
  }

  await db.close();
  console.log(`\n🎉 4 Tabelas de Rolagem da DB #232 gravadas com sucesso em ${PACK_TABLES}!`);
}

if (require.main === module) {
  injectTables().catch(err => {
    console.error('❌ Erro na injeção de tabelas DB #232:', err);
    process.exit(1);
  });
}

module.exports = { injectTables };

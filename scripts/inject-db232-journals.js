#!/usr/bin/env node
/**
 * Injeção Canônica dos Diários da Dragão Brasil #232 em Diarios_T20
 *
 * Diários Oficiais:
 * 1. Cenário: Licantropos Artonianos (DB #232) — 9 páginas detalhadas
 * 2. Aventura: Monstros e Homens (DB #232) — 9 páginas de aventura completa
 * 3. Gazeta do Reinado — Edição 164 (DB #232) — 1 página de crônicas
 *
 * Conformidade Canônica:
 * - IDs estritos de 16 caracteres alfanuméricos (/^[a-zA-Z0-9]{16}$/)
 * - JournalEntry.pages contém array estrito de string IDs
 * - Subdocumentos armazenados sob a chave !journal.pages!${journalId}.${pageId}
 * - Páginas com ownership.default: -1 (herança)
 * - Sincronização automática em packs/Diarios_T20 e src/packs/Diarios_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { saveToSourcePacks } = require('./create-entry');

const PACK_JOURNALS = path.join(__dirname, '..', 'packs', 'Diarios_T20');
const FOLDER_LIVROS = 'GTXWZvyrw7KEEBbp'; // Pasta "Livros T20 e Regras"

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

const DB232_JOURNALS = [
  // =========================================================================
  // 1. CENÁRIO: LICANTROPOS ARTONIANOS (DB #232)
  // =========================================================================
  {
    id: 'j8232LicanArtonA',
    name: 'Cenário: Licantropos Artonianos (DB #232)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8232LicanIntro',
        name: 'A Maldição e Origem da Licantropia em Arton',
        content: `<h2>Licantropos Artonianos</h2>
<p><em>Por Rafael Dei Svaldi e Thiago Rosa. Arte por Anderson Jackal.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"*Sob o manto da noite governada por Tenebra, vagam feras tão astutas quanto perigosas: os licantropos artonianos!*"
</blockquote>
<p>A licantropia em Arton é uma maldição ancestral que afeta exclusivamente humanoides. Ao contrário de lendas populares sobre luas cheias, a transformação é engatilhada por <strong>violência física letal</strong> presenciada pela vítima, levando-a a um surto bestial na noite seguinte que dura até o amanhecer.</p>`
      },
      {
        id: 'p8232LicanAtuaA',
        name: 'Licantropos Atualmente (Tribos e Ermos)',
        content: `<h2>Os Filhos da Noite nos Dias de Hoje</h2>
<p>Espalhados por florestas sombrias, esgotos de metrópoles, montanhas geladas e costas marítimas, os licantropos dividem-se entre aqueles que buscam a cura desesperadamente e aqueles que abraçaram a selvageria de Megalokk ou a escuridão de Tenebra como dons sagrados de caça e sobrevivência.</p>`
      },
      {
        id: 'p8232LicanFormA',
        name: 'As Formas de Licantropo',
        content: `<h2>Formas de Transformação</h2>
<p>Um licantropo pode manifestar três estados físicos:</p>
<ul>
  <li><strong>Forma Humanoide:</strong> Sua aparência mortal comum, mantendo apenas sentidos aguçados e fraqueza a mitral.</li>
  <li><strong>Forma Híbrida:</strong> Uma monstruosa fusão bípede armada com mordida e duas garras, capaz de desferir múltiplos ataques em combate frenético.</li>
  <li><strong>Forma de Fera:</strong> A réplica exata de um animal comum da linhagem, permitindo camuflagem, infiltração e habilidades especiais da espécie.</li>
</ul>`
      },
      {
        id: 'p8232LicanLoboA',
        name: 'A Linhagem do Lobo',
        content: `<h2>Lobisomens de Arton</h2>
<p>Os mais conhecidos e temidos licantropos. Em forma de fera tornam-se predadores velozes (15m) com bônus de Força e capacidade de derrubar alvos com a mordida.</p>
<p><strong>Ameaças Relacionadas:</strong></p>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232LoboUrbAAA]{Lobisomem Predador Urbano (ND 4)}</li>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232LoboCacAAA]{Lobisomem Caçador de Recompensas (ND 9)}</li>
</ul>`
      },
      {
        id: 'p8232LicanOncaA',
        name: 'A Linhagem da Onça',
        content: `<h2>Homens-Onça</h2>
<p>Nativos de selvas densas e bacias fluviais, combinam natação ágil com o poder de <em>Emboscar</em> logo na primeira rodada de combate.</p>
<p><strong>Ameaças Relacionadas:</strong></p>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232OncaPirAAA]{Licantropo Onça Pirata de Rio (ND 7)}</li>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232OncaLutAAA]{Licantropo Onça Lutador de Arena (ND 11)}</li>
</ul>`
      },
      {
        id: 'p8232LicanRatoA',
        name: 'A Linhagem do Rato',
        content: `<h2>Homens-Rato</h2>
<p>Comuns nos subterrâneos de grandes centros urbanos. Na forma de fera tornam-se Minúsculos, escalam paredes e desferem mordidas que estilhaçam armaduras.</p>
<p><strong>Ameaças Relacionadas:</strong></p>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232RatoComAAA]{Licantropo Rato Comedor de Restos (ND 1)}</li>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232RatoInfAAA]{Licantropo Rato Infiltrador Veterano (ND 7)}</li>
</ul>`
      },
      {
        id: 'p8232LicanSelaA',
        name: 'A Linhagem do Selako',
        content: `<h2>Homens-Tubarão</h2>
<p>Terror das águas costeiras de Khubar e do Mar do Dragão-Rei. Farejam sangue a quilômetros e entram em frenesi quando ferem suas presas.</p>
<p><strong>Ameaças Relacionadas:</strong></p>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232SelaFarAAA]{Licantropo Selako Farejador de Sangue (ND 3)}</li>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232SelaTerAAA]{Licantropo Selako Terror dos Mares (ND 9)}</li>
</ul>`
      },
      {
        id: 'p8232LicanTexuA',
        name: 'A Linhagem do Texugo',
        content: `<h2>Homens-Texugo</h2>
<p>Resistentes e irascíveis habitantes de colinas e ermos rochosos. Na forma de fera utilizam a habilidade <em>Durão</em> para resistir a punição absurda sob a terra.</p>
<p><strong>Ameaças Relacionadas:</strong></p>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232TexuFurAAA]{Licantropo Texugo Furioso (ND 5)}</li>
  <li>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232TexuNoiAAA]{Licantropo Texugo Servo da Noite (ND 8)}</li>
</ul>`
      },
      {
        id: 'p8232LicanCuraA',
        name: 'Controlando a Transformação e Cura',
        content: `<h2>Controle e Tratamento</h2>
<p>Aventureiros acometidos pela maldição podem adquirir o poder de destino <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8232CtrlLicanAA]{Controlar Licantropia}</strong> para assumir as formas deliberadamente.</p>
<p>A cura definitiva exige a magia <em>Purificação</em> com aprimoramento de dissipar ou rituais de remoção de maldição antes que a selvageria se torne irreversível.</p>`
      }
    ]
  },

  // =========================================================================
  // 2. AVENTURA: MONSTROS E HOMENS (DB #232)
  // =========================================================================
  {
    id: 'j8232MonstHomemA',
    name: 'Aventura: Monstros e Homens (DB #232)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8232MonstResum',
        name: 'Resumo da Aventura e Gancho',
        content: `<h2>Breves Jornadas: Monstros e Homens</h2>
<p><em>Por Lucas Borne. Uma aventura de resgate e combate contra tropas puristas na fronteira de Deheon e Yuden.</em></p>
<p>Aldeões desesperados contratam os heróis para investigar ataques de monstros treinados e resgatar jovens raptados por fanáticos da Supremacia Purista escondidos na floresta.</p>`
      },
      {
        id: 'p8232MonstCena1',
        name: 'Cena 1: Monstros à Solta',
        content: `<h2>Cena 1: Monstros à Solta</h2>
<p>A vila fronteiriça é assolada pela fuga caótica de criaturas perigosas. Os heróis enfrentam <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232EstirgeAAA]{Estirges (ND 1)}</strong> e a grotesca <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232MamaeGlopA]{Mamãe Glop (ND 2)}</strong> para proteger os camponeses.</p>`
      },
      {
        id: 'p8232MonstCena2',
        name: 'Cena 2: Onde as Feras Vivem',
        content: `<h2>Cena 2: Onde as Feras Vivem</h2>
<p>Rastreando as pegadas de criaturas vegetais e humanos calçados com botas militares puristas, os heróis adentram as matas fechadas enfrentando perigos naturais e clima hostil.</p>`
      },
      {
        id: 'p8232MonstCena3',
        name: 'Cena 3: Perseguidores',
        content: `<h2>Cena 3: Perseguidores</h2>
<p>Uma matilha de <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232PerdTrollA]{Perdigueiros Troll (ND 1)}</strong> embosca a vanguarda do grupo com tentáculos vegetais e mordidas derrubadoras.</p>`
      },
      {
        id: 'p8232MonstCena4',
        name: 'Cena 4: Cuidado Onde Pisa',
        content: `<h2>Cena 4: Cuidado Onde Pisa</h2>
<p>Perigo de armadilhas mecânicas com estacas de madeira e alarmes de sino instalados pela cavalaria purista para proteger suas linhas de suprimento.</p>`
      },
      {
        id: 'p8232MonstCena5',
        name: 'Cena 5: Sinal de Allihanna',
        content: `<h2>Cena 5: Sinal de Allihanna</h2>
<p>Um santuário profanado revela mensagens deixadas pelos espíritos da floresta, concedendo bênçãos temporárias de cura a quem restaurar o altar sagrado.</p>`
      },
      {
        id: 'p8232MonstCena6',
        name: 'Cena 6: Acampamento Maligno',
        content: `<h2>Cena 6: Acampamento Maligno</h2>
<p>Infiltração ou assalto direto à fortificação de paliçadas onde patrulham <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232GineTrollA]{Ginetes de Troll Purista (ND 2)}</strong> montados em trolls de guerra.</p>`
      },
      {
        id: 'p8232MonstCena7',
        name: 'Cena 7: Clareira Profanada',
        content: `<h2>Cena 7: Clareira Profanada</h2>
<p>O clímax da batalha contra o temível <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8232XamaFinntA]{Xamã Finntroll (ND 2)}</strong> e seus guardiões, interrompendo o ritual macabro de corrupção vegetal antes do sacrifício dos prisioneiros.</p>`
      },
      {
        id: 'p8232MonstEpilo',
        name: 'Epílogo: Planos Monstruosos',
        content: `<h2>Epílogo: Planos Monstruosos</h2>
<p>Com a derrota dos líderes puristas, os prisioneiros são libertados e documentos confiscados revelam a extensão dos experimentos genéticos e arcanos da Supremacia nas fronteiras de Arton.</p>`
      }
    ]
  },

  // =========================================================================
  // 3. GAZETA DO REINADO — EDIÇÃO 164 (DB #232)
  // =========================================================================
  {
    id: 'j8232Gazeta164AA',
    name: 'Gazeta do Reinado — Edição 164 (DB #232)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8232GazetaHeran',
        name: 'A Herança que Ninguém Reivindica',
        content: `<h2>A Herança que Ninguém Reivindica</h2>
<p><em>Notícias do Mundo de Arton • Edição 164 • Escrita e editada pelos Goblins de Valkaria.</em></p>
<p>Uma imensa fortuna deixada por um arquimago excêntrico permanece intocada nos cofres reais de Valkaria. Dezenas de supostos herdeiros e aventureiros disputam pistas enigmáticas espalhadas por masmorras esquecidas enquanto guildas rivais tentam usurpar o espólio.</p>`
      }
    ]
  }
];

async function injectJournals() {
  console.log('=== Injetando 3 Diários da DB #232 em Diarios_T20 ===\n');
  const db = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  for (const jData of DB232_JOURNALS) {
    const pageIds = jData.pages.map(p => p.id);
    const mainDoc = {
      _id: jData.id,
      name: jData.name,
      folder: jData.folder,
      pages: pageIds,
      sort: 0,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    const embeddedPages = [];

    for (let i = 0; i < jData.pages.length; i++) {
      const p = jData.pages[i];
      const pageDoc = {
        _id: p.id,
        name: p.name,
        type: 'text',
        title: { show: true, level: 1 },
        text: {
          content: p.content,
          format: 1
        },
        image: {},
        video: { controls: true, volume: 1 },
        src: null,
        system: {},
        sort: (i + 1) * 100000,
        ownership: { default: -1 },
        flags: {},
        _stats: statsHeader
      };

      embeddedPages.push({
        key: `!journal.pages!${jData.id}.${p.id}`,
        typePath: '!journal.pages!',
        doc: pageDoc
      });
    }

    await db.put(`!journal!${jData.id}`, mainDoc);
    for (const ep of embeddedPages) {
      await db.put(ep.key, ep.doc);
    }
    saveToSourcePacks('Diarios_T20', mainDoc, embeddedPages);
    console.log(`✓ Diário "${jData.name}" [${jData.id}] gravado com ${embeddedPages.length} páginas.`);
  }

  await db.close();
  console.log(`\n🎉 3 Diários da DB #232 gravados com sucesso em ${PACK_JOURNALS}!`);
}

if (require.main === module) {
  injectJournals().catch(err => {
    console.error('❌ Erro na injeção de diários DB #232:', err);
    process.exit(1);
  });
}

module.exports = { injectJournals };

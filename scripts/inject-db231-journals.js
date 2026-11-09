#!/usr/bin/env node
/**
 * Injeção Canônica dos Diários da Dragão Brasil #231 em Diarios_T20
 *
 * Diários Oficiais:
 * 1. A Vastidão Dourada de Halak-Tûr (DB #231) — 9 páginas sobre lore, geografia, povos, religião e perigos
 * 2. Aventura: Circo Sombrio (DB #231) — 6 páginas com aventura completa e cenas detalhadas
 * 3. Gazeta do Reinado — Edição 163 (DB #231) — 2 páginas com crônicas do cenário
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
  lastModifiedBy: 'piAgentTormenta20'
};

const DB231_JOURNALS = [
  // =========================================================================
  // 1. A VASTIDÃO DOURADA DE HALAK-TÛR (DB #231)
  // =========================================================================
  {
    id: 'j8231HalakTurAAA',
    name: 'A Vastidão Dourada de Halak-Tûr (DB #231)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8231HalakIntroA',
        name: 'Introdução e Geografia do Deserto da Perdição',
        content: `<h2>A Vastidão Dourada de Halak-Tûr</h2>
<p><em>Por Rafael Dei Svaldi. Arte por Anderson Jackal e Czepeku.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"*O Norte de Arton é ocupado por um vasto deserto de areias douradas que refletem com força a luz implacável do sol. Para os povos do sul, é o Deserto da Perdição; para aqueles que nele habitam, é Halak-Tûr.*"
</blockquote>
<p>Halak-Tûr é um ecossistema rigoroso e multifacetado, com dunas monumentais, platôs rochosos escavados por ventos causticantes, cânions profundos e oásis secretos onde a vida floresce contra todas as probabilidades. Seus habitantes aprenderam a ler cada mudança nos ventos e a respeitar o olhar vigilante de Azgher.</p>`
      },
      {
        id: 'p8231HalakFerani',
        name: 'Os Ferani e o Cisma de Liderança',
        content: `<h2>Os Ferani e o Cisma de Liderança</h2>
<p>Os ferani são trogs do Planalto de Sukala que moldaram a história do deserto. Outrora governantes da Cidade no Deserto (Kur'Vator), hoje vivem como nômades em pequenas tribos que cruzam as areias em seus <em>urk’mattar</em> (veículos de pedra e lona).</p>
<p>Tradicionalmente, cada tribo obedece a dois líderes:</p>
<ul>
  <li><strong>O Koorlav ("A Lança"):</strong> Líder militar e secular, papel atualmente exercido pelo experiente <strong>Urghir Koohar</strong> (Duas Lanças).</li>
  <li><strong>O Urgah'Ôr ("A Voz"):</strong> Líder religioso e druídico, atualmente disputado entre <strong>Gurvir Qtur</strong> (druida devoto de Allihanna) e <strong>Nikan’Tyr</strong> (druida de Megalokk, cujo culto cresceu enormemente após a perda da cidade).</li>
</ul>`
      },
      {
        id: 'p8231HalakMirage',
        name: 'A Dança da Areia, Classe Miragem e Canção da Pedra',
        content: `<h2>A Dança da Areia e a Canção da Pedra</h2>
<p>A elite guerreira ferani desenvolveu a <strong>Dança da Areia</strong>, um estilo de combate acrobático e furtivo praticado pela classe variante <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231MiragemClas]{Miragem (Caçador)}</strong>.</p>
<p>Combinando velocidade espantosa e mística elemental, os miragens canalizam habilidades exclusivas:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231DancaAreiaA]{Dança da Areia}:</strong> Bônus cumulativo de +1d4 a +1d12 em dano em constante movimento.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231CortinaPoeA]{Cortina de Poeira}:</strong> Camuflagem em combate dinâmico.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231PassoDeserA]{Passo do Deserto}:</strong> Teletransporte entre solos macios.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231MestreDeser]{Mestre do Deserto}:</strong> Redução de dano 20 e ataques fulminantes.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231CancaoPedrA]{Canção da Pedra}:</strong> Poder concedido de Allihanna e Megalokk capaz de moldar construções de pedra com testes de Religião e conjurar feitiços telúricos.</li>
</ul>`
      },
      {
        id: 'p8231HalakDaiker',
        name: 'Ventos do Leste: Kuans e Dai-kerat',
        content: `<h2>Ventos do Leste: Os Kuans e Dai-kerat</h2>
<p>Com a queda de Tamu-ra sob a Tormenta em 1390, sobreviventes liderados pelos anciões Ayaka e Isamu empreenderam um êxodo até Halak-Tûr. Acolhidos pela hospitalidade dos povos do deserto, a união entre a honra tamuraniana e a resiliência sar-allan gerou os <strong>dai-kerat</strong>.</p>
<p>Eles se organizam em tribos chamadas <strong>kuans</strong> (100 a 200 indivíduos), habitando grandes tendas circulares chamadas <em>aruks</em>. Embora não pratiquem o saque não violento sar-allan, seus ginetes atacam comunidades hostis nas fronteiras, poupando eternamente seus irmãos do deserto.</p>`
      },
      {
        id: 'p8231HalakTradic',
        name: 'Tradições do Leste: Arco, Cavalo e Falcão',
        content: `<h2>Tradições Dai-kerat: Arco, Cavalo e Falcão</h2>
<p>Três pilares fundamentam a cultura dos guerreiros das estepes:</p>
<ul>
  <li><strong>O Cavalo:</strong> O cruzamento de cavalos tamuranianos com corcéis sar-allan gerou pôneis ágeis, resistentes e infatigáveis no deserto.</li>
  <li><strong>A Arquearia Montada:</strong> Disparos letais a cavalo com arco curto, consagrados na origem <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231OrigNascEst]{Nascido nas Estepes}</strong>.</li>
  <li><strong>A Falcoaria:</strong> Adestramento do impetuoso <em>gavião olho-de-sangue</em>, nativo das Montanhas Sanguinárias e adaptado para a caça sob o sol escaldante.</li>
</ul>`
      },
      {
        id: 'p8231HalakPovosA',
        name: 'Outros Povos, Sahiri e Herança Zarkhassiana',
        content: `<h2>Outros Povos e a Raça Variante Sahiri</h2>
<p>Além dos humanos e trogs, Halak-Tûr abriga kobolds, nagahs, medusas e salamandras atraídos pelo calor e isolamento das montanhas rochosas.</p>
<p>Os relacionamentos entre humanos ou elfos com as misteriosas anshiras das cavernas dão origem aos <strong>Sahiri</strong>, uma variante de dahllan voltada para a comunhão com a terra e pedra, portadora dos poderes <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231SahiriAnimA]{Animar Rochas}</strong> e <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231SahiriProtA]{Proteção da Terra}</strong>.</p>`
      },
      {
        id: 'p8231HalakFeRelA',
        name: 'Religião e Fé: Azgher, Sszzaas e Tanna-Toh',
        content: `<h2>A Fé nas Areias Douradas</h2>
<p>A vida espiritual em Halak-Tûr é dominada pela presença onipresente de <strong>Azgher</strong>, o Deus-Sol vigilante que castiga os ímpios e recompensa a coragem. No entanto, outras forças deixaram marcas profundas:</p>
<ul>
  <li><strong>Sszzaas:</strong> O Grande Corruptor governou o passado através do extinto Império Zarkhassiano. Suas ruínas continuam chamando devotos reptilianos em busca de segredos proíbidos.</li>
  <li><strong>Tanna-Toh:</strong> A Deusa do Conhecimento é reverenciada pelos sábios sar-allan em grutas, oásis e santuários privados na Cidade no Deserto.</li>
</ul>`
      },
      {
        id: 'p8231HalakLocais',
        name: 'Locais de Interesse e Perigos das Areias',
        content: `<h2>Locais de Interesse e Facções Sombrias</h2>
<ul>
  <li><strong>Solário de Cette:</strong> Antigo monastério erguido sobre um pico solitário de rocha vermelha, guardando artefatos solares antiquíssimos.</li>
  <li><strong>Gruta da Perdição:</strong> Covil subterrâneo sagrado protegido por uma anshira ancestral e criaturas do submundo.</li>
  <li><strong>Adeptos do Hakala:</strong> Guerreiros fanáticos devotados a cultos sangrentos e saqueadores impiedosos.</li>
  <li><strong>Filhos de Aak:</strong> Bando aberrante de desertores convertidos ao culto macabro de Aharadak.</li>
</ul>`
      },
      {
        id: 'p8231HalakAmeacA',
        name: 'Bestiário e Ameaças do Deserto da Perdição',
        content: `<h2>Ameaças Canônicas de Halak-Tûr</h2>
<p>As dunas e cânions abrigam predadores adaptados ao calor extremo e aos terrores da noite:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ArraiSecAA]{Arraia-Seca (ND 3)}:</strong> Fera das areias que atua como armadilha viva de ferrão sangrento.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231AnshiraAAA]{Anshira (ND 9)}:</strong> Espírito fada protetor das grutas e mestre em magias de terra.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231CacCondAAA]{Caçador de Condenados (ND 11)}:</strong> Nagah guerreiro esquelético de quatro braços do Império Zarkhassiano.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ConstAreAA]{Constritora Arenosa (ND 9)}:</strong> Serpente colossal de areia viva com dentes de ônix negro.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231RessecSaqA]{Ressecado Saqueador (ND 4)}:</strong> Batedor morto-vivo jurado a Tenebra.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231RessecLidA]{Ressecado Líder (ND 4 Solo)}:</strong> Comandante esquelético com duas cimitarras e ordens letais.</li>
</ul>`
      }
    ]
  },

  // =========================================================================
  // 2. AVENTURA: CIRCO SOMBRIO (DB #231)
  // =========================================================================
  {
    id: 'j8231CircoSombrA',
    name: 'Aventura: Circo Sombrio (DB #231)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8231CircoResumA',
        name: 'Resumo da Aventura e Gancho',
        content: `<h2>Breves Jornadas: Circo Sombrio</h2>
<p><em>Uma aventura de suspense e combate contra cultistas de Tenebra para personagens de 2º a 4º nível.</em></p>
<p>Ao visitarem uma região rural do Reinado, os heróis encontram povoados aterrorizados por desaparecimentos inexplicáveis e ataques noturnos de mortos-vivos, originados por uma sinistra companhia circense itinerante.</p>`
      },
      {
        id: 'p8231CircoCena1A',
        name: 'Cena 1: Sem Deixar Vestígio',
        content: `<h2>Cena 1: Sem Deixar Vestígio</h2>
<p>A mercadora <strong>Matilda</strong>, proprietária de uma mercearia local, contrata o grupo por T$ 300 para investigar a interrupção repentina no fornecimento de legumes de uma fazenda vizinha. Durante a viagem noturna, os personagens enfrentam <strong>Turbas de Zumbis</strong> vestindo trajes festivos, revelando que os camponeses foram convertidos após visitarem o circo.</p>`
      },
      {
        id: 'p8231CircoCena2A',
        name: 'Cena 2: Medo das Trevas',
        content: `<h2>Cena 2: Medo das Trevas</h2>
<p>Ao chegarem à vila sitiada pelo medo, os heróis devem acumular 5 sucessos em um teste estendido de Diplomacia, Enganação (CD 15) ou Investigação e Sobrevivência (CD 20) para quebrar o silêncio dos moradores.</p>
<p>Um aldeão agradecido presenteia o grupo com o <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.i8231SimbAzgherA]{Símbolo Sagrado de Azgher}</strong>, relíquia de madeira protetora contra o fascínio das trevas.</p>`
      },
      {
        id: 'p8231CircoCena3A',
        name: 'Cena 3: O Circo Sombria',
        content: `<h2>Cena 3: O Circo Sombria</h2>
<p>O circo só se manifesta após o anoitecer. Suas atrações ocultam perigos ilusórios sob o riso falso de mortos-vivos:</p>
<ul>
  <li><strong>Brincadeiras:</strong> Testes estendidos de Pontaria e Atletismo para ganhar tesouros à custa de testes de Vontade contra fraqueza.</li>
  <li><strong>Comidas:</strong> Iguarias a meio preço que deixam quem as consome enjoado até o amanhecer.</li>
  <li><strong>Previsões de Selina:</strong> A cartomante arrependida lança a sorte com a tabela <strong>@UUID[Compendium.compendios-para-t20.Tabelas_T20.RollTable.t8231PrevSelinaA]{Previsões de Selina}</strong> (1d6).</li>
  <li><strong>Tenda de Espelhos:</strong> Sob feitiço de <em>Assassino Fantasmagórico</em> (Vontade e Fortitude CD 20).</li>
  <li><strong>Os Palhaços Guardiões:</strong> Combate contra <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231BiancoAAAA]{Bianco (ND 2)}</strong> e <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231RojoAAAAAA]{Rojo (ND 2)}</strong>.</li>
</ul>`
      },
      {
        id: 'p8231CircoCena4A',
        name: 'Cena 4: O Picadeiro de Tenebra',
        content: `<h2>Cena 4: O Picadeiro de Tenebra</h2>
<p>O som de uma corneta sinistra conduz a multidão hipnotizada para o picadeiro central. O mestre de cerimônias <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231MorriseAAA]{Morrise (ND 3)}</strong> revela seu sacrifício a Tenebra e liberta a temível <strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8231ManticZumb]{Mantícora Zumbi (ND 3)}</strong>.</p>
<p>Os aventureiros protegidos pelo símbolo de Azgher ou previsões afortunadas devem derrotar Morrise e a besta alada para quebrar o encanto do circo.</p>`
      },
      {
        id: 'p8231CircoEpilog',
        name: 'Epílogo: Sem Graça',
        content: `<h2>Epílogo: Sem Graça</h2>
<p>Com a derrota de Morrise, as lonas negras tremeluzem e se desfazem em poeira fantasmagórica. Os habitantes sobreviventes despertam atordoados, livres do fascínio sombrio, e recompensam os heróis com os tesouros do circo e a gratidão eterna da região.</p>`
      }
    ]
  },

  // =========================================================================
  // 3. GAZETA DO REINADO — EDIÇÃO 163 (DB #231)
  // =========================================================================
  {
    id: 'j8231Gazeta163AA',
    name: 'Gazeta do Reinado — Edição 163 (DB #231)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        id: 'p8231GazetaKeenn',
        name: 'Três Anos da Queda de Keenn e o Triunfo de Arsenal',
        content: `<h2>Três Anos da Queda de Keenn</h2>
<p><em>Notícias do Mundo de Arton • Edição 163 • Escrita e editada pelos Goblins de Valkaria.</em></p>
<p>Completam-se três anos desde o desfecho estarrecedor do Torneio do Deus Guerreiro, no qual Mestre Arsenal derrotou o antigo Senhor da Batalha Keenn e ascendeu ao Panteão de Arton. Teólogos e sacerdotes de todo o Reinado debatem os novos rumos do dogma bélico e a militarização acelerada promovida pelos devotos do novo Deus da Guerra.</p>`
      },
      {
        id: 'p8231GazetaTarvi',
        name: 'Os Certames da Tarvica e o Novo Senado Táurico',
        content: `<h2>Os Certames da Tarvica</h2>
<p>Após a devastação provocada pela queda de Tauron e a dissolução de antigas províncias do Império de Tauron, o Senado táurico passa por uma reestruturação profunda. Cadeiras vagas na alta cúpula política estão sendo disputadas através dos sangrentos Certames da Tarvica, atraindo gladiadores e estadistas minotauros de todas as regiões para consagrar seus novos líderes.</p>`
      }
    ]
  }
];

async function injectJournals() {
  console.log('=== Injetando 3 Diários da DB #231 em Diarios_T20 ===\n');
  const db = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  for (const jData of DB231_JOURNALS) {
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

    // 1. Gravar documento principal do diário
    await db.put(`!journal!${jData.id}`, mainDoc);

    // 2. Gravar subdocumentos das páginas
    for (const ep of embeddedPages) {
      await db.put(ep.key, ep.doc);
    }

    // 3. Espelhar em src/packs/Diarios_T20
    saveToSourcePacks('Diarios_T20', mainDoc, embeddedPages);
    console.log(`✓ Diário "${jData.name}" [${jData.id}] gravado com ${embeddedPages.length} páginas.`);
  }

  await db.close();
  console.log(`\n🎉 3 Diários da DB #231 gravados com sucesso em ${PACK_JOURNALS}!`);
}

if (require.main === module) {
  injectJournals().catch(err => {
    console.error('❌ Erro na injeção de diários DB #231:', err);
    process.exit(1);
  });
}

module.exports = { injectJournals };

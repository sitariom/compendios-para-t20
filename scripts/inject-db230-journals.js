#!/usr/bin/env node
/**
 * Injeção Canônica dos Diários da Dragão Brasil #230 em Diarios_T20
 *
 * Diários Oficiais:
 * 1. O Reino dos Pesadelos (DB #230) — 7 páginas detalhadas sobre Aslothia, Ferren Asloth e Criaturas
 * 2. Aventura: A Corrida Brutal (DB #230) — 5 páginas de aventura completa em Tyrondir
 *
 * Padrão Canônico (Hotfix v1.6.2):
 * - JournalEntry.pages contém array estrito de string IDs
 * - Subdocumentos armazenados sob a chave !journal.pages!${journalId}.${pageId}
 * - Sincronização automática em packs/Diarios_T20 e src/packs/Diarios_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { generateId, saveToSourcePacks } = require('./create-entry');

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

const DB230_JOURNALS = [
  // =========================================================================
  // 1. O REINO DOS PESADELOS (DB #230)
  // =========================================================================
  {
    id: 'jReinoPesad230AA',
    name: 'O Reino dos Pesadelos (DB #230)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        name: 'Uma Nova Ameaça Paira Sobre Arton',
        content: `<h2>O Reino dos Pesadelos</h2>
<p><em>Por Rafael Dei Svaldi. Arte por Janio Garcia.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"*Arton faz parte de um universo de maravilhas que escondem coisas terríveis em seus cantos obscuros. O Reino dos Pesadelos e suas criaturas necromecânicas é uma delas.*"
</blockquote>
<p>Diferente de planos astrais divinos ou reinos elementais puros, o Reino dos Pesadelos é uma dimensão formada pela condensação das aflições, pavor e anseios sombrios das mentes mortais quando adormecidas. Dominado por forjas oníricas perpétuas, ali a energia do medo é fundida com estruturas metálicas e ósseas para gerar predadores letais.</p>`
      },
      {
        name: 'A Soberana dos Pesadelos: Judara',
        content: `<h2>A Ascensão da Soberana Judara</h2>
<p>Durante muito tempo, os quatro Mestres do Pesadelo governaram o reino de forma passiva. Tudo mudou com a chegada de <strong>Judara Gigger</strong>, uma jovem pesquisadora artoniana cuja mente foi tocada pelo Mestre do Desastre.</p>
<p>Ao cruzar o portal onírico em um sacrifício final para fechar a passagem em sua vila natal, seu espírito fundiu-se irrevogavelmente àquela dimensão. Familiarizada não apenas com os pesadelos, mas com a amplitude criativa dos <strong>sonhos</strong>, Judara derrotou os Mestres e assumiu o comando como a <strong>Soberana dos Pesadelos</strong>, iniciando incursões calculadas a Arton para colher a mais potente de todas as energias: os sonhos dos heróis.</p>`
      },
      {
        name: 'Os Soldados do Pesadelo',
        content: `<h2>Criaturas e Soldados do Pesadelo</h2>
<p>As legiões forjadas no reino onírico possuem corpos caninos esqueléticos translúcidos, ossos metálicos e caudas especializadas:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KZangPes230AA]{Zangão do Pesadelo (ND 5)}:</strong> O soldado de linha, adaptável com cauda-espinho, ferrão venenoso, cauda-lâmina ou tentáculo.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KColePes230AA]{Coletor do Pesadelo (ND 6)}:</strong> Especializado em drenar pontos de mana e roubar os sonhos definitivos de suas vítimas.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KCeifPes230AA]{Ceifador do Pesadelo (ND 8)}:</strong> Máquina assassina ágil dotada de cauda-lâmina cortante 18/x3.</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KPoliPes230AA]{Pesadelo Polivalente (ND 10)}:</strong> Bípede colossal com quatro caudas ativas e regeneração acelerada.</li>
</ul>`
      },
      {
        name: 'Mestres do Pesadelo e Despojos',
        content: `<h2>Os Mestres do Pesadelo & A Centelha Onírica</h2>
<p>Entidades gigantescas de ND 15 (@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KMestPes230AA]{Mestre do Pesadelo}), personificações vivas de Desastre, Fracasso, Perseguição e Morte. Possuem 50% de chance de ignorar dano mundano ou mágico e conjuram magias de ilusão livremente.</p>
<p>Ao derrotar um Mestre, aventureiros habilidosos podem extrair a <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KCentelha230A]{Centelha Onírica}</strong> (CD 30), catalisador alquímico capaz de conceder magias de ilusão permanentemente.</p>`
      },
      {
        name: 'Ferren Asloth e o Plano do Arquilich',
        content: `<h2>O Domínio das Mentes em Aslothia</h2>
<p>O senhor supremo de Aslothia, o Arquilich <strong>Ferren Asloth</strong>, compreendeu que controlar mortos-vivos não bastava: era necessário aniquilar a esperança viva de seus súditos para impedir qualquer centelha de rebelião. Estudando os pesadelos através de barreiras místicas sem perder a sanidade, Ferren iniciou a produção de seus próprios <strong>Mercenários Oníricos</strong> em cooperação forçada com coletores capturados.</p>`
      },
      {
        name: 'Os Sislach: Conselheiros de Ferren',
        content: `<h2>As Três Frentes de Pesquisa dos Sislach</h2>
<ul>
  <li><strong>Sislach Rawia e a Prisão de Dalanthir:</strong> O braço forte militar de Aslothia comanda laboratórios necromecânicos nos subterrâneos de Dalanthir, usando prisioneiros políticos como cobaias.</li>
  <li><strong>Sislach Narsogg e os Apanhadores de Pesadelos:</strong> Osteon diplomata que conduz rituais arcanos rudimentares para atrair e capturar seres oníricos, espalhando fendas involuntárias por Arton.</li>
  <li><strong>Sislach Vissanzi e a Rede de Espionagem:</strong> Mestra das sombras infiltrando informantes em igrejas e academias arcanas do Reinado para desvendar os segredos dos Mestres e de Judara.</li>
</ul>`
      },
      {
        name: 'Mercenários Oníricos e Nócnam Mur',
        content: `<h2>Exércitos de Necromancia e Pesadelo</h2>
<p>Criados a partir de cadáveres de guerreiros fundidos com energia de soldados do pesadelo, os mercenários preservam armaduras militares e armas pesadas:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KLancOni230AA]{Lanceiro Onírico (ND 2)}</strong></li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KGineOni230AA]{Ginete Onírico (ND 3)}</strong></li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KSargOni230AA]{Sargento Onírico (ND 4)}</strong></li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KTeneOni230AA]{Tenente Onírico (ND 6)}</strong></li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KNocnMur230AA]{Nócnam Mur, o Pesadelo Amalgamado (ND 18)}:</strong> Galokk reanimado e general implacável dotado de quatro tentáculos-cauda de alcance 6m e CD 47 em seus terrores.</li>
</ul>`
      }
    ]
  },

  // =========================================================================
  // 2. AVENTURA: A CORRIDA BRUTAL (DB #230)
  // =========================================================================
  {
    id: 'jCorridaBrut230A',
    name: 'Aventura: A Corrida Brutal (DB #230)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        name: 'Premissa & Preparação em Tyrondir',
        content: `<h2>Breves Jornadas: A Corrida Brutal</h2>
<p><em>Por Daniel Duran. Para 4 personagens de 9º nível em Tormenta20.</em></p>
<p>Nas planícies áridas e ravinas rochosas das Ruínas de Tyrondir, clãs goblinóides e pilotos mercenários disputam a temida Corrida Brutal. Veículos armados com aríetes, montarias jurássicas e arcanismos colidem em uma competição onde vencer é sinônimo de sobreviver.</p>`
      },
      {
        name: 'Cena 1 & 2: O Paddock e Rotsheel',
        content: `<h2>O Encontro com a Hobgoblin</h2>
<p>Ao investigarem os boxes improvisados, os heróis encontram <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KPRotsheel230]{Parceira: Rotsheel}</strong> deitada sobre a imponente <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KCarruagem230]{Carruagem Duyshidakk}</strong>. Tendo perdido sua equipe anterior para os ataques traiçoeiros de Gaardak, ela aceita aliar-se aos aventureiros como piloto veterana em troca de proteção mútua e vingança nas pistas.</p>`
      },
      {
        name: 'Cena 3: A Largada e Concorrentes',
        content: `<h2>A Bandeirada Inicial e Concorrentes</h2>
<p>A corrida utiliza as regras de perseguição e veículos de <em>Heróis de Arton</em> (p. 241). Os principais competidores são:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KGaarda230AAA]{Gaardak (ND 8)}:</strong> Bugbear furioso capaz de manobras de choque e arremesso de azagaias (+20 na corrida).</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KGobGorl230AA]{Três Goblins em um Gorlogg (ND 7)}:</strong> Krigg, Progg e Nregg disparando barragens de bombas alquímicas (+16 na corrida).</li>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KArzak230AAAA]{Arzak (ND 8)}:</strong> Assassino hobgoblin silencioso com seu <em>kum’shrak eviscerador</em> (+18 na corrida).</li>
  <li><strong>Dok:</strong> Inventor kliren e sua aranha-golem a vapor (+16 na corrida).</li>
  <li><strong>Pottak:</strong> Piloto aeronauta goblin em seu ornitóptero (+14 na corrida).</li>
</ul>`
      },
      {
        name: 'Cena 4: Vitória Inglória e o Lodo Negro',
        content: `<h2>O Ataque dos Sacerdotes Caídos</h2>
<p>Ao se aproximarem da linha de chegada, a celebração é interrompida por colunas de fumaça e gritos de massacre. Fanáticos bugbears devotados a Ragnar atacam o acampamento:</p>
<ul>
  <li><strong>@UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KSaceCai230AA]{Sacerdote Caído (ND 5)}:</strong> Quatro cultistas armados com foices negras e drenos de vitalidade.</li>
  <li><strong>Poças de Lodo Negro:</strong> Áreas de 3m de lado de substância profana. Entrar em contato exige Fortitude CD 35 ou perda de 10d12 PV (falha pode reduzir diretamente a –10 PV).</li>
</ul>`
      },
      {
        name: 'Epílogo & Recompensas',
        content: `<h2>O Machado do Campeão</h2>
<p>Pela bravura ao defender o acampamento e expurgar o culto nefando de Ragnar, os personagens são coroados campeões unânimes da corrida.</p>
<p>Eles recebem o formidável <strong>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.gq8KMachadoT230A]{Machado do Campeão de Tyrondir}</strong> (3d6 corte, 19/x3) e avançam diretamente para o <strong>10º nível</strong> de personagem.</p>`
      }
    ]
  }
];

async function injectJournals() {
  console.log('=== Injetando Diários da DB #230 em Diarios_T20 ===\n');
  const db = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  for (const j of DB230_JOURNALS) {
    const journalId = j.id;
    const pages = [];
    const embeddedDocs = [];

    // Limpa páginas anteriores para evitar órfãs
    for await (const [oldKey] of db.iterator({ gte: `!journal.pages!${journalId}.`, lte: `!journal.pages!${journalId}.\uffff` })) {
      await db.del(oldKey);
    }

    for (let i = 0; i < j.pages.length; i++) {
      const p = j.pages[i];
      const pageId = generateId();
      const pageDoc = {
        _id: pageId,
        name: p.name,
        type: 'text',
        title: { show: true, level: 1 },
        text: {
          content: p.content,
          markdown: '',
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
      pages.push(pageDoc);
      embeddedDocs.push({
        key: `!journal.pages!${journalId}.${pageId}`,
        typePath: '!journal.pages!',
        doc: pageDoc
      });
    }

    const pageIds = pages.map(p => p._id);
    const journalDoc = {
      _id: journalId,
      name: j.name,
      pages: pageIds,
      folder: j.folder,
      sort: 750000,
      ownership: { default: 0 },
      flags: { tormenta20: { source: 'Dragão Brasil #230' } },
      _stats: statsHeader
    };

    await db.put(`!journal!${journalId}`, journalDoc);
    for (const ed of embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }

    saveToSourcePacks('Diarios_T20', journalDoc, embeddedDocs);
    console.log(`✓ Diário "${j.name}" injetado com ${pages.length} páginas.`);
  }

  await db.close();
  console.log('\n✅ Diários da DB #230 injetados com 100% de sucesso!');
}

if (require.main === module) {
  injectJournals().catch(err => {
    console.error('❌ Erro na injeção de diários DB #230:', err);
    process.exit(1);
  });
}

module.exports = { injectJournals };

#!/usr/bin/env node
/**
 * Injeção Canônica dos Diários da Dragão Brasil #229 em Diarios_T20
 *
 * Diários:
 * 1. Aventura: O Olho do Basilisco (DB #229) — 8 páginas com links @UUID e regras
 * 2. Cenário: Os Cães das Colinas - Prévia do Romance (DB #229) — 6 páginas de lore e heróis
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

const DB229_JOURNALS = [
  {
    id: 'JrnlOlhoBasilisco229',
    name: 'Aventura: O Olho do Basilisco (DB #229)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        name: 'Resumo da Aventura & Gancho',
        content: `<h2>O Olho do Basilisco</h2>
<p><em>Uma breve jornada nas Montanhas Sanguinárias para quatro personagens de 8º nível em Tormenta20. Por Daniel Duran. Arte por Gabriel Feitosa.</em></p>
<blockquote><p>"Arton é um mundo cheio de perigos e, ainda assim, as Montanhas Sanguinárias conseguem se destacar como uma das regiões mais hostis do continente."</p></blockquote>
<h3>Resumo da Trama</h3>
<p>Quando uma estranha estátua viva de pedra causa alvoroço nas ruas de Trag’Merah, os aventureiros descobrem que não se trata de um simples construto desgarrado, mas de uma pessoa cujo corpo foi petrificado pela maldição de uma <strong>euríade</strong> (medusa ancestral devotada a Megalokk). O fundador da lendária Guilda dos Caça-Monstros, <strong>Mon’han Galldo’han</strong>, oferece uma recompensa régia de <strong>T$ 5.000</strong> e prestígio na guilda para quem caçar o colossal <strong>Basilisco Ancestral (ND 9)</strong> e extrair seu olho, único elemento capaz de reverter a transformação.</p>
<h3>Estrutura da Sessão</h3>
<p>A aventura é estruturada para uma sessão completa e pode ser inserida facilmente em qualquer campanha em curso no Reinado ou nos ermos montanhosos.</p>`
      },
      {
        name: 'Cena 1: Altas Confusões em Trag’Merah',
        content: `<h3>Cena 1: Altas Confusões em Trag’Merah</h3>
<p>A imensa ossada no horizonte de Trag’Merah saúda caçadores e exploradores. Servindo de sede da Guilda Mon’han, a cidade vive do comércio de carcaças, troféus e equipamentos de caça. Em meio ao vaivém de mercadores, barracas são derrubadas por uma figura cinzenta empunhando espada e escudo: à primeira vista uma estátua, mas viva e em movimento desorientado.</p>
<blockquote><p>"O monstro não parece atacar por maldade: seus olhos opacos transmitem puro terror e confusão descontrolada!"</p></blockquote>
<p><strong>Encontro:</strong> @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KDefRoch229A]{Defensor Rochoso Desperto (ND 8)}.</p>
<p><strong>Resolução Pacífica:</strong> No início de cada turno, teste de <em>Intuição (CD 20)</em>. Vencer em dois testes de <em>Diplomacia</em> opostos à Vontade (+15) ou lançar a magia <em>Tranquilidade</em> com aprimoramento encerra o combate sem baixas.</p>`
      },
      {
        name: 'Cena 2: Coração Empedrado',
        content: `<h3>Cena 2: Coração Empedrado</h3>
<p>Acalmado, o defensor rochoso comunica-se por gestos rudimentares. Um teste de <em>Intuição (CD 20)</em> revela que ele já foi humano e foi petrificado durante uma expedição. Um teste de <em>Investigação (CD 20)</em> descobre que seu antigo grupo buscava uma <strong>euríade</strong>.</p>
<p><strong>Teste Estendido de Investigação/Diplomacia (CD 25, 3 sucessos):</strong> Revela que euríades são medusas monstruosas leais a Megalokk que transformam suas vítimas em defensores rochosos sob seu domínio. Esta criatura, porém, quebrou o elo mental e preserva seu livre-arbítrio.</p>`
      },
      {
        name: 'Cena 3: Contrato de Caça',
        content: `<h3>Cena 3: Contrato de Caça</h3>
<p>O lendário fundador da Guilda dos Caça-Monstros, o kliren <strong>Mon’han Galldo’han</strong>, convoca os heróis ao quartel-general. Ele revela o esboço de um monstro colossal: o <strong>Basilisco Ancestral</strong>.</p>
<blockquote><p>"Um basilisco ancestral, maior e mais violento que qualquer outro nos ermos! Tragam seu olho e desfaremos o feitiço da sua amiga de pedra. Além disso, a caçada vale T$ 5.000 e as portas da guilda abertas!" — Mon’han Galldo’han</p></blockquote>
<p>O kliren entrega um mapa rústico marcando as ravinas pantanosas nas profundezas das Sanguinárias.</p>`
      },
      {
        name: 'Cena 4: Rastros nas Sanguinárias',
        content: `<h3>Cena 4: Rastros nas Sanguinárias</h3>
<p>Rastrear o ninho da fera requer navegar desfiladeiros traiçoeiros. Isso constitui um <strong>Teste Estendido de Sobrevivência (CD 25, 5 sucessos)</strong>, onde cada rolagem representa um dia de marcha. Falhas causam perda de 2d6 PV para todos.</p>
<p>A cada dia, role 1d6 na @UUID[Compendium.compendios-para-t20.Tabelas_T20.RollTable.TbEncontrosSang229]{Tabela de Encontros nas Montanhas Sanguinárias}:</p>
<ul>
<li><strong>1) Escalada Perigosa:</strong> 3 testes de Atletismo CD 25. Queda causa 3d6 PV + 3d6 por sucesso anterior.</li>
<li><strong>2) Ninho Vazio:</strong> 1d4 ovos de grifo. Podem eclodir como @UUID[Compendium.compendios-para-t20.Itens_T20.Item.heA8oQwmkuwDszHV]{Parceiro: Filhote de Grifo}.</li>
<li><strong>3) Revoada de Serpes:</strong> Ataque em rasante de @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KRevSerp229A]{Revoada de Serpes (ND 8)}.</li>
<li><strong>4) Peregrinação Druida:</strong> Devotas da Mãe Jaguar concedem descanso superior e curam 4d8+4 PV.</li>
<li><strong>5) Kemooz Pensativo:</strong> Gênio da terra ancestral. 3 testes de Diplomacia opostos a Vontade (+15) o convencem a servir como @UUID[Compendium.compendios-para-t20.Itens_T20.Item.vBMc9AAxnTi4LYqZ]{Parceiro: Kemooz Pensativo}.</li>
<li><strong>6) Rastejante Voraz:</strong> Centopeia-dragão escava sob os pés dos personagens.</li>
</ul>`
      },
      {
        name: 'Cena 5: Presas Peçonhentas',
        content: `<h3>Cena 5: Presas Peçonhentas</h3>
<p>Na última noite antes de atingirem a ravina pantanosa, cultistas fanáticos que misturam ritos de Megalokk e Sszzaas cercam o acampamento nas sombras.</p>
<p><strong>Encontro:</strong> Quatro cultistas @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KPreBas229A]{Presa do Grande Basilisco (ND 3)} atacam de surpresa em flanco.</p>
<blockquote><p>"Atenção: as lâminas untadas com @UUID[Compendium.compendios-para-t20.Itens_T20.Item.TCMrwRlPK87zGYMd]{Peçonha Concentrada} curam os próprios cultistas em vez de feri-los graças à sua Vitalidade Peçonhenta!"</p></blockquote>`
      },
      {
        name: 'Cena 6: Predador Predado',
        content: `<h3>Cena 6: Predador Predado</h3>
<p>A ravina profunda assemelha-se a um cemitério gótico esculpido em calcário: carcaças petrificadas de gigantes, mantícoras e serpes atestam a proximidade do monstro.</p>
<p><strong>Abordagem Tática:</strong> Um teste de <em>Sobrevivência (CD 25)</em> e <em>Furtividade</em> oposta à Percepção permite surpreender o monstro no primeiro turno.</p>
<p><strong>Clímax:</strong> Confronto com o terrível @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.gq8KBasAnc229A]{Basilisco Ancestral (ND 9)}.</p>
<p><strong>Despojos e Recompensas:</strong></p>
<ul>
<li>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.A7XXqzcilQFS6Nh9]{Olho de Basilisco Ancestral} (Sobrevivência CD 24 ou Cura CD 30 para extrair).</li>
<li>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.uCGImb2DmCZfW42N]{Couro de Basilisco Ancestral} (matéria-prima superior avaliada em T$ 2.000).</li>
<li>@UUID[Compendium.compendios-para-t20.Itens_T20.Item.4XKmGHsOYphYdf2h]{Peçonha Potente} (2d4 doses de veneno letal).</li>
</ul>`
      },
      {
        name: 'Epílogo: Pedra em Carne',
        content: `<h3>Epílogo: Pedra em Carne</h3>
<p>De volta a Trag’Merah, os aventureiros são ovacionados pelos caçadores da Guilda Mon’han e recebem a recompensa de <strong>T$ 5.000</strong>.</p>
<p>No ritual público, o olho do basilisco é esmagado sobre o crânio do construto: a seiva verde esmeralda dissolve o granito, restaurando a jovem aventureira à sua forma biológica original. Ela manifesta sua gratidão eterna e passa a atuar como aliada do grupo.</p>
<blockquote><p>"Ao longe, sobre os picos nevoentos, uma silhueta de mulher-serpente com corpo de lagarto quadrúpede sorri friamente com presas afiadas... a euríade matriarca sabe quem derrotou seu mascote."</p></blockquote>
<p><strong>Conclusão:</strong> Os heróis sobem para o <strong>9º nível</strong>!</p>`
      }
    ]
  },
  {
    id: 'JrnlCaesColinas229',
    name: 'Cenário: Os Cães das Colinas (DB #229)',
    folder: FOLDER_LIVROS,
    pages: [
      {
        name: 'O Novo Romance de Denise Flaibam',
        content: `<h2>Os Cães das Colinas</h2>
<p><em>Uma prévia do novo romance de Tormenta20 por Denise Flaibam, derivado da aclamada campanha Fim dos Tempos.</em></p>
<p>Nascido nas mesas de transmissão da Twitch da Jambô, o grupo conhecido como <strong>Os Cães das Colinas</strong> reúne figuras improváveis que desafiaram seus destinos para lutar pela liberdade e redenção nas Colinas Centrais de Zakharov. Nesta edição da Dragão Brasil #229, os cinco protagonistas são apresentados com seus arquétipos oficiais de <strong>Parceiros Especiais</strong> para mestres e jogadores de Tormenta20.</p>`
      },
      {
        name: 'Arius Gorgonius Dubitatius',
        content: `<h3>Arius Gorgonius Dubitatius, o Minotauro Filósofo</h3>
<p>Nascido na nobreza táurica de Tiberus e filho do influente senador Glavus Gorgonius, Arius rejeitou o militarismo cego para consagrar sua vida à verdade e à deusa <strong>Tanna-Toh</strong>. Munido de erudição ímpar e de uma postura contemplativa que contrasta com sua compleição imponente, ele prova que as ideias e as palavras são mais poderosas do que o ferro.</p>
<p><em>Ficha de Parceiro: @UUID[Compendium.compendios-para-t20.Itens_T20.Item.7fXXbH9usmth8bMe]{Parceiro: Arius Gorgonius Dubitatius}.</em></p>`
      },
      {
        name: 'Aylarianna Purpúrea (Ayla)',
        content: `<h3>Aylarianna Purpúrea (Ayla), a Fada Mais Honesta de Arton</h3>
<p>Delicada e astuta, Ayla transformou sua aparência inofensiva em sua maior arma de sobrevivência comercial. Criadora do revolucionário <strong>Empório Purpúrea</strong> (uma estrutura comercial de "funil invertido"), viaja vendendo poções miraculosas e preparados alquímicos, sempre acompanhada de um sorriso irresistível e soluções heterodoxas.</p>
<p><em>Ficha de Parceira: @UUID[Compendium.compendios-para-t20.Itens_T20.Item.lO9YvTIyEqsmyUT8]{Parceira: Aylarianna Purpúrea (Ayla)}.</em></p>`
      },
      {
        name: 'Ignis Crae',
        content: `<h3>Ignis Crae, Paladino de Thyatis e Fundador da Ordem da Redenção</h3>
<p>Construído pelo mestre inventor Austerion Victtus, o golem de metal e fogo foi tocado no instante de seu despertar pelas chamas eternas de <strong>Thyatis</strong>. Abraçando a sagrada missão de conceder segundas chances e proteger os mortais contra injustiças, Ignis personifica a muralha inabalável da fé e do sacrifício.</p>
<p><em>Ficha de Parceiro: @UUID[Compendium.compendios-para-t20.Itens_T20.Item.N5PbJ86ouA83AIth]{Parceiro: Ignis Crae}.</em></p>`
      },
      {
        name: 'Kir’zanaath Odello (Kiki)',
        content: `<h3>Kir’zanaath Odello (Kiki), a Medusa Barda</h3>
<p>Trovadora talentosa que oculta sua natureza de medusa sob capuzes e canções alegres, Kiki busca desvendar o desaparecimento de sua mãe. Unindo dotes culinários, carisma arrebatador e um talento investigativo cirúrgico para "ler" as pessoas, ela é o coração e a mente investigativa do grupo.</p>
<p><em>Ficha de Parceira: @UUID[Compendium.compendios-para-t20.Itens_T20.Item.eD2XJH2Xzs0pXwk1]{Parceira: Kir’zanaath Odello (Kiki)}.</em></p>`
      },
      {
        name: 'Rexthor',
        content: `<h3>Rexthor, o Campeão do Abismo</h3>
<p>Sobrevivente brutal das arenas sanguinárias de Wynlla, Rexthor conquistou sua liberdade em uma aposta impossível no labirinto do Abismo. Guiado pela confiança cega nas Deusas da Sorte, do Azar e do Caos (Nimb), este guerreiro feroz e leal encara cada batalha com instinto predatório inigualável.</p>
<p><em>Ficha de Parceiro: @UUID[Compendium.compendios-para-t20.Itens_T20.Item.JI4lGueF8aMSruWC]{Parceiro: Rexthor}.</em></p>`
      }
    ]
  }
];

async function injectJournals() {
  console.log('=== Injetando Diários da DB #229 em Diarios_T20 ===\n');
  const db = new ClassicLevel(PACK_JOURNALS, { valueEncoding: 'json' });

  for (const j of DB229_JOURNALS) {
    const journalId = j.id;
    const pages = [];
    const embeddedDocs = [];

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
        ownership: { default: 0 },
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

    const journalDoc = {
      _id: journalId,
      name: j.name,
      pages,
      folder: j.folder,
      sort: 700000,
      ownership: { default: 0 },
      flags: { tormenta20: { source: 'Dragão Brasil #229' } },
      _stats: statsHeader
    };

    await db.put(`!journal!${journalId}`, journalDoc);
    for (const p of pages) {
      await db.put(`!journal.pages!${journalId}.${p._id}`, p);
    }
    saveToSourcePacks('Diarios_T20', journalDoc, embeddedDocs);
    console.log(`✓ Diário "${j.name}" salvo com ${pages.length} páginas em Diarios_T20.`);
  }

  await db.close();
  console.log('\n✅ Todos os diários da DB #229 injetados com sucesso.');
}

if (require.main === module) {
  injectJournals().catch(err => {
    console.error('Erro ao injetar diários:', err);
    process.exit(1);
  });
}

module.exports = { injectJournals };

#!/usr/bin/env node
/**
 * Injeção Canônica dos Diários da Dragão Brasil #228 em Diarios_T20
 * - Aventura: Emergir Monstruoso (Subterrâneos de Trebuck) - 8 páginas
 * - Cenário: Divinas Organizações (20 Organizações Religiosas de Arton) - 11 páginas
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { generateId } = require('./create-entry');

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'piAgentTormenta20'
};

const DB228_JOURNALS = [
  {
    name: 'Aventura: Emergir Monstruoso (DB #228)',
    folder: 'GTXWZvyrw7KEEBbp',
    pages: [
      {
        name: 'Resumo da Aventura & Gancho',
        content: `<h2>Emergir Monstruoso</h2>
<p><em>Uma breve jornada para personagens de 8º nível nos subterrâneos de Trebuck.</em></p>
<blockquote><p>"O chão treme sob nossos pés não pela fúria dos deuses, mas pelas mandíbulas que devoram as pedras do baronato." — Barão Valcanti</p></blockquote>
<h3>Resumo da Trama</h3>
<p>Rumores de tremores e desaparecimentos assolam as fazendas do sul dos Feudos de Trebuck. O Barão Valcanti convoca heróis experientes para investigar o que parece ser uma infestação monstruosa vinda das profundezas da terra. O que começa como uma busca por túneis desmoronados logo se revela a caçada a um predador territorial colossal: o temível <strong>Ankthyr (ND 8)</strong> e seus ninhos de <strong>Enxames Cáusticos (ND 4)</strong>.</p>
<h3>Preparação</h3>
<p>A aventura é ideal para 4 a 5 heróis de 8º nível e pode ser conectada a qualquer campanha em andamento no Reinado.</p>`
      },
      {
        name: 'Cena 1 & 2: A Audiência e os Feudos',
        content: `<h3>Cena 1: O Chamado do Barão</h3>
<p>Os heróis são recebidos na mansão fortificada do Barão Valcanti. O nobre oferece <strong>T$ 3.000</strong> e o apoio logístico da região para quem descer aos túneis e erradicar a fonte dos tremores antes que as plantações de cevada e cereais sejam destruídas.</p>
<h3>Cena 2: Rumo à Vila Abalada</h3>
<p>A viagem de um dia leva os personagens até a vila de Passo da Colina, onde casebres apresentam rachaduras profundas nas paredes e moradores apavorados se recusam a dormir em suas camas de alvenaria.</p>`
      },
      {
        name: 'Cena 3: O Celeiro Devastado',
        content: `<h3>Cena 3: A Primeira Fenda</h3>
<p>Ao investigar o celeiro da fazenda principal, os aventureiros encontram um buraco circular de quase 3 metros de diâmetro escavado na terra batida, com bordas derretidas por uma substância ácida que fumega suavemente.</p>
<blockquote><p>"O que quer que tenha entrado aqui não cavou com pás. O ferro da tranca derreteu como cera quente." — Burgomestra Elenor</p></blockquote>
<p>Um teste de <strong>Sobrevivência ou Investigação (CD 20)</strong> revela marcas de patas finas e múltiplos apêndices quitinosos indicando a descida do monstro.</p>`
      },
      {
        name: 'Cena 4: Em um Buraco no Chão',
        content: `<h3>Cena 4: A Descida às Trevas</h3>
<p>Os personagens se embrenham pela rede de túneis recém-abertos. A descida íngreme exige testes de <strong>Atletismo ou Acrobacia (CD 15)</strong> para evitar quedas e danos de impacto. O ar é pesado, úmido e impregnado de um cheiro acre de enxofre e ácido sulfúrico.</p>`
      },
      {
        name: 'Cena 5: A Emboscada dos Slarks',
        content: `<h3>Cena 5: Habitantes das Profundezas</h3>
<p>Nas galerias intermediárias, criaturas humanoides pálidas de olhos leitosos atacam de posições elevadas nas estalactites. Trata-se de um bando de <strong>Slarks (ND 1)</strong> que usam sua tática de queda livre e cuspe cegante para desorientar o grupo.</p>
<p><em>Consulte a ficha canônica de @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.slark_db228]{Slark (ND 1)} no compêndio de Ameaças.</em></p>`
      },
      {
        name: 'Cena 6: O Ninho Cáustico',
        content: `<h3>Cena 6: O Coração da Infestação</h3>
<p>Ao penetrarem numa câmara circular ampla repleta de casulos e secreções ácidas, milhares de larvas e filhotes insetoides emergem em ondas devoradoras, formando um <strong>Enxame Cáustico (ND 4)</strong> que engolfa a área.</p>
<p><em>Consulte a ficha de @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.enxame_caustico_db228]{Enxame Cáustico (ND 4)}.</em></p>`
      },
      {
        name: 'Cena 7: O Colapso e a Vingança do Ankthyr',
        content: `<h3>Cena 7: O Desabamento dos Túneis</h3>
<p>Com o ninho ameaçado, a criatura mãe colossal começa a golpear os pilares de sustentação da caverna para soterrar os invasores. Os personagens devem superar o <strong>Desabamento dos Túneis (ND 8)</strong> acumulando sucessos para escapar à superfície antes da 7ª rodada.</p>
<h3>O Confronto Final: Ankthyr</h3>
<p>Na superfície, nos arredores da vila abalada, a terra se parte e emerge o gigantesco <strong>Ankthyr (ND 8)</strong> em fúria mortal, desferindo botes subterrâneos e jorros de cuspe corrosivo.</p>
<p><em>Consulte as fichas de @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.ankthyr_db228]{Ankthyr (ND 8)} e do perigo @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.desabamento_tuncis_db228]{Desabamento dos Túneis (ND 8)}.</em></p>`
      },
      {
        name: 'Epílogo: Recompensas e Desdobramentos',
        content: `<h3>Epílogo: Celebrando a Vitória</h3>
<p>Com a carapaça do Ankthyr estirada na praça, a população de Passo da Colina celebra a salvação de suas colheitas. Os personagens recebem a recompensa prometida pelo Barão Valcanti (T$ 3.000 mais itens forjados a partir da carapaça de Ankthyr) e avançam para o <strong>9º nível de personagem</strong>.</p>`
      }
    ]
  },
  {
    name: 'Cenário: Divinas Organizações (DB #228)',
    folder: 'GTXWZvyrw7KEEBbp',
    pages: [
      {
        name: 'Introdução: Fumaça, Fé e Segredos',
        content: `<h2>Divinas Organizações de Arton</h2>
<p><em>Por José Cerqueira, com participação de J.M. Trevisan, Tiago Orib e Miguel Souza.</em></p>
<blockquote><p>"Nem toda devoção aos vinte deuses se manifesta em templos de mármore e pregações dominicais. Nos becos escuros, caravanas nômades e guildas secretas, a fé toma formas que desafiam o entendimento dos bispos e sacerdotes formais."</p></blockquote>
<p>Este suplemento apresenta <strong>20 organizações religiosas exóticas</strong> dedicadas às divindades do Panteão de Arton, cada uma acompanhada de ganchos de aventura e um novo elemento mecânico exclusivo (itens mágicos, poderes de destino, parceiros e magias).</p>`
      },
      {
        name: 'Megalokk & Wynna',
        content: `<h3>1. Arautos do Destruidor (Megalokk)</h3>
<p>Grupo de caçadores e devotos primitivos que acompanham o rastro de monstros colossais em Arton, preparando caminhos para a predação primordial.</p>
<p><strong>Item Mágico:</strong> <em>Arco dos Arautos</em> (Arco longo cruel preciso caçador com Marca da Presa).</p>
<hr>
<h3>2. Caravana das Três Chamas (Wynna)</h3>
<p>Uma universidade itinerante de magia composta por carroças coloridas e conjuradores nômades dedicados a espalhar os mistérios arcanos.</p>
<p><strong>Novo Poder de Destino:</strong> <em>Certificado de Conclusão</em> (+1 PM e magia de suporte sem aprimoramentos).</p>`
      },
      {
        name: 'Khalmyr & Sszzaas',
        content: `<h3>3. Casa dos Desgarrados (Khalmyr)</h3>
<p>Tribunal altruísta e reformatório que acolhe criminosos e desesperados, oferecendo julgamentos justos onde a retribuição se converte em reabilitação moral.</p>
<p><strong>Novo Parceiro:</strong> <em>Reabilitador</em> (Juiz sagrado contratado por T$ 1.000 para atuar como mediador e guardião).</p>
<hr>
<h3>4. Claviculário / Círculo das Chaves (Sszzaas)</h3>
<p>Irmandade secreta de mestres de chaves e arrombadores que utilizam fechaduras como metáforas para as intrigas mais profundas dos reinos.</p>
<p><strong>Item Mágico:</strong> <em>Chave Mestra</em> (Acessório médio de T$ 25.500 concedendo sucesso automático para destrancar).</p>`
      },
      {
        name: 'Valkaria & Azgher',
        content: `<h3>5. Companhia Teatral Valluk Delsori (Valkaria)</h3>
<p>Trupa de dramaturgos audaciosos que encena peças satíricas e revolucionárias em praças públicas de cidades opressoras.</p>
<p><strong>Item Mágico:</strong> <em>Bilhete de Valluk Delsori</em> (Ingresso mágico de metamorfose temporária em heróis famosos de Arton).</p>
<hr>
<h3>6. Confraria Dourada (Azgher)</h3>
<p>Irmandade de devotos mascarados que patrulham rotas comerciais no Deserto da Perdição e punem contrabandistas que burlam o tributo solar.</p>
<p><strong>Item Mágico:</strong> <em>Máscara do Sol Dourado</em> (+10 em Ladinagem para seguir preceitos e -2 em Furtividade).</p>`
      },
      {
        name: 'Aharadak & Allihanna',
        content: `<h3>7. Crianças de Aharadak (Aharadak)</h3>
<p>Seita clandestina de jovens e rebeldes que encontram na matéria vermelha e nas aberrações lefeu uma falsa promessa de libertação da dor existencial.</p>
<p><strong>Item Mágico:</strong> <em>Pingente Rubro</em> (Reduz a perda de PM causada por efeitos da Tormenta em -1 PM por patamar).</p>
<hr>
<h3>8. Fadas do Jardim Secreto (Allihanna)</h3>
<p>Círculo de druidas e seres feéricos que resguardam bosques esquecidos no norte dos Feudos de Trebuck contra invasões madeireiras e corrupção lefeu.</p>
<p><strong>Novo Parceiro:</strong> <em>Allihennali</em> (Parceiro feérico curador: 2d6 PV por 1 PM e redução de custos mágicos).</p>`
      },
      {
        name: 'Kallyadranoch & Lin-Wu',
        content: `<h3>9. Herdeiros da Escama (Kallyadranoch)</h3>
<p>Aristocratas e guerreiros que afirmam carregar sangue dracônico puro e colecionam relíquias ancestrais das eras do poder réptil.</p>
<p><strong>Item Geral:</strong> <em>Alma de Dragão</em> (Pedra translúcida que reduz dano elemental em um dado como reação).</p>
<hr>
<h3>10. Hoshikage (Lin-Wu)</h3>
<p>Clã de espiões e guardiões honrados de Tamu-ra que atuam nos bastidores para preservar a dignidade de trabalhadores oprimidos.</p>
<p><strong>Novo Parceiro:</strong> <em>Guaxininjas</em> (Capangas invocáveis por ação de movimento e 2 PM para flanquear e desarmar).</p>`
      },
      {
        name: 'Oceano & Arsenal',
        content: `<h3>11. Hoste Naufragista (Oceano)</h3>
<p>Flotilha pirata de devotos do Deus dos Mares que não saqueia ouro, mas sim oferendas cerimoniais para alimentar as correntes abissais.</p>
<p><strong>Item Mágico:</strong> <em>Âncora Naufragista</em> (Pingente que concede natação, bônus em Pilotagem e resistência elemental mediante tributo de T$ 100).</p>
<hr>
<h3>12. Lança Silente (Keenn / Arsenal)</h3>
<p>Companhia de mercenários estóicos que veneram a guerra absoluta e jamais pronunciam palavras durante marchas e batalhas.</p>
<p><strong>Item Mágico:</strong> <em>Arma Silente</em> (Arma de adamante certeira equilibrada formidável de T$ 31.000 concedendo +5 em Guerra e Conhecimento).</p>`
      },
      {
        name: 'Tanna-Toh & Marah',
        content: `<h3>13. Memorialistas (Tanna-Toh)</h3>
<p>Escribas peregrinos dedicados a registrar bibliotecas em chamas e testemunhar momentos cruciais da história antes que sejam apagados pelo tempo.</p>
<p><strong>Nova Magia:</strong> <em>Memorizar Conhecimento</em> (Universal 2, grava cenas na mente para +5 em testes de informação).</p>
<hr>
<h3>14. Os Mestres de Cerimônia (Marah)</h3>
<p>Animadores, músicos e diplomatas festivos que organizam bailes e festivais para apaziguar conflitos bélicos entre nobres rivais.</p>
<p><strong>Item Geral:</strong> <em>Cítola da Paz</em> (Instrumento musical que reduz o custo de Inspiração em -1 PM e fornece +5 em testes para mudar atitude).</p>`
      },
      {
        name: 'Hyninn & Lena',
        content: `<h3>15. Passagem Vulpina (Hyninn)</h3>
<p>Sindicato de ladrões exploradores que mapeia rotas secretas de fuga e armadilhas em complexos subterrâneos e tumbas esquecidas.</p>
<p><strong>Poder Concedido:</strong> <em>Percepção de Masmorra</em> (1/cena sucesso automático para encontrar armadilhas no subterrâneo).</p>
<hr>
<h3>16. Parteiras das Mandíbulas (Lena)</h3>
<p>Curandeiras selvagens que viajam às regiões mais perigosas de Arton para assistir o nascimento seguro de criaturas ameaçadas e povos bárbaros.</p>
<p><strong>Item Geral:</strong> <em>Rosário da Vida</em> (Aumenta o volume de cura mágica em +1 dado do mesmo tipo por patamar de personagem).</p>`
      },
      {
        name: 'Valkaria & Tenebra',
        content: `<h3>17. Peregrinos das Lágrimas (Valkaria)</h3>
<p>Inventores e exploradores obstinados em rastrear os lendários fragmentos conhecidos como as Lágrimas da Deusa da Ambição.</p>
<p><strong>Item Mágico:</strong> <em>Bússola das Lágrimas</em> (Protótipo sensível à presença de emanações mágicas e relíquias divinas).</p>
<hr>
<h3>18. Rastro da Pólvora (Tenebra)</h3>
<p>Corsários da noite e atiradores clandestinos que operam no submundo utilizando pistolas e bacamartes protegidos por cartas de corso profanas.</p>
<p><strong>Item Mágico:</strong> <em>Corso Sombrio</em> (Carta que legaliza o porte de armas de fogo no Reinado enquanto sob os preceitos de Tenebra).</p>`
      },
      {
        name: 'Thyatis & Nimb',
        content: `<h3>19. Vigília das Segundas Chances (Thyatis)</h3>
<p>Irmandade de socorristas e clérigos que resgatam aventureiros tombados nas portas da morte, oferecendo uma nova chance de redenção.</p>
<p><strong>Poder de Destino:</strong> <em>Previdência da Vigília</em> (Concede o Dom da Imortalidade na primeira morte da campanha mediante juramento).</p>
<hr>
<h3>20. Zoyrak (Nimb)</h3>
<p>Artistas de rua caóticos, grafiteiros e pirotécnicos que pintam murais provocativos e jogam bombas de tinta em monumentos solenes.</p>
<p><strong>Item Geral:</strong> <em>Bomba de Tinta</em> (Granada de 6m de raio simulando Área Escorregadia e impondo a condição Lento).</p>`
      }
    ]
  }
];

async function main() {
  console.log('=== Injetando Diários de Bordo da DB #228 em Diarios_T20 ===\n');
  const db = new ClassicLevel('packs/Diarios_T20', { valueEncoding: 'utf8' });
  await db.open();

  let totalPages = 0;
  for (const j of DB228_JOURNALS) {
    const journalId = generateId();
    const pageIds = [];

    let pIndex = 1;
    for (const page of j.pages) {
      const pageId = generateId();
      pageIds.push(pageId);

      const pageDoc = {
        _id: pageId,
        name: page.name,
        type: 'text',
        title: { show: true, level: 1 },
        text: { content: page.content, format: 1 },
        image: {},
        video: { controls: true, volume: 1 },
        src: null,
        system: {},
        sort: pIndex * 100000,
        ownership: { default: -1 },
        flags: {},
        _stats: statsHeader
      };

      await db.put(`!journal.pages!${journalId}.${pageId}`, JSON.stringify(pageDoc));
      pIndex++;
      totalPages++;
    }

    const journalDoc = {
      _id: journalId,
      name: j.name,
      pages: pageIds,
      folder: j.folder,
      sort: 600000,
      ownership: { default: 0 },
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!journal!${journalId}`, JSON.stringify(journalDoc));
    console.log(`✓ Diário "${j.name}" injetado com ${pageIds.length} páginas.`);
  }

  await db.close();
  console.log(`\n✅ Sucesso: 2 diários e ${totalPages} páginas injetados em Diarios_T20.`);
}

main().catch(err => {
  console.error('Erro ao injetar diários:', err);
  process.exit(1);
});

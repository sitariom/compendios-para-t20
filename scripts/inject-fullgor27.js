#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 27: Dia e Noite
 *
 * Compêndios Alvo:
 * 1. Ameacas_T20: 6 Ameaças e NPCs canônicos (Cassiella semi-fullgori ND 7, Cassiella fullgori ND 8,
 *    Enxame Trog ND 5, Troggore ND 3, Bando Troggore ND 5, Urrash das Sombras Frias ND 5)
 * 2. Itens_T20: 6 Itens canônicos (Orbe de Azgher, Parceiro Cassiella, Armadura Completa Delicada Selada,
 *    Escudo Pesado Reforçado, Espada Longa Pungente, Lança Troggore)
 * 3. Diarios_T20: Diário oficial com 6 páginas estruturadas sob !journal.pages!
 * 4. Tabelas_T20: 3 Tabelas de Rolagem (1d6, 1d8, 1d6) com resultados sob !tables.results!
 * 5. Macros_T20: Macro de canalização da Orbe de Azgher
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const fs = require('fs');
const {
  buildSkills,
  buildTracos,
  buildWeaponAttack,
  buildSpecialPower,
  buildSpellItem,
  buildNpcActor,
  saveToSourcePacks
} = require('./create-entry');

const PACKS_DIR = path.join(__dirname, '..', 'packs');
const SRC_PACKS_DIR = path.join(__dirname, '..', 'src', 'packs');

const FOLDER_AMEACAS = 'n591wfGB7keSNe7I'; // Pasta "Fullgor dos Deuses" existente
const FOLDER_ITENS = 'fldItensFolder26';
const FOLDER_DIARIOS = 'fldDiariosFold26';
const FOLDER_TABELAS = 'fldTabelasFold26';
const FOLDER_MACROS = 'fldMacrosFolder26';

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'piAgentTormenta20'
};

// ============================================================================
// 1. AMEAÇAS & NPCS (Ameacas_T20)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças da Edição 27 em Ameacas_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await db.open();

  const threats = [];

  // 1. Cassiella semi-fullgori (ND 7)
  const casSemiAtr = { for: 5, des: 1, con: 3, int: 0, sab: 1, car: 1 };
  const casSemiSkills = buildSkills(7, casSemiAtr, {
    inic: 8,
    perc: 4,
    fort: 20,
    refl: 14,
    vont: 7,
    atle: 12,
    guer: 7,
    luta: 24
  });
  const casSemiTracos = buildTracos({
    tamanho: 'med',
    resistencias: { dano: 5 }
  });
  const casSemiItems = [
    buildWeaponAttack({
      name: 'Espada Longa Pungente',
      img: 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
      dano: '2d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada longa x2 +24 (2d8+10 corte, 19, mais 1d6 de luz).</p>'
    }),
    buildWeaponAttack({
      name: 'Escudo Pesado Reforçado',
      img: 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
      dano: '1d6+10',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Escudo pesado +24 (1d6+10 impacto).</p>'
    }),
    buildSpecialPower({
      name: 'Derrubar',
      img: 'systems/tormenta20/icons/poderes/classes/lutadores/rasteira.webp',
      ativacao: { execucao: 'free', custo: 0 },
      description: '<p>(Ação Livre) Quando acerta um ataque com escudo pesado, pode fazer um teste de derrubar como ação livre (teste +29).</p>'
    }),
    buildSpecialPower({
      name: 'Durão',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/durao.webp',
      ativacao: { execucao: 'reaction', custo: 0 },
      description: '<p>(Reação) Uma vez por rodada, quando sofre dano, Cassiella reduz este dano à metade.</p>'
    }),
    buildSpecialPower({
      name: 'Espada Luminosa',
      img: 'systems/tormenta20/icons/poderes/classes/paladinos/golpe-divino.webp',
      ativacao: { execucao: 'full', custo: 0 },
      description: '<p>(Ação Completa) Cassiella faz um ataque com sua espada longa contra todas as criaturas em alcance curto (faz um único teste de ataque e compara o resultado com a Defesa de cada inimigo na área). Se acertar, causa o dano do ataque mais +3d6 de luz, e todas as criaturas ficam ofuscadas por 1 rodada. Recarga (padrão).</p>'
    }),
    buildSpecialPower({
      name: 'Luz Sagrada',
      img: 'systems/tormenta20/icons/magias/luz.webp',
      ativacao: { execucao: 'standard', custo: 0 },
      description: '<p>(Ação Padrão) Cassiella pode fazer um objeto empunhado emitir luz como uma tocha (sem calor) ou criar uma luz forte que deixa todas as criaturas em alcance curto ofuscadas (Vontade CD 24 evita e torna a criatura imune a esta habilidade até o fim da cena).</p>'
    })
  ];

  threats.push({
    id: 'fld27CassiellaSe',
    name: 'Cassiella semi-fullgori',
    nd: '7',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (suraggel)',
    tamanho: 'med',
    deslocamento: '6m (4q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: casSemiAtr,
    attributes: {
      pv: { value: 280, max: 280 },
      pm: { value: 0, max: 0 },
      defesa: { value: 31, base: 30 } // 31 - 1 = 30
    },
    resistencias: casSemiTracos,
    resistenciasTexto: 'redução de dano 5',
    pericias: casSemiSkills,
    items: casSemiItems,
    ataquescac: 'Espada longa x2 +24 (2d8+10, 19, mais 1d6 de luz) e escudo pesado +24 (1d6+10)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/cassiella-semi-fullgori.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Eu não rezo para o sol. Eu luto com o que tenho: aço, sangue e a promessa de que não deixarei o fogo profano me transformar em monstro."<br /><span style="font-weight:bold;color:#800000">— Cassiella de Baldonn</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Guerreira imensa de armadura negra fosca. Quando desembainhou a lâmina, uma luz quente e dourada varreu os trogs, mas seus próprios olhos queimavam com agonia febril. Ela luta contra o inimigo de fora e o veneno que queima por dentro."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Cassiella de Baldonn</span> nasceu sob o fardo do sangue suraggel como descendente de anjos de Azgher, mas recusa templos e altares. Trajando armadura negra como que para renegar o céu, sente o Fullgor contaminar seu sangue divino, transformando seus cabelos outrora escuros em fios de ouro profano. Luta com disciplina e desespero para proteger o povo de Baldonn enquanto busca a Orbe de Azgher para conter a infecção.</p>`
  });

  // 2. Cassiella fullgori (ND 8)
  const casFullAtr = { for: 6, des: 2, con: 4, int: 0, sab: 1, car: -1 };
  const casFullSkills = buildSkills(8, casFullAtr, {
    inic: 10,
    perc: 9,
    fort: 21,
    refl: 15,
    vont: 8,
    atle: 14,
    guer: 8,
    luta: 26
  });
  const casFullTracos = buildTracos({
    tamanho: 'med',
    resistencias: {
      dano: 10,
      fogo: { imunidade: true },
      luz: { imunidade: true }
    },
    imunidadesCondicoes: ['critico', 'cansaco', 'metabolismo', 'metamorfose', 'paralisia']
  });
  const casFullItems = [
    buildWeaponAttack({
      name: 'Espada Longa Pungente',
      img: 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
      dano: '2d8+10',
      tipoDano: 'corte',
      periciaAtaque: 'luta',
      criticoMargem: 19,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Espada longa x2 +26 (2d8+10 corte, 19, mais 2d6 de luz).</p>'
    }),
    buildWeaponAttack({
      name: 'Azagaias Fullgori',
      img: 'systems/tormenta20/icons/itens/equipamentos/azagaia.webp',
      dano: '4d8+4',
      tipoDano: 'luz',
      periciaAtaque: 'pontaria',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'arremesso',
      tipo: 'arremesso',
      alcance: 'médio',
      description: '<p><strong>Ataque à Distância (Padrão):</strong> Cassiella projeta lanças de luz em duas criaturas em alcance médio, causando 4d8+4 pontos de dano de luz e deixando-as ofuscadas por 1 rodada (Reflexos CD 26 reduz à metade e evita a condição). Recarga (movimento).</p>'
    }),
    buildSpecialPower({
      name: 'Teofagia',
      img: 'systems/tormenta20/icons/poderes/ameacas/teofagia.webp',
      description: '<p>Quando causa dano a um devoto, o devoto perde 1 PM por patamar da criatura (2 PM). Se reduzido a 0 PM, perde poderes concedidos e magias por 24h.</p>'
    }),
    buildSpecialPower({
      name: 'Imunidades Fullgori',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Fullgori são imunes a acertos críticos, cansaço, efeitos metabólicos, metamorfose e paralisia.</p>'
    }),
    buildSpecialPower({
      name: 'Asa-Escudo',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
      description: '<p>Se não estiver voando, Cassiella usa suas asas como um escudo, reduzindo todo dano sofrido à metade. Se um personagem atacar especificamente uma de suas asas (Defesa 38) e causar pelo menos 50 pontos de dano, Cassiella fica caída e perde tanto esta habilidade quanto seu deslocamento de voo. Recarga (padrão).</p>'
    }),
    buildSpecialPower({
      name: 'Luz Fustigante',
      img: 'systems/tormenta20/icons/magias/coluna-de-chamas.webp',
      description: '<p>No início de cada turno de Cassiella, criaturas em um raio de 9m sofrem 2d8 pontos de dano, metade fogo e metade luz, e ficam em chamas (Ref CD 26 reduz à metade e evita as condições).</p>'
    }),
    buildSpecialPower({
      name: 'Rasante Luminoso',
      img: 'systems/tormenta20/icons/poderes/classes/cavaleiros/investida-destruidora.webp',
      description: '<p>Quando executa uma investida voando contra uma criatura no solo, Cassiella causa +4d6 pontos de dano de luz.</p>'
    })
  ];

  threats.push({
    id: 'fld27CassiellaFu',
    name: 'Cassiella fullgori',
    nd: '8',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (fullgori)',
    tamanho: 'med',
    deslocamento: '6m (4q), voo 15m (10q)',
    sentidos: 'visão no escuro',
    tesouro: 'Nenhum',
    atributos: casFullAtr,
    attributes: {
      pv: { value: 280, max: 280 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 31 } // 33 - 2 = 31
    },
    resistencias: casFullTracos,
    resistenciasTexto: 'imunidade a fogo e luz, redução de dano 10, resistência a magia divina +5; imunidade fullgori (acertos críticos, cansaço, metabolismo, metamorfose e paralisia)',
    pericias: casFullSkills,
    items: casFullItems,
    ataquescac: 'Espada longa x2 +26 (2d8+10, 19, mais 2d6 de luz)',
    ataquesad: 'Azagaias Fullgori +20 (4d8+4 luz, médio)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/cassiella-fullgori.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"O sol me queimou no ventre... o Fullgor me libertou das correntes da carne! Agora, testemunhem a luz que consome tudo!"<br /><span style="font-weight:bold;color:#800000">— Cassiella fullgori</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Asas de cristal e chamas douradas rasgaram a armadura negra. Ela não tocava mais o solo: planava com azagaias incandescentes nas mãos e o olhar vazio de quem já foi consumida pela febre divina. A guerreira morreu: resta apenas o anjo da ruína."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">Quando o ritual de contenção falha e a Orbe de Azgher não purifica a infecção, o Fullgor assume o controle total do corpo de Cassiella. Suas asas emergem como placas de ouro vivo, seu sangue ferve em chamas sagradas deturpadas e ela se torna um arauto alado da destruição divina.</p>`
  });

  // 3. Enxame Trog (ND 5)
  const enxTrogAtr = { for: 3, des: 1, con: 3, int: -2, sab: 0, car: -1 };
  const enxTrogSkills = buildSkills(5, enxTrogAtr, {
    inic: 3,
    perc: 0,
    fort: 10,
    refl: 5,
    vont: 1,
    furt: 5,
    luta: 15
  });
  const enxTrogTracos = buildTracos({
    tamanho: 'eno',
    resistencias: {
      frio: { vulnerabilidade: true }
    }
  });
  const enxTrogItems = [
    buildWeaponAttack({
      name: 'Enxame',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      dano: '6d6',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque de Enxame:</strong> 6d6 pontos de dano de perfuração.</p>'
    }),
    buildSpecialPower({
      name: 'Mau Cheiro Coletivo',
      img: 'systems/tormenta20/icons/poderes/ameacas/mau-cheiro.webp',
      description: '<p>O enxame está constantemente expelindo seu gás fétido, e todas as criaturas (exceto trogs) que comecem seu turno em alcance curto do enxame ficam enjoadas (Fort CD 20 evita). Uma criatura que passe no teste fica imune a esta habilidade por um dia. Efeito de veneno.</p>'
    }),
    buildSpecialPower({
      name: 'Sangue Frio',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp',
      description: '<p>O enxame trog sofre 1 ponto de dano adicional por dado de dano de frio.</p>'
    })
  ];

  threats.push({
    id: 'fld27EnxameTrogA',
    name: 'Enxame Trog',
    nd: '5',
    papel: 'bando',
    tipoMonstro: 'mon',
    raca: 'Monstro (trog)',
    tamanho: 'eno',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: enxTrogAtr,
    attributes: {
      pv: { value: 200, max: 200 },
      pm: { value: 0, max: 0 },
      defesa: { value: 23, base: 22 } // 23 - 1 = 22
    },
    resistencias: enxTrogTracos,
    resistenciasTexto: 'vulnerabilidade a frio (sofre +1 de dano por dado de frio)',
    pericias: enxTrogSkills,
    items: enxTrogItems,
    ataquescac: 'Enxame +15 (6d6 perfuração)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/enxame-trog.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"SSSHHH! Tenebra nos cobre! O mundo da luz morrerá afogado em nosso fedor!"<br /><span style="font-weight:bold;color:#800000">— Coro de Trogs Fanáticos</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Não eram dez nem vinte: eram centenas de escamas rolando como uma encosta viva de pedra e vômito. O ar virou piche venenoso antes mesmo do primeiro golpe atingir!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">Quando o fanatismo supera o instinto de sobrevivência, centenas de trogs se aglomeram em uma única massa viva devota a Tenebra. Avançam expelindo nuvens asfixiantes de gás oleoso e fétido, esmagando os inimigos sob o peso de garras e dentes incessantes.</p>`
  });

  // 4. Troggore (ND 3)
  const troggoreAtr = { for: 4, des: 2, con: 3, int: -2, sab: 1, car: -1 };
  const troggoreSkills = buildSkills(3, troggoreAtr, {
    inic: 5,
    perc: 4,
    fort: 15,
    refl: 9,
    vont: 3,
    furt: 10,
    luta: 14
  });
  const troggoreTracos = buildTracos({
    tamanho: 'med',
    resistencias: {
      frio: { vulnerabilidade: true }
    }
  });
  const troggoreItems = [
    buildWeaponAttack({
      name: 'Lança',
      img: 'systems/tormenta20/icons/itens/equipamentos/lanca.webp',
      dano: '1d6+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Lança +14 (1d6+5 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d6+5',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Mordida +14 (1d6+5 perfuração).</p>'
    }),
    buildSpecialPower({
      name: 'Escolhido de Tenebra',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/sombra.webp',
      description: '<p>O troggore não sofre penalidade em testes de Furtividade por se mover ao seu deslocamento normal e reduz a penalidade por atacar e fazer outras ações chamativas para –10.</p>'
    }),
    buildSpecialPower({
      name: 'Mau Cheiro',
      img: 'systems/tormenta20/icons/poderes/ameacas/mau-cheiro.webp',
      ativacao: { execucao: 'standard', custo: 0 },
      description: '<p>(Ação Padrão) O troggore expele um gás fétido. Todas as criaturas (exceto trogs) em alcance curto ficam enjoadas por 1d6 rodadas (Fort CD 17 evita). Criatura imune por um dia se passar. Efeito de veneno.</p>'
    }),
    buildSpecialPower({
      name: 'Sanguinolência',
      img: 'systems/tormenta20/icons/poderes/classes/lutadores/golpe-cruel.webp',
      description: '<p>O troggore causa +2 pontos de dano contra criaturas que já tenham sofrido dano nesta cena.</p>'
    }),
    buildSpecialPower({
      name: 'Sangue Frio',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp',
      description: '<p>O troggore sofre 1 ponto de dano adicional por dado de dano de frio.</p>'
    }),
    buildSpecialPower({
      name: 'Sensibilidade a Luz',
      img: 'systems/tormenta20/icons/poderes/ameacas/percepcao-as-cegas.webp',
      description: '<p>Quando exposto à luz do sol ou similar, o troggore fica ofuscado.</p>'
    })
  ];

  threats.push({
    id: 'fld27TroggoreAAA',
    name: 'Troggore',
    nd: '3',
    papel: 'padrao',
    tipoMonstro: 'mon',
    raca: 'Monstro (trog)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: troggoreAtr,
    attributes: {
      pv: { value: 80, max: 80 },
      pm: { value: 0, max: 0 },
      defesa: { value: 22, base: 20 } // 22 - 2 = 20
    },
    resistencias: troggoreTracos,
    resistenciasTexto: 'vulnerabilidade a frio, sensibilidade a luz',
    pericias: troggoreSkills,
    items: troggoreItems,
    ataquescac: 'Lança +14 (1d6+5) e mordida +14 (1d6+5)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/troggore.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Tenebra me ungiu com escamas de marfim. O calor do sol arde, mas minha lança esfria o coração dos vivos!"<br /><span style="font-weight:bold;color:#800000">— Guerreiro Troggore</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um homem-lagarto albino, imenso e escorrendo óleo negro de cada poro. Onde ele pisa, a terra parece chiar como carne em frigideira. Não tente fugir nas sombras: ele enxerga através da escuridão melhor do que eu no meio-dia!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">Os <span style="color:#800000;font-weight:bold">Troggore</span> são trogs albinos reverenciados como guerreiros sagrados de Tenebra. Maiores e mais violentos que seus irmãos comuns, atacam em emboscadas silenciosas nas galerias subterrâneas e fortalecem seus golpes quando sentem o cheiro de sangue fresco.</p>`
  });

  // 5. Bando Troggore (ND 5)
  const bandoAtr = { for: 4, des: 2, con: 3, int: -2, sab: 1, car: -1 };
  const bandoSkills = buildSkills(5, bandoAtr, {
    inic: 5,
    perc: 4,
    fort: 15,
    refl: 9,
    vont: 3,
    furt: 9,
    luta: 17
  });
  const bandoTracos = buildTracos({
    tamanho: 'gde',
    resistencias: {
      frio: { vulnerabilidade: true }
    }
  });
  const bandoItems = [
    buildWeaponAttack({
      name: '[Bando] Lança',
      img: 'systems/tormenta20/icons/itens/equipamentos/lanca.webp',
      dano: '2d6+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> [Bando] Lança +17 (2d6+10 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: '[Bando] Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d6+10',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> [Bando] Mordida +17 (2d6+10 perfuração).</p>'
    }),
    buildSpecialPower({
      name: 'Mau Cheiro',
      img: 'systems/tormenta20/icons/poderes/ameacas/mau-cheiro.webp',
      ativacao: { execucao: 'standard', custo: 0 },
      description: '<p>(Ação Padrão) O bando troggore expele um gás fétido. Todas as criaturas (exceto trogs) em alcance curto ficam enjoadas por 1d6 rodadas (Fort CD 17 evita). Veneno.</p>'
    }),
    buildSpecialPower({
      name: 'Devoção Protetora',
      img: 'systems/tormenta20/icons/poderes/classes/paladinos/egide-sagrada.webp',
      ativacao: { execucao: 'reaction', custo: 0 },
      description: '<p>(Reação) Uma vez por rodada, quando Urrash das Sombras Frias sofre dano, o bando troggore sofre todo o dano que ele sofreria.</p>'
    }),
    buildSpecialPower({
      name: 'Sanguinolência',
      img: 'systems/tormenta20/icons/poderes/classes/lutadores/golpe-cruel.webp',
      description: '<p>O bando troggore causa +2 pontos de dano contra criaturas que já tenham sofrido dano nesta cena.</p>'
    }),
    buildSpecialPower({
      name: 'Sangue Frio',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp',
      description: '<p>O bando troggore sofre 1 ponto de dano adicional por dado de dano de frio.</p>'
    }),
    buildSpecialPower({
      name: 'Sensibilidade a Luz',
      img: 'systems/tormenta20/icons/poderes/ameacas/percepcao-as-cegas.webp',
      description: '<p>Quando exposto à luz do sol ou similar, o bando troggore fica ofuscado.</p>'
    })
  ];

  threats.push({
    id: 'fld27BandoTroggA',
    name: 'Bando Troggore',
    nd: '5',
    papel: 'bando',
    tipoMonstro: 'mon',
    raca: 'Monstro (trog)',
    tamanho: 'gde',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Metade',
    atributos: bandoAtr,
    attributes: {
      pv: { value: 180, max: 180 },
      pm: { value: 0, max: 0 },
      defesa: { value: 22, base: 20 } // 22 - 2 = 20
    },
    resistencias: bandoTracos,
    resistenciasTexto: 'vulnerabilidade a frio, sensibilidade a luz',
    pericias: bandoSkills,
    items: bandoItems,
    ataquescac: '[Bando] Lança +17 (2d6+10) e mordida +17 (2d6+10)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/bando-troggore.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Pela Mãe Noite! Nosso sangue cobre o xamã!"<br /><span style="font-weight:bold;color:#800000">— Guerreiros do Bando Troggore</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Eles não se importam em morrer: formam uma muralha de escamas e lanças ao redor do clérigo. Cada golpe que acertamos no sacerdote parece ser absorvido por esses fanáticos albinos!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Bando Troggore</span> atua como a guarda pretoriana de Urrash nas profundezas das cavernas de Baldonn. Conectados por fanatismo cego, interceptam ataques direcionados ao seu líder espiritual e atacam com fúria multiplicada.</p>`
  });

  // 6. Urrash das Sombras Frias (ND 5)
  const urrashAtr = { for: 0, des: 1, con: 2, int: -1, sab: 4, car: 2 };
  const urrashSkills = buildSkills(5, urrashAtr, {
    inic: 5,
    perc: 8,
    fort: 11,
    refl: 7,
    vont: 15,
    conh: 3,
    furt: 10,
    inti: 6,
    intu: 8,
    reli: 8,
    luta: 15
  });
  const urrashTracos = buildTracos({
    tamanho: 'med',
    resistencias: {
      frio: { vulnerabilidade: true }
    }
  });
  const urrashItems = [
    buildWeaponAttack({
      name: 'Lança',
      img: 'systems/tormenta20/icons/itens/equipamentos/lanca.webp',
      dano: '2d6+8',
      tipoDano: 'perfuração',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Lança +15 (2d6+8 perfuração).</p>'
    }),
    buildWeaponAttack({
      name: 'Mordida Sombria',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '2d6+8',
      tipoDano: 'trevas',
      periciaAtaque: 'luta',
      criticoMargem: 20,
      criticoMultiplicador: 2,
      proposito: 'corpo-a-corpo',
      tipo: 'corpo-a-corpo',
      description: '<p><strong>Ataque Corpo a Corpo:</strong> Mordida +15 (2d6+8 perfuração mais 2d6 trevas).</p>'
    }),
    buildSpellItem({
      name: 'Curar Ferimentos',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'evo',
      ativacao: { execucao: 'standard', custo: 5 },
      alcance: 'toque',
      duracao: 'instantânea',
      description: '<p>Uma criatura adjacente cura 6d8+6 PV.</p>'
    }),
    buildSpellItem({
      name: 'Escuridão',
      img: 'systems/tormenta20/icons/magias/escuridao.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'nec',
      ativacao: { execucao: 'standard', custo: 3 },
      alcance: 'curto',
      resistencia: 'Fortitude reduz para 1 rodada',
      description: '<p>Uma criatura em alcance curto fica cega pela cena (Fortitude reduz para 1 rodada).</p>'
    }),
    buildSpellItem({
      name: 'Infligir Ferimentos',
      img: 'systems/tormenta20/icons/magias/infligir-ferimentos.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'nec',
      ativacao: { execucao: 'standard', custo: 5 },
      alcance: 'toque',
      resistencia: 'Fortitude reduz à metade',
      description: '<p>Uma criatura adjacente sofre 4d8+4 pontos de dano de trevas (Fortitude reduz à metade).</p>'
    }),
    buildSpellItem({
      name: 'Perdição',
      img: 'systems/tormenta20/icons/magias/perdicao.webp',
      circulo: 1,
      tipo: 'div',
      escola: 'enc',
      ativacao: { execucao: 'standard', custo: 3 },
      alcance: 'curto',
      description: '<p>Criaturas escolhidas em alcance curto sofrem –2 em testes de ataque e rolagens de dano até o fim da cena.</p>'
    }),
    buildSpellItem({
      name: 'Profanar',
      img: 'systems/tormenta20/icons/magias/profanar.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'nec',
      ativacao: { execucao: 'standard', custo: 1 },
      alcance: 'longo',
      duracao: '1 dia',
      description: '<p>Uma esfera de 9m em alcance longo se enche com energia negativa por 1 dia. Dentro dela, todo dano de trevas é maximizado.</p>'
    }),
    buildSpellItem({
      name: 'Toque Vampírico',
      img: 'systems/tormenta20/icons/magias/toque-vampirico.webp',
      circulo: 2,
      tipo: 'div',
      escola: 'nec',
      ativacao: { execucao: 'standard', custo: 5 },
      alcance: 'toque',
      resistencia: 'Fortitude reduz à metade',
      description: '<p>Uma criatura adjacente sofre 8d6 pontos de dano de trevas e Urrash recupera PV iguais à metade do dano causado (Fortitude reduz à metade).</p>'
    }),
    buildSpecialPower({
      name: 'Passo Sombrio',
      img: 'systems/tormenta20/icons/poderes/classes/ladinos/sombra.webp',
      ativacao: { execucao: 'move', custo: 0 },
      description: '<p>(Ação de Movimento) Urrash pode se teleportar para um espaço desocupado em alcance curto. Não pode usar se estiver imóvel.</p>'
    }),
    buildSpecialPower({
      name: 'Visão nas Trevas',
      img: 'systems/tormenta20/icons/poderes/ameacas/visao-no-escuro.webp',
      description: '<p>Urrash enxerga no escuro perfeitamente, mesmo em áreas sob efeito de magias de escuridão.</p>'
    }),
    buildSpecialPower({
      name: 'Devoção à Tenebra',
      img: 'systems/tormenta20/icons/poderes/classes/clerigos/simbolo-sagrado.webp',
      description: '<p>Quando exposto à luz solar direta, Urrash fica enjoado e perde todos os seus pontos de mana.</p>'
    }),
    buildSpecialPower({
      name: 'Sangue Frio',
      img: 'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp',
      description: '<p>Urrash sofre 1 ponto de dano adicional por dado de dano de frio.</p>'
    })
  ];

  threats.push({
    id: 'fld27UrrashSombr',
    name: 'Urrash das Sombras Frias',
    nd: '5',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro (trog)',
    tamanho: 'med',
    deslocamento: '9m (6q)',
    sentidos: 'visão no escuro',
    tesouro: 'Padrão',
    atributos: urrashAtr,
    attributes: {
      pv: { value: 140, max: 140 },
      pm: { value: 29, max: 29 },
      defesa: { value: 23, base: 22 } // 23 - 1 = 22
    },
    resistencias: urrashTracos,
    resistenciasTexto: 'vulnerabilidade a frio, devoção a tenebra (enjoado e perde PM ao sol)',
    pericias: urrashSkills,
    items: urrashItems,
    ataquescac: 'Lança +15 (2d6+8) e mordida +15 (2d6+8 mais 2d6 trevas)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/urrash-das-sombras-frias.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"Tenebra falou comigo no ovo: o sol queima Arton com crueldade. Guardar a Orbe nas trevas é a salvação do mundo!"<br /><span style="font-weight:bold;color:#800000">— Urrash das Sombras Frias</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Corpo untado de óleo e piche negro, cheirando a enxofre e túmulo antigo. Ele fala a língua comum com estalos guturais e canaliza magias de necromancia com uma precisão que rivaliza com os clérigos da capital."<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6"><span style="color:#800000;font-weight:bold">Urrash das Sombras Frias</span> é o patriarca e xamã supremo dos trogs sob o Rio da Fortitude. Devoto fervoroso de Tenebra, mantém a Orbe de Azgher lacrada sob camadas de piche e escuridão mágica para proteger o santuário trog da cólera solar.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: FOLDER_AMEACAS,
      nd: t.nd,
      papel: t.papel,
      tipoMonstro: t.tipoMonstro,
      raca: t.raca,
      tamanho: t.tamanho,
      deslocamento: t.deslocamento,
      sentidos: t.sentidos,
      tesouro: t.tesouro,
      atributos: t.atributos,
      attributes: t.attributes,
      resistencias: t.resistencias,
      resistenciasTexto: t.resistenciasTexto,
      pericias: t.pericias,
      items: t.items,
      ataquescac: t.ataquescac,
      ataquesad: t.ataquesad || '',
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    saveToSourcePacks('Ameacas_T20', built.actorDoc, built.embeddedDocs);
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo e espelhado com ${built.embeddedDocs.length} subdocumentos.`);
  }

  await db.close();
}

// ============================================================================
// 2. ITENS, RELÍQUIAS E PARCEIROS (Itens_T20)
// ============================================================================
async function injectItems() {
  console.log('\n--- Injetando Itens da Edição 27 em Itens_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await db.open();

  const items = [
    // 1. Orbe de Azgher (Artefato Sagrado)
    {
      _id: 'fld27OrbeAzgherA',
      name: 'Orbe de Azgher',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/orbe.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Artefato Sagrado de Azgher:</strong> Esta esfera dourada tem o tamanho de um melão quando em repouso, mas encolhe para o tamanho de um punho fechado quando recebe um portador digno (que deve seguir as obrigações e restrições de Azgher). A esfera flutua pouco acima de seu ombro como um falcão leal, sem precisar ser empunhada ou vestida.</p><ul><li>A Orbe está constantemente sob efeito da magia <em>Luz</em> (5º Círculo para efeito de <em>Anular a Luz</em> e similares).</li><li>O usuário pode gastar PM para executar todos os aprimoramentos da magia <em>Luz</em>, arcanos ou divinos.</li><li>O usuário pode conjurar <em>Coluna de Chamas</em>, <em>Dispersar as Trevas</em> e <em>Raio Solar</em> pelos seus custos normais em PM.</li></ul>'
        },
        tipo: 'equipamento',
        preco: 0,
        peso: 1,
        origem: 'Azgher'
      },
      rawEffects: [
        {
          _id: 'eff27OrbeLuzPerm',
          name: 'Aura Solar Permanente (5º Círculo)',
          changes: [
            { key: 'system.modificadores.pericia', mode: 2, value: '0', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 2. Parceiro: Cassiella de Baldonn
    {
      _id: 'fld27ParcCassiel',
      name: 'Parceiro: Cassiella de Baldonn',
      type: 'poder',
      img: 'systems/tormenta20/icons/poderes/classes/guerreiros/disciplina-de-combate.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p><strong>Parceiro Especial:</strong> Cassiella é uma guerreira suraggel formidável que divide suas dádivas de luz com os aliados. Você recebe <strong>+3 em testes de ataque</strong> e pode lançar <em>Luz</em> (como uma magia divina; atributo-chave Carisma). Se já for capaz de lançar essa magia, seu custo em PM diminui em –1 PM.</p>'
        },
        tipo: 'poder',
        subtipo: 'parceiro'
      },
      rawEffects: [
        {
          _id: 'eff27CassielAtk3',
          name: 'Dádiva da Luz de Cassiella (+3 Ataque)',
          changes: [
            { key: 'system.modificadores.ataque', mode: 2, value: '3', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 3. Armadura Completa Delicada Selada
    {
      _id: 'fld27ArmaduraCas',
      name: 'Armadura Completa Delicada Selada',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/armadura-completa.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p>Armadura pesada forjada sob medida para Cassiella com aço escurecido. Possui a melhoria <em>delicada</em> (penalidade de armadura reduzida em 1) e <em>selada</em> (fornece +2 em testes de resistência contra efeitos de contato e gases).</p>'
        },
        tipo: 'equipamento',
        preco: 4500,
        peso: 25,
        armadura: {
          value: 10,
          penalidade: -4,
          maxAtr: 1
        }
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 4. Escudo Pesado Reforçado
    {
      _id: 'fld27EscudoPesCa',
      name: 'Escudo Pesado Reforçado',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p>Escudo pesado forjado com liga metálica negra resistente. Fornece +3 na Defesa (+2 base, +1 reforçado) e penalidade de armadura –2.</p>'
        },
        tipo: 'equipamento',
        preco: 350,
        peso: 6,
        armadura: {
          value: 3,
          penalidade: -2,
          maxAtr: 0
        }
      },
      rawEffects: [
        {
          _id: 'eff27EscudoRefor',
          name: 'Bônus de Escudo Reforçado (+3 Defesa)',
          changes: [
            { key: 'system.attributes.defesa.bonus', mode: 2, value: '3', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 5. Espada Longa Pungente
    {
      _id: 'fld27EspadaPunge',
      name: 'Espada Longa Pungente',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p>Espada longa balanceada com gume refinado pela melhoria <em>pungente</em> (+2 em testes de ataque). Dano 1d8 corte (19/x2).</p>'
        },
        tipo: 'equipamento',
        preco: 1015,
        peso: 2
      },
      rawEffects: [
        {
          _id: 'eff27EspadaPunge',
          name: 'Melhoria Pungente (+2 Ataque)',
          changes: [
            { key: 'system.modificadores.ataque', mode: 2, value: '2', priority: 20 }
          ]
        }
      ],
      effects: [],
      flags: {},
      _stats: statsHeader
    },
    // 6. Lança Troggore
    {
      _id: 'fld27LancaTroggo',
      name: 'Lança Troggore',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/equipamentos/lanca.webp',
      folder: FOLDER_ITENS,
      system: {
        description: {
          value: '<p>Lança rústica de ponta afiada untada com óleo espesso de trog. Dano 1d6 perfuração (x2), com alcance curto quando arremessada.</p>'
        },
        tipo: 'equipamento',
        preco: 2,
        peso: 1.5
      },
      effects: [],
      flags: {},
      _stats: statsHeader
    }
  ];

  for (const item of items) {
    const rawEffects = item.rawEffects || [];
    const effectIds = rawEffects.map(e => e._id);
    const embeddedEffects = [];

    for (const eff of rawEffects) {
      const effectDoc = {
        _id: eff._id,
        name: eff.name,
        icon: eff.icon || item.img,
        origin: `Item.${item._id}`,
        duration: { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
        disabled: false,
        transfer: true,
        changes: eff.changes || [],
        flags: { tormenta20: { self: true } },
        system: {}
      };
      embeddedEffects.push(effectDoc);
      await db.put(`!items.effects!${item._id}.${eff._id}`, effectDoc);
    }

    const itemDoc = {
      ...item,
      effects: effectIds
    };
    delete itemDoc.rawEffects;

    await db.put(`!items!${item._id}`, itemDoc);
    const embeddedForSource = embeddedEffects.map(e => ({
      key: `!items.effects!${item._id}.${e._id}`,
      typePath: '!items.effects!',
      doc: e
    }));
    saveToSourcePacks('Itens_T20', itemDoc, embeddedForSource);
    console.log(`✓ Item "${item.name}" salvo com ${embeddedEffects.length} efeitos.`);
  }

  await db.close();
}

// ============================================================================
// 3. DIÁRIOS (Diarios_T20)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diários da Edição 27 em Diarios_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await db.open();

  const journalId = 'fld27DiarioDiaNo';
  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 27: Dia e Noite',
    folder: FOLDER_DIARIOS,
    sort: 200000,
    ownership: { default: -1 },
    flags: {},
    pages: [
      'p27SinopseAvent',
      'p27Parte1Chamad',
      'p27Parte2Corac',
      'p27Parte3Covil',
      'p27Parte4OrbeA',
      'p27BestiarioNpc'
    ],
    _stats: statsHeader
  };

  const pages = [
    {
      _id: 'p27SinopseAvent',
      name: 'Apresentação & Sinopse: Dia e Noite',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Dia e Noite</h2>
<p><em>Revista Tormenta20 — Edição 27 (Maio de 2026). Criação por Marcelo Cassaro.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"Chamados mais uma vez pelo frade Thalgrimm, os heróis partem rumo a Baldonn, cidade deheoni assolada por ataques de trogs vindos das cavernas vizinhas."
</blockquote>
<h3>Sinopse da Aventura</h3>
<p>Lá encontram <strong>Cassiella</strong>, uma guerreira suraggel — descendente de anjos de Azgher — que luta para proteger o povo, mas sente em seu próprio corpo a presença crescente do Fullgor. A deturpação, antes restrita a celestiais e devotos, agora alcança até o sangue angelical.</p>
<p>Cassiella acredita que a <strong>Orbe de Azgher</strong>, relíquia solar guardada pelos trogs, pode purificá-la antes que seja tarde. Os heróis descem às profundezas e descobrem que os trogs, devotos de Tenebra, mantêm o artefato oculto nas trevas para impedir que sua luz desperte a ira da deusa.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 100000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p27Parte1Chamad',
      name: 'Parte 1: Chamado da Luz',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 1: Chamado da Luz</h2>
<h3>Cena 1: Chamado da Luz</h3>
<p>Nas escadarias da Igreja de Arsenal em Valkaria, Thalgrimm anuncia a nova missão: a febre do Fullgor alcançou uma guerreira com sangue angelical na cidade de Baldonn. O anão entrega suprimentos e abençoa a jornada.</p>
<h3>Cena 2: Estrada para Baldonn (ND 5)</h3>
<p>Jornada através dos campos e colinas de Deheon até a cidade de Baldonn, conhecida pela criação de trobos. O caminho exige testes de Cavalgar, Sobrevivência e Percepção para contornar emboscadas trogs.</p>
<h3>Cena 3: O Cerco de Baldonn</h3>
<p>Os heróis chegam a Baldonn bem a tempo de presenciar uma horda de trogs assaltando as paliçadas. Ao lado da milícia luta uma guerreira de armadura negra e cabelos dourados faiscantes: Cassiella!</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 200000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p27Parte2Corac',
      name: 'Parte 2: Coração Dividido',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 2: Coração Dividido</h2>
<h3>Cena 1: Coração Dividido</h3>
<p>Na residência de Cassiella, ela revela aos aventureiros seu terrível dilema: seu sangue suraggel está contaminado pelo Fullgor. Ela pede que o grupo a acompanhe até as cavernas vizinhas para recuperar a Orbe de Azgher, fazendo-os prometer que a matarão se o Fullgor tomar seu corpo por completo.</p>
<h3>Cena 2: Rumo ao Covil (ND 6)</h3>
<p>Rastreamento das trilhas trogs pelas colinas rochosas. A cada curva, a vegetação torna-se mais ressecada e o odor de enxofre e piche intensifica-se.</p>
<h3>Cena 3: A Entrada das Cavernas</h3>
<p>Emboscada inicial de trogs sentinelas. Cassiella luta ao lado dos heróis como Parceira Especial, fornecendo +3 em ataques e luz sagrada.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 300000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p27Parte3Covil',
      name: 'Parte 3: Covil Infecto & Baldonn',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 3: Covil Infecto & Baldonn</h2>
<h3>Cena 1: Covil Infecto (ND 6)</h3>
<p>Os túneis dos trogs são labirintos asfixiantes impregnados pelo gás fétido dos monstros. Cada respiração arde no peito. Testes de Fortitude CD 20 periódicos para evitar a condição enjoado.</p>
<h3>Cena 2: O Enxame e os Troggores (ND 7)</h3>
<p>Nas galerias amplas, o grupo enfrenta o temível <strong>Enxame Trog (ND 5)</strong> apoiado por guerreiros <strong>Troggore albinos</strong> e pelo <strong>Bando Troggore (ND 5)</strong>.</p>
<h3>Cena 3: O Santuário de Urrash</h3>
<p>No coração da caverna, diante de um altar profanado de Tenebra, ergue-se <strong>Urrash das Sombras Frias (ND 5)</strong>, xamã trog que guarda o relicário coberto de piche onde a Orbe de Azgher permanece aprisionada.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 400000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p27Parte4OrbeA',
      name: 'Parte 4: A Orbe de Azgher',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 4: A Orbe de Azgher</h2>
<h3>Cena 1: A Relíquia Solar</h3>
<p>Com a derrota de Urrash, o relicário é alcançado. A luz da Orbe de Azgher tenta romper a crosta de piche. Cassiella aproxima-se, tremendo de esperança e medo.</p>
<h3>Cena 2: O Dilema de Azgher & A Transformação (ND 8)</h3>
<p>Ao tocar a relíquia, o poder do sol colide violentamente com o Fullgor no sangue de Cassiella. Se o ritual falhar ou se a relíquia for corrompida, ela se transforma em <strong>Cassiella fullgori (ND 8)</strong> — ganhando asas incandescentes, azagaias de luz e teofagia!</p>
<h3>Cena 3: Sol e Ouro</h3>
<p>Os heróis devem decidir o destino da Orbe: destruir a relíquia para tentar salvar a alma de Cassiella, ou preservá-la como um artefato maior contra as trevas cósmicas. A aventura se encerra com os personagens avançando para o <strong>8º nível</strong>!</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 500000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p27BestiarioNpc',
      name: 'Bestiário & NPCs da Edição 27',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Bestiário & NPCs da Edição 27</h2>
<p>Disponíveis no compêndio <strong>Ameaças T20</strong> na pasta <em>Fullgor dos Deuses</em>:</p>
<ul>
  <li><strong>Cassiella semi-fullgori (ND 7):</strong> Guerreira suraggel com espada longa pungente e escudo pesado, dividida entre sua honra mortal e a febre dourada.</li>
  <li><strong>Cassiella fullgori (ND 8):</strong> A forma consumida pelo Fullgor: voo veloz, azagaias fullgori à distância, asas que bloqueiam dano e aura de luz fustigante.</li>
  <li><strong>Enxame Trog (ND 5):</strong> Massa viva Enorme de trogs fanáticos que asfixiam os inimigos com mau cheiro coletivo.</li>
  <li><strong>Troggore (ND 3):</strong> Trogs albinos mais fortes e violentos, abençoados por Tenebra e implacáveis no combate subterrâneo.</li>
  <li><strong>Bando Troggore (ND 5):</strong> Guarda pretoriana de Urrash que absorve dano direcionado ao xamã.</li>
  <li><strong>Urrash das Sombras Frias (ND 5):</strong> Patriarca trog e clérigo de Tenebra, capaz de teleportar nas sombras e desferir magias de necromancia letais.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 600000,
      flags: {},
      _stats: statsHeader
    }
  ];

  await db.put(`!journal!${journalId}`, journalDoc);
  const embeddedPages = [];

  for (const p of pages) {
    const pageDoc = {
      ...p,
      _dbKey: `!journal.pages!${journalId}.${p._id}`
    };
    await db.put(`!journal.pages!${journalId}.${p._id}`, pageDoc);
    embeddedPages.push({ key: `!journal.pages!${journalId}.${p._id}`, doc: pageDoc });
  }

  saveToSourcePacks('Diarios_T20', journalDoc, embeddedPages);
  console.log(`✓ Diário "${journalDoc.name}" salvo com ${pages.length} páginas.`);
  await db.close();
}

// ============================================================================
// 4. TABELAS DE ROLAGEM (Tabelas_T20)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 27 em Tabelas_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await db.open();

  const tables = [
    // 1. Cavernas dos Trogs — Perigos e Ecos de Tenebra (1d6)
    {
      id: 'fld27TabCavernas',
      name: 'Cavernas dos Trogs — Perigos e Ecos de Tenebra (Edição 27)',
      formula: '1d6',
      img: 'systems/tormenta20/icons/itens/equipamentos/tocha.webp',
      description: '<p>Tabela de eventos, armadilhas e perigos nos túneis fétidos sob o Rio da Fortitude.</p>',
      results: [
        { id: 'res27Cav0000001', name: 'Nuvem de Gás Asfixiante', text: 'Bolsão de gás trog estagnado força teste de Fortitude CD 20 para evitar condição enjoado.', range: [1, 1] },
        { id: 'res27Cav0000002', name: 'Estalagmites Untadas de Piche', text: 'Chão escorregadio coberto de piche e escamas antigas. Teste de Acrobacia CD 18 para não cair.', range: [2, 2] },
        { id: 'res27Cav0000003', name: 'Grito de Alarme Troggore', text: 'Sentinelas batem lanças nas pedras, alertando as patrulhas próximas na caverna.', range: [3, 3] },
        { id: 'res27Cav0000004', name: 'Fungos Fosforescentes Azuis', text: 'Colônia de fungos ilumina a passagem em azul pálido, revelando marcas rituais de Tenebra.', range: [4, 4] },
        { id: 'res27Cav0000005', name: 'Cadáver de Mercador de Baldonn', text: 'Despojos de uma vítima dos trogs contendo 2d6x10 Tibares e uma poção de cura.', range: [5, 5] },
        { id: 'res27Cav0000006', name: 'Eco do Canto de Urrash', text: 'Cânticos guturais em louvor à Mãe Noite ecoam nas paredes, impondo –2 em Vontade por 1 hora.', range: [6, 6] }
      ]
    },
    // 2. Frases em Combate de Cassiella Possuída (1d8)
    {
      id: 'fld27TabFrasesCas',
      name: 'Frases em Combate de Cassiella Possuída (Edição 27)',
      formula: '1d8',
      img: 'systems/tormenta20/icons/poderes/classes/paladinos/golpe-divino.webp',
      description: '<p>Lamentos e blasfêmias pronunciadas por Cassiella durante sua possessão pelo Fullgor.</p>',
      results: [
        { id: 'res27Fra0000001', name: 'Azgher Me Queima', text: '"Azgher me queima desde o nascimento! Que queime agora o mundo inteiro!"', range: [1, 1] },
        { id: 'res27Fra0000002', name: 'Cumpram a Promessa', text: '"Cumpram sua promessa... matem-me antes que a luz apague meus olhos!"', range: [2, 2] },
        { id: 'res27Fra0000003', name: 'Ouro Fervente', text: '"Sinto ouro fervendo em minhas veias... é belo demais para ser pecado!"', range: [3, 3] },
        { id: 'res27Fra0000004', name: 'Armadura Inútil', text: '"A armadura negra não escondeu a luz... ela só alimentou as chamas!"', range: [4, 4] },
        { id: 'res27Fra0000005', name: 'Tenebra e o Sol', text: '"Tenebra tinha razão: o sol não é bondoso. Ele só quer consumir!"', range: [5, 5] },
        { id: 'res27Fra0000006', name: 'Asas da Ruína', text: '"Vejam minhas asas! Foram forjadas para a guerra contra os próprios céus!"', range: [6, 6] },
        { id: 'res27Fra0000007', name: 'Cinzas de Baldonn', text: '"Baldonn dormirá em paz quando o Fullgor silenciar todas as preces!"', range: [7, 7] },
        { id: 'res27Fra0000008', name: 'Nem Anjo Nem Demônio', text: '"Nem anjo, nem demônio... agora sou apenas a lâmina viva de Sillaria!"', range: [8, 8] }
      ]
    },
    // 3. Dilema da Orbe de Azgher — Escolhas e Consequências (1d6)
    {
      id: 'fld27TabDilemaOrb',
      name: 'Dilema da Orbe de Azgher — Escolhas e Consequências (Edição 27)',
      formula: '1d6',
      img: 'systems/tormenta20/icons/itens/equipamentos/orbe.webp',
      description: '<p>Determinação de desfechos narrativos e bênçãos cósmicas para a escolha dos personagens sobre a relíquia.</p>',
      results: [
        { id: 'res27Dil0000001', name: 'Purificação Compassiva', text: 'A Orbe é sacrificada para curar Cassiella. A guerreira sobrevive livre do Fullgor e torna-se campeã leal do grupo.', range: [1, 2] },
        { id: 'res27Dil0000002', name: 'Relíquia Preservada', text: 'A Orbe de Azgher é mantida intacta e confiada ao herói devoto do grupo, fornecendo iluminação perpétua.', range: [3, 4] },
        { id: 'res27Dil0000003', name: 'Equilíbrio Solar', text: 'Um ritual harmonizado canaliza metade da energia da Orbe para salvar Cassiella sem destruir o artefato por completo.', range: [5, 6] }
      ]
    }
  ];

  for (const t of tables) {
    const tableDoc = {
      _id: t.id,
      name: t.name,
      folder: FOLDER_TABELAS,
      sort: 200000,
      formula: t.formula,
      img: t.img,
      description: t.description,
      results: t.results.map(r => r.id),
      replacement: true,
      displayRoll: true,
      flags: {},
      _stats: statsHeader
    };

    await db.put(`!tables!${t.id}`, tableDoc);
    const embeddedResults = [];

    for (const r of t.results) {
      const resDoc = {
        _id: r.id,
        _dbKey: `!tables.results!${t.id}.${r.id}`,
        type: 'text',
        name: r.name,
        text: r.text,
        description: r.text,
        img: 'icons/svg/d20-black.svg',
        weight: 1,
        range: r.range,
        drawn: false,
        flags: {},
        _stats: statsHeader
      };
      await db.put(`!tables.results!${t.id}.${r.id}`, resDoc);
      embeddedResults.push({ key: `!tables.results!${t.id}.${r.id}`, doc: resDoc });
    }

    saveToSourcePacks('Tabelas_T20', tableDoc, embeddedResults);
    console.log(`✓ Tabela "${t.name}" salva com ${t.results.length} resultados.`);
  }

  await db.close();
}

// ============================================================================
// 5. MACROS (Macros_T20)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 27 em Macros_T20 ---');
  const db = new ClassicLevel(path.join(PACKS_DIR, 'Macros_T20'), { valueEncoding: 'json' });
  await db.open();

  const macroId = 'fld27MacroOrbeAz';
  const macroScript = `/**
 * Canalizar Orbe de Azgher — Fúlgor dos Deuses (Edição 27)
 * Permite ao portador da relíquia solar emanar luz intensa ou conjurar magias concedidas.
 */
new Dialog({
  title: "Orbe de Azgher — Relíquia Solar",
  content: \`
    <form>
      <p style="color: #b8860b;"><em>"A esfera dourada flutua sobre seu ombro, pulsando com a glória implacável do Deus-Sol."</em></p>
      <div style="margin-bottom: 12px;">
        <label><strong>Poder Solar a Canalizar:</strong></label>
        <select id="solarAction" style="width: 100%; padding: 4px;">
          <option value="luz">Emanar Luz Sagrada (5º Círculo - Ilumina 12m, cega trevas)</option>
          <option value="coluna">Coluna de Chamas (4 PM - 4d8 fogo + 4d8 luz)</option>
          <option value="dispersar">Dispersar as Trevas (3 PM - dissipa efeitos de escuridão)</option>
          <option value="raio">Raio Solar (5 PM - cone de 9m, 8d8 luz, cega inimigos)</option>
        </select>
      </div>
    </form>
  \`,
  buttons: {
    canalizar: {
      icon: '<i class="fas fa-sun"></i>',
      label: "Emanar Glória Solar",
      callback: (html) => {
        const action = html.find("#solarAction").val();
        let title = "";
        let desc = "";

        if (action === "luz") {
          title = "Luz Solar Permanente";
          desc = "A Orbe de Azgher expande seu brilho, iluminando uma esfera de 12m de raio e dissipando qualquer escuridão mágica de até 5º círculo!";
        } else if (action === "coluna") {
          title = "Coluna de Chamas";
          desc = "Um pilar colossal de fogo e luz divina desce dos céus, causando <strong>4d8 de fogo e 4d8 de luz</strong> (Reflexos reduz à metade).";
        } else if (action === "dispersar") {
          title = "Dispersar as Trevas";
          desc = "Uma onda dourada dissipa instantaneamente todas as magias e efeitos de trevas presentes na cena!";
        } else if (action === "raio") {
          title = "Raio Solar";
          desc = "Um feixe fulgurante irrompe da relíquia em cone de 9m, causando <strong>8d8 de dano de luz</strong> e cegando todas as criaturas na área.";
        }

        const card = \`
          <div style="border: 2px solid #b8860b; border-radius: 6px; padding: 10px; background: #fffdf0;">
            <h3 style="color: #b8860b; border-bottom: 1px solid #b8860b; margin-top: 0;">
              <i class="fas fa-sun"></i> \${title}
            </h3>
            <p>\${desc}</p>
            <blockquote style="font-style: italic; color: #806000; margin-top: 6px;">
              "O sol não tolera a covardia da sombra."<br/>
              — Liturgia de Azgher
            </blockquote>
          </div>
        \`;

        ChatMessage.create({
          content: card,
          speaker: ChatMessage.getSpeaker({ alias: "Orbe de Azgher" })
        });
      }
    },
    cancelar: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancelar"
    }
  },
  default: "canalizar"
}).render(true);
`;

  const macroDoc = {
    _id: macroId,
    name: 'Canalizar Orbe de Azgher (Fúlgor dos Deuses)',
    type: 'script',
    folder: FOLDER_MACROS,
    sort: 200000,
    img: 'systems/tormenta20/icons/itens/equipamentos/orbe.webp',
    scope: 'global',
    command: macroScript,
    author: 'piAgentTormenta20',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  saveToSourcePacks('Macros_T20', macroDoc, []);
  console.log(`✓ Macro "${macroDoc.name}" salva e espelhada.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 27 (DIA E NOITE)');
  console.log('================================================================================');

  await injectThreats();
  await injectItems();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 27 CONCLUÍDA COM SUCESSO EM TODOS OS COMPÊNDIOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 27:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItems, injectJournals, injectTables, injectMacros };

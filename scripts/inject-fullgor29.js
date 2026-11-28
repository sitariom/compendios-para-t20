#!/usr/bin/env node
/**
 * Injeção Canônica Integral de Fúlgor dos Deuses — Edição 29: Dor Profunda (RT20-029)
 *
 * Destino Direto nos Compêndios Hierárquicos (v2):
 * 1. rt20-029-ameacas: Guardião do Lamento Abissal (ND 9) + Namasqall Abandonado (ND 9)
 *    + 2 Perigos/Desafios (Viagem ao Fundo do Mar ND 9; Portal Respeito das Marés ND 9)
 * 2. rt20-029-equipamentos: Búzio da Maré Furiosa + Estilhas Cristalinas de Mynath
 * 3. rt20-029-poderes: Parceira: Liriavel Cintilara (Campanha Dor Profunda)
 *    + Parceiro: "Thalgrimm" Sangue de Ferro (Médico Veterano)
 * 4. rt20-029-diarios: Diário oficial completo (7 páginas sob !journal.pages!)
 * 5. rt20-029-tabelas: 3 Tabelas de Rolagem (1d10, 1d4, 1d18) sob !tables.results!
 * 6. rt20-029-macros: Macro interativa Combate contra Mynath & Regras Subaquáticas (Edição 29)
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const {
  buildItem,
  buildSkills,
  buildTracos,
  buildActiveEffect,
  buildWeaponAttack,
  buildSpecialPower,
  buildNpcActor,
  buildHazardActor
} = require('./create-entry');

const ED29_PACKS_DIR = path.join(
  __dirname,
  '..',
  'packs',
  'revistas',
  'revista-tormenta-20',
  'fulgor-dos-deuses',
  'edicao-29'
);

const statsHeader = {
  coreVersion: '13.351',
  systemId: 'tormenta20',
  systemVersion: '1.5.015',
  createdTime: Date.now(),
  modifiedTime: Date.now(),
  lastModifiedBy: 'kL8nfmJOQTqjeU2x'
};

async function openHierarchicalPack(packName) {
  const packDir = path.join(ED29_PACKS_DIR, packName);
  fs.mkdirSync(packDir, { recursive: true });
  const db = new ClassicLevel(packDir, { valueEncoding: 'json' });
  await db.open();
  return db;
}

// ============================================================================
// 1. AMEAÇAS & PERIGOS (rt20-029-ameacas)
// ============================================================================
async function injectThreats() {
  console.log('\n--- Injetando Ameaças e Perigos da Edição 29 em rt20-029-ameacas ---');
  const db = await openHierarchicalPack('rt20-029-ameacas');

  const threats = [];

  // 1. Guardião do Lamento Abissal (ND 9)
  const guardiaoAtr = { for: 10, des: 3, con: 8, int: -1, sab: 5, car: -1 };
  const guardiaoSkills = buildSkills(9, guardiaoAtr, {
    inic: 6,
    perc: 12,
    fort: 22,
    refl: 16,
    vont: 9,
    luta: 26
  });
  const guardiaoTracos = buildTracos({
    tamanho: 'eno',
    imunidadesDano: ['frio'],
    vulnerabilidadesDano: ['eletricidade'],
    rdGeral: 5
  });
  const guardiaoItems = [
    buildWeaponAttack({
      name: 'Mordida',
      img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
      dano: '1d8+10',
      tipoDano: 'perfuracao',
      periciaAtaque: 'luta',
      ataques: 1,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Mordida +26 (1d8+10, mais sangramento).</p>',
      flavorPhrase: '"O mar sangra — e vocês ainda respiram!"',
      flavorAction: 'O guardião abissal crava a mandíbula de tubarão profundo'
    }),
    buildWeaponAttack({
      name: 'Três Tentáculos',
      img: 'systems/tormenta20/icons/magias/tentaculos-de-trevas.webp',
      dano: '1d6+10',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 3,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Três tentáculos +26 (1d6+10 impacto).</p>',
      flavorPhrase: '"A concha guarda a última esperança. Não a tocarão!"',
      flavorAction: 'Três tentáculos abissais chicoteiam a água ao redor'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        {
          name: 'Agarrar (Tentáculo +36)',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['10', '', '']]
        }
      ],
      description: '<p>(Livre) Ao acertar um ataque com tentáculo, o guardião pode tentar a manobra agarrar (Tentáculo +36).</p>',
      flavorPhrase: '"Vocês nadam livres enquanto o oceano sangra!"',
      flavorAction: 'Tentáculos de kraken tentam imobilizar a presa'
    }),
    buildSpecialPower({
      name: 'Constrição',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        {
          name: 'Dano de Constrição',
          key: 'dano0',
          type: 'dano',
          parts: [['2d6+10', 'impacto', '']]
        }
      ],
      description: '<p>(Livre) No início de cada um de seus turnos, o guardião causa 2d6+10 pontos de dano de impacto em cada criatura que estiver agarrando.</p>',
      flavorPhrase: '"O mar lembra. O mar acusa."',
      flavorAction: 'O guardião comprime as presas agarradas sob a pressão abissal'
    }),
    buildSpecialPower({
      name: 'Encastelar-se',
      img: 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
      execucao: 'move',
      custo: 0,
      effects: [
        {
          _id: 'eff29GuardEncast',
          name: 'Encastelar-se (+5 Defesa, +5 RD, Imóvel)',
          transfer: true,
          disabled: true,
          changes: [
            { key: 'system.modificadores.defesa.outros', mode: 2, value: '5', priority: 20 },
            { key: 'system.tracos.resistencias.dano.bonus', mode: 2, value: '5', priority: 20 }
          ]
        }
      ],
      description: '<p>(Movimento) O guardião protege-se com sua carapaça, recebendo +5 na Defesa e RD 10 (total), mas fica imóvel.</p>',
      flavorPhrase: '"Não merecem o que buscam!"',
      flavorAction: 'Placas de coral e carapaça ancestral se fecham como fortaleza'
    }),
    buildSpecialPower({
      name: 'Fluxo Circular',
      img: 'systems/tormenta20/icons/magias/controlar-agua.webp',
      execucao: 'full',
      custo: 0,
      alcance: 'short',
      cd: 24,
      resistencia: {
        pericia: 'refl',
        atributo: 'sab',
        bonus: 0,
        txt: 'Ref CD 24 reduz à metade e evita o empurrão'
      },
      rolls: [
        {
          name: 'Dano de Frio',
          key: 'dano0',
          type: 'dano',
          parts: [['3d6', 'frio', '']]
        },
        {
          name: 'Dano de Impacto',
          key: 'dano1',
          type: 'dano',
          parts: [['3d6', 'impacto', '']]
        }
      ],
      description: '<p>(Completa) O guardião gira seu corpo empurrando a água em todas as direções, causando 6d6 de dano, metade frio e metade impacto, a criaturas em alcance curto e as empurrando 9m (Ref CD 24 reduz à metade e evita o empurrão). Se atingir algum obstáculo, a criatura sofre 1d6 pontos de dano de impacto por cada 1,5m que foi empurrada. O guardião não pode utilizar essa habilidade se estiver imóvel.</p>',
      flavorPhrase: '"Profanos! Trouxeram o mundo seco até aqui!"',
      flavorAction: 'Um turbilhão de água gelada irrompe ao redor do guardião'
    }),
    buildSpecialPower({
      name: 'Maior que a Morte',
      img: 'systems/tormenta20/icons/poderes/combate.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Enquanto tiver pelo menos metade de seus PV, o guardião é imune a habilidades e efeitos de morte instantânea.</p>'
    }),
    buildSpecialPower({
      name: 'Templo',
      img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
      execucao: 'passive',
      custo: 0,
      description: `<p>O guardião controla um templo devotado a Oceano. Este templo está sob efeito da magia <em>Consagrar</em> e, dentro dele, devotos de Oceano recebem +2 na Defesa e em testes de perícia (já contabilizados). Uma magia <em>Profanar</em> anula esses efeitos por 1d6 rodadas.</p>
<ul>
  <li><strong>Armadilha Oculta:</strong> Ação de movimento; uma criatura em alcance médio sofre 2d6 pontos de dano de perfuração e fica imóvel (Ref CD 24; soltar-se exige ação padrão e Atletismo ou Ladinagem CD 24).</li>
  <li><strong>Fonte Curativa:</strong> Fornece cura acelerada 10 para o guardião. Desativar exige duas ações completas e Religião CD 24 (gera pulso que cura 10 PV em todos os personagens).</li>
  <li><strong>Passagens Secretas:</strong> Três passagens na arena. Adjacente a uma, gasta ação de movimento para surgir adjacente a outra; se atacar na mesma rodada, a vítima fica desprevenida. Desativar exige ação completa e Ladinagem CD 24.</li>
  <li><strong>Selo Místico:</strong> Ação de movimento para lançar o efeito básico de <em>Sopro das Uivantes</em> sem gastar PM (cone de 9m, 4d6 frio, Médias ou menores ficam caídas e empurradas 6m, +2d6 impacto contra objeto; Fort CD 24 reduz à metade e evita condição/empurrão). Desativar exige ação completa e Misticismo CD 24.</li>
</ul>`
    }),
    buildSpecialPower({
      name: 'Templo: Armadilha Oculta',
      img: 'systems/tormenta20/icons/itens/gerais/algemas.webp',
      execucao: 'move',
      custo: 0,
      alcance: 'medium',
      cd: 24,
      resistencia: {
        pericia: 'refl',
        atributo: 'sab',
        bonus: 0,
        txt: 'Ref CD 24 evita dano e condição imóvel'
      },
      rolls: [
        {
          name: 'Dano da Concha',
          key: 'dano0',
          type: 'dano',
          parts: [['2d6', 'perfuracao', '']]
        }
      ],
      description: '<p>(Movimento) Uma concha de tamanho médio escondida no chão se fecha sobre uma criatura em alcance médio, causando 2d6 pontos de dano de perfuração e deixando-a imóvel (Ref CD 24). Soltar-se exige ação padrão e Atletismo ou Ladinagem (CD 24).</p>'
    }),
    buildSpecialPower({
      name: 'Templo: Fonte Curativa',
      img: 'systems/tormenta20/icons/magias/curar-ferimentos.webp',
      execucao: 'passive',
      custo: 0,
      cd: 24,
      rolls: [
        {
          name: 'Cura Acelerada / Pulso',
          key: 'dano0',
          type: 'dano',
          parts: [['10', 'curapv', '']]
        }
      ],
      description: '<p>Energias místicas fornecem cura acelerada 10 para o guardião. Um personagem pode gastar duas ações completas e fazer um teste de Religião (CD 24) para gerar um pulso curativo que cura 10 PV em todos os personagens e desativa a fonte.</p>'
    }),
    buildSpecialPower({
      name: 'Templo: Passagens Secretas',
      img: 'systems/tormenta20/icons/poderes/classes/especialistas/marca-presa.webp',
      execucao: 'move',
      custo: 0,
      cd: 24,
      description: '<p>(Movimento) A arena possui três passagens secretas em pontos distintos. Se estiver adjacente a uma dessas passagens, o guardião pode se deslocar para um ponto adjacente a qualquer outra passagem e a vítima fica desprevenida contra seu ataque na mesma rodada. Desativar exige ação completa e Ladinagem (CD 24).</p>'
    }),
    buildSpecialPower({
      name: 'Templo: Selo Místico (Sopro das Uivantes)',
      img: 'systems/tormenta20/icons/magias/sopro-das-uivantes.webp',
      execucao: 'move',
      custo: 0,
      alcance: 'short',
      area: 'cone de 9m',
      cd: 24,
      resistencia: {
        pericia: 'fort',
        atributo: 'sab',
        bonus: 0,
        txt: 'Fort CD 24 reduz dano à metade e evita caída/empurrão'
      },
      rolls: [
        {
          name: 'Dano de Frio',
          key: 'dano0',
          type: 'dano',
          parts: [['4d6', 'frio', '']]
        },
        {
          name: 'Impacto em Obstáculo',
          key: 'dano1',
          type: 'dano',
          parts: [['2d6', 'impacto', '']]
        }
      ],
      description: '<p>(Movimento) A arena possui um símbolo místico que armazena a magia <em>Sopro das Uivantes</em> sem custo em PM (cone de 9m, 4d6 de frio; Médias ou menores caídas e empurradas 6m, +2d6 impacto se colidirem com objeto; Fort CD 24 reduz à metade e evita condição/empurrão). Desativar exige ação completa e Misticismo (CD 24).</p>'
    })
  ];

  threats.push({
    id: 'fld29GuardiaoAbi',
    name: 'Guardião do Lamento Abissal',
    img: 'systems/tormenta20/icons/magias/controlar-agua.webp',
    nd: '9',
    papel: 'solo',
    tipoMonstro: 'mon',
    raca: 'Monstro',
    tamanho: 'eno',
    deslocamento: '6m (4q), natação 24m (12q)',
    sentidos: 'faro, percepção às cegas',
    tesouro: 'Dobro.',
    atributos: guardiaoAtr,
    attributes: {
      pv: { value: 560, max: 560 },
      pm: { value: 0, max: 0 },
      defesa: { value: 33, base: 30 }, // 33 - Des 3 = 30
      cd: 24
    },
    resistencias: guardiaoTracos,
    resistenciasTexto: 'imunidade a frio, maior que a morte, redução de dano 5, vulnerabilidade a eletricidade',
    pericias: guardiaoSkills,
    items: guardiaoItems,
    ataquescac: 'Mordida +26 (1d8+10, mais sangramento) e três tentáculos +26 (1d6+10)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/guardiao-lamento-abissal.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"O mar chamou. O mar esperou. O mar sangra — e vocês ainda respiram."<br /><span style="font-weight:bold;color:#800000">— Guardião do Lamento Abissal</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Carapaça de crustáceo, tentáculos de kraken e um olhar de tritão cheio de mágoa antiga! O bicho lutava como quem defende um túmulo esquecido usando conchas armadilha e portais nas paredes do templo submerso!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Guardião do Lamento Abissal</span> foi a última sentinela deixada por Oceano em seu templo submerso próximo a Salmarina. Fundido por magia divina a partir de fragmentos de leviatã, crustáceo, serpentes abissais e tritão, enlouqueceu em sua vigília solitária e ataca intrusos em defesa do relicário sagrado.</p>`
  });

  // 2. Namasqall Abandonado (ND 9)
  const namasAtr = { for: 10, des: 4, con: 10, int: -3, sab: -1, car: -1 };
  const namasSkills = buildSkills(9, namasAtr, {
    inic: 14,
    perc: 9,
    fort: 24,
    refl: 18,
    vont: 10,
    luta: 34
  });
  const namasTracos = buildTracos({
    tamanho: 'col',
    imunidadesDano: ['frio'],
    vulnerabilidadesDano: ['fogo'],
    ic: ['critico', 'atordoamento', 'cansaco', 'metabolismo', 'paralisia']
  });
  const namasItems = [
    buildWeaponAttack({
      name: 'Quatro Tentáculos d’Água',
      img: 'systems/tormenta20/icons/magias/tentaculos-de-trevas.webp',
      dano: '1d10+25',
      tipoDano: 'impacto',
      periciaAtaque: 'luta',
      ataques: 4,
      description: '<p><strong>Ataque Natural Corpo a Corpo:</strong> Quatro tentáculos d’água +34 (1d10+25, impacto).</p>',
      flavorPhrase: '"A maré ruge com fúria vazia..."',
      flavorAction: 'Quatro trombas d’água açoitam o fundo do mar com violência colossal'
    }),
    buildSpecialPower({
      name: 'Agarrar Aprimorado',
      img: 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        {
          name: 'Agarrar (Tentáculo +44)',
          key: 'ataque0',
          type: 'ataque',
          parts: [['1d20', '', ''], ['luta', '', ''], ['10', '', '']]
        }
      ],
      description: '<p>(Livre) Tentáculo d’água (teste +44), apenas criaturas Grandes ou menores.</p>'
    }),
    buildSpecialPower({
      name: 'Constrição',
      img: 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
      execucao: 'free',
      custo: 0,
      rolls: [
        {
          name: 'Dano de Constrição',
          key: 'dano0',
          type: 'dano',
          parts: [['2d10+25', 'impacto', '']]
        }
      ],
      description: '<p>(Livre) No início de cada um de seus turnos, o namasqall causa 2d10+25 pontos de dano de impacto em cada criatura que esteja agarrando.</p>'
    }),
    buildSpecialPower({
      name: 'Corpo Torrencial',
      img: 'systems/tormenta20/icons/magias/tempestade-divina.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>O clima em uma esfera de 90m ao redor do namasqall é de tempestade constante (sem chance de queda de raios) e, em uma esfera de 500m, é de chuva. Estes climas não podem ser alterados.</p>'
    }),
    buildSpecialPower({
      name: 'Maremoto',
      img: 'systems/tormenta20/icons/magias/controlar-agua.webp',
      execucao: 'action',
      custo: 0,
      alcance: 'short',
      area: 'cone de 12m',
      cd: 31,
      resistencia: {
        pericia: 'refl',
        atributo: 'for',
        bonus: 0,
        txt: 'Ref CD 31 reduz à metade e evita o empurrão'
      },
      rolls: [
        {
          name: 'Dano de Frio',
          key: 'dano0',
          type: 'dano',
          parts: [['5d6+15', 'frio', '']]
        },
        {
          name: 'Dano de Impacto',
          key: 'dano1',
          type: 'dano',
          parts: [['5d6+15', 'impacto', '']]
        }
      ],
      description: '<p>(Padrão) O namasqall cria uma onda que varre um cone de 12m. Criaturas na área sofrem 10d6+30 de dano, metade frio e metade impacto, e são empurradas 6m (Ref CD 31 reduz à metade e evita o empurrão).</p>',
      flavorPhrase: '"A tempestade não reconhece fronteiras!"',
      flavorAction: 'Uma parede líquida gigantesca varre o templo em fúria'
    }),
    buildSpecialPower({
      name: 'Olho da Tempestade',
      img: 'systems/tormenta20/icons/itens/itens-magicos/orbe-da-tempestade.webp',
      execucao: 'passive',
      custo: 0,
      description: '<p>Se estiver na área de um efeito mágico que altera o clima, o namasqall fica atordoado por 1 rodada (Fort CD do efeito, se houver, evita). Ele só pode ser atordoado dessa forma uma vez por cena.</p>'
    })
  ];

  threats.push({
    id: 'fld29NamasqallAb',
    name: 'Namasqall Abandonado',
    img: 'systems/tormenta20/icons/magias/tempestade-divina.webp',
    nd: '9',
    papel: 'solo',
    tipoMonstro: 'esp',
    raca: 'Espírito (elemental)',
    tamanho: 'col',
    deslocamento: '12m (8q), natação 18m (12q)',
    sentidos: 'visão no escuro',
    tesouro: '1d4+1 doses de éter elemental (frio) (CD 26 para extrair).',
    atributos: namasAtr,
    attributes: {
      pv: { value: 550, max: 550 },
      pm: { value: 0, max: 0 },
      defesa: { value: 37, base: 33 }, // 37 - Des 4 = 33
      cd: 31
    },
    resistencias: namasTracos,
    resistenciasTexto: 'imunidade a acertos críticos, atordoado, cansaço, efeitos de metabolismo, frio e paralisia, vulnerabilidade a fogo',
    pericias: namasSkills,
    items: namasItems,
    ataquescac: 'Quatro tentáculos d’água +34 (1d10+25, impacto)',
    tokenTexture: 'modules/compendios-para-t20/assets/tokens/namasqall-abandonado.png',
    biography: `<blockquote style="background-color:#f0f0f0;border-left:5px solid #800000;padding:10px;margin-bottom:20px;font-style:italic">"A maré ruge com fúria vazia. As ondas se agitam, tentando chamar a atenção de algo que não está mais lá."<br /><span style="font-weight:bold;color:#800000">— Sobre o Namasqall Abandonado</span></blockquote><blockquote style="background-color:#f0f0f0;border-left:5px solid #006400;padding:10px;margin-bottom:20px;font-style:italic">"Um furacão líquido dentro do próprio oceano! Mesmo enfraquecido pelo sumiço do Deus dos Mares, aquele colosso de água arrancou colunas inteiras antes de se dissipar no vórtice!"<br /><span style="font-weight:bold;color:#006400">— Grunk Ferroforja, Goblin Escriba</span></blockquote><p style="font-family:Arial, sans-serif;line-height:1.6">O <span style="color:#800000;font-weight:bold">Namasqall Abandonado</span> é um elemental colossal das tempestades invocado quando o <em>Búzio da Maré Furiosa</em> é soprado sem um devoto de patamar lenda para controlá-lo. Privado da presença plena do Deus Oceano, manifesta-se enfraquecido (mas ainda letal) por 1d4+2 rodadas.</p>`
  });

  for (const t of threats) {
    const built = buildNpcActor({
      id: t.id,
      name: t.name,
      folder: null,
      nd: t.nd,
      cd: t.attributes.cd,
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
      equipamento: '',
      tokenTexture: t.tokenTexture,
      biography: t.biography
    });
    built.actorDoc.img = t.img;
    built.actorDoc.folder = null;

    for await (const [oldKey] of db.iterator({ gte: `!actors.items!${t.id}.`, lte: `!actors.items!${t.id}.\uffff` })) {
      await db.del(oldKey);
    }
    for await (const [oldEffKey] of db.iterator({ gte: `!actors.items.effects!${t.id}.`, lte: `!actors.items.effects!${t.id}.\uffff` })) {
      await db.del(oldEffKey);
    }

    await db.put(`!actors!${built.actorDoc._id}`, built.actorDoc);
    for (const ed of built.embeddedDocs) {
      await db.put(ed.key, ed.doc);
    }
    console.log(`✓ Ator "${t.name} (ND ${t.nd})" salvo em rt20-029-ameacas com ${built.embeddedDocs.length} subdocumentos.`);
  }

  // 3. Perigos Complexos (Hazards ND 9)
  const hazards = [
    {
      id: 'fld29ViagemMarHa',
      name: 'Viagem ao Fundo do Mar (Desafio Subaquático ND 9)',
      nd: '9',
      img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
      token: 'modules/compendios-para-t20/assets/tokens/guardiao-lamento-abissal.png',
      goal: 'Partindo da cidade de Salmarina, alcançar o templo submerso do Oceano após 1 hora de viagem (natação ou jangada/bote).',
      effects: 'O grupo deve acumular 4 sucessos, sem limite de falhas — mas cada falha resulta em um encontro aleatório na coluna "Terreno: Aquático" de Ameaças de Arton, p. 423 (+30 por patamar veterano). Personagens submersos sem respiração aquática ou Suporte Ambiental não podem falar/lançar magias e sofrem -2 em ataque e -5 em Percepção; armas de corte/impacto causam metade do dano.',
      actions: `
        <li><strong>Atletismo CD 25:</strong> Movimentar-se na água com eficácia (+5 para quem tem deslocamento de natação).</li>
        <li><strong>Conhecimento CD 25:</strong> Reconhecer animais marinhos perigosos e evitá-los.</li>
        <li><strong>Fortitude CD 25:</strong> Suportar a pressão da água em grandes profundidades.</li>
        <li><strong>Investigação CD 22:</strong> Procurar sinais de trilhas terrestres antigas antes do maremoto.</li>
        <li><strong>Pilotagem CD 20:</strong> Conduzir bote ou jangada até o ponto certo (apenas 1 vez).</li>
        <li><strong>Religião CD 25:</strong> Reconhecer onde um templo do Oceano seria erigido (+5 para devotos do Oceano).</li>
        <li><strong>Sobrevivência CD 22:</strong> Orientar-se no mar, navegando ou nadando até o ponto certo.</li>
      `
    },
    {
      id: 'fld29RespeitoMar',
      name: 'Portal do Templo do Oceano: Respeito das Marés (ND 9)',
      nd: '9',
      img: 'systems/tormenta20/icons/magias/aura-divina.webp',
      token: 'modules/compendios-para-t20/assets/tokens/guardiao-lamento-abissal.png',
      goal: 'Demonstrar postura espiritual respeitosa perante o Oceano superando as Três Provas da entrada antes de adentrar o templo.',
      effects: 'Passar pela entrada sem realizar as provas causa 12d6 pontos de dano de essência (Fortitude CD 30 reduz à metade). Cada prova vencida reduz o dano em -4d6 (completar todas as 3 provas cancela todo o dano). Devotos do Oceano recebem +5 em todos os testes nesta cena. Religião/Misticismo CD 15/18/20/25 revela as regras do portal.',
      actions: `
        <li><strong>Prova I — Consentimento:</strong> Atuação CD 20, Conhecimento CD 22, Diplomacia CD 28, Guerra ou Intimidação CD 22, Nobreza CD 20, ou Religião CD 20 (-2 para devotos de outros deuses masculinos).</li>
        <li><strong>Prova II — Oferenda:</strong> Sacrificar item valioso (mínimo 5.000 T$), perder 10 PV máximos permanentes, perder 5 PM máximos permanentes, ou oferecer um poder de classe.</li>
        <li><strong>Prova III — Promessa:</strong> Tornar-se devoto do Oceano, seguir suas Obrigações &amp; Restrições, pedir transformação em sereia ou elfo-do-mar, ou aceitar uma Missão Divina.</li>
      `
    }
  ];

  for (const hz of hazards) {
    const built = buildHazardActor({
      name: hz.name,
      nd: hz.nd,
      img: hz.img,
      folder: null,
      goal: hz.goal,
      effects: hz.effects,
      actions: hz.actions
    });
    built.actorDoc._id = hz.id;
    built.actorDoc.img = hz.img;
    built.actorDoc.folder = null;
    built.actorDoc.prototypeToken.texture.src = hz.token;
    await db.put(`!actors!${hz.id}`, built.actorDoc);
    console.log(`✓ Perigo "${hz.name}" salvo em rt20-029-ameacas.`);
  }

  await db.close();
}

// ============================================================================
// 2. EQUIPAMENTOS & PODERES / PARCEIROS (rt20-029-equipamentos / rt20-029-poderes)
// ============================================================================
async function saveItemToPack(db, def) {
  const rawEffects = def.rawEffects || [];
  const builtEffects = [];
  const effectIds = [];

  for await (const [oldEffKey] of db.iterator({ gte: `!items.effects!${def._id}.`, lte: `!items.effects!${def._id}.\uffff` })) {
    await db.del(oldEffKey);
  }

  for (const eff of rawEffects) {
    const effDoc = buildActiveEffect({
      id: eff._id,
      name: eff.name,
      img: def.img,
      origin: `Item.${def._id}`,
      changes: eff.changes || [],
      transfer: eff.transfer !== undefined ? eff.transfer : true
    });
    builtEffects.push(effDoc);
    effectIds.push(effDoc._id);
    await db.put(`!items.effects!${def._id}.${effDoc._id}`, effDoc);
  }

  const built = buildItem({
    name: def.name,
    type: def.type,
    img: def.img,
    description: def.description,
    folder: null,
    system: def.system,
    rolls: def.rolls || []
  });
  built._id = def._id;
  built.img = def.img;
  built.folder = null;
  built.effects = effectIds;
  built._stats = statsHeader;

  await db.put(`!items!${def._id}`, built);
  console.log(`✓ Item "${def.name}" salvo com ${builtEffects.length} efeitos.`);
}

async function injectItemsAndPowers() {
  console.log('\n--- Injetando Equipamentos e Parceiros da Edição 29 ---');
  const eqDb = await openHierarchicalPack('rt20-029-equipamentos');
  const pwDb = await openHierarchicalPack('rt20-029-poderes');

  const equipamentos = [
    {
      _id: 'fld29BuzioMareFu',
      name: 'Búzio da Maré Furiosa (Búzio da Maré Eterna)',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/orbe-da-tempestade.webp',
      description: `<p><strong>Relíquia Antiga de Oceano:</strong> Grande concha espiralada, perfeita e iridescente, mantida no relicário de pedra coralina do templo submerso próximo a Salmarina. Apresentada enganosamente por Mynath (disfarçado de Thalgrimm) como <em>Búzio da Maré Eterna</em>.</p>
<ul>
  <li><strong>Natureza Real (Religião CD 25; +5 devotos do Oceano):</strong> Na verdade trata-se do <em>Búzio da Maré Furiosa</em>, artefato destinado a atrair a fúria do Oceano sobre inimigos invocando um elemental <em>namasqall</em>.</li>
  <li><strong>Aura Mágica (Misticismo CD 15):</strong> Emite uma aura mágica avassaladora de invocação.</li>
  <li><strong>Soprar o Búzio:</strong> Exige Atuação (CD 15) ou Fortitude (CD 20). Invoca um Namasqall (enfraquecido para <em>Namasqall Abandonado</em> enquanto Oceano está ausente), que só obedece a devotos do Oceano de patamar lenda; sem controlador apto, age de forma imprevisível por 1d4+2 rodadas antes de desaparecer.</li>
  <li><strong>Recarga:</strong> Uma vez utilizado, o Búzio não pode ser soprado outra vez até a próxima maré cheia (pelo menos 12 horas).</li>
</ul>`,
      system: {
        tipo: 'esoterico',
        equipado2: { slot: 0, type: 'hand' },
        preco: 0,
        peso: 1,
        espacos: 1,
        source: 'Fúlgor dos Deuses — Edição 29'
      },
      rawEffects: []
    },
    {
      _id: 'fld29EstilhaMynA',
      name: 'Estilhas Cristalinas de Mynath',
      type: 'equipamento',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      description: '<p><strong>Resíduo Fullgori:</strong> Fragmentos cristalinos dourados e frios ao toque deixados por Mynath ao recuar do templo submerso de Oceano (1d6 estilhas para cada sucesso no confronto narrativo; 3d6 para cada 20 natural) e também entregues em silêncio no funeral de Thalgrimm Sangue de Ferro. Podem ser usadas na forja de Aço Sillariano ou investigadas pela campanha.</p>',
      system: {
        tipo: 'acessorio',
        equipado2: { slot: 0, type: 'body' },
        preco: 0,
        peso: 0.1,
        espacos: 0,
        source: 'Fúlgor dos Deuses — Edição 29'
      },
      rawEffects: []
    }
  ];

  const poderes = [
    {
      _id: 'fld29ParcLiriavA',
      name: 'Parceira: Liriavel Cintilara (Campanha Dor Profunda)',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/silfide.webp',
      description: `<p><strong>Representante Oficial da Academia Arcana:</strong> Designada pelo reitor Vladislav Tpish após os eventos de <em>Aço e Arcano</em>, a sílfide veterana acompanha os campeões em <em>Dor Profunda</em> com novos implementos arcanos:</p>
<ul>
  <li><strong>Ajudante Veterana:</strong> Concede <strong>+2 em Conhecimento, Diplomacia e Misticismo</strong> (fora da Academia Arcana).</li>
  <li><strong>Suporte de Combate:</strong> Em situações de combate, pode atuar como parceira <strong>Destruidora Veterana</strong> (+2d6 dano em magias) ou <strong>Magivocadora Veterana</strong> (+1d8 dano em magias e +1 na CD), à escolha dos personagens.</li>
  <li><strong>Forma de Quimera (1x/dia, 1 cena):</strong> Pode transformar-se em quimera e atuar como parceira <strong>Combatente Veterana</strong> (+2 em ataques e rolagens de dano).</li>
  <li><strong>Conjuração Gratuita (1x/dia):</strong> Lança uma magia arcana de até 3º círculo à escolha dos jogadores, sem custo em PM.</li>
</ul>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'passive', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 29'
      },
      rawEffects: [
        {
          _id: 'eff29LiriavelV2A',
          name: 'Liriavel — Ajudante Veterana (+2 Conh/Dipl/Mist)',
          changes: [
            { key: 'system.pericias.conh.bonus', mode: 2, value: '2', priority: 20 },
            { key: 'system.pericias.dipl.bonus', mode: 2, value: '2', priority: 20 },
            { key: 'system.pericias.mist.bonus', mode: 2, value: '2', priority: 20 }
          ]
        }
      ]
    },
    {
      _id: 'fld29ParcThalgri',
      name: 'Parceiro: "Thalgrimm" Sangue de Ferro (Médico Veterano)',
      type: 'poder',
      img: 'systems/tormenta20/icons/racas/anao.webp',
      description: `<p><strong>Parceiro Médico Veterano (Edição 29):</strong> Em <em>Dor Profunda</em>, Thalgrimm acompanha o grupo pessoalmente como parceiro médico veterano (uma vez por rodada, com uma ação livre, cura 3d8+3 PV ou remove uma condição como abalado, apavorado, atordoado, cego, doente, exausto, fatigado, fraco, pasmo ou sangrando de um aliado em alcance curto).</p>
<p><strong>Suporte Ambiental:</strong> "Thalgrimm" pode conjurar a magia divina <em>Suporte Ambiental</em> nos personagens para permitir respiração e fala subaquática, mas, se fizer isso, esgota sua mana e fica indisponível como parceiro pelo restante da missão. <em>(Nota do Mestre: na Parte 4 revela-se que era Mynath disfarçado desde a Academia Arcana.)</em></p>`,
      system: {
        tipo: 'geral',
        subtipo: 'parceiro',
        ativacao: { execucao: 'free', custo: 0 },
        source: 'Fúlgor dos Deuses — Edição 29'
      },
      rawEffects: []
    }
  ];

  for (const eq of equipamentos) await saveItemToPack(eqDb, eq);
  for (const pw of poderes) await saveItemToPack(pwDb, pw);

  await eqDb.close();
  await pwDb.close();
}

// ============================================================================
// 3. DIÁRIO (rt20-029-diarios)
// ============================================================================
async function injectJournals() {
  console.log('\n--- Injetando Diário da Edição 29 em rt20-029-diarios ---');
  const db = await openHierarchicalPack('rt20-029-diarios');

  const journalId = 'fld29DiarioDorPr';
  const pageIds = [
    'p29SinopseAvent1',
    'p29Parte1MundoS1',
    'p29Parte2SobOnd1',
    'p29Parte3Chamad1',
    'p29Parte4OuroTr1',
    'p29RegrasSubaq01',
    'p29BestiarioNpc1'
  ];

  const journalDoc = {
    _id: journalId,
    name: 'Fúlgor dos Deuses — Edição 29: Dor Profunda',
    folder: null,
    sort: 400000,
    ownership: { default: -1 },
    flags: {},
    pages: pageIds,
    _stats: statsHeader
  };

  const pages = [
    {
      _id: 'p29SinopseAvent1',
      name: 'Apresentação & Sinopse: Dor Profunda',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Dor Profunda — Oceano Perdido</h2>
<p><em>Revista Tormenta20 — Edição 29 (Julho de 2026). Criação por Marcelo Cassaro; Desenvolvimento por Daniel Duran.</em></p>
<blockquote style="background-color: #f4f4f4; border-left: 4px solid #800000; padding: 10px; font-style: italic;">
"O Deus dos Mares está atualmente desaparecido. Isso significa que o Fullgor não pode alcançá-lo? Talvez. Esta pergunta simples vai guiar a próxima aventura dos escolhidos de Arsenal."
</blockquote>
<h3>Na Última Aventura...</h3>
<p>Infiltrados na Academia Arcana em <em>Aço e Arcano</em>, os heróis derrotaram o kemooz corrompido Rashid antes que a infecção alcançasse Wynna. Embora a Academia tenha sido salva, o Fullgor provou conseguir atingir os pilares do mundo.</p>
<h3>Sinopse de Dor Profunda</h3>
<p>Após receber suprimentos do reitor Vladislav Tpish e ganhar a companhia oficial de @UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcLiriavA]{Liriavel Cintilara}, os aventureiros são convocados por @UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcThalgri]{Thalgrimm Sangue de Ferro} ao porto de Salmarina. Sua missão: mergulhar até um templo submerso anterior à queda da Flecha de Fogo, vencer as provas espirituais de Oceano e recuperar o suposto <em>Búzio da Maré Eterna</em> — sem saber que uma traição trágica de <strong>Mynath, o Eco Dourado</strong>, está em curso.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 100000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29Parte1MundoS1',
      name: 'Parte 1: Mundo Seco',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 1: Mundo Seco</h2>
<h3>Cena 1: Consequências</h3>
<p>O grupo descansa na Vila dos Professores da Academia Arcana (recuperando PV, PM e condições) antes de ser recebido por <strong>Vladislav Tpish</strong> em sua reitoria austera. O necromante esclarece sobre Rashid, sobre a natureza do Fullgor e entrega ao grupo itens mágicos equivalentes ao <strong>triplo de tesouro de ND 8</strong> (<strong>ND 9</strong> se abriram mão de seus Desejos para salvar Rashid, incluindo um item mágico menor).</p>
<h3>Cena 2: Parceira Feérica</h3>
<p>Do lado de fora, @UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcLiriavA]{Parceira: Liriavel Cintilara (Campanha Dor Profunda)} apresenta-se como representante da Academia (Ajudante Veterana +2, Destruidora/Magivocadora Veterana em combate, 1x/dia Quimera Combatente Veterana e 1x/dia magia arcana de até 3º círculo sem custo em PM) e entrega um pergaminho encolhido enviado por Thalgrimm convocando os heróis para <strong>Salmarina</strong>.</p>
<h3>Cena 3: Pamgramônio (Opcional)</h3>
<p>Como efeito colateral da magia elemental residual de Rashid, <strong>2 @UUID[Compendium.compendios-para-t20.Ameacas_T20.Actor.wLQAgksJliTgw2pm]{Pamgras}</strong> atacam os pátios sem as salvaguardas da Academia (dano letal). Testes úteis: Conhecimento CD 15/20, Cura/Guerra/Luta/Pontaria CD 15, Misticismo CD 22. Derrotados, rendem doses de éter elemental.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 200000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29Parte2SobOnd1',
      name: 'Parte 2: Sob as Ondas',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 2: Sob as Ondas</h2>
<h3>Cena 1: Salmarina</h3>
<p>Usando um portal regional autorizado por Vladislav, o grupo chega a <strong>Salmarina</strong>, no extremo sul de Ahlen, e encontra <strong>Thalgrimm</strong> (@UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcThalgri]{Parceiro Médico Veterano}). Ele relata sinais dourados suspeitos no litoral e a busca do Fullgor pelo paradeiro oculto do Deus Oceano.</p>
<h3>Cena 2: Viagem ao Fundo do Mar (ND 9)</h3>
<p>Confira o perigo @UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29ViagemMarHa]{Viagem ao Fundo do Mar (Desafio Subaquático ND 9)}: viagem de 1 hora exigindo <strong>4 sucessos</strong> (cada falha gera encontro aquático em <em>Ameaças de Arton</em>, p. 423, +30 veterano). Thalgrimm pode conjurar <em>Suporte Ambiental</em>, ficando sem PM e indisponível como parceiro.</p>
<h3>Cena 3: Respeito das Marés (ND 9)</h3>
<p>A entrada rúnica do templo exige três provas (@UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29RespeitoMar]{Respeito das Marés ND 9}); passar sem cumpri-las causa <strong>12d6 de essência</strong> (Fort CD 30 metade), reduzido em –4d6 por prova vencida:</p>
<ul>
  <li><strong>Prova I — Consentimento:</strong> Prece sincera (Atuação CD 20, Conhecimento CD 22, Diplomacia CD 28, Guerra/Intimidação CD 22, Nobreza CD 20 ou Religião CD 20).</li>
  <li><strong>Prova II — Oferenda:</strong> Item ≥ 5.000 T$, –10 PV máx., –5 PM máx. ou 1 poder de classe.</li>
  <li><strong>Prova III — Promessa:</strong> Devoção/O&amp;R de Oceano, transformação em sereia/elfo-do-mar ou Missão Divina.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 300000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29Parte3Chamad1',
      name: 'Parte 3: Chamado e Resposta',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 3: Chamado e Resposta</h2>
<h3>Cena 1: Guardião Atribulado</h3>
<p>Dentro da câmara circular, o relicário guarda a concha iridescente — defendida pelo fanático @UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29GuardiaoAbi]{Guardião do Lamento Abissal (ND 9)}. Role suas falas na tabela @UUID[Compendium.compendios-para-t20.rt20-029-tabelas.RollTable.fld29TabFrasesGu]{Frases de Combate} e use os efeitos da arena via @UUID[Compendium.compendios-para-t20.rt20-029-tabelas.RollTable.fld29TabArenaTem]{Ações de Arena do Templo}. Testes de Diplomacia/Enganação/Intimidação/Religião CD 25+ deixam-no abalado (ou apavorado no 2º sucesso) por 1 rodada.</p>
<h3>Cena 2: Maré Eterna Furiosa</h3>
<p>"Thalgrimm" ordena soprar o @UUID[Compendium.compendios-para-t20.rt20-029-equipamentos.Item.fld29BuzioMareFu]{Búzio da Maré Furiosa}. Heróis desconfiados podem notar 9 pistas (Conhecimento CD 30 [+10 anões], Guerra/Religião CD 20, Intuição CD 25, Misticismo CD 15/20, Percepção CD 20/30, Investigação/Religião CD 30, Religião CD 25 [+5 devotos de Oceano]). Com 3+ sucessos, pule a Cena 3 diretamente para a Parte 4!</p>
<h3>Cena 3: Invocação Indesejada</h3>
<p>Caso soprem o Búzio (Atuação CD 15 ou Fortitude CD 20), o vórtice manifesta um @UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29NamasqallAb]{Namasqall Abandonado (ND 9)} que permanece por 1d4+2 rodadas enquanto "Thalgrimm" observa com um sorriso suspeito.</p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 400000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29Parte4OuroTr1',
      name: 'Parte 4: Ouro e Tragédia',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Parte 4: Ouro e Tragédia</h2>
<h3>Cena 1: Eco Dourado</h3>
<p>A ilusão do anão racha em ouro líquido: todo esse tempo, os heróis caminharam com <strong>Mynath, o Eco Dourado</strong>, que usou a legitimidade do grupo para testar o paradeiro do Deus dos Mares e mapear seus ecos.</p>
<h3>Cena 2: Contra Mynath (Combate Narrativo em 3 Estágios)</h3>
<p>Em vez de PV convencionais, Mynath possui <strong>3 Estágios</strong> (cada um vencido com <strong>4 sucessos</strong>; falha ainda avança ou reduz recompensa e causa <strong>5d6 de dano</strong> apropriado):</p>
<ul>
  <li><strong>Estágio I — O Manipulador Confiante:</strong> CD 30 (ataque) / CD 25 (refutação); Dano <em>Psíquico</em>.</li>
  <li><strong>Estágio II — O Farsante Covarde:</strong> CD 30 (evitar/resistir) / CD 25 (rejeitar farsa); Dano <em>Impacto</em>.</li>
  <li><strong>Estágio III — O Eco Solitário:</strong> CD 30 (amparo) / CD 25 (coordenação); Dano <em>Luz</em>.</li>
</ul>
<p>Ao recuar, Mynath deixa @UUID[Compendium.compendios-para-t20.rt20-029-equipamentos.Item.fld29EstilhaMynA]{1d6 Estilhas Cristalinas por sucesso} (3d6 por 20 natural). Utilize @UUID[Compendium.compendios-para-t20.rt20-029-tabelas.RollTable.fld29TabFrasesMy]{Provocações de Mynath} e a macro @UUID[Compendium.compendios-para-t20.rt20-029-macros.Macro.fld29MacroMynath]{Rastreador: Combate contra Mynath}.</p>
<h3>Cena 3: Arsenal o Tenha</h3>
<p>Teletransportados por Liriavel para Valkaria diante do Templo de Arsenal, os heróis presenciam a pira fúnebre do verdadeiro <strong>Thalgrimm Sangue de Ferro</strong>, assassinado ainda durante os eventos da Academia Arcana, e recebem uma única estilha dourada embrulhada em pano. <strong>Todos os personagens chegam ao 10º nível.</strong></p>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 500000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29RegrasSubaq01',
      name: 'Regras Especiais: Combate Subaquático, Provas & Estágios',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Regras Especiais da Edição 29</h2>
<h3>Regras de Combate e Exploração Subaquática (p. 11)</h3>
<ul>
  <li>Personagens submersos não podem falar nem lançar magias e sofrem <strong>–2 em testes de ataque</strong> e <strong>–5 em Percepção</strong>.</li>
  <li>Quem não respira ou respira na água pode falar e lançar magias; quem possui <em>deslocamento de natação</em> move-se normalmente sem penalidades.</li>
  <li><em>Suporte Ambiental</em> permite respirar, falar e conjurar na água, mas não afeta movimentação. <em>Libertação</em> (4º círculo) garante ação normal.</li>
  <li>Armas à distância não funcionam embaixo d'água, exceto armas de arremesso de perfuração, bestas e redes.</li>
  <li>Armas de corte e impacto causam <strong>metade do dano</strong> embaixo d'água.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 600000,
      flags: {},
      _stats: statsHeader
    },
    {
      _id: 'p29BestiarioNpc1',
      name: 'Bestiário, Relíquias & NPCs da Edição 29',
      type: 'text',
      title: { show: true, level: 1 },
      text: {
        content: `<h2>Bestiário, Perigos & Tesouros (RT20 #29)</h2>
<ul>
  <li>@UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29GuardiaoAbi]{Guardião do Lamento Abissal (ND 9)} — Monstro Enorme, 560 PV, Defesa 33, Templo consagrado e ações de arena.</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29NamasqallAb]{Namasqall Abandonado (ND 9)} — Espírito Elemental Colossal, 550 PV, Defesa 37, Maremoto CD 31.</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29ViagemMarHa]{Viagem ao Fundo do Mar (Perigo ND 9)} &amp; @UUID[Compendium.compendios-para-t20.rt20-029-ameacas.Actor.fld29RespeitoMar]{Portal Respeito das Marés (Perigo ND 9)}.</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-029-equipamentos.Item.fld29BuzioMareFu]{Búzio da Maré Furiosa} &amp; @UUID[Compendium.compendios-para-t20.rt20-029-equipamentos.Item.fld29EstilhaMynA]{Estilhas Cristalinas de Mynath}.</li>
  <li>@UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcLiriavA]{Parceira: Liriavel Cintilara} &amp; @UUID[Compendium.compendios-para-t20.rt20-029-poderes.Item.fld29ParcThalgri]{Parceiro: "Thalgrimm" Sangue de Ferro}.</li>
</ul>`,
        format: 1
      },
      ownership: { default: -1 },
      sort: 700000,
      flags: {},
      _stats: statsHeader
    }
  ];

  for await (const [oldPageKey] of db.iterator({ gte: `!journal.pages!${journalId}.`, lte: `!journal.pages!${journalId}.\uffff` })) {
    await db.del(oldPageKey);
  }
  await db.put(`!journal!${journalId}`, journalDoc);
  for (const p of pages) {
    await db.put(`!journal.pages!${journalId}.${p._id}`, { ...p, _dbKey: `!journal.pages!${journalId}.${p._id}` });
  }
  console.log(`✓ Diário "${journalDoc.name}" salvo com ${pages.length} páginas.`);
  await db.close();
}

// ============================================================================
// 4. TABELAS DE ROLAGEM (rt20-029-tabelas)
// ============================================================================
async function injectTables() {
  console.log('\n--- Injetando Tabelas de Rolagem da Edição 29 em rt20-029-tabelas ---');
  const db = await openHierarchicalPack('rt20-029-tabelas');

  const tables = [
    {
      id: 'fld29TabFrasesGu',
      name: 'Guardião do Lamento Abissal — Frases de Combate (Edição 29)',
      formula: '1d10',
      img: 'systems/tormenta20/icons/magias/controlar-agua.webp',
      description: '<p>Falas oficiais do Guardião do Lamento Abissal durante o combate no templo submerso (p. 14).</p>',
      results: [
        { id: 'res29Grd00000001', name: 'O Silêncio Dói', text: '"Ele não responde… e o silêncio dói!"', range: [1, 1] },
        { id: 'res29Grd00000002', name: 'O Mar Chora', text: '"O mar chora — e vocês respiram!"', range: [2, 2] },
        { id: 'res29Grd00000003', name: 'Onde Estavam', text: '"Onde estavam quando o chamado cessou?"', range: [3, 3] },
        { id: 'res29Grd00000004', name: 'Mestre Abandonado', text: '"O mestre não partiu. Foi abandonado!"', range: [4, 4] },
        { id: 'res29Grd00000005', name: 'Nadam Livres', text: '"Vocês nadam livres enquanto o oceano sangra!"', range: [5, 5] },
        { id: 'res29Grd00000006', name: 'Não Merecem', text: '"Não merecem o que buscam!"', range: [6, 6] },
        { id: 'res29Grd00000007', name: 'Última Esperança', text: '"A concha guarda a última esperança. Não a tocarão!"', range: [7, 7] },
        { id: 'res29Grd00000008', name: 'Ninguém Vive', text: '"Se o mestre não volta, ninguém vive!"', range: [8, 8] },
        { id: 'res29Grd00000009', name: 'O Mar Acusa', text: '"O mar lembra. O mar acusa."', range: [9, 9] },
        { id: 'res29Grd00000010', name: 'Profanos do Mundo Seco', text: '"Profanos! Trouxeram o mundo seco até aqui!"', range: [10, 10] }
      ]
    },
    {
      id: 'fld29TabArenaTem',
      name: 'Templo do Oceano — Ações de Arena do Guardião (Edição 29)',
      formula: '1d4',
      img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
      description: '<p>Os quatro elementos interativos do templo submerso controlados pelo Guardião do Lamento Abissal (p. 20).</p>',
      results: [
        { id: 'res29Ar000000001', name: 'Armadilha Oculta', text: 'Concha escondida no chão (Movimento, alcance médio): 2d6 perfuração e imóvel (Ref CD 24; soltar Padrão Atletismo/Ladinagem CD 24).', range: [1, 1] },
        { id: 'res29Ar000000002', name: 'Fonte Curativa', text: 'Fornece cura acelerada 10 para o guardião. Desativar: 2 ações completas + Religião CD 24 (gera pulso que cura 10 PV em todos).', range: [2, 2] },
        { id: 'res29Ar000000003', name: 'Passagens Secretas', text: 'Três passagens (Movimento): teletransporta-se para adjacência de outra passagem; vítima fica desprevenida contra seu ataque na rodada. Desativar: Completa + Ladinagem CD 24.', range: [3, 3] },
        { id: 'res29Ar000000004', name: 'Selo Místico', text: 'Movimento lança Sopro das Uivantes sem PM (cone 9m, 4d6 frio, Médias ou menores caídas e empurradas 6m, +2d6 impacto contra objeto; Fort CD 24). Desativar: Completa + Misticismo CD 24.', range: [4, 4] }
      ]
    },
    {
      id: 'fld29TabFrasesMy',
      name: 'Mynath, o Eco Dourado — Provocações por Estágio (Edição 29)',
      formula: '1d18',
      img: 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
      description: '<p>Todas as 18 provocações oficiais de Mynath nos Estágios I (1–6), II (7–12) e III (13–18) na Parte 4, Cena 2 (p. 18).</p>',
      results: [
        { id: 'res29Myn00000001', name: '[Estágio I] Obediência', text: '"Vocês sempre obedecem tão bem…"', range: [1, 1] },
        { id: 'res29Myn00000002', name: '[Estágio I] Exatamente Quem Precisavam', text: '"Olhem para mim. Sou exatamente quem vocês precisavam que eu seja."', range: [2, 2] },
        { id: 'res29Myn00000003', name: '[Estágio I] Confiança é Arma', text: '"Confiança é uma arma. Obrigado por empunhá-la por mim."', range: [3, 3] },
        { id: 'res29Myn00000004', name: '[Estágio I] Thalgrimm Acreditaria', text: '"Thalgrimm acreditaria nisso. Vocês também."', range: [4, 4] },
        { id: 'res29Myn00000005', name: '[Estágio I] Não Lutem', text: '"Não lutem. Pensem. É aí que eu venço."', range: [5, 5] },
        { id: 'res29Myn00000006', name: '[Estágio I] Ordens Sem Perguntar', text: '"Quantas vezes já seguiram ordens sem perguntar?"', range: [6, 6] },
        { id: 'res29Myn00000007', name: '[Estágio II] Esta Voz Confiava', text: '"Reconhecem esta voz? Ela confiava em vocês."', range: [7, 7] },
        { id: 'res29Myn00000008', name: '[Estágio II] Vestir um Herói', text: '"Vejam como é fácil vestir um herói."', range: [8, 8] },
        { id: 'res29Myn00000009', name: '[Estágio II] Hesitação', text: '"Vocês hesitam. Sempre hesitam."', range: [9, 9] },
        { id: 'res29Myn00000010', name: '[Estágio II] Alguém que Respeitam', text: '"Atacarão mesmo… se parecer alguém que respeitam?"', range: [10, 10] },
        { id: 'res29Myn00000011', name: '[Estágio II] Dor da Traição', text: '"A traição dói mais quando vem de dentro."', range: [11, 11] },
        { id: 'res29Myn00000012', name: '[Estágio II] Todos Estes Rostos', text: '"Vocês me deram todos estes rostos."', range: [12, 12] },
        { id: 'res29Myn00000013', name: '[Estágio III] Chega!', text: '"Chega! Vocês não deveriam resistir assim!"', range: [13, 13] },
        { id: 'res29Myn00000014', name: '[Estágio III] Sozinhos Perfeitos', text: '"Sozinhos vocês seriam perfeitos!"', range: [14, 14] },
        { id: 'res29Myn00000015', name: '[Estágio III] Fora do Cálculo', text: '"Isso não estava no cálculo!"', range: [15, 15] },
        { id: 'res29Myn00000016', name: '[Estágio III] Unidos... Esse Erro!', text: '"Unidos… sempre esse erro!"', range: [16, 16] },
        { id: 'res29Myn00000017', name: '[Estágio III] Corrige Falhas', text: '"O Fullgor corrige falhas. Vocês insistem nelas!"', range: [17, 17] },
        { id: 'res29Myn00000018', name: '[Estágio III] Já Ouvi o Suficiente', text: '"Não importa. Já ouvi o suficiente."', range: [18, 18] }
      ]
    }
  ];

  for (const t of tables) {
    for await (const [oldResKey] of db.iterator({ gte: `!tables.results!${t.id}.`, lte: `!tables.results!${t.id}.\uffff` })) {
      await db.del(oldResKey);
    }

    const tableDoc = {
      _id: t.id,
      name: t.name,
      folder: null,
      sort: 400000,
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
    for (const r of t.results) {
      await db.put(`!tables.results!${t.id}.${r.id}`, {
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
      });
    }
    console.log(`✓ Tabela "${t.name}" salva com ${t.results.length} resultados.`);
  }

  await db.close();
}

// ============================================================================
// 5. MACROS (rt20-029-macros)
// ============================================================================
async function injectMacros() {
  console.log('\n--- Injetando Macro da Edição 29 em rt20-029-macros ---');
  const db = await openHierarchicalPack('rt20-029-macros');

  const macroId = 'fld29MacroMynath';
  const macroScript = `/**
 * Rastreador: Combate Narrativo contra Mynath & Regras Subaquáticas — Fúlgor dos Deuses (Edição 29)
 */
const FLAG_KEY = "fullgor29MynathStage";
const stage = Number(game.user.getFlag("world", FLAG_KEY) || 1);

const STAGES = {
  1: { title: "Estágio I — O Manipulador Confiante", dmgType: "psíquico", skills: "Luta/Misticismo/Pontaria/Religião CD 30 ou Atuação/Enganação/Intimidação/Vontade CD 25" },
  2: { title: "Estágio II — O Farsante Covarde", dmgType: "impacto", skills: "Acrobacia/Iniciativa/Reflexos/Fortitude CD 30 ou Conhecimento/Guerra/Religião/Vontade CD 25" },
  3: { title: "Estágio III — O Eco Solitário", dmgType: "luz", skills: "Cura/Intuição/Nobreza/Sobrevivência CD 30 ou Iniciativa/Guerra/Luta/Pontaria CD 25" }
};
const cur = STAGES[stage] || STAGES[1];

const dialogHtml = \`
  <form>
    <p><strong>\${cur.title}</strong></p>
    <p><small>4 sucessos vencem o estágio. Testes: \${cur.skills}.</small></p>
  </form>
\`;

async function onAdvance() {
  const next = stage >= 3 ? 1 : stage + 1;
  await game.user.setFlag("world", FLAG_KEY, next);
  const info = STAGES[next];
  ChatMessage.create({ content: \`<p><strong>🌊 Mynath muda de estágio (Ed. 29):</strong> \${info.title} (<em>\${info.skills}</em>).</p>\` });
}

async function onFailHit() {
  const roll = await new Roll("5d6").evaluate();
  await roll.toMessage({ flavor: \`Golpe de Mynath — Falha no \${cur.title} (dano \${cur.dmgType})\` });
}

async function onEstilhas() {
  const roll = await new Roll("1d6").evaluate();
  await roll.toMessage({ flavor: "Estilhas Cristalinas de Mynath (por sucesso; use 3d6 em 20 natural)" });
}

async function onSubaquatico() {
  ChatMessage.create({
    content: \`<div style="border:2px solid #0277bd;padding:8px;border-radius:6px;background:#f0f8ff;">
      <h4 style="margin:0 0 4px 0;color:#0277bd;">Regras Subaquáticas (Dor Profunda, p. 11)</h4>
      <ul style="margin:0;padding-left:16px;">
        <li>Submersos: sem fala/magia, –2 ataque e –5 Percepção.</li>
        <li>Natação natural anula penalidades de ataque/Percepção.</li>
        <li>Distância: apenas arremesso perfuração, bestas e redes.</li>
        <li>Corte e impacto causam metade do dano embaixo d'água.</li>
      </ul>
    </div>\`
  });
}

if (foundry?.applications?.api?.DialogV2) {
  foundry.applications.api.DialogV2.wait({
    window: { title: "Edição 29 — Mynath & Combate Subaquático" },
    content: dialogHtml,
    buttons: [
      { action: "stage", icon: "fas fa-forward", label: "Próximo Estágio", callback: onAdvance },
      { action: "hit", icon: "fas fa-burst", label: "Falha (5d6)", callback: onFailHit },
      { action: "estilhas", icon: "fas fa-gem", label: "Estilhas (1d6)", callback: onEstilhas },
      { action: "sub", icon: "fas fa-water", label: "Regras Subaquáticas", default: true, callback: onSubaquatico }
    ]
  });
} else {
  new Dialog({
    title: "Edição 29 — Mynath & Combate Subaquático",
    content: dialogHtml,
    buttons: {
      stage: { icon: '<i class="fas fa-forward"></i>', label: "Próximo Estágio", callback: onAdvance },
      hit: { icon: '<i class="fas fa-burst"></i>', label: "Falha (5d6)", callback: onFailHit },
      estilhas: { icon: '<i class="fas fa-gem"></i>', label: "Estilhas (1d6)", callback: onEstilhas },
      sub: { icon: '<i class="fas fa-water"></i>', label: "Regras Subaquáticas", callback: onSubaquatico }
    },
    default: "sub"
  }).render(true);
}
`;

  const macroDoc = {
    _id: macroId,
    name: 'Rastreador: Combate contra Mynath & Regras Subaquáticas (Edição 29)',
    type: 'script',
    folder: null,
    sort: 400000,
    img: 'systems/tormenta20/icons/magias/aura-divina.webp',
    scope: 'global',
    command: macroScript,
    author: 'kL8nfmJOQTqjeU2x',
    ownership: { default: 2 },
    flags: {},
    _stats: statsHeader
  };

  await db.put(`!macros!${macroId}`, macroDoc);
  console.log(`✓ Macro "${macroDoc.name}" salva.`);
  await db.close();
}

async function runAll() {
  console.log('================================================================================');
  console.log('🚀 INICIANDO INJEÇÃO CANÔNICA DE FÚLGOR DOS DEUSES — EDIÇÃO 29 (DOR PROFUNDA)');
  console.log('================================================================================');

  await injectThreats();
  await injectItemsAndPowers();
  await injectJournals();
  await injectTables();
  await injectMacros();

  console.log('================================================================================');
  console.log('🎉 INJEÇÃO DA EDIÇÃO 29 CONCLUÍDA COM SUCESSO NOS COMPÊNDIOS HIERÁRQUICOS!');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runAll().catch(err => {
    console.error('❌ Falha na injeção da Edição 29:', err);
    process.exit(1);
  });
}

module.exports = { runAll, injectThreats, injectItemsAndPowers, injectJournals, injectTables, injectMacros };

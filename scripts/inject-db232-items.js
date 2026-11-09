#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens e Poderes da DB #232 em Itens_T20
 *
 * Conteúdo:
 * 1. Regras e Poderes de Personagens Licantropos (DB #232):
 *    - Controlar Licantropia (Poder de Destino)
 *    - Licantropia: Aversão a Mitral
 *    - Licantropia: Empatia Animal
 *    - Licantropia: Maldição da Licantropia
 *    - Licantropia: Sentidos Aguçados
 *    - Licantropia: Transformação Incontrolável
 *    - Licantropia: Forma Híbrida
 *    - Licantropia: Forma de Fera (Lobo)
 *    - Licantropia: Forma de Fera (Onça)
 *    - Licantropia: Forma de Fera (Rato)
 *    - Licantropia: Forma de Fera (Selako)
 *    - Licantropia: Forma de Fera (Texugo)
 *    - Doença: Licantropia
 *
 * Conformidade Canônica:
 * - IDs estritos de 16 caracteres alfanuméricos (/^[a-zA-Z0-9]{16}$/)
 * - system.description.value preenchido
 * - Sincronização em packs/Itens_T20 e src/packs/Itens_T20/
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { saveToSourcePacks } = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const FOLDER_PODERES = '6HZCPG5QrmzhwmBe';
const SOURCE_DB232 = 'Dragão Brasil #232';

const DB232_ITEMS = [
  {
    id: 'i8232CtrlLicanAA',
    name: 'Controlar Licantropia',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'destino',
      ativacao: { execucao: 'full', custo: 3 },
      tags: ['licantropo', 'destino', 'transformacao'],
      description: {
        value: '<p>Você aprendeu uma forma de controlar sua licantropia. Você ainda é afetado quando presencia algum tipo de violência, mas, quando faz um teste de Vontade para impedir a transformação, rola dois dados e usa o melhor resultado. Se não estiver transformado pela maldição, você pode gastar uma ação completa e 3 PM para assumir sua forma híbrida ou de fera, mantendo o controle sobre suas ações. Cada transformação dura pelo tempo que você quiser, mas você reverte à forma normal se ficar inconsciente ou morrer. Por fim, habilidades e efeitos que afetam a Forma Selvagem de um druida se aplicam às suas formas de licantropo. <em>Pré-requisito:</em> saber que contraiu licantropia.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232AvMitralAAA',
    name: 'Licantropia: Aversão a Mitral',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/resistencia.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'fraqueza', 'mitral'],
      description: {
        value: '<p>O licantropo sofre 1 ponto de dano adicional por dado de dano de ataques com armas de mitral e perde 1d6 pontos de vida por rodada se estiver empunhando ou vestindo um item de mitral.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232EmpatAnimAA',
    name: 'Licantropia: Empatia Animal',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'adestramento', 'feras'],
      description: {
        value: '<p>O licantropo recebe +5 em testes de Adestramento com certas criaturas, conforme seu tipo de licantropia (lobos, onças, ratos, selakos ou texugos), e pode usar esta perícia para mudar atitude e persuasão com essas criaturas.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232MaldLicanAA',
    name: 'Licantropia: Maldição da Licantropia',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'maldicao', 'infeccao'],
      description: {
        value: '<p>Um humanoide que sofra dano da mordida do licantropo contrai licantropia (Fortitude CD Con evita).</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232SentidosAgA',
    name: 'Licantropia: Sentidos Aguçados',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'sentidos', 'faro'],
      description: {
        value: '<p>O licantropo recebe faro e visão na penumbra.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232TransInconA',
    name: 'Licantropia: Transformação Incontrolável',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/furia.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'involuntario', 'maldicao'],
      description: {
        value: '<p>O personagem sofre os efeitos da maldição. Ao presenciar violência física letal, na noite seguinte ele se transforma em forma híbrida, tornando-se um NPC sob controle do mestre em um surto de violência que dura até o amanhecer (Vontade CD 25 evita se estiver ciente).</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FormHibridA',
    name: 'Licantropia: Forma Híbrida',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'forma', 'hibrida'],
      description: {
        value: '<p>O licantropo se transforma em uma fera humanoide. Seu equipamento vestido desaparece, mas mantém seus efeitos. Recebe arma natural de mordida (1d6, x2 perfuração) e duas garras (1d6 cada, x2 corte). Uma vez por rodada, ao agredir com outra arma, pode gastar 1 PM para ataque extra de mordida e 1 PM para ataque extra com uma das garras.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FeraLoboAAA',
    name: 'Licantropia: Forma de Fera (Lobo)',
    type: 'poder',
    img: 'systems/tormenta20/icons/ameacas/lobo.png',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'lobo', 'forma'],
      description: {
        value: '<p>Tamanho Médio, deslocamento 15m, +2 na Força e mordida 1d6 (x2 perfuração). Uma vez por rodada, ao agredir pode gastar 1 PM para ataque extra com mordida. Ao acertar com a mordida, pode gastar 1 PM para manobra derrubar.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FeraOncaAAA',
    name: 'Licantropia: Forma de Fera (Onça)',
    type: 'poder',
    img: 'systems/tormenta20/icons/ameacas/lobo-crocodilo.png',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'onca', 'forma'],
      description: {
        value: '<p>Tamanho Médio, deslocamento 15m (natação 6m), mordida 1d6 e duas garras 1d6. Pode usar o poder Emboscar (-1 PM de custo se já possuir).</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FeraRatoAAA',
    name: 'Licantropia: Forma de Fera (Rato)',
    type: 'poder',
    img: 'systems/tormenta20/icons/ameacas/rato-gigante.png',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'rato', 'forma'],
      description: {
        value: '<p>Tamanho Minúsculo, deslocamento 12m (escalada 6m) e mordida 1d6. Acerto crítico com mordida deixa armadura da vítima avariada ou aumenta multiplicador para x3.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FeraSelakoA',
    name: 'Licantropia: Forma de Fera (Selako)',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'selako', 'forma'],
      description: {
        value: '<p>Deslocamento de natação igual ao normal e mordida 1d6. Acerto crítico com a mordida deixa a vítima sangrando.</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232FeraTexugoA',
    name: 'Licantropia: Forma de Fera (Texugo)',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'geral',
      tags: ['licantropo', 'texugo', 'forma'],
      description: {
        value: '<p>Tamanho Pequeno, deslocamento 12m (escalada 3m). Pode usar a habilidade Durão (-1 PM de custo se já possuir).</p>'
      },
      source: SOURCE_DB232
    }
  },
  {
    id: 'i8232DoencaLicaA',
    name: 'Maldição: Licantropia',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'maldicao',
      tags: ['maldicao', 'licantropia', 'perigo'],
      description: {
        value: '<p>Maldição mágica que afeta humanoides. Transmitida pela mordida de um licantropo (Fortitude CD Con evita). Ao presenciar violência física letal, na noite seguinte o personagem se transforma em forma híbrida sob controle do mestre. Vontade CD 25 (+5 por teste anterior) evita. Curada por Purificação com aprimoramento de dissipar ou efeitos de remoção de maldição.</p>'
      },
      source: SOURCE_DB232
    }
  }
];

async function injectItems() {
  console.log('=== Injetando 13 Poderes e Regras de Licantropia da DB #232 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  for (const itemData of DB232_ITEMS) {
    const mainDoc = {
      _id: itemData.id,
      name: itemData.name,
      type: itemData.type,
      img: itemData.img,
      folder: itemData.folder,
      system: itemData.system,
      effects: [],
      sort: 0,
      ownership: { default: 0 },
      flags: {}
    };

    await db.put(`!items!${itemData.id}`, mainDoc);
    saveToSourcePacks('Itens_T20', mainDoc, []);
    console.log(`✓ Item "${itemData.name}" [${itemData.id}] gravado com sucesso.`);
  }

  await db.close();
  console.log(`\n🎉 13 Itens/Poderes da DB #232 gravados com sucesso em ${PACK_ITENS}!`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('❌ Erro na injeção de itens DB #232:', err);
    process.exit(1);
  });
}

module.exports = { injectItems };

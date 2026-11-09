#!/usr/bin/env node
/**
 * Injeção Canônica e Rigorosa de Itens, Poderes, Classes e Origens da DB #231 em Itens_T20
 *
 * Conteúdo:
 * 1. Classe Variante Miragem e Habilidades:
 *    - Classe Variante: Miragem (Caçador)
 *    - Dança da Areia
 *    - Cortina de Poeira
 *    - Passo do Deserto
 *    - Mestre do Deserto
 *
 * 2. Novos Poderes de Caçador:
 *    - Arsenal do Deserto
 *    - Escaramuça Distante
 *    - Passo Duplo
 *    - Passos Precisos
 *    - Tesouros da Natureza
 *
 * 3. Poder Concedido e Traços Raciais Sahiri:
 *    - Canção da Pedra (Allihanna, Megalokk)
 *    - Sahiri: Animar Rochas
 *    - Sahiri: Proteção da Terra
 *
 * 4. Origens Regionais de Halak-Tûr:
 *    - Origem: Criança do Crepúsculo
 *    - Origem: Nascido nas Estepes
 *    - Origem: Nômade Ferani
 *
 * 5. Equipamentos e Despojos:
 *    - Presa de Ônix
 *    - Símbolo Sagrado de Azgher
 */

const { ClassicLevel } = require('classic-level');
const fs = require('fs');
const path = require('path');
const { saveToSourcePacks } = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB231 = 'Dragão Brasil #231';

// Mapeamento Estático e Determinístico de IDs (16 caracteres)
const DB231_ITEMS_MAP = {
  'Classe Variante: Miragem': 'i8231MiragemClas',
  'Dança da Areia': 'i8231DancaAreiaA',
  'Cortina de Poeira': 'i8231CortinaPoeA',
  'Passo do Deserto': 'i8231PassoDeserA',
  'Mestre do Deserto': 'i8231MestreDeser',
  'Arsenal do Deserto': 'i8231ArsenalDesA',
  'Escaramuça Distante': 'i8231EscaramDist',
  'Passo Duplo': 'i8231PassoDuploA',
  'Passos Precisos': 'i8231PassosPrecA',
  'Tesouros da Natureza': 'i8231TesourosNat',
  'Canção da Pedra': 'i8231CancaoPedrA',
  'Sahiri: Animar Rochas': 'i8231SahiriAnimA',
  'Sahiri: Proteção da Terra': 'i8231SahiriProtA',
  'Origem: Criança do Crepúsculo': 'i8231OrigCriancA',
  'Origem: Nascido nas Estepes': 'i8231OrigNascEst',
  'Origem: Nômade Ferani': 'i8231OrigNomadFe',
  'Presa de Ônix': 'i8231PresaOnixAA',
  'Símbolo Sagrado de Azgher': 'i8231SimbAzgherA'
};

const FOLDER_PODERES = '6HZCPG5QrmzhwmBe';
const FOLDER_EQUIPAMENTOS = 'f9rwHA7dJnFLVQH1';

const DB231_ITEMS = [
  // 1. Classe Variante: Miragem
  {
    name: 'Classe Variante: Miragem',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/estilo-de-duas-armas.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'variante',
      tags: ['cacador', 'classe variante', 'miragem', 'halak-tur'],
      descricao: '<p>Classe variante para Caçador criada pelos nômades ferani no Planalto de Sukala. Praticantes da Dança da Areia mesclam velocidade acrobática, furtividade e magia guerreira.</p><p><strong>Características:</strong></p><ul><li><strong>PM:</strong> 3 PM por nível.</li><li><strong>Perícias:</strong> Luta (For) ou Pontaria (Des), Sobrevivência (Des), mais 4 à sua escolha entre Acrobacia, Atletismo, Fortitude, Furtividade, Guerra, Iniciativa, Intimidação, Luta, Ofício, Percepção, Pontaria e Reflexos.</li><li><strong>Restrição:</strong> Não pode escolher os poderes <em>Escaramuça</em> e <em>Escaramuça Superior</em>.</li></ul>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 2. Dança da Areia
  {
    name: 'Dança da Areia',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/foco-em-arma.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'habilidade',
      ativacao: { tipo: 'acao', custo: 1 },
      tags: ['miragem', 'dano', 'areia'],
      descricao: '<p>Você pode gastar 1 PM para iniciar uma dança da areia. Enquanto executa essa dança, você recebe um bônus de <strong>+1d4 em suas rolagens de dano</strong> com armas contra alvos em alcance curto. A cada quatro níveis, você pode gastar +1 PM para aumentar o dado de bônus de dano em um passo (+1d6 no 5º, +1d8 no 9º, +1d10 no 13º e +1d12 no 17º). A dança termina ao final da cena ou se você passar uma rodada sem percorrer pelo menos 6m sem passar pelo mesmo espaço duas vezes. Exige liberdade de movimentos (sem armadura pesada ou condição imóvel).</p>',
      source: SOURCE_DB231
    },
    effects: [
      {
        _id: 'effDancaAreia231',
        name: 'Dança da Areia (+1d4 a +1d12 Dano)',
        icon: 'systems/tormenta20/icons/poderes/classes/combatentes/foco-em-arma.webp',
        changes: [
          { key: 'system.attributes.dano.cac', mode: 2, value: '1d4', priority: 20 }
        ],
        disabled: false,
        transfer: false,
        flags: { tormenta20: { attack: true } }
      }
    ]
  },
  // 3. Cortina de Poeira
  {
    name: 'Cortina de Poeira',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/camuflagem.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'habilidade',
      ativacao: { tipo: 'acao', custo: 3 },
      tags: ['miragem', 'camuflagem'],
      descricao: '<p>No 7º nível, você usa sua velocidade para criar uma nuvem de terra ou detritos para obscurecer a visão de seus inimigos. Quando usa Dança da Areia, você pode gastar +3 PM para receber <strong>camuflagem leve</strong> enquanto sua dança estiver ativa.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 4. Passo do Deserto
  {
    name: 'Passo do Deserto',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'habilidade',
      ativacao: { tipo: 'acao', custo: 3 },
      tags: ['miragem', 'mobilidade'],
      descricao: '<p>A partir do 9º nível, uma vez por rodada você pode gastar 3 PM para entrar no solo e sair em outro espaço desocupado no solo em alcance curto. Tanto o ponto de entrada quanto de saída devem estar em solo macio (como areia, terra ou equivalente) e devem estar conectados pelo mesmo tipo de terreno.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 5. Mestre do Deserto
  {
    name: 'Mestre do Deserto',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'habilidade',
      ativacao: { tipo: 'reacao', custo: 2 },
      tags: ['miragem', 'resistencia', 'ataque'],
      descricao: '<p>No 20º nível, enquanto estiver usando Dança da Areia, quando sofre dano você pode gastar 2 PM para receber <strong>RD 20</strong> contra esse dano. Além disso, quando usa a ação agredir durante a Dança da Areia, você pode gastar 2 PM para fazer um ataque adicional.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 6. Arsenal do Deserto
  {
    name: 'Arsenal do Deserto',
    type: 'poder',
    img: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'cacador',
      tags: ['cacador', 'armas'],
      descricao: '<p>Você recebe <strong>+2 nas rolagens de dano</strong> com azagaias, cimitarras e lanças e considera essas armas como <em>leves</em>.</p>',
      source: SOURCE_DB231
    },
    effects: [
      {
        _id: 'effArsenalDes231',
        name: 'Arsenal do Deserto (+2 Dano)',
        icon: 'systems/tormenta20/icons/itens/equipamentos/cimitarra.webp',
        changes: [
          { key: 'system.attributes.dano.cac', mode: 2, value: '2', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: { tormenta20: { attack: true } }
      }
    ]
  },
  // 7. Escaramuça Distante
  {
    name: 'Escaramuça Distante',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/especialistas/escaramuca.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'cacador',
      tags: ['cacador', 'alcance'],
      descricao: '<p>Você pode usar Escaramuça e Dança da Areia contra alvos em alcance médio.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 8. Passo Duplo
  {
    name: 'Passo Duplo',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'cacador',
      ativacao: { tipo: 'livre', custo: 2 },
      tags: ['cacador', 'ataque'],
      descricao: '<p>Uma vez por rodada, se estiver usando Escaramuça ou Dança da Areia e usar a ação agredir para fazer um ataque corpo a corpo com uma arma leve, você pode gastar 2 PM para fazer um <strong>ataque adicional</strong>. <em>Pré-requisito:</em> Dança da Areia ou Escaramuça, 5º nível de caçador.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 9. Passos Precisos
  {
    name: 'Passos Precisos',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-preciso.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'cacador',
      tags: ['cacador', 'critico'],
      descricao: '<p>Enquanto estiver usando Escaramuça ou Dança da Areia, você recebe <strong>+2 na margem de ameaça</strong> de seus ataques.</p>',
      source: SOURCE_DB231
    },
    effects: [
      {
        _id: 'effPassosPrec231',
        name: 'Passos Precisos (+2 Margem de Ameaça)',
        icon: 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-preciso.webp',
        changes: [
          { key: 'system.attributes.ataque.margem', mode: 2, value: '2', priority: 20 }
        ],
        disabled: false,
        transfer: false,
        flags: { tormenta20: { attack: true } }
      }
    ]
  },
  // 10. Tesouros da Natureza
  {
    name: 'Tesouros da Natureza',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos/frutos-da-coragem.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'classe',
      subtipo: 'cacador',
      tags: ['cacador', 'sustento', 'pm'],
      descricao: '<p>Sempre que for bem-sucedido em montar um acampamento em terreno natural, você encontra frutos, insetos ou outros recursos naturais que ajudam a recuperar as energias. Cada personagem acampado recupera <strong>1 PM por patamar</strong> em que você está.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 11. Canção da Pedra
  {
    name: 'Canção da Pedra',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos/voz-da-natureza.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'concedido',
      divindade: 'Allihanna, Megalokk',
      tags: ['concedido', 'druida', 'allihanna', 'megalokk'],
      descricao: '<p>Você pode usar <strong>Religião</strong> em vez de Ofício para testes relacionados a grandes estruturas de pedra, como veículos e construções, e no lugar de <strong>Pilotagem</strong> para conduzir veículos de pedra. Além disso, aprende e pode lançar <em>Transmutar Objetos</em> (apenas em objetos de pedra) e, se puder lançar magias divinas de 3º círculo, aprende e pode lançar <em>Controlar Terra</em>. Caso aprenda novamente essas magias, seu custo diminui em –1 PM. <em>Apenas druidas podem escolher este poder.</em></p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 12. Sahiri: Animar Rochas
  {
    name: 'Sahiri: Animar Rochas',
    type: 'poder',
    img: 'systems/tormenta20/icons/magias/animar-objetos.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'raca',
      tags: ['sahiri', 'dahllan', 'variante'],
      descricao: '<p>Traço racial da variante <strong>Sahiri</strong> (substitui <em>Amiga das Plantas</em>). Você pode usar magia para transformar rochas em criaturas sob seu controle. Isso funciona como a magia <em>Conjurar Monstro</em>, exceto que você precisa ter acesso a uma porção de terra ou rocha equivalente a uma criatura Pequena. Caso aprenda essa magia, seu custo diminui em –1 PM.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 13. Sahiri: Proteção da Terra
  {
    name: 'Sahiri: Proteção da Terra',
    type: 'poder',
    img: 'systems/tormenta20/icons/magias/pele-de-pedra.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'raca',
      tags: ['sahiri', 'dahllan', 'rd'],
      descricao: '<p>Traço racial da variante <strong>Sahiri</strong> (substitui <em>Armadura de Allihanna</em>). Quando sofre dano enquanto está em contato com terra ou pedra, você pode gastar 1 PM para reduzir esse dano em 5 (<strong>RD 5</strong>).</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 14. Origem: Criança do Crepúsculo
  {
    name: 'Origem: Criança do Crepúsculo',
    type: 'poder',
    img: 'systems/tormenta20/icons/magias/escuridao.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'origem',
      subtipo: 'regional',
      tags: ['origem', 'regional', 'halak-tur'],
      descricao: '<p>Você nasceu no Vale do Crepúsculo. Escolha duas de suas habilidades com custo em PM (dia e noite). Sob luz solar, o custo da habilidade de dia diminui em –1 PM e a de noite aumenta em +1 PM. Sob escuridão, inverte. Durante o crepúsculo, o custo de ambas diminui em –1 PM. Não pode ser escolhido por construtos ou mortos-vivos.</p><p><strong>Itens:</strong> Uma poção mágica contendo uma magia de 1º círculo (1 PM).</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 15. Origem: Nascido nas Estepes
  {
    name: 'Origem: Nascido nas Estepes',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'origem',
      subtipo: 'regional',
      tags: ['origem', 'regional', 'dai-kerat'],
      descricao: '<p>Você cresceu entre os dai-kerat. Recebe <strong>+2 em Cavalgar e Vontade</strong> e nas <strong>rolagens de dano</strong> com arcos curtos e katanas.</p><p><strong>Itens:</strong> Arco curto, cavalo de guerra, flecha x20, veste de seda.</p>',
      source: SOURCE_DB231
    },
    effects: [
      {
        _id: 'effNascEstepes231',
        name: 'Nascido nas Estepes (+2 Cavalgar/Vontade/Dano)',
        icon: 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
        changes: [
          { key: 'system.pericias.cava.value', mode: 2, value: '2', priority: 20 },
          { key: 'system.pericias.vont.value', mode: 2, value: '2', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: { tormenta20: { self: true } }
      }
    ]
  },
  // 16. Origem: Nômade Ferani
  {
    name: 'Origem: Nômade Ferani',
    type: 'poder',
    img: 'systems/tormenta20/icons/armas/lanca.webp',
    folder: FOLDER_PODERES,
    system: {
      type: 'poder',
      tipo: 'origem',
      subtipo: 'regional',
      tags: ['origem', 'regional', 'ferani'],
      descricao: '<p>Você passou sua infância entre os trogs ferani. Recebe <strong>+2 em Fortitude e Furtividade</strong> e nas <strong>rolagens de dano contra criaturas desprevenidas</strong>. Além disso, pode atravessar terrenos difíceis sem sofrer redução em seu deslocamento (ou +3m se já possuir).</p><p><strong>Itens:</strong> Lança, manto camuflado (deserto), ração de viagem x10.</p>',
      source: SOURCE_DB231
    },
    effects: [
      {
        _id: 'effNomadFerani231',
        name: 'Nômade Ferani (+2 Fort/Furt)',
        icon: 'systems/tormenta20/icons/armas/lanca.webp',
        changes: [
          { key: 'system.pericias.fort.value', mode: 2, value: '2', priority: 20 },
          { key: 'system.pericias.furt.value', mode: 2, value: '2', priority: 20 }
        ],
        disabled: false,
        transfer: true,
        flags: { tormenta20: { self: true } }
      }
    ]
  },
  // 17. Presa de Ônix
  {
    name: 'Presa de Ônix',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
    folder: FOLDER_EQUIPAMENTOS,
    system: {
      type: 'equipamento',
      preco: 300,
      peso: 1,
      descricao: '<p>Dente serrilhado mineralizado deixado pela Constritora Arenosa quando morta. Cada presa vale <strong>T$ 300</strong> como matéria-prima para fabricar uma arma de corte (leve ou de uma mão) com qualidade <em>superior</em>.</p>',
      source: SOURCE_DB231
    },
    effects: []
  },
  // 18. Símbolo Sagrado de Azgher
  {
    name: 'Símbolo Sagrado de Azgher',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp',
    folder: FOLDER_EQUIPAMENTOS,
    system: {
      type: 'equipamento',
      preco: 100,
      peso: 0.5,
      descricao: '<p>Um pequeno sol esculpido com esmero em madeira de lei. Presenteado aos heróis na vila aterrorizada pelo Circo Sombrio. Enquanto carregado, seu portador é <strong>imune aos efeitos de fascinação</strong> provocados pela névoa e espetáculo de Tenebra, e pode remover a fascinação de aliados com uma ação padrão.</p>',
      source: SOURCE_DB231
    },
    effects: []
  }
];

async function injectItems() {
  console.log('=== Injetando 18 Itens, Poderes, Classes e Origens da DB #231 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  for (const itemData of DB231_ITEMS) {
    const itemId = DB231_ITEMS_MAP[itemData.name];
    if (!itemId) {
      throw new Error(`ID não mapeado para o item: "${itemData.name}"`);
    }

    const effectIds = [];
    const embeddedEffects = [];

    if (itemData.effects && itemData.effects.length > 0) {
      for (const eff of itemData.effects) {
        effectIds.push(eff._id);
        const effectDoc = {
          _id: eff._id,
          name: eff.name,
          icon: eff.icon || itemData.img,
          origin: `Item.${itemId}`,
          duration: eff.duration || { rounds: null, startTime: null, seconds: null, combat: null, turns: null, startRound: null, startTurn: null },
          disabled: Boolean(eff.disabled),
          transfer: eff.transfer !== undefined ? eff.transfer : true,
          changes: eff.changes || [],
          flags: eff.flags || { tormenta20: { self: true } },
          system: {}
        };
        embeddedEffects.push(effectDoc);
      }
    }

    const mainDoc = {
      _id: itemId,
      name: itemData.name,
      type: itemData.type,
      img: itemData.img,
      folder: itemData.folder,
      system: {
        ...itemData.system,
        description: {
          value: itemData.system.descricao
        }
      },
      effects: effectIds,
      sort: 0,
      ownership: { default: 0 },
      flags: {}
    };

    // 1. Gravar documento principal do item
    await db.put(`!items!${itemId}`, mainDoc);

    // 2. Gravar subdocumentos de efeitos
    for (const effDoc of embeddedEffects) {
      await db.put(`!items.effects!${itemId}.${effDoc._id}`, effDoc);
    }

    // 3. Espelhar em src/packs/Itens_T20
    const embeddedForSource = embeddedEffects.map(e => ({
      key: `!items.effects!${itemId}.${e._id}`,
      typePath: '!items.effects!',
      doc: e
    }));
    saveToSourcePacks('Itens_T20', mainDoc, embeddedForSource);

    console.log(`✓ Item "${itemData.name}" [${itemId}] gravado com ${embeddedEffects.length} efeitos.`);
  }

  await db.close();
  console.log(`\n🎉 18 Itens/Poderes/Origens da DB #231 gravados com sucesso em ${PACK_ITENS}!`);
}

if (require.main === module) {
  injectItems().catch(err => {
    console.error('❌ Erro na injeção de itens DB #231:', err);
    process.exit(1);
  });
}

module.exports = { injectItems };

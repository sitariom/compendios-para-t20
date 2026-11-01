#!/usr/bin/env node
/**
 * Injeção Canônica de Itens, Poderes, Magias e Itens Mágicos da DB #228 em Itens_T20
 * Conteúdo: Divinas Organizações (20 Itens e Poderes Canônicos de Arton)
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const {
  buildItem,
  buildWeaponItem,
  buildSpellItem
} = require('./create-entry');

const PACK_ITENS = path.join(__dirname, '..', 'packs', 'Itens_T20');
const SOURCE_DB228 = 'Dragão Brasil #228 (Divinas Organizações)';

const DB228_ITEMS = [
  // 1. Arco dos Arautos
  buildWeaponItem({
    name: 'Arco dos Arautos',
    img: 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
    empunhadura: 'duas',
    dano: '1d8',
    tipoDano: 'perfuracao',
    criticoMargem: 19,
    criticoMultiplicador: 3,
    alcance: 'medio',
    preco: 18000,
    espacos: 2,
    description: `<blockquote><p>"Arma favorita dos Arautos do Destruidor, este arco longo cruel preciso caçador pode ser encontrado nos pertences de membros da organização."</p></blockquote>
<p>Você recebe a habilidade <strong>Marca da Presa</strong> do caçador, mas só pode usá-la com esta arma. Se já possui essa habilidade, em vez disso, o custo para usá-la com esta arma diminui em –1 PM.</p>
<p><strong>Tipo:</strong> Arma específica (arco longo cruel preciso caçador).</p>`
  }),

  // 2. Certificado de Conclusão
  buildItem({
    name: 'Certificado de Conclusão',
    type: 'poder',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Documento emitido pelos mestres da Caravana das Três Chamas após um mês de estudos mágicos intensivos."</p></blockquote>
<p><strong>Pré-requisito:</strong> Especial: ter estudado por um mês na Caravana das Três Chamas.</p>
<p>Você recebe <strong>+1 PM</strong> e pode lançar uma das magias a seguir (atributo-chave Inteligência) à sua escolha: <em>Alarme</em>, <em>Aviso</em>, <em>Criar Elementos</em> ou <em>Luz</em>, mas não pode aplicar aprimoramentos. Caso aprenda novamente uma dessas magias por outra fonte, seu custo diminui em –1 PM.</p>`,
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Certificado de Conclusão (+1 PM)',
        changes: [{ key: 'system.attributes.pm.max', mode: 2, value: '1' }],
        transfer: true
      }
    ]
  }),

  // 3. Chave Mestra
  buildItem({
    name: 'Chave Mestra',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/espelho-do-aprisonamento.webp',
    description: `<blockquote><p>"Carregada pelos membros do Claviculário como um símbolo sagrado de Sszzaas."</p></blockquote>
<p>Este item mágico é capaz de destrancar qualquer fechadura, concedendo <strong>sucesso automático</strong> em testes de Ladinagem para abrir fechaduras. Contudo, se não for usada por um membro do Claviculário ou devoto de Sszzaas, um efeito mágico é ativado, reduzindo a chave a pó após o primeiro uso.</p>
<p><strong>Tipo:</strong> Acessório médio. <strong>Preço:</strong> T$ 25.500.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 25500,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 4. Bilhete de Valluk Delsori
  buildItem({
    name: 'Bilhete de Valluk Delsori',
    type: 'consumivel',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Ingresso cênico encantado concedido pela Companhia Teatral Valluk Delsori."</p></blockquote>
<p>Rasgar este bilhete (como se faz ao entrar em um espetáculo) permite que o usuário se transforme ilusoriamente em uma das grandes figuras de Arton (como o herói Orion Drake ou a Rainha-Imperatriz Shivara I) por até 1 hora, recebendo +10 em testes de Enganação para sustentar o disfarce.</p>
<p><strong>Tipo:</strong> Consumível mágico. <strong>Preço:</strong> T$ 5.000.</p>`,
    system: {
      tipo: 'outro',
      preco: 5000,
      espacos: 0,
      source: SOURCE_DB228
    }
  }),

  // 5. Máscara do Sol Dourado
  buildItem({
    name: 'Máscara do Sol Dourado',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/brincos.webp',
    description: `<blockquote><p>"Uma máscara amarela com o desenho de um sorriso e dois tibares de ouro no lugar dos olhos, adornados com raios solares em laranja."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Azgher, as moedas mágicas fornecem <strong>+10 em Ladinagem</strong>. Contudo, por ser chamativo demais, quem a veste sofre <strong>–2 em Furtividade</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 9.000.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 9000,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Máscara do Sol Dourado',
        changes: [
          { key: 'system.pericias.ladi.outros', mode: 2, value: '10' },
          { key: 'system.pericias.furt.outros', mode: 2, value: '-2' }
        ],
        transfer: true
      }
    ]
  }),

  // 6. Pingente Rubro
  buildItem({
    name: 'Pingente Rubro',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
    description: `<blockquote><p>"Colar forjado em matéria vermelha gelatinosa que pulsa como um coração doentio."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Aharadak, sendo devoto ou não, você reduz a perda de PM causada por efeitos lefeu e da Tormenta em <strong>–1 PM por patamar de personagem</strong>.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 3.000.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 3000,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 7. Alma de Dragão
  buildItem({
    name: 'Alma de Dragão',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/itens/itens-magicos/escudo-do-conjurador.webp',
    description: `<blockquote><p>"Pedra translúcida no formato de escama de dragão lapidada pelos Herdeiros da Escama."</p></blockquote>
<p>Como uma reação quando sofrer dano elemental (fogo, frio, eletricidade, ácido, luz ou trevas), você pode reduzir o dano sofrido em um dado do mesmo tipo. A pedra então absorve a energia, tornando-se uma gema preciosa de valor equivalente.</p>
<p><strong>Tipo:</strong> Item geral alquímico. <strong>Preço:</strong> T$ 150.</p>`,
    system: {
      tipo: 'outro',
      preco: 150,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 8. Âncora Naufragista
  buildItem({
    name: 'Âncora Naufragista',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
    description: `<blockquote><p>"Pingente de ferro oxidado em forma de âncora usado pelos corsários de Oceano."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Oceano, sempre que oferecer como tributo para o mar um item valioso (mínimo T$ 100), você recebe um benefício durante 1 dia à sua escolha: deslocamento de natação igual ao terrestre, +5 em Pilotagem, ou resistência a frio e eletricidade 5.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 6.000.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 6000,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 9. Arma Silente
  buildWeaponItem({
    name: 'Arma Silente',
    img: 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
    empunhadura: 'duas',
    dano: '1d10',
    tipoDano: 'corte e perfuracao',
    criticoMargem: 19,
    criticoMultiplicador: 3,
    preco: 31000,
    espacos: 2,
    description: `<blockquote><p>"Arma de haste de adamante forjada no silêncio absoluto pelos campeões da Lança Silente."</p></blockquote>
<p>Arma de adamante certeira equilibrada formidável que fornece <strong>+5 em testes de Conhecimento, Guerra e Nobreza</strong> cujo objetivo seja perpetuar e planejar conflitos armados.</p>
<p><strong>Tipo:</strong> Arma específica menor (alabarda de adamante). <strong>Preço:</strong> T$ 31.000.</p>`,
    effects: [
      {
        name: 'Sabedoria Bélica da Lança Silente',
        changes: [
          { key: 'system.pericias.guer.outros', mode: 2, value: '5' },
          { key: 'system.pericias.conh.outros', mode: 2, value: '5' },
          { key: 'system.pericias.nobr.outros', mode: 2, value: '5' }
        ],
        transfer: true
      }
    ]
  }),

  // 10. Memorizar Conhecimento
  buildSpellItem({
    name: 'Memorizar Conhecimento',
    img: 'systems/tormenta20/icons/magias/invulnerabilidade.webp',
    circulo: 2,
    tipo: 'universal',
    escola: 'adivinhacao',
    execucao: 'padrao',
    alcance: 'pessoal',
    alvo: 'você',
    duracao: 'permanente até descarregada',
    description: `<blockquote><p>"Esta magia permite que você grave todos os detalhes visuais, sonoros e táteis de uma cena na sua mente."</p></blockquote>
<p>Enquanto tiver a memória gravada, você recebe <strong>+5 em testes relacionados a informações da cena memorizada</strong>. Você pode descarregar a magia para transmitir mentalmente a cena inteira para outra criatura tocada.</p>`,
    aprimoramentos: [
      { custo: 2, descricao: 'Permite gravar uma cena adicional simultaneamente na memória.' },
      { custo: 4, descricao: 'Muda a execução para reação logo após testemunhar um evento inesperado.' }
    ]
  }),

  // 11. Cítola da Paz
  buildItem({
    name: 'Cítola da Paz',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
    description: `<blockquote><p>"Instrumento com cordas douradas entalhado e abençoado pelos Mestres de Cerimônia de Marah."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Marah, sua Inspiração e suas músicas de bardo custam <strong>–1 PM</strong> e você recebe <strong>+5 em testes de perícia para mudar atitude</strong> de criaturas hostis.</p>
<p><strong>Tipo:</strong> Item geral (instrumento musical). <strong>Preço:</strong> T$ 500.</p>`,
    system: {
      tipo: 'outro',
      preco: 500,
      espacos: 1,
      source: SOURCE_DB228
    },
    effects: [
      {
        name: 'Harmonia Pacificadora (+5 Mudar Atitude)',
        changes: [{ key: 'system.pericias.dipl.outros', mode: 2, value: '5' }],
        transfer: true
      }
    ]
  }),

  // 12. Percepção de Masmorra
  buildItem({
    name: 'Percepção de Masmorra',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos-trapaca.webp',
    description: `<blockquote><p>"A astúcia da raposa revela os gatilhos e armadilhas ocultas nas pedras frias das masmorras."</p></blockquote>
<p><strong>Pré-requisito:</strong> Devoto de Hyninn ou Passagem Vulpina.</p>
<p>Uma vez por cena, você tem <strong>sucesso automático</strong> em testes de Investigação para encontrar armadilhas realizados no subterrâneo ou dentro de uma masmorra.</p>`,
    system: {
      tipo: 'geral',
      subtipo: 'concedido',
      source: SOURCE_DB228
    }
  }),

  // 13. Rosário da Vida
  buildItem({
    name: 'Rosário da Vida',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
    description: `<blockquote><p>"Símbolo de contas puras carregado pelas Parteiras das Mandíbulas para abençoar nascimentos em regiões perigosas."</p></blockquote>
<p>Quando empunhado por alguém que siga as Obrigações & Restrições de Lena, este rosário aumenta o número de PV recuperados por efeitos de cura mágica de luz em <strong>+1 dado do mesmo tipo por patamar de personagem</strong> (+1 dado no iniciante, +2 dados no veterano, +3 dados no campeão e +4 dados no lenda).</p>
<p><strong>Tipo:</strong> Item geral (símbolo sagrado). <strong>Preço:</strong> T$ 300.</p>`,
    system: {
      tipo: 'outro',
      preco: 300,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 14. Bússola das Lágrimas
  buildItem({
    name: 'Bússola das Lágrimas',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/poderes/concedidos-ambicao.webp',
    description: `<blockquote><p>"Agulha imantada com pó de diamante forjada pelos inventores Peregrinos para rastrear as Lágrimas de Valkaria."</p></blockquote>
<p>A bússola vibra e aponta continuamente na direção da fonte mágica mais poderosa ou relíquia divina em alcance longo (100m). Permite identificar auras arcanas sem custo de PM.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 7.500.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 7500,
      espacos: 1,
      source: SOURCE_DB228
    }
  }),

  // 15. Corso Sombrio
  buildItem({
    name: 'Corso Sombrio',
    type: 'equipamento',
    img: 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
    description: `<blockquote><p>"Documento selado com cera preta que autoriza membros do Rastro da Pólvora a portar armas de fogo."</p></blockquote>
<p>Enquanto seguir as Obrigações & Restrições de Tenebra, este item funciona como uma carta de corso oficial, concedendo permissão para portar e utilizar armas de fogo em qualquer território do Reinado.</p>
<p><strong>Tipo:</strong> Acessório menor. <strong>Preço:</strong> T$ 2.000.</p>`,
    system: {
      tipo: 'acessorio',
      preco: 2000,
      espacos: 0,
      source: SOURCE_DB228
    }
  }),

  // 16. Previdência da Vigília
  buildItem({
    name: 'Previdência da Vigília',
    type: 'poder',
    img: 'systems/tormenta20/icons/poderes/concedidos-ressurreicao.webp',
    description: `<blockquote><p>"Juramento sagrado feito perante a Vigília das Segundas Chances sob a chama eterna da fênix de Thyatis."</p></blockquote>
<p><strong>Pré-requisito:</strong> Ter contribuído com a Vigília e seguir as Obrigações & Restrições de Thyatis.</p>
<p>Você recebe o poder <strong>Dom da Imortalidade</strong> (Tormenta20, p. 133), mas só pode usá-lo na primeira vez em que morrer na campanha. Na rodada seguinte à morte, você ressurge com todos os seus PV e PM restaurados e purificado de condições nocivas.</p>`,
    system: {
      tipo: 'geral',
      subtipo: 'destino',
      source: SOURCE_DB228
    }
  }),

  // 17. Bomba de Tinta
  buildItem({
    name: 'Bomba de Tinta',
    type: 'consumivel',
    img: 'systems/tormenta20/icons/itens/gerais/agua-benta.webp',
    description: `<blockquote><p>"Frasco de cerâmica cheio de pigmentos coloridos e gordura alquímica criado pelos grafiteiros Zoyrak."</p></blockquote>
<p>Arremessada em alcance curto. Em vez de dano, explode afetando uma esfera com 6m de raio sob efeito simulado da magia <em>Área Escorregadia</em> até o fim da cena. Criaturas dentro da área durante a explosão ficam <strong>lentas</strong> (Reflexos CD Destreza do arremessador evita).</p>
<p><strong>Tipo:</strong> Item geral alquímico. <strong>Preço:</strong> T$ 60.</p>`,
    system: {
      tipo: 'outro',
      preco: 60,
      espacos: 1,
      source: SOURCE_DB228
    }
  })
];

async function injectItems() {
  console.log('=== Injetando Itens, Poderes e Magias da DB #228 em Itens_T20 ===\n');
  const db = new ClassicLevel(PACK_ITENS, { valueEncoding: 'json' });

  let count = 0;
  for (const item of DB228_ITEMS) {
    if (!item.system.source) {
      item.system.source = SOURCE_DB228;
    }
    const key = `!items!${item._id}`;
    await db.put(key, item);
    count++;
    console.log(`✓ [${item.type}] "${item.name}" salvo em Itens_T20 (Key: ${key}).`);

    // Efeitos embutidos se existirem
    if (Array.isArray(item.effects)) {
      for (const eff of item.effects) {
        const effKey = `!items.effects!${item._id}.${eff._id}`;
        await db.put(effKey, eff);
      }
    }
  }

  await db.close();
  console.log(`\n✅ Sucesso: ${count} itens da DB #228 injetados em Itens_T20.`);
}

injectItems().catch(err => {
  console.error('Erro ao injetar itens:', err);
  process.exit(1);
});

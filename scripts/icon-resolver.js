/**
 * Motor Inteligente de Resolução e Download de Ícones para Tormenta20
 *
 * Prioridades:
 * 1. Acervo canônico local: C:/Users/simoe/OneDrive/Documentos/t20/Tormenta20/icons (systems/tormenta20/icons/...)
 * 2. Acervo do módulo local: assets/icons/ (modules/compendios-para-t20/assets/icons/...)
 * 3. Download sob demanda do repositório oficial Game-Icons.net (CC BY 3.0) com estilização Foundry.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const T20_ICONS_DIR = [
  process.env.T20_SYSTEM_ICONS_PATH,
  'C:/Users/simoe/OneDrive/Documentos/t20/Tormenta20/icons',
  'C:/Users/simoe/OneDrive/Documentos/Tormenta20-master/Tormenta20-master/icons',
  path.resolve(__dirname, '..', '..', 'Tormenta20', 'icons')
].find(d => d && fs.existsSync(d)) || path.resolve(__dirname, '..', '..', 'Tormenta20', 'icons');
const MODULE_ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
const GAME_ICONS_INDEX_PATH = path.join(__dirname, 'game-icons-index.json');
const VALID_SYSTEM_ICONS_PATH = path.join(__dirname, 'valid-system-icons.json');
const ROOT_DIR = path.resolve(__dirname, '..');

let VALID_SYSTEM_ICONS = new Set();
let VALID_SYSTEM_BY_BASENAME = new Map();
try {
  if (fs.existsSync(VALID_SYSTEM_ICONS_PATH)) {
    const arr = JSON.parse(fs.readFileSync(VALID_SYSTEM_ICONS_PATH, 'utf8'));
    VALID_SYSTEM_ICONS = new Set(arr);
    for (const p of arr) {
      const base = p.split('/').pop();
      if (!VALID_SYSTEM_BY_BASENAME.has(base)) VALID_SYSTEM_BY_BASENAME.set(base, p);
    }
  }
} catch {
  // Ignora se ainda não disponível
}

const BROKEN_ICON_REMEDIATION_MAP = {
  // Core Foundry icons quebrados no v13
  'icons/weapons/swords/sword-broad-crystal.webp': 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
  'icons/weapons/polearms/halberd-crescent.webp': 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
  'icons/weapons/axes/axe-double-large.webp': 'systems/tormenta20/icons/itens/equipamentos/machado-de-guerra.webp',
  'icons/weapons/clubs/club-spiked-bone.webp': 'systems/tormenta20/icons/itens/equipamentos/tacape.webp',
  'icons/creatures/abilities/mouth-teeth-fangs.webp': 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
  'icons/weapons/bows/shortbow-recurve-gold.webp': 'systems/tormenta20/icons/itens/equipamentos/arco-curto.webp',
  'icons/magic/sonic/scream-wail-shout-red.webp': 'systems/tormenta20/icons/poderes/ameacas/urro-selvagem.webp',
  'icons/skills/melee/strike-kick-yellow.webp': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'icons/skills/movement/horse-running-charging-flame.webp': 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
  'icons/commodities/materials/ore-chunk-rust.webp': 'systems/tormenta20/icons/itens/gerais/materia-vermelha.webp',
  'icons/creatures/tentacles/tentacle-glowing-green.webp': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'icons/skills/melee/shield-block-blade-yellow.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'icons/magic/death/skull-energy-purple.webp': 'systems/tormenta20/icons/poderes/concedidos-trevas.webp',
  'icons/svg/windfoot.svg': 'systems/tormenta20/icons/poderes/classes/especialistas/esquiva-sagaz.webp',
  'icons/svg/fog.svg': 'systems/tormenta20/icons/poderes/ameacas/sopro-gas.webp',

  // Paths Tormenta20 inexistentes -> equivalentes verificados no sistema
  'systems/tormenta20/icons/svg/stairs.svg': 'systems/tormenta20/icons/svg/door.svg',
  'systems/tormenta20/icons/svg/holy-symbol.svg': 'systems/tormenta20/icons/itens/gerais/simbolo-sagrado.webp',
  'systems/tormenta20/icons/magias/dardos-do-talarion.webp': 'systems/tormenta20/icons/magias/adaga-mental.webp',
  'systems/tormenta20/icons/magias/ondas-de-choque.webp': 'systems/tormenta20/icons/magias/barragem-elemental.webp',
  'systems/tormenta20/icons/magias/tempestade-estelar.webp': 'systems/tormenta20/icons/magias/chuva-de-meteoros.webp',
  'systems/tormenta20/icons/magias/nevasca.webp': 'systems/tormenta20/icons/itens/gerais/gelo-eterno.webp',
  'systems/tormenta20/icons/itens/equipamentos/abrolhos.webp': 'systems/tormenta20/icons/itens/gerais/espinho.webp',
  'systems/tormenta20/icons/itens/equipamentos/moedas.webp': 'systems/tormenta20/icons/itens/gerais/gemas-preciosas.webp',
  'systems/tormenta20/icons/itens/equipamentos/lingote.webp': 'systems/tormenta20/icons/itens/gerais/adamante.webp',
  'systems/tormenta20/icons/itens/equipamentos/martelo-de-forja.webp': 'systems/tormenta20/icons/itens/gerais/ferramenta-pesada.webp',
  'systems/tormenta20/icons/itens/equipamentos/orbe.webp': 'systems/tormenta20/icons/itens/gerais/orbe-cristalina.webp',
  'systems/tormenta20/icons/itens/magicos/pedra-alma.webp': 'systems/tormenta20/icons/itens/itens-magicos/gema-elemental.webp',
  'systems/tormenta20/icons/itens/magicos/livro-magias.webp': 'systems/tormenta20/icons/itens/gerais/grimorio.webp',
  'systems/tormenta20/icons/itens/magicos/mapa-do-tesouro.webp': 'systems/tormenta20/icons/itens/gerais/organizador-de-pergaminhos.webp',
  'systems/tormenta20/icons/poderes/ameacas/rugido.webp': 'systems/tormenta20/icons/poderes/ameacas/urro-selvagem.webp',
  'systems/tormenta20/icons/poderes/ameacas/rugido-amedrontador.webp': 'systems/tormenta20/icons/poderes/ameacas/urro-selvagem.webp',
  'systems/tormenta20/icons/poderes/ameacas/incorporeo.webp': 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
  'systems/tormenta20/icons/poderes/ameacas/fantasma.webp': 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
  'systems/tormenta20/icons/poderes/ameacas/devorar-mente.webp': 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
  'systems/tormenta20/icons/poderes/ameacas/mente-alienigena.webp': 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
  'systems/tormenta20/icons/poderes/ameacas/pesadelo.webp': 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
  'systems/tormenta20/icons/poderes/ameacas/dreno.webp': 'systems/tormenta20/icons/poderes/ameacas/insanidade-tormenta.webp',
  'systems/tormenta20/icons/poderes/ameacas/olhar.webp': 'systems/tormenta20/icons/poderes/ameacas/olhar-petrificante.webp',
  'systems/tormenta20/icons/poderes/ameacas/olhar-aterrador.webp': 'systems/tormenta20/icons/poderes/ameacas/olhar-petrificante.webp',
  'systems/tormenta20/icons/poderes/concedidos/olhar-amedrontador.webp': 'systems/tormenta20/icons/poderes/ameacas/olhar-petrificante.webp',
  'systems/tormenta20/icons/poderes/ameacas/imunidade.webp': 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
  'systems/tormenta20/icons/poderes/ameacas/regeneracao.webp': 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
  'systems/tormenta20/icons/poderes/concedidos/cura.webp': 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
  'systems/tormenta20/icons/poderes/concedidos/alento-vida.webp': 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
  'systems/tormenta20/icons/poderes/classes/clerigos/cura-gentil.webp': 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
  'systems/tormenta20/icons/poderes/concedidos/dom-da-ressurreicao.webp': 'systems/tormenta20/icons/poderes/concedidos-ressurreicao.webp',
  'systems/tormenta20/icons/poderes/concedidos/conhecimento.webp': 'systems/tormenta20/icons/itens/gerais/tomo-hermetico.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/conhecimento-de-lendas.webp': 'systems/tormenta20/icons/itens/gerais/tomo-hermetico.webp',
  'systems/tormenta20/icons/poderes/concedidos/destruicao.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-especial.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-especial.webp',
  'systems/tormenta20/icons/poderes/concedidos/forca-da-natureza.webp': 'systems/tormenta20/icons/poderes/classes/conjuradores/forca-natureza.webp',
  'systems/tormenta20/icons/poderes/concedidos/espada-solar.webp': 'systems/tormenta20/icons/poderes/concedidos-deus-sol.webp',
  'systems/tormenta20/icons/poderes/concedidos/visao-no-escuro.webp': 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
  'systems/tormenta20/icons/poderes/concedidos/frutos-da-coragem.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/durao.webp',
  'systems/tormenta20/icons/poderes/concedidos/sorte-dos-loucos.webp': 'systems/tormenta20/icons/poderes/classes/especialistas/sorte-louco.webp',
  'systems/tormenta20/icons/poderes/ameacas/baforada.webp': 'systems/tormenta20/icons/poderes/ameacas/cospe-chamas.webp',
  'systems/tormenta20/icons/poderes/ameacas/sentido-sismico.webp': 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
  'systems/tormenta20/icons/poderes/ameacas/percepcao-as-cegas.webp': 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
  'systems/tormenta20/icons/poderes/ameacas/visao-no-escuro.webp': 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
  'systems/tormenta20/icons/poderes/ameacas/espreitador.webp': 'systems/tormenta20/icons/poderes/ameacas/bote.webp',
  'systems/tormenta20/icons/poderes/ameacas/enxame.webp': 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-insetos-rubros.webp',
  'systems/tormenta20/icons/poderes/ameacas/saliva.webp': 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
  'systems/tormenta20/icons/poderes/ameacas/mau-cheiro.webp': 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
  'systems/tormenta20/icons/poderes/ameacas/furtividade.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/ameacas/assassinar.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/camuflagem.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/emboscada.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/classes/ladinos/sombra.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/classes/ladinos/ladinagem.webp': 'systems/tormenta20/icons/poderes/ameacas/ataque-furtivo.webp',
  'systems/tormenta20/icons/poderes/ameacas/bloqueio.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/bloqueio-com-escudo.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/solidez.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'systems/tormenta20/icons/poderes/classes/paladinos/escudo-divino.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'systems/tormenta20/icons/poderes/classes/paladinos/egide-sagrada.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/retomar-folego.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/durao.webp',
  'systems/tormenta20/icons/poderes/ameacas/montaria.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/caminho-cavaleiro-montaria.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/investida-destruidora.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/caminho-cavaleiro-montaria.webp',
  'systems/tormenta20/icons/poderes/classes/cavaleiros/investida-destruidora.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/caminho-cavaleiro-montaria.webp',
  'systems/tormenta20/icons/poderes/ameacas/tentaculo.webp': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'systems/tormenta20/icons/poderes/ameacas/tentaculos.webp': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'systems/tormenta20/icons/poderes/ameacas/constricao.webp': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'systems/tormenta20/icons/poderes/ameacas/ataque-de-correntes.webp': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'systems/tormenta20/icons/poderes/ameacas/arremesso.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/golpe-preciso.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
  'systems/tormenta20/icons/poderes/classes/guerreiros/precisao.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-extra.webp',
  'systems/tormenta20/icons/poderes/ameacas/contra-ataque.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/foco-em-arma.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/estilo-de-duas-armas.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/saque-rapido.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/classes/guerreiros/golpe-pessoal.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/classes/clerigos/abencoar-arma.webp': 'systems/tormenta20/icons/poderes/combate.webp',
  'systems/tormenta20/icons/poderes/ameacas/medo.webp': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/presenca-aterrorizante.webp': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'systems/tormenta20/icons/poderes/ameacas/explosao.webp': 'systems/tormenta20/icons/itens/gerais/bomba.webp',
  'systems/tormenta20/icons/poderes/ameacas/peconha.webp': 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
  'systems/tormenta20/icons/poderes/ameacas/estrategia.webp': 'systems/tormenta20/icons/poderes/ameacas/comandar.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/lideranca.webp': 'systems/tormenta20/icons/poderes/ameacas/comandar.webp',
  'systems/tormenta20/icons/poderes/classes/guerreiros/disciplina-de-combate.webp': 'systems/tormenta20/icons/poderes/ameacas/comandar.webp',
  'systems/tormenta20/icons/poderes/ameacas/forca.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/furia-titanica.webp',
  'systems/tormenta20/icons/poderes/ameacas/resistencia.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
  'systems/tormenta20/icons/poderes/ameacas/reducao-de-dano.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/resistencia-dano.webp',
  'systems/tormenta20/icons/poderes/ameacas/varredura.webp': 'systems/tormenta20/icons/poderes/ameacas/varrer.webp',
  'systems/tormenta20/icons/poderes/classes/lutadores/rasteira.webp': 'systems/tormenta20/icons/poderes/ameacas/varrer.webp',
  'systems/tormenta20/icons/poderes/ameacas/vapor.webp': 'systems/tormenta20/icons/poderes/ameacas/sopro-gas.webp',
  'systems/tormenta20/icons/poderes/ameacas/lama.webp': 'systems/tormenta20/icons/magias/area-escorregadia.webp',
  'systems/tormenta20/icons/poderes/classes/conjuradores/forma-fluida.webp': 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
  'systems/tormenta20/icons/poderes/ameacas/odio.webp': 'systems/tormenta20/icons/poderes/ameacas/odio-puro.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/escaramuca.webp': 'systems/tormenta20/icons/poderes/classes/especialistas/esquiva-sagaz.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/acrobacia.webp': 'systems/tormenta20/icons/poderes/classes/especialistas/esquiva-sagaz.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/estilo-desarmado.webp': 'systems/tormenta20/icons/poderes/classes/combatentes/briga.webp',
  'systems/tormenta20/icons/poderes/classes/combatentes/derrubar-aprimorado.webp': 'systems/tormenta20/icons/poderes/ameacas/derrubar.webp',
  'systems/tormenta20/icons/poderes/classes/especialistas/marca-da-presa.webp': 'systems/tormenta20/icons/poderes/classes/especialistas/marca-presa.webp',
  'systems/tormenta20/icons/poderes/ameacas/teofagia.webp': 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
  'systems/tormenta20/icons/poderes/classes/ladinos/ladrao-de-almas.webp': 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
  'systems/tormenta20/icons/poderes/ameacas/resistencia-a-fogo.webp': 'systems/tormenta20/icons/poderes/ameacas/aura-de-calor.webp',
  'systems/tormenta20/icons/poderes/ameacas/resistencia-a-frio.webp': 'systems/tormenta20/icons/itens/gerais/gelo-eterno.webp',
  'systems/tormenta20/icons/poderes/ameacas/sangramento.webp': 'systems/tormenta20/icons/poderes/ameacas/dilacerar.webp',
  'systems/tormenta20/icons/poderes/classes/conjuradores/magia-ampliada.webp': 'systems/tormenta20/icons/poderes/magia.webp',
  'systems/tormenta20/icons/poderes/classes/conjuradores/foco-em-magia.webp': 'systems/tormenta20/icons/poderes/magia.webp',
  'systems/tormenta20/icons/poderes/classes/arcanistas/eficiencia-mistica.webp': 'systems/tormenta20/icons/poderes/magia.webp',
  'systems/tormenta20/icons/poderes/classes/arcanistas/contramagia.webp': 'systems/tormenta20/icons/magias/campo-antimagia.webp',
  'systems/tormenta20/icons/magias/criar-elementos.webp': 'systems/tormenta20/icons/poderes/magia.webp',
  'systems/tormenta20/icons/ameacas/necromante-veterano.png': 'systems/tormenta20/icons/ameacas/colosso-supremo.png'
};

function isVerifiedIconPath(img) {
  if (!img || typeof img !== 'string') return false;
  if (BROKEN_ICON_REMEDIATION_MAP[img]) return false;
  if (img.startsWith('modules/compendios-para-t20/')) {
    const rel = img.replace('modules/compendios-para-t20/', '');
    return fs.existsSync(path.join(ROOT_DIR, rel));
  }
  if (img.startsWith('systems/tormenta20/')) {
    return VALID_SYSTEM_ICONS.size === 0 ? true : VALID_SYSTEM_ICONS.has(img);
  }
  if (img.startsWith('icons/svg/')) {
    // SVGs padrão do core Foundry não listados no mapa de paths quebrados v13 são válidos
    return true;
  }
  if (img.startsWith('icons/')) {
    return false;
  }
  return false;
}

function repairBrokenIconPath(img, { name = '', type = 'poder' } = {}) {
  if (!img) return resolveIcon({ name, type });
  if (BROKEN_ICON_REMEDIATION_MAP[img]) return BROKEN_ICON_REMEDIATION_MAP[img];
  if (img.startsWith('systems/tormenta20/') && VALID_SYSTEM_ICONS.size > 0 && !VALID_SYSTEM_ICONS.has(img)) {
    const base = img.split('/').pop();
    if (VALID_SYSTEM_BY_BASENAME.has(base)) return VALID_SYSTEM_BY_BASENAME.get(base);
    return resolveIcon({ name, type });
  }
  if (img.startsWith('modules/compendios-para-t20/')) {
    const rel = img.replace('modules/compendios-para-t20/', '');
    if (!fs.existsSync(path.join(ROOT_DIR, rel))) return resolveIcon({ name, type });
  }
  if (img.startsWith('icons/') && !['icons/svg/mystery-man.svg', 'icons/svg/d20-grey.svg', 'icons/svg/book.svg', 'icons/svg/hazard.svg', 'icons/svg/dice-target.svg', 'icons/svg/item-bag.svg'].includes(img)) {
    return resolveIcon({ name, type });
  }
  return img;
}

// Carrega o catálogo do Game-Icons se disponível
let gameIconsCatalog = null;
try {
  if (fs.existsSync(GAME_ICONS_INDEX_PATH)) {
    gameIconsCatalog = JSON.parse(fs.readFileSync(GAME_ICONS_INDEX_PATH, 'utf-8')).catalog;
  }
} catch {
  // Ignora se não carregou
}

/**
 * Remove acentos, pontuação e normaliza string para busca
 */
function normalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mapeamentos semânticos explícitos de nomes/termos frequentes em T20
 */
/**
 * Mapa de Tokens EXCLUSIVAMENTE originados do 2-Minute Tabletop (top-down transparentes)
 */
const TOKEN_2MTT_MAP = {
  'lynel': 'modules/compendios-para-t20/assets/tokens/lynel.png',
  'oxxdon': 'modules/compendios-para-t20/assets/tokens/oxxdon.png',
  'tyrant': 'modules/compendios-para-t20/assets/tokens/tyrant.png',
  'espectro do pesadelo': 'modules/compendios-para-t20/assets/tokens/espectro-do-pesadelo.png',
  'expurgo onirico': 'modules/compendios-para-t20/assets/tokens/expurgo-onirico.png',
  'enxame de armas': 'modules/compendios-para-t20/assets/tokens/enxame-de-armas.png',
  'tropa de mortos': 'modules/compendios-para-t20/assets/tokens/tropa-de-mortos.png',
  'inumano': 'modules/compendios-para-t20/assets/tokens/inumano.png',
  'ankthyr': 'modules/compendios-para-t20/assets/tokens/ankthyr.png',
  'enxame caustico': 'modules/compendios-para-t20/assets/tokens/enxame-caustico.png',
  'slark': 'modules/compendios-para-t20/assets/tokens/slark.png',
  'desabamento dos tuneis': 'modules/compendios-para-t20/assets/tokens/desabamento-dos-tuneis.png',
  'allihennali': 'modules/compendios-para-t20/assets/tokens/allihennali.png',
  'guaxininjas': 'modules/compendios-para-t20/assets/tokens/guaxininjas.png',
  'reabilitador': 'modules/compendios-para-t20/assets/tokens/reabilitador.png',
  // Fúlgor dos Deuses — Edição 26
  'asmithar martelo mudo': 'modules/compendios-para-t20/assets/tokens/asmithar-martelo-mudo.png',
  'asmithar': 'modules/compendios-para-t20/assets/tokens/asmithar-martelo-mudo.png',
  'xellmaras a ladra acorrentada': 'modules/compendios-para-t20/assets/tokens/xellmaras-a-ladra-acorrentada.png',
  'xellmaras': 'modules/compendios-para-t20/assets/tokens/xellmaras-a-ladra-acorrentada.png',
  'gangue de hyninn deturpada': 'modules/compendios-para-t20/assets/tokens/gangue-de-hyninn-deturpada.png',
  'sacerdote de hyninn deturpado': 'modules/compendios-para-t20/assets/tokens/sacerdote-de-hyninn-deturpado.png',
  'tigre de hyninn deturpado': 'modules/compendios-para-t20/assets/tokens/tigre-de-hyninn-deturpado.png',
  'aco selvagem': 'modules/compendios-para-t20/assets/tokens/aco-selvagem.png',
  // Fúlgor dos Deuses — Edição 27
  'cassiella semi fullgori': 'modules/compendios-para-t20/assets/tokens/cassiella-semi-fullgori.png',
  'cassiella de baldonn': 'modules/compendios-para-t20/assets/tokens/cassiella-semi-fullgori.png',
  'cassiella fullgori': 'modules/compendios-para-t20/assets/tokens/cassiella-fullgori.png',
  'enxame trog': 'modules/compendios-para-t20/assets/tokens/enxame-trog.png',
  'troggore': 'modules/compendios-para-t20/assets/tokens/troggore.png',
  'bando troggore': 'modules/compendios-para-t20/assets/tokens/bando-troggore.png',
  'urrash das sombras frias': 'modules/compendios-para-t20/assets/tokens/urrash-das-sombras-frias.png',
  'urrash': 'modules/compendios-para-t20/assets/tokens/urrash-das-sombras-frias.png',
  // DB #229
  'defensor rochoso desperto': 'modules/compendios-para-t20/assets/tokens/defensor-rochoso-desperto.png',
  'defensor rochoso': 'modules/compendios-para-t20/assets/tokens/defensor-rochoso-desperto.png',
  'revoada de serpes': 'modules/compendios-para-t20/assets/tokens/revoada-de-serpes.png',
  'presa do grande basilisco': 'modules/compendios-para-t20/assets/tokens/presa-do-grande-basilisco.png',
  'basilisco ancestral': 'modules/compendios-para-t20/assets/tokens/basilisco-ancestral.png',
  // DB #230
  'zangao do pesadelo': 'modules/compendios-para-t20/assets/tokens/zangao-do-pesadelo.png',
  'coletor do pesadelo': 'modules/compendios-para-t20/assets/tokens/coletor-do-pesadelo.png',
  'ceifador do pesadelo': 'modules/compendios-para-t20/assets/tokens/ceifador-do-pesadelo.png',
  'pesadelo polivalente': 'modules/compendios-para-t20/assets/tokens/pesadelo-polivalente.png',
  'mestre do pesadelo': 'modules/compendios-para-t20/assets/tokens/mestre-do-pesadelo.png',
  'lanceiro onirico': 'modules/compendios-para-t20/assets/tokens/lanceiro-onirico.png',
  'ginete onirico': 'modules/compendios-para-t20/assets/tokens/ginete-onirico.png',
  'sargento onirico': 'modules/compendios-para-t20/assets/tokens/sargento-onirico.png',
  'tenente onirico': 'modules/compendios-para-t20/assets/tokens/tenente-onirico.png',
  'nocnam mur': 'modules/compendios-para-t20/assets/tokens/nocnam-mur.png',
  'nocnam mur o pesadelo amalgamado': 'modules/compendios-para-t20/assets/tokens/nocnam-mur.png',
  'sacerdote caido': 'modules/compendios-para-t20/assets/tokens/sacerdote-caido.png',
  'tres goblins em um gorlogg': 'modules/compendios-para-t20/assets/tokens/tres-goblins-em-um-gorlogg.png',
  'arzak': 'modules/compendios-para-t20/assets/tokens/arzak.png',
  'gaardak': 'modules/compendios-para-t20/assets/tokens/gaardak.png',
  // DB #231
  'arraia seca': 'modules/compendios-para-t20/assets/tokens/arraia-seca.png',
  'anshira': 'modules/compendios-para-t20/assets/tokens/anshira.png',
  'cacador de condenados': 'modules/compendios-para-t20/assets/tokens/cacador-de-condenados.png',
  'constritora arenosa': 'modules/compendios-para-t20/assets/tokens/constritora-arenosa.png',
  'ressecado saqueador': 'modules/compendios-para-t20/assets/tokens/ressecado-saqueador.png',
  'ressecado lider': 'modules/compendios-para-t20/assets/tokens/ressecado-lider.png',
  'bianco': 'modules/compendios-para-t20/assets/tokens/bianco.png',
  'rojo': 'modules/compendios-para-t20/assets/tokens/rojo.png',
  'manticora zumbi': 'modules/compendios-para-t20/assets/tokens/manticora-zumbi.png',
  'morrise': 'modules/compendios-para-t20/assets/tokens/morrise.png',
  // DB #232
  'lobisomem predador urbano': 'modules/compendios-para-t20/assets/tokens/lobisomem-predador-urbano.png',
  'lobisomem cacador de recompensas': 'modules/compendios-para-t20/assets/tokens/lobisomem-cacador-de-recompensas.png',
  'licantropo rato comedor de restos': 'modules/compendios-para-t20/assets/tokens/licantropo-rato-comedor-de-restos.png',
  'licantropo rato infiltrador veterano': 'modules/compendios-para-t20/assets/tokens/licantropo-rato-infiltrador-veterano.png',
  'licantropo onca pirata de rio': 'modules/compendios-para-t20/assets/tokens/licantropo-onca-pirata-de-rio.png',
  'licantropo onca lutador de arena': 'modules/compendios-para-t20/assets/tokens/licantropo-onca-lutador-de-arena.png',
  'licantropo texugo furioso': 'modules/compendios-para-t20/assets/tokens/licantropo-texugo-furioso.png',
  'licantropo texugo servo da noite': 'modules/compendios-para-t20/assets/tokens/licantropo-texugo-servo-da-noite.png',
  'licantropo selako farejador de sangue': 'modules/compendios-para-t20/assets/tokens/licantropo-selako-farejador-de-sangue.png',
  'licantropo selako terror dos mares': 'modules/compendios-para-t20/assets/tokens/licantropo-selako-terror-dos-mares.png',
  'mamae glop': 'modules/compendios-para-t20/assets/tokens/mamae-glop.png',
  'estirge': 'modules/compendios-para-t20/assets/tokens/estirge.png',
  'perdigueiro troll': 'modules/compendios-para-t20/assets/tokens/perdigueiro-troll.png',
  'ginete de troll purista': 'modules/compendios-para-t20/assets/tokens/ginete-de-troll-purista.png',
  'xama finntroll': 'modules/compendios-para-t20/assets/tokens/xama-finntroll.png',
  // Fúlgor dos Deuses — Edição 28
  'liriavel forma de quimera': 'modules/compendios-para-t20/assets/tokens/liriavel-forma-de-quimera.png',
  'liriavel': 'modules/compendios-para-t20/assets/tokens/liriavel-forma-de-quimera.png',
  'rashid fullgori': 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png',
  'rashid': 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png',
  'templo do saber em mutacao': 'modules/compendios-para-t20/assets/tokens/rashid-fullgori.png'
};

const THREAT_MAP = {
  'lynel': 'systems/tormenta20/icons/ameacas/centauro-combatente.png',
  'oxxdon': 'modules/compendios-para-t20/assets/icons/ameacas/oxxdon.jpg',
  'tyrant': 'modules/compendios-para-t20/assets/icons/ameacas/tyrant.jpg',
  'espectro do pesadelo': 'modules/compendios-para-t20/assets/icons/ameacas/espectro-do-pesadelo.jpg',
  'expurgo onirico': 'systems/tormenta20/icons/poderes/tormenta.webp',
  'enxame de armas': 'modules/compendios-para-t20/assets/icons/ameacas/enxame-de-armas.jpg',
  'tropa de mortos': 'systems/tormenta20/icons/ameacas/falange.png',
  'inumano': 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png',
  'ankthyr': 'systems/tormenta20/icons/ameacas/centopeia-dragao.png',
  'enxame caustico': 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-insetos-rubros.webp',
  'slark': 'systems/tormenta20/icons/ameacas/trog.png',
  'desabamento dos tuneis': 'systems/tormenta20/icons/poderes/ameacas/quebrar-tudo.webp',
  'allihennali': 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
  'guaxininjas': 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
  'reabilitador': 'systems/tormenta20/icons/poderes/classes/combatentes/bencao-justica-egide.webp',
  // DB #229
  'defensor rochoso desperto': 'systems/tormenta20/icons/ameacas/golem-de-ferro.png',
  'defensor rochoso': 'systems/tormenta20/icons/ameacas/golem-de-ferro.png',
  'revoada de serpes': 'systems/tormenta20/icons/ameacas/serpe.png',
  'presa do grande basilisco': 'systems/tormenta20/icons/ameacas/cultista-da-traicao.png',
  'basilisco ancestral': 'systems/tormenta20/icons/ameacas/basilisco.png',
  // DB #230
  'zangao do pesadelo': 'systems/tormenta20/icons/ameacas/convocacoes/enxame-de-insetos-rubros.webp',
  'coletor do pesadelo': 'systems/tormenta20/icons/poderes/ameacas/dreno.webp',
  'ceifador do pesadelo': 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
  'pesadelo polivalente': 'modules/compendios-para-t20/assets/icons/ameacas/tyrant.jpg',
  'mestre do pesadelo': 'modules/compendios-para-t20/assets/icons/ameacas/espectro-do-pesadelo.jpg',
  'lanceiro onirico': 'systems/tormenta20/icons/armas/lanca.webp',
  'ginete onirico': 'systems/tormenta20/icons/poderes/ameacas/montaria.webp',
  'sargento onirico': 'systems/tormenta20/icons/armas/espada-bastarda.webp',
  'tenente onirico': 'systems/tormenta20/icons/ameacas/falange.png',
  'nocnam mur': 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png',
  'nocnam mur o pesadelo amalgamado': 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png',
  'sacerdote caido': 'systems/tormenta20/icons/ameacas/cultista-da-traicao.png',
  'tres goblins em um gorlogg': 'systems/tormenta20/icons/poderes/ameacas/explosao.webp',
  'arzak': 'systems/tormenta20/icons/poderes/ameacas/assassinar.webp',
  'gaardak': 'systems/tormenta20/icons/poderes/ameacas/furia.webp',
  // DB #231
  'arraia seca': 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
  'anshira': 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
  'cacador de condenados': 'systems/tormenta20/icons/ameacas/nagah-guardiao.png',
  'constritora arenosa': 'systems/tormenta20/icons/ameacas/sucuri.png',
  'ressecado saqueador': 'systems/tormenta20/icons/ameacas/esqueleto.png',
  'ressecado lider': 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png',
  'bianco': 'systems/tormenta20/icons/ameacas/aparicao.png',
  'rojo': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'manticora zumbi': 'systems/tormenta20/icons/ameacas/manticora.png',
  'morrise': 'systems/tormenta20/icons/ameacas/necromante-veterano.png',
  // DB #232
  'lobisomem predador urbano': 'systems/tormenta20/icons/ameacas/lobo.png',
  'lobisomem cacador de recompensas': 'systems/tormenta20/icons/ameacas/lobo-das-cavernas.png',
  'licantropo rato comedor de restos': 'systems/tormenta20/icons/ameacas/rato-gigante.png',
  'licantropo rato infiltrador veterano': 'systems/tormenta20/icons/poderes/classes/especialistas/passo-furtivo.webp',
  'licantropo onca pirata de rio': 'systems/tormenta20/icons/ameacas/lobo-crocodilo.png',
  'licantropo onca lutador de arena': 'systems/tormenta20/icons/poderes/classes/combatentes/estilo-desarmado.webp',
  'licantropo texugo furioso': 'systems/tormenta20/icons/poderes/classes/combatentes/furia.webp',
  'licantropo texugo servo da noite': 'systems/tormenta20/icons/magias/escuridao.webp',
  'licantropo selako farejador de sangue': 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
  'licantropo selako terror dos mares': 'systems/tormenta20/icons/ameacas/troll-aquatico.png',
  'mamae glop': 'systems/tormenta20/icons/ameacas/glop.png',
  'estirge': 'systems/tormenta20/icons/ameacas/besouro-aberrante.png',
  'perdigueiro troll': 'systems/tormenta20/icons/ameacas/troll-subterraneo.png',
  'ginete de troll purista': 'systems/tormenta20/icons/ameacas/troll.png',
  'xama finntroll': 'systems/tormenta20/icons/ameacas/finntroll-feitor.png',
  // Fúlgor dos Deuses — Edição 28
  'liriavel forma de quimera': 'systems/tormenta20/icons/ameacas/manticora.png',
  'rashid fullgori': 'systems/tormenta20/icons/ameacas/golem-de-ferro.png',
  'templo do saber em mutacao': 'systems/tormenta20/icons/magias/muralha-elemental.webp'
};

const ITEM_AND_POWER_MAP = {
  // Armas e Armaduras
  'espada bastarda': 'systems/tormenta20/icons/itens/equipamentos/espada-bastarda.webp',
  'espada longa': 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
  'espada curta': 'systems/tormenta20/icons/itens/equipamentos/espada-curta.webp',
  'espada': 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp',
  'machado de guerra': 'systems/tormenta20/icons/itens/equipamentos/machado-de-guerra.webp',
  'machado de batalha': 'systems/tormenta20/icons/itens/equipamentos/machado-de-batalha.webp',
  'machado': 'systems/tormenta20/icons/itens/equipamentos/machado-de-guerra.webp',
  'alabarda': 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
  'tacape': 'systems/tormenta20/icons/itens/equipamentos/tacape.webp',
  'arco de guerra': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'arco longo': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'arco curto': 'systems/tormenta20/icons/itens/equipamentos/arco-curto.webp',
  'arco': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'azagaia': 'systems/tormenta20/icons/itens/equipamentos/azagaia.webp',
  'escudo pesado': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'escudo leve': 'systems/tormenta20/icons/itens/equipamentos/escudo-leve.webp',
  'escudo': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'adaga': 'systems/tormenta20/icons/itens/equipamentos/adaga.webp',
  'flechas': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',

  // Ataques Naturais e Habilidades Especiais de Ameaças (T20 & Wowhead/Game-Icons)
  'mordida': 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
  'garras': 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
  'garra': 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
  'pancada': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'pancadas': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'cascos': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'coice oportuno': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'coice': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'sopro de fogo': 'modules/compendios-para-t20/assets/icons/poderes/lynel-sopro.jpg',
  'cospe chamas': 'modules/compendios-para-t20/assets/icons/poderes/lynel-sopro.jpg',
  'sopro': 'systems/tormenta20/icons/poderes/ameacas/sopro.webp',
  'investida galopante': 'modules/compendios-para-t20/assets/icons/poderes/lynel-investida.jpg',
  'investida': 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
  'brado indomavel': 'modules/compendios-para-t20/assets/icons/poderes/lynel-brado.jpg',
  'relincho aterrador': 'modules/compendios-para-t20/assets/icons/poderes/relincho-aterrador.jpg',
  'antena': 'modules/compendios-para-t20/assets/icons/poderes/oxxdon-antena.jpg',
  'ferrao': 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
  'pincas': 'systems/tormenta20/icons/poderes/ameacas/pincas.webp',
  'imunidade a magia': 'modules/compendios-para-t20/assets/icons/poderes/imunidade-magia.jpg',
  'resistencia a magia': 'systems/tormenta20/icons/poderes/ameacas/resistencia-magia.webp',
  'sensibilidade a luz': 'systems/tormenta20/icons/poderes/ameacas/sensibilidade-luz.webp',
  'vulnerabilidade a luz do dia': 'systems/tormenta20/icons/poderes/ameacas/sensibilidade-luz.webp',
  'vulnerabilidade': 'systems/tormenta20/icons/poderes/ameacas/vulnerabilidade.webp',
  'aura aterradora': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'terror encarnado': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'drenar energia': 'modules/compendios-para-t20/assets/icons/poderes/drenar-energia.jpg',
  'ataque trevas': 'systems/tormenta20/icons/poderes/ameacas/ataque-trevas.webp',
  'taticas de alcateia': 'systems/tormenta20/icons/poderes/ameacas/taticas-alcateia.webp',
  'bando': 'modules/compendios-para-t20/assets/icons/poderes/tropa-bando.jpg',
  'devorar sonhos': 'modules/compendios-para-t20/assets/icons/poderes/devorar-sonhos.jpg',
  'semi incorporeo': 'modules/compendios-para-t20/assets/icons/poderes/semi-incorporeo.jpg',
  'cura acelerada': 'modules/compendios-para-t20/assets/icons/poderes/cura-acelerada.jpg',
  'super tyrant': 'modules/compendios-para-t20/assets/icons/poderes/super-tyrant.jpg',
  'ferrugem': 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.jpg',

  // DB #228
  'arco dos arautos': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'certificado de conclusao': 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
  'chave mestra': 'systems/tormenta20/icons/itens/itens-magicos/espelho-do-aprisonamento.webp',
  'bilhete de valluk delsori': 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
  'mascara do sol dourado': 'systems/tormenta20/icons/itens/itens-magicos/brincos.webp',
  'pingente rubro': 'systems/tormenta20/icons/poderes/concedidos-tormenta.webp',
  'alma de dragao': 'systems/tormenta20/icons/itens/itens-magicos/escudo-do-conjurador.webp',
  'ancora naufragista': 'systems/tormenta20/icons/poderes/concedidos-mares.webp',
  'arma silente': 'systems/tormenta20/icons/itens/equipamentos/alabarda.webp',
  'memorizar conhecimento': 'systems/tormenta20/icons/magias/invulnerabilidade.webp',
  'citola da paz': 'systems/tormenta20/icons/poderes/concedidos-paz.webp',
  'percepcao de masmorra': 'systems/tormenta20/icons/poderes/concedidos-trapaca.webp',
  'rosario da vida': 'systems/tormenta20/icons/poderes/concedidos-vida.webp',
  'bussola das lagrimas': 'systems/tormenta20/icons/poderes/concedidos-ambicao.webp',
  'corso sombrio': 'systems/tormenta20/icons/svg/scroll-unfurled.svg',
  'previdencia da vigilia': 'systems/tormenta20/icons/poderes/concedidos-ressurreicao.webp',
  'bomba de tinta': 'systems/tormenta20/icons/itens/gerais/agua-benta.webp',

  // DB #229
  'olho de basilisco ancestral': 'systems/tormenta20/icons/itens/gerais/gemas-preciosas.webp',
  'olho de basilisco': 'systems/tormenta20/icons/itens/gerais/gemas-preciosas.webp',
  'couro de basilisco ancestral': 'systems/tormenta20/icons/itens/gerais/couro-de-basilisco.webp',
  'couro de basilisco': 'systems/tormenta20/icons/itens/gerais/couro-de-basilisco.webp',
  'peconha concentrada': 'systems/tormenta20/icons/itens/gerais/veneno.webp',
  'peconha potente': 'systems/tormenta20/icons/itens/gerais/veneno.webp',
  'machado de batalha do culto do basilisco': 'systems/tormenta20/icons/itens/equipamentos/machado-de-batalha.webp',
  'machado de batalha do culto': 'systems/tormenta20/icons/itens/equipamentos/machado-de-batalha.webp',
  'parceiro: arius gorgonius dubitatius': 'systems/tormenta20/icons/poderes/classes/especialistas/conhecimento-de-lendas.webp',
  'arius gorgonius dubitatius': 'systems/tormenta20/icons/poderes/classes/especialistas/conhecimento-de-lendas.webp',
  'arius': 'systems/tormenta20/icons/poderes/classes/especialistas/conhecimento-de-lendas.webp',
  'parceira: aylarianna purpurea (ayla)': 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
  'aylarianna purpurea': 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
  'ayla': 'systems/tormenta20/icons/poderes/classes/conjuradores/linhagem-feerica.webp',
  'parceiro: ignis crae': 'systems/tormenta20/icons/poderes/concedidos/dom-da-ressurreicao.webp',
  'ignis crae': 'systems/tormenta20/icons/poderes/concedidos/dom-da-ressurreicao.webp',
  'ignis': 'systems/tormenta20/icons/poderes/concedidos/dom-da-ressurreicao.webp',
  'parceira: kir’zanaath odello (kiki)': 'systems/tormenta20/icons/poderes/classes/especialistas/inspiracao.webp',
  'kir’zanaath odello': 'systems/tormenta20/icons/poderes/classes/especialistas/inspiracao.webp',
  'kiki': 'systems/tormenta20/icons/poderes/classes/especialistas/inspiracao.webp',
  'parceiro: rexthor': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
  'rexthor': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-poderoso.webp',
  'parceiro: kemooz pensativo': 'systems/tormenta20/icons/magias/criar-elementos.webp',
  'kemooz pensativo': 'systems/tormenta20/icons/magias/criar-elementos.webp',
  'kemooz': 'systems/tormenta20/icons/magias/criar-elementos.webp',
  'parceiro: filhote de grifo': 'systems/tormenta20/icons/itens/gerais/grifo.webp',
  'filhote de grifo': 'systems/tormenta20/icons/itens/gerais/grifo.webp',
  'parceiro: defensor rochoso desperto': 'systems/tormenta20/icons/poderes/classes/combatentes/bloqueio-com-escudo.webp',
  'natureza abascanta': 'systems/tormenta20/icons/poderes/ameacas/resistencia-magia.webp',
  'imobilidade': 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
  'pancada atordoante': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'odio sordido': 'systems/tormenta20/icons/poderes/ameacas/golpe-cruel.webp',
  'vitalidade peconhenta': 'systems/tormenta20/icons/poderes/classes/combatentes/retomar-folego.webp',
  'olhar petrificante': 'systems/tormenta20/icons/poderes/ameacas/olhar-aterrador.webp',
  'cuspe acido': 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.jpg',
  'espreitador subterraneo': 'systems/tormenta20/icons/poderes/ameacas/bote.webp',
  'sentido sismico': 'systems/tormenta20/icons/poderes/ameacas/visao-ampla.webp',
  'gosma corrosiva': 'systems/tormenta20/icons/poderes/ameacas/veneno.webp',
  'queda livre': 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-cruel.webp',
  'saliva cegante': 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
  'saliva': 'systems/tormenta20/icons/poderes/ameacas/fumos-toxicos.webp',
  'agarrar aprimorado': 'systems/tormenta20/icons/poderes/ameacas/agarrar.webp',
  'enxame caustico': 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.jpg',

  // Poderes de Combate e Caverna do Saber
  'retomar folego': 'systems/tormenta20/icons/poderes/classes/combatentes/durao.webp',
  'ataque com escudo': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'defesa desarmada': 'systems/tormenta20/icons/poderes/classes/combatentes/briga.webp',
  'flechada com rolamento': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'golpe aereo': 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-cruel.webp',
  'flechada de manobra': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',
  'torrente de flechas': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',
  'golpe poderoso explosivo': 'modules/compendios-para-t20/assets/icons/poderes/golpe-poderoso-explosivo.jpg',
  'golpear e correr': 'modules/compendios-para-t20/assets/icons/poderes/correr-manobra.jpg',
  'flechada de impacto': 'modules/compendios-para-t20/assets/icons/poderes/flechada-impacto.jpg',
  'flechada precisa distante': 'modules/compendios-para-t20/assets/icons/poderes/flechada-precisa.jpg',
  'especialista em camuflagens': 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
  'especialista em arcos e bestas': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'carga de cavalaria': 'modules/compendios-para-t20/assets/icons/poderes/carga-cavalaria.jpg',
  'economia de habilidade': 'systems/tormenta20/icons/poderes/classes/especialistas/fabricar-item-superior.webp',
  'escudo fundacao': 'modules/compendios-para-t20/assets/icons/poderes/bloqueio-escudo-perfeito.jpg',
  'atirar e correr': 'modules/compendios-para-t20/assets/icons/poderes/correr-manobra.jpg',
  'esquiva': 'systems/tormenta20/icons/poderes/classes/combatentes/autoconfianca.webp',
  'escudo para lancamento': 'systems/tormenta20/icons/itens/equipamentos/escudo-leve.webp',
  'especialista em coberturas': 'systems/tormenta20/icons/poderes/classes/combatentes/baluarte.webp',
  'costas largas': 'systems/tormenta20/icons/poderes/classes/combatentes/casca-grossa.webp',
  'combatente sanguinario': 'modules/compendios-para-t20/assets/icons/poderes/combatente-sanguinario.jpg',
  'bloqueio com escudo perfeito': 'modules/compendios-para-t20/assets/icons/poderes/bloqueio-escudo-perfeito.jpg',
  'ginete de guerra': 'modules/compendios-para-t20/assets/icons/poderes/carga-cavalaria.jpg',
  'ataque poderoso': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-especial.webp',
  'aparar': 'modules/compendios-para-t20/assets/icons/poderes/enxame-aparar.jpg',
  'armamento lynel': 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp'
};

const CANONICAL_MAP = {
  ...THREAT_MAP,
  ...ITEM_AND_POWER_MAP
};

/**
 * Baixa um arquivo de qualquer URL pública (seguindo redirecionamentos) e salva localmente
 */
function downloadFromUrl(url, localRelativePath) {
  const destFile = path.isAbsolute(localRelativePath)
    ? localRelativePath
    : path.join(__dirname, '..', localRelativePath);

  fs.mkdirSync(path.dirname(destFile), { recursive: true });

  return new Promise((resolve, reject) => {
    function fetchUrl(currentUrl, maxRedirects = 5) {
      if (maxRedirects <= 0) return reject(new Error('Muitos redirecionamentos'));

      const isHttps = currentUrl.startsWith('https://');
      const client = isHttps ? https : require('http');

      client.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, currentUrl).href;
          return fetchUrl(nextUrl, maxRedirects - 1);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Falha HTTP ${res.statusCode} ao baixar ${currentUrl}`));
        }

        const fileStream = fs.createWriteStream(destFile);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const foundryPath = `modules/compendios-para-t20/${path.relative(path.join(__dirname, '..'), destFile)}`;
          resolve(foundryPath);
        });
      }).on('error', reject);
    }

    fetchUrl(url);
  });
}

/**
 * Baixa um ícone do Wowhead pelo nome exato do ícone do World of Warcraft
 */
async function downloadWowheadIconByName(wowIconName, localRelativePath) {
  const cleanName = wowIconName.replace(/\.(jpg|png|webp)$/i, '').trim();
  const url = `https://wow.zamimg.com/images/wow/icons/large/${cleanName}.jpg`;
  const dest = localRelativePath || `assets/icons/wow/${cleanName}.jpg`;
  return downloadFromUrl(url, dest);
}

/**
 * Busca um ícone no Wowhead por palavra-chave e baixa o resultado mais popular
 */
async function searchAndDownloadWowhead(query, localRelativePath) {
  const searchUrl = `https://www.wowhead.com/icons/name:${encodeURIComponent(query.toLowerCase())}`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', async () => {
        const matches = [...html.matchAll(/\"icon\":\"([^\"]+)\"/g)].map(m => m[1]);
        if (matches.length === 0) {
          return resolve({ success: false, reason: `Nenhum ícone encontrado no Wowhead para: ${query}` });
        }
        const bestIcon = matches[0];
        const dest = localRelativePath || `assets/icons/wow/${bestIcon}.jpg`;
        try {
          const foundryPath = await downloadWowheadIconByName(bestIcon, dest);
          resolve({
            success: true,
            query,
            iconName: bestIcon,
            foundryPath,
            totalMatches: matches.length
          });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Baixa um arquivo de qualquer repositório GitHub público (ex: orourkek/Wow-Icons ou AcidWeb/Clean-Icons)
 */
async function downloadFromGithubRaw({ owner, repo, branch = 'master', path: repoPath, localRelativePath }) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repoPath}`;
  const dest = localRelativePath || `assets/icons/${repo}/${path.basename(repoPath)}`;
  return downloadFromUrl(url, dest);
}

/**
 * Baixa um ícone SVG oficial do Game-Icons.net e salva estilizado em assets/icons/
 */
async function downloadGameIcon(gameIconName, localRelativePath) {
  if (!gameIconsCatalog) return null;
  const paths = gameIconsCatalog[gameIconName];
  if (!paths || paths.length === 0) return null;

  const rawPath = paths[0]; // e.g. delapouite/brute.svg
  const url = `https://raw.githubusercontent.com/game-icons/icons/master/${rawPath}`;
  const destFile = path.join(__dirname, '..', localRelativePath);

  fs.mkdirSync(path.dirname(destFile), { recursive: true });

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Falha HTTP ${res.statusCode} ao baixar ${url}`));
      }
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        // Estiliza o SVG para ficar bonito no Foundry VTT (fundo escuro/transparente, traço nítido)
        let svg = rawData;
        if (!svg.includes('fill=')) {
          svg = svg.replace('<path', '<path fill="#e0e0e0"');
        }
        fs.writeFileSync(destFile, svg, 'utf-8');
        const foundryPath = `modules/compendios-para-t20/${localRelativePath}`;
        resolve(foundryPath);
      });
    }).on('error', err => reject(err));
  });
}

/**
 * Resolve o melhor ícone canônico para um ator ou item
 * @param {Object} options
 * @param {string} options.name Nome do item ou ator
 * @param {string} options.type Tipo do documento ('npc', 'poder', 'arma', 'equipamento', etc.)
 * @param {string} [options.currentImg] Imagem atualmente configurada
 * @returns {string} Caminho resolvido compatível com Foundry VTT
 */
function resolveIcon({ name, type = 'poder', currentImg = '' }) {
  if (!name) return currentImg || 'systems/tormenta20/icons/svg/skills.svg';

  const norm = normalize(name);
  const isActor = (type === 'npc' || type === 'actor');

  // Seleciona o mapa prioritário baseado no tipo
  const primaryMap = isActor ? THREAT_MAP : ITEM_AND_POWER_MAP;
  const secondaryMap = isActor ? ITEM_AND_POWER_MAP : THREAT_MAP;

  // 1. Verifica correspondência direta no mapa prioritário
  if (primaryMap[norm]) {
    return primaryMap[norm];
  }

  // 2. Remove números romanos (' i', ' ii', ' iii', etc.)
  const cleanNorm = norm
    .replace(/\s+(i{1,3}|iv|v|vi|vii|viii|ix|x)$/i, '')
    .trim();

  if (primaryMap[cleanNorm]) {
    return primaryMap[cleanNorm];
  }

  // 3. Remove sufixos de pertencimento ('lynel', 'inumana', 'da tropa', etc.)
  const baseName = cleanNorm
    .replace(/\s+(lynel|inumano|inumana|da tropa)$/i, '')
    .trim();

  if (primaryMap[baseName]) {
    return primaryMap[baseName];
  }

  // 4. Busca por palavras-chave no mapa prioritário (ordenado por tamanho decrescente da chave para evitar falso match de substring curta)
  const sortedPrimaryKeys = Object.keys(primaryMap).sort((a, b) => b.length - a.length);
  for (const key of sortedPrimaryKeys) {
    if (cleanNorm.includes(key) || baseName.includes(key)) {
      return primaryMap[key];
    }
  }

  // 5. Se for item, tenta secundário se não achou nada
  if (!isActor) {
    const sortedSecKeys = Object.keys(secondaryMap).sort((a, b) => b.length - a.length);
    for (const key of sortedSecKeys) {
      if (cleanNorm.includes(key) || baseName.includes(key)) {
        return secondaryMap[key];
      }
    }
  }

  // 6. Fallback estruturado por tipo de documento se não houver match
  if (type === 'arma') {
    return 'systems/tormenta20/icons/itens/equipamentos/espada-longa.webp';
  }
  if (type === 'armadura' || type === 'escudo' || type === 'equipamento') {
    return 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp';
  }
  if (type === 'poder') {
    return 'systems/tormenta20/icons/poderes/combate.webp';
  }
  if (type === 'magia') {
    return 'systems/tormenta20/icons/magias/adaga-mental.webp';
  }
  if (type === 'macro') {
    return 'systems/tormenta20/icons/itens/gerais/ferramenta-pesada.webp';
  }
  if (isActor) {
    return 'systems/tormenta20/icons/ameacas/colosso-supremo.png';
  }

  return (currentImg && isVerifiedIconPath(currentImg)) ? currentImg : 'systems/tormenta20/icons/svg/skills.svg';
}

const rawResolveIcon = resolveIcon;
function verifiedResolveIcon(opts) {
  const candidate = rawResolveIcon(opts);
  return repairBrokenIconPath(candidate, opts);
}

/**
 * Resolve o token EXCLUSIVAMENTE a partir do acervo 2-Minute Tabletop
 * @param {Object} options
 * @param {string} options.name Nome do ator
 * @returns {string} Caminho do token 2-Minute Tabletop
 */
function resolveToken({ name }) {
  if (!name) return 'modules/compendios-para-t20/assets/tokens/tyrant.png';
  const norm = normalize(name);

  if (TOKEN_2MTT_MAP[norm]) {
    return TOKEN_2MTT_MAP[norm];
  }

  for (const [key, tokenPath] of Object.entries(TOKEN_2MTT_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return tokenPath;
    }
  }

  // Fallback padrão 2MTT
  return 'modules/compendios-para-t20/assets/tokens/lynel.png';
}

/**
 * Busca e baixa um token transparente do acervo 2-Minute Tabletop
 */
function searchAndDownload2MinuteTabletopToken(query, localRelativePath) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://tools.2minutetabletop.com/token-editor/index?search=${encodeURIComponent(query)}`;
    https.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const matches = [...html.matchAll(/<h5[^>]*>(.*?)<\/h5>.*?<img\s+src=[\"'](\/token-editor\/token-uploads\/[^\"'?]+)/gs)]
          .filter(m => !m[1].includes('Token Types'));

        if (matches.length === 0) {
          return resolve({ success: false, reason: `Nenhum token 2MTT encontrado para: ${query}` });
        }

        const [, title, relPath] = matches[0];
        const tokenUrl = `https://tools.2minutetabletop.com${relPath}`;
        const destFile = path.isAbsolute(localRelativePath)
          ? localRelativePath
          : path.join(__dirname, '..', localRelativePath);

        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        const fileStream = fs.createWriteStream(destFile);

        https.get(tokenUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (tokenRes) => {
          tokenRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve({
              success: true,
              query,
              title: title.trim(),
              tokenUrl,
              destFile,
              foundryPath: `modules/compendios-para-t20/${path.relative(path.join(__dirname, '..'), destFile)}`,
              totalFound: matches.length
            });
          });
        }).on('error', reject);
      });
    }).on('error', reject);
  });
}

module.exports = {
  resolveIcon: verifiedResolveIcon,
  resolveToken,
  isVerifiedIconPath,
  repairBrokenIconPath,
  VALID_SYSTEM_ICONS,
  BROKEN_ICON_REMEDIATION_MAP,
  searchAndDownload2MinuteTabletopToken,
  downloadGameIcon,
  downloadFromUrl,
  downloadWowheadIconByName,
  searchAndDownloadWowhead,
  downloadFromGithubRaw,
  CANONICAL_MAP,
  THREAT_MAP,
  ITEM_AND_POWER_MAP,
  TOKEN_2MTT_MAP,
  T20_ICONS_DIR,
  MODULE_ICONS_DIR,
  normalize
};

// Modo CLI para testes rápidos
if (require.main === module) {
  const args = process.argv.slice(2);
  const testName = args[0] || 'Espada Bastarda e Escudo Lynel';
  console.log(`Testando resolução para: "${testName}"`);
  console.log('Resultado:', resolveIcon({ name: testName, type: 'arma' }));
}

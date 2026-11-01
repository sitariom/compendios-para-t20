/**
 * Motor Inteligente de Resolução e Download de Ícones para Tormenta20
 *
 * Prioridades:
 * 1. Acervo canônico local: /home/orange/Documents/Tormenta20/icons (systems/tormenta20/icons/...)
 * 2. Acervo do módulo local: assets/icons/ (modules/compendios-para-t20/assets/icons/...)
 * 3. Download sob demanda do repositório oficial Game-Icons.net (CC BY 3.0) com estilização Foundry.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const T20_ICONS_DIR = '/home/orange/Documents/Tormenta20/icons';
const MODULE_ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
const GAME_ICONS_INDEX_PATH = path.join(__dirname, 'game-icons-index.json');

// Carrega o catálogo do Game-Icons se disponível
let gameIconsCatalog = null;
try {
  if (fs.existsSync(GAME_ICONS_INDEX_PATH)) {
    gameIconsCatalog = JSON.parse(fs.readFileSync(GAME_ICONS_INDEX_PATH, 'utf-8')).catalog;
  }
} catch (e) {
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
const THREAT_MAP = {
  'lynel': 'systems/tormenta20/icons/ameacas/centauro-combatente.png',
  'oxxdon': 'modules/compendios-para-t20/assets/icons/ameacas/oxxdon.svg',
  'tyrant': 'modules/compendios-para-t20/assets/icons/ameacas/tyrant.svg',
  'espectro do pesadelo': 'systems/tormenta20/icons/ameacas/aparicao.png',
  'expurgo onirico': 'systems/tormenta20/icons/poderes/tormenta.webp',
  'enxame de armas': 'modules/compendios-para-t20/assets/icons/ameacas/enxame-de-armas.svg',
  'tropa de mortos': 'systems/tormenta20/icons/ameacas/falange.png',
  'inumano': 'systems/tormenta20/icons/ameacas/esqueleto-de-elite.png'
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

  // Ataques Naturais e Habilidades de Criaturas
  'mordida': 'systems/tormenta20/icons/poderes/ameacas/mordida.webp',
  'garras': 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
  'garra': 'systems/tormenta20/icons/poderes/ameacas/garras.webp',
  'pancada': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'pancadas': 'systems/tormenta20/icons/poderes/ameacas/pancada.webp',
  'cascos': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'coice oportuno': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'coice': 'systems/tormenta20/icons/poderes/ameacas/cascos.webp',
  'sopro de fogo': 'systems/tormenta20/icons/poderes/ameacas/cospe-chamas.webp',
  'cospe chamas': 'systems/tormenta20/icons/poderes/ameacas/cospe-chamas.webp',
  'sopro': 'systems/tormenta20/icons/poderes/ameacas/sopro.webp',
  'investida galopante': 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
  'investida': 'systems/tormenta20/icons/poderes/ameacas/investida.webp',
  'brado indomavel': 'systems/tormenta20/icons/poderes/ameacas/urro-selvagem.webp',
  'relincho aterrador': 'systems/tormenta20/icons/poderes/ameacas/urro-selvagem.webp',
  'antena': 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
  'ferrao': 'systems/tormenta20/icons/poderes/ameacas/ferrao.webp',
  'pincas': 'systems/tormenta20/icons/poderes/ameacas/pincas.webp',
  'imunidade a magia': 'systems/tormenta20/icons/poderes/ameacas/imunidade-magia.webp',
  'resistencia a magia': 'systems/tormenta20/icons/poderes/ameacas/resistencia-magia.webp',
  'sensibilidade a luz': 'systems/tormenta20/icons/poderes/ameacas/sensibilidade-luz.webp',
  'vulnerabilidade a luz do dia': 'systems/tormenta20/icons/poderes/ameacas/sensibilidade-luz.webp',
  'vulnerabilidade': 'systems/tormenta20/icons/poderes/ameacas/vulnerabilidade.webp',
  'aura aterradora': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'terror encarnado': 'systems/tormenta20/icons/poderes/ameacas/aura-aterradora.webp',
  'drenar energia': 'systems/tormenta20/icons/poderes/ameacas/ataque-trevas.webp',
  'ataque trevas': 'systems/tormenta20/icons/poderes/ameacas/ataque-trevas.webp',
  'taticas de alcateia': 'systems/tormenta20/icons/poderes/ameacas/taticas-alcateia.webp',
  'bando': 'systems/tormenta20/icons/poderes/ameacas/taticas-alcateia.webp',
  'devorar sonhos': 'systems/tormenta20/icons/poderes/ameacas/ataque-trevas.webp',
  'semi incorporeo': 'systems/tormenta20/icons/poderes/ameacas/forma.webp',
  'cura acelerada': 'systems/tormenta20/icons/poderes/classes/combatentes/cura-pelas-maos.webp',
  'super tyrant': 'modules/compendios-para-t20/assets/icons/poderes/super-tyrant.svg',
  'ferrugem': 'modules/compendios-para-t20/assets/icons/poderes/ferrugem.svg',

  // Poderes de Combate e Caverna do Saber
  'retomar folego': 'systems/tormenta20/icons/poderes/classes/combatentes/durao.webp',
  'ataque com escudo': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'defesa desarmada': 'systems/tormenta20/icons/poderes/classes/combatentes/briga.webp',
  'flechada com rolamento': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'golpe aereo': 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-cruel.webp',
  'flechada de manobra': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',
  'torrente de flechas': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',
  'golpe poderoso explosivo': 'systems/tormenta20/icons/poderes/classes/combatentes/golpe-violento.webp',
  'golpear e correr': 'systems/tormenta20/icons/poderes/classes/combatentes/duelo.webp',
  'flechada de impacto': 'systems/tormenta20/icons/itens/equipamentos/flechas.webp',
  'flechada precisa distante': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'especialista em camuflagens': 'systems/tormenta20/icons/poderes/classes/especialistas/rastreador.webp',
  'especialista em arcos e bestas': 'systems/tormenta20/icons/itens/equipamentos/arco-longo.webp',
  'carga de cavalaria': 'systems/tormenta20/icons/poderes/classes/combatentes/caminho-cavaleiro-montaria.webp',
  'economia de habilidade': 'systems/tormenta20/icons/poderes/classes/especialistas/fabricar-item-superior.webp',
  'escudo fundacao': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'atirar e correr': 'systems/tormenta20/icons/itens/equipamentos/arco-curto.webp',
  'esquiva': 'systems/tormenta20/icons/poderes/classes/combatentes/autoconfianca.webp',
  'escudo para lancamento': 'systems/tormenta20/icons/itens/equipamentos/escudo-leve.webp',
  'especialista em coberturas': 'systems/tormenta20/icons/poderes/classes/combatentes/baluarte.webp',
  'costas largas': 'systems/tormenta20/icons/poderes/classes/combatentes/casca-grossa.webp',
  'combatente sanguinario': 'systems/tormenta20/icons/poderes/classes/combatentes/furia-titanica.webp',
  'bloqueio com escudo perfeito': 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp',
  'ginete de guerra': 'systems/tormenta20/icons/poderes/classes/combatentes/caminho-cavaleiro-montaria.webp',
  'ataque poderoso': 'systems/tormenta20/icons/poderes/classes/combatentes/ataque-especial.webp',
  'aparar': 'systems/tormenta20/icons/poderes/classes/combatentes/duelo.webp',
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
  if (type === 'armadura' || type === 'escudo') {
    return 'systems/tormenta20/icons/itens/equipamentos/escudo-pesado.webp';
  }
  if (type === 'poder') {
    return 'systems/tormenta20/icons/poderes/combate.webp';
  }
  if (type === 'magia') {
    return 'systems/tormenta20/icons/magias/dardos-do-talarion.webp';
  }
  if (isActor) {
    return 'systems/tormenta20/icons/ameacas/colosso-supremo.png';
  }

  return currentImg || 'systems/tormenta20/icons/svg/skills.svg';
}

module.exports = {
  resolveIcon,
  downloadGameIcon,
  downloadFromUrl,
  downloadWowheadIconByName,
  searchAndDownloadWowhead,
  downloadFromGithubRaw,
  CANONICAL_MAP,
  THREAT_MAP,
  ITEM_AND_POWER_MAP,
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

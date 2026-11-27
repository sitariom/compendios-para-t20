const fs = require('fs');
const path = require('path');
const { ClassicLevel } = require('classic-level');

const TYPE_TO_NAMESPACE = {
  Actor: 'actors',
  Item: 'items',
  Macro: 'macros',
  RollTable: 'tables',
  JournalEntry: 'journal',
  Playlist: 'playlists'
};

const DEFAULT_PACKS = [
  { name: 'Ameacas_T20', label: 'Ameaças T20', path: 'packs/Ameacas_T20', type: 'Actor' },
  { name: 'Itens_T20', label: 'Itens T20', path: 'packs/Itens_T20', type: 'Item' },
  { name: 'Macros_T20', label: 'Macros T20', path: 'packs/Macros_T20', type: 'Macro' },
  { name: 'Tabelas_T20', label: 'Tabelas T20', path: 'packs/Tabelas_T20', type: 'RollTable' },
  { name: 'Diarios_T20', label: 'Diários T20', path: 'packs/Diarios_T20', type: 'JournalEntry' },
  { name: 'Playlist_T20', label: 'Playlist T20', path: 'packs/Playlist_T20', type: 'Playlist' }
];

const LEGACY_ROOT_PACKS = new Set(DEFAULT_PACKS.map(p => p.name));

/**
 * Descobre todos os compêndios declarados em module.json (legados + hierárquicos).
 */
function discoverPacksFromModuleJson(rootDir = path.resolve(__dirname, '..')) {
  const moduleJsonPath = path.join(rootDir, 'module.json');
  let rawPacks = DEFAULT_PACKS;

  if (fs.existsSync(moduleJsonPath)) {
    try {
      const mod = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
      if (Array.isArray(mod.packs) && mod.packs.length > 0) {
        rawPacks = mod.packs;
      }
    } catch {
      rawPacks = DEFAULT_PACKS;
    }
  }

  return rawPacks.map(p => ({
    name: p.name,
    label: p.label || p.name,
    relPath: p.path || `packs/${p.name}`,
    absPath: path.resolve(rootDir, p.path || path.join('packs', p.name)),
    type: p.type,
    namespace: TYPE_TO_NAMESPACE[p.type] || 'documents',
    isLegacyRoot: LEGACY_ROOT_PACKS.has(p.name)
  }));
}

/**
 * Visão unificada somente-leitura compatível com ClassicLevel (open/get/iterator/close)
 * agregando todos os packs declarados em module.json para um determinado documentType.
 */
function openMergedPackView(docType, rootDir = path.resolve(__dirname, '..'), options = {}) {
  const valueEncoding = options.valueEncoding || 'json';
  const packs = discoverPacksFromModuleJson(rootDir).filter(p => p.type === docType && fs.existsSync(p.absPath));
  const dbs = packs.map(p => ({ meta: p, db: new ClassicLevel(p.absPath, { valueEncoding }) }));
  const hierarchicalIds = new Set();
  let opened = false;

  async function ensureOpen() {
    if (opened) return;
    for (const entry of dbs) {
      await entry.db.open();
    }
    opened = true;
  }

  return {
    packs,
    isHierarchicalDoc(id) {
      return hierarchicalIds.has(id);
    },
    async open() {
      await ensureOpen();
    },
    async get(key) {
      await ensureOpen();
      let lastErr = null;
      for (const entry of dbs) {
        try {
          const val = await entry.db.get(key);
          if (val !== undefined) {
            if (!entry.meta.isLegacyRoot) {
              const id = key.includes('.') ? (key.split('!')[2] || '').split('.')[0] : key.split('!').pop();
              if (id) hierarchicalIds.add(id);
            }
            return val;
          }
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr || Object.assign(new Error(`NotFound: ${key}`), { code: 'LEVEL_NOT_FOUND' });
    },
    async *iterator(iterOpts) {
      await ensureOpen();
      for (const entry of dbs) {
        for await (const [k, v] of entry.db.iterator(iterOpts)) {
          if (!entry.meta.isLegacyRoot && !k.startsWith('!folders!')) {
            const id = k.includes('.') ? (k.split('!')[2] || '').split('.')[0] : (v?._id || k.split('!').pop());
            if (id) hierarchicalIds.add(id);
          }
          yield [k, v];
        }
      }
    },
    async close() {
      if (!opened) return;
      for (const entry of dbs) {
        await entry.db.close().catch(() => {});
      }
      opened = false;
    }
  };
}

module.exports = {
  TYPE_TO_NAMESPACE,
  DEFAULT_PACKS,
  LEGACY_ROOT_PACKS,
  discoverPacksFromModuleJson,
  openMergedPackView
};

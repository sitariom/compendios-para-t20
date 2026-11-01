#!/usr/bin/env node
/**
 * Script de Aplicação Retroativa de Ícones Canônicos (DB #226 e DB #227)
 * Atualiza todos os atores, itens embutidos, tokens e itens de compêndio
 * para utilizarem os ícones do acervo Tormenta20 ou baixados do Game-Icons.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { resolveIcon, resolveToken } = require('./icon-resolver');

const PACK_ACTORS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');
const PACK_ITEMS = path.join(__dirname, '..', 'packs', 'Itens_T20');

const TARGET_ACTOR_NAMES = [
  // DB #226
  'Tyrant',
  'Espectro do Pesadelo',
  'Expurgo Onírico',
  // DB #227
  'Lynel',
  'Oxxdon',
  'Enxame de Armas',
  'Tropa de Mortos',
  'Inumano'
];

async function updateActors() {
  console.log('--- Atualizando Ameaças e Itens Embutidos em Ameacas_T20 ---');
  const db = new ClassicLevel(PACK_ACTORS, { valueEncoding: 'json' });

  const targetActors = {};
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!actors!') && !key.startsWith('!actors.items!') && !key.startsWith('!actors.effects!')) {
      if (value && value.name && TARGET_ACTOR_NAMES.includes(value.name)) {
        targetActors[value._id] = { ...value, dbKey: key };
      }
    }
  }

  console.log(`Encontrados ${Object.keys(targetActors).length} atores alvos:`, Object.values(targetActors).map(a => a.name));

  let actorUpdates = 0;
  let embeddedItemUpdates = 0;
  let embeddedEffectUpdates = 0;

  // 1. Atualiza os documentos principais dos atores
  for (const actor of Object.values(targetActors)) {
    const oldImg = actor.img;
    const newImg = resolveIcon({ name: actor.name, type: 'npc', currentImg: oldImg });
    const tokenSrc = resolveToken({ name: actor.name });

    actor.img = newImg;
    if (!actor.prototypeToken) actor.prototypeToken = {};
    if (!actor.prototypeToken.texture) actor.prototypeToken.texture = {};
    actor.prototypeToken.texture.src = tokenSrc;
    if (actor._stats) actor._stats.modifiedTime = Date.now();

    const dbKey = actor.dbKey || `!actors!${actor._id}`;
    delete actor.dbKey;
    await db.put(dbKey, actor);
    actorUpdates++;
    console.log(`[Ator] ${actor.name}: img=${newImg} | token(2MTT)=${tokenSrc}`);
  }

  // 2. Atualiza os itens embutidos desses atores
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!actors.items!') && !key.includes('.effects!')) {
      const parts = key.split('!');
      const [actorId] = parts[2].split('.');
      const actor = targetActors[actorId];

      if (actor && value && value.name) {
        const oldImg = value.img;
        const newImg = resolveIcon({ name: value.name, type: value.type || 'poder', currentImg: oldImg });

        if (oldImg !== newImg) {
          value.img = newImg;
          if (value._stats) value._stats.modifiedTime = Date.now();

          // Atualiza efeitos internos do item
          if (Array.isArray(value.effects)) {
            for (const eff of value.effects) {
              eff.img = newImg;
            }
          }

          await db.put(key, value);
          embeddedItemUpdates++;
          console.log(`  [Item Embutido] ${actor.name} -> ${value.name}: ${oldImg} -> ${newImg}`);
        }
      }
    } else if (key.includes('.effects!')) {
      // Efeitos de subdocumentos
      const parts = key.split('!');
      const [actorId] = parts[2].split('.');
      const actor = targetActors[actorId];

      if (actor && value) {
        const parentKey = `!actors.items!${parts[2].split('.').slice(0, 2).join('.')}`;
        try {
          const parentItem = await db.get(parentKey);
          if (parentItem && value.img !== parentItem.img) {
            value.img = parentItem.img;
            await db.put(key, value);
            embeddedEffectUpdates++;
          }
        } catch {
          // Ignora se não achou pai
        }
      }
    }
  }

  await db.close();
  console.log(`Ameaças concluídas: ${actorUpdates} atores, ${embeddedItemUpdates} itens embutidos, ${embeddedEffectUpdates} efeitos atualizados.\n`);
}

async function updateItems() {
  console.log('--- Atualizando Itens e Poderes de Combate em Itens_T20 ---');
  const db = new ClassicLevel(PACK_ITEMS, { valueEncoding: 'json' });

  let itemUpdates = 0;
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith('!items!') && !key.includes('.effects!')) {
      if (value && value.name) {
        const source = value.system?.source || '';
        if (source.includes('227') || source.includes('226') || source.includes('Caverna do Saber')) {
          const oldImg = value.img;
          const newImg = resolveIcon({ name: value.name, type: value.type || 'poder', currentImg: oldImg });

          if (oldImg !== newImg) {
            value.img = newImg;
            if (value._stats) value._stats.modifiedTime = Date.now();

            if (Array.isArray(value.effects)) {
              for (const eff of value.effects) {
                eff.img = newImg;
              }
            }

            await db.put(key, value);
            itemUpdates++;
            console.log(`[Poder/Item T20] ${value.name}: ${oldImg} -> ${newImg}`);
          }
        }
      }
    }
  }

  await db.close();
  console.log(`Itens_T20 concluídos: ${itemUpdates} itens atualizados.\n`);
}

async function main() {
  console.log('=== Iniciando Atualização Canônica de Ícones (DB #226 e DB #227) ===\n');
  await updateActors();
  await updateItems();
  console.log('=== Atualização Canônica Concluída com Sucesso ===');
}

main().catch(err => {
  console.error('Erro na atualização:', err);
  process.exit(1);
});

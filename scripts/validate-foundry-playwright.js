#!/usr/bin/env node
/**
 * Validador Visual e Funcional em Mundo Real do Foundry VTT via Playwright
 *
 * Carrega automaticamente `.env` (FOUNDRY_URL, FOUNDRY_ADMIN_PASSWORD, FOUNDRY_WORLD,
 * FOUNDRY_USER, FOUNDRY_PASSWORD), autentica em `/auth` se necessário, inicia o mundo de
 * teste em `/setup`, entra em `/join` como usuário configurável (ex.: Gamemaster sem senha),
 * inspeciona packs/DataModels ao vivo, abre amostras representativas e salva evidências em
 * `catalogo/materiais/<ID>/playwright-evidencias/` (ou `catalogo/playwright-smoke.json` no modo `--smoke`).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');
const CATALOGO_DIR = path.join(ROOT_DIR, 'catalogo');
const CATALOGO_PATH = path.join(CATALOGO_DIR, 'catalogo.json');
const ARTEFATOS_PATH = path.join(CATALOGO_DIR, 'artefatos.json');
const MODULE_JSON_PATH = path.join(ROOT_DIR, 'module.json');

function loadEnvFile(filePath = ENV_PATH) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function resolvePlaywright() {
  for (const pkg of ['playwright', 'playwright-core']) {
    try {
      return require(pkg);
    } catch {
      const globalAppData = process.env.APPDATA ? path.join(process.env.APPDATA, 'npm', 'node_modules', pkg) : null;
      if (globalAppData && fs.existsSync(globalAppData)) {
        return require(globalAppData);
      }
    }
  }
  return null;
}

function findCachedChromiumExecutable() {
  const candidates = [];
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    candidates.push(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH);
  }
  const localCacheDirs = [
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'ms-playwright') : null,
    process.env.HOME ? path.join(process.env.HOME, '.cache', 'ms-playwright') : null,
    process.env.HOME ? path.join(process.env.HOME, 'Library', 'Caches', 'ms-playwright') : null
  ].filter(Boolean);

  for (const cacheDir of localCacheDirs) {
    if (!fs.existsSync(cacheDir)) continue;
    const dirs = fs.readdirSync(cacheDir)
      .filter(name => /^chromium-\d+$/.test(name))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const dir of dirs) {
      candidates.push(
        path.join(cacheDir, dir, 'chrome-win64', 'chrome.exe'),
        path.join(cacheDir, dir, 'chrome-win', 'chrome.exe'),
        path.join(cacheDir, dir, 'chrome-linux', 'chrome')
      );
    }
  }
  return candidates.find(p => p && fs.existsSync(p)) || null;
}

async function launchChromium(pw, headless = true) {
  try {
    return await pw.chromium.launch({ headless });
  } catch (err) {
    const exePath = findCachedChromiumExecutable();
    if (!exePath) throw err;
    return await pw.chromium.launch({ headless, executablePath: exePath });
  }
}

function buildSamplePlan(materialId, artefatos) {
  const mats = artefatos.filter(a => a.material_id === materialId);
  const samples = [];
  const seenSubtypes = new Set();

  for (const a of mats) {
    if (a.tipo === 'Actor') {
      samples.push(a);
      seenSubtypes.add(`Actor:${a.subtipo}`);
    }
  }
  for (const a of mats) {
    const key = `${a.tipo}:${a.subtipo}`;
    if (!seenSubtypes.has(key)) {
      seenSubtypes.add(key);
      samples.push(a);
    }
  }
  return samples;
}

async function dismissFoundryTour(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.tour [data-action="exit"], aside.tour button').forEach(btn => btn.click());
  }).catch(() => {});
}

async function updateModulesInFoundrySetup(page, { updateAll = false, moduleId = 'compendios-para-t20' } = {}) {
  await dismissFoundryTour(page);
  const setupInfo = await page.evaluate(async ({ modId, runAll }) => {
    const modsTab = document.querySelector('[data-action="tab"][data-tab="modules"]');
    if (modsTab) modsTab.click();
    await new Promise(r => setTimeout(r, 250));

    window.__pwSetupNotes = [];
    if (window.ui?.notifications?.notify && !window.__pwSetupHooked) {
      window.__pwSetupHooked = true;
      const orig = window.ui.notifications.notify.bind(window.ui.notifications);
      window.ui.notifications.notify = (msg, type, opts) => {
        window.__pwSetupNotes.push({ msg: String(msg), type: String(type || 'info') });
        return orig(msg, type, opts);
      };
    }

    const versionBefore = document.querySelector(`[data-package-id="${modId}"] .badge, [data-package-id="${modId}"] .version`)?.innerText?.trim() || null;
    const trigger = runAll
      ? document.querySelector('button[data-action="updateAll"]')
      : document.querySelector(`[data-package-id="${modId}"] [data-action="updatePackage"]`);

    if (!trigger) {
      return { triggered: false, versionBefore, reason: runAll ? 'updateAll button not found' : `${modId} updatePackage not found` };
    }
    trigger.click();
    return { triggered: true, mode: runAll ? 'updateAll' : 'updatePackage', moduleId: modId, versionBefore };
  }, { modId: moduleId, runAll: updateAll });

  if (!setupInfo.triggered) {
    return { ...setupInfo, versionAfter: setupInfo.versionBefore, notifications: [] };
  }

  // Aguarda checkPackage/installPackage ou diálogo de confirmação do Foundry v13
  const deadline = Date.now() + 90000;
  let confirmedDialog = false;
  while (Date.now() < deadline) {
    await page.waitForTimeout(800);
    const probe = await page.evaluate(({ modId, alreadyConfirmed }) => {
      const notes = window.__pwSetupNotes || [];
      const notifText = document.querySelector('#notifications')?.innerText || '';
      const dialogBtn = document.querySelector('dialog button[data-action="yes"], dialog button[data-action="confirm"], dialog button[type="submit"], .dialog .dialog-button.yes');
      if (dialogBtn && !alreadyConfirmed) {
        dialogBtn.click();
        return { done: false, clickedDialog: true, notes, notifText };
      }
      const hasAlreadyUpdated = notes.some(n => n.msg.includes('AlreadyUpdated')) || /already up to date|já está atualizado/i.test(notifText);
      const hasInstallFinish = notes.some(n => /InstallSuccess|InstallComplete|Updated|PackageInstalled/i.test(n.msg)) || /updated successfully|atualizado com sucesso|was updated|installed successfully/i.test(notifText);
      const hasError = notes.some(n => n.type === 'error');
      const versionNow = document.querySelector(`[data-package-id="${modId}"] .badge, [data-package-id="${modId}"] .version`)?.innerText?.trim() || null;
      return { done: hasAlreadyUpdated || hasInstallFinish || hasError, clickedDialog: false, notes, notifText, versionNow };
    }, { modId: moduleId, alreadyConfirmed: confirmedDialog }).catch(() => null);

    if (!probe) {
      // Página pode ter recarregado após atualização do pacote
      await page.waitForSelector('[data-package-id]', { timeout: 15000 }).catch(() => {});
      break;
    }
    if (probe.clickedDialog) confirmedDialog = true;
    if (probe.done) {
      return {
        ...setupInfo,
        confirmedDialog,
        versionAfter: probe.versionNow || setupInfo.versionBefore,
        notifications: probe.notes,
        notifText: probe.notifText
      };
    }
  }

  const finalState = await page.evaluate((modId) => ({
    versionAfter: document.querySelector(`[data-package-id="${modId}"] .badge, [data-package-id="${modId}"] .version`)?.innerText?.trim() || null,
    notifications: window.__pwSetupNotes || [],
    notifText: document.querySelector('#notifications')?.innerText || ''
  }), moduleId).catch(() => ({ versionAfter: null, notifications: [], notifText: '' }));

  return { ...setupInfo, confirmedDialog, ...finalState };
}

async function waitForFoundryRoute(page, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const state = await page.evaluate(() => {
      const pathName = location.pathname || '';
      const hasUserSelect = Boolean(document.querySelector('select[name="userid"]'));
      const isJoin = pathName.includes('/join') && hasUserSelect;
      const hasAdminInput = Boolean(document.querySelector('input[name="adminPassword"]'));
      const hasSetupCards = Boolean(document.querySelector('[data-package-id]'));
      return {
        url: location.href,
        ready: Boolean(window.game && window.game.ready),
        hasAuth: !isJoin && !hasSetupCards && (pathName.includes('/auth') || hasAdminInput),
        hasSetup: !isJoin && pathName.includes('/setup') && hasSetupCards,
        hasJoin: isJoin
      };
    }).catch(() => null);
    if (state && (state.ready || state.hasAuth || state.hasSetup || state.hasJoin)) {
      return state;
    }
    await page.waitForTimeout(250);
  }
  return { url: page.url(), ready: false, hasAuth: false, hasSetup: false, hasJoin: false };
}

async function ensureFoundryGameReady(page, { url, adminPassword, world, user, password, updateModule = false, updateAll = false }) {
  console.log(`[playwright] Navegando para ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  let updateResult = null;
  let updateDone = !updateModule && !updateAll;

  for (let step = 0; step < 8; step++) {
    const state = await waitForFoundryRoute(page, 20000);
    if (state.ready) {
      if (!updateDone && typeof (await page.evaluate(() => typeof window.game?.shutDown)) === 'string') {
        console.log('[playwright] Retornando ao /setup para atualizar módulo...');
        await maybeReturnToSetup(page, true);
        continue;
      }
      console.log('[playwright] Foundry game.ready!');
      return updateResult;
    }

    if (state.hasAuth) {
      console.log('[playwright] Autenticando administrador em /auth...');
      if (!adminPassword) {
        throw new Error('Foundry solicitou senha de administrador em /auth, mas FOUNDRY_ADMIN_PASSWORD não está definida.');
      }
      const adminInput = page.locator('input[name="adminPassword"]').first();
      await adminInput.fill(adminPassword);
      const authSubmit = page.locator('form:has(input[name="adminPassword"]) button[type="submit"], button[name="submit"]').first();
      await Promise.all([
        page.waitForURL(u => !u.toString().includes('/auth'), { timeout: 15000 }).catch(() => {}),
        authSubmit.click()
      ]);
      await page.waitForTimeout(600);
      continue;
    }

    if (state.hasSetup) {
      if (!world) {
        throw new Error('Foundry está em /setup, mas FOUNDRY_WORLD não está definido.');
      }
      if (!updateDone) {
        console.log('[playwright] Verificando/atualizando compendios-para-t20 em /setup...');
        updateResult = await updateModulesInFoundrySetup(page, { updateAll });
        console.log(`[playwright] Update módulo: ${updateResult.versionBefore || '?'} -> ${updateResult.versionAfter || '?'} (${updateResult.notifText || updateResult.notifications?.[0]?.msg || 'ok'})`);
        updateDone = true;
      }
      console.log(`[playwright] Iniciando mundo "${world}"...`);
      await dismissFoundryTour(page);
      const launchOk = await page.evaluate((targetWorld) => {
        const worldsTab = document.querySelector('[data-action="tab"][data-tab="worlds"]');
        if (worldsTab) worldsTab.click();
        const btn = document.querySelector(`[data-package-id="${targetWorld}"] [data-action="worldLaunch"]`);
        if (!btn) return false;
        btn.click();
        return true;
      }, world);
      if (!launchOk) {
        throw new Error(`Mundo "${world}" não encontrado ou sem botão de inicialização em /setup.`);
      }
      await page.waitForURL(u => u.toString().includes('/join') || u.toString().includes('/game'), { timeout: 20000 }).catch(() => {});
      continue;
    }

    if (state.hasJoin) {
      if (!updateDone) {
        console.log('[playwright] Mundo já aberto no /join; retornando ao /setup para atualizar módulo...');
        const setupAdminInput = page.locator('form:has(button:has-text("Return to Setup")) input[name="adminPassword"], input[name="adminPassword"]').first();
        if (await setupAdminInput.count() && await setupAdminInput.isVisible().catch(() => false)) {
          if (!adminPassword) {
            throw new Error('Foundry pediu senha de administrador em Return to Setup, mas FOUNDRY_ADMIN_PASSWORD não está definida.');
          }
          await setupAdminInput.fill(adminPassword);
        }
        const setupBtn = page.locator('button:has-text("Return to Setup"), button[data-action="setup"], button[name="setup"]').first();
        if (await setupBtn.count()) {
          await Promise.all([
            page.waitForURL(u => u.toString().includes('/setup') || u.toString().includes('/auth'), { timeout: 15000 }).catch(() => {}),
            setupBtn.click()
          ]);
        } else {
          const baseOrigin = new URL(url).origin;
          await page.goto(`${baseOrigin}/setup`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        }
        await page.waitForTimeout(800);
        continue;
      }
      const targetUser = user || 'Gamemaster';
      console.log(`[playwright] Entrando em /join como "${targetUser}"...`);
      const userSelect = page.locator('select[name="userid"]');
      const optionValue = await page.evaluate((wantedUser) => {
        const sel = document.querySelector('select[name="userid"]');
        if (!sel) return null;
        const lowerWanted = wantedUser.trim().toLowerCase();
        const opt = [...sel.options].find(o => o.textContent.trim() === wantedUser || o.value === wantedUser)
          || [...sel.options].find(o => o.textContent.trim().toLowerCase() === lowerWanted);
        return opt ? opt.value : null;
      }, targetUser);

      if (!optionValue) {
        throw new Error(`Usuário "${targetUser}" não encontrado na tela /join.`);
      }
      await userSelect.selectOption(optionValue);

      if (password) {
        const pwInput = page.locator('input[name="password"]');
        if (await pwInput.count()) await pwInput.fill(password);
      }

      const joinBtn = page.locator('button[name="join"], button:has-text("Join Game Session"), button[type="submit"]').first();
      await joinBtn.click();
      console.log('[playwright] Aguardando game.ready no cliente Foundry (até 90s)...');
      await page.waitForFunction(() => Boolean(window.game && window.game.ready), { timeout: 90000 });
      console.log('[playwright] Foundry game.ready!');
      return updateResult;
    }

    await page.waitForTimeout(500);
  }

  await page.waitForFunction(() => Boolean(window.game && window.game.ready), { timeout: 90000 });
  return updateResult;
}

async function inspectFoundryRuntime(page) {
  return await page.evaluate(async () => {
    const mod = game.modules.get('compendios-para-t20');
    const packs = Array.from(game.packs.values())
      .filter(p => p.metadata.packageName === 'compendios-para-t20')
      .map(p => ({
        collection: p.collection,
        name: p.metadata.name,
        label: p.metadata.label,
        type: p.metadata.type,
        locked: Boolean(p.locked),
        indexSize: p.index?.size ?? 0
      }));
    const packFolders = Array.from(game.folders.values())
      .filter(f => f.type === 'Compendium')
      .map(f => ({ id: f.id, name: f.name, folder: f.folder?.id || null }));

    return {
      foundryVersion: game.version,
      world: { id: game.world.id, title: game.world.title },
      system: { id: game.system.id, title: game.system.title, version: game.system.version },
      module: mod ? { id: mod.id, title: mod.title, version: mod.version, active: mod.active } : null,
      packsCount: packs.length,
      packs,
      packFoldersCount: packFolders.length
    };
  });
}

async function installUiErrorInterceptor(page) {
  await page.evaluate(() => {
    window.__pwUiErrors = [];
    if (window.ui?.notifications?.error && !window.__pwUiHooked) {
      window.__pwUiHooked = true;
      const orig = window.ui.notifications.error.bind(window.ui.notifications);
      window.ui.notifications.error = (msg, ...rest) => {
        window.__pwUiErrors.push(String(msg));
        return orig(msg, ...rest);
      };
    }
  });
}

async function maybeReturnToSetup(page, shouldReturn) {
  if (!shouldReturn) return;
  await page.evaluate(() => {
    if (typeof window.game?.shutDown === 'function') {
      window.game.shutDown();
    }
  }).catch(() => {});
  await page.waitForTimeout(800).catch(() => {});
}

async function runSmokeValidation(page, contextInfo) {
  const { url, returnToSetup, updateResult, consoleErrors, pageErrors, networkErrors, pregameErrors } = contextInfo;
  const runtime = await inspectFoundryRuntime(page);
  const localMod = fs.existsSync(MODULE_JSON_PATH)
    ? JSON.parse(fs.readFileSync(MODULE_JSON_PATH, 'utf8'))
    : null;

  const samplePack = runtime.packs.find(p => p.type === 'Actor' && p.indexSize > 0) || runtime.packs[0] || null;
  let sampleDocCheck = null;
  if (samplePack) {
    sampleDocCheck = await page.evaluate(async (collection) => {
      const pack = game.packs.get(collection);
      if (!pack) return { ok: false, error: `Pack ausente: ${collection}` };
      await pack.getIndex();
      const first = pack.index.find(e => e.type === 'npc') || pack.index.contents?.[0] || [...pack.index][0];
      if (!first) return { ok: false, error: `Pack vazio: ${collection}` };
      const doc = await pack.getDocument(first._id);
      let sheet = null;
      if (doc.sheet) {
        sheet = await doc.sheet.render(true);
        await new Promise(r => setTimeout(r, 500));
      }
      const brokenImgs = [...document.querySelectorAll('.application img, .window-app img, dialog img')]
        .filter(img => Boolean((img.getAttribute('src') || '').trim()) && img.complete && img.naturalWidth === 0)
        .map(img => img.getAttribute('src'));
      return {
        ok: brokenImgs.length === 0,
        collection,
        id: doc.id,
        name: doc.name,
        type: doc.type,
        rendered: Boolean(sheet),
        brokenImgs
      };
    }, samplePack.collection);
  }

  fs.mkdirSync(CATALOGO_DIR, { recursive: true });
  const shotPath = path.join(CATALOGO_DIR, 'playwright-smoke.png');
  await page.screenshot({ path: shotPath });

  if (sampleDocCheck?.rendered) {
    await page.evaluate(async ({ collection, id }) => {
      const pack = game.packs.get(collection);
      const doc = await pack?.getDocument(id);
      await doc?.sheet?.close().catch(() => {});
    }, { collection: sampleDocCheck.collection, id: sampleDocCheck.id }).catch(() => {});
  }

  const uiErrors = await page.evaluate(() => window.__pwUiErrors || []);
  await maybeReturnToSetup(page, returnToSetup);

  const localPacksCount = Array.isArray(localMod?.packs) ? localMod.packs.length : null;
  const packSyncMatch = localPacksCount === null || runtime.packsCount === localPacksCount;

  const report = {
    modo: 'SMOKE',
    executado_em: new Date().toISOString(),
    url,
    module_update: updateResult || null,
    runtime,
    local_manifest: localMod ? { version: localMod.version, packsCount: localPacksCount } : null,
    pack_sync_match: packSyncMatch,
    sample_doc_check: sampleDocCheck,
    pregame_errors: pregameErrors,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    network_errors: networkErrors,
    ui_errors: uiErrors,
    screenshot: shotPath,
    status: (consoleErrors.length === 0 && pageErrors.length === 0 && networkErrors.length === 0 && uiErrors.length === 0 && (!sampleDocCheck || sampleDocCheck.ok))
      ? 'APROVADO'
      : 'REPROVADO'
  };

  const reportPath = path.join(CATALOGO_DIR, 'playwright-smoke.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`${report.status === 'APROVADO' ? '✅' : '❌'} Smoke Playwright: ${report.status} | Foundry ${runtime.foundryVersion} | ${runtime.system.id} ${runtime.system.version} | Módulo ${runtime.module?.version || 'ausente'} (${runtime.packsCount} packs ativos vs ${localPacksCount ?? '?'} locais).`);
  console.log(`📄 Relatório salvo em ${reportPath}`);
  return report.status === 'APROVADO';
}

async function validateMaterialInPage(page, { materialId, catalogo, artefatos, world, url, updateResult, runtime, pregameErrors, consoleErrors, pageErrors, networkErrors }) {
  const mat = catalogo.materiais?.[materialId];
  if (!mat) {
    throw new Error(`Material "${materialId}" não encontrado em catalogo/catalogo.json.`);
  }

  const samples = buildSamplePlan(materialId, artefatos);
  const evidenciasDir = path.join(CATALOGO_DIR, 'materiais', materialId, 'playwright-evidencias');
  fs.mkdirSync(evidenciasDir, { recursive: true });
  const reportPath = path.join(evidenciasDir, 'report.json');

  const activePackSet = new Set(runtime.packs.map(p => p.collection));
  const expectedPacks = [...new Set(samples.map(s => {
    const parts = String(s.uuid || '').split('.');
    return parts.length >= 3 && parts[0] === 'Compendium' ? `${parts[1]}.${parts[2]}` : null;
  }).filter(Boolean))];
  const missingPacks = expectedPacks.filter(c => !activePackSet.has(c));

  if (missingPacks.length > 0) {
    const blockedReport = {
      material_id: materialId,
      world,
      url,
      status: 'BLOQUEADO_VERSAO_SERVIDOR',
      motivo: `O servidor Foundry está com ${runtime.packsCount} packs ativos (módulo ${runtime.module?.version || 'ausente'}), faltando ${missingPacks.length} packs esperados pela versão local.`,
      packs_ausentes: missingPacks,
      runtime,
      executado_em: new Date().toISOString()
    };
    fs.writeFileSync(reportPath, JSON.stringify(blockedReport, null, 2), 'utf8');
    console.error(`⚠️ Validação Playwright (${materialId}) bloqueada por versão no servidor: ${blockedReport.motivo}`);
    return false;
  }

  const errStart = {
    console: consoleErrors.length,
    page: pageErrors.length,
    network: networkErrors.length
  };
  await page.evaluate(() => { window.__pwUiErrors = []; });

  console.log(`[playwright] Validando ${materialId} (${samples.length} amostras)...`);
  const checks = [];
  for (const s of samples) {
    const docId = s._id || String(s.uuid || '').split('.').pop() || s.id;
    const safeName = `${s.tipo}_${docId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const shotPath = path.join(evidenciasDir, `${safeName}.png`);
    console.log(`  • ${materialId} -> ${s.tipo} (${s.subtipo}): ${s.nome}`);

    const prep = await page.evaluate(async ({ uuid, tipo }) => {
      const withTimeout = (p, ms = 6000) => Promise.race([
        p,
        new Promise((_, rej) => setTimeout(() => rej(new Error(`Timeout after ${ms}ms`)), ms))
      ]);
      const doc = await withTimeout(fromUuid(uuid), 10000);
      if (!doc) return { ok: false, error: `UUID não encontrado: ${uuid}` };
      let sheet = null;
      if (doc.sheet) {
        sheet = await withTimeout(doc.sheet.render(true), 8000);
      }
      await new Promise(r => setTimeout(r, 450));

      const brokenImgs = [...document.querySelectorAll('.application img, .window-app img, dialog img')]
        .filter(img => Boolean((img.getAttribute('src') || '').trim()) && img.complete && img.naturalWidth === 0)
        .map(img => img.getAttribute('src'));

      let rollOk = true;
      let effectToggleOk = true;
      const packObj = doc.pack ? game.packs.get(doc.pack) : null;
      const isLocked = Boolean(packObj?.locked);

      if (tipo === 'Actor' && doc.type !== 'hazard' && doc.system?.pericias?.inic && typeof doc.rollPericia === 'function') {
        try {
          await withTimeout(
            doc.rollPericia('inic', { chatMessage: false, skipDialog: true, event: { shiftKey: true } }),
            4000
          );
        } catch {
          rollOk = false;
        }
        // Fecha eventual diálogo de rolagem caso o sistema tenha aberto
        document.querySelectorAll('.application.dialog button[data-action="close"], dialog button[data-action="close"], .dialog .close').forEach(b => b.click());
      } else if (tipo === 'RollTable' && typeof doc.draw === 'function') {
        try { await withTimeout(doc.draw({ displayChat: false }), 4000); } catch { rollOk = false; }
      } else if (tipo === 'Item' && doc.effects?.size > 0 && !isLocked) {
        try {
          const eff = doc.effects.contents[0];
          await eff.update({ disabled: !eff.disabled });
          await eff.update({ disabled: !eff.disabled });
        } catch { effectToggleOk = false; }
      }

      return {
        ok: brokenImgs.length === 0 && rollOk && effectToggleOk,
        brokenImgs,
        rollOk,
        effectToggleOk: isLocked && doc.effects?.size > 0 ? 'locked-pack-skipped' : effectToggleOk,
        rendered: Boolean(sheet)
      };
    }, { uuid: s.uuid, tipo: s.tipo });

    await page.screenshot({ path: shotPath });

    if (prep.rendered) {
      await page.evaluate(async (uuid) => {
        const doc = await fromUuid(uuid);
        await doc?.sheet?.close().catch(() => {});
      }, s.uuid).catch(() => {});
    }

    checks.push({ id: s.id, nome: s.nome, tipo: s.tipo, subtipo: s.subtipo, screenshot: shotPath, ...prep });
  }

  const uiErrors = await page.evaluate(() => window.__pwUiErrors || []);
  const matConsoleErrors = consoleErrors.slice(errStart.console);
  const matPageErrors = pageErrors.slice(errStart.page);
  const matNetworkErrors = networkErrors.slice(errStart.network);

  const allOk = matConsoleErrors.length === 0 && matPageErrors.length === 0 && matNetworkErrors.length === 0 && uiErrors.length === 0 && checks.every(c => c.ok);
  const report = {
    material_id: materialId,
    world: world || null,
    url,
    module_update: updateResult || null,
    runtime_summary: {
      foundryVersion: runtime.foundryVersion,
      systemVersion: runtime.system?.version,
      moduleVersion: runtime.module?.version,
      packsCount: runtime.packsCount,
      packFoldersCount: runtime.packFoldersCount
    },
    status: allOk ? 'APROVADO' : 'REPROVADO',
    executado_em: new Date().toISOString(),
    pregame_errors: pregameErrors,
    console_errors: matConsoleErrors,
    page_errors: matPageErrors,
    network_errors: matNetworkErrors,
    ui_errors: uiErrors,
    checks
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  mat.playwright_status = report.status;
  if (allOk && mat.status === 'VALIDADO') mat.status = 'PUBLICADO';
  fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf8');

  console.log(`${allOk ? '✅' : '❌'} Validação Playwright (${materialId}): ${report.status} (${checks.length} amostras).`);
  return allOk;
}

async function runPlaywrightValidation(options = {}) {
  loadEnvFile();

  const materialId = options.material;
  const isSmoke = Boolean(options.smoke);
  const isAll = Boolean(options.all);

  if (!isSmoke && !isAll && !materialId) {
    throw new Error('Uso: node scripts/validate-foundry-playwright.js (--smoke | --all | --material <ID>) [--plan-only] [--headed]');
  }

  const url = options.url || process.env.FOUNDRY_URL || '';
  const adminPassword = options.adminPassword || process.env.FOUNDRY_ADMIN_PASSWORD || '';
  const world = options.world || process.env.FOUNDRY_WORLD || 'teste-compendios-para-t20';
  const user = options.user || process.env.FOUNDRY_USER || 'Gamemaster';
  const password = options.password !== undefined ? options.password : (process.env.FOUNDRY_PASSWORD || '');
  const updateModule = options.updateModule !== undefined
    ? options.updateModule
    : String(process.env.FOUNDRY_AUTO_UPDATE ?? 'true').toLowerCase() !== 'false';
  const updateAll = options.updateAll !== undefined
    ? options.updateAll
    : String(process.env.FOUNDRY_UPDATE_ALL ?? 'false').toLowerCase() === 'true';
  const returnToSetup = options.returnToSetup !== undefined
    ? options.returnToSetup
    : String(process.env.FOUNDRY_RETURN_TO_SETUP ?? 'true').toLowerCase() !== 'false';

  let catalogo = null;
  let artefatos = [];
  let targetIds = [];

  if (!isSmoke) {
    if (!fs.existsSync(CATALOGO_PATH) || !fs.existsSync(ARTEFATOS_PATH)) {
      throw new Error('catalogo/catalogo.json ou catalogo/artefatos.json ausente. Execute `npm run catalogo:init` primeiro.');
    }
    catalogo = JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf8'));
    const artefatosData = JSON.parse(fs.readFileSync(ARTEFATOS_PATH, 'utf8'));
    artefatos = artefatosData.artefatos || [];

    if (isAll) {
      targetIds = Object.keys(catalogo.materiais || {}).filter(id =>
        ['VALIDADO', 'PROCESSADO_VALIDACAO_PENDENTE', 'PUBLICADO'].includes(catalogo.materiais[id]?.status)
      );
      if (targetIds.length === 0) {
        throw new Error('Nenhum material processado encontrado para validação em lote (--all).');
      }
    } else {
      if (!catalogo.materiais?.[materialId]) {
        throw new Error(`Material "${materialId}" não encontrado em catalogo/catalogo.json.`);
      }
      targetIds = [materialId];
    }

    if (options.planOnly) {
      for (const id of targetIds) {
        const samples = buildSamplePlan(id, artefatos);
        const evidenciasDir = path.join(CATALOGO_DIR, 'materiais', id, 'playwright-evidencias');
        fs.mkdirSync(evidenciasDir, { recursive: true });
        const reportPath = path.join(evidenciasDir, 'report.json');
        const plan = {
          material_id: id,
          modo: 'PLAN_ONLY',
          gerado_em: new Date().toISOString(),
          total_amostras: samples.length,
          amostras: samples.map(s => ({ id: s.id, nome: s.nome, tipo: s.tipo, subtipo: s.subtipo, uuid: s.uuid })),
          requisitos_ambiente: ['FOUNDRY_URL', 'FOUNDRY_ADMIN_PASSWORD', 'FOUNDRY_WORLD', 'FOUNDRY_USER', 'playwright']
        };
        fs.writeFileSync(reportPath, JSON.stringify(plan, null, 2), 'utf8');
        console.log(`📋 Plano Playwright gerado em ${reportPath} (${samples.length} amostras).`);
      }
      return true;
    }
  }

  const pw = resolvePlaywright();
  if (!pw || !url) {
    const reason = !pw
      ? 'Pacote `playwright` não instalado neste projeto (ou NODE_PATH).'
      : 'Variável de ambiente FOUNDRY_URL não configurada para conexão ao mundo real.';
    for (const id of targetIds) {
      const samples = buildSamplePlan(id, artefatos);
      const evidenciasDir = path.join(CATALOGO_DIR, 'materiais', id, 'playwright-evidencias');
      fs.mkdirSync(evidenciasDir, { recursive: true });
      fs.writeFileSync(path.join(evidenciasDir, 'report.json'), JSON.stringify({
        material_id: id,
        status: 'BLOQUEADO_AMBIENTE',
        motivo: reason,
        gerado_em: new Date().toISOString(),
        amostras_previstas: samples.map(s => ({ nome: s.nome, tipo: s.tipo, subtipo: s.subtipo, uuid: s.uuid }))
      }, null, 2), 'utf8');
    }
    console.error(`⚠️ Validação Playwright bloqueada: ${reason}`);
    return false;
  }

  const browser = await launchChromium(pw, options.headless !== false);
  const pregameErrors = [];
  const consoleErrors = [];
  const pageErrors = [];
  const networkErrors = [];
  let capturePhase = 'pregame';

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const entry = { text: msg.text(), location: msg.location()?.url || null };
        if (capturePhase === 'inworld') consoleErrors.push(entry);
        else pregameErrors.push({ type: 'console', ...entry });
      }
    });
    page.on('pageerror', err => {
      if (capturePhase === 'inworld') pageErrors.push(err.message);
      else pregameErrors.push({ type: 'pageerror', text: err.message });
    });
    page.on('response', res => {
      if (res.status() >= 400) {
        const entry = { status: res.status(), url: res.url() };
        if (capturePhase === 'inworld') networkErrors.push(entry);
        else pregameErrors.push({ type: 'http', ...entry });
      }
    });

    const updateResult = await ensureFoundryGameReady(page, {
      url,
      adminPassword,
      world,
      user,
      password,
      updateModule,
      updateAll
    });
    capturePhase = 'inworld';
    await installUiErrorInterceptor(page);

    if (isSmoke) {
      return await runSmokeValidation(page, {
        url,
        returnToSetup,
        updateResult,
        consoleErrors,
        pageErrors,
        networkErrors,
        pregameErrors
      });
    }

    const runtime = await inspectFoundryRuntime(page);
    let allPassed = true;
    for (const id of targetIds) {
      const ok = await validateMaterialInPage(page, {
        materialId: id,
        catalogo,
        artefatos,
        world,
        url,
        updateResult,
        runtime,
        pregameErrors,
        consoleErrors,
        pageErrors,
        networkErrors
      });
      if (!ok) allPassed = false;
    }

    await maybeReturnToSetup(page, returnToSetup);
    return allPassed;
  } finally {
    await browser.close();
  }
}

function parseCliArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--material' && argv[i + 1]) opts.material = argv[++i];
    else if (a === '--url' && argv[i + 1]) opts.url = argv[++i];
    else if (a === '--world' && argv[i + 1]) opts.world = argv[++i];
    else if (a === '--user' && argv[i + 1]) opts.user = argv[++i];
    else if (a === '--password' && argv[i + 1]) opts.password = argv[++i];
    else if (a === '--admin-password' && argv[i + 1]) opts.adminPassword = argv[++i];
    else if (a === '--plan-only' || a === '--dry-run') opts.planOnly = true;
    else if (a === '--smoke') opts.smoke = true;
    else if (a === '--all') opts.all = true;
    else if (a === '--update-module') opts.updateModule = true;
    else if (a === '--no-update') { opts.updateModule = false; opts.updateAll = false; }
    else if (a === '--update-all') opts.updateAll = true;
    else if (a === '--headed') opts.headless = false;
    else if (a === '--keep-running') opts.returnToSetup = false;
  }
  return opts;
}

if (require.main === module) {
  runPlaywrightValidation(parseCliArgs(process.argv.slice(2)))
    .then(ok => process.exit(ok ? 0 : 1))
    .catch(err => {
      console.error('❌ Erro no validador Playwright:', err.message);
      process.exit(1);
    });
}

module.exports = {
  runPlaywrightValidation,
  buildSamplePlan,
  loadEnvFile,
  parseCliArgs,
  ensureFoundryGameReady,
  launchChromium,
  maybeReturnToSetup
};

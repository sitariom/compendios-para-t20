#!/usr/bin/env node
/**
 * Publicador Oficial de Releases no GitHub para compendios-para-t20
 */

const https = require('https');
const fs = require('fs');
const { execFileSync } = require('child_process');

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!TOKEN) {
  console.error('ERRO: GITHUB_PERSONAL_ACCESS_TOKEN não encontrado.');
  process.exit(1);
}

const REPO = 'sitariom/compendios-para-t20';

function ghRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'User-Agent': 'pi-agent-automation',
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      ...(options.headers || {})
    };

    if (postData) {
      reqHeaders['Content-Length'] = Buffer.isBuffer(postData)
        ? postData.length
        : Buffer.byteLength(postData);
    }

    const req = https.request({
      ...options,
      headers: reqHeaders
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(buffer.toString('utf8')));
          } catch {
            resolve(buffer);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${buffer.toString('utf8')}`));
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function main() {
  console.log('=== 1. CRIANDO PULL REQUEST PARA A MAIN ===');
  const prBody = `## Release v1.10.0 — Campanha Fúlgor dos Deuses (Edições 26 e 27), Motor Iterativo AVRL e Hooks de Ciclo de Vida

### ⚔️ Fúlgor dos Deuses — Edição 26: Forja da Vingança
- **Ameaças Canônicas (\`packs/Ameacas_T20\`)**: Calibração e saneamento rigoroso de 6 ameaças: *Asmithar Martelo-Mudo (ND 9)*, *Xellmaras, a Ladra Acorrentada (ND 6)*, *Gangue de Hyninn Deturpada (ND 4)*, *Sacerdote de Hyninn Deturpado (ND 4)* com 3 magias individuais, *Tigre-de-Hyninn Deturpado (ND 6)* e *Aço Selvagem (ND 6)*. Todos com tokens 2MTT transparentes de 512x512, defesa dinâmica (\`defesa.base = valor - des\`), 34 perícias calibradas, texto de resistências integral e habilidades atômicas.
- **Itens e Aço Sillariano (\`packs/Itens_T20\`)**: Inclusão de 17 itens: material especial *Aço Sillariano*, artefato sagrado *Alma da Bigorna*, 11 qualidades antidivinas (*Absorção*, *Arma*, *Defesa*, *Guarda*, *Impedimento*, *Magia*, *Mente*, *Perseguidora*, *Potência*, *Resistência*, *Antidevoto*) com \`ActiveEffects\` estruturados, traços fullgori (*Teofagia*, *Imunidades*) e parceiros veteranos (*Forjadores Litúrgicos* e *Thalgrimm Sangue de Ferro*).
- **Diários (\`packs/Diarios_T20\`)**: Diário oficial completo com 7 páginas estruturadas sob \`!journal.pages!\` (\`ownership.default: -1\`).
- **Tabelas de Rolagem (\`packs/Tabelas_T20\`)**: 3 tabelas com resultados estruturados em \`!tables.results!\`.
- **Macros (\`packs/Macros_T20\`)**: Macro interativa *Forjar Aço Sillariano (Fúlgor dos Deuses)*.

### ☀️ Fúlgor dos Deuses — Edição 27: Dia e Noite
- **Ameaças Canônicas (\`packs/Ameacas_T20\`)**: Inclusão de 6 ameaças: *Cassiella semi-fullgori (ND 7)*, *Cassiella fullgori (ND 8)* com voo 15m e azagaias fullgori à distância, *Enxame Trog (ND 5)* Enorme (3x3), *Troggore (ND 3)*, *Bando Troggore (ND 5)* Grande (2x2) e o xamã supremo *Urrash das Sombras Frias (ND 5)* com 6 magias individuais de Tenebra.
- **Relíquias e Itens (\`packs/Itens_T20\`)**: Artefato sagrado *Orbe de Azgher* (aura de luz permanente de 5º círculo e conjuração solar) com \`ActiveEffects\`, parceira *Cassiella de Baldonn* (+3 ataque) e equipamentos da aventura.
- **Diários (\`packs/Diarios_T20\`)**: Diário oficial completo com 6 páginas estruturadas sob \`!journal.pages!\`.
- **Tabelas de Rolagem (\`packs/Tabelas_T20\`)**: 3 tabelas de perigos cavernosos e dilemas com resultados em subdocumentos.
- **Macros (\`packs/Macros_T20\`)**: Macro interativa *Canalizar Orbe de Azgher (Fúlgor dos Deuses)*.

### 🚀 Evolução Arquitetural do Motor AVRL e Hooks de Ciclo de Vida
- Novo motor iterativo \`scripts/avrl-runner.js\` (\`npm run avrl\`) com multi-retry até 5 iterações até a convergência total (0 erros, 0 correções pendentes).
- Hooks integrados em \`scripts/create-entry.js\` para auto-reparação pré-persistência de tokens 2MTT, defesas dinâmicas, 34 perícias e auto-injeção de \`ActiveEffects\` em itens e poderes.
- Script de teste de estresse retroativo \`scripts/test-avrl-retroactive-fullgor26.js\` aprovado com 100% de sucesso.
- Suítes de validação dedicadas: \`npm run validate:fullgor26\` (701 checagens), \`npm run validate:fullgor27\` (616 checagens), \`npm run validate:fidelity\` (216 checagens) e \`npm run ci:quality\`.

### 📐 OpenSpec SDD e CodeGraph
- 2 living specs atualizadas e 2 changes arquivadas formalmente no OpenSpec (10/10 specs aprovadas).
- CodeGraph sincronizado com 58 arquivos e 439 nós AST.`;

  let prNumber;
  try {
    const prRes = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      title: 'feat: release v1.10.0 - Fúlgor dos Deuses (Edições 26 e 27) e Motor Iterativo AVRL',
      head: 'release/v1.10.0',
      base: 'main',
      body: prBody
    }));
    prNumber = prRes.number;
    console.log(`✓ Pull Request #${prNumber} criado: ${prRes.html_url}`);
  } catch (err) {
    console.log('Verificando se PR já existe...');
    const existingPrs = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls?head=sitariom:release/v1.10.0`,
      method: 'GET'
    });
    if (existingPrs && existingPrs.length > 0) {
      prNumber = existingPrs[0].number;
      console.log(`ℹ️ Pull Request #${prNumber} existente: ${existingPrs[0].html_url}`);
    } else {
      throw err;
    }
  }

  console.log(`\n=== 2. REALIZANDO MERGE DO PR #${prNumber} NA MAIN ===`);
  const mergeRes = await ghRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO}/pulls/${prNumber}/merge`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    commit_title: `Merge pull request #${prNumber} from sitariom/release/v1.10.0`,
    commit_message: 'Release v1.10.0 - Fúlgor dos Deuses (Edições 26 e 27) & Motor Iterativo AVRL',
    merge_method: 'merge'
  }));
  console.log(`✓ PR #${prNumber} mesclado com sucesso! SHA: ${mergeRes.sha}`);

  console.log('\n=== 3. ATUALIZANDO MAIN E ENVIANDO TAG V1.10.0 ===');
  execFileSync('git', ['checkout', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['pull', 'origin', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['tag', '-a', 'v1.10.0', '-m', 'Release v1.10.0'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', 'v1.10.0'], { stdio: 'inherit' });
  console.log('✓ Tag v1.10.0 criada e enviada com sucesso!');

  console.log('\n=== 4. CRIANDO RELEASE OFICIAL NO GITHUB ===');
  const releaseRes = await ghRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    tag_name: 'v1.10.0',
    name: 'v1.10.0 - Fúlgor dos Deuses (Edições 26 e 27) & Motor Iterativo AVRL',
    body: prBody,
    draft: false,
    prerelease: false
  }));
  console.log(`✓ Release criada no GitHub: ${releaseRes.html_url}`);

  let uploadUrl;
  try {
    uploadUrl = new URL(releaseRes.upload_url.split('{')[0]);
  } catch (urlErr) {
    throw new Error(`URL de upload inválida: ${urlErr.message}`);
  }

  console.log('\n=== 5. ANEXANDO ASSETS (module.json e module.zip) ===');
  // 5.1 module.json
  const moduleJsonData = fs.readFileSync('module.json');
  await ghRequest({
    hostname: uploadUrl.hostname,
    path: `${uploadUrl.pathname}?name=module.json`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, moduleJsonData);
  console.log('✓ Asset module.json anexado!');

  // 5.2 module.zip
  const moduleZipData = fs.readFileSync('module.zip');
  await ghRequest({
    hostname: uploadUrl.hostname,
    path: `${uploadUrl.pathname}?name=module.zip`,
    method: 'POST',
    headers: { 'Content-Type': 'application/zip' }
  }, moduleZipData);
  console.log(`✓ Asset module.zip (${(moduleZipData.length / (1024 * 1024)).toFixed(1)} MB) anexado!`);

  console.log('\n🎉 RELEASE v1.10.0 PUBLICADA COM 100% DE SUCESSO NO GITHUB!');
}

main().catch(err => {
  console.error('❌ Falha na publicação da release:', err);
  process.exit(1);
});

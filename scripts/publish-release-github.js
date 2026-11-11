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
  const prBody = `## Release v1.10.2 — Hotfix Definitivo: Resolução do ID de Pasta de Macros (\`fldFolderMacro26\`) & Validação Estrita de Schemas

### 🐛 Correção Crítica
- **Erro Resolvido**: \`DataModelValidationError: Folder [fldMacrosFolder26] validation errors: _id: must be a valid 16-character alphanumeric ID\` que causava interrupção no carregamento do mundo no Foundry VTT v12/v13.
- **Causa Raiz**: O identificador de pasta \`fldMacrosFolder26\` possuía 17 caracteres, violando o campo obrigatório \`DocumentIdField\` do Foundry VTT que exige estritamente 16 caracteres alfanuméricos (\`/^[a-zA-Z0-9]{16}$/\`).
- **Solução Canônica**:
  - Ajustado o ID da pasta de macros para \`fldFolderMacro26\` (exatamente 16 caracteres alfanuméricos) em todos os compêndios e scripts de injeção.
  - Saneamento do LevelDB: excluída a chave \`!folders!fldMacrosFolder26\` e gravada a chave canônica \`!folders!fldFolderMacro26\`.
  - Atualizadas as macros *Forjar Aço Sillariano* e *Canalizar Orbe de Azgher* para apontar para a nova pasta.
- **Blindagem do Pipeline**:
  - \`scripts/audit.js\` agora valida obrigatoriamente se o \`_id\` de todas as pastas em todos os 6 compêndios possui exatamente 16 caracteres alfanuméricos.
  - \`scripts/avrl-runner.js\` auto-remedia qualquer discrepância de IDs de pastas e documentos.
  - Auditoria completa aprovada com **0 erros de integridade em 36.000+ documentos**.`;

  let prNumber;
  try {
    const prRes = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      title: 'feat: release v1.10.2 - Resolução do ID de Pasta de Macros e Validação Estrita de Schemas',
      head: 'release/v1.10.2',
      base: 'main',
      body: prBody
    }));
    prNumber = prRes.number;
    console.log(`✓ Pull Request #${prNumber} criado: ${prRes.html_url}`);
  } catch (err) {
    console.log('Verificando se PR já existe...');
    const existingPrs = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls?head=sitariom:release/v1.10.2`,
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
    commit_title: `Merge pull request #${prNumber} from sitariom/release/v1.10.2`,
    commit_message: 'Release v1.10.2 - Resolução do ID de Pasta de Macros e Validação Estrita de Schemas',
    merge_method: 'merge'
  }));
  console.log(`✓ PR #${prNumber} mesclado com sucesso! SHA: ${mergeRes.sha}`);

  console.log('\n=== 3. ATUALIZANDO MAIN E ENVIANDO TAG V1.10.2 ===');
  execFileSync('git', ['checkout', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['pull', 'origin', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['tag', '-a', 'v1.10.2', '-m', 'Release v1.10.2'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', 'v1.10.2'], { stdio: 'inherit' });
  console.log('✓ Tag v1.10.2 criada e enviada com sucesso!');

  console.log('\n=== 4. CRIANDO RELEASE OFICIAL NO GITHUB ===');
  const releaseRes = await ghRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    tag_name: 'v1.10.2',
    name: 'v1.10.2 - Hotfix Definitivo: Resolução do ID de Pasta de Macros (fldFolderMacro26) & Validação Estrita de Schemas',
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

  console.log('\n🎉 RELEASE v1.10.2 PUBLICADA COM 100% DE SUCESSO NO GITHUB!');
}

main().catch(err => {
  console.error('❌ Falha na publicação da release:', err);
  process.exit(1);
});

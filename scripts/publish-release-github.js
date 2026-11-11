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
  const prBody = `## Hotfix v1.10.1 — Correção do DataModel de Pastas no Foundry VTT (\`_stats.lastModifiedBy\`)

### 🐛 Correção Crítica
- **Erro Resolvido**: \`DataModelValidationError: Folder [fldItensFolder26] validation errors: _stats: lastModifiedBy: must be a valid 16-character alphanumeric ID\` que impedia o carregamento do mundo no Foundry VTT v12/v13.
- **Causa Raiz**: A string de metadados \`piAgentTormenta20\` possuía 17 caracteres, violando a regra de schema \`DocumentIdField\` do Foundry VTT que exige estritamente 16 caracteres alfanuméricos (\`/^[a-zA-Z0-9]{16}$/\`).
- **Solução Canônica**: Substituído o valor em todas as pastas e documentos de todos os compêndios pelo ID de usuário canônico de 16 caracteres \`kL8nfmJOQTqjeU2x\`.
- **Blindagem do Pipeline**:
  - \`scripts/audit.js\` agora valida e acusa erro se qualquer documento ou pasta contiver \`_stats.lastModifiedBy\` que não seja um ID de 16 caracteres alfanuméricos.
  - \`scripts/avrl-runner.js\` auto-remedia imediatamente qualquer ocorrência para o ID canônico de 16 caracteres.
  - Auditoria completa aprovada com **0 erros de integridade em 36.000+ documentos**.`;

  let prNumber;
  try {
    const prRes = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      title: 'fix: v1.10.1 - Hotfix Crítico: Correção do DataModel de Pastas no Foundry VTT (_stats.lastModifiedBy)',
      head: 'fix/v1.10.1-folder-stats-lastmodifiedby',
      base: 'main',
      body: prBody
    }));
    prNumber = prRes.number;
    console.log(`✓ Pull Request #${prNumber} criado: ${prRes.html_url}`);
  } catch (err) {
    console.log('Verificando se PR já existe...');
    const existingPrs = await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/pulls?head=sitariom:fix/v1.10.1-folder-stats-lastmodifiedby`,
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
    commit_title: `Merge pull request #${prNumber} from sitariom/fix/v1.10.1-folder-stats-lastmodifiedby`,
    commit_message: 'fix: v1.10.1 - Hotfix Crítico: Correção do DataModel de Pastas no Foundry VTT (_stats.lastModifiedBy)',
    merge_method: 'merge'
  }));
  console.log(`✓ PR #${prNumber} mesclado com sucesso! SHA: ${mergeRes.sha}`);

  console.log('\n=== 3. ATUALIZANDO MAIN E ENVIANDO TAG V1.10.1 ===');
  execFileSync('git', ['checkout', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['pull', 'origin', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['tag', '-a', 'v1.10.1', '-m', 'Release v1.10.1'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', 'v1.10.1'], { stdio: 'inherit' });
  console.log('✓ Tag v1.10.1 criada e enviada com sucesso!');

  console.log('\n=== 4. CRIANDO RELEASE OFICIAL NO GITHUB ===');
  const releaseRes = await ghRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    tag_name: 'v1.10.1',
    name: 'v1.10.1 - Hotfix Crítico: Correção do DataModel de Pastas no Foundry VTT (_stats.lastModifiedBy)',
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

  console.log('\n🎉 RELEASE v1.10.1 PUBLICADA COM 100% DE SUCESSO NO GITHUB!');
}

main().catch(err => {
  console.error('❌ Falha na publicação da release:', err);
  process.exit(1);
});

const https = require('https');
const fs = require('fs');

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
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
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log("=== OBTENDO RELEASE v1.10.1 NO GITHUB ===");
  const release = await ghRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases/tags/v1.10.1`,
    method: 'GET'
  });
  console.log(`✓ Release encontrada: ${release.name} (id=${release.id})`);

  // Deletar assets antigos
  for (const asset of release.assets || []) {
    console.log(`Deletando asset antigo: ${asset.name} (id=${asset.id})...`);
    await ghRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/releases/assets/${asset.id}`,
      method: 'DELETE'
    });
    console.log(`✓ Asset ${asset.name} deletado.`);
  }

  let uploadUrl;
  try {
    uploadUrl = new URL(release.upload_url.split('{')[0]);
  } catch (e) {
    throw new Error(`Upload URL inválida: ${e.message}`);
  }

  console.log("\n=== ANEXANDO ASSETS ATUALIZADOS ===");
  // module.json
  const moduleJsonData = fs.readFileSync('module.json');
  await ghRequest({
    hostname: uploadUrl.hostname,
    path: `${uploadUrl.pathname}?name=module.json`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, moduleJsonData);
  console.log('✓ Asset module.json atualizado!');

  // module.zip
  const moduleZipData = fs.readFileSync('module.zip');
  await ghRequest({
    hostname: uploadUrl.hostname,
    path: `${uploadUrl.pathname}?name=module.zip`,
    method: 'POST',
    headers: { 'Content-Type': 'application/zip' }
  }, moduleZipData);
  console.log(`✓ Asset module.zip (${(moduleZipData.length / (1024 * 1024)).toFixed(1)} MB) atualizado!`);

  console.log("\n🎉 ASSETS DA RELEASE v1.10.1 ATUALIZADOS COM 100% DE SUCESSO!");
}

main().catch(err => {
  console.error("❌ Falha:", err);
  process.exit(1);
});

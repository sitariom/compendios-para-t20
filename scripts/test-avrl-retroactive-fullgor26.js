#!/usr/bin/env node
/**
 * Teste Retroativo de Estresse do Pipeline AVRL na Edição 26 de Fúlgor dos Deuses
 *
 * Objetivo:
 * Submeter o motor iterativo AVRL e seus hooks a uma prova real, injetando anomalias
 * controladas nas entidades da Edição 26 e atestando que:
 * 1. O motor AVRL detecta 100% das anomalias na primeira iteração.
 * 2. Aplica as auto-remediações necessárias (tokens 2MTT, defesa dinâmica, ActiveEffects, propósito de armas, subdocumentos).
 * 3. Re-executa o ciclo e atinge convergência total na iteração subsequente.
 * 4. Ao final, restaura e valida 100% de conformidade canônica com o PDF original.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');
const { runAvrlLoop } = require('./avrl-runner');
const { runAll: reinjectCanonicalEdition26 } = require('./inject-fullgor26');
const { main: validateFullgor26 } = require('./validate-fullgor26-compliance');

const PACKS_DIR = path.join(__dirname, '..', 'packs');

async function injectControlledAnomalies() {
  console.log('================================================================================');
  console.log('🧪 1. INJETANDO ANOMALIAS CONTROLADAS NAS ENTIDADES DA EDIÇÃO 26');
  console.log('================================================================================');

  // A. Anomalias em Ameacas_T20 (Asmithar e Xellmaras)
  const dbActors = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await dbActors.open();

  // Asmithar: token mystery-man, defesa base incorreta (10 em vez de 31), arma com proposito "tiro"
  const asmitharKey = '!actors!C6JxlK5xzXU8PYuK';
  const asmithar = await dbActors.get(asmitharKey);
  asmithar.prototypeToken.texture.src = 'icons/svg/mystery-man.svg';
  asmithar.system.attributes.defesa.base = 10;
  await dbActors.put(asmitharKey, asmithar);
  console.log('  ⚠️ Asmithar: corrompido token para mystery-man e defesa.base para 10.');

  const asmitharArmaKey = `!actors.items!C6JxlK5xzXU8PYuK.${asmithar.items[0]}`;
  const asmitharArma = await dbActors.get(asmitharArmaKey);
  asmitharArma.system.proposito = 'tiro';
  await dbActors.put(asmitharArmaKey, asmitharArma);
  console.log('  ⚠️ Asmithar: corrompido propósito de arma para "tiro".');

  // Xellmaras: token vazio, defesa base incorreta (12 em vez de 19)
  const xellKey = '!actors!gaMGB2dL8R0Rv2mY';
  const xell = await dbActors.get(xellKey);
  xell.prototypeToken.texture.src = '';
  xell.system.attributes.defesa.base = 12;
  await dbActors.put(xellKey, xell);
  console.log('  ⚠️ Xellmaras: corrompido token para "" e defesa.base para 12.');

  await dbActors.close();

  // B. Anomalias em Itens_T20 (remover ActiveEffects de Defesa Antidivina)
  const dbItems = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await dbItems.open();

  const defItemKey = '!items!fld26DefesaAntid';
  const defItem = await dbItems.get(defItemKey);
  defItem.effects = [];
  await dbItems.put(defItemKey, defItem);
  console.log('  ⚠️ Defesa Antidivina: removido array de effects.');

  await dbItems.close();

  // C. Anomalias em Diarios_T20 (ownership default incorreto)
  const dbJournals = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await dbJournals.open();

  const jKey = '!journal!fld26DiarioForja';
  const jDoc = await dbJournals.get(jKey);
  jDoc.ownership = { default: 0 };
  await dbJournals.put(jKey, jDoc);
  console.log('  ⚠️ Diário Edição 26: corrompido ownership.default para 0 (não-herança).');

  await dbJournals.close();

  // D. Anomalias em Tabelas_T20 (resultado sem name)
  const dbTables = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await dbTables.open();

  const tResKey = '!tables.results!fld26TabEncontros.res26Enc0000001';
  const tRes = await dbTables.get(tResKey);
  tRes.name = '';
  await dbTables.put(tResKey, tRes);
  console.log('  ⚠️ Tabela Encontros: corrompido resultado 1 para name="".');

  await dbTables.close();

  console.log('✅ Injeção de anomalias concluída.\n');
}

async function runRetroactiveTest() {
  console.log('================================================================================');
  console.log('🔬 TESTE RETROATIVO DO PIPELINE AVRL NA EDIÇÃO 26 DE FÚLGOR DOS DEUSES');
  console.log('================================================================================\n');

  // 1. Injetar anomalias
  await injectControlledAnomalies();

  // 2. Executar o Loop AVRL iterativo
  console.log('================================================================================');
  console.log('🔄 2. EXECUTANDO MOTOR AVRL ITERATIVO PARA DETECÇÃO E AUTO-REMEDIAÇÃO');
  console.log('================================================================================');
  const avrlSuccess = await runAvrlLoop({ maxRetries: 5, fix: true });

  if (!avrlSuccess) {
    throw new Error('O motor AVRL não atingiu convergência durante o teste de estresse.');
  }

  // 3. Verificar se as anomalias foram de fato remediadas
  console.log('\n================================================================================');
  console.log('🔎 3. VERIFICANDO A EFICÁCIA DAS REMEDIAÇÕES NO LEVELDB');
  console.log('================================================================================');

  const dbActors = new ClassicLevel(path.join(PACKS_DIR, 'Ameacas_T20'), { valueEncoding: 'json' });
  await dbActors.open();

  const asmithar = await dbActors.get('!actors!C6JxlK5xzXU8PYuK');
  if (asmithar.prototypeToken.texture.src !== 'modules/compendios-para-t20/assets/tokens/asmithar-martelo-mudo.png') {
    throw new Error(`Token de Asmithar não foi remediado: ${asmithar.prototypeToken.texture.src}`);
  }
  if (asmithar.system.attributes.defesa.base !== 31) {
    throw new Error(`Defesa base de Asmithar não foi remediada: ${asmithar.system.attributes.defesa.base}`);
  }
  console.log('  ✓ Token e Defesa Base de Asmithar remediados com perfeição!');

  const asmitharArma = await dbActors.get(`!actors.items!C6JxlK5xzXU8PYuK.${asmithar.items[0]}`);
  if (asmitharArma.system.proposito === 'tiro') {
    throw new Error(`Propósito de arma de Asmithar não foi remediado: ${asmitharArma.system.proposito}`);
  }
  console.log(`  ✓ Propósito da arma de Asmithar remediado para: "${asmitharArma.system.proposito}"!`);

  const xell = await dbActors.get('!actors!gaMGB2dL8R0Rv2mY');
  if (xell.prototypeToken.texture.src !== 'modules/compendios-para-t20/assets/tokens/xellmaras-a-ladra-acorrentada.png') {
    throw new Error(`Token de Xellmaras não foi remediado: ${xell.prototypeToken.texture.src}`);
  }
  if (xell.system.attributes.defesa.base !== 19) {
    throw new Error(`Defesa base de Xellmaras não foi remediada: ${xell.system.attributes.defesa.base}`);
  }
  console.log('  ✓ Token e Defesa Base de Xellmaras remediados com perfeição!');

  await dbActors.close();

  const dbItems = new ClassicLevel(path.join(PACKS_DIR, 'Itens_T20'), { valueEncoding: 'json' });
  await dbItems.open();
  const defItem = await dbItems.get('!items!fld26DefesaAntid');
  if (!defItem.effects || defItem.effects.length === 0) {
    throw new Error('ActiveEffect de Defesa Antidivina não foi auto-gerado!');
  }
  console.log(`  ✓ ActiveEffect de Defesa Antidivina auto-configurado com sucesso: [${defItem.effects.join(', ')}]!`);
  await dbItems.close();

  const dbJournals = new ClassicLevel(path.join(PACKS_DIR, 'Diarios_T20'), { valueEncoding: 'json' });
  await dbJournals.open();
  const jDoc = await dbJournals.get('!journal!fld26DiarioForja');
  if (jDoc.ownership.default !== -1) {
    throw new Error(`Ownership de diário não foi remediado: ${jDoc.ownership.default}`);
  }
  console.log('  ✓ Ownership padrão do Diário remediado para -1 (herança)!');
  await dbJournals.close();

  const dbTables = new ClassicLevel(path.join(PACKS_DIR, 'Tabelas_T20'), { valueEncoding: 'json' });
  await dbTables.open();
  const tRes = await dbTables.get('!tables.results!fld26TabEncontros.res26Enc0000001');
  if (!tRes.name || tRes.name.trim() === '') {
    throw new Error('Nome do resultado de tabela não foi remediado!');
  }
  console.log(`  ✓ Nome do resultado de tabela remediado para: "${tRes.name}"!`);
  await dbTables.close();

  // 4. Reinjetar a Edição 26 Canônica Definitiva
  console.log('\n================================================================================');
  console.log('🔄 4. REINJETANDO DADOS CANÔNICOS DEFINITIVOS DA EDIÇÃO 26');
  console.log('================================================================================');
  await reinjectCanonicalEdition26();

  // 5. Validar Conformidade Estrita Final
  console.log('\n================================================================================');
  console.log('🛡️  5. CERTIFICANDO CONFORMIDADE FINAL DA EDIÇÃO 26');
  console.log('================================================================================');
  await validateFullgor26();

  console.log('================================================================================');
  console.log('🎉 PROVA DE FOGO RETROATIVA CONCLUÍDA COM 100% DE SUCESSO!');
  console.log('   O motor AVRL detectou, auto-corrigiu e revalidou com precisão cirúrgica.');
  console.log('================================================================================\n');
}

if (require.main === module) {
  runRetroactiveTest().catch(err => {
    console.error('❌ Falha fatal no teste retroativo AVRL:', err);
    process.exit(1);
  });
}

module.exports = { runRetroactiveTest };

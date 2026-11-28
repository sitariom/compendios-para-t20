#!/usr/bin/env node
/**
 * Extrator PDF & Mapeador Campo-a-Campo do Catálogo T20
 *
 * Para cada material processado (DB-0226..0232, RT20-025..028):
 * 1. Invoca scripts/extract-db.py (PyMuPDF / fitz) sobre arquivo_fonte -> catalogo/materiais/<ID>/extracao.json
 * 2. Localiza em quais páginas do PDF cada artefato (ator, item, magia, diário, tabela, macro) ocorre
 * 3. Atualiza catalogo/materiais/<ID>/mapa_pdf_artefatos.json com páginas e cobertura_pdf
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOGO_DIR = path.join(ROOT_DIR, 'catalogo');
const CATALOGO_PATH = path.join(CATALOGO_DIR, 'catalogo.json');
const ARTEFATOS_PATH = path.join(CATALOGO_DIR, 'artefatos.json');
const MATERIAIS_DIR = path.join(CATALOGO_DIR, 'materiais');
const EXTRACT_PY = path.join(ROOT_DIR, 'scripts', 'extract-db.py');

function normText(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchTerms(art) {
  const raw = art.nome || '';
  const noParen = raw.replace(/\([^)]*\)/g, '').trim();
  const afterColon = noParen.includes(':') ? noParen.split(':').slice(1).join(':').trim() : noParen;
  const cleaned = afterColon.split('—')[0].trim();

  const terms = new Set();
  for (const candidate of [noParen, afterColon, cleaned, raw.split('—')[0]]) {
    const n = normText(candidate);
    if (n.length >= 4) terms.add(n);
  }
  for (const m of raw.matchAll(/\(([^)]+)\)/g)) {
    const inner = normText(m[1]);
    if (inner.length >= 4 && !/^db\s*\d+|^edicao\s*\d+|^fulgor/.test(inner)) {
      terms.add(inner);
    }
  }
  const stopWords = new Set(['para', 'com', 'dos', 'das', 'nos', 'nas', 'por', 'uma', 'uns', 'umas', 'sobre', 'entre', 'edicao', 'frases', 'combate', 'encontros', 'ganchos', 'aventura', 'regras', 'forma', 'fera', 'sonho', 'resgatado', 'pesadelo', 'onirico', 'parceiro', 'parceira', 'suporte', 'chave', 'antiga', 'matricula', 'forjada', 'gema', 'desejo', 'divinas', 'efeitos', 'rodada']);
  const significantTokens = normText(cleaned)
    .split(' ')
    .filter(w => w.length >= 5 && !stopWords.has(w));
  if (significantTokens.length >= 2) {
    terms.add(significantTokens.slice(0, 2).join(' '));
  }
  for (const w of significantTokens) {
    if (w.length >= 6) terms.add(w);
  }
  return [...terms];
}

function runExtract(options = {}) {
  if (!fs.existsSync(CATALOGO_PATH) || !fs.existsSync(ARTEFATOS_PATH)) {
    throw new Error('catalogo/catalogo.json ou catalogo/artefatos.json ausente.');
  }

  const catalogo = JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf8'));
  const artefatosData = JSON.parse(fs.readFileSync(ARTEFATOS_PATH, 'utf8'));
  const targetMat = options.material || null;

  const artsByMat = new Map();
  for (const a of artefatosData.artefatos) {
    if (!artsByMat.has(a.material_id)) artsByMat.set(a.material_id, []);
    artsByMat.get(a.material_id).push(a);
  }

  let extractedCount = 0;
  for (const [matId, mat] of Object.entries(catalogo.materiais)) {
    if (mat.origem_tipo !== 'CRIADO_AGENTE') continue;
    if (targetMat && matId !== targetMat) continue;
    if (!mat.arquivo_fonte || !fs.existsSync(mat.arquivo_fonte)) {
      console.warn(`⚠️ [${matId}] PDF fonte ausente: ${mat.arquivo_fonte}`);
      continue;
    }

    const matDir = path.join(MATERIAIS_DIR, matId);
    fs.mkdirSync(matDir, { recursive: true });
    const extracaoPath = path.join(matDir, 'extracao.json');
    const mapaPath = path.join(matDir, 'mapa_pdf_artefatos.json');

    let extracao = null;
    if (fs.existsSync(extracaoPath)) {
      try {
        const cur = JSON.parse(fs.readFileSync(extracaoPath, 'utf8'));
        if (Array.isArray(cur.paginas) && cur.paginas.length > 0 && cur.hash_fonte === mat.hash_fonte) {
          extracao = cur;
        }
      } catch {}
    }

    if (!extracao) {
      console.log(`📄 [${matId}] Extraindo PDF: ${path.basename(mat.arquivo_fonte)}...`);
      const stdout = execFileSync('python', [EXTRACT_PY, mat.arquivo_fonte], {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024
      });
      const parsed = JSON.parse(stdout);
      extracao = {
        material_id: matId,
        titulo: mat.titulo,
        serie: mat.serie,
        campanha: mat.campanha,
        edicao: mat.edicao,
        arquivo_fonte: mat.arquivo_fonte,
        hash_fonte: mat.hash_fonte,
        total_paginas: parsed.totalPages,
        status_extracao: 'EXTRAIDO_PDF_COMPLETO',
        extraido_em: new Date().toISOString(),
        paginas: parsed.pages.map(p => ({
          pagina: p.page,
          texto: p.text,
          texto_norm: normText(p.text)
        }))
      };
      fs.writeFileSync(extracaoPath, JSON.stringify(extracao, null, 2), 'utf8');
      extractedCount++;
    }

    // Mapeia cada artefato contra as páginas extraídas do PDF
    const arts = artsByMat.get(matId) || [];
    let mappedCount = 0;
    const mappedArts = arts.map(art => {
      const terms = buildSearchTerms(art);
      const matchedPages = [];
      for (const pg of extracao.paginas) {
        if (terms.some(t => pg.texto_norm.includes(t))) {
          matchedPages.push(pg.pagina);
        }
      }
      if (matchedPages.length > 0 || art.tipo === 'Macro') mappedCount++;
      return {
        artefato_id: art.id,
        nome: art.nome,
        tipo: art.tipo,
        subtipo: art.subtipo,
        uuid_atual: art.uuid,
        pack_destino_hierarquico: art.pack_destino_hierarquico,
        paginas_pdf: matchedPages,
        origem_rastreavel: matchedPages.length > 0 ? 'PDF_CORRESPONDENCIA_TEXTUAL' : (art.tipo === 'Macro' ? 'AUTOMACAO_CAMPANHA' : 'PENDENTE_REVISAO_MANUAL'),
        campos_mapeados: ['_id', 'name', 'type', 'system'],
        status: art.status
      };
    });

    const pct = arts.length > 0 ? Math.round((mappedCount / arts.length) * 100) : 100;
    mat.cobertura_pdf = `${pct}% (${mappedCount}/${arts.length})`;
    fs.writeFileSync(
      mapaPath,
      JSON.stringify({
        material_id: matId,
        cobertura_pdf: mat.cobertura_pdf,
        gerado_em: new Date().toISOString(),
        artefatos: mappedArts
      }, null, 2),
      'utf8'
    );
    console.log(`  ✓ [${matId}] ${extracao.paginas.length} páginas extraídas | Rastreabilidade PDF: ${mat.cobertura_pdf}`);
  }

  fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf8');
  console.log(`✅ Extração PDF concluída (${extractedCount} PDFs extraídos agora).`);
}

if (require.main === module) {
  const idx = process.argv.indexOf('--material');
  const material = idx !== -1 ? process.argv[idx + 1] : null;
  runExtract({ material });
}

module.exports = { runExtract };

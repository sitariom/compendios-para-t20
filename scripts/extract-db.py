#!/usr/bin/env python3
import importlib
import json
import os
import shutil
import subprocess
import sys

ACERVO_BASE = os.environ.get(
    "DB_ACERVO_PATH",
    r"C:\Users\simoe\OneDrive\Documentos\t20\T20\DB_Acervo_Completo"
)


def _extract_with_python_pdf(full_path):
    for mod_name in ("pypdf", "PyPDF2"):
        try:
            mod = importlib.import_module(mod_name)
            reader = mod.PdfReader(full_path)
            return [
                {"page": i + 1, "text": p.extract_text() or ""}
                for i, p in enumerate(reader.pages)
            ]
        except ImportError:
            continue
    try:
        fitz = importlib.import_module("fitz")
        doc = fitz.open(full_path)
        return [
            {"page": i + 1, "text": page.get_text("text") or ""}
            for i, page in enumerate(doc)
        ]
    except ImportError:
        return None


def _extract_with_pdftotext(full_path):
    exe = shutil.which("pdftotext")
    if not exe:
        return None
    proc = subprocess.run(
        [exe, "-enc", "UTF-8", full_path, "-"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    )
    raw_pages = proc.stdout.split("\x0c")
    if raw_pages and raw_pages[-1] == "":
        raw_pages.pop()
    return [{"page": i + 1, "text": txt} for i, txt in enumerate(raw_pages)]


def extract_pdf(rel_path):
    full_path = rel_path if os.path.isabs(rel_path) else os.path.join(ACERVO_BASE, rel_path)
    if not os.path.exists(full_path):
        print(f"Erro: arquivo não encontrado: {full_path}", file=sys.stderr)
        sys.exit(1)

    pages = _extract_with_python_pdf(full_path)
    if pages is None:
        pages = _extract_with_pdftotext(full_path)
    if pages is None:
        print("Erro: nenhum extrator PDF disponível (pypdf, PyPDF2, fitz ou pdftotext).", file=sys.stderr)
        sys.exit(1)

    return {
        "file": os.path.basename(full_path),
        "path": full_path,
        "totalPages": len(pages),
        "pages": pages
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/extract-db.py <caminho_relativo_ou_absoluto_do_pdf>")
        sys.exit(0)

    target = sys.argv[1]
    data = extract_pdf(target)
    print(json.dumps(data, ensure_ascii=False, indent=2))

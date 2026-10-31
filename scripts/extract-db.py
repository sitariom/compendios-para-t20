#!/usr/bin/env python3
import json
import os
import sys

import pypdf

ACERVO_BASE = "/home/orange/OneDrive-t20/T20/DB_Acervo_Completo"

def extract_pdf(rel_path):
    full_path = os.path.join(ACERVO_BASE, rel_path) if not rel_path.startswith("/") else rel_path
    if not os.path.exists(full_path):
        print(f"Erro: arquivo não encontrado: {full_path}", file=sys.stderr)
        sys.exit(1)

    reader = pypdf.PdfReader(full_path)
    pages = []
    for i, p in enumerate(reader.pages):
        text = p.extract_text() or ""
        pages.append({"page": i + 1, "text": text})

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

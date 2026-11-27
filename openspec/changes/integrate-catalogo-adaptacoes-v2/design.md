# Design: Catálogo de Adaptações, Packs Hierárquicos e Validação Dual

## 1. Arquitetura do Catálogo (`catalogo/`)

```text
catalogo/
├── CATALOGO.md                       # Índice legível gerado a partir do manifesto
├── catalogo.json                     # Fonte de verdade das publicações/edições e hashes
├── artefatos.json                    # Inventário unitário de todos os documentos (legado + criados)
├── auditoria.jsonl                   # Log append-only de todas as iterações do loop micro/macro
├── plano-migracao.json               # Plano determinístico gerado por migrate-hierarchical-packs.js --dry-run
└── materiais/
    └── <MATERIAL_ID>/                # Ex.: DB-0226..DB-0232, RT20-025..RT20-032, LEGADO-<SLUG>
        ├── extracao.json             # Dados brutos extraídos do PDF com página de origem
        ├── mapa_pdf_artefatos.json   # Rastreabilidade 100% campo PDF -> artefato/campo JSON
        ├── validacao.md              # Evidências DataModel, iterações, auditoria cega e Playwright
        ├── pendencias.md             # Pendências e bloqueios com causa e ação necessária
        └── playwright-evidencias/    # Screenshots e logs JSON da validação em mundo real
```

### Máquina de Estados de Materiais e Artefatos
- **Estados Primários**: `REGISTRADO` → `EXTRAÍDO` → `MONTADO` → `EM_VALIDAÇÃO` → (`REPROVADO` ↺) → `EM_AUDITORIA_CEGA` → `VALIDADO` → `PUBLICADO`.
- **Estados Laterais**:
  - `LEGADO_MANUAL`: conteúdo pré-existente processado manualmente antes do catálogo (permanece intacto nos 6 packs originais até a publicação ser solicitada/reprocessada).
  - `PROCESSADO_VALIDACAO_PENDENTE`: edições criadas pelo agente (`DB-0226..0232`, `RT20-025..028`) antes da formalização da auditoria cega + Playwright.
  - `DESATUALIZADO`: disparado por mudança de hash do PDF, atualização do sistema `Tormenta20`, mudança de spec/template/referência ou reprovação em auditoria/reconciliação.
  - `BLOQUEADO` / `SUBSTITUÍDO`.

## 2. Organização Hierárquica em `module.json` (`packFolders` + Packs por Subtipo)

O Foundry VTT v12–v14 suporta aninhamento de `packFolders` até 3 níveis na barra lateral de Compêndios:

```text
Compêndios para T20 (Sidebar)
├── Acervo Geral / Legado (Pré-Catálogo)
│   ├── Ameacas_T20 (Actor — apenas itens manuais/legados intactos)
│   ├── Itens_T20 (Item — apenas itens manuais/legados intactos)
│   ├── Diarios_T20 (JournalEntry)
│   ├── Tabelas_T20 (RollTable)
│   ├── Macros_T20 (Macro)
│   └── Playlist_T20 (Playlist)
│
├── Revista Tormenta 20                        [Nível 1: Publicação]
│   └── Fúlgor dos Deuses                      [Nível 2: Campanha]
│       ├── Edição 25 — Aventura 1             [Nível 3: Edição]
│       │   ├── rt20-025-ameacas               (Actor)
│       │   └── ... (apenas subtipos presentes)
│       ├── Edição 26 — Forja da Vingança      [Nível 3: Edição]
│       │   ├── rt20-026-ameacas               (Actor)
│       │   ├── rt20-026-equipamentos          (Item: equipamento)
│       │   ├── rt20-026-poderes               (Item: poder)
│       │   ├── rt20-026-diarios               (JournalEntry)
│       │   ├── rt20-026-tabelas               (RollTable)
│       │   └── rt20-026-macros                (Macro)
│       ├── Edição 27 — Dia e Noite
│       └── Edição 28 — Aço e Arcano
│
├── Dragão Brasil                              [Nível 1: Publicação]
│   ├── Edição 226                             [Nível 2: Edição]
│   │   ├── db-0226-ameacas                    (Actor)
│   │   └── db-0226-diarios                    (JournalEntry)
│   ├── Edição 227 .. Edição 232               [Nível 2: Edição]
│
└── <Livro / Publicação Individual>            [Nível 1: Publicação]
    └── <Capítulo / Sessão / Aventura>         [Nível 2: Capítulo/Sessão/Aventura]
        └── liv-<pub>-<cap>-<tipo_ou_subtipo>
```

### Regras de Subtipos de Item e Compêndios Não-Vazios
- Packs de `type: "Item"` são segregados por `doc.type`:
  - `arma` → `*-armas` (`Armas`)
  - `equipamento` → `*-equipamentos` (`Equipamentos`)
  - `consumivel` → `*-consumiveis` (`Consumíveis`)
  - `poder` → `*-poderes` (`Poderes & Parceiros`)
  - `magia` → `*-magias` (`Magias`)
  - `tesouro` → `*-tesouros` (`Tesouros`)
  - `classe` / `race` / `comodo` / `mobilia` → `*-classes`, `*-racas`, `*-bases`
- Somente packs com pelo menos 1 documento na edição são criados e declarados em `module.json`, evitando dezenas de compêndios vazios no Foundry.
- O caminho físico em disco acompanha a hierarquia: `packs/revistas/<publicacao>/<campanha_ou_direto>/<edicao>/<pack-name>/`.

## 3. Estratégia de Migração Retroativa e Reescrita de `@UUID`
1. **Classificação Determinística**:
   - Todo documento nos 6 packs atuais cujo `_id` ou origem script/pasta pertença a `DB #226–#232` ou `Fúlgor #25–#28` recebe `targetPack` (derivado da série, edição e `doc.type`).
   - Todo documento pré-existente sem origem nessas edições é catalogado como `LEGADO_MANUAL` e mantido inalterado no pack original.
2. **Cópia Atômica + Reescrita de `@UUID[...]`**:
   - Ao executar `--apply`, o migrador cria um mapa global `oldUuid -> newUuid` (ex.: `Compendium.compendios-para-t20.Ameacas_T20.Actor.fld28RashidFullg` → `Compendium.compendios-para-t20.rt20-028-ameacas.Actor.fld28RashidFullg`), mantendo os mesmos `_id` de 16 caracteres.
   - Antes de gravar nos novos packs e nos legados, reescreve todas as referências `@UUID[...]` em `Diarios`, `Tabelas` (`documentCollection` + `text`), `Macros`, descrições de `Atores` e `Itens`.
   - Remove as cópias migradas dos 6 packs legados apenas após confirmar integridade nos packs destino (0 duplicatas).
   - Atualiza `module.json` (`packs[]` e `packFolders[]`) mantendo `Ameacas_T20`..`Playlist_T20` no topo sob `Acervo Geral / Legado`.

## 4. Pipeline Dual: DataModels Reais (Micro 1-por-1) + Playwright (Publicação)
1. **Motor `scripts/catalogo-runner.js`**:
   - Carrega schemas reais de `C:\Users\simoe\OneDrive\Documentos\t20\Tormenta20` (`v1.6.7`) e `Tormenta20-master` (`v1.5.015`).
   - Processa **1 artefato por vez**, executando checagens de schema, completude PDF, regras T20 e auditoria cega; registra cada iteração em `catalogo/auditoria.jsonl`.
   - Bloqueia o avanço para o próximo artefato enquanto `divergencias_abertas > 0`.
   - Se a mesma divergência ocorrer **3 vezes**, interrompe correções pontuais, abre tarefa de **causa raiz** (`templates/scripts/OpenSpec/referências`), e marca artefatos irmãos como `DESATUALIZADO`.
2. **Validador Playwright `scripts/validate-foundry-playwright.js`**:
   - Ao encerrar uma publicação, conecta-se via Playwright (`FOUNDRY_URL`, `FOUNDRY_WORLD`, `FOUNDRY_USER`, `FOUNDRY_PASSWORD`) ao Foundry VTT real.
   - Abre uma amostra representativa de Atores (`npc`, `hazard`) e de cada subtipo de Item criado na publicação (`arma`, `equipamento`, `consumivel`, `poder`, `magia`, `tesouro`, `JournalEntry`, `RollTable`, `Macro`).
   - Verifica ausência de erros de console/notificações do Foundry, imagens carregadas, renderização de ficha, execução real de rolagens (ataque, perícia, magia, tabela, macro) e alternância de `ActiveEffect`.
   - Grava relatório JSON e screenshots em `catalogo/materiais/<ID>/playwright-evidencias/`.

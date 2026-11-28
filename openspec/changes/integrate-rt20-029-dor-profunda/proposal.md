# Proposal: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #29 (Dor Profunda)

## Contexto e Motivação
Dando sequência à campanha oficial **Fúlgor dos Deuses** (`Revista Tormenta 20`), a **Edição 29 — *Dor Profunda*** dá continuidade imediata aos eventos de *Aço e Arcano* (`RT20-028`). Os heróis investigam o desaparecimento do deus **Oceano** ao largo de **Salmarina**, enfrentando os desafios submersos do templo oceânico, o **Guardião do Lamento Abissal (ND 9)**, a invocação elemental do **Namasqall Abandonado (ND 9)** pelo **Búzio da Maré Furiosa** e a revelação de **Mynath, o Eco Dourado**, acompanhada do luto por Thalgrimm Sangue de Ferro.

Seguindo a arquitetura v2 (`integrate-catalogo-adaptacoes-v2`), todo o conteúdo de `RT20-029` deve nascer diretamente nos compêndios hierárquicos (`Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 29 — Dor Profunda`), preservando integralmente os 6 packs legados, usando exclusivamente tokens 2-Minute Tabletop, ícones verificados do `Tormenta20`, subdocumentos LevelDB estritos e validação dual (DataModels `v13` + `v14`, Auditoria Cega e Playwright Live).

## Escopo e Limites
- **Inclui**:
  - Ameaças canônicas em `rt20-029-ameacas`: **Guardião do Lamento Abissal (ND 9, Monstro Enorme 3x3)** e **Namasqall Abandonado (ND 9, Espírito Elemental Colossal 4x4)**, além de 2 Perigos/Desafios (`hazard` ND 9): **Viagem ao Fundo do Mar (ND 9)** e **Portal do Templo do Oceano: Respeito das Marés (ND 9)**.
  - Itens & Relíquias em `rt20-029-equipamentos`: **Búzio da Maré Furiosa (Búzio da Maré Eterna)** e **Estilhas Cristalinas de Mynath**.
  - Parceiros em `rt20-029-poderes`: **Parceira: Liriavel Cintilara (Campanha Dor Profunda)** (Ajudante/Destruidora/Magivocadora Veterana + Quimera Combatente Veterana) e **Parceiro: "Thalgrimm" Sangue de Ferro (Médico Veterano)**.
  - Diário oficial em `rt20-029-diarios`: *Fúlgor dos Deuses — Edição 29: Dor Profunda* (7 páginas com links `@UUID` cruzados válidos, incluindo vínculo ao `Pamgra` do acervo base).
  - Tabelas em `rt20-029-tabelas`: *Guardião do Lamento Abissal — Frases de Combate (1d10)*, *Templo do Oceano — Ações de Arena do Guardião (1d4)* e *Mynath, o Eco Dourado — Provocações por Estágio (1d18)*.
  - Macro em `rt20-029-macros`: *Rastreador: Combate contra Mynath & Regras Subaquáticas (Edição 29)* (`DialogV2` com fallback v12 `Dialog`).
  - Atualização de `scripts/catalogo-init.js`, `module.json`, `openspec/specs/fulgor-dos-deuses-campaign/spec.md`, `scripts/validate-fullgor29-compliance.js`, `scripts/validate-threat-sheet-fidelity.js` e `package.json`.
- **Não Inclui**:
  - Recriação duplicada do *Pamgra* (já existente em `Ameacas_T20` `[wLQAgksJliTgw2pm]`, referenciado via `@UUID`).
  - Placeholders visuais genéricos (`mystery-man.svg` proibido).

## Critérios de Sucesso
1. `openspec validate integrate-rt20-029-dor-profunda` e `openspec validate --specs` passam com 0 falhas.
2. `npm run ci:quality` (`avrl`, `audit`, `validate:fidelity`, `validate:fullgor29` e demais suites) conclui com 0 erros.
3. `node scripts/catalogo-runner.js --blind-audit` conclui com `validados` 100% e `bloqueados=0`, `escalonados_3x=0`, rastreabilidade PDF 100%.
4. `npm run validate:playwright -- --material RT20-029` aprova todas as amostras ao vivo no Foundry VTT após release no GitHub.

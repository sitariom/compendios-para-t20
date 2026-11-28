# Proposal: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #30 (Guerra e Paz)

## Contexto e Motivação
Dando sequência à campanha oficial **Fúlgor dos Deuses** (`Revista Tormenta 20`), a **Edição 30 — *Guerra e Paz*** continua diretamente após os acontecimentos de *Dor Profunda* (`RT20-029`). Sem Thalgrimm Sangue de Ferro para guiá-los, os campeões de Arsenal seguem sinais sobrenaturais até o **Santuário do Abraço Final** em Valkaria — o maior culto de **Marah**, Deusa da Paz. Lá, sob proibição estrita de violência, precisam lidar com os guardiões **Elanor Lúmen-Velho (ND 8)** e **Dalíria de Marah (ND 8)**, investigar **Devotos de Marah Fullgori (ND 6)** e enfrentar o padrão espiritual cristalizado **Coral Branco (ND 10)** com perícias alternativas, antes do colapso **O Nada em Expansão** e do retorno espiritual de Thalgrimm (*Alma de Aço*).

Seguindo a arquitetura v2 (`integrate-catalogo-adaptacoes-v2`), todo o conteúdo de `RT20-030` é gravado diretamente nos compêndios hierárquicos (`Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 30 — Guerra e Paz`), preservando os 6 packs legados, usando exclusivamente tokens 2-Minute Tabletop, ícones verificados do `Tormenta20`, subdocumentos LevelDB estritos e validação dual (DataModels `v13` + `v14`, Auditoria Cega e Playwright Live).

## Escopo e Limites
- **Inclui**:
  - Ameaças & NPCs em `rt20-030-ameacas`: **Elanor Lúmen-Velho (ND 8)**, **Dalíria de Marah (ND 8, com 5 magias individuais)**, **Devoto de Marah Fullgori (ND 6)** e **Coral Branco (ND 10, Espírito Colossal 4x4)**, além de 3 Perigos Complexos (`hazard` ND 10): **Vidência de Cinzas (ND 10)**, **Julgamento dos Mansos (ND 10)** e **O Nada em Expansão (ND 10)**.
  - Itens & Recompensas em `rt20-030-equipamentos`: **Estilhas Cristalinas do Fullgor (Edição 30)**.
  - Poderes, Parceiros & Bênçãos em `rt20-030-poderes`: **Parceiro: Elanor Lúmen-Velho (Veterano Especial)**, **Parceira: Dalíria de Marah (Veterana Especial)** (com `ActiveEffect` +3 Defesa/Resistências), **Favor da Dama Branca (Santuário de Marah)**, **Favor da Donzela Deslumbrante (Santuário de Marah)** e **Sentença de Valkaria: Favor de Arsenal / Favor de Marah**.
  - Diário oficial em `rt20-030-diarios`: *Fúlgor dos Deuses — Edição 30: Guerra e Paz* (7 páginas com links `@UUID` cruzados válidos).
  - Tabelas em `rt20-030-tabelas`: *Devotos Fullgori — Frases em Combate (1d10)*, *Coral Branco — Frases em Combate (1d10)* e *A Presença — Eventos Espirituais de Thalgrimm (1d4)*.
  - Macro em `rt20-030-macros`: *Rastreador: Prova das Mãos Vazias, Coral Branco & Sentença (Edição 30)* (`DialogV2` com fallback v12 `Dialog`).
  - Atualização de `scripts/catalogo-init.js`, `scripts/create-entry.js` (`EQUIPMENT_CATALOG`), `scripts/avrl-runner.js`, `scripts/validate-threat-sheet-fidelity.js`, `module.json`, `package.json` e `openspec/specs/fulgor-dos-deuses-campaign/spec.md`.
- **Não Inclui**:
  - Placeholders visuais genéricos (`mystery-man.svg` proibido).

## Critérios de Sucesso
1. `openspec validate integrate-rt20-030-guerra-e-paz` e `openspec validate --specs` passam com 0 falhas.
2. `npm run ci:quality` (`avrl`, `audit`, `validate:fidelity`, `validate:fullgor30` e demais suites) conclui com 0 erros.
3. `node scripts/catalogo-runner.js --material RT20-030 --blind-audit` conclui com `validados` 100%, `bloqueados=0`, `escalonados_3x=0`, rastreabilidade PDF 100%.
4. `npm run validate:playwright -- --material RT20-030` aprova todas as amostras ao vivo no Foundry VTT após release (ou registra pendência explícita caso o servidor remoto não tenha sido atualizado ainda).

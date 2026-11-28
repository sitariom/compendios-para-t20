# Proposal: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #32 (Como um Deus)

## Contexto e Motivação
Dando sequência à campanha **Fúlgor dos Deuses** (`Revista Tormenta 20`), a **Edição 32 — *Como um Deus*** continua após *Pecados do Pai* (`RT20-031`). Enviados por Arsenal à cidade próspera de **Santa Graça**, os campeões (12º nível) recebem a missão de destruir **Eucharion, o Deus Menor da Gratidão**, integralmente tomado pelo Fullgor, enfrentando a **Turba Enfurecida (ND 10)**, os **Vigias da Devolução (ND 7)**, a campeã élfica **Lysenne de Eucharion (ND 10)** e o coração cristalino **Eucharion do Fullgor (ND 13)**.

## Escopo e Limites
- **Inclui**:
  - Ameaças & Perigos em `rt20-032-ameacas`: **Turba Enfurecida (ND 10, Colossal 4x4)**, **Vigia da Devolução (ND 7)**, **Lysenne de Eucharion (ND 10)** e **Eucharion do Fullgor (ND 13, Colossal 4x4 com 8 magias)**, além de 2 Perigos Complexos (`Graças Recebidas ND 12`, `Turbulência em Santa Graça ND 12`).
  - Equipamentos & Poderes/Parceiros em `rt20-032-equipamentos` e `rt20-032-poderes`: **Pingente da Gratidão Pura (Artefato de Eucharion)**, **Estilhas Cristalinas do Fullgor (Edição 32)**, **Dívida Sagrada (Poder Concedido — Eucharion)** e **Parceira: Lysenne de Eucharion (Guardiã Mestre & Combatente Veterana)**.
  - Diário em `rt20-032-diarios`: *Fúlgor dos Deuses — Edição 32: Como um Deus* (7 páginas com `@UUID`s).
  - Tabelas em `rt20-032-tabelas`: *Turba Enfurecida — Frases em Combate (1d10)*, *Lysenne de Eucharion — Frases em Combate (1d10)* e *Eucharion — Frases em Combate (1d10)*.
  - Macro em `rt20-032-macros`: *Rastreador: Dispersar Turba, Procissão da Dívida & Gratidão Final (Edição 32)*.
- **Não Inclui**:
  - Placeholders visuais (`mystery-man.svg` proibido).

## Critérios de Sucesso
1. `openspec validate integrate-rt20-032-como-um-deus` e `openspec validate --specs` passam com 0 falhas.
2. `npm run ci:quality` (`avrl`, `audit`, `validate:fidelity`, `validate:fullgor32`) conclui com 0 erros.
3. `node scripts/catalogo-runner.js --material RT20-032 --blind-audit` conclui com `validados` 100%, `bloqueados=0`, `escalonados_3x=0`, rastreabilidade PDF 100%.

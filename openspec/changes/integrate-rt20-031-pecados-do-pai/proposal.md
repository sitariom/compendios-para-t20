# Proposal: Integração Canônica de Revista Tormenta 20 — Fúlgor dos Deuses #31 (Pecados do Pai)

## Contexto e Motivação
Dando sequência à campanha **Fúlgor dos Deuses** (`Revista Tormenta 20`), a **Edição 31 — *Pecados do Pai*** prossegue logo após *Guerra e Paz* (`RT20-030`). Alertados pelo fantasma de Thalgrimm Sangue de Ferro, os campeões seguem até a Floresta Greenleaf para proteger **Lisandra de Allihanna** — filha de Arsenal e sumo-sacerdotisa da Deusa da Natureza — contra os emissários do Fullgor (**Isco do Fullgor**, **Enxame Fullgori**, **Jardineiro Dourado**) e impedir que a própria **Lisandra Deturpada (ND 13)** sucumba ao controle dourado.

## Escopo e Limites
- **Inclui**:
  - Ameaças & Perigos em `rt20-031-ameacas`: **Isco do Fullgor (ND 11, Grande 2x2)**, **Jardineiro Dourado (ND 11, com 6 magias simuladas)** e **Lisandra Deturpada (ND 13, com 5 magias)**, além de 5 Perigos Complexos (`Rastros da Caça ND 11`, `Natureza Deturpada ND 11`, `Enxame Fullgori ND 9`, `Santuário em Sofrimento ND 11`, `Correntes Invisíveis ND 11`).
  - Equipamentos & Poderes/Parceiros em `rt20-031-equipamentos` e `rt20-031-poderes`: **Estilhas Cristalinas do Fullgor (Edição 31)**, **Parceira: Lisandra de Allihanna (Gratidão Plena — Mestre Tripla)** e **Vínculo de Greenleaf: Bênção de Lisandra**.
  - Diário oficial em `rt20-031-diarios`: *Fúlgor dos Deuses — Edição 31: Pecados do Pai* (7 páginas com `@UUID`s).
  - Tabelas em `rt20-031-tabelas`: *Lisandra Deturpada — Frases de Combate (1d10)*, *O Peso da Presença — Resultados (1d4)* e *Gratidão de Allihanna — Recompensas por Deturpação (1d4)*.
  - Macro em `rt20-031-macros`: *Rastreador: Pontos de Deturpação & Casulos de Lisandra (Edição 31)*.
- **Não Inclui**:
  - Placeholders visuais (`mystery-man.svg` proibido).

## Critérios de Sucesso
1. `openspec validate integrate-rt20-031-pecados-do-pai` e `openspec validate --specs` passam com 0 falhas.
2. `npm run ci:quality` (`avrl`, `audit`, `validate:fidelity`, `validate:fullgor31`) conclui com 0 erros.
3. `node scripts/catalogo-runner.js --material RT20-031 --blind-audit` conclui com `validados` 100%, `bloqueados=0`, `escalonados_3x=0`, rastreabilidade PDF 100%.

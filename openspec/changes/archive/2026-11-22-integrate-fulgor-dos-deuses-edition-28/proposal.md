# Proposal: Integração Canônica de Fúlgor dos Deuses — Edição 28 (Aço e Arcano)

## Why
Dando continuidade à adaptação integral da campanha oficial **Fúlgor dos Deuses** (Revista Tormenta20, Jambô Editora), a **Edição 28 ("Aço e Arcano")** conduz os campeões de Arsenal infiltrados na **Academia Arcana** para enfrentar uma ameaça inédita: **Rashid**, o antigo kemooz (gênio da terra) arquiteto e zelador do campus, foi contaminado pelo Fullgor e ameaça atingir a própria Deusa da Magia, **Wynna**.

## What Changes
1. **Ameaças e NPCs (`packs/Ameacas_T20`)**:
   - Inclusão e calibração canônica de 2 ameaças em `Fullgor dos Deuses` (`n591wfGB7keSNe7I`):
     - `Liriavel, Forma de Quimera` (ND 8, Espírito Grande 2x2, Defesa 33 com base 30, PV 333, Duas Mordidas +26, Marrada +26, Duas Garras +24, Mente Tripla, Cabeça de Bode CD 26, Cabeça de Dragão 10d6+20 fogo cone 6m CD 26, Cabeça de Leão agarrar +28).
     - `Rashid, Fullgori` (ND 7, Espírito Fullgori Grande 2x2, Defesa 34 com base 33, PV 280, PM 57, deslocamento 9m / escavação 9m / voo 12m, imunidade a encantamento e ácido, RD 10, Pancada x2 +24 [2d8+20 + 2d8 ácido], Teofagia, Imunidades Fullgori, Criatura do Fullgor, Contramágica Aprimorada, Magia Acelerada, Zelador da Academia Arcana, e 4 magias individuais com CD 30: *Amarras Etéreas*, *Controlar Terra*, *Dissipar Magia*, *Jato Corrosivo*).
   - Perigo Ambiental / Cenário: `Templo do Saber em Mutação` (`hazard` ND 8) cobrindo os Elementos de Cenário da batalha final.
   - Tokens 2-Minute Tabletop em `assets/tokens/` (`liriavel-forma-de-quimera.png`, `rashid-fullgori.png`) e registro em `TOKEN_2MTT_MAP`.
2. **Itens, Parceiros e Recompensas (`packs/Itens_T20`)**:
   - `Parceiro: Liriavel Cintilara` (Ajudante Mestre: +4 em Conhecimento, Diplomacia e Misticismo via `BaseEffect`).
   - `Parceiro: Suporte Arcano da Academia (Vladislav Tpish)` (Adepto/Destruidor/Magivocador Mestre concedido até o fim da aventura).
   - `Chave Antiga do Portal da Academia Arcana`, `Matrícula Forjada da Academia Arcana`, `Gema do Renascimento de Rashid (Bênção de Wynna)` e `Desejo de Wynna`.
3. **Diários (`packs/Diarios_T20`)**:
   - Diário completo `Fúlgor dos Deuses — Edição 28: Aço e Arcano` com 7 páginas estruturadas sob `!journal.pages!` (`ownership.default: -1`).
4. **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
   - `Ruas que Respiram — Eventos Aleatórios (Edição 28)` (1d6)
   - `Frases de Combate de Rashid Fullgori (Edição 28)` (1d10)
   - `Frases de Combate no Templo do Saber (Edição 28)` (1d8)
5. **Macros (`packs/Macros_T20`)**:
   - `Rastreador de Urgência & Eventos do Campus (Edição 28)` para controle interativo do Contador de Urgência e rolagem de eventos do campus/templo.
6. **Qualidade e Loop AVRL**:
   - Script `scripts/inject-fullgor28.js` e suíte dedicada `scripts/validate-fullgor28-compliance.js` + inclusão no `validate-threat-sheet-fidelity.js` e `package.json`.

# Design: Arquitetura Canônica da Adaptação de Fúlgor dos Deuses — Edição 27

## 1. Contexto e Objetivos Arquiteturais
A Edição 27 ("Dia e Noite") aborda o confronto entre a luz solar de Azgher e as trevas fétidas de Tenebra, introduzindo:
- A duplicidade da guerreira suraggel Cassiella (versão semi-fullgori aliada/oponente temporária e versão fullgori total com asas, azagaias de luz e teofagia).
- O clérigo de Tenebra Urrash das Sombras Frias com conjuração divina de 5º nível (6 magias individuais).
- Monstros trogs (Enxame Trog Enorme, Troggore Médio e Bando Troggore Grande).
- O artefato maior Orbe de Azgher com efeitos ativos e canalização solar.

## 2. Decisões de Modelagem por Compêndio

### 2.1 Ameaças (`packs/Ameacas_T20`)
- **Pasta**: `Fullgor dos Deuses` (`n591wfGB7keSNe7I`).
- **Defesa Base Dinâmica**:
  - `Cassiella semi-fullgori`: 31 - 1 = 30.
  - `Cassiella fullgori`: 33 - 2 = 31.
  - `Enxame Trog`: 23 - 1 = 22.
  - `Troggore`: 22 - 2 = 20.
  - `Bando Troggore`: 22 - 2 = 20.
  - `Urrash das Sombras Frias`: 23 - 1 = 22.
- **Tokens 2-Minute Tabletop**:
  - Extraídos das artes oficiais e gerados em 512x512 com transparência circular e proporções corretas (1x1 para médios, 2x2 para bando/grande, 3x3 para enxame enorme).
- **Magias e Subdocumentos**:
  - As 6 magias de Urrash serão modeladas como itens de tipo `magia` sob `!actors.items!${actorId}.${spellId}` com CD 22.

### 2.2 Itens e Relíquias (`packs/Itens_T20`)
- **Pasta**: `Fullgor dos Deuses` (`fldItensFolder26`).
- **Orbe de Azgher**: Item de tipo `equipamento` com propriedades de artefato e `ActiveEffect` de emanação de luz.
- **Parceiro: Cassiella de Baldonn**: Item de tipo `poder` com `system.subtipo: "parceiro"` e `ActiveEffect` de +3 em ataque.

### 2.3 Diários (`packs/Diarios_T20`)
- **Pasta**: `Fullgor dos Deuses` (`fldDiariosFold26`).
- **Diário**: `Fúlgor dos Deuses — Edição 27: Dia e Noite` com 6 páginas subdocumentos sob `!journal.pages!` (`ownership.default: -1`).

### 2.4 Tabelas de Rolagem (`packs/Tabelas_T20`)
- **Pasta**: `Fullgor dos Deuses` (`fldTabelasFold26`).
- 3 tabelas com resultados estruturados em `!tables.results!`.

### 2.5 Macros (`packs/Macros_T20`)
- **Pasta**: `Fullgor dos Deuses` (`fldMacrosFolder26`).
- Macro `Canalizar Orbe de Azgher (Fúlgor dos Deuses)`.

## 3. Pipeline de Qualidade e Convergência AVRL
- Script injetor `scripts/inject-fullgor27.js` utilizando os hooks de ciclo de vida pré-persistência.
- Suíte `scripts/validate-fullgor27-compliance.js` com centenas de verificações granulares.
- Inclusão dos atores no validador universal `scripts/validate-threat-sheet-fidelity.js`.
- Execução do `npm run ci:quality` até convergência absoluta (0 erros, 0 correções pendentes).

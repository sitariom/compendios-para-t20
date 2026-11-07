# Design: Integração Canônica da Dragão Brasil #229

## Context & Objectives
A Dragão Brasil #229 introduz a aventura oficial *O Olho do Basilisco* (4 ameaças de 8º e 9º nível, 3 parceiros e 5 itens/venenos) e a prévia do romance *Os Cães das Colinas* (5 parceiros especiais com progressão Iniciante, Veterano e Mestre). O objetivo deste design é estabelecer a arquitetura formal, contratos de dados e estratégia de testes para assegurar 100% de conformidade com os compêndios do sistema Tormenta20 para Foundry VTT v12/v13.

## Architectural Decisions

### 1. Arquitetura Canônica de Subdocumentos no ClassicLevel
- **Ameaças (`Ameacas_T20`)**:
  - `actorDoc.items`: Array de string IDs dos subdocumentos (`["itemId1", "itemId2", ...]`).
  - Chaves de subdocumentos: `!actors.items!${actorId}.${itemId}` contendo o documento do item completo (ataques como armas e poderes como itens de poder).
  - Subdocumentos de efeitos de itens do ator: `!actors.items.effects!${actorId}.${itemId}.${effId}`.
- **Itens e Parceiros (`Itens_T20`)**:
  - `itemDoc.effects`: Array de string IDs dos efeitos (`["effId1", "effId2", ...]`).
  - Chaves de efeitos no banco: `!items.effects!${itemId}.${effId}` com schema `BaseEffect` (`type: "base"`, `system: {}`, `changes: [...]`, `transfer: true`, `flags.tormenta20`).

### 2. Diretriz Canônica de Parceiros
- Todo Parceiro, Familiar ou Montaria é criado **estritamente como um item do tipo `poder` com `system.subtipo: "parceiro"`** dentro da pasta canônica *Parceiros* (`0uRx5Efj3tk7P5Xr`) em `Itens_T20`.
- Nenhum parceiro deve ser instanciado como ator em `Ameacas_T20`.

### 3. Fórmulas Matemáticas & Atributos
- **Defesa Base Dinâmica**: `defesa.base = defesa.value - des` (garante que a fórmula `@defesa.base + @des` no Foundry VTT resulte exatamente no valor canônico da ficha).
- **Perícias (34 no total)**: Calculadas via `buildSkills(ndNum, atributos, trainedSkills)` onde `val = fichaVal - meionivel - atrMod - treino`.
- **Traços de Resistência**: 13 tipos de dano mapeados em `system.tracos.resistencias` com `{ value, base, bonus: [], excecao: 0, imunidade, vulnerabilidade, danoPorDado: false }`.

### 4. Apresentação Visual e Fidelidade Textual
- **Ameaças**: Duas citações em `blockquote` (borda `#800000` para a criatura/vítima e borda `#006400` para a nota de campo do escriba goblin *Grunk Ferroforja*) seguidas do parágrafo de apresentação descritiva em fonte Arial destacando o nome da criatura em negrito e vermelho.
- **Itens e Poderes**: Texto verbatim dos PDFs oficiais em `system.description.value`, com `system.chatFlavor` limpo.
- **Tokens de Atores**: Textura exclusivamente do acervo top-down transparente de alta resolução do **2-Minute Tabletop** (`assets/tokens/*.png`).

### 5. Persistência Dupla
- Todas as entidades são gravadas no banco de dados binário LevelDB (`packs/`) e sincronizadas na árvore de arquivos JSON legíveis (`src/packs/`).

## Verification & Audit Strategy
- `scripts/validate-db229-compliance.js`: Testes unitários para validar:
  1. Presença e integridade das 4 ameaças (Defesa, 34 perícias, tokens 2MTT, pasta `wfWApuyngzFm4KOP`, itens embutidos).
  2. Presença e integridade dos 8 parceiros na pasta `0uRx5Efj3tk7P5Xr` com ActiveEffects canônicos.
  3. Presença dos 5 itens de aventura em suas pastas corretas.
  4. Inexistência de parceiros como atores em `Ameacas_T20`.
- `npm run stats` e `npm run audit`: Garantir 0 erros de JSON, 0 IDs faltantes e 0 pastas órfãs em mais de 43.300 registros.

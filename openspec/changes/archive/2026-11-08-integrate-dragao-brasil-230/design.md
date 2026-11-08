# Design: Arquitetura Técnica da Integração Dragão Brasil #230

## Context & Constraints
A edição Dragão Brasil #230 introduz um vasto leque de 14 ameaças (ND 2 a ND 18), incluindo os construtos biomecânicos e oníricos do Reino dos Pesadelos criados por Rafael Dei Svaldi, além dos antagonistas da aventura Corrida Brutal em Tyrondir por Daniel Duran.
O design deve respeitar a compatibilidade com o sistema Tormenta20 v1.5.015 no Foundry VTT v12 e as regras canônicas refinadas no ciclo de vida do projeto `compendios-para-t20`.

## Architectural Decisions

### 1. Modelagem de Atores (`Ameacas_T20`)
- **Folder**: Pasta `Dragão Brasil` (ID canônico `wfWApuyngzFm4KOP`).
- **34 Perícias**: Todas as 34 perícias canônicas de T20 devem ser computadas com valor numérico explícito (`value: 0`, treino `trained: true/false`, bônus calculados).
- **Subdocumentos de Ataques**: Armas e habilidades com dano devem ser registradas tanto na lista `actor.items` (array de IDs) quanto sob as chaves `!actors.items!actorId.itemId`, contendo o objeto completo com `system.rolls` e `parts: [[dado, tipo]]`.
- **Biografias**: Formatação com citação dupla `"..."` em itálico de abertura (voz da criatura ou testemunho de aventureiro) seguida de contextualização lore canônica em HTML.
- **Tokens 2MTT**: Cada ator receberá um token individual de arte top-down 2-Minute Tabletop renderizado em PNG em `assets/tokens/`.

### 2. Modelagem de Itens e Parceiros (`Itens_T20`)
- **Parceiros como Poderes**: *Parceira: Rotsheel* é modelada como `type: "poder"`, `system.tipo: "parceiro"`, `system.subtipo: "combatente"`, contendo subdocumentos de efeitos ativos em `!items.effects!itemId.effId` com modificadores mecânicos (+2 em testes de ataque e margem de ameaça expandida).
- **Idempotência**: Todos os IDs gerados para itens e poderes serão estáticos via dicionário determinístico `DB230_ID_MAP` em `scripts/inject-db230-items.js`.

### 3. Modelagem de Diários e Tabelas de Rolagem (`Diarios_T20` e `Tabelas_T20`)
- **Conformidade com Hotfix v1.6.2**:
  - `JournalEntry.pages`: Array de string IDs simples. Subdocumentos armazenados em `!journal.pages!journalId.pageId`.
  - `RollTable.results`: Array de string IDs simples. Subdocumentos armazenados em `!tables.results!tableId.resultId`, com `type: "text"` e campos `description`.

### 4. Validação Contínua
- Criação de `scripts/validate-db230-compliance.js` cobrindo 100% dos requisitos em fases automatizadas.

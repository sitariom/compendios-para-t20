# Design: Arquitetura Canônica da Adaptação de Fúlgor dos Deuses — Edição 26

## 1. Contexto e Objetivos Arquiteturais
A Edição 26 de Fúlgor dos Deuses ("Forja da Vingança") marca a introdução da mecânica de itens que evoluem consumindo estilhas fullgori (Aço Sillariano) e o confronto com os primeiros fullgori abissais sob Valkaria.
A adaptação deve garantir que:
- Todos os 6 atores reflitam 100% de precisão em relação ao bloco impresso da Revista Tormenta20 #26.
- Os tokens sejam 100% aderentes à regra arquitetural de tokens circulares transparentes 2-Minute Tabletop.
- As mecânicas de Aço Sillariano sejam representadas tanto como itens/poderes no compêndio de Itens quanto em Diários com o texto integral e em uma Macro interativa no compêndio de Macros.
- A persistência no ClassicLevel siga estritamente a hierarquia de namespaces e subdocumentos (`!actors.items!`, `!actors.items.effects!`, `!journal.pages!`, `!tables.results!`).

## 2. Decisões de Design por Compêndio

### 2.1 Ameaças (`packs/Ameacas_T20`)
- **Pasta**: `Fullgor dos Deuses` (`n591wfGB7keSNe7I`).
- **DataModel Tormenta20**:
  - Defesa Base: `defesa.base = valor_ficha - destreza` (evitando duplicação de Destreza no `prepareDefense`).
  - Perícias: 34 perícias com `value = fichaVal` e `outros = diferenca`. Perícias não listadas com `treinado: false`.
  - Resistências: `system.detalhes.resistencias` preenchido verbatim integralmente para renderização no topo da ficha, acompanhado das flags booleanas em `system.tracos.resistencias` e `system.tracos.ic`.
  - Propósito de Armas: Corpo a corpo recebe `corpo-a-corpo`; armas à distância recebem `disparo` ou `arremesso` com `alcance` preenchido.
  - Magias: Instanciadas como itens individuais do tipo `magia` sob subdocumentos `!actors.items!`.
  - Desagregação Atômica: Cada habilidade em negrito da publicação é um item independente.

### 2.2 Itens (`packs/Itens_T20`)
- **Pasta**: `Fullgor dos Deuses` (ID a ser gerado de 16 caracteres alfanuméricos com `type: "Item"` e `folder: null`).
- **Aço Sillariano**:
  - Modelado como item do tipo `equipamento` (material especial / aprimoramento) detalhando a regra de combinação de qualidades antidivinas.
  - 11 Qualidades Antidivinas modeladas como itens do tipo `poder` com `system.subtipo: "geral"` e `ActiveEffects` estruturados quando conferem bônus mecânicos diretos (ex: Defesa Antidivina, Mente Antidivina, Resistência Antidivina).
  - *Alma da Bigorna*: Modelada como item do tipo `equipamento` (ferramenta/artefato sagrado de ferreiro com propriedades sagradas).
  - Parceiros: Modelados como itens de tipo `poder` com `system.subtipo: "parceiro"`.

### 2.3 Diários (`packs/Diarios_T20`)
- **Pasta**: `Fullgor dos Deuses` (ID de 16 caracteres alfanuméricos).
- **Diário**: `Fúlgor dos Deuses — Edição 26: Forja da Vingança`
- **Páginas**: 7 páginas armazenadas em subdocumentos `!journal.pages!${journalId}.${pageId}` com formatação HTML semântica e citações estilizadas.

### 2.4 Tabelas de Rolagem (`packs/Tabelas_T20`)
- **Pasta**: `Fullgor dos Deuses` (ID de 16 caracteres alfanuméricos).
- **Tabelas**: 3 tabelas armazenadas com resultados atômicos em `!tables.results!${tableId}.${resultId}` com campo `name` obrigatório.

### 2.5 Macros (`packs/Macros_T20`)
- **Pasta**: `Fullgor dos Deuses` (ou `Macros T20`).
- **Macro**: `Forjar Aço Sillariano (Fúlgor dos Deuses)` — Script Foundry VTT que permite selecionar qualidades antidivinas com base na quantidade de estilhas do grupo e emitir cartão informativo no chat.

## 3. Estratégia de Implementação e Verificação
- Criar script injetor/atualizador `scripts/inject-fullgor26.js` para realizar as operações de forma atômica e idempotente no ClassicLevel.
- Criar suíte de validação dedicada `scripts/validate-fullgor26-compliance.js` com asserções minuciosas para cada entidade criada ou saneada.
- Executar `npm run audit`, `npm run validate:fidelity` e `node scripts/validate-fullgor26-compliance.js`.
- Atualizar `src/packs/` via desempacotamento ou espelhamento.
- Sincronizar o CodeGraph (`codegraph sync`).

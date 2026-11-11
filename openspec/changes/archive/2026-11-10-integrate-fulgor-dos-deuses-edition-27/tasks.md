# Tasks: Adaptação Canônica de Fúlgor dos Deuses — Edição 27

- [x] 1. Infraestrutura e Preparação
  - [x] 1.1 Gerar tokens circulares 2-Minute Tabletop transparentes de 512x512 para Cassiella semi-fullgori, Cassiella fullgori, Enxame Trog, Troggore, Bando Troggore e Urrash das Sombras Frias
  - [x] 1.2 Mapear ícones canônicos do sistema Tormenta20 para itens, magias e relíquias

- [x] 2. Especificação OpenSpec (SDD)
  - [x] 2.1 Criar a delta spec `specs/fulgor-dos-deuses-campaign/spec.md` com `## ADDED Requirements`
  - [x] 2.2 Validar todas as especificações com `npx openspec validate --changes` e `npx openspec validate --specs`

- [x] 3. Desenvolvimento do Script Injetor `scripts/inject-fullgor27.js`
  - [x] 3.1 Implementar injeção dos 6 atores com defesas base dinâmicas, 34 perícias, magias de Urrash, habilidades atômicas e tokens 2MTT
  - [x] 3.2 Implementar injeção da Orbe de Azgher, parceira Cassiella de Baldonn e equipamentos com ActiveEffects
  - [x] 3.3 Implementar injeção do Diário da Edição 27 com 6 páginas estruturadas sob `!journal.pages!`
  - [x] 3.4 Implementar injeção das 3 Tabelas de Rolagem com subdocumentos sob `!tables.results!`
  - [x] 3.5 Implementar injeção da Macro de canalização da Orbe de Azgher

- [x] 4. Desenvolvimento da Suíte de Validação `scripts/validate-fullgor27-compliance.js`
  - [x] 4.1 Implementar asserções de conformidade de todos os atores, itens, diários, tabelas e macros da Edição 27
  - [x] 4.2 Integrar os atores da Edição 27 no validador universal `scripts/validate-threat-sheet-fidelity.js`

- [x] 5. Execução do Loop AVRL e Finalização
  - [x] 5.1 Executar injeção em `packs/` e espelhamento em `src/packs/`
  - [x] 5.2 Executar `npm run avrl` e certificar convergência de 100%
  - [x] 5.3 Executar `npm run ci:quality`
  - [x] 5.4 Sincronizar CodeGraph (`npx codegraph sync`)

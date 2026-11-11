# Tasks: Adaptação Canônica de Fúlgor dos Deuses — Edição 26

- [x] 1. Infraestrutura e Preparação
  - [x] 1.1 Mapear tokens circulares 2-Minute Tabletop adequados em `assets/tokens/` para Asmithar, Xellmaras, Gangue, Sacerdote, Tigre e Aço Selvagem
  - [x] 1.2 Mapear ícones canônicos do sistema Tormenta20 e Game-Icons para armas, itens, poderes, diários e tabelas

- [x] 2. Especificação OpenSpec (SDD)
  - [x] 2.1 Criar a living specification `openspec/specs/fulgor-dos-deuses-campaign/spec.md`
  - [x] 2.2 Validar todas as especificações com `npx openspec validate --specs`

- [x] 3. Desenvolvimento do Script Injetor `scripts/inject-fullgor26.js`
  - [x] 3.1 Implementar criação/sincronização das pastas `Fullgor dos Deuses` em todos os compêndios
  - [x] 3.2 Implementar saneamento dos 6 atores (NDs corretos, defesa base dinâmica, 34 perícias calibradas, armas com propósito canônico, magias individuais, habilidades atômicas, biografia Grunk e tokens 2MTT)
  - [x] 3.3 Implementar injeção dos 16 itens (Aço Sillariano, 11 qualidades antidivinas, Alma da Bigorna, Teofagia, Imunidades, Parceiros)
  - [x] 3.4 Implementar injeção do Diário da Edição 26 com 7 páginas estruturadas em subdocumentos
  - [x] 3.5 Implementar injeção das 3 Tabelas de Rolagem com subdocumentos de resultados
  - [x] 3.6 Implementar injeção da Macro interativa de Forja de Aço Sillariano

- [x] 4. Desenvolvimento da Suíte de Validação `scripts/validate-fullgor26-compliance.js`
  - [x] 4.1 Implementar checagens de schema e conformidade para todos os atores, itens, diários, tabelas e macros da Edição 26
  - [x] 4.2 Validar conformidade de 100% de asserções contra o statblock do PDF

- [x] 5. Execução do Loop AVRL e Finalização
  - [x] 5.1 Executar injeção em `packs/`
  - [x] 5.2 Executar `npm run audit` e verificar 0 erros
  - [x] 5.3 Executar `npm run validate:fidelity` e verificar 100% de sucesso
  - [x] 5.4 Executar `node scripts/validate-fullgor26-compliance.js` e verificar 100% de sucesso
  - [x] 5.5 Espelhar documentos em `src/packs/`
  - [x] 5.6 Sincronizar CodeGraph (`npx codegraph sync`)

# Tasks: Adaptação Canônica de Fúlgor dos Deuses — Edição 28

- [x] 1. Infraestrutura e Assets Visuais
  - [x] 1.1 Baixar tokens transparentes 2-Minute Tabletop para `assets/tokens/liriavel-forma-de-quimera.png` e `assets/tokens/rashid-fullgori.png`
  - [x] 1.2 Atualizar `TOKEN_2MTT_MAP` e `T20_ICONS_DIR` (suporte dual Linux/Windows) em `scripts/icon-resolver.js`

- [x] 2. Especificação OpenSpec (SDD)
  - [x] 2.1 Validar change `integrate-fulgor-dos-deuses-edition-28` com `openspec validate --changes`

- [x] 3. Implementação do Injetor `scripts/inject-fullgor28.js`
  - [x] 3.1 Implementar injeção das ameaças `Liriavel, Forma de Quimera`, `Rashid, Fullgori` e perigo `Templo do Saber em Mutação`
  - [x] 3.2 Implementar injeção dos itens/parceiros (`Parceiro: Liriavel Cintilara`, `Parceiro: Suporte Arcano da Academia`, `Chave Antiga do Portal da Academia Arcana`, `Matrícula Forjada da Academia Arcana`, `Gema do Renascimento de Rashid`, `Desejo de Wynna`)
  - [x] 3.3 Implementar injeção do Diário (7 páginas), 3 Tabelas de Rolagem e Macro do Contador de Urgência

- [x] 4. Validação e Integração AVRL
  - [x] 4.1 Registrar `fld28LiriavelQui` e `fld28RashidFullg` em `STRICT_ACTOR_IDS` e `MONITORED_CDS` (`scripts/avrl-runner.js`)
  - [x] 4.2 Criar `scripts/validate-fullgor28-compliance.js` e adicionar `validate:fullgor28` em `package.json` (`validate:all`)
  - [x] 4.3 Integrar atores da Edição 28 em `scripts/validate-threat-sheet-fidelity.js`
  - [x] 4.4 Executar `npm run ci:quality`, `npm run unpack -- --all` (packs modificados), arquivar change OpenSpec e rodar `codegraph index`

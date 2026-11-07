# Tasks: Integração Canônica da Dragão Brasil #229

## 1. Mapeamento de Assets e Resolução de Ícones
- [ ] 1.1 Baixar e verificar os 4 tokens 2MTT em `assets/tokens/` (*defensor-rochoso-desperto.png*, *revoada-de-serpes.png*, *presa-do-grande-basilisco.png*, *basilisco-ancestral.png*)
- [ ] 1.2 Atualizar `scripts/icon-resolver.js` registrando os tokens em `TOKEN_2MTT_MAP` e os ícones canônicos em `THREAT_MAP` e `ITEM_AND_POWER_MAP`

## 2. Implementação e Injeção de Ameaças (`Ameacas_T20`)
- [ ] 2.1 Criar `scripts/inject-db229-threats.js` definindo os 4 statblocks com fórmulas completas:
  - Defensor Rochoso Desperto (ND 8) com Pancadas +26, Imobilidade, Natureza Abascanta e Pancada Atordoante
  - Revoada de Serpes (ND 8) com Mordida +26, Ferrão +26, Agarrar Aprimorado (+31) e Peçonha Concentrada (CD 26)
  - Presa do Grande Basilisco (ND 3) com Machado de Batalha +10, Ódio Sórdido, Vitalidade Peçonhenta e Peçonha Concentrada (CD 19)
  - Basilisco Ancestral (ND 9) com Mordida +27, Olhar Petrificante (CD 28), Sopro 3d12 (CD 28) e Peçonha Potente (CD 28)
- [ ] 2.2 Configurar biografias com padrão de citações duplas (`#800000` / `#006400`) e apresentação descritiva em fonte Arial
- [ ] 2.3 Executar `scripts/inject-db229-threats.js` gravando em `packs/Ameacas_T20` e `src/packs/Ameacas_T20/`

## 3. Implementação e Injeção de Itens e Parceiros (`Itens_T20`)
- [ ] 3.1 Criar `scripts/inject-db229-items.js` definindo os 8 parceiros e 5 itens/consumíveis:
  - 5 Parceiros de Cães das Colinas: Arius, Ayla, Ignis, Kiki, Rexthor (com ActiveEffects para Iniciante, Veterano e Mestre)
  - 3 Parceiros de O Olho do Basilisco: Defensor Rochoso Desperto (Guardião), Kemooz Pensativo (Gênio da Terra), Filhote de Grifo (Montaria)
  - 5 Itens/Venenos: Olho de Basilisco Ancestral, Couro de Basilisco Ancestral, Peçonha Concentrada, Peçonha Potente, Machado de Batalha do Culto
- [ ] 3.2 Impor arquitetura de subdocumentos ClassicLevel (`effects: [effId]` no item pai e subdocs sob `!items.effects!itemId.effId`)
- [ ] 3.3 Executar `scripts/inject-db229-items.js` gravando em `packs/Itens_T20` e `src/packs/Itens_T20/`

## 4. Implementação de Diários e Tabelas de Rolagem
- [ ] 4.1 Criar e executar `scripts/inject-db229-journals.js` para *O Olho do Basilisco* e *Os Cães das Colinas*
- [ ] 4.2 Criar e executar `scripts/inject-db229-tables.js` para a tabela de encontros 1d6 das Montanhas Sanguinárias

## 5. Validação, Auditoria e Versionamento
- [ ] 5.1 Criar `scripts/validate-db229-compliance.js` e validar 100% dos requisitos normativos
- [ ] 5.2 Executar `npm run audit` e `npm run stats` confirmando 0 erros
- [ ] 5.3 Executar `openspec validate --all` confirmando integridade de todas as especificações
- [ ] 5.4 Atualizar `CHANGELOG.md`, `package.json`, `module.json` para `v1.6.0` e sincronizar CodeGraph

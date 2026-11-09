# Tasks: Integração Dragão Brasil #231

- [x] 1. Ameaças (`Ameacas_T20`)
  - [x] 1.1 Mapear e preparar tokens e ícones temáticos para as 10 ameaças no `icon-resolver.js` e `assets/tokens/`
  - [x] 1.2 Desenvolver script `scripts/inject-db231-threats.js` com as 10 fichas canônicas (Arraia-Seca, Anshira, Caçador de Condenados, Constritora Arenosa, Ressecado Saqueador, Ressecado Líder, Bianco, Rojo, Mantícora Zumbi, Morrise), incluindo IDs de 16 caracteres, 34 perícias sob `system.pericias`, defesa base dinâmica, armas como subdocumentos com `rolls.parts` e biografias com citações duplas
  - [x] 1.3 Executar injeção em `packs/Ameacas_T20`
- [x] 2. Itens, Classes e Poderes (`Itens_T20`)
  - [x] 2.1 Definir mapeamento estático de IDs de 16 caracteres para todos os itens, poderes e origens da DB #231
  - [x] 2.2 Desenvolver script `scripts/inject-db231-items.js` com a classe variante Miragem, habilidades de classe, 5 poderes de caçador, poder concedido Canção da Pedra, raça variante Sahiri, 3 origens regionais e itens/equipamentos especiais
  - [x] 2.3 Executar injeção em `packs/Itens_T20`
- [x] 3. Diários e Tabelas de Rolagem (`Diarios_T20` e `Tabelas_T20`)
  - [x] 3.1 Desenvolver script `scripts/inject-db231-journals.js` com os 3 diários e páginas como subdocumentos com IDs de 16 caracteres
  - [x] 3.2 Desenvolver script `scripts/inject-db231-tables.js` com as 4 tabelas e resultados como subdocumentos com IDs de 16 caracteres e campo `name`
  - [x] 3.3 Executar injeções nos compêndios correspondentes
- [x] 4. Validação e Qualidade
  - [x] 4.1 Desenvolver `scripts/validate-db231-compliance.js` cobrindo 100% dos requisitos normativos
  - [x] 4.2 Executar validações estritas da DB #231 e auditar integridade geral com `scripts/audit.js`
- [x] 5. Consolidação e Sincronização
  - [x] 5.1 Atualizar `module.json`, `package.json` e `CHANGELOG.md` para `v1.8.0`
  - [x] 5.2 Sincronizar CodeGraph e validar status OpenSpec

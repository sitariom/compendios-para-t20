# Proposal: Integração Canônica Completa da Dragão Brasil #230 nos Compêndios Tormenta20

## Why
A edição Dragão Brasil #230 traz materiais de jogo oficiais de grande impacto narrativo e mecânico para o sistema Tormenta20:
1. **Criaturas do Pesadelo** — Introdução oficial do Reino dos Pesadelos e dos servos oníricos de Ferren Asloth (Arquilich de Aslothia). Apresenta 10 ameaças de alto calibre variando de ND 2 a ND 18 (*Lanceiro Onírico ND 2*, *Ginete Onírico ND 3*, *Sargento Onírico ND 4*, *Tenente Onírico ND 6*, *Zangão do Pesadelo ND 5*, *Coletor do Pesadelo ND 6*, *Ceifador do Pesadelo ND 8*, *Pesadelo Polivalente ND 10*, *Mestre do Pesadelo ND 15* e *Nócnam Mur, o Pesadelo Amalgamado ND 18*), além de regras para Sonhos Roubados, despojos como a *Centelha Onírica* e tabelas de Natureza do Pesadelo.
2. **Breves Jornadas: A Corrida Brutal** — Uma aventura eletrizante nas Ruínas de Tyrondir para personagens de 9º nível, envolvendo o Círculo do Eclipse, mecânicas de corrida e combate veicular, a parceira hobgoblin *Rotsheel*, e 4 ameaças temáticas (*Sacerdote Caído ND 5*, *Três Goblins em um Gorlogg ND 7*, *Arzak ND 8*, *Gaardak ND 8*), além de itens exclusivos como a *Carruagem Duyshidakk* e o *Machado do Campeão de Tyrondir*.
3. **Gazeta do Reinado nº 162** — Crônicas com ganchos em Yukadar (*Corrupção em Yukadar* e o *Fruto da Florescência*), Svalas/Supremacia (*Fugitivos nas Charnecas*) e Doherimm (*Mina Fantasma em Doherimm*).

A integração deve cumprir 100% dos padrões canônicos estabelecidos e aperfeiçoados nas versões anteriores:
- **Foundry VTT v12 & T20 System v1.5.015**: Schemas estritos para atores e itens.
- **Subdocumentos ClassicLevel (LevelDB)**: Inclusão rigorosa de `!actors.items!actorId.itemId` e `!items.effects!itemId.effectId`. Para Diários e Tabelas de Rolagem, aplicação do padrão canônico estabelecido na v1.6.2 (arrays de string IDs em `pages` e `results`, com registros em `!journal.pages!` e `!tables.results!`).
- **Idempotência Estrita (Padrão v1.6.1)**: Mapeamento de IDs fixos e determinísticos para evitar chaves duplicadas.
- **Fidelidade Textual Integral aos PDFs**: Descrições de itens e poderes verbatim aos textos oficiais.
- **Biografias Padronizadas de Atores**: Apresentação descritiva com citação dupla canônica (`"..."`) em itálico seguida de lore formal.
- **Tokens Top-down de Alta Resolução**: Uso exclusivo do acervo 2-Minute Tabletop para todas as ameaças.
- **34 Perícias Canônicas T20**: Cálculo exato de atributos, graduações e defesas dinâmicas.

## What Changes
- **Ameaças e Criaturas (`Ameacas_T20`)**:
  - Inclusão de 14 criaturas completas na pasta canônica *Dragão Brasil* (`wfWApuyngzFm4KOP`):
    - 10 ameaças do Reino dos Pesadelos (Zangão, Coletor, Ceifador, Pesadelo Polivalente, Mestre do Pesadelo, Lanceiro, Ginete, Sargento, Tenente, Nócnam Mur).
    - 4 ameaças da Corrida Brutal (Sacerdote Caído, Três Goblins em um Gorlogg, Arzak, Gaardak).
- **Itens, Poderes e Parceiros (`Itens_T20`)**:
  - Inclusão da parceira hobgoblin *Parceira: Rotsheel* como poder com ActiveEffects na pasta *Parceiros* (`0uRx5Efj3tk7P5Xr`).
  - Inclusão dos poderes de recuperação de sonhos (*Sonho de Amor*, *Sonho de Aprendizado*, *Sonho de Destruição*) com automação de ActiveEffects.
  - Inclusão de veículos e equipamentos: *Carruagem Duyshidakk*, *Machado do Campeão de Tyrondir*, *Kum'shrak Eviscerador*.
  - Inclusão de consumíveis e alquímicos: *Centelha Onírica*.
- **Diários (`Diarios_T20`)**:
  - Diário *O Reino dos Pesadelos (DB #230)* com 7 páginas temáticas.
  - Diário *Aventura: A Corrida Brutal (DB #230)* com 5 páginas estruturadas de aventura.
- **Tabelas de Rolagem (`Tabelas_T20`)**:
  - Tabela *Natureza do Pesadelo (1d4)*.
  - Tabela *Ganchos do Pesadelo em Aslothia (1d6)*.
  - Tabela *Encontros da Corrida Brutal (1d6)*.
  - Tabela *Sonhos Roubados pelo Coletor (1d4)*.

## Success Criteria
1. ✅ 14 ameaças da DB #230 injetadas em `Ameacas_T20` com 34 perícias, tokens 2MTT, defesas, rolls e biografias com citações duplas.
2. ✅ Parceira Rotsheel e itens injetados em `Itens_T20` com ActiveEffects canônicos e IDs fixos sem duplicatas.
3. ✅ Diários e Tabelas de Rolagem com subdocumentos resolvidos perfeitamente via array de string IDs.
4. ✅ Validador automatizado `scripts/validate-db230-compliance.js` com 100% de aprovação.
5. ✅ Contadores do LevelDB e integridade do repositório auditados com 0 erros.
6. ✅ OpenSpec specifications sincronizadas e versão avançada para v1.7.0.

# Proposta: Integração Canônica Completa da Dragão Brasil #232

## Por Que (Why)
A revista *Dragão Brasil #232* traz conteúdo de grande relevância para o sistema *Tormenta20*:
1. **Licantropos Artonianos**: Um dossiê completo de cenário, regras, maldições, formas e 10 fichas oficiais de licantropos cobrindo cinco linhagens (lobos, onças, ratos, selakos e texugos) do ND 1 ao ND 11.
2. **Breves Jornadas: Monstros e Homens**: Uma aventura com 5 encontros/criaturas oficiais (Mamãe Glop ND 2, Estirge ND 1, Perdigueiro Troll ND 1, Ginete de Troll Purista ND 2 e o conjurador Xamã Finntroll ND 2).
3. **Gazeta do Reinado — Edição 164**: Crônica sobre a herança disputada no Reinado.

Esta proposta formaliza a integração total desse material no módulo *Compêndios para T20* em conformidade estrita com todos os padrões canônicos aprendidos (IDs de 16 caracteres alfanuméricos, subdocumentos ClassicLevel, magias individuais como itens de tipo magia, desagregação atômica de habilidades, preenchimento integral de `system.detalhes.resistencias`, perícias situacionais e tokens 2MTT).

## O Que Muda (What Changes)
- **Ameaças (`packs/Ameacas_T20`)**:
  - Inclusão de **15 ameaças e NPCs canônicos** (10 licantropos e 5 criaturas da aventura) com IDs de 16 caracteres, 34 perícias sob `system.pericias`, defesas dinâmicas, armas com `rolls.parts`, magias individuais no Xamã Finntroll, traços e imunidades/vulnerabilidades preenchidos no DataModel e texto integral em `detalhes.resistencias`.
- **Itens e Poderes (`packs/Itens_T20`)**:
  - Inclusão das regras de Licantropia como poderes e traços canônicos (*Controlar Licantropia*, *Aversão a Mitral*, *Empatia Animal*, *Maldição da Licantropia*, *Sentidos Aguçados*, *Forma Híbrida*, e as 5 *Formas de Fera*).
- **Diários (`packs/Diarios_T20`)**:
  - Inclusão de **3 Diários oficiais** com páginas como subdocumentos ClassicLevel e permissão herdada (`ownership.default: -1`).
- **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
  - Inclusão de **4 Tabelas de Rolagem** com fórmula `1d6` e resultados em subdocumentos com campo `name`.
- **Validação Automatizada**:
  - Desenvolvimento de `scripts/validate-db232-compliance.js` garantindo 100% de aprovação e zero regressões.

# Proposta: Conformidade Estrita de Atores e Itens do Sistema Tormenta20 (DB #226 a #231)

## Por Que (Why)
Uma auditoria detalhada nos compêndios revelou divergências entre as fichas dos PDFs oficiais e a implementação no Foundry VTT para os materiais das edições Dragão Brasil #226 a #231:
1. **Magias**: Conjuradores (como Anshira, Morrise, Sacerdote Caído e Bianco) tiveram suas magias agrupadas como poderes textuais genéricos em vez de itens do tipo `magia` com círculos, escolas, tipos e custos em PM conforme o template do sistema Tormenta20.
2. **Imunidades e Vulnerabilidades a Dano**: Vulnerabilidades (ex: fogo nos Ressecados, luz no Espectro) e imunidades a dano (ácido, frio, trevas, eletricidade) não estavam ativando as flags booleanas `imunidade` e `vulnerabilidade` em `system.tracos.resistencias[damageType]`.
3. **Imunidades a Condições**: As imunidades a condições e efeitos mentais não estavam sendo populadas adequadamente em `system.tracos.ic.value`.
4. **Perícias Situacionais**: Bônus de perícias circunstanciais (ex: *Furtividade em desertos*) não possuíam subentradas com `custom: true` e labels descritivos em `system.pericias`.
5. **Poderes Omitidos**: Habilidades ativas como *Passo Sombrio* e *Transferir Sofrimento* (Morrise), *Violência Cômica* (Rojo) e *Fraqueza Zumbi* (Mantícora Zumbi) foram omitidas em injeções anteriores.

## O Que Muda (What Changes)
- **Refatoração do Construtor Mestre (`scripts/create-entry.js`)**:
  - Correção de `buildTracos` para suportar tanto dano quanto condições (`icValue`, `imunidadesDano`, `vulnerabilidadesDano`), mapeando automaticamente tipos canônicos de dano e de status.
  - Implementação completa e canônica de `buildSpellItem` respeitando o DataModel `SpellData` do Tormenta20 (`circulo`, `tipo: 'arc'|'div'|'uni'`, `escola: 'abj'|'evo'|...`, `ativacao`, `resistencia`, `rolls`).
  - Suporte nativo a perícias situacionais com `custom: true` e label contextual (ex: `furt_deserto`).
- **Atualização dos Scripts de Injeção (DB #226 a #231)**:
  - `scripts/rebuild-db226-threats.js`: Revisão de Tyrant, Espectro do Pesadelo, Come-Sonhos e Expurgo Onírico.
  - `scripts/rebuild-db227-threats.js`: Revisão de Lynel, Oxxdon, Enxame de Armas, Tropa de Mortos e Inumano.
  - `scripts/inject-db228-threats.js`: Revisão de Ankthyr, Enxame Cáustico e Slark.
  - `scripts/inject-db229-threats.js`: Revisão de Defensor Rochoso, Revoada de Serpes, Presa do Grande Basilisco e Basilisco Ancestral.
  - `scripts/inject-db230-threats.js`: Revisão dos 14 atores da DB #230, incluindo magias individuais para Sacerdote Caído e Mestre do Pesadelo, e imunidades de construto/pesadelo.
  - `scripts/inject-db231-threats.js`: Revisão das 10 ameaças da DB #231, incluindo magias individuais para Anshira (5 magias), Morrise (5 magias) e Bianco (4 truques), inclusão de poderes faltantes e perícias em deserto.
- **Expansão das Suítes de Teste e Validação**:
  - Novos testes estritos em `scripts/validate-db231-compliance.js`, `validate-db230-compliance.js`, `validate-db229-compliance.js`, `validate-db228-compliance.js` e `validate-db227-compliance.js`.

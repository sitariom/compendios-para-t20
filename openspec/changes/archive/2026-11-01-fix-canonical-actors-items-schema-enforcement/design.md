# Design: Arquitetura de Imposição Estrita de Schemas e Reconstrução DB #228

## Context
O sistema Tormenta20 no Foundry VTT v12/v13 opera sobre DataModels rigorosos que esperam propriedades específicas para renderização de ficha, cálculos dinâmicos de perícias/defesa e execução de rolagens no chat. Os templates de geração de JSON documentados em `/home/orange/OneDrive-t20/T20/Nao_oficial_T20/moulinette-obsidian/Herancas-do-tirano/Prompts IA/Templates foundry` e as macros `Criadora de Ameaças v6` e `Criadora de Itens V8` estabelecem estruturas normativas obrigatórias que devem ser respeitadas em todos os compêndios.

## Goals / Non-Goals

**Goals:**
- Refatorar as fábricas de criação em `scripts/create-entry.js` para garantir que 100% dos campos de templates de Atores e Itens sejam gerados com seus valores canônicos ou padrões tipados, sem omissões.
- Padronizar a criação de armas (manufaturadas e naturais) com a estrutura `rolls` baseada em `parts` (`ataque0` e `dano1`), `criticoM`, `criticoX` e `chatFlavor`.
- Garantir que todos os ataques e habilidades de atores sejam embutidos no array `items` do documento do ator antes da gravação no LevelDB, além da indexação sob `!actors.items!`.
- Dotar parceiros de fichas completas com suas habilidades especiais de patamar embutidas como poderes.
- Configurar `ActiveEffects` funcionais em todos os itens e poderes que alteram estatísticas mecânicas.
- Reconstruir e validar 100% dos documentos da DB #228 em `Ameacas_T20` e `Itens_T20`.

**Non-Goals:**
- Modificar conteúdos já estáveis de edições anteriores (DB #226 e #227).
- Alterar o conteúdo narrativo das 19 páginas de diários já auditadas da DB #228.

## Decisions

### Decisão 1: Fábricas Baseadas no Template Normativo em `create-entry.js`
- **Escolha**: Criar geradores canônicos que mesclam os dados fornecidos com a estrutura completa dos templates `00_setup_criar_ator_v2.md` e `Criadora de Itens V8`.
- **Alternativa Rejeitada**: Construir objetos parciais sob demanda (provou-se frágil e resultou em campos faltantes).
- **Impacto**: Elimina qualquer possibilidade de `undefined` em variáveis como `movement`, `atributos.base/racial/bonus`, `defesa.atributo/pda/outros/condi`, `upgrades`, `propriedades` e `chatFlavor`.

### Decisão 2: Estrutura `rolls.parts` em Armas e Ataques
- **Escolha**: Toda arma e ataque natural conterá:
  ```json
  "rolls": [
    {
      "name": "Ataque",
      "key": "ataque0",
      "type": "ataque",
      "parts": [["1d20", "", ""], ["luta", "", ""], [bonus, "", ""]],
      "versatil": ""
    },
    {
      "name": "Dano",
      "key": "dano1",
      "type": "dano",
      "parts": [["XdY", "tipo_dano", ""], ["for", "", ""]],
      "versatil": ""
    }
  ]
  ```
- **Alternativa Rejeitada**: Usar strings de fórmula soltas (`formula: "1d20+26"`), que não integram com o sistema de macros e rolagens do Foundry Tormenta20.

### Decisão 3: Injeção Atômica de `items` no Ator
- **Escolha**: O array `actorDoc.items` conterá todos os subdocumentos prontos antes de chamar `db.put('!actors!' + id, actorDoc)`. Em seguida, cada item também é gravado em `!actors.items!${actorId}.${itemId}` para manter paridade com a indexação interna do ClassicLevel.
- **Alternativa Rejeitada**: Gravar o ator com `items: []` e salvar apenas nas chaves filhas (o Foundry não exibe itens na ficha importada).

### Decisão 4: Automação Obrigatória de ActiveEffects
- **Escolha**: Todo item ou poder com benefício numérico ou condicional persistente terá um `ActiveEffect` embutido com `transfer: true` e `flags.tormenta20.transfer: true`.
- **Chaves Canônicas**: `system.attributes.pm.max`, `system.attributes.pv.max`, `system.attributes.defesa.outros`, `system.pericias.<key>.outros`, `system.tracos.resistencias.<dano>.base`.

## Risks / Trade-offs

- **[Tamanho dos Documentos LevelDB]** → O preenchimento completo de variáveis expande ligeiramente o payload JSON.
  *Mitigação*: LevelDB compacta nativamente via Snappy/Zlib no formato ClassicLevel. A expansão de poucos KBs é insignificante comparada à funcionalidade 100% nativa.
- **[Duplicação de Destreza na Defesa]** → Risco de o cálculo dinâmico alterar a Defesa exibida.
  *Mitigação*: Aplicar estritamente a regra `defesa.base = defesa_ficha - modDes`.

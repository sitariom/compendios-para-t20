# Proposal: Imposição Estrita de Schemas Canônicos e Reconstrução Completa dos Atores e Itens da DB #228

## Why
A geração recente de atores, perigos, parceiros e itens da Dragão Brasil #228 apresentou inconsistências críticas: armas sem estruturas de rolagem (`rolls.parts`), itens com campos omitidos, ausência de ActiveEffects automatizados, atores persistidos no LevelDB sem os itens embutidos no array do documento principal, perícias incompletas e descrições sem o formato canônico com citações em bloco duplas exigido pelos templates de Foundry e macros canônicas (Criadora de Ameaças v6 e Criadora de Itens V8). É urgente atualizar as especificações do OpenSpec e reconstruir 100% dos documentos da DB #228 para garantir conformidade estrita e funcionalidade total no Tormenta20 Foundry VTT.

## What Changes
- **Imposição de Variáveis Completas nos Atores**: Garantir que todos os atores (`npc`, `hazard`, parceiros) possuam 100% das variáveis do template de ator (atributos com `value`, `base`, `racial: 0`, `bonus: 0`; movimento com `walk`, `burrow`, `climb`, `fly`, `swim`, `hover: false`, `unit: "m"`; `attributes.cd`; `attributes.defesa` com `base = value - modDes`; biografia estruturada com citação do personagem, citação do escriba/personagem fictício e biografia em HTML estilizado).
- **Embedded Attacks como Armas Completas**: Todos os ataques corpo a corpo e à distância de atores devem ser armas embutidas funcionais com `rolls` contendo `parts` (`ataque0` com `1d20` + perícia `luta`/`pont` + bônus, e `dano1` com dados de dano + tipo de dano + atributo), `criticoM`, `criticoX` e `chatFlavor`.
- **Habilidades e Características como Poderes Atômicos com ActiveEffects**: Cada habilidade ou característica da criatura deve ser um poder individual com custo de ativação, CD, descrição rica com `chatFlavor` e `ActiveEffects` configurados quando houver modificação de estatísticas, condições ou vantagens.
- **Persistência Completa de Documentos Embutidos no LevelDB**: O array `items` do documento do ator deve conter todos os itens e ataques antes da gravação da chave `!actors!_id`, além das chaves `!actors.items!actorId.itemId`.
- **Imposição de Variáveis Completas em Itens**: Todas as armas, armaduras, poderes, magias, equipamentos e consumíveis devem manter todas as variáveis do template (`carregado`, `peso`, `espacos`, `qtd`, `preco`, `pv`, `rd`, `equipado`, `ativacao`, `duracao`, `target`, `range`, `consume`, `efeito`, `alcance`, `alvo`, `area`, `resistencia`, `tags`, `chatFlavor`, `upgrades`, `melhorias`, `encantos`, `rolls`, `effects`).
- **Automação de ActiveEffects em Itens**: Todos os itens e poderes que concedem bônus mecânicos (PM, Defesa, perícias, RD) devem conter `ActiveEffects` válidos com `changes` apontando para as chaves do sistema Tormenta20 (`system.attributes.pm.max`, `system.attributes.defesa.outros`, `system.pericias.<key>.outros`, etc.).
- **Reconstrução Canônica da DB #228**: Reconstrução integral de Ankthyr (ND 8), Enxame Cáustico (ND 4), Slark (ND 1), Desabamento dos Túneis (Hazard ND 8), Parceiros (Reabilitador, Allihennali, Guaxininjas) e 20 itens, poderes e magias de Divinas Organizações.

## Capabilities

### Modified Capabilities
- `actors-specification`: Exige ataques embutidos como armas completas com `rolls.parts`, habilidades como poderes individuais com `chatFlavor` e `effects`, persistência atômica no LevelDB e biografia canônica com bloco duplo.
- `items-specification`: Exige estrutura de rolagem `rolls.parts` para armas e magias, presença de 100% das variáveis do schema sem omissão de campos e configuração funcional de `ActiveEffects` para modificadores mecânicos.

## Impact
- **Módulos Afetados**: `packs/Ameacas_T20`, `packs/Itens_T20`.
- **Scripts Afetados**: `scripts/create-entry.js`, `scripts/inject-db228-threats.js`, `scripts/inject-db228-items.js`, `scripts/validate-db228-compliance.js`.
- **Compatibilidade**: Foundry VTT v12/v13 e sistema oficial Tormenta20 v1.5.015+.

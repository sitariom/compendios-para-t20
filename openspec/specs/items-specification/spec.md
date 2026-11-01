# items-specification Specification

## Purpose
The items-specification capability defines the authoritative specification and quality contracts for creating and validating all Item documents (Combat Powers, General Powers, Spells, Weapons, Armors, Shields, Consumables, and Magic Items) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: General and Combat Powers Schema
Every power item SHALL conform to the Tormenta20 Item Creator Macro V8 schemas. Powers MUST specify `system.tipo: "geral"`, a valid `system.subtipo` (`combate`, `concedido`, `tormenta`, `destino`, `magia`, `distincao`, or `origem`), execution action type (`padrao`, `movimento`, `reacao`, `livre`, or `passiva`), PM activation cost, prerequisites, and cleanly formatted HTML description with quote blocks.

#### Scenario: Creating a combat power from Caverna do Saber
- **GIVEN** a new combat power published in Dragão Brasil
- **WHEN** the item document is constructed
- **THEN** `system.tipo` is set to `geral`
- **AND** `system.subtipo` is set to `combate`
- **AND** `system.ativacao.execucao` and `system.ativacao.custo` reflect the rule text
- **AND** `system.description.value` contains formatted HTML with prerequisites in bold

### Requirement: Equipment, Weapons, Shields, and Armors
Manufactured and natural weapons, armors, and shields SHALL define complete combat statistics including equipment slot, hands required (`empunhadura`), damage die, damage type (`corte`, `perfuracao`, `impacto`, etc.), critical threat range (`criticoM`) and multiplier (`criticoX`), defense bonus, armor penalty (`penalidade`), range category, and `chatFlavor`. Weapon items MUST include `rolls` with structured `parts` for attack rolls (`ataque0`) and damage rolls (`dano1`).

#### Scenario: Registering a two-handed manufactured weapon
- **GIVEN** a weapon item such as Espada Bastarda or Machado de Guerra
- **WHEN** the equipment document is saved in `packs/Itens_T20`
- **THEN** `type` is set to `arma`
- **AND** `system.empunhadura` is set to `duas` or `uma`
- **AND** `system.critico` contains numeric threat range and multiplier
- **AND** `system.dano` includes valid dice formula and damage type
- **AND** `system.criticoM` and `system.criticoX` are numeric properties on the system root
- **AND** `system.rolls` contains `ataque0` and `dano1` with valid `parts` arrays
- **AND** `system.chatFlavor` contains a blockquote quote and highlighted action description

### Requirement: Spell Schema and Enhancements
Every Spell document SHALL specify its circle (`circulo`: 1 to 5), tradition (`tipo`: `arcana`, `divina`, or `universal`), school (`escola`: `abjuracao`, `convocacao`, `adivinhacao`, `encantamento`, `evocacao`, `ilusao`, `necromancia`, `transmutacao`), range, duration, target, resistance saving throw, and structured enhancements (`system.aprimoramentos`) with incremental PM costs and conditional effect descriptions.

#### Scenario: Spell item with circle and enhancements
- **GIVEN** a spell from Tormenta20 JdA or Dragão Brasil
- **WHEN** the spell item document is created
- **THEN** circle is integer from 1 to 5
- **AND** saving throw target attribute and effect (half, none, negate) are populated
- **AND** each enhancement entry defines cost in PM and mechanical modification

### Requirement: Active Effects and System Automation Flags
Items providing persistent passive bonuses, condition triggers, or temporary modifications SHALL define Active Effects with explicit changes targeting canonical Tormenta20 system keys (`system.attributes.pm.max`, `system.attributes.defesa.outros`, `system.pericias.<key>.outros`, `system.tracos.resistencias.<type>.base`), change modes (Add, Multiply, Upgrade, Override), transfer mode (`transfer: true`), and system transfer flag `flags.tormenta20.transfer: true`.

#### Scenario: Power granting bonus to Defense and Reflexes
- **GIVEN** a combat power like Esquiva II or Costas Largas II
- **WHEN** the item is equipped or added to an actor
- **THEN** embedded active effects define key targets like `system.attributes.defesa.bonus`
- **AND** `flags.tormenta20.transfer` is set to `true` to ensure automatic calculation on the sheet
- **AND** each effect has valid `changes` pointing to canonical system keys

### Requirement: Visual Icon Resolution Standard
Every Item document SHALL be assigned a thematic, high-contrast icon. Icons MUST be resolved prioritizing:
1. Native Tormenta20 system icons in `systems/tormenta20/icons/...`
2. High-resolution themed icons from Wowhead in `modules/compendios-para-t20/assets/icons/...`
3. Themed game icons from Game-Icons.net in `modules/compendios-para-t20/assets/icons/...`
Generic placeholder icons such as `icons/svg/mystery-man.svg` or `icons/svg/item-bag.svg` MUST NOT be used.

#### Scenario: Resolving icon for an item
- **GIVEN** an item created via `buildItem` or injection scripts
- **WHEN** the document image is set
- **THEN** `icon-resolver.js` resolves the canonical path based on item name and subtype
- **AND** the icon exists locally in the repository or Tormenta20 core

### Requirement: Complete Template Schema for All Item Types
Every Item document regardless of type (`arma`, `equipamento`, `poder`, `magia`, `consumivel`, `tesouro`) SHALL retain 100% of the variables defined in the canonical Tormenta20 item templates. Optional or non-applicable fields MUST NOT be omitted; they SHALL be populated with typed default values (`0`, `""`, `null`, `false`, `[]`, or `{}`).

#### Scenario: Validating item document against omitted fields
- **GIVEN** an item document constructed for `Itens_T20`
- **WHEN** the document schema is inspected
- **THEN** no standard template variable is `undefined`
- **AND** `system.description.value` contains formatted HTML description
- **AND** all general attributes (`peso`, `espacos`, `qtd`, `preco`, `equipado`) are present
- **AND** type-specific sub-objects (`upgrades`, `propriedades`, `rolls`, `effects`) are initialized

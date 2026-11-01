# actors-specification Specification

## Purpose
The actors-specification capability defines the authoritative specification and quality contracts for creating and validating all Actor documents (Threats, NPCs, Solo Bosses, Minions, Hazards, Player Characters, and Partners) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: Canonical Threat and NPC Data Schema
Every Actor of type `npc` SHALL conform to the Tormenta20 Foundry VTT system schema and the canonical Threat Creator Macro v6 specifications. Each threat MUST include structured details (`nd`, `papel`, `tipo`, `tamanho`), complete ability scores (`for`, `des`, `con`, `int`, `sab`, `car`), core attributes (`pv`, `pm`, `defesa`), movement speeds, and thematic biography styled with dual blockquotes (creature flavor and chronicler lore).

#### Scenario: Creating a canonical threat actor
- **GIVEN** a threat defined in an official Tormenta20 publication or Dragão Brasil
- **WHEN** the actor document is constructed
- **THEN** details contain valid `nd`, `papel` (solo, lacaio, padrao), `tipo`, and `tamanho`
- **AND** ability scores and attributes are strictly formatted with numeric `value` and `max` fields
- **AND** biography contains formatted HTML blockquotes without unescaped raw markup

### Requirement: Dynamic Defense Base Calculation
Because the Tormenta20 system dynamically computes total Defense via `prepareDefense` as `defesa.base + @des + outros`, the actor's stored `system.attributes.defesa.base` SHALL be set strictly to `defesa_ficha - destreza` to prevent duplicate Dexterity addition.

#### Scenario: Threat Defense calculation on actor sheet render
- **GIVEN** a threat with canonical Defense 43 and Dexterity +8 (e.g. Lynel ND 12)
- **WHEN** the actor's Defense is persisted to LevelDB
- **THEN** `system.attributes.defesa.base` is set to 35 (43 - 8)
- **AND** `system.attributes.defesa.value` matches the published Defense 43
- **AND** the rendered sheet displays exactly 43 without Dexterity duplication

### Requirement: Comprehensive 34 Skills Deduction
Every Threat Actor SHALL possess all 34 Tormenta20 skills pre-calculated using the canonical deduction formula: `VALOR_PERICIA = VALOR_FICHA - MEIONIVEL - ATRIBUTO - TREINO`.

#### Scenario: Deducting trained and untrained skills for a threat
- **GIVEN** a threat with published skill values on its stat block
- **WHEN** the actor's `system.pericias` dictionary is constructed
- **THEN** all 34 skills are present with computed bonuses
- **AND** skills listed on the published stat block have `treinado: 1`
- **AND** unlisted skills receive appropriate half-level and attribute modifiers

### Requirement: Creature Traits, Resistances and Immunities
Every Threat Actor SHALL have `system.tracos` fully populated, including all 13 damage resistance categories (`tracos.resistencias`), condition and maneuver immunities (`tracos.ic`), languages (`tracos.idiomas`), and size sync (`tracos.tamanho`).

#### Scenario: Threat with construct or undead immunities
- **GIVEN** a threat of type construto or morto-vivo (e.g. Enxame de Armas, Tropa de Mortos)
- **WHEN** its traits are generated
- **THEN** `system.tracos.resistencias` contains explicit damage reduction values for all 13 damage types
- **AND** `system.tracos.ic` includes immunities to fatigue, sleep, poison, paralysis, and single-target maneuvers
- **AND** `system.tracos.idiomas` is populated with `Nenhum` or spoken languages

### Requirement: Exclusive 2-Minute Tabletop Token Mandatory Standard
Every Actor's prototype token (`prototypeToken.texture.src`) SHALL be sourced exclusively from the 2-Minute Tabletop collection (`modules/compendios-para-t20/assets/tokens/*.png`). Generic system tokens or other third-party tokens MUST NOT be used for actor tokens. Token dimensions (`width` and `height`) SHALL match creature grid size (1x1 for Médio, 2x2 for Grande, 3x3 for Enorme, 4x4 for Colossal).

#### Scenario: Setting actor token texture
- **GIVEN** any threat actor created or updated in the repository
- **WHEN** the prototype token is generated
- **THEN** `prototypeToken.texture.src` points to a valid 2-Minute Tabletop transparent PNG in `assets/tokens/`
- **AND** `prototypeToken.width` and `prototypeToken.height` match the creature's grid dimension

### Requirement: Embedded Attacks and Creature Powers
A Threat's natural weapons, manufactured weapons, and special powers SHALL be stored as embedded subdocuments under `!actors.items!${actorId}.${itemId}` with proper action types, reach, critical threat/multiplier, and executable roll formulas for attack and damage.

#### Scenario: Threat executes an attack roll
- **GIVEN** an embedded weapon or natural attack in an actor document
- **WHEN** the item is loaded in Foundry VTT
- **THEN** `system.tipo` is set to `corpo-a-corpo` or `distancia`
- **AND** attack roll formula and damage rolls are populated with appropriate bonus formulas

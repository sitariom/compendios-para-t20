# actors-specification Specification

## Purpose
The actors-specification capability defines the authoritative specification and quality contracts for creating and validating all Actor documents (Threats, NPCs, Solo Bosses, Minions, Hazards, Player Characters, and Partners) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: Canonical Threat and NPC Data Schema
Every Actor of type `npc` SHALL conform strictly to the Tormenta20 Foundry VTT system data model and canonical Threat Creator Macro v6 specifications. Each threat MUST include structured details (`nd`, `role`, `tipo`, `tamanho`), complete ability scores (`for`, `des`, `con`, `int`, `sab`, `car`) with `value`, `base`, `racial: 0`, and `bonus: 0`, core attributes (`pv`, `pm`, `defesa`, `cd`), full movement speeds object (`walk`, `burrow`, `climb`, `fly`, `swim`, `hover: false`, `unit: "m"`), and biography formatted with dual blockquotes.

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
- **AND** skills listed on the published stat block have `treinado: true`
- **AND** unlisted skills receive appropriate half-level and attribute modifiers with `treinado: false`

#### Scenario: Preserving strict training status from official statblock
- **GIVEN** a creature with or without explicit skill lines in its published statblock
- **WHEN** skill training is mapped
- **THEN** only skills explicitly published as trained or intrinsic (percepcao, iniciativa, or listed in the PERÍCIAS line) receive `treinado: true`
- **AND** unmentioned skills such as Atletismo or Sobrevivência receive `treinado: false` with untrained half-level calculation

### Requirement: Creature Traits, Resistances and Immunities
Every Threat Actor SHALL have `system.tracos` fully populated, including all 13 damage resistance categories (`tracos.resistencias`), condition and maneuver immunities (`tracos.ic`), languages (`tracos.idiomas`), and size sync (`tracos.tamanho`).

#### Scenario: Threat with construct or undead immunities
- **GIVEN** a threat of type construto or morto-vivo (e.g. Enxame de Armas, Tropa de Mortos)
- **WHEN** its traits are generated
- **THEN** `system.tracos.resistencias` contains explicit damage reduction values for all 13 damage types
- **AND** `system.tracos.ic` includes immunities to fatigue, sleep, poison, paralysis, and single-target maneuvers
- **AND** `system.tracos.idiomas` is populated with `Nenhum` or spoken languages

#### Scenario: Threat with general damage reduction vs specific type RD
- **GIVEN** a threat published with general damage reduction (e.g. Ankthyr with "redução de dano 5")
- **WHEN** traits are constructed
- **THEN** general damage reduction is stored strictly in `system.tracos.resistencias.dano`
- **AND** specific physical damage types (corte, perfuracao, impacto) are not assigned individual RD unless explicitly stated in the statblock

### Requirement: Exclusive 2-Minute Tabletop Token Mandatory Standard
Every Actor's prototype token (`prototypeToken.texture.src`) SHALL be sourced exclusively from the 2-Minute Tabletop collection (`modules/compendios-para-t20/assets/tokens/*.png`). Generic system tokens or other third-party tokens MUST NOT be used for actor tokens. Token dimensions (`width` and `height`) SHALL match creature grid size (1x1 for Médio, 2x2 for Grande, 3x3 for Enorme, 4x4 for Colossal).

#### Scenario: Setting actor token texture
- **GIVEN** any threat actor created or updated in the repository
- **WHEN** the prototype token is generated
- **THEN** `prototypeToken.texture.src` points to a valid 2-Minute Tabletop transparent PNG in `assets/tokens/`
- **AND** `prototypeToken.width` and `prototypeToken.height` match the creature's grid dimension

### Requirement: Embedded Attacks and Creature Powers
A Threat's natural weapons, manufactured weapons, and special powers SHALL be stored both as embedded subdocuments inside the actor's `items` array and as persistent LevelDB entries under `!actors.items!${actorId}.${itemId}`. All weapon attacks MUST define `rolls` with structured `parts` (`ataque0` and `dano1`), `criticoM`, `criticoX`, and `chatFlavor`. All powers MUST define execution type, PM cost, `chatFlavor`, and ActiveEffects when applicable.

#### Scenario: Threat executes an attack roll
- **GIVEN** an embedded weapon or natural attack in an actor document
- **WHEN** the item is loaded in Foundry VTT
- **THEN** `system.tipo` is set to `corpo-a-corpo` or `distancia`
- **AND** attack roll formula and damage rolls are populated with appropriate bonus formulas
- **AND** `system.rolls` contains `ataque0` and `dano1` with valid `parts`
- **AND** `system.criticoM` and `system.criticoX` are numeric properties on the system root
- **AND** `system.chatFlavor` contains blockquote quote and highlighted action text
- **AND** the actor's primary document `items` array contains the weapon document

#### Scenario: Partner actor with tiered special powers
- **GIVEN** a partner actor such as Reabilitador, Allihennali, or Guaxininjas
- **WHEN** the partner document is created in Ameacas_T20
- **THEN** all of its special benefits and tier powers are embedded as items of type `poder`
- **AND** the actor's `items` array is non-empty and mirrors all embedded subdocuments

### Requirement: All Template Variables Mandatory
All Actor documents SHALL include 100% of the variables defined in the canonical Tormenta20 actor templates. Fields without a specific value MUST NOT be omitted; they SHALL receive their typed default (`0`, `""`, `null`, `false`, `[]`, or `{}`) according to the schema.

#### Scenario: Validating actor document against omitted fields
- **GIVEN** an actor document constructed for `Ameacas_T20`
- **WHEN** the document schema is inspected
- **THEN** no standard template variable is `undefined`
- **AND** `system.atributos` has all 6 attributes with full sub-properties
- **AND** `system.attributes.defesa` has `atributo`, `pda`, `value`, `base`, `outros`, `condi`
- **AND** `system.pericias` has all 34 skills with complete property dictionaries

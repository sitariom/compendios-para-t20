# actors-specification Specification

## Purpose
The actors-specification capability defines the authoritative specification and quality contracts for creating and validating all Actor documents (Threats, NPCs, Solo Bosses, Minions, Hazards, Player Characters, and Partners) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: Canonical Threat and NPC Data Schema
Every Actor of type `npc` SHALL conform strictly to the Tormenta20 Foundry VTT system data model and canonical Threat Creator Macro v6 specifications. Each threat MUST include structured details (`nd`, `role`, `tipo`, `tamanho`), complete ability scores (`for`, `des`, `con`, `int`, `sab`, `car`) with `value`, `base`, `racial: 0`, and `bonus: 0`, core attributes (`pv`, `pm`, `defesa`, `cd`), full movement speeds object (`walk`, `burrow`, `climb`, `fly`, `swim`, `hover: false`, `unit: "m"`), and biography formatted strictly according to the canonical dual-blockquote standard: a primary atmospheric/creature quote (`border-left: 5px solid #800000`), an in-world field observer quote canonically featuring goblin chronicler Grunk Ferroforja (`border-left: 5px solid #006400`), and an Arial descriptive presentation paragraph introducing the creature with its name highlighted in bold red (`color: #800000; font-weight: bold;`).

#### Scenario: Creating a canonical threat actor
- **GIVEN** a threat defined in an official Tormenta20 publication or Dragão Brasil
- **WHEN** the actor document is constructed
- **THEN** details contain valid `nd`, `papel` (solo, lacaio, padrao), `tipo`, and `tamanho`
- **AND** ability scores and attributes are strictly formatted with numeric `value` and `max` fields
- **AND** biography contains dual blockquotes with distinct border colors (`#800000` and `#006400`)
- **AND** the second blockquote attributes field observations to Grunk Ferroforja
- **AND** a descriptive presentation paragraph introduces the creature's physiology and Tormenta20 adaptation

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
A Threat's natural weapons, manufactured weapons, and special powers SHALL be stored as child subdocuments inside LevelDB under `!actors.items!${actorId}.${itemId}`, and the parent Actor document `actor.items` MUST strictly contain the array of string item IDs. All weapon attacks MUST define `rolls` with structured `parts` (`ataque0` and `dano1`), `criticoM`, and `criticoX`. All powers and attacks MUST feature descriptions faithful to the source PDF. Special powers and attacks with conditions or mechanical modifications MUST define functional `ActiveEffects` saved as subdocuments under `!actors.items.effects!${actorId}.${itemId}.${effectId}`.

#### Scenario: Threat executes an attack roll
- **GIVEN** an embedded weapon or natural attack in an actor document
- **WHEN** the item is loaded in Foundry VTT
- **THEN** `system.tipo` is set to `corpo-a-corpo` or `distancia`
- **AND** attack roll formula and damage rolls are populated with appropriate bonus formulas
- **AND** `system.rolls` contains `ataque0` and `dano1` with valid `parts`
- **AND** `system.criticoM` and `system.criticoX` are numeric properties on the system root
- **AND** `system.description.value` contains verbatim text from the source publication
- **AND** the actor's primary document `items` array contains strictly string IDs
- **AND** child subdocuments are indexed under `!actors.items!${actorId}.${itemId}` and `!actors.items.effects!${actorId}.${itemId}.${effectId}`

### Requirement: Partners, Familiars, and Mounts Created as Powers
When source material introduces a Partner (Parceiro), Familiar, or Mount (Montaria) providing bonuses or abilities to characters, it SHALL NOT be created as an Actor in `Ameacas_T20`. Instead, it MUST be created as an Item of type `poder` with `system.subtipo: "parceiro"` in `packs/Itens_T20` within the canonical "Parceiros" folder (`0uRx5Efj3tk7P5Xr`), equipped with structured `ActiveEffects` and activation rules.

#### Scenario: Creating a partner from magazine content
- **GIVEN** a new partner introduced in Dragão Brasil (e.g. Reabilitador, Allihennali, Guaxininjas)
- **WHEN** the document is created
- **THEN** it is saved in `packs/Itens_T20` as `type: "poder"` with `system.subtipo: "parceiro"`
- **AND** it is assigned to the "Parceiros" folder (`0uRx5Efj3tk7P5Xr`)
- **AND** no Actor document for the partner is added to `packs/Ameacas_T20`

### Requirement: All Template Variables Mandatory
All Actor documents SHALL include 100% of the variables defined in the canonical Tormenta20 actor templates. Fields without a specific value MUST NOT be omitted; they SHALL receive their typed default (`0`, `""`, `null`, `false`, `[]`, or `{}`) according to the schema.

#### Scenario: Validating actor document against omitted fields
- **GIVEN** an actor document constructed for `Ameacas_T20`
- **WHEN** the document schema is inspected
- **THEN** no standard template variable is `undefined`
- **AND** `system.atributos` has all 6 attributes with full sub-properties
- **AND** `system.attributes.defesa` has `atributo`, `pda`, `value`, `base`, `outros`, `condi`
- **AND** `system.pericias` has all 34 skills with complete property dictionaries

### Requirement: Dragão Brasil #229 Canonical Threat Integration
All threats from Dragão Brasil #229 (*Defensor Rochoso Desperto ND 8*, *Revoada de Serpes ND 8*, *Presa do Grande Basilisco ND 3* e *Basilisco Ancestral ND 9*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`) and mirrored in `src/packs/Ameacas_T20/`. Each threat MUST possess 34 skills calculated with the standard formula, dynamic defense base (`base + des = value`), complete movement object, complete traits and condition immunities, and exclusive top-down tokens from 2-Minute Tabletop.

#### Scenario: Defensor Rochoso Desperto ND 8 schema validation
- **GIVEN** the creature Defensor Rochoso Desperto published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `solo`, ND is `8`
- **AND** defense is 33 with base 33 and Des 0
- **AND** traits include general damage reduction 10, immunity to stunned and petrified, and abascant nature 50%
- **AND** natural attack *Duas pancadas +26 (4d8+19, x3)* has structured `rolls.parts`
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/defensor-rochoso-desperto.png`

#### Scenario: Revoada de Serpes ND 8 schema validation
- **GIVEN** the creature Revoada de Serpes published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `eno` (3x3), role is `solo`, ND is `8`
- **AND** defense is 33 with base 32 and Des 1
- **AND** immunity is set to paralysis
- **AND** natural attacks include *Mordida +26 (2d6+12)*, *Ferrão +26 (1d8+12 mais veneno)*, *Agarrar Aprimorado (+31)* e *Peçonha Concentrada*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/revoada-de-serpes.png`

#### Scenario: Presa do Grande Basilisco ND 3 schema validation
- **GIVEN** the creature Presa do Grande Basilisco published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `med`, role is `padrao`, ND is `3`
- **AND** defense is 20 with base 18 and Des 2
- **AND** powers include *Ódio Sórdido*, *Vitalidade Peçonhenta* (recupera 1d12 com veneno) e *Peçonha Concentrada*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/presa-do-grande-basilisco.png`

#### Scenario: Basilisco Ancestral ND 9 schema validation
- **GIVEN** the creature Basilisco Ancestral published in DB #229
- **WHEN** the actor document is validated
- **THEN** type is `npc`, size is `eno` (3x3), role is `solo`, ND is `9`
- **AND** defense is 33 with base 31 and Des 2
- **AND** traits include damage reduction 10, immunity to shapechange, and poison resistance +10
- **AND** powers include *Olhar Petrificante* (CD 28), *Sopro* (cone 9m, 3d12, CD 28) e *Peçonha Potente*
- **AND** token texture is `modules/compendios-para-t20/assets/tokens/basilisco-ancestral.png`

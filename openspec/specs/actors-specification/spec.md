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

### Requirement: Dragão Brasil #230 Canonical Threat Integration
All 14 threats from Dragão Brasil #230 (*Zangão do Pesadelo ND 5*, *Coletor do Pesadelo ND 6*, *Ceifador do Pesadelo ND 8*, *Pesadelo Polivalente ND 10*, *Mestre do Pesadelo ND 15*, *Lanceiro Onírico ND 2*, *Ginete Onírico ND 3*, *Sargento Onírico ND 4*, *Tenente Onírico ND 6*, *Nócnam Mur ND 18*, *Sacerdote Caído ND 5*, *Três Goblins em um Gorlogg ND 7*, *Arzak ND 8*, *Gaardak ND 8*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`) and mirrored in `src/packs/Ameacas_T20/`. Each threat MUST possess 34 skills calculated with the standard formula, dynamic defense base (`base + des = value`), complete movement object, complete traits and condition immunities, and exclusive top-down tokens from 2-Minute Tabletop.

#### Scenario: Criaturas do Pesadelo schema validation
- **GIVEN** the 10 nightmare creatures and dream mercenaries from DB #230
- **WHEN** the actor documents are validated
- **THEN** type is `npc`, folder is `wfWApuyngzFm4KOP`
- **AND** all creatures possess Mente Alienígena, Fome de Sonhos, or unique nightmare abilities with functional DCs
- **AND** tokens use 2-Minute Tabletop artwork under `modules/compendios-para-t20/assets/tokens/`
- **AND** biographies include descriptive introductory lore with double quotes in italics

#### Scenario: Corrida Brutal threats schema validation
- **GIVEN** the 4 threats from Breves Jornadas: Corrida Brutal (*Sacerdote Caído*, *Três Goblins em um Gorlogg*, *Arzak*, *Gaardak*)
- **WHEN** the actor documents are validated
- **THEN** types, sizes, roles, and NDs match the published stat blocks
- **AND** natural and weapon attacks contain structured `rolls.parts`
- **AND** tokens use 2-Minute Tabletop artwork

### Requirement: Dragão Brasil #231 Canonical Threat Integration
All 10 threats from Dragão Brasil #231 (6 from *A Vastidão Dourada de Halak-Tûr*: *Arraia-Seca ND 3*, *Anshira ND 9*, *Caçador de Condenados ND 11*, *Constritora Arenosa ND 9*, *Ressecado Saqueador ND 4*, *Ressecado Líder ND 4*; and 4 from *Breves Jornadas: Circo Sombrio*: *Bianco ND 2*, *Rojo ND 2*, *Mantícora Zumbi ND 3*, *Morrise ND 3*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`). Each threat MUST possess strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`), 34 skills under `system.pericias`, dynamic defense base (`defesa.base + des === defesa.value`), complete attributes, subdocument items under `!actors.items!actorId.itemId`, attacks modeled as weapon items with structured `rolls.parts` including damage types, biographies with canonical double blockquotes (`#800000` and `#006400`), and dedicated top-down tokens from 2-Minute Tabletop.

#### Scenario: Halak-Tûr desert threats schema validation
- **GIVEN** the 6 desert threats from Halak-Tûr (*Arraia-Seca*, *Anshira*, *Caçador de Condenados*, *Constritora Arenosa*, *Ressecado Saqueador*, *Ressecado Líder*)
- **WHEN** actor documents and subdocuments are validated
- **THEN** type is `npc`, folder is `wfWApuyngzFm4KOP`
- **AND** primary IDs have exactly 16 characters
- **AND** all special abilities (Armadilha de Ferrão, Refúgio Rochoso, Simbiose Rochosa, Sequência Mortal, Constrição, Celeridade Odiosa, Ordens Letais) have valid descriptions and formulas
- **AND** Anshira possesses 9th level spellcasting with CD 32
- **AND** tokens reference valid files under `modules/compendios-para-t20/assets/tokens/`

#### Scenario: Circo Sombrio threats schema validation
- **GIVEN** the 4 threats from Breves Jornadas: Circo Sombrio (*Bianco*, *Rojo*, *Mantícora Zumbi*, *Morrise*)
- **WHEN** actor documents and subdocuments are validated
- **THEN** roles, sizes, NDs and defenses match the magazine text
- **AND** Morrise's spells and whip attacks contain dark damage in `rolls.parts`
- **AND** Mantícora Zumbi possesses rotting quills and flight movement
- **AND** Rojo has Cascudo DR 5 and Bianco has sneak attack +2d6

### Requirement: Canonical Actor Schema & Traits Enforcement
Every actor in `packs/Ameacas_T20` SHALL adhere strictly to the Tormenta20 system DataModel for damage resistances, immunities, vulnerabilities, condition immunities, and situational skills.

#### Scenario: Damage immunities and vulnerabilities
- **GIVEN** an actor with published immunities or vulnerabilities (e.g. Ressecado with cold immunity and fire vulnerability)
- **WHEN** `system.tracos.resistencias[damageType]` is evaluated
- **THEN** `imunidade` is `true` for each immune damage type
- **AND** `vulnerabilidade` is `true` for each vulnerable damage type
- **AND** damage reduction values are recorded in `value` and `base`
- **AND** exception rules (such as `/mitral` or `/mágico`) are described in `system.detalhes.resistencias`

#### Scenario: Condition immunities
- **GIVEN** an actor with condition or effect immunities (e.g. mental effects, poison, paralysis, fear)
- **WHEN** `system.tracos.ic` is evaluated
- **THEN** standard conditions exist in the `system.tracos.ic.value` array
- **AND** special descriptors are recorded in `system.tracos.ic.custom`

#### Scenario: Situational and conditional skills
- **GIVEN** an actor with situational skill modifiers (e.g. *Furtividade +11 (+16 em desertos)*)
- **WHEN** `system.pericias` is inspected
- **THEN** standard skill retains the base trained value
- **AND** an auxiliary skill key with `custom: true`, appropriate attribute, and descriptive label (e.g. `Furtividade (Deserto)`) contains the full situational value and difference in `outros`

#### Scenario: Spellcasting actors individual spell items
- **GIVEN** an actor with spellcasting abilities (e.g. Anshira, Morrise, Sacerdote Caído, Bianco)
- **WHEN** actor items are enumerated
- **THEN** each individual spell is represented by an item of type `magia`
- **AND** each spell item defines `circulo` (number), `tipo` (`arc`, `div`, `uni`), `escola` (valid T20 school code), `ativacao`, `resistencia`, and `description.value`
- **AND** no generic text bundle replaces true spell items

#### Scenario: Free-text resistances field full verbatim population
- **GIVEN** any actor with resistances, immunities, or vulnerabilities published in its statblock
- **WHEN** `system.detalhes.resistencias` is evaluated
- **THEN** it contains the exact, integral, verbatim string from the publication (e.g. `imunidade a frio, redução de corte e perfuração 5, vulnerabilidade a fogo`)
- **AND** this text is populated even if partially redundant with `system.tracos.resistencias` so the Foundry VTT sheet header renders completely

#### Scenario: Atomic abilities and powers without aggregation
- **GIVEN** an actor statblock with multiple distinct named abilities (e.g. *Celeridade Odiosa* and *Ódio aos Vivos*, or *Estratégia do Medo* and *Fome de Sonhos*)
- **WHEN** the actor's item subdocuments are constructed
- **THEN** each bolded ability header from the statblock is represented as an individual, atomic item of type `poder`, `magia`, or `arma`
- **AND** distinct abilities are never combined into a single composite power name

### Requirement: Dragão Brasil #232 Canonical Threat Integration
All 15 threats from Dragão Brasil #232 (10 from *Licantropos Artonianos*: *Lobisomem Predador Urbano ND 4*, *Lobisomem Caçador de Recompensas ND 9*, *Licantropo Rato Comedor de Restos ND 1*, *Licantropo Rato Infiltrador Veterano ND 4*, *Licantropo Onça Pirata de Rio ND 7*, *Licantropo Onça Lutador de Arena ND 11*, *Licantropo Texugo Furioso ND 5*, *Licantropo Texugo Servo da Noite ND 8*, *Licantropo Selako Farejador de Sangue ND 3*, *Licantropo Selako Terror dos Mares ND 9*; and 5 from *Breves Jornadas: Monstros e Homens*: *Mamãe Glop ND 2*, *Estirge ND 1*, *Perdigueiro Troll ND 1*, *Ginete de Troll Purista ND 2*, *Xamã Finntroll ND 2*) SHALL be stored in `packs/Ameacas_T20` inside the canonical folder *Dragão Brasil* (`wfWApuyngzFm4KOP`). Each threat MUST possess strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`), 34 skills under `system.pericias`, dynamic defense base (`defesa.base + des === defesa.value`), complete attributes, subdocument items under `!actors.items!actorId.itemId`, atomic powers without aggregation, individual spell items for spellcasters, verbatim integral text in `system.detalhes.resistencias`, and dedicated top-down tokens from 2-Minute Tabletop.

#### Scenario: Licantropos threats schema validation
- **GIVEN** the 10 lycanthrope threats from Licantropos Artonianos
- **WHEN** the actor documents are validated
- **THEN** each threat defines damage reduction 5/mitral or 10/mitral in `system.detalhes.resistencias`
- **AND** `system.detalhes.resistencias` contains the complete verbatim text of resistances and vulnerabilities
- **AND** situational skills (e.g. Adestramento with specific animal species, Furtividade in hybrid forms, Sobrevivência underwater) are stored as custom skills with `custom: true`
- **AND** all special abilities (Aversão a Mitral, Maldição da Licantropia, etc.) are atomic individual powers

#### Scenario: Monstros e Homens threats schema validation
- **GIVEN** the 5 threats from Breves Jornadas: Monstros e Homens
- **WHEN** the actor documents are validated
- **THEN** Xamã Finntroll defines 4 individual spell items of type `magia` (*Amedrontar*, *Curar Ferimentos*, *Escudo da Fé*, *Perdição*) with valid circles, divine type, and schools
- **AND** Mamãe Glop defines Meiose Glópica and Glops Filhinhos as atomic powers
- **AND** Estirge defines Chupar Sangue and Sangrar as atomic powers
- **AND** Perdigueiro Troll defines Natureza Vegetal and Derrubar as atomic powers
- **AND** Ginete de Troll Purista defines Corcel Troll, Investida Atroz, and Ódio Puro as atomic powers

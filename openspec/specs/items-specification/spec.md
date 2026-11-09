# items-specification Specification

## Purpose
The items-specification capability defines the authoritative specification and quality contracts for creating and validating all Item documents (Combat Powers, General Powers, Spells, Weapons, Armors, Shields, Consumables, and Magic Items) in the Tormenta20 system for Foundry VTT within the compendios-para-t20 repository.

## Requirements

### Requirement: General and Combat Powers Schema
Every power item SHALL conform to the Tormenta20 Item Creator Macro V8 schemas. Powers MUST specify `system.tipo: "geral"`, a valid `system.subtipo` (`combate`, `concedido`, `tormenta`, `destino`, `magia`, `distincao`, or `origem`), execution action type (`padrao`, `movimento`, `reacao`, `livre`, or `passiva`), PM activation cost, prerequisites, and cleanly formatted HTML description faithfully reproducing the verbatim text from the source PDF. Artificial, invented, or homebrew roleplay quotes and decorative blockquotes MUST NOT be injected into `system.description.value` or `system.chatFlavor`.

#### Scenario: Creating a combat power from Caverna do Saber
- **GIVEN** a new combat power published in Dragão Brasil
- **WHEN** the item document is constructed
- **THEN** `system.tipo` is set to `geral`
- **AND** `system.subtipo` is set to `combate`
- **AND** `system.ativacao.execucao` and `system.ativacao.custo` reflect the published rule text
- **AND** `system.description.value` contains the verbatim PDF description text with prerequisites in bold
- **AND** `system.chatFlavor` is empty unless the published source explicitly provides flavor text

### Requirement: Equipment, Weapons, Shields, and Armors
Manufactured and natural weapons, armors, and shields SHALL define complete combat statistics including equipment slot, hands required (`empunhadura`), damage die, damage type (`corte`, `perfuracao`, `impacto`, etc.), critical threat range (`criticoM`) and multiplier (`criticoX`), defense bonus, armor penalty (`penalidade`), range category, and `description` faithful to the official PDF. Weapon items MUST include `rolls` with structured `parts` for attack rolls (`ataque0`) and damage rolls (`dano1`).

#### Scenario: Registering a two-handed manufactured weapon
- **GIVEN** a weapon item such as Espada Bastarda or Machado de Guerra
- **WHEN** the equipment document is saved in `packs/Itens_T20`
- **THEN** `type` is set to `arma`
- **AND** `system.empunhadura` is set to `duas` or `uma`
- **AND** `system.critico` contains numeric threat range and multiplier
- **AND** `system.dano` includes valid dice formula and damage type
- **AND** `system.criticoM` and `system.criticoX` are numeric properties on the system root
- **AND** `system.rolls` contains `ataque0` and `dano1` with valid `parts` arrays
- **AND** `system.description.value` contains the verbatim description from the source publication

### Requirement: Spell Schema and Enhancements
Every Spell document SHALL specify its circle (`circulo`: 1 to 5), tradition (`tipo`: `arcana`, `divina`, or `universal`), school (`escola`: `abjuracao`, `convocacao`, `adivinhacao`, `encantamento`, `evocacao`, `ilusao`, `necromancia`, `transmutacao`), range, duration, target, resistance saving throw, and structured enhancements (`system.aprimoramentos`) with incremental PM costs and conditional effect descriptions.

#### Scenario: Spell item with circle and enhancements
- **GIVEN** a spell from Tormenta20 JdA or Dragão Brasil
- **WHEN** the spell item document is created
- **THEN** circle is integer from 1 to 5
- **AND** saving throw target attribute and effect (half, none, negate) are populated
- **AND** each enhancement entry defines cost in PM and mechanical modification

### Requirement: Active Effects and System Automation Flags
Items providing persistent passive bonuses, condition triggers, or temporary modifications SHALL define Active Effects with explicit changes targeting canonical Tormenta20 system keys (`system.attributes.pm.max`, `system.modificadores.defesa.outros`, `system.pericias.<key>.bonus`, `system.tracos.resistencias.<type>.base`), change modes (Add, Multiply, Upgrade, Override), transfer mode (`transfer: true`), and system transfer flag `flags.tormenta20.transfer: true`.

In ClassicLevel compendiums (`packs/Itens_T20`):
- The parent Item document `item.effects` MUST strictly store an array of string IDs (`effects: ["effId1", ...]`).
- Under NO circumstance SHALL ActiveEffect objects be embedded inline in the parent document's `effects` array, as inline objects break LevelDB indexing and fail to instantiate in Foundry VTT sheets.
- The full ActiveEffect document MUST be stored at the dedicated child key in LevelDB:
  `!items.effects!${itemId}.${effId}`
- The ActiveEffect schema MUST follow the canonical Tormenta20 `BaseEffect` DataModel: `_id: effId`, `name: string`, `type: "base"`, `system: { identifier: string, targets: ['self'], status: null, abilityUse: { description, automatic: true, aumenta: false, custo: 0, names: [], types: [] } }`, `changes: [...]`, `transfer: true`, `origin: item.name`, `priority: 20`, and `flags.tormenta20: { transfer: true, duration: "passivo", origin: item.name, priority: 20 }`.
- In the source tree (`src/packs/Itens_T20/`), the serialized JSON MUST retain `_subdocuments: { effects: [effObj, ...] }` for bidirectional sync with LevelDB.

#### Scenario: Power granting bonus to Defense and Reflexes
- **GIVEN** a combat power like Esquiva II or Costas Largas II
- **WHEN** the item is equipped or added to an actor
- **THEN** embedded active effects define key targets like `system.modificadores.defesa.outros`
- **AND** `flags.tormenta20.transfer` is set to `true` to ensure automatic calculation on the sheet
- **AND** each effect has valid `changes` pointing to canonical system keys
- **AND** `item.effects` in the parent document stores only string IDs, while the child subdocument exists under `!items.effects!${itemId}.${effId}`

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

### Requirement: Dragão Brasil #229 Partners and Items Integration
All Partners from Dragão Brasil #229 (*Arius Gorgonius Dubitatius*, *Aylarianna Purpúrea*, *Ignis Crae*, *Kir’zanaath Odello*, *Rexthor*, *Defensor Rochoso Desperto*, *Kemooz Pensativo*, *Filhote de Grifo*) SHALL be created strictly as Items of type `poder` with `system.subtipo: "parceiro"` within the canonical folder *Parceiros* (`0uRx5Efj3tk7P5Xr`) in `packs/Itens_T20`. All descriptions MUST contain the verbatim text published in the official magazine PDF. ActiveEffects MUST follow the canonical Foundry VTT ClassicLevel subdocument architecture with BaseEffect data model schemas.

#### Scenario: Cães das Colinas Special Partners with tiered ActiveEffects
- **GIVEN** a special partner from Os Cães das Colinas (Arius, Ayla, Ignis, Kiki, or Rexthor)
- **WHEN** the item document is persisted in `Itens_T20`
- **THEN** type is `poder`, subtipo is `parceiro`, folder is `0uRx5Efj3tk7P5Xr`
- **AND** `effects` array contains the string IDs of the active effects
- **AND** persistent LevelDB subdocuments exist under `!items.effects!${itemId}.${effId}`
- **AND** effects provide the appropriate numerical modifiers for skills, defense, damage, or resistance

#### Scenario: Adventure Items and Poisons from O Olho do Basilisco
- **GIVEN** an item, raw material, weapon, or poison from O Olho do Basilisco
- **WHEN** the document is created in `Itens_T20`
- **THEN** *Machado de Batalha do Culto do Basilisco* has type `arma` with structured `rolls.parts`
- **AND** *Peçonha Concentrada* and *Peçonha Potente* have type `consumivel` in folder *Venenos* (`pJFxHpqcoNgiVRuo`)
- **AND** *Couro de Basilisco Ancestral* is in folder *Itens Superiores* (`qrF7mpfmMVo41wkr`) with value T$ 2.000
- **AND** *Olho de Basilisco Ancestral* is created with full description of its ritual properties

### Requirement: Dragão Brasil #230 Canonical Items and Partners Integration
All items, partners, and powers from Dragão Brasil #230 SHALL be stored in `packs/Itens_T20` with deterministic static IDs, mirrored in `src/packs/Itens_T20/`, with subdocuments stored in `!items.effects!itemId.effectId`. Partners MUST be registered as `type: "poder"` and `system.tipo: "parceiro"`.

#### Scenario: Parceira Rotsheel schema validation
- **GIVEN** the partner Rotsheel from Corrida Brutal
- **WHEN** the item document is validated
- **THEN** type is `poder`, subtipo is `parceiro`, partner tier is `veterano` (combatente)
- **AND** item effects contain active modifiers for attack bonuses and threat margin
- **AND** folder matches the canonical *Parceiros* folder (`0uRx5Efj3tk7P5Xr`)

#### Scenario: Veículos, Equipamentos e Consumíveis schema validation
- **GIVEN** the adventure gear from DB #230 (*Carruagem Duyshidakk*, *Machado do Campeão de Tyrondir*, *Kum'shrak Eviscerador*, *Centelha Onírica*, e poderes de *Sonhos Roubados*)
- **WHEN** the documents are validated
- **THEN** their types (`equipamento`, `arma`, `consumivel`, `poder`) match the T20 system data model
- **AND** verbatim textual descriptions match the DB #230 publication

### Requirement: Dragão Brasil #231 Canonical Items, Classes, Powers, and Origins
All powers, variant class features, hunter powers, regional origins, variant races, and items from Dragão Brasil #231 SHALL be stored in `packs/Itens_T20` inside appropriate canonical folders with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`), complete descriptions under `system.description.value`, and active effects formatted according to the canonical ClassicLevel architecture.

#### Scenario: Miragem Variant Class and Hunter Powers
- **GIVEN** the Miragem variant class and its 5 new hunter powers
- **WHEN** the item documents are validated in `packs/Itens_T20`
- **THEN** Dança da Areia, Cortina de Poeira, Passo do Deserto, Mestre do Deserto, Arsenal do Deserto, Escaramuça Distante, Passo Duplo, Passos Precisos, and Tesouros da Natureza exist as powers with correct action and PM costs
- **AND** their primary IDs have strictly 16 characters

#### Scenario: Regional Origins and Variant Race
- **GIVEN** Criança do Crepúsculo, Nascido nas Estepes, Nômade Ferani, and Sahiri racial traits (Animar Rochas, Proteção da Terra)
- **WHEN** the origin and power documents are inspected
- **THEN** origins specify skill trainings, benefits, and starting equipment
- **AND** Sahiri powers correctly replace Amiga das Plantas and Armadura de Allihanna

#### Scenario: Special Equipment and Relics
- **GIVEN** Presa de Ônix and Símbolo Sagrado de Azgher
- **WHEN** the items are validated
- **THEN** types, prices, and special properties match the published descriptions

### Requirement: Canonical Spell Item Schema & Classification
All spells created in `packs/Itens_T20` or embedded in actors SHALL comply with the Tormenta20 `SpellData` specification.

#### Scenario: Spell attributes schema compliance
- **GIVEN** a spell item of type `magia`
- **WHEN** the item document is validated
- **THEN** `system.circulo` is an integer between 1 and 5
- **AND** `system.tipo` is one of `arc`, `div`, or `uni`
- **AND** `system.escola` is one of `abj`, `adv`, `con`, `enc`, `evo`, `ilu`, `nec`, `tra`
- **AND** `system.ativacao.execucao` is one of `action`, `reaction`, `move`, `full`, `free`, `passive`
- **AND** `system.ativacao.custo` matches the circle or published PM cost
- **AND** `system.description.value` contains the full formatted spell text

### Requirement: Dragão Brasil #232 Canonical Lycanthropy Items and Powers
All lycanthropy powers, destiny powers, hybrid forms, and beast forms from Dragão Brasil #232 SHALL be stored in `packs/Itens_T20` inside appropriate canonical folders with strictly 16-character alphanumeric primary IDs (`/^[a-zA-Z0-9]{16}$/`), complete descriptions under `system.description.value`, and structured active effects.

#### Scenario: Controlar Licantropia destiny power
- **GIVEN** the destiny power Controlar Licantropia published in DB #232
- **WHEN** the item document is validated
- **THEN** type is `poder`, subtipo is `destino`
- **AND** action cost is full action, 3 PM
- **AND** description details the roll two dice on Will saves and druid Wild Shape compatibility

#### Scenario: Lycanthrope beast and hybrid form powers
- **GIVEN** the beast forms (Lobo, Onça, Rato, Selako, Texugo) and hybrid form
- **WHEN** the powers are validated in `packs/Itens_T20`
- **THEN** each form exists as an individual power with distinct mechanical benefits and natural attacks

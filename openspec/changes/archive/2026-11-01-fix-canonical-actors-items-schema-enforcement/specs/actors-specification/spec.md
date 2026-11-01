# Spec Delta: actors-specification

## MODIFIED Requirements

### Requirement: Canonical Threat and NPC Data Schema
Every Actor of type `npc` SHALL conform strictly to the Tormenta20 Foundry VTT system data model and canonical Threat Creator Macro v6 specifications. Each threat MUST include structured details (`nd`, `role`, `tipo`, `tamanho`), complete ability scores (`for`, `des`, `con`, `int`, `sab`, `car`) with `value`, `base`, `racial: 0`, and `bonus: 0`, core attributes (`pv`, `pm`, `defesa`, `cd`), full movement speeds object (`walk`, `burrow`, `climb`, `fly`, `swim`, `hover: false`, `unit: "m"`), and biography formatted with dual blockquotes.

#### Scenario: Creating a canonical threat actor
- **GIVEN** a threat defined in an official Tormenta20 publication or Dragão Brasil
- **WHEN** the actor document is constructed
- **THEN** details contain valid `nd`, `papel` (solo, lacaio, padrao), `tipo`, and `tamanho`
- **AND** ability scores and attributes are strictly formatted with numeric `value` and `max` fields
- **AND** biography contains formatted HTML blockquotes without unescaped raw markup

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

## ADDED Requirements

### Requirement: All Template Variables Mandatory
All Actor documents SHALL include 100% of the variables defined in the canonical Tormenta20 actor templates. Fields without a specific value MUST NOT be omitted; they SHALL receive their typed default (`0`, `""`, `null`, `false`, `[]`, or `{}`) according to the schema.

#### Scenario: Validating actor document against omitted fields
- **GIVEN** an actor document constructed for `Ameacas_T20`
- **WHEN** the document schema is inspected
- **THEN** no standard template variable is `undefined`
- **AND** `system.atributos` has all 6 attributes with full sub-properties
- **AND** `system.attributes.defesa` has `atributo`, `pda`, `value`, `base`, `outros`, `condi`
- **AND** `system.pericias` has all 34 skills with complete property dictionaries

# Spec Delta: actors-specification

## ADDED Requirements

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

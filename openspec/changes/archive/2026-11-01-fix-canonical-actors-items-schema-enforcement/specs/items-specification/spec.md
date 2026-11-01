# Spec Delta: items-specification

## MODIFIED Requirements

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

### Requirement: Active Effects and System Automation Flags
Items providing persistent passive bonuses, condition triggers, or temporary modifications SHALL define Active Effects with explicit changes targeting canonical Tormenta20 system keys (`system.attributes.pm.max`, `system.attributes.defesa.outros`, `system.pericias.<key>.outros`, `system.tracos.resistencias.<type>.base`), change modes (Add, Multiply, Upgrade, Override), transfer mode (`transfer: true`), and system transfer flag `flags.tormenta20.transfer: true`.

#### Scenario: Power granting bonus to Defense and Reflexes
- **GIVEN** a combat power like Esquiva II or Costas Largas II
- **WHEN** the item is equipped or added to an actor
- **THEN** embedded active effects define key targets like `system.attributes.defesa.bonus`
- **AND** `flags.tormenta20.transfer` is set to `true` to ensure automatic calculation on the sheet
- **AND** each effect has valid `changes` pointing to canonical system keys

## ADDED Requirements

### Requirement: Complete Template Schema for All Item Types
Every Item document regardless of type (`arma`, `equipamento`, `poder`, `magia`, `consumivel`, `tesouro`) SHALL retain 100% of the variables defined in the canonical Tormenta20 item templates. Optional or non-applicable fields MUST NOT be omitted; they SHALL be populated with typed default values (`0`, `""`, `null`, `false`, `[]`, or `{}`).

#### Scenario: Validating item document against omitted fields
- **GIVEN** an item document constructed for `Itens_T20`
- **WHEN** the document schema is inspected
- **THEN** no standard template variable is `undefined`
- **AND** `system.description.value` contains formatted HTML description
- **AND** all general attributes (`peso`, `espacos`, `qtd`, `preco`, `equipado`) are present
- **AND** type-specific sub-objects (`upgrades`, `propriedades`, `rolls`, `effects`) are initialized

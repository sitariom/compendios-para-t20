# Spec Delta: items-specification

## ADDED Requirements

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

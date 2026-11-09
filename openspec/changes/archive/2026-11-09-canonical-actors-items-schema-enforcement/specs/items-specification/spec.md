# Spec Delta: items-specification

## ADDED Requirements

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

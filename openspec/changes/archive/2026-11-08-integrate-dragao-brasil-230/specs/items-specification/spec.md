# Spec Delta: items-specification

## ADDED Requirements

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

# Spec Delta: items-specification

## ADDED Requirements

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

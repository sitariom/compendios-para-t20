# Spec Delta: actors-specification

## ADDED Requirements

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

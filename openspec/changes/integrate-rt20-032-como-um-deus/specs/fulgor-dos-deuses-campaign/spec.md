## ADDED Requirements

### Requirement: Canonical Threat Actors and Hazards of Fúlgor dos Deuses Edition 32
All canonical threats and complex hazards from Edition 32 (*Como um Deus*) SHALL reside in `rt20-032-ameacas` under `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-32/rt20-032-ameacas` with 16-char `fld32*` IDs, 34+ skills, dynamic defense base, atomic abilities, individual spells for Eucharion, embedded physical equipment (`equipado: false`), and 2-Minute Tabletop transparent tokens (`1x1` Medium, `4x4` Colossal).

#### Scenario: Turba Enfurecida, Vigia da Devolução, Lysenne, and Eucharion schema validation
- **GIVEN** the four Edition 32 threats (`Turba Enfurecida` ND 10, `Vigia da Devolução` ND 7, `Lysenne de Eucharion` ND 10, `Eucharion do Fullgor` ND 13)
- **WHEN** the actor documents are validated
- **THEN** Turba Enfurecida is Colossal (`4x4`), defense 32, PV 120, `[bando] Ataque desarmado x2 +34 (2d6+5)`, and `ofic_fazendeiro` custom skill
- **AND** Vigia da Devolução has defense 28, PV 60, RD 5, `Dois manguais +24 (2d8+11)`, and embedded armor/holy symbol (`equipado: false`)
- **AND** Lysenne de Eucharion has defense 36 (`base 31 + Des 5`), PV 400, PM 45, `Duas espadas longas +28 (2d8+15, 18)`, and embedded armor/holy symbol (`equipado: false`)
- **AND** Eucharion do Fullgor is Colossal (`4x4`), defense 42, PV 455, PM 101, CD 37, RD 10, `maior que a morte`, and 8 individual spell items

### Requirement: Edition 32 Artifact, Granted Power, Partner, Journal, Roll Tables, and Macro
`rt20-032-equipamentos` SHALL contain `Pingente da Gratidão Pura (Artefato de Eucharion)` and `Estilhas Cristalinas do Fullgor (Edição 32)`, `rt20-032-poderes` SHALL contain `Dívida Sagrada` and `Parceira: Lysenne de Eucharion`, `rt20-032-diarios` SHALL contain the 7-page adventure journal, `rt20-032-tabelas` SHALL contain 3 roll tables (10, 10, 10 results), and `rt20-032-macros` SHALL contain the Edition 32 tracker macro.

#### Scenario: Validating Edition 32 compliance suite
- **GIVEN** the Edition 32 documents across `rt20-032-*`
- **WHEN** `npm run validate:fullgor32` executes
- **THEN** all actors, hazards, items, 7-page journal, 3 tables, and macro pass with 0 errors

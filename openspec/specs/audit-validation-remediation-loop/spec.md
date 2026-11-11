# audit-validation-remediation-loop Specification

## Purpose
The audit-validation-remediation-loop capability defines the authoritative specification, operational protocols, and quality contracts governing the continuous Audit, Validation, and Remediation Loop (AVRL) for all Foundry VTT compendiums, actors, items, journals, tables, and scripts in the compendios-para-t20 repository.

## Requirements

### Requirement: Zero-Tolerance Database Structural Audit Gate
All 6 compendium packs (`Ameacas_T20`, `Itens_T20`, `Macros_T20`, `Tabelas_T20`, `Diarios_T20`, `Playlist_T20`) SHALL pass the automated structural audit suite `npm run audit` (`scripts/audit.js`) with zero errors prior to any branch merge or release generation. The audit MUST verify that every record parses cleanly as JSON, possesses a valid 16-character alphanumeric `_id`, belongs to an existing non-orphan folder, adheres to canonical ClassicLevel root namespaces (`!actors!`, `!items!`, `!macros!`, `!tables!`, `!journal!`, `!playlists!`, `!folders!`), and maintains intact composite keys for embedded subdocuments (`!actors.items!`, `!actors.items.effects!`, `!journal.pages!`, `!tables.results!`). Image sources MUST be inventoried and unbundled local dependencies flagged.

#### Scenario: Running structural database audit
- **GIVEN** compendium databases stored in `packs/`
- **WHEN** `npm run audit` (or `node scripts/audit.js`) executes
- **THEN** all 6 packs report 0 JSON serialization errors
- **AND** 0 documents are missing an `_id`
- **AND** 0 documents reference orphan or nonexistent folders
- **AND** all subdocument keys correspond to valid parent documents
- **AND** the process exits with status code 0

### Requirement: Threat Sheet DataModel Fidelity and Semantic Validation
All Actor documents in `packs/Ameacas_T20` SHALL pass the automated deep fidelity suite `npm run validate:fidelity` (`scripts/validate-threat-sheet-fidelity.js`) with 100% approval. The validation MUST enforce strict compatibility with the Tormenta20 Foundry VTT DataModel (`actor-npc.mjs`, `WeaponData`, `SpellData`). Attacks with missile or projectile weapons (Besta, Arco, Pistola, Espinhos) MUST define `system.proposito: "disparo"` and `system.tipo: "disparo"`, and thrown attacks MUST define `system.proposito: "arremesso"`, ensuring `i.ranged === true` and correct rendering on the threat combat sheet. Defense base MUST equal `defesa_ficha - destreza` to prevent duplicate Dexterity addition. All 34 skills MUST be present with `.value` reflecting the official statblock bonus and `.outros` storing the derived difference. Resistances MUST feature verbatim text in `system.detalhes.resistencias` alongside boolean flags in `system.tracos.resistencias`. Special abilities MUST be atomic items, spellcasters MUST have individual `magia` items, and prototype tokens MUST exclusively use 2-Minute Tabletop assets.

#### Scenario: Validating threat sheet DataModel fidelity
- **GIVEN** threat actors in `packs/Ameacas_T20`
- **WHEN** `npm run validate:fidelity` executes
- **THEN** missile attacks are strictly verified as `proposito: 'disparo'` or `'arremesso'`
- **AND** defense calculations are verified against `defesa.base + @des === defesa.value`
- **AND** skill values and training statuses match official statblocks
- **AND** resistance descriptions are verified as non-empty verbatim text
- **AND** atomic power separation and individual spell items are validated
- **AND** prototype tokens are verified as valid 2-Minute Tabletop PNG paths
- **AND** 0 errors are found across all audited actors

### Requirement: Edition-Specific Canonical Compliance Verification
Whenever materials from official Tormenta20 publications or Dragão Brasil editions (e.g. DB #227 through #232) are added or modified, they SHALL pass their respective dedicated compliance validator (`node scripts/validate-db<NUM>-compliance.js`). Each compliance suite MUST cross-check every published actor, item, journal page, and roll table against the primary source material, asserting ND, role, size, attributes, PV, PM, defense, speeds, full 34 skills, attack roll formulas, damage types, special abilities, spell DC, and journal subdocuments. Past compliance suites SHALL be executed as regression tests to prevent schema degradation.

#### Scenario: Running regression and edition compliance suites
- **GIVEN** changes introduced to compendiums or injection scripts
- **WHEN** edition-specific validation scripts (`validate-db227` through `validate-db232`) execute
- **THEN** all published threats, items, powers, journals, and tables are validated against their canonical definitions
- **AND** every assertion completes successfully with 0 errors
- **AND** no regression in previously certified editions is introduced

### Requirement: Automated Remediation and Correction Cycle
When any phase of the audit or validation loop detects an error, anomaly, or schema non-compliance, the developer or agent SHALL execute the structured remediation protocol before repeating the audit. Remediations SHALL utilize dedicated tooling: `scripts/create-entry.js` and `scripts/icon-resolver.js` for icon harmonization and entity construction; dedicated injector/rebuilder scripts (`inject-db<NUM>-*.js`, `rebuild-*.js`) for atomic updates; and working tree hygiene routines (`git checkout -- packs/` and `git clean -fd packs/`) to discard ephemeral LevelDB lock or compaction artifacts when no substantive data mutation occurred. Re-validation MUST be performed after every remediation until 100% compliance is certified.

#### Scenario: Executing the remediation and revalidation cycle
- **GIVEN** an audit or validation finding identifying an invalid property, unmapped icon, or missing subdocument
- **WHEN** the appropriate rebuilder or remediation script is executed
- **THEN** the defect is surgically corrected in the LevelDB database or source files
- **AND** `npm run audit` and `npm run validate:fidelity` are re-executed
- **AND** the suite transitions to 100% passing state before any commit or release packaging

### Requirement: CodeGraph AST Knowledge Graph Synchronization
All scripts involved in the audit, validation, remediation, packing, unpacking, and injection processes SHALL be indexed in the CodeGraph semantic AST knowledge graph (`.codegraph/codegraph.db`). After any addition, refactoring, or modification of JavaScript scripts in `scripts/`, `codegraph sync` SHALL be executed to update file nodes, functions, constants, and dependency call edges. The CodeGraph database MUST be maintained clean and ready for semantic exploration (`codegraph explore`, `codegraph query`) by all sub-agents.

#### Scenario: Synchronizing CodeGraph after script updates
- **GIVEN** modified or newly created automation or validation scripts in `scripts/`
- **WHEN** `npx codegraph sync` executes
- **THEN** the AST database in `.codegraph/` is updated with fresh nodes and call relationships
- **AND** `npx codegraph status` reports the index as up to date
- **AND** subsequent queries over validation functions return accurate source line references

### Requirement: Iterative Multi-Pass Auto-Remediation Loop and Lifecycle Hooks
The AVRL pipeline SHALL support multi-pass iterative execution (`scripts/avrl-runner.js`, `npm run avrl`) repeating audit and remediation passes until 100% convergence is attained (0 errors and 0 pending fixes) or maxRetries is reached. Entity generation tooling SHALL invoke automated lifecycle hooks upon creation of any Actor, Item, Journal, Table, or Macro prior to persistence. These hooks MUST inspect and enforce valid 2-Minute Tabletop token textures, dynamic defense base (`base = value - des`), 34 skills, ActiveEffects for numeric modifiers, weapon purposes, and LevelDB composite keys.

#### Scenario: Running multi-pass auto-remediation loop
- **GIVEN** compendiums with pending entity additions or potential schema discrepancies
- **WHEN** `npm run avrl` executes across multiple iterations
- **THEN** each pass applies automated remediations to detected anomalies
- **AND** re-audits the database until 0 errors remain
- **AND** terminates successfully upon full convergence


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


### Requirement: Spell, Power and Roll Schema Fidelity Gate
Every Actor-embedded `magia`, `poder`, `arma`, and `consumivel` created or adapted in the repository (`gq8*`, `fld*`, `STRICT_ACTOR_IDS`, and monitored editions) SHALL conform to the Tormenta20 DataModel (`module/dataModel/item/`, `CONFIG.T20`) and the canonical guides in `referencias_criacao_itens_atores_t20/`. `RollData.type` MUST be one of `ataque`, `dano` or `formula`; healing MUST be expressed as `type: "dano"` with damage type `curapv` (never `type: "cura"`). Damage types MUST use `CONFIG.T20` keys without accents (`perfuracao`, `acido`, `essencia`, `psiquico`). `duracao.units` MUST be one of `inst`, `scene`, `turn`, `round`, `sust`, `minute`, `hour`, `day`, `month`, `year`, `perm`, `special`. `alcance` and `range.units` MUST be one of `none`, `self`, `touch`, `short`, `medium`, `long`, `spec`, `any`, `m`, `km`. `ativacao.execucao` MUST be one of `passive`, `action`, `move`, `full`, `reaction`, `free`, `minute`, `hour`, `day`, `special`. `poder.system.tipo` MUST be a valid `T20.powerType` key (never `"poder"`), and `arma.system.equipado` MUST be numeric (`0 | 1 | 2`). Any `magia` or `poder` in `STRICT_ACTOR_IDS` whose description cites damage or healing dice MUST carry a non-empty `rolls[]`. Abilities with a saving throw MUST fill `resistencia.pericia`, `resistencia.atributo` and `resistencia.txt`, and the Actor `system.attributes.cd` MUST equal the official statblock CD (NPC items inherit it in `prepareFinalAttributes`). ActiveEffects MUST conform to `BaseEffect` (`type: "base"`, `img`, `system.identifier`, `targets`, `abilityUse`, `aura`, `upgrade`) and target valid Tormenta20 paths (`system.modificadores.ataque.geral`, `system.modificadores.dano.cac`, `system.modificadores.pericias.geral`, `system.modificadores.pericias.resistencia`, `system.tracos.resistencias.dano.bonus`, `system.attributes.defesa.bonus`).

#### Scenario: Spell with dice in its description has no rolls
- **GIVEN** an embedded `magia` whose description cites `4d8+4 pontos de dano de trevas` and whose `rolls[]` is empty
- **WHEN** `npm run avrl` runs
- **THEN** the hook generates a `dano` roll `4d8+4` / `trevas` and counts one fix
- **AND** a second pass reports 0 anomalies

#### Scenario: Legacy roll type, accented damage type, or Portuguese enum
- **GIVEN** an item or embedded sub-item with `type: "cura"`, damage type `perfuração`, `execucao: "padrao"`, `alcance: "médio"`, or `duracao.units: "rodadas"`
- **WHEN** the AVRL hook or `create-entry.js` runs
- **THEN** it rewrites the roll to `type: "dano"` with `curapv` / `perfuracao`, and normalizes `execucao: "action"`, `alcance: "medium"`, and `duracao.units: "round"`

### Requirement: Official Statblock CD Calibration
Each NPC of a monitored edition SHALL declare the official CD in `MONITORED_CDS` (`scripts/avrl-runner.js`) and in the edition validator (`expectedCd`). AVRL MUST overwrite a divergent `system.attributes.cd`, and the validators MUST fail on divergence.

#### Scenario: Actor CD diverges from the official statblock
- **GIVEN** `Urrash das Sombras Frias` stored with `cd: 16` while the official CD is 22
- **WHEN** AVRL or `npm run validate:fullgor27` runs
- **THEN** AVRL corrects it to 22 and the validator fails until it is 22

### Requirement: Strict 16-Char DocumentIdField and Global Orphan Purge
All documents, folders, and embedded subdocuments across all 6 compendium packs SHALL possess strictly 16-character IDs (`DocumentIdField`), and all created/adapted entities (`gq8*`, `fld*`, `effAuto*`, folders) MUST match `/^[a-zA-Z0-9]{16}$/`. Injection scripts SHALL delete existing embedded subdocuments before writing, `scripts/audit.js` MUST fail on any invalid ID length or orphan subdocument, and `scripts/avrl-runner.js` MUST purge all orphaned subdocuments (`!actors.items!`, `!actors.items.effects!`, `!actors.effects!`, `!items.effects!`, `!tables.results!`, `!journal.pages!`).

#### Scenario: Re-injecting an actor or cleaning orphaned subdocuments
- **GIVEN** an Actor, Item, Journal, or Table previously injected with different subdocument IDs
- **WHEN** the injector or `npm run avrl` runs
- **THEN** no sub-document remains in LevelDB whose parent is missing or absent from the parent's ID array
- **AND** `npm run audit` confirms 0 invalid ID lengths and 0 orphan subdocuments

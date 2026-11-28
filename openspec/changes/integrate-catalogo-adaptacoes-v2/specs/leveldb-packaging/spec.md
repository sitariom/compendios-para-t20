# leveldb-packaging Specification (Delta)

## MODIFIED Requirements

### Requirement: ClassicLevel Key Hierarchy and Namespace Segregation
All compendium packs declared in `module.json` — both the 6 legacy root packs and hierarchical packs under `packFolders` — SHALL store documents in ClassicLevel databases adhering strictly to Foundry VTT LevelDB namespaces (`!actors!`, `!items!`, `!macros!`, `!tables!`, `!journal!`, `!playlists!`, `!folders!`).

#### Scenario: Inspecting root document keys in LevelDB
- **GIVEN** any compendium pack declared in `module.json` opened with ClassicLevel
- **WHEN** keys are enumerated via iterator
- **THEN** every root document key starts with the pack's designated namespace
- **AND** contains exactly one unique 16-character alphanumeric identifier

### Requirement: Zero-Tolerance Integrity Audit Gate
Before any release or merge to `main`, all compendium packs declared in `module.json` SHALL pass `npm run audit` (`scripts/audit.js`) with zero errors: 0 JSON errors, 0 missing `_id`, 0 orphan folders, 0 broken subdocuments, and 0 v13/v14 DataModel violations.

#### Scenario: Running compendium audit before release
- **GIVEN** modified LevelDB packs declared in `module.json`
- **WHEN** `node scripts/audit.js` executes
- **THEN** every pack reports 0 JSON errors, 0 missing IDs, 0 orphan folders, and 0 schema violations
- **AND** the script exits with code 0

## ADDED Requirements

### Requirement: Lean Release Packaging Excluding Catalog Metadata
The `npm run zip` script and `.github/workflows/main.yml` release packaging SHALL exclude `catalogo/`, `openspec/`, `.pi/`, `src/`, `.codegraph/`, `.engram/`, and `referencias_criacao_itens_atores_t20/` from `module.zip` so Foundry VTT module downloads contain only runtime assets, packs, and `module.json`.

#### Scenario: Building release zip archive
- **GIVEN** the repository contains `catalogo/` tracking artifacts and `openspec/` documentation
- **WHEN** the release zip command executes
- **THEN** `module.zip` contains `module.json`, `packs/`, `assets/`, and runtime scripts/README
- **AND** excludes `catalogo/`, `openspec/`, `.pi/`, and `src/`

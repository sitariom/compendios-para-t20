# leveldb-packaging Specification

## Purpose
The leveldb-packaging capability defines the authoritative specification and quality contracts governing data persistence, ClassicLevel (LevelDB) database architectures, embedded subdocument hierarchies, audit gates, and CI/CD release compilation in the compendios-para-t20 repository.

## Requirements

### Requirement: ClassicLevel Key Hierarchy and Namespace Segregation
All 6 compendium packs SHALL store documents within ClassicLevel key-value databases adhering strictly to Foundry VTT LevelDB namespaces:
- `Ameacas_T20`: Root documents under `!actors!${_id}`
- `Itens_T20`: Root documents under `!items!${_id}`
- `Macros_T20`: Root documents under `!macros!${_id}`
- `Tabelas_T20`: Root documents under `!tables!${_id}`
- `Diarios_T20`: Root documents under `!journal!${_id}`
- `Playlist_T20`: Root documents under `!playlists!${_id}`
- Folders in all packs: Folders under `!folders!${folderId}`

#### Scenario: Inspecting root document keys in LevelDB
- **GIVEN** any compendium pack opened with ClassicLevel
- **WHEN** keys are enumerated via iterator
- **THEN** every root document key starts with the pack's designated namespace
- **AND** contains exactly one unique 16-character alphanumeric identifier

### Requirement: Embedded Subdocument Storage Hierarchy
Subdocuments belonging to actors, items, journals, and tables SHALL be stored under dedicated composite keys reflecting their document parentage:
- Items in Actors: `!actors.items!${actorId}.${itemId}`
- Effects in Embedded Items: `!actors.items.effects!${actorId}.${itemId}.${effectId}`
- Effects on Actors: `!actors.effects!${actorId}.${effectId}`
- Effects on Items: `!items.effects!${itemId}.${effectId}`
- Pages in Journals: `!journal.pages!${journalId}.${pageId}`
- Results in Tables: `!tables.results!${tableId}.${resultId}`

#### Scenario: Loading embedded weapon and active effect from threat
- **GIVEN** a threat actor with a natural weapon and aura effect
- **WHEN** the actor is retrieved from `Ameacas_T20`
- **THEN** the weapon is addressable at `!actors.items!${actorId}.${itemId}`
- **AND** the effect is addressable at `!actors.items.effects!${actorId}.${itemId}.${effectId}`
- **AND** deleting or updating the actor synchronizes all associated subdocuments

### Requirement: Zero-Tolerance Integrity Audit Gate
Before any release or merge to `main`, all 6 compendiums SHALL pass the automated audit suite `npm run audit` (`scripts/audit.js`) with zero errors:
- 0 JSON syntax or serialization errors
- 0 documents missing an `_id`
- 0 documents assigned to non-existent or orphan folders
- 0 broken subdocument parent chains

#### Scenario: Running compendium audit before release
- **GIVEN** modified LevelDB packs in the working directory
- **WHEN** `node scripts/audit.js` executes
- **THEN** all 6 packs report 0 JSON errors, 0 missing IDs, and 0 orphan folders
- **AND** the script exits with code 0

### Requirement: Safe Source Tree Unpacking and Packaging
Developers and agents SHALL use `scripts/unpack.js` to deconstruct LevelDB packs into human-readable JSON files in `src/packs/` (preserving `_embedded` subdocument arrays and `_folders.json`), and `scripts/pack.js` to compile JSON source trees back into pristine LevelDB binary databases.

#### Scenario: Round-trip unpacking and packing of a compendium
- **GIVEN** a compendium pack in `packs/`
- **WHEN** `node scripts/unpack.js <PackName>` and then `node scripts/pack.js <PackName>` are executed
- **THEN** all documents, folders, and embedded subdocuments are preserved without data loss
- **AND** the resulting LevelDB database passes `scripts/audit.js`

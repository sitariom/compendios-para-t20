# macros-specification Specification

## Purpose
The macros-specification capability defines the authoritative specification and quality contracts for creating and validating all Macro documents in `packs/Macros_T20` for the Tormenta20 system on Foundry VTT.

## Requirements

### Requirement: Macro Types and Execution Context
Every Macro document SHALL specify its execution type as either `script` (JavaScript code evaluated in Foundry's execution context) or `chat` (chat commands and messages). Script macros MUST be wrapped in safe async execution handlers and declare their authorship and system compatibility.

#### Scenario: Running an automation script macro
- **GIVEN** a macro in `packs/Macros_T20` of type `script`
- **WHEN** executed by a Game Master or authorized player
- **THEN** it executes within an async function block
- **AND** catches exceptions without crashing the Foundry VTT client interface

### Requirement: Canonical Creator Macros Integrity
The canonical creation macros `Criadora de Ameaças v6` and `Criadora de Itens V8` SHALL remain intact and functional within `packs/Macros_T20`. All actor and item generation scripts in the repository MUST adhere to the schemas, calculation standards, and formulas encoded in these creator macros.

#### Scenario: Auditing canonical creator macros
- **GIVEN** `packs/Macros_T20` inspected via `scripts/audit.js`
- **WHEN** the macro database is validated
- **THEN** `Criadora de Ameaças v6` and `Criadora de Itens V8` are present with valid `_id` and non-empty commands
- **AND** generated items and actors pass validation against their field definitions

### Requirement: Scoped Object Access and Safety
Macros intended to interact with actors or canvas tokens SHALL defensively verify target existence (`canvas.tokens.controlled[0]`, `game.user.character`, or selected documents) before performing operations and display user-friendly warnings in chat or UI when no target is selected.

#### Scenario: Macro executed without selected token
- **GIVEN** a combat calculation macro requiring a target token
- **WHEN** triggered while no token is selected on canvas
- **THEN** it emits a notification warning `ui.notifications.warn`
- **AND** terminates gracefully without uncaught null reference errors

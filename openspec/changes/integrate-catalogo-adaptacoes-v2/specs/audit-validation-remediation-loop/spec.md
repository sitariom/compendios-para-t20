# audit-validation-remediation-loop Specification (Delta)

## ADDED Requirements

### Requirement: Atomic One-by-One Artifact Gate and Append-Only Audit Log
Todo artefato novo ou modificado sob controle do catálogo (`catalogo/artefatos.json`) SHALL ser processado individualmente pelo loop micro (Extração → Montagem → Estrutura → Completude PDF → Regras T20 contra DataModels reais → Auditoria Cega de 2ª Passagem), gravando cada iteração em `catalogo/auditoria.jsonl`. Um artefato com `divergencias_abertas > 0` MUST permanecer em `EM_VALIDAÇÃO` ou `REPROVADO` e bloquear o avanço para o próximo artefato.

#### Scenario: Blocking progression on open artifact divergence
- **GIVEN** an artifact undergoing micro-loop validation with 1 open divergence in `system.tracos.resistencias`
- **WHEN** `scripts/catalogo-runner.js` evaluates the artifact gate
- **THEN** it logs the failure iteration in `catalogo/auditoria.jsonl`
- **AND** refuses to mark the artifact `VALIDADO` or advance to the next queued artifact until remediated and re-validated from structural checks

### Requirement: Root-Cause Escalation and Mandatory Re-Entry Triggers
Quando uma mesma divergência reaparecer **3 vezes** em iterações do loop micro, o fluxo SHALL interromper correções pontuais, abrir investigação de causa raiz em templates/specs/OpenSpec/referências/CodeGraph e marcar outros artefatos potencialmente afetados como `DESATUALIZADO`. Além disso, alterações no hash do PDF, atualização do sistema `Tormenta20` ou alteração em specs/templates MUST marcar os artefatos dependentes como `DESATUALIZADO` para reentrada obrigatória no loop.

#### Scenario: Three consecutive occurrences trigger root-cause escalation
- **GIVEN** an artifact failing the same schema or rule check 3 times in `catalogo/auditoria.jsonl`
- **WHEN** the escalation threshold is reached
- **THEN** `scripts/catalogo-runner.js` flags `ESCALONADO_CAUSA_RAIZ` and records the root-cause action required before resuming

### Requirement: Live Foundry VTT Publication Validation via Playwright
Ao concluir o processamento de uma publicação, `scripts/validate-foundry-playwright.js` SHALL acessar um mundo real do Foundry VTT via Playwright, abrir atores e cada tipo/subtipo de item criado, verificar renderização e ausência de erros, acionar rolagens e alternância de `ActiveEffect`, e gravar evidências em `catalogo/materiais/<ID>/playwright-evidencias/`.

#### Scenario: Validating a completed publication in a live Foundry VTT world
- **GIVEN** a publication whose artifacts passed the Node DataModel micro-loop and blind audit
- **WHEN** `node scripts/validate-foundry-playwright.js --material <ID>` runs against a configured Foundry VTT world
- **THEN** Playwright opens the sampled Actor and Item sheets, triggers weapon/skill/spell/table rolls and effect toggles
- **AND** verifies 0 browser console errors, 0 Foundry `ui.notifications` errors, and valid chat card output before marking the publication `PUBLICADO`

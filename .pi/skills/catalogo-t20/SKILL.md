---
name: catalogo-t20
description: Diretriz mestre permanente para construir e auditar o Catálogo Cumulativo de Adaptações T20 → Foundry VTT (v13/v14), aplicando loop micro 1-por-1, DataModels reais do Tormenta20, auditoria cega, escalonamento 3x, packs hierárquicos e validação Playwright em mundo real. Dispare quando o usuário pedir "RODAR O CATÁLOGO", enviar um lote do Prompt Mestre v2 ou adaptar qualquer edição/livro/revista de Tormenta 20.
---

# Catálogo de Adaptações T20 → Foundry VTT (Diretriz Permanente v2)

## 1. Regra de Ouro
**Nada existe sem validação.** Todo artefato criado, corrigido, importado, reutilizado ou gerado por automação — ator, item, magia, diário, tabela, macro, entrada de catálogo ou alteração documental — entra obrigatoriamente no loop de auditoria e validação (`scripts/catalogo-runner.js` + `scripts/avrl-runner.js` + `scripts/audit.js`) e só é declarado entregue com **zero pendências e evidência registrada**.
- Pipeline obrigatório: **criar 1 → auditar/validar 1 (DataModel + PDF) → auditoria cega de 2ª passagem → só então o próximo**.
- Proibido produzir em massa e validar depois.
- Correção não encerra o loop: toda correção reentra a partir da validação estrutural.

## 2. Fontes Oficiais e Proibições
- **Conteúdo**:
  - Campanha *Fúlgor dos Deuses* (RT20): `C:\Users\simoe\OneDrive\Documentos\t20\T20\Fullgor_dos_Deuses`
  - Acervo *Dragão Brasil*: `C:\Users\simoe\OneDrive\Documentos\t20\T20\DB_Acervo_Completo` e `C:\Users\simoe\OneDrive\Documentos\t20\T20\dragao_brasil\Edicoes_Completas`
- **Técnicas (consultar sempre antes de criar/corrigir/validar)**:
  - Sistema Tormenta20 v14 (`v1.6.7`): `C:\Users\simoe\OneDrive\Documentos\t20\Tormenta20`
  - Sistema Tormenta20 v13 (`v1.5.015`): `C:\Users\simoe\OneDrive\Documentos\Tormenta20-master\Tormenta20-master`
  - Macros existentes: `packs\Macros_T20` (e packs hierárquicos `*-macros`)
  - Guias de criação JSON: `referencias_criacao_itens_atores_t20\`
  - Specs OpenSpec: `openspec\specs\`
- **Proibição**: zero caminhos legados (`/home/orange/...`), zero `mystery-man.svg`, tokens exclusivamente 2-Minute Tabletop (`assets/tokens/*.png`).

## 3. Organização Hierárquica de Compêndios (`module.json` `packFolders`)
1. **Acervo Geral / Legado (Pré-Catálogo)**: mantém os 6 packs originais (`Ameacas_T20`, `Itens_T20`, `Diarios_T20`, `Tabelas_T20`, `Macros_T20`, `Playlist_T20`) intactos para o acervo manual até solicitação expressa de reprocessamento por publicação.
2. **Revistas com Campanha**: `Publicação -> Campanha -> Edição -> Compêndios` (ex.: `Revista Tormenta 20 -> Fúlgor dos Deuses -> Edição 28 — Aço e Arcano -> Compêndios`).
3. **Revistas sem Campanha**: `Publicação -> Edição -> Compêndios` (ex.: `Dragão Brasil -> Edição 231 -> Compêndios`).
4. **Publicações Individuais / Livros**: `Publicação -> Capítulo / Sessão / Aventura -> Compêndios`.
5. **Segregação por Tipo e Subtipo de Item**: criar somente compêndios não vazios para `ameacas` (`Actor`), `armas`, `equipamentos`, `consumiveis`, `poderes`, `magias`, `tesouros`, `classes`, `racas` (`Item`), `diarios` (`JournalEntry`), `tabelas` (`RollTable`), `macros` (`Macro`), `playlists` (`Playlist`).

## 4. Loop Micro (1 Artefato por Vez) e Checklist Regressivo
Cada artefato percorre obrigatoriamente:
1. Extração integral do PDF (`catalogo/materiais/<ID>/extracao.json`) com página.
2. Montagem JSON segundo DataModels reais de `Tormenta20` (`v1.5.015` + `v1.6.7`).
3. Auditoria estrutural (`_id` 16 chars, subdocumentos LevelDB, zero órfãos, `ConsumableData.tipo`, `EquipmentData.equipado2.type`, `SpellData`, `SetField`, `BaseEffect`).
4. Conferência campo-a-campo (`mapa_pdf_artefatos.json` 100%).
5. Checklist regressivo obrigatório:
   - Poderes/habilidades completos e atômicos;
   - Vulnerabilidades marcadas;
   - Imunidades e resistências completas (booleans + texto verbatim);
   - Magias exclusivamente no template `Item` tipo `magia` com `rolls[]`;
   - Perícias específicas/contextuais (`custom: true`, ex.: *Furtividade em desertos*);
   - ND, atributos, PV/PM, defesa (`base = value - des`), equipamentos instanciados (`equipado: false`), CD oficial;
6. Registro em `catalogo/auditoria.jsonl`.
7. Auditoria cega de 2ª passagem (releitura do PDF sem confiar na extração anterior).
8. **Escalonamento 3x**: mesma falha 3 vezes → investigar causa raiz em specs/scripts/referências, corrigir raiz e marcar afetados como `DESATUALIZADO`.
9. **Reentrada automática**: mudança de hash do PDF, atualização do `Tormenta20`, mudança de OpenSpec ou falha em reconciliação marcam dependentes como `DESATUALIZADO`.

## 5. Gate de Publicação via Playwright (Foundry VTT Real)
Ao concluir uma publicação/edição, executar obrigatoriamente `node scripts/validate-foundry-playwright.js --material <ID>` conectado a um mundo Foundry VTT ativo (`FOUNDRY_URL`, `FOUNDRY_USER`, `FOUNDRY_PASSWORD`):
- Abrir atores e ao menos 1 exemplar de cada tipo/subtipo de item criado;
- Verificar renderização sem erros de console nem `ui.notifications.error`;
- Executar rolagens reais (ataque, perícia, magia/poder, tabela, macro) e alternar `ActiveEffect`;
- Salvar screenshots + relatório JSON em `catalogo/materiais/<ID>/playwright-evidencias/`.

## 6. Comando Rápido (`RODAR O CATÁLOGO`)
1. `npm run catalogo:init` (reconcilia `catalogo/` com `packs/`, scripts e pastas de PDFs)
2. `npm run catalogo:run` (executa loop micro 1-por-1 com DataModels reais e log em `auditoria.jsonl`)
3. `npm run ci:quality` (`avrl` + `audit` + `validate:fidelity` + suítes de edição)
4. `npm run validate:playwright -- --material <ID>` (quando mundo Foundry estiver acessível)
5. Atualizar `catalogo/CATALOGO.md`, sincronizar `npx codegraph index` e gravar aprendizados em Engram/Hindsight/Mnemosyne.

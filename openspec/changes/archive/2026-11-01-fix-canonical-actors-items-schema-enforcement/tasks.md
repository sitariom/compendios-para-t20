# Tasks

## 1. Refatoração Canônica das Fábricas de Atores e Itens

- [x] 1.1 Refatorar `buildNpcActor` em `scripts/create-entry.js` garantindo todos os campos normativos de atributos (`value`, `base`, `racial`, `bonus`), `movement` (`walk`, `burrow`, `climb`, `fly`, `swim`, `hover`, `unit`), `attributes.cd`, `defesa` canônica (`base = value - modDes`), `detalhes` completos e biografia estilizada com citações duplas. Verificar com teste unitário.
- [x] 1.2 Refatorar `buildWeaponAttack` e `buildWeaponItem` em `scripts/create-entry.js` incluindo estrutura `rolls` com `parts` (`ataque0` e `dano1`), `criticoM`, `criticoX`, `chatFlavor` e propriedades completas. Verificar com teste unitário.
- [x] 1.3 Refatorar `buildSpecialPower`, `buildItem` e `buildSpellItem` em `scripts/create-entry.js` com `chatFlavor`, `rolls` estruturados e automação de `ActiveEffects` com chaves canônicas Tormenta20. Verificar com teste unitário.

## 2. Reconstrução Canônica de Ameaças, Perigos e Parceiros da DB #228

- [x] 2.1 Reconstruir `Ankthyr` (ND 8) com todos os ataques e habilidades embutidos (`Mordida` com rolls.parts, `Agarrar Aprimorado`, `Cuspe Ácido`, `Espreitador Subterrâneo`, `Sentido Sísmico`), 34 perícias deduzidas e biografia em bloco duplo em `scripts/inject-db228-threats.js`.
- [x] 2.2 Reconstruir `Enxame Cáustico` (ND 4) com todas as habilidades embutidas (`Enxame`, `Gosma Corrosiva`, `Sentido Sísmico`), 34 perícias deduzidas e biografia canônica em `scripts/inject-db228-threats.js`.
- [x] 2.3 Reconstruir `Slark` (ND 1) com ataque embutido (`Garras`), habilidades (`Queda Livre`, `Saliva`), 34 perícias e biografia canônica em `scripts/inject-db228-threats.js`.
- [x] 2.4 Reconstruir `Desabamento dos Túneis` (Hazard ND 8) com todas as ações e efeitos mecânicos detalhados em `scripts/inject-db228-threats.js`.
- [x] 2.5 Reconstruir os Parceiros (`Reabilitador`, `Allihennali`, `Guaxininjas`) com fichas completas e poderes de patamar embutidos no documento do ator.
- [x] 2.6 Executar injeção atômica no LevelDB `Ameacas_T20` garantindo que `items` no documento principal contenha todos os subdocumentos.

## 3. Reconstrução Canônica de Itens, Poderes e Magias da DB #228

- [x] 3.1 Reconstruir armas específicas `Arco dos Arautos` e `Arma Silente` com rolls `parts`, `criticoM`, `criticoX`, `chatFlavor` e `ActiveEffects` em `scripts/inject-db228-items.js`.
- [x] 3.2 Reconstruir a magia `Memorizar Conhecimento` com círculo, escola, execução, alcance, duração, resistências e rolls em `scripts/inject-db228-items.js`.
- [x] 3.3 Reconstruir todos os itens, poderes e consumíveis de Divinas Organizações com todas as variáveis de template e `ActiveEffects` funcionais para modificadores mecânicos.
- [x] 3.4 Executar injeção em `Itens_T20` e verificar integridade no LevelDB.

## 4. Validação Rigorosa, Auditoria e Sincronização OpenSpec

- [x] 4.1 Atualizar `scripts/validate-db228-compliance.js` para validar estritamente que armas possuem `rolls.parts`, atores possuem `items` preenchidos e todas as 34 perícias, e que bônus mecânicos possuem `ActiveEffects`.
- [x] 4.2 Executar `scripts/audit.js` e verificar que todas as coleções do compêndio passam com 0 erros.
- [x] 4.3 Validar a mudança com `openspec validate fix-canonical-actors-items-schema-enforcement`.

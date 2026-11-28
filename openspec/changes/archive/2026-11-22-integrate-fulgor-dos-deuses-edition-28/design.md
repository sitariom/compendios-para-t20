# Design: Arquitetura Canônica da Adaptação de Fúlgor dos Deuses — Edição 28

## 1. Contexto e Objetivos
A Edição 28 ("Aço e Arcano") se passa inteiramente no semiplano da Academia Arcana sob uma mecânica de corrida contra o tempo (**Contador de Urgência**), culminando no confronto final com **Rashid, Fullgori** dentro do **Templo do Saber de Wynna**.

## 2. Decisões de Modelagem por Compêndio

### 2.1 Ameaças (`packs/Ameacas_T20`, pasta `n591wfGB7keSNe7I`)
- **Liriavel, Forma de Quimera (`fld28LiriavelQui`)**:
  - `nd: '8'`, `tamanho: 'gra'` (token 2x2 `liriavel-forma-de-quimera.png`), `papel: 'solo'`, `tipoMonstro: 'esp'`, `raca: 'Espírito (sílfide)'`.
  - Defesa `33`, Des `+3` -> `defesa.base = 30`. CD `26` (`Fort CD 26`, `Ref CD 26`).
  - Deslocamentos: `walk: 9`, `fly: 12`.
  - 3 ataques (`Duas Mordidas`, `Marrada`, `Duas Garras`) + 4 poderes atômicos (`Mente Tripla`, `Cabeça de Bode`, `Cabeça de Dragão` com rolagem `10d6+20` fogo e `Ref` CD 26, `Cabeça de Leão`).
- **Rashid, Fullgori (`fld28RashidFullg`)**:
  - `nd: '7'`, `tamanho: 'gra'` (token 2x2 `rashid-fullgori.png`), `papel: 'solo'`, `tipoMonstro: 'esp'`, `raca: 'Espírito (fullgori)'`.
  - Defesa `34`, Des `+1` -> `defesa.base = 33`. CD `30` (`Magias Como um feiticeiro de 9º nível (CD 30)`).
  - Deslocamentos: `walk: 9`, `burrow: 9`, `fly: 12`.
  - Resistências: `dano.base = 10`, `acido.imunidade = true`, `ic.value` com imunidades fullgori + `encantamento`.
  - Perícias publicadas: `inic: 10`, `perc: 14`, `fort: 21`, `refl: 6`, `vont: 15`, `atle: 14`, `mist: 12`, `reli: 13`, `arte: 15`, e perícia customizada `ofic_arquiteto` (`label: 'Ofício (Arquiteto)'`, `value: 15`, `custom: true`).
  - Ataque `Pancada` (`2d8+20` impacto + `2d8` ácido) + 6 poderes atômicos (`Teofagia`, `Imunidades Fullgori`, `Criatura do Fullgor`, `Contramágica Aprimorada`, `Magia Acelerada` 4 PM, `Zelador da Academia Arcana`) + 4 magias individuais (`Amarras Etéreas` 6 PM, `Controlar Terra` 5 PM, `Dissipar Magia` 3 PM, `Jato Corrosivo` 9 PM com `rolls[]`).
- **Templo do Saber em Mutação (`fld28PerigoTempl`)**:
  - Ator `type: 'hazard'`, ND `'8'`, reunindo os 6 Elementos de Cenário da batalha final (*Pilares em colapso*, *Plataformas repentinas*, *Altar pulsante*, *Rachaduras vivas*, *Estátuas súbitas*, *Silêncio sagrado*).

### 2.2 Itens e Parceiros (`packs/Itens_T20`, pasta `fldItensFolder26`)
- Todos os IDs com 16 caracteres alfanuméricos estritos (`/^[a-zA-Z0-9]{16}$/`).
- ActiveEffects construídos via `buildActiveEffect` (`BaseEffect` DataModel) com chaves canônicas (`system.pericias.conh.bonus`, `system.pericias.dipl.bonus`, `system.pericias.mist.bonus`, `system.modificadores.ataque.geral`, `system.modificadores.dano.mag`).

### 2.3 Diários, Tabelas e Macros
- `Diarios_T20`: `fld28DiarioAcoAr` (7 páginas com IDs de 16 caracteres e `ownership.default: -1`).
- `Tabelas_T20`: `fld28TabRuasResp` (6 resultados), `fld28TabFrasesRa` (10 resultados), `fld28TabFrasesTe` (8 resultados), todos com IDs de 16 caracteres.
- `Macros_T20`: `fld28MacroUrgenc` (Rastreador de Urgência & Eventos do Campus).

## 3. Pipeline de Qualidade e Convergência AVRL
- Atualização de `STRICT_ACTOR_IDS`, `MONITORED_CDS` (`'liriavel forma de quimera': 26`, `'rashid fullgori': 30`) em `scripts/avrl-runner.js`.
- Execução do `npm run ci:quality`, `validate:fullgor28`, `validate:fidelity`, `unpack` e `codegraph index`.

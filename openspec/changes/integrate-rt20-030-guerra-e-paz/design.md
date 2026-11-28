# Design: Arquitetura Hierárquica e Modelagem Canônica de RT20-030 (Guerra e Paz)

## 1. Estrutura Hierárquica de Compêndios (`RT20-030`)
Os documentos de `RT20-030` são gravados diretamente sob `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-30/`:
- `rt20-030-ameacas` (`Actor`): `fld30ElanorLumVA`, `fld30DaliriaMara`, `fld30DevotoMarah`, `fld30CoralBranco`, `fld30VidenciaCin`, `fld30JulgamentoM`, `fld30NadaExpansa`.
- `rt20-030-equipamentos` (`Item`): `fld30EstilhaFull`.
- `rt20-030-poderes` (`Item`): `fld30ParcElanorA`, `fld30ParcDaliria`, `fld30FavorDamaBr`, `fld30FavorDonzel`, `fld30SentencaFav`.
- `rt20-030-diarios` (`JournalEntry`): `fld30DiarioGuerr` (7 páginas sob `!journal.pages!`, `ownership.default: -1`).
- `rt20-030-tabelas` (`RollTable`): `fld30TabFrasesDv` (1d10), `fld30TabFrasesCo` (1d10), `fld30TabPresenca` (1d4).
- `rt20-030-macros` (`Macro`): `fld30MacroGuerra`.

## 2. Fórmulas Matemáticas & Modelagem das Ameaças
- **Elanor Lúmen-Velho (`fld30ElanorLumVA`, `Humanoide (elfo) Médio`, 1x1)**:
  - `nd: "8"`, `meionivel = 4`, `treino = 4`, `papel: "special"`, `cd: 28`.
  - Atributos: `For 2, Des 4, Con 2, Int 1, Sab 4, Car 3`.
  - Defesa: `31` (`base = 31 - Des(4) = 27`). PV: `228`, Deslocamento: `12m (8q)`, Sentidos: `faro, visão na penumbra`.
  - Traços: `evasão, imunidade a alquebrado, esmorecido e frustrado`.
  - Ataques: `Ataque desarmado` (`ataques: 2`, +24, `1d10+20` impacto).
  - Equipamento oficial: `Manto eclesiástico aprimorado, símbolo sagrado de Marah.` (instanciados com `equipado: false`).
  - Poderes atômicos: `Aura de Paz` (Von CD 28), `Integridade Corporal`, `Técnica da Mão Vazia`, `Sair do Caminho`.
- **Dalíria de Marah (`fld30DaliriaMara`, `Humanoide (humano) Médio`, 1x1)**:
  - `nd: "8"`, `meionivel = 4`, `treino = 4`, `papel: "special"`, `cd: 28`.
  - Atributos: `For 0, Des 3, Con 1, Int 2, Sab 4, Car 5`.
  - Defesa: `28` (`base = 28 - Des(3) = 25`). PV: `214`, PM: `54`, Deslocamento: `9m (6q)`.
  - Equipamento oficial: `Camisa bufante aprimorada, símbolo sagrado de Marah.` (instanciados com `equipado: false`).
  - Poderes atômicos: `Aparência Inofensiva` (Von CD 28), `Transe Dançante` (3 PM, Von CD 28).
  - Magias (`tipo: "div"`, CD 28): `Curar Ferimentos` (7 PM, `8d8+8` `curapv`), `Dissipar Magia` (3 PM), `Escudo da Fé` (7 PM), `Luz` (5 PM), `Tranquilidade` (4 PM).
- **Devoto de Marah Fullgori (`fld30DevotoMarah`, `Humanoide (fullgori) Médio`, 1x1)**:
  - `nd: "6"`, `meionivel = 3`, `treino = 2`, `papel: "lacaio"`, `cd: 22`.
  - Atributos: `For 0, Des 2, Con 3, Int 0, Sab 3, Car 2`.
  - Defesa: `26` (`base = 26 - Des(2) = 24`). PV: `48`, Deslocamento: `9m (6q)`.
  - Ataque: `Toque pacificador` (`ataques: 2`, +24, perda de `2d6` PM via `formula`).
  - Poderes atômicos: `Teofagia`, `Imunidades Fullgori`, `Aura de Desinteresse` (Von CD 22), `Remorso Existencial`, `Toque Pacificador`.
- **Coral Branco (`fld30CoralBranco`, `Espírito (fullgori) Colossal`, 4x4)**:
  - `nd: "10"`, `meionivel = 5`, `treino = 4`, `papel: "solo"`, `cd: 30`.
  - Atributos: `For 5, Des -5, Con 8, Int -5 (—), Sab 0, Car -5`.
  - Defesa: `33` (`base = 33 - Des(-5) = 38`). PV: `600`, Deslocamento: `0m (0q)`.
  - Traços: `rdGeral: 10`, `maior que a morte`, `percepção às cegas`, imunidades fullgori (`critico`, `cansaco`, `metabolismo`, `metamorfose`, `paralisia`).
  - Poderes atômicos: `Teofagia`, `Imunidades Fullgori`, `Enxame (Perda de PM)` (`2d8` PM), `Maior que a Morte`, `Anular a Vontade`, `Fim da Dor` (Von CD 30), `Paz sem Voz` (`8d6` `perda`, Von CD 30), `Remorso Existencial`, `Reduzir ao Nada` (Von CD 30).

## 3. Tokens e Ícones Verificados
- Tokens 2-Minute Tabletop em `assets/tokens/`: `elanor-lumen-velho.png`, `daliria-de-marah.png`, `devoto-marah-fullgori.png`, `coral-branco.png`.
- Todos os ícones usam exclusivamente caminhos validados em `scripts/valid-system-icons.json`.

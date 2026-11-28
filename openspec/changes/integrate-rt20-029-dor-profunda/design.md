# Design: Arquitetura Hierárquica e Modelagem Canônica de RT20-029 (Dor Profunda)

## 1. Estrutura Hierárquica de Compêndios (`RT20-029`)
Os documentos de `RT20-029` são gravados diretamente sob `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-29/`:
- `rt20-029-ameacas` (`Actor`): `fld29GuardiaoAbi`, `fld29NamasqallAb`, `fld29ViagemMarHa`, `fld29RespeitoMar`.
- `rt20-029-equipamentos` (`Item`): `fld29BuzioMareFu`, `fld29EstilhaMynA`.
- `rt20-029-poderes` (`Item`): `fld29ParcLiriavA`, `fld29ParcThalgri`.
- `rt20-029-diarios` (`JournalEntry`): `fld29DiarioDorPr` (7 páginas sob `!journal.pages!`, `ownership.default: -1`).
- `rt20-029-tabelas` (`RollTable`): `fld29TabFrasesGu` (1d10), `fld29TabArenaTem` (1d4), `fld29TabFrasesMy` (1d18).
- `rt20-029-macros` (`Macro`): `fld29MacroMynath`.

## 2. Fórmulas Matemáticas & Modelagem das Ameaças (ND 9)
- **Guardião do Lamento Abissal (`fld29GuardiaoAbi`, `Monstro Enorme`, 3x3)**:
  - `nd: "9"`, `meionivel = 4`, `treino = 4`, `papel: "solo"`, `cd: 24`.
  - Atributos: `For 10, Des 3, Con 8, Int -1, Sab 5, Car -1`.
  - Defesa: `33` (`base = 33 - Des(3) = 30`). PV: `560`, Deslocamento: `6m`, Natação `24m`.
  - Perícias: `inic: 6`, `perc: 12`, `fort: 22`, `refl: 16`, `vont: 9`, `luta: 26`.
  - Ataques (`arma`, `corpo-a-corpo`, `alcance: 'none'`): `Mordida` (+26, `1d8+10` perfuração + sangramento) e `Três Tentáculos` (`ataques: 3`, +26, `1d6+10` impacto).
  - Poderes atômicos (`poder`): `Agarrar Aprimorado` (+36), `Constrição` (`2d6+10` impacto), `Encastelar-se` (ActiveEffect `+5` Defesa e `+5` RD geral), `Fluxo Circular` (`3d6` frio + `3d6` impacto, Ref CD 24), `Maior que a Morte`, `Templo` (Consagrar + Profanar), e as 4 ações da arena (`Templo: Armadilha Oculta`, `Templo: Fonte Curativa`, `Templo: Passagens Secretas`, `Templo: Selo Místico — Sopro das Uivantes`).
- **Namasqall Abandonado (`fld29NamasqallAb`, `Espírito Elemental Colossal`, 4x4)**:
  - `nd: "9"`, `meionivel = 4`, `treino = 4`, `papel: "solo"`, `cd: 31`.
  - Atributos: `For 10, Des 4, Con 10, Int -3, Sab -1, Car -1`.
  - Defesa: `37` (`base = 37 - Des(4) = 33`). PV: `550`, Deslocamento: `12m`, Natação `18m`.
  - Perícias: `inic: 14`, `perc: 9`, `fort: 24`, `refl: 18`, `vont: 10`, `luta: 34`.
  - Ataques: `Quatro Tentáculos d’Água` (`ataques: 4`, +34, `1d10+25` impacto).
  - Poderes atômicos (`poder`): `Agarrar Aprimorado` (+44, Grandes ou menores), `Constrição` (`2d10+25` impacto), `Corpo Torrencial`, `Maremoto` (`5d6+15` frio + `5d6+15` impacto, cone 12m, Ref CD 31), `Olho da Tempestade`.

## 3. Tokens e Ícones Verificados
- `assets/tokens/guardiao-lamento-abissal.png` (2-Minute Tabletop Kraken Juvenile, RGBA 250x250, 3x3).
- `assets/tokens/namasqall-abandonado.png` (2-Minute Tabletop Water Elemental, RGBA 910x910, 4x4).
- Todos os ícones de itens/poderes/diários/tabelas usam exclusivamente caminhos validados em `scripts/valid-system-icons.json`.

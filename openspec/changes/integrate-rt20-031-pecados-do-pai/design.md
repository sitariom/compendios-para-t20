# Design: Arquitetura Hierárquica e Modelagem Canônica de RT20-031 (Pecados do Pai)

## 1. Estrutura Hierárquica (`RT20-031`)
Packs sob `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-31/`:
- `rt20-031-ameacas` (`Actor`): `fld31IscoFullgor`, `fld31JardineiroD`, `fld31LisandraDet`, `fld31RastrosCaca`, `fld31NaturezaDet`, `fld31EnxameFullg`, `fld31SantuarioSo`, `fld31CorrentesIn`.
- `rt20-031-equipamentos` (`Item`): `fld31EstilhaFull`.
- `rt20-031-poderes` (`Item`): `fld31ParcLisandr`, `fld31BencaoLisDi`.
- `rt20-031-diarios` (`JournalEntry`): `fld31DiarioPecad` (7 páginas).
- `rt20-031-tabelas` (`RollTable`): `fld31TabFrasesLi` (1d10), `fld31TabPesoPres` (1d4), `fld31TabRecompGr` (1d4).
- `rt20-031-macros` (`Macro`): `fld31MacroPecado`.

## 2. Fórmulas & Modelagem
- **Isco do Fullgor (`fld31IscoFullgor`, ND 11, Grande 2x2)**: `Def 41 (base 39 + Des 2)`, `PV 400`, `CD 33`, `Pancada x4 +27 (2d8+15, alcance curto)`, vulnerabilidade a fogo, cura acelerada 20/fogo.
- **Jardineiro Dourado (`fld31JardineiroD`, ND 11, Médio 1x1)**: `Def 35 (base 33 + Des 2)`, `PV 385`, `PM 49`, `CD 33`, `Cipós x4 +30 (2d6+20 impacto, alcance 6m)`, RD 10, vulnerabilidade a fogo, 6 magias simuladas (`Armamento da Natureza`, `Controlar Plantas`, `Despedaçar`, `Escudo da Fé`, `Silêncio`, `Tranquilidade`).
- **Lisandra Deturpada (`fld31LisandraDet`, ND 13, Média 1x1)**: `Def 45 (base 42 + Des 3)`, `PV 455`, `PM 62`, `CD 35`, `Espada bastarda +35 (1d12+15, 17)` + `Gavinhas x2 +35 (2d8+15 impacto, alcance 3m)`, RD 15, `Símbolo sagrado de Allihanna` (`equipado: false`), 5 magias (`Controlar Plantas`, `Curar Ferimentos`, `Dissipar Magia`, `Raio Polar`, `Libertação`).

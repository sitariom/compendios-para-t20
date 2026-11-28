# Design: Arquitetura Hierárquica e Modelagem Canônica de RT20-032 (Como um Deus)

## 1. Estrutura Hierárquica (`RT20-032`)
Packs sob `packs/revistas/revista-tormenta-20/fulgor-dos-deuses/edicao-32/`:
- `rt20-032-ameacas` (`Actor`): `fld32TurbaEnfure`, `fld32VigiaDevolu`, `fld32LysenneEuch`, `fld32EucharionFu`, `fld32GracasReceb`, `fld32Turbulencia`.
- `rt20-032-equipamentos` (`Item`): `fld32PingenteCor`, `fld32EstilhaFull`.
- `rt20-032-poderes` (`Item`): `fld32DividaSagra`, `fld32ParcLysenne`.
- `rt20-032-diarios` (`JournalEntry`): `fld32DiarioComoD` (7 páginas).
- `rt20-032-tabelas` (`RollTable`): `fld32TabFrasesTu` (1d10), `fld32TabFrasesLy` (1d10), `fld32TabFrasesEu` (1d10).
- `rt20-032-macros` (`Macro`): `fld32MacroComoDe`.

## 2. Fórmulas & Modelagem
- **Turba Enfurecida (`fld32TurbaEnfure`, ND 10, Colossal 4x4)**: `Def 32 (base 32 + Des 0)`, `PV 120`, `[bando] Ataque desarmado x2 +34 (2d6+5)`, `Enxame 4d6+5`, `Ofício (fazendeiro) +9`.
- **Vigia da Devolução (`fld32VigiaDevolu`, ND 7, Médio 1x1)**: `Def 28 (base 28 + Des 0)`, `PV 60`, RD 5, `Dois manguais +24 (2d8+11)`, equipamento `Armadura completa reforçada, mangual equilibrado, símbolo sagrado de Eucharion.` (`equipado: false`).
- **Lysenne de Eucharion (`fld32LysenneEuch`, ND 10, Médio 1x1)**: `Def 36 (base 31 + Des 5)`, `PV 400`, `PM 45`, `Duas espadas longas +28 (2d8+15, 18)`, equipamento `Armadura completa delicada de mitral, espada longa precisa de mitral x2, símbolo sagrado de Eucharion.` (`equipado: false`).
- **Eucharion do Fullgor (`fld32EucharionFu`, ND 13, Colossal 4x4)**: `Def 42 (base 42 + Des 0)`, `PV 455`, `PM 101`, `CD 37`, `Pancada +34 (2d8+10)`, RD 10, RM +5, `maior que a morte`, 8 magias divinas (`Comando`, `Curar Ferimentos`, `Dispersar as Trevas`, `Imobilizar`, `Marca da Obediência`, `Raio Solar`, `Santuário`, `Selo de Mana`).

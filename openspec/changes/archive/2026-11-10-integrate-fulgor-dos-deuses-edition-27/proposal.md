# Proposal: Integração Canônica de Fúlgor dos Deuses — Edição 27 (Dia e Noite)

## Why
Dando continuidade ao épico de retomada da campanha oficial **Fúlgor dos Deuses** (publicada na Revista Tormenta20 pela Jambô Editora), a **Edição 27 ("Dia e Noite")** transporta os heróis para a cidade de Baldonn e para as cavernas fétidas dos trogs devotos de Tenebra.
A aventura introduz a contaminação do Fullgor no sangue angelical através da guerreira suraggel **Cassiella de Baldonn**, o relicário sagrado da **Orbe de Azgher**, e o confronto contra o líder fanático **Urrash das Sombras Frias** e suas hordas de **Troggore**.

## What Changes
1. **Ameaças e NPCs (`packs/Ameacas_T20`)**:
   - Inclusão e calibração canônica de 6 ameaças:
     - `Cassiella semi-fullgori` (ND 7, Espírito Médio, Defesa 31 com base 30, PV 280, Espada longa pungente x2 +24, escudo pesado +24 com Derrubar livre +29, Durão, Espada Luminosa, Luz Sagrada).
     - `Cassiella fullgori` (ND 8, Espírito Médio com asas e voo 15m, Defesa 33 com base 31, PV 280, Espada longa x2 +26, Azagaias Fullgori com recarga movimento, Asa-Escudo, Luz Fustigante, Rasante Luminoso, Teofagia e Imunidades Fullgori).
     - `Enxame Trog` (ND 5, Monstro Enorme 3x3, Defesa 23 com base 22, PV 200, dano de enxame 6d6 perfuração, Mau Cheiro Coletivo, Sangue Frio).
     - `Troggore` (ND 3, Monstro Médio, Defesa 22 com base 20, PV 80, Lança +14, Mordida +14, Escolhido de Tenebra, Mau Cheiro, Sanguinolência, Sangue Frio, Sensibilidade a Luz).
     - `Bando Troggore` (ND 5, Monstro Grande 2x2, Defesa 22 com base 20, PV 180, Lança +17, Mordida +17, Devoção Protetora, Mau Cheiro, Sanguinolência, Sangue Frio, Sensibilidade a Luz).
     - `Urrash das Sombras Frias` (ND 5, Monstro Médio, Clérigo de Tenebra de 5º nível, Defesa 23 com base 22, PV 140, PM 29, Lança +15, Mordida +15 com trevas, Passo Sombrio, Visão nas Trevas, 6 magias individuais).
   - Tokens 2-Minute Tabletop circulares transparentes de 512x512 para todos os 6 atores.
2. **Itens e Relíquias (`packs/Itens_T20`)**:
   - Inclusão do artefato sagrado `Orbe de Azgher` com emissão permanente de luz de 5º círculo e conjuração de magias solares (*Coluna de Chamas*, *Dispersar as Trevas*, *Raio Solar*).
   - Inclusão da parceira `Parceiro: Cassiella de Baldonn` com ActiveEffect de +3 em testes de ataque e concessão da magia *Luz*.
   - Inclusão de equipamentos canônicos da aventura: `Armadura Completa Delicada Selada`, `Escudo Pesado Reforçado`, `Espada Longa Pungente`, `Lança Troggore`.
3. **Diários (`packs/Diarios_T20`)**:
   - Inclusão do diário completo `Fúlgor dos Deuses — Edição 27: Dia e Noite` com 6 páginas estruturadas em subdocumentos ClassicLevel sob `!journal.pages!` com `ownership.default: -1`.
4. **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
   - Inclusão de 3 tabelas de rolagem com resultados em subdocumentos:
     - `Cavernas dos Trogs — Perigos e Ecos de Tenebra (Edição 27)` (1d6)
     - `Frases em Combate de Cassiella Possuída (Edição 27)` (1d8)
     - `Dilema da Orbe de Azgher — Escolhas e Consequências (Edição 27)` (1d6)
5. **Macros (`packs/Macros_T20`)**:
   - Inclusão da macro `Canalizar Orbe de Azgher (Fúlgor dos Deuses)` para conjuração e canalização da relíquia solar.
6. **Qualidade e Loop AVRL**:
   - Validador dedicado `scripts/validate-fullgor27-compliance.js`.
   - Execução do loop AVRL com convergência de 100% de aprovação e sincronização do CodeGraph.

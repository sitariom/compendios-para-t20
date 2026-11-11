# Proposal: Integração Canônica de Fúlgor dos Deuses — Edição 26 (Forja da Vingança)

## Why
A campanha oficial **Fúlgor dos Deuses** (publicada na Revista Tormenta20 pela Jambô Editora) foi adaptada no repositório até a Edição 25. O objetivo deste épico é retomar a adaptação a partir da **Edição 26** ("Forja da Vingança") até a Edição 32, processando com rigor absoluto uma edição por vez.

## What Changes
1. **Ameaças e NPCs (`packs/Ameacas_T20`)**:
   - Calibração canônica e saneamento de 6 ameaças:
     - `Asmithar Martelo-Mudo` (ND 9, Humanoide Médio, Defesa 32 com base 31, PV 230, Iniciativa +9, Percepção +12, 34 perícias calibradas, habilidades atômicas *Armamento Sagrado* e *Desprezo pelo Ordinário*).
     - `Xellmaras, a Ladra Acorrentada` (ND 6, Espírito Médio, Defesa 25 com base 19, PV 168, Iniciativa +11, Percepção +5, 34 perícias, habilidades atômicas *Teofagia*, *Imunidades Fullgori*, *Ataque Furtivo +3d6*, *Correntes Deturpadas*, *Especialista Abissal*, *Sadismo*, *Talho Atroz*, *Chave que se Fecha*).
     - `Gangue de Hyninn Deturpada` (ND 4, Humanoide Grande 2x2, Defesa 22 com base 19, PV 99, habilidades *Teofagia*, *Imunidades Fullgori*, *No Alma Dói Mais*, *Truque de Luzes*).
     - `Sacerdote de Hyninn Deturpado` (ND 4, Humanoide Médio, Defesa 19 com base 16, PV 98, PM 28, magias individuais *Arma Espiritual*, *Curar Ferimentos*, *Despedaçar*, habilidades *Bênção do Gatuno*, *Forma de Macaco Pamgra*, *Malandragem Divina*).
     - `Tigre-de-Hyninn Deturpado` (ND 6, Monstro Grande 2x2, Defesa 28 com base 24, PV 205, ataques múltiplos, *Borrão Dourado*, *Reflexo Planar*).
     - `Aço Selvagem` (ND 6, Espírito Grande 2x2, Defesa 27 com base 25, PV 250, *Ecos do Fullgor*, *Engolir*, *Corpo de Metal Fundido*, *Resfriamento Forçado*).
   - Substituição total de placeholders `mystery-man` por tokens circulares transparentes 2-Minute Tabletop sob `modules/compendios-para-t20/assets/tokens/`.
2. **Itens e Poderes (`packs/Itens_T20`)**:
   - Criação da pasta `Fullgor dos Deuses`.
   - Implementação de 11 qualidades antidivinas de Aço Sillariano (*Absorção Antidivina*, *Arma Antidivina*, *Defesa Antidivina*, *Guarda Antidivina*, *Impedimento Antidivino*, *Magia Antidivina*, *Mente Antidivina*, *Perseguidora Antidivina*, *Potência Antidivina*, *Resistência Antidivina*, *Antidevoto*).
   - Implementação do item de aprimoramento / material especial *Aço Sillariano*.
   - Implementação do artefato sagrado *Alma da Bigorna*.
   - Implementação dos poderes de traço *Teofagia (Fullgori)* e *Imunidades (Fullgori)*.
   - Implementação dos parceiros *Forjadores Litúrgicos* e *Thalgrimm Sangue de Ferro*.
3. **Diários (`packs/Diarios_T20`)**:
   - Criação da pasta `Fullgor dos Deuses`.
   - Diário completo *Fúlgor dos Deuses — Edição 26: Forja da Vingança* com 7 páginas estruturadas em subdocumentos ClassicLevel sob `!journal.pages!` com `ownership.default: -1`.
4. **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
   - Criação da pasta `Fullgor dos Deuses`.
   - Criação de 3 tabelas de rolagem estruturadas com subdocumentos `!tables.results!`:
     - *Subterrâneos de Valkaria — Encontros e Boatos (Edição 26)* (1d6)
     - *Qualidades Antidivinas de Aço Sillariano (Edição 26)* (1d10)
     - *Frases de Combate de Xellmaras (Edição 26)* (1d8)
5. **Macros (`packs/Macros_T20`)**:
   - Criação da macro *Forjar Aço Sillariano (Fúlgor dos Deuses)* para apoiar o ritual de forja com estilhas fullgori.
6. **Qualidade & Loop AVRL**:
   - Validador automatizado dedicado `scripts/validate-fullgor26-compliance.js`.
   - Aprovação de 100% no `npm run audit`, `npm run validate:fidelity` e na suíte de compliance.
   - Sincronização do CodeGraph (`codegraph sync`).

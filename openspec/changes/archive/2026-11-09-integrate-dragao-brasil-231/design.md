# Design: Integração Canônica Dragão Brasil #231

## Visão Geral da Arquitetura
A integração segue a arquitetura canônica de compêndios ClassicLevel do Foundry VTT v12/v13, padronizada após as releases v1.4.7 a v1.7.2.

### 1. Política Universal de IDs (Regra dos 16 Caracteres)
No core do Foundry VTT (`foundry.data.validators.isValidId`), todos os IDs primários de documentos e subdocumentos DEVEM possuir estritamente 16 caracteres alfanuméricos (`/^[a-zA-Z0-9]{16}$/`).
Prefixos determinísticos para a DB #231:
- Ameaças (`Ameacas_T20`): `gq8231<Slug>AAAA` ou 16 caracteres controlados.
- Itens e Poderes (`Itens_T20`): `i8231<Slug>AAAA` (16 chars).
- Diários (`Diarios_T20`): `j8231<Slug>AAAA` (16 chars), Páginas: `p8231<Slug>AAAA` (16 chars).
- Tabelas (`Tabelas_T20`): `t8231<Slug>AAAA` (16 chars), Resultados: `r8231<Slug>AAAA` (16 chars).

### 2. Mapeamento de Pastas Canônicas
- Ameaças: Pasta *Dragão Brasil* (`wfWApuyngzFm4KOP`) em `Ameacas_T20`.
- Diários: Pasta *Dragão Brasil* (`Wk4e0z6eXGf3uY6c`) em `Diarios_T20`.
- Tabelas: Pasta *Dragão Brasil* (`W9gqZ84k7Uv50KOP`) em `Tabelas_T20`.
- Itens e Poderes:
  - Poderes de Classe e Concedidos: `6HZCPG5QrmzhwmBe` (Poderes)
  - Equipamentos e Itens Gerais: `f9rwHA7dJnFLVQH1` (Equipamentos) ou `ZMhIquorDsf9xEn8` (Consumíveis)

### 3. Estrutura dos Scripts Injetores
Para manter a manutenibilidade, modularidade e rastreabilidade:
- `scripts/inject-db231-threats.js`: Injeta as 10 ameaças/NPCs em `packs/Ameacas_T20`.
- `scripts/inject-db231-items.js`: Injeta os 13 poderes, habilidades de classe, origens e itens em `packs/Itens_T20`.
- `scripts/inject-db231-journals.js`: Injeta os 3 diários e suas páginas em `packs/Diarios_T20`.
- `scripts/inject-db231-tables.js`: Injeta as 4 tabelas de rolagem e seus resultados em `packs/Tabelas_T20`.
- `scripts/validate-db231-compliance.js`: Suíte de validação automatizada e estrita, testando 100% dos requisitos normativos.

### 4. Assets Visuais e Ícones
- Ameaças: Tokens circulares transparentes 2MTT atribuídos a cada ameaça.
- Ícones: Mapeamento explícito no `icon-resolver.js` para cada criatura e item, sem utilização do ícone genérico `colosso-supremo`.

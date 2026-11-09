# Design: Integração Canônica Dragão Brasil #232

## Visão Geral da Arquitetura
A integração da Dragão Brasil #232 segue a arquitetura canônica de compêndios ClassicLevel do Foundry VTT v12/v13, padronizada após as releases v1.4.7 a v1.8.2.

### 1. Política Universal de IDs (Regra dos 16 Caracteres)
No core do Foundry VTT (`foundry.data.validators.isValidId`), todos os IDs primários de documentos e subdocumentos DEVEM possuir estritamente 16 caracteres alfanuméricos (`/^[a-zA-Z0-9]{16}$/`).
Prefixos determinísticos para a DB #232:
- Ameaças (`Ameacas_T20`): `gq8232<Slug>AAAA` (16 chars).
- Itens e Poderes (`Itens_T20`): `i8232<Slug>AAAA` (16 chars).
- Diários (`Diarios_T20`): `j8232<Slug>AAAA` (16 chars), Páginas: `p8232<Slug>AAAA` (16 chars).
- Tabelas (`Tabelas_T20`): `t8232<Slug>AAAA` (16 chars), Resultados: `r8232<Slug>AAAA` (16 chars).

### 2. Mapeamento de Pastas Canônicas
- Ameaças: Pasta *Dragão Brasil* (`wfWApuyngzFm4KOP`) em `Ameacas_T20`.
- Diários: Pasta *Dragão Brasil* (`Wk4e0z6eXGf3uY6c`) em `Diarios_T20`.
- Tabelas: Pasta *Dragão Brasil* (`W9gqZ84k7Uv50KOP`) em `Tabelas_T20`.
- Itens e Poderes: Pasta *Poderes* (`6HZCPG5QrmzhwmBe`) em `Itens_T20`.

### 3. Estrutura dos Scripts Injetores
- `scripts/inject-db232-threats.js`: Injeta as 15 ameaças/NPCs em `packs/Ameacas_T20`.
- `scripts/inject-db232-items.js`: Injeta os 13 poderes e regras de licantropia em `packs/Itens_T20`.
- `scripts/inject-db232-journals.js`: Injeta os 3 diários e suas 17 páginas em `packs/Diarios_T20`.
- `scripts/inject-db232-tables.js`: Injeta as 4 tabelas de rolagem e seus resultados em `packs/Tabelas_T20`.
- `scripts/validate-db232-compliance.js`: Suíte de validação automatizada e estrita, testando 100% dos requisitos normativos.

### 4. Contratos Canônicos Inegociáveis
1. **Desagregação Atômica de Habilidades**: Cada habilidade descrita em negrito no statblock é instanciada como um poder individual, sem união de nomes compostos.
2. **Texto Integral de Resistências**: `system.detalhes.resistencias` recebe a redação *verbatim* completa da publicação oficial para renderização visual no cabeçalho da ficha.
3. **Magias Individuais (`SpellData`)**: Conjuradores como o Xamã Finntroll recebem cada magia como um item de tipo `"magia"` individual com círculo, tipo (`div`), escola, ativação e rolagens.
4. **Perícias Situacionais**: Preservadas com `custom: true`, atributo correspondente e `label` descritivo.
5. **Assets Visuais e Tokens**: Tokens circulares 2MTT transparentes de alta resolução em `assets/tokens/` mapeados em `icon-resolver.js`.

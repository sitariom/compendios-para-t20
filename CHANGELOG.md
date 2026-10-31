# Changelog

## v1.2.0 - 2026-10-31

- **Dragão Brasil #226 (Integração e Revisão Completa)**:
  - **Tyrant / Mr. X (`Ameacas_T20`)**: Corrigido cirurgicamente para ND 10 (nível 10, treino +4, meio-nível +5, tamanho Grande, token 2x2, remoção de duplicidade de Força em Pancadas), alinhando 100% com o PDF da DB #226.
  - **Espectro do Pesadelo (`Ameacas_T20`)**: Token ajustado para 2x2 (Grande).
  - **Expurgo Onírico (`Ameacas_T20`)**: Perigo complexo ND 4 de *Devoradores de Sonhos* criado como perigo (`hazard`).
  - **Regras de Reputação (`Diarios_T20`)**: Criação completa das regras da *Caverna do Saber* em 4 páginas HTML formatadas (Regras Gerais, Fama e Infâmia, Benefícios e Efeitos, Tabela de Reputação).
- **Ferramentas de Engenharia & Auditoria (`scripts/`)**:
  - `audit.js`: Auditoria profunda de integridade de compêndios LevelDB (0 erros de JSON, IDs e pastas).
  - `stats.js`: Estatísticas em tempo real de atores, itens, macros, tabelas, diários e playlists.
  - `search.js`: Busca rápida de documentos e sub-documentos por nome em todos os compêndios.
  - `create-entry.js`, `scan-db.js`, `pack.js`, `unpack.js`: Automação e extração de novas edições.
- Atualização e compactação das bases de dados LevelDB com integridade 100% verificada.

## v1.1.0 - 2026-05-13

- Adiciona os compêndios **Diários T20** e **Playlist T20** ao manifest do módulo.
- Atualiza o conteúdo dos packs existentes (Ameaças, Itens, Macros e Tabelas).

## v1.0.0

- Versão inicial do módulo.

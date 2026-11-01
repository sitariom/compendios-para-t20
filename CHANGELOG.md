# Changelog

## v1.3.0 - 2026-10-31

- **Dragão Brasil #227 (Integração Completa)**:
  - **Ameaças (`Ameacas_T20`)**:
    - **Lynel (ND 12, Chefe de Fase)**: Ficha completa adaptada de *The Legend of Zelda* (Enorme 3x3, 600 PV, Defesa 43, 4 variações de armamento: Espada Bastarda e Escudo, Alabarda, Machado de Guerra e Tacape, Arco de Guerra, Sopro de Fogo 14d12, Investida Galopante, Brado Indomável e Coice Oportuno).
    - **Oxxdon (ND 2)**: Monstro Médio de *Memórias das Armas* com destruição e corrosão por Ferrugem.
    - **Enxame de Armas (ND 4)**: Construto Grande (140 PV, Aparar, dano passivo de área).
    - **Tropa de Mortos (ND 5)**: Falange de esqueletos com mecânica de Bando.
    - **Inumano (ND 6)**: Comandante morto-vivo com Drenar Energia e dano de trevas.
  - **Poderes de Combate (`Itens_T20`)**:
    - Adicionados **38 novos poderes de combate** da matéria *Caverna do Saber: Poderes e Combos!* (por Miguel Souza), incluindo *Ataque com Escudo II*, *Ataque Poderoso II*, *Atirar e Correr*, *Bloqueio com Escudo Perfeito*, *Carga de Cavalaria II*, *Combatente Sanguinário*, linhas de *Defesa Desarmada I-III*, *Golpe Aéreo I-III*, *Flechada de Impacto I-III*, *Flechada de Manobra I-II*, *Flechada Precisa Distante I-III*, *Golpe Poderoso Explosivo I-II*, *Torrente de Flechas I-III*, etc.
  - **Diários (`Diarios_T20`)**:
    - **Aventura: Memórias das Armas (DB #227)**: Diário completo com 8 páginas ricas cobrindo introdução, briefing em Rhond, ermos de Zakharov, invasão ao castelo e confronto final com o Inumano.
- **Automação (`scripts/`)**:
  - `scripts/inject-db227.js`: Script automatizado para injeção e validação da DB #227.

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

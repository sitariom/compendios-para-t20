# Changelog

## v1.3.1 - 2026-11-01

- **Dragão Brasil #227 (Revisão e Adequação Canônica Completa)**:
  - **Ameaças (`Ameacas_T20`)**:
    - **Revisão Integral de Conformidade**: Todas as 5 ameaças foram reconstruídas estritamente sob os padrões de `00_setup_criar_ator_v2.md` e da macro canônica `Criadora de Ameaças v6`. Cada criatura possui 34 perícias calculadas pela fórmula canônica (`VALOR_PERICIA = VALOR_FICHA - BONUS_ND - ATRIBUTO - TREINO`), CD de atributos e poderes devidamente preenchida, biografia com citações temáticas (da criatura e do escriba Grunk Ferroforja) e itens embutidos com rolagens funcionais (`rolls` de ataque e dano).
    - **Lynel (ND 12, Chefe de Fase)**: Ficha canônica (Enorme 3x3, 600 PV, Defesa 43, CD 33). Armas com rolagens completas de ataque +36 e dano (Espada Bastarda e Escudo, Alabarda, Machado de Guerra, Tacape, Mordida, Garras e Arco de Guerra +32). Poderes com rolagens e CD 33 (Sopro de Fogo 14d12, Brado Indomável, Investida Galopante com dano extra e atropelamento, Coice Oportuno 4d8+25).
    - **Oxxdon (ND 2)**: Ficha canônica consolidada (CD 16, PV 72, Defesa 20). Antena funcional (+12), mordida (+12, 1d8+10) e poder passivo Ferrugem (CD 16). Remoção de duplicata anterior inconsistente.
    - **Enxame de Armas (ND 4)**: Construto Grande (140 PV, Defesa 22, RD 5). Poder passivo Enxame com 3 rolagens de dano automático (1d10 corte, 1d6 perfuração, 1d8 impacto) e reação de Aparar funcional (+16).
    - **Tropa de Mortos (ND 5)**: Falange de esqueletos Grande (40 PV, Defesa 24, RD 5). Espada longa x2 com ataque (+20) e dano (4d8+18 corte, 19) e poder Bando.
    - **Inumano (ND 6)**: Comandante morto-vivo (48 PV, Defesa 26, CD 22). Espada longa x2 (+24, 2d8+9 corte mais 2d12 trevas), azagaia (+24, 2d6+9 perfuração mais 2d12 trevas) e poder passivo Drenar Energia (CD 22).
  - **Poderes de Combate (`Itens_T20`)**:
    - **Revisão Integral de 38 Poderes**: Adequação completa aos esquemas da macro `Criadora de Itens V8`. Todos os 38 poderes configurados com `system.tipo: "geral"`, `system.subtipo: "combate"`, ativação correta (`execucao` e custo em PM), descrições limpas com pré-requisito, `chatFlavor` formatado com citações em HTML, e rolagens/efeitos funcionais quando aplicável (ex: *Retomar Fôlego* com fórmula de cura 1d8+1, *Golpe Aéreo II-III* com dano de queda 2d6, *Combatente Sanguinário* com dano 1d8, *Esquiva II* com ActiveEffect de +3 Defesa e +3 Reflexos, *Costas Largas II* com ActiveEffect de +15 carga).
  - **Diários (`Diarios_T20`)**:
    - **Aventura: Memórias das Armas (DB #227)**: Diário completo com 8 páginas ricas cobrindo introdução, briefing em Rhond, ermos de Zakharov, invasão ao castelo e confronto final com o Inumano.
- **Automação & Validação (`scripts/`)**:
  - `scripts/rebuild-db227-threats.js`: Automação e injeção canônica das ameaças da DB #227.
  - `scripts/rebuild-db227-powers.js`: Automação e injeção canônica dos 38 poderes de combate da DB #227.
  - `scripts/validate-db227-compliance.js`: Validador formal de integridade e conformidade de schemas.

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

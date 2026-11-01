# Changelog

## v1.4.3 - 2026-11-01

- **Ajuste Fino de Fidelidade Canônica ao PDF da Dragão Brasil #228**:
  - **Ankthyr (ND 8)**:
    - *Redução de Dano*: Corrigida atribuição para **Redução de Dano Geral 5** (`system.tracos.resistencias.dano.value = 5`, `base = 5`) e **Redução de Ácido 5** (`system.tracos.resistencias.acido.value = 5`), removendo a atribuição indevida de RD individual para corte, perfuração e impacto.
    - *Perícias Treinadas Estritas*: Removido treinamento indevido em *Atletismo* e *Sobrevivência* que não constam no bloco de estatísticas do PDF da DB #228. Mantidos apenas os treinos canônicos em *Fortitude*, *Iniciativa*, *Luta*, *Percepção*, *Reflexos* e *Vontade*.
  - **Enxame Cáustico (ND 4)**:
    - *Resistências Canônicas*: Removida redução de dano física inexistente no statblock do PDF. Mantida exclusivamente a **Imunidade a Ácido** (`imunidade: true`), mantendo a mecânica de dano reduzido de armas restrita ao poder de enxame.
  - **Slark (ND 1)**:
    - *Perícias Treinadas Estritas*: Removido treinamento indevido em *Atletismo*, mantendo estritamente a perícia treinada oficial da ficha (*Furtividade +8*).
  - **Especificações OpenSpec SDD**:
    - Atualizada a `actors-specification` com novos cenários BDD para imposição de RD geral em `resistencias.dano` e fidelidade estrita de perícias treinadas publicadas.

## v1.4.2 - 2026-11-01

- **Alinhamento Canônico Total dos Atores e Organização de Compêndios (Dragão Brasil #228)**:
  - **Ameaças (`Ameacas_T20`)**:
    - *Paridade Estrutural Total com DB #227 (Lynel, Oxxdon, Inumano)*:
      - `actorDoc.items`: Padronizado estritamente como array de string IDs (`[item1._id, item2._id, ...]`), com todos os subdocumentos indexados e gravados sob `!actors.items!${actorId}.${itemId}` para correta resolução nativa no Foundry VTT.
      - `movement`: Padronizado no formato nativo T20 `{ burrow: { base, bonus: [] }, climb: { base, bonus: [] }, fly: { base, bonus: [] }, swim: { base, bonus: [] }, walk: { base, bonus: [] }, hover: false, unit: 'm', tags: [] }`.
      - `tracos`: Implementada a função normativa `buildTracos` mapeando integralmente os 13 tipos de dano do Tormenta20 com seus sub-objetos `{ value, base, bonus: [], excecao: 0, imunidade, vulnerabilidade, danoPorDado: false }`.
      - `modificadores`: Adicionado o dicionário completo com 20+ arrays de modificadores de sistema (`custoPM`, `atributos`, `ataque`, `cura`, `dano`, `pericias`).
      - `prototypeToken`: Atualizado com `sight` (*darkvision*), `disposition: -1` (ou 1 para aliados), `displayBars: 40`, `bar1` (PV) e `bar2` (PM).
      - `folder`: Configurado para `'wfWApuyngzFm4KOP'` (pasta *Dragão Brasil* em `Ameacas_T20`).
      - *Rolagens de Ataque*: Corrigido para `[['1d20', '', ''], [pericia, '', ''], ['', '', '']]` evitando duplicação do bônus de perícia resolvido pelo Foundry.
  - **Itens e Equipamentos (`Itens_T20`)**:
    - Mapeamento e alocação de todos os 17 itens de *Divinas Organizações* em suas respectivas pastas oficiais (*Armas*, *Poderes*, *Magias*, *Itens Mágicos*, *Equipamentos*, *Consumível*, *Preparados*).
  - **Tabelas de Rolagem (`Tabelas_T20`)**:
    - Mapeamento e alocação das duas novas tabelas na pasta oficial *Tabelas T20* (`xbFP75zAd0URzuDL`).
  - **Automação & Validação**:
    - Scripts `create-entry.js`, `inject-db228-threats.js`, `inject-db228-items.js`, `inject-db228-tables.js`, `validate-db228-compliance.js`, `test-all-document-types.js` e `audit.js` com 100% de aprovação e zero erros.

## v1.4.1 - 2026-11-01

- **Reconstrução Canônica Completa da Dragão Brasil #228 e Imposição de Schemas Estritos (OpenSpec SDD)**:
  - **Ameaças e Perigos (`Ameacas_T20`)**:
    - *Ankthyr (ND 8)*: Reconstrução canônica completa com 5 ataques e poderes embutidos com rolagens funcionais (`Mordida` com rolls `parts` de ataque e dano + ácido, `Agarrar Aprimorado` com rolagem de manobra, `Cuspe Ácido` com CD 26 e efeito de Muco Corrosivo contínuo, `Espreitador Subterrâneo`, `Sentido Sísmico`), 34 perícias deduzidas com a fórmula oficial, PV 308, Defesa 33 (base 31 + Des 2), sentidos, deslocamento estruturado e biografia com citações duplas em HTML.
    - *Enxame Cáustico (ND 4)*: Reconstrução com 3 poderes embutidos (`Enxame Cáustico` com 3d8 de ácido automático, `Gosma Corrosiva` persistente e `Sentido Sísmico`), 34 perícias, PV 140, Defesa 23 (base 22 + Des 1) e biografia canônica.
    - *Slark (ND 1 Lacaio)*: Reconstrução com `Garras` (ataque +11, 2d6+9 19/x3 com rolls `parts`), `Queda Livre` e `Saliva` (CD 14 cegueira), 34 perícias, PV 9, Defesa 15 (base 12 + Des 3).
    - *Desabamento dos Túneis (Hazard ND 8)*: Perigo complexo completo com todas as ações e efeitos mecânicos.
    - *Parceiros Especiais*: *Reabilitador* com Julgamento de Khalmyr e Equilíbrio da Justiça (+2 Defesa/Resistências); *Allihennali* com Cura de Luz, Bênção Feérica (-2 PM em cura) e Cura Maior; *Guaxininjas* com Invocação Furtiva e Flanquear Sorrateiro (+2 Furtividade/Ataque).
    - *Expurgo de Chaves Órfãs*: Remoção definitiva de 19 entradas duplicadas ou vazias do ClassicLevel.
  - **Itens, Poderes e Magias (`Itens_T20`)**:
    - *17 Itens de Divinas Organizações Reconstruídos*: Todas as armas específicas (*Arco dos Arautos*, *Arma Silente*) configuradas com estrutura nativa `rolls.parts` (`ataque0` e `dano1`), `criticoM` e `criticoX`.
    - *Automação de ActiveEffects*: Todos os itens com modificadores mecânicos receberam ActiveEffects nativos com chaves Tormenta20 (`flags.tormenta20.transfer: true`).
    - *100% de Presença de Variáveis de Template*: Zero campos omitidos (`peso`, `espacos`, `qtd`, `preco`, `equipado`, `ativacao`, `duracao`, `chatFlavor`, etc.).
  - **Tabelas de Rolagem (`Tabelas_T20`)**:
    - *Desabamento dos Túneis: Efeitos por Rodada (DB #228)*: Nova RollTable oficial com fórmula `1d6` cobrindo Destroços, Fenda no Chão, Bloqueio e Passagem Livre.
    - *Divinas Organizações de Arton (DB #228)*: Nova RollTable oficial com fórmula `1d17` para sorteio de encontros e patronos sagrados.
  - **Especificações OpenSpec SDD**:
    - Atualização formal das living specs `actors-specification` e `items-specification` impondo que armas possuam `rolls.parts`, atores possuam `items` embutidos no documento principal e que nenhuma variável de template seja omitida.
  - **Automação & Validação**:
    - Scripts `create-entry.js`, `inject-db228-threats.js`, `inject-db228-items.js`, `inject-db228-tables.js`, `validate-db228-compliance.js`, `test-all-document-types.js` e `audit.js` com 100% de aprovação e 0 erros.

## v1.4.0 - 2026-11-01

- **Dragão Brasil #228 (Integração Canônica Completa)**:
  - **Ameaças e Perigos (`Ameacas_T20`)**:
    - *Ankthyr (ND 8)*: Predador colossal de Trebuck (Grande 2x2, 308 PV, Defesa 33 com base 31, RD 5 e ácido 5). Mordida com 4d12+24 mais 4d8 ácido, Agarrar Aprimorado (+28), Cuspe Ácido (CD 26 com 6d8+6 mais muco corrosivo por 2 turnos), Espreitador Subterrâneo (+2 ataque, +1d12 dano), Sentido Sísmico e 34 perícias canônicas deduzidas. Token top-down 2-Minute Tabletop.
    - *Enxame Cáustico (ND 4)*: Enxame animal Grande (2x2, 140 PV, Defesa 23 com base 22, imunidade a ácido e RD 5 a armas). Dano automático de 3d8 ácido, Gosma Corrosiva e Sentido Sísmico. Token top-down 2-Minute Tabletop.
    - *Slark (ND 1)*: Humanoide lacaio Médio (1x1, 9 PV, Defesa 15 com base 12). Garras +11 (2d6+9, 19/x3), Queda Livre (+2 ataque e +2d6 dano se surpreender) e Saliva Cegante (Reflexos CD 14). Remoção de duplicatas legadas inconsistentes. Token top-down 2-Minute Tabletop.
    - *Desabamento dos Túneis (ND 8)*: Perigo complexo de fuga em 7 rodadas com perigos em 1d6 (Destroços, Fendas, Bloqueios e Soterramento 20d6) e 4 ações de superação (Avançar, Correr, Carregar Outro, Procurar Caminho). Token top-down 2-Minute Tabletop.
    - *Parceiros Especiais*: Reabilitador (Juiz de Khalmyr), Allihennali (Fada curadora) e Guaxininjas (Capangas de Tamu-ra).
  - **Itens, Poderes e Magias (`Itens_T20`)**:
    - *17 Novos Itens de Divinas Organizações*: Arco dos Arautos (arma com Marca da Presa), Certificado de Conclusão (Poder de Destino), Chave Mestra (destrancar automático), Bilhete de Valluk Delsori (metamorfose/disfarce), Máscara do Sol Dourado (+10 Ladinagem, -2 Furtividade), Pingente Rubro (redução de perda de PM lefeu), Alma de Dragão (redução de dano elemental), Âncora Naufragista (natação e pilotagem), Arma Silente (arma de adamante com +5 Conhecimento/Guerra/Nobreza), Memorizar Conhecimento (Magia Universal 2), Cítola da Paz (músicas custam -1 PM e +5 mudar atitude), Percepção de Masmorra (Poder Concedido de Hyninn), Rosário da Vida (cura mágica aumentada por patamar), Bússola das Lágrimas, Corso Sombrio, Previdência da Vigília (Dom da Imortalidade) e Bomba de Tinta (área escorregadia e lentidão).
  - **Diários de Bordo (`Diarios_T20`)**:
    - *Aventura: Emergir Monstruoso (DB #228)*: Diário completo em 8 páginas HTML estruturadas com ganchos, cenas 1 a 7, desabamento e epílogo com links interativos `@UUID`.
    - *Cenário: Divinas Organizações (DB #228)*: Diário completo em 11 páginas detalhando a história, ritos e mecânicas das 20 organizações religiosas exóticas de Arton.
  - **Automação & Validação**:
    - Scripts `inject-db228-threats.js`, `inject-db228-items.js`, `inject-db228-journals.js` e `validate-db228-compliance.js` com 100% de aprovação.

## v1.3.6 - 2026-11-01

- **Padronização Exclusiva de Tokens de Atores com 2-Minute Tabletop**:
  - **Diretriz de Tokens**: Definido e aplicado que a fonte exclusiva para tokens de atores (`prototypeToken.texture.src`) é o acervo de tokens *top-down* transparentes em alta resolução do **2-Minute Tabletop** (`https://2minutetabletop.com/`).
  - **Mapeamento e Download de Tokens 2MTT (`assets/tokens/`)**:
    - *Lynel*: Token top-down de centauro draconiano/bestial (`draconiccentaur` -> `assets/tokens/lynel.png`).
    - *Tyrant*: Token top-down de abominação de carne e músculo (`fleshabomination` -> `assets/tokens/tyrant.png`).
    - *Espectro do Pesadelo*: Token top-down de corcel espectral macabro (`deathtouchednightmare` -> `assets/tokens/espectro-do-pesadelo.png`).
    - *Oxxdon*: Token top-down de monstro escavador quitinoso (`bulette` -> `assets/tokens/oxxdon.png`).
    - *Expurgo Onírico*: Token top-down de névoa abissal do vazio (`voidcloudgreater` -> `assets/tokens/expurgo-onirico.png`).
    - *Enxame de Armas*: Token top-down de aparição de lâminas dançantes (`swordwraith` -> `assets/tokens/enxame-de-armas.png`).
    - *Tropa de Mortos*: Token top-down de guerreiro esquelético em formação (`skeletonfighter` -> `assets/tokens/tropa-de-mortos.png`).
    - *Inumano*: Token top-down de esqueleto blindado de elite (`skeletonarmored` -> `assets/tokens/inumano.png`).
  - **Automação do Fluxo de Criação (`scripts/create-entry.js` e `scripts/icon-resolver.js`)**:
    - Nova função `resolveToken({ name })` e buscador sob demanda `searchAndDownload2MinuteTabletopToken`.
    - `buildNpcActor` garante que todo novo ator receba obrigatoriamente token 2-Minute Tabletop sincronizado com seu tamanho de grid.

## v1.3.5 - 2026-11-01

- **Revisão e Aprimoramento de Ícones com Novas Fontes (Wowhead / WoW Icons)**:
  - **Ameaças e Tokens (DB #226 e DB #227)**:
    - *Espectro do Pesadelo*: Atualizado com ícone ilustrado em cores do corcel do pesadelo (`ability_mount_nightmarehorse`), relincho aterrador (`ability_warlock_howlofterror`), devorar sonhos (`spell_nature_sleep`) e semi-incorpóreo (`spell_shadow_dispersion`).
    - *Tyrant*: Atualizado para retrato temático de abominação mutante (`achievement_dungeon_unboundabomination`), cura acelerada biológica (`spell_nature_regeneration`), fúria bestial do Super Tyrant (`ability_druid_enrage`) e imunidade a magia (`spell_shadow_antimagicshell`).
    - *Oxxdon*: Atualizado para topeira monstruosa colorida (`inv_pet_mole`), ferrugem com ácido corrosivo (`spell_nature_acid_01`) e antena quitinosa (`inv_misc_monsterhorn_04`).
    - *Enxame de Armas*: Atualizado para tempestade de lâminas de aço (`ability_warrior_bladestorm`) e aparar com lâminas cruzadas (`ability_rogue_bladetwisting`).
    - *Lynel*: Poderes complementados com sopro de fogo de dragão (`inv_fyrakk_dragonbreath`), brado indomável (`ability_warrior_battleshout`) e investida galopante (`ability_warrior_charge`).
    - *Tropa de Mortos & Inumano*: Poder Bando atualizado com horda de mortos-vivos (`spell_deathknight_armyofthedead`) e Drenar Energia atualizado com raio de drenagem de vida (`spell_shadow_lifedrain`).
  - **Poderes de Combate (Caverna do Saber em `Itens_T20`)**:
    - Substituição de fallbacks genéricos de T20 por artes temáticas do acervo:
      - *Bloqueio com Escudo Perfeito* e *Escudo Fundação*: Muralha de escudo dourada (`ability_warrior_shieldwall`).
      - *Golpe Poderoso Explosivo I e II*: Esmagamento de colosso com impacto no solo (`ability_warrior_colossussmash`).
      - *Combatente Sanguinário*: Frenesi de sangue (`ability_warrior_bloodfrenzy`).
      - *Carga de Cavalaria II* e *Ginete de Guerra*: Investida de montaria de guerra blindada (`ability_mount_charger`).
      - *Golpear e Correr* e *Atirar e Correr*: Arrancada alada de mobilidade (`ability_rogue_sprint`).
      - *Flechada Precisa Distante I, II e III*: Disparo de precisão na mira (`ability_hunter_snipershot`).
      - *Flechada de Impacto I, II e III*: Flecha carregada de impacto (`ability_hunter_aimedshot`).

## v1.3.4 - 2026-11-01

- **Padronização e Resolução Canônica de Ícones (Tormenta20 & Game-Icons)**:
  - **Novo Motor de Resolução e Download (`scripts/icon-resolver.js`)**:
    - Mapeamento inteligente de palavras-chave, armas, ataques naturais, poderes de combate e ameaças para os 918 ícones oficiais do sistema Tormenta20 (`systems/tormenta20/icons/...`).
    - Integração direta com o acervo oficial do Game-Icons.net (4.176 ícones via `scripts/game-icons-index.json`), com download automatizado e estilização em SVG para `assets/icons/` e `/home/orange/Documents/Tormenta20/icons/`.
  - **Evolução da Criação de Atores e Itens (`scripts/create-entry.js`)**:
    - Funções `buildItem` e `buildNpcActor` atualizadas para resolver ícones canônicos automaticamente ao invés de usar placeholders genéricos (`mystery-man.svg`).
    - Sincronização automática da textura do token (`prototypeToken.texture.src`) e dimensões baseadas no tamanho da criatura.
  - **Aplicação Retroativa Completa (DB #226 e DB #227)**:
    - **DB #226**:
      - *Tyrant*: Ícone do ator e token atualizados para `modules/compendios-para-t20/assets/icons/ameacas/tyrant.svg`. Armas e poderes atualizados (*Pancadas* -> `pancada.webp`, *Cura Acelerada* -> `cura-pelas-maos.webp`, *Super Tyrant* -> `super-tyrant.svg`, *Imunidade a Magia* -> `imunidade-magia.webp`).
      - *Espectro do Pesadelo*: Ícone do ator e token atualizados para `systems/tormenta20/icons/ameacas/aparicao.png`. Poderes e armas atualizados (*Cascos* -> `cascos.webp`, *Relincho Aterrador* -> `urro-selvagem.webp`, *Devorar Sonhos* -> `ataque-trevas.webp`, *Terror Encarnado* -> `aura-aterradora.webp`, *Sensibilidade à Luz* -> `sensibilidade-luz.webp`, *Semi-Incorpóreo* -> `forma.webp`).
      - *Expurgo Onírico*: Atualizado para `systems/tormenta20/icons/poderes/tormenta.webp`.
    - **DB #227**:
      - *Lynel*: Ator e token atualizados para `centauro-combatente.png`. Todas as 12 armas e poderes embutidos atualizados para os ícones canônicos correspondentes (`espada-bastarda.webp`, `alabarda.webp`, `machado-de-guerra.webp`, `tacape.webp`, `arco-longo.webp`, `mordida.webp`, `garras.webp`, `cospe-chamas.webp`, `urro-selvagem.webp`, `investida.webp`, `cascos.webp`, `espada-longa.webp`).
      - *Oxxdon*: Ator e token atualizados para `oxxdon.svg`. Itens atualizados (*Antena* -> `ferrao.webp`, *Mordida* -> `mordida.webp`, *Ferrugem* -> `ferrugem.svg`).
      - *Enxame de Armas*: Ator e token atualizados para `enxame-de-armas.svg`. Itens atualizados (*Enxame de Armas* -> `espada-longa.webp`, *Aparar* -> `duelo.webp`).
      - *Tropa de Mortos*: Ator e token atualizados para `falange.png`. Itens atualizados (*Espada Longa da Tropa* -> `espada-longa.webp`, *Bando* -> `taticas-alcateia.webp`).
      - *Inumano*: Ator e token atualizados para `esqueleto-de-elite.png`. Itens atualizados (*Espada Longa* -> `espada-longa.webp`, *Azagaia* -> `azagaia.webp`, *Drenar Energia* -> `ataque-trevas.webp`).
      - *38 Poderes de Combate (Caverna do Saber)*: Atualizados integralmente em `Itens_T20` para os ícones temáticos do Tormenta20 (`durao.webp`, `briga.webp`, `arco-longo.webp`, `golpe-cruel.webp`, `flechas.webp`, `golpe-violento.webp`, `duelo.webp`, `rastreador.webp`, `caminho-cavaleiro-montaria.webp`, `fabricar-item-superior.webp`, `escudo-pesado.webp`, `arco-curto.webp`, `autoconfianca.webp`, `escudo-leve.webp`, `baluarte.webp`, `casca-grossa.webp`, `furia-titanica.webp`, `ataque-especial.webp`).

- **Mapeamento e Preenchimento Completo de Traços (Resistências, Imunidades, Condições e Idiomas)**:
  - Mapeados e preenchidos integralmente os campos de `system.tracos` em todos os atores da Dragão Brasil #227:
    - **Resistências a Dano (`tracos.resistencias`)**: Configurados os 13 tipos de dano com seus valores exatos de RD e imunidades (ex: *Lynel* com RD 10 a ácido, eletricidade, fogo e frio; *Enxame de Armas* com RD 5 geral; *Tropa de Mortos* com RD 5 a corte, frio e perfuração; *Inumano* com imunidade total a dano de frio).
    - **Imunidades a Condições e Efeitos (`tracos.ic`)**: Marcados no array de condições e efeitos especiais (ex: *Enxame de Armas* e *Tropa de Mortos* com imunidades a condições de construto/morto-vivo e a manobras/alvos únicos; *Inumano* com imunidades de morto-vivo).
    - **Idiomas (`tracos.idiomas`)**: Configurados nos campos de sistema e detalhes (`comum` para Lynel e Inumano; `Nenhum` para Oxxdon, Enxame de Armas e Tropa de Mortos).
    - **Tamanho (`tracos.tamanho`)**: Sincronizado com os tamanhos canônicos ("eno" para Lynel, "gra" para Enxame e Tropa, "med" para Oxxdon e Inumano).

## v1.3.2 - 2026-11-01

- **Correção da Defesa Base no Foundry VTT (Dragão Brasil #227)**:
  - Corrigido o cálculo de `system.attributes.defesa.base` para que a fórmula do sistema Tormenta20 (`defesa.base + @des`) resulte exatamente no valor canônico da ficha:
    - **Lynel (ND 12)**: Base ajustada de 43 para 35 (35 + Des 8 = Defesa 43). Anteriormente exibia 51 na ficha do Foundry.
    - **Oxxdon (ND 2)**: Base ajustada de 20 para 16 (16 + Des 4 = Defesa 20).
    - **Enxame de Armas (ND 4)**: Base ajustada de 22 para 20 (20 + Des 2 = Defesa 22).
    - **Tropa de Mortos (ND 5)**: Base ajustada de 24 para 21 (21 + Des 3 = Defesa 24).
    - **Inumano (ND 6)**: Base ajustada de 26 para 24 (24 + Des 2 = Defesa 26).
  - Validador `scripts/validate-db227-compliance.js` atualizado para assegurar `defesa.base + des === defesa.value`.

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

# Changelog

## v1.6.1 - 2026-11-07

- **Hotfix: Deduplicação e Imposição de Mapeamento Fixo de IDs em `Itens_T20` (DB #229)**:
  - **Eliminação de Cópias Duplicadas**:
    - Identificada e corrigida a ocorrência de itens duplicados no compêndio `Itens_T20` e na árvore de fontes `src/packs/Itens_T20/`, decorrente da geração dinâmica de IDs aleatórios em múltiplas execuções do script de injeção.
    - Expurgadas em definitivo as 13 chaves duplicadas do LevelDB e seus respectivos subdocumentos de `ActiveEffects`, além da remoção dos 13 arquivos JSON excedentes em `src/packs/Itens_T20/`.
  - **Idempotência Estrita no Script de Injeção (`scripts/inject-db229-items.js`)**:
    - Implementação da tabela determinística `DB229_ID_MAP` fixando permanentemente os IDs canônicos dos 8 parceiros e 5 itens de aventura de acordo com os links `@UUID` já integrados nos diários e tabelas.
    - Inclusão de rotina automatizada de pré-purga de chaves legadas e duplicatas (`DUPLICATE_IDS_TO_PURGE`).
  - **Validação Automatizada de Unicidade (`scripts/validate-db229-compliance.js`)**:
    - Incorporada verificação estrita de cardinalidade: o validador agora audita a contagem exata de cópias de cada item no compêndio e reprova formalmente qualquer registro com mais de 1 documento.
    - 100% de aprovação e contagem rigorosa de 2.717 documentos principais em `Itens_T20`.

## v1.6.0 - 2026-11-07

- **Dragão Brasil #229 (Integração Canônica Completa de Ameaças, Parceiros, Itens e Aventura)**:
  - **Ameaças e Criaturas (`Ameacas_T20`)**:
    - *Defensor Rochoso Desperto (ND 8)*: Construto Médio (320 PV, Defesa 33 base 33 + Des 0, RD 10 geral, imunidade a atordoado e petrificado). Ataque natural *Duas pancadas +26* (4d8+19, x3 com `rolls.parts`), *Imobilidade* (camuflagem Percepção CD 35), *Natureza Abascanta* (50% de ignorar magias exceto Despedaçar) e *Pancada Atordoante* (Fort CD 26 evita). Token top-down 2-Minute Tabletop (*Gemstone Guardian*).
    - *Revoada de Serpes (ND 8)*: Monstro Enorme 3x3 (320 PV, Defesa 33 base 32 + Des 1, deslocamento 9m e voo 18m, imunidade a paralisia). *Mordida +26* (2d6+12), *Ferrão +26* (1d8+12 mais veneno), *Agarrar Aprimorado* (+31) e *Peçonha Concentrada* (1d12 PV/rodada por 3 rodadas, Fort CD 26 reduz). Token top-down 2MTT (*Young Wyvern*).
    - *Presa do Grande Basilisco (ND 3)*: Humanoide Médio (21 PV, Defesa 20 base 18 + Des 2). *Machado de batalha +10* (1d8+5 mais veneno, 20/x3), *Ódio Sórdido* (+2 ataque e +1d6 dano contra flanqueados ou sob condição), *Vitalidade Peçonhenta* (cura 1d12 PV com efeitos de veneno) e *Peçonha Concentrada* (CD 19). Token top-down 2MTT (*Cultist*).
    - *Basilisco Ancestral (ND 9)*: Monstro Enorme 3x3 (370 PV, Defesa 33 base 31 + Des 2, deslocamento 9m e natação 9m, RD 10, imunidade a metamorfose, resistência a veneno +10). *Mordida +27* (4d8+25 mais veneno), *Olhar Petrificante* (Reflexos CD 28; falha: lento, se já lento petrifica), *Sopro* (cone 9m, 3d12 imediato + 3d12/rodada de envenenado, Fort CD 28 reduz à metade e evita condição) e *Peçonha Potente* (2d12 PV/rodada por 3 rodadas, Fort CD 28 reduz). Token top-down 2MTT (*Sea Basilisk*).
    - Todas as ameaças configuradas com 34 perícias deduzidas com fórmula padrão, Defesa Base dinâmica (`base + des = value`), traits de 13 tipos de dano e biografias canônicas com citações duplas (`#800000` / `#006400`) e apresentação em Arial.
  - **Parceiros Especiais & Aventura (`Itens_T20`)**:
    - **Diretriz Canônica Respeitada**: 100% dos parceiros criados estritamente como itens de `type: "poder"` com `system.subtipo: "parceiro"` na pasta canônica *Parceiros* (`0uRx5Efj3tk7P5Xr`), com zero parceiros instanciados como atores.
    - *5 Parceiros Especiais de Os Cães das Colinas*:
      - *Arius Gorgonius Dubitatius*: Iniciante (+2 em Conhecimento, Nobreza, Misticismo e Religião), Veterano (+3 nas perícias e resistências), Mestre (+4 nas perícias, resistências e rolagens de dano).
      - *Aylarianna Purpúrea (Ayla)*: Iniciante (+2 em Enganação e Ladinagem, preparado alquímico até T$ 150), Veterano (+3 nas perícias, poção até T$ 300), Mestre (+4 nas perícias, -1 PM em magias de ilusão, muda preços em 20% ou 30% a seu favor).
      - *Ignis Crae*: Iniciante (+2 na Defesa, resistências e RD 2), Veterano (+3 na Defesa, resistências e RD 3), Mestre (+5 na Defesa, +5 resistências e +10 RD compartilhado com aliado adjacente).
      - *Kir’zanaath Odello (Kiki)*: Iniciante (+2 em Atuação, Investigação e Culinária), Veterano (+3 nas perícias, substitui Percepção e Intuição por Investigação), Mestre (+4 nas perícias, Inspiração de bardo).
      - *Rexthor*: Iniciante (+2 em Luta, +1d8 em rolagem de dano 1x/rodada), Veterano (+3 em Luta, Furtividade e Percepção), Mestre (+4 nas perícias, nunca surpreendido e imune a flanqueamento).
    - *3 Parceiros de Breves Jornadas*:
      - *Defensor Rochoso Desperto*: Parceiro guardião veterano (+3 Defesa e resistências).
      - *Kemooz Pensativo*: Gênio da terra iniciante (cria cubos de terra com RD 5 e 30 PV).
      - *Filhote de Grifo*: Montaria iniciante (+3m deslocamento terrestre).
    - *5 Itens, Matérias-Primas, Venenos e Armas*:
      - *Olho de Basilisco Ancestral*: Órgão lendário para rituais de reversão de petrificações antigas.
      - *Couro de Basilisco Ancestral*: Matéria-prima superior avaliada em T$ 2.000 para fabricação de armaduras.
      - *Peçonha Concentrada*: Veneno com dano de 1d12 PV/rodada por 3 rodadas (CD 26).
      - *Peçonha Potente*: Veneno com dano de 2d12 PV/rodada por 3 rodadas (CD 28).
      - *Machado de Batalha do Culto do Basilisco*: Arma marcial com estrutura `rolls.parts` completa.
    - Todos os itens configurados com descrições verbatim dos PDFs oficiais e subdocumentos ClassicLevel de `ActiveEffects` em `!items.effects!itemId.effId`.
  - **Diários de Bordo (`Diarios_T20`)**:
    - *Aventura: O Olho do Basilisco (DB #229)*: Diário em 8 páginas cobrindo Resumo, Cenas 1 a 6 e Epílogo com links interativos `@UUID` para atores, itens e tabelas.
    - *Cenário: Os Cães das Colinas (DB #229)*: Diário em 6 páginas detalhando o romance de Denise Flaibam e a biografia completa dos 5 heróis.
  - **Tabelas de Rolagem (`Tabelas_T20`)**:
    - *Encontros nas Montanhas Sanguinárias (DB #229)*: Tabela oficial 1d6 abrangendo Escalada Perigosa, Ninho de Grifo, Revoada de Serpes, Peregrinação Druida, Kemooz Pensativo e Rastejante Voraz.
  - **Especificações OpenSpec SDD & CodeGraph**:
    - Evolução das living specs `actors-specification` e `items-specification` com requisitos normativos para a DB #229.
    - OpenSpec change `integrate-dragao-brasil-229` arquivada com sucesso (`openspec validate --all` 100% aprovado).
    - Grafo AST do CodeGraph sincronizado.
  - **Auditoria & Integridade**:
    - 5.915 documentos principais (43.472 registros LevelDB no total).
    - 0 erros de JSON, 0 IDs faltantes e 0 pastas órfãs na auditoria geral (`audit.js` e `validate-db229-compliance.js`).

- **Hotfix: Consolidação do Padrão de Biografias de Atores com Citações Duplas (DB #226, #227 e #228)**:
  - **Padronização Visual Canônica de Ameaças**:
    - Reafirmação e consolidação do padrão de duas citações em `blockquote` (citação visceral da criatura/vítima com borda `#800000` e citação de observação de campo do escriba goblin *Grunk Ferroforja* da Gazeta do Reinado com borda `#006400`) seguido do parágrafo de apresentação descritiva em fonte Arial destacando o nome da criatura em negrito e vermelho.
    - Aplicado a todas as 12 ameaças e perigos das edições DB #226 (*Tyrant ND 10*, *Espectro do Pesadelo ND 5*, *Come-Sonhos ND 2*, *Expurgo Onírico ND 4*), DB #227 (*Lynel ND 12*, *Oxxdon ND 2*, *Enxame de Armas ND 4*, *Tropa de Mortos ND 5*, *Inumano ND 6*) e DB #228 (*Ankthyr ND 8*, *Enxame Cáustico ND 4*, *Slark ND 1*).
  - **Fidelidade Integral de Itens Preservada**:
    - Mantida a integridade estrita das descrições dos 58 itens e poderes (DB #227 e DB #228) como textos 100% integrais e verbatim dos PDFs oficiais, sem inserção de blocos decorativos fictícios.
  - **Validação e Integridade**:
    - 100% de aprovação nos validadores `validate-db227-compliance.js`, `validate-db228-compliance.js` e auditoria `audit.js` com 34.800+ documentos e 0 erros.

## v1.5.0 - 2026-11-01

- **Fidelidade Integral às Descrições dos PDFs e Padronização Canônica Total de ActiveEffects (DB #226, #227 e #228)**:
  - **Fidelidade Textual Integral aos PDFs Oficiais & Padrão Canônico de Biografia**:
    - Padronização estrita de todos os 58 itens e poderes (38 poderes da DB #227 e 20 itens/parceiros da DB #228) para utilizarem **exclusivamente e integralmente o texto verbatim publicado nos PDFs oficiais**, com limpeza total de `system.chatFlavor`.
    - Padronização rigorosa de todas as 12 ameaças e perigos (DB #226, DB #227 e DB #228) segundo o padrão canônico estabelecido: **duas citações estilizadas em blockquote** (uma citação visceral da criatura/vítima com borda `#800000` e uma citação de observação de campo do escriba goblin *Grunk Ferroforja* da Gazeta do Reinado com borda `#006400`) seguidas do **parágrafo de apresentação descritiva** em fonte Arial introduzindo a criatura em Tormenta20 com destaque em vermelho/negrito.
  - **Reconstrução e Automação de ActiveEffects em 100% dos Poderes da DB #227 (Itens_T20)**:
    - Todos os 38 poderes de combate da *Caverna do Saber* receberam `ActiveEffects` funcionais com a arquitetura canônica de compêndios ClassicLevel do Foundry VTT (`effects: [effId]` no documento pai e subdocumento completo em `!items.effects!${itemId}.${effId}`).
    - Configurados modificadores reais para poderes mecânicos: *Costas Largas II* (+15 carga), *Esquiva II* (+3 Defesa e Reflexos), *Economia de Habilidade* (-1 PM), *Especialista em Coberturas* (+2 Defesa e Reflexos), *Especialista em Camuflagens* (+5 Furtividade), *Ataque com Escudo II* (0 PM), *Ataque Poderoso II* (sem penalidade), *Golpe Aéreo I* (+2 ataque por posição elevada), *Flechadas de Manobra I e II* (+2 e +5 em manobras), etc.
  - **Revisão Integral e Enriquecimento de Ameaças da DB #226 e DB #227 (Ameacas_T20)**:
    - **DB #226**:
      - *Tyrant (ND 10)*: Lore integral do PDF sem citações de Grunk Ferroforja; subdocumentos `Super Tyrant` (+5 Defesa, +1d10 dano, ação extra, 18m deslocamento, sangrando), `Imunidade a Magia` e `Cura Acelerada 5` dotados de ActiveEffects funcionais.
      - *Espectro do Pesadelo (ND 5)*: Lore integral do PDF; subdocumentos `Cascos`, `Devorar Sonhos`, `Relincho Aterrador` (apavorado/abalado CD 20), `Semi-Incorpóreo` (25% evasão), `Terror Encarnado` (+2 ataque / +1d8 trevas) e `Vulnerabilidade à Luz do Dia` (debilitado) configurados com ActiveEffects.
      - *Come-Sonhos (ND 2)*: Lore integral e poderes `Mordida`, `Devorar Sonhos` e `Êxtase Onírico` configurados.
      - *Expurgo Onírico (ND 4)*: Perigo complexo com regras e ações de superação 100% integrais do PDF.
    - **DB #227**:
      - *Lynel (ND 12)*, *Oxxdon (ND 2)*, *Enxame de Armas (ND 4)*, *Tropa de Mortos (ND 5)* e *Inumano (ND 6)*: Reconstruídos com biografias do PDF e ActiveEffects para todos os poderes mecânicos (`Brado Indomável`, `Investida Galopante`, `Coice Oportuno`, `Sopro`, `Ferrugem`, `Enxame`, `Aparar`, `Bando` e `Drenar Energia`).
  - **Evolução das Especificações OpenSpec (SDD)**:
    - `items-specification`: Incorporados requisitos normativos de fidelidade textual integral ao PDF (`Integral Source PDF Text Fidelity`) e imposição da arquitetura de subdocumentos de `ActiveEffects` em ClassicLevel com BaseEffect schema.
    - `actors-specification`: Atualizados requisitos normativos para biografia estritamente baseada no lore publicado e indexação correta de subdocumentos de itens e efeitos (`!actors.items!` e `!actors.items.effects!`).
    - Validação formal com `openspec validate --all` com 100% de aprovação (8/8 specs válidas).
  - **Auditoria de Integridade**:
    - Mais de 34.800 documentos auditados com 0 erros de JSON, 0 documentos sem ID e 0 pastas órfãs.

## v1.4.7 - 2026-11-01

- **Padronização Canônica de Subdocumentos e Resolução Nativa no Foundry VTT**:
  - **Arquitetura Oficial de Subdocumentos do ClassicLevel**:
    - Alinhamento rigoroso com a arquitetura dos 1.486 itens oficiais de `Itens_T20` (como *A Bênção de Megalokk* e *Parceiro Gambá*): no documento principal do Item em LevelDB, a propriedade `effects` armazena estritamente o array de IDs dos subdocumentos (`effects: ["effId1", ...]`), enquanto o documento do `ActiveEffect` é armazenado na chave filha `!items.effects!${itemId}.${effId}` com `origin: item.name`, `type: "base"`, `system: {}` e `flags.tormenta20` completo.
    - Essa separação é o padrão canônico do Foundry VTT para carregar efeitos embutidos de compêndios sem falhas na indexação do LevelDB, permitindo que o Foundry resolva os efeitos na aba de Efeitos da ficha.

## v1.4.6 - 2026-11-01

- **Conformidade do DataModel BaseEffect e Sincronização em `src/packs/` (Dragão Brasil #228)**:
  - **DataModel de ActiveEffects (`BaseEffect`)**:
    - Ajustado o schema dos ActiveEffects para preenchimento estrito do DataModel oficial do Tormenta20 (`identifier`, `targets: ['self']`, `status: null`, `abilityUse`), `origin: ""` e `priority: 20`, impedindo rejeição de schema na ficha do Foundry VTT.
  - **Efeitos nos Ataques e Poderes de Criaturas (`Ameacas_T20`)**:
    - Adicionados ActiveEffects e condições para todos os poderes das ameaças: *Agarrar Aprimorado* (condição `agarrado`), *Cuspe Ácido* (dano contínuo), *Espreitador Subterrâneo* (+2 ataque), *Sentido Sísmico* (percepção às cegas), *Enxame Cáustico* (área corrosiva), *Gosma Corrosiva* (dano residual 1 rodada), *Queda Livre* (+2 ataque) e *Saliva* (condição `cego`).
  - **Sincronização com a Árvore de Fontes (`src/packs/`)**:
    - Todos os 20 itens de Divinas Organizações, 4 ameaças e 2 tabelas da DB #228 foram gerados e salvos em `src/packs/Itens_T20/`, `src/packs/Ameacas_T20/` e `src/packs/Tabelas_T20/` garantindo persistência tanto no código-fonte quanto nos compêndios binários LevelDB.

## v1.4.5 - 2026-11-01

- **Correção Definitiva de Renderização de ActiveEffects no Foundry VTT**:
  - **Serialização de Objetos em `Itens_T20`**:
    - Identificado e corrigido o motivo pelo qual itens apareciam sem efeitos no Foundry: a serialização anterior havia substituído a coleção embutida de efeitos por um array de strings de IDs (`effects: ['id1', ...]`), fazendo com que o Foundry VTT não conseguisse instanciar os documentos embutidos na aba de "Efeitos".
    - Tanto `item.effects` quanto `item.system.effects` foram padronizados estritamente como **arrays de objetos completos de `ActiveEffect`** (`[ { _id, name, img, changes, transfer, flags, duration, ... } ]`), com paridade exata aos poderes funcionais da DB #227 (como *Costas Largas II* e *Esquiva II*).
    - As chaves de subdocumentos em `!items.effects!${itemId}.${effId}` continuam preservadas para total compatibilidade com iteradores de banco de dados ClassicLevel.
  - **Efeitos 100% Funcionais nos 20 Itens da DB #228**:
    - Todos os 20 itens, poderes e parceiros agora exibem imediatamente seus efeitos na aba "Efeitos" da ficha do item no Foundry VTT e transferem seus bônus de forma automática quando equipados ou arrastados para a ficha de um personagem.

## v1.4.4 - 2026-11-01

- **Migração de Parceiros para Poderes e Automação Rica de ActiveEffects (Dragão Brasil #228)**:
  - **Diretriz Canônica de Parceiros, Familiares e Montarias**:
    - Estabelecido e aplicado que todo Parceiro, Familiar ou Montaria deve ser criado estritamente como um item de `type: "poder"` com `system.subtipo: "parceiro"` em `packs/Itens_T20` dentro da pasta canônica **Parceiros** (`0uRx5Efj3tk7P5Xr`), e **NUNCA como um ator em `Ameacas_T20`**.
    - *Expurgo de Ameacas_T20*: Removidos definitivamente os 3 atores de parceiros (*Reabilitador*, *Allihennali*, *Guaxininjas*) e seus 22 subdocumentos órfãos do compêndio de ameaças. `Ameacas_T20` retém estritamente as 4 ameaças e perigos canônicos da aventura: *Ankthyr (ND 8)*, *Enxame Cáustico (ND 4)*, *Slark (ND 1)* e *Desabamento dos Túneis (Hazard ND 8)*.
  - **Reconstrução dos 20 Itens, Poderes e Parceiros (`Itens_T20`)**:
    - *Parceiro: Reabilitador*: Poder de parceiro especial com ativação de cena equilibrando modificadores da corte divina de Khalmyr e `ActiveEffect` de *+2 Defesa e Resistências*.
    - *Parceiro: Allihennali*: Poder de parceiro feérico com rolagens de *Cura de Luz* (2d6 PV) e *Cura Maior* (6d6 PV), além de `ActiveEffect` de *-2 PM em magias de cura*.
    - *Parceiro: Guaxininjas*: Poder de parceiro capanga com rolagem de invocação (1d4+1), ataque furtivo e `ActiveEffect` de *+1d6 Dano Furtivo e +2 Furtividade*.
    - *Automação Rica de ActiveEffects em 100% dos Itens*:
      - *Arco dos Arautos*: ActiveEffects de *Marca da Presa (-1 PM)* e *Encantamento Cruel (+2 Dano à Distância)*.
      - *Certificado de Conclusão*: ActiveEffect de *+1 PM Máximo*.
      - *Chave Mestra*: ActiveEffect de *Abertura Sszzaasita (+20 Ladinagem para Abrir Fechaduras)*.
      - *Bilhete de Valluk Delsori*: ActiveEffect de *Metamorfose Cênica (+20 Enganação por 1 Dia)*.
      - *Máscara do Sol Dourado*: ActiveEffect de *+10 Ladinagem e -2 Furtividade*.
      - *Pingente Rubro*: ActiveEffect de *Proteção Aberrante de Aharadak (-1 PM Perda Tormenta)*.
      - *Alma de Dragão*: ActiveEffects de *Escama Dracônica Reativa (Redução 1d6)* e *Canalização Elemental (+1d6 Dano em Magias)*.
      - *Âncora Naufragista*: 3 ActiveEffects (*RD 10 Frio/Eletricidade*, *+5 Pilotagem*, *Natação 9m*).
      - *Arma Silente*: ActiveEffects de *Sabedoria Bélica (+5 Guerra, Conhecimento, Nobreza)* e *Adamante Formidável (+2 Ataque, +2 Dano)*.
      - *Memorizar Conhecimento*: ActiveEffects de *Memória da Cena Gravada (+5)* e *Aprimoramento (+10)*.
      - *Cítola da Paz*: ActiveEffect de *+5 Mudar Atitude / -1 PM Músicas de Bardo*.
      - *Percepção de Masmorra*: ActiveEffect de *+10 Investigar Armadilhas*.
      - *Rosário da Vida*: ActiveEffect de *+1d8 Cura de Luz por Patamar*.
      - *Bússola das Lágrimas*: ActiveEffect de *+10 Misticismo para Detectar Magia*.
      - *Corso Sombrio*: ActiveEffect de *Porte Legal de Armas de Fogo e +2 Foco*.
      - *Previdência da Vigília*: ActiveEffect de *Dom da Imortalidade (Thyatis)*.
      - *Bomba de Tinta*: ActiveEffect de *Tinta Viscosa Zoyrak (Condição Lento)*.
  - **Especificações OpenSpec SDD**:
    - Requisito normativo `Requirement: Partners, Familiars, and Mounts Created as Powers` incorporado à `actors-specification`.
  - **Automação & Validação**:
    - `validate-db228-compliance.js` atualizado para auditar as 4 ameaças exclusivas e os 20 itens com ActiveEffects ricos, aprovado com 0 erros.

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

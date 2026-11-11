# Changelog

## v1.10.1 - 2026-11-10

- **Hotfix Crítico: Correção do DataModel de Pastas no Foundry VTT (`_stats.lastModifiedBy`)**:
  - **Validação de DocumentIdField em Pastas e Documentos**: Corrigido o valor de `_stats.lastModifiedBy` em todas as pastas (`fldItensFolder26`, `fldDiariosFold26`, `fldTabelasFold26`, `fldMacrosFolder26`) e documentos de todos os compêndios para o ID canônico estrito de 16 caracteres alfanuméricos (`kL8nfmJOQTqjeU2x`), eliminando a string inválida de 17 caracteres que causava `DataModelValidationError: Folder [fldItensFolder26] validation errors: _stats: lastModifiedBy: must be a valid 16-character alphanumeric ID` e travava o carregamento do mundo no Foundry VTT v12/v13.
  - **Blindagem do Loop AVRL e Audit**: Integrada a checagem obrigatória no validador `scripts/audit.js` e a auto-remediação de IDs de estatísticas no motor iterativo `scripts/avrl-runner.js`.

## v1.10.0 - 2026-11-10

- **Release Oficial v1.10.0 — Campanha Fúlgor dos Deuses (Edições 26 e 27), Motor Iterativo AVRL e Hooks de Ciclo de Vida**:
  - **Fúlgor dos Deuses — Edição 26: Forja da Vingança**:
    - **Ameaças Canônicas (`packs/Ameacas_T20`)**: Calibração e saneamento rigoroso de 6 ameaças: *Asmithar Martelo-Mudo (ND 9)*, *Xellmaras, a Ladra Acorrentada (ND 6)*, *Gangue de Hyninn Deturpada (ND 4)*, *Sacerdote de Hyninn Deturpado (ND 4)* com 3 magias individuais, *Tigre-de-Hyninn Deturpado (ND 6)* e *Aço Selvagem (ND 6)*. Todos com tokens 2MTT transparentes de 512x512, defesa dinâmica (`defesa.base = valor - des`), 34 perícias calibradas, texto de resistências integral e habilidades atômicas.
    - **Itens e Aço Sillariano (`packs/Itens_T20`)**: Inclusão de 17 itens: material especial *Aço Sillariano*, artefato sagrado *Alma da Bigorna*, 11 qualidades antidivinas (*Absorção*, *Arma*, *Defesa*, *Guarda*, *Impedimento*, *Magia*, *Mente*, *Perseguidora*, *Potência*, *Resistência*, *Antidevoto*) com `ActiveEffects` estruturados, traços fullgori (*Teofagia*, *Imunidades*) e parceiros veteranos (*Forjadores Litúrgicos* e *Thalgrimm Sangue de Ferro*).
    - **Diários (`packs/Diarios_T20`)**: Diário oficial completo com 7 páginas estruturadas sob `!journal.pages!` (`ownership.default: -1`).
    - **Tabelas de Rolagem (`packs/Tabelas_T20`)**: 3 tabelas com resultados estruturados em `!tables.results!`.
    - **Macros (`packs/Macros_T20`)**: Macro interativa *Forjar Aço Sillariano (Fúlgor dos Deuses)*.
  - **Fúlgor dos Deuses — Edição 27: Dia e Noite**:
    - **Ameaças Canônicas (`packs/Ameacas_T20`)**: Inclusão de 6 ameaças: *Cassiella semi-fullgori (ND 7)*, *Cassiella fullgori (ND 8)* com voo 15m e azagaias fullgori à distância, *Enxame Trog (ND 5)* Enorme (3x3), *Troggore (ND 3)*, *Bando Troggore (ND 5)* Grande (2x2) e o xamã supremo *Urrash das Sombras Frias (ND 5)* com 6 magias individuais de Tenebra.
    - **Relíquias e Itens (`packs/Itens_T20`)**: Artefato sagrado *Orbe de Azgher* (aura de luz permanente de 5º círculo e conjuração solar) com `ActiveEffects`, parceira *Cassiella de Baldonn* (+3 ataque) e equipamentos da aventura.
    - **Diários (`packs/Diarios_T20`)**: Diário oficial completo com 6 páginas estruturadas sob `!journal.pages!`.
    - **Tabelas de Rolagem (`packs/Tabelas_T20`)**: 3 tabelas de perigos cavernosos e dilemas com resultados em subdocumentos.
    - **Macros (`packs/Macros_T20`)**: Macro interativa *Canalizar Orbe de Azgher (Fúlgor dos Deuses)*.
  - **Evolução Arquitetural do Motor AVRL e Hooks de Ciclo de Vida**:
    - Novo motor iterativo `scripts/avrl-runner.js` (`npm run avrl`) com multi-retry até 5 iterações até a convergência total (0 erros, 0 correções pendentes).
    - Hooks integrados em `scripts/create-entry.js` para auto-reparação pré-persistência de tokens 2MTT, defesas dinâmicas, 34 perícias e auto-injeção de `ActiveEffects` em itens e poderes.
    - Script de teste de estresse retroativo `scripts/test-avrl-retroactive-fullgor26.js` aprovado com 100% de sucesso.
    - Suítes de validação dedicadas: `npm run validate:fullgor26` (701 checagens), `npm run validate:fullgor27` (616 checagens), `npm run validate:fidelity` (216 checagens) e `npm run ci:quality`.
  - **OpenSpec SDD e CodeGraph**:
    - 2 living specs atualizadas e 2 changes arquivadas formalmente no OpenSpec (10/10 specs aprovadas).
    - CodeGraph sincronizado com 58 arquivos e 439 nós AST.

## v1.9.3 - 2026-11-10

- **Release Oficial v1.9.3 — Mapeamento Canônico de Ataques à Distância (disparo/arremesso), Restauração do Poder Destruidor e Validador de Fidelidade**:
  - **Exibição Canônica de Ataques à Distância no Foundry VTT**: Corrigido `buildWeaponAttack` para mapear armas de ataque à distância estritamente para `proposito: 'disparo'` ou `'arremesso'` (em vez do valor inválido `'tiro'`). Isso garante que a ficha `actor-npc.mjs` do Tormenta20 reconheça `i.ranged === true` e exiba todos os ataques à distância na aba de combate (Besta Leve, Arco Curto, Arco Longo, Pistola, Azagaia e Espinhos).
  - **Poder Destruidor Restaurado**: Inclusão do poder autêntico *Destruidor* (dano dobrado contra objetos e manobra quebrar livre com teste +31 em acerto crítico) no *Licantropo Selako Terror dos Mares*.
  - **Armas e Poderes em Mantícora Zumbi**: Inclusão de *Espinhos* como arma de disparo à distância, além dos poderes *Fraqueza Zumbi* e *Mordida*.
  - **Suíte Automatizada de Fidelidade (`npm run validate:fidelity`)**: Novo validador profundo `scripts/validate-threat-sheet-fidelity.js` executando **138 checagens rigorosas de fidelidade com 100% de sucesso**.

## v1.9.2 - 2026-11-10

- **Release Oficial v1.9.2 — Calibração Rigorosa de Poderes, Resistências e Percepção Situacional (DB #226 a #232)**:
  - **Fidelidade Canônica de Resistências**: Corrigida a linha de resistências de acordo com as publicações originais (ex: Lobisomem Caçador de Recompensas possui `imunidade a medo, redução de dano 5/mitral` em estrita concordância com o statblock; Licantropo Selako Terror dos Mares possui `redução de corte 5, redução de dano 5/mitral`).
  - **Poderes Autênticos Restaurados**: Inclusão dos poderes autênticos do statblock como *Marca da Presa* e *Veneno (Peçonha Potente)* no Caçador de Recompensas, *Ataque Furtivo +2d6* no Predador Urbano, *Caçador Submarino* e *Dentes Afiados* nos Selakos.
  - **Percepção Situacional**: Implementação de subentradas com `custom: true` para sentidos e percepções específicas de terreno (*Percepção em Subterrâneo = 12* no Lobisomem Caçador e *= 8* no Licantropo Texugo Furioso).
  - **Validação Automatizada Contínua**: 1.184 asserções no `validate-db232-compliance.js` e auditoria global de 0 erros em todos os compêndios.

## v1.9.1 - 2026-11-10

- **Hotfix: Sincronização Estrita de Perícias, Iniciativa, Percepção e Descrições de Itens (DB #226 a #232)**:
  - **Calibração de Perícias (`system.pericias[key].value`)**: Corrigido `buildSkills` para que `pericias[key].value` armazene estritamente o bônus total de ficha oficial (`fichaVal`), com a diferença derivada registrada em `outros`. Perícias destreinadas recebem `value = meionivel + atrMod` e `outros = 0`.
  - **Iniciativa e Percepção Canônicas**: Ajustados os valores de iniciativa e percepção de capa de todas as 15 ameaças da DB #232 e das edições anteriores (#226 a #231) para baterem 100% com o bloco de estatísticas oficial dos PDFs, incluindo usos situacionais (*Percepção em Subterrâneo = 12* no Lobisomem Caçador e *= 8* no Texugo Furioso).
  - **Resistências, Imunidades e Poderes Fidedignos**: Corrigida a linha de resistências de acordo com as publicações originais (ex: Lobisomem Caçador de Recompensas possui `imunidade a medo, redução de dano 5/mitral`; Selako Terror dos Mares possui `redução de corte 5, redução de dano 5/mitral`). Poderes autênticos restaurados como *Marca da Presa* e *Veneno (Peçonha Potente)* no Caçador de Recompensas, *Ataque Furtivo +2d6* no Predador Urbano e *Dentes Afiados* nos Selakos.
  - **Restauração de Perícias Treinadas Omitidas**: Inclusão de perícias listadas no statblock que haviam sido omitidas (ex: *Jogatina +6* no Lobisomem Predador Urbano; *Investigação +10* e *Intuição +10* no Lobisomem Caçador de Recompensas; *Furtividade +7* e *Ladinagem +5* no Rato Comedor de Restos).
  - **Descrições Integrais de Itens e Poderes**: Garantia de que cada poder, arma ou magia dentro de um ator ou como item independente possui o texto verbatim integral da publicação oficial no campo `description.value`.
  - **Validação Automatizada Aprimorada**: Suíte de testes `validate-db232-compliance.js` expandida para **1.184 asserções aprovadas com 100% de sucesso**.

## v1.9.0 - 2026-11-09

- **Dragão Brasil #232 (Integração Canônica Completa de Ameaças, Itens, Diários e Tabelas)**:
  - **Ameaças e Criaturas (`packs/Ameacas_T20`)**:
    - Inclusão de **15 ameaças e NPCs canônicos** na pasta *Dragão Brasil* (`wfWApuyngzFm4KOP`):
      - *Licantropos Artonianos*: **Lobisomem Predador Urbano (ND 4)**, **Lobisomem Caçador de Recompensas (ND 9)**, **Licantropo Rato Comedor de Restos (ND 1)**, **Licantropo Rato Infiltrador Veterano (ND 7)**, **Licantropo Onça Pirata de Rio (ND 7)**, **Licantropo Onça Lutador de Arena (ND 11)**, **Licantropo Texugo Furioso (ND 5)**, **Licantropo Texugo Servo da Noite (ND 8)**, **Licantropo Selako Farejador de Sangue (ND 3)** e **Licantropo Selako Terror dos Mares (ND 9)**.
      - *Breves Jornadas: Monstros e Homens*: **Mamãe Glop (ND 2)**, **Estirge (ND 1)**, **Perdigueiro Troll (ND 1)**, **Ginete de Troll Purista (ND 2)** e o conjurador **Xamã Finntroll (ND 2)**.
    - Todos os 15 atores possuem IDs estritos de 16 caracteres alfanuméricos (`/^[a-zA-Z0-9]{16}$/`), 34 perícias sob `system.pericias`, defesa base dinâmica (`defesa.base + des === defesa.value`), ataques em armas com `rolls.parts`, magias individuais no Xamã Finntroll e no Licantropo Texugo Servo da Noite, traços e imunidades preenchidos no DataModel, texto integral verbatim em `system.detalhes.resistencias`, desagregação atômica estrita de habilidades e tokens circulares transparentes 2MTT dedicados.
  - **Itens e Poderes (`packs/Itens_T20`)**:
    - Inclusão de **13 novos registros canônicos de licantropia**:
      - *Poder de Destino*: **Controlar Licantropia**.
      - *Poderes e Traços*: **Aversão a Mitral**, **Empatia Animal**, **Maldição da Licantropia**, **Sentidos Aguçados**, **Transformação Incontrolável**, **Forma Híbrida** e as 5 **Formas de Fera** (*Lobo*, *Onça*, *Rato*, *Selako*, *Texugo*).
      - *Perigo/Maldição*: **Maldição: Licantropia**.
  - **Diários (`packs/Diarios_T20`)**:
    - Inclusão de **3 Diários oficiais** estruturados com 19 páginas em subdocumentos ClassicLevel sob `!journal.pages!` com `ownership.default: -1`:
      - **Cenário: Licantropos Artonianos (DB #232)** (9 páginas completas).
      - **Aventura: Monstros e Homens (DB #232)** (9 páginas completas com cenas e epílogo).
      - **Gazeta do Reinado — Edição 164 (DB #232)** (1 página com notícias de Arton).
  - **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
    - Inclusão de **4 Tabelas de Rolagem** com fórmula `1d6` e 24 resultados em subdocumentos sob `!tables.results!` com campo `name`:
      - **Linhagens e Formas de Licantropia (DB #232)** (6 resultados).
      - **Encontros com Licantropos em Arton (DB #232)** (6 resultados).
      - **Encontros na Floresta em Monstros e Homens (DB #232)** (6 resultados).
      - **Ganchos de Aventura com Licantropos (DB #232)** (6 resultados).
  - **Validação e Integridade**:
    - Novo validador `scripts/validate-db232-compliance.js` com **1.136 asserções aprovadas com 100% de sucesso**.
    - 0 erros de JSON, 0 IDs faltantes e 0 pastas órfãs na auditoria geral.

## v1.8.2 - 2026-11-09

- **Release Oficial v1.8.2 — Desagregação Atômica de Habilidades e Texto Integral de Resistências (DB #226 a #231)**:
  - **Texto Livre de Resistências (`system.detalhes.resistencias`)**: Preenchimento obrigatório com a redação integral e verbatim de todas as características, imunidades, resistências e vulnerabilidades da publicação oficial em todos os atores de DB #226 a #231, garantindo exibição visual no cabeçalho da ficha nativa do Foundry VTT.
  - **Desagregação Atômica de Habilidades**: Eliminação de nomes compostos ou habilidades agregadas. Cada título em negrito da publicação oficial agora é um item individual e atômico (ex: *Celeridade Odiosa* e *Ódio aos Vivos* nos Ressecados; *Constrição*, *Agarrar Aprimorado*, *Forma de Areia* e *Escorrer* na Constritora Arenosa; *Partilhar Fome* no Tenente Onírico; *Varrer*, *Negação da Morte*, *Estratégia do Medo* e *Fome de Sonhos* em Nócnam Mur; *Um com as Sombras*, *Evasão Aprimorada*, *Manobras Evasivas* e *Sangrento* em Arzak; *Poderio Muscular*, *Êxtase no Medo*, *Lento Demais!* e *Fluxo de Movimento* em Gaardak).
  - **OpenSpec Living Specs**: Formalizados os novos cenários normativos em `actors-specification` garantindo a persistência das regras para futuras edições.
  - **Validação Global**: 895 verificações em DB #231, 1.108 em DB #230 e 100% de conformidade atestada em todas as edições.

## v1.8.1 - 2026-11-09

- **Hotfix: Imposição Canônica de Schemas de Atores, Magias, Traços e Perícias (DB #226 a #231)**:
  - **Magias Canônicas Individuais**: Conjuradores (*Anshira*, *Morrise*, *Sacerdote Caído*, *Bianco*) agora possuem suas magias instanciadas como itens individuais do tipo `"magia"` em estrita conformidade com o DataModel `SpellData` do Tormenta20 (círculo, tipo `arc`/`div`, escola, ativação, resistência e rolagens funcionais).
  - **Imunidades e Vulnerabilidades a Dano**: Mapeadas diretamente nas flags booleanas `imunidade: true` e `vulnerabilidade: true` sob `system.tracos.resistencias[damageType]` (ex: frio e fogo nos Ressecados, trevas/ácido/eletricidade nos Pesadelos e Construtos).
  - **Imunidades a Condições de Status**: Populadas adequadamente no array `system.tracos.ic.value` com normalização de termos canônicos (mental, medo, metamorfose, paralisado, etc.).
  - **Perícias Situacionais**: Criação de subentradas com `custom: true` e rótulos descritivos (ex: `Furtividade (Desertos) = 16` em Anshira e `Furtividade (Deserto) = 13` em Constritora Arenosa).
  - **Poderes Omitidos Restaurados & Desagregação Atômica**: Inclusão de *Passo Sombrio* e *Transferir Sofrimento* em Morrise, *Violência Cômica* em Rojo, *Fraqueza Zumbi* e *Mordida* na Mantícora Zumbi e *Natureza Onírica* e magia *Sonho* no Mestre do Pesadelo. Desagregação atômica de habilidades (ex: *Celeridade Odiosa* e *Ódio aos Vivos* nos Ressecados; *Constrição*, *Agarrar*, *Forma de Areia* e *Escorrer* na Constritora; *Partilhar Fome* no Tenente; *Varrer* em Nócnam Mur; *Um com as Sombras*, *Evasão Aprimorada*, *Manobras Evasivas* e *Sangrento* em Arzak; *Lento Demais!* e *Fluxo de Movimento* em Gaardak).
  - **Texto Livre de Resistências (`system.detalhes.resistencias`)**: Preenchimento obrigatório com a redação integral e verbatim de todas as resistências, imunidades e vulnerabilidades da publicação oficial em todos os atores (DB #226 a #231), garantindo exibição no cabeçalho da ficha do Foundry VTT.
  - **Validação e Integridade**: Suítes de validação atualizadas aprovando **875 checagens em DB #231** e **1.072 checagens em DB #230** com 100% de sucesso e 0 erros em todos os 6 compêndios.

## v1.8.0 - 2026-11-09

- **Dragão Brasil #231 (Integração Canônica Completa de Ameaças, Itens, Diários e Tabelas)**:
  - **Ameaças e Criaturas (`packs/Ameacas_T20`)**:
    - Inclusão de **10 ameaças e NPCs oficiais** na pasta *Dragão Brasil* (`wfWApuyngzFm4KOP`):
      - *A Vastidão Dourada de Halak-Tûr*: **Arraia-Seca (ND 3)**, **Anshira (ND 9)**, **Caçador de Condenados (ND 11)**, **Constritora Arenosa (ND 9)**, **Ressecado Saqueador (ND 4)** e **Ressecado Líder (ND 4 Solo)**.
      - *Breves Jornadas: Circo Sombrio*: **Bianco (ND 2)**, **Rojo (ND 2)**, **Mantícora Zumbi (ND 3)** e **Morrise (ND 3)**.
    - Todos os atores possuem rigorosamente IDs primários com 16 caracteres alfanuméricos (`/^[a-zA-Z0-9]{16}$/`), 34 perícias sob `system.pericias`, defesa base dinâmica (`defesa.base + des === defesa.value`), ataques corporificados em armas embutidas com `rolls.parts` e danos adicionais (trevas, sangramento), biografias com citações duplas (#800000 e #006400) e tokens circulares 2MTT transparentes dedicados em `assets/tokens/`.
  - **Itens, Classes, Poderes e Origens (`packs/Itens_T20`)**:
    - Inclusão de **18 novos registros canônicos**:
      - *Classe Variante*: **Miragem (Caçador)** com habilidades de classe exclusivas (**Dança da Areia**, **Cortina de Poeira**, **Passo do Deserto**, **Mestre do Deserto**).
      - *Novos Poderes de Caçador*: **Arsenal do Deserto**, **Escaramuça Distante**, **Passo Duplo**, **Passos Precisos** e **Tesouros da Natureza**.
      - *Poder Concedido*: **Canção da Pedra** (Allihanna e Megalokk) para druidas.
      - *Raça Variante*: **Sahiri** (Dahllan) com **Animar Rochas** e **Proteção da Terra**.
      - *Origens Regionais de Halak-Tûr*: **Criança do Crepúsculo**, **Nascido nas Estepes** e **Nômade Ferani**.
      - *Equipamentos e Despojos*: **Presa de Ônix** e **Símbolo Sagrado de Azgher**.
    - Todos com `system.description.value`, IDs determinísticos de 16 caracteres e subdocumentos de `ActiveEffects` canônicos em `!items.effects!`.
  - **Diários (`packs/Diarios_T20`)**:
    - Inclusão de **3 Diários oficiais** estruturados com subdocumentos de páginas em `!journal.pages!`:
      - **A Vastidão Dourada de Halak-Tûr (DB #231)** (9 páginas completas cobrindo introdução, geografia, povos ferani e dai-kerat, tradições, religião, locais de interesse e bestiário).
      - **Aventura: Circo Sombrio (DB #231)** (6 páginas com resumo, Cenas 1 a 4, atrações de Tenebra e epílogo).
      - **Gazeta do Reinado — Edição 163 (DB #231)** (2 páginas com as notícias do triunfo de Mestre Arsenal e os certames do senado táurico).
    - Todas as 17 páginas configuradas com herança de permissão `ownership: { default: -1 }`.
  - **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
    - Inclusão de **4 Tabelas de Rolagem** com fórmula `1d6` e resultados em subdocumentos em `!tables.results!`:
      - **Previsões de Selina (DB #231)** (3 resultados mecânicos para leitura da sorte no Circo Sombrio).
      - **Encontros Diurnos em Halak-Tûr (DB #231)** (6 encontros nas dunas e cânions sob o sol de Azgher).
      - **Encontros Noturnos em Halak-Tûr (DB #231)** (6 perigos sob a noite gélida de Tenebra).
      - **Ganchos de Aventura em Halak-Tûr (DB #231)** (6 sementes de tramas e intrigas no deserto).
    - Todos os 21 resultados com IDs de 16 caracteres e campo `name` devidamente preenchido.
  - **Validação e Qualidade**:
    - Novo validador `scripts/validate-db231-compliance.js` com **875 asserções estritas aprovadas com 100% de sucesso**.
    - Zero regressões em `validate-db230-compliance.js` (1.072 verificações), `validate-db229-compliance.js` e `validate-db228-compliance.js`.
    - Auditoria geral via `scripts/audit.js` com 0 erros de JSON, 0 IDs faltantes e 0 pastas órfãs nos 6 compêndios.
  - **Imposição Canônica de Schemas de Atores, Magias e Perícias (DB #226 a #231)**:
    - **Magias Canônicas**: Conjuradores (Anshira, Morrise, Sacerdote Caído e Bianco) agora possuem suas magias instanciadas como itens individuais do tipo `magia` em estrita conformidade com o DataModel `SpellData` (círculo, tipo `arc`/`div`, escola, ativação, resistência e rolagens).
    - **Imunidades e Vulnerabilidades**: Mapeadas diretamente nas flags booleanas `imunidade: true` e `vulnerabilidade: true` sob `system.tracos.resistencias[damageType]` (ex: frio e fogo nos Ressecados, trevas/ácido/eletricidade nos Pesadelos e Construtos).
    - **Imunidades a Condições**: Populadas no array `system.tracos.ic.value` com normalização de termos canônicos (mental, metamorfose, paralisado, etc.).
    - **Perícias Situacionais**: Criação de subentradas com `custom: true` e labels descritivos (ex: `Furtividade (Desertos)` na Anshira e Constritora Arenosa).
    - **Poderes Restaurados**: Inclusão de *Passo Sombrio* e *Transferir Sofrimento* em Morrise, *Violência Cômica* em Rojo, *Fraqueza Zumbi* na Mantícora Zumbi e *Natureza Onírica* no Mestre do Pesadelo.
    - **Living Specs OpenSpec**: Adicionados requisitos formais nos cadernos de Atores e Itens (`actors-specification` e `items-specification`).

- **Hotfix Estrutural: Padronização Universal de IDs Estritamente com 16 Caracteres para o Foundry VTT (DB #229 e #230)**:
  - **Resolução de Visibilidade em Diários e Tabelas de Rolagem**:
    - Identificada a causa raiz de diários e tabelas não serem indexados pelo Foundry VTT: no core do Foundry (`foundry.data.validators.isValidId`), todos os IDs de documentos primários em compêndios ClassicLevel devem ter rigorosamente **16 caracteres alfanuméricos** (`/^[a-zA-Z0-9]{16}$/`). IDs manuais legados como `JrnlReinoPesad230` (17 chars), `JrnlOlhoBasilisco229` (20 chars), `TbNaturezaPesad230` (18 chars), etc., eram sumariamente descartados pelo compendium indexer.
    - Expurgadas em definitivo as chaves antigas com comprimento diferente de 16 caracteres de todos os bancos LevelDB e arquivos de fontes.
    - Padronizados todos os IDs para exatamente 16 caracteres:
      - *Diários*: `jReinoPesad230AA`, `jCorridaBrut230A`, `jOlhoBasilis229A`, `jCaesColinas229A`.
      - *Tabelas*: `tNaturezaP230AAA`, `tGanchosP230AAAA`, `tCorridaBrut230A`, `tSonhosRoub230AA`, `tEncontrosS229AA`.
      - *Ameaças*: `gq8KZangPes230AA`, `gq8KColePes230AA`, `gq8KCeifPes230AA`, `gq8KPoliPes230AA`, `gq8KMestPes230AA`, `gq8KLancOni230AA`, `gq8KGineOni230AA`, `gq8KSargOni230AA`, `gq8KTeneOni230AA`, `gq8KNocnMur230AA`, `gq8KSaceCai230AA`, `gq8KGobGorl230AA`, `gq8KArzak230AAAA`, `gq8KGaarda230AAA`, `gq8KDefRoch229AA`, `gq8KRevSerp229AA`, `gq8KPreBas229AAA`, `gq8KBasAnc229AAA`.
      - *Itens*: `gq8KMachadoT230A`, `gq8KKumshrak230A`, `gq8KCentelha230A`, `gq8KSonhoAmo230A`, `gq8KSonhoApr230A`, `gq8KSonhoDes230A`, `gq8KPesadPer230A`.
  - **Sincronização Completa de Links `@UUID`**:
    - Todos os links `@UUID` entre diários, tabelas, ameaças e itens foram sincronizados com os novos IDs canônicos.
  - **Validação e Auditoria Global**:
    - Auditoria em todos os 6 compêndios atestou **0 IDs inválidos em todo o repositório** (100% dos documentos principais em conformidade).
    - Validadores `validate-db230-compliance.js` (1.021 checagens) e `validate-db229-compliance.js` aprovados com 100% de sucesso.

## v1.7.1 - 2026-11-08

- **Hotfix: Revisão Canônica de Ataques, Descrições de Itens, Páginas de Diários e Rótulos de Tabelas (DB #229 e #230)**:
  - **Ameaças (`Ameacas_T20`)**:
    - *Mestre do Pesadelo (ND 15)*: Instanciadas todas as quatro caudas como armas embutidas individuais (*Cauda-Espinho Titânica*, *Cauda-Ferrão Virulenta*, *Cauda-Lâmina Enorme*, *Cauda-Tentáculo Colossal*) e preenchido o sumário de ataque à distância em `ataquesad`.
    - *Danos Adicionais em `rolls.parts`*: Inclusão das fórmulas de danos secundários em ataques híbridos: trevas em *Tenente Onírico* (2d6 trevas), *Nócnam Mur* (6d6 trevas) e *Sacerdote Caído* (1d12 trevas); psíquico na Cauda-Tentáculo do *Coletor do Pesadelo* (4d6 psíquico); e veneno contínuo nas caudas-ferrão do *Zangão* (1d12) e *Pesadelo Polivalente* (2d12).
    - *Ataques à Distância*: Mapeamento correto de `ataquesad`, `alcance` e `proposito: 'tiro'` com perícia `pont` para as armas de projétil/arremesso (*Azagaias de Gaardak*, *Adagas de Arzak*, *Funda dos Goblins*, *Arco Curto do Ginete* e *Sopro do Basilisco Ancestral*).
  - **Itens (`Itens_T20`)**:
    - Corrigido o schema de descrição em todos os 9 itens, equipamentos e poderes da DB #230 para `system.description.value`, assegurando que o texto enriquecido seja renderizado na ficha do Foundry VTT.
  - **Diários (`Diarios_T20`)**:
    - Ajustado `ownership: { default: -1 }` em todas as páginas de diários da DB #229 e DB #230, garantindo herança de permissão do `JournalEntry` e eliminando bloqueios de visualização.
  - **Tabelas de Rolagem (`Tabelas_T20`)**:
    - Preenchido o campo `name` em todos os resultados (`TableResult`) da DB #229 e DB #230, permitindo visualização imediata do título nas listas e no chat.
  - **Validação e Qualidade**:
    - Validador `validate-db230-compliance.js` expandido para 992 asserções ativas com 100% de aprovação (0 erros). Base total com 5.931 documentos principais (43.544 registros LevelDB) auditados com 0 erros.

## v1.7.0 - 2026-11-08

- **Dragão Brasil #230 (Integração Canônica Completa de Ameaças, Itens, Diários e Tabelas)**:
  - **Ameaças e Criaturas (`Ameacas_T20`)**:
    - Inclusão de **14 ameaças oficiais** completas na pasta *Dragão Brasil* (`wfWApuyngzFm4KOP`), com 34 perícias dinâmicas, defesas dinâmicas (`base + des === value`), tokens top-down 2-Minute Tabletop exclusivos e biografias canônicas com citações duplas (`#800000` e `#006400`) e apresentação em Arial:
      - *O Reino dos Pesadelos (10 Criaturas de Rafael Dei Svaldi)*:
        - **Zangão do Pesadelo (ND 5)**: Construto Médio (140 PV, Defesa 24 base 19 + Des 5, deslocamento 15m, RD 5/mágico, cura acelerada 5). Ataques naturais *Mordida +17*, *Cauda-Espinho* (à distância), *Cauda-Ferrão* (peçonha concentrada), *Cauda-Lâmina* (18/x3), *Cauda-Tentáculo* (agarrar teste +19) e *Mente Alienígena* (choque psíquico 6d6, Von CD 20).
        - **Coletor do Pesadelo (ND 6)**: Construto Médio (160 PV, Defesa 25 base 21 + Des 4, RD 5/mágico, cura acelerada 5). *Mordida +18*, *Cauda-Tentáculo +18* (1d8+10 mais 4d6 psíquico), *Agarrar Aprimorado* (+20) e *Drenar Sonhos* (drena 2d6/4d6 PM, alquebrado ou roubo permanente de sonhos, Von CD 24).
        - **Ceifador do Pesadelo (ND 8)**: Construto Médio (280 PV, Defesa 33 base 27 + Des 6, RD 10/mágico, cura acelerada 5). *Mordida +26*, *Cauda-Lâmina +26* (4d6+20 corte, 18/x3) e *Mente Alienígena* (choque psíquico 8d6, Von CD 26).
        - **Pesadelo Polivalente (ND 10)**: Construto Grande (370 PV, Defesa 36 base 30 + Des 6, RD 10/mágico, cura acelerada 10). *Mordida +29*, quatro ataques de cauda (+29 em cada), *Pesadelo Combinado* (duas naturezas) e *Mente Alienígena* (10d6 psíquico, Von CD 28).
        - **Mestre do Pesadelo (ND 15)**: Construto Enorme (780 PV, Defesa 48 base 45 + Des 3, RD 20/mágico, cura acelerada 20). *Mordida +43*, *Duas Garras +43*, quatro caudas (+43), *Natureza Onírica* (50% de ignorar dano/magia), *Manifestar Pesadelo* (magias de ilusão sem gastar PM, CD 38), *Mente Alienígena Suprema* (15d6 psíquico) e despojo *Centelha Onírica* (CD 30 para extrair).
        - **Lanceiro Onírico (ND 2)**: Construto Médio (16 PV, Defesa 19 base 18 + Des 1). *Lança +14*, *Cauda-Lâmina +14* e *Assalto Assustador* (+2 ataque/dano no 1º turno).
        - **Ginete Onírico (ND 3)**: Construto Médio (24 PV, Defesa 21 base 20 + Des 1). *Lança de Cavalaria +16* (2d8+4, x3, alcance 3m), *Ginete do Pesadelo* (estabilidade automática) e *Carga Aterradora* (deslocamento 12m, movimento extra e +1d6 dano montado).
        - **Sargento Onírico (ND 4)**: Construto Médio (140 PV, Defesa 23 base 22 + Des 1). *Espada Bastarda +16* (2d6+5, 19/x3), *Fome de Sonhos* (bônus igual ao PM gasto pelo alvo), *Golpe Amedrontador* (vulnerável) e *Negação da Morte* (mantém aliado com 1 PV).
        - **Tenente Onírico (ND 6)**: Construto Médio (220 PV, Defesa 27 base 26 + Des 1, RD 5). *Espada Bastarda +20* (mais 2d6 trevas), *Estratégia do Medo* (dois dados em ataques contra quem não for imune a medo), aura *Partilhar Fome* (30m) e *Negação da Morte*.
        - **Nócnam Mur, o Pesadelo Amalgamado (ND 18)**: Construto Grande (1.080 PV, Defesa 56 base 55 + Des 1, RD 10, fortificação 50%). *Espada Bastarda Titânica +49* (3d12+20, 19/x3 mais 6d6 trevas com dados explosivos por *Força dos Titãs*), *Quatro Tentáculos-Cauda +49* (3d8+15 corte, 18/x3 mais 6d6 trevas, alcance 6m), *Despertar Temor* (CD 47, desvantagem em testes e perda de PM), *Pesadelo Amalgamado* (todas as 4 naturezas) e *Varrer*.
      - *Breves Jornadas: A Corrida Brutal (4 Criaturas de Daniel Duran)*:
        - **Sacerdote Caído (ND 5)**: Humanoide Bugbear Médio (45 PV, Defesa 23 base 21 + Des 2, 22 PM). *Foice Negra x2 +20* (2d8+13, x3 mais 1d12 trevas), *Êxtase no Medo* (metade do dano de alvos com medo), *Refestelar-se em Sangue* (recupera 5 PM em críticos ou mortes) e magias de trevas *Toque Vampírico* e *Vitalidade Fantasma* (CD 20).
        - **Três Goblins em um Gorlogg (ND 7)**: Animal Grande (300 PV, Defesa 30 base 25 + Des 5). *Mordida x2 +24* (3d8+16, x4 com agarrar +26), *Funda x3 +20*, *Lançamento de Bombas* (12d6 de impacto em área, Ref CD 22) e *Vai, Vai, Vai!* (movimento adicional).
        - **Arzak (ND 8)**: Humanoide Hobgoblin Médio (250 PV, Defesa 31 base 26 + Des 5, evasão aprimorada). *Kum’shrak Eviscerador x3 +24* (1d8+10 corte, x3 mais sangrando), *Assassinar* (dobra dados de Furtivo para 12d6 ou 16d6 montado), *Manobras Evasivas* e *Um com as Sombras*.
        - **Gaardak (ND 8)**: Humanoide Bugbear Médio (320 PV, Defesa 33 base 29 + Des 4, escavação e natação 6m). *Ataque Desarmado x3 +24*, *Azagaias +26* com *Arremesso Devastador* (derrubar/empurrar teste +28), contra-ataque reativo *Lento Demais!* e *Poderio Muscular*.
  - **Itens, Veículos, Consumíveis e Parceiros (`Itens_T20`)**:
    - Inclusão de **9 novos documentos** com mapeamento determinístico de IDs fixos (`DB230_ID_MAP`) e subdocumentos ClassicLevel de ActiveEffects (`!items.effects!itemId.effId`):
      - *Parceira: Rotsheel*: Parceira Combatente Veterana hobgoblin em `0uRx5Efj3tk7P5Xr` (+2 em testes de ataque, +1 na margem de ameaça e +5 em testes de Pilotagem/Sobrevivência).
      - *Carruagem Duyshidakk*: Veículo blindado Enorme (Defesa 25, 200 PV, RD 10, capacidade 100 espaços e +10 contra manobras para derrubar).
      - *Machado do Campeão de Tyrondir*: Machado de guerra aumentado atroz formidável (3d6 corte, 19/x3, +2 no ataque e dano).
      - *Kum’shrak Eviscerador*: Arma exótica duyshidakk de corte (1d8 corte, 19/x3, causa sangramento).
      - *Centelha Onírica*: Despojo de Mestre do Pesadelo permitindo absorver e conjurar uma magia de ilusão de até 2º círculo.
      - *Sonho Resgatado: Sonho de Amor*: Concede +1 PM a cada dois níveis.
      - *Sonho Resgatado: Sonho de Aprendizado*: Concede +2 permanente em três perícias treinadas.
      - *Sonho Resgatado: Sonho de Destruição*: Concede +1 PV por nível de personagem.
      - *Pesadelo Onírico: Sonho Perdido*: Condição e desvantagem decorrente de sonhos drenados pelo Coletor do Pesadelo.
  - **Diários Estruturados (`Diarios_T20`)**:
    - Inclusão de **2 diários completos** com `pages` em conformidade com o Hotfix v1.6.2 (arrays de string IDs):
      - *O Reino dos Pesadelos (DB #230)*: 7 páginas de lore sobre o reino onírico, Soberana Judara, criaturas, Ferren Asloth, os Sislach e os mercenários oníricos.
      - *Aventura: A Corrida Brutal (DB #230)*: 5 páginas estruturadas com a corrida em Tyrondir, concorrentes, regras de perseguição e confronto com os sacerdotes caídos.
  - **Tabelas de Rolagem (`Tabelas_T20`)**:
    - Inclusão de **4 tabelas oficiais** com `results` estritamente como arrays de string IDs e schema `TableResult` em `type: "text"`:
      - *Natureza do Pesadelo (DB #230)* (1d4): Desastre, Fracasso, Perseguição e Morte.
      - *Ganchos do Pesadelo em Aslothia (DB #230)* (1d6): 6 ganchos de aventura contra o Arquilich.
      - *Encontros da Corrida Brutal (DB #230)* (1d6): 6 obstáculos e emboscadas durante a corrida.
      - *Sonhos Roubados pelo Coletor (DB #230)* (1d4): Definição aleatória do sonho roubado.
  - **Validação, Auditoria e Refinamento Canônico de Ataques**:
    - **Revisão Completa de Ataques (DB #229 e #230)**: Instanciados todos os ataques corporais e à distância que estavam ausentes ou incompletos (todas as 4 caudas do Mestre do Pesadelo criadas como armas individuais, arco curto do Ginete, azagaias de Gaardak, funda e bombas dos Goblins, adagas de Arzak, e sopro do Basilisco Ancestral).
    - **Danos Adicionais em `rolls.parts`**: Mapeados os dados adicionais de trevas (Tenente, Nócnam Mur, Sacerdote Caído), psíquico (Coletor) e veneno contínuo (Zangão, Polivalente, Basilisco) diretamente nas fórmulas de dano.
    - **Correção de Descrições de Itens**: Corrigido o schema para `system.description.value` em todos os itens de `Itens_T20`, garantindo renderização rica no Foundry VTT.
    - **Permissões de Diários**: Páginas de diário atualizadas com `ownership: { default: -1 }` garantindo herança e visibilidade sem bloqueios.
    - **Rótulos de Tabelas de Rolagem**: Campo `name` populado em todos os `TableResult` para exibição correta no menu e chat.
    - Criado validador automatizado `scripts/validate-db230-compliance.js` com **992 verificações ativas** e **0 erros** (100% de aprovação).
    - Base total expandida para **5.931 documentos principais** (43.544 registros LevelDB) com 0 erros de integridade.

## v1.6.2 - 2026-11-07

- **Hotfix: Resolução de Subdocumentos em Diários e Tabelas no Foundry VTT (DB #228 e DB #229)**:
  - **Arquitetura Oficial de Subdocumentos de Diários (`JournalEntry`)**:
    - Corrigida a propriedade `pages` nos documentos principais de `Diarios_T20` (`JrnlOlhoBasilisco229` e `JrnlCaesColinas229`): alinhada ao padrão estrito do Foundry VTT ClassicLevel, armazenando exclusivamente o array de IDs de páginas (`pages: [pageId1, pageId2, ...]`) em vez de objetos inteiros.
    - As páginas completas são resolvidas nativamente pelo Foundry a partir das chaves filhas `!journal.pages!${journalId}.${pageId}`, eliminando o problema de diários que abriam vazios na interface.
  - **Arquitetura Oficial de Subdocumentos de Tabelas de Rolagem (`RollTable`)**:
    - Corrigida a propriedade `results` nos documentos principais de `Tabelas_T20` (`TbEncontrosSang229`, `TbDesabamento228` e `TbDivOrgArton228`): agora armazena estritamente o array de IDs dos resultados (`results: [resultId1, resultId2, ...]`).
    - Adequado o schema de `TableResult` para o padrão Foundry v11/v12/v13 (`type: "text"` com campos `text` e `description`), permitindo que a janela da tabela renderize imediatamente todas as linhas de resultados e sorteios.
  - **Validação e Integridade**:
    - Validador `validate-db229-compliance.js` atualizado para testar ativamente a resolução e integridade de conteúdo de todas as páginas e linhas de tabelas no banco de dados.
    - 100% de aprovação e integridade confirmada em todos os 6 compêndios.

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

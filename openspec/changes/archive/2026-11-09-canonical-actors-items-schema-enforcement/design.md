# Design: Imposição Canônica de Schemas de Atores, Magias e Perícias

## Arquitetura de Correção

### 1. Refatoração de `scripts/create-entry.js`
- **`buildTracos`**:
  - Aceitar parâmetros flexíveis e interoperáveis: `resistencias`, `danos`, `imunidadesDano`, `vulnerabilidadesDano`, `ic` ou `icValue`, `icCustom`, `idiomasValue`.
  - Normalizar automaticamente danos conhecidos (`acido`, `fogo`, `frio`, `eletricidade`, `trevas`, `luz`, `psiquico`, `essencia`, `corte`, `impacto`, `perfuracao`): se passados em listas de imunidades ou vulnerabilidades, marcar os campos booleanos correspondentes em `resistencias[dt].imunidade = true` e `resistencias[dt].vulnerabilidade = true`.
  - Normalizar condições de status conhecidas (`mental`, `medo`, `metamorfose`, `paralisado`, `atordoado`, `envenenado`, `cego`, `surdo`, etc.) para o array `ic.value`.
- **`buildSpellItem`**:
  - Mapear termos em português para os códigos do core Tormenta20:
    - Tipos: `arcana` -> `arc`, `divina` -> `div`, `universal` -> `uni`.
    - Escolas: `evocacao` -> `evo`, `abjuracao` -> `abj`, `adivinhacao` -> `adv`, `convocacao` -> `con`, `encantamento` -> `enc`, `ilusao` -> `ilu`, `necromancia` -> `nec`, `transmutacao` -> `tra`.
    - Execuções: `padrao` -> `action`, `movimento` -> `move`, `completa` -> `full`, `reacao` -> `reaction`, `livre` -> `free`.
    - Duração: `instantanea` -> `inst`, `cena` -> `scene`, `sustentada` -> `sust`.
  - Retornar documento com `type: 'magia'` e schema exato de `SpellData`.
- **`buildNpcActor`**:
  - Reconhecer e compilar itens com `type === 'magia'` através de `buildSpellItem`.
  - Suportar perícias situacionais passadas em `pericias` preservando `custom: true` e `label`.

### 2. Correções Específicas por Edição

#### Dragão Brasil #231:
- **Anshira (ND 9)**:
  - Imunidades: `imunidadesDano: ['acido']`, `icValue: ['mental']`.
  - Resistências: `resistencias: { dano: 5 }` (5/mitral descrita em detalhes).
  - Perícia Situacional: `furt_deserto` com `label: "Furtividade (Desertos)"`, `value: 16`, `outros: 5`, `custom: true`.
  - 5 Magias individuais: *Comando*, *Controlar Terra*, *Enfeitiçar*, *Pele de Pedra*, *Tranquilidade* (todas com CD 32 e custo PM correto).
- **Constritora Arenosa (ND 9)**:
  - Imunidades: `imunidadesDano: ['acido', 'eletricidade', 'trevas']`, `icValue: ['metamorfose']`.
  - Perícia Situacional: `furt_deserto` com `label: "Furtividade (Deserto)"`, `value: 13`, `outros: 5`, `custom: true`.
  - Fortificação 75% e Vulnerabilidade Hídrica.
- **Ressecados (Saqueador e Líder) (ND 4)**:
  - Imunidades: `imunidadesDano: ['frio']`.
  - Vulnerabilidades: `vulnerabilidadesDano: ['fogo']`.
  - Resistências: `resistencias: { corte: 5, perfuracao: 5 }`.
- **Morrise (ND 3)**:
  - Inclusão dos poderes: `Passo Sombrio` (Livre, 2 PM - teletransporte) e `Transferir Sofrimento` (Reação - transferir dano/condição).
  - 5 Magias individuais: *Amedrontar*, *Escuridão*, *Infligir Ferimentos*, *Raio do Enfraquecimento*, *Vitalidade Fantasma* (todas com CD 20 e custo 3 PM).
- **Bianco (ND 2)**:
  - 4 Magias de Truque Circense: *Área Escorregadia*, *Hipnotismo*, *Imagem Espelhada*, *Primor Atlético* (todas com CD 18).
- **Rojo (ND 2)**:
  - Inclusão do poder: `Violência Cômica` (+1 a +5 em ataque/dano, tamanho Grande e +1d6 trevas).
  - `Cascudo`: Redução de todo dano de corte, impacto e perfuração à metade.
- **Mantícora Zumbi (ND 3)**:
  - Inclusão do poder: `Fraqueza Zumbi` (dobro de dano por acertos críticos ou cabeça).

#### Dragão Brasil #230:
- **Zangão, Coletor, Ceifador, Polivalente, Mestre, Lanceiro, Sargento, Tenente, Nócnam Mur**:
  - Imunidades de dano: `['acido', 'eletricidade', 'trevas']`.
  - Imunidades de condição: `['mental', 'medo']`.
  - Redução de dano: 5/mágico (10 no Ceifador, 20 no Mestre).
- **Sacerdote Caído (ND 5)**:
  - 2 Magias de Clérigo da Foice Negra: *Toque Vampírico* (5 PM, 6d6 trevas) e *Vitalidade Fantasma* (6 PM, 1d10 trevas em área).
- **Mestre do Pesadelo (ND 15)**:
  - Magia *Sonho* (5º círculo, 5 PM, CD 40).
  - *Natureza Onírica* (50% de chance de ignorar qualquer dano que não seja de luz ou mágico).

#### Dragão Brasil #226 a #229:
- Revisão completa e garantia de imunidades/vulnerabilidades ativadas no schema para Basilisco Ancestral, Defensor Rochoso, Revoada de Serpes, Ankthyr, Slark, Lynel, Inumano, Tropa de Mortos, Tyrant, Espectro e Come-Sonhos.

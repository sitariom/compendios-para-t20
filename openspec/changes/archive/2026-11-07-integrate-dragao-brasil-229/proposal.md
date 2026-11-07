# Proposal: Integração Canônica Completa da Dragão Brasil #229 nos Compêndios Tormenta20

## Why
A edição Dragão Brasil #229 traz conteúdos oficiais de alta relevância para o sistema Tormenta20:
1. **Breves Jornadas: O Olho do Basilisco** — Uma aventura completa para personagens de 8º nível contendo 4 ameaças e encontros desafiadores nas Montanhas Sanguinárias (*Defensor Rochoso Desperto ND 8*, *Revoada de Serpes ND 8*, *Presa do Grande Basilisco ND 3*, *Basilisco Ancestral ND 9*), itens lendários e alquímicos (*Olho de Basilisco Ancestral*, *Couro de Basilisco*, *Peçonha Concentrada*, *Peçonha Potente*, *Machado de Batalha do Culto*), além de novos parceiros (*Defensor Rochoso Desperto*, *Kemooz Pensativo*, *Filhote de Grifo*).
2. **Os Cães das Colinas: Prévia do Romance** — Apresentação dos 5 protagonistas emblemáticos como **Parceiros Especiais** com progressão completa de benefícios e ActiveEffects para níveis Iniciante, Veterano e Mestre (*Arius Gorgonius Dubitatius*, *Aylarianna Purpúrea*, *Ignis Crae*, *Kir’zanaath Odello*, *Rexthor*).

Esta integração deve seguir à risca todos os padrões consolidados nas entregas anteriores (DB #226, DB #227 e DB #228) e nas especificações vivas OpenSpec: arquitetura canônica de subdocumentos ClassicLevel do Foundry VTT, diretriz de que parceiros são criados estritamente como itens de poder em `Itens_T20`, fidelidade textual verbatim aos PDFs para itens, biografias estilizadas com citações duplas para ameaças, fórmulas dinâmicas de Defesa e 34 perícias, e tokens top-down de alta definição exclusivos do 2-Minute Tabletop.

## What Changes
- **Ameaças e Criaturas (`Ameacas_T20`)**:
  - Inclusão das 4 criaturas na pasta canônica *Dragão Brasil* (`wfWApuyngzFm4KOP`):
    - *Defensor Rochoso Desperto (ND 8)*: Construto Médio, 320 PV, Defesa 33 (base 33 + Des 0), RD 10, Imunidade a atordoado e petrificado, Imobilidade, Natureza Abascanta (50% evasão mágica), Pancada Atordoante (CD 26) e ataques de Pancada +26 com rolls funcionais. Token top-down 2MTT *Gemstone Guardian*.
    - *Revoada de Serpes (ND 8)*: Monstro Enorme (3x3), 320 PV, Defesa 33 (base 32 + Des 1), Mordida +26, Ferrão +26, Agarrar Aprimorado (+31) e Peçonha Concentrada (CD 26). Token top-down 2MTT *Young Wyvern*.
    - *Presa do Grande Basilisco (ND 3)*: Humanoide Médio, 21 PV, Defesa 20 (base 18 + Des 2), Machado de Batalha +10 envenenado, Ódio Sórdido (+2 ataque/+1d6 dano contra flanqueados/condição), Vitalidade Peçonhenta (cura 1d12 com veneno) e Peçonha Concentrada (CD 19). Token top-down 2MTT *Cultist*.
    - *Basilisco Ancestral (ND 9)*: Monstro Enorme (3x3), 370 PV, Defesa 33 (base 31 + Des 2), RD 10, Imunidade a metamorfose, Resistência a veneno +10, Mordida +27, Olhar Petrificante (CD 28 lento/petrificado), Sopro de Veneno cone 9m 3d12 (CD 28) e Peçonha Potente (CD 28). Token top-down 2MTT *Sea Basilisk*.
- **Itens, Poderes e Parceiros (`Itens_T20`)**:
  - Inclusão de 8 Parceiros na pasta canônica *Parceiros* (`0uRx5Efj3tk7P5Xr`):
    - *Parceiro: Arius Gorgonius Dubitatius* (Especial: Conhecimento, Nobreza, Misticismo, Religião, resistências e dano).
    - *Parceira: Aylarianna Purpúrea (Ayla)* (Especial: Enganação, Ladinagem, poções/preparados gratuitos e bônus de comércio/ilusão).
    - *Parceiro: Ignis Crae* (Especial: Defesa, resistências e RD ampliada para si e aliados adjacentes).
    - *Parceira: Kir’zanaath Odello (Kiki)* (Especial: Atuação, Investigação, substituição de sentidos e Inspiração de bardo).
    - *Parceiro: Rexthor* (Especial: Luta, dano extra +1d8, Furtividade, Percepção e imunidade a surpreso/flanqueado).
    - *Parceiro: Defensor Rochoso Desperto* (Guardião Veterano).
    - *Parceiro: Kemooz Pensativo* (Gênio da Terra Iniciante: criação de cubos de terra com RD 5 e 30 PV).
    - *Parceiro: Filhote de Grifo* (Montaria Iniciante).
  - Inclusão de 5 Itens e Consumíveis:
    - *Olho de Basilisco Ancestral* (Item de Missão / Consumível de reversão mágica).
    - *Couro de Basilisco Ancestral* (Matéria-prima de armadura superior, valor T$ 2.000).
    - *Peçonha Concentrada* (Veneno de dano 1d12 por 3 rodadas, CD 26).
    - *Peçonha Potente* (Veneno de dano 2d12 por 3 rodadas, CD 28).
    - *Machado de Batalha do Culto do Basilisco* (Arma envenenada com rolls.parts completos).
- **Diários e Tabelas de Rolagem (`Diarios_T20` e `Tabelas_T20`)**:
  - Diário *Aventura: O Olho do Basilisco (DB #229)* com 8 páginas formatadas e links @UUID.
  - Diário *Cenário: Os Cães das Colinas (DB #229)* com páginas de apresentação dos heróis.
  - Tabela *Encontros nas Montanhas Sanguinárias (DB #229)* com dados 1d6.
- **Automação, Validação e Sincronização Dupla**:
  - Scripts `scripts/inject-db229-threats.js`, `scripts/inject-db229-items.js`, `scripts/inject-db229-journals.js`, `scripts/inject-db229-tables.js` e `scripts/validate-db229-compliance.js`.
  - Sincronização em `packs/` e `src/packs/`.

## Capabilities

### Modified Capabilities
- `actors-specification`: Incorpora especificações BDD para as 4 ameaças da DB #229 com exigência de tokens 2MTT, RD e atributos calculados.
- `items-specification`: Incorpora requisitos de fidelidade integral e ActiveEffects para os 8 parceiros e 5 itens/venenos da DB #229.

## Impact
- **Packs Afetados**: `packs/Ameacas_T20`, `packs/Itens_T20`, `packs/Diarios_T20`, `packs/Tabelas_T20`.
- **Árvores de Fontes**: `src/packs/` correspondentes.
- **Integridade**: Garantia de 0 erros em auditoria geral.

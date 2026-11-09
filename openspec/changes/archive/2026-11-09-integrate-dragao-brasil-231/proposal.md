# Proposta: Integração Canônica Completa da Dragão Brasil #231

## Contexto e Motivação
A revista *Dragão Brasil #231* introduz vasto conteúdo oficial para o sistema *Tormenta20*, composto por três núcleos principais:
1. **A Vastidão Dourada de Halak-Tûr**: Cenário e regras do Deserto da Perdição, com a classe variante *Miragem (Caçador)*, a raça variante *Sahiri (Dahllan)*, o poder concedido *Canção da Pedra*, 5 novos poderes de caçador, 3 origens regionais e 6 ameaças de alto calibre (Arraia-Seca ND 3, Anshira ND 9, Caçador de Condenados ND 11, Constritora Arenosa ND 9, Ressecado Saqueador ND 4 e Ressecado Líder ND 4).
2. **Breves Jornadas: Circo Sombrio**: Uma aventura sombria de investigação e combate com 4 encontros/criaturas (Bianco ND 2, Rojo ND 2, Mantícora Zumbi ND 3 e Morrise ND 3), além de atrações, previsões e mistérios de Tenebra.
3. **Gazeta do Reinado (Edição 163)**: Crônicas do cenário artoniano (três anos da queda de Keenn e os certames da Tarvica).

Esta mudança integra 100% desse material nos 6 compêndios ClassicLevel do Foundry VTT seguindo os aprendizados acumulados das versões v1.4.7 a v1.7.2.

## Escopo da Mudança
- **Ameaças (`packs/Ameacas_T20`)**:
  - Implementar 10 Ameaças e NPCs canônicos com defesas dinâmicas, atributos completos, 34 perícias sob `system.pericias`, ataques e armas desmembrados com `rolls.parts` e tipos de dano (trevas, corte, perfuração), `ataquesad` onde aplicável, biografias canônicas com citações duplas (#800000 e #006400) e tokens circulares top-down 2MTT dedicados.
- **Itens e Poderes (`packs/Itens_T20`)**:
  - Implementar a classe variante *Miragem*, suas 4 habilidades exclusivas (*Dança da Areia*, *Cortina de Poeira*, *Passo do Deserto*, *Mestre do Deserto*), 5 novos poderes de caçador (*Arsenal do Deserto*, *Escaramuça Distante*, *Passo Duplo*, *Passos Precisos*, *Tesouros da Natureza*), poder concedido *Canção da Pedra*, raça variante *Sahiri* (*Animar Rochas* e *Proteção da Terra*), 3 origens regionais (*Criança do Crepúsculo*, *Nascido nas Estepes*, *Nômade Ferani*) e itens/tesouros especiais (*Presa de Ônix*, *Símbolo Sagrado de Azgher*).
- **Diários (`packs/Diarios_T20`)**:
  - 3 Diários oficiais estruturados com subdocumentos de páginas em `!journal.pages!journalId.pageId`, herança de permissões (`ownership.default: -1`) e formatação HTML limpa.
- **Tabelas de Rolagem (`packs/Tabelas_T20`)**:
  - 4 Tabelas de rolagem com fórmulas 1d6 e subdocumentos de resultados em `!tables.results!tableId.resultId`, incluindo campo `name` obrigatório.
- **Conformidade de IDs e Arquitetura**:
  - Imposição irrestrita da regra de IDs estritamente alfanuméricos com 16 caracteres (`/^[a-zA-Z0-9]{16}$/`).
  - Mapeamento explícito de ícones temáticos em `scripts/icon-resolver.js` sem qualquer uso do ícone genérico `colosso-supremo`.

## Limites e Não-Escopo
- Não alterar registros de edições anteriores (DB #226 a #230) já consolidados e verificados.
- Não adicionar conteúdo de outros sistemas presentes na revista (3DeT Victory, Daggerheart, Fabula Ultima).

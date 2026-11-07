# Spec Delta: items-specification

## ADDED Requirements

### Requirement: Dragão Brasil #229 Partners and Items Integration
All Partners from Dragão Brasil #229 (*Arius Gorgonius Dubitatius*, *Aylarianna Purpúrea*, *Ignis Crae*, *Kir’zanaath Odello*, *Rexthor*, *Defensor Rochoso Desperto*, *Kemooz Pensativo*, *Filhote de Grifo*) SHALL be created strictly as Items of type `poder` with `system.subtipo: "parceiro"` within the canonical folder *Parceiros* (`0uRx5Efj3tk7P5Xr`) in `packs/Itens_T20`. All descriptions MUST contain the verbatim text published in the official magazine PDF. ActiveEffects MUST follow the canonical Foundry VTT ClassicLevel subdocument architecture with BaseEffect data model schemas.

#### Scenario: Cães das Colinas Special Partners with tiered ActiveEffects
- **GIVEN** a special partner from Os Cães das Colinas (Arius, Ayla, Ignis, Kiki, or Rexthor)
- **WHEN** the item document is persisted in `Itens_T20`
- **THEN** type is `poder`, subtipo is `parceiro`, folder is `0uRx5Efj3tk7P5Xr`
- **AND** `effects` array contains the string IDs of the active effects
- **AND** persistent LevelDB subdocuments exist under `!items.effects!${itemId}.${effId}`
- **AND** effects provide the appropriate numerical modifiers for skills, defense, damage, or resistance

#### Scenario: Adventure Items and Poisons from O Olho do Basilisco
- **GIVEN** an item, raw material, weapon, or poison from O Olho do Basilisco
- **WHEN** the document is created in `Itens_T20`
- **THEN** *Machado de Batalha do Culto do Basilisco* has type `arma` with structured `rolls.parts`
- **AND** *Peçonha Concentrada* and *Peçonha Potente* have type `consumivel` in folder *Venenos* (`pJFxHpqcoNgiVRuo`)
- **AND** *Couro de Basilisco Ancestral* is in folder *Itens Superiores* (`qrF7mpfmMVo41wkr`) with value T$ 2.000
- **AND** *Olho de Basilisco Ancestral* is created with full description of its ritual properties

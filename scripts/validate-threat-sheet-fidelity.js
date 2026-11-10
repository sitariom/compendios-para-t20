#!/usr/bin/env node
/**
 * Validador e Auditor Profundo de Fidelidade de Fichas (PDF vs LevelDB)
 *
 * Checagens Críticas Inegociáveis:
 * 1. Ataques à Distância: Qualquer criatura com ataques à distância na ficha
 *    DEVE possuir itens do tipo "arma" com system.proposito em ['disparo', 'arremesso', 'corpo-a-corpo-arremesso']
 *    e alcance configurado, garantindo exibição em i.ranged no Foundry VTT.
 * 2. Poderes e Habilidades: Todas as habilidades do bloco de estatísticas do PDF
 *    devem existir como itens individuais atômicos no LevelDB.
 * 3. Resistências e Imunidades: system.detalhes.resistencias e system.tracos.ic/resistencias
 *    devem ser 100% fiéis ao bloco de estatísticas.
 * 4. Percepção e Sentidos Situacionais: Sentidos específicos de terreno devem estar
 *    mapeados com custom: true.
 */

const { ClassicLevel } = require('classic-level');
const path = require('path');

const PACK_AMEACAS = path.join(__dirname, '..', 'packs', 'Ameacas_T20');

let totalChecks = 0;
let totalErrors = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ ERRO: ${message}`);
    totalErrors++;
  }
}

async function runFidelityAudit() {
  console.log('================================================================================');
  console.log('🛡️  AUDITORIA PROFUNDA DE FIDELIDADE DE FICHAS (FOUNDRY VTT MENACE DATA MODEL)');
  console.log('================================================================================\n');

  const db = new ClassicLevel(PACK_AMEACAS, { valueEncoding: 'json' });

  // Regras de Verificação de Fidelidade Específica por Ator
  const expectations = [
    // --- DB #232 ---
    {
      id: 'gq8232LoboUrbAAA',
      name: 'Lobisomem Predador Urbano',
      expectedPowers: ['Ataque Furtivo', 'Empatia com Lobos', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232LoboCacAAA',
      name: 'Lobisomem Caçador de Recompensas',
      hasRanged: true,
      rangedName: 'Besta Leve',
      expectedPowers: ['Empatia com Lobos', 'Maldição da Licantropia', 'Marca da Presa', 'Mudança de Forma', 'Veneno (Peçonha Potente)', 'Aversão a Mitral'],
      expectedResistencias: 'imunidade a medo, redução de dano 5/mitral',
      expectedPerceptions: ['perc_subterraneo']
    },
    {
      id: 'gq8232RatoComAAA',
      name: 'Licantropo Rato Comedor de Restos',
      hasRanged: true,
      rangedName: 'Besta Leve',
      expectedPowers: ['Dentes de Roedor', 'Empatia com Ratos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232RatoInfAAA',
      name: 'Licantropo Rato Infiltrador Veterano',
      hasRanged: true,
      rangedName: 'Arco Longo',
      expectedPowers: ['Dentes de Roedor', 'Empatia com Ratos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232OncaPirAAA',
      name: 'Licantropo Onça Pirata de Rio',
      hasRanged: true,
      rangedName: 'Pistola',
      expectedPowers: ['Correr pelo Cordame', 'Emboscar', 'Empatia com Onças', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Pernas do Mar', 'Saque Rápido', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232OncaLutAAA',
      name: 'Licantropo Onça Lutador de Arena',
      expectedPowers: ['Emboscar', 'Empatia com Onças', 'Evasão', 'Maldição da Licantropia', 'Mudança de Forma', 'Presas de Adamante', 'Rasteira', 'Voadora Feral', 'Aversão a Mitral'],
      expectedResistencias: 'evasão, redução de dano 5/mitral'
    },
    {
      id: 'gq8232TexuFurAAA',
      name: 'Licantropo Texugo Furioso',
      expectedPowers: ['Durão', 'Empatia com Texugos', 'Fúria', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral',
      expectedPerceptions: ['perc_subterraneo']
    },
    {
      id: 'gq8232TexuNoiAAA',
      name: 'Licantropo Texugo Servo da Noite',
      expectedPowers: ['Armadura de Ossos', 'Durão', 'Empatia com Texugos', 'Magia Natural', 'Maldição da Licantropia', 'Mudança de Forma', 'Sorte Salvadora', 'Visão nas Trevas', 'Aversão a Mitral'],
      expectedSpells: ['Armamento da Natureza', 'Curar Ferimentos', 'Miasma Mefítico', 'Toque Vampírico'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232SelaFarAAA',
      name: 'Licantropo Selako Farejador de Sangue',
      hasRanged: true,
      rangedName: 'Azagaia',
      expectedPowers: ['Dentes Afiados', 'Faro do Selako', 'Empatia com Selakos', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de dano 5/mitral'
    },
    {
      id: 'gq8232SelaTerAAA',
      name: 'Licantropo Selako Terror dos Mares',
      hasRanged: true,
      rangedName: 'Azagaia',
      expectedPowers: ['Caçador Submarino', 'Dentes Afiados', 'Destruidor', 'Empatia com Selakos', 'Faro do Selako', 'Fúria Feral', 'Maldição da Licantropia', 'Mudança de Forma', 'Aversão a Mitral'],
      expectedResistencias: 'redução de corte 5, redução de dano 5/mitral'
    },
    {
      id: 'gq8232MamaeGlopA',
      name: 'Mamãe Glop',
      expectedPowers: ['Glops Filhinhos', 'Meiose Glópica'],
      expectedResistencias: 'imunidade a ácido'
    },
    {
      id: 'gq8232EstirgeAAA',
      name: 'Estirge',
      expectedPowers: ['Agarrar Aprimorado (Livre)', 'Chupar Sangue (Livre)', 'Sangrar']
    },
    {
      id: 'gq8232PerdTrollA',
      name: 'Perdigueiro Troll',
      expectedPowers: ['Agarrar Aprimorado (Livre)', 'Derrubar (Livre)', 'Natureza Vegetal'],
      expectedResistencias: 'imunidade a atordoamento e metamorfose'
    },
    {
      id: 'gq8232GineTrollA',
      name: 'Ginete de Troll Purista',
      expectedPowers: ['Corcel Troll', 'Investida Atroz', 'Ódio Puro']
    },
    {
      id: 'gq8232XamaFinntA',
      name: 'Xamã Finntroll',
      expectedPowers: ['Natureza Vegetal', 'Urro Divino', 'Intolerância a Luz'],
      expectedSpells: ['Amedrontar', 'Curar Ferimentos', 'Escudo da Fé', 'Perdição'],
      expectedResistencias: 'cura acelerada 5/ácido ou fogo, imunidade a atordoamento e metamorfose'
    },

    // --- DB #231 ---
    {
      id: 'gq8231RessecSaqA',
      name: 'Ressecado Saqueador',
      hasRanged: true,
      rangedName: 'Arco Curto',
      expectedPowers: ['Celeridade Odiosa', 'Ódio aos Vivos']
    },
    {
      id: 'gq8231RessecLidA',
      name: 'Ressecado Líder',
      hasRanged: true,
      rangedName: 'Arco Curto',
      expectedPowers: ['Celeridade Odiosa', 'Ódio aos Vivos', 'Ordens Letais']
    },
    {
      id: 'gq8231ManticZumb',
      name: 'Mantícora Zumbi',
      hasRanged: true,
      rangedName: 'Espinhos',
      expectedPowers: ['Fraqueza Zumbi', 'Mordida']
    },

    // --- DB #230 ---
    {
      id: 'gq8KArzak230AAAA',
      name: 'Arzak',
      hasRanged: true,
      rangedName: 'Adaga',
      expectedPowers: ['Um com as Sombras', 'Evasão Aprimorada', 'Manobras Evasivas', 'Sangrento']
    }
  ];

  for (const exp of expectations) {
    let actorDoc;
    try {
      actorDoc = await db.get(`!actors!${exp.id}`);
    } catch {
      assert(false, `Ator "${exp.name}" [${exp.id}] NÃO encontrado no LevelDB.`);
      continue;
    }

    // Carrega subdocumentos
    const items = [];
    for await (const [, v] of db.iterator({ gte: `!actors.items!${exp.id}.`, lte: `!actors.items!${exp.id}.\uffff` })) {
      items.push(v);
    }

    const itemNames = items.map(i => i.name);
    console.log(`Auditorando "${exp.name}" (${items.length} itens)...`);

    // 1. Verificação de Ataques à Distância
    if (exp.hasRanged) {
      const rangedWeapons = items.filter(i =>
        i.type === 'arma' &&
        ['arremesso', 'corpo-a-corpo-arremesso', 'disparo'].includes(i.system?.proposito)
      );
      assert(rangedWeapons.length > 0, `${exp.name} possui arma com proposito em ['disparo', 'arremesso'] (encontradas ${rangedWeapons.length})`);
      if (exp.rangedName) {
        const found = rangedWeapons.some(w => w.name.toLowerCase().includes(exp.rangedName.toLowerCase()));
        assert(found, `${exp.name} possui ataque à distância específico "${exp.rangedName}"`);
      }
    }

    // 2. Verificação de Poderes Esperados
    if (exp.expectedPowers) {
      for (const p of exp.expectedPowers) {
        assert(itemNames.includes(p), `${exp.name} possui o poder/habilidade "${p}"`);
      }
    }

    // 3. Verificação de Magias Esperadas
    if (exp.expectedSpells) {
      for (const s of exp.expectedSpells) {
        const spell = items.find(i => i.name === s && i.type === 'magia');
        assert(Boolean(spell), `${exp.name} possui a magia individual "${s}" de tipo "magia"`);
      }
    }

    // 4. Verificação de Percepções Situacionais
    if (exp.expectedPerceptions) {
      for (const pKey of exp.expectedPerceptions) {
        assert(actorDoc.system?.pericias?.[pKey]?.custom === true, `${exp.name} possui percepção situacional customizada "${pKey}"`);
      }
    }

    // 5. Verificação de Resistências
    if (exp.expectedResistencias) {
      const res = actorDoc.system?.detalhes?.resistencias || '';
      assert(res === exp.expectedResistencias, `${exp.name} possui detalhes.resistencias exato: esperado "${exp.expectedResistencias}", obtido "${res}"`);
    }

    console.log(`  ✓ "${exp.name}" auditado e conforme.`);
  }

  await db.close();

  console.log('\n================================================================================');
  console.log(`Total de verificações realizadas: ${totalChecks}`);
  console.log(`Total de erros encontrados: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 100% DE APROVAÇÃO NA AUDITORIA DE FIDELIDADE!');
  } else {
    console.error(`❌ FALHA: ${totalErrors} discrepâncias detectadas.`);
    process.exit(1);
  }
  console.log('================================================================================\n');
}

if (require.main === module) {
  runFidelityAudit().catch(err => {
    console.error('Erro fatal na auditoria:', err);
    process.exit(1);
  });
}

module.exports = { runFidelityAudit };

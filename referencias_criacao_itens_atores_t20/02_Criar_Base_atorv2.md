
---

### **NOVAS INSTRUÇÕES: ATOR TIPO "BASES" (SEDE/FORTALEZA)**

Este tipo de ator representa uma construção, sede de guilda, castelo ou base de operações. Diferente de NPCs, ele não possui atributos físicos (Força, Destreza, etc.) ou perícias. Suas estatísticas principais giram em torno de **Segurança**, **Porte** e **Espaço (Rooms)**.

#### **1. Lógica de Preenchimento**
*   **Tipo do Ator:** O campo `type` deve ser estritamente **`"bases"`** (no plural, conforme o JSON analisado).
*   **Itens Permitidos:** Este ator aceita principalmente itens dos tipos **`"comodo"`** e ****`"mobilia"`**.
*   **Residentes:**
    *   No Ator (`system.residentes`): É um vetor de IDs. Como estamos criando o JSON do zero, deve iniciar vazio `[]`.
    *   Nos Itens (`system.residentes`): É um booleano (`true`/`false`). Indica se aquele cômodo ou mobília permite/comporta residentes.
*   **Segurança:** Valor numérico que define a defesa da base. O `total` deve ser calculado se houver bônus (Base + Bônus = Total).

---

#### **2. Template para Ator Tipo "bases"**

```json
{
  "name": "NOME_DA_BASE", // String. Nome da construção ou sede
  "type": "bases", // String. SEMPRE "bases"
  "img": "CAMINHO_DO_ICONE", // String. Ex: systems/tormenta20/icons/svg/castle.svg
  "system": {
    "tipo": "TIPO_DE_CONSTRUCAO", // String. Ex: "Castelo", "Taverna", "Caverna" (Deixar vazio "" se não informado)
    "porte": "CODIGO_PORTE", // String. Tamanho da base. Valor padrão encontrado: "bas". Outros possíveis (estimado): "min", "mod", "bas", "for", "gra", "sup". Use "bas" se não especificado.
    "seguranca": {
      "base": VALOR_SEGURANCA_BASE, // Number. Valor base da segurança
      "bonus": VALOR_SEGURANCA_BONUS, // Number. Bônus de segurança (ex: por muralhas)
      "total": VALOR_SEGURANCA_TOTAL // Number. Soma de base + bonus
    },
    "residentes": [], // Array. Lista de IDs de residentes. Manter vazio [].
    "rooms": NUMERO_DE_COMODOS, // Number. Capacidade ou quantidade de cômodos/espaços da base. min = 0, mod = 3, bas = 6, for = 9, gra = 12, sup = 15 
    "detalhes": {
      "biography": {
        "value": "HTML_DA_DESCRICAO" // String. Descrição detalhada da base com formatação HTML, seguindo o padrão de estilização (blockquote, cores) definido nas regras gerais.
      }
    },
    "attributes": {
      // O sistema mantém estrutura de movimento padrão, mesmo para bases (provavelmente para compatibilidade). Preencher com 0.
      "movement": {
        "walk": { "base": 0, "bonus": [] },
        "climb": { "base": 0, "bonus": [] },
        "burrow": { "base": 0, "bonus": [] },
        "swim": { "base": 0, "bonus": [] },
        "fly": { "base": 0, "bonus": [] },
        "hover": false,
        "tags": [],
        "unit": "m"
      }
    }
  },
  "items": [
    // INSERIR AQUI OS OBJETOS JSON DE ITENS DO TIPO "comodo" E "mobilia"
  ],
  "prototypeToken": {
    "name": "NOME_DA_BASE",
    "actorLink": true, // Bases geralmente são atores únicos
    "texture": {
      "src": "CAMINHO_DO_ICONE" // Mesmo ícone do ator
    }
    // ... (Manter demais configurações padrão de token se necessário, ou omitir para usar o default do Foundry)
  }
}
```

---

#### **3. Template para Item Tipo "comodo"**

Representa quartos, salões, laboratórios, etc.

```json
{
  "name": "NOME_DO_COMODO", // String. Ex: "Dormitório", "Cozinha"
  "type": "comodo", // String. SEMPRE "comodo"
  "img": "ICON_DO_ITEM", // String. Ex: systems/tormenta20/icons/svg/door.svg
  "system": {
    "description": {
      "value": "DESCRICAO_DO_COMODO", // String. HTML com descrição.
      "unidentified": ""
    },
    "preco": PRECO_DO_COMODO, // Number. Custo em Tibares (TO/TC) se aplicável, ou 0.
    "residentes": BOOLEANO_HABITAVEL, // Boolean. true se permite moradores, false se não.
    "source": "",
    "origin": "",
    "tags": [],
    "rolltags": [],
    "chatFlavor": "FLAVOR_TEXT", // String. Texto de ambientação.
    "chatGif": ""
  },
  "effects": [], // Array. Efeitos se houver (ex: um laboratório dando bônus em ofício).
  "flags": {}
}
```

---

#### **4. Template para Item Tipo "mobilia"**

Representa mobília, melhorias estruturais ou decoração funcional.

```json
{
  "name": "NOME_DA_MOBILIA", // String. Ex: "Trono de Pedra", "Bancada de Alquimia"
  "type": "mobilia", // String. SEMPRE "mobilia"
  "img": "ICON_DO_ITEM", // String. Ex: systems/tormenta20/icons/svg/armchair.svg
  "system": {
    "description": {
      "value": "DESCRICAO_DA_MOBILIA", // String. HTML com descrição.
      "unidentified": ""
    },
    "preco": PRECO_DA_MOBILIA, // Number. Custo do item.
    "residentes": BOOLEANO_HABITAVEL, // Boolean. Geralmente false para mobília, a menos que seja uma cama/beliche específica.
    "source": "",
    "origin": "",
    "tags": [],
    "rolltags": [],
    "chatFlavor": "FLAVOR_TEXT", // String. Texto de ambientação.
    "chatGif": ""
  },
  "effects": [], // Array. Adicione efeitos aqui se a mobília der bônus (ex: +2 em testes de Cura).
  "flags": {}
}
```

---

### **Resumo das Alterações no Fluxo de Trabalho**

1.  **Identificação:** Se o texto descreve um lugar, prédio ou base de operações ao invés de uma criatura viva, utilize o template `type: "bases"`.
2.  **Atributos:** Ignore Força, Destreza, PV e PM. Foque em **Segurança** e **Cômodos**.
3.  **Itens:** Converta as divisões do local (ex: "Sala do Trono", "Masmorra") em itens do tipo **`comodo`**. Converta objetos de destaque (ex: "Estátua da Deusa", "Mesa de Guerra") em itens do tipo **`mobilia`**.
4.  **Efeitos:** Se a base concede bônus aos personagens que estão nela (ex: "Recuperação de PM aumentada ao descansar aqui"), crie esses efeitos dentro dos itens `comodo` ou `mobilia` correspondentes, usando as flags padrão `tormenta20`.

**Confirme se compreendeu a estrutura do ator "Base" e se posso prosseguir com a criação de JSONs utilizando esses novos templates.**
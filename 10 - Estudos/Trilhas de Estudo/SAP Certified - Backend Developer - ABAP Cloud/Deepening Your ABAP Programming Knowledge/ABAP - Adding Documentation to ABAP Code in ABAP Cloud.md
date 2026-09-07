---
id: sap-abap-adding-documentation-to-abap-code-in-abap-cloud
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud]
modulos: []
produtos: [BTP]
release: agnostico
nivel: intermediario
autor: Hayron Piffer
criado: 2026-09-07
atualizado: 2026-09-07
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---

# ABAP - Adding Documentation to ABAP Code in ABAP Cloud

Este documento compila e organiza de forma exaustiva todas as diretrizes técnicas, sintaxes, atalhos de automação e regras de sincronização para a documentação de código usando **ABAP Doc** em ambientes de desenvolvimento baseados no Eclipse ADT (ABAP Development Tools) [9, 10].

---

## Fluxo de Aprendizagem Recomendado

```
[Módulo 1: Introdução ao ABAP Doc] ➔ [Módulo 2: Sintaxe e Tags de Formatação] 
                                                    │
[Módulo 5: Exemplo Prático & Testes] ◀─ [Módulo 4: Links e Navegação Dinâmica] ◀─ [Módulo 3: Automação e Sincronização]
```

---

## Módulo 1: Introdução ao ABAP Doc e Fundamentos

### 1.1 O que é o ABAP Doc?

O **ABAP Doc** é o padrão oficial para adicionar documentação integrada e de fácil acesso diretamente dentro do código-fonte ABAP [9, 10]. Toda documentação criada com ABAP Doc é incorporada ao sistema e renderizada no Eclipse ADT [9, 11].

- **Exibição no ADT**: Ao posicionar o cursor sobre o nome de uma classe, interface, método ou tipo e pressionar a tecla **F2**, uma janela de diálogo contendo as informações detalhadas do elemento (_ABAP Element Info_) é aberta. O conteúdo escrito no ABAP Doc é exibido nessa janela sob a seção dedicada de **Documentation** [9, 19].
- **Posicionamento no Código**: Os comentários de ABAP Doc devem obrigatoriamente ficar **imediatamente antes** da instrução declarativa que documentam [10].
- **Sintaxe de Início**: Cada linha de comentário do ABAP Doc deve iniciar estritamente com os caracteres de aspas duplas seguidas de ponto de exclamação (**`"!`**) [10]. Se pressionado **Enter** ao fim de uma linha iniciada com `"!`, o editor insere automaticamente o prefixo na próxima linha [18].
- **Avisos de Sintaxe**: Se um comentário ABAP Doc for inserido em uma posição inválida (por exemplo, dentro do corpo de um método ou após a declaração do elemento), o sistema emitirá um _Syntax Warning_ e a documentação será ignorada [10].
- **Limitação de Tradução**: Os comentários de ABAP Doc **não podem ser traduzidos** [11]. Portanto, o desenvolvedor deve planejar cuidadosamente o idioma em que criará a documentação de referência das APIs do projeto [11].

### 1.2 Declarações e Elementos Documentáveis

O ABAP Doc permite documentar as seguintes instruções declarativas [10]:

1. **`CLASS`** (Definição de classes globais e locais) [10]
2. **`INTERFACE`** (Definição de interfaces globais e locais) [10]
3. **`METHODS`** / **`CLASS-METHODS`** (Métodos de instância e estáticos) [10, 19]
4. **`TYPES`** (Definições de tipos locais e estruturas) [10]
5. **`DATA`** / **`CLASS-DATA`** (Variáveis de instância e estáticas) [10]
6. **`CONSTANTS`** (Declarações de constantes de classe) [10]

Além disso, é possível documentar de forma granular os **parâmetros individuais** e as **exceções** de métodos e módulos de função [10].

---

## Módulo 2: Sintaxe e Tags de Formatação

O ABAP Doc oferece suporte a um subconjunto específico de tags HTML para enriquecer a formatação visual e a legibilidade da documentação técnica [11].

### 2.1 Tags HTML Suportadas

Para formatar o texto do ABAP Doc, utilize as seguintes marcações [11, 12]:

|Objetivo Semântico|Tag HTML de Formatação|Observação Técnica|
|---|---|---|
|**Título Nível 1**|`<h1>...</h1>`|Usado para cabeçalhos de seções principais [12].|
|**Título Nível 2**|`<h2>...</h2>`|Usado para cabeçalhos secundários [12].|
|**Título Nível 3**|`<h3>...</h3>`|Usado para cabeçalhos de subseções [12].|
|**Texto em Negrito**|`<strong>...</strong>`|Formata o conteúdo com ênfase visual forte [11, 12].|
|**Texto em Itálico**|`<em>...</em>`|Formata o conteúdo com ênfase estilística leve [12].|
|**Parágrafo**|`<p>...</p>`|Delimita blocos de texto independentes [12].|
|**Quebra de Linha**|`<br/>`|Força a descida de linha. **Atenção**: Sem essa tag, linhas subsequentes de ABAP Doc serão exibidas coladas na mesma linha do diálogo [11].|
|**Lista Não Ordenada**|`<ul><li>...</li></ul>`|Cria listas formatadas com marcadores circulares [12].|
|**Lista Ordenada**|`<ol><li>...</li></ol>`|Cria listas enumeradas sequencialmente [12].|

> 💡 **Dica de Produtividade**: Você não precisa digitar as tags HTML manualmente. Estando dentro de um comentário iniciado com `"!`, pressione **Ctrl + Space** para abrir o _Code Completion_ e escolha a diretiva de formatação desejada na lista [12, 24].

### 2.2 Documentando Assinaturas de Métodos

Para documentar a assinatura completa de um método (parâmetros de entrada, saída, modificação, retorno e as exceções que ele pode disparar), o ABAP Doc emprega anotações especiais [12]:

- **Descrição do Método**: Linhas de texto comuns após o caractere `"!` [12].
- **Parâmetros**: Indicados pela sintaxe `"! @parameter <nome_do_parametro> | <descrição>` (o caractere de barra vertical ou pipe `|` delimita o início do comentário do parâmetro) [12].
- **Exceções / Propagação**: Indicadas pela sintaxe `"! @raising <nome_da_excecao> | <descrição>` [20].

---

## Módulo 3: Automação e Sincronização de Propriedades

O ADT Eclipse fornece ferramentas avançadas de refatoração rápida (_Quick Fixes_) para criar, manter e sincronizar o ABAP Doc de forma ágil [13].

### 3.1 Geração de ABAP Doc via Quick Fix

Para evitar o trabalho manual de mapear todos os parâmetros de um método complexo:

1. Escreva a definição do método na seção declarativa (ex: `METHODS calcular_imposto ...`) [13].
2. Posicione o cursor sobre o nome do método [13].
3. Pressione **Ctrl + 1** para invocar a janela de _Quick Fixes_ [13].
4. Selecione a opção **Add ABAP Doc** [13].
5. O editor irá gerar automaticamente o esqueleto de documentação com as marcações de `@parameter` e `@raising` correspondentes [13, 20].

```abap
  "! 
  "! @parameter i_carrier_id |
  "! @parameter r_result |
  "! @raising zcx_failed |  
  CLASS-METHODS get_instance ...
```

Se a assinatura do método sofrer modificações no futuro (parâmetros adicionados ou removidos), posicione novamente o cursor sobre o elemento, pressione **Ctrl + 1** e utilize os _Quick Fixes_ inteligentes fornecidos para remover as tags de parâmetros excluídos ou adicionar tags para novas entradas automaticamente [13].

### 3.2 Sincronização com as Propriedades do Objeto (Shorttext)

É possível sincronizar o comentário descritivo do ABAP Doc com as propriedades nativas de texto descritivo do elemento no repositório SAP (exibido na aba de propriedades e na lista de objetos) [13].

Para ativar esse comportamento de replicação automática bidirecional:

- Envolva a descrição curta do elemento em uma tag de parágrafo contendo a classe especial `shorttext synchronized` [13]:

```abap
  "! <p class="shorttext synchronized">Factory method - returns instance.</p>
  "! @parameter i_carrier_id | Three-character identification of the carrier.
```

**Benefício da Bidirecionalidade**:

1. Qualquer alteração feita no texto descritivo dentro do comentário ABAP Doc será sincronizada com a descrição curta do objeto no repositório [13].
2. De forma inversa, alterações manuais salvas diretamente na descrição nas propriedades do objeto no SAP GUI ou ADT serão refletidas automaticamente de volta no comentário ABAP Doc do código [14].

---

## Módulo 4: Links e Navegação Dinâmica (`{@link}`)

O ABAP Doc permite criar hiperlinks interativos que facilitam a navegação direta do desenvolvedor para a documentação de outros objetos ou componentes do repositório através do pop-up de informações [14].

### 4.1 Sintaxe de Referência Cruzada

Para criar um link para outro elemento de código, utilize a anotação `{@link ...}` [14].

- **Referência a Objetos Globais**: Utilize o nome absoluto do objeto [31].
    
    ```abap
    "! {@link ZIF_MY_INTERFACE}
    ```
    
- **Referência a Classes Locais**: Quando a documentação reside no nível de uma classe global, mas você deseja referenciar uma classe local declarada na aba de tipos locais do mesmo programa, você deve prefixar o nome da classe local com um caractere de ponto físico (**`.`**) [31]:
    
    ```abap
    "! {@link .lcl_passenger_flight}
    ```
    
- **Referência a Atributos, Constantes ou Variáveis**: Ao criar links direcionados a variáveis ou atributos internos de um elemento, é obrigatório inserir o identificador **`DATA:`** imediatamente antes do nome do componente sob link [32]:
    
    ```abap
    "! {@link .lcl_flight.DATA:carrier_id}
    "! {@link zif_1_abap_doc_constants.DATA:auth_create}
    ```
    

### 4.2 Identificadores Técnicos de Elementos (IDs)

Ao vincular componentes específicos, utilize os seguintes prefixos de identificação técnica [14, 15]:

|ID Técnico|Escopo de Aplicação|Exemplo de Sintaxe de Link|
|---|---|---|
|**`DATA`**|Para constantes, variáveis e parâmetros de procedimento no contexto apropriado [15].|`{@link .lcl_flight.DATA:carrier_id}` [32]|
|**`METH`**|Para métodos e comportamentos em classes/interfaces [15].|`{@link .lcl_flight.METH:get_flight_details}`|
|**`INTF`**|Para interfaces implementadas em uma classe (usado para expor os componentes específicos da interface) [15].|`{@link lcl_flight.INTF:zif_carrier_data}`|
|**`DOMA`**|Para objetos de domínio estruturados no ABAP Dictionary [15].|`{@link DOMA:char3}`|

---

## Módulo 5: Exemplo Prático de Código Documentado

Abaixo está um exemplo completo e funcional de definição de classe e métodos documentados com ABAP Doc, empregando formatações com tags HTML, referências cruzadas e documentação de assinaturas:

```abap
  "! <p class="shorttext synchronized">Abstract class representing flights</p>
  "! Abstract superclass for classes {@link .lcl_passenger_flight} and {@link .lcl_cargo_flight}. <br/>
  "! Every instance is uniquely identified by the following key attributes:
  "! <ul>
  "!   <li>{@link .lcl_flight.DATA:carrier_id} - The Flight Carrier ID</li>
  "!   <li>{@link .lcl_flight.DATA:connection_id} - Connection number</li>
  "!   <li>{@link .lcl_flight.DATA:flight_date} - Operational date</li>
  "! </ul>
  CLASS lcl_flight DEFINITION ABSTRACT.
    PUBLIC SECTION.
      DATA carrier_id    TYPE /dmo/carrier_id READ-ONLY.
      DATA connection_id TYPE /dmo/connection_id READ-ONLY.
      DATA flight_date   TYPE /dmo/flight_date READ-ONLY.
  ENDCLASS.

  "! <p class="shorttext synchronized">Flight Carrier Factory</p>
  "! A factory logic ensures that there can only be one active instance for each carrier ID.
  CLASS lcl_carrier DEFINITION CREATE PRIVATE.
    PUBLIC SECTION.
      "! Factory method - returns an instance of this class.
      "! @parameter i_carrier_id | Three-character identification of the carrier.
      "! @parameter r_result     | Reference to the carrier instance - initial if instantiation failed.
      "! @raising   zcx_failed   | Instantiation failed - evaluate the exception text for details.
      CLASS-METHODS get_instance
        IMPORTING
          i_carrier_id    TYPE /dmo/carrier_id
        RETURNING
          VALUE(r_result) TYPE REF TO lcl_carrier
        RAISING
          zcx_failed.
  ENDCLASS.
```

---

## Resumo dos Atalhos Essenciais para ABAP Doc no ADT

- **`F2`**: Exibe o pop-up de informações do elemento (_ABAP Element Info_) contendo a visualização final formatada do ABAP Doc [9, 19].
- **`Ctrl + 1`**: Abre o assistente de Quick Fixes. Com o cursor sobre a declaração de classes ou métodos, use este atalho para selecionar **Add ABAP Doc** [13].
- **`Ctrl + Space`**: Abre o assistente de preenchimento de código para autocompletar tags HTML de formatação no interior de blocos de comentários `"!` [12, 24].
- **`Ctrl + F3`**: Ativa o código-fonte atual [16, 33].
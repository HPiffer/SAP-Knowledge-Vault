---
id: sap-abap-defining-and-working-with-exception-classes-in-abap-cloud
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

# ABAP - Defining and Working with Exception Classes in ABAP Cloud

Este guia de estudos consolida os conceitos, diretrizes de design, sintaxes e boas práticas de tratamento e definição de classes de exceção em ABAP Cloud, com base nos materiais oficiais selecionados. O fluxo está organizado de forma progressiva para guiar o aprendizado do tratamento básico ao design avançado de exceções customizadas.

---

## Fluxo de Aprendizagem Recomendado

```
[Módulo 1: Fundamentos do Tratamento] ➔ [Módulo 2: Captura e Propagação] ➔ [Módulo 3: Exception Chaining (Previous)]
                                                                                │
[Módulo 6: Boas Práticas e Testes] ◄─ [Módulo 5: Criação de Exceções Próprias] ◄─ [Módulo 4: Mensagens Dinâmicas (T100)]
```

---

## Módulo 1: Fundamentos do Tratamento de Exceções

### 1. Predefinidas vs. Customizadas [9]

- **Exceções do Sistema (`cx_sy_...`):** O ABAP fornece uma ampla gama de classes de exceção predefinidas, cujos nomes começam com o prefixo `cx_sy` (ex: `cx_sy_zerodivide`, `cx_sy_arithmetic_overflow` [9, 80]). No entanto, essas exceções descrevem falhas estritamente técnicas de runtime e não possuem semântica de negócios ou de aplicação [9].
- **Exceções de Aplicação:** Para descrever situações de negócio específicas de um aplicativo (por exemplo, quando uma combinação de companhia aérea e voo não existe em um sistema de reservas), o desenvolvedor deve criar suas próprias classes de exceção herdando diretamente de subclasses apropriadas, como **`cx_static_check`** [10].

### 2. A Hierarquia de Exceções (`cx_root`) [74]

Todas as classes de exceção do ABAP fazem parte de uma árvore de herança unificada, cujo nó topo (superclasse absoluta) é a classe **`cx_root`** [74]. Como consequência, qualquer tratamento ou referência genérica pode utilizar `cx_root` para interceptar toda e qualquer exceção do sistema ou de negócio [74].

---

## Módulo 2: Mecânica de Captura e Propagação de Exceções

### 1. O Bloco `TRY ... CATCH ... ENDTRY` [12, 73]

- **Estrutura Básica:** O código suscetível a erros é colocado dentro do bloco `TRY`. Se um erro ocorrer, o fluxo de execução é interrompido imediatamente e o sistema desvia o controle para o bloco `CATCH` correspondente [73]. Após o processamento da lógica de tratamento, a execução continua normalmente após a instrução `ENDTRY` [73].
- **Múltiplos CATCHs:** É possível definir mais de um bloco `CATCH` dentro de um único `TRY ... ENDTRY` para tratar diferentes erros de maneiras específicas [73]:
    
    ```abap
    TRY.
        result = number1 / number2.
      CATCH cx_sy_arithmetic_overflow.
        out->write( 'Arithmetic Overflow' ).
      CATCH cx_sy_zerodivide.
        out->write( 'Division by zero' ).
    ENDTRY.
    ```
    
- **Agrupamento de Exceções:** Diferentes classes de exceção podem ser tratadas em um mesmo bloco `CATCH`, separando-as por espaço [73]:
    
    ```abap
    CATCH cx_sy_arithmetic_overflow cx_sy_zerodivide.
    ```
    
- **Captura por Superclasse:** Se uma superclasse for listada no `CATCH`, ela capturará automaticamente as exceções dela mesma e de todas as suas subclasses derivadas [74]. Por exemplo, `CATCH cx_sy_arithmetic_error` captura tanto `cx_sy_arithmetic_overflow` quanto `cx_sy_zerodivide` [74, 80].

### 2. Regra de Sequência dos Blocos `CATCH` [75]

Ao estruturar múltiplos tratamentos, **as exceções mais específicas (subclasses) devem sempre ser posicionadas antes das mais genéricas (superclasses)** [75]. Colocar uma superclasse antes de sua subclasse gerará um **erro de sintaxe** em tempo de compilação, pois o bloco específico seria completamente obscurecido (sombreado) pelo bloco genérico [75].

### 3. Recuperação do Objeto de Exceção (`INTO`) [75, 76]

Cada exceção disparada é representada por uma instância de objeto na memória [75]. Para investigar os metadados do erro, pode-se capturar essa referência usando a cláusula **`INTO`** com uma declaração inline [76, 83]:

```abap
TRY.
    ...
  CATCH cx_sy_arithmetic_error INTO DATA(lo_exception).
    out->write( lo_exception->get_text( ) ).
ENDTRY.
```

- **`get_text( )`:** Método padrão herdado de `cx_root` que retorna a mensagem de erro formatada [75, 76].

### 4. Propagação de Exceções via Cláusula `RAISING` [77, 78]

Se um método encontrar um erro, mas não puder ou não desejar tratá-lo localmente, ele deve **propagar** a exceção ao longo da pilha de chamadas [77]. Isso é feito declarando explicitamente a exceção na assinatura do método com a cláusula `RAISING` [77]:

```abap
METHODS get_data IMPORTING i_id TYPE string RAISING cx_static_check.
```

- **Aviso Importante:** Se uma exceção não for capturada por nenhum bloco `TRY ... CATCH` ao longo de toda a cadeia de chamadas, ela atingirá o nível do sistema e provocará um **erro de runtime (Dump/Runtime Error)**, abortando a aplicação [78].

---

## Módulo 3: Exception Chaining e Preservação de Contexto

### 1. Motivação técnica [78]

Frequentemente, ao longo de uma cadeia de chamadas, uma rotina captura uma exceção técnica (de baixo nível) e precisa disparar uma nova exceção mais semântica e orientada à aplicação para quem a chamou [78]. Para que o contexto original do erro não seja perdido, o ABAP fornece o recurso de **Exception Chaining** (encadeamento de exceções) [78, 79].

### 2. O Atributo `PREVIOUS` [78, 79]

A classe base `cx_root` possui o atributo público e somente leitura **`previous`**, que armazena uma referência à exceção original que causou o problema atual [78, 79].

- **Sintaxe de Disparo com Encadeamento:** Ao disparar a nova exceção, passe a referência da exceção capturada para o parâmetro `previous` do construtor [79]:
    
    ```abap
    TRY.
        " Código de baixo nível que falha
      CATCH cx_sy_database_error INTO DATA(lo_db_error).
        RAISE EXCEPTION TYPE zcx_application_failed
          EXPORTING
            previous = lo_db_error.
    ENDTRY.
    ```
    
- **Recuperação no Tratamento:** O consumidor final que captura `zcx_application_failed` pode navegar pela pilha de exceções acessando o atributo `previous` para ler a causa raiz [79]:
    
    ```abap
    CATCH zcx_application_failed INTO DATA(lo_app_error).
      IF lo_app_error->previous IS BOUND.
        out->write( lo_app_error->previous->get_text( ) ).
      ENDIF.
    ```
    

---

## Módulo 4: Integração de Exceções com Mensagens de Texto (T100)

Exceções em ABAP Cloud tornam-se muito mais eficazes quando integradas ao mecanismo de **Message Classes (T100)** do dicionário de dados, permitindo textos traduzíveis e placeholders dinâmicos [10, 11].

### 1. Criação da Classe de Mensagem [15]

1. No Eclipse ADT, crie uma classe de mensagem (ex: `Z##_MESSAGES`) [15].
2. Defina mensagens com marcadores posicionais (`&1`, `&2`, `&3`, `&4`) [15]:
    - Mensagem `010`: `Carrier &1 does not exist` [15].
    - Mensagem `020`: `You are not authorized to display carrier &1` [15].
3. **Nota de Logística:** Classes de mensagem não possuem distinção de versão ativa/inativa e não requerem ativação física (basta salvar com `Ctrl + S`) [15].

### 2. Estrutura de Constantes Técnicas (`t100key`) [11, 18, 21]

Para que a exceção saiba qual mensagem exibir, ela precisa implementar a interface **`if_t100_message`** [11]. O mapeamento é feito por meio de constantes públicas do tipo estrutura contendo os seguintes campos técnicos [18, 21]:

- `msgid`: Nome da classe de mensagem [11, 18].
- `msgno`: Número da mensagem de 3 caracteres [11, 18].
- `attr1` a `attr4`: Nomes dos atributos públicos da exceção (como strings de texto em maiúsculo) que preencherão os placeholders `&1` a `&4` em runtime [11, 18, 21].

```abap
CONSTANTS:
  BEGIN OF carrier_not_exist,
    msgid TYPE symsgid      VALUE 'Z##_MESSAGES',
    msgno TYPE symsgno      VALUE '010',
    attr1 TYPE scx_attrname VALUE 'CARRIER_ID',
    attr2 TYPE scx_attrname VALUE 'attr2',
    attr3 TYPE scx_attrname VALUE 'attr3',
    attr4 TYPE scx_attrname VALUE 'attr4',
  END OF carrier_not_exist.
```

---

## Módulo 5: Criando e Implementando Sua Própria Classe de Exceção

Abaixo está o padrão arquitetural completo para definir e consumir uma classe de exceção global ou local em ABAP Cloud, unificando tratamento de placeholders e inicialização segura [11, 16, 20, 22].

### 1. Definição da Classe (`DEFINITION`) [11, 16, 17, 20, 22]

A classe de exceção deve herdar de `cx_static_check` (ou outra classe de controle de fluxo) e implementar as interfaces de mensagens do sistema (`if_t100_message`, e opcionalmente `if_t100_dyn_msg`) [16, 17]. Os atributos que representam as variáveis de negócio devem ser marcados como **`READ-ONLY`** [11, 20]:

```abap
CLASS zcx_carrier_failed DEFINITION
  INHERITING FROM cx_static_check
  PUBLIC SECTION.

    INTERFACES if_t100_message.
    INTERFACES if_t100_dyn_msg.

    CONSTANTS:
      BEGIN OF carrier_not_exist,
        msgid TYPE symsgid      VALUE 'Z##_MESSAGES',
        msgno TYPE symsgno      VALUE '010',
        attr1 TYPE scx_attrname VALUE 'CARRIER_ID',
        attr2 TYPE scx_attrname VALUE 'attr2',
        attr3 TYPE scx_attrname VALUE 'attr3',
        attr4 TYPE scx_attrname VALUE 'attr4',
      END OF carrier_not_exist,

      BEGIN OF carrier_no_read_auth,
        msgid TYPE symsgid      VALUE 'Z##_MESSAGES',
        msgno TYPE symsgno      VALUE '020',
        attr1 TYPE scx_attrname VALUE 'CARRIER_ID',
        attr2 TYPE scx_attrname VALUE 'attr2',
        attr3 TYPE scx_attrname VALUE 'attr3',
        attr4 TYPE scx_attrname VALUE 'attr4',
      END OF carrier_no_read_auth.

    " Atributos públicos de negócio que alimentam os placeholders
    DATA carrier_id TYPE /dmo/carrier_id READ-ONLY.

    METHODS constructor
      IMPORTING
        !textid     LIKE if_t100_message=>t100key OPTIONAL
        !previous   LIKE previous OPTIONAL
        !carrier_id TYPE /dmo/carrier_id OPTIONAL.
ENDCLASS.
```

### 2. Implementação da Classe e Construtor (`IMPLEMENTATION`) [11, 22, 23]

No construtor, a primeira instrução **obrigatória** é invocar o construtor da superclasse passando o encadeamento anterior (`previous`) [11]. Posteriormente, associamos os parâmetros locais aos atributos de instância via autorreferência `me->` [11, 22] e definimos a chave de mensagem (`t100key`) [11, 23]:

```abap
CLASS zcx_carrier_failed IMPLEMENTATION.
  METHOD constructor.
    " 1. Invocar construtor da superclasse
    super->constructor( previous = previous ).

    " 2. Atribuir atributos locais se informados
    IF carrier_id IS NOT INITIAL.
      me->carrier_id = carrier_id.
    ENDIF.

    " 3. Inicializar e preencher a chave de mensagem correspondente
    CLEAR me->textid.
    IF textid IS INITIAL.
      if_t100_message~t100key = if_t100_message=>default_textid.
    ELSE.
      if_t100_message~t100key = textid.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
```

### 3. Disparando a Exceção com `RAISE EXCEPTION` [11, 24, 25]

Ao identificar a falha (como no retorno `sy-subrc <> 0` de um select ou em uma falha de autorização), dispare a exceção instanciando-a com os parâmetros de mapeamento desejados [11, 24, 25]:

```abap
METHOD get_carrier_details.
  SELECT SINGLE FROM /dmo/carrier
    FIELDS carrier_id, name
    WHERE carrier_id = @i_carrier_id
    INTO @DATA(ls_carrier).

  IF sy-subrc <> 0.
    " Disparo da exceção de valor inválido preenchendo o placeholder e informando o ID
    RAISE EXCEPTION TYPE zcx_carrier_failed
      EXPORTING
        textid     = zcx_carrier_failed=>carrier_not_exist
        carrier_id = i_carrier_id.
  ENDIF.
ENDMETHOD.
```

---

## Módulo 6: Boas Práticas, Conversão e Testabilidade

### 1. Conversão de Tipos ao Alimentar Parâmetros do Construtor [89, 90]

Ao reutilizar classes de exceção predefinidas (como `cx_abap_invalid_value`), o parâmetro genérico esperado pode ser de tipo diferente da variável local do aplicativo [89, 90]. Nesses casos, utilize o operador de conversão explícita **`CONV #( )`** para ajustar dinamicamente o tipo no momento do disparo [89, 90]:

```abap
RAISE EXCEPTION TYPE cx_abap_invalid_value
  EXPORTING
    value = CONV #( i_carrier_id ).
```

### 2. Uso do ATC e Quick Fixes no Eclipse ADT [23, 26, 77]

O Eclipse ADT oferece recursos inteligentes para otimizar o fluxo de trabalho com exceções:

- **Quick Fix `Ctrl + 1` (Add raising declaration):** Ao digitar uma instrução `RAISE EXCEPTION` que propaga uma exceção não listada na assinatura do método, clique sobre o ícone de aviso e use o Quick Fix para inserir automaticamente a exceção na cláusula `RAISING` [26, 77].
- **Quick Fix (Re-generate constructor):** Ao modificar ou adicionar atributos públicos à classe de exceção, utilize o Quick Fix sobre o nome do método `constructor` para atualizar e estruturar os parâmetros de entrada automaticamente [77].

### 3. Testabilidade com ABAP Unit [86, 88]

Em classes de teste unitário (dentro do método fixture `class_setup` ou em métodos de teste), proteja as rotinas de instanciação capturando as exceções em um bloco genérico `CATCH cx_root` para extrair mensagens ricas de depuração [86, 87]. Utilize os métodos do framework utilitário para emitir falhas descritivas ao testador caso uma exceção não planejada seja gerada [86, 88]:

```abap
TRY.
    mo_carrier = lcl_carrier=>get_instance( i_carrier_id = 'XX' ).
  CATCH cx_root INTO DATA(lo_error).
    cl_abap_unit_assert=>fail( lo_error->get_text( ) ).
ENDTRY.
```
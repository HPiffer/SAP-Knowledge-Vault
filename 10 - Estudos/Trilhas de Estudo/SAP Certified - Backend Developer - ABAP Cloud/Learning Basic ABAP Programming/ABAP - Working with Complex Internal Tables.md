---
id: sap-abap-working-with-complex-internal-tables
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud]
modulos: []
produtos: [BTP]
release: agnostico
nivel: intermediario
autor: Hayron Piffer
criado: 2026-08-29
atualizado: 2026-08-29
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---
# ABAP - Working with Complex Internal Tables
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Conceitos e Declarações] ➔ [Módulo 2: Preenchimento e População]

                                                      │

[Módulo 4: Integração com ABAP SQL] ◄─ [Módulo 3: Leitura e Modificação]

```

---

## Módulo 1: Conceito e Declaração de Tabelas Internas Complexas

### 1.1 Tabelas Simples vs. Tabelas Complexas

- **Tabela Simples (*Simple Internal Table*)**: Possui tipo de linha escalar (ex: `TABLE OF i`). Contém apenas uma única coluna sem nome.

- **Tabela Complexa (*Complex Internal Table*)**: Possui tipo de linha estruturado (*structured row type*). É composta por múltiplas colunas nomeadas e tipadas conforme os componentes da estrutura.

- **Tabelas Aninhadas (*Nested Internal Tables*)**: Ocorrem quando uma ou mais colunas de uma tabela interna possuem tipo estruturado ou tipo de tabela.

### 1.2 Formas de Acesso (Access Types) e Chaves

O ABAP oferece duas formas fundamentais de acessar registros:

1. **Acesso por Índice (*Index Access*)**: Acessa a linha pela sua posição numérica. É extremamente rápido em qualquer tipo de tabela.

2. **Acesso por Chave (*Key Access*)**: Busca registros com base nos valores contidos nas colunas. O desempenho depende diretamente do tipo de acesso da tabela:

| Tipo de Tabela (*Access Type*) | Ordenação dos Dados | Regra de Chave / Duplicatas | Desempenho de Busca por Chave |

| :--- | :--- | :--- | :--- |

| **Standard Table** | Sem ordenação específica (novas linhas são anexadas ao final) | Duplicatas são sempre permitidas | Busca sequencial (pode ser lenta em tabelas grandes) |

| **Sorted Table** | Mantida sempre ordenada pelas chaves em ordem crescente | Chave pode ser única (`UNIQUE`) ou não única (`NON-UNIQUE`) | Busca binária rápida |

| **Hashed Table** | Gerenciada por algoritmo de *hash* em memória | Chave deve ser obrigatoriamente única (`UNIQUE`) | Acesso $O(1)$ ultra-rápido para grandes volumes |

> **Chaves Secundárias (*Secondary Keys*)**: Permitem otimizar buscas por diferentes combinações de colunas sem alterar a chave primária da tabela.

### 1.3 Sintaxes de Declaração de Tabelas Complexas

É considerado boa prática de programação definir primeiro o tipo de dados local (`TYPES`) e depois declarar a variável (`DATA`).

```abap

TYPES: BEGIN OF st_connection,

         carrier_id      TYPE /dmo/carrier_id,

         connection_id   TYPE /dmo/connection_id,

         airport_from_id TYPE /dmo/airport_from_id,

         airport_to_id   TYPE /dmo/airport_to_id,

         carrier_name    TYPE /dmo/carrier_name,

       END OF st_connection.

  

" 1. Standard Table (Forma abreviada)

DATA connections_1 TYPE TABLE OF st_connection.

  

" 2. Standard Table (Forma explícita)

DATA connections_2 TYPE STANDARD TABLE OF st_connection

                        WITH NON-UNIQUE DEFAULT KEY.

  

" 3. Sorted Table (Com chave explícita não única)

DATA connections_3 TYPE SORTED TABLE OF st_connection

                        WITH NON-UNIQUE KEY airport_from_id airport_to_id.

  

" 4. Hashed Table (Com chave explícita única)

DATA connections_4 TYPE HASHED TABLE OF st_connection

                        WITH UNIQUE KEY carrier_id connection_id.

  

" 5. Tipo de Tabela Local (TYPES tt_...)

TYPES tt_connections TYPE SORTED TABLE OF st_connection

                          WITH UNIQUE KEY carrier_id connection_id.

DATA connections_5 TYPE tt_connections.

  

" 6. Tipo de Tabela Global (do ABAP Dictionary)

DATA flights TYPE /dmo/t_flight.

```

---

## Módulo 2: Preenchimento e População de Tabelas Internas Complexas

### 2.1 Uso de Work Area e `LIKE LINE OF`

Para transferir dados para uma tabela interna complexa via `APPEND`, utiliza-se um objeto de dados estruturado chamado *Work Area*.

Declaração recomendada da Work Area:

```abap

" Declaração com referência direta ao tipo da linha

DATA connection1 TYPE st_connection.

  

" Declaração com LIKE LINE OF (Recomendado)

DATA connection2 LIKE LINE OF connections.

```

> **Vantagens do `LIKE LINE OF`**:

> - Evidencia no código que a variável é uma Work Area dedicada àquela tabela interna.

> - Garante compatibilidade automática de tipos mesmo se a definição da tabela interna for alterada posteriormente.

### 2.2 Inserção com `APPEND` e Expressão `VALUE #( )`

Existem diversas maneiras de adicionar novas linhas a uma tabela complexa:

```abap

" 1. APPEND tradicional com Work Area preenchida campo a campo

connection-carrier_id     = 'NN'.

connection-connection_id  = '1234'.

APPEND connection TO connections.

  

" 2. APPEND com Work Area preenchida via VALUE #( )

connection = VALUE #( carrier_id    = 'NN'

                      connection_id = '1234'

                      carrier_name  = 'My Airline' ).

APPEND connection TO connections.

  

" 3. APPEND INITIAL LINE (sem Work Area, adiciona linha com valores iniciais)

APPEND INITIAL LINE TO connections.

  

" 4. APPEND direto com VALUE #( ) (Sem necessidade de declarar Work Area)

APPEND VALUE #( carrier_id    = 'NN'

                connection_id = '1234'

                carrier_name  = 'My Airline' ) TO connections.

```

*Dica de Desempenho*: O uso do `VALUE #( )` diretamente no `APPEND` evita a declaração de variáveis temporárias em memória, reduzindo o consumo de recursos.

### 2.3 População em Lote e Operador `CORRESPONDING #( )`

#### População direta de múltiplas linhas com `VALUE #( )`:

```abap

carriers = VALUE #( ( carrier_id = 'AA' carrier_name = 'American Airlines' )

                    ( carrier_id = 'JL' carrier_name = 'Japan Airlines'    )

                    ( carrier_id = 'SQ' carrier_name = 'Singapore Airlines') ).

```

> **Nota Importante**: A atribuição com `VALUE #( )` limpa e substitui todas as linhas existentes na tabela de destino. Campos não mencionados na atribuição assumem seus valores iniciais.

#### Cópia de dados entre tabelas com `CORRESPONDING #( )`:

```abap

" Copia campos com nomes idênticos da tabela de origem para a tabela de destino

connections = CORRESPONDING #( carriers ).

```

- **Regras do `CORRESPONDING` em Tabelas**:

  - Para cada linha na tabela de origem, cria uma nova linha na tabela de destino.

  - Copia o valor dos campos cujos nomes coincidem exatamente.

  - Campos da origem sem correspondente no destino são ignorados.

  - Campos do destino sem correspondente na origem são preenchidos com valor inicial.

  - Substitui (apaga) todos os dados pré-existentes na tabela de destino.

---

## Módulo 3: Leitura e Modificação de Dados em Tabelas Complexas

### 3.1 Expressões de Tabela (*Table Expressions*)

Permitem ler um registro único de uma tabela interna complexa de forma concisa.

```abap

" Acesso por Índice (Posição 1)

connection = connections[ 1 ].

  

" Acesso por Chave Primária

connection = connections[ carrier_id    = 'SQ'

                          connection_id = '0001' ].

  

" Acesso por Chave Secundária / Campos Não-Chave

connection = connections[ airport_from_id = 'SFO'

                          airport_to_id   = 'SIN' ].

  

" Encadeamento para leitura direta de componente (Sem Work Area intermediária)

DATA(airline_name) = connections[ airport_from_id = 'SFO' ]-carrier_name.

```

> **Tratamento de Exceções**: Se nenhuma linha atender aos critérios de busca, a *runtime engine* dispara a exceção `CX_SY_ITAB_LINE_NOT_FOUND`. Deve-se capturá-la com `TRY ... CATCH`:

```abap

TRY.

    connection = connections[ carrier_id = 'XX' ].

  CATCH cx_sy_itab_line_not_found.

    " Tratamento para registro não encontrado

ENDTRY.

```

### 3.2 Iteração com `LOOP AT ... WHERE`

Para processar múltiplos registros que atendem a um critério de filtragem:

```abap

LOOP AT connections INTO connection

                   WHERE airport_from_id <> 'MIA'

                     AND ( carrier_id = 'AA' OR carrier_id = 'UA' ).

  

  " sy-tabix contém o índice da linha atual dentro da tabela interna

  out->write( |Linha { sy-tabix }: { connection-carrier_name }| ).

  

ENDLOOP.

```

### 3.3 Modificação de Registros (`MODIFY`)

#### 1. `MODIFY TABLE` (Acesso por Chave):

Utiliza os valores dos campos de chave primária contidos na Work Area para identificar a linha e atualizar os demais campos.

```abap

carrier = carriers[ carrier_id = 'JL' ].

carrier-currency_code = 'JPY'.

  

" Atualiza a linha identificada pela chave carrier_id = 'JL'

MODIFY TABLE carriers FROM carrier.

```

> **Restrição**: O comando `MODIFY TABLE` permite modificar apenas campos que **não pertencem à chave primária**.

#### 2. `MODIFY ... INDEX` (Acesso por Índice):

Sobrescreve a linha inteira na posição especificada, permitindo inclusive alterar campos de chave.

```abap

carrier-carrier_id    = 'LH'.

carrier-currency_code = 'EUR'.

  

" Sobrescreve a linha da posição 1

MODIFY carriers FROM carrier INDEX 1.

```

#### 3. `MODIFY` dentro de `LOOP AT ... ENDLOOP` (Forma Implicita):

Atualiza a linha atual do loop sem necessidade de informar o índice explicitamente.

```abap

LOOP AT carriers INTO carrier WHERE currency_code IS INITIAL.

  carrier-currency_code = 'USD'.

  " Atualiza a linha em processamento no loop

  MODIFY carriers FROM carrier.

ENDLOOP.

```

> **Aviso de Segurança**: Usar a sintaxe `MODIFY carriers FROM carrier` (sem `INDEX`) **fora** de um bloco `LOOP ... ENDLOOP` gera um erro de execução fatal (*short dump*) não capturável.

---

## Módulo 4: Tabelas Internas Complexas no ABAP SQL

### 4.1 Seleção de Múltiplos Registros (`SELECT ... INTO TABLE`)

Para carregar múltiplos registros do banco de dados (tabelas relacionais ou CDS Views) para uma tabela interna complexa, utiliza-se a adição `TABLE`:

```abap

DATA airports_full TYPE STANDARD TABLE OF /dmo/i_airport

                        WITH NON-UNIQUE KEY airportid.

  

" Leitura com campos explícitos e correspondência direta por posição

SELECT FROM /dmo/i_airport

  FIELDS airportid, name, city, countrycode

  WHERE city = 'London'

  INTO TABLE @airports_full.

  

" Leitura com FIELDS * e correspondência por nome de campo

SELECT FROM /dmo/i_airport

  FIELDS *

  WHERE city = 'London'

  INTO CORRESPONDING FIELDS OF TABLE @airports.

```

### 4.2 Declarações Inline (`@DATA(...)`) em ABAP SQL

É possível declarar a tabela interna de destino diretamente na cláusula `INTO TABLE`:

```abap

SELECT FROM /dmo/i_airport

  FIELDS airportid, name AS airportname

  WHERE city = 'London'

  INTO TABLE @DATA(airports_inline).

```

- **Regras para Declarações Inline**:

  - Apenas suportado após `INTO TABLE` (não é permitido em `INTO CORRESPONDING FIELDS OF TABLE`).

  - O tipo de linha é inferido a partir dos campos declarados em `FIELDS`.

  - Expressões ou cálculos no `FIELDS` exigem o uso obrigatório de um *alias* (`AS`).

  - A tabela gerada é sempre do tipo **Standard Table sem chave definida**. Atentar para o impacto de performance se forem feitas buscas por chave nessa tabela posteriormente.

### 4.3 Operador de Conjunto `UNION ALL` no Banco de Dados

O operador `UNION ALL` permite combinar os resultados de múltiplas instruções `SELECT` diretamente no banco de dados SAP HANA e armazenar o resultado consolidado em uma única tabela interna:

```abap

SELECT FROM /dmo/i_carrier

  FIELDS 'Airline' AS type, airlineid AS id, name

  WHERE currencycode = 'GBP'

  

UNION ALL

  

SELECT FROM /dmo/i_airport

  FIELDS 'Airport' AS type, airportid AS id, name

  WHERE city = 'London'

  

INTO TABLE @DATA(names).

```

- **Requisitos de Compatibilidade**:

  - Ambas as consultas devem possuir a mesma quantidade de colunas e nomes/aliases de campos idênticos na mesma ordem.

  - Utiliza-se `UNION ALL` para evitar a remoção desnecessária de duplicatas no banco de dados, maximizando o desempenho da consulta.

---

## Módulo 5: Aplicação Prática Integrada (Padrão de Buffering)

Em aplicações orientadas a objetos, é comum carregar tabelas internas complexas no construtor estático (`class_constructor`) para atuarem como *buffers* de dados na memória local da aplicação:

```abap

CLASS lcl_connection DEFINITION.

  PUBLIC SECTION.

    CLASS-METHODS class_constructor.

    METHODS get_output RETURNING VALUE(r_output) TYPE string_table.

  

  PRIVATE SECTION.

    TYPES: BEGIN OF st_airport,

             airportid TYPE /dmo/airport_id,

             name      TYPE /dmo/airport_name,

           END OF st_airport.

    TYPES tt_airports TYPE STANDARD TABLE OF st_airport WITH NON-UNIQUE DEFAULT KEY.

  

    CLASS-DATA airports TYPE tt_airports.

ENDCLASS.

  

CLASS lcl_connection IMPLEMENTATION.

  METHOD class_constructor.

    " Carrega todos os aeroportos uma única vez para a memória local

    SELECT FROM /dmo/i_airport

      FIELDS airportid, name

      INTO TABLE @airports.

  ENDMETHOD.

  

  METHOD get_output.

    " Acesso direto ao buffer via expressões de tabela dentro de String Templates

    APPEND |Departure:   { details-departureairport } { airports[ airportid = details-departureairport ]-name }| TO r_output.

    APPEND |Destination: { details-destinationairport } { airports[ airportid = details-destinationairport ]-name }| TO r_output.

  ENDMETHOD.

ENDCLASS.

```

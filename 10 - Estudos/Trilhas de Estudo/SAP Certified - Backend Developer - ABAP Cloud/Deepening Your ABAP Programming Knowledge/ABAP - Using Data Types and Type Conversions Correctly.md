---
id: sap-abap-using-data-types-and-type-conversions-correctly
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

# ABAP - Using Data Types and Type Conversions Correctly

Este guia de estudos compila as melhores práticas, conceitos fundamentais e regras técnicas sobre a classificação de tipos de dados, conversões seguras e cálculos temporais em **ABAP Cloud**, com base nos materiais selecionados [3, 9, 26, 51].

---

## Fluxo de Aprendizagem Recomendado

---

## Módulo 1: Classificação de Tipos de Dados Técnicos em ABAP

Em ABAP Cloud, todo objeto de dados possui um tipo técnico que define o seu comportamento em memória, tamanho físico e as operações permitidas no compilador [10, 60].

### 1.1 Tipos Completos vs. Incompletos

Os tipos de dados pré-definidos (_predefined types_) no ABAP são classificados em duas grandes categorias estruturais de acordo com a mutabilidade do seu comprimento [60]:

|Tipo de Dado|Categoria|Comprimento|Descrição Técnica [60, 61, 62, 63]|
|---|---|---|---|
|**`STRING`**|Completo|Dinâmico|Sequência de caracteres de comprimento variável na memória.|
|**`I`**|Completo|4 bytes|Inteiro básico de 4 bytes para contadores e cálculos aritméticos gerais.|
|**`INT8`**|Completo|8 bytes|Inteiro longo de 8 bytes para faixas de valores maiores que o tipo `I`.|
|**`D`**|Completo|8 bytes|Data no formato físico imutável `YYYYMMDD`.|
|**`T`**|Completo|6 bytes|Hora no formato físico imutável `HHMMSS` (precisão de 1 segundo).|
|**`UTCLONG`**|Completo|27 bytes|Timestamp no formato ISO-8601 (`YYYY-MM-DD HH:MM:SS.sssssss`), preciso até 100 nanossegundos.|
|**`DECFLOAT16`**|Completo|8 bytes|Ponto flutuante decimal de alta precisão com até 16 dígitos significativos.|
|**`DECFLOAT34`**|Completo|16 bytes|Ponto flutuante decimal de altíssima precisão com até 34 dígitos significativos.|
|**`F`**|Completo|8 bytes|Ponto flutuante binário (evitar para cálculos aritméticos internos devido a erros de arredondamento).|
|**`XSTRING`**|Completo|Dinâmico|Sequência de bytes de comprimento variável (dados binários).|
|**`C`**|Incompleto|Customizado|Texto de comprimento fixo (requer especificação de `LENGTH` na declaração).|
|**`N`**|Incompleto|Customizado|Texto numérico preenchido com zeros à esquerda (`LENGTH` obrigatório).|
|**`P`**|Incompleto|Customizado|Número decimal empacotado (`LENGTH` e `DECIMALS` obrigatórios; máx. 14 decimais).|
|**`X`**|Incompleto|Customizado|Sequência de bytes de tamanho fixo (`LENGTH` obrigatório).|

### 1.2 Classificação Semântica por Categoria

Os tipos embutidos do ABAP também são agrupados por afinidade semântica de processamento [62]:

1. **Character-like**: `C`, `N`, `STRING` [62].
2. **Numeric**: `I`, `INT8`, `P`, `F`, `DECFLOAT16`, `DECFLOAT34` [62].
3. **Byte-like**: `X`, `XSTRING` [61, 62].
4. **Date and Time**: `D`, `T`, `UTCLONG` [63].

> ⚠️ **Regra de Ouro**: Certas operações sintáticas são permitidas estritamente para campos de caracteres, e outras exclusivamente para numéricos [62]. **Nunca misture campos de caracteres e campos de bytes em uma única operação** [62].

### 1.3 Melhores Práticas para Escolha de Tipos Numéricos e Temporais

- **Inteiros**: Use **`I`** como padrão para inteiros normais e **`INT8`** se a faixa numérica de 4 bytes for insuficiente [62].
- **Decimais e Precisão**: Use o tipo empacotado **`P`** para cálculos financeiros comuns [62]. Se a precisão decimal (limite de 14 casas decimais) ou a faixa física for insuficiente, utilize os tipos modernos **`DECFLOAT`** (preferencialmente `DECFLOAT34`) [62].
- **Ponto Flutuante Binário (`F`)**: Evite o uso do tipo `F` para regras de negócio e lógica interna dos seus programas [63]. A conversão de números decimais em binário e vice-versa gera **erros de arredondamento físico** inevitáveis [63]. Ele deve ser reservado para manipulações físicas ou quando retornado diretamente do banco de dados via queries SQL [63].
- **Medições de Tempo**: Use `D` e `T` para granularidade diária e de segundos [63]. Caso seu processo exija precisão extrema de frações de segundos, utilize o tipo moderno **`UTCLONG`** (100 nanossegundos de precisão) [63].

---

## Módulo 2: Conversão de Tipos e Suas Armadilhas

ABAP é altamente flexível e permite atribuições diretas de valores entre variáveis de tipos de dados incompatíveis [10]. Nestes cenários, o sistema realiza uma **conversão implícita em runtime** [10]. Compreender as regras e limites dessas conversões é indispensável para evitar falhas graves de execução.

### 2.1 Atribuições de Sucesso vs. Falhas de Runtime

- **Sucesso**: Ocorre quando o valor textual ou de origem é fisicamente compatível com o tipo de destino [10].
    
    ```abap
    DATA var_string TYPE string.
    DATA var_int    TYPE i.
    DATA var_date   TYPE d.
    
    var_string = `12345`.
    var_int    = var_string. " Sucesso! '12345' é um inteiro válido [10, 11].
    
    var_string = `20230101`.
    var_date   = var_string. " Sucesso! String no formato YYYYMMDD correto [10, 11].
    ```
    
- **Exceções Comuns (Runtime Dumps)**: Se o valor de origem for incompatível com as restrições físicas do destino, o sistema abortará a execução imediata se as exceções não forem tratadas de forma proativa [12]:
    - **`CX_SY_CONVERSION_NO_NUMBER`**: Disparada ao tentar converter um texto com caracteres não numéricos para um tipo numérico [12].
        
        ```abap
        var_string = `ABCDE`.
        var_int    = var_string. " Exception CX_SY_CONVERSION_NO_NUMBER! [12]
        ```
        
    - **`CX_SY_CONVERSION_OVERFLOW`**: Disparada quando o valor excede a capacidade máxima de armazenamento físico do campo de destino [12].
        
        ```abap
        " Um tipo P com LENGTH 3 e DECIMALS 2 suporta no máximo o valor 999.99 (5 dígitos no total, sendo 2 decimais) [12].
        DATA var_pack TYPE p LENGTH 3 DECIMALS 2.
        var_pack = 1000. " Exception CX_SY_CONVERSION_OVERFLOW! [12]
        ```
        

### 2.2 Perda de Dados Silenciosa: Truncamento e Arredondamento

Muitas conversões implícitas não geram dumps de runtime, mas causam perda silenciosa de integridade de dados por truncamento físico ou arredondamento matemático [13]:

- **Truncamento**: Ao atribuir um campo de caracteres mais longo a um destino menor, os caracteres excedentes no final são descartados [13].
    
    ```abap
    DATA long_char  TYPE c LENGTH 10 VALUE 'ABCDEFGHIJ'.
    DATA short_char TYPE c LENGTH 5.
    
    short_char = long_char. " short_char recebe 'ABCDE'. 'FGHIJ' é perdido silenciosamente! [13, 14]
    ```
    
- **Arredondamento Aritmético**: Ao atribuir valores numéricos a campos com casas decimais insuficientes, o ABAP realiza um arredondamento aritmético implícito [13].
    
    ```abap
    DATA result TYPE p LENGTH 3 DECIMALS 2.
    
    result = 1 / 8. " 1/8 = 0.125. É arredondado aritméticamente para 0.13! [13, 14]
    ```
    

### 2.3 Resultados Inesperados de Atribuições Técnicas

Certas atribuições técnicas em ABAP seguem regras históricas e comportamentos que podem surpreender desenvolvedores iniciantes [15]:

1. **Data (`D`) para Inteiro (`I`)**: O resultado armazenado no inteiro é o **número absoluto de dias decorridos desde a data limite de `01.01.0001`** [15].
2. **Hora (`T`) para Inteiro (`I`)**: O resultado é o **número de segundos decorridos desde a meia-noite** (00:00:00) [15].
3. **Texto/String para Tipo `N` (Numeric Text)**: O compilador analisa a string, **descarta todos os caracteres que não sejam dígitos**, alinha os dígitos restantes de forma justificada à direita do campo e preenche os espaços vazios à esquerda com zeros (`0`) [15].
    
    ```abap
    DATA var_string TYPE string VALUE `R2D2`.
    DATA var_n      TYPE n LENGTH 4.
    
    var_n = var_string. " Recebe '0022'. Letras 'R' e 'D' são descartadas! [17]
    ```
    

### 2.4 A Armadilha de Declarações Inline (`DATA(...)`) em Expressões

Ao utilizar declarações inline (`DATA(...)`) em expressões matemáticas aritméticas, o compilador ABAP infere o tipo da nova variável diretamente do **operando do lado direito** [16].

```abap
" Como os literais numéricos 5 e 10 são interpretados como inteiros (tipo I),
" as variáveis resultantes são criadas implicitamente como tipo I [16].
DATA(result1) = 5 * 10. " result1 é do tipo I e armazena 50 correto.
DATA(result2) = 5 / 10. " result2 é do tipo I e armazena o valor arredondado 1! (Precisão perdida) [16].
```

**Como Resolver (Conversão de Tipo Forçada)**: Utilize o operador construtor **`CONV`** para instruir explicitamente o compilador sobre o tipo que deve ser adotado na declaração inline ou passagem de parâmetros [18]:

```abap
" Força result2 a ser instanciada como tipo de data ou decimal preciso:
DATA(result2_forced) = CONV decfloat34( 5 / 10 ). " Mantém a precisão decimal de forma explícita.

" Utilizado também para formatar literais ou passar tipos estritos a métodos:
DATA(formatted_date) = CONV d( '20230101' ). " Exibido com formatação correta de data no console [18].
```

### 2.5 Prevenção Rigorosa com o Construtor `EXACT`

Para aplicações de missão crítica que não podem tolerar perdas silenciosas por truncamento, arredondamento aritmético ou datas inválidas, utilize o operador construtor **`EXACT #( ... )`** [19]. Ele realiza uma **atribuição sem perdas (_lossless assignment_)**, validando o dado em runtime e disparando a exceção tratável **`CX_SY_CONVERSION_ERROR`** se houver qualquer desvio [19]:

```abap
" 1. Evitando arredondamento aritmético silencioso:
TRY.
    var_pack = EXACT #( 1 / 8 ). " Dispara cx_sy_conversion_error porque precisaria arredondar para 0.13! [19]
  CATCH cx_sy_conversion_error.
    out->write( 'Erro: O cálculo exige arredondamento e foi cancelado por segurança.' ) [19].
ENDTRY.

" 2. Evitando truncamento de caracteres:
TRY.
    var_char = EXACT #( 'ABCDE' ). " Dispara cx_sy_conversion_error porque o destino de tamanho 3 perderia 'DE'! [19]
  CATCH cx_sy_conversion_error.
    out->write( 'Erro: String seria truncada de forma silenciosa.' ) [19].
ENDTRY.

" 3. Evitando datas com formato inválido ou inexistentes no calendário (ex: 32 de Dezembro):
TRY.
    var_date = EXACT #( 'ABCDEFGH' ). " Dispara exceção (Texto não é data) [19].
    var_date = EXACT #( '20221232' ). " Dispara exceção (Data inválida no calendário) [19].
  CATCH cx_sy_conversion_error.
    out->write( 'Erro: A data informada é tecnicamente inválida no calendário.' ) [19].
ENDTRY.
```

---

## Módulo 3: Cálculos Avançados com Datas, Horas e Timestamps

O desenvolvimento de lógica empresarial complexa exige cálculos precisos de intervalos de tempo, fusos horários internacionais e manipulação direta de campos temporais [34].

### 3.1 Captura de Contexto e Aritmética Temporal Básica

O ABAP fornece a classe utilitária **`CL_ABAP_CONTEXT_INFO`** para obter informações seguras do servidor de aplicação de forma limpa e em conformidade com o Clean Core [35, 47]:

```abap
" Captura a data corrente do sistema do usuário
DATA(today) = cl_abap_context_info=>get_system_date( ) [47].
```

**Cálculos Diretos**:

- **Datas (`D`)**: Ao subtrair duas datas (`data2 - data1`), o ABAP converte ambas internamente em inteiros (representando a quantidade de dias desde 01.01.0001) e retorna a diferença líquida em **número de dias** [36].
- **Horas (`T`)**: Ao efetuar aritmética sobre campos do tipo `T`, o sistema opera convertendo os valores em **segundos decorridos desde a meia-noite** [36].

### 3.2 Desestruturação Manual via Offset e Comprimento

Como o tipo de dados `D` armazena a data no formato interno contínuo `YYYYMMDD`, você pode desestruturar e isolar partes da data de maneira limpa usando a sintaxe clássica de **offset e comprimento** (`var_date+offset(length)`) [37]:

- **Ano (YYYY)**: `var_date(4)` -> Ignora offset, captura os primeiros 4 caracteres [37].
- **Mês (MM)**: `var_date+4(2)` -> Pula os primeiros 4 caracteres, captura os próximos 2 [37].
- **Dia (DD)**: `var_date+6(2)` -> Pula os primeiros 6 caracteres, captura os próximos 2 [37].

### 3.3 Timestamps Globais Modernos com `UTCLONG`

Para operações globais de alta resolução, o ABAP Cloud introduziu o tipo nativo **`UTCLONG`**, que herda os padrões do ISO-8601 com resolução temporal extrema (100 nanossegundos) [37, 63]. Seu processamento utiliza as seguintes funções nativas [38]:

- **Captura Atual**: `utclong_current()` -> Retorna o timestamp UTC exato corrente [38].
- **Aritmética de Timestamps**: `utclong_add( val = ts days = 7 )` -> Adiciona/subtrai intervalos temporais complexos (dias, horas, segundos) ao timestamp [38].
- **Diferença Temporal**: `utclong_diff( high = ts2 low = ts1 )` -> Calcula a diferença exata entre dois timestamps UTC retornando o valor em **segundos** (tipo de retorno `decfloat34`) [38, 49].

```abap
DATA timestamp1 TYPE utclong.
DATA timestamp2 TYPE utclong.
DATA difference TYPE decfloat34.

timestamp1 = utclong_current( ) [38].
timestamp2 = utclong_add( val = timestamp1 days = 7 ) [38].

" Retorna a diferença líquida em segundos
difference = utclong_diff( high = timestamp2 low = timestamp1 ) [38].
```

### 3.4 Conversões Complexas de Fuso Horário e Aplicação Prática (Flight Durations)

No comércio internacional ou na aviação, calcular durações de transações cruzando múltiplos fusos horários exige converter horas locais em timestamps universais e vice-versa [39].

O comando **`CONVERT DATE ... TIME ... TIME ZONE ... INTO UTCLONG ...`** é a ferramenta padrão para normalizar dados locais para UTC [47, 48].

#### Cenário de Negócio: Cálculo de Duração de Voos Internacionais [39]

Para calcular o tempo de duração líquida de voos cujos aeroportos de partida e de destino estão localizados em fusos horários internacionais diferentes [39]:

```abap
CLASS lcl_passenger_flight DEFINITION.
  PUBLIC SECTION.
    TYPES:
      BEGIN OF st_connection_details,
        airport_from_id TYPE /dmo/airport_from_id,
        airport_to_id   TYPE /dmo/airport_to_id,
        departure_time  TYPE /dmo/flight_departure_time,
        arrival_time    TYPE /dmo/flight_arrival_time,
        duration        TYPE i, " Adicionado para guardar a duração calculada [41, 42]
      END OF st_connection_details.
ENDCLASS.

CLASS lcl_flight_calculator IMPLEMENTATION.

  METHOD class_constructor.
    " 1. Carrega dados de fusos horários dos aeroportos a partir da tabela do banco de dados [45]
    SELECT FROM /lrn/airport
      FIELDS airport_id, timzone
      INTO TABLE @DATA(airports) [45].

    " 2. Carrega as conexões de voos existentes no buffer [45]
    SELECT FROM /lrn/connection
      FIELDS carrier_id, connection_id, airport_from_id, airport_to_id, departure_time, arrival_time
      INTO TABLE @connections_buffer [45].

    DATA(today) = cl_abap_context_info=>get_system_date( ) [47, 48].

    " 3. Processa cada conexão para calcular a duração líquida compensando fuso horário [46, 48]
    LOOP AT connections_buffer INTO DATA(connection) [48].

      " Converte data e hora locais de partida com fuso do aeroporto de origem para timestamp UTC [48]
      CONVERT DATE today
        TIME connection-departure_time
        TIME ZONE airports[ airport_id = connection-airport_from_id ]-timzone
        INTO UTCLONG DATA(departure_utclong) [48].

      " Converte data e hora locais de chegada com fuso do aeroporto de destino para timestamp UTC [48]
      CONVERT DATE today
        TIME connection-arrival_time
        TIME ZONE airports[ airport_id = connection-airport_to_id ]-timzone
        INTO UTCLONG DATA(arrival_utclong) [48].

      " Calcula a diferença em segundos via utclong_diff e converte para minutos (/ 60) [49]
      connection-duration = utclong_diff(
                              high = arrival_utclong
                              low  = departure_utclong
                            ) / 60 [49].

      " Atualiza a tabela interna de conexões com a duração calculada [50]
      MODIFY connections_buffer FROM connection TRANSPORTING duration [50].

    ENDLOOP.
  ENDMETHOD.
  
ENDCLASS.
```
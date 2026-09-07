---
id: sap-abap-using-code-pushdown-in-abap-sql
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud, ABAP SQL, CDS]
modulos: []
produtos: [BTP]
release: agnostico
nivel: avancado
autor: Hayron Piffer
criado: 2026-09-07
atualizado: 2026-09-07
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---

# ABAP - Using Code Pushdown in ABAP SQL

Este guia de estudos compila e organiza de forma exaustiva os conceitos fundamentais, as regras sintáticas e as melhores práticas contidas nos **5 materiais selecionados** sobre **Code Pushdown no ABAP SQL**. Ele é estruturado em uma trilha sequencial progressiva para garantir um entendimento claro do básico ao avançado no desenvolvimento backend moderno em **ABAP Cloud**.

---

## Módulo 1: Expressões e Condicionais no Banco de Dados

_Garantindo flexibilidade e tratamento preliminar de tipos diretamente na camada de persistência._

### 1.1 Literais e Constantes

- **Literais de Texto**: Delimitados por aspas simples (`'Hello'`), são interpretados tecnicamente como o tipo clássico `C` do ABAP [172].
- **Literais Numéricos**: Representados por números inteiros positivos ou negativos (ex: `1`, `-1`), mapeados como o tipo `I` [172].
- **Restrição Crucial**: Literais de strings delimitados por crases (`` `texto` ``) **não são permitidos** no ABAP SQL [173].
- **Constantes de Host**: Para utilizar constantes definidas no programa ABAP dentro de instruções ABAP SQL, é obrigatório utilizar o caractere de escape `@` na frente do nome da constante (ex: `@c_number`) para indicar ao compilador que se trata de uma variável local externa à base de dados [173].

### 1.2 Expressão `CAST`

- **Finalidade**: Como o ABAP SQL não realiza conversões de tipo implícitas, a expressão `CAST` é usada para forçar conversões explícitas e compatíveis diretamente no banco de dados [175].
- **Sintaxe**: `CAST( sql_expression AS target_type )` [175].
- **Tipos de Destino Suportados**: É possível converter valores para a maioria dos tipos de dicionário predefinidos (ex: `CHAR`, `NUMC`, `INT4`, `DEC(len, dec)`, `FLTP`, `DATS`, `UNIT`, `CUKY`, `QUAN`, `CURR`) [176, 177, 179].
- **Limitações e Regras**:
    - **Não** é permitido usar Elementos de Dados (_Data Elements_) do DDIC como tipos de destino na expressão `CAST` de ABAP SQL; deve-se usar os tipos de dicionário predefinidos [176].
    - A conversão de texto contendo caracteres não numéricos para tipos numéricos disparará uma exceção de runtime [178].
    - A conversão de literais para o tipo `DATS` apenas realiza o mapeamento físico, sem validar se os dígitos realmente representam uma data válida no calendário [178].
    - Conversões que resultem em perda de precisão (ex: string maior para `CHAR(4)`) são permitidas tecnicamente pelo compilador, mas resultam em perda silenciosa de caracteres [178].

### 1.3 Estruturas de Seleção Condicional (`CASE`)

Retorna exatamente um valor em runtime com base no resultado de testes lógicos [180].

- **Simple Case (Seleção Simples)**: Compara o valor de um operando com uma lista de valores possíveis. Equivalente à estrutura condicional `CASE ... ENDCASE` do ABAP [181].
    
    ```abap
    CASE title
      WHEN 'Mr.'  THEN 'Mister'
      WHEN 'Mrs.' THEN 'Misses'
      ELSE             ' '
    END AS title_long
    ```
    
- **Searched Case (Seleção Complexa)**: Avalia condições lógicas independentes e sequenciais após cada cláusula `WHEN`. Equivalente ao bloco `IF ... ELSEIF ... ELSE ... ENDIF` do ABAP. O primeiro resultado verdadeiro dita o valor de retorno [181].
    
    ```abap
    CASE
      WHEN seats_occupied < seats_max THEN 'Seats Available'
      WHEN seats_occupied = seats_max THEN 'Fully Booked'
      WHEN seats_occupied > seats_max THEN 'Overbooked!'
      ELSE                                 'This is impossible'
    END AS booking_state
    ```
    

---

## Módulo 2: Operações Aritméticas e Processamento de Texto no Banco

_Processamento numérico e de texto avançado sem sobrecarregar a memória do Servidor de Aplicação._

### 2.1 Expressões Aritméticas e Derivação de Tipos

O ABAP SQL suporta as quatro operações matemáticas básicas (`+`, `-`, `*`, `/`), parênteses e três tipos de arithmetics [80]. O tipo do resultado e a precisão em runtime são derivados diretamente dos operandos [80]:

- **Integer Expression**: Se todos os operandos forem inteiros, o resultado será um inteiro [80].
- **Decimal Expression**: Se a expressão contiver ao menos um operando decimal (tipos de dicionário `DEC`, `QUAN`, `CURR` ou tipo ABAP `p`), o resultado será do tipo decimal `DEC` [80].
- **Floating Point Expression**: Se todos os operandos forem de ponto flutuante binário (tipo de dicionário `FLTP` ou tipo ABAP `f`), o resultado será do tipo `FLTP` (exibido em notação científica) [80, 82].
- **Restrição do Operador de Divisão (`/`)**: O operador de divisão direta `/` **apenas** é permitido em expressões de ponto flutuante (`FLTP`) [81]. Para efetuar divisões de outros tipos numéricos usando o operador `/`, deve-se converter todos os operandos para `FLTP` individualmente através de CASTs [81]:
    
    ```abap
    ( CAST( seats_occupied AS FLTP ) * CAST( 100 AS FLTP ) ) / CAST( seats_max AS FLTP ) AS percentage_fltp
    ```
    

### 2.2 Funções Numéricas Embutidas

Para suplementar cálculos matemáticos de forma limpa, utilize as seguintes funções integradas no banco [84]:

- `DIV( arg1, arg2 )`: Realiza a divisão inteira (despreza o resto). Permite apenas argumentos inteiros [84].
- `MOD( arg1, arg2 )`: Retorna o resto inteiro de uma divisão [84].
- `DIVISION( arg1, arg2, decimals )`: Realiza a divisão de quaisquer operandos numéricos (exceto ponto flutuante), efetuando arredondamento comercial para o número de casas decimais especificado no terceiro parâmetro [84, 85].
- `ROUND( arg, pos )`: Permite arredondar explicitamente um valor numérico para a posição decimal definida [84].

### 2.3 Operações com Strings no Banco de Dados

- **Operador de Concatenação `&&`**: Combina strings diretamente na query, ignorando espaços em branco à direita dos operandos (_trailing blanks_) de variáveis de banco, mantendo os espaços apenas em literais estáticos (ex: `' '`) [87, 89].
- **Funções de Concatenação**:
    - `CONCAT( arg1, arg2 )`: Une duas strings de forma adjacente [88].
    - `CONCAT_WITH_SPACE( arg1, arg2, spaces )`: Une duas strings inserindo uma quantidade definida de espaços em branco entre elas [88].
- **Funções de Processamento e Formatação**:
    - `UPPER( arg )` e `LOWER( arg )`: Conversão para maiúsculas/minúsculas [88].
    - `INITCAP( arg )`: Converte a primeira letra de cada palavra em maiúscula e as demais em minúsculas [88].
    - `LEFT( arg, n )` e `RIGHT( arg, n )`: Extraem os primeiros ou últimos nn caracteres da string [88].
    - `SUBSTRING( arg, pos, len )`: Extrai uma substring a partir de uma posição (1-indexed em SQL) por um comprimento específico [88].
    - _Dica técnica para datas_: Para obter dia, mês e ano isolados de um campo de data físico (`DATS` no formato `YYYYMMDD`), pode-se efetuar um `CAST( date_field AS CHAR(8) )` e extrair as posições correspondentes com `SUBSTRING`, `LEFT` e `RIGHT` [91].

---

## Módulo 3: Junções e Relacionamentos de Dados (Joins)

_Como correlacionar tabelas do banco de dados na camada física para evitar consultas secundárias subsequentes._

### 3.1 Fundamentos e Sintaxe de Joins em ABAP SQL

- **Conceito**: Combina múltiplos conjuntos de dados de forma relacional baseando-se em uma ou mais condições lógicas de ligação após a palavra-chave `ON` [10].
- **Seletor de Colunas**: Diferentemente do padrão SQL de outros bancos de dados que usa o caractere ponto (`.`), no ABAP SQL as colunas devem ser identificadas usando o caractere **til (`~`)** (ex: `tabela~campo`) [12]. Isso evita ambiguidade com o caractere ponto (`.`) que finaliza as instruções em ABAP [12].
- **Aliases**: É uma boa prática usar a palavra-chave `AS` para criar apelidos para as tabelas (ex: `FROM tabela AS a INNER JOIN outra AS b ON a~id = b~id`), simplificando a identificação dos campos. Ao definir um alias para uma tabela, o uso dele torna-se obrigatório no FIELDS e na cláusula ON [14].

### 3.2 Tipos de Junções

- **INNER JOIN**: Retorna apenas os registros que possuem correspondência exata de chaves em ambas as tabelas envolvidas na condição de junção [11].
- **LEFT OUTER JOIN**: Retorna todos os registros da tabela à esquerda, mesmo que não possuam correspondências na tabela à direita. Para as linhas sem par correspondente, as colunas da tabela da direita são preenchidas com os valores iniciais compatíveis com o tipo de dado técnico no ABAP (por exemplo, tipo `N` é inicializado com zeros e tipo `C` com espaços) em vez de valores nulos (Null) [19, 20].
- **RIGHT OUTER JOIN**: Retorna todos os registros da tabela à direita, mesmo que sem par correspondente na tabela da esquerda [21].
- **Uso do operador `IS NULL`**: Em cláusulas `WHERE` contendo junções externas (outer joins), deve-se adicionar validações `OR field IS NULL` para garantir que registros sem correspondência na junção não sejam sumariamente excluídos do conjunto de resultados [21].
- **Self-Joins (Autojunção)**: Junção de uma tabela com ela mesma. É indispensável o uso de aliases distintos para diferenciar o papel das duas instâncias da mesma tabela na query [14, 15].
    
    ```abap
    SELECT FROM /dmo/connection AS a
           INNER JOIN /dmo/connection AS b
             ON a~airport_to_id = b~airport_from_id
             AND a~airport_from_id <> b~airport_to_id
    ```
    

### 3.3 Joins Aninhados (Nested Joins)

- **Limite Técnico**: O ABAP SQL permite aninhar até **50 fontes de dados** (correspondendo a um máximo de 49 joins) em uma única instrução `SELECT` [23].
- **Ordem de Avaliação**: Sem o uso de agrupamentos explícitos, a ordem de avaliação é governada pela sequência física em que as cláusulas `ON` aparecem, e não pela ordem das tabelas no bloco `FROM` [26].
- **Recomendação de Legibilidade**: Sempre use parênteses/parêntesis de agrupamento ao construir joins aninhados de três ou mais tabelas para definir explicitamente a árvore de junções e evitar confusão técnica ou comportamentos inesperados na base de dados [25, 26].

---

## Módulo 4: Funções Internas Especiais, Datas e Conversões

_Convertendo dados técnicos e unidades de medida no momento da recuperação das tabelas._

### 4.1 Armazenamento de Datas, Horas e Timestamps

- **Datas**:
    - `DATS`: Armazenado no banco como tipo caracter de tamanho 8 no formato `'YYYYMMDD'` [135].
    - `DATN`: Armazenado nativamente como tipo de data física do banco. É convertido automaticamente pelo ABAP SQL para o formato de 8 caracteres ao ser carregado para variáveis locais [135].
- **Horas**: `TIMS` (formato ABAP 'HHMMSS') e `TIMN` (tipo nativo do banco de dados) [135].
- **Timestamps**:
    - `TIMESTAMP`: Armazenado como número inteiro compacto representando o fuso sem decimais [136].
    - `TIMESTAMPL`: Tipo timestamp contendo até 7 casas decimais para precisão milimétrica de 100 nanosegundos [136].
    - `UTCLONG`: Tipo moderno padrão de alta precisão (100ns) para timestamps globais baseados no fuso UTC [136].

### 4.2 Funções Genéricas para Processamento Temporal

O banco disponibiliza funções genéricas e de alta performance de tempo [136, 137]:

- `IS_VALID( arg )`: Retorna `1` se o campo representar uma data, hora ou timestamp UTCLONG válido, e `0` caso contrário [137, 138].
- `ADD_DAYS( date, days )` e `ADD_MONTHS( date, months )`: Adicionam ou subtraem dias/meses diretamente na camada física do banco [139].
- `DAYS_BETWEEN( date1, date2 )`: Retorna a quantidade líquida de dias entre duas datas [139].
- `WEEKDAY( date )`: Retorna o dia da semana correspondente como um inteiro de 1 (Segunda-feira) a 7 (Domingo) [139].
- `DAYNAME( date )` e `EXTRACT_MONTH( date )`: Retornam o nome do dia em texto e o número do mês correspondente [139].

### 4.3 Funções de Conversão Integradas

Para converter formatos de dados complexos que extrapolam a capacidade do operador `CAST`, utilize [140]:

- `DATS_FROM_DATN( )` e `DATS_TO_DATN( )`: Pontes de conversão entre representações locais e nativas de data [141].
- `TSTMP_TO_DATS( tstmp, tzone )` e `TSTMP_TO_TIMS( tstmp, tzone )`: Extraem a data local ou hora local a partir de um timestamp de formato compactado `DEC(15,0)` sob o fuso horário indicado (ex: `'EST'`) [141, 143].
- `DATS_TIMS_TO_TSTMP( date, time, tzone )`: Concatena e converte uma data e hora locais sob um determinado fuso horário em um timestamp UTC [141, 151].

### 4.4 Conversões Complexas: Unidades de Medida e Moedas

- **Conversão de Unidade (`UNIT_CONVERSION`)**: Realiza a tradução de valores entre unidades físicas de medida cadastradas no sistema (ex: convertendo distâncias de Quilômetros `'KM'` para Milhas `'MI'`) [142, 144]:
    
    ```abap
    unit_conversion( quantity    = CAST( distance AS QUAN ),
                     source_unit = distance_unit,
                     target_unit = CAST( 'MI' AS UNIT ) ) AS distance_MI
    ```
    
    _Nota_: Como o primeiro parâmetro exige tipagem física `QUAN`, pode ser necessário utilizar a expressão `CAST` para converter tipos de base inteiros (`INT4`) ou decimais genéricos [144].
- **Conversão de Moeda (`CURRENCY_CONVERSION`)**: Converte montantes financeiros entre moedas distintas baseando-se nas taxas de câmbio ativas no sistema para uma data de cotação definida [142, 145]. Exige o tratamento opcional do comportamento em caso de falha de conversão através do parâmetro `on_error` [160]:
    
    ```abap
    currency_conversion( amount             = total_price,
                         source_currency    = currency_code,
                         target_currency    = 'EUR',
                         exchange_rate_date = @today,
                         on_error           = @sql_currency_conversion=>c_on_error-set_to_null
                       ) AS total_price_EUR
    ```
    

---

## Módulo 5: Ordenação, Eliminação de Duplicatas e Agregações

_Reduzindo a quantidade de dados transmitidos da rede ao consolidar e agrupar resultados diretamente na base._

### 5.1 Ordenação Física (`ORDER BY`)

- **Posicionamento**: A cláusula `ORDER BY` deve vir obrigatoriamente colocada **antes** da cláusula `INTO` que armazena os dados nas tabelas internas [121].
- **Flexibilidade**: É possível ordenar o conjunto por colunas físicas, aliases de campos ou até por expressões dinâmicas calculadas na própria query (ex: `ORDER BY seats_max - seats_occupied DESCENDING, flight_date ASCENDING`) [109].

### 5.2 Eliminação de Duplicatas (`SELECT DISTINCT`)

- **Funcionamento**: A palavra-chave `DISTINCT` deve ser colocada **imediatamente antes** do primeiro campo listado na cláusula `FIELDS` [110]. Ela garante que registros contendo valores idênticos nos campos selecionados sejam condensados em apenas uma linha no conjunto de resultados [110].

### 5.3 Funções de Agregação

Calculam um valor consolidado a partir de um conjunto de linhas [112]:

- `SUM( sql_exp )`: Soma valores de uma expressão numérica [112].
- `MIN( sql_exp )` e `MAX( sql_exp )`: Determinam valores mínimos e máximos absolutos [112].
- `AVG( sql_exp [AS dtype] )`: Calcula a média ponderada. Pode receber um tipo de destino como `AS INT4` ou `AS DEC(10,2)` para evitar o retorno de ponto flutuante padrão [112, 125].
- `COUNT( * )`: Conta o número absoluto de linhas. Retorna o tipo de dado `INT4` (ou `INT8` se for a única expressão selecionada na query) [112].
- `COUNT( DISTINCT sql_exp )`: Retorna a quantidade de valores distintos contidos no conjunto [112].
- _Regra Importante_: Se a lista de campos `FIELDS` contiver **apenas** funções agregadas, a instrução retornará obrigatoriamente **exatamente uma linha**, mesmo se a query for executada sobre uma tabela ou seleção de dados vazia [113].

### 5.4 Agrupamento de Dados (`GROUP BY`)

- **Regra Geral**: Se a lista de campos selecionados mesclar funções de agregação (como `SUM`, `COUNT`) com colunas individuais ou expressões diretas, é **sintaticamente obrigatório** declarar a cláusula `GROUP BY` [115].
- **Conteúdo**: O bloco `GROUP BY` deve listar explicitamente todas as colunas e expressões selecionadas que aparecem fora das chamadas de funções de agregação na lista de campos (`FIELDS`) [115].
- **Efeito**: Divide o conjunto de resultados em subsets contendo dados idênticos nos campos de agrupamento, avaliando as agregações para cada subgrupo isoladamente [116].
    
    ```abap
    SELECT FROM /dmo/connection
         FIELDS carrier_id,
                MAX( distance ) AS max,
                MIN( distance ) AS min,
                COUNT( * ) AS count
         GROUP BY carrier_id
         INTO TABLE @DATA(result).
    ```
    

---

## Módulo 6: Resumo das Boas Práticas de Code Pushdown

_O "Aha-Moment" do desenvolvedor ABAP Cloud._

1. **Evite loops secundários de processamento**: Substitua leituras repetitivas do banco ou rotinas de cálculo locais de loop em tabelas internas (usando loops ABAP) por cálculos integrados no banco, otimizando o consumo de rede de dados e aproveitando a arquitetura paralela in-memory do **SAP HANA** [92].
2. **Utilize o desvio condicional em queries**: Utilize construções com `CASE` para calcular status, agrupamentos lógicos ou semânticos no momento de carregamento inicial, evitando loops pós-seleção apenas para preenchimento de campos virtuais [180].
3. **Mantenha os joins balanceados**: Evite trazer chaves ou ID para realizar buscas secundárias em tabelas de apoio na lógica ABAP. Faça o join físico, utilize aliases para preservar a legibilidade técnica e agrupe junções complexas com parênteses [22, 26].
4. **Simplifique a manipulação temporal**: Pare de realizar cálculos complexos de acréscimo de dias com algoritmos ABAP manuais. Use as funções genéricas integradas do banco como `DAYS_BETWEEN` e `ADD_DAYS`, aproveitando a tipagem forte do banco [136, 139].
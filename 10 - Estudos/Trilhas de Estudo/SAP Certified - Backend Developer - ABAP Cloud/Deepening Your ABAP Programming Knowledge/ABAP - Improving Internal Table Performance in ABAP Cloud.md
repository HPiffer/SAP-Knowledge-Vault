---
id: sap-abap-improving-internal-table-performance-in-abap-cloud
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud]
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

# ABAP - Improving Internal Table Performance in ABAP Cloud

Este guia de estudos consolida as diretrizes essenciais, regras de sintaxe moderna, boas práticas de performance e comparação de runtimes para otimizar o processamento e a manipulação de tabelas internas em ABAP Cloud, com base estritamente nos materiais didáticos oficiais.

---

## Fluxo de Aprendizagem Recomendado

```
[Módulo 1: Sintaxe & Operações] ➔ [Módulo 2: Tipos de Tabelas]
                                         │
[Módulo 4: Uso de Field Symbols] ◄─ [Módulo 3: Chaves Secundárias]
```

---

## Módulo 1: Processamento de Conteúdos e Sintaxes Modernas de Tabelas Internas

O processamento básico de tabelas internas envolve ordenar registros, eliminar duplicidades e realizar transformações ou agrupamentos em lote [55]. No ABAP moderno, diversas expressões de construtor facilitam e otimizam essas operações.

### 1.1 Ordenação de Tabelas (`SORT`)

Em tabelas internas do tipo padrão (_Standard Tables_), a ordem dos dados por padrão não é garantida [64]. Para organizar o conteúdo na memória, utiliza-se a instrução `SORT` [65]:

- **Ordenação pela chave primária**: `SORT flights.` ordena os registros usando de forma implícita a chave primária declarada na definição da tabela interna [65].
- **Ordenação por campos específicos**: `SORT flights BY currency_code plane_type_id.` organiza os registros de acordo com os atributos definidos na lista. Por padrão, a direção da ordenação é crescente (_Ascending_) [65].
- **Ordenação com direções customizadas**: `SORT flights BY carrier_id ASCENDING flight_date DESCENDING.` permite especificar direções de ordenação distintas por componente [65].

### 1.2 Eliminação de Duplicatas (`DELETE ADJACENT DUPLICATES`)

Para remover linhas duplicadas em tabelas internas, utiliza-se o comando `DELETE ADJACENT DUPLICATES` [66]. É fundamental respeitar as seguintes regras de runtime:

1. **Requisito de adjacência**: O comando compara apenas linhas vizinhas (adjacentes). Portanto, **é obrigatório ordenar a tabela antes** por meio do comando `SORT` antes de aplicar a remoção [66, 67].
2. **Comportamento padrão**: Sem adições, o ABAP compara apenas as colunas que pertencem à chave primária da tabela interna para identificar se uma linha é duplicada [67]. Se houver campos que diferem (como uma coluna de data de voo fora da chave), os registros não serão considerados adjacentes idênticos [67].
3. **Filtragem explícita com `COMPARING`**: Permite especificar um subconjunto de chaves ou campos não-chave para a comparação:
    
    ```abap
    SORT flights BY carrier_id connection_id.
    DELETE ADJACENT DUPLICATES FROM flights COMPARING carrier_id connection_id.
    ```
    
    Isso assegura que combinações idênticas destes dois campos sejam unificadas, independentemente do valor de outras colunas [68, 69].
4. **Comparação total**: A adição `COMPARING ALL FIELDS` exige que todas as colunas da linha sejam idênticas para deletar o registro [69].

### 1.3 Cópia de Dados com `CORRESPONDING`

Para transferir registros entre tabelas internas que possuem estruturas de linha compatíveis ou parcialmente coincidentes, o operador de construtor `CORRESPONDING #( )` é a melhor escolha [71]:

- O sistema cria novas linhas na tabela de destino mapeando as colunas que possuem nomes idênticos [71].
- Campos existentes apenas na tabela de origem são ignorados; campos presentes apenas no destino são inicializados com seu valor padrão de tipo [71].
- **Atenção**: Qualquer dado preexistente na tabela de destino é totalmente sobrescrito pelo resultado do operador [72].

### 1.4 Compreensões de Tabela (`FOR` em Expressões `VALUE`)

Substituem os antigos loops tradicionais de carga de dados. Permitem varrer uma tabela de origem e projetar seus valores diretamente em uma tabela destino em uma única expressão embutida [73]:

```abap
result_table = VALUE #( 
  FOR line IN connections ( 
    carrier_id             = line-carrier_id
    connection_id          = line-connection_id
    departure_airport      = line-airport_from_id
    departure_airport_name = airports[ airport_id = line-airport_from_id ]-name 
  ) 
).
```

- No exemplo, a variável de loop local `line` percorre temporariamente a tabela `connections` [73, 74].
- Os componentes da linha de destino são preenchidos por atribuição direta ou consultas auxiliares (como a expressão de tabela `airports[...]` que localiza o nome do aeroporto com base na chave de origem) [74].
- É possível aplicar restrições ao loop adicionando uma cláusula `WHERE` (entre parênteses adicionais) ou limitando a varredura com `FROM` e `TO` [75, 90].

### 1.5 Reduções de Tabela (`REDUCE`)

A redução serve para iterar por uma tabela e consolidar suas informações em um único valor escalar ou estrutura [76, 77]:

- **Redução escalar**: Compila a soma de assentos ocupados de voos [76]:
    
    ```abap
    DATA(sum) = REDUCE i( INIT total = 0 FOR line IN flights NEXT total += line-seats_occupied ).
    ```
    
- **Redução estruturada com helper local**: Utiliza inicializações auxiliares para calcular valores calculados finais (ex: acumular contagem para cálculo de médias em uma estrutura `t_results_with_avg`) [77, 78]:
    
    ```abap
    DATA(result_with_average) = REDUCE t_results_with_avg( 
      INIT totals_avg TYPE t_results_with_avg count = 1
      FOR line IN flights 
      NEXT totals_avg-occupied += line-seats_occupied
           totals_avg-maximum  += line-seats_max
           totals_avg-average   = totals_avg-occupied / count
           count               += 1 
    ).
    ```
    
    _Nota: O resultado final da redução é sempre a primeira variável declarada no bloco `INIT` (no caso, `totals_avg`)_ [79].

---

## Módulo 2: Otimizando Acessos com a Escolha do Tipo de Tabela (_Table Kinds_)

A escolha do tipo correto de tabela interna — **Standard**, **Sorted** ou **Hashed** — afeta diretamente a complexidade do algoritmo de busca em runtime e a eficiência no consumo de recursos de memória do SAP Application Server [125, 126].

|Tipo de Tabela|Algoritmo de Busca|Complexidade Temporal|Duplicatas de Chave|Operação Recomendada de Escrita|Casos de Uso Típicos|
|---|---|---|---|---|---|
|**Standard Table**|Busca sequencial [125]|O(n)O(n) [125]|Permitido (`NON-UNIQUE`)|`APPEND` [129]|Iteração completa sobre a tabela inteira sem a necessidade de filtros em cláusulas WHERE [127].|
|**Sorted Table**|Busca binária [128]|O(log⁡n)O(logn)|`UNIQUE` ou `NON-UNIQUE`|`INSERT` [129]|Loops que usam filtros de chave parciais ou leituras pontuais ordenadas constantes [128].|
|**Hashed Table**|Algoritmo de Hash [126]|O(1)O(1) [126]|Proibido (`UNIQUE KEY` apenas) [122, 127]|`INSERT` [129]|Acessos pontuais repetitivos de chave completa extremamente rápidos (ex: tabelas de buffering de dados) [128].|

### 2.1 Regras de Manipulação Física de Dados

- **`APPEND`**: Adiciona novos registros diretamente ao final da tabela interna de forma imediata [64]. É a escrita padrão para _Standard Tables_ [129]. **Não é permitido em Hashed Tables** (dispara erro de sintaxe) [129]. Em _Sorted Tables_, o uso de `APPEND` é desencorajado por apresentar alto risco de gerar um erro de runtime (_dump_) caso a linha inserida viole a ordenação lógica dos campos de chave definidos [129].
- **`INSERT`**: Identifica automaticamente a posição de memória adequada. É a instrução correta e segura para preencher _Sorted Tables_ e _Hashed Tables_ [129].

---

## Módulo 3: Utilização de Chaves Secundárias (_Secondary Keys_)

Para agilizar o acesso a dados de uma tabela interna com base em campos que não fazem parte da chave primária original, é possível associar uma ou mais chaves secundárias à definição da tabela [44].

### 3.1 Classificação das Chaves Secundárias

- Podem ser do tipo **Sorted** (completas e ordenadas, aceitando chave `UNIQUE` ou `NON-UNIQUE`) ou **Hashed** (necessariamente `UNIQUE`) [44].
- A escolha da estratégia de atualização da chave dita seu desempenho [45, 46]:

#### Chaves Secundárias Não Únicas (`NON-UNIQUE SORTED KEY`)

- **Estratégia de atualização Preguiçosa (_Lazy Update_)**: O sistema não gera o índice de busca da chave secundária durante a carga inicial de dados da tabela [45].
- **Comportamento em runtime**: O índice correspondente só é gerado no exato instante em que o programa executa a primeira leitura apontando para essa chave [45]. Como resultado, o primeiro acesso de leitura será significativamente mais caro e demorado [45]. Leituras subsequentes serão extremamente performáticas [45].
- **Modificações**: Quando novos dados são inseridos na tabela, o ABAP adia a reorganização do índice até o momento em que nova leitura com essa chave ocorrer (minimiza o custo de escrita frequente) [46].

#### Chaves Secundárias Únicas (`UNIQUE`)

- **Dupla função**: Além de otimizar a velocidade de acesso, garante a integridade impedindo chaves duplicadas na tabela [46].
- **Estratégia de atualização Imediata**: Qualquer modificação na tabela interna (inserções, modificações de linhas) força a imediata criação ou atualização de seu índice secundário associado [46, 47]. Leituras são sempre executadas de forma instantânea [47].

### 3.2 Sintaxe de Declaração de Chaves Secundárias

Adiciona-se o parâmetro `WITH [UNIQUE | NON-UNIQUE] [SORTED | HASHED] KEY` com a especificação de seus componentes físicos [48, 52]:

```abap
DATA connections_sk TYPE SORTED TABLE OF Zs4d401_flights
  WITH NON-UNIQUE KEY carrier_id connection_id flight_date
  WITH NON-UNIQUE SORTED KEY k_plane COMPONENTS plane_type_id.
```

### 3.3 Consumo de Chaves Secundárias no Código

Para garantir que o runtime ABAP utilize o índice secundário otimizado, o desenvolvedor deve apontar expressamente para o alias da chave definida usando a palavra-chave `KEY` ou `USING KEY` [48, 54]:

- **Leitura em Loops (`LOOP AT`)** [48]:
    
    ```abap
    LOOP AT connections_sk INTO DATA(connection) USING KEY k_plane 
      WHERE plane_type_id = '737-800'.
    ENDLOOP.
    ```
    
- **Verificação de Linha (`line_exists`)** [53, 54]:
    
    ```abap
    IF NOT line_exists( flights_buffer[ KEY sk_carrier COMPONENTS carrier_id = i_carrier_id ] ).
      " Operações de fallback...
    ENDIF.
    ```
    
- **Compreensões de Tabela (`FOR ... IN ... USING KEY`)** [54]:
    
    ```abap
    r_result = VALUE #(
                 FOR <flight> IN flights_buffer USING KEY sk_carrier
                   WHERE ( carrier_id = i_carrier_id ) (
                     NEW lcl_passenger_flight(
                           i_carrier_id    = <flight>-carrier_id
                           i_connection_id = <flight>-connection_id
                           i_flight_date   = <flight>-flight_date )
                                                       )
               ).
    ```
    

---

## Módulo 4: Otimização de Performance Avançada com Field Symbols

Em loops convencionais (`LOOP AT itab INTO DATA(wa)`), o ABAP Cloud aloca memória e realiza uma **cópia física** de cada linha da tabela para a estrutura da Work Area `wa` [104]. Qualquer alteração de dados exige a instrução `MODIFY itab FROM wa` para gravar os dados de volta [104].

### 4.1 Limitação Física do Uso de Work Areas

Em tabelas internas contendo milhares de linhas ou tipos de estruturas de dados largos (muitas colunas), o custo contínuo de cópia física de entrada e saída de dados degrada consideravelmente os tempos de CPU do servidor de aplicação e gera gargalos significativos [104].

### 4.2 Otimização In-Place com Field Symbols

O **Field Symbol** atua como um ponteiro físico direto para o endereço de memória de uma linha específica da tabela interna [105].

- **Sem cópia de dados**: Alterar o valor de um campo de um field symbol modifica diretamente o registro na tabela interna original na memória [105, 106].
- **Sem necessidade de `MODIFY`**: O comando `MODIFY` torna-se totalmente redundante e desnecessário, economizando recursos computacionais importantes [106].

```abap
" MÉTODO TRADICIONAL (COM COPIAS E MODIFY) - MAIS LENTO
LOOP AT c_flights INTO DATA(flight).
  flight-seats_occupied += 1.
  MODIFY c_flights FROM flight.
ENDLOOP.

" MÉTODO OTIMIZADO (COM FIELD SYMBOLS) - MUITO MAIS RÁPIDO
LOOP AT c_flights ASSIGNING FIELD-SYMBOL(<flight>).
  <flight>-seats_occupied += 1.
ENDLOOP.
```

### 4.3 Resultados Práticos de Performance

- De acordo com análises realizadas com o ABAP Profiler, a substituição de Work Areas por Field Symbols para operações de alteração de conteúdo gera uma **redução consistente de 25% a 40% no tempo de execução** total do processo [107].
- O ganho de performance em operações apenas de leitura é menor, porém ainda existente [107].
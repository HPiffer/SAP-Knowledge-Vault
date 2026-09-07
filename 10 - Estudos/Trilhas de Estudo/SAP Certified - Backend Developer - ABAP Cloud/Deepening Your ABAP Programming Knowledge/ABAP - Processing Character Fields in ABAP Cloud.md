---
id: sap-abap-processing-character-fields-in-abap-cloud
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

# ABAP - Processing Character Fields in ABAP Cloud

Este guia de estudos compila e organiza de forma exaustiva os conceitos técnicos e melhores práticas sobre o processamento de campos de caracteres em **ABAP Cloud**, com foco nos materiais oficiais de preparação para a certificação **SAP Certified - Backend Developer - ABAP Cloud**.

---

## Fluxo de Aprendizagem Recomendado

```
[Módulo 1: Textos Traduzíveis (Translatable Texts)]
                    │
                    ▼
[Módulo 2: Funções Embutidas de String (String Functions)]
                    │
                    ▼
[Módulo 3: Expressões Regulares (PCRE Regex)]
                    │
                    ▼
[Módulo 4: Exercício Prático Combinado (Text Symbols & String Functions)]
```

---

## Módulo 1: Usando Textos Traduzíveis (Translatable Texts) em ABAP

Em aplicações corporativas globais desenvolvidas em ABAP Cloud, a internacionalização é um requisito mandatório [47]. As UIs precisam se adaptar dinamicamente ao idioma de logon do usuário [47].

### 1.1 O Problema dos Literais de Texto Hardcoded

- **Impossibilidade de Tradução**: Literais de texto delimitados por aspas simples (`'texto'`) ou crase (`` `texto` ``) possuem conteúdos estáticos rígidos [48]. Eles não são traduzíveis e serão sempre exibidos exatamente como foram escritos, independentemente do idioma de logon do usuário [48].
- **Tratamento de Textos por Padrão na UI**: No modelo **ABAP RESTful Application Programming Model (RAP)**, diversos componentes já nascem traduzíveis por padrão [47]:
    - Rótulos (_labels_) e cabeçalhos derivados de anotações semânticas em definições de dados (CDS Views) e extensões de metadados (_Metadata Extensions_) [47].
    - Textos e rótulos definidos em Elementos de Dados (_Data Elements_) no ABAP Dictionary [47].
    - Mensagens de erro, alerta ou sucesso declaradas em Classes de Mensagens (_Message Classes_) [47].
- Qualquer texto que seja gerado diretamente no código-fonte ABAP (como em classes utilitárias ou aplicações de console) precisa de um mecanismo para se tornar traduzível [48, 49].

### 1.2 Símbolos de Texto (Text Symbols) e o Text Pool

Para tornar textos contidos no código ABAP elegíveis para tradução, deve-se substituir literais estáticos por **Símbolos de Texto** (_Text Symbols_), também conhecidos como elementos de texto [49].

- **Text Pool**: Símbolos de texto são mantidos em um repositório interno especial de cada classe global chamado _Text Pool_ [49].
- **Identificador de 3 Caracteres (ID)**: Cada símbolo de texto é associado a um ID exclusivo composto por 3 caracteres (letras, números ou combinação de ambos, sem distinção de maiúsculas/minúsculas) [49]. Ex: `001`, `HAU`, `A9B` [49, 50].
    - _Importante_: Não confunda IDs de símbolos de texto com IDs de mensagens (em classes de mensagens, os IDs devem conter estritamente apenas números) [50].
- **Comprimento Técnico vs. Máximo Semântico**:
    - **Limite Técnico**: O limite técnico máximo para a string de um símbolo de texto é de **255 caracteres** [50].
    - **Limite Máximo Semântico**: Ao criar o símbolo, o desenvolvedor deve estipular uma propriedade de comprimento máximo (entre a extensão atual do texto e 255) [50]. Este comprimento define o limite de caracteres que o tradutor externo terá para reescrever o termo em outra língua [50, 51]. Recomenda-se definir um limite máximo significativamente superior ao texto original para evitar abreviações incompreensíveis pelo tradutor [51].

### 1.3 Sintaxe de Acesso a Símbolos de Texto

Existem duas abordagens para referenciar símbolos de texto no código ABAP [51]:

1. **Acesso Standalone**: Utiliza-se o prefixo `text-` seguido do ID correspondente de três caracteres [51].
    
    ```abap
    out->write( text-001 ).
    ```
    
2. **Acesso Anexado (Com Literal de Fallback)**: Adiciona-se o ID entre parênteses colado imediatamente após o literal de texto original (sem espaços) [51, 56]. O literal serve de fallback de runtime: se o símbolo correspondente não estiver definido ou ativo no _Text Pool_, o runtime utilizará o texto contido no literal [52].
    
    ```abap
    out->write( 'Carrier Name:'(001) ).
    ```
    
    - _Aviso de Qualidade (ATC)_: O texto contido no literal deve bater exatamente com o valor gravado para o ID no _Text Pool_ [52]. O **ABAP Test Cockpit (ATC)**, através da checagem estendida (_Extended Program Check - SLIN_), emitirá avisos se houver divergências entre o literal e o símbolo de texto [52].

### 1.4 Atalhos e Quick Fixes no ADT Eclipse

A manipulação do _Text Pool_ de forma manual é desaconselhada [53]. O ADT Eclipse fornece rotinas ágeis de **Quick Fixes** para automatizar o processo [53]:

- Escreva a sintaxe de fallback no código, ex: `'Passenger Flights:'(002)` [56].
- Posicione o cursor sobre o ID e pressione **`Ctrl + 1`** [34, 57].
- Selecione **"Create text ID in text pool"** [34, 57].
- Ajuste o controle deslizante para definir o limite de comprimento máximo desejado e finalize (`Finish`) [34, 57].
- Para navegar e auditar o _Text Pool_ completo da classe, mantenha pressionada a tecla **`Ctrl`** e clique em qualquer ID do código [57].
- Salve e ative o _Text Pool_ editado utilizando o atalho **`Ctrl + F3`** [57].

---

## Módulo 2: Funções Embutidas de String (String Functions)

Além da concatenação de strings usando o operador `&&` e formatação por templates de string (`|...|`), o ABAP Cloud possui um rico conjunto de funções integradas [10]. Elas são classificadas em três grandes grupos com base no tipo de retorno: **Descrição**, **Processamento** e **Predicadas** [10, 16, 23].

### 2.1 Parâmetros Comuns das Funções de String

Ao interagir com funções que aceitam múltiplos argumentos, deve-se usar passagem nomeada de parâmetros com atribuição explícita [11].

- **`val` (Input Principal)**: Recebe o dado textual elementar que será processado pela função [11]. Aceita strings dinâmicas, variáveis escalares, chamadas de métodos funcionais ou expressões construtoras cujo retorno seja conversível para o tipo string [11].
    - _Regra de Brancos_: Se o parâmetro `val` receber um objeto de comprimento fixo (tipo `C`), quaisquer espaços em branco à direita (_trailing blanks_) serão ignorados pela função [11].
- **`sub` (Substring)**: Passa a substring a ser pesquisada ou inserida [12]. Assim como `val`, se for de tamanho fixo, espaços à direita são automaticamente ignorados [12].
- **`case` (Sensibilidade de Caixa)**: Por padrão, buscas e comparações em funções ABAP são case-sensitive (`case = abap_true` ou `'X'`) [12]. Para desativar a sensibilidade a maiúsculas/minúsculas, passe `case = abap_false` ou `' '` [12].
- **`occ` (Ocorrência)**: Indica a posição da ocorrência em operações de busca [13].
    - **Valores Positivos (Esquerda para Direita)**: `1` indica a primeira ocorrência, `2` a segunda, etc [13]. O padrão é `1` [13].
    - **Valores Negativos (Direita para Esquerda)**: `-1` indica a última ocorrência de trás para frente, `-2` a penúltima, etc [13].
    - _Exceção_: Atribuir valor `0` a `occ` disparará a exceção tratável `CX_SY_STRG_PAR_VAL` (com exceção da função `replace`, onde `occ = 0` instrui o runtime a substituir todas as ocorrências encontradas) [13].
- **`off` e `len` (Offset e Comprimento)**: Delimitam um subintervalo de processamento da string [14].
    - O padrão para `off` é `0` [14].
    - O padrão para `len` é a extensão restante da string após o offset [14].
    - _Aviso de Runtime_: Combinações de valores que excedam os limites físicos da string original dispararão a exceção `CX_SY_RANGE_OUT_OF_BOUNDS` [14].

### 2.2 Funções de Descrição (Description Functions)

Estas funções analisam o estado da string de entrada e retornam dados numéricos (geralmente tipo `i`) [16, 17].

- **`strlen( )` vs. `numofchar( )` (Medição de Comprimento)**:
    - Para objetos de dados de tamanho fixo (tipos `C` ou `N`), ambas as funções retornam o mesmo valor, pois desconsideram espaços em branco à direita [16].
    - **Diferença Crítica**: Se o argumento for do tipo dinâmico `STRING` e contiver espaços em branco à direita, **`strlen( )` inclui** esses espaços no total, enquanto **`numofchar( )` os desconsidera completamente** [16].
- **`count( )` vs. `find( )` (Busca e Frequência)**:
    - **`count( )`**: Retorna a contagem (frequência) total de correspondências do padrão pesquisado [17].
    - **`find( )`**: Retorna o índice de offset da posição inicial da correspondência especificada pelo parâmetro `occ` (retorna `-1` se o padrão não for encontrado) [17].
- **Variações de Busca por Lista de Caracteres (`_any_of` e `_any_not_of`)**:
    - Se utilizar funções terminadas em `_any_of` (ex: `count_any_of`, `find_any_of`), o parâmetro `sub` não será avaliado como uma substring contínua, mas sim como um **conjunto de caracteres isolados** [18]. Cada ocorrência individual de qualquer caractere da lista é considerada um match [18].
    - As terminadas em `_any_not_of` (ex: `count_any_not_of`, `find_any_not_of`) invertem a lógica, considerando correspondências apenas para caracteres que não constem na lista [18].

### 2.3 Funções de Processamento (Processing Functions)

Essas funções retornam uma nova string transformada a partir do valor fornecido [21].

- **Manipulação de Caixa**:
    - **`to_upper( )`**: Converte todas as letras para maiúsculas [21].
    - **`to_lower( )`**: Converte todas as letras para minúsculas [22].
    - **`to_mixed( )`**: Converte strings separadas para o formato mista CamelCase [21]. Ela varre o texto, localiza um caractere delimitador (parâmetro opcional `sep`, que assume o sublinhado `_` por padrão), remove-o e altera a primeira letra seguinte para maiúscula [21].
    - **`from_mixed( )`**: Executa o processo inverso ao `to_mixed( )` [22].
- **Inversão e Deslocamento**:
    - **`reverse( )`**: Retorna os caracteres na ordem inversa [21].
    - **`shift_left( )` e `shift_right( )`**:
        - Pelo parâmetro `places = n`, remove `n` caracteres na extremidade especificada [21].
        - Pelo parâmetro `circular = n`, desloca ciclicamente `n` caracteres de uma ponta à outra sem removê-los [21].
- **Extração de Substrings**:
    - **`substring( )`**: Recorta uma string baseada em coordenadas físicas informadas nos parâmetros `off` (posição de início) e `len` (comprimento do corte) [21].
    - **`substring_from( )` / `substring_to( )`**: Extraem fragmentos de texto contendo a palavra-alvo (inclusive) de/até o início ou fim da string [21].
    - **`substring_after( )` / `substring_before( )`**: Extraem fragmentos de texto que ocorrem estritamente depois ou antes da palavra-alvo (exclusive) [21].
- **Limpeza e Divisão**:
    - **`condense( )`**: Remove espaços duplicados e elimina espaços em branco sobressalentes nas pontas [22].
    - **`repeat( )`**: Repete a string de entrada `occ` vezes [22].
    - **`segment( )`**: Divide a string de entrada em partes com base no caractere delimitador informado no parâmetro `sep` e retorna o fragmento referente ao `index` solicitado (indexação baseada em 1) [21, 22]. É a ferramenta ideal em ABAP para realizar o parsing de arquivos estruturados do tipo **CSV** [21].

---

## Módulo 3: Expressões Regulares (PCRE Regex)

Uma **Expressão Regular** (_Regex_) é um padrão potente composto de caracteres literais e metacaracteres especiais para descrever, buscar ou validar conjuntos complexos de strings de forma concorrente [24].

### 3.1 Padrão PCRE em ABAP Cloud

O ABAP Cloud adota como padrão de referência o **PCRE (Perl Compatible Regular Expression)** [25].

- _Nota de Depreciação_: O parâmetro `regex` (que utilizava a sintaxe antiga de expressões regulares baseadas no padrão POSIX) tornou-se **obsoleto** e seu uso é proibido no desenvolvimento moderno de ABAP Cloud [28]. Sempre utilize a cláusula com o parâmetro **`pcre`** [27, 28].

### 3.2 Sintaxe Essencial do PCRE

O quadro a seguir resume os construtores sintáticos básicos do PCRE aplicados no ABAP [26]:

|Construtor|Significado técnico e Aplicação Prática|Exemplo PCRE|Correspondência de Match|
|---|---|---|---|
|**Literal**|Caractere de texto comum avaliado de forma literal.|`ABAP`|Casa exatamente com o literal "ABAP"|
|**`[ ]`**|Define uma classe (conjunto) de caracteres permitidos para a posição.|`A[BS]A`|Matches: "ABA" ou "ASA"|
|**`-` (no colchete)**|Define um intervalo sequencial lexical de caracteres válidos.|`[B-D]`|Qualquer caractere individual de B a D (B, C ou D)|
|**`^` (no colchete)**|Funciona como uma lista de negação / exclusão de caracteres.|`[^LX]`|Permite qualquer caractere, exceto "L" e "X"|
|**`.`**|Curinga que casa com qualquer caractere individual obrigatório.|`A.A`|Qualquer caractere único entre duas letras A (ex: "A1A", "ABA")|
|**`{n}`**|Quantificador rígido. O caractere à esquerda deve repetir exatamente `n` vezes.|`AB{3}A`|Exige exatamente 3 letras B: "ABBBA"|
|**`{min,max}`**|Quantificador de faixa. Determina limites mínimos e máximos de repetição.|`AB{1,2}A`|Permite "ABA" (1 B) ou "ABBA" (2 B)|
|**`{min,}`**|Quantificador de limite mínimo. Exige ao menos `min` repetições livres.|`AB{1,}A`|Exige pelo menos uma letra B (sem teto máximo)|
|**`( )`**|Agrupamento de caracteres (trata o bloco interno como elemento único).|`A(BA){2}P`|Repete o padrão "BA" duas vezes: "ABABAP"|
|**`\|`**|Operador de união lógica alternativo (tipo OU).|`AB\|S`|Aceita o literal "AB" ou a letra isolada "S"|

### 3.3 Consumindo Regex com Funções de String

Muitas das funções embutidas de string possuem suporte a Regex por meio do parâmetro alternativo `pcre` [27, 28]:

- Se optar por realizar buscas utilizando Regex, informe a string PCRE no parâmetro `pcre` em vez de usar `sub` [27]. O uso concomitante de `sub` e `pcre` gera erro [27].
- **Funções Exclusivas para Processamento com Regex** [28]:
    - **`matches( )` (Função Predicada)**: Retorna um booleano (`abap_true` ou `abap_false`). Ela é rigorosa e avalia se a string de entrada **por inteiro** atende à expressão regular informada no parâmetro `pcre` [28]. É a ferramenta ideal para validação semântica e sintática de dados inseridos pelo usuário (ex: checar formato de e-mails, CEP ou telefones) [28, 29].
    - **`match( )` (Função de Busca)**: Funciona como a rotina `find( )`, mas em vez de retornar o índice numérico (offset) do padrão encontrado, **`match( )` captura e retorna a substring real** que casou com o PCRE de busca [28].

---

## Módulo 4: Exercício Prático Combinado (Text Symbols & String Functions)

Abaixo é apresentado um exemplo prático consolidado de refatoração para desenvolvimento global [31]. No cenário apresentado, o método `get_description` de uma classe local de transporte aéreo foi adaptado para remover literais estáticos, implementar internacionalização via símbolos de texto do _Text Pool_ e realizar o preenchimento de variáveis utilizando a função de processamento `replace( )` [31, 36].

```abap
CLASS lcl_passenger_flight DEFINITION.
  PUBLIC SECTION.
    METHODS get_description
      RETURNING
        VALUE(r_result) TYPE string_table.

  PRIVATE SECTION.
    DATA carrier_id        TYPE /dmo/carrier_id VALUE 'LH'.
    DATA connection_id     TYPE /dmo/connection_id VALUE '0400'.
    DATA flight_date       TYPE /dmo/flight_date VALUE '20261015'.
    DATA planetype         TYPE /dmo/plane_type_id VALUE '747-400'.
    DATA seats_max         TYPE i VALUE 350.
    DATA seats_occ         TYPE i VALUE 320.
    DATA seats_free        TYPE i VALUE 30.
    DATA price             TYPE /dmo/flight_price VALUE '850.00'.
    DATA currency          TYPE /dmo/currency_code VALUE 'EUR'.
    
    DATA connection_details TYPE STRUCTURE. " Estrutura simulada para exemplo
ENDCLASS.

CLASS lcl_passenger_flight IMPLEMENTATION.

  METHOD get_description.
    DATA txt TYPE string.

    " 1. Carrega o template parametrizado a partir do Text Pool com ID 005
    " O texto gravado no Text Pool é: 'Flight &carrid& &connid& on &date& from &from& to &to&'
    txt = 'Flight &carrid& &connid& on &date& from &from& to &to&'(005).

    " 2. Substitui sequencialmente os placeholders por valores dinâmicos das variáveis
    txt = replace( val = txt sub = '&carrid&' with = carrier_id ).
    txt = replace( val = txt sub = '&connid&' with = connection_id ).
    
    " Formata a data do voo conforme a preferência de exibição do usuário corrente
    txt = replace( val = txt sub = '&date&'   with = |{ flight_date DATE = USER }| ).
    
    txt = replace( val = txt sub = '&from&'   with = 'GRU' ). " Exemplo fixo
    txt = replace( val = txt sub = '&to&'     with = 'FRA' ). " Exemplo fixo
    
    " Adiciona a string processada na tabela de retorno
    APPEND txt TO r_result.

    " 3. Linhas complementares utilizando Text Symbols com fallback e string templates
    APPEND |{ 'Planetype:'(006)      } { planetype  }| TO r_result.
    APPEND |{ 'Maximum Seats:'(007)  } { seats_max  }| TO r_result.
    APPEND |{ 'Occupied Seats:'(008) } { seats_occ  }| TO r_result.
    APPEND |{ 'Free Seats:'(009)     } { seats_free }| TO r_result.
    
    " Formatação monetária adequada do preço do ticket
    APPEND |{ 'Ticket Price:'(010)   } { price CURRENCY = currency } { currency }| TO r_result.

  ENDMETHOD.

ENDCLASS.
```
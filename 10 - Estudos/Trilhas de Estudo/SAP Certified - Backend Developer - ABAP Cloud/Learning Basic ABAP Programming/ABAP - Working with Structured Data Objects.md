---
id: sap-abap-working-with-structured-data-objects
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud]
modulos: []
produtos: [BTP]
release: agnostico
nivel: basico
autor: Hayron Piffer
criado: 2026-08-29
atualizado: 2026-08-29
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---
# ABAP - Working with Structured Data Objects
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Conceito e Declaração] ➔ [Módulo 2: Acesso e Atribuições] ➔ [Módulo 3: Expressões Modernas] ➔ [Módulo 4: Estruturas no ABAP SQL]

```

---

## Módulo 1: Conceito, Tipagem e Declaração de Estruturas

### 1.1 Motivação e Conceito de Estrutura

- **Limitação de Variáveis Simples**: Variáveis escalares individuais (ex: `airport_from_id` e `airport_to_id`) armazenam apenas um valor por vez e operam de forma independente, sendo inadequadas para representar registros de banco de dados onde os campos pertencem a uma mesma entidade logicamente relacionada.

- **Definição de Estrutura**: Em ABAP, uma estrutura (*structured data object*) é uma variável composta dividida em componentes individuais, cada um possuindo seu próprio nome e tipo. A estrutura pode ser manipulada como um todo ou componente a componente.

### 1.2 Formas de Declaração de Tipos Estruturados

1. **Tipos de Repositório Global (DDIC / CDS)**:

   - Uso de tipos globais do dicionário (ex: estrutura global `SYMSG`).

   - Definições de tabelas de banco de dados ou CDS Views (ex: `TYPE /DMO/I_Connection`) servem diretamente como tipos estruturados globais.

2. **Tipos Estruturados Locais (`TYPES`)**:

   - Declaração em blocos utilizando os comandos `TYPES BEGIN OF <tipo>` e `TYPES END OF <tipo>`.

   - Utilização de comandos em cadeia (*chain statements*) `TYPES:` para agrupar a definição dos componentes.

3. **Estruturas Aninhadas (*Nested Structures*)**:

   - Ocorrem quando um ou mais componentes de um tipo estruturado são, eles próprios, declarados com outro tipo estruturado (ex: componente `message` do tipo `SYMSG` dentro da estrutura `st_nested`).

4. **Constantes Estruturadas**:

   - Declaradas com `CONSTANTS BEGIN OF ... END OF ...`. A inclusão da cláusula `VALUE` em cada componente é obrigatória.

### 1.3 Análise de Estruturas no Debugger do ADT

- **Variable Preview (Mouse-Over)**: Posicionar o cursor sobre o nome da variável no editor exibe um popup com os componentes e valores atuais.

- **Variables View**: Dar duplo clique na variável ou inseri-la na aba *Variables* permite expandir o nó da estrutura e inspecionar cada componente detalhadamente.

---

## Módulo 2: Acesso a Componentes e Atribuição de Dados

### 2.1 Operador Seletor de Componente (`-`)

- **Sintaxe de Acesso**: O hífen (`-`) conecta o nome da estrutura ao nome do componente (ex: `connection-airport_from_id`). **Não são permitidos espaços** antes ou depois do hífen.

- **Estruturas Aninhadas**: Acessam-se subcomponentes encadeando hífens (ex: `connection_nested-message-msgty`).

- **Posição de Operando**: Um componente de estrutura pode ser utilizado em qualquer posição válida para uma variável escalar do mesmo tipo (atribuições, cláusulas `WHERE`/`INTO`, parâmetros de métodos).

- **Auto-completar no ADT**: Pressionar `Ctrl + Space` imediatamente após o hífen exibe a lista de componentes disponíveis.

### 2.2 Atribuição Direta vs. Compatibilidade de Tipos

- **Atribuição Direta (`struct1 = struct2`)**: Válida somente se ambas as estruturas forem de tipos compatíveis (geralmente idênticos).

- **Risco em Estruturas Incompatíveis**:

  - Se houver incompatibilidade entre tipos caractere e não-caractere, o compilador gera um **erro de sintaxe**.

  - Se ambas forem formadas exclusivamente por componentes do tipo caractere (*char-like*), a atribuição é permitida tecnicamente, mas gera **resultados incorretos** (deslocamento e cópia de dados para componentes errados por sobreposição de memória).

---

## Módulo 3: Expressões Modernas (`VALUE` e `CORRESPONDING`)

### 3.1 Construtor de Valor `VALUE #( )`

- **Preenchimento Direto**: Permite construir e preencher uma estrutura em uma única expressão (ex: `connection = VALUE #( airport_from_id = 'ABC' carrier_name = 'LH' )`).

- **Limpeza Implícita**: O uso de `VALUE #( )` limpa todos os valores pré-existentes da estrutura antes de atribuir os novos.

- **Inicialização (`CLEAR`)**: A sintaxe `connection = VALUE #( )` (sem parâmetros) reseta todos os componentes para seus valores iniciais, equivalente ao comando `CLEAR connection`.

- **Estruturas Aninhadas**: Suporta aninhamento de expressões (ex: `message = VALUE #( msgty = 'E' msgid = 'ABC' )`).

### 3.2 Operador `CORRESPONDING #( )`

- **Mapeamento por Nome**: Copia valores entre componentes que possuem o **mesmo nome**, ignorando a ordem ou posição dos campos na estrutura de origem e de destino.

- **Campos Não Mapeados**: Componentes da estrutura de destino que não possuem correspondente na origem são inicializados.

- **Conversão Automática**: Se os tipos dos campos de mesmo nome forem diferentes, o runtime realiza conversões implícitas de acordo com as regras do ABAP.

---

## Módulo 4: Manipulação de Estruturas em ABAP SQL

### 4.1 Correspondência entre `FIELDS` e `INTO`

- **Mapeamento Posicional Padrão**: No `SELECT SINGLE`, o resultado da cláusula `FIELDS` é atribuído à estrutura alvo da cláusula `INTO` **da esquerda para a direita (por posição)**. Se os tipos e comprimentos forem incompatíveis, ocorre erro de runtime.

- **Uso do `FIELDS *`**:

  - Seleciona todos os campos da CDS View ou Tabela DB para uma estrutura tipada com esse mesmo objeto de banco (`INTO @connection_full`).

  - Garante estabilidade sintática em mudanças de esquema, mas deve ser usado com cautela por motivos de performance.

### 4.2 Mapeamento Semântico e Aliases

- **`INTO CORRESPONDING FIELDS OF`**: Garante que os campos lidos do banco sejam atribuídos aos componentes da estrutura pelo nome do campo (e não pela posição).

- **Uso de Aliases (`AS`)**: Quando os nomes das colunas da tabela/view não coincidem com os nomes dos componentes da estrutura, utiliza-se o alias na cláusula `FIELDS` (ex: `FIELDS DepartureAirport AS airport_from_id`).

### 4.3 Declaração Inline (`INTO @DATA(...)`)

- **Derivação Automática**: O compilador cria a estrutura alvo diretamente na cláusula `INTO`, derivando o nome, ordem e tipo de cada componente a partir da cláusula `FIELDS`.

- **Regra**: Não pode ser combinada com `INTO CORRESPONDING FIELDS`.

### 4.4 Consultas Avançadas com SQL Joins

- **Combinação de Tabelas**: Quando não existe CDS View pronta, utilizam-se junções em ABAP SQL (ex: `LEFT OUTER JOIN`).

- **Sintaxe do Join**:

  - Definição de aliases para tabelas no `FROM` (ex: `/dmo/connection AS c`).

  - Separador tilde (`~`) para especificar campos de tabelas específicas no `ON`, `FIELDS` e `WHERE` (ex: `c~airport_from_id = f~airport_id`).

  - O runtime ABAP gerencia automaticamente o campo de cliente (`MANDT/CLIENT`) nas condições de join.

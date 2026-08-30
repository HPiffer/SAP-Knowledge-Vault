---
id: sap-abap-applying-basic-techniques-and-concepts
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
# ABAP - Applying Basic Techniques and Concepts
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Fundamentos & Sintaxe ABAP] ➔ [Módulo 2: Objetos & Tipos de Dados] ➔ [Módulo 3: Processamento de Dados]

                                                                                            │

[Módulo 6: Depuração de Programas (ADT)] ◄─ [Módulo 5: Tabelas Internas Simples] ◄─ [Módulo 4: Estruturas de Controle]

```

---

## Módulo 1: Fundamentos e Sintaxe da Linguagem ABAP

### 1.1 Origem e Evolução do ABAP

- **Definição**: ABAP (Advanced Business Application Programming) é uma linguagem de programação proprietária desenvolvida pela SAP especificamente para a construção de aplicações de negócios no ecossistema SAP.

- **Evolução**: Evoluiu de uma linguagem focada em relatórios para um ambiente de desenvolvimento robusto e otimizado para a nuvem.

### 1.2 Versões da Linguagem ABAP (*ABAP Language Versions*)

Cada programa ABAP possui o atributo de versão de linguagem (*version ID*), que define quais elementos sintáticos e objetos do repositório podem ser utilizados:

1. **Standard ABAP**:

   - Versão universal e irrestrita da linguagem.

   - Suporta todo o escopo tradicional do ABAP em sistemas Unicode.

   - Permite acesso a quase todos os objetos do repositório, exigindo a verificação mínima de Unicode.

2. **ABAP for Key Users**:

   - Versão estritamente restrita voltada para a criação segura de extensões por usuários-chave (*key users*).

   - Suporta apenas um subconjunto muito reduzido de elementos de linguagem e pontos de extensão oficiais da SAP.

3. **ABAP for Cloud Development**:

   - Versão otimizada e restrita para ambientes de nuvem (**SAP BTP ABAP Environment** e **SAP S/4HANA Cloud ABAP Environment**).

   - Restringe comandos legados, acessos diretos ao banco de dados sem CDS e chamadas a objetos não liberados (*released APIs*).

### 1.3 Arquitetura ABAP Cloud e o Princípio Clean Core

- **Pilares do ABAP Cloud**:

  - **ABAP for Cloud Development**: Linguagem otimizada para lógica de negócios.

  - **ABAP Development Tools (ADT)**: Ambiente de desenvolvimento integrado (IDE) baseado no Eclipse.

  - **ABAP Core Data Services (CDS)**: Camada semântica de modelagem de dados e analytics.

  - **ABAP RESTful Application Programming Model (RAP)**: Arquitetura padrão para construção de aplicações e serviços OData.

  - **Public SAP APIs & Extension Points**: Garantia de estabilidade e atualização contínua.

- **Princípio Clean Core**: Estratégia de desenvolvimento que exige manter o código base (core) do SAP S/4HANA sem modificações diretas. Todas as customizações devem ser construídas via ABAP Cloud utilizando APIs públicas liberadas.

### 1.4 Sintaxe Básica do ABAP e Comentários

- **Estrutura de Instruções**: Cada comando ABAP encerra obrigatoriamente com um ponto final (`.`). A linguagem não é sensível a maiúsculas/minúsculas (*case-insensitive*), mas por convenção utiliza-se palavras-chave em maiúsculas.

- **Comentários**:

  - Comentário de linha inteira: Inserção do caractere asterisco (`*`) na primeira coluna da linha.

  - Comentário em qualquer posição: Inserção do caractere aspas duplas (`"`) antes do texto explicativo.

---

## Módulo 2: Objetos de Dados e Tipos de Dados Básicos

### 2.1 Conceito e Categorias de Objetos de Dados

Um objeto de dados no ABAP representa uma área de memória reservada pelo programa durante a execução. O ABAP possui três categorias principais de objetos de dados:

#### A. Variáveis (`DATA`)

- Objeto de dados cujo valor pode ser modificado durante a execução do programa.

- **Regras de Nomenclatura**: Nome de até 30 caracteres, podendo conter letras (A-Z), dígitos (0-9) e sublinhado (`_`). Deve começar com uma letra ou sublinhado.

- **Valor Inicial**: Sempre bem-definido. Se a adição `VALUE` não for informada na declaração, a variável assume o valor inicial padrão do seu tipo de dados.

#### B. Constantes (`CONSTANTS`)

- Objeto de dados cujo valor é fixado no código-fonte e **não pode ser alterado** em tempo de execução. Qualquer tentativa de escrita em uma constante resulta em erro de sintaxe.

- A adição `VALUE` é **obrigatória** na declaração (exemplo: `CONSTANTS c_tax TYPE i VALUE 15.` ou `VALUE IS INITIAL`).

#### C. Literais

- Objetos de dados anônimos (sem nome) com valores rígidos no código. Não podem ser reutilizados via identificador.

- **Tipos de Literais**:

  - **Number Literals**: Números inteiros com ou sem sinal (ex: `12345`). Pertencem ao tipo pré-definido `I` (ou `P` se o valor exceder a capacidade do tipo `I`).

  - **Text Literals**: Cadeias de caracteres delimitadas por aspas simples (ex: `'Texto'`). Pertencem ao tipo `C` e têm comprimento fixo baseado no texto (espaços à direita são ignorados).

  - **String Literals**: Cadeias de caracteres delimitadas por crases (ex: `` `Texto` ``). Pertencem ao tipo `STRING` e preservam todos os espaços.

### 2.2 Origens dos Tipos de Dados em ABAP

1. **ABAP Built-in (Pré-definidos)**: Conjunto de 14 tipos elementares fornecidos pela linguagem para dados numéricos, alfanuméricos e binários (ex: `i` para inteiros, `string` para texto dinâmico, `d` para data `YYYYMMDD`, `c` para texto fixo, `n` para sequência numérica, `p` para número empacotado/decimal).

2. **Instrução `TYPES`**: Permite definir tipos de dados locais no programa para reutilização em múltiplas declarações de variáveis.

3. **ABAP Dictionary (DDIC)**: Gerencia tipos globais acessíveis em todo o sistema (ex: `/dmo/airport_id`). Além da definição técnica, tipos globais agregam metadados semânticos (rótulos de tela, ajuda de pesquisa).

### 2.3 Atribuição de Valores, Conversões e Limpeza

- **Conversão Implícita de Tipos**: O ABAP permite atribuições entre variáveis de tipos diferentes, realizando a conversão automática. Contudo, conversões implícitas devem ser evitadas devido a:

  - Consumo adicional de tempo de execução.

  - Risco de erros de runtime (ex: converter texto não numérico para tipo inteiro `I`).

  - Perda de informação ou truncamento (ex: atribuir uma string longa para um campo `C` de menor tamanho).

- **Instrução `CLEAR`**: Reseta qualquer variável para o valor inicial padrão do seu tipo de dados (desconsiderando o valor informado na adição `VALUE` da declaração).

- **Declarações Inline**: Permitem declarar variáveis diretamente no lado esquerdo de uma atribuição utilizando a sintaxe `DATA(nome_variavel) = ...`.

---

## Módulo 3: Processamento de Dados

### 3.1 Operações Aritméticas e Precisão

- **Expressões Aritméticas**: Combinações de valores, operandos e funções processadas no lado direito de atribuições.

- **Operadores**: Adição (`+`), Subtração (`-`), Multiplicação (`*`), Divisão (`/`).

- **Funções Matemáticas Embutidas**: `sqrt( x )` para raiz quadrada, `ipow( base = x exp = y )` para potenciação inteira.

- **Controle de Precisão Decimal**: Para cálculos que exigem casas decimais exatas (como valores financeiros), utiliza-se o tipo empacotado `P` especificando tamanho e decimais:

  ```abap

  DATA result TYPE p LENGTH 8 DECIMALS 2.

  ```

### 3.2 Processamento e Formatação de Strings

- **String Templates**: Delimitados pelo símbolo de pipe (`| ... |`). Permitem intercalar texto literal com expressões ABAP embutidas.

- **Expressões Embutidas**: Inseridas dentro de chaves `{ ... }`. **Regra sintática obrigatória**: Deve haver ao menos um espaço em branco após a chave de abertura `{` e antes da chave de fechamento `}`.

- **Opções de Formatação Embutidas**:

  - Data: `{ date_var DATE = ISO }` (formato AAAA-MM-DD) ou `{ date_var DATE = USER }` (formato do usuário).

  - Números: `{ num_var NUMBER = USER }`, `{ num_var SIGN = RIGHT }`, `{ num_var STYLE = SCIENTIFIC }`.

- **Operador de Concatenação (`&&`)**: Une duas ou mais expressões/strings em uma única cadeia sem adicionar espaços intermediários automaticamente:

  ```abap

  DATA(full_text) = part1 && | | && part2.

  ```

---

## Módulo 4: Estruturas de Controle

### 4.1 Desvio Condicional

#### A. Estrutura `IF ... ELSEIF ... ELSE ... ENDIF`

- Avalia condições lógicas em sequência. Exige um ponto final (`.`) após cada condição e palavra-chave.

- **Operadores de Comparação**: `=`, `<>`, `>`, `<`, `>=`, `<=`.

- **Operadores Lógicos**: `AND`, `OR`, `NOT` (ordem de precedência sem parênteses: `NOT` > `AND` > `OR`).

- **Expressões Lógicas Especiais**: `IS INITIAL`, `IS NOT INITIAL`, `BETWEEN x AND y`.

- **Funções Predicativas**: `contains( val = text sub = 'A' )` e `line_exists( itab[ key ] )`.

#### B. Estrutura `CASE ... WHEN ... ENDCASE`

- Recomendada quando o desvio depende exclusivamente do valor de uma única variável testada contra múltiplas opções.

- Inclui a cláusula `WHEN OTHERS.` para capturar valores não previstos explicitamente.

### 4.2 Tratamento de Exceções (`TRY ... CATCH`)

- **Exceções em ABAP**: Erros em tempo de execução que terminate o programa em um *runtime error* (short dump) se não forem capturados.

- **Bloco `TRY ... CATCH ... ENDTRY`**: Envolve o código suscetível a falhas no bloco `TRY`. Se ocorrer uma exceção tratável (*catchable exception*), a execução é desviada para o bloco `CATCH` correspondente.

- **Exceções Comuns de Sistema**:

  - `cx_sy_conversion_no_number`: Erro ao tentar converter texto alfanumérico em número.

  - `cx_sy_zerodivide`: Tentativa de divisão por zero.

  - `cx_sy_itab_line_not_found`: Leitura de linha inexistente em tabela interna.

### 4.3 Iterações (Loops)

- **Estrutura `DO ... ENDDO`**:

  - Quantidade fixa de repetições: `DO n TIMES. ... ENDDO.` (se `n = 0`, o bloco não é executado).

  - Loop indefinido com condição de parada: `DO. ... IF cond. EXIT. ENDIF. ... ENDDO.`.

  - **Campo de Sistema `sy-index`**: Armazena o contador de iterações do loop atual (inicia em 1 na primeira passagem).

- **Estrutura `LOOP AT itab INTO wa ... ENDLOOP`**: Iteração sobre linhas de tabelas internas (descrita no Módulo 5).

---

## Módulo 5: Tabelas Internas Simples

### 5.1 Conceito e Declaração de Tabelas Internas

- **Tabela Interna**: Objeto de dados dinâmico em memória capaz de armazenar múltiplas linhas de mesmo tipo de dados (*row type*). O valor inicial é uma tabela vazia (0 linhas).

- **Formas de Declaração**:

  - Declaração direta no comando `DATA`:

    ```abap

    DATA numbers TYPE TABLE OF i.

    ```

  - Declaração via tipo local (`TYPES`):

    ```abap

    TYPES tt_strings TYPE TABLE OF string.

    DATA texts TYPE tt_strings.

    ```

  - Declaração via tipo global do ABAP Dictionary:

    ```abap

    DATA texts TYPE string_table.

    ```

### 5.2 Operações Essenciais em Tabelas Internas Simples

1. **Adicionar Linhas (`APPEND`)**: Insere um novo registro no final da tabela interna.

   ```abap

   APPEND 4711 TO numbers.

   APPEND DATA(new_val) TO numbers.

   ```

2. **Limpar Tabela (`CLEAR`)**: Remove todos os registros da tabela interna, retornando o número de linhas a zero.

3. **Leitura por Expressão de Tabela (`itab[ index ]`)**: Acessa uma linha específica pelo seu índice numérico (1-indexed).

   ```abap

   DATA(val) = numbers[ 2 ].

   ```

   *Nota*: Se o índice solicitado não existir na tabela, a exceção `cx_sy_itab_line_not_found` é disparada.

4. **Iteração (`LOOP AT ... ENDLOOP`)**: Percorre a tabela registro por registro.

   - **Campo de Sistema `sy-tabix`**: Contém o índice da linha processada na iteração atual.

   - **Declaração Inline no Loop**:

     ```abap

     LOOP AT numbers INTO DATA(row_value).

       out->write( |Linha { sy-tabix }: { row_value }| ).

     ENDLOOP.

     ```

---

## Módulo 6: Depuração de Programas ABAP (ABAP Debugger no ADT)

### 6.1 Início da Depuração e Perspectiva *ABAP Debug*

- **Breakpoints**: Para iniciar o debugger no ADT (Eclipse), define-se um *breakpoint* dando um duplo clique (ou botão direito -> *Toggle Breakpoint*) na margem esquerda do editor. O programa deve estar ativado (`Ctrl + F3`).

- **Persistência**: Breakpoints são vinculados ao usuário e permanecem ativos mesmo após fechar o Eclipse.

- **Transição de Perspectiva**: Ao atingir o breakpoint durante a execução (`F9`), o ADT solicita a alternância para a perspectiva *ABAP Debug*.

### 6.2 Comandos de Controle de Execução de Código

- **Step Into (`F5`)**: Executa uma única instrução. Se a linha contiver uma chamada a método ou estrutura de controle, o debugger entra no bloco interno para análise detalhada.

- **Step Over (`F6`)**: Executa a linha atual por completo sem detalhar blocos/métodos internos (ideal para saltar chamadas como `out->write( )`).

- **Resume (`F8`)**: Continua a execução normal do programa até encontrar o próximo breakpoint ou encerrar a aplicação.

- **Run to Line (`Shift + F8`)**: Executa o programa até a linha onde o cursor está posicionado no editor.

- **Jump to Line (`Shift + F12`)**: Altera o ponteiro de execução diretamente para a linha selecionada sem executar o código intermediário. (*Atenção*: Não reverte alterações de variáveis já feitas).

- **Terminate**: Encerra a sessão de depuração imediatamente.

### 6.3 Breakpoints Especiais e Watchpoints

- **Statement Breakpoint**: Interrompe o programa sempre que um comando ABAP específico for atingido no código (exemplo: instrução `CLEAR` ou `EXIT`).

- **Exception Breakpoint**: Interrompe o programa assim que uma exceção específica for disparada.

- **Conditional Breakpoint**: Interrompe a execução apenas se uma condição personalizada for verdadeira (exemplo: `sy-index > 20`).

- **Watchpoints**: Monitoram o valor de uma variável específica e interrompem a execução no exato momento em que seu conteúdo sofrer alteração.

### 6.4 Inspeção e Modificação de Dados em Tempo de Execução

- **Visão *Variables***: Permite visualizar e alterar o valor de variáveis escalares (clique com botão direito -> *Change Value...*).

- **Visão *ABAP Internal Table***: Permite inspecionar o conteúdo completo de tabelas internas, além de alterar valores de linhas existentes, inserir novas linhas (*Insert Row...*) ou excluir registros (*Delete Rows...*).

---
id: sap-abap-working-with-local-classes
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
# ABAP - Working with Local Classes
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Definição de Classes Locais] ➔ [Módulo 2: Instanciação e Referências]

                                                        │

[Módulo 4: Encapsulamento e Construtores] ◄─ [Módulo 3: Métodos e Exceções]

```

---

## Módulo 1: Definição de Classes Locais (`Defining a Local Class`)

### 1.1 Classes Locais vs. Classes Globais

- **Classes Globais**: Armazenadas centralmente no repositório ABAP em um *Class Pool* próprio. Podem servir como programa principal e reutilizadas por outros objetos ABAP.

- **Classes Locais**: Definidas dentro de um programa ABAP ou na aba **Local Types** de uma classe global no ADT Eclipse. São visíveis e acessíveis exclusivamente dentro do programa onde foram criadas.

- **Template no ADT**: Digitar `lcl` + `Ctrl + Space` no editor ADT gera a estrutura base para uma classe local.

### 1.2 Estrutura da Classe: Definição e Implementação

Toda classe ABAP é dividida em duas partes principais:

1. **Definição (`DEFINITION`)**: Declara a assinatura da classe, seus tipos, constantes, atributos e métodos.

   ```abap

   CLASS lcl_connection DEFINITION.

     ...

   ENDCLASS.

   ```

2. **Implementação (`IMPLEMENTATION`)**: Contém o código executável dos métodos declarados. É obrigatória quando há métodos executáveis na definição.

   ```abap

   CLASS lcl_connection IMPLEMENTATION.

     ...

   ENDCLASS.

   ```

### 1.3 Seções de Visibilidade

A definição da classe é subdividida em até três seções de visibilidade que devem respeitar estritamente a ordem de declaração:

1. **`PUBLIC SECTION`**: Componentes acessíveis por qualquer chamador externo e internamente na classe.

2. **`PROTECTED SECTION`**: Componentes acessíveis apenas dentro da própria classe e por suas subclasses.

3. **`PRIVATE SECTION`**: Componentes acessíveis estritamente dentro da própria classe.

> **Nota de Regra**: Nenhuma declaração é permitida entre a instrução `CLASS... DEFINITION` e a primeira seção de visibilidade.

### 1.4 Declaração de Atributos

- **Atributos de Instância (`DATA`)**: Alocados individualmente para cada objeto criado.

- **Atributos Estáticos (`CLASS-DATA`)**: Compartilhados por todas as instâncias da classe e existentes uma única vez na memória do programa.

- **Seletor Componente Estático (`=>`)**: Para acessar componentes estáticos fora da classe, utiliza-se a sintaxe `NomeClasse=>componente` (sem espaços ao redor da seta dupla).

---

## Módulo 2: Instanciação e Gerenciamento de Objetos (`Creating Instances of a Class`)

### 2.1 Variáveis de Referência e o Operador `NEW`

- **Variável de Referência**: Declaração especial que armazena o endereço de memória de um objeto. Seu valor inicial é a **referência NULA (`NULL`)**.

  ```abap

  DATA connection TYPE REF TO lcl_connection.

  ```

- **Operador `NEW`**: Instancia dinamicamente o objeto na memória e retorna seu endereço. O caractere `#` infere automaticamente o tipo da variável de destino:

  ```abap

  connection = NEW #( ).

  ```

- **Seletor de Instância (`->`)**: Para acessar atributos/métodos de uma instância fora da classe, utiliza-se a sintaxe `variavel_ref->componente`.

### 2.2 Carregamento na Memória e Garbage Collector

- **Carregamento da Classe**: Na primeira vez que uma classe é desempenhada (seja ao acessar um componente estático ou instanciar um objeto), a definição da classe e seus atributos estáticos são carregados na memória do programa.

- **Perda de Referência**: Se uma variável de referência for sobrescrita com um novo `NEW #( )` ou limpa via `CLEAR`, o endereço da instância anterior é perdido.

- **Garbage Collector**: Mecanismo automático do runtime ABAP que roda periodicamente para identificar e desalocar objetos na memória que não possuem mais nenhuma variável de referência apontando para eles, prevenindo estouro de memória.

### 2.3 Gerenciamento de Instâncias em Tabelas Internas

Para manter múltiplas instâncias vivas na memória sem sobrescrever referências, armazena-se as variáveis de referência em uma tabela interna de objetos:

```abap

DATA connections TYPE TABLE OF REF TO lcl_connection.

  

connection = NEW #( ).

connection->carrier_id = 'LH'.

APPEND connection TO connections.

```

---

## Módulo 3: Definição, Implementação e Chamada de Métodos (`Defining and Calling Methods`)

### 3.1 Assinatura de Métodos

Os métodos são declarados com `METHODS` (instância) ou `CLASS-METHODS` (estáticos) e contêm uma assinatura composta por parâmetros e exceções:

- **`IMPORTING`**: Parâmetros de entrada recebidos do chamador. Por padrão são obrigatórios, mas podem ser tornados opcionais via `OPTIONAL` ou `DEFAULT <valor>`. Não podem ser alterados dentro do método.

- **`EXPORTING`**: Parâmetros de saída retornados pelo método ao chamador. São todos opcionais para o chamador.

- **`CHANGING`**: Parâmetros de entrada e saída que o método pode modificar e devolver.

- **`RETURNING`**: Parâmetro único de retorno para métodos funcionais. Exige a sintaxe de passagem por valor `VALUE(r_output)`.

- **`RAISING`**: Declara as exceções que o método pode disparar.

### 3.2 Implementação e Autorreferência (`me`)

- **Bloco de Código**: Cada método definido deve ser implementado via `METHOD <nome>... ENDMETHOD` na `IMPLEMENTATION` da classe.

- **Quick Fix de Ausência no ADT**: `Ctrl + 1` sobre o nome da instrução `METHODS` gera automaticamente os blocos de implementação ausentes.

- **Variável Autorreferencial `me->`**: Variável implícita disponível em métodos de instância que aponta para o próprio objeto em execução. É utilizada para desambiguar atributos da classe quando parâmetros do método possuem o mesmo nome:

  ```abap

  METHOD set_attributes.

    me->carrier_id    = i_carrier_id.

    me->connection_id = i_connection_id.

  ENDMETHOD.

  ```

### 3.3 Disparo e Tratamento de Exceções

- **Disparo**: Utiliza-se a instrução `RAISE EXCEPTION TYPE cx_abap_invalid_value.` para interromper a execução do método imediatamente.

- **Tratamento**: A chamada do método deve ser envolvida em um bloco `TRY... CATCH [cx_class]... ENDTRY`:

  ```abap

  TRY.

      connection->set_attributes( i_carrier_id = 'LH' i_connection_id = '0400' ).

      APPEND connection TO connections.

    CATCH cx_abap_invalid_value.

      out->write( `Falha na chamada do método` ).

  ENDTRY.

  ```

### 3.4 Métodos Funcionais

Métodos que possuem um único parâmetro `RETURNING VALUE(...)` são chamados de **métodos funcionais**. A principal vantagem é que seu resultado pode ser consumido diretamente em expressões ABAP:

```abap

" Atribuição direta com declaração inline

DATA(result) = connection->get_output( ).

  

" Entrada para o método de saída do console

out->write( connection->get_output( ) ).

```

---

## Módulo 4: Encapsulamento e Construtores (`Using Encapsulation to Ensure Consistency`)

### 4.1 Conceito de Encapsulamento

- **Consistência de Dados**: O programa cliente não deve modificar atributos diretamente na memória. O acesso deve ser mediado por métodos que validam a integridade dos dados antes da alteração.

- **Proteção de Visibilidade**:

  1. Mover atributos para a `PRIVATE SECTION` (Quick Fix no ADT: `Ctrl + 1` -> *Make private*).

  2. Adicionar a cláusula `READ-ONLY` a atributos públicos para permitir leitura externa e proibir escrita direta.

### 4.2 Construtor de Instância (`constructor`)

- **Execução Automática**: Método reservado de instância (`METHODS constructor`) executado automaticamente e uma única vez no momento da criação da instância via `NEW`. Não pode ser chamado explicitamente pelo código.

- **Sintaxe e Parâmetros**: Aceita apenas parâmetros `IMPORTING` e exceções (`RAISING`). Parâmetros `EXPORTING`, `CHANGING` ou `RETURNING` são proibidos.

- **Passagem de Parâmetros no `NEW`**: Os parâmetros do construtor são passados diretamente no operador `NEW` (sem a palavra `EXPORTING`):

  ```abap

  connection = NEW #( i_carrier_id = 'LH' i_connection_id = '0400' ).

  ```

### 4.3 Construtor Estático / de Classe (`class_constructor`)

- **Execução Automática**: Método reservado estático (`CLASS-METHODS class_constructor`) executado uma única vez para toda a classe quando a classe é endereçada pela primeira vez na execução do programa (primeira instanciação, acesso a atributo público estático ou chamada de método estático).

- **Sem Assinatura**: Não possui nenhum parâmetro ou exceção, pois não é possível prever exatamente quando o primeiro acesso à classe ocorrerá.

- **Caso de Uso**: Inicialização dinâmica de atributos estáticos (`CLASS-DATA`).

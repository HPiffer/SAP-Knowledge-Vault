---
id: sap-abap-reading-data-from-the-database
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud, ABAP SQL, CDS]
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
# ABAP - Reading Data from the Database
## Fluxo de Aprendizagem Recomendado

```

┌────────────────────────────────────────────────────────────────────────┐

│  MÓDULO 1: Investigando a Definição de Tabelas de Banco de Dados        │

│  - RDBMS & SAP HANA | Chaves Primárias | Isolamento por Cliente (MANDT) │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│  MÓDULO 2: Implementando Instruções SELECT Básicas em ABAP SQL         │

│  - Sintaxe SELECT SINGLE | Host Variables (@) | sy-subrc | Exceções     │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

                                    ▼

┌────────────────────────────────────────────────────────────────────────┐

│  MÓDULO 3: Trabalhando com Core Data Services (CDS Views)              │

│  - View Entities | Associações & Path Expressions | Anotações & ADT    │

└────────────────────────────────────────────────────────────────────────┘

```

---

## Módulo 1: Investigando a Definição de Tabelas de Banco de Dados

### 1.1 Conceito de Banco de Dados Relacional no SAP ABAP

- **Arquitetura de Banco de Dados**:

  - Todo sistema ABAP executa sobre um Sistema Gerenciador de Banco de Dados Relacional (**RDBMS**).

  - Historicamente, o ABAP suportava múltiplos SGBDs de diferentes fornecedores (independência de banco).

  - Nas versões recentes de ABAP e no **ABAP Environment no SAP BTP**, o único banco de dados suportado é o **SAP HANA**.

- **Estrutura de Tabelas**:

  - Os dados são organizados em tabelas bidimensionais compostas por **linhas** (registros) e **colunas** (campos).

  - **Relações**: As tabelas relacionam-se entre si através de valores correspondentes em campos-chave (ex.: código da companhia aérea `AA` relacionando-se à tabela de nomes das companhias).

### 1.2 Chaves Primárias e Isolamento por Cliente (*Client Handling*)

- **Chave Primária (*Primary Key*)**:

  - Uma sequência de colunas no início da tabela que garante que cada linha seja identificada de forma única.

- **Desenvolvimento Cross-Client vs. Dados Client-Specific**:

  - As definições de tabelas no ABAP Dictionary são objetos de desenvolvimento **cross-client** (válidos para todo o sistema).

  - No entanto, a maioria das tabelas armazena dados de negócio **client-specific** (específicos de um mandante/cliente).

  - **Campo de Cliente**: Tabelas específicas de cliente possuem o campo de mandante (`CLIENT` ou `MANDT`) como o primeiro campo da chave primária.

  - **Tratamento Automático de Cliente**: A interface de banco de dados do ABAP (*Database Interface*) adiciona automaticamente um filtro para o cliente ativo do usuário logado nas consultas ABAP SQL, garantindo o isolamento de dados sem necessidade de cláusulas manuais.

### 1.3 Ferramentas de Análise de Tabelas no ABAP Development Tools (ADT)

- **Editor de Definição de Tabela**: Editor dedicado no Eclipse ADT para visualizar campos, tipos de dados, chaves primárias e propriedades técnicas da tabela.

- **Data Preview (F8)**:

  - Ferramenta para visualizar e analisar o conteúdo armazenado na tabela física.

  - **Como Acessar**: Posicionar o cursor na definição da tabela e pressionar `F8`, ou clicar com o botão direito e selecionar *Open With* → *Data Preview*.

- **Localização de Objetos**:

  - Atalho `Ctrl + Shift + A` (*Open ABAP Development Object*) para buscar tabelas (ex.: `/DMO/CONNECTION`).

  - Tecla `F2` (*Element Information*) sobre o nome da tabela para exibir detalhes estruturais rápidos.

---

## Módulo 2: Implementando Instruções SELECT Básicas em ABAP SQL

### 2.1 Visão Geral do SQL no ABAP e Componentes Padrão

O SQL padrão é dividido em três componentes principais:

1. **DML (*Data Manipulation Language*)**: Comandos de manipulação de dados (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). No ABAP, estes comandos são implementados via **ABAP SQL**.

2. **DDL (*Data Definition Language*)**: Comandos para criação e alteração de estruturas de banco de dados. No ecossistema SAP, a DDL é gerenciada via editores dedicados do ADT (como editores de tabelas e CDS views), não por comandos executados em programas ABAP.

3. **DCL (*Data Control Language*)**: Controle de permissões de acesso ao banco. O ABAP possui seu próprio conceito de autorização de usuário em nível de aplicação, não utilizando DCL clássico no banco de dados.

### 2.2 Arquitetura do ABAP SQL e Database Interface

- **Evolução de Open SQL para ABAP SQL**: Renomeado a partir do release 7.53 para refletir o foco exclusivo no SAP HANA.

- **Database Interface**:

  - Componente de runtime que traduz o ABAP SQL genérico em **Native SQL** específico executado pelo SAP HANA.

  - Garante compatibilidade de código legado e realiza tarefas automáticas como o filtro de mandante (*client handling*).

### 2.3 Estrutura e Cláusulas da Instrução SELECT

A sintaxe moderna do comando `SELECT` em ABAP SQL é dividida em cláusulas obrigatórias e opcionais:

```abap

SELECT SINGLE

  FROM /dmo/connection

FIELDS airport_from_id, airport_to_id

 WHERE carrier_id    = @i_carrier_id

   AND connection_id = @i_connection_id

  INTO ( @airport_from_id, @airport_to_id ).

```

#### Descrição Detalhada das Cláusulas:

- **`SELECT SINGLE`**: Indica a leitura de apenas um registro único da tabela. Exige a especificação de valores de filtro para todas as chaves primárias da tabela na cláusula `WHERE`.

- **`FROM`**: Especifica a fonte de dados (tabela do banco de dados ou CDS View entity).

- **`FIELDS`**: Especifica as colunas a serem lidas, separadas por vírgulas.

  - *Boa prática*: Evitar `FIELDS *` a menos que absolutamente necessário, pois a leitura de todas as colunas impacta negativamente o desempenho.

- **`WHERE`**: Condição de filtragem dos registros usando operadores lógicos (`=`, `AND`, `OR`, `NOT`).

  - *Atenção*: Consultas sem a cláusula `WHERE` leem todos os registros do mandante e devem ser evitadas para prevenir problemas críticos de performance.

- **`INTO`**: Especifica a variável, tupla `( @var1, @var2 )` ou estrutura de destino onde os dados lidos serão armazenados.

- **Escape de Variáveis ABAP com o Prefixo `@`**:

  - Todas as variáveis, constantes ou parâmetros de programa ABAP referenciados dentro de uma instrução ABAP SQL **devem** ser prefixados com o símbolo `@` (*host variables*). Isso previne ambiguidades entre nomes de campos da tabela e objetos de dados ABAP.

### 2.4 Controle de Retorno com `sy-subrc` e Tratamento de Exceções

- **Campo de Sistema `sy-subrc`**:

  - `sy-subrc = 0`: A instrução `SELECT` foi executada com sucesso e retornou dados.

  - `sy-subrc = 4`: Nenhum registro correspondente aos critérios do `WHERE` foi encontrado (resultado vazio).

- **Comportamento Crítico em Caso de Erro**:

  - Se a busca falhar (`sy-subrc <> 0`), o ABAP SQL **NÃO altera nem limpa** as variáveis de destino especificadas na cláusula `INTO`. As variáveis mantêm seus valores anteriores.

  - **Regra de Ouro**: Sempre avaliar o conteúdo de `sy-subrc` imediatamente após cada comando `SELECT`.

- **Tratamento de Erros em Construtores/Métodos**:

  - Ao verificar `sy-subrc <> 0`, é recomendado disparar exceções de aplicação (ex.: `RAISE EXCEPTION TYPE cx_abap_invalid_value`) para interromper o fluxo e notificar o chamador sobre dados inválidos.

---

## Módulo 3: Trabalhando com ABAP Core Data Services (CDS Views)

### 3.1 Conceito e Arquitetura do ABAP CDS

- **ABAP Core Data Services (ABAP CDS)**: Infraestrutura no ABAP para definição de modelos de dados semânticos e reutilizáveis diretamente na camada de banco de dados (SAP HANA).

- **CDS View Entities**: Definidas em objetos de repositório do tipo *Data Definition* usando a sintaxe DDL `DEFINE VIEW ENTITY`.

- **Vantagens em Relação à Leitura Direta de Tabelas**:

  - Encapsulamento de lógica SQL complexa (junções, agregações, cálculos e expressões condicionais).

  - Nomes de elementos amigáveis e padronizados através de aliases (`AS`).

  - Definição de **Associações** para navegação simplificada entre entidades relacionadas.

  - Enriquecimento do modelo através de **Anotações** (metadados para UI Fiori, segurança e frameworks como o RAP).

### 3.2 Estrutura de uma CDS View Entity

Exemplo de definição da entidade `/DMO/I_Connection`:

```cds

@AccessControl.authorizationCheck: #CHECK

@EndUserText.label: 'Connection View Entity'

define view entity /DMO/I_Connection

  as select from /dmo/connection

  association [1..*] to /DMO/I_Carrier as _Airline

    on $projection.AirlineID = _Airline.AirlineID

{

  key carrier_id      as AirlineID,

  key connection_id   as ConnectionID,

      airport_from_id as DepartureAirport,

      airport_to_id   as DestinationAirport,

      _Airline // Exposição da associação

}

```

#### Componentes Principais:

- **`DEFINE VIEW ENTITY`**: Declara o nome da entidade CDS e a fonte de dados principal (`as select from`).

- **Lista de Elementos `{ ... }`**: Define os campos retornados pela view, onde a palavra-chave `key` identifica as chaves da view e `AS` atribui aliases legíveis.

- **Associações (`association`)**: Relacionamento declarativo sob demanda com outra view entity (`/DMO/I_Carrier`).

- **Exposição da Associação**: Adicionar o nome da associação (`_Airline`) na lista de elementos disponibiliza o acesso aos dados da entidade relacionada para os consumidores.

- **Anotações (`@`)**:

  - *Entity Annotations*: Posicionadas antes da definição da view, aplicam-se à entidade inteira.

  - *Element Annotations*: Posicionadas dentro da lista de elementos, definem metadados específicos de cada coluna.

### 3.3 Consumo de CDS Views em ABAP SQL com Path Expressions

Ao utilizar uma CDS View entity no `FROM` de um comando `SELECT`, o desenvolvedor pode acessar dados de tabelas/views relacionadas usando **Path Expressions** (*expressões de caminho*) através das associações expostas, sem a necessidade de escrever comandos `JOIN` manuais.

```abap

SELECT SINGLE

  FROM /DMO/I_Connection

FIELDS DepartureAirport,

       DestinationAirport,

       \_Airline-Name AS carrier_name

 WHERE AirlineID    = @i_carrier_id

   AND ConnectionID = @i_connection_id

  INTO ( @airport_from_id, @airport_to_id, @carrier_name ).

```

#### Regras de Sintaxe para Path Expressions:

- O nome da associação é precedido obrigatoriamente por uma barra invertida (`\`).

- A navegação até os campos da entidade associada utiliza o hífen (`-`), ex.: `\_Airline-Name`.

- O filtro da cláusula `WHERE` e a seleção de campos utilizam os aliases semânticos definidos na CDS View (`AirlineID`, `ConnectionID`, `DepartureAirport`).

### 3.4 Ferramentas e Recursos no ADT para CDS Views

- **Data Preview em CDS Views (`F8`)**: Exibe os dados processados pela view. Permite navegar interativamente pelos dados das associações clicando com o botão direito em uma linha e selecionando *Follow Association*.

- **Where-Used List (`Ctrl + Shift + G`)**:

  - Permite localizar todos os objetos (incluindo CDS Views) que utilizam uma determinada tabela do banco de dados como fonte.

  - Facilita a identificação de CDS Views existentes para reutilização antes de criar novas estruturas.

- **Informações do Elemento (`F2`)**: Permite inspecionar a definição e os campos de uma entidade CDS ou de sua associação diretamente a partir do código ABAP.

---
id: sap-abap-implementing-database-updates-using-business-objects
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud, RAP]
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
# ABAP - Implementing Database Updates Using Business Objects
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Estrutura do BO no RAP] ➔ [Módulo 2: Interfaces e Projeções] ➔ [Módulo 3: Conceitos e Tipos de EML]

                                                                                    │

                                   [Módulo 5: Modificação e COMMIT] ◄─ [Módulo 4: Leitura de Dados com READ]

```

---

## Módulo 1: Estrutura e Anatomia de um Business Object (BO) no RAP

### 1.1 O que é um Business Object?

No **ABAP RESTful Application Programming Model (RAP)**, um Business Object (BO) encapsula a estrutura de dados e as regras de negócio de uma entidade relacional (como uma agência de viagens ou um pedido):

- **Data Definitions (CDS Views)**: Definem a estrutura de dados e os campos da entidade (ex: chave `AgencyID`, nome, endereço).

- **Behavior Definition (BDEF)**: Especifica os comportamentos e operações permitidas na entidade (`create`, `update`, `delete`), além de declarar verificações e lógicas personalizadas.

### 1.2 Componentes da Behavior Definition

- **Operações Padrão**: Permite habilitar ou restringir operações de escrita (`create`, `update`, `delete`).

- **Validations**: Checagens acionadas durante a alteração/criação de dados (ex: `trigger create` ou `trigger field Name`) para garantir que os dados atendam aos requisitos de negócio antes de salvar.

- **Determinations**: Lógicas automáticas executadas para preencher ou modificar campos com base em disparos de eventos.

- **Actions**: Operações de negócio personalizadas que não se enquadram no CRUD padrão (ex: aprovar pedido de compra, cancelar reserva).

- **Mapeamento de Tabelas**: Conecta o BO às tabelas de banco de dados para dados ativos (*active data*) e rascunhos (*draft data*), além de gerenciar bloqueios de concorrência (*locks*) e verificações de autorização.

### 1.3 Behavior Implementation (Behavior Pool)

- **Classe ABAP Global**: Declarada no BDEF via `managed implementation in class <class_name> unique;` com a adição especial `FOR BEHAVIOR OF <bdef_name>`.

- **Classes Locais (*Local Types*)**: A lógica real de *validations*, *determinations* e *actions* fica em classes locais (ex: `lhc_agency`) dentro do tab *Local Types* da classe global.

- **Managed vs. Unmanaged Scenarios**:

  - **Managed**: O runtime do RAP gerencia automaticamente o salvamento, leitura e bloqueio das operações CRUD padrão.

  - **Unmanaged**: O desenvolvedor deve codificar manualmente todas as operações CRUD na *Behavior Implementation*.

---

## Módulo 2: Camadas de Consumo — BO Interfaces e BO Projections

### 2.1 Formas de Consumo de um BO

Um Business Object pode ser consumido de duas formas principais:

1. **Business Service**: Exposição via protocolo OData para aplicações frontend (ex: SAP Fiori Elements).

2. **Código ABAP**: Acesso direto em memória ou segundo plano utilizando **Entity Manipulation Language (EML)**.

### 2.2 Recomendações de Arquitetura (Convenções SAP)

Para manter a estabilidade do sistema e evitar acoplamento direto com o BO base, a SAP define duas camadas abstratas:

| Camada | Propósito | Convenção de Nome | BDEF Header | Provider Contract |

| :--- | :--- | :--- | :--- | :--- |

| **BO Definition (Base)** | Estrutura e comportamento raiz do BO | `R_<...>` (ex: `/DMO/R_AgencyTP`) | `managed implementation...` | Base CDS Entity |

| **BO Interface** | Camada pública e estável liberada para consumo via EML em código ABAP | `I_<...>` (ex: `/DMO/I_AgencyTP`) | `interface;` | `provider contract transactional_interface` |

| **BO Projection** | Projeção específica exposta para serviços de UI (Fiori) | `C_<...>` (ex: `C_AgencyTP`) | `projection;` | `provider contract transactional_query` |

> **Regra de Ouro**: O código ABAP que consome um BO via EML deve **sempre** acessar a **BO Interface** (`I_<...>`), e não a definição base diretamente.

---

## Módulo 3: Conceitos da Entity Manipulation Language (EML) e Tipos Derivados

### 3.1 O que é EML?

A **Entity Manipulation Language (EML)** é um conjunto de instruções nativas da linguagem ABAP projetado para criar, ler, atualizar e deletar dados de Business Objects mantendo a integridade do modelo RAP.

### 3.2 Tipos Derivados de Comportamento (*Derived Types*)

Ao criar um BDEF, o sistema gera automaticamente estruturas de dados especiais chamadas *Derived Behavior Definition Types*, declaradas com a adição `TYPE TABLE FOR ...`:

- **`TYPE TABLE FOR READ IMPORT <bdef_name>`**: Tabela interna contendo a chave primária da entidade (`agencyID`), a indicação de rascunho (`%is_draft`) e a estrutura de controle (`%control`).

- **`TYPE TABLE FOR READ RESULT <bdef_name>`**: Tabela interna de saída que recebe o conjunto de dados resultante da leitura.

- **`TYPE TABLE FOR UPDATE <bdef_name>`**: Tabela interna contendo todos os campos do BO a serem modificados e a estrutura `%control`.

### 3.3 Estrutura de Controle (`%control`) e Aliases

- **`%control`**: Estrutura interna utilizada pelo RAP para indicar dinamicamente quais campos do BO estão sendo lidos ou modificados na instrução EML.

- **Aliases de Entidades**: Ao executar comandos EML, refere-se à Behavior Definition após a cláusula `OF` (ex: `OF /dmo/i_agencytp`) e ao Alias da entidade após `ENTITY` (ex: `ENTITY /dmo/agency`).

---

## Módulo 4: Leitura de Dados de BOs com EML (`READ ENTITIES`)

### 4.1 Instrução `READ ENTITIES`

Para consultar dados mantidos por um BO, utiliza-se a instrução `READ ENTITIES`.

### 4.2 Sintaxe e Variações de Seleção

```abap

DATA agencies_read TYPE TABLE FOR READ IMPORT /dmo/i_agencytp.

DATA agencies_out  TYPE TABLE FOR READ RESULT /dmo/i_agencytp.

  

agencies_read = VALUE #( ( agencyid = '070001' ) ).

  

READ ENTITIES OF /dmo/i_agencytp

  ENTITY /dmo/agency

  ALL FIELDS WITH agencies_read

  RESULT agencies_out.

```

- **`ALL FIELDS`**: Retorna todos os atributos disponíveis no BO.

- **`FIELDS ( field1 field2 )`**: Seleciona apenas campos específicos.

  > *Nota de Sintaxe*: Na lista de campos da EML, **não** são utilizadas vírgulas para separar as colunas. As chaves primárias são sempre retornadas automaticamente.

---

## Módulo 5: Modificação e Persistência de Dados (`MODIFY ENTITIES` e `COMMIT ENTITIES`)

### 5.1 Restrições de Modificação no BDEF

Operações de escrita só são permitidas via EML se a BO Interface expor explicitamente as diretivas no seu BDEF:

```abap

use create;

use update;

use delete;

```

A tentativa de executar `MODIFY ENTITIES` em uma operação não liberada gera erro de compilação.

### 5.2 Alterando Registros com `MODIFY ENTITIES`

O comando `MODIFY ENTITIES` aplica as alterações no buffer transacional em memória (*transactional buffer*):

```abap

DATA agencies_upd TYPE TABLE FOR UPDATE /dmo/i_agencytp.

  

agencies_upd = VALUE #( ( agencyid = '070001' name = 'Novo Nome da Agência' ) ).

  

MODIFY ENTITIES OF /dmo/i_agencytp

  ENTITY /dmo/agency

  UPDATE FIELDS ( name )

    WITH agencies_upd.

```

### 5.3 Persistência de Dados com `COMMIT ENTITIES`

- **Fora da Behavior Implementation**: Quando a EML é chamada a partir de uma classe de aplicação (ex: `IF_OO_ADT_CLASSRUN`), report ou serviço externo, as alterações em memória só são gravadas no banco de dados após a execução do comando:

  ```abap

  COMMIT ENTITIES.

  ```

- **Dentro da Behavior Implementation**: É estritamente **proibido** utilizar `COMMIT ENTITIES` dentro do código das *validations/determinations* na classe do BO (o salvamento é gerenciado pelo próprio ciclo de vida da transação).

---

## Resumo do Fluxo de Trabalho Prático em ABAP

1. **Análise**: Abrir a BO Interface (`/DMO/I_AGENCYTP`) e navegar via `F3` até a definição base (`/DMO/R_AGENCYTP`) e a Behavior Implementation (`/DMO/BP_R_AGENCYTP`).

2. **Declaração**: Definir tabelas internas com tipos derivados (`TYPE TABLE FOR UPDATE /dmo/i_agencytp`).

3. **Preenchimento**: Utilizar o construtor `VALUE #( ( ... ) )` fornecendo a chave primária e os novos valores.

4. **Execução Transacional**: Chamar `MODIFY ENTITIES` especificando a lista `FIELDS ( ... )`.

5. **Persistência e Teste**: Executar `COMMIT ENTITIES`, emitir confirmação no console via `out->write( )` e validar o resultado no *Data Preview* (`Ctrl + Shift + A` ➔ *Open With Data Preview*).

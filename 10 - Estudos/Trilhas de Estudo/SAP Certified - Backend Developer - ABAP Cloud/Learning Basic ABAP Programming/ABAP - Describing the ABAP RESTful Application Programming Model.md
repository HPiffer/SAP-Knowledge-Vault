---
id: sap-abap-describing-the-abap-restful-application-programming-model
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud, RAP, OData]
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
# ABAP - Describing the ABAP RESTful Application Programming Model
## Fluxo de Aprendizagem Recomendado

```

[Módulo 1: Visão Geral & Arquitetura RAP] ➔ [Módulo 2: Geração da Aplicação & Serviço OData]

                                                                            │

[Módulo 4: Experiência do Usuário (UI & UX)] ◄─ [Módulo 3: Lógica de Negócio (ABAP Logic)]

```

---

## Módulo 1: Visão Geral e Arquitetura do Modelo RAP

### 1.1 Conceito do ABAP RESTful Application Programming Model (RAP)

- **Propósito**: É o modelo de programação moderno da SAP para a construção de serviços OData V2/V4 transacionais, analíticos e de leitura, otimizados para o **SAP Fiori Elements** e para o ambiente **SAP BTP ABAP Environment** / **SAP S/4HANA Cloud**.

- **Arquitetura Stateless**: Como as aplicações RESTful operam de forma sem estado (*stateless*), a consistência dos dados e o controle de concorrência são gerenciados por uma combinação de bloqueios exclusivos e marcações temporais.

### 1.2 Modelagem de Banco de Dados e Objetos no ABAP Dictionary

- **Definição da Tabela de Banco de Dados**:

  - **Client Field**: O primeiro campo da tabela deve ser o mandante (`MANDT`), com o tipo de dados `abap.clnt`.

  - **Chave Primária Técnica (UUID)**: Recomenda-se utilizar uma chave técnica única utilizando o elemento de dados `sysuuid_x16`. O runtime do RAP atribui o valor GUID de 16 bytes automaticamente durante a criação do registro.

- **Elementos de Dados (Data Elements) e Semântica**:

  - O uso de *Data Elements* (que se referenciam a Domínios reaproveitáveis, como `/DMO/CITY`) encapsula definições técnicas e metadados semânticos.

  - Os rótulos de campo (*field labels*) definidos no elemento de dados são herdados e exibidos automaticamente nas colunas e formulários das telas do SAP Fiori.

- **Campos Administrativos e Controle de ETags**:

  - Campos de auditoria como criador (`local_created_by`), data de criação (`local_created_at`), modificador (`local_last_changed_by`) e timestamps de modificação (`local_last_changed_at` e `last_changed_at`) são obrigatórios.

  - **ETags**: O timestamp `last_changed_at` serve como campo ETag. O framework compara o valor do ETag antes do salvamento para garantir que o registro não foi alterado por outro usuário desde a última leitura.

---

## Módulo 2: Geração da Aplicação e Serviço OData

### 2.1 Assistente de Geração de Repositório (Object Generator)

- **Gerador OData UI Service**: No ADT Eclipse, aciona-se o gerador a partir da tabela de banco de dados (`Generate ABAP Repository Objects...` ➔ `ABAP RESTful Application Programming Model` ➔ `OData UI Service`).

- **Pilha de Artefatos Gerados**:

  - **Data Model Layer**: CDS View Entity de interface/raiz (ex: `ZR_##Flight`) com o alias correspondente (`Flight`).

  - **Behavior Layer**:

    - *Behavior Definition* (BDEF) contendo as operações standard (`create`, `update`, `delete`).

    - *Behavior Implementation Class* (Behavior Pool, ex: `ZBP_R_##FLIGHT`).

    - *Draft Table* (ex: `Z##FLIGHT_D`) para suporte à edição em rascunho.

  - **Projection Layer**:

    - CDS Projection Entity (ex: `ZC_##Flight`) exposta para o serviço específico.

    - Behavior Projection (ex: `ZBP_C_##FLIGHT`).

    - Metadata Extension para definição de anotações de UI.

  - **Business Service Layer**:

    - *Service Definition* (ex: `ZUI_##FLIGHT_O4`) definindo o escopo das entidades expostas.

    - *Service Binding* (ex: `ZUI_##FLIGHT_O4`, tipo `OData V4 - UI`) para expor e publicar o serviço localmente.

### 2.2 Publicação e Teste da Aplicação

- **Publicação do Endpoint**: Após a ativação (`Ctrl + F3`), o botão **Publish** no Service Binding registra o serviço OData V4 na instância.

- **SAP Fiori Elements Preview**: Selecionando a entidade na janela *Service Version Details* e clicando em **Preview**, abre-se o aplicativo SAP Fiori gerado no navegador web para testes funcionais de CRUD.

---

## Módulo 3: Lógica de Negócio do BO (ABAP Logic)

### 3.1 Validations (Validações de Consistência)

- **Conceito**: Lógicas de checagem disparadas durante o salvamento (`ON SAVE`) ao criar ou modificar registros.

- **Declaração e Atalho**:

  - Declarada na BDEF: `validation validatePrice on save { create; field Price; }` ou `validation CheckSemanticKey on save { create; update; }`.

  - Uso do *Quick Fix* (`Ctrl + 1`) para gerar a assinatura do método `FOR VALIDATE ON SAVE` na classe local do Behavior Pool.

- **Checagens Comuns**:

  - **Validação de Chave Semântica**: Verificação da unicidade da combinação de negócios (ex: `CarrierID` + `ConnectionID`). Utiliza consulta `UNION` entre a tabela ativa e a tabela de rascunho (*draft*) para evitar duplicatas.

  - **Validação de Valores e Existência**: Checagem de preços positivos (`Price > 0`), existência da companhia aérea na tabela mestra (`/dmo/i_carrier`), ou divergência entre aeroporto de origem e destino (`AirportFromID <> AirportToID`).

- **Message Classes e Retorno de Erros**:

  - Criação de classes de mensagem no ADT (`Message Class`) com marcadores de posição (`&1`, `&2`, `&3`, `&4`).

  - Instanciação de mensagem via autorreferência `me->new_message( id = '/LRN/S4D400', number = '101', severity = ms-error )`.

  - **Preenchimento das Estruturas Implícitas**:

    - `failed`: Adiciona-se a chave técnica `%tky` da entidade para bloquear a gravação no banco de dados.

    - `reported`: Preenche-se `%tky`, atribui-se a referência da mensagem em `%msg`, e sinaliza-se o campo afetado em `%element` (via `if_abap_behv=>mk-on`) para destacá-lo em vermelho na interface.

### 3.2 Determinations (Determinações Automáticas)

- **Conceito**: Lógicas executadas automaticamente pelo framework para calcular ou derivar valores de campos com base em alterações de dados (ex: preencher Cidade e País ao informar os códigos IATA de origem/destino).

- **Declaração e Processo**:

  - Declarada na BDEF: `determination getCities on save { field AirportFromID, AirportToID; }`.

  - **Leitura com EML**: Uso da Entity Manipulation Language (`READ ENTITIES OF ... IN LOCAL MODE ENTITY ... FIELDS ( ... ) WITH CORRESPONDING #( keys ) RESULT DATA(connections)`).

  - **Busca e Preenchimento**: Leitura da view semântica `/dmo/i_airport` para obter a cidade e o país.

  - **Modificação do Buffer Transacional**:

    - Cópia dos dados para uma tabela com tipo derivado `TYPE TABLE FOR UPDATE`.

    - Execução da instrução `MODIFY ENTITIES OF ... ENTITY ... UPDATE SET FIELDS WITH ...` com a estrutura de controle `%control` sinalizando os campos alterados.

---

## Módulo 4: Personalização da Experiência do Usuário (UI & UX)

### 4.1 Ajustes de Comportamento na Projeção (Behavior Projection)

- **Restrição de Operações**: É possível desativar operações padrão em serviços específicos comentando instruções na Behavior Projection (`ZC_##FLIGHT`), por exemplo `// use create;` ou `// use delete;`.

- **Campos Somente Leitura**: Definição de restrições de edição para o serviço especificando `field ( readonly ) PlaneTypeID;`.

### 4.2 Metadata Extensions (`.asddmxt`) e Anotações de UI

- **Separação de Preocupações**: As anotações visuais são isoladas em um objeto de *Metadata Extension*, evitando poluir a definição da CDS View Entity (exige a anotação `@Metadata.allowExtensions: true` na view principal).

- **Anotações de Layout Principais**:

  - `@UI.lineItem`: Define o array de colunas exibidas na página de relatório (*Report List Page*) e sua ordem via atributo `position`.

  - `@UI.identification`: Define a posição e organização dos campos na página de detalhes do objeto (*Object Page*).

  - `@UI.selectionField`: Define os campos exibidos no cabeçalho da tela para filtros de busca.

  - `@UI.hidden: true`: Oculta campos administrativos de auditoria (`LocalCreatedBy`, `LocalCreatedAt`, `LastChangedAt`, etc.) para manter a tela limpa.

### 4.3 Ajuda de Pesquisa (Value Help / F4)

- **Integração Nativa**: A interface herda automaticamente ajudas de pesquisa (*Value Help*) definidas na camada CDS/DDIC (como a seleção de moedas via tabela de moedas do sistema).

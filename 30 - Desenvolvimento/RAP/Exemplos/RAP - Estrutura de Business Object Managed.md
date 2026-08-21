---
id: sap-rap-estrutura-business-object-managed
tipo: exemplo
status: rascunho
tecnologias: [RAP, ABAP, CDS, Fiori, OData]
modulos: []
produtos: [S4HANA]
release: desconhecido
nivel: avancado
autor: Hayron Piffer
criado: 2026-08-20
atualizado: 2026-08-20
fontes: ["[[rap-gestao-projetos-especificacao-funcional-01.pdf]]"]
---

# RAP - Estrutura de Business Object Managed

## Checklist Projeto RAP

- [ ] Camada 1
    - [ ] Tabela Transparente
- [ ] Camada 2
    - [ ] CDS Root
    - [ ] Behavior Root
- [ ] Camada 3
    - [ ] CDS Projection
    - [ ] Behavior Projection
    - [ ] Metadata Extension
- [ ] Camada 4
    - [ ] Service Definition
    - [ ] Service Binding

---

> _Para os exemplos na construção abaixo, utilizei uma Especificação Funcional gerada pelo Gemini, anexo abaixo._

![[rap-gestao-projetos-especificacao-funcional-01.pdf]]

---

## 🧱 CAMADA 1: BANCO DE DADOS (A Fundação)

### 1. Tabelas Transparentes (`ZT_PROJETOS_HP` e `ZT_PROJTAREF_HP`)

- **O que é:** A tabela física lá do Data Dictionary onde os dados vão morar.
- **Para que serve:** Armazenar as informações de fato.
- **Importância:** Sem ela, não tem jogo no cenário _Managed_. A grande sacada aqui é **sempre** incluir os 6 campos de log (Created By, Created At, Last Changed By, Last Changed At, Local Last Changed By, Local Last Changed At) com os _data elements_ padrão da SAP (`abp_creation_user`, etc.). O framework usa o `local_last_changed_at` como **ETag** (controle de concorrência) para impedir que dois peões editem o mesmo dado ao mesmo tempo e façam merda.

```sql
@EndUserText.label : 'Projetos'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztb_projeto_hp {

  key client            : abap.clnt not null;
  key uuid_projeto      : uuid not null;
  id_projeto            : char10 not null;
  nome_projeto          : char50;
  departamento          : zde_departamento_hp;
  status                : zde_status_andamento_hp;
  created_by            : abp_creation_user;
  created_at            : abp_creation_tstmpl;
  last_changed_by       : abp_lastchange_user;
  last_changed_at       : abp_lastchange_tstmpl;
  local_last_changed_by : abp_locinst_lastchange_user;
  local_last_changed_at : abp_locinst_lastchange_tstmpl;

}
```

```sql
@EndUserText.label : 'Tarefas do Projeto'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztb_projtaref_hp {

  key client            : abap.clnt not null;
  key uuid_tarefa       : uuid not null;
  uuid_parent_proj      : uuid not null;
  id_tarefa             : numc4 not null;
  descricao             : char100;
  responsavel           : uname;
  created_by            : abp_creation_user;
  created_at            : abp_creation_tstmpl;
  last_changed_by       : abp_lastchange_user;
  last_changed_at       : abp_lastchange_tstmpl;
  local_last_changed_by : abp_locinst_lastchange_user;
  local_last_changed_at : abp_locinst_lastchange_tstmpl;

}
```

## ⚙️ CAMADA 2: BUSINESS OBJECT (O Motor e as Regras)

### 2.1. CDS Root View Entity (`ZI_PROJETO_HP`)

- **O que é:** A visão raiz da sua entidade. O ponto de partida do seu Objeto de Negócio (BO).
- **Para que serve:** Fazer um _select_ na tabela física e dar uma "gourmetizada" nos campos. É aqui que você transforma nomes feios (`created_at`) em CamelCase (`CreatedAt`).
- **Importância:** É o alicerce do RAP. É nela que a gente usa as anotações `@Semantics...` para avisar o framework quem é quem nos campos de log. Sem isso, o SAP não atualiza as datas e usuários automaticamente.

```sql
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Root - Projetos'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_PROJETO_HP
  as select from ztb_projeto_hp
  // Definimos o formato do relacionamento
  composition [0..*] of ZI_PROJTAREF_HP as _Tarefas
{
  key uuid_projeto          as UuidProjeto,
  
      id_projeto            as IdProjeto,
      nome_projeto          as NomeProjeto,
      departamento          as Departamento,
      status                as Status,

      @Semantics.user.createdBy: true
      created_by            as CreatedBy,

      @Semantics.systemDateTime.createdAt: true
      created_at            as CreatedAt,

      @Semantics.user.lastChangedBy: true
      last_changed_by       as LastChangedBy,

      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at       as LastChangedAt,

      @Semantics.user.localInstanceLastChangedBy: true
      local_last_changed_by as LocalLastChangedBy,

      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed_at as LocalLastChangedAt,
      
      // Expondo as associações do Objeto
      _Tarefas
}
```

### 2.2 CDS View Entity (`ZI_PROJTAREF_HP`)

- **O que é:** Uma visão simples de uma tabela, muitas vezes associada a alguma outra visão Root.
- **Para que serve:** Além de fazer as mesmas coisas ela também se associa a Root com uma ligação utilizando campos chave
- **Importância:** É a ramificação da estrutura de relacionamento com a CDS Root, além de também podermos inserir as anotações `@Semantics...` definimos também como ela se relaciona com a CDS Root

```sql
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Tarefas do Projeto'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_PROJTAREF_HP
  as select from ztb_projtaref_hp

  // utilizamos $projection para utilizar campos que estão sendo projetados na view
  association to parent ZI_PROJETO_HP as _Projeto on $projection.UuidParentProj = _Projeto.UuidProjeto
{
  key uuid_tarefa           as UuidTarefa,
  
      uuid_parent_proj      as UuidParentProj,
      id_tarefa             as IdTarefa,
      descricao             as Descricao,
      responsavel           as Responsavel,

      @Semantics.user.createdBy: true
      created_by            as CreatedBy,

      @Semantics.systemDateTime.createdAt: true
      created_at            as CreatedAt,

      @Semantics.user.lastChangedBy: true
      last_changed_by       as LastChangedBy,

      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at       as LastChangedAt,

      @Semantics.user.localInstanceLastChangedBy: true
      local_last_changed_by as LocalLastChangedBy,

      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed_at as LocalLastChangedAt,

      // Expondo as associações do Objeto
      _Projeto
}
```

### 2.3 Behavior Definition (Root) (`ZI_PROJETO_HP`)

- **O que é:** O cão de guarda da sua aplicação. O arquivo de comportamento principal.
- **Para que serve:** Como a gente usa `managed`, é aqui que a gente diz pro RAP: _"Irmão, se vira aí pra fazer o Insert, Update e Delete no banco" ._ Um mesmo arquivo Behavior Definition serve para toda a estrutura, então tanto o Root como suas associações são implementadas aqui.
- **Importância:** É onde a gente blinda as regras de negócio.
    - Fazemos o mapeamento (`mapping for`) pra ligar os campos da CDS com as colunas da tabela.
    - Travamos os campos: `field ( mandatory : create, readonly : update )` para garantir que ninguém altere chave primária, ou outros campos, depois de criada.
    - É a garantia de que, não importa se o Fiori, uma API ou o diabo tentar mexer nos dados, essas regras não serão violadas.

```sql
managed implementation in class zclbp_i_projeto_hp unique;
strict ( 2 );

define behavior for ZI_PROJETO_HP alias Projeto
persistent table ztb_projeto_hp
lock master
authorization master ( instance )
//etag master <field_name>
{
  create;
  update;
  delete;
  association _Tarefas { create; }

  // O RAP cuida da chave primária (UUID) sozinho!
  field ( numbering : managed, readonly ) UuidProjeto;

  // Regra de Negócio: Obrigatório criar, mas não pode editar depois
  field ( mandatory : create, readonly : update ) IdProjeto;

  // Campos de controle travados para o usuário
  field ( readonly ) CreatedAt, CreatedBy, LastChangedAt, LastChangedBy, LocalLastChangedBy, LocalLastChangedAt;

  // IMPORTANTE: Mapeamento dos campos da View para a Tabela Física
  mapping for ztb_projeto_hp
  {
    UuidProjeto        = uuid_projeto;
    IdProjeto          = id_projeto;
    NomeProjeto        = nome_projeto;
    Departamento       = departamento;
    Status             = status;
    CreatedBy          = created_by;
    CreatedAt          = created_at;
    LastChangedBy      = last_changed_by;
    LastChangedAt      = last_changed_at;
    LocalLastChangedBy = local_last_changed_by;
    LocalLastChangedAt = local_last_changed_at;
  }
}

define behavior for ZI_PROJTAREF_HP alias Tarefa
persistent table ztb_projtaref_hp
lock dependent by _Projeto
authorization dependent by _Projeto
//etag master <field_name>
{
  update;
  delete;
  association _Projeto;

  // O RAP cuida da chave primária (UUID) sozinho!
  field ( numbering : managed, readonly ) UuidTarefa;
  field ( readonly ) UuidParentProj;

  // O usuário não digita o ID da tarefa, nós vamos gerar no Back-end
  field ( readonly ) IdTarefa;

  // A nossa determinação para gerar o ID Sequencial ('0001', '0002')
  determination setTaskNumber on modify { create; }

  // IMPORTANTE: Não esqueça de fazer o mapping aqui também!
  mapping for ztb_projtaref_hp
  {
    UuidTarefa         = uuid_tarefa;
    UuidParentProj     = uuid_parent_proj;
    IdTarefa           = id_tarefa;
    Descricao          = descricao;
    Responsavel        = responsavel;
    CreatedBy          = created_by;
    CreatedAt          = created_at;
    LastChangedBy      = last_changed_by;
    LastChangedAt      = last_changed_at;
    LocalLastChangedBy = local_last_changed_by;
    LocalLastChangedAt = local_last_changed_at;
  }

}
```

### 2.4 Implementação ABAP Behavior Definition (Root) (`ZCLBP_I_PROJETO_HP`)

- **O que é:** É a implementação ABAP do Behavior que você definiu acima.
- **Para que serve:** Ela serve para injetar a **lógica de negócio customizada** que o framework não consegue adivinhar sozinho. Você usa essa classe para programar:
    - **Determinations:** Calcular valores automáticos assim que um campo muda ou um registro nasce (como a nossa numeração de tarefas).
    - **Validations:** Checar se os dados estão corretos antes de salvar (ex: "A data de fim do projeto não pode ser menor que a data de início").
    - **Actions:** Criar botões customizados na tela (ex: Um botão "Aprovar Projeto" que muda o status e envia um e-mail).
    - **Authorizations:** Fazer a checagem de segurança (ex: "O usuário X só pode editar projetos do departamento de TI").
- **Importância:** Sem essa classe, o seu aplicativo Fiori é apenas uma "tabela de banco de dados gourmet". É uma tela burra que faz CRUD (Criar, Ler, Atualizar, Deletar) sem nenhuma regra.  
    A importância vital dessa classe é garantir a **integridade dos dados e as regras da empresa**. Ela é o cérebro do backend, garantindo que nenhum dado sujo, incompleto ou não autorizado chegue ao banco de dados, separando perfeitamente a lógica da interface visual.

```abap
CLASS lhc_Projeto DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR Projeto RESULT result.

ENDCLASS.

CLASS lhc_Projeto IMPLEMENTATION.

  METHOD get_instance_authorizations.
    " ---------------------------------------------------------------------
    " Aqui entraria a lógica de autorização (ex: verificar objeto de
    " autorização do SAP para ver se o usuário pode editar o projeto).
    " Como estamos focando na estrutura, deixamos em branco por enquanto.
    " ---------------------------------------------------------------------
  ENDMETHOD.

ENDCLASS.

CLASS lhc_Tarefa DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS setTaskNumber FOR DETERMINE ON MODIFY
      IMPORTING keys FOR Tarefa~setTaskNumber.

ENDCLASS.

CLASS lhc_Tarefa IMPLEMENTATION.

  METHOD setTaskNumber.
    " ---------------------------------------------------------------------
    " PASSO 1: Ler os dados da Tarefa que acabou de nascer na memória.
    " Por que? Porque a tabela 'keys' só traz o UuidTarefa. Nós precisamos
    " descobrir qual é o UuidParentProj (o Pai) dessa tarefa.
    " ---------------------------------------------------------------------
    READ ENTITIES OF ZI_PROJETO_HP IN LOCAL MODE
      ENTITY Tarefa
        FIELDS ( UuidParentProj IdTarefa )
        WITH CORRESPONDING #( keys )
      RESULT DATA(lt_tarefas).

    " ---------------------------------------------------------------------
    " PASSO 2: Fazer o loop nas tarefas recém-criadas para gerar o número
    " ---------------------------------------------------------------------
    LOOP AT lt_tarefas ASSIGNING FIELD-SYMBOL(<fs_tarefa>).

      "// Como a determinação pode ser chamada várias vezes, garantimos
      "// que só vamos gerar o ID se ele ainda estiver vazio.
      CHECK <fs_tarefa>-IdTarefa IS INITIAL.

      "// 2.1 - Descobre o maior ID de tarefa já existente no banco
      "// EXCLUSIVAMENTE para o projeto pai atual.
      SELECT SINGLE MAX( id_tarefa )
        FROM ztb_projtaref_hp
        WHERE uuid_parent_proj = @<fs_tarefa>-UuidParentProj
        INTO @DATA(lv_max_id).

      "// 2.2 - Soma 1 e formata garantindo as 4 posições (ex: '0001')
      DATA(lv_next_id) = CONV numc4( lv_max_id + 1 ).

      " ---------------------------------------------------------------------
      " PASSO 3: Gravar o novo número de volta na memória transacional
      " ---------------------------------------------------------------------
      MODIFY ENTITIES OF ZI_PROJETO_HP IN LOCAL MODE
        ENTITY Tarefa
          UPDATE
            FIELDS ( IdTarefa )
            WITH VALUE #( ( %tky     = <fs_tarefa>-%tky
                            IdTarefa = lv_next_id ) )
        REPORTED DATA(ls_reported).

      "// 2.3 - Para evitar que múltiplas tarefas criadas no mesmo 'Save'
      "// peguem o mesmo número, atualizamos a variável em memória caso o loop continue.
      lv_max_id = lv_next_id.

      " ---------------------------------------------------------------------
      " PASSO 4: Repassar qualquer erro do EML para a tela do Fiori
      " ---------------------------------------------------------------------
      reported-tarefa = CORRESPONDING #( BASE ( reported-tarefa ) ls_reported-tarefa ).

    ENDLOOP.

  ENDMETHOD.

ENDCLASS.
```

## 🧠 As Variáveis "Mágicas" (Assinatura Implícita)

Quando você cria um método nessa classe, o RAP injeta automaticamente algumas variáveis nos bastidores. Elas são a sua ponte de comunicação com o Fiori e com a memória do SAP:

- **`keys` (Quem eu estou processando?):** É uma tabela de entrada. O framework te entrega ela dizendo: _"Toma aqui a chave (UUIDs) dos registros que o usuário acabou de criar ou alterar na tela"_. É nela que você faz o `LOOP` para trabalhar.
- **`reported` (O Mensageiro):** É a sua tabela de saída para comunicação com o usuário. Qualquer aviso de sucesso, alerta ou mensagem de erro que você colocar dentro do componente `%msg` do `reported` vai aparecer como um pop-up na tela do Fiori.
- **`failed` (O Segurança da Balada):** É a sua tabela de barreira. Se uma validação falhar (ex: data inválida), você joga a chave desse registro no `failed`. Isso avisa o SAP: _"Aborta a missão para este registro, não deixa ele ser salvo no banco"_.
- **`mapped` (O Tradutor):** Muito usada em cenários de criação (Create). Quando a tela manda um rascunho, ele vem com um ID temporário esquisito (o `%cid`). O `mapped` serve para você ligar esse ID temporário à chave real definitiva que vai pro banco.

---

## 🛠️ Por que usar `READ ENTITIES` e `MODIFY ENTITIES` (A famosa EML)?

Aqui está o maior paradigma do RAP. Quando um usuário clica em "Criar" no Fiori e começa a digitar os dados do Projeto, **esses dados ainda não estão no banco de dados**. Eles estão flutuando em uma memória temporária chamada **Buffer Transacional**.

Se você tentar usar um `SELECT` normal ou um `UPDATE / INSERT` clássico do ABAP:

1. O `SELECT` vai dar vazio, porque o dado ainda não foi salvo no banco, está só na tela do usuário.
2. O `UPDATE / INSERT` direto vai corromper o framework, quebrar os bloqueios (locks) e jogar a tela do Fiori num estado inconsistente.

**A solução é a EML (Entity Manipulation Language):**

- **`READ ENTITIES`:** Em vez de ler do banco, ele lê do Buffer Transacional. Ele consegue ver o que o usuário acabou de digitar na tela, mesmo que não tenha sido salvo ainda. Foi por isso que usamos ele para descobrir o UUID do Projeto Pai da nossa Tarefa!
- **`MODIFY ENTITIES`:** É a forma segura de alterar os dados na memória. Ele atualiza o Buffer, avisa o framework da mudança e garante que a tela do usuário será atualizada em tempo real.
- O complemento **`IN LOCAL MODE`** é usado para dizer: _"Ei SAP, eu sou o dono desse código, estou rodando internamente. Pode pular as checagens de autorização para essa leitura/modificação que eu estou fazendo aqui"_.

## 🎨 CAMADA 3: CONSUMO E UI (A Vitrine)

### 3.1. CDS Projection View Entity (ex: `ZC_PARAMS`)

- **O que é:** Uma projeção (cópia focada) da sua CDS Root feita especificamente para uma interface (Fiori). Usa a sintaxe `as projection on`.
- **Para que serve:** Filtrar o que vai pra tela. As vezes a Root tem 50 campos, mas o app só precisa de 5.
- **Importância:** É aqui que a gente aplica o conceito de **Clean Core**. Usamos o `@Metadata.allowExtensions: true` para habilitar que a formatação da tela seja feita em um arquivo separado, mantendo essa view focada apenas na extração de dados e no contrato transacional (`provider contract transactional_query`).

```abap
@Metadata.allowExtensions: true
define root view entity ZC_PARAMS
	provider contract transactional_query
	as projection on ZIB_PARAMS
```

### 3.2. Behavior Definition (Projection) (ex: `ZEC_PARAMS`)

- **O que é:** A ponte de comportamento entre a Root e o OData.
- **Para que serve:** Liberar a catraca pro Fiori. Ele é bem curtinho e usa os comandos `use create; use update; use delete;`.
- **Importância:** O Fiori é "burro" por padrão (só leitura). Se você não criar esse arquivo e não usar esses comandos, os botões de Criar/Editar/Deletar simplesmente não aparecem na tela, pois a UI não vai saber que a base permite essas operações.

### 3.3. Metadata Extension / MDE (ex: `ZMDE_PARAMS`)

- **O que é:** O maquiador da sua UI. Um arquivo exclusivo para anotações de interface.
- **Para que serve:** Desenhar a tela do Fiori Elements sem você precisar escrever uma linha de JavaScript/SAPUI5.
- **Importância:** Deixa o código extremamente organizado. Aqui a gente espeta os `@UI.lineItem` (pra criar colunas na tabela), `@UI.identification` (pra criar os formulários na Object Page) e `@UI.selectionField` (pra criar os filtros no cabeçalho).

```abap
@UI.headerInfo: { typeName: 'Parametro',
									typeNamePlural: 'Parametros',
									title: { type: #STANDARD, value: 'Aplicacao' } }
annotate view ZC_PARAMS with
{
	// Cria a pagina de detalhes
	@UI.facet: [ { id: 'idDetails',
								 purpose: #STANDARD,
								 type: #IDENTIFICATION_REFERENCE,
								 label: 'Detalhes' } ]
								 
	@UI: {
		lineItem: [{ position: 10 }],
		identification: [{ position: 10 }],
		selectionField: [{ position: 10 }],
	}
	PrimeiroCampo;
	...
}
```

## 🚀 CAMADA 4: SERVIÇOS (A Porta para o Mundo)

### 7. Service Definition (ex: `ZSD_PARAMS`)

- **O que é:** O cardápio do seu aplicativo.
- **Para que serve:** Expor a sua Projection View (e qualquer outra view associada, tipo de _value helps_) usando o comando `expose`.
- **Importância:** Organiza o que vai ser empacotado no serviço final e permite dar apelidos (`alias`) bonitos pras entidades, pra não mandar nome de tabela pro front-end.

```abap
define service ZSD_PARAMS {
	expose ZC_PARAMS as Parametros;
}
```

### 8. Service Binding (ex: `ZSB_PARAMS_O2_UI` ou `ZSB_PARAMS_O4_UI`)

- **O que é:** O garçom que pega o cardápio e entrega pro Fiori.
- **Para que serve:** Definir o protocolo de comunicação. Escolher se a parada vai ser OData V2, OData V4 (mais pica, rápido e moderno) ou uma Web API.
- **Importância:** É aqui que a mágica final acontece. Você clica em **Publish** e o SAP gera o endpoint real na `IWFND/MAINT_SERVICE` ou nos serviços V4. É a partir daqui que você clica em "Preview" para ver o app rodando na web.
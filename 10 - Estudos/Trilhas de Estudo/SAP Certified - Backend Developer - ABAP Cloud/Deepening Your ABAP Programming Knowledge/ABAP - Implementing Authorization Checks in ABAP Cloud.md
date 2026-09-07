---
id: sap-abap-implementing-authorization-checks-in-abap-cloud
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

# ABAP - Implementing Authorization Checks in ABAP Cloud

Este guia de estudos consolidado apresenta o conceito de segurança e controle de acessos lógicos no **ABAP Cloud**, com base nos materiais oficiais selecionados. O conteúdo está estruturado em um fluxo de aprendizagem progressivo, abordando desde os fundamentos conceituais até a implementação prática e tratamento de exceções em tempo de execução.

---

## Fluxo de Aprendizagem

```
[Módulo 1: Conceito de Autorização] 
              │
              ▼
[Módulo 2: CDS Access Controls (DCL)] ➔ Filtro Automático (Operações de Leitura)
              │
              ▼
[Módulo 3: Instrução AUTHORITY-CHECK] ➔ Verificação Explícita (Operações de Gravação/Ações)
              │
              ▼
[Módulo 4: Cenário Prático & Exceções] ➔ lcl_carrier com cx_abap_auth_check_exception
```

---

## Módulo 1: O Conceito de Autorização no ABAP Cloud

No desenvolvimento de aplicações empresariais SAP, a proteção de dados confidenciais e a limitação de ações do usuário de acordo com suas atribuições são críticas.

### 1.1 Interface de Banco de Dados vs. Usuário de Negócio

As requisições enviadas ao banco de dados pelo ABAP são intermediadas e processadas pela **interface de banco de dados** (_Database Interface_) [10]. Para garantir flexibilidade operacional em todas as operações possíveis do sistema (criar, ler, atualizar e excluir), a interface se conecta física e internamente ao banco de dados utilizando um **usuário técnico especial superprivilegiado** (com acesso irrestrito), e não com a credencial direta do usuário de negócio que iniciou a requisição [10].

Como consequência, para restringir o que os usuários de negócio podem fazer em termos de dados e ações, o ecossistema ABAP emprega uma arquitetura baseada em **verificações de autorização lógicas** na camada da aplicação [10].

### 1.2 Os Dois Mecanismos Principais de Verificação

O ABAP Cloud fornece dois caminhos complementares para validar acessos, cada um com um propósito arquitetural específico:

1. **CDS Access Controls (DCL)**:
    - Uma verificação lógica vinculada diretamente a uma entidade **CDS View** [11].
    - Ao executar uma leitura (`SELECT`), o próprio sistema filtra as linhas retornadas com base nas permissões de logon do usuário atual [11, 57].
    - **Caso de uso típico**: Operações automáticas de leitura em massa e relatórios (_read operations_) [11].
2. **Instrução AUTHORITY-CHECK**:
    - Uma verificação explícita escrita programaticamente pelo desenvolvedor ABAP [11].
    - Avalia a permissão do usuário contra um objeto de autorização e define o código de retorno na variável de sistema **`sy-subrc`** [11, 68].
    - O desenvolvedor é responsável direto por validar se `sy-subrc <> 0` e impedir o fluxo caso o usuário não tenha a permissão [11, 69].
    - **Caso de uso típico**: Validação antes de efetuar alterações físicas ou lógicas em dados (_validate authorizations before changes/writes_) e em fluxos transacionais do modelo RAP [11].

---

## Módulo 2: Controle de Acesso Implícito com CDS Access Controls (DCL)

Os **CDS Access Controls** utilizam a linguagem **DCL (Data Control Language)** para definir regras rígidas de segurança diretamente na camada de modelagem de dados semântica.

### 2.1 Funcionamento Técnico

Quando o desenvolvedor cria uma entidade de controle de acesso (objeto do tipo **Access Control**), ela fica associada a uma **CDS View Entity** específica [56]. No momento em que um programa ABAP ou serviço OData lê dados dessa view, o motor do banco de dados aplica as regras especificadas na DCL comparando os registros físicos com os privilégios contidos no perfil do usuário de negócio [57].

- **Vantagem de Segurança**: O filtro é aplicado de forma totalmente automática, impossibilitando que o desenvolvedor ou o usuário realizem um _bypass_ (ignorar ou contornar a validação) [57].
- **Vantagem de Desempenho**: O tráfego de rede e o uso de CPU são otimizados, já que apenas as linhas autorizadas são lidas do banco e transferidas para a memória da aplicação [57].

### 2.2 Estrutura de Regra DCL (Exemplo de Sintaxe)

Uma regra DCL define um perfil de acesso ou função utilizando a função especial **`pfcg_auth`** para mapear o objeto de autorização correspondente e seus campos técnicos [71].

No exemplo abaixo, o acesso de leitura à CDS view é restrito de acordo com o objeto de autorização `/DMO/TRVL`, exigindo que o país do aeroporto (`/DMO/CNTRY`) corresponda aos valores atribuídos ao usuário, e que a atividade (`ACTVT`) seja igual a `'03'` (Read) [56]:

```sql
@MappingRole: true
define role Z_Airport_Access {
  grant select on Z_I_Airport_Entity
  where ( _AirportCountry ) = 
    aspect pfcg_auth( /DMO/TRVL,
                      /DMO/CNTRY,
                      ACTVT = '03' );
}
```

_Nota: O primeiro parâmetro da função `pfcg_auth` é sempre o nome do **objeto de autorização**, enquanto os parâmetros subsequentes fornecem os valores e filtros para cada um de seus **campos de autorização** técnicos [71]._

### 2.3 Como Localizar um Access Control no Eclipse ADT

Para descobrir se uma determinada CDS View Entity possui um controle de acesso lúdico associado no **ABAP Development Tools (ADT)**:

1. Abra a definição da CDS View Entity no editor de código [57].
2. Posicione o cursor sobre o nome da view e pressione **`Ctrl + Shift + G`** (ou clique com o botão direito e selecione **Get Where-Used List**) [57, 71].
3. Na caixa de seleção de tipos de objetos, certifique-se de que a opção **Access Control** está habilitada e clique em _Finish_ [71].
4. Se a lista de resultados no painel _Search_ for excessivamente longa, selecione o ícone de funil para filtrar as ocorrências por tipo de objeto específico: **`DCLS/DL (Access Control)`** [57, 71].

---

## Módulo 3: Verificação Explícita com a Instrução `AUTHORITY-CHECK`

Diferente do filtro transparente dos CDS Access Controls, a instrução **`AUTHORITY-CHECK`** exige uma escrita explícita e o gerenciamento ativo das consequências de sua falha pelo programador.

### 3.1 Sintaxe e Estrutura Técnica

A verificação é realizada apontando para o objeto de autorização (`OBJECT`), definindo filtros explícitos campo a campo (`ID ... FIELD ...`) [67]:

```abap
AUTHORITY-CHECK OBJECT '/LRN/CARR'
  ID '/LRN/CARR' FIELD i_carrier_id
  ID 'ACTVT'     FIELD '03'.
```

- `OBJECT`: Nome técnico do objeto de segurança registrado (ex: `/LRN/CARR`) [67, 76].
- `ID`: Nome do campo de autorização que compõe o objeto (ex: `/LRN/CARR` para identificar as transportadoras aéreas e `ACTVT` para a atividade permitida) [76, 77].
- `FIELD`: O valor que está sendo testado para validação em tempo de execução (como uma variável contendo o ID da transportadora ou literais como `'03'` para exibição) [76, 77].

### 3.2 Avaliação do Código de Retorno (`sy-subrc`)

A execução da instrução `AUTHORITY-CHECK` não interrompe o programa nem exibe avisos automáticos se o acesso for negado. Ela simplesmente define um código numérico de retorno no campo de sistema **`sy-subrc`** [67, 68]. O desenvolvedor deve obrigatoriamente testar esse valor de forma imediata [68]:

|Valor do `sy-subrc`|Significado Técnico|Consequência|
|---|---|---|
|**`0`**|**Sucesso absoluto** [68].|O usuário possui o objeto e todos os valores requeridos nos campos [68].|
|**`4`**|**Falha de Valores** [68].|O usuário possui o objeto de autorização em seu perfil, mas não para o valor ou atividade solicitada [68].|
|**`12`**|**Falha de Objeto** [68].|O usuário não possui qualquer autorização associada a este objeto lúdico [68].|

### 3.3 A Responsabilidade do Desenvolvedor

Se o valor de `sy-subrc` for diferente de zero, **o programador deve tratar o desvio manualmente**, impedindo o acesso físico aos dados ou interrompendo a transação antes que o comando de persistência no banco de dados ocorra [11, 69]. Negligenciar este teste de `sy-subrc` cria uma brecha grave de segurança na aplicação.

---

## Módulo 4: Cenário Prático e Tratamento de Exceções em Runtime

Abaixo está estruturado um fluxo limpo de código ABAP de exemplo, demonstrando como encapsular uma validação estrita de autorização em um método construtor, disparar exceções e tratá-las de forma centralizada e segura.

### 4.1 Definição do Método Construtor com Exceção Declarada

Toda exceção disparada dentro de um método que não for tratada localmente deve ser explicitamente declarada em sua assinatura através da cláusula `RAISING` [77, 78]:

```abap
INTERFACE lcl_types.
  " Tipos úteis para a classe
ENDINTERFACE.

CLASS lcl_carrier DEFINITION CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS constructor
      IMPORTING
        i_carrier_id TYPE /dmo/carrier_id
      RAISING  
        cx_abap_invalid_value
        cx_abap_auth_check_exception. " Exceção de autorização dedicada

    METHODS get_output
      RETURNING
        VALUE(r_result) TYPE string.

  PRIVATE SECTION.
    DATA name          TYPE string.
    DATA currency_code TYPE /dmo/currency_code.
ENDCLASS.
```

### 4.2 Implementação Segura com `AUTHORITY-CHECK`

No bloco de implementação do construtor, realizamos primeiro a leitura do banco de dados para atestar a existência física do registro (`/lrn/carrier`) [75]. Se o registro existir, procedemos imediatamente à validação de autorização lúdica antes de prosseguir com a instanciação do objeto [76]:

```abap
CLASS lcl_carrier IMPLEMENTATION.
  METHOD constructor.
    " 1. Verifica se o registro existe fisicamente no banco de dados
    SELECT SINGLE
      FROM /lrn/carrier
      FIELDS concat_with_space( carrier_id, name, 1 ), currency_code
      WHERE carrier_id = @i_carrier_id
      INTO ( @me->name, @me->currency_code ).

    " Se sy-subrc <> 0, significa que a transportadora não existe fisicamente
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_abap_invalid_value.
    ENDIF.

    " 2. Realiza a verificação explícita de autorização para o registro existente
    AUTHORITY-CHECK OBJECT '/LRN/CARR'
      ID '/LRN/CARR' FIELD i_carrier_id
      ID 'ACTVT'     FIELD '03'. " '03' corresponde à atividade de exibição/leitura

    " Se falhar a verificação de autoridade, dispara a exceção correspondente
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_abap_auth_check_exception.
    ENDIF.
  ENDMETHOD.

  METHOD get_output.
    r_result = |Carrier: { me->name } | &&
               |[Currency: { me->currency_code }]|.
  ENDMETHOD.
ENDCLASS.
```

### 4.3 Consumo com Tratamento Centralizado no Bloco `TRY ... CATCH`

Na chamada de instanciação da aplicação de console (ou serviço consumidor), capturamos isoladamente cada cenário para fornecer feedbacks informativos ao console ou ao usuário de negócios [78]:

```abap
CLASS zcl_auth_demo IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    CONSTANTS c_carrier_id TYPE /dmo/carrier_id VALUE 'UA'.

    TRY.
        " Tenta criar a instância aplicando a validação de segurança
        DATA(carrier) = NEW lcl_carrier( i_carrier_id = c_carrier_id ).
        
        " Se obtiver sucesso, exibe os dados autorizados
        out->write( name = 'Carrier Overview'
                    data = carrier->get_output( ) ).

      CATCH cx_abap_invalid_value.
        " Tratamento para erro físico de dados inexistentes
        out->write( |Carrier { c_carrier_id } does not exist| ).

      CATCH cx_abap_auth_check_exception.
        " Tratamento para falha estrita de privilégio lógico do usuário
        out->write( |No authorization to display carrier { c_carrier_id }| ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
```

### 4.4 Tratamento Robustecido em Classes de Teste Unitário (ABAP Unit)

Ao implementar classes de teste unitário para validar comportamentos, as exceções de segurança disparadas por chaves de teste ou dados mockados devem ser mapeadas de maneira controlada para evitar que os testes falhem de forma não planejada [79]:

```abap
CLASS ltcl_carrier_test DEFINITION FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    METHODS test_constructor_success FOR TESTING.
ENDCLASS.

CLASS ltcl_carrier_test IMPLEMENTATION.
  METHOD test_constructor_success.
    TRY.
        DATA(the_carrier) = NEW lcl_carrier( i_carrier_id = 'LH' ).
      CATCH cx_abap_invalid_value.
        cl_abap_unit_assert=>fail( `Unable to instantiate lcl_carrier: Data invalid` ).
      CATCH cx_abap_auth_check_exception.
        cl_abap_unit_assert=>fail( `Unable to instantiate lcl_carrier: Auth check failed` ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
```
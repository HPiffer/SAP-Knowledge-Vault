---
id: sap-rap-template-if-rap-query-provider
tipo: template-dev
status: rascunho
tecnologias: [RAP, ABAP]
modulos: []
produtos: []
release: desconhecido
nivel: avancado
autor: Hayron Piffer
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# RAP - Template de IF_RAP_QUERY_PROVIDER

## Objetivo

Template de classe que implementa `if_rap_query_provider~select` para uma Custom Entity, cobrindo contagem, paginacao (offset/top) e deduplicacao. Ajuste os placeholders (`zcl_sua_classe_de_query`, `zce_sua_entidade`, `tabela_zoada`).

```abap
CLASS zcl_sua_classe_de_query DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.
    " A interface mágica que faz o Fiori conversar com tua classe
    INTERFACES if_rap_query_provider .

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_sua_classe_de_query IMPLEMENTATION.

  METHOD if_rap_query_provider~select.

    " 1. Declaração das tabelas (Ajuste para o nome da sua Custom Entity)
    DATA: lt_resultado TYPE STANDARD TABLE OF zce_sua_entidade,
          lt_banco     TYPE STANDARD TABLE OF zce_sua_entidade.

    " 2. Descobre o que o Fiori tá pedindo (Dados, Contagem, Paginação, Filtros)
    DATA(lv_is_data_requested)  = io_request->is_data_requested( ).
    DATA(lv_is_count_requested) = io_request->is_total_numb_of_rec_requested( ).
    DATA(lv_offset)             = io_request->get_paging( )->get_offset( ).
    DATA(lv_top)                = io_request->get_paging( )->get_page_size( ).
    
    " Se precisar dos filtros da tela, descomenta a linha abaixo:
    " DATA(lt_filters) = io_request->get_filter( )->get_as_ranges( ).

    " ---------------------------------------------------------------------
    " PASSO 1: A LÓGICA BRUTA (SELEÇÃO E DEDUPLICAÇÃO)
    " ---------------------------------------------------------------------
    IF lv_is_data_requested = abap_true OR lv_is_count_requested = abap_true.
      
      " Substitui esse SELECT pela tua lógica/BAPI/Join maluco
      SELECT id, 
             manoname, 
             status
        FROM tabela_zoada
        INTO CORRESPONDING FIELDS OF TABLE @lt_banco. " Aplique os ranges aqui se tiver!

      " A gambiarra validada: Limpando os duplicados
      " REGRA: ORDENA ANTES, SENÃO NÃO FUNCIONA!
      SORT lt_banco BY manoname.
      DELETE ADJACENT DUPLICATES FROM lt_banco COMPARING manoname.

    ENDIF.

    " ---------------------------------------------------------------------
    " PASSO 2: DEVOLVE O COUNT (Total de linhas DEPOIS de limpar duplicatas)
    " ---------------------------------------------------------------------
    IF lv_is_count_requested = abap_true.
      " O Fiori precisa saber o total real pra desenhar os botões de páginação
      io_response->set_total_number_of_records( lines( lt_banco ) ).
    ENDIF.

    " ---------------------------------------------------------------------
    " PASSO 3: FATIANDO A TABELA (PAGINAÇÃO) E DEVOLVENDO OS DADOS
    " ---------------------------------------------------------------------
    IF lv_is_data_requested = abap_true.

      " Verifica se o Fiori mandou limite de paginação
      IF lv_top = if_rap_query_paging=>page_size_unlimited.
        " Sem limite? Manda tudo e reza.
        lt_resultado = lt_banco.
      ELSE.
        " Calcula a fatia exata que a tela pediu
        DATA(lv_start_index) = lv_offset + 1.
        DATA(lv_end_index)   = lv_offset + lv_top.
        DATA(lv_total_lines) = lines( lt_banco ).

        " Trava o índice final pra não dar dump de leitura fora da tabela
        IF lv_end_index > lv_total_lines.
          lv_end_index = lv_total_lines.
        ENDIF.

        " Corta a tabela e joga no resultado
        IF lv_start_index <= lv_total_lines.
          APPEND LINES OF lt_banco FROM lv_start_index TO lv_end_index INTO lt_resultado.
        ENDIF.
      ENDIF.

      " Entrega a marmita pronta pro Fiori
      io_response->set_data( lt_resultado ).
      
    ENDIF.

  ENDMETHOD.

ENDCLASS.
```
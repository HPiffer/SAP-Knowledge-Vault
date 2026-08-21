---
id: sap-brfplus-exemplo-calculo-desconto
tipo: exemplo
status: rascunho
tecnologias: [ABAP, BRFplus]
modulos: [SD]
produtos: []
release: agnostico
nivel: intermediario
autor: Patrick
criado: 2026-08-21
atualizado: 2026-08-21
fontes: ["[[BRFplus - Chamar uma função em ABAP]]"]
---

# BRFplus - Exemplo de chamada para cálculo de desconto

Exemplo didático de como chamar uma função **BRF+** a partir de ABAP, aplicando o padrão descrito em [[BRFplus - Chamar uma função em ABAP]]. Não copie sem adaptar: os nomes de função, parâmetros e tipos devem refletir a sua própria função BRF+.

## Cenário

Uma função BRF+ decide o **percentual de desconto** de um pedido a partir de duas entradas: o **tipo de cliente** e o **valor do pedido**. A regra de negócio fica no BRF+ (fácil de manter pela área funcional); o ABAP apenas consome o resultado.

| Entrada `IV_CUST_TYPE` | Entrada `IV_ORDER_VALUE` | Saída `EV_DISCOUNT_PCT` |
|---|---|---|
| VIP | ≥ 5.000 | 15,00 |
| VIP | < 5.000 | 10,00 |
| STD | ≥ 5.000 | 5,00 |
| STD | < 5.000 | 0,00 |

(As faixas acima vivem dentro da função BRF+, não no ABAP.)

## Data objects da função BRF+

- **Entradas:** `IV_CUST_TYPE` (texto), `IV_ORDER_VALUE` (valor)
- **Saída:** `EV_DISCOUNT_PCT` (percentual)

## Wrapper em ABAP

Encapsular a chamada em um método deixa o consumo simples e testável:

```abap
CLASS zcl_brf_discount DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS get_discount
      IMPORTING iv_cust_type       TYPE kdgrp
                iv_order_value     TYPE netwr
      RETURNING VALUE(rv_discount) TYPE p LENGTH 5 DECIMALS 2
      RAISING   cx_fdt.
ENDCLASS.

CLASS zcl_brf_discount IMPLEMENTATION.
  METHOD get_discount.
    DATA: lo_function TYPE REF TO if_fdt_function,
          lo_context  TYPE REF TO if_fdt_context,
          lo_result   TYPE REF TO if_fdt_result.

    " Substitua pelo ID da sua função BRF+ (não versionar o ID real)
    CONSTANTS lc_func_id TYPE if_fdt_types=>id VALUE '<ID_FUNCAO_BRFPLUS>'.

    lo_function ?= cl_fdt_factory=>if_fdt_factory~get_instance( )->get_function( iv_id = lc_func_id ).

    lo_context = lo_function->get_process_context( ).
    lo_context->set_value( iv_name = 'IV_CUST_TYPE'   ia_value = iv_cust_type ).
    lo_context->set_value( iv_name = 'IV_ORDER_VALUE' ia_value = iv_order_value ).

    lo_function->process( EXPORTING io_context = lo_context
                          IMPORTING eo_result  = lo_result ).

    lo_result->get_value( IMPORTING ea_value = rv_discount ).
  ENDMETHOD.
ENDCLASS.
```

## Consumo

```abap
TRY.
    DATA(lo_pricing) = NEW zcl_brf_discount( ).

    DATA(lv_pct) = lo_pricing->get_discount(
                     iv_cust_type   = 'VIP'
                     iv_order_value = 5000 ).

    WRITE: / |Desconto aplicado: { lv_pct } %|.   " -> 15,00

  CATCH cx_fdt INTO DATA(lx_fdt).
    " Regra não pôde ser avaliada: log/mensagem a partir de lx_fdt
    MESSAGE lx_fdt->get_text( ) TYPE 'E'.
ENDTRY.
```

## Cuidados

- O ID da função (`<ID_FUNCAO_BRFPLUS>`), os nomes dos data objects (`IV_CUST_TYPE`, `IV_ORDER_VALUE`, resultado) e os tipos devem bater exatamente com a função no BRF+; os nomes são *case-sensitive*.
- Toda a lógica de faixas/decisão fica no BRF+ — evite replicá-la em ABAP, senão perde-se o ganho de manutenção pela área funcional.
- Sempre trate `cx_fdt`; falhas de avaliação vêm por exceção.
- Para reduzir custo, considere reutilizar a instância da função (`get_function`) quando chamar em laço.

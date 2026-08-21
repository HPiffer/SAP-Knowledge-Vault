---
id: sap-brfplus-chamar-funcao-abap
tipo: template-dev
status: rascunho
tecnologias: [ABAP, BRFplus]
modulos: []
produtos: []
release: agnostico
nivel: intermediario
autor: Patrick
criado: 2026-08-21
atualizado: 2026-08-21
fontes: ["Amostra de código ABAP fornecida por Patrick"]
---

# BRFplus - Chamar uma função em ABAP

## Resumo

Template para invocar uma função do **BRF+ (Business Rule Framework plus)** a partir de ABAP, usando a API **FDT** (*Formula and Derivation Tool*, o nome interno do BRF+). O fluxo é: obter a função pela factory, montar o *process context*, preencher os parâmetros de entrada com `set_value`, executar com `process` e ler o resultado com `get_value` — tudo dentro de um `TRY/CATCH cx_fdt`.

## Pré-requisitos

- Uma função BRF+ ativa cujo **ID** você conheça (transações `BRFPLUS` / `BRF+`).
- Nomes dos parâmetros de contexto (data objects de entrada) e do resultado, exatamente como definidos na função.

## Código

```abap
DATA: ol_function TYPE REF TO if_fdt_function,
      ol_context  TYPE REF TO if_fdt_context,
      ol_result   TYPE REF TO if_fdt_result,
      lx_fdt      TYPE REF TO cx_fdt,
      l_true      TYPE flag.

" Substitua pelo ID da sua função BRF+ (não versionar o ID real do sistema)
CONSTANTS: lc_key TYPE if_fdt_types=>id VALUE '<ID_FUNCAO_BRFPLUS>'.

ol_function ?= cl_fdt_factory=>if_fdt_factory~get_instance( )->get_function( iv_id = lc_key ).

TRY.
    ol_context = ol_function->get_process_context( ).

    ol_context->set_value( iv_name = 'IV_WHR'    ia_value = i_v_whr ).
    ol_context->set_value( iv_name = 'IV_PROCTY' ia_value = i_v_procty ).
    ol_context->set_value( iv_name = 'IV_VLTYP'  ia_value = i_v_vltyp ).

    ol_function->process( EXPORTING io_context = ol_context
                          IMPORTING eo_result  = ol_result ).

    ol_result->get_value( IMPORTING ea_value = l_true ).

    IF l_true EQ abap_true.
      CLEAR: c_v_wcr.
    ENDIF.

  CATCH cx_fdt INTO lx_fdt.
    " Tratar a exceção (log, mensagem, etc.)
ENDTRY.
```

## Placeholders e pontos de adaptação

- `<ID_FUNCAO_BRFPLUS>` — ID (GUID de 32 caracteres) da função BRF+ a ser chamada.
- `IV_WHR`, `IV_PROCTY`, `IV_VLTYP` — nomes dos parâmetros de **entrada** do contexto; troque pelos data objects reais da sua função.
- `i_v_whr`, `i_v_procty`, `i_v_vltyp` — variáveis ABAP que alimentam cada parâmetro.
- `l_true` / `ea_value` — resultado retornado pela função (aqui, um `flag`); ajuste o tipo conforme o *result data object*.
- `c_v_wcr` — exemplo de efeito colateral após o resultado; substitua pela sua lógica.

## Como funciona

1. `cl_fdt_factory=>if_fdt_factory~get_instance( )->get_function( iv_id = lc_key )` obtém a instância da função pelo ID.
2. `get_process_context( )` cria o contexto de execução (os parâmetros de entrada da função).
3. Cada `set_value( iv_name = '...' ia_value = ... )` preenche um parâmetro de entrada pelo nome.
4. `process( )` executa a regra e devolve o objeto de resultado em `eo_result`.
5. `get_value( IMPORTING ea_value = ... )` lê o valor de saída.
6. Toda a execução fica em `TRY/CATCH cx_fdt`, pois a API FDT lança exceções da hierarquia `cx_fdt`.

## Cuidados

- **Não versione o ID real** da função BRF+ nem nomes/valores específicos de sistemas ou clientes — use placeholders.
- Os nomes em `set_value`/`get_value` são *case-sensitive* e devem bater exatamente com os data objects da função.
- Sempre trate `cx_fdt` — falhas de execução da regra vêm por exceção, não por código de retorno.

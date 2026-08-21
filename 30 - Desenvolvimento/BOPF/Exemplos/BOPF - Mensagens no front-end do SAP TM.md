---
id: sap-bopf-mensagens-front-end-sap-tm
tipo: exemplo
status: rascunho
tecnologias: [BOPF, ABAP]
modulos: [TM]
produtos: []
release: desconhecido
nivel: intermediario
autor: Hayron Piffer
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# BOPF - Mensagens no front-end do SAP TM

## Objetivo

Adicionar mensagens ao objeto de mensagem BOPF exibido no front-end do SAP TM: uma mensagem do sistema (`sy-msg*`) e uma mensagem a partir de uma entrada BAPIRET2.

```abap
sy-msgty = 'S'.
sy-msgv1 = |Mensagem de sucesso!|.
*sy-msgv2 = ||.
*sy-msgv3 = ||.
*sy-msgv4 = ||.

"// Adiciona mensagem do sistema nas mensagens exibidas no front
/scmtms/cl_common_helper=>msg_helper_add_symsg(
  EXPORTING
    iv_key      = /scmtms/if_tor_c=>sc_bo_key
    iv_node_key = /scmtms/if_tor_c=>sc_node-root
  CHANGING
    co_message  = eo_message  "// Esse parâmetro geralmente vem no método
).
```

```abap
"// Comummente a variavel eo_message vem nos parametros basicos do método
IF eo_message IS INITIAL.
	eo_message = /bobf/cl_frw_factory=>get_message( ).
ENDIF.

/scmtms/cl_common_helper=>msg_convert_bapiret2_2_bopf(
  EXPORTING
    it_return  = VALUE #( ( id = 'YTM' number = '009' type = 'E' ) )
  CHANGING
    co_message = eo_message
).
```
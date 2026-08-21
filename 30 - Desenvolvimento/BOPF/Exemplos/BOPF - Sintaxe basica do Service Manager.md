---
id: sap-bopf-sintaxe-basica-service-manager
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

# BOPF - Sintaxe basica do Service Manager

## Objetivo

Referencia de sintaxe das principais operacoes do Service Manager BOPF (service/transaction manager, query, retrieve, retrieve_by_association, modify, do_action, obtencao de chave e conversao de mensagem) usando o BO de TOR do SAP TM.

### Obj Service manager

```abap
"// Type: /BOBF/IF_TRA_SERVICE_MANAGER
"// Declaração do Serviço da BOPF
DATA(lo_tor_srv) = /bobf/cl_tra_serv_mgr_factory=>get_service_manager( 
	/scmtms/if_tor_c=>sc_bo_key 
).
```

### Obj Transaction Manager

```abap
DATA: lt_rej_bo_key TYPE /bobf/t_frw_key2,
			lt_return     TYPE bapiret2_t.

TRY.

  "// Type: /BOBF/IF_TRA_TRANSACTION_MGR
  DATA(lo_tramgr) = /bobf/cl_tra_trans_mgr_factory=>get_transaction_manager( ).
  lo_tramgr->save(
    IMPORTING
      ev_rejected         = DATA(lv_rejected)
      eo_change           = DATA(lo_chg)
      eo_message          = DATA(lo_msg)
      et_rejecting_bo_key = lt_rej_bo_key
  ).

	CATCH /bobf/cx_frw.
    lo_tramgr->cleanup( ).
    lt_return = VALUE #(
      ( type    = 'E'
        message = 'Transaction Manager Error' )
    ).

ENDTRY.
```

### Query

```abap
DATA lt_selopt type /BOBF/T_FRW_QUERY_SELPARAM.
  
  lt_selopt = VALUE #(
	  ( attribute_name = 'TOR_ID'
	    option         = 'EQ'
	    sign           = 'I'
	    low            = iv_tor_id )
   ).
  
  lo_srvmgr->query(
    EXPORTING
      iv_query_key            = /scmtms/if_tor_c=>sc_query-root-root_elements
      it_selection_parameters = lt_selopt
      iv_fill_data            = abap_true
    IMPORTING
      et_key                  = lt_root_key
      ).

**************************************************************************************
"// Get ROOT Data
        lo_srvmgr->query(
          EXPORTING
            iv_query_key            = /scmtms/if_tor_c=>sc_query-root-root_elements
            it_selection_parameters = VALUE #( ( attribute_name = 'TOR_ID'
                                                 option         = 'EQ'
                                                 sign           = 'I'
                                                 low            = <tor_id>
                                                 ) )
            iv_fill_data            = abap_true
          IMPORTING
            et_key                  = lt_root_key
            et_data                 = lt_root_data
        ).
```

### Retrieve

```abap
DATA: lt_torkey       TYPE TABLE OF /bobf/s_frw_key,
      lt_root_data    TYPE TABLE OF /scmtms/s_tor_root_k.

"// Get ROOT node
lo_srvmgr->retrieve(
  EXPORTING
    iv_node_key  = /scmtms/if_tor_c=>sc_node-root
    it_key       = lt_torkey
    iv_fill_data = abap_true
  IMPORTING
    et_data      = lt_root_data
).

"// Internal Access
io_read->retrieve(
      EXPORTING
        iv_node                 = /scmtms/if_tor_c=>sc_node-root
        it_key                  = it_key
      IMPORTING
        et_data                 = lt_root_data ).
```

### Retrieve By Association

```abap
"// Get ITEM_TR Node
lo_srvmgr->retrieve_by_association(
    EXPORTING
      iv_node_key             = /scmtms/if_tor_c=>sc_node-root
      it_key                  = it_tor_key
      iv_association          = /scmtms/if_tor_c=>sc_association-root-item_tr
      iv_fill_data            = abap_true
    IMPORTING
      et_data                 = lt_item_tr_main_data
    ).

"// Internal Access
io_read->retrieve_by_association(
    EXPORTING
      iv_node                 = /scmtms/if_tor_c=>sc_node-root
      it_key                  = it_key
      iv_association          = /scmtms/if_tor_c=>sc_association-root-stop
      iv_fill_data            = abap_true
    IMPORTING
      et_data                 = lt_stop_data
    ).
```

### Modify

```abap
DATA lt_mod                   TYPE /bobf/t_frw_modification.

ls_mod-node        = /scmtms/if_tor_c=>sc_node-executioninformation.
"ls_mod-key         = /bobf/cl_frw_factory=>get_new_key( ).
ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_update.
ls_mod-root_key    = ls_root_data-key.

CREATE DATA ls_mod-data TYPE /scmtms/s_tor_exec_k.
     ASSIGN ls_mod-data->* TO <fs_exec>.

<fs_exec>-field  = <value>.
<fs_exec>-field2 = <value2>.
    ls_mod-changed_fields = VALUE #(
      ( |<field>| )
      ( |<field2>| )
	  ).
	APPEND ls_mod TO lt_mod.

lo_srvmgr->modify(
    EXPORTING
      it_modification = lt_mod
    IMPORTING
      eo_message      = DATA(lo_message)
      ).
```

```abap
DATA ls_root type ref to /scmtms/s_tor_root_k.
    CREATE DATA ls_root.
    ASSIGN ls_root->* TO FIELD-SYMBOL(<fs_root>).
    
    <fs_root>-zz_aceptacionelectronica  = 'NO'.
    <fs_root>-zz_unidadmedidacapacidad  = '1'.

    CALL METHOD io_modify->update
      EXPORTING
        iv_node           = /scmtms/if_tor_c=>sc_node-root
        iv_key            = VALUE #( it_key[ 1 ]-key OPTIONAL )
        is_data           = ls_root
        it_changed_fields = VALUE #(
                                    ( |ZZ_ACEPTACIONELECTRONICA| )
                                    ( |ZZ_UNIDADMEDIDACAPACIDAD| )
                                            )
```

### Do Action

```abap
lo_srvmgr->do_action(
            EXPORTING
              it_key               = lt_key
              iv_act_key           = /scmtms/if_tor_c=>sc_action-root-set_exm_status_ready_for_exec
              is_parameters        = lr_param
            IMPORTING
              eo_message           = eo_message
              et_failed_action_key = DATA(et_fak) ).
```

### TOR KEY

```abap
DATA: lt_tor_id       TYPE TABLE OF /scmtms/tor_id,
      lt_torid_torkey TYPE TABLE OF /scmtms/s_torid_key,
      lt_torkey       TYPE TABLE OF /bobf/s_frw_key.		

/scmtms/cl_tor_helper_root=>get_key_from_torid(
  EXPORTING
    it_torid        = lt_tor_id       " Transportation Order ID
  importing
    et_torid_torkey = lt_torid_torkey " Link between TORID and KEY
    et_torkey       = lt_torkey       " TOR Keys
).
```

## O_Message → BAPIRET2

```abap
/scmtms/cl_common_helper=>msg_convert_bopf_2_bapiret2(
  EXPORTING
    io_message  = lo_msg
  CHANGING
    ct_bapiret2 = lt_return
).

```
---
id: sap-bopf-bloqueio-desbloqueio-tor-sap-tm
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

# BOPF - Bloqueio e desbloqueio de TOR no SAP TM

## Objetivo

Criar (BLOCK) e remover (UNLOCK) um bloqueio manual em uma TOR do SAP TM, gravando o item no no `block` do BO e atualizando o flag `blk_exec` no root.

## BLOCK

```abap
constants: c_block_rc type /scmtms/block_reason_code value 'ZZ'.
    data:
      lt_changed_fields type /bobf/t_frw_name,
      lt_return         type bapiret2_tab,
      lt_block          type /scmtms/t_tor_block_k,
      ls_block          type /scmtms/s_tor_block_k,
      lv_key            type /BOBF/CONF_KEY,
*      lt_mod            type /bobf/t_frw_modification,
      ls_mod            type /bobf/s_frw_modification.
    field-symbols:
      <lfs_tor_root> type /scmtms/s_tor_root_k,
      <lfs_block>    type /scmtms/s_tor_block_k.

    check it_key is not initial.
    lv_key = it_key[ 1 ]-key.

     io_tor->retrieve_by_association( exporting iv_node_key    = /scmtms/if_tor_c=>sc_node-root
                                                    it_key         = it_key
                                                    iv_fill_data   = abap_true
                                                    iv_association = /scmtms/if_tor_c=>sc_association-root-block
                                          importing et_data        = lt_block ).

    read table lt_block into ls_block with key block_rc = c_block_rc.
    check sy-subrc <> 0.

*Crea item de bloqueo.
    create data ls_mod-data type /scmtms/s_tor_block_k.
    assign ls_mod-data->* to <lfs_block>.
    <lfs_block>-key           = /bobf/cl_frw_factory=>get_new_key( ).
    <lfs_block>-parent_key    = lv_key.
    <lfs_block>-root_key      = lv_key.
    <lfs_block>-orig_ref_root = lv_key.
    <lfs_block>-orig_ref_inst = lv_key.
    <lfs_block>-block_cat     = /scmtms/if_common_c=>sc_block_category-manual_block.

*Agrega motivo
    <lfs_block>-block_rc      = c_block_rc.
    <lfs_block>-blk_exec      = abap_true.

    ls_mod-key         = <lfs_block>-key .
    ls_mod-node        = /scmtms/if_tor_c=>sc_node-block.
    ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_create.
    ls_mod-source_node = /scmtms/if_tor_c=>sc_node-root.
    ls_mod-association = /scmtms/if_tor_c=>sc_association-root-block.
    ls_mod-source_key  = lv_key.
    append ls_mod to ct_modification.

*-----------

*    append 'BLOCK_RC' to ls_mod-changed_fields.
*    append 'BLK_EXEC' to ls_mod-changed_fields.
*
*    ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_update.
*    append ls_mod to ct_modification.

*-----------
*Actualiza bloqueo en root de FO
    clear: ls_mod.
    create data ls_mod-data type /scmtms/s_tor_root_k.
    assign ls_mod-data->* to <lfs_tor_root>.

    <lfs_tor_root>-blk_exec = abap_true.
    append 'BLK_EXEC' to ls_mod-changed_fields.

    ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_update.
    ls_mod-key         = lv_key.
    ls_mod-node        = /scmtms/if_tor_c=>sc_node-root.
    append ls_mod to ct_modification.
```

## UNLOCK

```abap
constants: c_block_rc type /scmtms/block_reason_code value 'ZZ'.
    data:
      lt_changed_fields type /bobf/t_frw_name,
      lt_return         type bapiret2_tab,
      lv_key            type /bobf/conf_key,
      lt_block          type /scmtms/t_tor_block_k,
      ls_block          type /scmtms/s_tor_block_k,
*      lt_mod            type /bobf/t_frw_modification,
      ls_mod            type /bobf/s_frw_modification.
    field-symbols:
      <lfs_tor_root> type /scmtms/s_tor_root_k,
      <lfs_block>    type /scmtms/s_tor_block_k.

    check it_key is not initial.
    lv_key = it_key[ 1 ]-key.

    io_tor->retrieve_by_association( exporting iv_node_key    = /scmtms/if_tor_c=>sc_node-root
                                                    it_key         = it_key
                                                    iv_fill_data   = abap_true
                                                    iv_association = /scmtms/if_tor_c=>sc_association-root-block
                                          importing et_data        = lt_block ).

    read table lt_block into ls_block with key block_rc = c_block_rc.
    check sy-subrc = 0.
*Crea item de bloqueo.
    create data ls_mod-data type /scmtms/s_tor_block_k.
    assign ls_mod-data->* to <lfs_block>.
    <lfs_block> = ls_block.

    ls_mod-key         = <lfs_block>-key .
    ls_mod-node        = /scmtms/if_tor_c=>sc_node-block.
    ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_delete.
    ls_mod-source_node = /scmtms/if_tor_c=>sc_node-root.
    ls_mod-association = /scmtms/if_tor_c=>sc_association-root-block.
    ls_mod-source_key  = lv_key.
    append ls_mod to ct_modification.

*-----------
*Actualiza bloqueo en root de FO
    if lines( lt_block ) > 1.
      clear: ls_mod.
      create data ls_mod-data type /scmtms/s_tor_root_k.
      assign ls_mod-data->* to <lfs_tor_root>.

      <lfs_tor_root>-blk_exec = abap_false.
      append 'BLK_EXEC' to ls_mod-changed_fields.

      ls_mod-change_mode = /bobf/if_frw_c=>sc_modify_update.
      ls_mod-key         = lv_key.
      ls_mod-node        = /scmtms/if_tor_c=>sc_node-root.
      append ls_mod to ct_modification.
    endif.
```
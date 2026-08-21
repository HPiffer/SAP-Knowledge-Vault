---
id: sap-abap-sintaxe-operador-value
tipo: exemplo
status: rascunho
tecnologias: [ABAP]
modulos: []
produtos: []
release: desconhecido
nivel: basico
autor: Hayron Piffer
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# ABAP - Sintaxe do operador VALUE

Comando ABAP VALUE para preencher tabelas internas, servindo também para declaração de ranges, no exemplo eu filtro pelos motoristas que estão bloqueados

```abap
"// Verificando motoristas bloqueados
DATA: lr_partner TYPE RANGE OF bu_partner.

SELECT *
  FROM but000
  INTO TABLE @DATA(lt_but000)
   FOR ALL ENTRIES IN @lt_return
 WHERE partner = @lt_return-partner.

lr_partner = VALUE #(
  FOR ls_but IN lt_but000 "// A declaração da estrutura é feita automaticamente
  WHERE ( xblck = 'X' )
  (                       "// Preenchimento dos campos
    sign   = 'I'
    option = 'EQ'
    low    = ls_but-partner
  )
).
```
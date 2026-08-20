---
id: sap-navegacao-guias
tipo: referencia
status: rascunho
tecnologias: []
modulos: []
produtos: []
release: agnostico
nivel: basico
autor: Equipe SAP
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
tags: [sap, navegacao]
---

# Guias

Procedimentos reproduzíveis, diagnósticos e runbooks. Cada guia deve declarar ambiente, validação, riscos e rollback.

```dataview
TABLE tipo AS "Tipo", status AS "Status", tecnologias AS "Tecnologias", atualizado AS "Atualizado"
FROM "40 - Guias"
WHERE file.path != this.file.path
SORT file.name ASC
```

<%* const slug = tp.file.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); %>
---
id: sap-<% slug %>
tipo: referencia
status: rascunho
tecnologias: []
modulos: []
produtos: []
release: agnostico
nivel: basico
autor: <% tp.system.prompt("Autor") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
fontes: []
tags: [sap, navegacao]
---

# <% tp.file.title %>

## Escopo

## Conteúdos

```dataview
TABLE tipo AS "Tipo", status AS "Status", atualizado AS "Atualizado"
FROM "<PASTA>"
WHERE file.path != this.file.path
SORT file.name ASC
```

## Relações

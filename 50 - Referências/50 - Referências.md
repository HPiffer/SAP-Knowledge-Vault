---
id: sap-navegacao-referencias
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

# Referências

Consultas rápidas de transações, aplicações, objetos, tabelas, APIs, cursos e documentação oficial.

```dataview
TABLE status AS "Status", tecnologias AS "Tecnologias", modulos AS "Módulos", atualizado AS "Atualizado"
FROM "50 - Referências"
WHERE file.path != this.file.path
SORT file.name ASC
```

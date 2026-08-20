---
id: sap-navegacao-modulos
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

# Módulos SAP

Visões funcionais e técnicas de módulos. Crie uma pasta de módulo somente quando a primeira nota correspondente for publicada.

```dataview
TABLE modulos AS "Módulos", status AS "Status", tecnologias AS "Tecnologias", atualizado AS "Atualizado"
FROM "20 - Módulos SAP"
WHERE file.path != this.file.path
SORT file.name ASC
```

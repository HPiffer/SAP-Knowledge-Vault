---
id: sap-navegacao-desenvolvimento
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

# Desenvolvimento

Templates, exemplos e checklists reutilizáveis. Todo código deve usar dados fictícios, declarar compatibilidade e explicar como testar e reverter.

## Catálogo planejado

- ABAP: reports, classes, ALV/SALV, BAdI/BAPI e ABAP Unit.
- CDS/DCL: view entities, parâmetros, associações e autorizações.
- RAP: business objects managed e unmanaged, behavior e EML.
- Fiori/UI5: controllers, routing, mensagens e integração OData.
- Integrações: HTTP, OData, RFC, IDoc e APIs.
- Engenharia: transportes, revisão, segurança, performance e rollback.

```dataview
TABLE tipo AS "Tipo", status AS "Status", tecnologias AS "Tecnologias", release AS "Release"
FROM "30 - Desenvolvimento"
WHERE file.path != this.file.path
SORT file.name ASC
```

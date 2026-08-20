---
aliases: [Home, Portal SAP]
tags: [sap, navegacao]
---

# SAP Knowledge Vault

> [!abstract] Propósito
> Base técnica colaborativa para aprender, desenvolver, diagnosticar e consultar soluções SAP. Comece por [[Como contribuir]] ou envie materiais para [[00 - Entrada/README|Entrada]].

## Navegação

| Área | Uso |
|---|---|
| [[Mapa SAP]] | Navegar por módulos, produtos e tecnologias |
| [[10 - Estudos]] | Fundamentos, trilhas e notas técnicas |
| [[20 - Módulos SAP]] | Conhecimento funcional e técnico por módulo |
| [[30 - Desenvolvimento]] | Templates, exemplos e checklists reutilizáveis |
| [[40 - Guias]] | Step-by-steps, troubleshooting e runbooks |
| [[50 - Referências]] | Consulta rápida de transações, objetos, APIs e fontes |
| [[Glossário SAP]] | Termos e siglas |

## Atualizados recentemente

```dataview
TABLE tipo AS "Tipo", status AS "Status", tecnologias AS "Tecnologias", modulos AS "Módulos", atualizado AS "Atualizado"
FROM "10 - Estudos" OR "20 - Módulos SAP" OR "30 - Desenvolvimento" OR "40 - Guias" OR "50 - Referências"
SORT atualizado DESC
LIMIT 12
```

## Rascunhos

```dataview
TABLE tipo AS "Tipo", autor AS "Autor", atualizado AS "Atualizado"
FROM "10 - Estudos" OR "20 - Módulos SAP" OR "30 - Desenvolvimento" OR "40 - Guias" OR "50 - Referências"
WHERE status = "rascunho"
SORT atualizado ASC
```

## Conteúdo que exige atenção

```dataview
TABLE status AS "Status", release AS "Release", atualizado AS "Atualizado"
FROM "10 - Estudos" OR "20 - Módulos SAP" OR "30 - Desenvolvimento" OR "40 - Guias" OR "50 - Referências"
WHERE status = "desatualizado" OR release = "desconhecido"
SORT atualizado ASC
```

## Templates disponíveis

```dataview
LIST
FROM "90 - Templates Obsidian"
SORT file.name ASC
```

## Últimas triagens

```dataview
LIST
FROM "99 - Sistema/Logs de Triagem"
SORT file.name DESC
LIMIT 10
```

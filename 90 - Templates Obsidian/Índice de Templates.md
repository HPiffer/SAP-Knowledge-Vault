---
id: sap-indice-de-templates
tipo: referencia
status: rascunho
tecnologias: []
modulos: []
produtos: []
release: agnostico
nivel: basico
autor: Hayron Piffer
criado: 2026-08-31
atualizado: 2026-08-31
fontes: []
tags: [sap, navegacao]
---

# Índice de Templates

> [!abstract] Escopo
> Ponto central de todos os modelos reutilizáveis do cofre. Cada template é referenciado por wikilink abaixo, para que apareça conectado (e não solto) na visão em grafo.

## Modelos do Obsidian

Modelos base usados na triagem, com placeholders do Templater.

- [[Template - Nota de estudo]] — anotações e conceitos (`10 - Estudos`)
- [[Template - Módulo SAP]] — visão funcional/técnica de módulo (`20 - Módulos SAP`)
- [[Template - Desenvolvimento]] — código/checklist reutilizável (`30 - Desenvolvimento`)
- [[Template - Step-by-step]] — procedimento com validação e rollback (`40 - Guias`)
- [[Template - Troubleshooting]] — diagnóstico de sintoma e solução (`40 - Guias`)
- [[Template - Referência rápida]] — consulta rápida (`50 - Referências`)
- [[Template - Página de navegação]] — hub/índice de um domínio

## Modelos de código (Desenvolvimento)

Templates de implementação já classificados como `template-dev` dentro das tecnologias.

- [[ABAP - Template de relatório executável]]
- [[BRFplus - Chamar uma função em ABAP]]
- [[RAP - Template de IF_RAP_QUERY_PROVIDER]]

## Listagem automática

```dataview
LIST
FROM "90 - Templates Obsidian"
WHERE file.path != this.file.path
SORT file.name ASC
```

## Relações

- [[Início]]
- [[Taxonomia]]

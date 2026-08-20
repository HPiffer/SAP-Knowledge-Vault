<%* const slug = tp.file.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); %>
---
id: sap-<% slug %>
tipo: estudo
status: rascunho
tecnologias: []
modulos: []
produtos: []
release: desconhecido
nivel: intermediario
autor: <% tp.system.prompt("Autor") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
fontes: []
---

# <% tp.file.title %>

## Resumo

## Pré-requisitos

## Conceitos principais

## Arquitetura ou fluxo

## Exemplo

## Cuidados e limitações

## Perguntas de revisão

- [ ]

## Fontes

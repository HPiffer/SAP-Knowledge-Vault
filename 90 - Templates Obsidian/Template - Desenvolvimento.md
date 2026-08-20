<%* const slug = tp.file.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); %>
---
id: sap-<% slug %>
tipo: template-dev
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

## Objetivo

## Compatibilidade

## Pré-requisitos

## Parâmetros e placeholders

| Placeholder | Descrição | Exemplo fictício |
|---|---|---|

## Implementação

```text
<INSERIR_TEMPLATE>
```

## Como usar

## Testes

## Segurança

## Performance

## Rollback

## Evidência de validação

Preencher somente quando o status for alterado para `validado`.

## Fontes

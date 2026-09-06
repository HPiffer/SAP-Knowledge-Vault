---
id: sap-indice-de-logs-de-triagem
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
tags: [sap, navegacao, log]
---

# Índice de Logs de Triagem

> [!abstract] Escopo
> Ponto central dos logs de triagem. Cada lote é referenciado por wikilink abaixo, para que os logs apareçam conectados (e não soltos) na visão em grafo. Ver [[99 - Sistema/Logs de Triagem/README|Como o log funciona]].

## Logs por data

- [[2026-08-29-2106|2026-08-29 21:06]]
- [[2026-08-29-1202|2026-08-29 12:02]]
- [[2026-08-24-2204|2026-08-24 22:04]]
- [[2026-08-24-2152|2026-08-24 21:52]]
- [[2026-08-20-2229|2026-08-20 22:29]]
- [[2026-08-20-2210|2026-08-20 22:10]]

## Listagem automática

```dataview
TABLE file.mtime AS "Modificado"
FROM "99 - Sistema/Logs de Triagem"
WHERE file.path != this.file.path AND file.name != "README" AND file.name != "Índice de Logs de Triagem"
SORT file.name DESC
```

## Manutenção

> [!note] Ao criar um novo log
> Adicione uma linha de wikilink em "Logs por data" apontando para o novo arquivo, para manter o log conectado ao grafo.

## Relações

- [[Início]]

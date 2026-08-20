---
aliases: [Mapa de conhecimento SAP]
tags: [sap, navegacao, modulos, tecnologias]
---

# Mapa SAP

As pastas de módulos são criadas somente quando houver conteúdo. Os links abaixo funcionam como mapa do escopo pretendido, não como promessa de cobertura completa.

## Módulos e áreas

| Domínio | Módulos/áreas | Conteúdo esperado |
|---|---|---|
| Financeiro | FI, CO | Contabilidade, controlling, integrações e extensões |
| Logística comercial | MM, SD | Compras, materiais, vendas, faturamento e integrações |
| Manufatura e ativos | PP, PM, QM | Produção, manutenção, qualidade e objetos relacionados |
| Supply Chain | EWM, TM | Armazém, transporte, BOPF/RAP e integrações logísticas |
| Pessoas | HCM, SuccessFactors | Integrações, extensões e processos de RH |
| Plataforma | Basis, Security | Administração, autorizações, transportes e operação |

## Tecnologias

- [[30 - Desenvolvimento#Catálogo planejado|ABAP]]
- [[30 - Desenvolvimento#Catálogo planejado|CDS e DCL]]
- [[30 - Desenvolvimento#Catálogo planejado|RAP]]
- [[30 - Desenvolvimento#Catálogo planejado|Fiori e UI5]]
- [[30 - Desenvolvimento#Catálogo planejado|SAP BTP]]
- [[30 - Desenvolvimento#Catálogo planejado|OData, HTTP, RFC, IDoc e APIs]]
- [[30 - Desenvolvimento#Catálogo planejado|Workflow e Forms]]
- [[30 - Desenvolvimento#Catálogo planejado|Qualidade e testes]]

## Conteúdo por módulo

```dataview
TABLE WITHOUT ID key AS "Módulo", length(rows) AS "Notas"
FROM "10 - Estudos" OR "20 - Módulos SAP" OR "30 - Desenvolvimento" OR "40 - Guias" OR "50 - Referências"
FLATTEN modulos AS key
WHERE key
GROUP BY key
SORT key ASC
```

## Conteúdo por tecnologia

```dataview
TABLE WITHOUT ID key AS "Tecnologia", length(rows) AS "Notas"
FROM "10 - Estudos" OR "20 - Módulos SAP" OR "30 - Desenvolvimento" OR "40 - Guias" OR "50 - Referências"
FLATTEN tecnologias AS key
WHERE key
GROUP BY key
SORT key ASC
```

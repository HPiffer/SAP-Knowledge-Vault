# Taxonomia

Este documento é a fonte de verdade para classificação, metadados e destinos.

## Tipos de conteúdo

| `tipo` | Destino principal | Quando usar |
|---|---|---|
| `estudo` | `10 - Estudos` | Conceitos, fundamentos, anotações e trilhas |
| `modulo` | `20 - Módulos SAP/<MÓDULO>` | Visão de um módulo, processo ou área de negócio |
| `template-dev` | `30 - Desenvolvimento` | Código ou checklist reutilizável com placeholders |
| `exemplo` | `30 - Desenvolvimento` | Implementação didática, não destinada a copiar sem adaptação |
| `step-by-step` | `40 - Guias/Step-by-Steps` | Procedimento reproduzível com validação e rollback |
| `troubleshooting` | `40 - Guias/Troubleshooting` | Diagnóstico de sintomas e solução verificada |
| `referencia` | `50 - Referências` | Consulta rápida, tabela, transação, objeto, API, link ou curso |

Runbooks usam `tipo: step-by-step` e são guardados em `40 - Guias/Runbooks` quando descrevem uma operação recorrente.

## Metadados obrigatórios

```yaml
---
id: sap-<slug-estavel>
tipo: estudo
status: rascunho
tecnologias: []
modulos: []
produtos: []
release: desconhecido
nivel: intermediario
autor: Nome
criado: YYYY-MM-DD
atualizado: YYYY-MM-DD
fontes: []
---
```

### Vocabulários controlados

- `tipo`: `estudo`, `modulo`, `template-dev`, `exemplo`, `step-by-step`, `troubleshooting`, `referencia`.
- `status`: `rascunho`, `validado`, `desatualizado`, `arquivado`.
- `nivel`: `basico`, `intermediario`, `avancado`.
- `release`: versão conhecida, `agnostico` ou `desconhecido`.
- `tecnologias`: use nomes oficiais e consistentes, como `ABAP`, `CDS`, `DCL`, `RAP`, `Fiori`, `UI5`, `BTP`, `OData`, `RFC`, `IDoc`.
- `modulos`: use códigos conhecidos, como `FI`, `CO`, `MM`, `SD`, `PP`, `PM`, `QM`, `EWM`, `TM`, `HCM`, `SuccessFactors`, `Basis`, `Security`.
- `produtos`: use nomes como `S4HANA`, `ECC`, `BTP`, `SuccessFactors` ou `BW4HANA`.

`fontes` aceita URLs ou wikilinks para anexos autorizados. `aliases` e `tags` são opcionais.

## Validação

Uma nota `validado` também precisa de:

```yaml
validado_por: Nome
validado_em: YYYY-MM-DD
```

E deve conter uma seção `## Evidência de validação` explicando o teste, revisão ou ambiente utilizado, sem revelar dados reais.

## Destino por predominância

1. Classifique primeiro pelo propósito principal.
2. Use pasta para o tipo e frontmatter para tecnologias, módulos, produtos e releases.
3. Quando dois destinos forem igualmente plausíveis, mantenha o item em `_Revisar`.
4. Nunca crie duas cópias para representar duas classificações.

## Nomes

- Nota: `Tecnologia ou módulo - Assunto específico.md`.
- Anexo: `tecnologia-assunto-tipo-01.ext`.
- `id`: `sap-<slug-estavel>`, sem data ou caminho.
- O `id` não muda quando a nota é renomeada.

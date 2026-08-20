---
id: sap-cds-exemplo-view-entity-basica
tipo: exemplo
status: rascunho
tecnologias: [CDS, ABAP]
modulos: []
produtos: [S4HANA]
release: desconhecido
nivel: intermediario
autor: Equipe SAP
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# CDS - Exemplo de view entity básica

## Objetivo

Mostrar a forma geral de uma CDS view entity. Os nomes são fictícios e o exemplo precisa ser adaptado ao dicionário e ao release do sistema-alvo.

## Exemplo

```abap
@EndUserText.label: 'Entidade de demonstração'
@AccessControl.authorizationCheck: #CHECK
define view entity ZI_Exemplo
  as select from zt_exemplo as Exemplo
{
  key Exemplo.id          as Id,
      Exemplo.descricao   as Descricao
}
```

## Pontos de adaptação

- Nome da entidade e da fonte de dados.
- Semântica dos campos e associações.
- Estratégia de autorização e DCL correspondente.
- Anotações aceitas no release-alvo.

## Testes

- Ativação sem erros.
- Resultado com dados fictícios.
- Comportamento de autorização com usuários de teste.

## Cuidados

Não use `#CHECK` sem criar e testar a regra de autorização apropriada. Não exponha campos apenas porque existem na tabela de origem.

## Fontes

Adicionar a documentação oficial de ABAP CDS correspondente ao release antes de validar.

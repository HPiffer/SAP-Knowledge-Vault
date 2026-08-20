---
id: sap-abap-template-relatorio-executavel
tipo: template-dev
status: rascunho
tecnologias: [ABAP]
modulos: []
produtos: [S4HANA, ECC]
release: desconhecido
nivel: basico
autor: Equipe SAP
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# ABAP - Template de relatório executável

## Objetivo

Fornecer um esqueleto mínimo de report para exercícios e protótipos locais. Adapte convenções, mensagens, autorizações e saída aos padrões do sistema-alvo.

## Compatibilidade

A sintaxe utilizada é deliberadamente básica. Confirme o release ABAP e as regras de qualidade do projeto.

## Pré-requisitos

- Pacote e ordem de transporte apropriados.
- Convenção de nomes do ambiente.
- Caso de teste com dados fictícios.

## Parâmetros e placeholders

| Placeholder | Descrição | Exemplo fictício |
|---|---|---|
| `z_exemplo_report` | Nome local do programa | Ajustar ao namespace autorizado |
| `p_texto` | Entrada demonstrativa | `DEMO` |

## Implementação

```abap
REPORT z_exemplo_report.

PARAMETERS p_texto TYPE string LOWER CASE.

START-OF-SELECTION.
  IF p_texto IS INITIAL.
    MESSAGE 'Informe um texto de demonstração' TYPE 'S' DISPLAY LIKE 'E'.
    RETURN.
  ENDIF.

  WRITE / p_texto.
```

## Como usar

1. Copie o esqueleto para um objeto autorizado.
2. Substitua nomes e mensagens conforme os padrões locais.
3. Acrescente validações, autorizações e tratamento de erros exigidos pelo caso.

## Testes

- Executar sem parâmetro e confirmar a mensagem.
- Executar com valor fictício e confirmar a saída.
- Rodar as verificações estáticas definidas pelo projeto.

## Segurança

Não use parâmetros para exibir dados sensíveis e não grave credenciais no código.

## Performance

Este exemplo não acessa dados. Ao adicionar consultas, aplicar filtros seletivos e medir no ambiente-alvo.

## Rollback

Remover o objeto ou reverter o transporte conforme o processo do projeto.

## Evidência de validação

Ainda não validado em um sistema SAP.

## Fontes

Adicionar referência oficial da versão ABAP usada antes de promover o status.

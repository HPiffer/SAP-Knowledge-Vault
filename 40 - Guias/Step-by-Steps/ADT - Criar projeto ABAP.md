---
id: sap-adt-criar-projeto-abap
tipo: step-by-step
status: rascunho
tecnologias: [ABAP, ADT]
modulos: []
produtos: [S4HANA, ECC]
release: desconhecido
nivel: basico
autor: Equipe SAP
criado: 2026-08-20
atualizado: 2026-08-20
fontes: []
---

# ADT - Criar projeto ABAP

## Resultado esperado

Um projeto ABAP local no ADT capaz de navegar apenas pelos objetos permitidos ao usuário de treinamento.

## Ambiente e compatibilidade

Confirme as versões do Eclipse, ADT e backend com o responsável pelo ambiente. Nunca registre host, usuário ou senha nesta nota.

## Pré-requisitos

- ADT instalado por fonte autorizada.
- Conectividade aprovada com o ambiente de treinamento.
- Usuário individual e autorizações mínimas necessárias.

## Procedimento

### 1. Abrir o assistente de projeto

**Ação:** use o comando de criação de ABAP Project no ADT.

**Resultado esperado:** o assistente apresenta os ambientes disponíveis ou permite informar uma conexão aprovada.

**Evidência:** captura anonimizada, sem host, usuário ou identificador interno.

### 2. Selecionar o ambiente

**Ação:** escolha a conexão previamente fornecida pelo responsável técnico.

**Resultado esperado:** o ADT solicita autenticação ou reutiliza uma sessão autorizada.

**Evidência:** não registrar credenciais.

### 3. Concluir e testar

**Ação:** conclua o assistente e abra um pacote permitido.

**Resultado esperado:** a árvore do projeto carrega sem erro e respeita as autorizações do usuário.

## Validação final

- O projeto reconecta após reiniciar o ADT.
- Apenas objetos autorizados são acessíveis.
- Nenhuma credencial foi salva no repositório.

## Rollback

Remova somente o projeto local do workspace; não selecione opções que apaguem objetos no backend.

## Erros comuns

| Sintoma | Causa provável | Ação |
|---|---|---|
| Conexão indisponível | Rede, VPN ou endpoint incorreto | Confirmar com o responsável, sem compartilhar credenciais |
| Autorização negada | Papel insuficiente | Solicitar análise de autorização pelo processo oficial |
| Incompatibilidade | ADT ou backend fora da matriz suportada | Confirmar versões e atualizar pelo canal autorizado |

## Evidência de validação

Ainda não validado em um ambiente SAP.

## Fontes

Adicionar a documentação oficial de instalação e conexão do ADT correspondente à versão usada.

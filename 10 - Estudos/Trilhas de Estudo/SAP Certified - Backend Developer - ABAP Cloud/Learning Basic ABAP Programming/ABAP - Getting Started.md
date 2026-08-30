---
id: sap-abap-getting-started
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud, BTP]
modulos: []
produtos: [BTP]
release: agnostico
nivel: basico
autor: Hayron Piffer
criado: 2026-08-29
atualizado: 2026-08-29
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---
# ABAP - Getting Started
## Fluxo de Aprendizagem Recomendado

```

[Etapa 1: Ambiente & BTP] ➔ [Etapa 2: Logística & Pacotes] ➔ [Etapa 3: Navegação & ADT]

                                                                        │

[Etapa 5: Desenvolvimento com IA] ◄─ [Etapa 4: Primeiro App Console] ◄──┘

```

---

## Etapa 1: Preparação do Ambiente de Desenvolvimento (Preparing the Development Environment)

### 1.1 Arquitetura de Acesso ao SAP BTP ABAP Environment

- **SAP Business Technology Platform (SAP BTP)**: Plataforma como serviço (PaaS) da SAP na qual instâncias do ambiente ABAP podem ser implantadas.

- **Estrutura de Contas e Subcontas**:

  - **Global Account**: Nível macro de gerenciamento da assinatura comercial SAP.

  - **Subaccounts**: Subambientes dentro da Global Account configurados independentemente para gerenciar diferentes fases do ciclo de vida (Desenvolvimento, Teste e Produção).

  - **Runtimes & Instâncias**: Dentro da subaccount, faz-se o deploy de runtimes (como Cloud Foundry ou Kyma) e a implantação da instância do **ABAP Environment**.

- **Outros Cenários**: Embora o foco seja o SAP BTP, os conceitos se aplicam igualmente a instâncias **SAP S/4HANA Cloud (Public/Private Edition)** e sistemas **SAP S/4HANA On-Premise**.

### 1.2 Instalação e Conexão no Eclipse ADT

- **Ferramenta Local**: Uso do **Eclipse IDE** com o plug-in **ABAP Development Tools (ADT)** instalado.

- **Criação do ABAP Cloud Project**:

  - Permite a conexão do Eclipse à instância de serviço ABAP no cloud.

  - Métodos de autenticação:

    1. **Service Instance URL**: Inserção direta da URL do serviço no assistente de criação de projeto no Eclipse.

    2. **Service Key**: Importação de arquivo JSON com as chaves de serviço, extração da URL e colagem no assitente.

  - Autenticação de Usuário: Direcionamento para o navegador web para logon seguro com as credenciais cadastradas na plataforma SAP.

---

## Etapa 2: Estrutura de Software e Logística (Understanding Software Structure and Logistics)

### 2.1 Pacotes ABAP (ABAP Packages)

- **Definição**: Containers lógicos do **ABAP Repository** que agrupam todos os objetos de desenvolvimento (*repository objects*) funcionalmente relacionados.

- **Vínculo com Software Component**: Todo pacote é atribuído a um componente de software que gerencia sua distribuição.

- **Organização Hierárquica**: Permite o uso de superpacotes (ex: superpacote `ZSTUDENTS` para conter pacotes de treinamento do grupo).

### 2.2 Conceito de Namespaces

- **Separação de Código**: Garante que desenvolvimentos customizados não entrem em conflito com objetos padrão da SAP durante atualizações (*upgrades*).

- **Regra do Namespace de Cliente**: Desenvolvimentos do cliente/parceiro devem iniciar compatoriamente com as letras **`Z`** ou **`Y`** (ex: pacote `ZS4D400_##`).

- **Namespaces Reservados**: Clientes/parceiros podem solicitar namespaces exclusivos à SAP, identificados por barras (ex: `/NAMESPACE/`).

### 2.3 Ordem de Transporte (Transport Requests)

- **Gestão de Mudanças e Logística**: Agrupamento de alterações e novos objetos para transporte coordenado entre os ambientes de Desenvolvimento, Teste e Produção.

- **Colaboração em Equipe**:

  - Cada Transport Request possui um proprietário (*owner*), que pode atribuir múltiplos usuários/desenvolvedores à mesma ordem.

- **Bloqueio de Objetos (Locking)**:

  - Ao incluir um objeto em uma Transport Request, ele fica bloqueado contra edições por usuários fora dessa ordem.

- **Ciclo de Liberação (Release Process)**:

  1. Cada desenvolvedor libera suas tarefas individuais (*tasks*).

  2. O proprietário libera a Transport Request principal.

  3. Os bloqueios dos objetos são removidos automaticamente e a ordem fica pronta para importação no sistema de teste pelo administrador.

---

## Etapa 3: Primeiro Contato e Navegação em ABAP (Taking a First Look at ABAP)

### 3.1 Organização e Navegação no ADT

- **Project Explorer**: Arvore principal do Eclipse que exibe os projetos ABAP e seus pacotes.

  - **Favorite Packages**: Recurso para adicionar pacotes mais utilizados (via clique com o botão direito `Add Package...`), facilitando o acesso direto.

  - **Link with Editor**: Botão na barra de ferramentas do Project Explorer que expande e destaca automaticamente no menu a localização exata do objeto aberto no editor.

### 3.2 Abertura e Inspeção de Objetos

- **Busca Rápida de Objetos**: Atalho **`Ctrl + Shift + A`** (*Open ABAP Development Object*) permite buscar e abrir qualquer objeto pelo nome.

- **Aba Properties**: Exibe dados administrativos do objeto posicionado (como idioma original, criador e carimbo de data/hora da última alteração).

### 3.3 Atalhos e Teclas de Função Essenciais

- **`F1` (ABAP Language Help)**: Abre a documentação técnica e ajuda de sintaxe oficial para o comando/instrução ABAP sob o cursor (ex: `SELECT`).

- **`F2` (Element Information)**: Exibe pop-up com informações detalhadas de tipo, estrutura e assinatura do elemento sob o cursor.

- **`F3` (Navigate to Definition)**: Navega para a definição/declaração do objeto ou método sob o cursor.

- **`Alt + Seta para Esquerda`**: Retorna ao ponto de origem no código após uma navegação via F3.

- **`Ctrl + F`**: Abre o diálogo de busca/substituição de texto no editor.

- **`Ctrl + Clique`**: Navegação rápida via mouse para definições e implementações.

---

## Etapa 4: Desenvolvendo Sua Primeira Aplicação ABAP (Developing Your First ABAP Application)

### 4.1 Conceito do App Console e Interface `IF_OO_ADT_CLASSRUN`

- **Interface de Usuário em Produção**: O padrão oficial para UI de aplicações finais é o **SAP Fiori elements**.

- **Ambiente de Testes Rápidos**: Para testes de lógica de backend e aprendizado sem necessidade de camada visual complexa, o ADT disponibiliza a **Console View**.

- **Interface `IF_OO_ADT_CLASSRUN`**:

  - Interface padrão que possibilita transformar uma classe ABAP em um programa executável de console no Eclipse.

  - Contém o método obrigatório `if_oo_adt_classrun~main( )`.

  - Fornece o objeto de saída **`out`** e seu método **`out->write( )`** para imprimir resultados, textos ou variáveis na tela.

### 4.2 Passo a Passo para o App "Hello World"

1. **Criação da Classe**:

   - No pacote pessoal (ex: `ZS4D400_##`), criar uma classe ABAP (ex: `ZCL_##_HELLO_WORLD`).

   - Adicionar a interface `IF_OO_ADT_CLASSRUN` durante o assistente de criação.

   - Atribuir a classe à Transport Request do desenvolvedor.

2. **Implementação da Lógica**:

   ```abap

   METHOD if_oo_adt_classrun~main.

     out->write( 'Hello World' ).

   ENDMETHOD.

   ```

3. **Ativação e Execução**:

   - **`Ctrl + F3`**: Ativa a classe ABAP.

   - **`F9`**: Executa a classe como aplicação de console ABAP (*Run ABAP Development Object*).

4. **Visualização do Resultado**:

   - A saída é exibida na aba **Console** na parte inferior do Eclipse (`Window -> Show View -> Other -> Console`).

---

## Etapa 5: Amplificando o Desenvolvimento ABAP com IA (Amplifying ABAP Development with AI)

### 5.1 Visão Geral da IA Generativa no ABAP Cloud

- A integração de IA generativa no ecossistema SAP visa acelerar a produtividade do desenvolvedor, automatizar tarefas repetitivas e permitir a construção de aplicações inteligentes de negócio.

### 5.2 SAP Joule for Developers (Assistente no ADT)

O **Joule for Developers** é o assistente de IA integrado diretamente ao ambiente de desenvolvimento Eclipse ADT (`Window -> Show View -> Other... -> Joule`).

#### Recursos Principais:

1. **Joule Chat**: Chat interativo em linguagem natural para fazer perguntas de desenvolvimento, solicitar exemplos de código ou tirar dúvidas de arquitetura.

2. **Predictive Code Completion (Ghost Text)**:

   - Sugestões contínuas de código exibidas em tom cinza (*ghost text*) na posição do cursor ao fazer uma breve pausa na digitação.

   - Suporta classes, interfaces e programas.

   - Pode ser ativado ou desativado na barra de ferramentas do ADT.

3. **Explain (`/explain`)**:

   - Gera explicações detalhadas ou resumidas de objetos selecionados no Project Explorer ou linhas de código destacadas no editor.

   - Suporta comandos em linguagem natural e oferece respostas interativas com *quick replies* e perguntas de acompanhamento.

4. **Capacidades Especiais do Joule**:

   - **ABAP Unit Test Generation**: Geração automatizada de testes unitários para classes ABAP.

   - **CDS Test Generation**: Criação de classes de teste e dados simulados para CDS entities.

   - **OData UI Service from Scratch**: Geração de objetos de repositório para serviços RAP a partir de conversação.

   - **RAP Business Logic Prediction**: Sugestão e implementação de *validations* e *determinations* nas definições de comportamento (BDEF).

   - **Consume OData**: Geração de código ABAP para consumo de serviços OData via *OData Client Proxy*.

   - **GenAI-Driven Extensibility Assistant**: Auxílio na criação de campos customizados e visualização de views de ajuda de valor (*value help*).

- *Boas Práticas*: O código gerado por IA pode variar; o desenvolvedor deve sempre revisar e testar o código antes de levá-lo para produção.

### 5.3 ABAP AI SDK (Desenvolvimento de Aplicações com IA)

- **Definição**: Biblioteca/Software Development Kit que permite aos desenvolvedores incorporar modelos de linguagem de grande porte (LLMs) diretamente em suas próprias aplicações de negócio ABAP.

- **Principais APIs do SDK**:

  - **Completion API**: Envia prompts a partir do código ABAP e recebe a resposta textual do LLM.

  - **Prompt Library API**: Utiliza templates de prompts pré-definidos e estruturados.

  - **Tracing (ABAP Cross Trace)**: Ferramenta de diagnóstico para rastrear chamadas de API, verificar a pilha de execução e resolver erros.

- **Pré-requisito**: O administrador do sistema deve configurar previamente as conexões com o **Generative AI Hub** do SAP BTP.

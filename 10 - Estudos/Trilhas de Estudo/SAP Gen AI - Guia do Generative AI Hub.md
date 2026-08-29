---
id: sap-gen-ai-guia-generative-ai-hub
tipo: estudo
status: rascunho
tecnologias: [Generative AI Hub, SAP AI Foundation, SAP AI Core, RAG, BTP]
modulos: []
produtos: [BTP]
release: agnostico
nivel: intermediario
autor: Hayron Piffer
criado: 2026-08-29
atualizado: 2026-08-29
fontes: []
tags: [sap, ia, generative-ai]
---

# SAP Gen AI - Guia do Generative AI Hub

## Módulo 1: Visão Geral e Infraestrutura (SAP AI Foundation)


O **SAP AI Foundation** funciona como o "sistema operacional de IA" da SAP, integrado ao SAP Business Technology Platform (SAP BTP), permitindo que organizações construam, estendam e executem soluções de IA de nível empresarial.

### Três Pilares da IA no SAP

* **Relevante (Grounding Corporativo):** Conecta os LLMs aos dados reais da empresa por meio do SAP HANA Vector Engine e do SAP Knowledge Graph, garantindo respostas altamente precisas e contextualizadas.

* **Confiável (Acesso Unificado e Desempenho):** Centraliza o acesso a múltiplos modelos de linguagem de ponta de provedores diversos (como Azure OpenAI, Google e AWS), reduzindo a dependência de um único fornecedor e suportando atualizações de versão gerenciadas.

* **Responsável (Segurança e Governança desde o Projeto):** Aplica governança estrita, mascaramento de dados sensíveis e filtros de conteúdo contra *prompt injection* e *jailbreaking*. Os dados dos clientes são mantidos isolados e nunca são compartilhados para treinamento de modelos.

### Arquitetura em 4 Camadas

1. **OS Interfaces Layer:** Ponto de entrada do usuário onde residem o AI Playground e as ferramentas de desenvolvimento.

2. **AI Kernel Layer:** Núcleo responsável por gerenciar agentes, cargas de trabalho, escalonamento e o ciclo de vida dos modelos.

3. **AI Integration Layer:** Facilita a conectividade com fontes de dados, pipelines e orquestração de IA.

4. **Peripheral and Data Layer:** Infraestrutura base conectando dados SAP e não-SAP.


---

## Módulo 2: Padrões de Aplicação da IA Generativa

A IA generativa no ambiente empresarial vai além de simples assistentes de conversação (*chatbots*), abrangendo interações complexas entre humanos e sistemas.

### Os 4 Padrões de Interação Entrada/Saída

* **Human-to-AI:** O usuário faz uma pergunta em linguagem natural e a IA responde diretamente (ex.: analista solicitando resumo de chamados de suporte).

* **Software-to-AI:** Um sistema envia dados operacionais para a IA gerar análises ou relatórios automáticos (ex.: sistema de vendas alimentando dados para a IA destacar gargalos de entregas).

* **Human-to-Software via AI:** As instruções em linguagem natural do usuário são traduzidas em execuções de software ou código (ex.: desenvolvedor solicitando estrutura base de um serviço OData no SAP BTP).

* **Software-to-Software via AI:** Processos automatizados entre sistemas acionam serviços de IA para orquestrar workflows inteiros (ex.: identificação de déficit de pessoal no SuccessFactors disparando busca no sistema de recrutamento).


---

## Módulo 3: Ferramentas e Interface do Generative AI Hub

O acesso ao Generative AI Hub é realizado por meio do **SAP AI Launchpad**, uma aplicação SaaS multilocatária no SAP BTP.
### Principais Módulos do SAP AI Launchpad

* **Workspaces:** Gerenciamento de conexões de API e organização de recursos por grupos (*Resource Groups*).

* **Generative AI Hub:** Ambiente central para desenvolvimento de prompts, exploração de modelos e ciclo de vida.

* **SAP AI Core Administrator:** Configuração de repositórios Git, segredos de conexão e infraestrutura.

* **ML Operations:** Gerenciamento de executáveis, implantação de modelos e datasets para prototipagem.

### Recursos e Ferramentas da Interface do Generative AI Hub

1. **Model Library:**

   * *Catalog Mode:* Visualização de metadados e do **Model Card** (custos, contexto, limites de tokens).

   * *Leaderboard Mode:* Comparação do desempenho dos modelos em benchmarks de mercado.

   * *Chart Mode:* Gráficos para otimização visual entre custo por token e tamanho de janela de contexto.

2. **Chat Interface:** Plataforma conversacional para prototipagem rápida de assistentes e validação de fluxos com retenção do histórico do chat.

3. **Prompt Editor & Prompt Management:**

   * Criação de blocos de mensagens para papéis de **System**, **User** e **Assistant**.

   * Definição de variáveis em tempo de execução e versionamento estruturado de prompts corporativos.

4. **Grounding Management:** Gestão de pipelines de dados para integração com SharePoint, Amazon S3 e bases vetoriais corporativas.

5. **Orchestration Interface:** Criação e teste de fluxos de orquestração complexos, aplicando moderação de conteúdo, mascaramento de dados e integração via **SAP Cloud SDK for AI** (compatível com SpringAI, LangChain e LangGraph).
  

---

## Módulo 4: Ciclo de Vida, Implantação e Governança

### Estratégias de Gerenciamento de Modelos

* **SAP Managed Models:** Acesso pré-configurado a LLMs de parceiros (Azure OpenAI GPT, Google Gemini, AWS Claude) com acordos comerciais e privacidade gerenciados pela SAP.
* **Self-Hosted Models:** Implantação e hospedagem de modelos próprios ou open-source ajustados (*fine-tuned*) na infraestrutura do cliente.
* **SAP Hosted Models:** Modelos hospedados diretamente na infraestrutura SAP otimizados para o ecossistema.
### Atualização e Proteção de Modelos

* **Estratégia de Upgrades:** Suporte a atualizações automáticas (*auto-upgrade*) ou manuais para lidar com o ciclo de descontinuação e evolução das versões dos LLMs sem interromper a produção.
* **Governança e Segurança:** Isolamento lógico via *Resource Groups* no SAP AI Core, auditoria por meio de registros de chamadas, controle de acesso baseado em funções e conformidade com padrões SOC 2, NIST e ISO.
---
id: sap-gen-ai-guia-orchestration-service
tipo: estudo
status: rascunho
tecnologias: [Orchestration Service, Generative AI Hub, SAP AI Core, BTP]
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

# SAP Gen AI - Guia do Orchestration Service

## Módulo 1: O que é o Orchestration Service?

O **Orchestration Service** é um serviço gerenciado no **SAP AI Core** que atua como coordenador central para o acesso, controle e execução unificada de modelos de IA generativa. Em vez de interações isoladas com LLMs, ele permite projetar e gerenciar fluxos de trabalho de IA complexos e prontos para produção.

### Desafios Corporativos Resolvidos

* **Agnosticismo de Provedor e Integração Harmonizada:** Oferece uma API unificada para interagir com múltiplos LLMs de diferentes fornecedores sem acoplar o código da aplicação a um modelo específico.
* **Controle Centralizado e Conformidade:** Fornece mecanismos integrados de governança e segurança (como anonimização e mascaramento) para garantir adesão às normas de privacidade de dados e padrões éticos da SAP.
* **Eficiência e Escalabilidade:** Automatiza processos de várias etapas, conectando a saída de um módulo diretamente como entrada do seguinte.
* **Expansibilidade Modular:** Permite adicionar ou adaptar facilmente recursos como aterramento (*grounding*), tradução, mascaramento e filtragem de conteúdo.

### Pré-requisitos Técnicos

Para utilizar o Orchestration Service, é necessário ter:

1. Conta ativa no **SAP BTP**.
2. Instância do **SAP AI Core** configurada.
3. Plano de serviço estendido (**Extended Service Plan**) do SAP AI Core.
4. Implantação (*deployment*) do serviço de orquestração em um grupo de recursos.


---

## Módulo 2: Recursos e Módulos Principais

O serviço é composto por módulos altamente personalizáveis que executam tarefas específicas dentro da esteira de processamento:

1. **Grounding (Aterramento):** Conecta o prompt a fontes de dados corporativas (como sistemas SAP e repositórios de documentação) para enriquecer o contexto com fatos em tempo real e combater alucinações do modelo.
2. **Templating (Modelagem de Prompts):** Permite criar prompts reutilizáveis contendo *placeholders* preenchidos dinamicamente no momento da inferência, além de definir personas e instruções de sistema.
3. **Data Masking (Mascaramento de Dados):** Identifica e pseudonimiza informações de identificação pessoal (PII) — como e-mails, nomes e telefones — antes que o texto seja enviado ao LLM.
4. **Content Filtering (Filtragem de Conteúdo):** Analisa entradas e saídas para bloquear conteúdos tóxicos, inadequados ou fora dos padrões de segurança corporativos.
5. **Translation (Tradução):** Realiza a tradução transparente do prompt de entrada e da resposta gerada, viabilizando cenários multilíngues globais.
  

---

## Módulo 3: O Fluxo Sequencial da Orquestração

Para garantir a segurança, integridade dos dados e governança, os módulos do Orchestration Service operam em uma ordem sequencial padronizada acionada por uma única chamada de API:
  

```

[Entrada do Usuário]

       ↓

[1. Grounding] ➔ Busca dados corporativos relevantes

       ↓

[2. Templating] ➔ Une contexto, instrução e entrada em um template

       ↓

[3. Input Masking] ➔ Anonimiza dados sensíveis (PII)

       ↓

[4. Input Filtering] ➔ Verifica segurança/toxicidade da entrada

       ↓

[5. Input Translation] ➔ Traduz para o idioma operacional do LLM

       ↓

[6. Processamento no LLM] ➔ Gera a resposta com base no prompt tratado

       ↓

[7. Output Filtering] ➔ Verifica segurança/toxicidade da resposta

       ↓

[8. Output Translation] ➔ Traduz de volta para o idioma do usuário

       ↓

[Resposta Final Tratada]

```



> **Flexibilidade de Configuração:** Embora a sequência lógica seja fixa para garantir a segurança, cada módulo pode ser ativado, desativado ou configurado individualmente de acordo com a necessidade do caso de uso.

  

---

## Módulo 4: Casos de Uso Práticos

### Caso 1: Resposta Automatizada a Suporte Técnico (Multilíngue e Seguro)

* **Cenário:** Um cliente envia um e-mail em alemão solicitando suporte para configurar notificações no SAP Signavio e incluindo seu e-mail pessoal.
* **Execução do Fluxo:**
  1. O *Grounding* busca a documentação oficial em help.sap.com sobre notificações do SAP Signavio.
  2. O *Templating* insere as instruções de persona de suporte e o contexto recuperado.
  3. O *Input Masking* substitui o e-mail do cliente por um pseudônimo.
  4. O *Input Filtering* e a *Tradução* preparam o texto seguro em inglês para o LLM.
  5. O LLM gera a resposta embasada, que passa por filtragem de saída e tradução final de volta para o alemão.


### Caso 2: Análise de Feedback Interno de RH (Fluxo Simplificado)
* **Cenário:** O departamento de RH analisa formulários de feedback de funcionários enviados em inglês para extrair sentimentos e identificar possíveis violações de políticas.
* **Otimização do Fluxo:** Como a entrada e a saída desejadas já estão em inglês, as etapas de **tradução de entrada e saída são desativadas**, reduzindo o tempo de processamento e os custos operacionais. O fluxo mantém o *Grounding* nas políticas internas de RH, o *Mascaramento de PII* dos funcionários e a *Filtragem de Conteúdo*.


---

## Módulo 5: Desenvolvimento e Integração com SDK

Para desenvolvedores, a implementação do Orchestration Service é simplificada através das ferramentas da SAP:

* **SAP Cloud SDK for AI:** Permite definir a configuração dos módulos e templates via arquivos JSON.
* **Chamada Única de API (*Single API Call*):** Toda a esteira complexa de processamento (Grounding ➔ Mascaramento ➔ Filtragem ➔ LLM ➔ Tradução) é disparada por uma única chamada REST para o endpoint de orquestração, eliminando a necessidade de orquestrar chamadas de serviço manualmente na aplicação cliente.
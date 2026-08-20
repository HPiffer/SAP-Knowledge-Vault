# Contrato operacional do SAP Knowledge Vault

## Objetivo

Organize esta base Obsidian sem duplicar conhecimento, sem expor dados confidenciais e sem alterar material fora deste repositório.

## Instruções permanentes

- Trabalhe em português e preserve nomes técnicos oficiais SAP em inglês.
- Leia `99 - Sistema/Taxonomia.md` e `99 - Sistema/Governança.md` antes de classificar conteúdo.
- Ao receber **Processar a Entrada**, processe somente os itens dentro de `00 - Entrada`, preservando alterações não relacionadas existentes.
- Nunca importe automaticamente o antigo export do Notion.
- Nunca delete um arquivo de entrada. Mova conteúdo seguro para o destino definitivo e conteúdo inseguro, ambíguo, duplicado ou corrompido para `00 - Entrada/_Revisar`.
- Não registre valores sensíveis nos logs. Registre apenas o nome do arquivo e a categoria do alerta.
- Não marque uma nota como `validado` sem `validado_por`, `validado_em` e evidência real em `## Evidência de validação`.
- Não invente compatibilidade SAP. Use `release: desconhecido` quando a fonte não determinar a versão.
- Preserve fontes e direitos autorais: resuma materiais externos e mantenha o arquivo original somente quando houver autorização para armazená-lo.

## Destinos

- Conceito, formação e trilha de aprendizagem: `10 - Estudos`.
- Visão funcional ou técnica de módulo SAP: `20 - Módulos SAP/<MÓDULO>`; crie a pasta apenas quando houver conteúdo.
- Template, exemplo de código ou checklist de engenharia: `30 - Desenvolvimento/<TECNOLOGIA>`.
- Procedimento detalhado, diagnóstico ou operação: `40 - Guias`.
- Consulta rápida, transação, objeto, API, link ou curso: `50 - Referências`.
- Imagem, documento, dado ou pacote de apoio: `60 - Anexos`.
- Template do próprio Obsidian: `90 - Templates Obsidian`.

Não duplique uma nota por ela pertencer a vários módulos ou tecnologias. Escolha um único destino pelo tipo principal e represente as demais relações no frontmatter e com links.

## Sequência de triagem

1. Verifique o estado do Git e preserve mudanças locais.
2. Inventarie os itens da Entrada e compare conteúdo, hash, título e aliases com o acervo.
3. Procure credenciais, dados pessoais, nomes/identificadores de clientes e material sem autorização de distribuição antes de preparar qualquer commit.
4. Classifique o item segundo a taxonomia e escolha o template correspondente.
5. Normalize nome, título, frontmatter, seções e fontes; converta texto bruto em Markdown quando apropriado.
6. Mova anexos para `60 - Anexos` e atualize todas as referências.
7. Atualize páginas de navegação quando surgir um domínio ainda não representado.
8. Execute `npm test`.
9. Crie `99 - Sistema/Logs de Triagem/AAAA/AAAA-MM-DD-HHmm.md` com o manifesto do lote, sem dados sensíveis.
10. Execute novamente `npm test` e crie um único commit `triagem: AAAA-MM-DD HHmm - N itens`.

Se houver mais de um destino plausível, não adivinhe: envie o item para `_Revisar` e registre o motivo.

## Convenções de edição

- Use IDs únicos no formato `sap-<slug-estavel>`.
- Use wikilinks para notas e anexos internos.
- Mantenha no máximo três níveis úteis de pastas.
- Evite `Untitled`, hashes de exportação, emojis decorativos e siglas sem explicação no nome do arquivo.
- Arquivos devem seguir `Tecnologia ou módulo - Assunto específico.md`.
- Anexos devem seguir `tecnologia-assunto-tipo-01.ext`.
- Execute `npm test` depois de qualquer movimentação, renomeação ou edição de metadados.
- Não altere taxonomia, templates e regras de governança silenciosamente; faça a mudança em um commit próprio.

## Git

- Commits diretos na `main` são permitidos.
- Faça pull com rebase antes de iniciar um lote quando houver remoto configurado.
- Nunca use force-push.
- Não versione o conteúdo bruto de `00 - Entrada`, `.trash`, estado de workspace do Obsidian, cache ou binários de plugins.

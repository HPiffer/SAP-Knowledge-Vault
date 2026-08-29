# Contrato operacional do SAP Knowledge Vault

> Este é o arquivo de contexto que o Claude carrega automaticamente ao abrir o repositório na raiz. Todas as instruções abaixo são obrigatórias para qualquer triagem ou edição feita pelo Claude.

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
- Diferencie leitura de escrita antes de agir: só crie, mova ou edite arquivos do cofre quando o pedido for explicitamente de escrita (ver seção abaixo).
- Antes de **Processar a Entrada**, formate cada item seguro com o agente `formatador-obsidian` (remoção de linhas em branco em excesso, indentação e correção de escrita) sem alterar informação ou contexto. É o passo 4 da Sequência de triagem.

## Ler vs. escrever no repositório (READ vs WRITE)

Nem todo pedido é para modificar o cofre. Classifique a intenção antes de tocar em qualquer arquivo:

- **READ / gerar resultado** — o pedido é para *gerar, criar um exemplo, mostrar, exibir, rascunhar, esboçar, explicar, analisar, planejar, comparar ou sugerir* algo. A saída vai **para a conversa**, não para o repositório. NÃO crie, mova nem edite arquivos. Ex.: "gere um exemplo de X", "me mostre como ficaria", "como eu chamaria Y", "faça um rascunho", "analise este conteúdo".
- **WRITE / persistir** — o pedido é explicitamente para *salvar, adicionar, criar no repositório, gravar, incorporar, arquivar, atribuir no repositório, mover, renomear, editar/corrigir um arquivo existente* ou **Processar a Entrada**. Só então crie ou altere arquivos do cofre. Ex.: "salve no repositório", "adicione esta nota", "atribua este arquivo no cofre", "corrija a nota Z".

Regras:

- "Criar um exemplo/rascunho/modelo" por si só é READ — entregue o conteúdo na conversa. Só vira arquivo se o usuário pedir para **salvá-lo**.
- Na dúvida entre READ e WRITE, trate como READ e **pergunte** antes de escrever.
- Um resultado READ pode ser oferecido para salvar ("quer que eu salve isto no cofre?"), mas a escrita só ocorre após confirmação explícita.

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
4. Formate cada item seguro da Entrada com o agente `formatador-obsidian` antes de classificar: remova linhas em branco em excesso (mantendo a nota arejada), ajuste a indentação para melhorar a leitura e corrija erros de escrita — sempre **sem alterar a informação, os dados técnicos ou o contexto**. Não formate itens inseguros, ambíguos, duplicados ou corrompidos: esses vão para `_Revisar`.
5. Classifique o item segundo a taxonomia e escolha o template correspondente.
6. Normalize nome, título, frontmatter, seções e fontes; converta texto bruto em Markdown quando apropriado.
7. Mova anexos para `60 - Anexos` e atualize todas as referências.
8. Atualize páginas de navegação quando surgir um domínio ainda não representado.
9. Execute `npm test`.
10. Crie `99 - Sistema/Logs de Triagem/AAAA/AAAA-MM-DD-HHmm.md` com o manifesto do lote, sem dados sensíveis.
11. Execute novamente `npm test` e crie um único commit `triagem: AAAA-MM-DD HHmm - N itens`.

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

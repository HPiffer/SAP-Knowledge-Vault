# SAP Knowledge Vault

Base de conhecimento técnica e colaborativa, pública para consulta e reutilização, dedicada a estudos, desenvolvimento, guias e referências SAP.

## Comece por aqui

1. Abra [[01 - Portal/Início|Início]].
2. Leia [[01 - Portal/Como contribuir|Como contribuir]].
3. Coloque qualquer material novo em `00 - Entrada`.
4. No Claude, trabalhando na raiz deste repositório, peça: **Processar a Entrada**.

O Claude aplica as regras do [[99 - Sistema/Taxonomia|contrato de conteúdo]], organiza os arquivos, atualiza os links e registra a execução em `99 - Sistema/Logs de Triagem`. Ao abrir o repositório na raiz, o Claude carrega automaticamente o contrato operacional em `CLAUDE.md`.

## Requisitos

- Obsidian;
- plugins comunitários **Templater** e **Dataview**;
- Git e Git LFS;
- Node.js 20 ou superior para a validação local.

## Preparação local

```powershell
git lfs install
npm test
```

Abra esta pasta como um cofre no Obsidian. Instale os plugins listados quando o Obsidian solicitar e mantenha a execução de JavaScript do Dataview desativada.

## Colaboração

- Use o repositório público no GitHub como fonte compartilhada; não sincronize este mesmo cofre pelo OneDrive.
- A leitura e o fork são públicos, mas a edição direta é limitada aos colaboradores autorizados no GitHub.
- Atualize a cópia local antes de editar.
- Faça commits pequenos e focados diretamente na `main`.
- Não use force-push.
- Nunca adicione senhas, tokens, dados pessoais, informações internas ou conteúdo confidencial de clientes; considere todo arquivo versionado como publicamente acessível.

## Validação

Execute `npm test` antes de cada commit. O mesmo conjunto de verificações roda no GitHub e cobre metadados, IDs, nomes, links internos, conteúdo sensível e arquivos indevidamente versionados na Entrada.

O antigo export do Notion não faz parte deste cofre e não deve ser importado automaticamente.

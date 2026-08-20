---
aliases: [Contribuição, Guia de contribuição]
tags: [sap, governanca, colaboracao]
---

# Como contribuir

## Fluxo rápido

1. Atualize a `main` local com rebase.
2. Coloque o material novo em `00 - Entrada`.
3. Abra o Codex na raiz do cofre e peça **Processar a Entrada**.
4. Revise o relatório gerado e execute `npm test`.
5. Envie o commit para o repositório público se você possuir permissão de escrita; demais pessoas podem contribuir pelo fluxo aceito pelos mantenedores.

## Edição de conteúdo existente

- Use o template correspondente ao tipo da nota.
- Atualize o campo `atualizado`.
- Preserve o `id`, mesmo se o arquivo for renomeado.
- Adicione fontes e informe a compatibilidade por release.
- Não duplique a mesma explicação em mais de uma pasta; crie links.
- Só use `status: validado` após teste ou revisão documentada.

## Git

- O conteúdo é público para leitura e reutilização.
- Somente colaboradores autorizados podem editar diretamente a `main`.
- Commits diretos na `main` são permitidos.
- Um commit deve representar uma mudança coerente.
- Use mensagens como `docs: ampliar guia de RAP` ou `triagem: 2026-08-20 1430 - 3 itens`.
- Não use force-push.
- Para renomear ou mover muitas notas, processe tudo no mesmo commit e valide os links.

## Segurança

Não armazene:

- senhas, tokens, cookies, certificados privados ou arquivos de credenciais;
- CPF, e-mail pessoal, telefone ou outros dados pessoais;
- nomes de clientes, hosts, URLs internas, IDs de sistemas ou capturas com dados reais;
- código proprietário sem autorização;
- documentos cuja licença não permita compartilhamento.

Considere que todo conteúdo enviado ao GitHub poderá ser lido, copiado e indexado publicamente.

Substitua valores reais por placeholders explícitos, como `<USUARIO>`, `<HOST>` e `<DESTINO_RFC>`.

## Antes do commit

- [ ] A nota possui todos os metadados obrigatórios.
- [ ] O título segue o padrão definido.
- [ ] Release e fontes foram informados honestamente.
- [ ] Código e imagens não contêm dados reais.
- [ ] Links internos abrem corretamente.
- [ ] `npm test` terminou sem erros.

Veja também [[99 - Sistema/Governança|Governança]] e [[99 - Sistema/Taxonomia|Taxonomia]].

# Prompt — Processar a Entrada

Use este texto no Claude aberto na raiz do SAP Knowledge Vault:

> Processe todos os itens de `00 - Entrada` seguindo integralmente o `CLAUDE.md`, a Taxonomia e a Governança. Preserve mudanças locais não relacionadas. Faça a análise de segurança antes de preparar qualquer arquivo para Git. Aplique automaticamente classificações seguras, coloque ambiguidades em `_Revisar`, atualize links e páginas de navegação, execute `npm test`, gere o relatório de triagem sem valores sensíveis e crie um único commit para o lote. Não envie o commit ao remoto sem uma solicitação explícita.

## Resultado esperado

- Entrada vazia, exceto `README.md` e itens que exigem revisão.
- Conteúdo seguro em um único destino definitivo.
- Frontmatter completo e padronizado.
- Anexos com nomes normalizados e links atualizados.
- Validação concluída sem erros.
- Relatório do lote em `99 - Sistema/Logs de Triagem/AAAA`.
- Commit local atômico, sem push automático.

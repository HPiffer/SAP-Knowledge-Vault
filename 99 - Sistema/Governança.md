# Governança

## Princípios

- O repositório privado é a fonte de verdade compartilhada.
- A base prioriza conhecimento reproduzível, rastreável e seguro.
- Todos podem editar diretamente; qualidade é protegida por templates, validação automática e histórico Git.
- A documentação oficial SAP e a compatibilidade do sistema-alvo prevalecem sobre qualquer nota interna.

## Ciclo de vida

1. `rascunho`: conteúdo útil, ainda não verificado.
2. `validado`: revisado ou testado com evidência registrada.
3. `desatualizado`: não deve ser aplicado sem nova verificação.
4. `arquivado`: preservado por contexto histórico, fora do uso normal.

Não promova automaticamente um rascunho. A IA pode estruturar e corrigir a nota, mas a validação depende de evidência humana ou técnica real.

## Segurança e privacidade

- O repositório não é um cofre de segredos.
- Use apenas dados fictícios e placeholders explícitos em código, imagens e exemplos.
- Materiais de cliente exigem anonimização e autorização antes da entrada.
- Arquivos sob suspeita ficam em `00 - Entrada/_Revisar`, que não é versionado.
- Relatórios de triagem registram a categoria do problema, nunca o valor encontrado.

## Fontes e direitos autorais

- Prefira links para documentação oficial.
- Resuma materiais externos em vez de reproduzi-los integralmente.
- Preserve autor, origem e versão quando conhecidos.
- Só armazene PDF, livro, treinamento ou código externo se houver permissão de distribuição no grupo.

## Manutenção semanal

- Processar a Entrada pendente.
- Revisar rascunhos antigos e itens com `release: desconhecido`.
- Verificar notas `desatualizado`.
- Executar `npm test`.
- Revisar relatórios de triagem e conflitos Git recentes.

## Mudanças estruturais

Alterações em taxonomia, templates, `AGENTS.md`, validações ou pastas principais devem ocorrer em commit próprio e atualizar a documentação relacionada no mesmo lote.

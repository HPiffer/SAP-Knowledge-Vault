# Logs de triagem

Cada lote processado gera uma nota em `AAAA/AAAA-MM-DD-HHmm.md` com:

- data, operador e quantidade de itens;
- origem e destino de cada arquivo;
- classificação aplicada;
- renomeações e conversões;
- alertas sem valores sensíveis;
- itens mantidos em `_Revisar`;
- resultado da validação;
- hash do commit, quando disponível.

Os logs são auditáveis, mas não substituem o histórico Git.

# Instruções para alterações no repositório

Antes de processar dados ou editar regras, leia:

1. [Mapa do inventário](docs/inventario/README.md)
2. [Orquestrador multiloja](docs/inventario/ORQUESTRADOR_MULTILOJA.md)
3. [Contrato de dados](docs/inventario/CONTRATO_DE_DADOS.md)
4. [Schema de saída](docs/inventario/saida_reabastecimento.schema.json)

## Regras obrigatórias

- Trate a DMM ponderada, o ES das Curvas A/B e o rateio proporcional documentados como linha de base. Não mude fórmula, pesos ou arredondamento sem decisão registrada.
- Faça toda aritmética de processamento em código reproduzível (Python/Pandas, conforme a especificação); não estime campos ausentes.
- Não associe uma filial pelo nome do arquivo. Use uma correspondência de loja confirmada.
- Confira períodos e completude da série antes de agregar. Períodos futuros, janelas inconsistentes, duplicidades ou unidades incompatíveis bloqueiam o SKU.
- Leia os logs MAPE e de anomalias exigidos pelo fluxo. MAPE acima de 20% é sinal de revisão, não fator automático de estoque.
- Preserve vendas e saldos de origem. Saldo negativo gera alerta de ajuste físico urgente; não corrija o ERP nem elimine o saldo por inferência.
- Não emita sugestão de compra se faltar a fórmula aprovada de compra ou a posição de suprimento necessária.
- Em caso de bloqueio, produza relatório de validação separado. Nunca represente bloqueio como compra zero nem invente campos fora do schema de produção.
- Antes de emitir JSON de produção, valide o schema e a soma das três alocações contra a compra total.
- Documente o método, versão, fonte e resultado necessário para reproduzir cada execução.
- Este repositório é público: não adicione bases reais, PDFs operacionais, credenciais, dados pessoais nem achados identificáveis derivados de fontes privadas. Use apenas exemplos sintéticos/sanitizados.

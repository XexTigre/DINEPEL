# DINEPEL

## Inventário multiloja

Este repositório contém a especificação inicial do fluxo de sugestão de compras e distribuição de estoque. Nesta etapa, há documentação; ainda não há importador de bases nem cálculo de produção.

- [Como o orquestrador vai funcionar](docs/inventario/ORQUESTRADOR_MULTILOJA.md)
- [Contrato lógico dos dados de entrada](docs/inventario/CONTRATO_DE_DADOS.md)
- [Schema JSON de saída por SKU](docs/inventario/saida_reabastecimento.schema.json)

A especificação registra as fórmulas de DMM, estoque de segurança e rateio recebidas, além das regras que precisam ser fechadas antes de calcular uma compra total. O processamento planejado executará operações numéricas por código e validará cada resultado.

Este repositório é público. Não versionar bases reais, credenciais, dados pessoais ou documentos fiscais. Os arquivos de origem devem ser mapeados e tratados fora do repositório; exemplos para testes precisam ser sanitizados.

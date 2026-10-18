# DINEPEL

## Inventário multiloja

Este repositório documenta o fluxo de sugestão de compras e distribuição de estoque para três lojas. Está na fase de especificação: ainda não há importador de bases, cálculo de produção nem integração com o SysPro.

Comece pelo [índice do inventário](docs/inventario/README.md). As fórmulas recebidas são a linha de base e as operações numéricas planejadas devem ser executadas por código reproduzível.

## Estrutura atual

~~~text
DINEPEL/
├── AGENTS.md
├── README.md
├── .gitignore
└── docs/
    └── inventario/
        ├── README.md
        ├── ORQUESTRADOR_MULTILOJA.md
        ├── CONTRATO_DE_DADOS.md
        ├── REVISAO_METODOLOGICA_2026-10.md
        └── saida_reabastecimento.schema.json
~~~

## Regras para as bases

O repositório é público. Não versionar bancos reais, exportações, PDFs operacionais, credenciais, dados pessoais ou relatórios derivados de fontes privadas. Para testes, usar apenas dados sintéticos ou sanitizados. Diretórios locais comuns de bases e exportações estão listados no [arquivo .gitignore](.gitignore).

## Documentos

- [Índice e fluxo do inventário](docs/inventario/README.md)
- [Como o orquestrador vai funcionar](docs/inventario/ORQUESTRADOR_MULTILOJA.md)
- [Contrato lógico dos dados de entrada](docs/inventario/CONTRATO_DE_DADOS.md)
- [Schema JSON de saída por SKU](docs/inventario/saida_reabastecimento.schema.json)
- [Revisão metodológica e referências — outubro de 2026](docs/inventario/REVISAO_METODOLOGICA_2026-10.md)

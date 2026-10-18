# DINEPEL

Base reutilizável de peças, marcas, aplicações e empresas, com documentação do inventário multiloja.

## Comece pelo app

A [prévia navegável](app/prototype/index.html) demonstra catálogo, marcas, empresas, filiais, vínculos, estoque, importações e histórico. Ela usa dados fictícios e salva apenas neste navegador. Veja [como executar e como a pasta está organizada](app/README.md).

O app ainda não tem API nem banco de produção. A arquitetura prevista está em [docs/app/ARQUITETURA.md](docs/app/ARQUITETURA.md); o contrato JSON do catálogo está em [docs/app/catalogo.schema.json](docs/app/catalogo.schema.json). A prévia não altera o SysPro nem recomenda compras.

## Inventário multiloja

As regras, os gates e o schema da saída de inventário ficam em [docs/inventario/](docs/inventario/README.md). A especificação mantém três lojas no contrato de saída. Ela não muda o número de filiais que o catálogo do app pode armazenar.

## Mapa do repositório

| Caminho | Conteúdo |
|---|---|
| `app/prototype/` | Prévia independente de instalação |
| `app/examples/` | Catálogos e bases fictícios |
| `app/figma-importer/` | Importador e instruções de camadas editáveis |
| `app/scripts/` | Exportação e empacotamento do importador |
| `app/tests/` | Testes funcionais da prévia |
| `docs/app/` | Arquitetura, contrato e validação do app |
| `docs/inventario/` | Regras e contrato de reabastecimento |

## Proteção dos dados

Este repositório é público. Mantenha aqui apenas código, contratos e exemplos sintéticos ou sanitizados. Bancos reais, PDFs operacionais, dados pessoais, credenciais, custos, vendas e saldos de empresas devem ficar em armazenamento privado.

- [Regras do projeto](AGENTS.md)
- [Guia do app](docs/app/README.md)
- [Arquitetura e grafos](docs/app/ARQUITETURA.md)
- [Validação](docs/app/VALIDACAO.md)
- [Inventário multiloja](docs/inventario/README.md)

# DINEPEL

Base reutilizável de peças, marcas e empresas, com documentação do inventário multiloja.

## App de consulta e cadastro

A [prévia navegável](prototype/index.html) permite testar catálogo, marcas, empresas e filiais, vínculos, estoque e importação. Abra o HTML baixado no navegador. O salvamento é local e os exemplos são fictícios.

Comece pelo [guia do app](docs/app/README.md). A [arquitetura com grafos](docs/app/ARQUITETURA.md) separa o cadastro técnico dos códigos, saldos e dados comerciais de cada empresa. A versão de produção ainda precisa de API autenticada e PostgreSQL.

O [importador de camadas editáveis](figma-importer/README.md) prepara as telas para Figma; a execução online permanece pendente porque a cota MCP Starter bloqueou o acesso. A [validação](docs/app/VALIDACAO.md) distingue testes locais das etapas ainda não executadas.

## Inventário multiloja

O [módulo de inventário](docs/inventario/README.md) continua em especificação, com três posições no schema de produção. Suas fórmulas e gates permanecem válidos. A prévia não calcula compras nem escreve no SysPro.

## Organização

| Caminho | Conteúdo |
|---|---|
| `prototype/index.html` | Prévia independente de instalação |
| `examples/` | Catálogo e base estritamente sintéticos |
| `figma-importer/` | Código e instruções para camadas editáveis |
| `docs/app/` | Arquitetura, contrato do catálogo e validação |
| `docs/inventario/` | Regras e schema de recomendação de compras |
| `tests/` | Verificações funcionais da prévia |

## Proteção das bases

O repositório é público. Use apenas exemplos sintéticos ou efetivamente sanitizados. Bancos reais, PDFs operacionais, dados pessoais, credenciais, custos, vendas e saldos de empresas ficam em ambiente privado. O GitHub guarda código e contratos; a operação multiusuário usa uma API e um banco.

- [Regras do projeto](AGENTS.md)
- [Guia do app](docs/app/README.md)
- [Arquitetura e relações](docs/app/ARQUITETURA.md)
- [Contrato do catálogo](docs/app/catalogo.schema.json)
- [Índice do inventário](docs/inventario/README.md)


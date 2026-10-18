# DINEPEL — base reutilizável de peças

Versão 0.1 · revisão de 18/10/2026.

O aplicativo permite construir uma base técnica própria e reaproveitar a mesma peça em cadastros de empresas diferentes. Cada empresa mantém códigos internos e dados operacionais próprios. O estoque pertence ao vínculo da peça com a empresa e à filial, nunca diretamente ao cadastro mestre.

## O que está entregue

- [Prévia navegável](../../prototype/index.html), independente de instalação e de bibliotecas externas: catálogo, ficha de peça, marcas, empresas, ficha da empresa, estoque, importações, histórico e estrutura dos dados.
- Cadastro local de peça, marca e empresa; detecção de duplicidade; vínculo de peça a uma empresa; filtro de marcas e empresa; busca; exportação e restauração do backup local.
- Consulta de um [catálogo público sintético](../../examples/catalogo-demo.json) no GitHub: resolve o commit de `main`, lê o arquivo naquele SHA e prepara um lote para conferência. A consulta não escreve no GitHub.
- [Contrato JSON do catálogo](catalogo.schema.json), [arquitetura e grafos](ARQUITETURA.md) e [limites e validação](VALIDACAO.md).
- [Importador para Figma](../../figma-importer/README.md), com camadas editáveis. Sua execução no Figma ainda precisa ser confirmada; o acesso MCP ao arquivo foi bloqueado pela cota Starter.

Todos os produtos, marcas, empresas, códigos e saldos de demonstração foram criados para este protótipo. Não são dados operacionais nem evidência de aplicação automotiva.

## Usar agora

Baixe `prototype/index.html` e abra no navegador. O arquivo já contém os dados de demonstração. Para testar a importação sem rede, selecione `examples/catalogo-demo.json` na tela **Importações**. Para testar a leitura online, use **Consultar GitHub** depois que os arquivos estiverem disponíveis em `XexTigre/DINEPEL`.

**Nova peça** cria uma ficha técnica pendente. **Vincular** associa a peça à empresa selecionada com código interno e sistema de origem. Troque a empresa no cabeçalho para consultar seus vínculos e saldos.

O salvamento da prévia usa `localStorage`, quando permitido pelo navegador. Exporte cópias JSON. O armazenamento local não oferece garantia de backup, controle de acesso ou operação simultânea. A restauração exige conferência e substitui a base local da prévia; não altera um ERP ou servidor.

## Implementar a versão de uso real

Implemente a API e o banco descritos em [ARQUITETURA.md](ARQUITETURA.md), com autenticação, autorização por empresa, migrações, importação transacional e backups com teste de restauração. A prévia não implementa esse servidor.

O catálogo pode atender qualquer quantidade de filiais. O [contrato de compra existente](../inventario/saida_reabastecimento.schema.json) continua limitado a três posições e conserva seus gates e fórmulas. O desenho do app não aprova compra, corrige saldo ou modifica o SysPro.

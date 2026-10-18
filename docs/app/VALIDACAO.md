# Validação da versão 0.1

Revisão: 18/10/2026. Fixtures inteiramente sintéticas, sem leitura ou processamento dos PDFs privados nesta entrega.

## Testado no navegador

O teste funcional automatizado executou 24 verificações com Chromium headless. Foram cobertos:

- catálogo inicial, busca, combinação com filtro de marca e estado sem resultados;
- dois produtos com o mesmo código em marcas diferentes;
- bloqueio de cadastro com marca + código já existentes e de marca repetida;
- criação de vínculo sem duplicar a peça e separação dos códigos internos ao trocar de empresa;
- preservação e sinalização de saldo negativo;
- CNPJ alfanumérico com dígitos inválidos recusado e exemplo com dígitos válidos aceito;
- consulta ao GitHub com rede simulada, resolução de SHA, revisão e aplicação do lote;
- reenvio idempotente do catálogo;
- bloqueio de conflitos de conteúdo, campos não previstos e unidades incompatíveis;
- recusa de backup que cruza filial e produto de empresas diferentes;
- escape de HTML em dados cadastrados;
- persistência após recarregar, exportação e restauração confirmada de backup;
- sete rotas principais, menu mobile e ausência de rolagem horizontal da página em 390, 768 e 1440 pixels;
- ausência de erros JavaScript nos fluxos exercitados.

As telas desktop, ficha da peça, importação e catálogo mobile foram renderizadas e inspecionadas visualmente. A versão mobile mostra as ações junto das peças. Tabelas extensas, como a matriz de estoque, usam rolagem interna.

O cenário de GitHub do teste usa respostas simuladas para ser reproduzível. Após a publicação, os 18 arquivos novos ou atualizados foram confirmados no repositório. A leitura autenticada do GitHub confirmou o catálogo de sete peças e o HTML publicado idêntico ao arquivo testado. O hash do schema de compras existente permaneceu igual.

A tentativa de consulta direta pelo navegador deste ambiente falhou com `Failed to fetch`. Portanto, a leitura online pelo app não está confirmada de ponta a ponta. A importação local do catálogo JSON foi testada e permanece disponível. Não foi configurado um banco de produção.

## Figma

O pacote contém 11 composições descritas por elementos semânticos e vetores. O importador cria texto editável, frames, componentes e variáveis; não inclui telas rasterizadas. O JavaScript foi verificado sintaticamente. A simulação da API montou 11 composições, 46 componentes e 128 variáveis, totalizando 2104 nós registrados. Nenhum preenchimento de imagem foi criado. A repetição reconheceu a página já completa e não a duplicou. Esses resultados não equivalem à execução no serviço.

**Pendente:** executar o importador no Figma e inspecionar o resultado no serviço. A cota MCP Starter bloqueou o acesso, inclusive a leitura do arquivo. Não há confirmação de publicação das telas online.

## Limites operacionais

O HTML não implementa backend, autenticação, isolamento de banco, controle de concorrência, API SysPro ou recomendação de compras. A seleção de empresa demonstra a separação de vínculos, sem constituir controle de acesso. Backups do navegador dependem do utilizador e não oferecem a garantia de um serviço de banco.

## Reproduzir os testes

Instale Playwright em um ambiente de desenvolvimento e seu Chromium. Execute a partir do repositório:

```bash
node tests/prototype.cjs
```

O teste usa um perfil temporário e gera evidências em uma pasta temporária do sistema. `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` e `QA_OUTPUT_DIR` permitem selecionar o módulo instalado, um Chromium compatível e o destino das evidências. A execução precisa de permissões para iniciar o navegador local.

Para reconstruir o importador depois de editar a prévia:

```bash
node scripts/export_figma.cjs
python scripts/package_importer.py
node --check figma-importer/code.js
```

O exportador mede os elementos da prévia renderizada e mantém sua hierarquia. A inspeção final no Figma continua necessária após qualquer reconstrução.

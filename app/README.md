# App DINEPEL

Esta pasta contém a prévia navegável, dados fictícios para demonstração, testes e importador de telas para Figma. A arquitetura e os contratos técnicos ficam em [`../docs/app/`](../docs/app/README.md).

## Pastas

| Caminho | Uso |
|---|---|
| `prototype/` | App demonstrativo em um único HTML |
| `examples/` | Catálogo e base de demonstração, sem dados reais |
| `tests/` | Verificações funcionais no Chromium |
| `scripts/` | Geração e empacotamento das composições do Figma |
| `figma-importer/` | Plugin de desenvolvimento e instruções de importação |
| `test-results/` | Arquivos temporários gerados pelos scripts; não versionar |

## Abrir a prévia

Abra `prototype/index.html` em um navegador. Na tela **Importações**, use `examples/catalogo-demo.json` para testar sem rede ou **Consultar GitHub** para ler esse mesmo catálogo na revisão atual do repositório.

Os dados de exemplo são fictícios. O navegador guarda as alterações localmente; exporte um backup JSON se quiser preservá-las. Esse armazenamento não é compartilhado com outros usuários e não é um banco de produção.

## Testes e importador Figma

Com Node.js, Playwright e Chromium instalados:

```bash
cd app
node tests/prototype.cjs
```

Para reconstruir o plugin depois de alterar a prévia:

```bash
cd app
node scripts/export_figma.cjs
python scripts/package_importer.py
node --check figma-importer/code.js
```

O importador cria camadas editáveis em um plugin local de desenvolvimento. Ele não publica telas no Figma, não conecta ao banco e não acessa bases privadas.

## Caminho para produção

A prévia não implementa autenticação, API, controle multiusuário nem sincronização de estoque. O desenho proposto para esses componentes, incluindo a separação entre peça mestre e dados de cada empresa, está em [`../docs/app/ARQUITETURA.md`](../docs/app/ARQUITETURA.md). Não coloque dados operacionais nesta pasta ou no repositório público.

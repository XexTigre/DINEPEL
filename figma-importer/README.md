# Importador de camadas editáveis para Figma

O acesso automático ao arquivo de destino foi bloqueado pelo limite MCP Starter. Não houve criação ou confirmação das telas no arquivo online nesta entrega.

O pacote inclui um importador nativo de desenvolvimento para criar as composições a partir da prévia local. Ele gera texto editável, vetores, frames, componentes reutilizados e variáveis de cores. Nenhuma tela é inserida como imagem achatada.

## Executar no Figma

1. No Figma desktop, abra um arquivo Design. Em **Plugins → Development → New plugin**, crie um plugin local do tipo **Run once**.
2. Abra a pasta que o Figma criou. Copie o `code.js` deste pacote para essa pasta.
3. No `manifest.json` gerado pelo Figma, preserve o **id real atribuído pelo Figma** e use os demais campos de `manifest.template.json`. O texto `USE_O_ID_GERADO_PELO_FIGMA` é um marcador, não um ID válido.
4. Execute o plugin de desenvolvimento. Ele cria a página **DINEPEL · Base de peças v0.1** e apresenta o resultado e os IDs criados.

A página contém nove composições desktop, um catálogo mobile e um estado de cadastro com duplicidade. Os componentes principais ficam à esquerda das telas. Textos e vetores permanecem editáveis. Há auto layout nos grupos correspondentes a linhas, colunas e grids da prévia; alguns contêineres conservam posição fixa para reproduzir a composição.

O importador não exige rede, não lê bases privadas e não altera o ERP. Se a página de entrega já estiver completa, uma nova execução não a duplica. Se encontrar uma importação incompleta, para e explica o conflito; não apaga trabalho existente.

## Verificação necessária após executar

O código teve validação sintática e estrutural em simulação. **Não foi executado no serviço Figma** nesta entrega, devido ao limite informado. Verifique a primeira tela em tamanho normal, os campos com texto longo, os componentes e a versão mobile. Se Open Sans não estiver disponível, ele escolhe uma fonte disponível e registra a substituição. Diferenças métricas podem exigir ajuste de largura ou quebra de linha.

Os protótipos de navegação e as operações interativas estão em `prototype/index.html`. As composições importadas são especificações visuais editáveis; não executam a lógica do HTML nem conectam um banco.

`runtime.js` contém a lógica legível; `code.js` agrega os dados das composições e a lógica em um arquivo pronto para o plugin local. O manifesto é um modelo porque IDs de plugins são atribuídos pelo Figma, não inventados pelo projeto.

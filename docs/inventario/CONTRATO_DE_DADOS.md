# Contrato de dados de entrada

> Estado: contrato lógico preliminar. Ele não presume nomes de tabelas, colunas, bancos ou formatos de arquivo. O mapeamento físico será preenchido após receber e inspecionar as bases.

## Chaves e granularidade

A granularidade mínima para cálculo é um SKU em uma loja e um período. O SKU precisa ser identificado por uma chave estável. Não usar código comercial isolado como chave universal: o mesmo código pode existir em marcas ou namespaces diferentes.

Ordem de preferência para a chave:

1. identificador interno imutável do produto, se existir e for consistente entre as bases;
2. chave composta confirmada pelo responsável, como sistema de origem + marca + código do fabricante;
3. tabela de correspondência aprovada entre os identificadores de cada fonte.

As três lojas do contrato de saída precisam ser associadas a identificadores reais nas bases. A associação será registrada, não inferida pelo nome do arquivo.

## Dados mínimos por assunto

| Assunto | Campos lógicos necessários | Validação |
|---|---|---|
| Produto | chave estável, marca, código/SKU de origem, unidade de medida | Chave sem colisão depois do mapeamento; códigos originais preservados |
| Atributos opcionais | atributos técnicos confirmados e fase de ciclo de vida/fim de vida, com origem e vigência | Usar somente em métodos de cold start ou declínio se estiverem presentes e validados; não inferir classificação |
| Loja | identificador de origem, nome/alias, vínculo à posição loja_1, loja_2 ou loja_3 | Cada identificador mapeado uma única vez |
| Venda do último mês | quantidade por SKU e loja, mês de referência | O mês precisa estar fechado e igual para as três lojas |
| Venda anual | quantidade por SKU e loja, período inicial/final | Confirmar se é janela móvel de 12 meses ou ano-calendário |
| Série para desvio padrão | quantidade mensal por SKU e loja, data/mês | Janela contínua e unidade comparável; agregado anual isolado não basta |
| Série para backtest | demanda observada por mês, SKU e loja, incluindo meses sem venda quando a fonte confirmar completude; previsões anteriores, quando disponíveis | Manter ordem temporal; identificar corte, horizonte e versão da previsão; não tratar ausência de linha como zero sem confirmar cobertura da fonte |
| Estoque físico | saldo por SKU e loja, unidade, data/hora do snapshot | Saldo negativo é preservado e sinalizado; não normalizar para zero |
| Curva | classe A, B ou outra, origem e data de vigência | A/B usam as fórmulas recebidas; demais classes ficam pendentes |
| Métrica MAPE | SKU, loja ou escopo da métrica, período, valor, versão do cálculo | Marcar MAPE estritamente superior a 20%; com venda real zero, registrar métrica como não definida e não fabricar percentual |
| Métricas complementares | MAE, MASE quando válido, viés assinado, fill rate, dias em ruptura e estoque médio, com SKU/loja/período/método | Comparar mesmo horizonte e mesmos cortes temporais; registrar denominadores ausentes ou inválidos |
| Log de backtest | corte de treino, meses de teste, horizonte, método, regra/versão e métricas | Previsões devem usar somente informação disponível no corte; manter resultados reproduzíveis |
| Anomalia semântica | SKU, loja, período, texto original, origem do registro | Preservar texto e contexto; não transformar texto em fator sem regra aprovada |
| Fator de cobertura | SKU/loja ou escopo, valor, regra e versão, justificativa, período | Não aceitar fator sem origem e regra reproduzíveis |

## Dados necessários para fechar a fórmula de compra

Os campos abaixo não estão no cálculo de DMM recebido, mas podem ser indispensáveis para calcular uma quantidade de compra real. A necessidade exata depende da fórmula a aprovar:

- pedidos de compra confirmados e ainda não recebidos;
- reservas, separações e compromissos de venda;
- transferências entre lojas em trânsito;
- prazo de reposição por fornecedor e produto, incluindo datas reais de pedido e recebimento para medir sua variabilidade;
- intervalo de revisão da compra e nível de serviço/cobertura aprovado, se adotados pela política;
- cobertura desejada ou nível de serviço;
- lote mínimo e múltiplo de embalagem;
- regras de compra por fornecedor e restrições de orçamento, se aplicáveis.

Sem a fórmula aprovada e seus campos de entrada, calcular DMM ou estoque de segurança não autoriza calcular sugestao_compra_total. Métodos de cold start, ciclo de vida ou calibração entre itens são opcionais: só podem ser avaliados quando os atributos forem confirmados e os grupos de SKUs forem justificáveis.

## Mapeamento físico depois do recebimento

Para cada arquivo, banco ou tabela, registrar:

- nome da fonte e sistema de origem;
- identificador da loja e sua posição no contrato;
- tabela/aba/coluna original;
- campo lógico correspondente neste documento;
- período coberto, unidade e fuso/data de extração;
- regra de transformação, se houver, com justificativa aprovada;
- contagem de linhas e resultado da reconciliação;
- versão ou hash do arquivo processado.

Valores originais devem permanecer recuperáveis. Qualquer normalização fica em campo derivado, com regra registrada; nunca substituir silenciosamente o dado recebido.

## Validações de entrada

- Detectar SKU duplicado dentro do mesmo namespace e loja.
- Separar códigos coincidentes de marcas ou sistemas distintos antes de juntar tabelas.
- Confirmar que as três lojas estão identificadas e usam a mesma janela temporal.
- Confirmar unidades de medida antes de somar quantidades.
- Não somar venda anual com linhas duplicadas; reconciliar totais com a fonte.
- Preservar saldos negativos e registrar o alerta operacional correspondente.
- Não descartar automaticamente devoluções, cancelamentos, vendas negativas ou meses sem venda. Primeiro classificar como o sistema de origem os representa e aprovar a regra de tratamento.
- Se o desvio padrão ou backtest for exigido, verificar se existe histórico mensal suficiente por SKU/loja e se os meses sem venda são observações completas ou lacunas de extração.
- Calcular MAPE somente quando o valor real permitir divisão; complementar os relatórios com MAE, MASE quando válido, viés e resultados de serviço.
- Sinalizar picos estatísticos para revisão; preservar os valores originais e não excluir vendas sem motivo e regra aprovados.
- Se faltar campo obrigatório, houver conflito de identidade ou diferença de período, bloquear o SKU e produzir relatório de qualidade em canal separado.

## Proteção das bases

O repositório DINEPEL está público. Não enviar para ele exportações reais, credenciais, tokens, dados de clientes, documentos fiscais ou dados pessoais. Se testes com amostras forem necessários, usar dados anonimizados e reduzidos, sem identificadores recuperáveis. Os bancos recebidos serão analisados para estruturar o mapeamento; o conteúdo bruto não precisa ser versionado.

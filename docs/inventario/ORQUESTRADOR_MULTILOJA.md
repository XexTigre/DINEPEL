# Orquestrador de inventário multiloja

> Estado: especificação inicial. Esta documentação descreve o comportamento pretendido; ainda não importa bases, calcula compras nem escreve no SysPro.

## Objetivo

Ler vendas e saldos de três lojas, considerar o histórico de acurácia e anomalias, calcular demanda mensal estimada por SKU e preparar uma sugestão de compra com distribuição proporcional entre lojas. Cada número deve ser reproduzível a partir das bases de entrada e de uma versão identificada das regras.

A versão inicial trabalha com três lojas porque o contrato de saída recebido contém loja_1, loja_2 e loja_3. Esses nomes só serão associados às filiais reais depois que as bases forem recebidas e mapeadas.

## Regras de funcionamento

- Cálculos numéricos, agregações, desvio padrão, percentuais, arredondamentos e validações matemáticas serão executados por código Python/Pandas.
- O modelo não completa dado ausente por estimativa, não inventa fator de cobertura e não altera saldo físico de origem.
- Cada execução registra identificação e período das fontes, versão das regras e resultado da validação.
- Uma sugestão só pode ser emitida quando todas as entradas e regras necessárias para aquele SKU estiverem disponíveis.
- O resultado de compra é uma recomendação para revisão. A especificação não autoriza emissão de pedido nem gravação no ERP.
- Bases reais, credenciais e dados pessoais não devem ser enviados para este repositório público. Aqui entram documentação e, se necessário, exemplos sanitizados.

## Fluxo de decisão

~~~mermaid
flowchart TD
    A["Receber bases e registrar origem, período e versão"] --> B["Validar chaves, lojas, períodos e unidades"]
    B --> C{"Dados de venda e histórico obrigatórios disponíveis?"}
    C -- "não" --> X["Bloquear SKU e registrar causa fora do JSON de produção"]
    C -- "sim" --> D["Ler MAPE, anomalias e fatores com origem rastreável"]
    D --> E["Detectar picos pela regra estatística aprovada"]
    E --> F["Calcular DMM e estoque de segurança em Python/Pandas"]
    F --> G{"Fórmula de compra e saldo de suprimento definidos?"}
    G -- "não" --> X
    G -- "sim" --> H["Calcular compra total por SKU"]
    H --> I["Ratear unidades inteiras pela participação de DMM"]
    I --> J{"Schema e invariantes aprovados?"}
    J -- "não" --> X
    J -- "sim" --> K["Emitir JSON e trilha de auditoria"]
~~~

## Cálculos definidos no pedido

Para cada loja i e SKU:

- DMM da loja = (venda do último mês completo × 0,7) + ((venda anual ÷ 12) × 0,3)
- DMM da rede = soma das DMM das três lojas
- Estoque de segurança para Curva A = DMM × 0,5
- Estoque de segurança para Curva B = DMM × 0,3
- Participação da loja = DMM da loja ÷ DMM da rede

Essas expressões são requisitos de negócio. O código usará precisão decimal definida e manterá valores intermediários sem arredondamento prematuro. O formato final de compra e rateio é inteiro. O método de arredondamento da necessidade ainda precisa ser aprovado. No rateio de uma compra total já definida, o método deve preservar a soma exata das unidades e minimizar a diferença para as participações calculadas; a escolha final será registrada e testada.

O cálculo da participação fica indefinido quando a DMM da rede for zero. Nesse caso, o rateio deve ser bloqueado e revisado; não se deve dividir por zero nem inventar percentuais.

## O que ainda impede calcular a quantidade de compra

As regras recebidas definem DMM, estoque de segurança e proporção de distribuição, mas não definem a fórmula de sugestão_compra_total. DMM não é, sozinha, uma quantidade de compra.

Para fechar esse cálculo será necessário decidir a cobertura desejada e mapear os dados que entram na posição de estoque: saldo físico, reservas, pedidos confirmados em aberto, transferências e prazo do fornecedor, conforme a regra que você aprovar. Estoque físico negativo deve gerar o alerta Ajuste Físico Urgente de Inventário e ser coberto antes das demais necessidades, sem apagar nem corrigir automaticamente o saldo de origem.

Há duas lacunas no formato JSON recebido: ele não tem campo próprio para alertas nem para estado bloqueado. Até definir um canal de auditoria/alertas, uma execução bloqueada não deve ser representada como uma recomendação de compra igual a zero. O JSON de produção só será emitido para SKUs que passem os gates; o alerta ficará no registro operacional separado.

## Logs, acurácia e anomalias

Antes de cada recomendação, o processamento deve:

1. localizar o registro de MAPE mais recente aplicável ao SKU e à loja;
2. marcar como revisão os casos com MAPE superior a 20%;
3. ler os registros de anomalia semântica e manter o texto, o período, a loja e a origem;
4. carregar somente fatores de cobertura associados a uma regra versionada e a uma evidência de histórico.

O pedido ainda não informa como transformar MAPE ou uma descrição de anomalia em alteração numérica do fator de cobertura. Essa relação precisa ser aprovada e versionada. Sem log, período ou regra de ajuste válidos, o sistema não afirma que aprendeu e bloqueia a recomendação correspondente.

## Picos de venda e desvio padrão

O desvio padrão será calculado em código sobre uma série histórica mensal por SKU e loja. O período de observação, a quantidade mínima de meses, o limite em sigmas, o uso de desvio padrão amostral ou populacional e o tratamento de pico isolado ainda precisam ser definidos.

Um pico classificado como isolado pode deixar de influenciar a estimativa de recorrência somente pela regra aprovada. A venda original permanece preservada e auditável; nunca é apagada da fonte.

## Contrato de saída por SKU

O objeto de produção está definido em [saida_reabastecimento.schema.json](saida_reabastecimento.schema.json). Ele contém exatamente as chaves fornecidas no pedido. A validação deve verificar também fora do JSON Schema que a soma das três lojas seja igual a sugestao_compra_total.

Um objeto é produzido por SKU. A embalagem de lotes com vários SKUs será escolhida depois de conhecermos o modo de consumo e as bases.

## Grafo conceitual dos dados

~~~mermaid
flowchart TD
    A["Lote de origem: arquivo, período, hash e loja"] --> B["Identidade do SKU e classificação A/B"]
    A --> C["Vendas por mês e venda anual"]
    A --> D["Saldo físico datado por loja"]
    B --> C
    B --> D
    B --> E["Logs: MAPE e anomalias por SKU, loja e período"]
    E --> F["Fator de cobertura com regra e versão"]
    C --> G["Recomendação auditável por SKU"]
    D --> G
    F --> G
    G --> H["JSON validado e rateio entre as três lojas"]
~~~

O diagrama é conceitual: nomes de tabelas, chaves internas e relacionamentos físicos só serão definidos depois da inspeção dos bancos recebidos.

## Portões de validação

- SKU e loja precisam ter uma correspondência inequívoca entre as fontes.
- Período da venda mensal e da venda anual precisa estar explícito.
- Duplicidades, unidades diferentes, registros incompletos e divergências entre fontes ficam em relatório de validação; não são resolvidos por suposição.
- Saldo negativo é aceito como dado de origem e aciona alerta; não é convertido para zero.
- Sem histórico ou regra de fator exigida, sem fórmula de compra aprovada, ou com denominador de rateio igual a zero, não há recomendação de produção.
- O JSON precisa validar contra o schema. A soma das quantidades por loja precisa fechar com a compra total.
- Cada execução precisa ser reproduzível a partir da mesma versão das fontes, regras e código.

## Decisões pendentes para fechar a especificação

| Tema | Já definido | Falta definir |
|---|---|---|
| Lojas | Três posições no JSON | Identificador e nome de cada filial nas bases |
| DMM | Pesos 0,7 e 0,3 | Definição do mês completo e janela exata da venda anual |
| Curva | A = 0,5 × DMM; B = 0,3 × DMM | Tratamento para Curva C e outras classes |
| Compra total | Deve ser inteiro | Fórmula, cobertura, posição de estoque e suprimentos em aberto |
| Distribuição | Participação proporcional à DMM | Regra quando rede tem DMM zero e regra de arredondamento final |
| Histórico | Revisar MAPE > 20% e ler anomalias | Janela de “recente” e regra numérica de ajuste dos fatores |
| Outliers | Usar desvio padrão e isolar picos isolados da recorrência | Janela, mínimo de observações, limite sigma e tratamento |
| Saldo negativo | Cobrir o negativo primeiro e emitir alerta urgente | Fonte/canal do alerta e composição da quantidade a comprar |
| Saída | JSON estrito por SKU | Estado de bloqueio, lote de SKUs e canal separado de alertas |

## Próximo passo após receber as bases

1. Fazer inventário dos arquivos, tabelas, colunas, períodos e lojas.
2. Mapear campos reais ao [contrato de dados](CONTRATO_DE_DADOS.md), sem renomear nem alterar valores de origem.
3. Apontar lacunas e conflitos entre vendas, estoque e logs.
4. Fechar as decisões pendentes com dados reais.
5. Criar casos sanitizados e reproduzíveis; só então implementar os cálculos e validar o resultado contra este contrato.

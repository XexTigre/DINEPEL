# Revisão metodológica — outubro de 2026

> Revisão feita em 18/10/2026 a partir de literatura técnica pública. Este documento propõe métodos para comparação com os dados da DINEPEL; não altera as regras de negócio já recebidas nem autoriza pedidos automáticos.

## Decisões para a primeira versão

1. **Manter a regra recebida como linha de base determinística.** DMM ponderada (0,7 × último mês completo + 0,3 × venda anual ÷ 12), ES de 0,5 × DMM para Curva A e 0,3 × DMM para Curva B, e rateio proporcional continuam sendo as regras de referência. Qualquer método novo roda inicialmente em modo sombra e só substitui a linha de base após aprovação.
2. **Separar valor/criticidade do comportamento da demanda.** A curva A/B não descreve, sozinha, se um SKU vende regularmente ou em ocorrências esparsas. A análise deve observar frequência de meses com demanda e tamanho dos pedidos positivos. Para séries intermitentes, Croston, SBA e TSB são candidatos a comparação; nenhum deve ser escolhido sem backtest por SKU/loja. Estudos com peças automotivas e de reposição avaliaram especificamente essa família de métodos. [Syntetos & Boylan (2005)](https://doi.org/10.1016/j.ijforecast.2004.10.001)
3. **Usar validação temporal fora da amostra.** Comparar a fórmula atual e os candidatos em origens de previsão sucessivas, sem embaralhar meses nem usar informação futura. O horizonte deve corresponder ao período real de proteção de estoque. Escolher por erro e impacto operacional, não pelo ajuste dentro do histórico.
4. **Não usar MAPE como único placar nem como conversor automático de fator.** O gatilho recebido de MAPE > 20% permanece como alerta de revisão, quando o MAPE for definido. Para completar a leitura, registrar erro absoluto em unidades (MAE), erro escalado (MASE quando o denominador histórico for válido), viés assinado e resultados de estoque: fill rate, dias em ruptura e estoque médio. Com venda real zero, MAPE não é definido; com série constante, o denominador de MASE pode ser zero. Nesses casos registrar o motivo e usar as demais métricas, sem inventar um percentual. [Hyndman & Koehler (2006)](https://doi.org/10.1016/j.ijforecast.2006.03.001)
5. **Tratar o estoque de segurança como problema de horizonte e nível de serviço.** Para uma futura alternativa, testar erros acumulados ao longo do prazo de reposição (e do ciclo de revisão, se houver), usando distribuição de erros compatível com cada SKU e nível de serviço aprovado. Não presumir que desvios sejam normais, independentes ou iguais para todos os itens. A fórmula ES fixa recebida permanece a linha de base até decisão explícita.
6. **Sinalizar picos; não apagar vendas automaticamente.** Desvio padrão pode sinalizar observações para revisão, mas causa, período, estoque disponível, devolução, promoção e ocorrência operacional precisam ser examinados. Manter a série original e comparar o resultado com e sem ajuste aprovado. Um pico real pode ser relevante para serviço mesmo que não represente recorrência.
7. **Separar previsão de compra.** Uma previsão melhor não fecha, por si, a quantidade a comprar. A política de compra ainda precisa combinar posição de estoque, recebimentos confirmados, reservas/transferências, prazo de reposição, lote mínimo e cobertura ou nível de serviço aprovado.

## Ciclo de comparação e aprovação

~~~mermaid
flowchart TD
    A["Série mensal validada por SKU e loja"] --> B["Classificar perfil de demanda e qualidade"]
    B --> C["Comparar DMM atual e métodos candidatos em origens temporais"]
    C --> D["Medir erro, viés e resultados de estoque"]
    D --> E{"Ganho reproduzível e regra aprovada?"}
    E -- "não" --> F["Manter regra atual e registrar evidência"]
    E -- "sim" --> G["Versionar método; executar em modo sombra"]
    G --> H["Revisar com operação antes de ativar"]
~~~

A janela mínima, frequência de avaliação, limites de classificação e critérios de aprovação serão definidos depois de inspecionar a quantidade e a qualidade do histórico. Não há limites numéricos universais codificados nesta revisão.

## Métodos recentes a acompanhar

- **Peças com histórico intermitente:** Croston separa tamanho de demanda e intervalo entre demandas; variantes como SBA e TSB são comparadores úteis. A evidência automotiva publicada por Syntetos e Boylan compara métodos em milhares de séries intermitentes, mas não garante que uma variante vença em cada SKU da DINEPEL.
- **Itens novos sem histórico (cold start):** artigo publicado em junho de 2026 avalia um modelo em duas etapas que estima ocorrência e tamanho da demanda e usa simulação Monte Carlo para representar uma distribuição, com atributos da peça. É uma linha de pesquisa para piloto somente se as bases trouxerem atributos consistentes e houver validação temporal separada para itens novos. [Nathan et al. (2026), PLOS ONE](https://doi.org/10.1371/journal.pone.0350729)
- **Estoque de segurança com erros complexos:** preprint de 14/10/2026 propõe dimensionar proteção com erros acumulados no período operacional e tratar autocorrelação, variância dependente do volume e caudas pesadas. Na simulação de uma única empresa de bens de consumo rápido, os autores relatam menos estoque sem deterioração estatisticamente significativa de certas métricas de serviço. É evidência preliminar e de outro setor; deve ser reproduzida em backtest DINEPEL antes de qualquer uso. [Fernández-Palacios et al. (2026), arXiv:2610.19829](https://arxiv.org/abs/2610.19829)

## Plano prático para a DINEPEL

- **Agora:** preservar as fórmulas recebidas; registrar as lacunas da fórmula de compra, a regra de MAPE e a origem dos fatores; confirmar granularidade, identidade das lojas e períodos.
- **Com as bases:** construir série mensal por SKU/loja incluindo meses sem venda; reconciliar devoluções, cancelamentos, rupturas e unidades; estimar perfis de demanda sem transformar ausência de linha em zero antes de validar a fonte.
- **Backtest:** gerar previsões apenas com dados disponíveis em cada corte histórico; avaliar horizonte de reposição; comparar regra atual, baselines simples e métodos intermitentes quando aplicáveis.
- **Decisão:** selecionar método por comportamento de SKU e custo/serviço, registrar métricas e versão; manter o resultado em modo sombra para revisão operacional.
- **Produção:** só emitir compra quando fórmula de compra e posição de suprimento forem aprovadas. Guardar trilha de dados, regra, método, métricas e alertas fora do JSON enxuto de recomendação.

## Referências

1. Hyndman, R. J.; Koehler, A. B. (2006). [Another look at measures of forecast accuracy](https://doi.org/10.1016/j.ijforecast.2006.03.001). *International Journal of Forecasting*, 22(4), 679–688.
2. Syntetos, A. A.; Boylan, J. (2005). [The accuracy of intermittent demand estimates](https://doi.org/10.1016/j.ijforecast.2004.10.001). *International Journal of Forecasting*, 21(2), 303–314.
3. Nathan, S. et al. (2026). [A two stage statistical framework for cold start spare part demand forecasting](https://doi.org/10.1371/journal.pone.0350729). *PLOS ONE*, publicado em 16/06/2026.
4. Fernández-Palacios, L.; Ceballos, M.; Muñoz-Ocaña, Y. (2026). [Safety stock calculation with heteroscedastic, autocorrelated and heavy-tailed forecast errors, an adaptive parametric method](https://arxiv.org/abs/2610.19829). Preprint no arXiv, publicado em 14/10/2026.

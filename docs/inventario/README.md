# Inventário multiloja — documentação

Este diretório contém a especificação do fluxo de compras e distribuição para três lojas. O repositório ainda é documental: não há importador, cálculo de produção ou integração com o SysPro.

## Mapa dos documentos

| Documento | Conteúdo |
|---|---|
| [Orquestrador multiloja](ORQUESTRADOR_MULTILOJA.md) | Fluxo, fórmulas recebidas, gates, alertas e decisões pendentes |
| [Contrato de dados](CONTRATO_DE_DADOS.md) | Granularidade, campos esperados, validações e proteção das bases |
| [Schema de saída](saida_reabastecimento.schema.json) | Estrutura JSON permitida para recomendação por SKU |
| [Revisão metodológica — outubro de 2026](REVISAO_METODOLOGICA_2026-10.md) | Métodos candidatos, métricas de avaliação e referências |

## Fluxo de execução

~~~mermaid
flowchart TD
    A["Bases de origem, fora do repositório"] --> B["Mapear dados pelo contrato"]
    B --> C{"Lojas, períodos, logs e chaves válidos?"}
    C -- "não" --> X["Bloquear e emitir relatório de validação separado"]
    C -- "sim" --> D["Calcular a linha de base em Python/Pandas"]
    D --> E{"Fórmula de compra aprovada?"}
    E -- "não" --> X
    E -- "sim" --> F["Ratear e validar invariantes"]
    F --> G["Emitir JSON conforme schema"]
~~~

Um bloqueio não é uma recomendação de compra igual a zero. O schema de produção só se aplica quando todas as validações e regras necessárias passam.

## Ordem de trabalho

1. Confirmar identidade das lojas, períodos, unidades e chaves de SKU.
2. Verificar completude das vendas mensais, dos saldos e dos logs de acurácia/anomalias.
3. Registrar os campos reais no contrato, sem presumir nomes nem corrigir valores de origem.
4. Fechar a fórmula de compra, os recebimentos em aberto, reservas, prazo e cobertura.
5. Implementar e testar cálculos reproduzíveis com exemplos sintéticos ou sanitizados.
6. Comparar métodos candidatos em modo sombra antes de aprovar mudança de regra.

## Proteção de dados

Este repositório é público. Bases reais, PDFs operacionais, credenciais, dados pessoais e relatórios derivados de fontes privadas ficam fora dele. Só adicionar fixtures sintéticas ou efetivamente sanitizadas.

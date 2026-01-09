# Personas

Este documento descreve as personas criadas para o projeto "Simulador Epidémico Interativo de Observação Sistémica", focadas em dois perfis distintos de utilização: a análise técnica profunda e a tomada de decisão rápida.

## Persona 1: O Investigador Académico

**Perfil:** Utilizador experiente e técnico.

### Identidade

*   **Nome:** Prof. Carlos Mendes
*   **Idade:** 45 anos
*   **Cargo:** Professor Universitário e Investigador em Epidemiologia Computacional
*   **Formação:** Doutoramento em Matemática Aplicada à Biologia
*   **Literacia Digital:** Muito Alta (Domina R, Python, MATLAB).

### Biografia

O Carlos dedica a sua carreira a modelar a propagação de doenças infecciosas. Ele usa o simulador não apenas para ver gráficos bonitos, mas para validar os seus próprios modelos teóricos contra cenários estocásticos. Ele passa horas a ajustar parâmetros finos ($\beta$ e $\gamma$) e precisa de garantir que os resultados são estatisticamente robustos para serem usados em publicações científicas.

### Objetivos (Goals)

*   **Exploração de Cenários:** Criar múltiplas variantes da mesma simulação alterando apenas uma variável (ex: taxa de contacto) para isolar efeitos.
*   **Exportação de Dados:** Não se contenta com os gráficos da plataforma; precisa de exportar os dados brutos (CSV/JSON) para realizar análises estatísticas avançadas em ferramentas externas (SPSS, R).
*   **Reprodutibilidade:** Precisa de ter acesso exato aos parâmetros usados numa simulação de há 6 meses para poder replicar os resultados num artigo.

### Dores e Frustrações (Pain Points)

*   **Caixas Negras:** Desconfia de sistemas que dão resultados sem explicar os parâmetros exatos ou a metodologia.
*   **Limitações de Exportação:** Fica frustrado se não conseguir retirar os dados da plataforma ("Data Lock-in").
*   **Sistemas Lentos:** Precisa de correr simulações longas (T > 365 dias) e não pode esperar minutos por cada resultado.

### Citação

> "O gráfico é útil para uma primeira vista de olhos, mas o que eu preciso mesmo são dos dados brutos para correr as minhas próprias análises de variância."

---

## Persona 2: O Gestor de Saúde Pública

**Perfil:** Orientado para a visualização e comunicação.

### Identidade

*   **Nome:** Dr.ª Ana Ribeiro
*   **Idade:** 38 anos
*   **Cargo:** Coordenadora Regional de Saúde Pública
*   **Formação:** Mestrado em Saúde Pública e Gestão Sanitária
*   **Literacia Digital:** Média (Utilizadora funcional, focada na utilidade da ferramenta).

### Biografia

A Ana tem a responsabilidade de aconselhar medidas de intervenção (como fecho de escolas ou uso de máscaras) com base em previsões. Ela tem pouco tempo para configurar parâmetros complexos; precisa de entrar na plataforma, inserir os dados atuais da região e obter uma visualização clara do "pior cenário" e do "melhor cenário" para apresentar em reuniões com a administração do hospital ou com a imprensa.

### Objetivos (Goals)

*   **Visualização Rápida:** Precisa de dashboards intuitivos que mostrem imediatamente se a curva está a "achar" ou a crescer.
*   **Interpretação do $R_t$:** O foco principal é o Número de Reprodução Efetivo ($R_t$). Precisa de saber se está acima ou abaixo de 1 com um simples olhar (ex: código de cores).
*   **Comunicação:** Precisa de gráficos limpos e claros que possa capturar ou apresentar diretamente para justificar decisões políticas ou sanitárias.
*   **Simplicidade:** Prefere interfaces onde os parâmetros técnicos estão explicados em linguagem natural.

### Dores e Frustrações (Pain Points)

*   **Complexidade Excessiva:** Sente-se perdida com interfaces cheias de jargão matemático sem explicações práticas.
*   **Gráficos Confusos:** Frustra-se com visualizações sobrecarregadas onde não consegue distinguir a linha de "Infetados" da linha de "Recuperados".
*   **Falta de Contexto:** Precisa de saber não só o número, mas o que ele significa (ex: "Estamos numa zona de perigo?").

### Citação

> "Tenho uma reunião com a direção em 10 minutos. Preciso de um gráfico que mostre claramente o impacto de reduzirmos a taxa de contacto em 20%, sem ter de explicar equações diferenciais."
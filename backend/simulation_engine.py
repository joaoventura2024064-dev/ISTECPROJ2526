import numpy as np

def run_simulation(N, I0, beta, gamma, duration, seed=None):
    """
    Executa uma simulação SIR Estocástica (Suscetíveis-Infetados-Recuperados) usando NumPy.
    
    Usamos um modelo estocástico (probabilístico) em vez de um determinístico (EDO)
    porque captura melhor a aleatoriedade da transmissão no mundo real, especialmente
    com populações mais pequenas ou no início/fim de um surto.

    Args:
        N (int): População Total.
        I0 (int): Contagem Inicial de Infetados.
        beta (float): Taxa de transmissão (quão contagioso é o vírus).
        gamma (float): Taxa de recuperação (1 / duração média da infeção).
        duration (int): Número de dias a simular.
        seed (int, optional): Seed aleatória para reprodutibilidade.
        
    Returns:
        list: Uma lista de dicionários contendo os resultados para cada dia.
        int: A seed usada para esta simulação.
    """
    
    # 0. Configurar Seed Aleatória
    # Usamos uma seed para garantir que se corrermos a simulação duas vezes com os mesmos inputs,
    # obtemos exatamente os mesmos resultados.
    if seed is None:
        # Gerar uma seed aleatória segura se nenhuma for fornecida.
        # Usamos um intervalo grande para minimizar colisões.
        seed = int(np.random.default_rng().integers(0, 2**31 - 1))
    
    # Inicializar o Gerador de Números Aleatórios (RNG).
    # Usamos `default_rng` (a nova API de Gerador) em vez de `np.random.seed` porque
    # previne erros de overflow ao lidar com populações grandes (ex: 8 triliões).
    rng = np.random.default_rng(seed)

    # 1. Estado Inicial
    # S = Suscetíveis
    # I = Infetados
    # R = Recuperados
    S = N - I0
    I = I0
    R = 0
    results = []
    
    # Registar Dia 0 (Condições Iniciais)
    # Rt (Número Reprodutivo Efetivo) em t=0 é aproximadamente (beta/gamma) * (S/N).
    rt_inicial = (beta / gamma) * (S / N) if gamma > 0 else 0
    results.append({
        "step": 0, "S": int(S), "I": int(I), "R": int(R), "Rt": round(float(rt_inicial), 2)
    })
    
    # 2. Loop da Simulação
    # Iteramos por cada dia da simulação para calcular as mudanças.
    for day in range(1, duration + 1):
        # A. Calcular Probabilidades
        # A probabilidade de uma pessoa suscetível ficar infetada depende de:
        # - beta: Quão contagioso é o vírus.
        # - I/N: A proporção da população que está atualmente infetada.
        # Fórmula: P(infeção) = 1 - exp(-beta * (I/N))
        if N > 0:
            prob_infection = 1 - np.exp(-beta * (I / N))
        else:
            prob_infection = 0
            
        # A probabilidade de uma pessoa infetada recuperar depende apenas de gamma.
        # Fórmula: P(recuperação) = 1 - exp(-gamma)
        prob_recovery = 1 - np.exp(-gamma)
        
        # B. Determinar Transições (Estocástico - Distribuição Binomial)
        # Em vez de apenas multiplicar S * prob_infection (o que dá um decimal),
        # simulamos um "cointoss" para cada pessoa suscetível para ver se fica doente.
        # A distribuição Binomial faz isto eficientemente para milhões/biliões de pessoas de uma vez.
        
        # new_infected: Quantos S se tornam I?
        new_infected = rng.binomial(S, prob_infection)
        
        # new_recovered: Quantos I se tornam R?
        new_recovered = rng.binomial(I, prob_recovery)
        
        # C. Atualizar Estados
        # As pessoas movem-se de S -> I -> R
        S = S - new_infected
        I = I + new_infected - new_recovered
        R = R + new_recovered
        
        # Garantir que os valores não vão abaixo de zero (verificação de sanidade)
        S = max(0, S)
        I = max(0, I)
        R = max(0, R)
        
        # D. Calcular Rt para o dia
        # Rt representa o número médio de pessoas que uma pessoa infetada irá infetar neste momento.
        # À medida que S diminui (imunidade de grupo), o Rt diminui.
        if gamma > 0 and N > 0:
            rt = (beta / gamma) * (S / N)
        else:
            rt = 0
            
        # Guardar os resultados para este dia
        results.append({
            "step": day,
            "S": int(S), # Converter numpy.int64 para int nativo do Python para serialização JSON
            "I": int(I),
            "R": int(R),
            "Rt": round(float(rt), 2)
        })
        
    return results, seed

import numpy as np

def run_simulation(N, I0, beta, gamma, duration, seed=None):
    """
    Executa uma simulação SIR Estocástica usando NumPy.
    
    Args:
        N (int): População Total
        I0 (int): Infetados Iniciais
        beta (float): Taxa de contacto/transmissão
        gamma (float): Taxa de recuperação (1/duração_infeção)
        duration (int): Dias a simular
        
    Returns:
        list: Lista de dicionários com os resultados por dia.
    """
    
    # 0. Configurar Seed   
    if seed is None:
        # Gerar seed aleatória segura
        seed = int(np.random.default_rng().integers(0, 2**31 - 1))
    
    # Inicializar o Gerador (recomendado para novas versões do NumPy)
    rng = np.random.default_rng(seed)

    # 1. Estado Inicial
    S = N - I0
    I = I0
    R = 0
    results = []
    
    # Guardar dia 0
    rt_inicial = (beta / gamma) * (S / N) if gamma > 0 else 0
    results.append({
        "step": 0, "S": int(S), "I": int(I), "R": int(R), "Rt": round(float(rt_inicial), 2)
    })
    
    # 2. Loop da Simulação
    for day in range(1, duration + 1):
        # A. Calcular Probabilidades
        # P_inf = 1 - exp(-beta * (I/N))
        if N > 0:
            prob_infection = 1 - np.exp(-beta * (I / N))
        else:
            prob_infection = 0
            
        # P_rec = 1 - exp(-gamma)
        prob_recovery = 1 - np.exp(-gamma)
        
        # B. Determinar Transições (Stochastic - Binomial)
        # Usar o gerador 'rng' para suportar números grandes (int64)
        new_infected = rng.binomial(S, prob_infection)
        new_recovered = rng.binomial(I, prob_recovery)
        
        # C. Atualizar Estados
        S = S - new_infected
        I = I + new_infected - new_recovered
        R = R + new_recovered
        
        # Garantir não-negatividade
        S = max(0, S)
        I = max(0, I)
        R = max(0, R)
        
        # D. Calcular Rt do dia
        if gamma > 0 and N > 0:
            rt = (beta / gamma) * (S / N)
        else:
            rt = 0
            
        results.append({
            "step": day,
            "S": int(S), # Converter numpy.int para int nativo do Python
            "I": int(I),
            "R": int(R),
            "Rt": round(float(rt), 2)
        })
        
    return results, seed

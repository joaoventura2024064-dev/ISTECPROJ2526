import axios from "axios";

// =========================================================
// CONFIGURAÇÃO DO AXIOS
// =========================================================

// Criação da instância base do Axios
const api = axios.create({
    // URL base do backend (API)
    baseURL: "https://apiseios.onrender.com",
    //baseURL: "http://localhost:8080", // URL para desenvolvimento local
});

/**
 * Função utilitária para descodificar um token JWT (JSON Web Token).
 * Extrai o payload (dados) do token sem verificar a assinatura (apenas leitura).
 * 
 * @param {string} token - O token JWT completo.
 * @returns {object|null} - O objeto JSON descodificado ou null em caso de erro.
 */
const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// =========================================================
// INTERCEPTORES (MIDDLEWARE DE PEDIDOS)
// =========================================================

/**
 * Interceptor de Pedidos (Request Interceptor).
 * Executa antes de cada pedido HTTP sair do frontend.
 * 
 * Funcionalidades:
 * 1. Injeta o token de autenticação no header 'Authorization' se existir.
 * 2. Verifica se o token expirou localmente antes de enviar o pedido.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = parseJwt(token);

        // Verificar expiração do token (exp está em segundos, Date.now() em ms)
        if (decoded && decoded.exp * 1000 < Date.now()) {
            // Se expirou, limpar dados e redirecionar para login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            return Promise.reject(new Error("Token expired"));
        }

        // Adicionar o bearer token aos headers
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// =========================================================
// SERVIÇOS DE AUTENTICAÇÃO
// =========================================================

/**
 * Realiza o login do utilizador.
 * @param {string} email 
 * @param {string} password 
 */
export const loginService = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
};

/**
 * Regista um novo utilizador.
 */
export const registerService = async (name, email, password, birth_date, gender_id) => {
    const response = await api.post("/api/auth/register", { name, email, password, birth_date, gender_id });
    return response.data;
};

/**
 * Inicia o processo de recuperação de password (envio de email).
 */
export const recoverPasswordService = async (email) => {
    const response = await api.post("/api/auth/recover-password", { email });
    return response.data;
};

/**
 * Define uma nova password usando o token recebido por email.
 */
export const resetPasswordService = async (token, newPassword) => {
    const response = await api.post("/api/auth/reset-password", { token, newPassword });
    return response.data;
};

// =========================================================
// SERVIÇOS DE SIMULAÇÃO
// =========================================================

/**
 * Executa uma pré-visualização da simulação (sem guardar na BD).
 * @param {object} params - Parâmetros da simulação (população, beta, gamma, etc).
 */
export const runSimulationService = async (params) => {
    const response = await api.post("/api/simulations/preview", params);
    return response.data;
};

/**
 * Guarda uma simulação definitivamente na base de dados.
 */
export const saveSimulationService = async (params) => {
    const response = await api.post("/api/simulations/", params);
    return response.data;
};

/**
 * Obtém os detalhes de uma simulação específica por ID.
 */
export const getSimulationService = async (id) => {
    const response = await api.get(`/api/simulations/${id}`);
    return response.data;
};

/**
 * Obtém todas as simulações criadas por um utilizador específico.
 */
export const getUserSimulationsService = async (userId) => {
    const response = await api.get(`/api/users/${userId}/simulations`);
    return response.data;
};

/**
 * Apaga uma simulação.
 */
export const deleteSimulationService = async (simulationId) => {
    const response = await api.delete(`/api/simulations/${simulationId}`);
    return response.data;
};

/**
 * Faz download de ficheiros CSV com os dados das simulações selecionadas.
 */
export const downloadSimulationCSVService = async (ids) => {
    const response = await api.post("/api/simulations/export", { ids }, { responseType: 'blob' });
    return response.data;
};

// =========================================================
// SERVIÇOS DE GESTÃO DE UTILIZADORES
// =========================================================

/**
 * Obtém a lista de todos os utilizadores (apenas admin).
 */
export const getUsersService = async () => {
    const response = await api.get(`/api/users/`);
    return response.data;
};

/**
 * Obtém o perfil de um utilizador específico.
 */
export const getUserService = async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
};

/**
 * Atualiza os dados de perfil de um utilizador.
 */
export const updateUserService = async (userId, params) => {
    const response = await api.put(`/api/users/${userId}`, params);
    return response.data;
};

/**
 * Altera o estado de um utilizador (ex: ativo, suspenso). Apenas Admin.
 */
export const changeUserStatusService = async (userId, status) => {
    const response = await api.patch(`/api/users/${userId}/status`, { status });
    return response.data;
};

/**
 * Altera o permissão de um utilizador (ex: admin, registered). Apenas Admin.
 */
export const changeUserRoleService = async (userId, role) => {
    const response = await api.patch(`/api/users/${userId}/role`, { role });
    return response.data;
};

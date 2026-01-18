import axios from "axios";

const api = axios.create({
    baseURL: "https://apiseios.onrender.com",
    //baseURL: "http://localhost:8080",
});

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

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            return Promise.reject(new Error("Token expired"));
        }

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const loginService = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
};

export const registerService = async (name, email, password, birth_date, gender_id) => {
    const response = await api.post("/api/auth/register", { name, email, password, birth_date, gender_id });
    return response.data;
};

export const recoverPasswordService = async (email) => {
    const response = await api.post("/api/auth/recover-password", { email });
    return response.data;
};

export const resetPasswordService = async (token, newPassword) => {
    const response = await api.post("/api/auth/reset-password", { token, newPassword });
    return response.data;
};

export const runSimulationService = async (params) => {
    const response = await api.post("/api/simulations/", params);
    return response.data;
};

export const getSimulationService = async (id) => {
    const response = await api.get(`/api/simulations/${id}`);
    return response.data;
};

export const getUserSimulationsService = async (userId) => {
    const response = await api.get(`/api/users/${userId}/simulations`);
    return response.data;
};

export const deleteSimulationService = async (simulationId) => {
    const response = await api.delete(`/api/simulations/${simulationId}`);
    return response.data;
};


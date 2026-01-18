import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apiseios.onrender.com/api',
    //baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (!window.location.pathname.includes('login')) {
                window.location.href = 'login';
            }
        }
        return Promise.reject(error);
    }
);

export const loginService = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerService = async (name, email, password, birth_date, gender_id) => {
    const response = await api.post('/auth/register', { name, email, password, birth_date, gender_id });
    return response.data;
};

export const recoverPasswordService = async (email) => {
    const response = await api.post('/auth/recover-password', { email });
    return response.data;
};

export const resetPasswordService = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
};

export const runSimulationService = async (params) => {
    const response = await api.post('/simulations/', params);
    return response.data;
};

export const getSimulationService = async (id) => {
    const response = await api.get(`/simulations/${id}`);
    return response.data;
};


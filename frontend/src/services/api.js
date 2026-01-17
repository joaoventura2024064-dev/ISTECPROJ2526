import axios from 'axios';

export const loginService = async (email, password) => {
    const response = await axios.post('https://apiseios.onrender.com/api/auth/login', { email, password });
    return response.data;
};

export const registerService = async (name, email, password, birth_date, gender_id) => {
    const response = await axios.post('https://apiseios.onrender.com/api/auth/register', { name, email, password, birth_date, gender_id });
    return response.data;
};

export const recoverPasswordService = async (email) => {
    const response = await axios.post('https://apiseios.onrender.com/api/auth/recover-password', { email });
    return response.data;
};

export const resetPasswordService = async (token, newPassword) => {
    const response = await axios.post('https://apiseios.onrender.com/api/auth/reset-password', { token, newPassword });
    return response.data;
};

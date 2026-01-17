import { createContext, useState, useEffect, useContext } from 'react';
import { loginService, registerService, recoverPasswordService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        /*if (email === 'a@a.a' && password === '1') {
            const fakeData = {
                access_token: 'fake-dev-token',
                user: { id: 'dev', name: 'Admin Demo', email: 'jfventura@dev.pt' }
            };
            localStorage.setItem('token', fakeData.access_token);
            localStorage.setItem('user', JSON.stringify(fakeData.user));
            setToken(fakeData.access_token);
            setUser(fakeData.user);
            return { success: true };
        }*/

        try {
            const data = await loginService(email, password);

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.access_token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao iniciar sessão';
            return { success: false, error: errorMessage };
        }
    };

    const register = async (name, email, password, birth_date, gender_id) => {
        try {
            const data = await registerService(name, email, password, birth_date, gender_id);
            return { success: true };
        } catch (error) {
            console.error("Register error:", error);
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao registar';
            return { success: false, error: errorMessage };
        }
    };

    const recoverPassword = async (email) => {
        try {
            await recoverPasswordService(email);
            return { success: true };
        } catch (error) {
            console.error("Recover password error:", error);
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao recuperar password';
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, recoverPassword, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



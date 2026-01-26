import { createContext, useState, useEffect, useContext } from 'react';
import { loginService, registerService, recoverPasswordService } from '../services/api';

// Criação do Contexto de Autenticação
const AuthContext = createContext(null);

/**
 * Provider de Autenticação.
 * Envolve a aplicação para fornecer o estado de sessão (user, token) a todos os componentes.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Objeto do utilizador atual
    const [token, setToken] = useState(localStorage.getItem('token')); // JWT Token
    const [loading, setLoading] = useState(true); // Estado de carregamento inicial (verifica sessão ao abrir)

    // Efeito para sincronizar estado com localStorage na inicialização
    useEffect(() => {
        if (token) {
            // Tenta recuperar os dados do user guardados
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        setLoading(false); // Terminou a verificação
    }, [token]);

    /**
     * Função de Login.
     * Chama a API e guarda os tokens no localStorage.
     */
    const login = async (email, password) => {
        try {
            const data = await loginService(email, password);

            // Guardar sessão persistente
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Atualizar estado da app
            setToken(data.access_token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao iniciar sessão';
            return { success: false, error: errorMessage };
        }
    };

    /**
     * Função de Registo.
     */
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

    /**
     * Função para pedir recuperação de password.
     */
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

    /**
     * Função de Logout.
     * Limpa o localStorage e o estado da aplicação.
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    /**
     * Atualiza os dados do utilizador no estado e localStorage (ex: após mudar perfil).
     */
    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, recoverPassword, updateUser, loading }}>
            {/* Só renderiza a app depois de verificar a sessão inicial */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar o contexto de autenticação facilmente
export const useAuth = () => useContext(AuthContext);



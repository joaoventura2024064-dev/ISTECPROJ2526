import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faLock, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';
import { toast } from 'sonner';

/**
 * Cartão de Registo.
 * Formulário completo para criar nova conta de utilizador.
 */
export default function RegisterCard() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Verificar campos obrigatórios
        if (!name || !email || !birthDate || !gender || !password || !confirmPassword) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        // 2. Validar data de nascimento (não futura)
        if (birthDate > new Date().toISOString().split('T')[0]) {
            toast.error("A data de nascimento deve ser igual ou inferior ao dia atual.");
            return;
        }

        // 3. Confirmar passwords iguais
        if (password !== confirmPassword) {
            toast.error("As password não coincidem.");
            return;
        }

        // 4. Comprimento mínimo
        if (password.length < 8) {
            toast.error("A password deve ter pelo menos 8 caracteres.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email inválido.");
            return;
        }
        try {
            setLoading(true);
            const result = await register(name, email, password, birthDate, gender);

            if (result.success) {
                navigate('/login');
            } else {
                toast.error(result.error || 'Erro ao iniciar sessão.');
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[550px] bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] px-10 py-8 flex flex-col items-center gap-6">

            <div className="text-center space-y-2">
                <h2 className="headings-h2 text-neutral-500">
                    Criar Conta
                </h2>
                <p className="body-main text-neutral-200">
                    Preencha os dados abaixo para se registar
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="name" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                        Nome
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-200">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full body-main pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-2.5 flex-1 group">
                        <label htmlFor="birthDate" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                            Data de Nascimento
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-200">
                                <FontAwesomeIcon icon={faCalendar} />
                            </div>
                            <input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full body-main pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 flex-1 group">
                        <label htmlFor="gender" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                            Genero
                        </label>
                        <div className="relative">
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full body-main pl-4 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm appearance-none"
                                required
                            >
                                <option value="" disabled>Insira o seu genero</option>
                                <option value="1">Masculino</option>
                                <option value="2">Feminino</option>
                                <option value="3">Outro</option>
                                <option value="4">Prefiro não dizer</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="email" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-200">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@email.com"
                            className="w-full body-main pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="password" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-200">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="**********"
                            className="w-full body-main pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="confirmPassword" className="body-main text-neutral-500 group-focus-within:text-primary-500">
                        Confirmar Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-200">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="**********"
                            className="w-full body-main pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>
            </form>
            <Button className="mt-4"
                onClick={handleSubmit}
                text={loading ? "A registar..." : "Registar"}
                variant="primary"
                width="fill"
                icon={loading ? faSpinner : ""}
                spin={loading}
                disabled={loading}
            />
            <div className="label-caption text-neutral-500">Já tem uma conta? <Link to="/login" className="label-caption text-primary-500 hover:text-primary-800 transition-colors">Inicie sessão aqui</Link></div>
        </div>
    );
}

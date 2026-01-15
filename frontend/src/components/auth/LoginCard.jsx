import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';

export default function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Erro ao iniciar sessão.');
        }
    };

    return (
        <div className="w-full max-w-[550px] bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] px-10 py-8 flex flex-col items-center gap-6">

            <div className="text-center space-y-2">
                <h2 className="font-roboto font-bold text-[20px] text-neutral-500 leading-7">
                    Bem-vindo de volta
                </h2>
                <p className="font-montserrat text-[14px] text-neutral-200 leading-5">
                    Introduza as suas credenciais para aceder
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-montserrat">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2.5">
                    <label htmlFor="email" className="font-montserrat font-medium text-[14px] text-neutral-500">
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
                            className="w-full pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-montserrat text-[14px] transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2.5">
                    <label htmlFor="password" className="font-montserrat font-medium text-[14px] text-neutral-500">
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
                            className="w-full pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-montserrat text-[14px] transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex justify-end mt-1">
                        <Link to="/recuperar-password" className="font-montserrat text-[12px] text-primary-600 hover:text-primary-500 font-medium">
                            Esqueceu a palavra-passe?
                        </Link>
                    </div>
                </div>

                <Button
                    text="Entrar"
                    variant="primary"
                    width='fill'
                />
            </form>

            <div className="w-full flex items-center gap-4">
                <div className="h-px bg-base-600 flex-1"></div>
                <span className="font-montserrat text-[12px] text-base-700 font-medium bg-white px-2">
                    OU
                </span>
                <div className="h-px bg-base-600 flex-1"></div>
            </div>

            <Link to="/registar" className="w-full">
                <Button
                    text="Registar"
                    variant="secondary"
                    width='fill'
                />
            </Link>

        </div>
    );
}

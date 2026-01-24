import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';
import { toast } from 'sonner';

export default function RecoverPasswordCard() {
    const [email, setEmail] = useState('');
    const { recoverPassword } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!email.trim()) {
                toast.error("Por favor, preencha o seu email.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error("Email inválido.");
                return;
            }

            const result = await recoverPassword(email);

            if (result.success) {
                toast.success('Email enviado com sucesso.');
                navigate('/login');
            } else {
                toast.error(result.error || 'Erro ao enviar email.');
            }
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[550px] bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] px-10 py-8 flex flex-col items-center gap-6">

            <div className="text-center space-y-2">
                <h2 className="font-roboto font-bold text-[20px] text-neutral-500 leading-7">
                    Recuperar senha
                </h2>
                <p className="font-montserrat text-[14px] text-neutral-200 leading-5">
                    Insira o seu email para recuperar a palavra-passe
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="email" className="font-montserrat font-medium text-[14px] text-neutral-500 group-focus-within:text-primary-500">
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
                            disabled={loading}
                            required
                        />
                    </div>
                </div>
            </form>
            <Button
                onClick={handleSubmit}
                text={loading ? "A enviar..." : "Enviar"}
                variant="primary"
                width='fill'
                icon={loading ? faSpinner : ""}
                spin={loading}
                disabled={loading}
            />
        </div>
    );
}

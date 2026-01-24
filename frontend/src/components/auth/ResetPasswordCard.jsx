import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';
import { toast } from 'sonner';
import { resetPasswordService } from '../../services/api';

export default function ResetPasswordCard() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("As passwords não coincidem.");
            return;
        }

        setLoading(true);
        try {
            const result = await resetPasswordService(token, password);
            console.log(result);

            if (result && !result.error) {
                toast.success('Password alterada com sucesso! Faça login.');
                navigate('/login');
            } else {
                toast.error(result.error || 'Erro ao alterar a password.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao alterar a password. O link pode ter expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[550px] bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] px-10 py-8 flex flex-col items-center gap-6">

            <div className="text-center space-y-2">
                <h2 className="font-roboto font-bold text-[20px] text-neutral-500 leading-7">
                    Redefinir Password
                </h2>
                <p className="font-montserrat text-[14px] text-neutral-200 leading-5">
                    Introduza a sua nova palavra-passe
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="password" className="font-montserrat font-medium text-[14px] text-neutral-500 group-focus-within:text-primary-500">
                        Nova Password
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
                </div>

                <div className="flex flex-col gap-2.5 group">
                    <label htmlFor="confirmPassword" className="font-montserrat font-medium text-[14px] text-neutral-500 group-focus-within:text-primary-500">
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
                            className="w-full pl-10 pr-4 py-3 border border-neutral-100 rounded-lg text-neutral-500 placeholder-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-montserrat text-[14px] transition-colors bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <Button
                    text={loading ? "A alterar..." : "Alterar Password"}
                    width="fill"
                    icon={loading ? faSpinner : ""}
                    spin={loading}
                    disabled={loading}
                    onClick={handleSubmit}
                    variant="primary"
                />
            </form>
        </div>
    );
}

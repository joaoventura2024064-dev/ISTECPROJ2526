import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card/Card';
import { faUser, faKey, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { getUserService, updateUserService } from '../services/api';
import Button from '../components/common/Button';

/**
 * Página de Detalhe de Utilizador (Perfil).
 * Permite visualizar e editar dados pessoais e alterar password.
 * Protegido: Apenas o próprio utilizador ou Admins podem aceder.
 */
export default function UserDetail() {
    const { id } = useParams();
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    // Estados para dados do utilizador e formulários
    const [userData, setUserData] = useState({
        name: '',
        cargo: '',
        about_me: '',
        email: '',
        gender_id: '',
        birth_date: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        cargo: '',
        about_me: '',
        email: '',
        gender_id: '',
        birth_date: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    const userInitial = userData.name ? userData.name.charAt(0).toUpperCase() : '?';

    // Verificar se existem alterações não guardadas
    const hasPersonalChanges = JSON.stringify({
        name: userData.name || '',
        cargo: userData.cargo || '',
        about_me: userData.about_me || '',
        email: userData.email || '',
        gender_id: userData.gender_id || '',
        birth_date: userData.birth_date || ''
    }) !== JSON.stringify({
        name: formData.name,
        cargo: formData.cargo,
        about_me: formData.about_me,
        email: formData.email,
        gender_id: formData.gender_id,
        birth_date: formData.birth_date
    });

    const hasPasswordInput = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;

    useEffect(() => {
        if (user) {
            // Apenas Admin ou o próprio dono podem ver esta página
            if (user.role !== 'admin' && user.id.toString() !== id.toString()) {
                toast.error("Não tem permissão para aceder a este perfil.");
                navigate('/');
                return;
            }
            fetchUser();
        }
    }, [id, user, navigate]);


    const fetchUser = async () => {
        try {
            setLoading(true);
            //await new Promise(resolve => setTimeout(resolve, 2000));
            const data = await getUserService(id);
            setUserData(data);
            setFormData({
                name: data.name || '',
                cargo: data.cargo || '',
                about_me: data.about_me || '',
                email: data.email || '',
                gender_id: data.gender_id || '',
                birth_date: data.birth_date || ''
            });
        } catch (error) {
            toast.error('Erro a carregar o utilizador');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {

        if (formData.birth_date > new Date().toISOString().split('T')[0]) {
            toast.error("A data de nascimento deve ser igual ou inferior ao dia atual.");
            return;
        }

        setLoadingPersonal(true);
        try {
            const changes = {};
            if (formData.name !== (userData.name || '')) changes.name = formData.name;
            if (formData.cargo !== (userData.cargo || '')) changes.cargo = formData.cargo;
            if (formData.about_me !== (userData.about_me || '')) changes.about_me = formData.about_me;
            if (formData.gender_id !== (userData.gender_id || '')) changes.gender_id = formData.gender_id;
            if (formData.birth_date !== (userData.birth_date || '')) changes.birth_date = formData.birth_date;
            changes.email = userData.email;

            const result = await updateUserService(id, changes);

            setUserData(prev => ({ ...prev, ...changes }));

            if (user.id.toString() === id.toString()) {
                updateUser({ ...user, ...changes });
            }

            toast.success('Alterações guardadas com sucesso!');

        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Erro ao guardar alterações.');
            }
        } finally {
            setLoadingPersonal(false);
        }
    };

    const handleSavePassword = async () => {
        setLoadingPassword(true);

        try {
            if (!hasPasswordInput) {
                toast.error('Preencha todos os campos.');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                toast.error('As palavras-passe não coincidem.');
                return;
            }

            if (passwordData.newPassword.length < 8) {
                toast.error('A nova palavra-passe deve ter pelo menos 8 caracteres.');
                return;
            }

            //await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await updateUserService(id, passwordData);

            toast.success('Palavra-passe alterada com sucesso!');
            if (user.id.toString() === id.toString()) {
                logout();
                navigate('/login');
            }

        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Erro ao alterar palavra-passe!');
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const userCreationDate = new Date(userData.created_at);

    return (
        loading ? (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="flex flex-col gap-1 my-8 items-end flex-1">
                    <div className="h-[32px] w-64 bg-background-600 rounded-xl opacity-40"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
                    <div className="h-[340px] w-full rounded-xl bg-background-600 opacity-40 animate-pulse" />
                    <div className="flex flex-col gap-5">
                        <div className="h-[478px] w-full rounded-xl bg-background-600 opacity-40 animate-pulse" />
                        <div className="h-[300px] w-full rounded-xl bg-background-600 opacity-40 animate-pulse" />
                    </div>
                </div>
            </div >
        ) : (
            <div className="flex flex-col gap-6 select-none">
                <PageHeader
                    title="Perfil de Utilizador"
                    align='right'
                    backButton={true}
                />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
                    <Card
                        header={false}
                        isLoading={loading}
                        className="h-fit"
                    >
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <div className="ui-profile-initial-l w-35 h-35 rounded-full bg-primary-50 border border-5 border-primary-200 flex items-center justify-center text-primary-700">
                                {userInitial}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 border-b border-base-600">
                            <div className="flex flex-col items-center gap-2 w-full">
                                <h2 className="headings-h1 text-neutral-500 capitalize">{userData.name || 'Sem Nome'}</h2>
                                <p className="body-main text-neutral-300 mb-5 capitalize">{userData.cargo || 'Sem Função'}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-5 w-full">
                            <h2 className="caption-strong text-neutral-200">Membro desde</h2>
                            <p className="caption-main text-neutral-200 first-letter:uppercase">
                                {userCreationDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }) || '-'}
                            </p>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-5">
                        <Card
                            title="Informações Pessoais"
                            icon={faUser}
                            isLoading={loading}
                        >
                            <div className="flex flex-col gap-5 py-2.5">
                                <div className="grid grid-cols-2 gap-4" >
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="nome" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Nome</label>
                                        <input
                                            id="nome"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loadingPersonal}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Input Taxa Recuperacao */}
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="funcao" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Função</label>
                                        <input
                                            id="funcao"
                                            type="text"
                                            name="cargo"
                                            value={formData.cargo}
                                            onChange={handleChange}
                                            disabled={loadingPersonal}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4" >
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="birth_date" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Data de Nascimento</label>
                                        <input
                                            id="birth_date"
                                            type="date"
                                            name="birth_date"
                                            max={new Date().toISOString().split('T')[0]}
                                            value={formData.birth_date}
                                            onChange={handleChange}
                                            disabled={loadingPersonal}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Input Taxa Recuperacao */}
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="gender_id" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Gênero</label>
                                        <select
                                            id="gender_id"
                                            value={formData.gender_id}
                                            name="gender_id"
                                            onChange={handleChange}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50 appearance-none"
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
                                <div className="group flex flex-col gap-2.5">
                                    <label htmlFor="sobre_mim" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Sobre Mim</label>
                                    <textarea
                                        id="sobre_mim"
                                        name="about_me"
                                        value={formData.about_me}
                                        onChange={handleChange}
                                        disabled={loadingPersonal}
                                        className="w-full resize-none border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                    />
                                </div>
                                <div className="group flex flex-col gap-2.5">
                                    <label htmlFor="email" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Email</label>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        value={userData.email || ''}
                                        disabled
                                        className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </Card>
                        <div className={`flex justify-end ${!hasPersonalChanges ? 'hidden' : ''}`}>
                            <Button
                                text={loadingPersonal ? "Aguarde..." : "Guardar"}
                                icon={!loadingPersonal ? faSave : faSpinner}
                                onClick={handleSave}
                                disabled={loadingPersonal}
                                spin={loadingPersonal}
                            />
                        </div>
                        <Card
                            title="Alterar Palavra-Passe"
                            icon={faKey}
                            isLoading={loading}
                        >
                            <div className="flex flex-col gap-5 py-2.5">
                                <div className="group flex flex-col gap-2.5">
                                    <label htmlFor="currentPassword" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Palavra-Passe Atual</label>
                                    <input
                                        id="currentPassword"
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Insira a sua palavra-passe atual"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        disabled={loadingPassword}
                                        className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4" >
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="newPassword" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Nova Palavra-Passe</label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            name="newPassword"
                                            placeholder="Insira a sua nova palavra-passe"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            disabled={loadingPassword}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Input Taxa Recuperacao */}
                                    <div className="group flex flex-col gap-2.5">
                                        <label htmlFor="confirmNewPassword" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Confirmar Palavra-Passe</label>
                                        <input
                                            id="confirmNewPassword"
                                            type="password"
                                            name="confirmNewPassword"
                                            placeholder="Confirme a sua nova palavra-passe"
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            disabled={loadingPassword}
                                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className={`flex justify-end ${!hasPasswordInput ? 'hidden' : ''}`}>
                            <Button
                                text={loadingPassword ? "Aguarde..." : "Guardar"}
                                icon={!loadingPassword ? faSave : faSpinner}
                                onClick={handleSavePassword}
                                disabled={loadingPassword}
                                spin={loadingPassword}
                            />
                        </div>
                    </div>
                </div>
            </div >
        )
    );
}

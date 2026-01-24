import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import UsersTable from '../components/common/UsersTable';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { getUsersService, changeUserStatusService, changeUserRoleService } from '../services/api';

export default function UsersManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            toast.error("Não tem permissão para aceder a esta página.");
            navigate('/');
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            //await new Promise(resolve => setTimeout(resolve, 2000));
            const data = await getUsersService();
            setUsers(data);
        } catch (error) {
            toast.error('Erro a carregar os utilizadores');
        } finally {
            setLoading(false);
        }
    };

    const HandleToggleBlock = async (id, status) => {
        try {
            await changeUserStatusService(id, status);
            fetchUsers();
        } catch (error) {
            toast.error('Erro a bloquear/desbloquear o utilizador');
        }
    };

    const HandleToggleAdmin = async (id, role) => {
        try {
            await changeUserRoleService(id, role);
            fetchUsers();
        } catch (error) {
            toast.error('Erro a promover/remover admin');
        }
    };
    return (
        <div className="w-full flex flex-col gap-6">
            <PageHeader title="Gestão de Utilizadores" subTitle="Consulte e edite as contas da plataforma." />
            <UsersTable users={users} isLoading={loading} HandleToggleBlock={HandleToggleBlock} HandleToggleAdmin={HandleToggleAdmin} />
        </div>
    );
}

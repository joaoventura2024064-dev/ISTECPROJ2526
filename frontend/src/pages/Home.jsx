import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faChartLine, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/common/PageHeader';
import SimulationsTable from '../components/simulation/SimulationsTable';
import { getUserSimulationsService, deleteSimulationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSimulations();
    }, [user]);

    const handleNewSimulation = () => {
        navigate('/simulador');
    };

    const fetchSimulations = async () => {
        if (user?.id) {
            try {
                setLoading(true);
                //await new Promise(resolve => setTimeout(resolve, 2000));
                const data = await getUserSimulationsService(user.id);
                setSimulations(data);
            } catch (error) {
                toast.error('Erro a carregar as simulações');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteSimulation = async (id) => {
        try {
            await deleteSimulationService(id);
            setSimulations((prev) => prev.filter((sim) => sim.id !== id));
            toast.success('Simulação apagada com sucesso');
        } catch (error) {
            toast.error('Erro ao apagar simulação');
        }
    };

    const exportCSV = () => {
        toast.success("Simulações exportadas com sucesso.");
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <PageHeader
                title="Histórico de Simulações"
                subTitle="Consulte, compare e retome as suas experiências passadas."
                primaryActionButton={{
                    text: "Nova Simulação",
                    icon: faChartLine,
                    onClick: handleNewSimulation
                }}
                secondaryActionButton={{
                    text: "Exportar CSV",
                    icon: faFileArrowDown,
                    onClick: exportCSV
                }}
            />
            <SimulationsTable data={simulations} isLoading={loading} onDelete={handleDeleteSimulation} />
        </div>
    );
}

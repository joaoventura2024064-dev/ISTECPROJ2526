import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SimulationParameters from '../components/simulation/SimulationParameters';
import SimulationResults from '../components/simulation/SimulationResults';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { getSimulationService } from '../services/api';

export default function SimulationView() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [params, setParams] = useState({
        population: 0,
        initialInfected: 0,
        contactRate: 0,
        recoveryRate: 0,
        duration: 0
    });

    const [simulationData, setSimulationData] = useState(null);

    useEffect(() => {
        const fetchSimulation = async () => {
            try {
                setLoading(true);
                const data = await getSimulationService(id);

                if (data.parameters) {
                    setParams({
                        population: data.parameters.population_total,
                        initialInfected: data.parameters.infected_initial,
                        contactRate: data.parameters.beta,
                        recoveryRate: data.parameters.gamma,
                        duration: data.parameters.duration
                    });
                }

                if (data.steps) {
                    setSimulationData(data.steps);
                }

                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar simulação:", err);
                setError("Não foi possível carregar a simulação.");
                setLoading(false);
            }
        };

        if (id) {
            fetchSimulation();
        }
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center">A carregar simulação...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Simulação COVID-19"
                subTitle={`Visualizar resultados da simulação #${id}`}
                backButton={true}
                align="right"
            />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
                <SimulationParameters
                    title="Parâmetros da Simulação"
                    icon={faRotateRight}
                    params={params}
                    readOnly={true}
                />
                <SimulationResults
                    results={simulationData}
                    status="success"
                />
            </div>
        </div>
    );
}

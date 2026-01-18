import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SimulationParameters from '../components/simulation/SimulationParameters';
import SimulationResults from '../components/simulation/SimulationResults';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { getSimulationService } from '../services/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SimulationView() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [params, setParams] = useState({
        population_total: 1000,
        infected_initial: 1,
        beta: 0.5,
        gamma: 0.1,
        duration: 50
    });

    const [simulationData, setSimulationData] = useState(null);

    useEffect(() => {
        const fetchSimulation = async () => {
            try {
                setLoading(true);
                //await sleep(5000)
                const data = await getSimulationService(id);

                if (data) {
                    setParams({
                        population_total: data.parameters.population_total,
                        infected_initial: data.parameters.infected_initial,
                        beta: data.parameters.beta,
                        gamma: data.parameters.gamma,
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
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="flex justify-between items-center h-[76px]">
                    <div className="flex flex-col gap-2 items-end flex-1">
                        <div className="h-8 w-64 bg-background-600 rounded"></div>
                        <div className="h-4 w-96 bg-background-600 rounded"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 animate-pulse">
                    <div className="rounded-xl h-[400px] bg-background-600"></div>
                    <div className="rounded-xl h-[500px] bg-background-600"></div>
                </div>
            </div>
        );
    }
    if (error) {
        return (<p>{error}</p>)
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

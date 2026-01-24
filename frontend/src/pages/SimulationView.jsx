import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SimulationParameters from '../components/simulation/SimulationParameters';
import SimulationResults from '../components/simulation/SimulationResults';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { getSimulationService } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function SimulationView() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                await new Promise(resolve => setTimeout(resolve, 2000));
                const data = await getSimulationService(id);

                if (data?.parameters) {
                    setParams({
                        population_total: data.parameters.population_total,
                        infected_initial: data.parameters.infected_initial,
                        beta: data.parameters.beta,
                        gamma: data.parameters.gamma,
                        duration: data.parameters.duration
                    });
                }

                if (data?.steps) {
                    setSimulationData(data.steps);
                }

            } catch (error) {
                toast.error("Não foi possível carregar a simulação.");
                navigate(-1);
            }
            finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSimulation();
        }
    }, [id]);

    return (
        loading ? (<div className="flex flex-col gap-7 animate-pulse mt-4" >
            <div className="flex justify-between items-center h-[76px]">
                <div className="flex flex-col gap-1 items-end flex-1">
                    <div className="h-[32px] w-64 bg-background-600 rounded-xl opacity-40"></div>
                    <div className="h-[20px] w-96 bg-background-600 rounded-xl opacity-40"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
                <div className="rounded-xl h-[323px] bg-background-600 rounded-xl opacity-40"></div>
                <div className="rounded-xl h-[629px] bg-background-600 rounded-xl opacity-40"></div>
            </div>
        </div>) : (
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
        )
    );
}

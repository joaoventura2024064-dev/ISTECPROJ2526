import { useState, useCallback } from 'react';
import { runSimulationService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import SimulationResults from '../components/simulation/SimulationResults';
import SimulationParameters from '../components/simulation/SimulationParameters';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function NewSimulation() {
    const auth = useAuth();
    const [status, setStatus] = useState('idle');
    const [results, setResults] = useState(null);
    const [steps, setSteps] = useState(null);
    const [params, setParams] = useState({
        parameters: {
            population_total: 1,
            infected_initial: 1,
            beta: 0.1,
            gamma: 0.1,
            duration: 1
        },
        user_id: auth.user.id
    });

    const handleParamChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            parameters: {
                ...prev.parameters,
                [key]: value
            }
        }));
    };

    const handleRunSimulation = async () => {
        setStatus('loading');

        try {
            const numericParams = {
                ...params,
                parameters: {
                    population_total: Number(params.parameters.population_total),
                    infected_initial: Number(params.parameters.infected_initial),
                    beta: Number(params.parameters.beta),
                    gamma: Number(params.parameters.gamma),
                    duration: Number(params.parameters.duration)
                }
            };

            const data = await runSimulationService(numericParams);
            setResults(data);
            setSteps(data.steps);
            //await new Promise(resolve => setTimeout(resolve, 2000));
            setStatus('success');
        } catch (error) {
            setStatus('error');
            toast.error("Erro ao executar simulação.");
        }
    };

    const handleSave = useCallback(() => {
        toast.success("Simulação guardada com sucesso.");
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Nova Simulação"
                subTitle="Configure os parâmetros demográficos e epidemiológicos para iniciar"
                align='right'
            />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
                <SimulationParameters
                    title="Parâmetros da Simulação"
                    icon={faRotateRight}
                    params={params.parameters}
                    onChange={handleParamChange}
                    onRun={handleRunSimulation}
                    readOnly={false}
                    loading={status === 'loading'}
                />
                <SimulationResults
                    status={status}
                    results={steps}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}

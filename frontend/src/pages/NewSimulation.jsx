import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import SimulationResults from '../components/simulation/SimulationResults';
import SimulationParameters from '../components/simulation/SimulationParameters';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function NewSimulation() {
    const [status, setStatus] = useState('idle');
    const [results, setResults] = useState(null);
    const [params, setParams] = useState({
        population: 1000,
        initialInfected: 1,
        contactRate: 0.5,
        recoveryRate: 0.1,
        duration: 50
    });

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    const handleRunSimulation = async () => {
        setStatus('loading');

        // Simular chamada API
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock de resultados (substituir depois pela resposta real da API)
            setResults({
                peakInfected: Math.floor(params.population * 0.4),
                totalRecovered: Math.floor(params.population * 0.9),
                r0: (params.contactRate / params.recoveryRate).toFixed(2)
            });

            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

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
                    params={params}
                    onChange={handleParamChange}
                    onRun={handleRunSimulation}
                    readOnly={false}
                    loading={status === 'loading'}
                />
                <SimulationResults
                    status={status}
                    results={results}
                    onSave={() => console.log("Save clicked")}
                />
            </div>
        </div>
    );
}

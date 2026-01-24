import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { runSimulationService, saveSimulationService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import SimulationResults from '../components/simulation/SimulationResults';
import SimulationParameters from '../components/simulation/SimulationParameters';
import { faEnvelope, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function NewSimulation() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [status, setStatus] = useState('idle');
    const [results, setResults] = useState(null);
    const [steps, setSteps] = useState(null);
    const [seed, setSeed] = useState(null);
    const [params, setParams] = useState({
        parameters: {
            population_total: 1,
            infected_initial: 1,
            beta: 0.1,
            gamma: 0.1,
            duration: 1
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [simulationName, setSimulationName] = useState('');

    const handleParamChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            parameters: {
                ...prev.parameters,
                [key]: Number(value)
            }
        }));
    };

    const handleRunSimulation = async () => {
        setStatus('loading');

        if (params.parameters.population_total < params.parameters.infected_initial) {
            toast.error('A população total deve ser maior que a população infectada inicial.');
            setStatus('error');
            return;
        }
        try {
            const data = await runSimulationService(params);
            setResults(data);
            setSteps(data.results);
            setSeed(data.seed);
            //await new Promise(resolve => setTimeout(resolve, 2000));
            setStatus('success');
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Erro ao executar simulação!');
            }
            setStatus('error');
        }
    };

    const handleSave = useCallback(() => {
        setSimulationName('');
        setIsModalOpen(true);
    }, []);

    const handleConfirmSave = async () => {
        if (!simulationName.trim()) {
            toast.error("Por favor, insira um nome para a simulação.");
            return;
        }

        try {
            const data = await saveSimulationService({
                description: simulationName,
                parameters: params.parameters,
                seed: seed,
                user_id: auth.user.id
            });
            toast.success(`Simulação "${simulationName}" guardada com sucesso.`);
            setIsModalOpen(false);
            navigate(`/simulador/${data.id}`);
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Erro ao salvar simulação!');
            }
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


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Guardar Simulação"
                subTitle="Dê um nome à sua simulação para a consultar mais tarde no histórico."
                showExitButton={false}
            >
                <div className="flex flex-col p-7.5 border-b border-background-600">
                    <div className="group flex flex-col gap-2.5">
                        <label htmlFor="simulationName" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Nome da Simulação</label>
                        <input
                            id="simulationName"
                            type="text"
                            value={simulationName}
                            onChange={(e) => setSimulationName(e.target.value)}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                            placeholder="Ex: Simulação de Teste #1"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-10 px-7.5 py-5 bg-background-200">
                    <div className="flex justify-end gap-10">
                        <Button
                            text="Cancelar"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <Button
                            text="Guardar"
                            icon={faEnvelope}
                            variant="primary"
                            onClick={handleConfirmSave}
                        />
                    </div>
                </div>
            </Modal>
        </div >
    );
}

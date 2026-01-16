import PageHeader from '../components/common/PageHeader';
import SimulationResults from '../components/simulation/SimulationResults';
import SimulationParameters from '../components/simulation/SimulationParameters';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function NewSimulation() {

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
                    readOnly={false} />
                <SimulationResults />
            </div>
        </div>
    );
}

import PageHeader from '../components/common/PageHeader';

export default function SimulationResult() {
    return (
        <div className="w-full flex flex-col gap-6">
            <PageHeader
                title="Histórico de Simulações"
                subTitle="Histórico de Simulações"
                backButton={true}
                align="right"
            />
            <div>Resultado de simualação</div>
        </div>
    );
}

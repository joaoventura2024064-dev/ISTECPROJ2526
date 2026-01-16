import { faFloppyDisk, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';
import Card from '../common/Card/Card';

export default function SimulationResults({
    results,
    status = 'loading',
    onSave
}) {

    const actions = status === 'success' && (
        <Button
            text="Guardar Simulação"
            variant="secondary"
            icon={faFloppyDisk}
            onClick={onSave}
            className="!py-1 !text-xs !gap-1"
        />
    );

    return (
        <Card title="Resultados da Evolução" icon={faChartLine} actions={actions} className="h-full">
            <div className="flex-1 flex flex-col justify-center h-full">
                {status === 'idle' || status === 'loading' ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-neutral-400 opacity-60 h-full">

                        <p className="font-montserrat font-bold text-lg text-neutral-600">
                            {status === 'loading' ? 'A Processar...' : 'A Aguardar Execução...'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 w-full h-full">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-secondary-500 font-montserrat font-semibold text-xs uppercase">Pico Infetados</span>
                                <span className="text-secondary-700 font-montserrat font-bold text-2xl">{results?.peakInfected || 0}</span>
                            </div>
                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-primary-600 font-montserrat font-semibold text-xs uppercase">Total Recuperados</span>
                                <span className="text-primary-700 font-montserrat font-bold text-2xl">{results?.totalRecovered || 0}</span>
                            </div>
                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-neutral-400 font-montserrat font-semibold text-xs uppercase">R₀ Estimado</span>
                                <span className="text-neutral-600 font-montserrat font-bold text-2xl">{results?.r0 || 0}</span>
                            </div>
                        </div>

                        <div className="flex-1 bg-neutral-50 border border-dashed border-neutral-200 rounded-xl flex items-center justify-center relative min-h-[250px]">
                            <p className="text-neutral-400 text-sm font-montserrat">Área do Gráfico (Chart.js)</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

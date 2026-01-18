import { faFloppyDisk, faChartLine } from '@fortawesome/free-solid-svg-icons';

import Button from '../common/Button';
import Card from '../common/Card/Card';
import ChartSIR from './ChartSIR';
import CountUp from 'react-countup';
import { memo } from 'react';
import imagem from '../../assets/medcei_ig_icon_tech.png';

const SimulationResults = memo(function SimulationResults({
    results,
    status = 'idle',
    onSave
}) {

    const actions = status === 'success' && onSave && (
        <Button
            text="Guardar Simulação"
            variant="secondary"
            icon={faFloppyDisk}
            onClick={onSave}
            className="!text-sm h-full"
        />
    );

    return (
        <Card title="Resultados da Simulação" icon={faChartLine} actions={actions} className="h-full">
            <div className="flex-1 flex flex-col justify-center h-full select-none min-h-[522px]">
                {status === 'idle' || status === 'loading' ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-neutral-400  h-full">
                        <div className="flex flex-col items-center justify-center text-neutral-400  h-full">
                            <img src={imagem} className={`w-[222px] h-[222px] ${status === 'loading' ? 'animate-pulse' : ''}`}></img>
                            <p className="font-montserrat font-bold text-2xl text-neutral-600">
                                {status === 'loading' ? 'A Processar...' : 'A Aguardar Execução...'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 w-full h-full ">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-secondary-500 font-montserrat font-semibold text-xs uppercase">Pico Infetados</span>
                                <span className="text-secondary-700 font-montserrat font-bold text-2xl"><CountUp start={0} end={Math.max(...results.map(data => data.I)) || 0} duration={2.5} /></span>
                            </div>
                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-primary-600 font-montserrat font-semibold text-xs uppercase">Total Recuperados</span>
                                <span className="text-primary-700 font-montserrat font-bold text-2xl"><CountUp start={0} end={results[results.length - 1].R || 0} duration={2.5} /></span>
                            </div>
                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-neutral-400 font-montserrat font-semibold text-xs uppercase">R₀ Estimado</span>
                                <span className="text-neutral-600 font-montserrat font-bold text-2xl"><CountUp start={0} end={results[0].Rt || 0} duration={2.5} /></span>
                            </div>
                        </div>

                        <ChartSIR simulationData={results} />
                    </div>
                )}
            </div>
        </Card>
    );
});

export default SimulationResults;

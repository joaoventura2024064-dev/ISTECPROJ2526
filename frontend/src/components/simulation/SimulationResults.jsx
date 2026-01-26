import { faFloppyDisk, faChartLine } from '@fortawesome/free-solid-svg-icons';

import Button from '../common/Button';
import Card from '../common/Card/Card';
import ChartSIR from './ChartSIR';
import CountUp from 'react-countup';
import { memo } from 'react';
import imagem from '../../assets/medcei_ig_icon_tech.png';

/**
 * Componente de Resultados.
 * Exibe os KPIs principais (Pico, Recuperados, R0) e o Gráfico da simulação.
 * Gere também os estados de Loading, Error e Idle (aguardando dados).
 */
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
        console.log(results),
        <Card title="Resultados da Simulação" icon={faChartLine} actions={actions} className="h-full">
            <div className="flex-1 flex flex-col justify-center min-h-[488px] h-full select-none">
                {status === 'idle' || status === 'loading' ? (
                    <div className="flex flex-col items-center justify-center min-h-[488px] gap-4 text-neutral-400 h-full">
                        <div className="flex flex-col items-center justify-center text-neutral-400  h-full">
                            <img src={imagem} alt="Imagem Aguardar Execução" className={`w-[222px] h-[222px] ${status === 'loading' ? 'animate-pulse' : ''}`}></img>
                            <p className="headings-h1 text-neutral-400">
                                {status === 'loading' ? 'A Processar...' : 'A Aguardar Execução...'}
                            </p>
                            <p className="caption-name text-neutral-400 mt-2">
                                {status === 'loading' ? 'Estamos a gerar o seu gráfico...' : 'Estamos a aguardar os seus dados.'}
                            </p>
                        </div>
                    </div>
                ) : status === 'error' ? (
                    < div className="flex flex-col items-center justify-center gap-4 text-neutral-400  h-full">
                        <div className="flex flex-col items-center justify-center text-neutral-400  h-full">
                            <img src={imagem} alt="Imagem Erro Simulação" className="w-[222px] h-[222px] grayscale-[1]"></img>
                            <div className="text-center">
                                <p className="headings-h1 text-neutral-400">Ocorreu um erro</p>
                                <p className="caption-name text-neutral-400 mt-2">Não foi possível executar a simulação.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 w-full h-full ">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-secondary-500 caption-strong uppercase">Pico Infetados</span>
                                <span className="text-secondary-700 display-numbers"><CountUp start={0} end={Math.max(...results.map(data => data.I)) || 0} duration={2.5} /></span>
                            </div>
                            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-primary-500 caption-strong uppercase">Total Recuperados</span>
                                <span className="text-primary-700 display-numbers"><CountUp start={0} end={results[results.length - 1].R || 0} duration={2.5} /></span>
                            </div>
                            <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 flex flex-col gap-1 items-start">
                                <span className="text-neutral-300 caption-strong uppercase">R₀ Estimado</span>
                                <span className="text-neutral-400 display-numbers"><CountUp start={0} end={results[0].Rt || 0} duration={2.5} /></span>
                            </div>
                        </div>

                        <ChartSIR chartData={results} />
                    </div>
                )}
            </div>
        </Card >
    );
});

export default SimulationResults;

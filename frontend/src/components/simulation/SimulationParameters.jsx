import Button from '../common/Button';
import Card from '../common/Card/Card';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function SimulationParameters({
    title,
    icon,
    params = {
        population: 1,
        initialInfected: 1,
        contactRate: 0,
        recoveryRate: 0.01,
        duration: 1
    },
    onRun
}) {

    const [populationValue, setpopulationValue] = useState(params.population);
    const [initialInfectedValue, setinitialInfectedValue] = useState(params.initialInfected);
    const [contactRateValue, setcontactRateValue] = useState(params.contactRate);
    const [recoveryRateValue, setrecoveryRateValue] = useState(params.recoveryRate);
    const [durationValue, setDurationValue] = useState(params.duration);
    const [loadingValue, setLoadingValue] = useState(false);
    const [readOnlyValue, setreadOnlyValue] = useState(false);

    const handleChange = (paramName, event) => {
        switch (paramName) {
            case 'population':
                setpopulationValue(event.target.value);
                break;
            case 'initialInfected':
                setinitialInfectedValue(event.target.value);
                break;
            case 'contactRate':
                setcontactRateValue(event.target.value);
                break;
            case 'recoveryRate':
                setrecoveryRateValue(event.target.value);
                break;
            case 'duration':
                setDurationValue(event.target.value);
                break;
            default:
                break;
        }

        if (onChange) {
            onChange(paramName, event.target.value);
        }
    };


    return (
        <Card title={title} icon={icon} className="h-fit">
            {/* Formulário de Parametros */}
            <div className="flex flex-col gap-4 pb-5">
                {/* Grid de Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Input Populacao */}
                    <div className="flex flex-col gap-1">
                        <label className="text-neutral-500 text-xs font-montserrat font-semibold">População Total (N)</label>
                        <input
                            type="number"
                            name="population"
                            min="1"
                            value={populationValue}
                            onChange={(e) => handleChange('population', e)}
                            disabled={readOnlyValue}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                        />
                    </div>

                    {/* Input Infetados Iniciais */}
                    <div className="flex flex-col gap-1">
                        <label className="text-neutral-500 text-xs font-montserrat font-semibold">Infetados Iniciais (I₀)</label>
                        <input
                            type="number"
                            name="initialInfected"
                            min="1"
                            value={initialInfectedValue}
                            onChange={(e) => handleChange('initialInfected', e)}
                            disabled={readOnlyValue}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                        />
                    </div>
                </div>

                {/* Input Taca Contacto */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-neutral-500 text-xs font-montserrat font-semibold">Taxa Contacto (β)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            name="contactRate"
                            value={contactRateValue}
                            onChange={(e) => handleChange('contactRate', e)}
                            disabled={readOnlyValue}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                        />
                    </div>

                    {/* Input Taxa Recuperacao */}
                    <div className="flex flex-col gap-1">
                        <label className="text-neutral-500 text-xs font-montserrat font-semibold">Taxa Recup. (γ)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1"
                            name="recoveryRate"
                            value={recoveryRateValue}
                            onChange={(e) => handleChange('recoveryRate', e)}
                            disabled={readOnlyValue}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                        />
                    </div>
                </div>

                {/* Slider Duracao */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-neutral-500 text-xs font-montserrat font-semibold">Duração (Dias)</label>
                        <span className="text-primary-500 text-xs font-montserrat font-bold">{durationValue}</span>
                    </div>
                    <input
                        type="range"
                        name="duration"
                        min="1"
                        max="365"
                        value={durationValue}
                        onChange={(e) => handleChange('duration', e)}
                        disabled={readOnlyValue}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:accent-neutral-300"
                    />
                </div>
            </div>

            {/* Executar Simulacao */}
            {!readOnlyValue && (
                <div className="mt-auto pt-5">
                    <Button
                        text={loadingValue ? "A Executar..." : "Executar Simulação"}
                        width="fill"
                        icon={!loadingValue ? faPlay : null}
                        onClick={onRun}
                        disabled={loadingValue}
                    />
                </div>
            )}
        </Card>
    );
}

import Button from '../common/Button';
import Card from '../common/Card/Card';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
    onRun,
    onChange,
    readOnly,
    loading
}) {

    const [populationValue, setpopulationValue] = useState(params.population);
    const [initialInfectedValue, setinitialInfectedValue] = useState(params.initialInfected);
    const [contactRateValue, setcontactRateValue] = useState(params.contactRate);
    const [recoveryRateValue, setrecoveryRateValue] = useState(params.recoveryRate);
    const [durationValue, setDurationValue] = useState(params.duration);

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
            <div className="flex flex-col gap-6 pb-5 select-none">
                {/* Grid de Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Input Populacao */}
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="population" className="text-neutral-500 text-xs font-montserrat font-semibold group-focus-within:text-primary-500">População Total (N)</label>
                        <input
                            id="population"
                            type="number"
                            name="population"
                            min="1"
                            value={populationValue}
                            onChange={(e) => handleChange('population', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>

                    {/* Input Infetados Iniciais */}
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="initialInfected" className="text-neutral-500 text-xs font-montserrat font-semibold group-focus-within:text-primary-500">Infetados Iniciais (I₀)</label>
                        <input
                            id="initialInfected"
                            type="number"
                            name="initialInfected"
                            min="1"
                            value={initialInfectedValue}
                            onChange={(e) => handleChange('initialInfected', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Input Taca Contacto */}
                <div className="grid grid-cols-2 gap-4" >
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="contactRate" className="text-neutral-500 text-xs font-montserrat font-semibold group-focus-within:text-primary-500">Taxa Contacto (β)</label>
                        <input
                            id="contactRate"
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            name="contactRate"
                            value={contactRateValue}
                            onChange={(e) => handleChange('contactRate', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>

                    {/* Input Taxa Recuperacao */}
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="recoveryRate" className="text-neutral-500 text-xs font-montserrat font-semibold group-focus-within:text-primary-500">Taxa Recup. (γ)</label>
                        <input
                            id="recoveryRate"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1"
                            name="recoveryRate"
                            value={recoveryRateValue}
                            onChange={(e) => handleChange('recoveryRate', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 text-sm font-montserrat focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Slider Duracao */}
                <div className="flex flex-col gap-2 group">
                    <div className="flex justify-between items-center">
                        <label htmlFor="duration" className="text-neutral-500 text-xs font-montserrat font-semibold group-focus-within:text-primary-500">Duração (Dias)</label>
                        <span htmlFor="duration" className="text-primary-500 text-xs font-montserrat font-bold">{durationValue}</span>
                    </div>
                    <input
                        id="duration"
                        type="range"
                        name="duration"
                        min="1"
                        max="365"
                        value={durationValue}
                        onChange={(e) => handleChange('duration', e)}
                        disabled={readOnly || loading}
                        className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:accent-neutral-300 disabled:cursor-default disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Executar Simulacao */}
            {
                !readOnly && (
                    <div className="mt-auto pt-5">
                        <Button
                            text={loading ? "A Executar..." : "Executar Simulação"}
                            width="fill"
                            icon={!loading ? faPlay : faSpinner}
                            spin={loading}
                            onClick={onRun}
                            disabled={loading}
                        />
                    </div>
                )
            }
        </Card >
    );
}

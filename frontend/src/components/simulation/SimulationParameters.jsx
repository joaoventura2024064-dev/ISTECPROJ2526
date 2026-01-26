import Button from '../common/Button';
import Card from '../common/Card/Card';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function SimulationParameters({
    title,
    icon,
    params,
    onRun,
    onChange,
    readOnly,
    loading
}) {

    const handleChange = (paramName, event) => {
        let value = event.target.value;
        const max = event.target.max;

        if (max && Number(value) > Number(max)) {
            value = max;
        }

        if (onChange) {
            onChange(paramName, value);
        }
    };

    return (
        <Card title={title} icon={icon} className="h-fit">
            {/* Formulário de Parametros */}
            <div className="flex flex-col gap-6 pb-5 select-none">
                {/* Grid de Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Input Populacao */}
                    <div className="group flex flex-col gap-2.5">
                        <label htmlFor="population_total" className="text-neutral-500 body-medium group-focus-within:text-primary-500">População Total (N)</label>
                        <input
                            id="population_total"
                            type="number"
                            name="population_total"
                            min="1"
                            max="9999999999"
                            value={params.population_total}
                            onChange={(e) => handleChange('population_total', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>

                    {/* Input Infetados Iniciais */}
                    <div className="group flex flex-col gap-2.5">
                        <label htmlFor="infected_initial" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Infetados Iniciais (I₀)</label>
                        <input
                            id="infected_initial"
                            type="number"
                            name="infected_initial"
                            min="1"
                            max="9999999999"
                            value={params.infected_initial}
                            onChange={(e) => handleChange('infected_initial', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Input Taca Contacto */}
                <div className="grid grid-cols-2 gap-4" >
                    <div className="group flex flex-col gap-2.5">
                        <label htmlFor="beta" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Taxa Contacto (β)</label>
                        <input
                            id="beta"
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            name="beta"
                            value={params.beta}
                            onChange={(e) => handleChange('beta', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>

                    {/* Input Taxa Recuperacao */}
                    <div className="group flex flex-col gap-2.5">
                        <label htmlFor="gamma" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Taxa Recup. (γ)</label>
                        <input
                            id="gamma"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1"
                            name="gamma"
                            value={params.gamma}
                            onChange={(e) => handleChange('gamma', e)}
                            disabled={readOnly || loading}
                            className="w-full border border-neutral-100 rounded-lg px-3 py-2 text-neutral-900 body-medium focus:outline-none focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Slider Duracao */}
                <div className="flex flex-col gap-2.5 group">
                    <div className="flex justify-between items-center">
                        <label htmlFor="duration" className="text-neutral-500 body-medium group-focus-within:text-primary-500">Duração (Dias)</label>
                        <span htmlFor="duration" className="text-primary-500 body-strong">{params.duration}</span>
                    </div>
                    <input
                        id="duration"
                        type="range"
                        name="duration"
                        min="1"
                        max="365"
                        value={params.duration}
                        onChange={(e) => handleChange('duration', e)}
                        disabled={readOnly || loading}
                        className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:accent-neutral-300 disabled:cursor-default disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Executar Simulacao */}
            {
                !readOnly && (
                    <div className="mt-auto pt-4 h-15">
                        <Button
                            text={loading ? " " : "Executar Simulação"}
                            width="fill"
                            height="fill"
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

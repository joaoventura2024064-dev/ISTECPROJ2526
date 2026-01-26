import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

export const description = "A multiple line chart"

const chartConfig = {
    step: {
        label: "Dias"
    },
    S: {
        label: "Suscetíveis"
    },
    I: {
        label: "Infetados",
    },
    R: {
        label: "Recuperados"
    },
    Rt: {
        label: "R₀"
    },
}


/**
 * Componente de Gráfico SIR (Line Chart).
 * Utiliza a biblioteca Recharts para visualizar a evolução das curvas SIR e Rt ao longo do tempo.
 * 
 * @param {Array} chartData - Array de objetos com os passos da simulação ({ step, S, I, R, Rt }).
 */
export default function ChartLineMultiple({ chartData }) {
    // Formatar dados para garantir inteiros nas curvas SIR
    const data = chartData.map(item => ({
        ...item,
        S: Math.round(item.S),
        I: Math.round(item.I),
        R: Math.round(item.R)
    }))

    return (
        <div className="w-full aspect-video min-h-[300px] flex justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-neutral-500 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-200/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-200 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-200 [&_.recharts-radial-bar-background-sector]:fill-neutral-100 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-100 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-200 [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="step"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const data = payload[0].payload;
                            return (
                                <div className="grid min-w-[12rem] items-start gap-1.5 rounded-lg border border-neutral-100 bg-white px-3 py-2 text-xs shadow-xl text-neutral-800">
                                    <div className="font-medium">Dia {data.step}</div>
                                    <div className="grid gap-1.5">
                                        {payload.map((item) => {
                                            const config = chartConfig[item.dataKey];
                                            return (
                                                <div key={item.dataKey} className="flex w-full items-center justify-between gap-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className="h-2.5 w-2.5 rounded-[2px]"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="text-neutral-500">
                                                            {config?.label || item.name}
                                                        </span>
                                                    </div>
                                                    <span className="font-mono font-medium tabular-nums text-neutral-900">
                                                        {item.value.toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-1 pt-1 border-t border-neutral-100 flex items-center justify-between gap-4">
                                        <span className="text-neutral-500">{chartConfig.Rt.label}</span>
                                        <span className="font-mono font-medium tabular-nums text-neutral-900">
                                            {data.Rt}
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <Legend
                        content={({ payload }) => {
                            if (!payload?.length) return null;
                            return (
                                <div className="flex items-center justify-center gap-4 pt-3">
                                    {payload.map((item) => {
                                        const config = chartConfig[item.dataKey];
                                        return (
                                            <div
                                                key={item.value}
                                                className="flex items-center gap-1.5 text-sm text-neutral-900"
                                            >
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                {config?.label || item.value}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }}
                    />
                    <Line
                        dataKey="I"
                        type="monotone"
                        stroke="var(--color-secondary-500)"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        dataKey="R"
                        type="monotone"
                        stroke="var(--color-primary-500)"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        dataKey="S"
                        type="monotone"
                        stroke="var(--color-neutral-100)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

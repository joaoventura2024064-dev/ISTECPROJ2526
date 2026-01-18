import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ChartSIR = ({ simulationData }) => {

    const totalDuration = 2500;
    const delayBetweenPoints = totalDuration / (simulationData ? simulationData.length : 1);

    const data = {
        labels: simulationData.map(item => `Dia ${item.step}`),
        datasets: [
            {
                label: 'Suscetíveis',
                data: simulationData.map(item => item.S),
                borderColor: '#BCBCBC',
                cubicInterpolationMode: 'monotone',
                pointRadius: 0,
                pointHitRadius: 10,
            },
            {
                label: 'Infetados',
                data: simulationData.map(item => item.I),
                borderColor: '#ECC440',
                cubicInterpolationMode: 'monotone',
                pointRadius: 0,
                pointHitRadius: 10,
            },
            {
                label: 'Recuperados',
                data: simulationData.map(item => item.R),
                borderColor: '#61B695',
                cubicInterpolationMode: 'monotone',
                pointRadius: 0,
                pointHitRadius: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        },
        plugins: {
            legend: { position: 'bottom', align: 'center', display: true, labels: { useBorderRadius: true, boxWidth: 12, boxHeight: 1, padding: 20 } },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 10,
                callbacks: {
                    afterBody: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        if (simulationData && simulationData[index]) {
                            return `Rt: ${simulationData[index].Rt}`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#f3f4f6' }, ticks: { stepSize: 200 } }
        }
    };

    return (
        <div className="w-full h-96 pt-6">
            <Line data={data} options={options} />
        </div>
    );
};

export default ChartSIR;
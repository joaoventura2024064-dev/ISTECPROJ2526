import { useNavigate } from 'react-router-dom';
import { faChartLine, faTrash, faChevronDown, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../components/common/PageHeader';

// Mock Data
const simulations = [
    { id: '1', name: 'Simulação Hospital Central', type: 'Completa', date: '14/01/2026', status: 'Concluída' },
    { id: '2', name: 'Simulação Ala Pediátrica', type: 'Rápida', date: '13/01/2026', status: 'Em progresso' },
    { id: '3', name: 'Teste de Carga', type: 'Completa', date: '10/01/2026', status: 'Concluída' },
    { id: '4', name: 'Simulação Emergência', type: 'Rápida', date: '08/01/2026', status: 'Erro' },
    { id: '5', name: 'Rotina Manutenção', type: 'Completa', date: '05/01/2026', status: 'Concluída' },
];

const StatusBadge = ({ status }) => {
    let styles = "";
    switch (status) {
        case 'Concluída':
            styles = "bg-primary-50 text-primary-700 border border-primary-100";
            break;
        case 'Em progresso':
            styles = "bg-secondary-50 text-secondary-700 border border-secondary-100";
            break;
        case 'Erro':
            styles = "bg-red-50 text-red-700 border border-red-100";
            break;
        default:
            styles = "bg-neutral-50 text-neutral-500 border border-neutral-100";
    }

    return (
        <span className={`px-3 py-1 rounded-full font-montserrat font-medium text-xs ${styles}`}>
            {status}
        </span>
    );
};

export default function Home() {
    const navigate = useNavigate();

    const handleNewSimulation = () => {
        navigate('/simulador');
    };

    const exportCSV = () => {
        // Handle filter
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <PageHeader
                title="Histórico de Simulações"
                subTitle="Histórico de Simulações"
                primaryActionButton={{
                    text: "Nova Simulação",
                    icon: faChartLine,
                    onClick: handleNewSimulation
                }}
                secondaryActionButton={{
                    text: "Exportar CSV",
                    icon: faFileArrowDown,
                    onClick: exportCSV
                }}
            />

            {/* Filters / Search Bar (Optional based on design context, kept simple for now) */}

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="min-w-full">
                    {/* Header */}
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 px-8 py-4 bg-white border-b border-base-600">
                        {['Nome', 'Data', 'População', 'Infetados Iniciais', 'Taxa Contacto', 'Taxa Recuperacao', 'Duração', 'Ações'].map((header) => (
                            <div key={header} className="flex items-center gap-2 cursor-pointer group">
                                <span className="font-montserrat font-semibold text-[11px] uppercase text-neutral-300 group-hover:text-neutral-500 transition-colors">
                                    {header}
                                </span>
                                <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                            </div>
                        ))}
                        <div className="text-right">
                            <span className="font-montserrat font-semibold text-[11px] uppercase text-neutral-300">
                                Ações
                            </span>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col">
                        {simulations.map((sim, index) => (
                            <div
                                key={sim.id}
                                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] gap-4 px-8 py-5 border-b border-base-600 hover:bg-background-200 transition-colors items-center cursor-pointer"
                                onClick={() => navigate(`/simulador/${sim.id}`)}
                            >
                                <span className="font-montserrat font-medium text-sm text-neutral-500">
                                    {sim.date}
                                </span>
                                <span className="font-montserrat font-semibold text-sm text-neutral-700">
                                    {sim.name}
                                </span>
                                <span className="font-montserrat text-sm text-neutral-400">
                                    {sim.id}
                                </span>
                                <span className="font-montserrat text-sm text-neutral-500">
                                    {sim.type}
                                </span>
                                <div>
                                    <StatusBadge status={sim.status} />
                                </div>
                                <div className="text-right">
                                    <button
                                        className="text-neutral-300 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle delete
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Pagination (Placeholder) */}
                    <div className="px-8 py-4 border-t border-base-600 flex justify-between items-center text-xs font-montserrat text-neutral-300">
                        <span>A mostrar 5 de 123 resultados</span>
                        <div className="flex gap-2">
                            {/* Pagination buttons could go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

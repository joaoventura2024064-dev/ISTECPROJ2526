import { TrashSolid } from "iconoir-react";
import { Typography } from "@material-tailwind/react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["Simulação", "População", "Infetados Iniciais", "Taxa Contacto", "Taxa Recuperação", "Duração", ""];
//const TABLE_HEAD = ["Simulação", "Pop.", "Inf. Inic.", "Tx. Cont.", "Tx. Rec.", "Duração", ""];

export default function SimulationsTable({ data = [], isLoading = false, onDelete }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div className="w-full rounded-xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] bg-white border border-base-600 select-none">
            <div>
                <table className="w-full ">
                    <thead className="border-b border-base-600 bg-background-200">
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th key={index} className="first:w-90 first:pl-8.5 last:pr-8.5 py-7 px-3">
                                    <Typography className={`flex cursor-default text-transform: uppercase !caption-strong items-center text-base-900 ${index === 0 ? "justify-start" : "justify-center"}`}>
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-black dark:text-white">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <tr key={`skeleton-${index}`} className="border-b border-base-600 last:border-0 animate-pulse">
                                    <td className="w-90 pl-8.5 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </td>
                                    {[...Array(5)].map((_, cellIndex) => (
                                        <td key={cellIndex} className="p-3">
                                            <div className="flex justify-center">
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </td>
                                    ))}
                                    <td className="pr-8.5 p-3">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full ml-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            paginatedData.map(
                                ({ id, date, description, parameters }) => {
                                    return (
                                        <tr
                                            key={id}
                                            onClick={() => navigate(`/simulador/${id}`)}
                                            className="group border-b border-base-600 hover:text-primary-500 hover:cursor-pointer text-neutral-300 last:border-0"
                                        >
                                            <td className="w-90 pl-8.5 p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <Typography className="body-header">{description || `Simulação #${id}`}</Typography>
                                                        <Typography className="!text-neutral-300 !body-main">{new Date(date).toLocaleDateString()}</Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{parameters?.population_total}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{parameters?.infected_initial}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{parameters?.beta}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{parameters?.gamma}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{parameters?.duration}</Typography>
                                                </div>
                                            </td>
                                            <td
                                                className="delbtn pr-8.5 p-3 hover:cursor-pointer group/delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(id);
                                                }}
                                            >
                                                <TrashSolid className="h-5 w-5 text-neutral-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover/delete:text-red-500 group-hover/delete:transition-colors group-hover/delete:duration-200" />
                                            </td>
                                        </tr>
                                    );
                                },
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between border-t border-base-600 py-4 px-8.5">
                {isLoading ? (
                    <div className="h-4 w-24 bg-background-500 rounded animate-pulse"></div>
                ) : (
                    <Typography className="text-neutral-400 !label-caption">A apresentar página <b>{currentPage}</b> de <b>{totalPages || 1}</b></Typography>
                )}
                <div className="flex gap-6">
                    <Button
                        text="Anterior"
                        variant="ghost"
                        onClick={handlePrevious}
                        icon={faChevronLeft}
                        disabled={currentPage === 1 || isLoading || data.length === 0}
                    >
                    </Button>
                    <Button
                        text="Seguinte"
                        variant="secondary"
                        onClick={handleNext}
                        icon={faChevronRight}
                        disabled={currentPage === totalPages || isLoading || data.length === 0}
                    >
                    </Button>
                </div>
            </div>
        </div >
    );
}

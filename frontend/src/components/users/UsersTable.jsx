import { Typography } from "@material-tailwind/react";
import { faChevronLeft, faChevronRight, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const TABLE_HEAD = ["Nome", "Função", "Estado", "Data Criação", "Último Login", "Total de Simulações", ""];

export default function UsersTable({ users = [], isLoading = false, onDelete, HandleToggleBlock, HandleToggleAdmin }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);
    const itemsPerPage = 7;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
    const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

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
                                    <Typography className={`flex cursor-default text-transform: uppercase !caption-strong items-center text-base-900 ${index === 0 || index === 1 ? "justify-start" : "justify-center"}`}>
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
                                            <div className="flex flex-col w-full">
                                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    </td>
                                    {[...Array(4)].map((_, cellIndex) => (
                                        <td key={cellIndex} className="p-3">
                                            <div className="flex justify-center">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            </div>
                                        </td>
                                    ))}
                                    <td className="pr-8.5 p-3">
                                        <div className="flex justify-end">
                                            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            paginatedUsers.map(
                                ({ id, role, name, cargo, status, created_at, last_login, total_simulations }) => {
                                    return (
                                        <tr
                                            key={id}
                                            onClick={() => navigate(`/utilizador/${id}`)}
                                            className="group border-b border-base-600 hover:text-primary-500 hover:cursor-pointer text-neutral-300 last:border-0"
                                        >
                                            <td className="w-90 pl-8.5 p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Typography className="body-header">{name}</Typography>
                                                        {role === 'admin' && (
                                                            <Badge size="small" variant="secondary" text="Admin" />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-start">
                                                    <Typography className="!text-neutral-300">{cargo}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center">
                                                    <Badge size="medium"
                                                        variant={status === 'active' ? 'success' : 'default'} text={status === 'active' ? 'Ativo' : 'Inativo'}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{new Date(created_at).toLocaleDateString()}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{last_login ? new Date(last_login).toLocaleDateString() : 'Nunca'}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-center">
                                                    <Typography className="!text-neutral-300">{total_simulations}</Typography>
                                                </div>
                                            </td>
                                            <td
                                                className="relative pr-8.5 p-3 hover:cursor-pointer group/delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setDropdownPosition({
                                                        top: rect.bottom + window.scrollY,
                                                        left: rect.right + window.scrollX - 200
                                                    });
                                                    setOpenDropdownId(openDropdownId === id ? null : id);
                                                }}
                                            >
                                                <div className="flex justify-end relative">
                                                    <FontAwesomeIcon icon={faEllipsisVertical} className="h-5 w-5 text-neutral-100 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover/delete:text-primary-500 group-hover/delete:transition-colors group-hover/delete:duration-200" />

                                                    {openDropdownId === id && createPortal(
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute w-48 bg-white rounded-xl shadow-xl border border-base-600 z-50 overflow-hidden"
                                                            style={{
                                                                top: `${dropdownPosition.top}px`,
                                                                left: `${dropdownPosition.left}px`
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="flex flex-col py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        console.log(`De: ${status}`);
                                                                        console.log(`Para: ${status === 'active' ? 'suspended' : 'active'}`);
                                                                        HandleToggleBlock(id, status === 'active' ? 'suspended' : 'active');
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                    className="text-left px-4 py-2 text-sm text-neutral-700 hover:text-primary-500 transition-colors bg-white font-montserrat font-medium"
                                                                >
                                                                    {status === 'active' ? 'Bloquear' : 'Desbloquear'}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        HandleToggleAdmin(id, role === 'admin' ? 'registered' : 'admin');
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                    className="text-left px-4 py-2 text-sm text-neutral-700 hover:text-primary-500 transition-colors bg-white font-montserrat font-medium"
                                                                >
                                                                    {role === 'admin' ? 'Remover Admin' : 'Promover a Admin'}
                                                                </button>
                                                            </div>
                                                        </div>,
                                                        document.body
                                                    )}
                                                </div>
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
                        iconPosition="right"
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

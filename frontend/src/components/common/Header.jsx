import { memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/medcei_nav_logo.webp';

function Header() {
    const { user, logout } = useAuth();
    const userName = user?.name || 'Utilizador';
    const userRole = user?.cargo || 'Sem Cargo';
    const userInitial = userName.charAt(0).toUpperCase();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="select-none bg-white shadow-[0px_3px_5px_-5px_rgba(0,0,0,0.1),0px_7px_20px_-5px_rgba(0,0,0,0.1)] h-[60px] flex items-center px-10 justify-between sticky top-0 z-50">
            <Link to="/" className="h-10 flex items-center">
                <img src={logo} alt="Medcei Logo" className="h-full object-contain" fetchPriority="high" />
            </Link>

            <div className="flex items-center h-full gap-8">
                <nav className="flex h-full gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center h-full border-b-2 font-montserrat font-semibold text-[14px] transition-colors 
                        ${isActive
                                ? 'border-primary-500 text-primary-500 cursor-default'
                                : 'border-transparent text-neutral-300 hover:text-neutral-500'
                            }`
                        }
                    >
                        Histórico
                    </NavLink>
                    <NavLink
                        to="/simulador"
                        end
                        className={({ isActive }) =>
                            `flex items-center h-full border-b-2 font-montserrat font-semibold text-[14px] transition-colors ${isActive
                                ? 'border-primary-500 text-primary-500 cursor-default'
                                : 'border-transparent text-neutral-300 hover:text-neutral-500'
                            }`
                        }
                    >
                        Simulador
                    </NavLink>
                </nav>

                <div className="h-8 w-px bg-base-600"></div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none p-2 rounded-lg transition-colors cursor-pointer group"
                    >
                        <div className="text-right flex flex-col justify-center">
                            <span className="font-montserrat font-semibold text-[12px] text-neutral-500 leading-tight group-hover:text-primary-500 transition-colors">
                                {userName}
                            </span>
                            <span className="font-montserrat font-medium text-[10px] text-neutral-300 leading-tight">
                                {userRole}
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 font-montserrat font-semibold text-[14px]">
                            {userInitial}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-base-600 overflow-hidden py-1 z-50">
                            <Link
                                to={`/utilizador/${user.id}`}
                                className="block px-4 py-3 text-sm font-montserrat font-medium text-neutral-500 hover:text-primary-700 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Meu perfil
                            </Link>
                            {user?.role === 'admin' && (
                                <Link
                                    to="/utilizadores"
                                    className="block px-4 py-3 text-sm font-montserrat font-medium text-neutral-500 hover:text-primary-700 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Gestão de utilizadores
                                </Link>
                            )}
                            <div className="h-px bg-base-600 my-1"></div>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsDropdownOpen(false);
                                }}
                                className="block px-4 py-3 text-sm font-montserrat font-medium text-neutral-500 hover:text-primary-700 transition-colors"
                            >
                                Terminar sessão
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default memo(Header);

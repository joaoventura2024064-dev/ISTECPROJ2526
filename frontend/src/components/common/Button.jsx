import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Button({ text, onClick, variant = 'primary', width = 'hug', height = 'hug', icon = null, disabled = false, spin = false, className = '' }) {

    const base = "flex items-center justify-center gap-2 font-montserrat font-medium text-sm py-2 rounded-lg transition-all duration-200 select-none";

    const variants = {
        primary: "  px-4 bg-primary-500 border border-primary-600 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-300/20",
        secondary: "px-4 bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 hover:shadow-lg hover:shadow-primary-300/20",
        ghost: "px-0 bg-transparent text-neutral-300 hover:text-neutral-500",
    };


    const widthStyles = {
        hug: "w-fit",
        fill: "w-full"
    };

    const heightStyles = {
        hug: "h-fit",
        fill: "h-full"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${widthStyles[width]} ${heightStyles[height]} ${className} ${disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`}        >
            {icon && <FontAwesomeIcon icon={icon} spin={spin} />}
            {text}
        </button>
    );
}

export default memo(Button);

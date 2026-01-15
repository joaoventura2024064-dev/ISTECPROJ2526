import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Button({ text, onClick, variant = 'primary', width = 'hug', icon = null, className = '' }) {

    const baseStyles = "flex items-center justify-center gap-2 font-montserrat font-medium text-sm py-2 rounded-lg transition-all duration-200";

    const variants = {
        primary: "  px-4 bg-primary-500 border border-primary-600 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-300/20",
        secondary: "px-4 bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 hover:shadow-lg hover:shadow-primary-300/20",
        ghost: "px-0 bg-transparent text-neutral-300 hover:text-neutral-500"
    };

    const widthStyles = {
        hug: "w-fit",
        fill: "w-full"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${widthStyles[width]} ${className}`}        >
            {icon && <FontAwesomeIcon icon={icon} />}
            {text}
        </button>
    );
}

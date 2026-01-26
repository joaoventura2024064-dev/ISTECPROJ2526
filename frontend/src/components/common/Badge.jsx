import { memo } from 'react';

/**
 * Componente Badge (Etiqueta).
 * Usado para exibir estados ou categorias curtas.
 * 
 * @param {string} text - Texto do badge.
 * @param {string} variant - Estilo ('default', 'secondary', 'destructive', 'success', 'outline').
 * @param {string} size - Tamanho ('medium', 'small').
 * @param {boolean} border - Se tem borda extra.
 */
function Badge({ text, variant = 'default', size = 'medium', border = false, className = '', }) {

    const base = `inline-flex items-center rounded-full ui-badge inset-ring  ${size === 'medium' ? "px-2 py-1" : "px-1.5 py-0.5"} ${border ? "border border-base-600" : ""} pointer-events-none`;

    // Estilos de cor para cada variante
    const variants = {
        default: "bg-base-500 !text-base-800 inset-ring-base-700",
        secondary: "bg-secondary-50 !text-secondary-500 inset-ring-secondary-200",
        destructive: "bg-destructive-100 !text-destructive-500 inset-ring-destructive-200",
        success: "bg-base-500 !text-primary-500 inset-ring-primary-200",
        outline: "text-neutral-300",
    };

    return (
        <div
            className={`${base} ${variants[variant]} ${className}`}>
            {text}
        </div>
    )
}

export default memo(Badge);

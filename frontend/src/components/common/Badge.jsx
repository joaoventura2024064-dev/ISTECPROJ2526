import { memo } from 'react';

function Badge({ text, variant = 'default', size = 'medium', border = false, className = '', }) {

    const base = `inline-flex items-center rounded-full text-xs font-medium inset-ring  ${size === 'medium' ? "px-2 py-1" : "px-1.5 py-0.5"} ${border ? "border border-base-600" : ""} pointer-events-none`;

    const colors = {
        default: "base-800",
        secondary: "secondary-500",
        destructive: "red-500",
        success: "primary-500",
        outline: "neutral-950"
    }

    const variants = {
        default: `bg-${colors.default}/10 text-${colors.default} inset-ring-${colors.default}/20`,
        secondary: `bg-${colors.secondary}/10 text-${colors.secondary} inset-ring-${colors.secondary}/20`,
        destructive: `bg-${colors.destructive}/10 text-${colors.destructive} inset-ring-${colors.destructive}/20`,
        success: `bg-${colors.success}/10 text-${colors.success} inset-ring-${colors.success}/20`,
        outline: `text-${colors.outline}`,
    };

    return (
        <div
            className={`${base} ${variants[variant]} ${className}`}>
            {text}
        </div>
    )
}

export default memo(Badge);

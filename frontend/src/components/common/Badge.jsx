import { memo } from 'react';

function Badge({ text, variant = 'default', size = 'medium', border = false, className = '', }) {

    const base = `inline-flex items-center rounded-full text-xs font-medium inset-ring  ${size === 'medium' ? "px-2 py-1" : "px-1.5 py-0.5"} ${border ? "border border-base-600" : ""} pointer-events-none`;

    const variants = {
        default: "bg-base-800/10 !text-base-800 inset-ring-base-800/20",
        secondary: "bg-secondary-500/10 !text-secondary-500 inset-ring-secondary-500/20",
        destructive: "bg-red-500/10 !text-red-500 inset-ring-red-500/20",
        success: "bg-primary-500/10 !text-primary-500 inset-ring-primary-500/20",
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

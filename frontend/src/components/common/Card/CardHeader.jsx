import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CardHeader({ title, icon, actions }) {

    return (
        <div className="flex items-center justify-between gap-2 text-neutral-900 bg-background-200 px-7.5 py-5 border-b border-base-600">
            <div className="flex items-center gap-2 py-1.2 select-none">
                <FontAwesomeIcon icon={icon} className="text-primary-500" />
                <h2 className="font-montserrat font-semibold text-base">{title}</h2>
            </div>
            <div className="flex items-center gap-2 -my-2">
                {actions && (
                    <div className="flex items-center gap-2 ">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(CardHeader);

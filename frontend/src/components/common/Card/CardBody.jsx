import { memo } from 'react';

function CardBody({ children }) {

    return (
        <div className="bg-base-50 px-7.5 py-5" >
            {children}
        </div>
    );
}

export default memo(CardBody);

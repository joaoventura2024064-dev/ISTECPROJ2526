import { memo } from 'react';

// Corpo do Cartão (Conteúdo principal)
function CardBody({ children }) {

    return (
        <div className="bg-base-50 px-7.5 py-5" >
            {children}
        </div>
    );
}

export default memo(CardBody);

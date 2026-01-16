import { memo } from 'react';
import CardHeader from './CardHeader';
import CardBody from './CardBody';

function Card({ title, icon, children, className = '' }) {
    return (
        <div className={`flex flex-col rounded-xl overflow-hidden shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] bg-white border border-base-600 ${className}`}>
            <CardHeader title={title} icon={icon} />
            <CardBody children={children} />
        </div>
    );
}

export default memo(Card);

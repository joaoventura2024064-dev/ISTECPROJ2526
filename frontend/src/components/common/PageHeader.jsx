import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

export default function PageHeader({ title, subTitle, backButton = false, primaryActionButton = null, secondaryActionButton = null, align = 'left' }) {
    const navigate = useNavigate();

    return (
        <div className="w-full h-24 flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
                {backButton && (
                    <Button
                        text="Voltar"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        icon={faArrowLeft}
                    >
                    </Button>
                )}
                <div className={`flex flex-col ${align === 'right' ? 'items-end flex-1' : 'items-start'}`}>
                    {title && (
                        <h1 className="font-roboto font-bold text-2xl text-neutral-500">
                            {title}
                        </h1>
                    )}
                    {subTitle && (
                        <h2 className="font-montserrat font-medium text-sm text-neutral-400">
                            {subTitle}
                        </h2>
                    )}
                </div>
            </div>
            <div className="flex items-right justify-end gap-4">
                {secondaryActionButton && (
                    <Button
                        text={secondaryActionButton.text}
                        variant="secondary"
                        onClick={secondaryActionButton.onClick}
                        icon={secondaryActionButton.icon}
                    >
                        {secondaryActionButton.text}
                    </Button>
                )}
                {primaryActionButton && (
                    <Button
                        text={primaryActionButton.text}
                        variant="primary"
                        onClick={primaryActionButton.onClick}
                        icon={primaryActionButton.icon}
                    >
                        {primaryActionButton.text}
                    </Button>
                )}
            </div>
        </div>
    );
}

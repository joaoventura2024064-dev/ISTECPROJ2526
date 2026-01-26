import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

import { memo } from 'react';

/**
 * Cabeçalho de página padrão.
 * Inclui título, subtítulo, botão de voltar opcional e botões de ação (primário/secundário).
 * 
 * @param {string} title - Título H1.
 * @param {string} subTitle - Subtítulo H2.
 * @param {boolean} backButton - Se mostra seta para voltar atrás.
 * @param {object|null} primaryActionButton - Configuração do botão principal ({ text, onClick, icon }).
 * @param {object|null} secondaryActionButton - Configuração do botão secundário.
 * @param {string} align - Alinhamento do texto ('left', 'right').
 */
function PageHeader({ title, subTitle, backButton = false, primaryActionButton = null, secondaryActionButton = null, align = 'left' }) {
    const navigate = useNavigate();

    return (
        <div className="w-full h-24 flex items-center justify-between select-none">
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
                        <h1 className="headings-h1 text-neutral-900">
                            {title}
                        </h1>
                    )}
                    {subTitle && (
                        <h2 className="body-main text-neutral-300">
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

export default memo(PageHeader);

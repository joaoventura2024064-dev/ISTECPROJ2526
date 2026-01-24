import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Modal({ isOpen, onClose, title, subTitle = "teste", showExitButton = true, children }) {

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-neutral-400/50 select-none">
            <div className="flex flex-col bg-background-50 rounded-xl w-full max-w-[704px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="flex items-center h-full justify-between p-7.5 border-b border-background-600">
                    <div className="flex flex-col items-start gap-1">
                        <h3 className="body-header text-neutral-900">{title}</h3>
                        <h3 className="caption-main text-neutral-300">{subTitle}</h3>
                    </div>
                    {showExitButton && <button
                        onClick={onClose}
                        className="text-neutral-200 hover:text-primary-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faXmark} className='w-4 h-4' />
                    </button>}
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

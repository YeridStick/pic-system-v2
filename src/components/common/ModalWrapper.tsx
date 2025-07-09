import React from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

interface ModalWrapperProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  modalType: 'edit' | 'view' | 'import' | 'api_integration' | null;
  maxWidthClass?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  description,
  icon,
  children,
  modalType,
  maxWidthClass = 'max-w-2xl',
}) => {
  const { modal, closeModal } = useUIStore();

  if (!modal.isOpen || modal.type !== modalType) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center p-6 animate-fade-in overflow-y-auto h-screen"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidthClass} max-h-[90%] flex flex-col animate-scale-up-modal transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                {description && <p className="text-blue-100 mt-1">{description}</p>}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
              title="Cerrar modal (Esc)"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-6 min-h-0">
          {children}
        </div>

        {/* Footer will be added by the specific modal component */}
      </div>
    </div>
  );
}; 
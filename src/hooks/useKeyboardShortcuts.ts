import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';
import type { TabType } from '../types';

const TAB_SHORTCUTS: Record<string, TabType> = {
  '1': 'productos',
  '2': 'formulas',
  '3': 'ajustes',
  '4': 'personalizacion',
  '5': 'backup',
};

export const useKeyboardShortcuts = () => {
  const { setActiveTab, closeModal } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + número para cambiar tabs
      if (event.altKey && TAB_SHORTCUTS[event.key]) {
        event.preventDefault();
        setActiveTab(TAB_SHORTCUTS[event.key]);
      }

      // Escape para cerrar modales
      if (event.key === 'Escape') {
        closeModal();
      }

      // Ctrl/Cmd + K para búsqueda rápida (futuro)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // TODO: Implementar búsqueda rápida
        console.log('Búsqueda rápida (TODO)');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, closeModal]);
};
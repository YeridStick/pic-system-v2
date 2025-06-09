import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TabType, ModalState, Product } from '../types';

interface UIState {
  // Estado de navegación
  activeTab: TabType;
  
  // Estado de modales
  modal: ModalState;
  
  // Estado de loading
  isLoading: boolean;
  
  // Estado de sidebar (para futuras funcionalidades)
  sidebarOpen: boolean;
  // Nuevo estado para el menú móvil
  isMobileMenuOpen: boolean;
  
  // Acciones de navegación
  setActiveTab: (tab: TabType) => void;
  
  // Acciones de modales
  openModal: (type: ModalState['type'], data?: Product) => void;
  closeModal: () => void;
  
  // Acciones de loading
  setLoading: (loading: boolean) => void;
  
  // Acciones de sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  // Nuevas acciones para el menú móvil
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Estado inicial
      activeTab: 'productos',
      modal: {
        isOpen: false,
        type: null,
        data: undefined,
      },
      isLoading: false,
      sidebarOpen: false,
      isMobileMenuOpen: false, // Inicializar nuevo estado

      // Acciones de navegación
      setActiveTab: (tab: TabType) => {
        set({ activeTab: tab });
      },

      // Acciones de modales
      openModal: (type: ModalState['type'], data?: Product) => {
        set({
          modal: {
            isOpen: true,
            type,
            data,
          },
        });
      },

      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: null,
            data: undefined,
          },
        });
      },

      // Acciones de loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Acciones de sidebar
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
      // Nuevas acciones para el menú móvil
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: 'pic-ui-store',
      // Solo persistir la pestaña activa y el estado de la barra lateral, no los modales ni loading states
      partialize: (state) => ({
        activeTab: state.activeTab,
        sidebarOpen: state.sidebarOpen,
        isMobileMenuOpen: state.isMobileMenuOpen, // Persistir también el estado del menú móvil
      }),
    }
  )
);
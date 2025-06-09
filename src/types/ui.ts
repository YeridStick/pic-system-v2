import type { Product } from './product';

export type TabType = 
  | 'productos' 
  | 'formulas' 
  | 'ajustes' 
  | 'personalizacion' 
  | 'backup';

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'edit' | 'delete' | 'confirm' | 'view' | 'import' | null;
  data?: Product;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Para breadcrumbs futuras
export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

// Para configuración de tema futuro
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
}
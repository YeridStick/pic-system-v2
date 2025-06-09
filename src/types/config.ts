import type { ExcelConfig } from './excel';

export interface SystemConfig {
  autoSave: boolean;
  confirmDeletes: boolean;
  showTooltips: boolean;
  compactMode: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
}

export interface ExcelTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<ExcelConfig>;
  createdAt: string;
  isDefault: boolean;
}

export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'pdf';
  includeImages: boolean;
  compression: boolean;
  password?: string;
}

export interface PrintConfig {
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'Legal';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  scale: number;
  fitToPage: boolean;
} 
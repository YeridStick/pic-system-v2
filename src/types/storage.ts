import type { Product } from './product';
import type { ExcelConfig } from './excel';

export interface StorageData {
  productos: Product[];
  productosOriginales: Product[];
  contadorItems: number;
  configuracion: {
    ultimaActualizacion: string;
    version: string;
  };
  configExcel: ExcelConfig;
}

export interface BackupData extends StorageData {
  fechaRespaldo: string;
  version: string;
}

export type AuditEventType =
  | 'config_update'
  | 'budget_update'
  | 'product_add'
  | 'product_update'
  | 'product_delete'
  | 'products_bulk_replace'
  | 'products_bulk_delete';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: string;
  description: string;
  dataBefore?: unknown;
  dataAfter?: unknown;
}

export interface AuditConfig {
  enabled: boolean;
  maxEvents: number;
  minEvents: number;
} 
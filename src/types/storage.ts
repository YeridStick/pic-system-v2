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
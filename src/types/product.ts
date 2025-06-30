export type ProductCategory = string;

export interface TaxConfig {
  enabled: boolean;
  type: 'iva' | 'consumo' | 'retencion' | 'industria' | 'transaccion';
  rate: number;
  description: string;
}

export interface AdditionalCost {
  enabled: boolean;
  type: 'registro' | 'codigo' | 'certificacion' | 'transporte' | 'distribucion';
  value: number;
  description: string;
}

export interface Product {
  id: string;
  item: number;
  producto: string;
  presentacion: string;
  cantidad: number;
  valorCosto: number;
  margen: number;
  valorTotal: number;
  categoria: ProductCategory;
  impuestos?: TaxConfig[];
  costosAdicionales?: AdditionalCost[];
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProductFormData {
  producto: string;
  cantidad: number;
  presentacion: string;
  categoria: ProductCategory;
  valorCosto: number;
  margen: number;
  impuestos?: TaxConfig[];
  costosAdicionales?: AdditionalCost[];
} 
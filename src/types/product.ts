export interface Product {
  id: string;
  item: number;
  producto: string;
  cantidad: number;
  presentacion: string;
  categoria: ProductCategory;
  valorCosto: number;
  margen: number;
  valorTotal: number;
}

export type ProductCategory = 
  | 'papeleria' 
  | 'alimentos' 
  | 'semillas' 
  | 'aseo' 
  | 'otros';

export interface ProductFormData {
  producto: string;
  cantidad: number;
  presentacion: string;
  categoria: ProductCategory;
  valorCosto: number;
  margen: number;
} 
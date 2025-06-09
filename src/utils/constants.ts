import type { ProductCategory } from '../types';

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'papeleria', label: 'Papelería' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'semillas', label: 'Semillas' },
  { value: 'aseo', label: 'Aseo y Limpieza' },
  { value: 'otros', label: 'Otros' },
];

export const STORAGE_KEYS = {
  productos: 'pic_productos',
  originales: 'pic_productos_originales',
  contador: 'pic_contador_items',
  configuracion: 'pic_configuracion',
  configExcel: 'pic_config_excel',
} as const;

export const BORDER_STYLES = [
  { value: 'thin', label: 'Delgado' },
  { value: 'medium', label: 'Mediano' },
  { value: 'thick', label: 'Grueso' },
] as const;

export const DEFAULT_MARGINS_BY_CATEGORY: Record<ProductCategory, number> = {
  papeleria: 20,
  alimentos: 15,
  semillas: 25,
  aseo: 18,
  otros: 20,
};
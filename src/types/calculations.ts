import type { ProductCategory } from './product';

export interface FormulaResult {
  valorTotal: number;
  margen: number;
  factor?: number;
}

export interface CalculationInput {
  valorCosto: number;
  margen?: number;
  presupuestoObjetivo?: number;
  presupuestoActual?: number;
}

export interface BudgetSummary {
  totalItems: number;
  presupuestoActual: number;
  costoTotal: number;
  margenPromedio: number;
}

export interface CategoryStats {
  cantidad: number;
  costoTotal: number;
  presupuestoTotal: number;
  margenPromedio: number;
  porcentajeDelTotal: number;
}

export interface BudgetStatistics extends BudgetSummary {
  distribucionCategorias: Record<ProductCategory, CategoryStats>;
  productoMasCaro: { nombre: string; valor: number };
  productoMasBarato: { nombre: string; valor: number };
  rangoPrecios: { 
    minimo: number; 
    maximo: number; 
    promedio: number; 
    mediana: number; 
  };
  analisisMargen: { 
    margenMinimo: number; 
    margenMaximo: number; 
    desviacionEstandar: number; 
  };
}

export type AdjustmentMethodType = 'proporcional' | 'margen_fijo' | 'por_categoria';

export interface AdjustmentMethod {
  type: 'proporcional' | 'margen_fijo' | 'por_categoria';
  presupuestoObjetivo?: number;
  margenFijo?: number;
  margenesPorCategoria?: Record<ProductCategory, number>;
}

export interface CalculationInput {
  valorCosto: number;
  margen?: number;
  presupuestoObjetivo?: number;
  presupuestoActual?: number;
}

export interface PriceRange {
  minimo: number;
  maximo: number;
  promedio: number;
  mediana: number;
}

export interface MarginAnalysis {
  margenMinimo: number;
  margenMaximo: number;
  desviacionEstandar: number;
}

export interface AdjustmentResult {
  productosAjustados: number;
  presupuestoAnterior: number;
  presupuestoNuevo: number;
  factorAjuste?: number;
  margenAnterior: number;
  margenNuevo: number;
}

export interface CalculationConfig {
  redondeoDecimales: number;
  incluirIVA: boolean;
  porcentajeIVA: number;
  monedaBase: 'COP' | 'USD' | 'EUR';
}

export interface BudgetStatistics extends BudgetSummary {
  distribucionCategorias: Record<ProductCategory, {
    cantidad: number;
    costoTotal: number;
    presupuestoTotal: number;
    margenPromedio: number;
    porcentajeDelTotal: number;
  }>;
  
  productoMasCaro: {
    nombre: string;
    valor: number;
  };
  productoMasBarato: {
    nombre: string;
    valor: number;
  };
  
  rangoPrecios: {
    minimo: number;
    maximo: number;
    promedio: number;
    mediana: number;
  };
  
  analisisMargen: {
    margenMinimo: number;
    margenMaximo: number;
    desviacionEstandar: number;
  };
} 
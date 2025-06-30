import type { Product, CalculationInput, BudgetSummary, BudgetStatistics, ProductCategory, TaxConfig, AdditionalCost } from '../types';

/**
 * Calcula el valor total aplicando el margen sobre el costo, impuestos y costos adicionales.
 * Fórmula: Valor Total = (Valor Costo × (1 + Margen/100)) × (1 + (IVA + Imp. Consumo + Otros Imp.) / 100) + Costos Adicionales
 */
export const calculateTotalValue = (
  valorCosto: number,
  margen: number,
  impuestos: TaxConfig[] = [],
  costosAdicionales: AdditionalCost[] = []
): number => {
  if (valorCosto <= 0) return 0;

  const valorConMargen = valorCosto * (1 + margen / 100);

  const ivaRate = impuestos.find(t => t.type === 'iva' && t.enabled)?.rate || 0;
  const impConsumoRate = impuestos.find(t => t.type === 'consumo' && t.enabled)?.rate || 0;
  const otrosImpuestosRate = impuestos
    .filter(t => t.type !== 'iva' && t.type !== 'consumo' && t.enabled)
    .reduce((sum, t) => sum + t.rate, 0);

  const totalImpuestosRate = ivaRate + impConsumoRate + otrosImpuestosRate;
  const valorConImpuestos = valorConMargen * (1 + totalImpuestosRate / 100);

  const totalCostosAdicionales = costosAdicionales
    .filter(c => c.enabled)
    .reduce((sum, c) => sum + c.value, 0);

  return valorConImpuestos + totalCostosAdicionales;
};

/**
 * Calcula el margen de ganancia en porcentaje
 * Fórmula: Margen % = ((Valor Total - Valor Costo) / Valor Costo) × 100
 */
export const calculateMargin = (valorTotal: number, valorCosto: number): number => {
  if (valorCosto <= 0) return 0;
  return ((valorTotal - valorCosto) / valorCosto) * 100;
};

/**
 * Calcula el factor de ajuste proporcional
 * Fórmula: Factor = Presupuesto Objetivo / Presupuesto Actual
 */
export const calculateProportionalFactor = (
  presupuestoObjetivo: number,
  presupuestoActual: number
): number => {
  if (presupuestoActual <= 0) return 0;
  return presupuestoObjetivo / presupuestoActual;
};

/**
 * Calcula el total del presupuesto sumando todos los productos
 */
export const calculateBudgetTotal = (productos: Product[]): number => {
  return productos.reduce((sum, p) => sum + p.valorTotal * p.cantidad, 0);
};

/**
 * Calcula el total de costos sumando todos los productos
 */
export const calculateCostTotal = (productos: Product[]): number => {
  return productos.reduce((sum, p) => sum + p.valorCosto * p.cantidad, 0);
};

/**
 * Calcula el margen promedio ponderado
 */
export const calculateAverageMargin = (productos: Product[]): number => {
  const totalBudget = calculateBudgetTotal(productos);
  const totalCost = calculateCostTotal(productos);
  
  return totalCost > 0 ? ((totalBudget - totalCost) / totalCost) * 100 : 0;
};

/**
 * Calcula el subtotal para un producto específico
 */
export const calculateSubtotal = (valorTotal: number, cantidad: number): number => {
  return valorTotal * cantidad;
};

/**
 * Valida los datos de entrada para cálculos
 */
export const validateCalculationInput = (input: CalculationInput): string[] => {
  const errors: string[] = [];
  
  if (input.valorCosto <= 0) {
    errors.push('El valor de costo debe ser mayor a 0');
  }
  
  if (input.margen !== undefined && input.margen < 0) {
    errors.push('El margen no puede ser negativo');
  }
  
  if (input.presupuestoObjetivo !== undefined && input.presupuestoObjetivo <= 0) {
    errors.push('El presupuesto objetivo debe ser mayor a 0');
  }
  
  if (input.presupuestoActual !== undefined && input.presupuestoActual <= 0) {
    errors.push('El presupuesto actual debe ser mayor a 0');
  }
  
  return errors;
};

/**
 * Aplica ajuste proporcional a un producto
 */
export const applyProportionalAdjustment = (
  producto: Product,
  factor: number
): Product => {
  const nuevoValorTotal = producto.valorTotal * factor;
  const nuevoMargen = calculateMargin(nuevoValorTotal, producto.valorCosto);
  
  return {
    ...producto,
    valorTotal: nuevoValorTotal,
    margen: nuevoMargen,
  };
};

/**
 * Aplica margen fijo a un producto
 */
export const applyFixedMargin = (
  producto: Product,
  margenFijo: number
): Product => {
  const nuevoValorTotal = calculateTotalValue(producto.valorCosto, margenFijo);
  
  return {
    ...producto,
    margen: margenFijo,
    valorTotal: nuevoValorTotal,
  };
};

/**
 * Calcula estadísticas avanzadas del presupuesto
 */
export const calculateBudgetStatistics = (productos: Product[]): BudgetStatistics => {
  if (productos.length === 0) {
    return {
      totalItems: 0,
      presupuestoActual: 0,
      costoTotal: 0,
      margenPromedio: 0,
      distribucionCategorias: {} as Record<ProductCategory, {
        cantidad: number;
        costoTotal: number;
        presupuestoTotal: number;
        margenPromedio: number;
        porcentajeDelTotal: number;
      }>,
      productoMasCaro: { nombre: '', valor: 0 },
      productoMasBarato: { nombre: '', valor: 0 },
      rangoPrecios: { minimo: 0, maximo: 0, promedio: 0, mediana: 0 },
      analisisMargen: { margenMinimo: 0, margenMaximo: 0, desviacionEstandar: 0 },
    };
  }

  // Cálculos básicos
  const totalItems = productos.length;
  const presupuestoActual = calculateBudgetTotal(productos);
  const costoTotal = calculateCostTotal(productos);
  const margenPromedio = calculateAverageMargin(productos);

  // Distribución por categorías
  const distribucionCategorias: Record<string, {
    cantidad: number;
    costoTotal: number;
    presupuestoTotal: number;
    margenPromedio: number;
    porcentajeDelTotal: number;
  }> = {
    papeleria: { cantidad: 0, costoTotal: 0, presupuestoTotal: 0, margenPromedio: 0, porcentajeDelTotal: 0 },
    alimentos: { cantidad: 0, costoTotal: 0, presupuestoTotal: 0, margenPromedio: 0, porcentajeDelTotal: 0 },
    semillas: { cantidad: 0, costoTotal: 0, presupuestoTotal: 0, margenPromedio: 0, porcentajeDelTotal: 0 },
    aseo: { cantidad: 0, costoTotal: 0, presupuestoTotal: 0, margenPromedio: 0, porcentajeDelTotal: 0 },
    otros: { cantidad: 0, costoTotal: 0, presupuestoTotal: 0, margenPromedio: 0, porcentajeDelTotal: 0 },
  };

  productos.forEach(producto => {
    const categoria = producto.categoria;
    const subtotalCosto = producto.valorCosto * producto.cantidad;
    const subtotalPresupuesto = producto.valorTotal * producto.cantidad;

    if (!distribucionCategorias[categoria]) {
      distribucionCategorias[categoria] = {
        cantidad: 0,
        costoTotal: 0,
        presupuestoTotal: 0,
        margenPromedio: 0,
        porcentajeDelTotal: 0,
      };
    }
    distribucionCategorias[categoria].cantidad += 1;
    distribucionCategorias[categoria].costoTotal += subtotalCosto;
    distribucionCategorias[categoria].presupuestoTotal += subtotalPresupuesto;
  });

  // Calcular márgenes promedio y porcentajes por categoría
  Object.keys(distribucionCategorias).forEach(key => {
    const categoria = key as ProductCategory;
    const categoryData = distribucionCategorias[categoria];
    
    if (categoryData.costoTotal > 0) {
      categoryData.margenPromedio = 
        ((categoryData.presupuestoTotal - categoryData.costoTotal) / categoryData.costoTotal) * 100;
    }
    
    if (presupuestoActual > 0) {
      categoryData.porcentajeDelTotal = (categoryData.presupuestoTotal / presupuestoActual) * 100;
    }
  });

  // Producto más caro y más barato
  const precios = productos.map(p => p.valorTotal);
  const precioMaximo = Math.max(...precios);
  const precioMinimo = Math.min(...precios);
  
  const productoMasCaro = productos.find(p => p.valorTotal === precioMaximo) || productos[0];
  const productoMasBarato = productos.find(p => p.valorTotal === precioMinimo) || productos[0];

  // Rango de precios
  const promedio = precios.reduce((sum, precio) => sum + precio, 0) / precios.length;
  const preciosOrdenados = [...precios].sort((a, b) => a - b);
  const mediana = preciosOrdenados.length % 2 === 0
    ? (preciosOrdenados[preciosOrdenados.length / 2 - 1] + preciosOrdenados[preciosOrdenados.length / 2]) / 2
    : preciosOrdenados[Math.floor(preciosOrdenados.length / 2)];

  // Análisis de márgenes
  const margenes = productos.map(p => p.margen);
  const margenMinimo = Math.min(...margenes);
  const margenMaximo = Math.max(...margenes);
  
  // Desviación estándar de márgenes
  const margenPromedioReal = margenes.reduce((sum, margen) => sum + margen, 0) / margenes.length;
  const varianza = margenes.reduce((sum, margen) => sum + Math.pow(margen - margenPromedioReal, 2), 0) / margenes.length;
  const desviacionEstandar = Math.sqrt(varianza);

  return {
    totalItems,
    presupuestoActual,
    costoTotal,
    margenPromedio,
    distribucionCategorias,
    productoMasCaro: {
      nombre: productoMasCaro.producto,
      valor: productoMasCaro.valorTotal,
    },
    productoMasBarato: {
      nombre: productoMasBarato.producto,
      valor: productoMasBarato.valorTotal,
    },
    rangoPrecios: {
      minimo: precioMinimo,
      maximo: precioMaximo,
      promedio,
      mediana,
    },
    analisisMargen: {
      margenMinimo,
      margenMaximo,
      desviacionEstandar,
    },
  };
};

/**
 * Calcula el resumen básico del presupuesto
 */
export const calculateBasicBudgetSummary = (productos: Product[]): BudgetSummary => {
  return {
    totalItems: productos.length,
    presupuestoActual: calculateBudgetTotal(productos),
    costoTotal: calculateCostTotal(productos),
    margenPromedio: calculateAverageMargin(productos),
  };
};

/**
 * Redondea un número a la cantidad especificada de decimales
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calcula el IVA si está habilitado
 */
export const calculateWithIVA = (value: number, ivaRate: number = 19): number => {
  return value * (1 + ivaRate / 100);
};

/**
 * Convierte valores entre monedas (placeholder para futuras implementaciones)
 */
export const convertCurrency = (
  amount: number,
  exchangeRate: number = 1
): number => {
  // Placeholder implementation
  return amount * exchangeRate;
};

/**
 * Calcula el ROI (Return on Investment)
 */
export const calculateROI = (ganancia: number, inversion: number): number => {
  if (inversion <= 0) return 0;
  return (ganancia / inversion) * 100;
};

/**
 * Calcula el punto de equilibrio
 */
export const calculateBreakEven = (
  costosFijos: number,
  precioVenta: number,
  costoVariable: number
): number => {
  const margenContribucion = precioVenta - costoVariable;
  if (margenContribucion <= 0) return 0;
  return costosFijos / margenContribucion;
};
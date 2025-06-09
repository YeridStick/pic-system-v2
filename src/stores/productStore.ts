import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AdjustmentMethod, BudgetSummary, Product, ProductFormData } from '../types';
import { 
  calculateBudgetTotal, 
  calculateAverageMargin,
  applyProportionalAdjustment,
  applyFixedMargin
} from '../utils/calculations';

interface ProductState {
  // Estado
  productos: Product[];
  productosOriginales: Product[];
  contadorItems: number;
  filtros: {
    busqueda: string;
    categoria: string;
  };
  
  // Acciones CRUD
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  
  // Importación masiva y reemplazo
  addProductsBulk: (newProducts: Product[]) => void;
  replaceProducts: (newProducts: Product[]) => void;
  
  // Filtros
  setFiltros: (filtros: Partial<ProductState['filtros']>) => void;
  
  // Cálculos
  getBudgetSummary: () => BudgetSummary;
  getFilteredProducts: () => Product[];
  
  // Ajustes de presupuesto
  applyAdjustment: (method: AdjustmentMethod) => void;
  restoreOriginals: () => void;
  
  // Datos de prueba
  loadTestData: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      productos: [],
      productosOriginales: [],
      contadorItems: 1,
      filtros: {
        busqueda: '',
        categoria: '',
      },

      // === ACCIONES CRUD ===
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData as Product,
          id: `prod-${get().contadorItems}`,
          item: get().contadorItems,
          valorTotal: productData.valorCosto * (1 + productData.margen / 100),
        };
        set((state) => ({
          productos: [...state.productos, newProduct],
          productosOriginales: [...state.productos, newProduct],
          contadorItems: state.contadorItems + 1,
        }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
          productosOriginales: state.productosOriginales.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
          productosOriginales: state.productosOriginales.filter((p) => p.id !== id),
        }));
      },

      clearAllProducts: () => {
        set({
          productos: [],
          productosOriginales: [],
          contadorItems: 1,
          filtros: {
            busqueda: '',
            categoria: '',
          },
        });
      },

      // === IMPORTACIÓN MASIVA Y REEMPLAZO ===
      addProductsBulk: (newProducts) => {
        set((state) => {
          const currentMaxItem = Math.max(...state.productos.map(p => p.item), 0);
          const processedProducts = newProducts.map((product, index) => ({
            ...product,
            id: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            item: currentMaxItem + index + 1
          }));
          return {
            productos: [...state.productos, ...processedProducts],
            productosOriginales: [...state.productos, ...processedProducts],
            contadorItems: currentMaxItem + newProducts.length + 1
          };
        });
      },
      replaceProducts: (newProducts) => {
        const processedProducts = newProducts.map((product, index) => ({
          ...product,
          item: index + 1
        }));
        set({
          productos: processedProducts,
          productosOriginales: processedProducts.map(p => ({ ...p })),
          contadorItems: newProducts.length + 1
        });
      },

      // === FILTROS ===
      setFiltros: (newFiltros) => {
        set((state) => ({
          filtros: { ...state.filtros, ...newFiltros },
        }));
      },

      // === CÁLCULOS ===
      getBudgetSummary: () => {
        const { productos } = get();
        
        const totalItems = productos.length;
        const presupuestoActual = calculateBudgetTotal(productos);
        const costoTotal = productos.reduce(
          (sum, p) => sum + p.valorCosto * p.cantidad,
          0
        );
        const margenPromedio = calculateAverageMargin(productos);

        return {
          totalItems,
          presupuestoActual,
          costoTotal,
          margenPromedio,
        };
      },

      getFilteredProducts: (): Product[] => {
        const { productos, filtros } = get();
        
        return productos.filter((producto) => {
          const coincideBusqueda = producto.producto
            .toLowerCase()
            .includes(filtros.busqueda.toLowerCase());
          const coincideCategoria = 
            !filtros.categoria || producto.categoria === filtros.categoria;
          
          return coincideBusqueda && coincideCategoria;
        });
      },

      // === AJUSTES DE PRESUPUESTO ===
      applyAdjustment: (method: AdjustmentMethod) => {
        const state = get();
        let adjustedProducts = [...state.productos];

        switch (method.type) {
          case 'proporcional':
            if (method.presupuestoObjetivo) {
              const currentBudget = state.productos.reduce((sum, p) => sum + p.valorTotal * p.cantidad, 0);
              const factor = method.presupuestoObjetivo / currentBudget;
              
              adjustedProducts = state.productos.map(producto => 
                applyProportionalAdjustment(producto, factor)
              );
            }
            break;

          case 'margen_fijo':
            if (method.margenFijo !== undefined) {
              adjustedProducts = state.productos.map(producto => 
                applyFixedMargin(producto, method.margenFijo!)
              );
            }
            break;

          case 'por_categoria':
            if (method.margenesPorCategoria) {
              adjustedProducts = state.productos.map(producto => {
                const margen = method.margenesPorCategoria![producto.categoria] || 20;
                return applyFixedMargin(producto, margen);
              });
            }
            break;
        }

        set({ productos: adjustedProducts });
        
        // Guardar en localStorage si está disponible
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            localStorage.setItem('pic_productos', JSON.stringify(adjustedProducts));
          } catch (error) {
            console.warn('Error saving to localStorage:', error);
          }
        }
      },

      restoreOriginals: () => {
        const state = get();
        if (state.productosOriginales.length > 0) {
          const restored = state.productosOriginales.map(original => ({ ...original }));
          set({ productos: restored });
          
          // Guardar en localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('pic_productos', JSON.stringify(restored));
            } catch (error) {
              console.warn('Error saving to localStorage:', error);
            }
          }
        }
      },

      // Datos de prueba
      loadTestData: () => {
        const testProducts: Product[] = [
          {
            id: 'test-1',
            item: 1,
            producto: 'Cuaderno A4',
            cantidad: 10,
            presentacion: 'Unidad',
            categoria: 'papeleria',
            valorCosto: 1500,
            margen: 25,
            valorTotal: 1875,
          },
          {
            id: 'test-2',
            item: 2,
            producto: 'Bolígrafo Azul',
            cantidad: 50,
            presentacion: 'Unidad',
            categoria: 'papeleria',
            valorCosto: 500,
            margen: 30,
            valorTotal: 650,
          },
          {
            id: 'test-3',
            item: 3,
            producto: 'Arroz 500g',
            cantidad: 20,
            presentacion: 'Paquete',
            categoria: 'alimentos',
            valorCosto: 2000,
            margen: 15,
            valorTotal: 2300,
          },
        ];
        set({
          productos: testProducts,
          productosOriginales: testProducts.map(p => ({ ...p })),
          contadorItems: testProducts.length + 1,
        });
      },
    }),
    {
      name: 'pic-product-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        productos: state.productos,
        productosOriginales: state.productosOriginales,
        contadorItems: state.contadorItems,
        filtros: state.filtros,
      }),
    }
  )
);

// === HOOKS AUXILIARES ===

// Hook para obtener solo productos filtrados
export const useFilteredProducts = () => {
  return useProductStore((state) => state.getFilteredProducts());
};

// Hook para obtener solo el resumen del presupuesto
export const useBudgetSummary = () => {
  return useProductStore((state) => state.getBudgetSummary());
};

// Hook para acciones de productos sin estado
export const useProductActions = () => {
  return useProductStore((state) => ({
    addProduct: state.addProduct,
    updateProduct: state.updateProduct,
    deleteProduct: state.deleteProduct,
    clearAllProducts: state.clearAllProducts,
    loadTestData: state.loadTestData,
  }));
};

// Hook para ajustes de presupuesto
export const useBudgetAdjustments = () => {
  return useProductStore((state) => ({
    applyAdjustment: state.applyAdjustment,
    restoreOriginals: state.restoreOriginals,
    productosOriginales: state.productosOriginales,
  }));
};

// Hook para filtros
export const useProductFilters = () => {
  return useProductStore((state) => ({
    filtros: state.filtros,
    setFiltros: state.setFiltros,
  }));
};
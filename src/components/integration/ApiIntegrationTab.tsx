import React, { useState, useEffect } from 'react';
import { Link, List, Settings, Eye, Save } from 'lucide-react';
import { useApiIntegrationStore } from '../../stores/apiIntegrationStore';
import { useProductStore } from '../../stores/productStore';
import type { ProductCategory, TaxConfig, AdditionalCost } from '../../types/product';
import toast from 'react-hot-toast';

// Campos locales disponibles para mapeo
const LOCAL_FIELDS = [
  { value: 'id', label: 'ID', description: 'Identificador único (opcional)' },
  { value: 'producto', label: 'Nombre del Producto', description: 'Ej: Cuaderno A4' },
  { value: 'cantidad', label: 'Cantidad', description: 'Ej: 10' },
  { value: 'presentacion', label: 'Presentación', description: 'Ej: Unidad, Caja' },
  { value: 'categoria', label: 'Categoría', description: 'Ej: Papelería' },
  { value: 'valorCosto', label: 'Valor Costo', description: 'Ej: 1500' },
  { value: 'margen', label: 'Margen (%)', description: 'Ej: 25' },
  { value: 'impuestos', label: 'Impuestos', description: 'Array de impuestos' },
  { value: 'costosAdicionales', label: 'Costos Adicionales', description: 'Array de costos' },
];

function getValueByPath(obj: unknown, path: string): unknown {
  if (!path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' && part in acc ? (acc as Record<string, unknown>)[part] : undefined), obj);
}

const ApiIntegrationTab: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiFields, setApiFields] = useState<string[]>(Array(LOCAL_FIELDS.length).fill(''));
  const [previewData, setPreviewData] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [arrayPath, setArrayPath] = useState('');
  const { config, setConfig } = useApiIntegrationStore();
  const { addProduct } = useProductStore();

  // Cargar config guardada al abrir el modal
  useEffect(() => {
    setApiUrl(config.apiUrl || '');
    setArrayPath(config.arrayPath || '');
    setApiFields(config.apiFields.length === LOCAL_FIELDS.length ? config.apiFields : Array(LOCAL_FIELDS.length).fill(''));
  }, [config]);

  const handleApiFieldChange = (idx: number, value: string) => {
    setApiFields((prev) => prev.map((v, i) => i === idx ? value : v));
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    setPreviewData([]);
    setShowErrorModal(false);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('No se pudo conectar a la API');
      const data: unknown = await res.json();
      // Usar la ruta indicada por el usuario para encontrar el array de productos
      let items: unknown[] = [];
      if (arrayPath) {
        const arr = getValueByPath(data, arrayPath);
        if (Array.isArray(arr)) {
          items = arr;
        } else {
          throw new Error('La ruta al array de productos no es válida o no es un array');
        }
      } else {
        // Fallback: buscar el primer array en el objeto
        if (Array.isArray(data)) {
          items = data;
        } else if (typeof data === 'object' && data !== null) {
          for (const key in data as Record<string, unknown>) {
            if (Array.isArray((data as Record<string, unknown>)[key])) {
              items = (data as Record<string, unknown>)[key] as unknown[];
              break;
            }
          }
        }
      }
      if (!Array.isArray(items) || items.length === 0) throw new Error('No se encontraron productos en la respuesta de la API');
      // Tomar los primeros 5
      const preview = items.slice(0, 5).map((item, idx) => {
        const mapped: Record<string, unknown> = {};
        LOCAL_FIELDS.forEach((field, fidx) => {
          mapped[field.value] = getValueByPath(item, apiFields[fidx]);
        });
        // Si no hay id, generar uno único
        if (!mapped.id || mapped.id === '' || mapped.id === undefined) {
          mapped.id = `api-prod-${Date.now()}-${idx}`;
        }
        return mapped;
      });
      setPreviewData(preview);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al conectar con la API');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar configuración
  const handleSaveConfig = () => {
    setConfig({ apiUrl, arrayPath, apiFields });
  };

  // Importar productos al sistema (solo los del preview actual)
  const handleLoadProducts = () => {
    if (previewData.length > 0) {
      previewData.forEach((row) => {
        const r = row as Record<string, unknown>;
        addProduct({
          producto: String(r.producto ?? ''),
          cantidad: Number(r.cantidad ?? 0),
          presentacion: String(r.presentacion ?? ''),
          categoria: String(r.categoria ?? 'otros') as ProductCategory,
          valorCosto: Number(r.valorCosto ?? 0),
          margen: Number(r.margen ?? 0),
          impuestos: r.impuestos as TaxConfig[] | undefined,
          costosAdicionales: r.costosAdicionales as AdditionalCost[] | undefined,
        });
      });
      toast.success('Productos importados correctamente');
    } else {
      toast.error('No hay productos para importar');
    }
  };

  return (
    <div>
      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
            <div className="mb-4">
              <span className="inline-block bg-red-100 text-red-600 rounded-full p-3 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
              </span>
              <h3 className="text-lg font-bold text-red-700 mb-2">Error al obtener productos</h3>
              <div className="text-red-600 text-sm">{error}</div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setShowErrorModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Nota sobre CORS */}
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
        <strong>Nota:</strong> Si la API está en otro dominio, asegúrate de que el backend permita solicitudes CORS desde este origen. De lo contrario, el navegador bloqueará la conexión.
      </div>
      {/* URL de la API */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Link className="w-4 h-4 text-cyan-400" /> URL de la API
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400"
          placeholder="https://mi-api.com/productos"
          value={apiUrl}
          onChange={e => setApiUrl(e.target.value)}
        />
      </div>
      {/* Ruta al array de productos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <List className="w-4 h-4 text-cyan-400" /> Ruta al array de productos
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400"
          placeholder="Ejemplo: data.productos"
          value={arrayPath}
          onChange={e => setArrayPath(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">Indica la ruta exacta al array de productos en la respuesta de la API. Ejemplo: <code>data.productos</code></div>
      </div>
      {/* Mapeo de campos */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span className="font-medium text-gray-700">Mapeo de campos</span>
        </div>
        <div className="space-y-2">
          {LOCAL_FIELDS.map((field, idx) => (
            <div key={field.value} className="flex gap-2 items-center">
              <span className="w-1/2 text-sm text-gray-700 font-medium">{field.label}</span>
              <input
                type="text"
                className="border rounded px-2 py-1 w-1/2"
                placeholder={`Campo en la API (ej: ${field.description})`}
                value={apiFields[idx]}
                onChange={e => handleApiFieldChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 font-semibold shadow"
          onClick={handleTestConnection}
          disabled={!apiUrl || isLoading}
        >
          <Eye className="w-4 h-4" />
          {isLoading ? 'Cargando...' : 'Obtener e importar productos'}
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
          onClick={handleSaveConfig}
          disabled={isLoading}
        >
          <Save className="w-4 h-4" />
          Guardar configuración
        </button>
      </div>
      {/* Preview de datos */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <List className="w-4 h-4 text-cyan-400" />
          <span className="font-medium text-gray-700">Preview de datos</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">(Aquí se mostrarán los primeros productos recuperados de la API una vez importados)</div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {LOCAL_FIELDS.map((f, i) => (
                  <th key={i} className="px-2 py-1 text-left text-gray-600 font-semibold border-b">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.length === 0 ? (
                <tr><td colSpan={LOCAL_FIELDS.length} className="text-center text-gray-400 py-4">{isLoading ? 'Cargando...' : 'Sin datos'}</td></tr>
              ) : (
                previewData.map((row, i) => (
                  <tr key={i}>
                    {LOCAL_FIELDS.map((f, j) => (
                      <td key={j} className="px-2 py-1 border-b">{(row as Record<string, unknown>)[f.value] as string}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Botón para cargar productos */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold shadow disabled:opacity-50"
            onClick={handleLoadProducts}
            disabled={previewData.length === 0}
          >
            Cargar productos en el sistema
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiIntegrationTab; 
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, BarChart3, Lightbulb, RefreshCw, ArrowRight } from 'lucide-react';

export const FormulasTab: React.FC = () => {
  // Estados para la calculadora interactiva
  const [valorCosto, setValorCosto] = useState<number>(0);
  const [margenDeseado, setMargenDeseado] = useState<number>(25);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [presupuestoActual, setPresupuestoActual] = useState<number>(0);
  const [presupuestoObjetivo, setPresupuestoObjetivo] = useState<number>(0);
  const [factorAjuste, setFactorAjuste] = useState<number>(0);

  // Calcular valor total automáticamente
  useEffect(() => {
    if (valorCosto > 0) {
      const total = valorCosto * (1 + margenDeseado / 100);
      setValorTotal(total);
    } else {
      setValorTotal(0);
    }
  }, [valorCosto, margenDeseado]);

  // Calcular factor de ajuste automáticamente
  useEffect(() => {
    if (presupuestoActual > 0 && presupuestoObjetivo > 0) {
      const factor = presupuestoObjetivo / presupuestoActual;
      setFactorAjuste(factor);
    } else {
      setFactorAjuste(0);
    }
  }, [presupuestoActual, presupuestoObjetivo]);

  // Función para formatear moneda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Función para limpiar calculadora
  const limpiarCalculadora = () => {
    setValorCosto(0);
    setMargenDeseado(25);
    setValorTotal(0);
    setPresupuestoActual(0);
    setPresupuestoObjetivo(0);
    setFactorAjuste(0);
  };

  // Componente para mostrar una fórmula
  const FormulaCard: React.FC<{
    title: string;
    formula: string;
    description: string;
    example: string;
    result: string;
    color: string;
    icon: React.ReactNode;
  }> = ({ title, formula, description, example, result, color, icon }) => (
    <div className={`bg-white rounded-2xl shadow-lg border-l-4 ${color} overflow-hidden hover:shadow-xl transition-all duration-300`}>
      <div className={`${color.replace('border-l-', 'bg-').replace('-500', '-50')} p-4`}>
        <div className="flex items-center">
          <div className={`p-2 ${color.replace('border-l-', 'bg-').replace('-500', '-100')} rounded-lg mr-3`}>
            {icon}
          </div>
          <h4 className={`font-bold text-lg ${color.replace('border-l-', 'text-').replace('-500', '-800')}`}>
            {title}
          </h4>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Fórmula:</h5>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm border-l-4 border-gray-300">
            <code className="text-purple-700 font-semibold">{formula}</code>
          </div>
        </div>
        
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Descripción:</h5>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Ejemplo:</h5>
          <p className="text-gray-600 text-sm">{example}</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-1">Resultado:</h5>
          <p className="font-mono text-blue-900 font-bold">{result}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header principal */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                📐 Fórmulas y Cálculos
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Comprende y utiliza las fórmulas matemáticas que impulsan el sistema de presupuestos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fórmulas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormulaCard
          title="1. Cálculo de Valor Total"
          formula="Valor Total = Valor Costo × (1 + Margen/100)"
          description="Esta fórmula calcula el precio final de un producto aplicando el margen de ganancia deseado sobre el costo base."
          example="Si Valor Costo = $1,000 y Margen = 25%"
          result="Valor Total = $1,000 × (1 + 25/100) = $1,000 × 1.25 = $1,250"
          color="border-l-green-500"
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
        />

        <FormulaCard
          title="2. Cálculo de Margen de Ganancia"
          formula="Margen % = ((Valor Total - Valor Costo) / Valor Costo) × 100"
          description="Calcula el porcentaje de ganancia obtenido sobre la inversión inicial. Es útil para analizar la rentabilidad."
          example="Si Valor Total = $1,250 y Valor Costo = $1,000"
          result="Margen % = (($1,250 - $1,000) / $1,000) × 100 = 25%"
          color="border-l-blue-500"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />

        <FormulaCard
          title="3. Ajuste Proporcional de Presupuesto"
          formula="Factor = Presupuesto Objetivo / Presupuesto Actual"
          description="Permite ajustar todos los precios proporcionalmente para alcanzar un presupuesto específico."
          example="Para reducir de $4,000,000 a $3,000,000"
          result="Factor = $3,000,000 / $4,000,000 = 0.75 (todos los precios × 0.75)"
          color="border-l-orange-500"
          icon={<BarChart3 className="w-5 h-5 text-orange-600" />}
        />

        <FormulaCard
          title="4. Cálculo de Nuevo Margen tras Ajuste"
          formula="Nuevo Margen % = ((Nuevo Valor - Costo) / Costo) × 100"
          description="Después de un ajuste proporcional, esta fórmula calcula el nuevo margen de ganancia resultante."
          example="Si se aplica factor 0.75 a precio de $1,250 con costo $1,000"
          result="Nuevo Valor = $937.50, Nuevo Margen = -6.25%"
          color="border-l-purple-500"
          icon={<Calculator className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Calculadora Interactiva */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">🧮 Calculadora Interactiva</h3>
                <p className="text-white/90">Prueba las fórmulas con tus propios valores</p>
              </div>
            </div>
            
            <button
              onClick={limpiarCalculadora}
              className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cálculo de Precio */}
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Cálculo de Precio
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Costo ($)
                    </label>
                    <input
                      type="number"
                      value={valorCosto || ''}
                      onChange={(e) => setValorCosto(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Ej: 1000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margen Deseado (%)
                    </label>
                    <input
                      type="number"
                      value={margenDeseado || ''}
                      onChange={(e) => setMargenDeseado(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Ej: 25"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      💰 Valor Total (Resultado)
                    </label>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(valorTotal)}
                    </div>
                    {valorCosto > 0 && (
                      <div className="text-sm text-green-600 mt-2">
                        Ganancia: {formatCurrency(valorTotal - valorCosto)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ajuste de Presupuesto */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Ajuste de Presupuesto
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presupuesto Actual ($)
                    </label>
                    <input
                      type="number"
                      value={presupuestoActual || ''}
                      onChange={(e) => setPresupuestoActual(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ej: 4000000"
                      min="0"
                      step="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presupuesto Objetivo ($)
                    </label>
                    <input
                      type="number"
                      value={presupuestoObjetivo || ''}
                      onChange={(e) => setPresupuestoObjetivo(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ej: 3000000"
                      min="0"
                      step="1000"
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      ⚖️ Factor de Ajuste (Resultado)
                    </label>
                    <div className="text-2xl font-bold text-blue-700">
                      {factorAjuste > 0 ? factorAjuste.toFixed(4) : '0.0000'}
                    </div>
                    {factorAjuste > 0 && (
                      <div className="text-sm text-blue-600 mt-2">
                        {factorAjuste < 1 ? 'Reducción' : 'Incremento'}: {Math.abs((1 - factorAjuste) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado combinado */}
          {valorCosto > 0 && factorAjuste > 0 && (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                Resultado del Ajuste Combinado
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Precio Original</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(valorTotal)}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Precio Ajustado</div>
                  <div className="text-lg font-bold text-purple-700">{formatCurrency(valorTotal * factorAjuste)}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Nuevo Margen</div>
                  <div className="text-lg font-bold text-orange-600">
                    {valorCosto > 0 ? (((valorTotal * factorAjuste - valorCosto) / valorCosto) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ejemplos Prácticos */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 rounded-lg mr-4 flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">
              💡 Ejemplos Prácticos de Uso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-emerald-800">
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">💰 Cálculo de Precios</h4>
                <ul className="space-y-1">
                  <li>• <strong>Para mantener margen del 25%:</strong> Si costo = $800, entonces precio = $800 × 1.25 = $1,000</li>
                  <li>• <strong>Margen mínimo viable:</strong> Considera costos operativos adicionales</li>
                  <li>• <strong>Competitividad:</strong> Compara con precios del mercado</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">📊 Ajuste de Presupuestos</h4>
                <ul className="space-y-1">
                  <li>• <strong>Reducir presupuesto en 25%:</strong> Factor = 0.75, todos los precios se multiplican por 0.75</li>
                  <li>• <strong>Incrementar presupuesto:</strong> Factor `{'>'}` 1.0 para aumentar valores</li>
                  <li>• <strong>Ajuste selectivo:</strong> Aplica factor solo a categorías específicas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">🔍 Análisis de Rentabilidad</h4>
                <ul className="space-y-1">
                  <li>• <strong>Margen actual:</strong> Si precio = $1,200 y costo = $800, margen = (400/800) × 100 = 50%</li>
                  <li>• <strong>Punto de equilibrio:</strong> Cuando margen = 0%</li>
                  <li>• <strong>Optimización:</strong> Busca el mejor balance precio-volumen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fórmula del Total del Presupuesto */}
      <div className="bg-white rounded-2xl shadow-lg border-l-4 border-l-teal-500 overflow-hidden">
        <div className="bg-teal-50 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-bold text-lg text-teal-800">
              5. Total del Presupuesto
            </h4>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h5 className="font-semibold text-gray-700 mb-2">Fórmula:</h5>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm border-l-4 border-gray-300">
              <code className="text-purple-700 font-semibold">
                Total Presupuesto = Σ(Valor Total × Cantidad) para cada producto
              </code>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
            <h5 className="font-semibold text-teal-800 mb-2">Explicación:</h5>
            <p className="text-teal-700 text-sm leading-relaxed">
              Esta fórmula suma el valor total de cada producto multiplicado por su cantidad, 
              proporcionando el costo total del presupuesto. Es la base para todos los análisis 
              financieros y ajustes proporcionales del sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Tips adicionales */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
        <div className="flex items-start">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4 flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              🎯 Consejos para Optimizar tus Cálculos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-800">
              <div>
                <h4 className="font-medium mb-2 text-yellow-900">⚡ Mejores Prácticas</h4>
                <ul className="space-y-1">
                  <li>• Siempre redondea los precios a valores comerciales</li>
                  <li>• Considera la inflación en proyecciones a largo plazo</li>
                  <li>• Revisa márgenes regularmente según el mercado</li>
                  <li>• Documenta los criterios utilizados para cada cálculo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-yellow-900">⚠️ Precauciones</h4>
                <ul className="space-y-1">
                  <li>• Verifica que los costos incluyan todos los gastos</li>
                  <li>• Los márgenes muy bajos pueden generar pérdidas</li>
                  <li>• Ajustes drásticos pueden afectar la competitividad</li>
                  <li>• Siempre valida resultados con datos históricos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
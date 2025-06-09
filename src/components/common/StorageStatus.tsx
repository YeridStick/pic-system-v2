// src/components/common/StorageStatus.tsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  Wifi, 
  WifiOff, 
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock
} from 'lucide-react';

interface StorageInfo {
  available: boolean;
  used: number;
  total: number;
  items: number;
}

export const StorageStatus: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    available: false,
    used: 0,
    total: 0,
    items: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const checkStorageStatus = () => {
    try {
      const test = 'test_' + Date.now();
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      
      // Calcular espacio usado
      let used = 0;
      let items = 0;
      
      for (const key of Object.keys(localStorage)) {
        used += localStorage.getItem(key)?.length || 0;
        items++;
      }
      
      setStorageInfo({
        available: true,
        used: used,
        total: 5 * 1024 * 1024, // 5MB aproximado
        items: items
      });
    } catch {
      setStorageInfo({
        available: false,
        used: 0,
        total: 0,
        items: 0
      });
    }
  };

  useEffect(() => {
    checkStorageStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkStorageStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (): number => {
    if (storageInfo.total === 0) return 0;
    return (storageInfo.used / storageInfo.total) * 100;
  };

  const getStatusColor = () => {
    if (!storageInfo.available) return 'border-red-300 bg-red-50';
    const usage = getUsagePercentage();
    if (usage > 80) return 'border-orange-300 bg-orange-50';
    return 'border-green-300 bg-green-50';
  };

  const getStatusIcon = () => {
    if (!storageInfo.available) return WifiOff;
    const usage = getUsagePercentage();
    if (usage > 80) return AlertTriangle;
    return CheckCircle;
  };

  const getProgressBarColor = () => {
    const usage = getUsagePercentage();
    if (usage > 80) return 'bg-gradient-to-r from-orange-500 to-red-500';
    if (usage > 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-green-500 to-blue-500';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 z-40"
        title="Mostrar estado del almacenamiento"
      >
        <Database className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  const StatusIcon = getStatusIcon();

  return (
    <div className="relative">
      {/* Badge compacto */}
      <div 
        className={`
          rounded-xl border-2 transition-all duration-300 shadow-soft hover:shadow-lg cursor-pointer
          ${getStatusColor()}
          ${isExpanded ? 'mb-4' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Indicador de estado con animación */}
              <div className="relative">
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${storageInfo.available 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                  }
                `}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                
                {/* Indicador pulsante */}
                {storageInfo.available && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-semibold text-sm ${
                    storageInfo.available ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {storageInfo.available ? '🟢 Almacenamiento Activo' : '🔴 Sin Almacenamiento'}
                  </h4>
                  
                  {storageInfo.available && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Database className="w-3 h-3" />
                      <span>{storageInfo.items} elementos</span>
                    </div>
                  )}
                </div>

                <p className={`text-xs mt-1 ${
                  storageInfo.available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {storageInfo.available 
                    ? `Datos guardados localmente • ${formatBytes(storageInfo.used)} usados`
                    : 'Los datos se almacenan temporalmente en memoria'
                  }
                </p>

                {/* Barra de progreso compacta */}
                {storageInfo.available && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
                        style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-2">
              {/* Botón expandir/contraer */}
              <button
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                title={isExpanded ? 'Contraer detalles' : 'Ver detalles'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {/* Botón ocultar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                title="Ocultar indicador"
              >
                <span className="w-4 h-4 text-gray-400 text-xs">✕</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 animate-slide-down">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles del Almacenamiento
            </h3>
          </div>

          {storageInfo.available ? (
            <div className="space-y-4">
              {/* Métricas detalladas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Espacio Usado</p>
                      <p className="text-lg font-bold text-blue-900">
                        {formatBytes(storageInfo.used)}
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Elementos</p>
                      <p className="text-lg font-bold text-green-900">
                        {storageInfo.items}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Disponible</p>
                      <p className="text-lg font-bold text-purple-900">
                        {formatBytes(storageInfo.total - storageInfo.used)}
                      </p>
                    </div>
                    <Wifi className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Barra de progreso detallada */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uso del almacenamiento</span>
                  <span className="font-medium text-gray-900">
                    {getUsagePercentage().toFixed(1)}% de {formatBytes(storageInfo.total)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${getProgressBarColor()}`}
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  />
                </div>
                {getUsagePercentage() > 80 && (
                  <div className="flex items-center text-orange-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span>Espacio de almacenamiento bajo</span>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">ℹ️ Información del Almacenamiento Local:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Los datos se guardan automáticamente en tu navegador</li>
                      <li>• La información persiste entre sesiones y reinicios</li>
                      <li>• Capacidad típica: ~5-10MB dependiendo del navegador</li>
                      <li>• Los datos solo son accesibles desde este dominio</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={checkStorageStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  🔄 Actualizar Estado
                </button>
                <button 
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres limpiar el almacenamiento local?')) {
                      localStorage.clear();
                      checkStorageStatus();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  🗑️ Limpiar Cache
                </button>
              </div>
            </div>
          ) : (
            /* Estado sin almacenamiento */
            <div className="text-center py-8">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <WifiOff className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                Almacenamiento No Disponible
              </h4>
              <p className="text-sm text-red-700 mb-4">
                El localStorage no está disponible en tu navegador. Esto puede deberse a:
              </p>
              <ul className="text-left text-sm text-red-600 space-y-1 max-w-md mx-auto">
                <li>• Navegación en modo privado/incógnito</li>
                <li>• Configuración de privacidad restrictiva</li>
                <li>• Navegador muy antiguo</li>
                <li>• Extensiones que bloquean el almacenamiento</li>
              </ul>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Los datos se almacenarán temporalmente en memoria y se perderán al recargar la página.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
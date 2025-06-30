import React from 'react';
import { Building2, Calendar, User, Bell, Settings } from 'lucide-react';
import { HeaderStats } from './HeaderStats';
import { useUIStore } from '../../stores/uiStore';

export const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const { openModal } = useUIStore();

  return (
    <header className="relative overflow-hidden">
      {/* Gradiente de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        {/* Patrón de círculos decorativos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {/* Contenido del header */}
      <div className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Fila superior */}
          <div className="flex items-center justify-between mb-6">
            {/* Logo y info básica */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 group hover:bg-white/30 transition-colors">
                <Building2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                  Sistema PIC
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Gestión de Presupuestos Inteligente
                </p>
              </div>
            </div>

            {/* Barra de herramientas */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Fecha */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/15 transition-colors">
                <Calendar className="w-4 h-4 text-blue-200" />
                <span className="text-white text-sm font-medium">
                  {currentDate}
                </span>
              </div>

              {/* Usuario */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/15 transition-colors">
                <User className="w-4 h-4 text-blue-200" />
                <span className="text-white text-sm font-medium">
                  Admin
                </span>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-2">
                <button className="bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20 transition-colors group">
                  <Bell className="w-5 h-5 text-white group-hover:animate-pulse" />
                </button>
                <button
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20 transition-colors group"
                  onClick={() => openModal('api_integration')}
                >
                  <Settings className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Información de la entidad */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                ESE Hospital Municipal de Algeciras Huila
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-4xl mx-auto">
                Plan de Intervenciones Colectivas (PIC) Municipal - 
                Sistema de Gestión de Presupuestos y Suministros
              </p>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <HeaderStats />
        </div>
      </div>
    </header>
  );
};
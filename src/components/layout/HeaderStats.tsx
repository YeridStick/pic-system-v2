import React from 'react';
import { TrendingUp, Package, DollarSign, Target } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { formatCurrency } from '../../utils/formatters';

export const HeaderStats: React.FC = () => {
  const { getBudgetSummary } = useProductStore();
  const summary = getBudgetSummary();

  const stats = [
    {
      label: 'Productos',
      value: summary.totalItems.toString(),
      icon: Package,
      color: 'text-blue-400'
    },
    {
      label: 'Presupuesto',
      value: formatCurrency(summary.presupuestoActual),
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Margen Prom.',
      value: `${summary.margenPromedio.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Ganancia Est.',
      value: formatCurrency(summary.presupuestoActual - summary.costoTotal),
      icon: Target,
      color: 'text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-white text-lg font-bold mt-1">
                  {stat.value}
                </p>
              </div>
              <IconComponent className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
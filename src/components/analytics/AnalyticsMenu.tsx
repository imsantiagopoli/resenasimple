import React from 'react';
import { BarChart3, Star, TrendingUp, MapPin } from 'lucide-react';

interface AnalyticsMenuProps {
  selectedMetric: 'overview' | 'ratings' | 'trends' | 'branches';
  onMetricChange: (metric: 'overview' | 'ratings' | 'trends' | 'branches') => void;
}

const AnalyticsMenu: React.FC<AnalyticsMenuProps> = ({ selectedMetric, onMetricChange }) => {
  const metrics = [
    {
      id: 'overview' as const,
      label: 'Vista General',
      icon: BarChart3,
      description: 'Resumen de métricas clave'
    },
    {
      id: 'ratings' as const,
      label: 'Calificaciones',
      icon: Star,
      description: 'Distribución de estrellas'
    },
    {
      id: 'trends' as const,
      label: 'Tendencias',
      icon: TrendingUp,
      description: 'Evolución en el tiempo'
    },
    {
      id: 'branches' as const,
      label: 'Por Sucursal',
      icon: MapPin,
      description: 'Comparativa entre sucursales'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Analíticas
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Selecciona el tipo de análisis que deseas visualizar
        </p>
      </div>

      {/* Metrics Menu */}
      <div className="space-y-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.id;

          return (
            <button
              key={metric.id}
              onClick={() => onMetricChange(metric.id)}
              className="w-full text-left p-4 rounded-lg border transition-all duration-200"
              style={{
                borderColor: isSelected ? '#075E54' : 'rgb(229, 231, 235)',
                backgroundColor: isSelected ? '#075E54' + '10' : 'white'
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#075E54' + '20' : 'rgb(243, 244, 246)'
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: isSelected ? '#075E54' : 'rgb(107, 114, 128)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: isSelected ? '#075E54' : '#161616' }}
                  >
                    {metric.label}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
                    {metric.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsMenu;

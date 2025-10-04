import React from 'react';
import { TrendingUp, TrendingDown, Users, MousePointerClick } from 'lucide-react';

interface OverviewMetricsProps {
  total: number;
  positive: number;
  negative: number;
  positiveRate: number;
  googleClicks: number;
  formsCompleted: number;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  total,
  positive,
  negative,
  positiveRate,
  googleClicks,
  formsCompleted,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Vista General
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                <TrendingUp size={20} style={{ color: '#16a34a' }} />
              </div>
              <h3 className="ml-3 text-lg font-semibold" style={{ color: '#161616' }}>
                Respuestas Positivas
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold" style={{ color: '#16a34a' }}>
              {positive}
            </p>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              {positiveRate.toFixed(1)}% del total de respuestas
            </p>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <p className="text-sm font-medium" style={{ color: '#374151' }}>
              Calificaciones de 4 y 5 estrellas
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                <TrendingDown size={20} style={{ color: '#dc2626' }} />
              </div>
              <h3 className="ml-3 text-lg font-semibold" style={{ color: '#161616' }}>
                Respuestas Negativas
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold" style={{ color: '#dc2626' }}>
              {negative}
            </p>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              {(100 - positiveRate).toFixed(1)}% del total de respuestas
            </p>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <p className="text-sm font-medium" style={{ color: '#374151' }}>
              Calificaciones de 1, 2 y 3 estrellas
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdfa' }}>
                <Users size={20} style={{ color: '#075E54' }} />
              </div>
              <h3 className="ml-3 text-lg font-semibold" style={{ color: '#161616' }}>
                Total de Respuestas
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold" style={{ color: '#161616' }}>
              {total}
            </p>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Todas las calificaciones recibidas
            </p>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: '#374151' }}>
                Promedio de calificación
              </p>
              <p className="text-sm font-bold" style={{ color: '#161616' }}>
                {total > 0 ? ((positive * 5 + negative * 2.5) / total).toFixed(1) : '0.0'} ⭐
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                <MousePointerClick size={20} style={{ color: '#2563eb' }} />
              </div>
              <h3 className="ml-3 text-lg font-semibold" style={{ color: '#161616' }}>
                Interacciones
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold" style={{ color: '#2563eb' }}>
              {googleClicks}
            </p>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Clicks a Google
            </p>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: '#374151' }}>
                Formularios completados
              </p>
              <p className="text-sm font-bold" style={{ color: '#161616' }}>
                {formsCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewMetrics;

import React from 'react';
import { MousePointerClick, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ConversionMetricsProps {
  total: number;
  googleClicks: number;
  formsCompleted: number;
  positive: number;
  negative: number;
}

const ConversionMetrics: React.FC<ConversionMetricsProps> = ({
  total,
  googleClicks,
  formsCompleted,
  positive,
  negative,
}) => {
  const googleClickRate = total > 0 ? (googleClicks / total) * 100 : 0;
  const formCompletionRate = total > 0 ? (formsCompleted / total) * 100 : 0;
  const positiveToGoogleRate = positive > 0 ? (googleClicks / positive) * 100 : 0;
  const negativeToFormRate = negative > 0 ? (formsCompleted / negative) * 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
        Métricas de Conversión
      </h2>

      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
              <MousePointerClick size={24} style={{ color: '#2563eb' }} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Tasa de Clicks a Google
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Usuarios que hicieron click para dejar reseña en Google
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-end justify-between mb-2">
              <p className="text-4xl font-bold" style={{ color: '#2563eb' }}>
                {googleClickRate.toFixed(1)}%
              </p>
              <p className="text-lg font-semibold" style={{ color: '#6b7280' }}>
                {googleClicks} / {total}
              </p>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${googleClickRate}%`,
                  backgroundColor: '#2563eb',
                }}
              />
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#374151' }}>
              De respuestas positivas a Google
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle size={16} style={{ color: '#16a34a' }} className="mr-2" />
                <span className="text-sm" style={{ color: '#6b7280' }}>
                  {googleClicks} clicks de {positive} positivas
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#161616' }}>
                {positiveToGoogleRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
              <FileText size={24} style={{ color: '#16a34a' }} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Tasa de Formularios Completados
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Usuarios que completaron el formulario de contacto
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-end justify-between mb-2">
              <p className="text-4xl font-bold" style={{ color: '#16a34a' }}>
                {formCompletionRate.toFixed(1)}%
              </p>
              <p className="text-lg font-semibold" style={{ color: '#6b7280' }}>
                {formsCompleted} / {total}
              </p>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${formCompletionRate}%`,
                  backgroundColor: '#16a34a',
                }}
              />
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#374151' }}>
              De respuestas negativas a formulario
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle size={16} style={{ color: '#dc2626' }} className="mr-2" />
                <span className="text-sm" style={{ color: '#6b7280' }}>
                  {formsCompleted} formularios de {negative} negativas
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#161616' }}>
                {negativeToFormRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: '#fef9e7', border: '1px solid #fde68a' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
            Resumen de Interacciones
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                Total de interacciones
              </p>
              <p className="text-2xl font-bold" style={{ color: '#161616' }}>
                {googleClicks + formsCompleted}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                Tasa de interacción general
              </p>
              <p className="text-2xl font-bold" style={{ color: '#161616' }}>
                {total > 0 ? (((googleClicks + formsCompleted) / total) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionMetrics;

import React from 'react';

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Clicks a Google
        </h3>

        <div className="mb-4">
          <div className="flex items-end justify-between mb-2">
            <p className="text-3xl font-bold" style={{ color: '#161616' }}>
              {googleClickRate.toFixed(1)}%
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              {googleClicks} / {total}
            </p>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
            <div
              className="h-full"
              style={{
                width: `${googleClickRate}%`,
                backgroundColor: '#10b981',
              }}
            />
          </div>
        </div>

        <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
          Usuarios que hicieron click para dejar reseña
        </div>
      </div>

      <div className="p-6 rounded-lg bg-white border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Formularios Completados
        </h3>

        <div className="mb-4">
          <div className="flex items-end justify-between mb-2">
            <p className="text-3xl font-bold" style={{ color: '#161616' }}>
              {formCompletionRate.toFixed(1)}%
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              {formsCompleted} / {total}
            </p>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
            <div
              className="h-full"
              style={{
                width: `${formCompletionRate}%`,
                backgroundColor: '#10b981',
              }}
            />
          </div>
        </div>

        <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
          Usuarios que completaron el formulario de contacto
        </div>
      </div>
    </div>
  );
};

export default ConversionMetrics;

import React from 'react';
import { 
  TrendingUp,
  Users,
  Star,
  MessageCircle,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3,
  QrCode,
  Building2
} from 'lucide-react';

const InicioPage: React.FC = () => {
  const stats = [
    {
      title: 'Votaciones Este Mes',
      value: '1,247',
      change: '+12.5%',
      changeType: 'increase',
      icon: Users,
      color: '#075E54'
    },
    {
      title: 'Rating Promedio',
      value: '4.6',
      change: '+0.3',
      changeType: 'increase',
      icon: Star,
      color: '#f59e0b'
    },
    {
      title: 'Reseñas en Google',
      value: '89',
      change: '+7',
      changeType: 'increase',
      icon: MessageCircle,
      color: '#3b82f6'
    },
    {
      title: 'Tasa de Conversión',
      value: '73%',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: '#10b981'
    }
  ];

  const recentActivity = [
    {
      type: 'positive',
      customer: 'María García',
      stars: 5,
      comment: '¡Excelente comida y servicio! Definitivamente volveré.',
      time: '2 horas',
      status: 'Enviado a Google'
    },
    {
      type: 'positive',
      customer: 'Carlos Martínez',
      stars: 4,
      comment: 'Muy buena experiencia, solo la espera fue un poco larga.',
      time: '4 horas',
      status: 'Enviado a Google'
    },
    {
      type: 'negative',
      customer: 'Ana López',
      stars: 2,
      comment: 'El servicio fue lento y la comida llegó fría.',
      time: '6 horas',
      status: 'Retenido internamente'
    },
    {
      type: 'positive',
      customer: 'Roberto Silva',
      stars: 5,
      comment: 'Ambiente perfecto para una cena romántica. Todo perfecto.',
      time: '8 horas',
      status: 'Enviado a Google'
    }
  ];

  const quickActions = [
    {
      title: 'Generar Código QR',
      description: 'Crear nuevo código QR para mesa',
      icon: QrCode,
      action: () => console.log('Generar QR')
    },
    {
      title: 'Ver Estadísticas',
      description: 'Análisis detallado de votaciones',
      icon: BarChart3,
      action: () => console.log('Ver stats')
    },
    {
      title: 'Configurar Negocio',
      description: 'Actualizar información del restaurante',
      icon: Building2,
      action: () => console.log('Configurar')
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Dashboard - Reseña Simple
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Resumen de la actividad de votaciones y reseñas de tu restaurante
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: 'rgb(229, 231, 235)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '20' }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold" style={{ color: '#161616' }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Actividad Reciente
            </h2>
            <button 
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: '#075E54' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
            >
              Ver todas
            </button>
          </div>

          <div className="bg-white rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div className="divide-y" style={{ color: 'rgb(229, 231, 235)' }}>
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={`${
                                star <= activity.stars 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-sm" style={{ color: '#161616' }}>
                          {activity.customer}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
                        "{activity.comment}"
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          Hace {activity.time}
                        </span>
                        <span 
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            activity.type === 'positive' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Acciones Rápidas
          </h2>

          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group w-full p-4 rounded-lg border bg-white text-left transition-all duration-200 hover:shadow-md hover:border-gray-300"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#075E54' + '20' }}
                  >
                    <action.icon size={18} style={{ color: '#075E54' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1" style={{ color: '#161616' }}>
                      {action.title}
                    </h3>
                    <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 rounded-lg border bg-white" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <h3 className="font-medium text-sm mb-3" style={{ color: '#161616' }}>
              Resumen de Hoy
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>Votaciones:</span>
                <span className="font-medium" style={{ color: '#161616' }}>47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>A Google:</span>
                <span className="font-medium text-green-600">34</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgb(107, 114, 128)' }}>Retenidas:</span>
                <span className="font-medium text-orange-600">13</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioPage;
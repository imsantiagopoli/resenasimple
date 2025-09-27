import React from 'react';
import { 
  CheckCircle, 
  Circle, 
  FileText, 
  Receipt, 
  Scale, 
  Shield, 
  Users,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const setupSteps = [
    {
      title: 'Connect company data',
      description: 'Link your business documents and files',
      completed: true
    },
    {
      title: 'Setup tax forms', 
      description: 'Configure federal and state tax documentation',
      completed: true
    },
    {
      title: 'Invite team members',
      description: 'Add colleagues to collaborate on documents', 
      completed: false
    },
    {
      title: 'Configure compliance',
      description: 'Set up regulatory requirements and alerts',
      completed: false
    }
  ];

  const quickActions = [
    {
      title: 'Upload Documents',
      description: 'Add new business documents',
      icon: FileText,
      href: '#'
    },
    {
      title: 'Tax Filing', 
      description: 'Prepare tax returns',
      icon: Receipt,
      href: '#'
    },
    {
      title: 'Legal Review',
      description: 'Review contracts and agreements', 
      icon: Scale,
      href: '#'
    },
    {
      title: 'Compliance Check',
      description: 'Run compliance validation',
      icon: Shield, 
      href: '#'
    }
  ];

  const recentActivity = [
    {
      title: 'EIN Application Completed',
      time: '2 hours ago'
    },
    {
      title: 'Q4 Tax Forms Updated', 
      time: '5 hours ago'
    },
    {
      title: 'Legal Contract Reviewed',
      time: '1 day ago'
    },
    {
      title: 'Team Member Added',
      time: '2 days ago'
    }
  ];

  const quickStats = [
    {
      title: 'Total Documents',
      value: '156'
    },
    {
      title: 'Tax Forms',
      value: '24'
    },
    {
      title: 'Team Members', 
      value: '8'
    },
    {
      title: 'Compliance Score',
      value: '94%'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold" style={{ color: '#161616' }}>
          Welcome to TACS
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Manage your company documents, tax forms, and compliance requirements in one place
        </p>
      </div>

      {/* Setup your workspace */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Setup your workspace
          </h2>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            2/4 complete
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {setupSteps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-3">
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                ) : (
                  <div 
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 
                    className={`text-sm font-medium ${step.completed ? 'line-through' : ''}`}
                    style={{ color: step.completed ? 'rgb(107, 114, 128)' : '#161616' }}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
              <p 
                className="text-xs ml-8"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="group block p-4 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'rgb(229, 231, 235)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgb(243, 244, 246)' }}
                  >
                    <action.icon size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                  </div>
                </div>
                <ExternalLink 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'rgb(107, 114, 128)' }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm" style={{ color: '#161616' }}>
                  {action.title}
                </h3>
                <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                  {action.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity and Quick Stats - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Recent Activity
            </h2>
            <button 
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: '#6e54dc' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5a45b8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6e54dc'}
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start justify-between py-2">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Clock size={14} className="flex-shrink-0 mt-1" style={{ color: 'rgb(107, 114, 128)' }} />
                  <span className="text-sm font-medium truncate" style={{ color: '#161616' }}>
                    {activity.title}
                  </span>
                </div>
                <span 
                  className="text-xs flex-shrink-0 ml-2"
                  style={{ color: 'rgb(107, 114, 128)' }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Quick Stats
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: 'rgb(229, 231, 235)'
                }}
              >
                <div className="space-y-1">
                  <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#161616' }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
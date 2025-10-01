import React from 'react';
import { RotateCcw } from 'lucide-react';
import { VotingConfiguration } from '../../hooks/useVotingConfig';

interface LogicConfigTabProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
  hasChanges: boolean;
  onResetToDefaults: () => void;
}

const LogicConfigTab: React.FC<LogicConfigTabProps> = ({ config, onConfigUpdate, hasChanges, onResetToDefaults }) => {
  const updateLogic = (updates: Partial<VotingConfiguration['logic']>) => {
    onConfigUpdate({
      logic: {
        ...config.logic,
        ...updates
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Umbral de Votación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Umbral de Votación
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Mínimo de estrellas para redirigir a Google
          </label>
          <select
            value={config.logic.threshold}
            onChange={(e) => updateLogic({ threshold: parseInt(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
          >
            <option value={3}>3 estrellas o más</option>
            <option value={4}>4 estrellas o más</option>
            <option value={5}>Solo 5 estrellas</option>
          </select>
          <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
            Los clientes que califiquen por debajo de este umbral no serán redirigidos a Google
          </p>
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

      {/* Auto-redirección Inteligente */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Auto-redirección Inteligente
        </h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.logic.smartAutoRedirect}
            onChange={(e) => updateLogic({ smartAutoRedirect: e.target.checked })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Usar redirección automática inteligente
          </span>
        </label>
        
        <div 
          className="text-xs p-3 rounded-lg"
          style={{ 
            backgroundColor: 'rgb(249, 250, 251)',
            color: 'rgb(107, 114, 128)'
          }}
        >
          {config.logic.smartAutoRedirect ? (
            <span>✅ <strong>Activado:</strong> Los clientes serán redirigidos automáticamente a Google al alcanzar el umbral.</span>
          ) : (
            <span>❌ <strong>Desactivado:</strong> Se mostrará un popup invitando a votar en Google, pero sin redirección automática.</span>
          )}
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

      {/* Flujo de Feedback Público */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Flujo de Feedback Público
        </h3>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Para clientes que califican por encima del umbral
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Mensaje de agradecimiento
            </label>
            <textarea
              value={config.logic.publicWorkflow.thankYouMessage}
              onChange={(e) => updateLogic({
                publicWorkflow: { ...config.logic.publicWorkflow, thankYouMessage: e.target.value }
              })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Texto del botón
            </label>
            <input
              type="text"
              value={config.logic.publicWorkflow.buttonText}
              onChange={(e) => updateLogic({
                publicWorkflow: { ...config.logic.publicWorkflow, buttonText: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

      {/* Flujo de Feedback Privado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Flujo de Feedback Privado
        </h3>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Para clientes que califican por debajo del umbral
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Mensaje solicitando feedback privado
            </label>
            <textarea
              value={config.logic.privateWorkflow.feedbackMessage}
              onChange={(e) => updateLogic({
                privateWorkflow: { ...config.logic.privateWorkflow, feedbackMessage: e.target.value }
              })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Mensaje de agradecimiento
            </label>
            <textarea
              value={config.logic.privateWorkflow.thankYouMessage}
              onChange={(e) => updateLogic({
                privateWorkflow: { ...config.logic.privateWorkflow, thankYouMessage: e.target.value }
              })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

      {/* Prompt Preventivo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Prompt Preventivo
        </h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.logic.prompt.enabled}
            onChange={(e) => updateLogic({
              prompt: { ...config.logic.prompt, enabled: e.target.checked }
            })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Mostrar mensaje especial para reseñas neutrales o negativas
          </span>
        </label>

        {config.logic.prompt.enabled && (
          <div className="space-y-2 ml-6">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Texto del prompt
            </label>
            <textarea
              value={config.logic.prompt.text}
              onChange={(e) => updateLogic({
                prompt: { ...config.logic.prompt, text: e.target.value }
              })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
        )}
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

      {/* Campos de Feedback Privado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Campos de Feedback Privado
        </h3>
        
        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.logic.privateWorkflow.collectName}
                onChange={(e) => updateLogic({
                  privateWorkflow: { 
                    ...config.logic.privateWorkflow, 
                    collectName: e.target.checked,
                    nameRequired: e.target.checked ? config.logic.privateWorkflow.nameRequired : false
                  }
                })}
                className="rounded border-gray-300 focus:ring-2"
                style={{ accentColor: '#075E54' }}
              />
              <span className="text-sm font-medium" style={{ color: '#161616' }}>
                Solicitar nombre
              </span>
            </label>
            
            {config.logic.privateWorkflow.collectName && (
              <div className="ml-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.logic.privateWorkflow.nameRequired}
                    onChange={(e) => updateLogic({
                      privateWorkflow: { ...config.logic.privateWorkflow, nameRequired: e.target.checked }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: '#075E54' }}
                  />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Campo obligatorio
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.logic.privateWorkflow.collectPhone}
                onChange={(e) => updateLogic({
                  privateWorkflow: { 
                    ...config.logic.privateWorkflow, 
                    collectPhone: e.target.checked,
                    phoneRequired: e.target.checked ? config.logic.privateWorkflow.phoneRequired : false
                  }
                })}
                className="rounded border-gray-300 focus:ring-2"
                style={{ accentColor: '#075E54' }}
              />
              <span className="text-sm font-medium" style={{ color: '#161616' }}>
                Solicitar teléfono
              </span>
            </label>
            
            {config.logic.privateWorkflow.collectPhone && (
              <div className="ml-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.logic.privateWorkflow.phoneRequired}
                    onChange={(e) => updateLogic({
                      privateWorkflow: { ...config.logic.privateWorkflow, phoneRequired: e.target.checked }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: '#075E54' }}
                  />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Campo obligatorio
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.logic.privateWorkflow.collectEmail}
                onChange={(e) => updateLogic({
                  privateWorkflow: { 
                    ...config.logic.privateWorkflow, 
                    collectEmail: e.target.checked,
                    emailRequired: e.target.checked ? config.logic.privateWorkflow.emailRequired : false
                  }
                })}
                className="rounded border-gray-300 focus:ring-2"
                style={{ accentColor: '#075E54' }}
              />
              <span className="text-sm font-medium" style={{ color: '#161616' }}>
                Solicitar email
              </span>
            </label>
            
            {config.logic.privateWorkflow.collectEmail && (
              <div className="ml-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.logic.privateWorkflow.emailRequired}
                    onChange={(e) => updateLogic({
                      privateWorkflow: { ...config.logic.privateWorkflow, emailRequired: e.target.checked }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: '#075E54' }}
                  />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Campo obligatorio
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset to Defaults Button */}
      {!hasChanges && (
        <>
          <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
          <div className="space-y-4">
            <button
              onClick={onResetToDefaults}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <RotateCcw size={16} />
              <span>Restablecer a Valores por Defecto</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogicConfigTab;
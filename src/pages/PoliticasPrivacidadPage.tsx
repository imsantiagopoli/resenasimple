import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PoliticasPrivacidadPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-sm mb-8 transition-colors duration-200"
          style={{ color: '#075E54' }}
        >
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </button>

        <div className="flex items-center space-x-3 mb-8">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#075E54' + '20' }}
          >
            <Shield size={24} style={{ color: '#075E54' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#161616' }}>
              Políticas de Privacidad
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
              Última actualización: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              1. Introducción
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              En Reseña Simple, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos,
              usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma de gestión de reseñas
              y feedback para restaurantes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              2. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              2.1 Información de Cuenta
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Nombre completo y correo electrónico</li>
              <li>Información de autenticación (contraseña encriptada)</li>
              <li>Información del negocio (nombre, dirección, teléfono)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              2.2 Información de Clientes
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Nombre (opcional)</li>
              <li>Correo electrónico (opcional)</li>
              <li>Número de teléfono (opcional)</li>
              <li>Calificaciones y comentarios de feedback</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              2.3 Información de Google My Business
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Tokens de acceso OAuth (encriptados)</li>
              <li>Información de ubicaciones de Google My Business</li>
              <li>Reseñas públicas de Google</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              2.4 Información Técnica
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Dirección IP y datos de navegación</li>
              <li>Tipo de dispositivo y navegador</li>
              <li>Registros de actividad en la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              3. Cómo Usamos tu Información
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Gestionar tu cuenta y autenticación</li>
              <li>Sincronizar y mostrar reseñas de Google My Business</li>
              <li>Procesar y almacenar feedback de clientes</li>
              <li>Enviar notificaciones sobre el servicio</li>
              <li>Mejorar y optimizar la plataforma</li>
              <li>Prevenir fraude y garantizar la seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              4. Compartir Información
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              No vendemos ni alquilamos tu información personal. Compartimos información únicamente en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li><strong>Con Google:</strong> Al conectar Google My Business, compartimos información necesaria para la integración</li>
              <li><strong>Proveedores de servicios:</strong> Supabase para hosting y base de datos</li>
              <li><strong>Requisitos legales:</strong> Cuando sea requerido por ley o autoridades</li>
              <li><strong>Con tu consentimiento:</strong> En cualquier otro caso con tu autorización explícita</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              5. Seguridad de Datos
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Encriptación de datos en tránsito (HTTPS/TLS)</li>
              <li>Encriptación de datos en reposo</li>
              <li>Autenticación segura con Supabase Auth</li>
              <li>Row Level Security (RLS) en base de datos</li>
              <li>Tokens OAuth almacenados de forma segura</li>
              <li>Acceso restringido a datos personales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              6. Retención de Datos
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Conservamos tu información personal durante el tiempo que mantengas tu cuenta activa o según sea necesario
              para proporcionarte servicios. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              7. Tus Derechos
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Exportar tus datos</li>
              <li>Retirar el consentimiento en cualquier momento</li>
              <li>Presentar una queja ante la autoridad de protección de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              8. Cookies y Tecnologías Similares
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Utilizamos cookies y tecnologías similares para mantener tu sesión activa, mejorar la experiencia de usuario
              y analizar el uso de la plataforma. Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              9. Cambios a esta Política
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos
              publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              10. Contacto
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos, contáctanos:
            </p>
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
              <p className="text-base" style={{ color: 'rgb(75, 85, 99)' }}>
                <strong>Email:</strong> privacidad@resenasimple.com<br />
                <strong>Sitio web:</strong> www.resenasimple.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PoliticasPrivacidadPage;

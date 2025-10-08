import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TerminosCondicionesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Términos y Condiciones - Reseña Simple"
        description="Lee los términos y condiciones de uso de Reseña Simple. Conoce tus derechos y obligaciones al usar nuestra plataforma."
        url="https://resenasimple.com/terminos-y-condiciones"
      />
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
            <FileText size={24} style={{ color: '#075E54' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#161616' }}>
              Términos y Condiciones
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
              Última actualización: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              1. Aceptación de los Términos
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Al acceder y utilizar Reseña Simple, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de
              acuerdo con alguna parte de estos términos, no debes utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              2. Descripción del Servicio
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Reseña Simple es una plataforma que permite a restaurantes y negocios:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Recopilar feedback de clientes a través de códigos QR y páginas de votación</li>
              <li>Gestionar y responder a reseñas de Google My Business</li>
              <li>Analizar métricas de satisfacción del cliente</li>
              <li>Generar reportes y análisis de rendimiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              3. Registro y Cuenta de Usuario
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              3.1 Elegibilidad
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Para usar Reseña Simple, debes ser mayor de edad y tener la capacidad legal para celebrar contratos vinculantes.
              Debes ser propietario o representante autorizado del negocio que registras.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              3.2 Información de Cuenta
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Te comprometes a proporcionar información precisa, actual y completa durante el proceso de registro y a
              mantener actualizada esta información. Eres responsable de mantener la confidencialidad de tu contraseña
              y de todas las actividades que ocurran bajo tu cuenta.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              3.3 Seguridad de la Cuenta
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Debes notificarnos inmediatamente de cualquier uso no autorizado de tu cuenta o cualquier otra violación
              de seguridad. No seremos responsables de ninguna pérdida o daño derivado de tu incumplimiento de mantener
              segura tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              4. Uso Aceptable
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              4.1 Conductas Permitidas
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Puedes utilizar Reseña Simple para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Recopilar feedback legítimo de tus clientes</li>
              <li>Gestionar reseñas de tu negocio verificado</li>
              <li>Analizar datos de satisfacción del cliente</li>
              <li>Mejorar la experiencia de tus clientes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              4.2 Conductas Prohibidas
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              No puedes utilizar Reseña Simple para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Manipular o falsificar reseñas o calificaciones</li>
              <li>Enviar spam o contenido no solicitado</li>
              <li>Violar derechos de propiedad intelectual</li>
              <li>Transmitir malware o código malicioso</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Realizar ingeniería inversa de la plataforma</li>
              <li>Violar las políticas de Google My Business</li>
              <li>Recopilar datos de usuarios sin consentimiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              5. Integración con Google My Business
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              5.1 Autorización
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Al conectar tu cuenta de Google My Business, nos autorizas a acceder, sincronizar y gestionar tus reseñas
              y ubicaciones de Google en tu nombre.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              5.2 Cumplimiento de Políticas de Google
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Te comprometes a cumplir con las políticas y términos de servicio de Google My Business. Cualquier violación
              puede resultar en la suspensión de tu cuenta de Reseña Simple.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              5.3 Revocación de Acceso
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Puedes revocar el acceso de Reseña Simple a tu cuenta de Google en cualquier momento desde la configuración
              de tu cuenta o desde la configuración de seguridad de Google.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              6. Propiedad Intelectual
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Reseña Simple y todo su contenido, características y funcionalidades son propiedad de Reseña Simple y están
              protegidos por leyes internacionales de derechos de autor, marca registrada y otros derechos de propiedad
              intelectual.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Mantienes todos los derechos sobre el contenido que subas o crees en la plataforma (información del negocio,
              respuestas a reseñas, etc.). Al usar el servicio, nos otorgas una licencia limitada para usar, almacenar y
              mostrar ese contenido según sea necesario para proporcionar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              7. Pagos y Suscripciones
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              7.1 Planes de Suscripción
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Reseña Simple ofrece diferentes planes de suscripción. Los precios, características y términos de cada plan
              se detallan en nuestra página de precios.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              7.2 Facturación
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Las suscripciones se facturan por adelantado de forma mensual o anual. Los cargos no son reembolsables
              excepto cuando lo exija la ley.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: '#161616' }}>
              7.3 Cancelación
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta. La cancelación
              será efectiva al final del período de facturación actual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              8. Limitación de Responsabilidad
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              El servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>El servicio será ininterrumpido o libre de errores</li>
              <li>Los resultados obtenidos serán precisos o confiables</li>
              <li>Todos los errores serán corregidos</li>
            </ul>
            <p className="text-base leading-relaxed mt-4" style={{ color: 'rgb(75, 85, 99)' }}>
              En ningún caso seremos responsables de daños directos, indirectos, incidentales, especiales o consecuentes
              que resulten del uso o la imposibilidad de usar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              9. Modificaciones del Servicio y Términos
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento, con o sin previo aviso.
              También podemos modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor cuando
              se publiquen en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              10. Terminación
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
              Podemos suspender o terminar tu acceso a Reseña Simple inmediatamente, sin previo aviso, por cualquier motivo,
              incluyendo pero no limitado a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base" style={{ color: 'rgb(75, 85, 99)' }}>
              <li>Violación de estos Términos y Condiciones</li>
              <li>Actividad fraudulenta o ilegal</li>
              <li>Falta de pago</li>
              <li>A solicitud tuya</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              11. Ley Aplicable
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta sus
              disposiciones sobre conflictos de leyes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              12. Contacto
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos:
            </p>
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
              <p className="text-base" style={{ color: 'rgb(75, 85, 99)' }}>
                <strong>Email:</strong> soporte@resenasimple.com<br />
                <strong>Sitio web:</strong> www.resenasimple.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#161616' }}>
              13. Disposiciones Generales
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
              Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes
              permanecerán en pleno vigor y efecto. Estos términos constituyen el acuerdo completo entre tú y Reseña Simple
              con respecto al uso del servicio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondicionesPage;

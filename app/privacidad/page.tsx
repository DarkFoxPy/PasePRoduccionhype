import { GlassCard } from "@/components/ui/glass-card"
import Image from "next/image"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b border-gray-300 pb-6">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <Image
                src="/logo-hype.png"
                alt="Hype Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">POLÍTICAS DE PRIVACIDAD</h1>
            <p className="text-gray-600 text-lg">Hype Events Platform</p>
            <p className="text-sm text-gray-500 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Contenido */}
          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">1. INTRODUCCIÓN</h2>
              <p className="text-base leading-relaxed text-gray-700">
                En Hype Events Platform, valoramos y respetamos tu privacidad. Estas Políticas de Privacidad describen cómo recopilamos, usamos, divulgamos y protegemos tu información personal cuando utilizas nuestros servicios de registro y gestión de eventos.
              </p>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Al utilizar nuestros servicios, aceptas las prácticas descritas en estas políticas. Te recomendamos leer detenidamente este documento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">2. INFORMACIÓN QUE RECOPILAMOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Recopilamos los siguientes tipos de información personal:
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">2.1. Información de Identificación Personal</h3>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 space-y-2">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Fecha de nacimiento (para verificación de edad)</li>
                <li>Documento de identificación (cuando sea requerido por el evento)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">2.2. Información de Registro en Eventos</h3>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 space-y-2">
                <li>Preferencias y intereses en eventos</li>
                <li>Respuestas a formularios personalizados</li>
                <li>Requerimientos especiales (accesibilidad, dieta, etc.)</li>
                <li>Historial de participación en eventos</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">2.3. Información Técnica</h3>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 space-y-2">
                <li>Dirección IP y tipo de dispositivo</li>
                <li>Información del navegador y sistema operativo</li>
                <li>Registros de actividad en la plataforma</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">3. FINALIDAD DEL TRATAMIENTO DE DATOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Utilizamos tu información personal para los siguientes propósitos:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li><strong>Gestión de Eventos:</strong> Procesar registros, confirmaciones y participación</li>
                <li><strong>Comunicación:</strong> Enviar actualizaciones, recordatorios e información relevante</li>
                <li><strong>Mejora de Servicios:</strong> Analizar uso y preferencias para optimizar experiencia</li>
                <li><strong>Seguridad:</strong> Prevenir fraudes y actividades no autorizadas</li>
                <li><strong>Cumplimiento Legal:</strong> Atender obligaciones regulatorias y legales</li>
                <li><strong>Marketing:</strong> Informar sobre eventos futuros y servicios relacionados (con tu consentimiento)</li>
                <li><strong>Personalización:</strong> Ofrecer recomendaciones de eventos basadas en tus intereses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">4. BASES LEGALES PARA EL TRATAMIENTO</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Procesamos tu información personal basándonos en las siguientes bases legales:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li><strong>Consentimiento:</strong> Cuando nos das tu autorización explícita</li>
                <li><strong>Ejecución de Contrato:</strong> Para proporcionarte los servicios solicitados</li>
                <li><strong>Interés Legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
                <li><strong>Cumplimiento Legal:</strong> Cuando es requerido por leyes aplicables</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">5. COMPARTIR INFORMACIÓN CON TERCEROS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Podemos compartir tu información personal en los siguientes casos:
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">5.1. Organizadores de Eventos</h3>
              <p className="text-base leading-relaxed text-gray-700">
                Compartimos información relevante con los organizadores de eventos específicos para los que te registras, limitada a lo necesario para tu participación.
              </p>

              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">5.2. Proveedores de Servicios</h3>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 space-y-2">
                <li>Plataformas de procesamiento de pagos</li>
                <li>Servicios de hosting y almacenamiento en la nube</li>
                <li>Herramientas de análisis y marketing</li>
                <li>Servicios de comunicación por email y SMS</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">5.3. Requisitos Legales</h3>
              <p className="text-base leading-relaxed text-gray-700">
                Cuando sea requerido por ley, orden judicial o procedimiento legal.
              </p>

              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-500">5.4. Transferencias Empresariales</h3>
              <p className="text-base leading-relaxed text-gray-700">
                En caso de fusión, adquisición o venta de activos, tu información puede ser transferida.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">6. PROTECCIÓN Y SEGURIDAD DE DATOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Control de acceso basado en roles</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Protocolos de respuesta a incidentes</li>
                <li>Evaluaciones regulares de vulnerabilidades</li>
                <li>Backups seguros y planes de recuperación</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">7. CONSERVACIÓN DE DATOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Conservamos tu información personal durante el tiempo necesario para cumplir con los fines descritos en estas políticas, considerando:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Duración de la relación comercial</li>
                <li>Requerimientos legales y regulatorios</li>
                <li>Plazos de prescripción legal</li>
                <li>Necesidades de negocio legítimas</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Generalmente, conservamos los datos de registro por 3 años después de tu última interacción, a menos que la ley requiera un período diferente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">8. TUS DERECHOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Tienes los siguientes derechos sobre tus datos personales:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li><strong>Derecho de Acceso:</strong> Conocer qué información tenemos sobre ti</li>
                <li><strong>Derecho de Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Derecho de Supresión:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Derecho de Oposición:</strong> Oponerte al tratamiento de tus datos</li>
                <li><strong>Derecho de Limitación:</strong> Solicitar la limitación del tratamiento</li>
                <li><strong>Derecho de Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Derecho de Retiro del Consentimiento:</strong> Revocar consentimientos dados</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Para ejercer estos derechos, contáctanos en privacy@hypeevents.com. Responderemos dentro de los 30 días hábiles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">9. COOKIES Y TECNOLOGÍAS SIMILARES</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Mejorar la funcionalidad de nuestro sitio web</li>
                <li>Recordar tus preferencias y configuraciones</li>
                <li>Analizar el uso y rendimiento de nuestra plataforma</li>
                <li>Personalizar contenido y anuncios</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">10. TRANSFERENCIAS INTERNACIONALES</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Tus datos pueden ser transferidos y procesados en países fuera de tu jurisdicción. En tales casos, garantizamos que se implementan medidas de protección adecuadas, como cláusulas contractuales estándar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">11. MENORES DE EDAD</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si eres padre/madre y crees que tu hijo nos ha proporcionado información, contáctanos inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">12. CAMBIOS EN ESTAS POLÍTICAS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Podemos actualizar estas Políticas de Privacidad periódicamente. Te notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web o por correo electrónico. La fecha de última actualización se indica al inicio de este documento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">13. CONTACTO Y AUTORIDADES SUPERVISORAS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Si tienes preguntas, preocupaciones o quieres ejercer tus derechos sobre estas Políticas de Privacidad:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-base text-gray-700"><strong>Oficial de Privacidad:</strong> Departamento de Protección de Datos</p>
                <p className="text-base text-gray-700"><strong>Email:</strong> privacy@hypeevents.com</p>
                <p className="text-base text-gray-700"><strong>Teléfono:</strong> + (595) 971615847-PRIVACY</p>
                <p className="text-base text-gray-700"><strong>Dirección:</strong> Oficinas Virtuales de HYPE</p>
                <p className="text-base text-gray-700"><strong>Horario de atención:</strong> Lunes a Viernes de 8:00 AM a 6:00 PM Hora local(Paraguay)</p>
              </div>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Tienes derecho a presentar una queja ante la autoridad de protección de datos de tu jurisdicción si consideras que el tratamiento de tus datos personales infringe la legislación aplicable.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              Documento generado electrónicamente - Hype Events Platform © {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Versión 2.1 - Todas las actualizaciones están disponibles en nuestro sitio web.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
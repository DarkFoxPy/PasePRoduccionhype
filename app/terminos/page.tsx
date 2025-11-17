import { GlassCard } from "@/components/ui/glass-card"
import Image from "next/image"

export default function TerminosPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TÉRMINOS Y CONDICIONES</h1>
            <p className="text-gray-600 text-lg">Hype Events Platform</p>
            <p className="text-sm text-gray-500 mt-4">Última actualización: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Contenido */}
          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Al registrarte y participar en eventos a través de Hype Events Platform, aceptas cumplir y estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">2. REGISTRO Y CUENTA</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Para registrarte en nuestros eventos, debes:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Proporcionar información veraz, exacta y completa</li>
                <li>Ser mayor de 18 años o contar con autorización parental</li>
                <li>Mantener la confidencialidad de tu información de acceso</li>
                <li>Aceptar nuestras Políticas de Privacidad</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">3. REGISTRO EN EVENTOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                El registro en eventos está sujeto a disponibilidad. Nos reservamos el derecho de:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Limitar el número de participantes por evento</li>
                <li>Cancelar o modificar eventos por causas de fuerza mayor</li>
                <li>Rechazar registros que no cumplan con los requisitos específicos del evento</li>
                <li>Modificar programas, horarios y ubicaciones de eventos</li>
                <li>Establecer criterios de elegibilidad para eventos específicos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">4. POLÍTICA DE CANCELACIÓN Y REEMBOLSO</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Las cancelaciones de registro están sujetas a las siguientes condiciones:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li><strong>Cancelaciones con 72 horas de anticipación:</strong> Reembolso del 100%</li>
                <li><strong>Cancelaciones con 48 horas de anticipación:</strong> Reembolso del 50%</li>
                <li><strong>Cancelaciones con menos de 24 horas:</strong> No hay reembolso</li>
                <li><strong>Eventos gratuitos:</strong> Cancelación sin penalización con 24 horas de anticipación</li>
                <li><strong>Eventos cancelados por el organizador:</strong> Reembolso completo</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Los reembolsos se procesarán dentro de los 7-10 días hábiles siguientes a la solicitud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">5. CONDUCTA EN EVENTOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Los participantes deben mantener una conducta apropiada y respetuosa durante los eventos. No se permite:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Comportamiento disruptivo, ofensivo o acosador</li>
                <li>Uso de lenguaje inapropiado, discriminatorio o violento</li>
                <li>Actividades comerciales no autorizadas</li>
                <li>Grabación, fotografía o transmisión sin autorización expresa</li>
                <li>Distribución de material promocional no autorizado</li>
                <li>Cualquier acción que viole derechos de terceros o leyes aplicables</li>
                <li>Consumo de alcohol o sustancias prohibidas en eventos familiares</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                El incumplimiento de estas normas puede resultar en la expulsión inmediata del evento sin derecho a reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">6. PROPIEDAD INTELECTUAL</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Todo el contenido, logotipos, materiales, presentaciones y recursos proporcionados durante los eventos son propiedad de Hype Events o de los respectivos titulares de derechos. Queda estrictamente prohibida:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Reproducción, distribución o uso comercial sin autorización expresa</li>
                <li>Modificación de materiales protegidos por derechos de autor</li>
                <li>Uso del nombre o logotipo de Hype Events sin permiso</li>
                <li>Creación de obras derivadas basadas en nuestro contenido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">7. LIMITACIÓN DE RESPONSABILIDAD</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Hype Events no será responsable por:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Daños o pérdidas derivadas del uso o incapacidad de usar nuestros servicios</li>
                <li>Cancelaciones o modificaciones de eventos por causas beyond our control (clima, desastres naturales, etc.)</li>
                <li>Información, opiniones o consejos proporcionados por ponentes o terceros en eventos</li>
                <li>Problemas técnicos en plataformas de terceros utilizadas para eventos virtuales</li>
                <li>Pérdida o daño de pertenencias personales durante eventos presenciales</li>
                <li>Lesiones personales ocurridas durante la participación en eventos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">8. PROTECCIÓN DE DATOS PERSONALES</h2>
              <p className="text-base leading-relaxed text-gray-700">
                El tratamiento de tus datos personales se realiza de acuerdo con nuestra Política de Privacidad. Al aceptar estos términos, autorizas el tratamiento de tus datos para los fines establecidos en dicha política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">9. MODIFICACIONES DE LOS TÉRMINOS</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. El uso continuado de nuestros servicios constituye la aceptación de los términos modificados.
              </p>
              <p className="text-base leading-relaxed text-gray-700 mt-3">
                Notificaremos sobre cambios significativos a través de nuestro sitio web o por correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">10. TERMINACIÓN</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Podemos suspender o terminar tu acceso a nuestros servicios si:
              </p>
              <ul className="list-disc list-inside text-base leading-relaxed text-gray-700 mt-3 space-y-2">
                <li>Incumples estos Términos y Condiciones</li>
                <li>Realizas actividades fraudulentas o ilegales</li>
                <li>Provocas daños a otros usuarios o a nuestra plataforma</li>
                <li>Violas derechos de propiedad intelectual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">11. LEY APLICABLE Y JURISDICCIÓN</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Estos Términos y Condiciones se rigen por las leyes de la República del país donde se realiza el evento. Cualquier disputa o reclamación derivada de o en conexión con estos términos será resuelta en los tribunales competentes de dicha jurisdicción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">12. DISPOSICIONES GENERALES</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Si cualquier disposición de estos términos es considerada inválida o inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto. Nuestra falta de ejercer o hacer valer cualquier derecho o disposición de estos términos no constituirá una renuncia a dicho derecho o disposición.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">13. CONTACTO</h2>
              <p className="text-base leading-relaxed text-gray-700">
                Para consultas, aclaraciones o ejercicio de derechos sobre estos Términos y Condiciones:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-base text-gray-700"><strong>Oficial de Privacidad:</strong> Departamento de Protección de Datos</p>
                <p className="text-base text-gray-700"><strong>Email:</strong> legal@hypeevents.com</p>
                <p className="text-base text-gray-700"><strong>Teléfono:</strong> + (595) 971615847-PRIVACY</p>
                <p className="text-base text-gray-700"><strong>Dirección:</strong> Oficinas Virtuales de HYPE</p>
                <p className="text-base text-gray-700"><strong>Horario de atención:</strong> Lunes a Viernes de 8:00 AM a 6:00 PM Hora local(Paraguay)</p>
                </div>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              Documento generado electrónicamente - Hype Events Platform © {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Todos los derechos reservados. Queda prohibida la reproducción total o parcial sin autorización expresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
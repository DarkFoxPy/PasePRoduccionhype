"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ScheduleManager } from "@/components/schedule/schedule-manager"
import { ArrowLeft, Save, Upload } from "lucide-react"
import toast from "react-hot-toast"
import type { ScheduleItem } from "@/lib/types"

export default function EventSchedulePage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById, updateEvent } = useEventsStore()
  const [event, setEvent] = useState<any>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(params.id as string)
      if (eventData) {
        setEvent(eventData)
        setSchedule(eventData.schedule || [])
      }
      setLoading(false)
    }

    if (isAuthenticated) {
      loadEvent()
    } else {
      router.push("/login")
    }
  }, [params.id, isAuthenticated])

  const handleSave = async () => {
    if (!event) return

    setSaving(true)
    try {
      await updateEvent(event.id, { schedule })
      toast.success("Cronograma guardado exitosamente")
      router.push(`/events/${event.slug}/${event.id}`)
    } catch (error) {
      toast.error("Error al guardar el cronograma")
    } finally {
      setSaving(false)
    }
  }

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string
        const importedSchedule = JSON.parse(jsonContent) as ScheduleItem[]
        
        // Validar que sea un array
        if (!Array.isArray(importedSchedule)) {
          toast.error("El archivo JSON debe contener un array de eventos")
          return
        }

        // Validar estructura básica
        const isValid = importedSchedule.every(item => 
          item.day && item.time && item.title
        )

        if (!isValid) {
          toast.error("El archivo JSON tiene un formato incorrecto. Cada evento debe tener day, time y title")
          return
        }

        setSchedule(importedSchedule)
        toast.success(`Cronograma importado: ${importedSchedule.length} eventos cargados`)
      } catch (error) {
        toast.error("Error al procesar el archivo JSON. Verifica el formato.")
        console.error("Error parsing JSON:", error)
      }
    }
    reader.readAsText(file)
    
    // Limpiar el input para permitir subir el mismo archivo otra vez
    event.target.value = ''
  }

  const handleExportJSON = () => {
    if (schedule.length === 0) {
      toast.error("No hay eventos para exportar")
      return
    }

    const jsonString = JSON.stringify(schedule, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cronograma-${event.title}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Cronograma exportado exitosamente")
  }

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#a0d2ff]">Cargando...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  if (!event || event.organizerId !== user?.id) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="text-center">
            <h2 className="text-2xl font-bold text-[#ffddff] mb-2">Acceso denegado</h2>
            <p className="text-[#a0d2ff] mb-4">No tienes permiso para editar este evento</p>
            <GradientButton onClick={() => router.back()}>Volver</GradientButton>
          </GlassCard>
        </div>
      </FuturisticBackground>
    )
  }

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/events/${event.slug}/${event.id}`)}
                  className="p-2 hover:bg-surface rounded-lg transition-colors text-[#ffddff] hover:text-[#ffffff]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-[#ffddff]">Gestionar Cronograma</h1>
                  <p className="text-[#a0d2ff]">{event.title}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {/* Botón Importar JSON */}
                <label className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-semibold hover:shadow-lg hover:shadow-[#f1c6ff]/50 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Importar JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>


                {/* Botón Guardar */}
                <GradientButton onClick={handleSave} loading={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Cronograma
                </GradientButton>
              </div>
            </div>

            {/* Info Card */}
            <GlassCard glow="primary">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff]">
                  <Upload className="w-6 h-6 text-[#1e1732]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#ffffff] mb-2">Importar/Exportar Cronograma JSON</h3>
                  <p className="text-sm text-[#a0d2ff] mb-3">
                    Puedes importar un archivo JSON con el formato especificado o exportar el cronograma actual.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#1e1732]/50 p-4 rounded-lg">
                      <h4 className="text-[#ffddff] font-semibold mb-2">Para importar:</h4>
                      <ul className="text-sm text-[#a0d2ff] space-y-1">
                        <li>• Haz clic en "Importar JSON"</li>
                        <li>• Selecciona tu archivo .json</li>
                        <li>• El sistema validará el formato</li>
                        <li>• Los eventos se cargarán automáticamente</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#1e1732]/50 p-4 rounded-lg">
                      <h4 className="text-[#ffddff] font-semibold mb-2">Para exportar:</h4>
                      <ul className="text-sm text-[#a0d2ff] space-y-1">
                        <li>• Haz clic en "Exportar JSON"</li>
                        <li>• Se descargará un archivo .json</li>
                        <li>• Puedes usarlo como backup</li>
                        <li>• O importarlo en otro evento</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[#1e1732]/70 p-4 rounded-lg border border-[#f1c6ff]/30">
                    <h4 className="text-[#ffddff] font-semibold mb-2">Formato JSON requerido:</h4>
                    <pre className="text-xs text-[#ffffff] overflow-x-auto">
{`[
  {
    "day": 1,
    "time": "09:00",
    "title": "Registro y bienvenida",
    "description": "Recepción de asistentes",
    "location": "Hall Principal",
    "speaker": "Equipo organizador"
  },
  {
    "day": 1, 
    "time": "10:00",
    "title": "Conferencia inaugural",
    "description": "Presentación del evento",
    "location": "Auditorio", 
    "speaker": "Dr. Juan Pérez"
  }
]`}
                    </pre>
                    <p className="text-xs text-[#a0d2ff] mt-2">
                      <strong>Campos obligatorios:</strong> day, time, title
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Schedule Manager */}
            <ScheduleManager schedule={schedule} onChange={setSchedule} eventDurationDays={event.durationDays || 1} />
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEventsStore } from "@/lib/stores/events-store"
import { Badge } from "@/components/ui/badge"

export default function FormResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { events, getEventById } = useEventsStore()
  const [responses, setResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [event, setEvent] = useState<any>(null)

  // Cargar evento específico en lugar de buscarlo en el store
  useEffect(() => {
    const loadEvent = async () => {
      if (params.id) {
        console.log("[DEBUG] Loading event with ID:", params.id)
        const eventData = await getEventById(params.id as string)
        console.log("[DEBUG] Event loaded:", eventData)
        setEvent(eventData)
      }
    }

    loadEvent()
  }, [params.id, getEventById])

  useEffect(() => {
    console.log("[DEBUG] Params:", params)
    console.log("[DEBUG] Event ID from params:", params.id)
    console.log("[DEBUG] All events in store:", events)
    console.log("[DEBUG] Current event state:", event)

    const fetchResponses = async () => {
      if (!params.id) {
        setIsLoading(false)
        return
      }

      try {
        const url = `/api/form-responses?eventId=${params.id}`
        console.log("[DEBUG] Fetching from:", url)
        
        const response = await fetch(url)
        console.log("[DEBUG] Response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("[DEBUG] API response data:", data)
          setResponses(data.responses || [])
          
          // Si no tenemos evento, usar el de la respuesta
          if (!event && data.event) {
            setEvent(data.event)
          }
        } else {
          const errorText = await response.text()
          console.error("[DEBUG] API error:", response.status, errorText)
          toast({
            title: "Error",
            description: "No se pudieron cargar los registros",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[DEBUG] Fetch error:", error)
        toast({
          title: "Error",
          description: "Error al cargar los registros",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchResponses()
    }
  }, [params.id, events, event, toast])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csvContent = generateCSV()
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `registrados-${event?.title || "evento"}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: "Los registros se han descargado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const generateCSV = () => {
    if (responses.length === 0) return ""

    // Get all unique field keys from custom responses
    const allKeys = new Set<string>()
    responses.forEach((response) => {
      const parsedResponses = response.responses || {}
      Object.keys(parsedResponses).forEach((key) => allKeys.add(key))
    })

    const headers = ["Fecha de Registro", "Estado", "Nombre", "Email", "Teléfono", ...Array.from(allKeys)]
    const rows = responses.map((response) => {
      const parsedResponses = response.responses || {}
      const row = [
        new Date(response.registered_at).toLocaleString("es-ES"),
        response.status || "approved",
        response.user_name || "-",
        response.user_email || "-",
        response.phone || "-",
      ]
      allKeys.forEach((key) => {
        const value = parsedResponses[key]
        row.push(value ? String(value) : "-")
      })
      return row
    })

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Cargando registros...</span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center text-white/60 bg-surface/50 border-border/50">
          <p>Evento no encontrado</p>
          <Button 
            onClick={() => router.push("/events")} 
            className="mt-4"
          >
            Volver a eventos
          </Button>
        </Card>
      </div>
    )
  }

  const formFields = event.customFormFields || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/events/${params.slug}/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al evento
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Registrados al evento</h1>
            <p className="text-white/60">{event.title}</p>
          </div>
        </div>
        <Button onClick={handleExport} disabled={isExporting || responses.length === 0}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Exportar CSV ({responses.length})
        </Button>
      </div>

      {responses.length === 0 ? (
        <Card className="p-8 text-center text-white/60 bg-surface/50 border-border/50">
          <p>No hay registros aún para este evento.</p>
          <p className="text-sm mt-2">Los registros aparecerán aquí cuando los usuarios se registren.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-white/60">Total de registrados: {responses.length}</p>
          {responses.map((response, index) => {
            const parsedResponses = response.responses || {}

            return (
              <Card key={response.id} className="p-6 bg-surface/50 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-white">Registro #{index + 1}</h3>
                    <Badge className={getStatusColor(response.status)}>{getStatusLabel(response.status)}</Badge>
                  </div>
                  <p className="text-sm text-white/60">
                    {new Date(response.registered_at).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-white/60">Nombre</p>
                    <p className="mt-1 text-white">{response.user_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">Email</p>
                    <p className="mt-1 text-white">{response.user_email || "-"}</p>
                  </div>
                  {response.phone && (
                    <div>
                      <p className="text-sm font-medium text-white/60">Teléfono</p>
                      <p className="mt-1 text-white">{response.phone}</p>
                    </div>
                  )}
                  {Object.keys(parsedResponses).length > 0 && (
                    <>
                      <div className="border-t border-border/30 my-4 pt-4">
                        <p className="text-sm font-semibold text-white/80 mb-3">Respuestas del formulario</p>
                      </div>
                      {Object.entries(parsedResponses).map(([key, value]) => {
                        // Find the field label from customFormFields
                        const field = formFields.find((f) => f.id === key)
                        const label = field?.label || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

                        return (
                          <div key={key}>
                            <p className="text-sm font-medium text-white/60">{label}</p>
                            <p className="mt-1 text-white">{Array.isArray(value) ? value.join(", ") : value || "-"}</p>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
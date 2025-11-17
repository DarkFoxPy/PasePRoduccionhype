"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ArrowLeft, MapPin, Video, HelpCircle, Infinity, Save, Settings, Image, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { ImageUploader } from "@/components/media/image-uploader"
import { GalleryUploader } from "@/components/media/gallery-uploader"
import { EnhancedFormBuilder } from "@/components/forms/enhanced-form-builder"
import Link from "next/link"

const CATEGORIES = ["Conferencia", "Concierto", "Exposición", "Networking", "Taller", "Deportivo", "Cultural", "Otro"]

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById, updateEvent } = useEventsStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [durationDays, setDurationDays] = useState(0)
  const [dateError, setDateError] = useState("")
  const [activeSection, setActiveSection] = useState("basic")

  // Estado para el formulario principal
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    capacity: 200,
    unlimitedCapacity: false,
    isPublic: true,
    requiresApproval: false,
    eventType: "no-definido" as "presencial" | "virtual" | "no-definido",
    eventLink: "",
    hasCustomForm: false,
    aboutEvent: "",
  })

  // Estados separados para componentes que no deben guardar automáticamente
  const [coverImage, setCoverImage] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [customFormFields, setCustomFormFields] = useState<any[]>([])

  const formatDateTimeForInput = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadEvent = async () => {
      try {
        const eventData = await getEventById(params.id as string)

        if (!eventData) {
          toast.error("Evento no encontrado")
          router.push("/events")
          return
        }

        if (eventData.organizerId !== user?.id) {
          toast.error("No tienes permiso para editar este evento")
          router.push("/events")
          return
        }

        setEvent(eventData)
        
        console.log("📥 Datos del evento cargados:", eventData)
        
        // Para eventos virtuales, establecer ubicación como "Este evento es virtual"
        const locationValue = eventData.eventType === "virtual" 
          ? "Este evento es virtual" 
          : eventData.location || ""

        // Cargar datos del formulario principal - SOLO usar eventLink para ambos casos
        setFormData({
          title: eventData.title || "",
          description: eventData.description || "",
          startDate: formatDateTimeForInput(eventData.startDate),
          endDate: formatDateTimeForInput(eventData.endDate),
          location: locationValue,
          category: eventData.category || "",
          capacity: eventData.capacity || 200,
          unlimitedCapacity: eventData.unlimitedCapacity || false,
          isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
          requiresApproval: eventData.requiresApproval || false,
          eventType: eventData.eventType || "no-definido",
          eventLink: eventData.eventLink || "", // ÚNICO campo para enlaces
          hasCustomForm: eventData.hasCustomForm || false,
          aboutEvent: eventData.aboutEvent || "",
        })

        // Cargar datos separados
        setCoverImage(eventData.coverImage || "")
        setGalleryImages(eventData.galleryImages || [])
        setVideos(eventData.videos || [])
        setCustomFormFields(eventData.customFormFields || [])

        const start = new Date(eventData.startDate)
        const end = new Date(eventData.endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        setDurationDays(days)

        setLoading(false)
      } catch (error) {
        console.error("❌ Error cargando evento:", error)
        toast.error("Error al cargar el evento")
        router.push("/events")
      }
    }

    loadEvent()
  }, [isAuthenticated, user, params.id, router])

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const now = new Date()

      setDateError("")

      if (end < start) {
        setDateError("La fecha de fin no puede ser anterior a la fecha de inicio")
        return
      }

      if (start < now && end < now) {
        setDateError("Si el evento ya comenzó, la fecha de fin debe ser igual o posterior a hoy")
        return
      }

      const startDate = new Date(start)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(end)
      endDate.setHours(0, 0, 0, 0)

      const diffTime = endDate.getTime() - startDate.getTime()
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      setDurationDays(days)
    }
  }, [formData.startDate, formData.endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const startDateTime = new Date(formData.startDate)
      const endDateTime = new Date(formData.endDate)
      const now = new Date()

      if (endDateTime < startDateTime) {
        toast.error("La fecha de fin no puede ser anterior a la fecha de inicio")
        setSaving(false)
        return
      }

      if (startDateTime < now && endDateTime < now) {
        toast.error("La fecha de fin no puede ser menor al día actual")
        setSaving(false)
        return
      }

      if (formData.eventType === "presencial" && !formData.location.trim()) {
        toast.error("La ubicación es obligatoria para eventos presenciales")
        setSaving(false)
        return
      }

      if (formData.eventType === "virtual" && !formData.eventLink.trim()) {
        toast.error("El enlace del evento es obligatorio para eventos virtuales")
        setSaving(false)
        return
      }

      console.log("💾 Guardando datos:", formData)

      // Combinar todos los datos al guardar - SOLO usar eventLink
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        eventType: formData.eventType,
        category: formData.category,
        capacity: formData.capacity,
        unlimitedCapacity: formData.unlimitedCapacity,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        aboutEvent: formData.aboutEvent,
        coverImage: coverImage,
        galleryImages: galleryImages,
        videos: videos,
        hasCustomForm: formData.hasCustomForm,
        customFormFields: customFormFields,
        eventLink: formData.eventLink, // SIEMPRE guardar en eventLink
      }

      // Para eventos presenciales, guardar location normal
      // Para eventos virtuales, guardar "Este evento es virtual" en location
      if (formData.eventType === "presencial") {
        updateData.location = formData.location
      } else if (formData.eventType === "virtual") {
        updateData.location = "Este evento es virtual"
      } else {
        updateData.location = "" // Para no definido, limpiar location
      }

      await updateEvent(params.id as string, updateData)

      toast.success("Evento actualizado exitosamente")
      router.push("/events")
    } catch (error) {
      console.error("❌ Error actualizando evento:", error)
      toast.error("Error al actualizar el evento")
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Función para cambiar tipo de evento
  const handleEventTypeChange = (type: "presencial" | "virtual" | "no-definido") => {
    console.log("🔄 Cambiando tipo de evento a:", type)
    
    if (type === "presencial") {
      updateFormData({ 
        eventType: type,
        location: "" // Limpiar para que el usuario ingrese nueva ubicación
      })
    } else if (type === "virtual") {
      updateFormData({ 
        eventType: type, 
        location: "Este evento es virtual" // Establecer texto fijo
      })
    } else {
      updateFormData({ 
        eventType: type, 
        location: "",
        eventLink: ""
      })
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1c6ff] mx-auto mb-4"></div>
            <p className="text-[#a0d2ff]">Cargando evento...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  const navigationItems = [
    { id: "basic", label: "Información Básica", icon: FileText },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "multimedia", label: "Multimedia", icon: Image },
    { id: "form", label: "Formulario", icon: FileText },
  ]

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link href="/events">
                <button className="p-2 rounded-lg bg-[#1e1732]/50 hover:bg-[#1e1732] text-[#ffddff] transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-[#ffddff]">Editar Evento</h1>
                <p className="text-[#e2e2e2]">Actualiza la información de tu evento</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                        : "bg-[#1e1732]/50 text-[#e2e2e2] hover:text-[#ffddff] hover:bg-[#1e1732]/70"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Información Básica */}
                {activeSection === "basic" && (
                  <GlassCard>
                    <h2 className="text-xl font-bold text-[#ffddff] mb-4">Información Básica</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Título del Evento</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => updateFormData({ title: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                          placeholder="Ej: Conferencia Tech 2025"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Descripción</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => updateFormData({ description: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                          placeholder="Describe tu evento..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Acerca del Evento</label>
                        <textarea
                          value={formData.aboutEvent}
                          onChange={(e) => updateFormData({ aboutEvent: e.target.value })}
                          rows={3}
                          placeholder="Información adicional sobre el evento..."
                          className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Fecha de Inicio</label>
                          <input
                            type="datetime-local"
                            value={formData.startDate}
                            onChange={(e) => updateFormData({ startDate: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Fecha de Fin</label>
                          <input
                            type="datetime-local"
                            value={formData.endDate}
                            onChange={(e) => updateFormData({ endDate: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                          />
                        </div>
                      </div>

                      {dateError && (
                        <div className="p-4 rounded-lg bg-error/10 border border-error/30">
                          <p className="text-sm text-error">{dateError}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-3">Tipo de Evento</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => handleEventTypeChange("presencial")}
                            className={`p-4 rounded-lg font-medium transition-all ${
                              formData.eventType === "presencial"
                                ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                                : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                            }`}
                          >
                            <MapPin className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">Presencial</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEventTypeChange("virtual")}
                            className={`p-4 rounded-lg font-medium transition-all ${
                              formData.eventType === "virtual"
                                ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                                : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                            }`}
                          >
                            <Video className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">Virtual</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEventTypeChange("no-definido")}
                            className={`p-4 rounded-lg font-medium transition-all ${
                              formData.eventType === "no-definido"
                                ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                                : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                            }`}
                          >
                            <HelpCircle className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">No Definido</div>
                          </button>
                        </div>
                      </div>

                      {/* Campos para eventos PRESENCIALES */}
                      {formData.eventType === "presencial" && (
                        <div className="space-y-4 p-4 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                          <h3 className="text-lg font-bold text-[#ffddff] mb-2">Información de Ubicación</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Ubicación *</label>
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => updateFormData({ location: e.target.value })}
                              required
                              placeholder="Ej: Centro de Convenciones, Ciudad"
                              className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-[#e2e2e2] mb-2">
                              Enlace de Google Maps (opcional)
                            </label>
                            <input
                              type="url"
                              value={formData.eventLink}
                              onChange={(e) => updateFormData({ eventLink: e.target.value })}
                              placeholder="https://maps.google.com/..."
                              className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Campos para eventos VIRTUALES */}
                      {formData.eventType === "virtual" && (
                        <div className="space-y-4 p-4 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                          <h3 className="text-lg font-bold text-[#ffddff] mb-2">Información Virtual</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Ubicación</label>
                            <input
                              type="text"
                              value={formData.location}
                              readOnly
                              className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20 text-[#a0d2ff] cursor-not-allowed"
                            />
                            <p className="text-xs text-[#a0d2ff] mt-1">
                              La ubicación se establece automáticamente para eventos virtuales
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-[#e2e2e2] mb-2">
                              Enlace de Reunión (Google Meet, Zoom, etc.) *
                            </label>
                            <input
                              type="url"
                              value={formData.eventLink}
                              onChange={(e) => updateFormData({ eventLink: e.target.value })}
                              required
                              placeholder="https://meet.google.com/... o https://zoom.us/..."
                              className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-3">Categoría</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {CATEGORIES.map((cat) => (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => updateFormData({ category: cat })}
                              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                formData.category === cat
                                  ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                                  : "bg-[#1e1732]/50 text-[#e2e2e2] hover:text-[#ffddff] hover:bg-[#1e1732]/70"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Configuración */}
                {activeSection === "settings" && (
                  <GlassCard>
                    <h2 className="text-xl font-bold text-[#ffddff] mb-4">Configuración</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <Infinity className="w-5 h-5 text-[#f1c6ff]" />
                            <p className="font-medium text-[#ffddff]">Capacidad Ilimitada</p>
                          </div>
                          <p className="text-sm text-[#e2e2e2] mt-1">Sin límite de asistentes</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateFormData({ unlimitedCapacity: !formData.unlimitedCapacity })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            formData.unlimitedCapacity ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                              formData.unlimitedCapacity ? "left-7" : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      {!formData.unlimitedCapacity && (
                        <div>
                          <label className="block text-sm font-medium text-[#ffddff] mb-2">Capacidad de Asistentes</label>
                          <input
                            type="range"
                            min="10"
                            max="200"
                            step="10"
                            value={formData.capacity}
                            onChange={(e) => updateFormData({ capacity: Number.parseInt(e.target.value) })}
                            className="w-full accent-[#f1c6ff]"
                          />
                          <div className="flex justify-between text-sm text-[#e2e2e2] mt-2">
                            <span>10</span>
                            <span className="text-2xl font-bold text-[#ffddff]">{formData.capacity}</span>
                            <span>200</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                          <div>
                            <p className="font-medium text-[#ffddff]">Evento Público</p>
                            <p className="text-sm text-white">Visible en Descubrir eventos</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateFormData({ isPublic: !formData.isPublic })}
                            className={`relative w-14 h-8 rounded-full transition-all ${
                              formData.isPublic ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                                formData.isPublic ? "left-7" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                          <div>
                            <p className="font-medium text-[#ffddff]">Formulario Personalizado</p>
                            <p className="text-sm text-white">Recopilar información adicional de los asistentes</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateFormData({ hasCustomForm: !formData.hasCustomForm })}
                            className={`relative w-14 h-8 rounded-full transition-all ${
                              formData.hasCustomForm ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                                formData.hasCustomForm ? "left-7" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Multimedia */}
                {activeSection === "multimedia" && (
                  <GlassCard>
                    <h2 className="text-xl font-bold text-[#ffddff] mb-4">Multimedia</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Imagen Principal</label>
                        <ImageUploader 
                          value={coverImage} 
                          onChange={setCoverImage} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#e2e2e2] mb-2">
                          Galería de Imágenes y Videos
                        </label>
                        <GalleryUploader
                          images={galleryImages}
                          videos={videos}
                          onImagesChange={setGalleryImages}
                          onVideosChange={setVideos}
                        />
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Formulario Personalizado */}
                {activeSection === "form" && formData.hasCustomForm && (
                  <GlassCard>
                    <h2 className="text-xl font-bold text-[#ffddff] mb-4">Formulario Personalizado</h2>
                    <EnhancedFormBuilder
                      fields={customFormFields}
                      onChange={setCustomFormFields}
                    />
                  </GlassCard>
                )}

                {activeSection === "form" && !formData.hasCustomForm && (
                  <GlassCard>
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-[#a0d2ff] mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-[#ffddff] mb-2">Formulario Personalizado Desactivado</h3>
                      <p className="text-[#e2e2e2] mb-4">
                        Activa el formulario personalizado en la sección de Configuración para recopilar información adicional de los asistentes.
                      </p>
                      <button
                        onClick={() => setActiveSection("settings")}
                        className="px-4 py-2 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] rounded-lg font-medium"
                      >
                        Ir a Configuración
                      </button>
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* Sidebar - ÚNICO botón de guardar */}
              <div className="lg:col-span-1">
                <GlassCard className="sticky top-6">
                  <h3 className="text-lg font-bold text-[#ffddff] mb-4">Guardar Cambios</h3>
                  <p className="text-sm text-[#e2e2e2] mb-4">
                    Todos los cambios realizados en las diferentes secciones se guardarán cuando presiones el botón.
                  </p>
                  <GradientButton 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </GradientButton>
                  
                  <div className="mt-4 p-3 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                    <p className="text-xs text-[#a0d2ff]">
                      💡 Los cambios no se guardan automáticamente. Asegúrate de guardar antes de salir.
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
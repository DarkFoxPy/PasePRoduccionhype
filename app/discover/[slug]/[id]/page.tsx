"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Grid, Html } from "@react-three/drei"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FuturisticBackground } from "@/components/futuristic-background"
import { RegistrationModal } from "@/components/modals/registration-modal"
import { VenueViewer } from "@/components/3d/venue-viewer"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Globe, Share2, Heart, Layers, Info, ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Marker3D } from "@/lib/types"
import MarkerPopup from "@/components/3d/marker-popup"

interface SceneConfig {
  type: "indoor" | "outdoor" | "hybrid"
  floors: number
  floorHeight: number
  dimensions: { width: number; depth: number }
  lighting: "day" | "night" | "indoor"
  groundTexture: "grass" | "concrete" | "wood" | "tile" | "carpet"
}

const getFloorColor = (texture: string): number => {
  const colors: Record<string, number> = {
    grass: 0x4a7c59,
    concrete: 0x808080,
    wood: 0x8b4513,
    tile: 0xf0f0f0,
    carpet: 0x8b0000,
  }
  return colors[texture] || 0x808080
}

function ViewerMarker({ marker, onClick }: { marker: Marker3D; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  const getGeometry = () => {
    switch (marker.type) {
      case "entrance":
      case "exit":
      case "emergency_exit":
        return <boxGeometry args={[1.5, 2.5, 0.3]} />
      case "stage":
        return <boxGeometry args={[4, 0.5, 3]} />
      case "backstage":
        return <boxGeometry args={[3, 2, 2]} />
      case "booth":
      case "sponsor_booth":
        return <boxGeometry args={[2, 2, 2]} />
      case "info_booth":
        return <cylinderGeometry args={[0.8, 0.8, 2, 8]} />
      case "food":
        return <boxGeometry args={[2.5, 2, 2]} />
      case "bathroom":
        return <boxGeometry args={[2, 2.5, 2]} />
      case "parking":
        return <boxGeometry args={[2.5, 0.2, 4]} />
      case "security":
        return <cylinderGeometry args={[0.6, 0.6, 2, 6]} />
      case "medical":
        return <boxGeometry args={[2, 2, 2]} />
      case "vip":
        return <boxGeometry args={[3, 2.5, 3]} />
      case "press":
        return <boxGeometry args={[2, 2, 1.5]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <group
      position={[marker.position.x, marker.position.y, marker.position.z]}
      rotation={[marker.rotation.x, marker.rotation.y, marker.rotation.z]}
      scale={[marker.scale.x, marker.scale.y, marker.scale.z]}
      onContextMenu={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial
          color={marker.color}
          emissive={marker.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {hovered && (
        <mesh scale={1.15}>
          {getGeometry()}
          <meshBasicMaterial color="#f1c6ff" transparent opacity={0.3} wireframe />
        </mesh>
      )}

      {hovered && (
        <Html position={[0, 3, 0]} center distanceFactor={10}>
          <div className="bg-[#1e1732]/95 backdrop-blur-sm border border-[#f1c6ff]/50 rounded-lg p-3 min-w-[200px] max-w-[300px] shadow-xl">
            <h4 className="text-[#ffddff] font-bold text-sm mb-1">{marker.name}</h4>
            {marker.description && <p className="text-[#ffffff] text-xs mb-2 leading-relaxed">{marker.description}</p>}
            {marker.capacity && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#f1c6ff]" />
                <span className="text-[#a0d2ff] text-xs">Capacidad:</span>
                <span className="text-[#f1c6ff] font-semibold text-xs">{marker.capacity}</span>
              </div>
            )}
            <p className="text-xs text-[#f1c6ff] mt-1 font-medium">Click derecho para más detalles</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function ViewerWalls({
  width,
  depth,
  floorNumber,
  floorHeight,
  isVisible,
  venueType,
}: {
  width: number
  depth: number
  floorNumber: number
  floorHeight: number
  isVisible: boolean
  venueType: "indoor" | "outdoor" | "hybrid"
}) {
  const floorY = floorNumber * floorHeight
  const height = floorHeight
  const wallThickness = 0.2

  if (!isVisible || (venueType !== "indoor" && venueType !== "hybrid")) {
    return null
  }

  return (
    <group>
      {/* Front Wall */}
      <mesh position={[0, floorY + height / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, floorY + height / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, floorY + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, floorY + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}

function ViewerFloor({
  width,
  depth,
  floorNumber,
  floorHeight,
  isVisible,
  groundTexture,
  venueType,
}: {
  width: number
  depth: number
  floorNumber: number
  floorHeight: number
  isVisible: boolean
  groundTexture: string
  venueType: "indoor" | "outdoor" | "hybrid"
}) {
  const floorY = floorNumber * floorHeight

  if (!isVisible) {
    return null
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={getFloorColor(groundTexture)} roughness={0.8} metalness={0.2} />
      </mesh>

      <Grid
        args={[width, depth]}
        position={[0, floorY + 0.01, 0]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#f1c6ff"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#ffddff"
        fadeDistance={100}
        fadeStrength={1}
        followCamera={false}
      />

      <ViewerWalls
        width={width}
        depth={depth}
        floorNumber={floorNumber}
        floorHeight={floorHeight}
        isVisible={isVisible}
        venueType={venueType}
      />
    </group>
  )
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [markers, setMarkers] = useState<Marker3D[]>([])
  const [currentFloor, setCurrentFloor] = useState(0)
  const [floorNames, setFloorNames] = useState<Record<number, string>>({ 0: "Planta Baja" })
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    type: "hybrid",
    floors: 0,
    floorHeight: 4,
    dimensions: { width: 80, depth: 60 },
    lighting: "indoor",
    groundTexture: "concrete",
  })
  const [selectedTab, setSelectedTab] = useState<"info" | "schedule" | "gallery" | "map">("info")
  const [scheduleDays, setScheduleDays] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [durationDays, setDurationDays] = useState(1)
  const [selectedMarker, setSelectedMarker] = useState<Marker3D | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  // Estados para el modal de imagen
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("[v0] Fetching event details:", eventId)
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.event)
          console.log("[v0] Event loaded:", data.event)
          
          const start = new Date(data.event.start_date)
          const end = new Date(data.event.end_date)
          const days = Math.ceil((end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) + 1
          setDurationDays(days)

          if (data.event.map_json_file) {
            await loadMapData(data.event.map_json_file)
          }
        } else {
          console.error("[v0] Failed to fetch event:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const loadMapData = async (mapJsonString: string) => {
    try {
      const mapData = typeof mapJsonString === "string" ? JSON.parse(mapJsonString) : mapJsonString
      if (mapData.markers) setMarkers(mapData.markers)
      if (mapData.floorNames) setFloorNames(mapData.floorNames)
      if (mapData.sceneConfig) setSceneConfig(mapData.sceneConfig)
      console.log("[v0] Map data loaded successfully from database")
    } catch (error) {
      console.error("[v0] Error loading map data:", error)
    }
  }

  useEffect(() => {
    if (selectedDay !== null) {
      const day = scheduleDays.find((d) => d.day_number === selectedDay)
      if (day && day.map_json_file) {
        loadMapData(day.map_json_file)
      }
    } else if (event && event.map_json_file) {
      loadMapData(event.map_json_file)
    }
  }, [selectedDay, scheduleDays, event])

  // Función para abrir imagen en modal
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  // Función para cerrar modal
  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImageIndex(null)
  }

  // Función para navegar entre imágenes
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !getGalleryImages()) return
    
    const totalImages = getGalleryImages().length
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1)
    } else {
      setSelectedImageIndex(selectedImageIndex === totalImages - 1 ? 0 : selectedImageIndex + 1)
    }
  }

  // Obtener imágenes de galería
  const getGalleryImages = () => {
    if (!event?.gallery_images) return []
    try {
      return typeof event.gallery_images === 'string' 
        ? JSON.parse(event.gallery_images) 
        : event.gallery_images
    } catch (error) {
      return []
    }
  }

  // Manejar teclado para navegación
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageModalOpen) return
      
      if (e.key === 'Escape') {
        closeImageModal()
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isImageModalOpen, selectedImageIndex])

  const handleShare = () => {
    const discoverUrl = `${window.location.origin}/discover/${event.slug}/${event.id}`
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: discoverUrl,
        })
        .then(() => {
          console.log("[v0] Event shared successfully")
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            navigator.clipboard.writeText(discoverUrl)
            console.log("[v0] Link copied to clipboard")
          }
        })
    } else {
      navigator.clipboard.writeText(discoverUrl)
      console.log("[v0] Link copied to clipboard")
    }
  }

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1c6ff] mx-auto mb-4"></div>
            <p className="text-[#a0d2ff]">Cargando evento...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  if (!event) {
    return (
      <FuturisticBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <GlassCard className="text-center max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold text-[#ffddff] mb-4">Evento no encontrado</h2>
            <p className="text-[#a0d2ff] mb-6 text-sm md:text-base">El evento que buscas no existe o ha sido eliminado.</p>
            <Link href="/discover">
              <GradientButton className="w-full md:w-auto">Volver a Discover</GradientButton>
            </Link>
          </GlassCard>
        </div>
      </FuturisticBackground>
    )
  }

  // Cálculo de disponibilidad
  const registrationsCount = event.registrations_count || event.registrations || 0
  const eventCapacity = event.capacity || event.max_attendees || 0
  const availableSpots = Math.max(0, eventCapacity - registrationsCount)
  const percentFull = eventCapacity > 0 ? (registrationsCount / eventCapacity) * 100 : 0

  // Parsear datos del schedule para determinar si mostrar el tab
  const hasSchedule = event.schedule || event.schedule_days || event.fullSchedule

  const allFloors = Object.keys(floorNames)
    .map(Number)
    .sort((a, b) => b - a)

  const galleryImages = getGalleryImages()

  return (
    <FuturisticBackground>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#1e1732]/95 backdrop-blur-2xl border-b border-[#f1c6ff]/30">
          <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <Button
              onClick={() => router.push("/discover")}
              variant="outline"
              className="border-[#f1c6ff] text-[#ffffff] hover:text-[#f1c6ff] text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Volver a Discover</span>
              <span className="sm:hidden">Volver</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-[#f1c6ff] text-[#ffffff] hover:text-[#f1c6ff]"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Compartir</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-6 md:py-12">
          {/* Hero Section */}
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-6 md:mb-8">
            <img
              src={
                event.cover_image || `/placeholder.svg?height=400&width=1200&query=${encodeURIComponent(event.title)}`
              }
              alt={event.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => event.cover_image && openImageModal(0)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1732] via-[#1e1732]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <Badge className="bg-[#f1c6ff]/20 text-[#f1c6ff] border-[#f1c6ff]/30 backdrop-blur-sm text-xs">
                      {event.category}
                    </Badge>
                    {(event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                      <Badge className="bg-gradient-to-r from-[#ff00ff] to-[#f1c6ff] text-white glow-secondary border-0 text-xs">
                        3D Disponible
                      </Badge>
                    )}
                    {durationDays > 1 && (
                      <Badge className="bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] border-0 text-xs">
                        {durationDays} Días
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#ffddff] mb-3 md:mb-4">{event.title}</h1>
                  <p className="text-base md:text-xl text-[#ffffff] max-w-3xl line-clamp-2 md:line-clamp-none">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <GlassCard className="p-4 md:p-6">
                <div className="flex overflow-x-auto gap-1 md:gap-2 border-b border-[#f1c6ff]/20 pb-4 mb-6 scrollbar-hide">
                  <button
                    onClick={() => setSelectedTab("info")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                      selectedTab === "info"
                        ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                        : "text-[#a0d2ff] hover:text-[#ffffff]"
                    }`}
                  >
                    <Info className="w-4 h-4 inline mr-1 md:mr-2" />
                    Información
                  </button>
                  
                  {hasSchedule && (
                    <button
                      onClick={() => setSelectedTab("schedule")}
                      className={`px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                        selectedTab === "schedule"
                          ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                          : "text-[#a0d2ff] hover:text-[#ffffff]"
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-1 md:mr-2" />
                      Cronograma
                    </button>
                  )}
                  
                  {(galleryImages.length > 0 || event.videos) && (
                    <button
                      onClick={() => setSelectedTab("gallery")}
                      className={`px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                        selectedTab === "gallery"
                          ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                          : "text-[#a0d2ff] hover:text-[#ffffff]"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 inline mr-1 md:mr-2" />
                      Galería
                    </button>
                  )}
                  
                  {(event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                    <button
                      onClick={() => setSelectedTab("map")}
                      className={`px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                        selectedTab === "map"
                          ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                          : "text-[#a0d2ff] hover:text-[#ffffff]"
                      }`}
                    >
                      <Layers className="w-4 h-4 inline mr-1 md:mr-2" />
                      Mapa 3D
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                {selectedTab === "info" && (
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#ffddff] mb-2 md:mb-3">Acerca del evento</h3>
                      <p className="text-[#ffffff] leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {event.about_event || event.description}
                      </p>
                    </div>

                    {event.event_link && (
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-[#ffddff] mb-2 md:mb-3">Enlace del evento</h3>
                        <a
                          href={event.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f1c6ff] hover:text-[#ffddff] underline flex items-center gap-2 text-sm md:text-base break-all"
                        >
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          {event.event_link}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === "schedule" && (
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-bold text-[#ffddff] mb-3 md:mb-4">Cronograma del evento</h3>
                    
                    {(() => {
                      let scheduleToShow = [];
                      
                      console.log("[DEBUG] Buscando schedule en:", {
                        fullSchedule: event.fullSchedule,
                        schedule_days: event.schedule_days, 
                        schedule: event.schedule
                      });

                      if (event.schedule) {
                        try {
                          scheduleToShow = typeof event.schedule === 'string' 
                            ? JSON.parse(event.schedule) 
                            : event.schedule;
                          console.log("✅ SCHEDULE ENCONTRADO:", scheduleToShow.length, "actividades");
                        } catch (error) {
                          console.error("❌ Error parsing schedule:", error);
                          scheduleToShow = [];
                        }
                      }
                      else if (event.schedule_days && Array.isArray(event.schedule_days)) {
                        scheduleToShow = event.schedule_days;
                        console.log("✅ Usando schedule_days:", scheduleToShow.length, "días");
                      }
                      else if (event.fullSchedule && Array.isArray(event.fullSchedule)) {
                        scheduleToShow = event.fullSchedule;
                        console.log("✅ Usando fullSchedule:", scheduleToShow.length, "actividades");
                      }

                      console.log("[DEBUG] Schedule a mostrar:", scheduleToShow);

                      if (scheduleToShow.length > 0) {
                        const hasDayNumbers = scheduleToShow.some(item => item.day_number || item.day);
                        
                        if (hasDayNumbers) {
                          const activitiesByDay = scheduleToShow.reduce((days, activity) => {
                            const dayNumber = activity.day_number || activity.day || 1;
                            if (!days[dayNumber]) days[dayNumber] = [];
                            days[dayNumber].push(activity);
                            return days;
                          }, {});

                          return Object.entries(activitiesByDay).map(([dayNumber, activities]) => (
                            <div key={dayNumber} className="glass rounded-xl p-4 md:p-6 hover:glow-primary border border-[#f1c6ff]/30 mb-4 md:mb-6">
                              <h4 className="text-base md:text-lg font-bold text-[#ffddff] mb-3 md:mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                                Día {dayNumber}
                                <span className="text-xs md:text-sm text-[#a0d2ff] font-normal ml-2">
                                  {(activities as any[]).length} actividad{(activities as any[]).length !== 1 ? 'es' : ''}
                                </span>
                              </h4>
                              
                              <div className="space-y-3 md:space-y-4">
                                {(activities as any[]).map((activity, activityIndex) => (
                                  <div key={activity.id || activityIndex} className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 bg-[#2a1f3d]/50 rounded-lg border border-[#f1c6ff]/20">
                                    <div className="min-w-[80px] md:min-w-[100px]">
                                      <div className="text-[#f1c6ff] font-bold text-base md:text-lg">
                                        {activity.time || "Por definir"}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-[#ffddff] font-semibold text-base md:text-lg mb-1 md:mb-2">{activity.title}</h5>
                                      {activity.description && activity.description !== "." && (
                                        <p className="text-[#ffffff] leading-relaxed mb-2 md:mb-3 text-sm md:text-base">{activity.description}</p>
                                      )}
                                      {(activity.location || activity.speaker) && (
                                        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 mt-2 md:mt-3">
                                          {activity.location && (
                                            <div className="flex items-center gap-1 md:gap-2">
                                              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#a0d2ff]" />
                                              <span className="text-[#a0d2ff] text-xs md:text-sm">{activity.location}</span>
                                            </div>
                                          )}
                                          {activity.speaker && (
                                            <div className="flex items-center gap-1 md:gap-2">
                                              <Users className="w-3 h-3 md:w-4 md:h-4 text-[#a0d2ff]" />
                                              <span className="text-[#a0d2ff] text-xs md:text-sm">{activity.speaker}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="glass rounded-xl p-4 md:p-6 hover:glow-primary border border-[#f1c6ff]/30">
                              <h4 className="text-base md:text-lg font-bold text-[#ffddff] mb-3 md:mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                                Cronograma General
                              </h4>
                              
                              <div className="space-y-3 md:space-y-4">
                                {scheduleToShow.map((item, idx) => (
                                  <div key={idx} className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 bg-[#2a1f3d]/50 rounded-lg border border-[#f1c6ff]/20">
                                    <div className="text-[#f1c6ff] font-bold text-base md:text-lg min-w-[80px] md:min-w-[100px]">{item.time}</div>
                                    <div className="flex-1">
                                      <h4 className="text-[#ffddff] font-semibold text-base md:text-lg mb-1 md:mb-2">{item.title}</h4>
                                      {item.description && item.description !== "." && (
                                        <p className="text-[#ffffff] leading-relaxed text-sm md:text-base">{item.description}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      } else {
                        return (
                          <div className="text-center py-6 md:py-8 glass rounded-xl">
                            <Calendar className="w-8 h-8 md:w-12 md:h-12 text-[#a0d2ff] mx-auto mb-3 md:mb-4" />
                            <p className="text-[#a0d2ff] text-sm md:text-base">No hay cronograma disponible para este evento</p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {selectedTab === "gallery" && (
                  <div className="space-y-4 md:space-y-6">
                    {galleryImages.length > 0 && (
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-[#ffddff] mb-3 md:mb-4">Imágenes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                          {galleryImages.map((img: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative group overflow-hidden rounded-lg border border-[#f1c6ff]/30 cursor-pointer"
                              onClick={() => openImageModal(idx)}
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Galería ${idx + 1}`}
                                className="w-full h-24 md:h-32 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                  <div className="bg-black/50 rounded-full p-1 md:p-2">
                                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.videos && (() => {
                      try {
                        const videos = typeof event.videos === 'string' 
                          ? JSON.parse(event.videos) 
                          : event.videos;
                        return videos.length > 0 ? (
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-[#ffddff] mb-3 md:mb-4">Videos</h3>
                            <div className="space-y-3 md:space-y-4">
                              {videos.map((video: string, idx: number) => (
                                <video key={idx} controls className="w-full rounded-lg border border-[#f1c6ff]/30">
                                  <source src={video} />
                                </video>
                              ))}
                            </div>
                          </div>
                        ) : null
                      } catch (error) {
                        return null
                      }
                    })()}
                  </div>
                )}

                {selectedTab === "map" && (event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#ffddff]">Mapa 3D Interactivo</h3>
                      <p className="text-xs md:text-sm text-[#a0d2ff]">Haz click derecho sobre los elementos para ver detalles</p>
                    </div>

                    {durationDays > 1 && scheduleDays.length > 0 && (
                      <div className="flex gap-1 md:gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedDay(null)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                            selectedDay === null
                              ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                              : "bg-[#1e1732]/50 text-[#ffffff] hover:bg-[#1e1732]"
                          }`}
                        >
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                          General
                        </button>
                        {scheduleDays.map((day) => (
                          <button
                            key={day.id}
                            onClick={() => setSelectedDay(day.day_number)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                              selectedDay === day.day_number
                                ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-semibold"
                                : "bg-[#2a1f3d]/50 text-[#ffffff] hover:bg-[#2a1f3d] border border-[#f1c6ff]/20"
                            }`}
                          >
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                            {day.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Floor selector */}
                    {allFloors.length > 1 && (
                      <div className="flex gap-1 md:gap-2 flex-wrap">
                        {allFloors.map((floor) => (
                          <button
                            key={floor}
                            onClick={() => setCurrentFloor(floor)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                              currentFloor === floor
                                ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-semibold"
                                : "bg-[#2a1f3d]/50 text-[#ffffff] hover:bg-[#2a1f3d] border border-[#f1c6ff]/20"
                            }`}
                          >
                            <Layers className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                            {floorNames[floor]}
                            <span className="text-xs block opacity-70 mt-1">
                              {markers.filter((m) => m.floor === floor).length} elementos
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="bg-[#1e1732]/50 rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] border border-[#f1c6ff]/30">
                      <VenueViewer
                        markers={markers}
                        onMarkerClick={(marker) => setSelectedMarker(marker)}
                        currentFloor={currentFloor}
                        floorNames={floorNames}
                        sceneConfig={sceneConfig}
                      />
                    </div>
                    <p className="text-xs text-[#a0d2ff] text-center mt-2">
                      <span className="text-[#f1c6ff] font-semibold">Arrastra:</span> Rotar •{" "}
                      <span className="text-[#f1c6ff] font-semibold">Click derecho:</span> Detalles •{" "}
                      <span className="text-[#f1c6ff] font-semibold">Scroll:</span> Zoom
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              {/* Registration Card */}
              <GlassCard glow="primary" className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#ffddff] mb-3 md:mb-4">Registro</h3>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3 text-[#ffffff]">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                    <div>
                      <p className="text-xs md:text-sm text-[#a0d2ff]">Fecha de inicio</p>
                      <p className="font-semibold text-sm md:text-base">
                        {new Date(event.start_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-[#ffffff]">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                    <div>
                      <p className="text-xs md:text-sm text-[#a0d2ff]">Fecha de fin</p>
                      <p className="font-semibold text-sm md:text-base">
                        {new Date(event.end_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 md:gap-3 text-[#ffffff]">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                      <div>
                        <p className="text-xs md:text-sm text-[#a0d2ff]">Ubicación</p>
                        <p className="font-semibold text-sm md:text-base">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 md:pt-4 border-t border-[#f1c6ff]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[#f1c6ff]" />
                        <span className="text-[#ffffff] font-semibold text-sm md:text-base">{availableSpots}</span>
                        <span className="text-[#a0d2ff] text-xs md:text-sm">lugares disponibles</span>
                      </div>
                    </div>

                    <div className="h-2 bg-[#2a2342] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentFull > 80
                            ? "bg-gradient-to-r from-[#ff4444] to-[#ffaa00]"
                            : percentFull > 50
                              ? "bg-gradient-to-r from-[#ffaa00] to-[#00ff88]"
                              : "bg-gradient-to-r from-[#f1c6ff] to-[#ff00ff]"
                        }`}
                        style={{ width: `${percentFull}%` }}
                      />
                    </div>
                  </div>
                </div>

                <GradientButton className="w-full text-sm md:text-base" size="lg" onClick={() => setShowRegisterModal(true)}>
                  Registrarse al Evento
                </GradientButton>

                {event.requires_approval && (
                  <p className="text-xs text-[#a0d2ff] text-center mt-2 md:mt-3">
                    Este evento requiere aprobación del organizador
                  </p>
                )}
              </GlassCard>

              {/* Event Type Badge */}
              <GlassCard className="p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-[#ffddff] mb-2 md:mb-3">Tipo de evento</h4>
                <Badge className="bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] text-xs md:text-sm">
                  {event.event_type === "presencial"
                    ? "Presencial"
                    : event.event_type === "virtual"
                      ? "Virtual"
                      : "No Definido"}
                </Badge>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && selectedImageIndex !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
            {/* Botón cerrar */}
            <button
              onClick={closeImageModal}
              className="absolute top-2 md:top-4 right-2 md:right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Botón anterior */}
            {galleryImages.length > 1 && (
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-2 md:left-4 z-10 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Imagen */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={galleryImages[selectedImageIndex] || "/placeholder.svg"}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Botón siguiente */}
            {galleryImages.length > 1 && (
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-2 md:right-4 z-10 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Contador */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-black/50 text-white text-xs md:text-sm">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedMarker && <MarkerPopup marker={selectedMarker} onClose={() => setSelectedMarker(null)} />}
      {showRegisterModal && event && (
        <RegistrationModal
          event={{
            ...event,
            id: event.id,
            slug: event.slug || "",
            title: event.title,
            description: event.description,
            startDate: new Date(event.start_date),
            endDate: new Date(event.end_date),
            location: event.location || "",
            eventType: event.event_type,
            eventLink: event.event_link,
            category: event.category,
            capacity: event.capacity,
            unlimitedCapacity: event.unlimited_capacity,
            registrations: event.registrations_count || event.registrations || 0, 
            isPublic: event.is_public,
            requiresApproval: event.requires_approval,
            organizerId: event.organizer_id,
            map3DConfig: typeof event.map_3d_config === "string" ? JSON.parse(event.map_3d_config) : event.map_3d_config,
            mapJsonFile: event.map_json_file,
            coverImage: event.cover_image,
            galleryImages: galleryImages,
            videos: typeof event.videos === "string" ? JSON.parse(event.videos) : event.videos || [],
            schedule: event.schedule ? (typeof event.schedule === 'string' ? JSON.parse(event.schedule) : event.schedule) : [],
            scheduleJsonFile: event.schedule_json_file,
            hasCustomForm: event.has_custom_form,
            customFormFields: typeof event.custom_form_fields === "string" ? JSON.parse(event.custom_form_fields) : event.custom_form_fields || [],
            aboutEvent: event.about_event,
            visitCount: event.visit_count || 0,
            status: event.status,
            createdAt: new Date(event.created_at),
            updatedAt: new Date(event.updated_at),
          }}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            const fetchEvent = async () => {
              const response = await fetch(`/api/events/${eventId}`)
              if (response.ok) {
                const data = await response.json()
                setEvent(data.event)
              }
            }
            fetchEvent()
          }}
        />
      )}
    </FuturisticBackground>
  )
}
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Calendar, MapPin, Users, Search, Sparkles, SlidersHorizontal, Menu, X, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FuturisticBackground } from "@/components/futuristic-background"

const CATEGORIES = ["Todos", "Conferencia", "Concierto", "Exposición", "Networking", "Taller", "Deportivo", "Cultural"]

export default function DiscoverPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [sortBy, setSortBy] = useState<"date" | "popularity" | "availability">("date")
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        console.log("[v0] Fetching published events for Discover")
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          const allEvents = Array.isArray(data) ? data : data.events || []
          // Filter only published events
          const publishedEvents = Array.isArray(allEvents)
            ? allEvents.filter((event: any) => event.status === "published")
            : []
          setEvents(publishedEvents)
          console.log("[v0] Loaded published events:", publishedEvents.length)
        } else {
          console.error("[v0] Failed to fetch events:", response.status)
          setEvents([])
        }
      } catch (error) {
        console.error("[v0] Error fetching events:", error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchPublishedEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory

    const eventDate = new Date(event.start_date)
    const now = new Date()
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && eventDate.toDateString() === now.toDateString()) ||
      (dateFilter === "week" && eventDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesCategory && matchesDate
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    } else if (sortBy === "popularity") {
      return b.registrations - a.registrations
    } else {
      const aAvailable = a.capacity - a.registrations
      const bAvailable = b.capacity - b.registrations
      return bAvailable - aAvailable
    }
  })

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1c6ff] mx-auto mb-4"></div>
            <p className="text-[#a0d2ff]">Cargando eventos...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  return (
    <FuturisticBackground>
      <div className="min-h-screen">
        {/* Header Personalizado */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-[#1e1732]/95 backdrop-blur-2xl border-b border-[#f1c6ff]/30 shadow-2xl shadow-[#f1c6ff]/10"
            : "bg-transparent"
        }`}>
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] opacity-40 blur-lg group-hover:opacity-70 group-hover:blur-xl transition-all duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] p-1 group-hover:scale-110 transition-all duration-700">
                  <img 
                    src="/logo-hype.png" 
                    alt="HYPE Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-[#f1c6ff] via-[#ffddff] to-[#f1c6ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                HYPE
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Características", href: "#características" },
                { label: "Cómo Funciona", href: "#cómo-funciona" },
                { label: "Descubrir", href: "/discover" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-[#ffffff] hover:text-[#f1c6ff] transition-all duration-300 relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] group-hover:w-full transition-all duration-500" />
                  <span className="absolute inset-0 bg-[#f1c6ff] opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300 rounded-lg" />
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <button className="px-6 py-2.5 text-[#ffffff] hover:text-[#f1c6ff] transition-all duration-300 relative group">
                  <span className="relative z-10">Iniciar Sesión</span>
                  <span className="absolute inset-0 border border-[#f1c6ff]/0 group-hover:border-[#f1c6ff]/50 rounded-full transition-all duration-300" />
                </button>
              </Link>
              <Link href="/register">
                <button className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold overflow-hidden group transform hover:scale-110 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">
                    Crear Cuenta
                    <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffddff] to-[#f1c6ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-[#f1c6ff] opacity-50 blur-xl group-hover:opacity-80 transition-all duration-300" />
                </button>
              </Link>
            </div>

            <button
              className="md:hidden text-[#ffffff] hover:text-[#f1c6ff] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1e1732]/98 backdrop-blur-2xl border-t border-[#f1c6ff]/30">
              <div className="container mx-auto px-6 py-6 space-y-4">
                {[
                  { label: "Características", href: "#características" },
                  { label: "Cómo Funciona", href: "#cómo-funciona" },
                  { label: "Descubrir", href: "/discover" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block text-[#ffffff] hover:text-[#f1c6ff] transition-all duration-300 transform hover:translate-x-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Link href="/login" className="block">
                    <button className="w-full px-6 py-2.5 text-[#ffffff] border border-[#f1c6ff]/30 rounded-full hover:bg-[#f1c6ff]/10 hover:border-[#f1c6ff] transition-all duration-300">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link href="/register" className="block">
                    <button className="w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold transform hover:scale-105 transition-all duration-300">
                      Crear Cuenta
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Agregar padding-top para compensar el header fijo */}
        <main className="container mx-auto px-6 py-12 space-y-6 pt-32">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/20 via-[#ffddff]/20 to-[#f1c6ff]/20 blur-3xl" />
            <GlassCard className="relative" glow="primary">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] glow-primary flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#1e1732]" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#ffddff] mb-2">Descubre Eventos</h1>
                  <p className="text-[#a0d2ff]">Explora experiencias inmersivas en 3D</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-6">
              <GlassCard>
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#f1c6ff]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar eventos..."
                    className="flex-1 bg-transparent border-none outline-none text-[#ffffff] placeholder:text-[#a0d2ff]"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Date Filter */}
            <div className="lg:col-span-3">
              <GlassCard>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#f1c6ff]" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="flex-1 bg-transparent border-none outline-none text-[#ffffff] cursor-pointer"
                  >
                    <option value="all">Todas las fechas</option>
                    <option value="today">Hoy</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                  </select>
                </div>
              </GlassCard>
            </div>

            {/* Sort */}
            <div className="lg:col-span-3">
              <GlassCard>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#f1c6ff]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 bg-transparent border-none outline-none text-[#ffffff] cursor-pointer"
                  >
                    <option value="date">Por fecha</option>
                    <option value="popularity">Por popularidad</option>
                    <option value="availability">Por disponibilidad</option>
                  </select>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Category Filters */}
          <GlassCard>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#f1c6ff] to-[#ff00ff] text-white glow-primary shadow-lg shadow-[#f1c6ff]/30"
                      : "bg-[#2a2342] text-[#ffffff] hover:text-[#f1c6ff] hover:bg-[#352a4f] border border-[#f1c6ff]/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-[#a0d2ff]">
              <span className="font-semibold text-[#f1c6ff]">{sortedEvents.length}</span> eventos encontrados
            </p>
            {(searchQuery || selectedCategory !== "Todos" || dateFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Todos")
                  setDateFilter("all")
                }}
                className="text-sm text-[#f1c6ff] hover:text-[#ff00ff] hover:underline transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Events Grid */}
          {sortedEvents.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f1c6ff]/20 to-[#ff00ff]/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-[#f1c6ff]" />
                </div>
                <h3 className="text-xl font-bold text-[#ffffff] mb-2">No se encontraron eventos</h3>
                <p className="text-[#a0d2ff] mb-6">Intenta con otros términos de búsqueda o categorías</p>
                <GradientButton
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("Todos")
                    setDateFilter("all")
                  }}
                >
                  Limpiar filtros
                </GradientButton>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event) => {
                const availableSpots = event.capacity - event.registrations
                const percentFull = (event.registrations / event.capacity) * 100

                return (
                  <Link key={event.id} href={`/discover/${event.slug}/${event.id}`}>
                    <GlassCard hover glow="primary" className="h-full flex flex-col group">
                      {/* Event Image */}
                      <div className="relative h-48 -m-6 mb-4 rounded-t-xl overflow-hidden">
                        <img
                          src={
                            event.cover_image ||
                            `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(event.title) || "/placeholder.svg"}`
                          }
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1732]/90 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="outline"
                            className="bg-[#f1c6ff]/20 text-[#f1c6ff] border-[#f1c6ff]/30 backdrop-blur-sm"
                          >
                            {event.category}
                          </Badge>
                        </div>

                        {/* 3D Badge */}
                        {event.map_json_file && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-[#ff00ff] to-[#f1c6ff] text-white glow-secondary border-0">
                              Vista 3D
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-[#ffffff] line-clamp-2 group-hover:text-[#ffddff] transition-all">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#a0d2ff] line-clamp-2">{event.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-[#ffffff]">
                            <Calendar className="w-4 h-4 text-[#f1c6ff]" />
                            {new Date(event.start_date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#ffffff]">
                            <MapPin className="w-4 h-4 text-[#f1c6ff]" />
                            {event.location || "Ubicación por definir"}
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="pt-3 border-t border-[#f1c6ff]/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-[#f1c6ff]" />
                              <span className="text-[#ffffff] font-semibold">{availableSpots}</span>
                              <span className="text-[#a0d2ff]">lugares disponibles</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
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

                      {/* CTA */}
                      <div className="mt-4 pt-4 border-t border-[#f1c6ff]/20">
                        <GradientButton className="w-full" size="sm">
                          Ver Detalles
                        </GradientButton>
                      </div>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { 
          animation: gradient 3s ease infinite; 
          background-size: 200% auto;
        }
      `}</style>
    </FuturisticBackground>
  )
}
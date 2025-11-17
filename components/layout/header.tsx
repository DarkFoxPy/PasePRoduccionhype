"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, Search, X } from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"
import { useNotificationsStore } from "@/lib/stores/notifications-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { GradientButton } from "@/components/ui/gradient-button"
import Link from "next/link"

export function Header() {
  const router = useRouter()
  const { toggleSidebar } = useUIStore()
  const { unreadCount } = useNotificationsStore()
  const { logout } = useAuthStore()
  const { events } = useEventsStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  const searchResults =
    searchQuery.length > 0
      ? events
          .filter(
            (event) =>
              event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.location.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : []

  const handleSearchSelect = (eventId: string) => {
    setSearchQuery("")
    setShowSearchResults(false)
    const event = events.find((e) => e.id === eventId)
    if (event) {
      router.push(`/events/${event.slug}/${eventId}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-surface rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>


          <div className="hidden md:block relative">
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {/* Logout */}
          <GradientButton variant="outline" size="sm" onClick={logout} glow={false}>
            Salir
          </GradientButton>
        </div>
      </div>
    </header>
  )
}

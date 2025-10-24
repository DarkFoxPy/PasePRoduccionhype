"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import type { ScheduleItem } from "@/lib/types"

interface ScheduleDisplayProps {
  schedule: ScheduleItem[]
  eventDurationDays: number
}

export function ScheduleDisplay({ schedule, eventDurationDays }: ScheduleDisplayProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-[#a0d2ff] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#ffffff] mb-2">Sin cronograma disponible</h3>
          <p className="text-[#a0d2ff]">El organizador aún no ha publicado el cronograma del evento</p>
        </div>
      </GlassCard>
    )
  }

  // Group schedule by day
  const scheduleByDay = schedule.reduce(
    (acc, item) => {
      if (!acc[item.day]) acc[item.day] = []
      acc[item.day].push(item)
      return acc
    },
    {} as Record<number, ScheduleItem[]>,
  )

  // Sort items by time within each day
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[Number(day)].sort((a, b) => a.time.localeCompare(b.time))
  })

  return (
    <div className="space-y-6">
      {Array.from({ length: eventDurationDays }, (_, i) => i + 1).map((day) => {
        const dayItems = scheduleByDay[day] || []
        if (dayItems.length === 0) return null

        return (
          <GlassCard key={day} glow="primary">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f1c6ff]/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] flex items-center justify-center glow-primary">
                <span className="text-2xl font-bold text-[#1e1732]">{day}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#ffddff]">Día {day}</h3>
                <p className="text-sm text-[#a0d2ff]">{dayItems.length} actividades programadas</p>
              </div>
            </div>

            <div className="space-y-4">
              {dayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative pl-8 pb-6 last:pb-0 border-l-2 border-[#f1c6ff]/30 last:border-transparent"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] glow-primary" />

                  <div className="bg-[#1e1732]/50 rounded-lg p-4 hover:bg-[#1e1732]/70 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1c6ff]/20 text-[#f1c6ff] border border-[#f1c6ff]/30">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold text-sm">{item.time}</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#ffffff]">{item.title}</h4>
                      </div>
                    </div>

                    {item.description && <p className="text-[#ffffff] mb-3 leading-relaxed">{item.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {item.location && (
                        <div className="flex items-center gap-2 text-[#a0d2ff]">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.speaker && (
                        <div className="flex items-center gap-2 text-[#a0d2ff]">
                          <User className="w-4 h-4" />
                          <span>{item.speaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
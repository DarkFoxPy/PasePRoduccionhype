"use client"

import type React from "react"
import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { X, User, Mail, Phone, Check } from "lucide-react"
import type { Event, FormField } from "@/lib/types"

interface RegistrationModalProps {
  event: Event
  onClose: () => void
  onSuccess: () => void
}

export function RegistrationModal({ event, onClose, onSuccess }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  })

  // Validación de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validación de teléfono (solo números, espacios, +, - y paréntesis)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s+\-()]+$/
    return phoneRegex.test(phone)
  }

  // Formatear teléfono para permitir solo caracteres válidos
  const formatPhone = (input: string) => {
    return input.replace(/[^\d\s+\-()]/g, '')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, email: value })
    
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Por favor ingresa un email válido" })
    } else {
      setErrors({ ...errors, email: "" })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhone(e.target.value)
    setFormData({ ...formData, phone: value })
    
    if (value && !validatePhone(value)) {
      setErrors({ ...errors, phone: "Por favor ingresa solo números y caracteres válidos" })
    } else {
      setErrors({ ...errors, phone: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedTerms) {
      alert("Debes aceptar los términos y condiciones para continuar")
      return
    }

    // Validaciones finales antes de enviar
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "Por favor ingresa un email válido" })
      return
    }

    if (!validatePhone(formData.phone)) {
      setErrors({ ...errors, phone: "Por favor ingresa un número de teléfono válido" })
      return
    }

    setLoading(true)

    try {
      const registrationResponse = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.name,
          userEmail: formData.email,
          phone: formData.phone,
          customFormData: customAnswers,
        }),
      })

      if (!registrationResponse.ok) {
        const error = await registrationResponse.json()
        throw new Error(error.error || "Error al registrarse")
      }

      const { registrationId } = await registrationResponse.json()

      const responseData: Record<string, any> = {
        nombre_completo: formData.name,
        email: formData.email,
        telefono: formData.phone,
        ...customAnswers,
      }

      await fetch("/api/form-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          registrationId,
          responses: responseData,
        }),
      })

      console.log("[v0] Registration completed successfully with data:", responseData)

      setStep(2)

      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Error during registration:", error)
      alert(error.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const renderCustomField = (field: FormField) => {
    const value = customAnswers[field.id] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
            placeholder={field.placeholder}
          />
        )

      case "textarea":
        return (
          <textarea
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted resize-none"
            placeholder={field.placeholder}
            rows={4}
          />
        )

case "select":
  return (
    <select
      required={field.required}
      value={value}
      onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
      className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground cursor-pointer"
      style={{ color: 'white' }}
    >
      <option value="" style={{ color: 'black' }}>Selecciona una opción</option>
      {field.options?.map((option) => (
        <option key={option} value={option} style={{ color: 'black' }}>
          {option}
        </option>
      ))}
    </select>
  )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  required={field.required}
                  checked={value === option}
                  onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-primary/50 border-border/50"
                />
                <span className="text-foreground group-hover:text-primary transition-colors">{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const currentValues = value ? value.split(",") : []
              const isChecked = currentValues.includes(option)

              return (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      let newValues = [...currentValues]
                      if (e.target.checked) {
                        newValues.push(option)
                      } else {
                        newValues = newValues.filter((v) => v !== option)
                      }
                      setCustomAnswers({ ...customAnswers, [field.id]: newValues.join(",") })
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary/50 border-border/50 rounded"
                  />
                  <span className="text-foreground group-hover:text-primary transition-colors">{option}</span>
                </label>
              )
            })}
          </div>
        )

      case "date":
        return (
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => setCustomAnswers({ ...customAnswers, [field.id]: e.target.value })}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <GlassCard glow="primary">
          {step === 1 ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Registrarse al Evento</h2>
                  <p className="text-sm text-[#8b6bff]">{event.title}</p>

                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleEmailChange}
                      className={`w-full pl-10 pr-4 py-3 bg-surface/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted ${
                        errors.email ? "border-error" : "border-border/50"
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Número de Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full pl-10 pr-4 py-3 bg-surface/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted ${
                        errors.phone ? "border-error" : "border-border/50"
                      }`}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                {event.hasCustomForm && event.customFormFields && event.customFormFields.length > 0 && (
                  <>
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Preguntas Adicionales</h3>
                      <div className="space-y-4">
                        {event.customFormFields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {field.label}
                              {field.required && <span className="text-error ml-1">*</span>}
                            </label>
                            {renderCustomField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-surface/30 rounded-lg border border-border/50">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="event-terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-primary/50 bg-surface focus:ring-primary focus:ring-2"
                    />
                  </div>
                  <label htmlFor="event-terms" className="text-sm text-foreground cursor-pointer">
                    Acepto los{" "}
                    <a 
                      href="/terminos" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a 
                      href="/privacidad" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Política de Privacidad
                    </a>{" "}
                    para participar en este evento. Este checkbox también funciona como medida de seguridad para prevenir registros automatizados.
                  </label>
                </div>

                <GradientButton 
                  type="submit" 
                  className="w-full" 
                  loading={loading} 
                  size="lg"
                  disabled={!acceptedTerms || errors.email || errors.phone}
                >
                  Confirmar Registro
                </GradientButton>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-success/40 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Check className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Registro Exitoso</h2>
                <p className="text-muted mb-6">Muchísimas gracias!</p>
                <GradientButton onClick={onClose} className="w-full">
                  Cerrar
                </GradientButton>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
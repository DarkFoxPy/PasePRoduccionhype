"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Text, List, Square, Calendar } from "lucide-react"
import type { FormField } from "@/lib/types"

interface EnhancedFormBuilderProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

export function EnhancedFormBuilder({ fields, onChange }: EnhancedFormBuilderProps) {
  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: "",
      required: false,
      placeholder: "",
      options: type === "select" ? [""] : undefined,
    }
    onChange([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    )
  }

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id))
  }

  const addOption = (fieldId: string) => {
    onChange(
      fields.map((field) =>
        field.id === fieldId
          ? { ...field, options: [...(field.options || []), ""] }
          : field
      )
    )
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    onChange(
      fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : field
      )
    )
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    onChange(
      fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.filter((_, idx) => idx !== optionIndex),
            }
          : field
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-[#ffddff]">Campos del Formulario</h4>
        <div className="flex gap-2">
          <button
            onClick={() => addField("text")}
            className="px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded-lg text-[#ffddff] hover:bg-[#1e1732] transition-all flex items-center gap-2"
          >
            <Text className="w-4 h-4" />
            Texto
          </button>
          <button
            onClick={() => addField("textarea")}
            className="px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded-lg text-[#ffddff] hover:bg-[#1e1732] transition-all flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Área de Texto
          </button>
          <button
            onClick={() => addField("select")}
            className="px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded-lg text-[#ffddff] hover:bg-[#1e1732] transition-all flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Selección
          </button>
          <button
            onClick={() => addField("date")}
            className="px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded-lg text-[#ffddff] hover:bg-[#1e1732] transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Fecha
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-[#1e1732]/30 rounded-lg border border-[#f1c6ff]/20">
            <div className="flex items-start gap-3 mb-3">
              <GripVertical className="w-5 h-5 text-[#a0d2ff] mt-3 flex-shrink-0" />
              
              <div className="flex-1 space-y-3">
                {/* Label del campo */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Etiqueta del campo</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Ej: Nombre completo, Empresa, etc."
                    className="w-full px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded text-[#ffddff] placeholder:text-[#78767b]"
                  />
                </div>

                {/* Placeholder */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Texto de ayuda (placeholder)</label>
                  <input
                    type="text"
                    value={field.placeholder || ""}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Ej: Ingresa tu nombre..."
                    className="w-full px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded text-[#ffddff] placeholder:text-[#78767b]"
                  />
                </div>

                {/* Opciones para select */}
                {field.type === "select" && (
                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Opciones</label>
                    <div className="space-y-2">
                      {field.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                            placeholder={`Opción ${optionIndex + 1}`}
                            className="flex-1 px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded text-[#ffddff] placeholder:text-[#78767b]"
                          />
                          <button
                            onClick={() => removeOption(field.id, optionIndex)}
                            className="px-3 py-2 bg-error/20 text-error border border-error/30 rounded hover:bg-error/30 transition-all"
                            disabled={(field.options?.length || 0) <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(field.id)}
                        className="px-3 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/30 rounded text-[#ffddff] hover:bg-[#1e1732] transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Opción
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controles del campo */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => updateField(field.id, { required: !field.required })}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    field.required
                      ? "bg-[#f1c6ff] text-[#1e1732]"
                      : "bg-[#1e1732]/50 text-[#ffddff] border border-[#f1c6ff]/30"
                  }`}
                >
                  {field.required ? "Requerido" : "Opcional"}
                </button>
                
                <button
                  onClick={() => removeField(field.id)}
                  className="px-3 py-2 bg-error/20 text-error border border-error/30 rounded hover:bg-error/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview del campo */}
            <div className="mt-4 p-3 bg-[#1e1732]/20 rounded border border-[#f1c6ff]/10">
              <p className="text-sm text-[#a0d2ff] mb-2">Vista previa:</p>
              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder || field.label}
                  className="w-full px-3 py-2 bg-[#1e1732]/30 border border-[#f1c6ff]/20 rounded text-[#ffddff]"
                  disabled
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  placeholder={field.placeholder || field.label}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#1e1732]/30 border border-[#f1c6ff]/20 rounded text-[#ffddff] resize-none"
                  disabled
                />
              )}
              {field.type === "select" && (
                <select
                  className="w-full px-3 py-2 bg-[#1e1732]/30 border border-[#f1c6ff]/20 rounded text-[#ffddff]"
                  disabled
                >
                  <option value="">{field.placeholder || `Selecciona ${field.label}`}</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option || `Opción ${idx + 1}`}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-[#1e1732]/30 border border-[#f1c6ff]/20 rounded text-[#ffddff]"
                  disabled
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-[#f1c6ff]/30 rounded-lg">
          <List className="w-12 h-12 text-[#a0d2ff] mx-auto mb-3" />
          <p className="text-[#a0d2ff]">No hay campos en el formulario</p>
          <p className="text-sm text-[#78767b] mt-1">
            Agrega campos usando los botones de arriba
          </p>
        </div>
      )}
    </div>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Patient, Appointment } from "@/types"

interface AppointmentFormProps {
  patients: Patient[]
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<Appointment>
  updateLastVisit: (patientId: string, lastVisit: string) => Promise<void>
  isLoading?: boolean
}

export function AppointmentForm({
  patients,
  addAppointment,
  updateLastVisit,
  isLoading = false,
}: AppointmentFormProps) {
  const [patientId, setPatientId] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("Presencial")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId || !date) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const appointment: Omit<Appointment, "id"> = {
        patientId,
        date: new Date(date).toISOString(),
        type,
      }

      // Agregar cita
      await addAppointment(appointment)

      // Actualizar última visita del paciente
      await updateLastVisit(patientId, new Date().toLocaleString())

      toast({
        title: "Cita programada",
        description: "La cita ha sido programada correctamente",
        variant: "default",
      })

      // Limpiar formulario
      setPatientId("")
      setDate("")
      setType("Presencial")
    } catch (error: any) {
      console.error("Error al programar cita:", error)

      toast({
        title: "Error al programar cita",
        description: error?.message || "Hubo un problema al programar la cita",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programar Cita</CardTitle>
        <CardDescription>Agenda una nueva cita para un paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select value={patientId} onValueChange={setPatientId} required>
              <SelectTrigger id="patient">
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.length === 0 ? (
                  <SelectItem value="no-patients" disabled>
                    No hay pacientes registrados
                  </SelectItem>
                ) : (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id || ""}>
                      {patient.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha y Hora</Label>
            <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Cita</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecciona el tipo de cita" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Presencial">Presencial</SelectItem>
                <SelectItem value="Domicilio">Domicilio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Programando...
              </>
            ) : (
              "Programar Cita"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


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
import type { Patient } from "@/types"

interface PatientFormProps {
  addPatient: (patient: Omit<Patient, "id">) => Promise<Patient>
  isLoading?: boolean
}

export function PatientForm({ addPatient, isLoading = false }: PatientFormProps) {
  const [name, setName] = useState("")
  const [rut, setRut] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const pathologies = ["Helomas", "Onicocriptosis", "Hiperqueratosis", "Pie diabético", "Hongos (onicomicosis)"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !rut || !gender || selectedPathologies.length === 0) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newPatient: Omit<Patient, "id"> = {
        name,
        rut,
        age,
        gender,
        address,
        phone,
        pathologies: selectedPathologies,
        lastVisit: null,
      }

      console.log("Intentando agregar paciente:", newPatient)
      const result = await addPatient(newPatient)
      console.log("Paciente agregado con éxito:", result)

      toast({
        title: "Paciente agregado",
        description: "El paciente ha sido agregado correctamente",
        variant: "default",
      })

      // Limpiar formulario
      setName("")
      setRut("")
      setAge("")
      setGender("")
      setAddress("")
      setPhone("")
      setSelectedPathologies([])
    } catch (error: any) {
      console.error("Error detallado al agregar paciente:", error)

      // Mostrar mensaje de error más detallado
      toast({
        title: "Error al agregar paciente",
        description: `${error?.message || "Error desconocido"}. Código: ${error?.code || "N/A"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePathology = (pathology: string) => {
    if (selectedPathologies.includes(pathology)) {
      setSelectedPathologies(selectedPathologies.filter((p) => p !== pathology))
    } else {
      setSelectedPathologies([...selectedPathologies, pathology])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Nuevo Paciente</CardTitle>
        <CardDescription>Ingresa los datos del paciente para registrarlo en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rut">RUT (Identificación)</Label>
            <Input id="rut" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
              max="120"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Sexo</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Selecciona el sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Patologías Podológicas</Label>
            <div className="grid grid-cols-2 gap-2">
              {pathologies.map((pathology) => (
                <div key={pathology} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`pathology-${pathology}`}
                    checked={selectedPathologies.includes(pathology)}
                    onChange={() => togglePathology(pathology)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`pathology-${pathology}`}>{pathology}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Paciente"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


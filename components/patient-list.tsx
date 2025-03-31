"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Trash2, User, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Patient } from "@/types"

interface PatientListProps {
  patients: Patient[]
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  isLoading?: boolean
}

export function PatientList({ patients, updatePatient, deletePatient, isLoading = false }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.rut.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
      setIsDeleting(id)
      try {
        await deletePatient(id)
        toast({
          title: "Paciente eliminado",
          description: "El paciente ha sido eliminado correctamente",
          variant: "default",
        })
      } catch (error: any) {
        console.error("Error al eliminar paciente:", error)
        toast({
          title: "Error al eliminar paciente",
          description: error?.message || "Hubo un problema al eliminar el paciente",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const handleEdit = (patient: Patient) => {
    // En una aplicación real, aquí abriríamos un modal de edición
    // Por simplicidad, solo mostraremos un alert
    alert(`Editar paciente: ${patient.name}`)
  }

  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pacientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Buscar paciente por nombre o RUT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Última Atención</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No se encontraron pacientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.rut}</TableCell>
                      <TableCell>{patient.age || "-"}</TableCell>
                      <TableCell>{patient.gender || "-"}</TableCell>
                      <TableCell>{patient.phone || "-"}</TableCell>
                      <TableCell>{patient.lastVisit || "Sin atención"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => viewPatientDetails(patient)}>
                                <User className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Detalles del Paciente</DialogTitle>
                                <DialogDescription>Información completa del paciente</DialogDescription>
                              </DialogHeader>
                              {selectedPatient && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Nombre:</span>
                                    <span className="col-span-3">{selectedPatient.name}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">RUT:</span>
                                    <span className="col-span-3">{selectedPatient.rut}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Edad:</span>
                                    <span className="col-span-3">{selectedPatient.age || "-"}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Sexo:</span>
                                    <span className="col-span-3">{selectedPatient.gender || "-"}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Dirección:</span>
                                    <span className="col-span-3">{selectedPatient.address || "-"}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Teléfono:</span>
                                    <span className="col-span-3">{selectedPatient.phone || "-"}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Última visita:</span>
                                    <span className="col-span-3">{selectedPatient.lastVisit || "Sin atención"}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-medium">Patologías:</span>
                                    <span className="col-span-3">
                                      {selectedPatient.pathologies.join(", ") || "Ninguna"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(patient)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(patient.id || "")}
                            disabled={isDeleting === patient.id}
                          >
                            {isDeleting === patient.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


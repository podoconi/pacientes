import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import type { Patient, Appointment } from "@/types"

interface DashboardProps {
  patients: Patient[]
  appointments: Appointment[]
  isLoading?: boolean
}

export function Dashboard({ patients, appointments, isLoading = false }: DashboardProps) {
  // Calcular estadísticas
  const totalPatients = patients.length
  const totalAppointments = appointments.length

  // Citas por venir
  const now = new Date()
  const upcomingAppointments = appointments.filter((appointment) => new Date(appointment.date) > now).length

  // Patologías frecuentes
  const pathologyCount: Record<string, number> = {}
  patients.forEach((patient) => {
    patient.pathologies.forEach((pathology) => {
      pathologyCount[pathology] = (pathologyCount[pathology] || 0) + 1
    })
  })

  const commonPathologies =
    Object.entries(pathologyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pathology, count]) => `${pathology}: ${count}`)
      .join(", ") || "Ninguna"

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas por Venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patologías Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{commonPathologies}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pacientes Agendados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay citas programadas
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => {
                  const patient = patients.find((p) => p.id === appointment.patientId)
                  if (!patient) return null

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


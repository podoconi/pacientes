"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { PatientForm } from "@/components/patient-form"
import { PatientList } from "@/components/patient-list"
import { AppointmentForm } from "@/components/appointment-form"
import { usePatients } from "@/hooks/use-patients"
import { useAppointments } from "@/hooks/use-appointments"
import { initAnalytics, initFirebase } from "@/lib/firebase"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const {
    patients,
    isLoading: patientsLoading,
    error: patientsError,
    addPatient,
    updatePatient,
    deletePatient,
    updateLastVisit,
  } = usePatients()

  const { appointments, isLoading: appointmentsLoading, error: appointmentsError, addAppointment } = useAppointments()

  // Inicializar Firebase y Analytics
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Inicializar Firebase primero
      initFirebase()

      // Luego inicializar Analytics
      try {
        initAnalytics()
      } catch (error) {
        console.warn("Error al inicializar Analytics:", error)
      }
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-y-auto p-6">
            {activeSection === "dashboard" && (
              <Dashboard
                patients={patients}
                appointments={appointments}
                isLoading={patientsLoading || appointmentsLoading}
              />
            )}
            {activeSection === "add-patient" && <PatientForm addPatient={addPatient} isLoading={patientsLoading} />}
            {activeSection === "patient-list" && (
              <PatientList
                patients={patients}
                updatePatient={updatePatient}
                deletePatient={deletePatient}
                isLoading={patientsLoading}
              />
            )}
            {activeSection === "schedule-appointment" && (
              <AppointmentForm
                patients={patients}
                addAppointment={addAppointment}
                updateLastVisit={updateLastVisit}
                isLoading={patientsLoading || appointmentsLoading}
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAppointments as fetchAppointments,
  getFutureAppointments as fetchFutureAppointments,
  addAppointment as createAppointment,
  updateAppointment as updateAppointmentDoc,
  deleteAppointment as deleteAppointmentDoc,
} from "@/services/firestore-appointment-service"
import type { Appointment } from "@/types"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar todas las citas
  const loadAppointments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedAppointments = await fetchAppointments()
      setAppointments(fetchedAppointments)
    } catch (err: any) {
      console.error("Error al cargar citas:", err)
      setError(err.message || "Error al cargar citas")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar citas futuras
  const loadFutureAppointments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedAppointments = await fetchFutureAppointments()
      setAppointments(fetchedAppointments)
    } catch (err: any) {
      console.error("Error al cargar citas futuras:", err)
      setError(err.message || "Error al cargar citas futuras")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar citas al montar el componente
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Agregar cita
  const addAppointment = useCallback(async (appointment: Omit<Appointment, "id">) => {
    setIsLoading(true)
    setError(null)

    try {
      const newAppointment = await createAppointment(appointment)
      setAppointments((prev) => [...prev, newAppointment])
      return newAppointment
    } catch (err: any) {
      console.error("Error al agregar cita:", err)
      setError(err.message || "Error al agregar cita")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Actualizar cita
  const updateAppointment = useCallback(async (id: string, appointment: Partial<Appointment>) => {
    setIsLoading(true)
    setError(null)

    try {
      await updateAppointmentDoc(id, appointment)
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...appointment } : a)))
    } catch (err: any) {
      console.error("Error al actualizar cita:", err)
      setError(err.message || "Error al actualizar cita")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Eliminar cita
  const deleteAppointment = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await deleteAppointmentDoc(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      console.error("Error al eliminar cita:", err)
      setError(err.message || "Error al eliminar cita")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
    loadFutureAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  }
}


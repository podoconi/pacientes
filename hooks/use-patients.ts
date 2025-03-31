"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getPatients as fetchPatients,
  addPatient as createPatient,
  updatePatient as updatePatientDoc,
  deletePatient as deletePatientDoc,
  updatePatientLastVisit,
} from "@/services/firestore-patient-service"
import type { Patient } from "@/types"

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar pacientes
  const loadPatients = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedPatients = await fetchPatients()
      setPatients(fetchedPatients)
    } catch (err: any) {
      console.error("Error al cargar pacientes:", err)
      setError(err.message || "Error al cargar pacientes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPatients()
  }, [loadPatients])

  // Agregar paciente
  const addPatient = useCallback(async (patient: Omit<Patient, "id">) => {
    setIsLoading(true)
    setError(null)

    try {
      const newPatient = await createPatient(patient)
      setPatients((prev) => [...prev, newPatient])
      return newPatient
    } catch (err: any) {
      console.error("Error al agregar paciente:", err)
      setError(err.message || "Error al agregar paciente")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Actualizar paciente
  const updatePatient = useCallback(async (id: string, patient: Partial<Patient>) => {
    setIsLoading(true)
    setError(null)

    try {
      await updatePatientDoc(id, patient)
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patient } : p)))
    } catch (err: any) {
      console.error("Error al actualizar paciente:", err)
      setError(err.message || "Error al actualizar paciente")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Eliminar paciente
  const deletePatient = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await deletePatientDoc(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      console.error("Error al eliminar paciente:", err)
      setError(err.message || "Error al eliminar paciente")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Actualizar última visita
  const updateLastVisit = useCallback(async (id: string, lastVisit: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await updatePatientLastVisit(id, lastVisit)
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, lastVisit } : p)))
    } catch (err: any) {
      console.error("Error al actualizar última visita:", err)
      setError(err.message || "Error al actualizar última visita")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    patients,
    isLoading,
    error,
    loadPatients,
    addPatient,
    updatePatient,
    deletePatient,
    updateLastVisit,
  }
}


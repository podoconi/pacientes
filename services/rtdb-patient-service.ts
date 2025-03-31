import { ref, set, push, update, remove, get } from "firebase/database"
import { auth, rtdb } from "@/lib/firebase"
import type { Patient } from "@/types"

// Referencia a la colección de pacientes
const getPatientsRef = (userId: string) => {
  return ref(rtdb, `patients/${userId}`)
}

// Obtener todos los pacientes del usuario actual
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const patientsRef = getPatientsRef(user.uid)
    const snapshot = await get(patientsRef)

    if (!snapshot.exists()) {
      return []
    }

    const patients: Patient[] = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val()
      patients.push({
        id: childSnapshot.key,
        name: data.name,
        rut: data.rut,
        age: data.age || "",
        gender: data.gender || "",
        address: data.address || "",
        phone: data.phone || "",
        pathologies: data.pathologies || [],
        lastVisit: data.lastVisit || null,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      })
    })

    // Ordenar por fecha de creación (más reciente primero)
    return patients.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  } catch (error) {
    console.error("Error al obtener pacientes:", error)
    throw error
  }
}

// Agregar un nuevo paciente
export const addPatient = async (patient: Omit<Patient, "id">): Promise<Patient> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const patientWithTimestamp = {
      ...patient,
      createdAt: Date.now(),
    }

    const patientsRef = getPatientsRef(user.uid)
    const newPatientRef = push(patientsRef)

    await set(newPatientRef, patientWithTimestamp)

    return {
      id: newPatientRef.key,
      ...patient,
      createdAt: new Date(),
    } as Patient
  } catch (error) {
    console.error("Error al agregar paciente:", error)
    throw error
  }
}

// Actualizar un paciente existente
export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<void> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const patientRef = ref(rtdb, `patients/${user.uid}/${id}`)

    await update(patientRef, {
      ...patient,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error("Error al actualizar paciente:", error)
    throw error
  }
}

// Eliminar un paciente
export const deletePatient = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const patientRef = ref(rtdb, `patients/${user.uid}/${id}`)
    await remove(patientRef)
  } catch (error) {
    console.error("Error al eliminar paciente:", error)
    throw error
  }
}

// Actualizar la última visita de un paciente
export const updatePatientLastVisit = async (id: string, lastVisit: string): Promise<void> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const patientRef = ref(rtdb, `patients/${user.uid}/${id}`)

    await update(patientRef, {
      lastVisit,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error("Error al actualizar última visita:", error)
    throw error
  }
}


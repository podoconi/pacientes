import { ref, set, push, update, remove, get } from "firebase/database"
import { auth, rtdb } from "@/lib/firebase"
import type { Appointment } from "@/types"

// Referencia a la colección de citas
const getAppointmentsRef = (userId: string) => {
  return ref(rtdb, `appointments/${userId}`)
}

// Obtener todas las citas del usuario actual
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentsRef = getAppointmentsRef(user.uid)
    const snapshot = await get(appointmentsRef)

    if (!snapshot.exists()) {
      return []
    }

    const appointments: Appointment[] = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val()
      appointments.push({
        id: childSnapshot.key,
        patientId: data.patientId,
        date: data.date,
        type: data.type,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      })
    })

    // Ordenar por fecha de la cita (más próxima primero)
    return appointments.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  } catch (error) {
    console.error("Error al obtener citas:", error)
    throw error
  }
}

// Obtener citas futuras del usuario actual
export const getFutureAppointments = async (): Promise<Appointment[]> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentsRef = getAppointmentsRef(user.uid)
    const snapshot = await get(appointmentsRef)

    if (!snapshot.exists()) {
      return []
    }

    const now = new Date().getTime()
    const appointments: Appointment[] = []

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val()
      const appointmentDate = new Date(data.date).getTime()

      if (appointmentDate >= now) {
        appointments.push({
          id: childSnapshot.key,
          patientId: data.patientId,
          date: data.date,
          type: data.type,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        })
      }
    })

    // Ordenar por fecha de la cita (más próxima primero)
    return appointments.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  } catch (error) {
    console.error("Error al obtener citas futuras:", error)
    throw error
  }
}

// Agregar una nueva cita
export const addAppointment = async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentWithTimestamp = {
      ...appointment,
      createdAt: Date.now(),
    }

    const appointmentsRef = getAppointmentsRef(user.uid)
    const newAppointmentRef = push(appointmentsRef)

    await set(newAppointmentRef, appointmentWithTimestamp)

    return {
      id: newAppointmentRef.key,
      ...appointment,
      createdAt: new Date(),
    } as Appointment
  } catch (error) {
    console.error("Error al agregar cita:", error)
    throw error
  }
}

// Actualizar una cita existente
export const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<void> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentRef = ref(rtdb, `appointments/${user.uid}/${id}`)

    await update(appointmentRef, {
      ...appointment,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    throw error
  }
}

// Eliminar una cita
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentRef = ref(rtdb, `appointments/${user.uid}/${id}`)
    await remove(appointmentRef)
  } catch (error) {
    console.error("Error al eliminar cita:", error)
    throw error
  }
}


"use client"

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { getAuth, getDb, initFirebase } from "@/lib/firebase"
import type { Appointment } from "@/types"

// Obtener todas las citas del usuario actual
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") return []

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    const db = getDb()

    if (!auth) {
      throw new Error("Firebase Auth no está disponible")
    }

    if (!db) {
      throw new Error("Firebase Firestore no está disponible")
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentsCollection = collection(db, `users/${user.uid}/appointments`)
    const q = query(appointmentsCollection, orderBy("date", "asc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    const appointments: Appointment[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      appointments.push({
        id: doc.id,
        patientId: data.patientId || "",
        date: data.date || "",
        type: data.type || "",
        createdAt: data.createdAt?.toDate() || new Date(),
      })
    })

    return appointments
  } catch (error) {
    console.error("Error al obtener citas:", error)
    throw error
  }
}

// Obtener citas futuras del usuario actual
export const getFutureAppointments = async (): Promise<Appointment[]> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") return []

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    const db = getDb()

    if (!auth) {
      throw new Error("Firebase Auth no está disponible")
    }

    if (!db) {
      throw new Error("Firebase Firestore no está disponible")
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const now = new Date()
    const appointmentsCollection = collection(db, `users/${user.uid}/appointments`)
    const q = query(appointmentsCollection, where("date", ">=", now.toISOString()), orderBy("date", "asc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    const appointments: Appointment[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      appointments.push({
        id: doc.id,
        patientId: data.patientId || "",
        date: data.date || "",
        type: data.type || "",
        createdAt: data.createdAt?.toDate() || new Date(),
      })
    })

    return appointments
  } catch (error) {
    console.error("Error al obtener citas futuras:", error)
    throw error
  }
}

// Agregar una nueva cita
export const addAppointment = async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede agregar cita en el servidor")

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    const db = getDb()

    if (!auth) {
      throw new Error("Firebase Auth no está disponible")
    }

    if (!db) {
      throw new Error("Firebase Firestore no está disponible")
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentsCollection = collection(db, `users/${user.uid}/appointments`)

    const appointmentWithTimestamp = {
      ...appointment,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(appointmentsCollection, appointmentWithTimestamp)

    return {
      id: docRef.id,
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
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede actualizar cita en el servidor")

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    const db = getDb()

    if (!auth) {
      throw new Error("Firebase Auth no está disponible")
    }

    if (!db) {
      throw new Error("Firebase Firestore no está disponible")
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentRef = doc(db, `users/${user.uid}/appointments/${id}`)

    await updateDoc(appointmentRef, {
      ...appointment,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    throw error
  }
}

// Eliminar una cita
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede eliminar cita en el servidor")

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    const db = getDb()

    if (!auth) {
      throw new Error("Firebase Auth no está disponible")
    }

    if (!db) {
      throw new Error("Firebase Firestore no está disponible")
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const appointmentRef = doc(db, `users/${user.uid}/appointments/${id}`)
    await deleteDoc(appointmentRef)
  } catch (error) {
    console.error("Error al eliminar cita:", error)
    throw error
  }
}


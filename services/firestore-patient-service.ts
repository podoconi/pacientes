"use client"

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { getAuth, getDb, initFirebase } from "@/lib/firebase"
import type { Patient } from "@/types"

// Obtener todos los pacientes del usuario actual
export const getPatients = async (): Promise<Patient[]> => {
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

    const patientsCollection = collection(db, `users/${user.uid}/patients`)
    const q = query(patientsCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    const patients: Patient[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      patients.push({
        id: doc.id,
        name: data.name || "",
        rut: data.rut || "",
        age: data.age || "",
        gender: data.gender || "",
        address: data.address || "",
        phone: data.phone || "",
        pathologies: data.pathologies || [],
        lastVisit: data.lastVisit || null,
        createdAt: data.createdAt?.toDate() || new Date(),
      })
    })

    return patients
  } catch (error) {
    console.error("Error al obtener pacientes:", error)
    throw error
  }
}

// Agregar un nuevo paciente
export const addPatient = async (patient: Omit<Patient, "id">): Promise<Patient> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede agregar paciente en el servidor")

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

    const patientsCollection = collection(db, `users/${user.uid}/patients`)

    const patientWithTimestamp = {
      ...patient,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(patientsCollection, patientWithTimestamp)

    return {
      id: docRef.id,
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
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede actualizar paciente en el servidor")

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

    const patientRef = doc(db, `users/${user.uid}/patients/${id}`)

    await updateDoc(patientRef, {
      ...patient,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error al actualizar paciente:", error)
    throw error
  }
}

// Eliminar un paciente
export const deletePatient = async (id: string): Promise<void> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede eliminar paciente en el servidor")

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

    const patientRef = doc(db, `users/${user.uid}/patients/${id}`)
    await deleteDoc(patientRef)
  } catch (error) {
    console.error("Error al eliminar paciente:", error)
    throw error
  }
}

// Actualizar la última visita de un paciente
export const updatePatientLastVisit = async (id: string, lastVisit: string): Promise<void> => {
  try {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") throw new Error("No se puede actualizar paciente en el servidor")

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

    const patientRef = doc(db, `users/${user.uid}/patients/${id}`)

    await updateDoc(patientRef, {
      lastVisit,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error al actualizar última visita:", error)
    throw error
  }
}


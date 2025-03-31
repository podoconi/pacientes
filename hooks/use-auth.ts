"use client"

import { useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { getAuth, getGoogleProvider, initFirebase } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Inicializar Firebase al montar el componente
  useEffect(() => {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") return

    // Inicializar Firebase
    initFirebase()

    const auth = getAuth()
    if (!auth) {
      setLoading(false)
      setError("No se pudo inicializar Firebase Auth")
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      (error) => {
        console.error("Error de autenticación:", error)
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      const auth = getAuth()
      const googleProvider = getGoogleProvider()

      if (!auth || !googleProvider) {
        throw new Error("Firebase Auth no está disponible")
      }

      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Crear usuario con email y contraseña
  const createUserWithEmail = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const auth = getAuth()

      if (!auth) {
        throw new Error("Firebase Auth no está disponible")
      }

      const result = await firebaseCreateUser(auth, email, password)
      return result.user
    } catch (error: any) {
      console.error("Error al crear usuario:", error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Iniciar sesión con email y contraseña
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const auth = getAuth()

      if (!auth) {
        throw new Error("Firebase Auth no está disponible")
      }

      const result = await firebaseSignInWithEmail(auth, email, password)
      return result.user
    } catch (error: any) {
      console.error("Error al iniciar sesión con email:", error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const auth = getAuth()

      if (!auth) {
        throw new Error("Firebase Auth no está disponible")
      }

      await firebaseSignOut(auth)
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    createUserWithEmail,
    signOut,
  }
}


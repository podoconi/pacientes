"use client"

import { initializeApp } from "firebase/app"
import { getAuth as getFirebaseAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-S0PXyj8bvnTI82ROm1MQQiNY80wM548",
  authDomain: "webapp-d40a7.firebaseapp.com",
  projectId: "webapp-d40a7",
  storageBucket: "webapp-d40a7.firebasestorage.app",
  messagingSenderId: "719266430913",
  appId: "1:719266430913:web:cae4944e1d057a64547940",
  measurementId: "G-3J7SZVMV31",
  databaseURL: "https://webapp-d40a7-default-rtdb.firebaseio.com",
}

// Variables para almacenar las instancias
let app = null
let auth = null
let db = null
let googleProvider = null

// Función para inicializar Firebase
function initFirebase() {
  if (typeof window !== "undefined") {
    if (!app) {
      app = initializeApp(firebaseConfig)
      auth = getFirebaseAuth(app)
      db = getFirestore(app)
      googleProvider = new GoogleAuthProvider()
    }
  }
  return app
}

// Inicializar Firebase inmediatamente si estamos en el cliente
if (typeof window !== "undefined") {
  initFirebase()
}

// Función para obtener Auth (asegurándose de que esté inicializado)
export function getAuth() {
  if (typeof window === "undefined") {
    return null
  }

  if (!auth) {
    initFirebase()
  }

  return auth
}

// Función para obtener Firestore
export function getDb() {
  if (typeof window === "undefined") {
    return null
  }

  if (!db) {
    initFirebase()
  }

  return db
}

// Función para obtener GoogleAuthProvider
export function getGoogleProvider() {
  if (typeof window === "undefined") {
    return null
  }

  if (!googleProvider) {
    initFirebase()
  }

  return googleProvider
}

// Inicializar Analytics (solo en el cliente)
export const initAnalytics = async () => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const app = initFirebase()
    if (app) {
      const { getAnalytics } = await import("firebase/analytics")
      return getAnalytics(app)
    }
  } catch (error) {
    console.warn("Firebase Analytics no pudo inicializarse:", error)
  }

  return null
}

// Exportar la función de inicialización
export { initFirebase }


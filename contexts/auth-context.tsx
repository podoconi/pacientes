"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { useAuth } from "@/hooks/use-auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<User>
  signInWithEmail: (email: string, password: string) => Promise<User>
  createUserWithEmail: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider")
  }

  return context
}


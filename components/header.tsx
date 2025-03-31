"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, signOut } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
        variant: "default",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Hubo un problema al cerrar sesión",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold md:text-3xl text-2xl">Constanza, Bienvenida a tu aplicación de Pacientes</h1>
        <p className="text-xl md:text-xl text-lg">Gestión de Pacientes y Citas</p>
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Usuario"} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{user.displayName || user.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}


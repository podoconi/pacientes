"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { initFirebase } from "@/lib/firebase"

export default function LoginPage() {
  const { user, loading, error, signInWithGoogle, signInWithEmail, createUserWithEmail } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar Firebase al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      initFirebase()
    }
  }, [])

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Manejar inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido a tu aplicación de Podología Clínica!",
        variant: "default",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      // Mensaje personalizado para el error de dominio no autorizado
      if (error.code === "auth/unauthorized-domain") {
        toast({
          title: "Error de dominio",
          description:
            "Este dominio no está autorizado para la autenticación. Por favor, agrega este dominio en la configuración de Firebase.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error al iniciar sesión",
          description: error.message || "Hubo un problema al iniciar sesión con Google",
          variant: "destructive",
        })
      }
    }
  }

  // Manejar inicio de sesión con email
  const handleEmailSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa tu email y contraseña",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await signInWithEmail(email, password)
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido a tu aplicación de Podología Clínica!",
        variant: "default",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      let errorMessage = "Hubo un problema al iniciar sesión"

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email o contraseña incorrectos"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde"
      }

      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar registro con email
  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa tu email y contraseña",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Contraseña débil",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createUserWithEmail(email, password)
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
        variant: "default",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Error al crear cuenta:", error)

      let errorMessage = "Hubo un problema al crear la cuenta"

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email ya está en uso"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido"
      }

      toast({
        title: "Error al crear cuenta",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Podología Clínica</CardTitle>
          <CardDescription>Inicia sesión para acceder a tu sistema de gestión</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleEmailSignIn} className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>

                <Button onClick={handleEmailSignUp} variant="outline" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="google">
              <Button onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión con Google"
                )}
              </Button>

              <p className="text-sm text-center mt-4 text-muted-foreground">
                Si tienes problemas con Google, usa la opción de Email
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>

        {error && (
          <CardFooter>
            <p className="text-destructive text-sm text-center w-full">{error}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}


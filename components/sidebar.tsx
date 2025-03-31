"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, UserPlus, Users, Calendar, Menu } from "lucide-react"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { id: "add-patient", label: "Agregar Paciente", icon: <UserPlus className="mr-2 h-4 w-4" /> },
    { id: "patient-list", label: "Lista de Pacientes", icon: <Users className="mr-2 h-4 w-4" /> },
    { id: "schedule-appointment", label: "Programar Cita", icon: <Calendar className="mr-2 h-4 w-4" /> },
  ]

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setOpen(false) // Cerrar el menú móvil después de seleccionar una opción
  }

  return (
    <>
      {/* Menú para dispositivos móviles */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="py-4 px-2">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleMenuClick(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Menú para escritorio (sin cambios) */}
      <aside className="w-64 bg-secondary p-4 hidden md:block">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
    </>
  )
}


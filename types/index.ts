// Tipos para la aplicación
export interface Patient {
  id?: string
  name: string
  rut: string
  age: string
  gender: string
  address: string
  phone: string
  pathologies: string[]
  lastVisit: string | null
  createdAt?: Date
}

export interface Appointment {
  id?: string
  patientId: string
  date: string
  type: string
  createdAt?: Date
}

export interface GoogleCalendarEvent {
  summary: string
  description: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  reminders: {
    useDefault: boolean
    overrides: {
      method: string
      minutes: number
    }[]
  }
}


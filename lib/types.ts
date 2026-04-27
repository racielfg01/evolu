import { StaticImageData } from "next/image"

export interface Service {
  id: string
  name: string
  description: string
  detailedDescription: string
  duration: number
  price: number
  image: StaticImageData
  benefits: string[]
  preparation: string[]
  category: string
  isActive: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface UserInfo {
  id?: string
  name: string
  email: string
  phone: string
  notes: string
  avatar?: string
}

export interface Booking {
  id: string
  userId: string
  services: Service[]
  date: Date
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  userInfo: UserInfo
  totalPrice: number
  totalDuration: number
  createdAt: Date
  notes?: string
}

export interface BookingState {
  currentStep: number
  selectedServices: Service[]
  selectedDate: Date | null
  selectedTime: string | null
  userInfo: UserInfo
  isLoading: boolean
  error: string | null
  currentUser: UserInfo | null
  userBookings: Booking[]
}

export interface AdminStats {
  totalBookings: number
  totalRevenue: number
  popularServices: { service: string; count: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  bookingsByStatus: { status: string; count: number }[]
}

export interface BusinessConfig {
  name: string
  address: string
  phone: string
  email: string
  logo: string
  website?: string
}

export interface LocalizationConfig {
  defaultLanguage: "es" | "en"
  currency: "USD" | "EUR" | "MXN" | "COP" | "ARS"
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
  timeFormat: "12h" | "24h"
  timezone: string
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  order: number
}

export interface SystemConfig {
  interServiceBuffer: {
    enabled: boolean
    duration: number // in minutes
  }
  businessInfo: BusinessConfig
  localization: LocalizationConfig
  categories: ServiceCategory[]
}

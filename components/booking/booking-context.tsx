"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// Tipos para nuestro sistema de reservas
export interface Service {
  id: string
  name: string
  description: string
  duration: number // en minutos
  price: number
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface UserInfo {
  name: string
  email: string
  phone: string
  notes: string
}

export interface BookingState {
  currentStep: number
  selectedServices: Service[]
  selectedDate: Date | null
  selectedTime: string | null
  userInfo: UserInfo
  isLoading: boolean
  error: string | null
}

type BookingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "ADD_SERVICE"; payload: Service }
  | { type: "REMOVE_SERVICE"; payload: string }
  | { type: "SET_DATE"; payload: Date }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_USER_INFO"; payload: Partial<UserInfo> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_BOOKING" }

const initialState: BookingState = {
  currentStep: 1,
  selectedServices: [],
  selectedDate: null,
  selectedTime: null,
  userInfo: {
    name: "",
    email: "",
    phone: "",
    notes: "",
  },
  isLoading: false,
  error: null,
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "ADD_SERVICE":
      return {
        ...state,
        selectedServices: [...state.selectedServices, action.payload],
      }
    case "REMOVE_SERVICE":
      return {
        ...state,
        selectedServices: state.selectedServices.filter((s) => s.id !== action.payload),
      }
    case "SET_DATE":
      return { ...state, selectedDate: action.payload, selectedTime: null }
    case "SET_TIME":
      return { ...state, selectedTime: action.payload }
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload },
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "RESET_BOOKING":
      return initialState
    default:
      return state
  }
}

const BookingContext = createContext<{
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
} | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  return <BookingContext.Provider value={{ state, dispatch }}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking debe usarse dentro de un BookingProvider")
  }
  return context
}

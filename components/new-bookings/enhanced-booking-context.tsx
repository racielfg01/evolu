"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import type {  UserInfo } from "@/lib/types";
// import { mockUser, mockBookings, mockSystemConfig } from "@/lib/mock-data"
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import { WorkingHours } from "@prisma/client";
import { FullAppointment } from "@/lib/actions/appointment.actions";
import { BusinessConfiguration } from "@/lib/actions/config.actions";

// type BookingAction =
//   | { type: "SET_STEP"; payload: number }
//   | { type: "ADD_SERVICE"; payload: Service }
//   | { type: "REMOVE_SERVICE"; payload: string }
//   | { type: "SET_DATE"; payload: Date }
//   | { type: "SET_TIME"; payload: string }
//   | { type: "SET_USER_INFO"; payload: Partial<UserInfo> }
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_ERROR"; payload: string | null }
//   | { type: "SET_CURRENT_USER"; payload: UserInfo | null }
//   | { type: "SET_USER_BOOKINGS"; payload: Booking[] }
//   | { type: "ADD_BOOKING"; payload: Booking }
//   | { type: "UPDATE_BOOKING"; payload: { id: string; updates: Partial<Booking> } }
//   | { type: "RESET_BOOKING" }
//   | { type: "UPDATE_SYSTEM_CONFIG"; payload: Partial<SystemConfig> }
//   | { type: "UPDATE_BUSINESS_INFO"; payload: Partial<SystemConfig["businessInfo"]> }
//   | { type: "UPDATE_LOCALIZATION"; payload: Partial<SystemConfig["localization"]> }
//   | { type: "UPDATE_INTER_SERVICE_BUFFER"; payload: SystemConfig["interServiceBuffer"] }
//   | { type: "ADD_CATEGORY"; payload: SystemConfig["categories"][0] }
//   | { type: "UPDATE_CATEGORY"; payload: { id: string; updates: Partial<SystemConfig["categories"][0]> } }
//   | { type: "DELETE_CATEGORY"; payload: string }

// export interface BookingState {
//   currentStep: number
//   selectedServices: Service[]
//   selectedDate: Date | null
//   selectedTime: string | null
//   userInfo: {
//     name: string
//     email: string
//     phone: string
//     notes: string
//   }
//   isLoading: boolean
//   error: string | null
//   currentUser: UserInfo | null
//   userBookings: Booking[]
//   systemConfig: SystemConfig
// }

// const initialState: BookingState = {
//   currentStep: 1,
//   selectedServices: [],
//   selectedDate: null,
//   selectedTime: null,
//   userInfo: {
//     name: "",
//     email: "",
//     phone: "",
//     notes: "",
//   },
//   isLoading: false,
//   error: null,
//   currentUser: mockUser, // Simulating logged in user
//   userBookings: mockBookings,
//   systemConfig: mockSystemConfig,
// }
//function bookingReducer(state: EnhancedBookingState, action: EnhancedBookingAction): BookingState {
//   switch (action.type) {
//     case "SET_STEP":
//       return { ...state, currentStep: action.payload }
//     case "ADD_SERVICE":
//       return {
//         ...state,
//         selectedServices: [...state.selectedServices, action.payload],
//       }
//     case "REMOVE_SERVICE":
//       return {
//         ...state,
//         selectedServices: state.selectedServices.filter((s) => s.id !== action.payload),
//       }
//     case "SET_DATE":
//       return { ...state, selectedDate: action.payload, selectedTime: null }
//     case "SET_TIME":
//       return { ...state, selectedTime: action.payload }
//     case "SET_USER_INFO":
//       return {
//         ...state,
//         userInfo: { ...state.userInfo, ...action.payload },
//       }
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload }
//     case "SET_ERROR":
//       return { ...state, error: action.payload }
//     case "SET_CURRENT_USER":
//       return { ...state, currentUser: action.payload }
//     case "SET_USER_BOOKINGS":
//       return { ...state, userBookings: action.payload }
//     case "ADD_BOOKING":
//       return { ...state, userBookings: [...state.userBookings, action.payload] }
//     case "UPDATE_BOOKING":
//       return {
//         ...state,
//         userBookings: state.userBookings.map((booking) =>
//           booking.id === action.payload.id ? { ...booking, ...action.payload.updates } : booking,
//         ),
//       }
//     case "RESET_BOOKING":
//       return {
//         ...initialState,
//         currentUser: state.currentUser,
//         userBookings: state.userBookings,
//       }
//     case "UPDATE_SYSTEM_CONFIG":
//       return {
//         ...state,
//         systemConfig: { ...state.systemConfig, ...action.payload },
//       }
//     case "UPDATE_BUSINESS_INFO":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           businessInfo: { ...state.systemConfig.businessInfo, ...action.payload },
//         },
//       }
//     case "UPDATE_LOCALIZATION":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           localization: { ...state.systemConfig.localization, ...action.payload },
//         },
//       }
//     case "UPDATE_INTER_SERVICE_BUFFER":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           interServiceBuffer: action.payload,
//         },
//       }
//     case "ADD_CATEGORY":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           categories: [...state.systemConfig.categories, action.payload],
//         },
//       }
//     case "UPDATE_CATEGORY":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           categories: state.systemConfig.categories.map((cat) =>
//             cat.id === action.payload.id ? { ...cat, ...action.payload.updates } : cat,
//           ),
//         },
//       }
//     case "DELETE_CATEGORY":
//       return {
//         ...state,
//         systemConfig: {
//           ...state.systemConfig,
//           categories: state.systemConfig.categories.filter((cat) => cat.id !== action.payload),
//         },
//       }
//     default:
//       return state
//   }
// }

interface TimeSlot {
  time: string; // Formato "HH:MM"
  available: boolean;
  startDateTime?: Date; // Fecha y hora completa de inicio
  endDateTime?: Date; // Fecha y hora completa de fin
}

interface EnhancedBookingState {
  selectedServices: ServiceWithRelations[];
  selectedDate: Date | null;
  selectedTime: string | null; // Solo la hora en formato "HH:MM"
  selectedStartDateTime: Date | null; // Fecha y hora completa de inicio
  selectedEndDateTime: Date | null; // Fecha y hora completa de fin
  userInfo: UserInfo;
  currentStep: number;
  totalDuration: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  availableSlots: TimeSlot[];
  workingHours: WorkingHours[];
  businessConfig: BusinessConfiguration;
  userBookings: FullAppointment[];
}

// Acciones del reducer
type EnhancedBookingAction =
  | { type: "ADD_SERVICE"; payload: ServiceWithRelations }
  | { type: "ADD_BOOKING"; payload: FullAppointment }
  | { type: "UPDATE_BOOKING"; payload: { id: string; updates: Partial<FullAppointment> } }
  | { type: "REMOVE_SERVICE"; payload: string }
  | { type: "SET_DATE"; payload: Date | null }
  | { type: "SET_TIME"; payload: string | null }
  | { type: "SET_START_DATE_TIME"; payload: Date | null }
  | { type: "SET_END_DATE_TIME"; payload: Date | null }
  | { type: "SET_USER_INFO"; payload: Partial<UserInfo> | null }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_TOTAL_DURATION"; payload: number }
  | { type: "SET_TOTAL_PRICE"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_WORKING_HOURS"; payload: WorkingHours[] }
  | { type: "SET_BUSINESS_CONFIG"; payload: BusinessConfiguration }
  | { type: "SET_USER_BOOKINGS"; payload: FullAppointment[] }
  | { type: "SET_AVAILABLE_SLOTS"; payload: TimeSlot[] }
  | { type: "RESET_BOOKING" };

// Implementación del reducer
function enhancedBookingReducer(
  state: EnhancedBookingState,
  action: EnhancedBookingAction
): EnhancedBookingState {
  switch (action.type) {
    case "ADD_SERVICE":
      return {
        ...state,
        selectedServices: [...state.selectedServices, action.payload],
      };

    case "REMOVE_SERVICE":
      return {
        ...state,
        selectedServices: state.selectedServices.filter(
          (service) => service.id !== action.payload
        ),
      };

    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
        selectedTime: null, // Reset time when date changes
        selectedStartDateTime: null,
        selectedEndDateTime: null,
      };

    case "SET_TIME":
      return {
        ...state,
        selectedTime: action.payload,
      };

    case "SET_START_DATE_TIME":
      return {
        ...state,
        selectedStartDateTime: action.payload,
      };

    case "SET_END_DATE_TIME":
      return {
        ...state,
        selectedEndDateTime: action.payload,
      };

    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload },
      };

    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };
    case "SET_TOTAL_DURATION":
      return {
        ...state,
        totalDuration: action.payload,
      };
    case "SET_TOTAL_PRICE":
      return {
        ...state,
        totalPrice: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_WORKING_HOURS":
      return {
        ...state,
        workingHours: action.payload,
      };

    case "SET_BUSINESS_CONFIG":
      return {
        ...state,
        businessConfig: action.payload,
      };

    case "SET_AVAILABLE_SLOTS":
      return {
        ...state,
        availableSlots: action.payload,
      };
    case "SET_USER_BOOKINGS":
      return { ...state, userBookings: action.payload };
    case "ADD_BOOKING":
      return {
        ...state,
        userBookings: [...state.userBookings, action.payload],
      };
    case "UPDATE_BOOKING":
      return {
        ...state,
        userBookings: state.userBookings.map((booking) =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        ),
      };

    case "RESET_BOOKING":
      return {
        ...initialState,
        userInfo: state.userInfo, // Mantener la info del usuario
        workingHours: state.workingHours, // Mantener horarios laborales
      };

    default:
      return state;
  }
}

// Estado inicial
const initialState: EnhancedBookingState = {
  selectedServices: [],
  selectedDate: null,
  selectedTime: null,
  selectedStartDateTime: null,
  selectedEndDateTime: null,
  userInfo: {
    id: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
    avatar: "",
  },
  currentStep: 1,
  totalDuration: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  availableSlots: [],
  workingHours: [],
  businessConfig: {
    weekAvailability: {},
    specificDateOverrides: [],
    minBookingNotice: 0
  },
  userBookings:[]
};

const BookingContext = createContext<{
  state: EnhancedBookingState;
  dispatch: React.Dispatch<EnhancedBookingAction>;
} | null>(null);

export function EnhancedBookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(enhancedBookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useEnhancedBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      "useEnhancedBooking debe usarse dentro de un EnhancedBookingProvider"
    );
  }
  return context;
}

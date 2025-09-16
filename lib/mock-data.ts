import type { Service, Booking, UserInfo, AdminStats, SystemConfig } from "./types"

import img1 from '@/assest/Massage-Therapy.jpg'
import img2 from '@/assest/Desertika_Faciales_HidratacionProfunda.jpg'
import img3 from '@/assest/tratamientos-corporales.webp'
import img4 from '@/assest/podologia.jpg'



export const mockServices: Service[] = [
  {
    id: "1",
    name: "Facial Clásico",
    description: "Limpieza profunda facial con extracción y tratamiento hidratante",
    detailedDescription:
      "Nuestro facial clásico es un tratamiento completo que incluye limpieza profunda, exfoliación suave, extracción de impurezas y aplicación de mascarilla hidratante. Perfecto para todo tipo de piel.",
    duration: 60,
    price: 85,
    // image: img2"/placeholder.svg?height=300&width=400",
    image: img2,
    benefits: [
      "Limpieza profunda de poros",
      "Eliminación de células muertas",
      "Hidratación intensa",
      "Mejora la textura de la piel",
    ],
    preparation: [
      "No usar productos exfoliantes 24h antes",
      "Llegar sin maquillaje",
      "Informar sobre alergias o sensibilidades",
    ],
    category: "Faciales",
    isActive: true,
  },
  {
    id: "2",
    name: "Podología",
    description: "Consiente tus manos y pies con nuestros meticulosos servicios de cuidado de uñas. Elige entre una variedad de colores y acabados para completar tu look.",
    detailedDescription:
      "Tratamiento especializado para pieles secas y deshidratadas. Incluye limpieza suave, aplicación de suero hidratante y mascarilla nutritiva con ácido hialurónico.",
    duration: 75,
    price: 95,
    image: img4,
    benefits: ["Hidratación profunda", "Restaura la barrera cutánea", "Reduce la sequedad", "Aporta luminosidad"],
    preparation: ["Suspender retinoides 48h antes", "Mantener la piel hidratada", "Evitar exposición solar intensa"],
    category: "Faciales",
    isActive: true,
  },
  {
    id: "3",
    name: "Terapia de Masajes",
    description: "Disfruta del poder curativo del tacto con nuestra terapia de masajes personalizada. Nuestros terapeutas experimentados adaptan cada sesión para abordar tus necesidades específicas.",
    detailedDescription:
      "Tratamiento anti-edad con tecnología avanzada que combina péptidos, vitamina C y colágeno para reducir signos de envejecimiento y mejorar la firmeza de la piel.",
    duration: 90,
    price: 120,
    image: img1,
    benefits: [
      "Reduce líneas de expresión",
      "Mejora la firmeza",
      "Estimula la producción de colágeno",
      "Unifica el tono de piel",
    ],
    preparation: [
      "Consulta previa recomendada",
      "No usar ácidos 72h antes",
      "Protección solar obligatoria post-tratamiento",
    ],
    category: "Faciales",
    isActive: true,
  },
  {
    id: "4",
    name: "Tratamientos Corporales",
    description: "Mima tu cuerpo con una experiencia relajante y rejuvenecedora con nuestros envolturas, exfoliantes y otros tratamientos especiales.",
    detailedDescription:
      "Servicio de depilación y diseño de cejas utilizando la técnica del hilo. Incluye consulta de forma, depilación precisa y acabado con productos calmantes.",
    duration: 30,
    price: 35,
    image: img3,
    benefits: ["Precisión máxima", "Duración prolongada", "No irrita la piel", "Diseño personalizado"],
    preparation: ["Dejar crecer el vello 2 semanas", "No usar cremas exfoliantes", "Informar sobre medicamentos"],
    category: "Cejas y Pestañas",
    isActive: true,
  },
  {
    id: "5",
    name: "Extensiones de Pestañas",
    description: "Set completo de extensiones individuales de pestañas premium",
    detailedDescription:
      "Aplicación de extensiones de pestañas individuales de alta calidad. Proceso que dura 2 horas para lograr pestañas más largas, voluminosas y curvadas de forma natural.",
    duration: 120,
    price: 150,
    image:img1,
    benefits: ["Pestañas más largas y voluminosas", "Aspecto natural", "Duración 4-6 semanas", "Resistente al agua"],
    preparation: [
      "Llegar sin maquillaje en los ojos",
      "No usar rizador de pestañas 24h antes",
      "Evitar cafeína antes del tratamiento",
    ],
    category: "Cejas y Pestañas",
    isActive: true,
  },
  {
    id: "6",
    name: "Manicura",
    description: "Cuidado completo de uñas con aplicación de esmalte",
    detailedDescription:
      "Servicio completo de manicura que incluye limado, cutícula, exfoliación de manos, masaje hidratante y aplicación de esmalte de larga duración.",
    duration: 45,
    price: 45,
    image: img1,
    benefits: [
      "Uñas perfectamente cuidadas",
      "Manos suaves e hidratadas",
      "Esmalte de larga duración",
      "Relajación y bienestar",
    ],
    preparation: ["Retirar esmalte anterior", "Hidratar las manos regularmente", "No cortar cutículas en casa"],
    category: "Uñas",
    isActive: true,
  },
  {
    id: "7",
    name: "Pedicura",
    description: "Tratamiento relajante de pies con cuidado de uñas y masaje",
    detailedDescription:
      "Tratamiento completo de pedicura con baño de pies, exfoliación, cuidado de cutículas, masaje relajante y aplicación de esmalte. Incluye tratamiento de callos y durezas.",
    duration: 60,
    price: 55,
    image: img1,
    benefits: ["Pies suaves y cuidados", "Eliminación de durezas", "Relajación profunda", "Uñas perfectas"],
    preparation: ["Lavar bien los pies", "No usar cremas muy grasas", "Informar sobre problemas en los pies"],
    category: "Uñas",
    isActive: true,
  },
  {
    id: "8",
    name: "Masaje de Tejido Profundo",
    description: "Masaje terapéutico para tensión muscular y nudos",
    detailedDescription:
      "Masaje terapéutico especializado en liberar tensión muscular profunda. Utiliza técnicas específicas para tratar nudos, contracturas y mejorar la circulación sanguínea.",
    duration: 60,
    price: 90,
    image: img1,
    benefits: ["Alivia tensión muscular", "Mejora la circulación", "Reduce el estrés", "Aumenta la flexibilidad"],
    preparation: [
      "Hidratarse bien antes del masaje",
      "No comer comida pesada 2h antes",
      "Informar sobre lesiones o dolores",
    ],
    category: "Masajes",
    isActive: true,
  },
]

export const mockUser: UserInfo = {
  id: "user-1",
  name: "María García",
  email: "maria.garcia@email.com",
  phone: "+34 666 123 456",
  notes: "",
  avatar: "/placeholder.svg?height=100&width=100",
}

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    services: [mockServices[0], mockServices[3]],
    date: new Date(2024, 11, 15),
    time: "10:00",
    status: "confirmed",
    userInfo: mockUser,
    totalPrice: 120,
    totalDuration: 90,
    createdAt: new Date(2024, 10, 20),
    notes: "Primera vez, piel sensible",
  },
  {
    id: "booking-2",
    userId: "user-1",
    services: [mockServices[1]],
    date: new Date(2024, 10, 28),
    time: "14:30",
    status: "completed",
    userInfo: mockUser,
    totalPrice: 95,
    totalDuration: 75,
    createdAt: new Date(2024, 10, 15),
  },
  {
    id: "booking-3",
    userId: "user-1",
    services: [mockServices[5], mockServices[6]],
    date: new Date(2024, 11, 22),
    time: "16:00",
    status: "pending",
    userInfo: mockUser,
    totalPrice: 100,
    totalDuration: 105,
    createdAt: new Date(2024, 11, 1),
  },
]

export const mockAdminStats: AdminStats = {
  totalBookings: 156,
  totalRevenue: 12450,
  popularServices: [
    { service: "Facial Clásico", count: 45 },
    { service: "Manicura", count: 38 },
    { service: "Extensiones de Pestañas", count: 32 },
    { service: "Pedicura", count: 28 },
    { service: "Facial Hidratante", count: 13 },
  ],
  monthlyRevenue: [
    { month: "Ene", revenue: 8500 },
    { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 10100 },
    { month: "Abr", revenue: 11300 },
    { month: "May", revenue: 12450 },
  ],
  bookingsByStatus: [
    { status: "Confirmadas", count: 89 },
    { status: "Completadas", count: 52 },
    { status: "Pendientes", count: 12 },
    { status: "Canceladas", count: 3 },
  ],
}

export const mockSystemConfig: SystemConfig = {
  interServiceBuffer: {
    enabled: true,
    duration: 15,
  },
  businessInfo: {
    name: "Bella Spa",
    address: "Calle Principal 123, Ciudad, País",
    phone: "+34 666 123 456",
    email: "info@bellaspa.com",
    logo: "/placeholder.svg?height=100&width=200",
    website: "www.bellaspa.com",
  },
  localization: {
    defaultLanguage: "es",
    currency: "USD",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    timezone: "Europe/Madrid",
  },
  categories: [
    {
      id: "cat-1",
      name: "Faciales",
      description: "Tratamientos faciales y cuidado de la piel",
      color: "#FF6B6B",
      isActive: true,
      order: 1,
    },
    {
      id: "cat-2",
      name: "Cejas y Pestañas",
      description: "Servicios de cejas y pestañas",
      color: "#4ECDC4",
      isActive: true,
      order: 2,
    },
    {
      id: "cat-3",
      name: "Uñas",
      description: "Manicura y pedicura",
      color: "#45B7D1",
      isActive: true,
      order: 3,
    },
    {
      id: "cat-4",
      name: "Masajes",
      description: "Terapias de relajación y masajes",
      color: "#96CEB4",
      isActive: true,
      order: 4,
    },
  ],
}

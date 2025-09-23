import type {
  Service,
  Booking,
  UserInfo,
  AdminStats,
  SystemConfig,
} from "./types";

// import img1 from "@/assest/Massage-Therapy.jpg";
// import img2 from "@/assest/Desertika_Faciales_HidratacionProfunda.jpg";
// import img3 from "@/assest/tratamientos-corporales.webp";
import img4 from "@/assest/podologia.jpg";
import img5 from "@/assest/depilacion_axila.jpeg";
import img6 from "@/assest/masaje_relajante.jpeg";
import img7 from "@/assest/quiro_masaje.jpeg";

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Depilación de Axilas",
    description:
      "Piel suave y fresca con técnica profesional que respeta tu sensibilidad",
    detailedDescription:
      "Servicio de depilación con cera hipoalergénica en la zona axilar, incluye pre-limpieza con solución antiséptica, aplicación de cera a temperatura controlada y tratamiento post-depilatorio con gel calmante. Realizado en cabina privada con todas las medidas de higiene.",
    duration: 15,
    price: 600,
    image: img5,
    benefits: [
      "Piel suave por más tiempo semanas",
      "Reducción progresiva del vello",
      "Menor irritación vs. rasurada",
      "Mayor eficacia de antitranspirantes",
    ],
    preparation: [
      "Vello de mínimo 5mm de longitud o el largo de u. Granito de arroz",
      " Se prefiere evitar exposición solar antes y después",
      "No aplicar cremas ni desodorante el día del servicio",
    ],
    category: "Depilación",
    isActive: true,
  },
  {
    id: "2",
    name: "Depilación Brasileña",
    description: "Eliminación total de vello en zona íntima.",
    detailedDescription:
      "Depilación completa del área vulvar (labios mayores y menores), perineal y anal. Realizado con cera hipoalergénica especial para zonas sensibles y técnica profesional que garantiza máxima higiene y comodidad en cabina privada.",
    duration: 30,
    price: 1800,
    image: img4,
    benefits: [
      "Piel suave por 4-5 semanas",
      "Higiene optimizada",
      "Diseño personalizado (total o con línea)",
      "Reducción progresiva del vello",
      "Comodidad en ropa interior y deportiva",
    ],
    preparation: [
      "Vello de mínimo 5mm de longitud",
      "Evitar exposición solar 12h antes y después",
      "No aplicar cremas el día del servicio",
      "Recomendable exfoliar suavemente la zona 24h antes",
    ],
    category: "Depilación Íntima",
    isActive: true,
  },
  {
    id: "3",
      name: "Quiromasaje Relajante - Cuerpo Completo",
  description: "Terapia manual que libera tensiones físicas y emocionales mediante movimientos armoniosos",
  detailedDescription: 
    "Masaje terapeútico de cuerpo completo que combina técnicas suaves de quieropraxia, amasamiento, deslizamientos y presiones controladas. Trabajamos espalda, cuello, hombros, brazos, piernas y pies con aceites esenciales personalizados según tus necesidades. Sesión diseñada para inducir estado de calma profunda mientras liberamos contracturas musculares.",
  duration: 90,
  price: 3500,
  image: img7,
  benefits: [
    "Liberación de tensión muscular",
    "Mejora de la circulación sanguínea",
    "Reducción de estrés y ansiedad",
    "Mejor calidad de sueño",
    "Recarga de energía vital", 
" Descompresión articular controlada" 
  ],
  preparation: [
    "Ropa cómoda preferiblemente",
    "Evitar comidas pesadas 2h antes",
    "Informar sobre lesiones o condiciones médicas",
    "Llegar 10min antes para sesión de aromaselección y momento infusión herbal",
    "Mantener hidratación post-sesión"
  ],
  
  category: "Masajes Terapéuticos",
    isActive: true,
  },
  {
    id: "4",
     name: "Masaje Relajante - Cuerpo Completo",
  description: "Viaje sensorial que disuelve el estrés y reconecta cuerpo y mente",
  detailedDescription: 
    "Experiencia de relajación profunda que abarca espalda, cuello, hombros, brazos, piernas y pies. Combinamos técnicas suaves de amasamiento, deslizamientos largos y presiones rítmicas con aceites esenciales relajantes (lavanda, manzanilla). Cada movimiento está diseñado para liberar endorfinas y inducir un estado de calma profunda, en un ambiente con música terapéutica y aromas cuidadosamente seleccionados.",
  duration: 60,
  price: 2500,
  image: img6,
  benefits: [
    "Reducción inmediata del cortisol (hormona del estrés)",
    "Mejora de la calidad del sueño",
    "Alivio de tensiones musculares",
    "Estimulación del sistema linfático",
    "Renovación energética integral"
  ],
  preparation: [
    "Ropa cómoda preferiblemente",
    "No ingerir alimentos pesados 2h antes",
    "Comunicar preferencias de presión o zonas a trabajar",
    "Llegar 10min antes para sesión de aromaselección y momento infusión herbal"
  ],
  category: "Masajes Relajantes",
    isActive: true,
  }
];

export const mockUser: UserInfo = {
  id: "user-1",
  name: "María García",
  email: "maria.garcia@email.com",
  phone: "+34 666 123 456",
  notes: "",
  avatar: "/placeholder.svg?height=100&width=100",
};

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
];

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
};

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
};

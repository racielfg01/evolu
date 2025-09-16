// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Switch } from "@/components/ui/switch"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts"
// import {
//   Settings,
//   Plus,
//   Edit,
//   Trash2,
//   Calendar,
//   DollarSign,
//   TrendingUp,
//   Eye,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
// } from "lucide-react"
// import { mockServices, mockAdminStats, mockBookings } from "../lib/mock-data"
// import { AdminConfiguration } from "./admin-configuration"
// import type { Service } from "../lib/types"
// import Image from "next/image"

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// export function EnhancedAdminDashboard() {
//   const [services, setServices] = useState(mockServices)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)
//   const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
//   const [bookings] = useState(mockBookings)

//   const handleServiceSave = (service: Service) => {
//     if (selectedService) {
//       setServices(services.map((s) => (s.id === service.id ? service : s)))
//     } else {
//       setServices([...services, { ...service, id: Date.now().toString() }])
//     }
//     setIsServiceDialogOpen(false)
//     setSelectedService(null)
//   }

//   const handleServiceDelete = (serviceId: string) => {
//     setServices(services.map((s) => (s.id === serviceId ? { ...s, isActive: false } : s)))
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return <CheckCircle className="h-4 w-4 text-green-600" />
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-blue-600" />
//       case "pending":
//         return <AlertCircle className="h-4 w-4 text-yellow-600" />
//       case "cancelled":
//         return <XCircle className="h-4 w-4 text-red-600" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Panel de Administración</h2>
//         <p className="text-muted-foreground">Gestiona servicios, citas y visualiza estadísticas</p>
//       </div>

//       <Tabs defaultValue="dashboard" className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//           <TabsTrigger value="services">Servicios</TabsTrigger>
//           <TabsTrigger value="appointments">Citas</TabsTrigger>
//           <TabsTrigger value="analytics">Análisis</TabsTrigger>
//           <TabsTrigger value="configuration">Configuración</TabsTrigger>
//         </TabsList>

//         <TabsContent value="dashboard" className="space-y-6">
//           {/* Stats Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{mockAdminStats.totalBookings}</div>
//                 <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
//                 <DollarSign className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">${mockAdminStats.totalRevenue.toLocaleString()}</div>
//                 <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
//                 <Settings className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{services.filter((s) => s.isActive).length}</div>
//                 <p className="text-xs text-muted-foreground">de {services.length} servicios totales</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">87%</div>
//                 <p className="text-xs text-muted-foreground">+5% desde la semana pasada</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts */}
//           <div className="grid gap-6 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Ingresos Mensuales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={mockAdminStats.monthlyRevenue}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Estado de Reservas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={mockAdminStats.bookingsByStatus}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="count"
//                     >
//                       {mockAdminStats.bookingsByStatus.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="services" className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold">Gestión de Servicios</h3>
//             <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button onClick={() => setSelectedService(null)}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Nuevo Servicio
//                 </Button>
//               </DialogTrigger>
//               <ServiceDialog
//                 service={selectedService}
//                 onSave={handleServiceSave}
//                 onClose={() => setIsServiceDialogOpen(false)}
//               />
//             </Dialog>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {services.map((service) => (
//               <Card key={service.id} className={!service.isActive ? "opacity-50" : ""}>
//                 <div className="relative">
//                   <Image
//                     src={service.image || "/placeholder.svg"}
//                     alt={service.name}
//                     className="w-full h-32 object-cover rounded-t-lg"
//                   />
//                   <Badge variant={service.isActive ? "default" : "secondary"} className="absolute top-2 right-2">
//                     {service.isActive ? "Activo" : "Inactivo"}
//                   </Badge>
//                 </div>

//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-base">{service.name}</CardTitle>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <span>{service.duration} min</span>
//                     <span>•</span>
//                     <span>${service.price}</span>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0">
//                   <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{service.description}</p>

//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedService(service)
//                         setIsServiceDialogOpen(true)
//                       }}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => handleServiceDelete(service.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="appointments" className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold">Gestión de Citas</h3>
//             <div className="flex gap-2">
//               <Button variant="outline">Exportar</Button>
//               <Button>Nueva Cita</Button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {bookings.map((booking) => (
//               <Card key={booking.id}>
//                 <CardContent className="p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         {getStatusIcon(booking.status)}
//                         <Badge variant="outline">#{booking.id.slice(-6)}</Badge>
//                         <span className="font-medium">{booking.userInfo.name}</span>
//                       </div>

//                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         <span>{booking.date.toLocaleDateString("es-ES")}</span>
//                         <span>{booking.time}</span>
//                         <span>{booking.totalDuration} min</span>
//                       </div>

//                       <div className="flex flex-wrap gap-1">
//                         {booking.services.map((service) => (
//                           <Badge key={service.id} variant="secondary" className="text-xs">
//                             {service.name}
//                           </Badge>
//                         ))}
//                       </div>

//                       <div className="text-sm">
//                         <span className="text-muted-foreground">Contacto: </span>
//                         <span>
//                           {booking.userInfo.email} • {booking.userInfo.phone}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="text-right space-y-2">
//                       <p className="font-semibold">${booking.totalPrice}</p>
//                       <div className="flex gap-1">
//                         <Button variant="outline" size="sm">
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="analytics" className="space-y-6">
//           <h3 className="text-lg font-semibold">Análisis y Estadísticas</h3>

//           <div className="grid gap-6 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Servicios Más Populares</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={mockAdminStats.popularServices}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="service" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="count" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Tendencias de Reservas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <Alert>
//                     <TrendingUp className="h-4 w-4" />
//                     <AlertDescription>
//                       Las reservas han aumentado un 15% este mes comparado con el anterior.
//                     </AlertDescription>
//                   </Alert>

//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-sm">Lunes</span>
//                       <span className="text-sm font-medium">23 citas</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm">Martes</span>
//                       <span className="text-sm font-medium">31 citas</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm">Miércoles</span>
//                       <span className="text-sm font-medium">28 citas</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm">Jueves</span>
//                       <span className="text-sm font-medium">35 citas</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm">Viernes</span>
//                       <span className="text-sm font-medium">42 citas</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="configuration" className="space-y-6">
//           <AdminConfiguration />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// function ServiceDialog({
//   service,
//   onSave,
//   onClose,
// }: {
//   service: Service | null
//   onSave: (service: Service) => void
//   onClose: () => void
// }) {
//   const [formData, setFormData] = useState<Service>(
//     service || {
//       id: "",
//       name: "",
//       description: "",
//       detailedDescription: "",
//       duration: 60,
//       price: 0,
//       image: "/placeholder.svg?height=300&width=400",
//       benefits: [],
//       preparation: [],
//       category: "",
//       isActive: true,
//     },
//   )

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle>{service ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
//       </DialogHeader>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <Label htmlFor="name">Nombre del Servicio</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="category">Categoría</Label>
//             <Input
//               id="category"
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="description">Descripción Breve</Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="detailedDescription">Descripción Detallada</Label>
//           <Textarea
//             id="detailedDescription"
//             value={formData.detailedDescription}
//             onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
//             rows={4}
//             required
//           />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <Label htmlFor="duration">Duración (minutos)</Label>
//             <Input
//               id="duration"
//               type="number"
//               value={formData.duration}
//               onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="price">Precio ($)</Label>
//             <Input
//               id="price"
//               type="number"
//               value={formData.price}
//               onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="image">URL de Imagen</Label>
//           <Input
//             id="image"
//             value={formData.image}
//             onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//             placeholder="/placeholder.svg?height=300&width=400"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="benefits">Beneficios (separados por coma)</Label>
//           <Textarea
//             id="benefits"
//             value={formData.benefits.join(", ")}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 benefits: e.target.value.split(", ").filter((b) => b.trim()),
//               })
//             }
//             placeholder="Beneficio 1, Beneficio 2, Beneficio 3"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="preparation">Preparación (separada por coma)</Label>
//           <Textarea
//             id="preparation"
//             value={formData.preparation.join(", ")}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 preparation: e.target.value.split(", ").filter((p) => p.trim()),
//               })
//             }
//             placeholder="Preparación 1, Preparación 2, Preparación 3"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <Switch
//             id="isActive"
//             checked={formData.isActive}
//             onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
//           />
//           <Label htmlFor="isActive">Servicio Activo</Label>
//         </div>

//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancelar
//           </Button>
//           <Button type="submit">{service ? "Actualizar" : "Crear"} Servicio</Button>
//         </DialogFooter>
//       </form>
//     </DialogContent>
//   )
// }

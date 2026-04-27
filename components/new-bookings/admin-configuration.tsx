// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Settings, Clock, Building, Globe, Plus, Edit, Trash2, Save, AlertCircle, Upload } from "lucide-react"
// import { useEnhancedBooking } from "./enhanced-booking-context"
// import { MapSelector } from "./map-selector"
// import type { ServiceCategory } from "../lib/types"
// import Image from "next/image"

// export function AdminConfiguration() {
//   const { state, dispatch } = useEnhancedBooking()
//   const [isLoading, setIsLoading] = useState(false)
//   const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
//   const [newCategory, setNewCategory] = useState<Partial<ServiceCategory>>({
//     name: "",
//     description: "",
//     color: "#6B7280",
//     isActive: true,
//     order: 0,
//   })

//   // Business info form state
//   const [businessForm, setBusinessForm] = useState(state.systemConfig.businessInfo)
//   const [localizationForm, setLocalizationForm] = useState(state.systemConfig.localization)
//   const [bufferForm, setBufferForm] = useState(state.systemConfig.interServiceBuffer)

//   const colorOptions = [
//     { value: "#FF6B6B", label: "Rojo Coral" },
//     { value: "#4ECDC4", label: "Turquesa" },
//     { value: "#45B7D1", label: "Azul Cielo" },
//     { value: "#96CEB4", label: "Verde Menta" },
//     { value: "#FFEAA7", label: "Amarillo Suave" },
//     { value: "#DDA0DD", label: "Lavanda" },
//     { value: "#98D8C8", label: "Aqua" },
//     { value: "#F7DC6F", label: "Dorado" },
//   ]

//   const handleSaveBusinessInfo = async () => {
//     setIsLoading(true)
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       dispatch({ type: "UPDATE_BUSINESS_INFO", payload: businessForm })
//       console.log("Información del negocio guardada exitosamente")
//     } catch (error) {
//       console.log("Error al guardar la información "+error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSaveLocalization = async () => {
//     setIsLoading(true)
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       dispatch({ type: "UPDATE_LOCALIZATION", payload: localizationForm })
//       console.log("Configuración de localización guardada exitosamente")
//     } catch (error) {
//       console.log("Error al guardar la configuración "+error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSaveBuffer = async () => {
//     setIsLoading(true)
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       dispatch({ type: "UPDATE_INTER_SERVICE_BUFFER", payload: bufferForm })
//       console.log("Configuración de buffer guardada exitosamente")
//     } catch (error) {
//       console.log("Error al guardar la configuración "+error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSaveCategory = () => {
//     if (selectedCategory) {
//       dispatch({
//         type: "UPDATE_CATEGORY",
//         payload: { id: selectedCategory.id, updates: newCategory },
//       })
//     } else {
//       dispatch({
//         type: "ADD_CATEGORY",
//         payload: {
//           ...newCategory,
//           id: Date.now().toString(),
//           order: state.systemConfig.categories.length + 1,
//         } as ServiceCategory,
//       })
//     }
//     setIsCategoryDialogOpen(false)
//     setSelectedCategory(null)
//     setNewCategory({
//       name: "",
//       description: "",
//       color: "#6B7280",
//       isActive: true,
//       order: 0,
//     })
//   }

//   const handleDeleteCategory = (categoryId: string) => {
//     if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
//       dispatch({ type: "DELETE_CATEGORY", payload: categoryId })
//     }
//   }

//   const handleLocationChange = (location: { latitude: number; longitude: number; address: string }) => {
//     setBusinessForm((prev) => ({
//       ...prev,
//       address: location.address,
//       latitude: location.latitude,
//       longitude: location.longitude,
//     }))
//   }

//   const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       // In a real implementation, you would upload the file to a storage service
//       const mockUrl = URL.createObjectURL(file)
//       setBusinessForm((prev) => ({ ...prev, logo: mockUrl }))
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Configuración del Sistema</h2>
//         <p className="text-muted-foreground">Gestiona la configuración general de tu negocio</p>
//       </div>

//       <Tabs defaultValue="buffer" className="w-full">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="buffer" className="flex items-center gap-2">
//             <Clock className="h-4 w-4" />
//             Buffer
//           </TabsTrigger>
//           <TabsTrigger value="categories" className="flex items-center gap-2">
//             <Settings className="h-4 w-4" />
//             Categorías
//           </TabsTrigger>
//           <TabsTrigger value="business" className="flex items-center gap-2">
//             <Building className="h-4 w-4" />
//             Negocio
//           </TabsTrigger>
//           <TabsTrigger value="localization" className="flex items-center gap-2">
//             <Globe className="h-4 w-4" />
//             Localización
//           </TabsTrigger>
//         </TabsList>

//         {/* Inter-Service Buffer Configuration */}
//         <TabsContent value="buffer" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Tiempo de Buffer Entre Servicios
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   El tiempo de buffer permite preparación, limpieza y descanso entre servicios consecutivos.
//                 </AlertDescription>
//               </Alert>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label htmlFor="buffer-enabled">Habilitar Buffer</Label>
//                     <p className="text-sm text-muted-foreground">Activa el tiempo de buffer entre servicios</p>
//                   </div>
//                   <Switch
//                     id="buffer-enabled"
//                     checked={bufferForm.enabled}
//                     onCheckedChange={(checked) => setBufferForm((prev) => ({ ...prev, enabled: checked }))}
//                   />
//                 </div>

//                 {bufferForm.enabled && (
//                   <div className="space-y-2">
//                     <Label htmlFor="buffer-duration">Duración del Buffer (minutos)</Label>
//                     <div className="flex items-center gap-4">
//                       <Input
//                         id="buffer-duration"
//                         type="number"
//                         min="5"
//                         max="60"
//                         value={bufferForm.duration}
//                         onChange={(e) =>
//                           setBufferForm((prev) => ({
//                             ...prev,
//                             duration: Number.parseInt(e.target.value) || 15,
//                           }))
//                         }
//                         className="w-32"
//                       />
//                       <span className="text-sm text-muted-foreground">Rango: 5-60 minutos</span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       Tiempo adicional agregado automáticamente entre cada servicio
//                     </p>
//                   </div>
//                 )}

//                 <div className="bg-muted/50 p-4 rounded-lg">
//                   <h4 className="font-medium mb-2">Ejemplo de Aplicación:</h4>
//                   <div className="text-sm space-y-1">
//                     <div>• Facial (60 min) + Buffer ({bufferForm.duration} min) = 75 min total</div>
//                     <div>• Manicura (45 min) + Buffer ({bufferForm.duration} min) = 60 min total</div>
//                   </div>
//                 </div>
//               </div>

//               <Button onClick={handleSaveBuffer} disabled={isLoading}>
//                 <Save className="h-4 w-4 mr-2" />
//                 {isLoading ? "Guardando..." : "Guardar Configuración"}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Service Categories Management */}
//         <TabsContent value="categories" className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold">Gestión de Categorías</h3>
//             <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button onClick={() => setSelectedCategory(null)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Nueva Categoría
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>{selectedCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="category-name">Nombre</Label>
//                     <Input
//                       id="category-name"
//                       value={newCategory.name}
//                       onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
//                       placeholder="Nombre de la categoría"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="category-description">Descripción</Label>
//                     <Textarea
//                       id="category-description"
//                       value={newCategory.description}
//                       onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Descripción de la categoría"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="category-color">Color</Label>
//                     <Select
//                       value={newCategory.color}
//                       onValueChange={(value) => setNewCategory((prev) => ({ ...prev, color: value }))}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {colorOptions.map((color) => (
//                           <SelectItem key={color.value} value={color.value}>
//                             <div className="flex items-center gap-2">
//                               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
//                               {color.label}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="category-active"
//                       checked={newCategory.isActive}
//                       onCheckedChange={(checked) => setNewCategory((prev) => ({ ...prev, isActive: checked }))}
//                     />
//                     <Label htmlFor="category-active">Categoría Activa</Label>
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
//                     Cancelar
//                   </Button>
//                   <Button onClick={handleSaveCategory}>{selectedCategory ? "Actualizar" : "Crear"} Categoría</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {state.systemConfig.categories.map((category) => (
//               <Card key={category.id} className={!category.isActive ? "opacity-50" : ""}>
//                 <CardHeader className="pb-3">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
//                       <CardTitle className="text-base">{category.name}</CardTitle>
//                     </div>
//                     <Badge variant={category.isActive ? "default" : "secondary"}>
//                       {category.isActive ? "Activa" : "Inactiva"}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedCategory(category)
//                         setNewCategory(category)
//                         setIsCategoryDialogOpen(true)
//                       }}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         {/* Business Information */}
//         <TabsContent value="business" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Building className="h-5 w-5" />
//                 Información del Negocio
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="business-name">Nombre del Negocio</Label>
//                   <Input
//                     id="business-name"
//                     value={businessForm.name}
//                     onChange={(e) => setBusinessForm((prev) => ({ ...prev, name: e.target.value }))}
//                     placeholder="Nombre de tu negocio"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="business-email">Correo Electrónico</Label>
//                   <Input
//                     id="business-email"
//                     type="email"
//                     value={businessForm.email}
//                     onChange={(e) => setBusinessForm((prev) => ({ ...prev, email: e.target.value }))}
//                     placeholder="info@tunegocio.com"
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="business-phone">Teléfono</Label>
//                   <Input
//                     id="business-phone"
//                     value={businessForm.phone}
//                     onChange={(e) => setBusinessForm((prev) => ({ ...prev, phone: e.target.value }))}
//                     placeholder="+34 666 123 456"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="business-website">Sitio Web (Opcional)</Label>
//                   <Input
//                     id="business-website"
//                     value={businessForm.website || ""}
//                     onChange={(e) => setBusinessForm((prev) => ({ ...prev, website: e.target.value }))}
//                     placeholder="www.tunegocio.com"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="business-logo">Logo del Negocio</Label>
//                 <div className="flex items-center gap-4">
//                   {businessForm.logo && (
//                     <Image
//                       src={businessForm.logo || "/placeholder.svg"}
//                       alt="Logo"
//                       className="w-16 h-16 object-contain border rounded"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <Input
//                       id="business-logo"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="hidden"
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => document.getElementById("business-logo")?.click()}
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       Subir Logo
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <MapSelector
//                 latitude={businessForm.latitude}
//                 longitude={businessForm.longitude}
//                 address={businessForm.address}
//                 onLocationChange={handleLocationChange}
//               />

//               <Button onClick={handleSaveBusinessInfo} disabled={isLoading}>
//                 <Save className="h-4 w-4 mr-2" />
//                 {isLoading ? "Guardando..." : "Guardar Información"}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Localization Settings */}
//         <TabsContent value="localization" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Globe className="h-5 w-5" />
//                 Configuración de Localización
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   Los cambios en la configuración de localización afectarán toda la aplicación.
//                 </AlertDescription>
//               </Alert>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="default-language">Idioma Predeterminado</Label>
//                   <Select
//                     value={localizationForm.defaultLanguage}
//                     onValueChange={(value: "es" | "en") =>
//                       setLocalizationForm((prev) => ({ ...prev, defaultLanguage: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="es">Español</SelectItem>
//                       <SelectItem value="en">English</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="currency">Moneda</Label>
//                   <Select
//                     value={localizationForm.currency}
//                     onValueChange={(value: "USD" | "EUR" | "MXN" | "COP" | "ARS") =>
//                       setLocalizationForm((prev) => ({ ...prev, currency: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
//                       <SelectItem value="EUR">EUR - Euro</SelectItem>
//                       <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
//                       <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
//                       <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="date-format">Formato de Fecha</Label>
//                   <Select
//                     value={localizationForm.dateFormat}
//                     onValueChange={(value: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD") =>
//                       setLocalizationForm((prev) => ({ ...prev, dateFormat: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (Europeo)</SelectItem>
//                       <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (Americano)</SelectItem>
//                       <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="time-format">Formato de Hora</Label>
//                   <Select
//                     value={localizationForm.timeFormat}
//                     onValueChange={(value: "12h" | "24h") =>
//                       setLocalizationForm((prev) => ({ ...prev, timeFormat: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
//                       <SelectItem value="24h">24 horas</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="timezone">Zona Horaria</Label>
//                 <Select
//                   value={localizationForm.timezone}
//                   onValueChange={(value) => setLocalizationForm((prev) => ({ ...prev, timezone: value }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Europe/Madrid">Europa/Madrid (CET)</SelectItem>
//                     <SelectItem value="America/Mexico_City">América/Ciudad_de_México (CST)</SelectItem>
//                     <SelectItem value="America/Bogota">América/Bogotá (COT)</SelectItem>
//                     <SelectItem value="America/Argentina/Buenos_Aires">América/Buenos_Aires (ART)</SelectItem>
//                     <SelectItem value="America/New_York">América/Nueva_York (EST)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Button onClick={handleSaveLocalization} disabled={isLoading}>
//                 <Save className="h-4 w-4 mr-2" />
//                 {isLoading ? "Guardando..." : "Guardar Configuración"}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

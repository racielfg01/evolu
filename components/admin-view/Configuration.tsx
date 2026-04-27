// "use client";

import type React from "react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



import { RolManagment } from "./RolManagment";
import { SexManagment } from "./SexManagment";
import { CategoryManagment } from "./CategoryManagment";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export async function Configuration() {
 

 

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
      <div className="flex flex-col mx-8">
         <h2 className="text-xl font-bold">Configuración</h2>
          <p className="text-muted-foreground text-md">
            Gestiona servicios, citas y visualiza estadísticas
          </p>
        </div>
     
        

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="sex">Sexo</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
           
            </TabsList>
            <TabsContent value="general" className="space-y-6">
              <CategoryManagment />
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <RolManagment />
            </TabsContent>

            <TabsContent value="sex" className="space-y-6">
               <SexManagment />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManagment/>
            </TabsContent>
          
         
          </Tabs>
        </div>
    </div>
  );
}

// export function ServiceDialog({
//   service,
//   onSave,
//   onClose,
// }: {
//   service: Service | null;
//   onSave: (service: Service) => void;
//   onClose: () => void;
// }) {
//   const { data: user } = useSession();
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
//     }
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };
//   console.log({ user });

//   return (
//     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle>
//           {service ? "Editar Servicio" : "Nuevo Servicio"}
//         </DialogTitle>
//       </DialogHeader>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <Label htmlFor="name">Nombre del Servicio</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="category">Categoría</Label>
//             <Input
//               id="category"
//               value={formData.category}
//               onChange={(e) =>
//                 setFormData({ ...formData, category: e.target.value })
//               }
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="description">Descripción Breve</Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="detailedDescription">Descripción Detallada</Label>
//           <Textarea
//             id="detailedDescription"
//             value={formData.detailedDescription}
//             onChange={(e) =>
//               setFormData({ ...formData, detailedDescription: e.target.value })
//             }
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
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   duration: Number.parseInt(e.target.value),
//                 })
//               }
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="price">Precio ($)</Label>
//             <Input
//               id="price"
//               type="number"
//               value={formData.price}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   price: Number.parseFloat(e.target.value),
//                 })
//               }
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="image">URL de Imagen</Label>
//           {/* <Input
//             id="image"
//             value={formData.image}
//             onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//             placeholder="/placeholder.svg?height=300&width=400"
//           /> */}
//           <ImageUploader />
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
//             onCheckedChange={(checked) =>
//               setFormData({ ...formData, isActive: checked })
//             }
//           />
//           <Label htmlFor="isActive">Servicio Activo</Label>
//         </div>

//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancelar
//           </Button>
//           <Button type="submit">
//             {service ? "Actualizar" : "Crear"} Servicio
//           </Button>
//         </DialogFooter>
//       </form>
//     </DialogContent>
//   );
// }

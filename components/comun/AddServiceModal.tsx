// "use client"
// import { Service, ServiceFile } from "@prisma/client";
// import { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Switch } from "@radix-ui/react-switch";
// import { Button } from "../ui/button";
// import ImageUploader from "@/components/ImageUploader";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useGetAllCategorys } from "@/lib/hooks/category.hooks";
// import { addService, editService } from "@/lib/actions/services.actions";
// import { uploadImages } from "@/lib/supabase/storage";

// export interface ServiceFormData {
//   id?: string;
//   name: string;
//   description: string;
//   detailedDescription: string;
//   duration: number;
//   price: number;
//   benefits: string[];
//   preparation: string[];
//   category_id: string;
//   isActive: boolean;
//   images?: ServiceFile[];
//     cuid?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface ImageFile {
//   file: File;
//   preview: string;
//   id: string; // Identificador único para cada imagen
// }

// export interface UploadedImage {
//   name: string;
//   path: string;
//   url: string;
//   size: number;
//   type: string;
// }

// const steps = [
//   "Información básica",
//   "Descripción y detalles",
//   "Precio y duración",
//   "Imágenes",
// ];

// export function AddServiceModal({
//   service,
//   onSubmitEdit,
//   onSubmit,
//   onClose,
//   isOpen,
// }: {
//   service: (Service & { images?: ServiceFile[] }) | null;
//   onSubmitEdit: (data: Partial<Service> & { images?: UploadedImage[]; imagesToDelete?: string[] }) => void;
//   onSubmit: (data: Omit<Service, "id"> & { images?: UploadedImage[] }) => void;
//   onClose: () => void;
//   isOpen: boolean;
// }) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
//   const [existingImages, setExistingImages] = useState<ServiceFile[]>(service?.images || []);
//   const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
//   const [isSending, setIsSending] = useState(false);
//   const [beneficios, setBeneficios] = useState("");
//   const [preparaciones, setPreparaciones] = useState("");

//   const [formData, setFormData] = useState<ServiceFormData>(
//     service
//       ? {
//           id: service.id,
//           name: service.name,
//           description: service.description,
//           detailedDescription: service.detailedDescription || "",
//           duration: service.duration,
//           price: service.price,
//           benefits: service.benefits,
//           preparation: service.preparation,
//           category_id: service.category_id,
//           isActive: service.isActive,
//           images: service.images,
//         }
//       : {
//           name: "",
//           description: "",
//           detailedDescription: "",
//           duration: 60,
//           price: 0,
//           benefits: [],
//           preparation: [],
//           category_id: "depilación",
//           isActive: true,
//         }
//   );
  
//   const { data: categories } = useGetAllCategorys();

//   // Resetear estado cuando se abre/cierra el modal o cambia el servicio
//   useEffect(() => {
//     if (isOpen) {
//       setCurrentStep(0);
//       setSelectedImages([]);
//       setImagesToDelete([]);
      
//       if (service) {
//         setFormData({
//           id: service.id,
//           name: service.name,
//           description: service.description,
//           detailedDescription: service.detailedDescription || "",
//           duration: service.duration,
//           price: service.price,
//           benefits: service.benefits,
//           preparation: service.preparation,
//           category_id: service.category_id,
//           isActive: service.isActive,
//           images: service.images,
//         });
//         const def_bene= service.benefits.join(',')
//         const def_pre= service.preparation.join(',')
//         setBeneficios(def_bene)
//         setPreparaciones(def_pre)
//         setExistingImages(service.images || []);
//       } else {
//         setFormData({
//           name: "",
//           description: "",
//           detailedDescription: "",
//           duration: 60,
//           price: 0,
//           benefits: [],
//           preparation: [],
//           category_id: categories?.[0]?.id || "depilación",
//           isActive: true,
//         });
//         setExistingImages([]);
//       }
//     }
//   }, [isOpen, service, categories]);

//   // Limpiar URLs de objetos cuando el componente se desmonta
//   useEffect(() => {
//     return () => {
//       selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
//     };
//   }, [selectedImages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSending(true);

//      formData.benefits=beneficios 
//         .split(",")
//         .map(b => b.trim())
//         .filter(b => b)

//       formData.preparation=preparaciones
//         .split(",")
//         .map(p => p.trim())
//         .filter(p => p)

//     try {
//       if (service && service.id) {
//         // Modo edición
//         let uploadedImageUrls: UploadedImage[] = [];
        
//         // Subir nuevas imágenes si hay alguna seleccionada
//         if (selectedImages.length > 0) {
//           const formData = new FormData();
//           const serviceId = service.id;
          
//           selectedImages.forEach(image => {
//             formData.append('files', image.file);
//           });
//           formData.append('serviceId', serviceId);

//           const results = await uploadImages(formData);
//           uploadedImageUrls = results
//             .filter(result => result.success)
//             .map(result => ({
//               name: result.name || `image-${Date.now()}`,
//               path: result.path || '',
//               url: result.url || '',
//               size: result.size || 0,
//               type: result.type || 'image/jpeg'
//             }));
//         }

//         // Preparar datos para enviar
//         const serviceData: Partial<Service> & { 
//           images?: UploadedImage[]; 
//           imagesToDelete?: string[];
//         } = {
//           ...formData,
//           id: service.id,
//           price: Number(formData.price),
//           duration: Number(formData.duration),
//         };

//         // Combinar imágenes existentes mantenidas con nuevas subidas
//         const keptExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id));
        
//         const allImages = [
//           ...keptExistingImages.map(img => ({
//             name: img.name,
//             path: img.path,
//             url: img.url,
//             size: img.size,
//             type: img.type
//           })),
//           ...uploadedImageUrls
//         ];

//         if (allImages.length > 0) {
//           serviceData.images = allImages;
//         }

//         if (imagesToDelete.length > 0) {
//           serviceData.imagesToDelete = imagesToDelete;
//         }

//         onSubmitEdit(serviceData);
//       } else {
//         // Modo creación
//         const serviceData: Omit<Service, "id"> & { images?: UploadedImage[] } = {
//           ...formData,
//           price: Number(formData.price),
//           duration: Number(formData.duration),
//            cuid: "", 
//         createdAt: new Date(), 
//         updatedAt: new Date(), 
//         };

//         // Crear servicio primero
//         const serv = await addService(serviceData);

//         // Subir imágenes si hay alguna seleccionada
//         if (selectedImages.length > 0 && serv?.id) {
//           const formData = new FormData();
//           const serviceId = serv.id;
          
//           selectedImages.forEach(image => {
//             formData.append('files', image.file);
//           });
//           formData.append('serviceId', serviceId);

//           const results = await uploadImages(formData);
//           const uploadedImageUrls = results
//             .filter(result => result.success)
//             .map(result => ({
//               name: result.name || `image-${Date.now()}`,
//               path: result.path || '',
//               url: result.url || '',
//               size: result.size || 0,
//               type: result.type || 'image/jpeg'
//             }));

//           // Actualizar servicio con imágenes si es necesario
//           if (uploadedImageUrls.length > 0) {
//             await editService({
//               id: serv.id,
//               images: uploadedImageUrls
//             });
//           }
//         }

//         onSubmit(serviceData);
//       }

//       onClose();
//     } catch (error) {
//       console.error("Error al procesar el servicio:", error);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleImageSelect = useCallback((files: File[]) => {
//     const newImages: ImageFile[] = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file),
//       id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // ID único
//     }));
    
//     setSelectedImages(prev => [...prev, ...newImages]);
//   }, []);

//   const removeNewImage = useCallback((index: number) => {
//     // const imageToRemove = selectedImages.find(img => img.id === imageId);
//     const imageToRemove = selectedImages[index]
//     if (imageToRemove) {
//       URL.revokeObjectURL(imageToRemove.preview);
//     }
//     setSelectedImages(prev => prev.filter(img => img.id !== imageToRemove.id));
//   }, [selectedImages]);

//   const removeExistingImage = useCallback((imageId: string) => {
//     setImagesToDelete(prev => [...prev, imageId]);
//     setExistingImages(prev => prev.filter(img => img.id !== imageId));
//   }, []);

//   const nextStep = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0: // Información básica
//         return (
//           <div className="flex flex-col gap-8">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Nombre del Servicio</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="category_id">Categorías</Label>
//                 <Select
//                   value={formData.category_id}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, category_id: value })
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Seleccione una categoría" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       {categories?.map((category) => (
//                         <SelectItem 
//                           key={category.id} 
//                           value={category.id}
//                         >
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="description">Descripción Breve</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="detailedDescription">Descripción Detallada</Label>
//                 <Textarea
//                   id="detailedDescription"
//                   value={formData.detailedDescription}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       detailedDescription: e.target.value,
//                     })
//                   }
//                   rows={4}
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 1: // Descripción y detalles
//         return (
//           <div className="flex flex-col gap-8">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="duration">Duración (minutos)</Label>
//                 <Input
//                   id="duration"
//                   type="number"
//                   value={formData.duration}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       duration: Number.parseInt(e.target.value) || 0,
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="price">Precio ($)</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       price: Number.parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       // case 2: // Beneficios y preparación
//       //   return (
//       //     <div className="space-y-4">
//       //       <div className="space-y-2">
//       //         <Label htmlFor="benefits">Beneficios (separados por coma)</Label>
//       //         <Textarea
//       //           id="benefits"
//       //           value={formData.benefits}
//       //           onChange={(e) =>
//       //             setFormData({
//       //               ...formData,
//       //               benefits: e.target.value.split(",").map(b => b.trim()).filter(b => b),
//       //             })
//       //           }
//       //           placeholder="Beneficio 1, Beneficio 2, Beneficio 3"
//       //         />
//       //       </div>

//       //       <div className="space-y-2">
//       //         <Label htmlFor="preparation">Preparación (separada por coma)</Label>
//       //         <Textarea
//       //           id="preparation"
//       //           value={formData.preparation.join(", ")}
//       //           onChange={(e) =>
//       //             setFormData({
//       //               ...formData,
//       //               preparation: e.target.value.split(",").map(p => p.trim()).filter(p => p),
//       //             })
//       //           }
//       //           placeholder="Preparación 1, Preparación 2, Preparación 3"
//       //         />
//       //       </div>
//       //     </div>
//       //   );

// case 2: // Beneficios y preparación
//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="benefits">Beneficios (separados por coma)</Label>
//         <Textarea
//           id="benefits"
//           value={beneficios} // Ahora es un string, no un array
//           onChange={(e) =>setBeneficios( e.target.value  )}
//             // setFormData({
//             //   ...formData,
//             //   benefits: e.target.value, // Guardamos el texto directamente
//             // })
          
//           placeholder="Beneficio 1, Beneficio 2, Beneficio 3"
//         />
     
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="preparation">Preparación (separada por coma)</Label>
//         <Textarea
//           id="preparation"
//           value={preparaciones} // Ahora es un string, no un array
//            onChange={(e) =>setPreparaciones( e.target.value  )}
//           // onChange={(e) =>
//           //   setFormData({
//           //     ...formData,
//           //     preparation: e.target.value, // Guardamos el texto directamente
//           //   })
//           // }
//           placeholder="Preparación 1, Preparación 2, Preparación 3"
//         />
     
//       </div>
//     </div>
//   );

//       case 3: // Imágenes
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="images">Imágenes</Label>
//               <ImageUploader
//                 onImageSelect={handleImageSelect}
//                 selectedImages={selectedImages}
//                 existingImages={existingImages}
//                 onRemoveNewImage={removeNewImage}
//                 onRemoveExistingImage={removeExistingImage}
//                 maxFiles={5}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <h3 className="font-medium">Resumen del servicio</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Nombre:</p>
//                   <p>{formData.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Categoría:</p>
//                   <p>{categories?.find(c => c.id === formData.category_id)?.name || formData.category_id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Duración:</p>
//                   <p>{formData.duration} minutos</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Precio:</p>
//                   <p>${formData.price}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-sm text-muted-foreground">Descripción breve:</p>
//                   <p>{formData.description}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-sm text-muted-foreground">Estado:</p>
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       id="isActive"
//                       checked={formData.isActive}
//                       onCheckedChange={(checked) =>
//                         setFormData({ ...formData, isActive: checked })
//                       }
//                     />
//                     <Label htmlFor="isActive">
//                       {formData.isActive ? "Activo" : "Inactivo"}
//                     </Label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {service ? "Editar Servicio" : "Nuevo Servicio"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             {steps.map((step, index) => (
//               <div key={step} className="flex items-center">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(index)}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= index ? "bg-primary text-primary-foreground" : "bg-muted"}`}
//                 >
//                   {index + 1}
//                 </button>
//                 {index < steps.length - 1 && (
//                   <div className={`w-40 h-1 ${currentStep > index ? "bg-primary" : "bg-muted"}`} />
//                 )}
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {renderStep()}

//             <DialogFooter>
//               {currentStep > 0 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={prevStep}
//                 >
//                   Anterior
//                 </Button>
//               )}
              
//               {currentStep < steps.length - 1 ? (
//                 <Button
//                   type="button"
//                   onClick={nextStep}
//                 >
//                   Siguiente
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onClose}
//                   >
//                     Cancelar
//                   </Button>
//                   <Button type="submit" disabled={isSending}>
//                     {isSending ? "Procesando..." : service ? "Actualizar" : "Crear"} Servicio
//                   </Button>
//                 </>
//               )}
//             </DialogFooter>
//           </form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client"
import { Service, ServiceFile } from "@prisma/client";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "@radix-ui/react-switch";
import { Button } from "../ui/button";
import ImageUploader from "@/components/ImageUploader";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGetAllCategorys } from "@/lib/hooks/category.hooks";
import { addService, editService } from "@/lib/actions/services.actions";
import { uploadImages } from "@/lib/supabase/storage";

export interface ServiceFormData {
  id?: string;
  name: string;
  description: string;
  detailedDescription: string;
  duration: number;
  price: number;
  benefits: string[];
  preparation: string[];
  category_id: string;
  isActive: boolean;
  images?: ServiceFile[];
  cuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string; // Identificador único para cada imagen
}

export interface UploadedImage {
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
}

const steps = [
  "Información básica",
  "Descripción y detalles",
  "Precio y duración",
  "Imágenes",
];

export function AddServiceModal({
  service,
  onSubmitEdit,
  onSubmit,
  onClose,
  isOpen,
}: {
  service: (Service & { images?: ServiceFile[] }) | null;
  onSubmitEdit: (data: Partial<Service> & { images?: UploadedImage[]; imagesToDelete?: string[] }) => void;
  onSubmit: (data: Omit<Service, "id"> & { images?: UploadedImage[] }) => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<ServiceFile[]>(service?.images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [beneficios, setBeneficios] = useState("");
  const [preparaciones, setPreparaciones] = useState("");

  const [formData, setFormData] = useState<ServiceFormData>(
    service
      ? {
          id: service.id,
          name: service.name,
          description: service.description,
          detailedDescription: service.detailedDescription || "",
          duration: service.duration,
          price: service.price,
          benefits: service.benefits,
          preparation: service.preparation,
          category_id: service.category_id,
          isActive: service.isActive,
          images: service.images,
        }
      : {
          name: "",
          description: "",
          detailedDescription: "",
          duration: 60,
          price: 0,
          benefits: [],
          preparation: [],
          category_id: "depilación",
          isActive: true,
        }
  );
  
  const { data: categories } = useGetAllCategorys();

  // Resetear estado cuando se abre/cierra el modal o cambia el servicio
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedImages([]);
      setImagesToDelete([]);
      
      if (service) {
        setFormData({
          id: service.id,
          name: service.name,
          description: service.description,
          detailedDescription: service.detailedDescription || "",
          duration: service.duration,
          price: service.price,
          benefits: service.benefits,
          preparation: service.preparation,
          category_id: service.category_id,
          isActive: service.isActive,
          images: service.images,
        });
        const def_bene = service.benefits.join(', ');
        const def_pre = service.preparation.join(', ');
        setBeneficios(def_bene);
        setPreparaciones(def_pre);
        setExistingImages(service.images || []);
      } else {
        setFormData({
          name: "",
          description: "",
          detailedDescription: "",
          duration: 60,
          price: 0,
          benefits: [],
          preparation: [],
          category_id: categories?.[0]?.id || "depilación",
          isActive: true,
        });
        setBeneficios("");
        setPreparaciones("");
        setExistingImages([]);
      }
    }
  }, [isOpen, service, categories]);

  // Limpiar URLs de objetos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    formData.benefits = beneficios 
      .split(",")
      .map(b => b.trim())
      .filter(b => b);

    formData.preparation = preparaciones
      .split(",")
      .map(p => p.trim())
      .filter(p => p);

    try {
      if (service && service.id) {
        // Modo edición
        let uploadedImageUrls: UploadedImage[] = [];
        
        // Subir nuevas imágenes si hay alguna seleccionada
        if (selectedImages.length > 0) {
          const formData = new FormData();
          const serviceId = service.id;
          
          selectedImages.forEach(image => {
            formData.append('files', image.file);
          });
          formData.append('serviceId', serviceId);

          const results = await uploadImages(formData);
          uploadedImageUrls = results
            .filter(result => result.success)
            .map(result => ({
              name: result.name || `image-${Date.now()}`,
              path: result.path || '',
              url: result.url || '',
              size: result.size || 0,
              type: result.type || 'image/jpeg'
            }));
        }

        // Preparar datos para enviar
        const serviceData: Partial<Service> & { 
          images?: UploadedImage[]; 
          imagesToDelete?: string[];
        } = {
          ...formData,
          id: service.id,
          price: Number(formData.price),
          duration: Number(formData.duration),
        };

        // Combinar imágenes existentes mantenidas con nuevas subidas
        const keptExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id));
        
        const allImages = [
          ...keptExistingImages.map(img => ({
            name: img.name,
            path: img.path,
            url: img.url,
            size: img.size,
            type: img.type
          })),
          ...uploadedImageUrls
        ];

        if (allImages.length > 0) {
          serviceData.images = allImages;
        }

        if (imagesToDelete.length > 0) {
          serviceData.imagesToDelete = imagesToDelete;
        }

        onSubmitEdit(serviceData);
      } else {
        // Modo creación
        const serviceData: Omit<Service, "id"> & { images?: UploadedImage[] } = {
          ...formData,
          price: Number(formData.price),
          duration: Number(formData.duration),
          cuid: "", 
          createdAt: new Date(), 
          updatedAt: new Date(), 
        };

        // Crear servicio primero
        const serv = await addService(serviceData);

        // Subir imágenes si hay alguna seleccionada
        if (selectedImages.length > 0 && serv?.id) {
          const formData = new FormData();
          const serviceId = serv.id;
          
          selectedImages.forEach(image => {
            formData.append('files', image.file);
          });
          formData.append('serviceId', serviceId);

          const results = await uploadImages(formData);
          const uploadedImageUrls = results
            .filter(result => result.success)
            .map(result => ({
              name: result.name || `image-${Date.now()}`,
              path: result.path || '',
              url: result.url || '',
              size: result.size || 0,
              type: result.type || 'image/jpeg'
            }));

          // Actualizar servicio con imágenes si es necesario
          if (uploadedImageUrls.length > 0) {
            await editService({
              id: serv.id,
              images: uploadedImageUrls
            });
          }
        }

        onSubmit(serviceData);
      }

      onClose();
    } catch (error) {
      console.error("Error al procesar el servicio:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // ID único
    }));
    
    setSelectedImages(prev => [...prev, ...newImages]);
  }, []);

  const removeNewImage = useCallback((index: number) => {
    const imageToRemove = selectedImages[index];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setSelectedImages(prev => prev.filter(img => img.id !== imageToRemove.id));
  }, [selectedImages]);

  const removeExistingImage = useCallback((imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Información básica
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Servicio</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Categorías</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción Breve</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedDescription">Descripción Detallada</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailedDescription: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 1: // Precio y duración
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2: // Beneficios y preparación
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="benefits">Beneficios (separados por coma)</Label>
              <Textarea
                id="benefits"
                value={beneficios}
                onChange={(e) => setBeneficios(e.target.value)}
                placeholder="Beneficio 1, Beneficio 2, Beneficio 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparation">Preparación (separada por coma)</Label>
              <Textarea
                id="preparation"
                value={preparaciones}
                onChange={(e) => setPreparaciones(e.target.value)}
                placeholder="Preparación 1, Preparación 2, Preparación 3"
              />
            </div>
          </div>
        );

      case 3: // Imágenes
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Imágenes</Label>
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImages={selectedImages}
                existingImages={existingImages}
                onRemoveNewImage={removeNewImage}
                onRemoveExistingImage={removeExistingImage}
                maxFiles={5}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Resumen del servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre:</p>
                  <p className="truncate">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoría:</p>
                  <p className="truncate">{categories?.find(c => c.id === formData.category_id)?.name || formData.category_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duración:</p>
                  <p>{formData.duration} minutos</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precio:</p>
                  <p>${formData.price}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Descripción breve:</p>
                  <p className="text-sm line-clamp-2">{formData.description}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Estado:</p>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      {formData.isActive ? "Activo" : "Inactivo"}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="px-2 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">
            {service ? "Editar Servicio" : "Nuevo Servicio"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barra de progreso - Mobile First */}
          <div className="flex items-center justify-between px-2 sm:px-0">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${currentStep >= index ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 mx-1 h-1 ${currentStep > index ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Indicador de paso actual para móviles */}
          <div className="block sm:hidden text-center text-sm font-medium text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}: {steps[currentStep]}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-0">
            {renderStep()}

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4">
              <div className="flex w-full sm:w-auto gap-2">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 sm:flex-none"
                  >
                    Anterior
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 sm:flex-none"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSending}
                      className="flex-1 sm:flex-none"
                    >
                      {isSending ? "Procesando..." : service ? "Actualizar" : "Crear"} Servicio
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
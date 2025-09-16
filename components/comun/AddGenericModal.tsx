// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// interface GenericItem {
//   id?: string | number;
//   name: string;
//   // [key: string]: any; // Permite propiedades adicionales
// }

// interface GenericModalProps<T extends GenericItem> {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedItem: T | null;
//   onSubmit: (data: Omit<T, 'id'>) => void;
//   onSubmitEdit: (data: Partial<T>) => void;
//   title: string;
//   description: string;
//   label: string;
//   placeholder?: string;
// }

// const GenericModal = <T extends GenericItem>({
//   isOpen,
//   onClose,
//   selectedItem,
//   onSubmit,
//   onSubmitEdit,
//   title,
//   description,
//   label,
//   placeholder = ""
// }: GenericModalProps<T>) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     reset,
//   } = useForm<T>({
//     defaultValues: { name: "" } as T
//   });

//   // Resetear el formulario cuando cambia el item seleccionado
//   useEffect(() => {
//     reset(selectedItem || { name: "" } as T);
//   }, [selectedItem, reset]);

  

//   const onSubmitHandler= (data: Partial<T>) => {
//     if (selectedItem && selectedItem.id) {
//       onSubmitEdit({ ...data, id: selectedItem.id });
//     } else {
//       // const { id, ...createData } = data;
//       onSubmit(data);
//     }
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-[325px]">
//         <form onSubmit={handleSubmit(onSubmitHandler)}>
//           <DialogHeader>
//             <DialogTitle>
//               {selectedItem ? "Editar" : "Agregar"} {title}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedItem ? "Edite" : "Agregue"} {description.toLowerCase()}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="my-4">
//             <div className="flex justify-center gap-4">
//               <div className="space-y-2 w-full">
//                 <Label htmlFor="name">{label}</Label>
//                 <Input
//                   id="name"
//                   className="col-span-3"
//                   placeholder={placeholder}
//                   {...register("name", {
//                     required: "Este campo es requerido",
//                     minLength: {
//                       value: 3,
//                       message: "Mínimo 3 caracteres"
//                     }
//                   })}
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-red-500">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancelar
//             </Button>
//             <Button variant="default" type="submit" disabled={!isValid}>
//               Guardar
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GenericModal;

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface GenericItem {
  id?: string | number;
  name: string;
}

interface GenericModalProps<T extends GenericItem> {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: T | null;
  onSubmit: (data: Omit<T, 'id'>) => void;
  onSubmitEdit: (data: Partial<T>) => void;
  title: string;
  description: string;
  label: string;
  placeholder?: string;
}

const GenericModal = <T extends GenericItem>({
  isOpen,
  onClose,
  selectedItem,
  onSubmit,
  onSubmitEdit,
  title,
  description,
  label,
  placeholder = ""
}: GenericModalProps<T>) => {
  type FormData = {
    name: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    defaultValues: { name: "" }
  });

  // Resetear el formulario cuando cambia el item seleccionado
  useEffect(() => {
    if (selectedItem) {
      reset({ name: selectedItem.name });
    } else {
      reset({ name: "" });
    }
  }, [selectedItem, reset]);

  const onSubmitHandler: SubmitHandler<FormData> = (data) => {
    if (selectedItem && selectedItem.id) {
      // Para edición, solo enviamos los campos que se están editando
      const updateData: Partial<T> = {
        ...selectedItem,
        name: data.name,
        id: selectedItem.id
      };
      onSubmitEdit(updateData);
    } else {
      // Para creación, el componente padre debe manejar los valores por defecto
      const createData = {
        name: data.name
      } as Omit<T, 'id'>;
      onSubmit(createData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[325px]">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Editar" : "Agregar"} {title}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? "Edite" : "Agregue"} {description.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="flex justify-center gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="name">{label}</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder={placeholder}
                  {...register("name", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres"
                    }
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="default" type="submit" disabled={!isValid}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;
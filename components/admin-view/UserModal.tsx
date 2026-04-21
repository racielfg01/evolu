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
import { User } from "@prisma/client";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role_id: string;
  sex_id: string;
  phone: string;
  image: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: User | null;
  onSubmitEdit: (data: Partial<User>) => void;
  sexOptions?: Array<{ id: string; name: string }>;
}

const EditUserModal = ({
  isOpen,
  onClose,
  selectedItem,
  onSubmitEdit,
  sexOptions = [],
}: EditUserModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: "",
      sex_id: "",
      phone: "",
      image: "",
    },
    mode: "onChange",
  });

  // Resetear el formulario cuando cambia el item seleccionado
  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.name || "",
        email: selectedItem.email || "",
        password: "",
        role_id: selectedItem.role_id || "",
        sex_id: selectedItem.sex_id || "",
        phone: selectedItem.phone || "",
        image: selectedItem.image || "",
      });
    }
  }, [selectedItem, reset]);

  const onSubmitHandler: SubmitHandler<UserFormData> = (data) => {
    if (selectedItem && selectedItem.id) {
      // Solo para edición - no enviamos password si está vacío
      const updateData: Partial<User> = {
        id: selectedItem.id,
        name: data.name,
        email: data.email,
        role_id: data.role_id,
        sex_id: data.sex_id,
        phone: data.phone,
        image: data.image,
      };
      
      // Solo incluir password si se proporcionó uno nuevo
      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password;
      }
      
      onSubmitEdit(updateData);
    }
    onClose();
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogHeader>
            <DialogTitle>
              Editar Usuario
            </DialogTitle>
            <DialogDescription>
              Edite la información del usuario
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-4">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ingrese el nombre completo"
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "Máximo 100 caracteres",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...register("phone", {
                  pattern: {
                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
                    message: "Formato de teléfono inválido",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña
                <span className="text-xs text-muted-foreground ml-2">
                  (Dejar en blanco para mantener la actual)
                </span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Nueva contraseña (opcional)"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Campo Sexo */}
            <div className="space-y-2">
              <Label htmlFor="sex_id">
                Sexo <span className="text-red-500">*</span>
              </Label>
              <select
                id="sex_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("sex_id", {
                  required: "El sexo es requerido",
                })}
              >
                <option value="">Seleccione un sexo</option>
                {sexOptions.map((sex) => (
                  <option key={sex.id} value={sex.id}>
                    {sex.name}
                  </option>
                ))}
              </select>
              {errors.sex_id && (
                <p className="text-sm text-red-500">{errors.sex_id.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="default" type="submit" disabled={!isValid}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
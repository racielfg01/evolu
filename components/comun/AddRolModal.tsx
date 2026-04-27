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
import { Role } from "@prisma/client";

interface AddRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: Role | null;
  onSubmit: (data: Omit<Role, 'id'>) => void;
  onSubmitEdit: (data: Partial<Role>) => void;
}

const AddRolModal: React.FC<AddRolModalProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onSubmit,
  onSubmitEdit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Role>({
    defaultValues: {
      name: "",
    },
  });

  // Resetear el formulario cuando cambia el rol seleccionado
  useEffect(() => {
    reset(selectedRole || { name: "" });
  }, [selectedRole, reset]);

  const onSubmitHandler: SubmitHandler<Role> = (data) => {
    if (selectedRole && selectedRole.id) {
      onSubmitEdit({ ...data, id: selectedRole.id });
    } else {
      onSubmit(data);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[325px]">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Editar" : "Agregar"} Rol
            </DialogTitle>
            <DialogDescription>
              {selectedRole ? "Edite" : "Agregue"} un rol
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="flex justify-center gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="default" type="submit">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRolModal;
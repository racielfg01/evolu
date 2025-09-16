import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workerName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, workerName }) => {
 
  if (!isOpen) return null;

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Confirmar Eliminación</DialogTitle>
                 <DialogDescription>
                   ¿Estás seguro de que deseas eliminar {workerName} ? Esta acción no se puede deshacer.
                 </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                 <Button variant="outline" onClick={onClose}>
                   Cancelar
                 </Button>
                 <Button variant="destructive" onClick={onConfirm}>
                   Eliminar
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

  );
};

export default DeleteConfirmationModal;

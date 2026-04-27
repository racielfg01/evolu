

'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ImageFile {
  file: File;
  preview: string;
}

interface ServiceImage {
  id: string;
  url: string;
  name: string;
}

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  selectedImages: ImageFile[];
  existingImages: ServiceImage[];
  onRemoveNewImage: (index: number) => void;
  onRemoveExistingImage: (imageId: string, index: number) => void;
  maxFiles?: number;
}

export default function ImageUploader({ 
  onImageSelect, 
  selectedImages, 
  existingImages,
  onRemoveNewImage,
  onRemoveExistingImage,
  maxFiles = 5 
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validaciones
    const totalImages = selectedImages.length + existingImages.length;
    if (files.length + totalImages > maxFiles) {
      setError(`No puedes subir más de ${maxFiles} imágenes`)
      return
    }

    const invalidFiles = Array.from(files).filter(
      file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024 // 5MB máximo
    )

    if (invalidFiles.length > 0) {
      setError('Algunos archivos no son imágenes o superan 5MB')
      return
    }

    setError(null)
    onImageSelect(Array.from(files))
    
    // Resetear el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // const files = Array.from(e.dataTransfer.files)
    // if (files.length > 0) {
      
    //   handleFileChange({ target: { files } })
    // }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    // Crear un objeto event simulado que handleFileChange espera
    const simulatedEvent = {
      target: {
        files: e.dataTransfer.files
      }
    } as React.ChangeEvent<HTMLInputElement>;
  
    handleFileChange(simulatedEvent);
  }
}

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const totalImages = selectedImages.length + existingImages.length;

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          disabled={totalImages >= maxFiles}
        />
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-gray-500">
            {totalImages >= maxFiles 
              ? `Límite de ${maxFiles} imágenes alcanzado`
              : 'Haz clic o arrastra imágenes aquí'}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            {totalImages}/{maxFiles} imágenes
          </p>
        </div>
      </div>

      {(selectedImages.length > 0 || existingImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {/* Mostrar imágenes existentes */}
          {existingImages.map((image, index) => (
            <div key={`existing-${image.id}`} className="relative group">
              <Image
                src={image.url}
                alt={image.name}
                className="object-cover w-full h-32 rounded-lg"
                width={128}
                height={128}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveExistingImage(image.id, index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Mostrar nuevas imágenes seleccionadas */}
          {selectedImages.map((image, index) => (
            <div key={`new-${index}`} className="relative group">
              <Image
                src={image.preview}
                alt={`Preview ${index}`}
                className="object-cover w-full h-32 rounded-lg"
                width={128}
                height={128}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNewImage(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
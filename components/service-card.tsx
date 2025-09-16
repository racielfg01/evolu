import Image from "next/image"

interface ServiceCardProps {
  title: string
  description: string
  imageSrc: string
}

export default function ServiceCard({ title, description, imageSrc }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 relative">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-sage-800 mb-2">{title}</h3>
        <p className="text-sage-600">{description}</p>
      </div>
    </div>
  )
}


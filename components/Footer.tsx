import { Leaf } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-sage-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-semibold">Evolu Spa</span>
          </div>
          <p className="text-sage-200">Tu santuario para la relajación y el rejuvenecimiento.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <address className="not-italic text-sage-200 space-y-2">
            <p>42 Avenida Tranquilidad, Serenidad</p>
            <p>+1 (555) 123-4567</p>
            <p>info@evoluspa.com</p>
          </address>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Horario</h3>
          <div className="text-sage-200 space-y-2">
            <p>Lunes - Viernes: 9am - 8pm</p>
            <p>Sábado: 10am - 6pm</p>
            <p>Domingo: 10am - 4pm</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Boletín</h3>
          <p className="text-sage-200 mb-4">Suscríbete para recibir ofertas especiales y actualizaciones.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-4 py-2 rounded-l-md w-full focus:outline-none text-sage-800"
            />
            <button className="bg-sage-600 hover:bg-sage-500 px-4 py-2 rounded-r-md transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-sage-700 mt-8 pt-8 text-center text-sage-300">
        <p>&copy; {new Date().getFullYear()} Evolu Spa. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
import React from 'react'
import TestimonialCarousel from './testimonial-carousel'

const Testimonials = () => {
  return (
   <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-4">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-sage-700 max-w-2xl mx-auto">
              Estamos orgullosos de las experiencias que hemos creado para nuestros clientes. Esto es lo que tienen que
              decir sobre nosotros.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>
  )
}

export default Testimonials
import Image from 'next/image'
import React from 'react'
import StatsCounter from './stats-counter'
import img1 from '@/assest/team.jpg'

const About = () => {
  return (
          <section id="about" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Image
                    src={img1?img1:"/placeholder.svg?height=500&width=500"}
                    width={500}
                    height={500}
                    alt="Tratamiento de spa"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-sage-900">Sobre Nosotros</h2>
                  <p className="text-sage-700">
                    En Evolu Spa, creemos que el bienestar verdadero va más allá de lo físico, alcanzando los reinos de la
                    tranquilidad y la armonía. Nuestra misión es proporcionar un santuario donde puedas escapar del estrés de
                    la vida moderna, reconectar con tu ser interior y embarcarte en un viaje de rejuvenecimiento y equilibrio.
                  </p>
                  <p className="text-sage-700">
                    Fundado por un equipo de profesionales del bienestar con experiencia, Evolu Spa es un refugio para tu
                    cuerpo, mente y alma. Nuestro equipo de profesionales dedicados está comprometido a ofrecer una variedad
                    de tratamientos de lujo y experiencias exclusivas que te dejarán sintiéndote renovado, revitalizado y
                    listo para enfrentar el mundo con una nueva sensación de vitalidad.
                  </p>
    
                  <StatsCounter />
                </div>
              </div>
            </div>
          </section>
  )
}

export default About
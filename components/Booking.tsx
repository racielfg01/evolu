import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Award, Sparkles, Users } from 'lucide-react'

const Booking = () => {
  return (
      <section id="contact" className="py-16 md:py-24 bg-sage-100">
        <div className="container mx-auto px-4">
          {/* <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-sage-900 mb-6 text-center">
              Programa tu Cita Hoy
            </h2>
            <BookingForm />
          </div> */}
               {/* Why Choose Us */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">¿Por Qué Elegirnos?</h2>
          <p className="text-muted-foreground">Comprometidos con tu belleza y bienestar</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Profesionales Certificados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nuestro equipo está formado por especialistas certificados con años de experiencia en tratamientos de
                belleza y bienestar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Productos Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Utilizamos únicamente productos de las mejores marcas, garantizando resultados excepcionales y cuidado
                de tu piel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Atención Personalizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cada tratamiento es personalizado según tus necesidades específicas, asegurando la mejor experiencia
                posible.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
        </div>
      </section>
  )
}

export default Booking
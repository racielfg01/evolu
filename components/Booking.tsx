import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Award, Calendar, Sparkles, Users } from 'lucide-react'
import { Button } from './ui/button'

interface BookingProps {
  onViewServices: () => void
}

const Booking = ({ onViewServices }: BookingProps) => {
  return (
      <section id="beneficios" className="py-16 md:py-24 bg-sage-100">
        <div className="container mx-auto px-4">
               {/* Why Choose Us */}
      <div className="space-y-6">
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

        <div className="flex justify-center mt-8">
          <Button
            onClick={onViewServices}
            className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Reservar cita
          </Button>
        </div>
        </div>
        </div>
      </section>
  )
}

export default Booking
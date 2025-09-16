"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookingProvider, useBooking } from "@/components/booking/booking-context"
import { ProgressIndicator } from "@/components/booking/progress-indicator"
import { ServiceSelection } from "@/components/booking/service-selection"
import { DateTimeSelection } from "@/components/booking/date-time-selection"
import { UserInformation } from "@/components/booking/user-information"
import { Confirmation } from "@/components/booking/confirmation"

function BookingContent() {
  const { state } = useBooking()

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return <ServiceSelection />
      case 2:
        return <DateTimeSelection />
      case 3:
        return <UserInformation />
      case 4:
        return <Confirmation />
      default:
        return <ServiceSelection />
    }
  }

  return (
    <div className="min-h-screen bg-sage-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reserva tu Cita de Belleza</h1>
          <p className="text-muted-foreground">
            Experimenta servicios de belleza premium con nuestros profesionales expertos
          </p>
        </div>

        <ProgressIndicator />

        <Card className="mt-8">
          <CardContent className="p-6 md:p-8">{renderCurrentStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BeautyBooking() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  )
}

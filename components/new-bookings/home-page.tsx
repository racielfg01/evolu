"use client"

import Hero from "@/components/Hero"
import About from "@/components/About"
import Booking from "@/components/Booking"
import Services from "@/components/Services"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"

interface HomePageProps {
  onBookNow: () => void
  onViewServices: () => void
}

export function HomePage({ onBookNow, onViewServices }: HomePageProps) {
  // const featuredServices = mockServices.filter((s) => s.isActive).slice(0, 3)

  return (
 <div className="min-h-screen bg-background">
 
      <Hero onViewServices={onViewServices} />
 
      <Services onBookNow={ onBookNow} onViewServices={onViewServices}/>
      <Booking/>
      <About/>
      
      <Testimonials/>
      <Footer/>
    </div>
  )
}

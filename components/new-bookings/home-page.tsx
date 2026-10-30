"use client"

import type { Category } from "@prisma/client"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Categories from "@/components/Categories"
import Testimonials from "@/components/Testimonials"
import Booking from "@/components/Booking"
import About from "@/components/About"
import Faq from "@/components/Faq"
import FinalCta from "@/components/FinalCta"
import Footer from "@/components/Footer"
import type { ServiceWithRelations } from "@/lib/actions/services.actions"

interface HomePageProps {
  services: ServiceWithRelations[] | null
  categories: Category[] | null
  popularServices?: ServiceWithRelations[] | null
  onViewServices: () => void
  onSelectCategory?: (categoryId: string) => void
}

export function HomePage({
  services,
  categories,
  popularServices,
  onViewServices,
  onSelectCategory,
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Hero onViewServices={onViewServices} />

      <Services
        services={popularServices && popularServices.length > 0 ? popularServices : services}
        onViewServices={onViewServices}
      />

      <Categories
        categories={categories}
        services={services}
        onViewServices={onViewServices}
        onSelectCategory={onSelectCategory}
      />

      <Testimonials />

      <Booking onViewServices={onViewServices} />

      <About />

      <Faq />

      <FinalCta onViewServices={onViewServices} />

      <Footer />
    </div>
  )
}

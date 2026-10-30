"use client";

import type { Category } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import type { ServiceWithRelations } from "@/lib/actions/services.actions";

interface CategoriesProps {
  categories: Category[] | null;
  services?: ServiceWithRelations[] | null;
  onViewServices: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

// "Información" agrupa avisos (por ejemplo, políticas de depósito), no
// tratamientos: no tiene sentido como entrada del catálogo en la landing.
const NOT_A_TREATMENT = "información";

export default function Categories({
  categories,
  services,
  onViewServices,
  onSelectCategory,
}: CategoriesProps) {
  const bookableCategoryIds = new Set(
    (services ?? []).filter((service) => service.isActive).map((service) => service.category_id)
  );

  const shownCategories = (categories ?? [])
    .filter((category) => category.name.toLowerCase() !== NOT_A_TREATMENT)
    .filter(
      (category) =>
        bookableCategoryIds.size === 0 || bookableCategoryIds.has(category.id)
    )
    .slice(0, 6);

  if (shownCategories.length === 0) return null;

  return (
    <section id="categorias" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-4">Categorías</h2>
          <p className="text-sage-700 max-w-2xl mx-auto">
            Si ya sabes lo que buscas, entra directo por la categoría.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {shownCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(category.id);
                else onViewServices();
              }}
              className="group flex items-center justify-between rounded-lg border bg-sage-50 px-5 py-6 text-left transition-colors hover:border-sage-500 hover:bg-sage-100"
            >
              <span className="font-medium text-sage-900">
                {category.name}
              </span>
              <ArrowRight className="h-4 w-4 text-sage-600 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

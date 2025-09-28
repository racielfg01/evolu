"use client";

import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import {
  // EnhancedBookingProvider,
  useEnhancedBooking,
} from "@/components/new-bookings/enhanced-booking-context";
import { Navigation } from "@/components/new-bookings/navigation";
import { HomePage } from "@/components/new-bookings/home-page";
// import { ServicesCatalog } from "@/components/new-bookings/services-catalog";
import { UserProfile } from "@/components/new-bookings/user-profile";
// import { AdminDashboard } from "@/components/new-bookings/admin-dashboard";
import { ProgressIndicator } from "@/components/new-bookings/progress-indicator";
// import { EnhancedServiceSelection } from "@/components/new-bookings/enhanced-service-selection";
import { DateTimeSelection } from "@/components/new-bookings/date-time-selection";
import { UserInformation } from "@/components/new-bookings/user-information";
import { Confirmation } from "@/components/new-bookings/confirmation";
import { UserAppMetadata } from "@supabase/supabase-js";
import type { UserInfo } from "@/lib/types";
import { useGetAllServices } from "@/lib/hooks/service.hooks";
import { useGetAllCategorys } from "@/lib/hooks/category.hooks";
import { UnifiedServicesComponent } from "./UnifiedServicesComponent";
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import {  useRouter } from "next/navigation";
import { getBusinessConfig } from "@/lib/actions/config.actions";
// import { useUserAppointments } from "@/lib/hooks/appointment.hooks";

export function BookingContent({ user }: { user: UserAppMetadata | null }) {

  
  const { state, dispatch } = useEnhancedBooking();
  const {push}= useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  

  const {
    data: services = [],
    isLoading: isLoadingService,
    error: errorServices,
  } = useGetAllServices();

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useGetAllCategorys();

  const [currentView, setCurrentView] = useState("home");

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view === "booking") {
      dispatch({ type: "RESET_BOOKING" });
    }
  };

  const handleServiceSelect = (service: ServiceWithRelations) => {
    dispatch({ type: "ADD_SERVICE", payload: service });
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
  
          <UnifiedServicesComponent
            mode="selection"
            services={services}
            isLoadingService={isLoadingService}
            errorServices={errorServices}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            errorCategories={errorCategories}
            title="Selecciona Tus Servicios"
            description="Elige uno o más servicios de belleza para tu cita"
            showFilters={true}
            showSearch={true}
          />
        );
      case 2:
        return <DateTimeSelection />;
      case 3:
        return <UserInformation />;
      case 4:
        return <Confirmation onViewChange={handleViewChange} />;
      default:
          <UnifiedServicesComponent
            mode="selection"
            services={services}
            isLoadingService={isLoadingService}
            errorServices={errorServices}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            errorCategories={errorCategories}
            title="Selecciona Tus Servicios"
            description="Elige uno o más servicios de belleza para tu cita"
            showFilters={true}
            showSearch={true}
          />
    
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return (
          <HomePage
            onViewServices={() => setCurrentView("services")}
          />
        );
      case "home-about":
        return (
          <HomePage
            onViewServices={() => setCurrentView("services")}
          />
        );
      case "home-reviews":
        return (
          <HomePage
            onViewServices={() => setCurrentView("services")}
          />
        );
      case "services":
        return (
          
          <UnifiedServicesComponent
            mode="catalog"
            onServiceSelect={handleServiceSelect}
            onBookNow={() => setCurrentView("booking")}
            services={services}
            isLoadingService={isLoadingService}
            errorServices={errorServices}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            errorCategories={errorCategories}
            title="Nuestros Servicios"
            description="Descubre nuestra amplia gama de servicios de belleza y bienestar"
            showFilters={true}
            showSearch={true}
          />
        );
      case "profile":
        return <UserProfile />;
      case "bookings":
        return <UserProfile initTag={"bookings"} />;
      
      case "booking":
        return (
          <div className="space-y-6">
            <ProgressIndicator />
            {renderCurrentStep()}
          </div>
        );
      default:
        return (
          <HomePage
            onViewServices={() => setCurrentView("services")}
          />
        );
    }
  };

  //  const handleSave = () => {
  //   const
  //   dispatch({ type: "SET_CURRENT_USER", payload: user })
  //   setIsEditing(false)
  // }

  useEffect(() => {
    if(!user)push("/")

    if(user && user.role.name!="USER") setIsAdmin(true)
    // Solo actualizar si el usuario es diferente al actual
    if (user?.id !== state.userInfo.id) {
      const currentUser: Partial<UserInfo> | null = user?.id
        ? {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            notes: user.notes || "",
            avatar: user.avatar || "",
          }
        : null;

      // console.log('booking currentUser', currentUser);
      dispatch({ type: "SET_USER_INFO", payload: currentUser });
    }
  }, [dispatch, user, state.userInfo.id, push]);

    //Cargar configuración al iniciar
    useEffect(() => {
        const loadConfig = async () => {
      try {
        const savedConfig = await getBusinessConfig();
        if (savedConfig) {
           dispatch({ type: "SET_BUSINESS_CONFIG", payload: savedConfig });
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
      }
    };
  
      loadConfig();
    }, [dispatch]);

  

  return (
    <div className="min-h-screen ">
      <Navigation currentView={currentView} onViewChange={handleViewChange} isAdmin={isAdmin} />

      <div
        className={`${currentView.includes("home") ? "" : "container mx-auto px-4 py-8 max-w-6xl bg-sage-50"}`}
      >
        {currentView === "booking" ? (
          <div className="space-y-8 mt-10">
            <div className="text-center">
          
            </div>
     
            {renderCurrentStep()}
          
          </div>
        ) : (
          renderCurrentView()
        )}
      </div>
    </div>
  );
}



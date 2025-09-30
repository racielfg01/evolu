"use client";

import { BookingProvider } from "@/components/new-bookings/booking-context";
import { EnhancedBookingProvider } from "@/components/new-bookings/enhanced-booking-context";
// import { SessionProvider } from "next-auth/react";
import  TanstackProvider  from "./tanstack-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <SessionProvider>
          <TanstackProvider>
      <EnhancedBookingProvider>
        <BookingProvider>
            {children}
        </BookingProvider>
      </EnhancedBookingProvider>
            </TanstackProvider>
    // </SessionProvider>
  );
}

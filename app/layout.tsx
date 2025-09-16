// app/layout.tsx

import "./globals.css";

import Providers from "../lib/providers/Provider";

import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Superblog",
  description: "A blog app using Next.js and Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
    

        <Providers>
             
          <div className="min-h-screen flex flex-col bg-sage-50">
          {/* <Navbar/> */}
          
            <main className="flex-1">{children}</main>
          <Toaster />
          </div>
        </Providers>
             
      </body>
    </html>
  );
}

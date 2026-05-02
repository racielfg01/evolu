// app/layout.tsx

import "./globals.css";

import Providers from "../lib/providers/Provider";

import { Toaster } from "@/components/ui/sonner"



export const metadata = {
    icons: {
    icon: '/evolu-logo.png',      
    shortcut: '/evolu-logo.png',
    apple: '/evolu-logo.png',
  },
  
  title: "Evolu",
  description: `¿Buscas los mejores centros de depilación, masajes profesionales, podólogos cualificados o servicios de belleza cerca de ti? Belleza & Bienestar es la app que conecta tu necesidad de cuidado personal con los profesionales mejor valorados de tu ciudad.

Olvídate de interminables llamadas y esperas. Con nuestra plataforma, puedes reservar, gestionar y pagar tus tratamientos de forma rápida, segura y en menos de 1 minuto.

✨ SERVICIOS DISPONIBLES ✨

💆‍♀️ DEPILACIÓN:
Desde depilación con cera, láser diodo, luz pulsada hasta técnicas indoloras. Encuentra salones especializados en depilación de cejas, piernas, axilas, bozo y zona íntima (depilación brasileña).

💆 MASAJES PROFESIONALES:

    Masaje relajante

    Masaje descontracturante

    Masaje deportivo

    Masaje con piedras calientes

    Drenaje linfático

    Masaje tailandés y shiatsu

👣 PODOLOGÍA Y CUIDADO DE PIES:

    Corte y limado de uñas

    Tratamiento de callosidades y durezas

    Podología deportiva

    Uñas encarnadas

    Tratamiento de hongos (onicomicosis)

    Ortesis y estudios de la pisada

💅 SERVICIOS DE BELLEZA GENERAL:

    Manicura y pedicura (incluye semipermanente, Kapping, acrílico)

    Extensiones de pestañas y cejas

    Maquillaje profesional

    Tratamientos faciales (limpieza, hidratación, antiage)

🔥 ¿POR QUÉ ELEGIRNOS?
✅ Búsqueda inteligente: Filtra por servicio, precio, valoración, distancia y horario.
✅ Perfiles verificados: Todos los profesionales tienen título, fotos reales de sus trabajos y opiniones de clientes reales.
✅ Pago seguro: Tarjeta, efectivo en local o monedero digital.
✅ Recordatorios automáticos: Evita olvidos con notificaciones push.
✅ Promociones exclusivas: Descuentos del 20% en tu primera reserva y programas de fidelización.
✅ Cancelación flexible: Cambia o cancela tu cita sin coste hasta 2 horas antes.

📍 Cobertura: Disponible en [Ciudad/País] y en expansión. Si no encuentras un servicio, solicítalo dentro de la app.

📲 DESCÁRGALA AHORA y empieza a disfrutar de una experiencia de bienestar sin complicaciones. Porque cuidarte nunca fue tan fácil.
,`
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

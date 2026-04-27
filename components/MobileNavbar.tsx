'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, User, Menu } from 'lucide-react'

export function MobileNavbar() {
  const pathname = usePathname()
  const isClient=true

        return (
          isClient?(

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
          <div className="flex justify-around items-center h-16">
            <Link href="/" className={`flex flex-col items-center justify-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/menu" className={`flex flex-col items-center justify-center ${pathname === '/menu' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Menu size={24} />
              <span className="text-xs mt-1">Servicios</span>
            </Link>
            <Link href="/appointments" className={`flex flex-col items-center justify-center ${pathname === '/appointments' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Calendar size={24} />
              <span className="text-xs mt-1">Citas</span>
            </Link>
            <Link href="/profile" className={`flex flex-col items-center justify-center ${pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'}`}>
              <User size={24} />
              <span className="text-xs mt-1">Perfil</span>
            </Link>
          </div>
        </nav>

      ):(
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className={`flex flex-col items-center justify-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/appointments" className={`flex flex-col items-center justify-center ${pathname === '/appointments' ? 'text-blue-500' : 'text-gray-500'}`}>
            <Calendar size={24} />
            <span className="text-xs mt-1">Appointments</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center justify-center ${pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'}`}>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link href="/menu" className={`flex flex-col items-center justify-center ${pathname === '/menu' ? 'text-blue-500' : 'text-gray-500'}`}>
            <Menu size={24} />
            <span className="text-xs mt-1">Menu</span>
          </Link>
        </div>
      </nav>
      )

  )
}


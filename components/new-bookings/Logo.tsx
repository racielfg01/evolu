import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
     <Link
              href="/"
              className="text-sage-700 hover:text-sage-900 font-medium"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sage-600" />
                <span className="text-xl font-semibold text-sage-800">
                  Evolu
                </span>
              </div>
            </Link>
  )
}

export default Logo
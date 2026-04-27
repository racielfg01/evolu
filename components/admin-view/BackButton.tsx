'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  href: string
}

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter()
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(href)}
      className="px-0 hover:bg-transparent"
    >
      <ChevronLeft className="h-5 w-5 mr-1" />
      Back
    </Button>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"

const stats = [
  { id: 1, label: "Servicios de Excelencia", value: 50,suffix: "+"  },
  { id: 2, label: "Equipo de Profecionales", value: 4 },
  { id: 3, label: "Productos extrellas", value: 5 },
  { id: 4, label: "Clientes Felices", value: 500, suffix: "+" },
]

export default function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState(stats.map(() => 0))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const intervals = stats.map((stat, index) => {
      const duration = 2000 // 2 seconds for the animation
      const steps = 20 // Number of steps to reach the final value
      const increment = stat.value / steps
      let count = 0

      return setInterval(() => {
        count += increment
        if (count >= stat.value) {
          count = stat.value
          clearInterval(intervals[index])
        }

        setCounts((prev) => {
          const newCounts = [...prev]
          newCounts[index] = Math.floor(count)
          return newCounts
        })
      }, duration / steps)
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [isVisible])

  return (
    <div ref={ref} className="grid grid-cols-2 gap-6 mt-8">
      {stats.map((stat, index) => (
        <div key={stat.id} className="text-center">
          <div className="text-3xl font-bold text-sage-600">
            {counts[index]}
            {stat.suffix || ""}
          </div>
          <div className="text-sage-700 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}


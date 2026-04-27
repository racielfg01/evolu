"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Locate } from "lucide-react"

interface MapSelectorProps {
  latitude?: number
  longitude?: number
  address?: string
  onLocationChange: (location: { latitude: number; longitude: number; address: string }) => void
}

export function MapSelector({ latitude, longitude, address, onLocationChange }: MapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(address || "")
  const [currentLocation, setCurrentLocation] = useState({
    lat: latitude || 40.4168, // Default to Madrid
    lng: longitude || -3.7038,
  })
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Initialize map (using a simple implementation without external dependencies)
  useEffect(() => {
    if (mapRef.current) {
      // This is a placeholder for map initialization
      // In a real implementation, you would use Mapbox GL JS or Google Maps
      mapRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          text-align: center;
          position: relative;
        ">
          <div>
            <div style="font-size: 48px; margin-bottom: 16px;">📍</div>
            <div>Ubicación del Negocio</div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">
              Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}
            </div>
            <div style="font-size: 12px; opacity: 0.6; margin-top: 16px;">
              Haz clic en "Buscar Dirección" para actualizar la ubicación
            </div>
          </div>
        </div>
      `
    }
  }, [currentLocation])

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Simulate geocoding API call
      // In a real implementation, you would use a geocoding service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock coordinates for demonstration
      const mockCoordinates = {
        lat: 40.4168 + (Math.random() - 0.5) * 0.1,
        lng: -3.7038 + (Math.random() - 0.5) * 0.1,
      }

      setCurrentLocation(mockCoordinates)
      onLocationChange({
        latitude: mockCoordinates.lat,
        longitude: mockCoordinates.lng,
        address: searchQuery,
      })
    } catch (error) {
      console.error("Error searching location:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, onLocationChange])

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada en este navegador")
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })

        // Simulate reverse geocoding
        const mockAddress = `Calle Ejemplo ${Math.floor(Math.random() * 100)}, Ciudad`
        setSearchQuery(mockAddress)

        onLocationChange({
          latitude,
          longitude,
          address: mockAddress,
        })
        setIsLoading(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("No se pudo obtener la ubicación actual")
        setIsLoading(false)
      },
    )
  }, [onLocationChange])

  const handleMapClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Convert click position to coordinates (simplified)
      const lat = currentLocation.lat + (y - rect.height / 2) * 0.0001
      const lng = currentLocation.lng + (x - rect.width / 2) * 0.0001

      setCurrentLocation({ lat, lng })
      onLocationChange({
        latitude: lat,
        longitude: lng,
        address: searchQuery || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      })
    },
    [currentLocation, searchQuery, onLocationChange],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación del Negocio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address-search">Buscar Dirección</Label>
          <div className="flex gap-2">
            <Input
              id="address-search"
              placeholder="Ingresa la dirección del negocio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button type="button" variant="outline" onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              title="Usar ubicación actual"
            >
              <Locate className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mapa Interactivo</Label>
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="cursor-crosshair border rounded-lg overflow-hidden"
            style={{ minHeight: "300px" }}
          />
          <p className="text-sm text-muted-foreground">
            Haz clic en el mapa para ajustar la ubicación exacta del negocio
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitud</Label>
            <Input
              value={currentLocation.lat.toFixed(6)}
              onChange={(e) => {
                const lat = Number.parseFloat(e.target.value) || 0
                setCurrentLocation((prev) => ({ ...prev, lat }))
                onLocationChange({
                  latitude: lat,
                  longitude: currentLocation.lng,
                  address: searchQuery,
                })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Longitud</Label>
            <Input
              value={currentLocation.lng.toFixed(6)}
              onChange={(e) => {
                const lng = Number.parseFloat(e.target.value) || 0
                setCurrentLocation((prev) => ({ ...prev, lng }))
                onLocationChange({
                  latitude: currentLocation.lat,
                  longitude: lng,
                  address: searchQuery,
                })
              }}
            />
          </div>
        </div>

        {isLoading && <div className="text-center text-sm text-muted-foreground">Buscando ubicación...</div>}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Settings,

  Calendar,
  DollarSign,
  TrendingUp,

} from "lucide-react"
import { mockServices, mockAdminStats } from "@/lib/mock-data"


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdminDashboard() {
  const [services] = useState(mockServices)





  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Panel de Administración</h2>
        <p className="text-muted-foreground">Gestiona servicios, citas y visualiza estadísticas</p>
      </div>

     
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAdminStats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockAdminStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.filter((s) => s.isActive).length}</div>
                <p className="text-xs text-muted-foreground">de {services.length} servicios totales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+5% desde la semana pasada</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockAdminStats.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAdminStats.bookingsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {mockAdminStats.bookingsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAdminStats.popularServices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Las reservas han aumentado un 15% este mes comparado con el anterior.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Lunes</span>
                      <span className="text-sm font-medium">23 citas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Martes</span>
                      <span className="text-sm font-medium">31 citas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Miércoles</span>
                      <span className="text-sm font-medium">28 citas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Jueves</span>
                      <span className="text-sm font-medium">35 citas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Viernes</span>
                      <span className="text-sm font-medium">42 citas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
       
    </div>
  )
}


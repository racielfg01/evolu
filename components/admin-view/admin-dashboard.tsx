"use client"

import { useQuery } from "@tanstack/react-query";
import { getDashboardData, type DashboardData } from "@/lib/actions/dashboard.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, Users, Scissors, TrendingUp, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { es } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  PENDING: "Pendientes",
  COMPLETED: "Completadas",
  CANCELLED: "Canceladas",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-CU", { style: "currency", currency: "CUP" }).format(n);
}

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    refetchInterval: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return <p className="p-8 text-center text-muted-foreground">Error al cargar datos</p>;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <StatsCards data={data} />
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <div className="lg:col-span-2 space-y-4">
          <AppointmentChart data={data} />
          <RevenueChart data={data} />
        </div>
        <div className="space-y-4">
          <StatusCard data={data} />
          <TopServicesCard data={data} />
          <UpcomingCard data={data} />
        </div>
      </div>
    </div>
  );
}

function StatsCards({ data }: { data: DashboardData }) {
  const s = data.stats;
  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Ingresos del Mes</CardDescription>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(s.revenueMonth)}</p>
          <p className="text-xs text-muted-foreground">{s.appointmentsMonth} citas este mes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Citas Hoy</CardDescription>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{s.appointmentsToday}</p>
          <p className="text-xs text-muted-foreground">{s.appointmentsWeek} esta semana</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Clientes</CardDescription>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{s.totalClients}</p>
          <p className="text-xs text-muted-foreground">{s.totalAppointments} citas totales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Servicios</CardDescription>
          <Scissors className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{s.totalServices}</p>
          <p className="text-xs text-muted-foreground">activos</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentChart({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" /> Citas por Día
        </CardTitle>
        <CardDescription>Últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ citas: { label: "Citas", color: "var(--primary)" } }}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={data.dailyAppointments}>
            <defs>
              <linearGradient id="fillCitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-citas)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-citas)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <ChartTooltip
              content={<ChartTooltipContent
                labelFormatter={(v) => new Date(v + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
              />}
            />
            <Area dataKey="count" type="natural" fill="url(#fillCitas)" stroke="var(--color-citas)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" /> Ingresos por Día
        </CardTitle>
        <CardDescription>Últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ revenue: { label: "Ingresos", color: "hsl(142.1 76.2% 36.3%)" } }}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={data.dailyRevenue}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <ChartTooltip
              content={<ChartTooltipContent
                labelFormatter={(v) => new Date(v + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                formatter={(v) => formatCurrency(Number(v))}
              />}
            />
            <Area dataKey="revenue" type="natural" fill="url(#fillRevenue)" stroke="var(--color-revenue)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StatusCard({ data }: { data: DashboardData }) {
  const total = data.byStatus.reduce((s, i) => s + i.count, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4" /> Estado de Citas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.byStatus.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <Badge className={statusColors[item.status] || ""}>{statusLabels[item.status] || item.status}</Badge>
            <span className="text-sm font-medium">{item.count}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
          <span>Total</span>
          <span className="font-medium text-foreground">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TopServicesCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Scissors className="h-4 w-4" /> Servicios Populares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.topServices.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <span className="text-sm truncate max-w-[140px]">{s.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{s.count} citas</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(s.revenue)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function UpcomingCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" /> Próximas Citas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.upcomingAppointments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No hay citas próximas</p>
        )}
        {data.upcomingAppointments.map((a) => (
          <div key={a.id} className="border rounded-lg p-3 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.client}</span>
              <Badge className={statusColors[a.status]}>{statusLabels[a.status] || a.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(a.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xs text-muted-foreground truncate">{a.services.join(", ")}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-20" /></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <div className="lg:col-span-2 space-y-4">
          <Card><CardContent className="p-6"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
      </div>
    </div>
  );
}

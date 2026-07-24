"use server"

import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export interface DashboardData {
  stats: {
    totalAppointments: number;
    appointmentsToday: number;
    appointmentsWeek: number;
    appointmentsMonth: number;
    revenueTotal: number;
    revenueMonth: number;
    totalClients: number;
    totalServices: number;
    completedToday: number;
    cancelledThisMonth: number;
  };
  byStatus: { status: string; count: number }[];
  dailyAppointments: { date: string; count: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  upcomingAppointments: {
    id: string;
    client: string;
    date: Date;
    endDate: Date;
    status: string;
    services: string[];
  }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    totalAppointments,
    appointmentsToday,
    appointmentsWeek,
    appointmentsMonth,
    byStatus,
    revenueResult,
    revenueMonthResult,
    totalClients,
    totalServices,
    appointmentsByDay,
    topServicesResult,
    upcomingAppointments,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { date: { gte: todayStart, lte: todayEnd } } }),
    prisma.appointment.count({ where: { date: { gte: weekStart, lte: weekEnd } } }),
    prisma.appointment.count({ where: { date: { gte: monthStart, lte: monthEnd } } }),
    prisma.appointment.groupBy({ by: ["status"], _count: true }),
    prisma.appointment.aggregate({ where: { status: "COMPLETED" }, _sum: { total_price: true } }),
    prisma.appointment.aggregate({
      where: { status: "COMPLETED", date: { gte: monthStart, lte: monthEnd } },
      _sum: { total_price: true },
    }),
    prisma.user.count({ where: { role: { name: "USER" } } }),
    prisma.service.count({ where: { isActive: true } }),
    getDailyAppointments(),
    getTopServices(),
    getUpcomingAppointments(),
  ]);

  return {
    stats: {
      totalAppointments,
      appointmentsToday,
      appointmentsWeek,
      appointmentsMonth,
      revenueTotal: revenueResult._sum.total_price || 0,
      revenueMonth: revenueMonthResult._sum.total_price || 0,
      totalClients,
      totalServices,
      completedToday: 0,
      cancelledThisMonth: 0,
    },
    byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
    dailyAppointments: appointmentsByDay.map(a => ({ date: a.date, count: a.count })),
    dailyRevenue: appointmentsByDay.map(a => ({ date: a.date, revenue: a.revenue })),
    topServices: topServicesResult,
    upcomingAppointments,
  };
}

async function getDailyAppointments() {
  const results = await prisma.$queryRaw<Array<{ date: string; count: bigint; revenue: number }>>`
    SELECT
      DATE(date) as date,
      COUNT(*)::int as count,
      COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN total_price ELSE 0 END), 0) as revenue
    FROM appointments
    WHERE date >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(date)
    ORDER BY date ASC
  `;
  return results.map(r => ({ date: r.date, count: Number(r.count), revenue: Number(r.revenue) }));
}

async function getTopServices() {
  const results = await prisma.appointmentService.groupBy({
    by: ["service_id"],
    _count: true,
    orderBy: { _count: { service_id: "desc" } },
    take: 5,
  });
  const services = await prisma.service.findMany({
    where: { id: { in: results.map(r => r.service_id) } },
  });
  const serviceMap = new Map(services.map(s => [s.id, s]));
  return results.map(r => {
    const service = serviceMap.get(r.service_id);
    return {
      name: service?.name || "Unknown",
      count: r._count,
      revenue: r._count * (service?.price || 0),
    };
  });
}

async function getUpcomingAppointments() {
  const now = new Date();
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: now },
      status: { in: ["PENDING"] },
    },
    include: {
      user: { select: { name: true } },
      services: { include: { service: { select: { name: true } } } },
    },
    orderBy: { date: "asc" },
    take: 5,
  });
  return appointments.map(a => ({
    id: a.id,
    client: a.user.name || "Unknown",
    date: a.date,
    endDate: a.endDate,
    status: a.status,
    services: a.services.map(s => s.service.name),
  }));
}

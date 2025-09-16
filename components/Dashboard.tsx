// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
// import { Appointment, Service } from '@/types/types'

// type DashboardProps = {
//   appointments: Appointment[]
//   services: Service[]
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// export function Dashboard({ appointments }: DashboardProps) {
//   const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')

//   const getSeasonFromDate = (date: string): 'spring' | 'summer' | 'autumn' | 'winter' => {
//     const month = new Date(date).getMonth()
//     if (month >= 2 && month <= 4) return 'spring'
//     if (month >= 5 && month <= 7) return 'summer'
//     if (month >= 8 && month <= 10) return 'autumn'
//     return 'winter'
//   }

//   const totalAppointments = appointments.length
//   const totalRevenue = appointments.reduce((sum, app) => sum + app.service.price, 0)
//   const averageRevenuePerAppointment = totalRevenue / totalAppointments || 0

//   const appointmentsBySeason = appointments.reduce((acc, app) => {
//     const season = getSeasonFromDate(app.date)
//     acc[season] = (acc[season] || 0) + 1
//     return acc
//   }, {} as Record<string, number>)

//   const servicePopularity = appointments.reduce((acc, app) => {
//     acc[app.service.name] = (acc[app.service.name] || 0) + 1
//     return acc
//   }, {} as Record<string, number>)

//   const topServices = Object.entries(servicePopularity)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 5)
//     .map(([name, count]) => ({ name, count }))

//   const seasonalServicePopularity = appointments.reduce((acc, app) => {
//     const season = getSeasonFromDate(app.date)
//     if (!acc[season]) acc[season] = {}
//     acc[season][app.service.name] = (acc[season][app.service.name] || 0) + 1
//     return acc
//   }, {} as Record<string, Record<string, number>>)

//   const topSeasonalServices = Object.entries(seasonalServicePopularity[selectedSeason] || {})
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 5)
//     .map(([name, count]) => ({ name, count }))

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold">Dashboard</h2>
      
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalAppointments}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Average Revenue per Appointment</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${averageRevenuePerAppointment.toFixed(2)}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Appointments by Season</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={Object.entries(appointmentsBySeason).map(([season, count]) => ({ season, count }))}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="season" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Top 5 Most Popular Services</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={topServices}
//                 dataKey="count"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 label
//               >
//                 {topServices.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Top Services by Season</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={selectedSeason} onValueChange={(value) => setSelectedSeason(value as any)}>
//             <TabsList>
//               <TabsTrigger value="spring">Spring</TabsTrigger>
//               <TabsTrigger value="summer">Summer</TabsTrigger>
//               <TabsTrigger value="autumn">Autumn</TabsTrigger>
//               <TabsTrigger value="winter">Winter</TabsTrigger>
//             </TabsList>
//             <TabsContent value={selectedSeason}>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={topSeasonalServices}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="count" fill="#82ca9d" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


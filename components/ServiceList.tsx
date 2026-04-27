// // components/ServiceList.tsx
// 'use client'

// import { useServices, useDeleteService } from '@/lib/hooks/service.hooks';

// export function ServiceList() {
//   const { data: services, isLoading, error } = useServices();
//   const deleteMutation = useDeleteService();

//   if (isLoading) return <div>Loading services...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {services?.map(service => (
//         <div key={service.id} className="border p-4 rounded-lg">
//           <h3 className="font-bold">{service.name}</h3>
//           <p className="text-gray-600">{service.description}</p>
//           <div className="mt-2 flex justify-between items-center">
//             <span>${service.price}</span>
//             <span>{service.duration} min</span>
//           </div>
//           <button
//             onClick={() => deleteMutation.mutate(service.id)}
//             disabled={deleteMutation.isLoading}
//             className="mt-2 text-red-500"
//           >
//             {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
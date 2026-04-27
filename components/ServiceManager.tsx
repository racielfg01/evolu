// 'use client'

// import { useState } from 'react'
// import { Service } from '@/types/types'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Toggle } from '@/components/ui/toggle'
// import { Grid, List, Edit, Trash2, Plus } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Image from 'next/image'

// type ServiceManagerProps = {
//   services: Service[];
//   onAddService: (service: Omit<Service, 'id'>) => void;
//   onUpdateService: (service: Service) => void;
//   onDeleteService: (serviceId: string) => void;
// };

// export function ServiceManager({ services, onAddService, onUpdateService, onDeleteService }: ServiceManagerProps) {
//   const [editingService, setEditingService] = useState<Service | null>(null);
//   const [newService, setNewService] = useState<Omit<Service, 'id'>>({
//     name: '',
//     description: '',
//     duration:0,
//     price: 0,
//     imageUrl: ''
//   });
//   const [isGridView, setIsGridView] = useState(true);
//   const [isAddingService, setIsAddingService] = useState(false);

//   const handleAddService = () => {
//     const serviceToAdd = {
//       ...newService,
//       imageUrl: newService.imageUrl || '',
//     };
//     onAddService(serviceToAdd);
//     setNewService({ name: '', description: '', price: 0, duration: 0, imageUrl: '' });
//     setIsAddingService(false);
//   };

//   const handleUpdateService = () => {
//     if (editingService) {
//       onUpdateService(editingService);
//       setEditingService(null);
//     }
//   };

//   const ServiceCard = ({ service }: { service: Service }) => (
//     <motion.div
//       layout
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="overflow-hidden">
//         <div className="relative h-48">
//           {service.imageUrl ? (
//             <Image src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
//           ) : (
//             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//               <span className="text-gray-400">No image</span>
//             </div>
//           )}
//           <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
//             <h3 className="text-white text-xl font-semibold">{service.name}</h3>
//           </div>
//         </div>
//         <CardContent className="p-4">
//           <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
//           <p className="font-bold mt-2 text-lg">${service.price.toFixed(2)}</p>
//         </CardContent>
//         <CardFooter className="flex justify-end space-x-2 p-4">
//           <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
//             <Edit className="h-4 w-4 mr-2" />
//             Edit
//           </Button>
//           <Button size="sm" variant="destructive" onClick={() => onDeleteService(service.id)}>
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete
//           </Button>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );

//   const ServiceListItem = ({ service }: { service: Service }) => (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//       className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors duration-200"
//     >
//       <div className="flex items-center space-x-4">
//         {service.imageUrl ? (
//           <Image src={service.imageUrl} alt={service.name} className="w-16 h-16 object-cover rounded-full" />
//         ) : (
//           <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
//             <span className="text-gray-400 text-xs">No image</span>
//           </div>
//         )}
//         <div>
//           <h3 className="font-semibold text-lg">{service.name}</h3>
//           <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
//         </div>
//       </div>
//       <div className="flex items-center space-x-2">
//         <p className="font-bold text-lg">${service.price.toFixed(2)}</p>
//         <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
//           <Edit className="h-4 w-4" />
//           <span className="sr-only">Edit</span>
//         </Button>
//         <Button size="sm" variant="destructive" onClick={() => onDeleteService(service.id)}>
//           <Trash2 className="h-4 w-4" />
//           <span className="sr-only">Delete</span>
//         </Button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="space-y-2">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Manage Services</h2>
//         <div className="flex items-center space-x-2">
//           <Toggle
//             aria-label="Toggle view"
//             pressed={isGridView}
//             onPressedChange={setIsGridView}
//           >
//             {isGridView ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
//           </Toggle>
//           <Button onClick={() => setIsAddingService(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Service
//           </Button>
//         </div>
//       </div>
//       <AnimatePresence>
//         {isGridView ? (
//           <motion.div 
//             className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//             layout
//           >
//             {services.map((service) => (
//               <ServiceCard key={service.id} service={service} />
//             ))}
//           </motion.div>
//         ) : (
//           <motion.div 
//             className="space-y-2 bg-white rounded-lg shadow overflow-hidden"
//             layout
//           >
//             {services.map((service) => (
//               <ServiceListItem key={service.id} service={service} />
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {(isAddingService || editingService) && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="mt-8 p-6 bg-white rounded-lg shadow"
//           >
//             <h3 className="text-xl font-bold mb-4">
//               {editingService ? 'Edit Service' : 'Add New Service'}
//             </h3>
//             <div className="space-y-4">
//               <Input
//                 placeholder="Service name"
//                 value={editingService ? editingService.name : newService.name}
//                 onChange={(e) => editingService 
//                   ? setEditingService({...editingService, name: e.target.value})
//                   : setNewService({...newService, name: e.target.value})}
//               />
//               <Textarea
//                 placeholder="Service description"
//                 value={editingService ? editingService.description : newService.description}
//                 onChange={(e) => editingService
//                   ? setEditingService({...editingService, description: e.target.value})
//                   : setNewService({...newService, description: e.target.value})}
//               />
//               <Input
//                 type="number"
//                 placeholder="Price"
//                 value={editingService ? editingService.price : newService.price}
//                 onChange={(e) => {
//                   const price = parseFloat(e.target.value);
//                   editingService
//                     ? setEditingService({...editingService, price})
//                     : setNewService({...newService, price});
//                 }}
//               /> 
//               <Input
//                 type="number"
//                 placeholder="Tiempo en minutos"
//                 value={editingService ? editingService.duration : newService.duration}
//                 onChange={(e) => {
//                   const duration = parseFloat(e.target.value);
//                   editingService
//                     ? setEditingService({...editingService, duration})
//                     : setNewService({...newService, duration});
//                 }}
//               />
//               <Input
//                 placeholder="Image URL"
//                 value={editingService ? editingService.imageUrl : newService.imageUrl}
//                 onChange={(e) => editingService
//                   ? setEditingService({...editingService, imageUrl: e.target.value})
//                   : setNewService({...newService, imageUrl: e.target.value})}
//               />
//               <div className="flex justify-end space-x-2">
//                 {editingService ? (
//                   <>
//                     <Button onClick={handleUpdateService}>Update Service</Button>
//                     <Button variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button onClick={handleAddService}>Add Service</Button>
//                     <Button variant="outline" onClick={() => setIsAddingService(false)}>Cancel</Button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


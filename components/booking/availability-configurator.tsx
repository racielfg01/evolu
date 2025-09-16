// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Settings, Save, X, Plus, Trash2 } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// // Interfaces para la configuración (las mismas que en el componente principal)
// interface BusinessHours {
//   morning: { start: string; end: string } | null;
//   afternoon: { start: string; end: string } | null;
// }

// interface DayAvailability {
//   available: boolean;
//   hours: BusinessHours;
// }

// interface WeekAvailability {
//   [key: string]: DayAvailability;
// }

// interface SpecificDateOverride {
//   date: string;
//   available: boolean;
//   hours?: BusinessHours;
// }

// interface BusinessConfiguration {
//   weekAvailability: WeekAvailability;
//   specificDateOverrides?: SpecificDateOverride[];
//   minBookingNotice?: number;
// }

// // Configuración por defecto
// const defaultBusinessConfig: BusinessConfiguration = {
//   weekAvailability: {
//     "1": {
//       available: true,
//       hours: {
//         morning: { start: "09:00", end: "13:00" },
//         afternoon: { start: "15:00", end: "18:00" },
//       },
//     },
//     "2": {
//       available: true,
//       hours: {
//         morning: { start: "09:00", end: "13:00" },
//         afternoon: { start: "15:00", end: "18:00" },
//       },
//     },
//     "3": {
//       available: true,
//       hours: {
//         morning: { start: "09:00", end: "13:00" },
//         afternoon: { start: "15:00", end: "18:00" },
//       },
//     },
//     "4": {
//       available: true,
//       hours: {
//         morning: { start: "09:00", end: "13:00" },
//         afternoon: { start: "15:00", end: "18:00" },
//       },
//     },
//     "5": {
//       available: true,
//       hours: {
//         morning: { start: "09:00", end: "13:00" },
//         afternoon: { start: "15:00", end: "18:00" },
//       },
//     },
//     "6": {
//       available: true,
//       hours: { morning: { start: "10:00", end: "14:00" }, afternoon: null },
//     },
//     "0": { available: false, hours: { morning: null, afternoon: null } },
//   },
//   specificDateOverrides: [
//     { date: "2024-12-25", available: false },
//     {
//       date: "2024-12-24",
//       available: true,
//       hours: { morning: { start: "09:00", end: "13:00" }, afternoon: null },
//     },
//   ],
//   minBookingNotice: 24,
// };

// interface AvailabilityConfiguratorProps {
//   onConfigChange: (config: BusinessConfiguration) => void;
//   initialConfig?: BusinessConfiguration;
// }

// export function AvailabilityConfigurator({
//   onConfigChange,
//   initialConfig = defaultBusinessConfig,
// }: AvailabilityConfiguratorProps) {
//   const [config, setConfig] = useState<BusinessConfiguration>(initialConfig);
//   // const [isOpen, setIsOpen] = useState(false);
//   const [newOverride, setNewOverride] = useState<SpecificDateOverride>({
//     date: "",
//     available: true,
//     hours: {
//       morning: { start: "09:00", end: "13:00" },
//       afternoon: { start: "15:00", end: "18:00" },
//     },
//   });

//   const daysOfWeek = [
//     { id: "1", name: "Lunes" },
//     { id: "2", name: "Martes" },
//     { id: "3", name: "Miércoles" },
//     { id: "4", name: "Jueves" },
//     { id: "5", name: "Viernes" },
//     { id: "6", name: "Sábado" },
//     { id: "0", name: "Domingo" },
//   ];

//   const handleDayAvailabilityChange = (dayId: string, available: boolean) => {
//     const updatedConfig = { ...config };
//     updatedConfig.weekAvailability[dayId] = {
//       ...updatedConfig.weekAvailability[dayId],
//       available,
//     };
//     setConfig(updatedConfig);
//   };

//   const handleTimeChange = (
//     dayId: string,
//     period: "morning" | "afternoon",
//     field: "start" | "end",
//     value: string
//   ) => {
//     const updatedConfig = { ...config };

//     if (!updatedConfig.weekAvailability[dayId].hours[period]) {
//       updatedConfig.weekAvailability[dayId].hours[period] = {
//         start: "09:00",
//         end: "13:00",
//       };
//     }

//     if (updatedConfig.weekAvailability[dayId].hours[period]) {
//       updatedConfig.weekAvailability[dayId].hours[period]![field] = value;
//     }

//     setConfig(updatedConfig);
//   };

//   const handleTogglePeriod = (
//     dayId: string,
//     period: "morning" | "afternoon",
//     enabled: boolean
//   ) => {
//     const updatedConfig = { ...config };

//     if (enabled) {
//       updatedConfig.weekAvailability[dayId].hours[period] = {
//         start: period === "morning" ? "09:00" : "15:00",
//         end: period === "morning" ? "13:00" : "18:00",
//       };
//     } else {
//       updatedConfig.weekAvailability[dayId].hours[period] = null;
//     }

//     setConfig(updatedConfig);
//   };

//   const handleAddOverride = () => {
//     if (!newOverride.date) return;

//     const updatedConfig = { ...config };
//     if (!updatedConfig.specificDateOverrides) {
//       updatedConfig.specificDateOverrides = [];
//     }

//     // Evitar duplicados
//     if (
//       !updatedConfig.specificDateOverrides.find(
//         (o) => o.date === newOverride.date
//       )
//     ) {
//       updatedConfig.specificDateOverrides.push({ ...newOverride });
//       setConfig(updatedConfig);

//       // Resetear formulario
//       setNewOverride({
//         date: "",
//         available: true,
//         hours: {
//           morning: { start: "09:00", end: "13:00" },
//           afternoon: { start: "15:00", end: "18:00" },
//         },
//       });
//     }
//   };

//   const handleRemoveOverride = (date: string) => {
//     const updatedConfig = { ...config };
//     if (updatedConfig.specificDateOverrides) {
//       updatedConfig.specificDateOverrides =
//         updatedConfig.specificDateOverrides.filter((o) => o.date !== date);
//       setConfig(updatedConfig);
//     }
//   };

//   const handleMinNoticeChange = (value: string) => {
//     const hours = parseInt(value) || 0;
//     setConfig({ ...config, minBookingNotice: hours });
//   };

//   const handleSave = () => {
//     console.log('config',config)
//     onConfigChange(config);
//     // setIsOpen(false);
//   };

//   const handleCancel = () => {
//     setConfig(initialConfig);
//     // setIsOpen(false);
//   };

//   return (
//     <>
//       <Tabs defaultValue="servicios" className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="available_week">
//             Disponibilidad Semanal
//           </TabsTrigger>
//           <TabsTrigger value="special_days">Días Especiales</TabsTrigger>
//           <TabsTrigger value="general_settings">
//             Configuración General
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="available_week" className="space-y-6">
//           {daysOfWeek.map((day) => (
//             <div key={day.id} className="space-y-4 p-4 border rounded-lg">
//               <div className="flex items-center justify-between">
//                 <Label
//                   htmlFor={`day-${day.id}`}
//                   className="text-base font-medium"
//                 >
//                   {day.name}
//                 </Label>
//                 <Switch
//                   id={`day-${day.id}`}
//                   checked={config.weekAvailability[day.id]?.available || false}
//                   onCheckedChange={(checked) =>
//                     handleDayAvailabilityChange(day.id, checked)
//                   }
//                 />
//               </div>

//               {config.weekAvailability[day.id]?.available && (
//                 <div className="grid gap-4 ml-4">
//                   <div className="flex items-center gap-4">
//                     <Switch
//                       checked={!!config.weekAvailability[day.id].hours.morning}
//                       onCheckedChange={(checked) =>
//                         handleTogglePeriod(day.id, "morning", checked)
//                       }
//                     />
//                     <Label className="w-20">Mañana:</Label>
//                     {config.weekAvailability[day.id].hours.morning ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           type="time"
//                           value={
//                             config.weekAvailability[day.id].hours.morning
//                               ?.start || ""
//                           }
//                           onChange={(e) =>
//                             handleTimeChange(
//                               day.id,
//                               "morning",
//                               "start",
//                               e.target.value
//                             )
//                           }
//                           className="w-28"
//                         />
//                         <span>-</span>
//                         <Input
//                           type="time"
//                           value={
//                             config.weekAvailability[day.id].hours.morning
//                               ?.end || ""
//                           }
//                           onChange={(e) =>
//                             handleTimeChange(
//                               day.id,
//                               "morning",
//                               "end",
//                               e.target.value
//                             )
//                           }
//                           className="w-28"
//                         />
//                       </div>
//                     ) : (
//                       <span className="text-muted-foreground">Cerrado</span>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <Switch
//                       checked={
//                         !!config.weekAvailability[day.id].hours.afternoon
//                       }
//                       onCheckedChange={(checked) =>
//                         handleTogglePeriod(day.id, "afternoon", checked)
//                       }
//                     />
//                     <Label className="w-20">Tarde:</Label>
//                     {config.weekAvailability[day.id].hours.afternoon ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           type="time"
//                           value={
//                             config.weekAvailability[day.id].hours.afternoon
//                               ?.start || ""
//                           }
//                           onChange={(e) =>
//                             handleTimeChange(
//                               day.id,
//                               "afternoon",
//                               "start",
//                               e.target.value
//                             )
//                           }
//                           className="w-28"
//                         />
//                         <span>-</span>
//                         <Input
//                           type="time"
//                           value={
//                             config.weekAvailability[day.id].hours.afternoon
//                               ?.end || ""
//                           }
//                           onChange={(e) =>
//                             handleTimeChange(
//                               day.id,
//                               "afternoon",
//                               "end",
//                               e.target.value
//                             )
//                           }
//                           className="w-28"
//                         />
//                       </div>
//                     ) : (
//                       <span className="text-muted-foreground">Cerrado</span>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </TabsContent>

//         <TabsContent value="special_days" className="space-y-6">
//           <div className="grid gap-4 p-4 border rounded-lg">
//             <h3 className="font-medium">Agregar día especial</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="override-date">Fecha</Label>
//                 <Input
//                   id="override-date"
//                   type="date"
//                   value={newOverride.date}
//                   onChange={(e) =>
//                     setNewOverride({ ...newOverride, date: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="flex items-center gap-4 mt-6">
//                 <Switch
//                   id="override-available"
//                   checked={newOverride.available}
//                   onCheckedChange={(checked) =>
//                     setNewOverride({ ...newOverride, available: checked })
//                   }
//                 />
//                 <Label htmlFor="override-available">
//                   {newOverride.available ? "Disponible" : "No disponible"}
//                 </Label>
//               </div>
//             </div>

//             {newOverride.available && (
//               <div className="grid gap-4 ml-4">
//                 <div className="flex items-center gap-4">
//                   <Label className="w-20">Mañana:</Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="time"
//                       value={newOverride.hours?.morning?.start || ""}
//                       onChange={(e) =>
//                         setNewOverride({
//                           ...newOverride,
//                           hours: {
//                             ...newOverride.hours,
//                             morning: {
//                               ...newOverride.hours?.morning,
//                               start: e.target.value,
//                             } as any,
//                           },
//                         })
//                       }
//                       className="w-28"
//                     />
//                     <span>-</span>
//                     <Input
//                       type="time"
//                       value={newOverride.hours?.morning?.end || ""}
//                       onChange={(e) =>
//                         setNewOverride({
//                           ...newOverride,
//                           hours: {
//                             ...newOverride.hours,
//                             morning: {
//                               ...newOverride.hours?.morning,
//                               end: e.target.value,
//                             } as any,
//                           },
//                         })
//                       }
//                       className="w-28"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <Label className="w-20">Tarde:</Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="time"
//                       value={newOverride.hours?.afternoon?.start || ""}
//                       onChange={(e) =>
//                         setNewOverride({
//                           ...newOverride,
//                           hours: {
//                             ...newOverride.hours,
//                             afternoon: {
//                               ...newOverride.hours?.afternoon,
//                               start: e.target.value,
//                             } as any,
//                           },
//                         })
//                       }
//                       className="w-28"
//                     />
//                     <span>-</span>
//                     <Input
//                       type="time"
//                       value={newOverride.hours?.afternoon?.end || ""}
//                       onChange={(e) =>
//                         setNewOverride({
//                           ...newOverride,
//                           hours: {
//                             ...newOverride.hours,
//                             afternoon: {
//                               ...newOverride.hours?.afternoon,
//                               end: e.target.value,
//                             } as any,
//                           },
//                         })
//                       }
//                       className="w-28"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Button onClick={handleAddOverride} className="gap-2">
//               <Plus className="h-4 w-4" />
//               Agregar día especial
//             </Button>
//           </div>

//           <div className="space-y-2">
//             <h3 className="font-medium">Días especiales configurados</h3>
//             {config.specificDateOverrides &&
//             config.specificDateOverrides.length > 0 ? (
//               <div className="space-y-2">
//                 {config.specificDateOverrides.map((override) => (
//                   <div
//                     key={override.date}
//                     className="flex items-center justify-between p-2 border rounded"
//                   >
//                     <div>
//                       <span className="font-medium">{override.date}</span>
//                       <span
//                         className={`ml-2 ${override.available ? "text-green-600" : "text-red-600"}`}
//                       >
//                         ({override.available ? "Disponible" : "No disponible"})
//                       </span>
//                       {override.available && override.hours && (
//                         <div className="text-sm text-muted-foreground ml-4">
//                           {override.hours.morning && (
//                             <span>
//                               Mañana: {override.hours.morning.start} -{" "}
//                               {override.hours.morning.end}
//                             </span>
//                           )}
//                           {override.hours.afternoon &&
//                             override.hours.morning && <span>, </span>}
//                           {override.hours.afternoon && (
//                             <span>
//                               Tarde: {override.hours.afternoon.start} -{" "}
//                               {override.hours.afternoon.end}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleRemoveOverride(override.date)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-muted-foreground">
//                 No hay días especiales configurados
//               </p>
//             )}
//           </div>
//         </TabsContent>

//         <TabsContent value="general_settings" className="space-y-6">
//           <div className="grid gap-4 p-4 border rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//               <Label htmlFor="min-notice" className="text-base">
//                 Anticipación mínima para reservas (horas):
//               </Label>
//               <Input
//                 id="min-notice"
//                 type="number"
//                 min="0"
//                 value={config.minBookingNotice || 0}
//                 onChange={(e) => handleMinNoticeChange(e.target.value)}
//                 className="w-20"
//               />
//             </div>
//           </div>
//         </TabsContent>

//           <div className="flex justify-end my-4 gap-2 ">
//             <Button variant="outline" onClick={handleCancel}>
//               <X className="h-4 w-4 mr-2" />
//               Cancelar
//             </Button>
//             <Button onClick={handleSave}>
//               <Save className="h-4 w-4 mr-2" />
//               Guardar Configuración
//             </Button>
//           </div>
//       </Tabs>

//     </>
//   );
// }

"use client";

import { useCallback,  useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  saveBusinessConfig,
  getBusinessConfig,
  //  type BusinessConfiguration,
  resetToDefaultConfig,
  BusinessConfiguration,
} from "@/lib/actions/config.actions";

// Interfaces para la configuración
export interface BusinessHours {
  morning: { start: string; end: string } | null;
  afternoon: { start: string; end: string } | null;
}

interface DayAvailability {
  available: boolean;
  hours: BusinessHours;
}

export interface WeekAvailability {
  [key: string]: DayAvailability;
}

interface SpecificDateOverride {
  date: string;
  available: boolean;
  hours?: BusinessHours;
}

// export interface BusinessConfiguration {
//   weekAvailability: WeekAvailability;
//   specificDateOverrides?: SpecificDateOverride[];
//   minBookingNotice?: number;
// }

// Configuración por defecto
const defaultBusinessConfig: BusinessConfiguration = {
  weekAvailability: {
    "1": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    },
    "2": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    },
    "3": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    },
    "4": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    },
    "5": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    },
    "6": {
      available: true,
      hours: { morning: { start: "10:00", end: "14:00" }, afternoon: null },
    },
    "0": { available: false, hours: { morning: null, afternoon: null } },
  },
  specificDateOverrides: [
    { date: "2024-12-25", available: false },
    {
      date: "2024-12-24",
      available: true,
      hours: { morning: { start: "09:00", end: "13:00" }, afternoon: null },
    },
  ],
  minBookingNotice: 24,
};

interface AvailabilityConfiguratorProps {
  onConfigChange: (config: BusinessConfiguration) => void;
  initialConfig?: BusinessConfiguration;
}

export function AvailabilityConfigurator({
  onConfigChange,
  initialConfig = defaultBusinessConfig,
}: AvailabilityConfiguratorProps) {
  // const [config, setConfig] = useState<BusinessConfiguration>(initialConfig);
  const [newOverride, setNewOverride] = useState<SpecificDateOverride>({
    date: "",
    available: true,
    hours: {
      morning: { start: "09:00", end: "13:00" },
      afternoon: { start: "15:00", end: "18:00" },
    },
  });
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const daysOfWeek = [
    { id: "1", name: "Lun", fullName: "Lunes" },
    { id: "2", name: "Mar", fullName: "Martes" },
    { id: "3", name: "Mié", fullName: "Miércoles" },
    { id: "4", name: "Jue", fullName: "Jueves" },
    { id: "5", name: "Vie", fullName: "Viernes" },
    { id: "6", name: "Sáb", fullName: "Sábado" },
    { id: "0", name: "Dom", fullName: "Domingo" },
  ];

  const [config, setConfig] = useState<BusinessConfiguration>(
    initialConfig || defaultBusinessConfig
  );
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Cargar configuración al iniciar
  // useEffect(() => {
  //     const loadConfig = async () => {
  //   try {
  //     setIsLoading(true);
  //     const savedConfig = await getBusinessConfig();
  //     if (savedConfig) {
  //       setConfig(savedConfig);
  //       onConfigChange?.(savedConfig);
  //     }
  //   } catch (error) {
  //     console.error('Error loading config:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //   loadConfig();
  // }, [onConfigChange]);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedConfig = await getBusinessConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        onConfigChange?.(savedConfig);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onConfigChange]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSaveStatus(null);

      const result = await saveBusinessConfig(config);

      if (result.success) {
        setSaveStatus({ type: "success", message: result.message as string });
        onConfigChange?.(config);

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({
          type: "error",
          message: result.error || "Error al guardar",
        });
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Error inesperado al guardar" });
      console.error("Error saving config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const savedConfig = await getBusinessConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      onConfigChange?.(savedConfig);
    } else {
      setConfig(defaultBusinessConfig);
      onConfigChange?.(defaultBusinessConfig);
    }
    setSaveStatus(null);
  };

  const handleResetToDefault = async () => {
    try {
      setIsLoading(true);
      const result = await resetToDefaultConfig();

      if (result.success) {
        await loadConfig(); // Recargar la configuración
        setSaveStatus({
          type: "success",
          message: "Configuración restaurada a valores predeterminados",
        });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({
          type: "error",
          message: result.error || "Error al restaurar",
        });
      }
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "Error al restaurar configuración" + error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayId: string) => {
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleDayAvailabilityChange = (dayId: string, available: boolean) => {
    const updatedConfig = { ...config };
    updatedConfig.weekAvailability[dayId] = {
      ...updatedConfig.weekAvailability[dayId],
      available,
    };
    setConfig(updatedConfig);
  };

  const handleTimeChange = (
    dayId: string,
    period: "morning" | "afternoon",
    field: "start" | "end",
    value: string
  ) => {
    const updatedConfig = { ...config };

    if (!updatedConfig.weekAvailability[dayId].hours[period]) {
      updatedConfig.weekAvailability[dayId].hours[period] = {
        start: "09:00",
        end: "13:00",
      };
    }

    if (updatedConfig.weekAvailability[dayId].hours[period]) {
      updatedConfig.weekAvailability[dayId].hours[period]![field] = value;
    }

    setConfig(updatedConfig);
  };

  const handleTogglePeriod = (
    dayId: string,
    period: "morning" | "afternoon",
    enabled: boolean
  ) => {
    const updatedConfig = { ...config };

    if (enabled) {
      updatedConfig.weekAvailability[dayId].hours[period] = {
        start: period === "morning" ? "09:00" : "15:00",
        end: period === "morning" ? "13:00" : "18:00",
      };
    } else {
      updatedConfig.weekAvailability[dayId].hours[period] = null;
    }

    setConfig(updatedConfig);
  };

  const handleAddOverride = () => {
    if (!newOverride.date) return;

    const updatedConfig = { ...config };
    if (!updatedConfig.specificDateOverrides) {
      updatedConfig.specificDateOverrides = [];
    }

    // Evitar duplicados
    if (
      !updatedConfig.specificDateOverrides.find(
        (o) => o.date === newOverride.date
      )
    ) {
      updatedConfig.specificDateOverrides.push({ ...newOverride });
      setConfig(updatedConfig);

      // Resetear formulario
      setNewOverride({
        date: "",
        available: true,
        hours: {
          morning: { start: "09:00", end: "13:00" },
          afternoon: { start: "15:00", end: "18:00" },
        },
      });
    }
  };

  const handleRemoveOverride = (date: string) => {
    const updatedConfig = { ...config };
    if (updatedConfig.specificDateOverrides) {
      updatedConfig.specificDateOverrides =
        updatedConfig.specificDateOverrides.filter((o) => o.date !== date);
      setConfig(updatedConfig);
    }
  };

  const handleMinNoticeChange = (value: string) => {
    const hours = parseInt(value) || 0;
    setConfig({ ...config, minBookingNotice: hours });
  };

  // const handleSave = () => {
  //   onConfigChange(config);
  // };

  // const handleCancel = () => {
  //   setConfig(initialConfig);
  // };


   // Función auxiliar para manejar cambios en horas de días especiales
  const handleOverrideTimeChange = (
    period: "morning" | "afternoon",
    field: "start" | "end",
    value: string
  ) => {
    setNewOverride(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [period]: prev.hours?.[period] 
          ? { ...prev.hours[period], [field]: value }
          : { start: "09:00", end: "13:00" }
      } as BusinessHours
    }));
  };


  return (
    <>
      <div className="w-full space-y-4">
        {/* Status messages */}
        {saveStatus && (
          <div
            className={`p-3 rounded-lg ${
              saveStatus.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Guardando configuración...</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full space-y-4">
        <Tabs defaultValue="available_week" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="available_week" className="text-xs sm:text-sm">
              Semana
            </TabsTrigger>
            <TabsTrigger value="special_days" className="text-xs sm:text-sm">
              Especiales
            </TabsTrigger>
            <TabsTrigger
              value="general_settings"
              className="text-xs sm:text-sm"
            >
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available_week" className="space-y-3">
            {daysOfWeek.map((day) => (
              <Collapsible
                key={day.id}
                open={openDays[day.id]}
                onOpenChange={() => toggleDay(day.id)}
                className="border rounded-lg"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={
                        config.weekAvailability[day.id]?.available || false
                      }
                      onCheckedChange={(checked) =>
                        handleDayAvailabilityChange(day.id, checked)
                      }
                    />
                    <Label className="font-medium">{day.fullName}</Label>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {openDays[day.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  {config.weekAvailability[day.id]?.available && (
                    <div className="px-3 pb-3 space-y-3 border-t">
                      <div className="pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Mañana</Label>
                          <Switch
                            checked={
                              !!config.weekAvailability[day.id].hours.morning
                            }
                            onCheckedChange={(checked) =>
                              handleTogglePeriod(day.id, "morning", checked)
                            }
                          />
                        </div>
                        {config.weekAvailability[day.id].hours.morning ? (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Inicio</Label>
                              <Input
                                type="time"
                                value={
                                  config.weekAvailability[day.id].hours.morning
                                    ?.start || ""
                                }
                                onChange={(e) =>
                                  handleTimeChange(
                                    day.id,
                                    "morning",
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Fin</Label>
                              <Input
                                type="time"
                                value={
                                  config.weekAvailability[day.id].hours.morning
                                    ?.end || ""
                                }
                                onChange={(e) =>
                                  handleTimeChange(
                                    day.id,
                                    "morning",
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Cerrado
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Tarde</Label>
                          <Switch
                            checked={
                              !!config.weekAvailability[day.id].hours.afternoon
                            }
                            onCheckedChange={(checked) =>
                              handleTogglePeriod(day.id, "afternoon", checked)
                            }
                          />
                        </div>
                        {config.weekAvailability[day.id].hours.afternoon ? (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Inicio</Label>
                              <Input
                                type="time"
                                value={
                                  config.weekAvailability[day.id].hours
                                    .afternoon?.start || ""
                                }
                                onChange={(e) =>
                                  handleTimeChange(
                                    day.id,
                                    "afternoon",
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Fin</Label>
                              <Input
                                type="time"
                                value={
                                  config.weekAvailability[day.id].hours
                                    .afternoon?.end || ""
                                }
                                onChange={(e) =>
                                  handleTimeChange(
                                    day.id,
                                    "afternoon",
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Cerrado
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TabsContent>

          <TabsContent value="special_days" className="space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Agregar día especial</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="override-date">Fecha</Label>
                  <Input
                    id="override-date"
                    type="date"
                    value={newOverride.date}
                    onChange={(e) =>
                      setNewOverride({ ...newOverride, date: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="override-available"
                    checked={newOverride.available}
                    onCheckedChange={(checked) =>
                      setNewOverride({ ...newOverride, available: checked })
                    }
                  />
                  <Label htmlFor="override-available" className="flex-1">
                    {newOverride.available ? "Disponible" : "No disponible"}
                  </Label>
                </div>

                {newOverride.available && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Mañana
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Inicio</Label>
                          {/* <Input
                            type="time"
                            value={newOverride.hours?.morning?.start || ""}
                            onChange={(e) =>
                              setNewOverride({
                                ...newOverride,
                                hours: {
                                  ...newOverride.hours,
                                  morning: {
                                    ...newOverride.hours?.morning,
                                    start: e.target.value,
                                  } as any,
                                },
                              })
                            }
                            className="w-full"
                          /> */}

                          <Input
                            type="time"
                            value={newOverride.hours?.morning?.start || ""}
                            onChange={(e) =>
                              handleOverrideTimeChange("morning", "start", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fin</Label>
                          {/* <Input
                            type="time"
                            value={newOverride.hours?.morning?.end || ""}
                            onChange={(e) =>
                              setNewOverride({
                                ...newOverride,
                                hours: {
                                  ...newOverride.hours,
                                  morning: {
                                    ...newOverride.hours?.morning,
                                    end: e.target.value,
                                  } as any,
                                },
                              })
                            }
                            className="w-full"
                          /> */}
                           <Input
                            type="time"
                            value={newOverride.hours?.morning?.end || ""}
                            onChange={(e) =>
                              handleOverrideTimeChange("morning", "end", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Tarde
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Inicio</Label>
                          {/* <Input
                            type="time"
                            value={newOverride.hours?.afternoon?.start || ""}
                            onChange={(e) =>
                              setNewOverride({
                                ...newOverride,
                                hours: {
                                  ...newOverride.hours,
                                  afternoon: {
                                    ...newOverride.hours?.afternoon,
                                    start: e.target.value,
                                  } as any,
                                },
                              })
                            }
                            className="w-full"
                          /> */}
                           <Input
                            type="time"
                            value={newOverride.hours?.afternoon?.start || ""}
                            onChange={(e) =>
                              handleOverrideTimeChange("afternoon", "start", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fin</Label>
                          {/* <Input
                            type="time"
                            value={newOverride.hours?.afternoon?.end || ""}
                            onChange={(e) =>
                              setNewOverride({
                                ...newOverride,
                                hours: {
                                  ...newOverride.hours,
                                  afternoon: {
                                    ...newOverride.hours?.afternoon,
                                    end: e.target.value,
                                  } as any,
                                },
                              })
                            }
                            className="w-full"
                          /> */}
                          <Input
                            type="time"
                            value={newOverride.hours?.afternoon?.end || ""}
                            onChange={(e) =>
                              handleOverrideTimeChange("afternoon", "end", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddOverride}
                  className="w-full gap-2 mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar día especial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">
                  Días especiales configurados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {config.specificDateOverrides &&
                config.specificDateOverrides.length > 0 ? (
                  <div className="space-y-2">
                    {config.specificDateOverrides.map((override) => (
                      <div
                        key={override.date}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium truncate">
                              {override.date}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${override.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {override.available
                                ? "Disponible"
                                : "No disponible"}
                            </span>
                          </div>
                          {override.available && override.hours && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {override.hours.morning && (
                                <div>
                                  Mañana: {override.hours.morning.start} -{" "}
                                  {override.hours.morning.end}
                                </div>
                              )}
                              {override.hours.afternoon && (
                                <div>
                                  Tarde: {override.hours.afternoon.start} -{" "}
                                  {override.hours.afternoon.end}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOverride(override.date)}
                          className="ml-2 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No hay días especiales configurados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general_settings" className="space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Configuración General</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-3">
                  <Label htmlFor="min-notice" className="text-base">
                    Anticipación mínima para reservas (horas):
                  </Label>
                  <Input
                    id="min-notice"
                    type="number"
                    min="0"
                    value={config.minBookingNotice || 0}
                    onChange={(e) => handleMinNoticeChange(e.target.value)}
                    className="w-full max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Los clientes deberán reservar con al menos esta cantidad de
                    horas de anticipación.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={handleResetToDefault}
          disabled={isLoading}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar valores predeterminados
        </Button>
      </div>
    </>
  );
}

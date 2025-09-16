// import React, { useState, useMemo, useCallback } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//    ColumnDef as TanstackColumnDef ,
//   flexRender,
//   type FilterFn,
//   type ColumnFilter,
// } from "@tanstack/react-table";
// import { useDebounce } from "use-debounce";

// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Label } from "@/components/ui/label";




// interface TablaComponentProps<T> {
//   columns: TanstackColumnDef<T>[];
//   data: T[] | undefined;
//   filterableColumns: string[];
//   showNameFilter?: boolean;
 
// }


// const TablaComponent = <T,>({
//   columns,
//   data,
//   filterableColumns = [],
//   showNameFilter = true,
// }: TablaComponentProps<T>) => {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);
//   const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

//   // const customDebtFilterFn: FilterFn<T> = (row, columnId, filterValue) => {
//   //   const deuda = row.original.deuda;

//   //   switch (filterValue) {
//   //     case "withDebt":
//   //       return deuda > 0;
//   //     case "noDebt":
//   //       return deuda == 0;
//   //     default: // 'all'
//   //       return true;
//   //   }
//   // };
//   // Procesa las columnas para habilitar el filtrado en las columnas filtrables
//   const processedColumns = useMemo(() => {
//     return columns.map((col) => {
//       if (filterableColumns.includes(col.id as string)) {
//         return { ...col, enableColumnFilter: true };
//       }
//       if (col.id == "deuda") {
//         return {
//           ...col,
//           enableColumnFilter: true,
//           // filterFn: customDebtFilterFn,
//         };
//       }
//       return col;
//     });
//   }, [columns, filterableColumns]);

//   // Función de filtrado global
//   const globalFilterFn: FilterFn<T> = useCallback(
//     (row, columnId, filterValue) => {
//       const value = row.getValue(columnId);

//       return value != null
//         ? String(value)
//             .toLowerCase()
//             .includes(String(filterValue).toLowerCase())
//         : false;
//     },
//     []
//   );

//   const table = useReactTable({
//     data,
//     columns: processedColumns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       globalFilter: debouncedGlobalFilter,
//       columnFilters,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnFiltersChange: setColumnFilters,
//     globalFilterFn,
//     filterFns: {
//       fuzzy: globalFilterFn,
//       // customDebt: customDebtFilterFn, // Agrega la función de filtrado personalizado
//     },
//     filterFromLeafRows: true,
//   });

//   const handleGlobalFilterChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setGlobalFilter(e.target.value);
//     },
//     []
//   );

//   const handleColumnFilterChange = useCallback(
//     (columnId: string, value: string) => {
//       setColumnFilters((prev) => {
//         const updatedFilters = prev.filter((filter) => filter.id !== columnId);
//         return value === "all"
//           ? updatedFilters // Elimina el filtro si se selecciona "all"
//           : [...updatedFilters, { id: columnId, value }]; // Añade el filtro
//       });
//     },
//     []
//   );
 

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center mx-10">
//         <div className="flex flex-wrap gap-4">
//           {showNameFilter && (
//             <div className="flex flex-col justify-center gap-2">
//               <Label className="ml-3">Nombre</Label>
//               <Input
//                 placeholder="Buscar por nombre..."
//                 value={globalFilter ?? ""}
//                 onChange={handleGlobalFilterChange}
//                 className="max-w-sm"
//               />
//             </div>
//           )}



//           {filterableColumns.map((columnId) => {
//             const column = columns.find((col) => col.id === columnId);
//             if (!column) return null;

//             const currentFilter =
//               columnFilters.find((f) => f.id === columnId)?.value || "";

//             const uniqueValues = Array.from(
//               new Set(data.map((item) => String((item as any)[columnId])))
//             );

//             return (
//               <div
//                 className="flex flex-col justify-center gap-2"
//                 key={columnId}
//               >
//                 <Label className="ml-3">{column?.header}</Label>
//                 <Select
//                   onValueChange={(value) =>
//                     handleColumnFilterChange(columnId, value)
//                   }
//                   value={(currentFilter as string) || "all"} // "all" si no hay filtro
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder={`Filter by ${columnId}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem key="all" value="all">
//                       All
//                     </SelectItem>
//                     {uniqueValues.map((value) => (
//                       <SelectItem key={value} value={value}>
//                         {value}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             );
//           })}
//         </div>
        
//       </div>

//       <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
//         <Table className="border rounded-lg ">
//           <TableHeader className="bg-muted sticky top-0 z-2">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody className="**:data-[slot=table-cell]:first:w-8">
//             {table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id} >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           <ChevronLeft className="h-4 w-4" />
//           Anterior
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Siguiente
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default React.memo(TablaComponent);


import React, { useState, useMemo, useCallback, JSX } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef as TanstackColumnDef,
  flexRender,
  type FilterFn,
  type ColumnFilter,
  type RowData,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TablaComponentProps<T> {
  columns: TanstackColumnDef<T>[];
  data: T[] | undefined;
  filterableColumns: string[];
  showNameFilter?: boolean;
}


const TablaComponent = <T extends RowData>({
  columns,
  data = [],
  filterableColumns = [],
  showNameFilter = true,
}: TablaComponentProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  // Procesa las columnas para habilitar el filtrado en las columnas filtrables
  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      if (filterableColumns.includes(col.id as string)) {
        return { ...col, enableColumnFilter: true };
      }
      return col;
    });
  }, [columns, filterableColumns]);

  // Función de filtrado global
  const globalFilterFn: FilterFn<T> = useCallback(
    (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return value != null
        ? String(value)
            .toLowerCase()
            .includes(String(filterValue).toLowerCase())
        : false;
    },
    []
  );

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: debouncedGlobalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
    filterFns: {
      fuzzy: globalFilterFn,
    },
    filterFromLeafRows: true,
  });

  const handleGlobalFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(e.target.value);
    },
    []
  );

  const handleColumnFilterChange = useCallback(
    (columnId: string, value: string) => {
      setColumnFilters((prev) => {
        const updatedFilters = prev.filter((filter) => filter.id !== columnId);
        return value === "all"
          ? updatedFilters
          : [...updatedFilters, { id: columnId, value }];
      });
    },
    []
  );

  // Obtener valores únicos para cada columna filtrable
  const getUniqueValues = useCallback((columnId: string): string[] => {
    const values = data
      .map((item) => {
        // Acceso seguro a la propiedad usando type assertion más segura
        const value = (item as Record<string, unknown>)[columnId];
        return value != null ? String(value) : "";
      })
      .filter((value) => value !== "");
    
    return Array.from(new Set(values)).sort();
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mx-10">
        <div className="flex flex-wrap gap-4">
          {showNameFilter && (
            <div className="flex flex-col justify-center gap-2">
              <Label className="ml-3">Nombre</Label>
              <Input
                placeholder="Buscar por nombre..."
                value={globalFilter ?? ""}
                onChange={handleGlobalFilterChange}
                className="max-w-sm"
              />
            </div>
          )}

          {filterableColumns.map((columnId) => {
            const column = columns.find((col) => col.id === columnId);
            if (!column) return null;

            const currentFilter =
              columnFilters.find((f) => f.id === columnId)?.value || "";

            const uniqueValues = getUniqueValues(columnId);

            return (
              <div
                className="flex flex-col justify-center gap-2"
                key={columnId}
              >
                <Label className="ml-3">{String(column.header)}</Label>
                <Select
                  onValueChange={(value) =>
                    handleColumnFilterChange(columnId, value)
                  }
                  value={(currentFilter as string) || "all"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Filtrar por ${String(column.header)}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">
                      Todos
                    </SelectItem>
                    {uniqueValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <Table className="border rounded-lg ">
          <TableHeader className="bg-muted sticky top-0 z-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(TablaComponent) as <T extends RowData>(
  props: TablaComponentProps<T>
) => JSX.Element;
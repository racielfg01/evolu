// "use client"

// import * as React from "react"
// import {
//   closestCenter,
//   DndContext,
//   KeyboardSensor,
//   MouseSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type UniqueIdentifier,
// } from "@dnd-kit/core"
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   // IconDotsVertical,
//   IconGripVertical,
//   IconLayoutColumns,
//   // IconPlus,
//   IconSearch,
// } from "@tabler/icons-react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   Row,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table"
// // import { toast } from "sonner"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// interface ReusableDataTableProps<TData> {
//   data: TData[]
//   columns: ColumnDef<TData>[]
//   defaultPageSize?: number
//   enableRowSelection?: boolean
//   enableSorting?: boolean
//   enableColumnResizing?: boolean
//   enableMultiSort?: boolean
//   enableDragAndDrop?: boolean
//   onRowSelectionChange?: (selectedRows: TData[]) => void
//   onDataChange?: (newData: TData[]) => void
//   renderSubComponent?: (row: Row<TData>) => React.ReactNode
//   toolbar?: React.ReactNode
//   noDataText?: string
//   searchPlaceholder?: string
//   addButtonText?: string
// }

// function DragHandle<TData extends { id: number | string }>({ id }: { id: TData['id'] }) {
//   const { attributes, listeners } = useSortable({
//     id: id.toString(),
//   })

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="text-muted-foreground size-7 hover:bg-transparent"
//     >
//       <IconGripVertical className="text-muted-foreground size-3" />
//       <span className="sr-only">Arrastrar para reordenar</span>
//     </Button>
//   )
// }

// function DraggableRow<TData>({
//   row,
//   enableDragAndDrop
// }: {
//   row: Row<TData>
//   enableDragAndDrop: boolean
// }) {
//   const { transform, transition, setNodeRef, isDragging } = useSortable({
//     id: row.id,
//   })
//   console.log(enableDragAndDrop)

//   return (
//     <TableRow
//       data-state={row.getIsSelected() && "selected"}
//       data-dragging={isDragging}
//       ref={setNodeRef}
//       className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition: transition,
//       }}
//     >
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   )
// }

// export function ReusableDataTable<TData extends { id: number | string }>({
//   data: initialData,
//   columns: baseColumns,
//   defaultPageSize = 10,
//   enableRowSelection = true,
//   enableSorting = true,
//   enableDragAndDrop = false,
//   onRowSelectionChange,
//   onDataChange,
//   renderSubComponent,
//   toolbar,
//   noDataText = "No se encontraron resultados",
//   searchPlaceholder = "Buscar en todos los campos...",
//   // addButtonText = "Agregar nuevo",
// }: ReusableDataTableProps<TData>) {
//   const [data, setData] = React.useState(initialData)
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [globalFilter, setGlobalFilter] = React.useState('')
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: defaultPageSize,
//   })

//   React.useEffect(() => {
//   setData(initialData);
// }, [initialData]);

//   const sortableId = React.useId()
//   const sensors = useSensors(
//     useSensor(MouseSensor, {}),
//     useSensor(TouchSensor, {}),
//     useSensor(KeyboardSensor, {})
//   )

//   // Add selection and drag handle columns if needed
//   const columns = React.useMemo(() => {
//     const cols = [...baseColumns]

//     if (enableRowSelection) {
//       cols.unshift({
//         id: "select",
//         header: ({ table }) => (
//           <div className="flex items-center justify-center">
//             <Checkbox
//               checked={
//                 table.getIsAllPageRowsSelected() ||
//                 (table.getIsSomePageRowsSelected() && "indeterminate")
//               }
//               onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//               aria-label="Seleccionar todos"
//             />
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="flex items-center justify-center">
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               aria-label={`Seleccionar fila ${row.id}`}
//             />
//           </div>
//         ),
//         size: 40,
//       })
//     }

//     if (enableDragAndDrop) {
//       cols.unshift({
//         id: "drag",
//         header: () => null,
//         cell: ({ row }) => <DragHandle id={row.original.id} />,
//         size: 40,
//       })
//     }

//     return cols
//   }, [baseColumns, enableDragAndDrop, enableRowSelection])

//   const dataIds = React.useMemo<UniqueIdentifier[]>(
//     () => data?.map(({ id }) => id.toString()) || [],
//     [data]
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       globalFilter,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection,
//     onRowSelectionChange: (updater) => {
//       setRowSelection(updater)
//       if (onRowSelectionChange) {
//         const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
//         onRowSelectionChange(selectedRows)
//       }
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   function handleDragEnd(event: DragEndEvent) {
//     if (!enableDragAndDrop) return

//     const { active, over } = event
//     if (active && over && active.id !== over.id) {
//       setData((currentData) => {
//         const oldIndex = dataIds.indexOf(active.id)
//         const newIndex = dataIds.indexOf(over.id)
//         const newData = arrayMove(currentData, oldIndex, newIndex)

//         if (onDataChange) {
//           onDataChange(newData)
//         }

//         return newData
//       })
//     }
//   }

//   return (
//     <div className="w-full flex-col justify-start gap-4">
//       {/* Barra superior con filtro y botones */}
//       <div className="flex flex-col gap-4 px-4 lg:px-6">
//         {/* Filtro global */}
//         <div className="flex w-full items-center gap-4">
//           <div className="relative flex-1">
//             <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
//             <Input
//               placeholder={searchPlaceholder}
//               className="pl-9"
//               value={globalFilter ?? ''}
//               onChange={(event) => setGlobalFilter(event.target.value)}
//             />
//           </div>
//           {toolbar}
//         </div>

//         {/* Controles de columnas y acciones */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <IconLayoutColumns className="mr-2 size-4" />
//                   Columnas
//                   <IconChevronDown className="ml-2 size-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem
//                   onClick={() => table.resetColumnVisibility()}
//                   disabled={Object.keys(columnVisibility).length === 0}
//                 >
//                   Restablecer visibilidad
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 {table
//                   .getAllColumns()
//                   .filter(
//                     (column) =>
//                       typeof column.accessorFn !== "undefined" &&
//                       column.getCanHide()
//                   )
//                   .map((column) => {
//                     return (
//                       <DropdownMenuCheckboxItem
//                         key={column.id}
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) =>
//                           column.toggleVisibility(!!value)
//                         }
//                       >
//                         {column.id}
//                       </DropdownMenuCheckboxItem>
//                     )
//                   })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           {/* <Button size="sm">
//             <IconPlus className="mr-2 size-4" />
//             {addButtonText}
//           </Button> */}
//         </div>
//       </div>

//       {/* Tabla */}
//       <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
//         <div className="overflow-hidden rounded-lg border">
//           {enableDragAndDrop ? (
//             <DndContext
//               collisionDetection={closestCenter}
//               modifiers={[restrictToVerticalAxis]}
//               onDragEnd={handleDragEnd}
//               sensors={sensors}
//               id={sortableId}
//             >
//               <SortableContext
//                 items={dataIds}
//                 strategy={verticalListSortingStrategy}
//               >
//                 <Table>
//                   <TableHeader className="bg-muted sticky top-0 z-10">
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <TableRow key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => (
//                           <TableHead key={header.id} colSpan={header.colSpan}>
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableHeader>
//                   <TableBody>
//                     {table.getRowModel().rows?.length ? (
//                       <>
//                         {table.getRowModel().rows.map((row) => (
//                           <React.Fragment key={row.id}>
//                             <DraggableRow
//                               row={row}
//                               enableDragAndDrop={enableDragAndDrop}
//                             />
//                             {renderSubComponent && row.getIsExpanded() && (
//                               <TableRow>
//                                 <TableCell colSpan={row.getVisibleCells().length}>
//                                   {renderSubComponent(row)}
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </React.Fragment>
//                         ))}
//                       </>
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={columns.length}
//                           className="h-24 text-center"
//                         >
//                           {noDataText}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </SortableContext>
//             </DndContext>
//           ) : (
//             <Table>
//               <TableHeader className="bg-muted sticky top-0 z-10">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id} colSpan={header.colSpan}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   <>
//                     {table.getRowModel().rows.map((row) => (
//                       <React.Fragment key={row.id}>
//                         <TableRow data-state={row.getIsSelected() && "selected"}>
//                           {row.getVisibleCells().map((cell) => (
//                             <TableCell key={cell.id}>
//                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                         {renderSubComponent && row.getIsExpanded() && (
//                           <TableRow>
//                             <TableCell colSpan={row.getVisibleCells().length}>
//                               {renderSubComponent(row)}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </>
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       {noDataText}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </div>

//         {/* Paginación */}
//         <div className="flex items-center justify-between px-4">
//           <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//             {table.getFilteredSelectedRowModel().rows.length} de{" "}
//             {table.getFilteredRowModel().rows.length} fila(s) seleccionadas
//           </div>
//           <div className="flex w-full items-center gap-8 lg:w-fit">
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Filas por página
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => {
//                   table.setPageSize(Number(value))
//                 }}
//               >
//                 <SelectTrigger className="w-20" id="rows-per-page">
//                   <SelectValue
//                     placeholder={table.getState().pagination.pageSize}
//                   />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex w-fit items-center justify-center text-sm font-medium">
//               Página {table.getState().pagination.pageIndex + 1} de{" "}
//               {table.getPageCount()}
//             </div>
//             <div className="ml-auto flex items-center gap-2 lg:ml-0">
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Primera página"
//               >
//                 <IconChevronsLeft className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Página anterior"
//               >
//                 <IconChevronLeft className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Página siguiente"
//               >
//                 <IconChevronRight className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="hidden size-8 lg:flex"
//                 size="icon"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Última página"
//               >
//                 <IconChevronsRight className="size-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// "use client";

// import * as React from "react";
// import {
//   closestCenter,
//   DndContext,
//   KeyboardSensor,
//   MouseSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type UniqueIdentifier,
// } from "@dnd-kit/core";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   IconGripVertical,
//   IconLayoutColumns,
//   IconSearch,
// } from "@tabler/icons-react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   Row,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface ReusableDataTableProps<TData> {
//   data: TData[];
//   columns: ColumnDef<TData>[];
//   defaultPageSize?: number;
//   enableRowSelection?: boolean;
//   enableSorting?: boolean;
//   enableColumnResizing?: boolean;
//   enableMultiSort?: boolean;
//   enableDragAndDrop?: boolean;
//   onRowSelectionChange?: (selectedRows: TData[]) => void;
//   onDataChange?: (newData: TData[]) => void;
//   renderSubComponent?: (row: Row<TData>) => React.ReactNode;
//   toolbar?: React.ReactNode;
//   noDataText?: string;
//   searchPlaceholder?: string;
//   addButtonText?: string;
// }

// function DragHandle<TData extends { id: number | string }>({
//   id,
// }: {
//   id: TData["id"];
// }) {
//   const { attributes, listeners } = useSortable({
//     id: id.toString(),
//   });

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="text-muted-foreground size-7 hover:bg-transparent"
//     >
//       <IconGripVertical className="text-muted-foreground size-3" />
//       <span className="sr-only">Arrastrar para reordenar</span>
//     </Button>
//   );
// }

// function DraggableRow<TData>({
//   row,
//   // enableDragAndDrop
// }: {
//   row: Row<TData>;
//   enableDragAndDrop: boolean;
// }) {
//   const { transform, transition, setNodeRef, isDragging } = useSortable({
//     id: row.id,
//   });

//   return (
//     <TableRow
//       data-state={row.getIsSelected() && "selected"}
//       data-dragging={isDragging}
//       ref={setNodeRef}
//       className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition: transition,
//       }}
//     >
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// }

// export function ReusableDataTable<TData extends { id: number | string }>({
//   data: initialData,
//   columns: baseColumns,
//   defaultPageSize = 10,
//   enableRowSelection = true,
//   enableSorting = true,
//   enableDragAndDrop = false,
//   onRowSelectionChange,
//   onDataChange,
//   renderSubComponent,
//   toolbar,
//   noDataText = "No se encontraron resultados",
//   searchPlaceholder = "Buscar en todos los campos...",
// }: ReusableDataTableProps<TData>) {
//   const [data, setData] = React.useState(initialData);
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: defaultPageSize,
//   });

//   React.useEffect(() => {
//     setData(initialData);
//   }, [initialData]);

//   const sortableId = React.useId();
//   const sensors = useSensors(
//     useSensor(MouseSensor, {}),
//     useSensor(TouchSensor, {}),
//     useSensor(KeyboardSensor, {})
//   );

//   // Función para determinar si una columna debe mostrarse en móvil
//   const isMobileColumn = (columnId: string): boolean => {
//     // En móvil solo mostramos las columnas "name" y "actions"
//     return (
//       columnId === "name" ||
//       columnId === "actions" ||
//       columnId === "select" ||
//       columnId === "drag"
//     );
//   };

//   // Add selection and drag handle columns if needed
//   const columns = React.useMemo(() => {
//     const cols = [...baseColumns];

//     if (enableRowSelection) {
//       cols.unshift({
//         id: "select",
//         header: ({ table }) => (
//           <div className="flex items-center justify-center">
//             <Checkbox
//               checked={
//                 table.getIsAllPageRowsSelected() ||
//                 (table.getIsSomePageRowsSelected() && "indeterminate")
//               }
//               onCheckedChange={(value) =>
//                 table.toggleAllPageRowsSelected(!!value)
//               }
//               aria-label="Seleccionar todos"
//             />
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="flex items-center justify-center">
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               aria-label={`Seleccionar fila ${row.id}`}
//             />
//           </div>
//         ),
//         size: 40,
//       });
//     }

//     if (enableDragAndDrop) {
//       cols.unshift({
//         id: "drag",
//         header: () => null,
//         cell: ({ row }) => <DragHandle id={row.original.id} />,
//         size: 40,
//       });
//     }

//     return cols;
//   }, [baseColumns, enableDragAndDrop, enableRowSelection]);

//   const dataIds = React.useMemo<UniqueIdentifier[]>(
//     () => data?.map(({ id }) => id.toString()) || [],
//     [data]
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       globalFilter,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection,
//     onRowSelectionChange: (updater) => {
//       setRowSelection(updater);
//       if (onRowSelectionChange) {
//         const selectedRows = table
//           .getSelectedRowModel()
//           .rows.map((row) => row.original);
//         onRowSelectionChange(selectedRows);
//       }
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   });

//   // Efecto para ocultar automáticamente columnas no móviles en pantallas pequeñas
//   React.useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         // md breakpoint
//         const newVisibility: VisibilityState = {};
//         table.getAllColumns().forEach((column) => {
//           newVisibility[column.id] = isMobileColumn(column.id);
//         });
//         setColumnVisibility(newVisibility);
//       } else {
//         // En pantallas grandes, mostrar todas las columnas
//         setColumnVisibility({});
//       }
//     };

//     // Ejecutar al montar y al redimensionar
//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, [table, columns]);

//   function handleDragEnd(event: DragEndEvent) {
//     if (!enableDragAndDrop) return;

//     const { active, over } = event;
//     if (active && over && active.id !== over.id) {
//       setData((currentData) => {
//         const oldIndex = dataIds.indexOf(active.id);
//         const newIndex = dataIds.indexOf(over.id);
//         const newData = arrayMove(currentData, oldIndex, newIndex);

//         if (onDataChange) {
//           onDataChange(newData);
//         }

//         return newData;
//       });
//     }
//   }

//   return (
//     <div className="w-full flex-col justify-start gap-4">
//       {/* Barra superior con filtro y botones */}
//       <div className="flex flex-col gap-4 px-4 lg:px-6">
//         {/* Filtro global */}
//         <div className="flex w-full items-center gap-4 my-4">
//           <div className="relative flex-1">
//             <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
//             <Input
//               placeholder={searchPlaceholder}
//               className="pl-9"
//               value={globalFilter ?? ""}
//               onChange={(event) => setGlobalFilter(event.target.value)}
//             />
//           </div>
//           {toolbar}
//         </div>

//         {/* Controles de columnas y acciones - Oculto en móvil para simplificar */}
//         <div className="hidden md:flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <IconLayoutColumns className="mr-2 size-4" />
//                   Columnas
//                   <IconChevronDown className="ml-2 size-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem
//                   onClick={() => table.resetColumnVisibility()}
//                   disabled={Object.keys(columnVisibility).length === 0}
//                 >
//                   Restablecer visibilidad
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 {table
//                   .getAllColumns()
//                   .filter(
//                     (column) =>
//                       typeof column.accessorFn !== "undefined" &&
//                       column.getCanHide()
//                   )
//                   .map((column) => {
//                     return (
//                       <DropdownMenuCheckboxItem
//                         key={column.id}
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) =>
//                           column.toggleVisibility(!!value)
//                         }
//                       >
//                         {column.id}
//                       </DropdownMenuCheckboxItem>
//                     );
//                   })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>

//       {/* Tabla */}
//       <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
//         <div className="overflow-hidden rounded-lg border">
//           {enableDragAndDrop ? (
//             <DndContext
//               collisionDetection={closestCenter}
//               modifiers={[restrictToVerticalAxis]}
//               onDragEnd={handleDragEnd}
//               sensors={sensors}
//               id={sortableId}
//             >
//               <SortableContext
//                 items={dataIds}
//                 strategy={verticalListSortingStrategy}
//               >
//                 <Table>
//                   {/* <TableHeader className="bg-muted sticky top-0 z-10">
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <TableRow key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => (
//                           <TableHead 
//                             key={header.id} 
//                             colSpan={header.colSpan}
//                             className="hidden md:table-cell" // Ocultar encabezados no móviles
//                           >
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableHeader> */}

//                   <TableHeader className="bg-muted sticky top-0 z-10">
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <TableRow key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => (
//                           <TableHead
//                             key={header.id}
//                             colSpan={header.colSpan}
//                             // className={
//                             //   isMobileColumn(header.column.id)
//                             //     ? "hidden md:table-cell"
//                             //     : ""
//                             // }
//                           >
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableHeader>
//                   <TableBody>
//                     {table.getRowModel().rows?.length ? (
//                       <>
//                         {table.getRowModel().rows.map((row) => (
//                           <React.Fragment key={row.id}>
//                             <DraggableRow
//                               row={row}
//                               enableDragAndDrop={enableDragAndDrop}
//                             />
//                             {renderSubComponent && row.getIsExpanded() && (
//                               <TableRow>
//                                 <TableCell
//                                   colSpan={row.getVisibleCells().length}
//                                 >
//                                   {renderSubComponent(row)}
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </React.Fragment>
//                         ))}
//                       </>
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={columns.length}
//                           className="h-24 text-center"
//                         >
//                           {noDataText}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </SortableContext>
//             </DndContext>
//           ) : (
//             <Table>
//               <TableHeader className="bg-muted sticky top-0 z-10 hidden md:table-header-group">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead
//                         key={header.id}
//                         colSpan={header.colSpan}
//                         className={
//                           !isMobileColumn(header.column.id)
//                             ? "hidden md:table-cell"
//                             : ""
//                         }
//                       >
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   <>
//                     {table.getRowModel().rows.map((row) => (
//                       <React.Fragment key={row.id}>
//                         <TableRow
//                           data-state={row.getIsSelected() && "selected"}
//                         >
//                           {row.getVisibleCells().map((cell) => (
//                             <TableCell
//                               key={cell.id}
//                               className={
//                                 !isMobileColumn(cell.column.id)
//                                   ? "hidden md:table-cell"
//                                   : ""
//                               }
//                             >
//                               {flexRender(
//                                 cell.column.columnDef.cell,
//                                 cell.getContext()
//                               )}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                         {renderSubComponent && row.getIsExpanded() && (
//                           <TableRow>
//                             <TableCell colSpan={row.getVisibleCells().length}>
//                               {renderSubComponent(row)}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </>
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       {noDataText}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </div>

//         {/* Paginación */}
//         <div className="flex flex-col gap-4 items-center justify-between px-4 md:flex-row">
//           <div className="text-muted-foreground text-sm md:flex-1 hidden md:block">
//             {table.getFilteredSelectedRowModel().rows.length} de{" "}
//             {table.getFilteredRowModel().rows.length} fila(s) seleccionadas
//           </div>
//           <div className="flex flex-col gap-4 w-full items-center md:flex-row md:w-fit md:gap-8">
//             <div className="hidden items-center gap-2 md:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Filas por página
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => {
//                   table.setPageSize(Number(value));
//                 }}
//               >
//                 <SelectTrigger className="w-20" id="rows-per-page">
//                   <SelectValue
//                     placeholder={table.getState().pagination.pageSize}
//                   />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex w-fit items-center justify-center text-sm font-medium">
//               Página {table.getState().pagination.pageIndex + 1} de{" "}
//               {table.getPageCount()}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 md:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Primera página"
//               >
//                 <IconChevronsLeft className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Página anterior"
//               >
//                 <IconChevronLeft className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Página siguiente"
//               >
//                 <IconChevronRight className="size-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="hidden size-8 md:flex"
//                 size="icon"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Última página"
//               >
//                 <IconChevronsRight className="size-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconSearch,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ReusableDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  defaultPageSize?: number
  enableRowSelection?: boolean
  enableSorting?: boolean
  enableColumnResizing?: boolean
  enableMultiSort?: boolean
  enableDragAndDrop?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  onDataChange?: (newData: TData[]) => void
  renderSubComponent?: (row: Row<TData>) => React.ReactNode
  toolbar?: React.ReactNode
  noDataText?: string
  searchPlaceholder?: string
  addButtonText?: string
}

function DragHandle<TData extends { id: number | string }>({ id }: { id: TData['id'] }) {
  const { attributes, listeners } = useSortable({
    id: id.toString(),
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Arrastrar para reordenar</span>
    </Button>
  )
}

function DraggableRow<TData>({ 
  row, 
  // enableDragAndDrop 
}: { 
  row: Row<TData>
  enableDragAndDrop: boolean
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function ReusableDataTable<TData extends { id: number | string }>({
  data: initialData,
  columns: baseColumns,
  defaultPageSize = 10,
  enableRowSelection = true,
  enableSorting = true,
  enableDragAndDrop = false,
  onRowSelectionChange,
  onDataChange,
  renderSubComponent,
  toolbar,
  noDataText = "No se encontraron resultados",
  searchPlaceholder = "Buscar en todos los campos...",
}: ReusableDataTableProps<TData>) {
  const [data, setData] = React.useState(initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Función para determinar si una columna debe mostrarse en móvil
  const isMobileColumn = (columnId: string): boolean => {
    // En móvil solo mostramos las columnas "name" y "actions"
    return columnId === "name" || columnId === "actions" || 
           columnId === "select" || columnId === "drag";
  }

  // Add selection and drag handle columns if needed
  const columns = React.useMemo(() => {
    const cols = [...baseColumns]

    if (enableRowSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Seleccionar todos"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Seleccionar fila ${row.id}`}
            />
          </div>
        ),
        size: 40,
      })
    }

    if (enableDragAndDrop) {
      cols.unshift({
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
        size: 40,
      })
    }

    return cols
  }, [baseColumns, enableDragAndDrop, enableRowSelection])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id.toString()) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater)
      if (onRowSelectionChange) {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
        onRowSelectionChange(selectedRows)
      }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Efecto para ocultar automáticamente columnas no móviles en pantallas pequeñas
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        const newVisibility: VisibilityState = {};
        table.getAllColumns().forEach(column => {
          newVisibility[column.id] = isMobileColumn(column.id);
        });
        setColumnVisibility(newVisibility);
      } else {
        // En pantallas grandes, mostrar todas las columnas
        setColumnVisibility({});
      }
    };

    // Ejecutar al montar y al redimensionar
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [table, columns]);

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return
    
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        const newData = arrayMove(currentData, oldIndex, newIndex)
        
        if (onDataChange) {
          onDataChange(newData)
        }
        
        return newData
      })
    }
  }

  return (
    <div className="w-full flex-col justify-start gap-4">
      {/* Barra superior con filtro y botones */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        {/* Filtro global */}
        <div className="flex w-full items-center gap-4 mb-4">
          <div className="relative flex-1">
            <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
          </div>
          {toolbar}
        </div>

        {/* Controles de columnas y acciones - Oculto en móvil para simplificar */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns className="mr-2 size-4" />
                  Columnas
                  <IconChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => table.resetColumnVisibility()}
                  disabled={Object.keys(columnVisibility).length === 0}
                >
                  Restablecer visibilidad
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {enableDragAndDrop ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <TableHeader className="bg-muted sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead 
                            key={header.id} 
                            colSpan={header.colSpan}
                            className={!isMobileColumn(header.column.id) ? "hidden md:table-cell" : ""}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      <>
                        {table.getRowModel().rows.map((row) => (
                          <React.Fragment key={row.id}>
                            <DraggableRow 
                              row={row} 
                              enableDragAndDrop={enableDragAndDrop} 
                            />
                            {renderSubComponent && row.getIsExpanded() && (
                              <TableRow>
                                <TableCell colSpan={row.getVisibleCells().length}>
                                  {renderSubComponent(row)}
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          {noDataText}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          ) : (
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        colSpan={header.colSpan}
                        className={!isMobileColumn(header.column.id) ? "hidden md:table-cell" : ""}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow data-state={row.getIsSelected() && "selected"}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell 
                              key={cell.id}
                              className={!isMobileColumn(cell.column.id) ? "hidden md:table-cell" : ""}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {renderSubComponent && row.getIsExpanded() && (
                          <TableRow>
                            <TableCell colSpan={row.getVisibleCells().length}>
                              {renderSubComponent(row)}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {noDataText}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Paginación */}
        <div className="flex flex-col gap-4 items-center justify-between px-4 md:flex-row">
          <div className="text-muted-foreground text-sm md:flex-1 hidden md:block">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas
          </div>
          <div className="flex flex-col gap-4 w-full items-center md:flex-row md:w-fit md:gap-8">
            <div className="hidden items-center gap-2 md:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Filas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 md:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="Primera página"
              >
                <IconChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Página anterior"
              >
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Página siguiente"
              >
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 md:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Última página"
              >
                <IconChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
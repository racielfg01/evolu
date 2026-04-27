// 'use client'

// import { type ReactNode, createContext, useRef, useContext } from 'react'
// import { type StoreApi, useStore } from 'zustand'
// import { useSidebarStore, type SidebarState } from '@/stores/sidebar-store'

// export const SidebarStoreContext = createContext<StoreApi<SidebarState> | null>(null)

// export interface SidebarStoreProviderProps {
//   children: ReactNode
// }

// export const SidebarStoreProvider = ({ children }: SidebarStoreProviderProps) => {
//   const storeRef = useRef<StoreApi<SidebarState>>()
//   if (!storeRef.current) {
//     storeRef.current = useSidebarStore()
//   }

//   return (
//     <SidebarStoreContext.Provider value={storeRef.current}>
//       {children}
//     </SidebarStoreContext.Provider>
//   )
// }

// export const useSidebarStoreContext = <T,>(selector: (store: SidebarState) => T): T => {
//   const sidebarStoreContext = useContext(SidebarStoreContext)

//   if (!sidebarStoreContext) {
//     throw new Error(`useSidebarStoreContext must be used within SidebarStoreProvider`)
//   }

//   return useStore(sidebarStoreContext, selector)
// }
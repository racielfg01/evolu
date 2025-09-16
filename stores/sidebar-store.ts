import { create } from 'zustand'

export type SidebarState = {
  isCollapsed: boolean
  activeView: string
  toggleCollapse: () => void
  setActiveView: (view: string) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  activeView: 'dashboard', // Vista por defecto
  
  toggleCollapse: () => set((state) => ({ 
    isCollapsed: !state.isCollapsed 
  })),
  
  setActiveView: (view) => set({ activeView: view }),
}))
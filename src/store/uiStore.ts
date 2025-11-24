import { create } from 'zustand'

interface UIStore {
    sidebarOpen: boolean
    aiPanelOpen: boolean

    toggleSidebar: () => void
    toggleAIPanel: () => void
    setAIPanelOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
    sidebarOpen: true,
    aiPanelOpen: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
    setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
}))

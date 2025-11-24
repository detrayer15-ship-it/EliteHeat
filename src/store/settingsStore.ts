import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
    theme: 'light' | 'dark'
    language: 'ru' | 'en'
    setTheme: (theme: 'light' | 'dark') => void
    setLanguage: (language: 'ru' | 'en') => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'light',
            language: 'ru',
            setTheme: (theme) => {
                set({ theme })
                // Apply theme to document
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            },
            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'settings-storage',
        }
    )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
    theme: 'light' | 'dark'
    language: 'ru' | 'en' | 'kz'
    uiScale: 0.9 | 1 | 1.1 | 1.2
    fontFamily: 'inter' | 'system' | 'mono'
    setTheme: (theme: 'light' | 'dark') => void
    setLanguage: (language: 'ru' | 'en' | 'kz') => void
    setUiScale: (uiScale: SettingsState['uiScale']) => void
    setFontFamily: (fontFamily: SettingsState['fontFamily']) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'light',
            language: 'ru',
            uiScale: 1,
            fontFamily: 'inter',
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
            setUiScale: (uiScale) => set({ uiScale }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
        }),
        {
            name: 'settings-storage',
        }
    )
)

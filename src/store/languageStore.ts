import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'ru' | 'en'

interface LanguageState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'ru',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'language-storage',
        }
    )
)

import { useSettingsStore } from '@/store/settingsStore'
import { translations } from './translations'

export const useTranslation = () => {
    const language = useSettingsStore((state) => state.language)

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[language]

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k]
            } else {
                return key // Return key if translation not found
            }
        }

        return typeof value === 'string' ? value : key
    }

    return { t, language }
}

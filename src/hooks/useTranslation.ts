import { useLanguageStore } from '@/store/languageStore'
import { translations } from '@/i18n/translations'

export const useTranslation = () => {
    const language = useLanguageStore((state) => state.language)

    const t = translations[language]

    return { t, language }
}

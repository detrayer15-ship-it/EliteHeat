import { useLanguageStore } from '@/store/languageStore'
import { translations, TranslationKey } from '@/utils/translations'

export const useTranslation = () => {
    const { language, setLanguage } = useLanguageStore()

    const t = (key: TranslationKey) => {
        return translations[language][key] || translations['ru'][key]
    }

    return { t, language, setLanguage }
}

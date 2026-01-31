# Инструкция по исправлению синхронизации аудио и текста

## Проблема
Аудио играет правильно, но текст "Привет, я Мита" не меняется на "Как тебя зовут?" вовремя.

## Решение

Откройте файл `src/pages/AIAssistantPage.tsx` и найдите строки 177-199 (useEffect для welcomeStep === 'greeting').

Замените весь блок на:

```tsx
useEffect(() => {
    if (welcomeStep === 'greeting' && voiceEnabled) {
        const startFlow = async () => {
            try {
                // Play "Привет, я Мита" audio
                setIsSpeaking(true)
                await voiceService.playGreeting()
                setIsSpeaking(false)
                
                // Wait 1 second, then change text and play second audio
                setTimeout(async () => {
                    setWelcomeStep('name-question')
                    
                    // Play "Как тебя зовут?" audio
                    try {
                        setIsSpeaking(true)
                        await voiceService.playAskName()
                        setIsSpeaking(false)
                    } catch (error) {
                        setIsSpeaking(false)
                    }
                }, 1000)
            } catch (error) { 
                setIsSpeaking(false)
                setTimeout(() => {
                    setWelcomeStep('name-question')
                }, 2000)
            }
        }
        startFlow()
    } else if (welcomeStep === 'greeting' && !voiceEnabled) {
        setTimeout(() => {
            setWelcomeStep('name-question')
        }, 2000)
    }
}, [welcomeStep, voiceEnabled])
```

## Что это исправит
1. Аудио "Привет, я Мита" играет с текстом "Привет, я Мита"
2. Через 1 секунду текст меняется на "Как тебя зовут?" И СРАЗУ играет соответствующее аудио
3. Идеальная синхронизация!

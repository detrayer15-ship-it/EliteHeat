import { useState, useEffect } from 'react'

interface TypewriterProps {
    texts: string[]
    speed?: number
    deleteSpeed?: number
    pauseTime?: number
    className?: string
}

export const Typewriter = ({
    texts,
    speed = 100,
    deleteSpeed = 50,
    pauseTime = 2000,
    className = ''
}: TypewriterProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fullText = texts[currentTextIndex]

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    // Печатаем текст
                    if (currentText.length < fullText.length) {
                        setCurrentText(fullText.slice(0, currentText.length + 1))
                    } else {
                        // Текст напечатан, ждем и начинаем удалять
                        setTimeout(() => setIsDeleting(true), pauseTime)
                    }
                } else {
                    // Удаляем текст
                    if (currentText.length > 0) {
                        setCurrentText(currentText.slice(0, -1))
                    } else {
                        // Текст удален, переходим к следующему
                        setIsDeleting(false)
                        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
                    }
                }
            },
            isDeleting ? deleteSpeed : speed
        )

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime])

    return (
        <span className={className}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    )
}

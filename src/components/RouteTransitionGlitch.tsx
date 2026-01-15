import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAudioStore } from '@/store/audioStore'

export const RouteTransitionGlitch = () => {
    const location = useLocation()
    const { triggerGlitch, isMitaMode } = useAudioStore()

    useEffect(() => {
        // Trigger a glitch on every route change, more frequently in Mita Mode
        if (isMitaMode || Math.random() > 0.7) {
            triggerGlitch()
        }
    }, [location.pathname])

    return null
}

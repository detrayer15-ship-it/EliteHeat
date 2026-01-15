import { useEffect } from 'react'
import { useAudioStore, audioService } from '@/store/audioStore'

export const AudioManager = () => {
    const { isPlaying, volume, isGlitched } = useAudioStore()

    useEffect(() => {
        if (isPlaying) {
            audioService.startBGM(volume)
        } else {
            audioService.stopBGM()
        }
    }, [isPlaying])

    useEffect(() => {
        audioService.setVolume(volume)
    }, [volume])

    useEffect(() => {
        audioService.applyDistortion(isGlitched)
        if (isGlitched) {
            audioService.playGlitch()
        }
    }, [isGlitched])

    return null // Controller component
}

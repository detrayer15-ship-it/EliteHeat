import { create } from 'zustand'

interface AudioState {
    isPlaying: boolean
    volume: number
    isGlitched: boolean
    setPlaying: (playing: boolean) => void
    setVolume: (volume: number) => void
    setGlitched: (glitched: boolean) => void
    triggerGlitch: () => void
}

export const useAudioStore = create<AudioState>((set) => ({
    isPlaying: false,
    volume: 0.3,
    isGlitched: false,
    setPlaying: (playing) => set({ isPlaying: playing }),
    setVolume: (volume) => set({ volume }),
    setGlitched: (glitched) => set({ isGlitched: glitched }),
    triggerGlitch: () => {
        set({ isGlitched: true })
        setTimeout(() => set({ isGlitched: false }), 200)
    },
}))

// Audio service to manage HTMLAudioElements
class AudioService {
    private bgm: HTMLAudioElement | null = null

    constructor() {
        if (typeof window !== 'undefined') {
            this.bgm = new Audio('/audio/background_bgm.mp3') // Changed to generic
            this.bgm.loop = true
        }
    }

    startBGM(volume: number) {
        if (this.bgm) {
            this.bgm.volume = volume
            this.bgm.play().catch(e => console.log("Audio play blocked by browser."))
        }
    }

    stopBGM() {
        this.bgm?.pause()
    }

    setVolume(volume: number) {
        if (this.bgm) this.bgm.volume = volume
    }

    applyDistortion(active: boolean) {
        if (this.bgm) {
            // Simplified distortion simulation via playbackRate
            this.bgm.playbackRate = active ? 0.9 + Math.random() * 0.2 : 1.0
        }
    }

    playGlitch() {
        console.log("🔊 Glitch sound effect")
    }
}

export const audioService = new AudioService()

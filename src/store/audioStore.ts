import { create } from 'zustand'

interface AudioState {
    isPlaying: boolean
    volume: number
    isGlitched: boolean
    isMitaMode: boolean
    setPlaying: (playing: boolean) => void
    setVolume: (volume: number) => void
    triggerGlitch: () => void
    toggleMitaMode: () => void
}

export const useAudioStore = create<AudioState>((set) => ({
    isPlaying: false,
    volume: 0.3,
    isGlitched: false,
    isMitaMode: false,
    setPlaying: (playing) => set({ isPlaying: playing }),
    setVolume: (volume) => set({ volume }),
    triggerGlitch: () => {
        set({ isGlitched: true })
        setTimeout(() => set({ isGlitched: false }), 500)
    },
    toggleMitaMode: () => set((state) => ({
        isMitaMode: !state.isMitaMode,
        isPlaying: true // Auto-start audio when entering Mita mode
    }))
}))

// Audio service to manage HTMLAudioElements
class AudioService {
    private bgm: HTMLAudioElement | null = null
    private glitchSfx: HTMLAudioElement | null = null

    constructor() {
        if (typeof window !== 'undefined') {
            this.bgm = new Audio('/audio/miside_bgm.mp3')
            this.bgm.loop = true
            this.glitchSfx = new Audio('/audio/glitch_sfx.mp3')
        }
    }

    startBGM(volume: number) {
        if (this.bgm) {
            this.bgm.volume = volume
            this.bgm.play().catch(e => console.log("Audio play blocked by browser. Need user interaction."))
        }
    }

    stopBGM() {
        this.bgm?.pause()
    }

    setVolume(volume: number) {
        if (this.bgm) this.bgm.volume = volume
    }

    playGlitch() {
        if (this.glitchSfx) {
            this.glitchSfx.volume = 0.5
            this.glitchSfx.play().catch(() => { })
        }
    }

    applyDistortion(glitched: boolean) {
        if (this.bgm) {
            // Very simple "distortion" effect by panning/volume shift
            // In a real Web Audio API setup, we'd use BiquadFilterNode
            this.bgm.playbackRate = glitched ? 0.95 : 1.0
            this.bgm.volume = glitched ? 0.1 : useAudioStore.getState().volume
        }
    }
}

export const audioService = new AudioService()

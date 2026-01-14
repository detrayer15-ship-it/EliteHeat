// Voice Synthesis Utility for Mita AI Assistant
// Using real audio files from Miside game

export interface VoiceConfig {
    lang: string
    rate: number
    pitch: number
    volume: number
}

// Mita voice configuration (for fallback TTS)
export const MITA_VOICE_CONFIG: VoiceConfig = {
    lang: 'ru-RU',
    rate: 0.85,
    pitch: 1.05,
    volume: 0.8
}

// Audio file paths for Mita's voice from Miside game
const MITA_AUDIO_FILES = {
    greeting: '/audio/mita/greeting.mp3',
    askName: '/audio/mita/ask_name.mp3',
    niceToMeet: '/audio/mita/nice_to_meet.mp3'
}

class VoiceSynthesisService {
    private synth: SpeechSynthesis
    private currentAudio: HTMLAudioElement | null = null
    private currentUtterance: SpeechSynthesisUtterance | null = null
    private voices: SpeechSynthesisVoice[] = []
    private useAudioFiles: boolean = true // Prefer real audio files

    constructor() {
        this.synth = window.speechSynthesis
        this.loadVoices()

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices()
            }
        }
    }

    private loadVoices() {
        this.voices = this.synth.getVoices()
    }

    private getBestRussianVoice(): SpeechSynthesisVoice | null {
        if (this.voices.length === 0) {
            this.loadVoices()
        }

        const russianVoices = this.voices.filter(voice =>
            voice.lang.includes('ru') || voice.lang.includes('RU')
        )

        const femaleVoice = russianVoices.find(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('женский') ||
            voice.name.toLowerCase().includes('elena') ||
            voice.name.toLowerCase().includes('irina') ||
            voice.name.toLowerCase().includes('microsoft') ||
            voice.name.toLowerCase().includes('google')
        )

        return femaleVoice || russianVoices[0] || this.voices[0] || null
    }

    // Play audio file from Miside game
    private async playAudioFile(audioPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Stop any current audio
                this.stopAudio()

                const audio = new Audio(audioPath)
                this.currentAudio = audio

                audio.onended = () => {
                    this.currentAudio = null
                    resolve()
                }

                audio.onerror = (error) => {
                    this.currentAudio = null
                    reject(error)
                }

                audio.play().catch(reject)
            } catch (error) {
                reject(error)
            }
        })
    }

    // Check if we have audio file for this phrase
    private getAudioFileForPhrase(text: string): string | null {
        const lowerText = text.toLowerCase().trim()

        if (lowerText.includes('привет') && lowerText.includes('мита')) {
            return MITA_AUDIO_FILES.greeting
        }
        if (lowerText.includes('как тебя зовут')) {
            return MITA_AUDIO_FILES.askName
        }
        if (lowerText.includes('рада знакомству')) {
            return MITA_AUDIO_FILES.niceToMeet
        }

        return null
    }

    // Main speak function - tries audio file first, falls back to TTS
    async speak(text: string, config: VoiceConfig = MITA_VOICE_CONFIG): Promise<void> {
        // Try to use real audio file first
        if (this.useAudioFiles) {
            const audioFile = this.getAudioFileForPhrase(text)
            if (audioFile) {
                try {
                    await this.playAudioFile(audioFile)
                    return
                } catch (error) {
                    console.warn('Failed to play audio file, falling back to TTS:', error)
                    // Fall through to TTS
                }
            }
        }

        // Fallback to Web Speech API TTS
        return new Promise((resolve, reject) => {
            this.stop()

            const utterance = new SpeechSynthesisUtterance(text)
            const voice = this.getBestRussianVoice()

            if (voice) {
                utterance.voice = voice
            }

            utterance.lang = config.lang
            utterance.rate = config.rate
            utterance.pitch = config.pitch
            utterance.volume = config.volume

            utterance.onend = () => {
                this.currentUtterance = null
                resolve()
            }

            utterance.onerror = (event) => {
                this.currentUtterance = null
                reject(event)
            }

            this.currentUtterance = utterance
            this.synth.speak(utterance)
        })
    }

    // Stop audio playback
    private stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause()
            this.currentAudio.currentTime = 0
            this.currentAudio = null
        }
    }

    // Stop all speech (both audio and TTS)
    stop() {
        this.stopAudio()

        if (this.synth.speaking) {
            this.synth.cancel()
        }
        this.currentUtterance = null
    }

    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause()
        }
        if (this.synth.speaking) {
            this.synth.pause()
        }
    }

    resume() {
        if (this.currentAudio && this.currentAudio.paused) {
            this.currentAudio.play()
        }
        if (this.synth.paused) {
            this.synth.resume()
        }
    }

    isSpeaking(): boolean {
        return (this.currentAudio !== null && !this.currentAudio.paused) || this.synth.speaking
    }

    getAvailableVoices(): SpeechSynthesisVoice[] {
        return this.voices
    }

    // Toggle between audio files and TTS
    setUseAudioFiles(use: boolean) {
        this.useAudioFiles = use
    }

    // Play greeting audio only (first phrase)
    async playGreeting(): Promise<void> {
        try {
            await this.playAudioFile(MITA_AUDIO_FILES.greeting)
        } catch (error) {
            console.error('Error playing greeting:', error)
            throw error
        }
    }

    // Play ask name audio (second phrase)
    async playAskName(): Promise<void> {
        try {
            await this.playAudioFile(MITA_AUDIO_FILES.askName)
        } catch (error) {
            console.error('Error playing ask name:', error)
            throw error
        }
    }

    // Play greeting sequence (both phrases together)
    async playGreetingSequence(): Promise<void> {
        try {
            await this.playAudioFile(MITA_AUDIO_FILES.greeting)
            await new Promise(resolve => setTimeout(resolve, 500))
            await this.playAudioFile(MITA_AUDIO_FILES.askName)
        } catch (error) {
            console.error('Error playing greeting sequence:', error)
            throw error
        }
    }

    // Play nice to meet audio
    async playNiceToMeet(): Promise<void> {
        try {
            await this.playAudioFile(MITA_AUDIO_FILES.niceToMeet)
        } catch (error) {
            console.error('Error playing nice to meet audio:', error)
            throw error
        }
    }
}

// Export singleton instance
export const voiceService = new VoiceSynthesisService()

// Predefined Mita phrases (matching audio files)
export const MITA_PHRASES = {
    greeting: 'Привет, Мита',
    askName: 'Как тебя зовут?',
    niceToMeet: 'Рада знакомству',
    letsStart: 'Давай начнем работу!',
    thinking: 'Думаю...',
    ready: 'Готова помочь!'
}

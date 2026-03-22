// Voice Synthesis Utility for Assistant
// Using standard TTS and audio sequences

export interface VoiceConfig {
    lang: string
    rate: number
    pitch: number
    volume: number
}

// Assistant voice configuration (for fallback TTS)
export const ASSISTANT_VOICE_CONFIG: VoiceConfig = {
    lang: 'ru-RU',
    rate: 0.85,
    pitch: 1.05,
    volume: 0.8
}

// Audio file paths for generic assistant voice
const ASSISTANT_AUDIO_FILES = {
    greeting: '/audio/assistant/greeting.mp3',
    askName: '/audio/assistant/ask_name.mp3',
    niceToMeet: '/audio/assistant/nice_to_meet.mp3'
}

class VoiceSynthesisService {
    private synth: SpeechSynthesis
    private currentAudio: HTMLAudioElement | null = null
    private currentUtterance: SpeechSynthesisUtterance | null = null
    private voices: SpeechSynthesisVoice[] = []
    private useAudioFiles: boolean = false // Standard TTS by default

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

    private async playAudioFile(audioPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
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

    private getAudioFileForPhrase(text: string): string | null {
        const lowerText = text.toLowerCase().trim()
        if (lowerText.includes('привет')) return ASSISTANT_AUDIO_FILES.greeting
        if (lowerText.includes('как тебя зовут')) return ASSISTANT_AUDIO_FILES.askName
        if (lowerText.includes('рада знакомству')) return ASSISTANT_AUDIO_FILES.niceToMeet
        return null
    }

    async speak(text: string, config: VoiceConfig = ASSISTANT_VOICE_CONFIG): Promise<void> {
        if (this.useAudioFiles) {
            const audioFile = this.getAudioFileForPhrase(text)
            if (audioFile) {
                try {
                    await this.playAudioFile(audioFile)
                    return
                } catch (error) {
                    console.warn('Fallback to TTS:', error)
                }
            }
        }

        return new Promise((resolve, reject) => {
            this.stop()
            const utterance = new SpeechSynthesisUtterance(text)
            const voice = this.getBestRussianVoice()
            if (voice) utterance.voice = voice
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

    private stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause()
            this.currentAudio.currentTime = 0
            this.currentAudio = null
        }
    }

    stop() {
        this.stopAudio()
        if (this.synth.speaking) this.synth.cancel()
        this.currentUtterance = null
    }

    pause() {
        if (this.currentAudio) this.currentAudio.pause()
        if (this.synth.speaking) this.synth.pause()
    }

    resume() {
        if (this.currentAudio && this.currentAudio.paused) this.currentAudio.play()
        if (this.synth.paused) this.synth.resume()
    }

    isSpeaking(): boolean {
        return (this.currentAudio !== null && !this.currentAudio.paused) || this.synth.speaking
    }

    getAvailableVoices(): SpeechSynthesisVoice[] {
        return this.voices
    }

    setUseAudioFiles(use: boolean) {
        this.useAudioFiles = use
    }

    async playGreeting(): Promise<void> {
        await this.playAudioFile(ASSISTANT_AUDIO_FILES.greeting)
    }

    async playAskName(): Promise<void> {
        await this.playAudioFile(ASSISTANT_AUDIO_FILES.askName)
    }

    async playGreetingSequence(): Promise<void> {
        await this.playAudioFile(ASSISTANT_AUDIO_FILES.greeting)
        await new Promise(resolve => setTimeout(resolve, 500))
        await this.playAudioFile(ASSISTANT_AUDIO_FILES.askName)
    }

    async playNiceToMeet(): Promise<void> {
        await this.playAudioFile(ASSISTANT_AUDIO_FILES.niceToMeet)
    }
}

export const voiceService = new VoiceSynthesisService()

export const ASSISTANT_PHRASES = {
    greeting: 'Привет',
    askName: 'Как тебя зовут?',
    niceToMeet: 'Рада знакомству',
    letsStart: 'Давай начнем работу!',
    thinking: 'Загрузка...',
    ready: 'Готова помочь!'
}

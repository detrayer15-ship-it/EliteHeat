import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'
import { Crown, Sparkles, X } from 'lucide-react'

export const AchievementNotifier = () => {
    const { lastUnlocked, clearLastUnlocked } = useGamificationStore()

    useEffect(() => {
        if (lastUnlocked) {
            const timer = setTimeout(() => {
                clearLastUnlocked()
            }, 6000) // Show for 6 seconds
            return () => clearTimeout(timer)
        }
    }, [lastUnlocked, clearLastUnlocked])

    return (
        <AnimatePresence>
            {lastUnlocked && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 right-8 z-[100] w-[350px]"
                >
                    <div className="relative bg-[#0f1014] border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden group">
                        {/* Background Pulse */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

                        <div className="flex items-start gap-5 relative z-10">
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110"></div>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg border border-white/10">
                                    {lastUnlocked.icon}
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-[#0f1014] shadow-md">
                                    <Sparkles className="w-3 h-3 text-[#0f1014]" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-3 h-3 text-yellow-400" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">New Achievement</p>
                                </div>
                                <h4 className="text-lg font-black text-white tracking-tight leading-tight">{lastUnlocked.title}</h4>
                                <p className="text-xs text-white/50 leading-relaxed italic">"{lastUnlocked.description}"</p>
                            </div>

                            <button
                                onClick={clearLastUnlocked}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Progress Bar (Timer) */}
                        <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="h-full bg-indigo-500/50"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

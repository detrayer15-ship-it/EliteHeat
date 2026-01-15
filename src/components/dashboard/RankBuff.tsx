import { motion } from 'framer-motion'
import { Shield, Zap, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export const RankBuff = ({ xp = 0 }: { xp?: number }) => {
    const { t } = useTranslation()
    // Calculate intensity based on XP or activity
    const intensity = Math.min(Math.max(xp / 20000, 0.4), 1)

    return (
        <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group h-full">
            {/* Soft Background Atmosphere */}
            <div className="absolute inset-0 bg-blue-50/30 opacity-60"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    {/* Pulsing Core Highlight */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-[-20px] bg-blue-500 rounded-full blur-2xl opacity-10"
                    />

                    <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl relative z-10 overflow-hidden">
                        <motion.div
                            animate={{
                                y: [0, -4, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Shield className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </motion.div>

                        {/* Energy Orbs */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">{t('currentRank')}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">ELITE <span className="text-blue-600 not-italic">OPS</span></h3>
                    <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('xpGain')}</span>
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-blue-600 shadow-sm' : 'bg-slate-100'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

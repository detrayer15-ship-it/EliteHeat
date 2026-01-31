import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: number;
    rankName: string;
    rankIcon: string;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level, rankName, rankIcon }) => {
    useEffect(() => {
        if (isOpen) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4F46E5', '#818CF8', '#C084FC', '#FB923C']
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                    className="relative max-w-md w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-[3rem] p-8 shadow-2xl border border-white/10 overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-10 text-center space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-black uppercase tracking-[0.3em]"
                        >
                            <Sparkles className="w-3 h-3" />
                            New Achievement
                        </motion.div>

                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="text-8xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {rankIcon}
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black text-white tracking-tighter"
                            >
                                Поздравляем!
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-indigo-200 text-lg"
                            >
                                Вы достигли нового ранга:
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', delay: 0.5 }}
                            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl"
                        >
                            <div className="text-3xl font-black text-white tracking-tight mb-1">
                                {rankName}
                            </div>
                            <div className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                                Уровень {level}
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={onClose}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            Продолжить путь
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

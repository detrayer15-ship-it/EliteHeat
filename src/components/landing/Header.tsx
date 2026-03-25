import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, MessageCircle, MessageSquare } from 'lucide-react'

export const Header = () => {
    const navigate = useNavigate()

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl"
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="/images/logo.png"
                            alt="EliteHeat Logo"
                            className="w-10 h-10 object-contain rounded-xl"
                        />
                        <div className="text-2xl font-black tracking-tight flex items-center">
                            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Elite</span><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Heat</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 ml-1 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-indigo-100">
                            Beta
                        </div>
                    </div>


                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Social Links */}
                        <div className="hidden md:flex items-center gap-2 mr-2">
                            <a
                                href="https://wa.me/77755921255"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#25D366]/10 hover:text-[#25D366] border border-slate-100 transition-all flex"
                                title="WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                                href="https://discord.gg/DvcbNVrb"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#5865F2]/10 hover:text-[#5865F2] border border-slate-100 transition-all flex"
                                title="Discord"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </a>
                            <a
                                href="https://t.me/eliteheatprogramming"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#229ED9]/10 hover:text-[#229ED9] border border-slate-100 transition-all flex"
                                title="Telegram"
                            >
                                <Send className="w-4 h-4" />
                            </a>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-xl transition-all"
                        >
                            Войти
                        </button>

                        <button
                            onClick={() => navigate('/select-role')}
                            className="text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-200/60 active:scale-[0.98]"
                        >
                            Начать обучение
                        </button>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}

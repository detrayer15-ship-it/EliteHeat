import { useNavigate } from 'react-router-dom'
import { MessageCircle, MessageSquare } from 'lucide-react'

export const Footer = () => {
    const navigate = useNavigate()

    return (
        <footer id="footer" className="bg-white pt-24 pb-12 border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div
                            className="text-3xl font-black tracking-tight flex items-center cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Elite</span><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Edu</span>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-6">
                            Инновационная образовательная платформа, меняющая подход к обучению программированию и дизайну.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/77755921255"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group w-full sm:w-fit pr-6"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#25D366] transition-colors">WhatsApp</div>
                                    <div className="text-sm font-bold text-slate-700">+7 775 592 1255</div>
                                </div>
                            </a>

                            <a
                                href="https://discord.gg/DvcbNVrb"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-[#5865F2] hover:bg-[#5865F2]/5 transition-all group w-full sm:w-fit pr-6"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#5865F2] transition-colors">Discord</div>
                                    <div className="text-sm font-bold text-slate-700">Наш сервер</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Links Section 1 */}

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        © 2028 EliteEdu. Все права защищены.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Платформа работает стабильно</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

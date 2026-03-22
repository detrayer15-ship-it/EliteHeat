import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

interface AppLayoutProps {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#f8faff] via-[#ffffff] to-[#f0f4ff] relative overflow-hidden font-sans">
            {/* Ultra Premium Global Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Soft floating orbs */}
                <div className="absolute top-[-15%] right-[-8%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-100/30 to-blue-100/20 rounded-full blur-[140px] animate-float-mega-slow"></div>
                <div className="absolute bottom-[-15%] left-[-8%] w-[45%] h-[45%] bg-gradient-to-tr from-violet-50/30 to-purple-100/20 rounded-full blur-[140px] animate-float-mega-slow animation-delay-4000"></div>
                <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] bg-gradient-to-bl from-sky-50/20 to-cyan-50/15 rounded-full blur-[100px] animate-pulse-mega-slow animation-delay-2000"></div>

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>

                {/* Center radial vignette */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(248,250,255,0.6)_100%)]"></div>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-[272px] relative z-10">
                <Header />

                <main className="flex-1 p-3 sm:p-4 lg:p-8 pb-24 lg:pb-10 transition-all duration-500">
                    <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav />
        </div>
    )
}

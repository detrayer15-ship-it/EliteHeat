import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

interface AppLayoutProps {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-tr from-[#f8faff] via-[#ffffff] to-[#eff6ff] relative overflow-hidden">
            {/* Ultra Premium Global Background Elements (Harmonized with Earth) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/20 rounded-full blur-[160px] animate-pulse-mega-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/30 rounded-full blur-[160px] animate-pulse-mega-slow animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.4)_100%)]"></div>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-72 relative z-10">
                <Header />

                <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 lg:pb-10 transition-all duration-500">
                    <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav />
        </div>
    )
}

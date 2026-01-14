import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

interface AppLayoutProps {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative overflow-hidden">
            {/* Ultra Premium Global Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-[120px] animate-pulse-mega-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-[120px] animate-pulse-mega-slow animation-delay-4000"></div>
                <div className="absolute inset-0 gradient-mesh opacity-[0.03] pointer-events-none"></div>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-72 relative z-10">
                <Header />

                <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-28 lg:pb-10 transition-all duration-500">
                    <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav />
        </div>
    )
}

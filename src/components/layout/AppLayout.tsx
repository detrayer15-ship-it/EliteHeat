import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

interface AppLayoutProps {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <Header />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav />
        </div>
    )
}

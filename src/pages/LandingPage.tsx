import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { FloatingParticles } from '@/components/FloatingParticles'

// Import extracted components
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Benefits } from '@/components/landing/Benefits'
import { Stats } from '@/components/landing/Stats'
import { SchoolUsage } from '@/components/landing/SchoolUsage'
import { Compliance } from '@/components/landing/Compliance'
import { TeacherTools } from '@/components/landing/TeacherTools'
import { KPI } from '@/components/landing/KPI'
import { Risks } from '@/components/landing/Risks'
import { Ethics } from '@/components/landing/Ethics'
import { FutureModules } from '@/components/landing/FutureModules'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export const LandingPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen relative overflow-hidden smooth-scroll bg-white text-gray-900">
            {/* Layer 1: Floating Particles */}
            <FloatingParticles />

            {/* Content Layer */}
            <div className="relative min-h-screen flex flex-col">
                <Header />
                <Hero />
            </div>

            <Features />
            <Benefits />
            <Stats />
            <SchoolUsage />
            <Compliance />
            <TeacherTools />
            <KPI />
            <Risks />
            <Ethics />
            <FutureModules />
            <FinalCTA />
            <Footer />

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out both;
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out both;
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out both;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out both;
                }
            `}</style>
        </div>
    )
}

import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const Stats = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <ScrollReveal animation="scale" delay={0}>
                    <div className="p-6 rounded-2xl glass-card glow-on-hover transition-all">
                        <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            <AnimatedCounter end={32} suffix="+" />
                        </div>
                        <div className="text-gray-600 font-medium">Уроков</div>
                    </div>
                </ScrollReveal>
                <ScrollReveal animation="scale" delay={100}>
                    <div className="p-6 rounded-2xl glass-card glow-on-hover transition-all">
                        <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            24/7
                        </div>
                        <div className="text-gray-600 font-medium">AI-Поддержка</div>
                    </div>
                </ScrollReveal>
                <ScrollReveal animation="scale" delay={200}>
                    <div className="p-6 rounded-2xl glass-card glow-on-hover transition-all">
                        <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                            <AnimatedCounter end={100} suffix="%" />
                        </div>
                        <div className="text-gray-600 font-medium">Практика</div>
                    </div>
                </ScrollReveal>
                <ScrollReveal animation="scale" delay={300}>
                    <div className="p-6 rounded-2xl glass-card glow-on-hover transition-all">
                        <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            ∞
                        </div>
                        <div className="text-gray-600 font-medium">Доступ к материалам</div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}

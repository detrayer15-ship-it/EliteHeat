import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const FinalCTA = () => {
    const navigate = useNavigate()

    return (
        <section className="container mx-auto px-4 py-20 text-center">
            <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-orange-100 via-blue-50 to-orange-100 border-2 border-orange-300 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                    Готовы начать обучение?
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Присоединяйтесь к тысячам студентов, которые уже развивают свои навыки на EliteHeat.
                    Выберите подходящий тариф и начните учиться уже сегодня!
                </p>
                <Button
                    size="lg"
                    onClick={() => navigate('/subscription')}
                    className="text-lg py-5 px-10 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
                >
                    Выбрать тариф
                </Button>
            </Card>
        </section>
    )
}

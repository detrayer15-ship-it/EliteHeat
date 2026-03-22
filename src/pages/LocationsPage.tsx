import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Office {
    id: string
    name: string
    address: string
    city: string
    phone: string
    hours: string
    lat: number
    lng: number
}

const offices: Office[] = [
    {
        id: '1',
        name: 'EliteEdu - Алматы (Центр)',
        address: 'ул. Абая, 150/230',
        city: 'Алматы',
        phone: '+7 771 693 3595',
        hours: 'Пн-Пт: 9:00-18:00',
        lat: 43.2220,
        lng: 76.8512
    },
    {
        id: '2',
        name: 'EliteEdu - Астана',
        address: 'пр. Кабанбай батыра, 53',
        city: 'Астана',
        phone: '+7 707 554 9835',
        hours: 'Пн-Пт: 9:00-18:00',
        lat: 51.1694,
        lng: 71.4491
    },
    {
        id: '3',
        name: 'EliteEdu - Шымкент',
        address: 'пр. Тауке хана, 25',
        city: 'Шымкент',
        phone: '+7 705 986 9303',
        hours: 'Пн-Пт: 9:00-18:00',
        lat: 42.3417,
        lng: 69.5901
    }
]

export const LocationsPage = () => {
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(offices[0])

    const openIn2GIS = (office: Office) => {
        // 2GIS deep link
        const url = `https://2gis.kz/search/${encodeURIComponent(office.address)}`
        window.open(url, '_blank')
    }

    const openInGoogleMaps = (office: Office) => {
        // Google Maps link
        const url = `https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`
        window.open(url, '_blank')
    }

    const openInYandexMaps = (office: Office) => {
        // Yandex Maps link
        const url = `https://yandex.kz/maps/?ll=${office.lng},${office.lat}&z=16&text=${encodeURIComponent(office.address)}`
        window.open(url, '_blank')
    }

    return (
        <div className="space-y-6 page-transition">
            {/* Заголовок */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    🗺️ Наши офисы
                </h1>
                <p className="text-gray-600">Найдите ближайший офис EliteEdu на карте</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Список офисов */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold">Выберите офис</h2>
                    {offices.map((office) => (
                        <Card
                            key={office.id}
                            hover
                            className={`cursor-pointer transition-all ${selectedOffice?.id === office.id
                                ? 'border-2 border-primary shadow-lg'
                                : 'border-2 border-transparent'
                                }`}
                            onClick={() => setSelectedOffice(office)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">📍</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{office.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">Адрес:</span> {office.address}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">Телефон:</span> {office.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Часы работы:</span> {office.hours}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Карта и действия */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedOffice && (
                        <>
                            {/* Встроенная карта (Google Maps iframe) */}
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Карта</h2>
                                <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedOffice.lat},${selectedOffice.lng}&zoom=15`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>

                            {/* Кнопки действий */}
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Открыть в приложении</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* 2GIS */}
                                    <Button
                                        variant="secondary"
                                        className="flex items-center justify-center gap-2"
                                        onClick={() => openIn2GIS(selectedOffice)}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                                        </svg>
                                        2ГИС
                                    </Button>

                                    {/* Google Maps */}
                                    <Button
                                        variant="secondary"
                                        className="flex items-center justify-center gap-2"
                                        onClick={() => openInGoogleMaps(selectedOffice)}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        Google Maps
                                    </Button>

                                    {/* Yandex Maps */}
                                    <Button
                                        variant="secondary"
                                        className="flex items-center justify-center gap-2"
                                        onClick={() => openInYandexMaps(selectedOffice)}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        Yandex Maps
                                    </Button>
                                </div>

                                {/* Информация */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200">
                                    <h3 className="font-bold mb-2">📍 {selectedOffice.name}</h3>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p><strong>Адрес:</strong> {selectedOffice.address}</p>
                                        <p><strong>Город:</strong> {selectedOffice.city}</p>
                                        <p><strong>Телефон:</strong> <a href={`tel:${selectedOffice.phone}`} className="text-primary hover:underline">{selectedOffice.phone}</a></p>
                                        <p><strong>Часы работы:</strong> {selectedOffice.hours}</p>
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            {/* Информация о картах */}
            <Card>
                <h2 className="text-xl font-bold mb-4">ℹ️ О картах</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                        <h3 className="font-bold mb-2">2ГИС</h3>
                        <p className="text-sm text-gray-600">
                            Подробные карты Казахстана и России с информацией о компаниях, маршрутами и навигацией.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                        <h3 className="font-bold mb-2">Google Maps</h3>
                        <p className="text-sm text-gray-600">
                            Мировые карты с детальной информацией, спутниковыми снимками и Street View.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                        <h3 className="font-bold mb-2">Yandex Maps</h3>
                        <p className="text-sm text-gray-600">
                            Карты с актуальными пробками, общественным транспортом и панорамами улиц.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

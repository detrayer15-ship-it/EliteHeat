export const generateProjectImage = (projectTitle: string, type: 'startup' | 'research' | 'social' | 'creative' | 'custom' = 'custom'): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 400
    const ctx = canvas.getContext('2d')

    if (!ctx) return ''

    // Градиентный фон в зависимости от типа проекта
    const gradients = {
        startup: ['#FF7A00', '#FF9F40'],
        research: ['#2F80ED', '#56CCF2'],
        social: ['#28C76F', '#48DA89'],
        creative: ['#9B51E0', '#BB6BD9'],
        custom: ['#6C757D', '#8E9AAF'],
    }

    const [color1, color2] = gradients[type]
    const gradient = ctx.createLinearGradient(0, 0, 800, 400)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(1, color2)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 400)

    // Добавляем геометрические фигуры
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(650, 100, 150, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(150, 350, 100, 0, Math.PI * 2)
    ctx.fill()

    // Текст
    ctx.globalAlpha = 1
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Разбиваем длинный текст на строки
    const maxWidth = 700
    const words = projectTitle.split(' ')
    let line = ''
    let y = 200

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 400, y)
            line = words[i] + ' '
            y += 60
        } else {
            line = testLine
        }
    }
    ctx.fillText(line, 400, y)

    return canvas.toDataURL('image/png')
}

export const getProjectTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
        startup: '🚀',
        research: '🔬',
        social: '🌍',
        creative: '🎨',
        custom: '📋',
    }
    return icons[type] || '📋'
}

export const getProjectTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        startup: 'bg-gradient-to-r from-orange-500 to-orange-600',
        research: 'bg-gradient-to-r from-blue-500 to-blue-600',
        social: 'bg-gradient-to-r from-green-500 to-green-600',
        creative: 'bg-gradient-to-r from-purple-500 to-purple-600',
        custom: 'bg-gradient-to-r from-gray-500 to-gray-600',
    }
    return colors[type] || colors.custom
}

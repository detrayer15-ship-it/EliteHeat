import { useEffect, useRef } from 'react'

export const RealisticEarthGlobe = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = 300
        canvas.height = 300
        const centerX = 150
        const centerY = 150
        const radius = 130

        let rotation = 0

        // Simplified continent shapes (longitude offset, latitude, polygon points)
        const continents = [
            // North America
            { lon: -100, lat: 40, points: [[0, 0], [-25, 15], [-35, -5], [-15, -25], [10, -20], [15, 0]] },
            // South America  
            { lon: -65, lat: -15, points: [[0, 0], [-12, 18], [-8, 30], [5, 28], [12, 10], [8, -5]] },
            // Europe
            { lon: 15, lat: 52, points: [[0, 0], [18, 8], [25, 0], [20, -8], [5, -10], [-8, -5]] },
            // Africa
            { lon: 20, lat: 5, points: [[0, 0], [12, 22], [18, 35], [8, 40], [-5, 32], [-12, 15], [-8, 5]] },
            // Asia
            { lon: 85, lat: 50, points: [[0, 0], [35, 15], [50, 5], [45, -15], [25, -25], [5, -20], [-15, -5]] },
            // Australia
            { lon: 135, lat: -25, points: [[0, 0], [20, 8], [28, 0], [22, -12], [5, -15], [-8, -8]] }
        ]

        const draw = () => {
            ctx.clearRect(0, 0, 300, 300)

            // Outer atmosphere glow
            const glowGrad = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 25)
            glowGrad.addColorStop(0, 'rgba(74, 158, 255, 0.5)')
            glowGrad.addColorStop(0.7, 'rgba(74, 158, 255, 0.2)')
            glowGrad.addColorStop(1, 'rgba(74, 158, 255, 0)')
            ctx.fillStyle = glowGrad
            ctx.fillRect(0, 0, 300, 300)

            // Ocean base with realistic sphere shading
            const oceanGrad = ctx.createRadialGradient(
                centerX - radius * 0.35, centerY - radius * 0.35, radius * 0.1,
                centerX, centerY, radius
            )
            oceanGrad.addColorStop(0, '#6bb6ff')
            oceanGrad.addColorStop(0.4, '#3a8fd9')
            oceanGrad.addColorStop(0.8, '#1e5a9e')
            oceanGrad.addColorStop(1, '#0d2d4e')

            ctx.save()
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = oceanGrad
            ctx.fill()
            ctx.clip()

            // Draw continents with 3D effect
            continents.forEach(continent => {
                const lon = (continent.lon + rotation * 50) % 360
                const lat = continent.lat

                const lonRad = (lon * Math.PI) / 180
                const latRad = (lat * Math.PI) / 180

                // 3D projection
                const x = centerX + radius * Math.cos(latRad) * Math.sin(lonRad)
                const y = centerY - radius * Math.sin(latRad)
                const z = radius * Math.cos(latRad) * Math.cos(lonRad)

                if (z > 0) { // Only draw visible side
                    const scale = (z / radius) * 0.6 + 0.4 // Perspective scaling
                    const brightness = (z / radius) * 0.3 + 0.7 // Lighting

                    ctx.save()
                    ctx.translate(x, y)
                    ctx.scale(scale, scale)

                    // Land color with shading
                    const landColor = `rgba(45, 80, 22, ${brightness})`
                    ctx.fillStyle = landColor
                    ctx.strokeStyle = `rgba(26, 48, 16, ${brightness})`
                    ctx.lineWidth = 1.5

                    ctx.beginPath()
                    continent.points.forEach((point, i) => {
                        if (i === 0) ctx.moveTo(point[0], point[1])
                        else ctx.lineTo(point[0], point[1])
                    })
                    ctx.closePath()
                    ctx.fill()
                    ctx.stroke()

                    ctx.restore()
                }
            })

            // Cloud layer
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
            for (let i = 0; i < 18; i++) {
                const angle = (rotation * 70 + i * 20) % 360
                const angleRad = (angle * Math.PI) / 180
                const latRad = ((Math.sin(i * 0.7) * 50) * Math.PI) / 180

                const x = centerX + radius * 0.88 * Math.cos(latRad) * Math.sin(angleRad)
                const y = centerY - radius * 0.88 * Math.sin(latRad)
                const z = radius * 0.88 * Math.cos(latRad) * Math.cos(angleRad)

                if (z > 0) {
                    const cloudSize = 6 + Math.sin(i * 1.3) * 3
                    ctx.beginPath()
                    ctx.ellipse(x, y, cloudSize * 1.5, cloudSize, Math.PI / 4, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.restore()

            // Sphere highlight (sun reflection)
            const highlightGrad = ctx.createRadialGradient(
                centerX - radius * 0.45, centerY - radius * 0.45, 0,
                centerX - radius * 0.45, centerY - radius * 0.45, radius * 0.9
            )
            highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
            highlightGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)')
            highlightGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
            highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = highlightGrad
            ctx.fill()

            // Outer border/rim
            ctx.strokeStyle = 'rgba(74, 158, 255, 0.7)'
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.stroke()

            rotation += 0.005 // Slow, realistic rotation
            requestAnimationFrame(draw)
        }

        draw()
    }, [])

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                className="drop-shadow-2xl"
                style={{ width: '300px', height: '300px' }}
            />
        </div>
    )
}

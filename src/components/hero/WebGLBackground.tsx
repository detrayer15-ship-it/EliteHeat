import { useRef } from 'react'

export const WebGLBackground = () => {
    const mouse = useRef<[number, number]>([0, 0])

    const handleMouseMove = (e: any) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
        const x = (clientX / window.innerWidth) * 2 - 1
        const y = -(clientY / window.innerHeight) * 2 + 1
        mouse.current = [x, y]
    }

    return (
        <div
            className="fixed inset-0 z-0 bg-[#000000] overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
            {/* Disabled WebGL Canvas to stop GPU Context Lost crashes */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#000000] to-[#0f172a] opacity-50"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Subtle animated overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>
        </div>
    )
}

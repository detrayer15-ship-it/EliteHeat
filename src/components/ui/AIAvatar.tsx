interface AIAvatarProps {
    size?: number
    state?: 'idle' | 'thinking' | 'speaking'
    showImage?: boolean
}

export const AIAvatar = ({ size = 120, state = 'idle', showImage = true }: AIAvatarProps) => {
    return (
        <div
            className="ai-avatar-container"
            style={{ width: size, height: size }}
        >
            {/* Pulse Rings - Energy Waves */}
            <div className="pulse-ring pulse-ring-1"></div>
            <div className="pulse-ring pulse-ring-2"></div>
            <div className="pulse-ring pulse-ring-3"></div>

            {/* Main Avatar - Mita Image or Gradient */}
            <div className={`ai-avatar-core ${state}`}>
                {showImage ? (
                    <>
                        {/* Mita Avatar Image */}
                        <img
                            src="/mita-avatar.png"
                            alt="Mita AI"
                            className="mita-image"
                        />
                        {/* Subtle overlay for effects */}
                        <div className="image-overlay"></div>
                    </>
                ) : (
                    <>
                        {/* Animated Gradient Background */}
                        <div className="gradient-layer"></div>
                    </>
                )}

                {/* Shine Effect */}
                <div className="shine-effect"></div>

                {/* Hologram Scanlines */}
                <div className="scanlines"></div>
            </div>

            {/* Star Dust Particles */}
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>

            <style>{`
                .ai-avatar-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Main Avatar Core */
                .ai-avatar-core {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 
                        0 0 30px rgba(168, 85, 247, 0.6),
                        0 0 60px rgba(168, 85, 247, 0.4),
                        inset 0 0 30px rgba(255, 255, 255, 0.1);
                    z-index: 2;
                }

                /* Mita Image */
                .mita-image {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                    z-index: 1;
                }

                /* Image Overlay for Effects */
                .image-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        transparent 0%,
                        transparent 60%,
                        rgba(168, 85, 247, 0.3) 100%
                    );
                    z-index: 2;
                }

                /* Animated Liquid Gradient (fallback) */
                .gradient-layer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        45deg,
                        #a855f7,
                        #ec4899,
                        #8b5cf6,
                        #06b6d4,
                        #a855f7
                    );
                    background-size: 300% 300%;
                    animation: liquid-gradient 6s ease infinite;
                }

                @keyframes liquid-gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                /* Shine Effect - Running Light */
                .shine-effect {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent
                    );
                    animation: shine-sweep 4s ease-in-out infinite;
                    transform: rotate(45deg);
                    z-index: 3;
                }

                @keyframes shine-sweep {
                    0%, 100% {
                        transform: translateX(-100%) rotate(45deg);
                    }
                    50% {
                        transform: translateX(100%) rotate(45deg);
                    }
                }

                /* Hologram Scanlines */
                .scanlines {
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 255, 255, 0.03) 2px,
                        rgba(255, 255, 255, 0.03) 4px
                    );
                    animation: scanline-move 3s linear infinite, flicker 2.5s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 4;
                }

                @keyframes scanline-move {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(10px);
                    }
                }

                @keyframes flicker {
                    0%, 100% {
                        opacity: 0.6;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                /* Pulse Rings - Energy Waves */
                .pulse-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 2px solid rgba(168, 85, 247, 0.6);
                    animation: pulse-expand 3s ease-out infinite;
                    pointer-events: none;
                }

                .pulse-ring-1 {
                    animation-delay: 0s;
                }

                .pulse-ring-2 {
                    animation-delay: 1s;
                }

                .pulse-ring-3 {
                    animation-delay: 2s;
                }

                @keyframes pulse-expand {
                    0% {
                        width: 100%;
                        height: 100%;
                        opacity: 1;
                        border-width: 3px;
                    }
                    100% {
                        width: 180%;
                        height: 180%;
                        opacity: 0;
                        border-width: 1px;
                    }
                }

                /* Star Dust Particles */
                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #fbbf24, #f59e0b);
                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
                    pointer-events: none;
                    animation: particle-orbit 8s linear infinite;
                }

                .particle-1 { animation-delay: 0s; animation-duration: 6s; }
                .particle-2 { animation-delay: 1s; animation-duration: 7s; }
                .particle-3 { animation-delay: 2s; animation-duration: 8s; }
                .particle-4 { animation-delay: 3s; animation-duration: 6.5s; }
                .particle-5 { animation-delay: 4s; animation-duration: 7.5s; }
                .particle-6 { animation-delay: 5s; animation-duration: 8.5s; }

                @keyframes particle-orbit {
                    0% {
                        transform: rotate(0deg) translateX(60px) rotate(0deg);
                        opacity: 0;
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% {
                        transform: rotate(360deg) translateX(60px) rotate(-360deg);
                        opacity: 0;
                    }
                }

                /* Thinking State - Faster animations */
                .ai-avatar-core.thinking .shine-effect {
                    animation-duration: 2s;
                }

                .ai-avatar-core.thinking {
                    animation: thinking-glow 1s ease-in-out infinite;
                }

                @keyframes thinking-glow {
                    0%, 100% {
                        box-shadow: 
                            0 0 30px rgba(168, 85, 247, 0.6),
                            0 0 60px rgba(168, 85, 247, 0.4);
                    }
                    50% {
                        box-shadow: 
                            0 0 40px rgba(168, 85, 247, 0.8),
                            0 0 80px rgba(168, 85, 247, 0.6);
                    }
                }

                /* Speaking State - Pulsing */
                .ai-avatar-core.speaking {
                    animation: speaking-pulse 0.5s ease-in-out infinite;
                }

                @keyframes speaking-pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                /* Performance Optimizations */
                .gradient-layer,
                .shine-effect,
                .scanlines,
                .pulse-ring,
                .particle,
                .mita-image {
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    )
}

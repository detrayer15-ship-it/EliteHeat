import { useEffect, useState } from 'react'

interface AIorbProps {
    size?: number
    state?: 'idle' | 'thinking' | 'speaking'
}

export const AIOrb = ({ size = 110, state = 'idle' }: AIorbProps) => {
    const [isPaused, setIsPaused] = useState(false)

    return (
        <div
            className={`ai-orb-container ${isPaused ? 'paused' : ''}`}
            style={{ width: size, height: size }}
        >
            {/* Core - Glowing center */}
            <div className={`ai-orb-core ${state}`}>
                <div className="ai-orb-core-inner"></div>
            </div>

            {/* Ring 1 - Slow rotation */}
            <div className="ai-orb-ring ai-orb-ring-1"></div>

            {/* Ring 2 - Fast counter rotation */}
            <div className="ai-orb-ring ai-orb-ring-2"></div>

            {/* Ring 3 - Energy ring */}
            <div className="ai-orb-ring ai-orb-ring-3"></div>

            {/* Energy Lines - Connecting wires */}
            <div className="ai-orb-energy-line ai-orb-energy-line-1"></div>
            <div className="ai-orb-energy-line ai-orb-energy-line-2"></div>
            <div className="ai-orb-energy-line ai-orb-energy-line-3"></div>
            <div className="ai-orb-energy-line ai-orb-energy-line-4"></div>

            {/* Spark particles */}
            <div className="ai-orb-spark ai-orb-spark-1"></div>
            <div className="ai-orb-spark ai-orb-spark-2"></div>
            <div className="ai-orb-spark ai-orb-spark-3"></div>
            <div className="ai-orb-spark ai-orb-spark-4"></div>

            {/* Electric arcs */}
            <div className="ai-orb-arc ai-orb-arc-1"></div>
            <div className="ai-orb-arc ai-orb-arc-2"></div>

            <style>{`
                .ai-orb-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-orb-container.paused * {
                    animation-play-state: paused !important;
                }

                /* Core - Breathing glow effect */}
                .ai-orb-core {
                    position: absolute;
                    width: 60%;
                    height: 60%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
                    animation: ai-core-breathe 4s ease-in-out infinite;
                    box-shadow: 
                        0 0 30px rgba(168, 85, 247, 0.8),
                        0 0 60px rgba(168, 85, 247, 0.6),
                        0 0 90px rgba(168, 85, 247, 0.4),
                        inset 0 0 30px rgba(255, 255, 255, 0.3);
                    z-index: 2;
                }

                .ai-orb-core.thinking {
                    animation: ai-core-breathe 2s ease-in-out infinite, ai-core-pulse 1.5s ease-in-out infinite;
                }

                .ai-orb-core-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 60%);
                    animation: ai-core-shimmer 3s ease-in-out infinite;
                }

                /* Ring 1 - Slow solid ring */}
                .ai-orb-ring-1 {
                    position: absolute;
                    width: 85%;
                    height: 85%;
                    border-radius: 50%;
                    border: 2px solid rgba(168, 85, 247, 0.5);
                    animation: ai-ring-rotate 6s linear infinite;
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
                    z-index: 1;
                }

                /* Ring 2 - Fast dashed ring (counter rotation) */}
                .ai-orb-ring-2 {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px dashed rgba(236, 72, 153, 0.6);
                    animation: ai-ring-rotate-reverse 3.8s linear infinite;
                    box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
                    z-index: 1;
                }

                /* Ring 3 - Energy ring */}
                .ai-orb-ring-3 {
                    position: absolute;
                    width: 75%;
                    height: 75%;
                    border-radius: 50%;
                    border: 1px solid rgba(139, 92, 246, 0.7);
                    animation: ai-ring-rotate 4.5s linear infinite;
                    box-shadow: 0 0 25px rgba(139, 92, 246, 0.5);
                    z-index: 1;
                }

                /* Energy Lines - Connecting wires */}
                .ai-orb-energy-line {
                    position: absolute;
                    width: 2px;
                    height: 40%;
                    background: linear-gradient(180deg, transparent, rgba(251, 191, 36, 0.8), transparent);
                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
                    animation: ai-energy-pulse 2s ease-in-out infinite;
                    z-index: 0;
                }

                .ai-orb-energy-line-1 {
                    top: 5%;
                    left: 50%;
                    transform: translateX(-50%);
                    animation-delay: 0s;
                }

                .ai-orb-energy-line-2 {
                    bottom: 5%;
                    left: 50%;
                    transform: translateX(-50%) rotate(180deg);
                    animation-delay: 0.5s;
                }

                .ai-orb-energy-line-3 {
                    top: 50%;
                    left: 5%;
                    transform: translateY(-50%) rotate(90deg);
                    animation-delay: 1s;
                }

                .ai-orb-energy-line-4 {
                    top: 50%;
                    right: 5%;
                    transform: translateY(-50%) rotate(-90deg);
                    animation-delay: 1.5s;
                }

                /* Electric arcs */}
                .ai-orb-arc {
                    position: absolute;
                    width: 50%;
                    height: 50%;
                    border-radius: 50%;
                    border: 1px solid transparent;
                    border-top-color: rgba(96, 165, 250, 0.6);
                    border-right-color: rgba(96, 165, 250, 0.4);
                    animation: ai-arc-rotate 2.5s linear infinite;
                    z-index: 3;
                }

                .ai-orb-arc-1 {
                    animation-delay: 0s;
                }

                .ai-orb-arc-2 {
                    animation-delay: 1.25s;
                    transform: rotate(180deg);
                }

                /* Spark particles */}
                .ai-orb-spark {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #fbbf24, #f59e0b);
                    box-shadow: 0 0 15px rgba(251, 191, 36, 1);
                    pointer-events: none;
                    z-index: 3;
                }

                .ai-orb-spark-1 {
                    top: 8%;
                    left: 50%;
                    animation: ai-spark-pulse 3s ease-in-out infinite;
                }

                .ai-orb-spark-2 {
                    top: 50%;
                    right: 8%;
                    animation: ai-spark-pulse 3s ease-in-out 0.75s infinite;
                }

                .ai-orb-spark-3 {
                    bottom: 8%;
                    left: 50%;
                    animation: ai-spark-pulse 3s ease-in-out 1.5s infinite;
                }

                .ai-orb-spark-4 {
                    top: 50%;
                    left: 8%;
                    animation: ai-spark-pulse 3s ease-in-out 2.25s infinite;
                }

                /* Animations */
                @keyframes ai-core-breathe {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 
                            0 0 30px rgba(168, 85, 247, 0.8),
                            0 0 60px rgba(168, 85, 247, 0.6),
                            0 0 90px rgba(168, 85, 247, 0.4),
                            inset 0 0 30px rgba(255, 255, 255, 0.3);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 
                            0 0 40px rgba(168, 85, 247, 1),
                            0 0 80px rgba(168, 85, 247, 0.8),
                            0 0 120px rgba(168, 85, 247, 0.6),
                            inset 0 0 40px rgba(255, 255, 255, 0.4);
                    }
                }

                @keyframes ai-core-pulse {
                    0%, 100% {
                        filter: brightness(1);
                    }
                    50% {
                        filter: brightness(1.4);
                    }
                }

                @keyframes ai-core-shimmer {
                    0%, 100% {
                        opacity: 0.6;
                        transform: rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: rotate(180deg);
                    }
                }

                @keyframes ai-ring-rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes ai-ring-rotate-reverse {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }

                @keyframes ai-energy-pulse {
                    0%, 100% {
                        opacity: 0.3;
                        height: 40%;
                    }
                    50% {
                        opacity: 1;
                        height: 50%;
                    }
                }

                @keyframes ai-arc-rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes ai-spark-pulse {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.5);
                    }
                }

                /* Performance optimizations */}
                .ai-orb-core,
                .ai-orb-ring,
                .ai-orb-spark,
                .ai-orb-energy-line,
                .ai-orb-arc {
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    )
}

interface ProgressBarProps {
    value: number
    showLabel?: boolean
    className?: string
}

export const ProgressBar = ({ value, showLabel = true, className = '' }: ProgressBarProps) => {
    const clampedValue = Math.min(Math.max(value, 0), 100)

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-1">
                {showLabel && <span className="text-sm font-medium text-text">{clampedValue}%</span>}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-smooth"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    )
}

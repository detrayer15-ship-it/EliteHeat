interface ChipProps {
    label: string
    onRemove?: () => void
    className?: string
}

export const Chip = ({ label, onRemove, className = '' }: ChipProps) => {
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium ${className}`}>
            {label}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    )
}

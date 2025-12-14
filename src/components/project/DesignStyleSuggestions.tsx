interface DesignStyleOption {
    name: string
    description: string
    colors: string[]
    mood: string
    examples?: string
}

interface DesignStyleSuggestionsProps {
    suggestions: DesignStyleOption[]
    onSelect: (style: DesignStyleOption) => void
}

export const DesignStyleSuggestions = ({ suggestions, onSelect }: DesignStyleSuggestionsProps) => {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">
                🎨 AI предлагает варианты стиля:
            </h4>

            <div className="grid grid-cols-1 gap-3">
                {suggestions.map((style, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(style)}
                        className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900 group-hover:text-purple-700">
                                {idx + 1}. {style.name}
                            </h5>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {style.mood}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {style.description}
                        </p>

                        {/* Color palette */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">Палитра:</span>
                            <div className="flex gap-1">
                                {style.colors.map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {style.examples && (
                            <p className="text-xs text-gray-500">
                                Примеры: {style.examples}
                            </p>
                        )}
                    </button>
                ))}
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
                💡 Выберите стиль или продолжите со своим описанием
            </p>
        </div>
    )
}

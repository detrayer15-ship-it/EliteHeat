import { useEffect, useState } from 'react'
import { Maximize2, Minimize2, Copy, Check } from 'lucide-react'

interface CodeEditorProps {
    file: string
    content: string
    onChange: (value: string | undefined) => void
    language: string
    onFullscreenToggle?: () => void
    isFullscreen?: boolean
}

export const CodeEditor = ({ file, content, onChange, language, onFullscreenToggle, isFullscreen }: CodeEditorProps) => {
    const [editorContent, setEditorContent] = useState(content)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setEditorContent(content)
    }, [content])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setEditorContent(newValue)
        onChange(newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget
        const { selectionStart, selectionEnd, value } = textarea

        // Python: main + Tab для основного шаблона
        if ((e.key === 'Tab' || e.key === 'Enter') && value.trim() === 'main') {
            e.preventDefault()
            const pythonTemplate = `def main():
    """Главная функция программы"""
    print("Hello, World!")


if __name__ == "__main__":
    main()`
            setEditorContent(pythonTemplate)
            onChange(pythonTemplate)
            return
        }

        // Python: class + Tab для класса
        if ((e.key === 'Tab' || e.key === 'Enter') && value.trim() === 'class') {
            e.preventDefault()
            const classTemplate = `class MyClass:
    """Описание класса"""
    
    def __init__(self):
        """Конструктор"""
        pass
    
    def method(self):
        """Метод класса"""
        pass`
            setEditorContent(classTemplate)
            onChange(classTemplate)
            return
        }

        // Python: flask + Tab для Flask приложения
        if ((e.key === 'Tab' || e.key === 'Enter') && value.trim() === 'flask') {
            e.preventDefault()
            const flaskTemplate = `from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)`
            setEditorContent(flaskTemplate)
            onChange(flaskTemplate)
            return
        }

        // Tab для отступа
        if (e.key === 'Tab') {
            e.preventDefault()
            const newValue =
                value.substring(0, selectionStart) +
                '    ' +
                value.substring(selectionEnd)
            setEditorContent(newValue)
            onChange(newValue)

            // Установить курсор после отступа
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 4
            }, 0)
        }

        // Auto-close brackets
        const pairs: Record<string, string> = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'",
            '<': '>'
        }

        if (pairs[e.key]) {
            e.preventDefault()
            const newValue =
                value.substring(0, selectionStart) +
                e.key +
                pairs[e.key] +
                value.substring(selectionEnd)
            setEditorContent(newValue)
            onChange(newValue)

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 1
            }, 0)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(editorContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Tab Bar */}
            <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#1e1e1e] border-t-2 border-purple-500 text-sm text-gray-300 flex items-center gap-2">
                        <span>{file.split('/').pop()}</span>
                        <button className="hover:bg-[#3e3e42] rounded px-1">×</button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white transition-colors"
                        title="Копировать код"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>

                    {onFullscreenToggle && (
                        <button
                            onClick={onFullscreenToggle}
                            className="p-1 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white transition-colors"
                            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-4 h-4" />
                            ) : (
                                <Maximize2 className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e42] pointer-events-none overflow-hidden">
                    {editorContent.split('\n').map((_, i) => (
                        <div
                            key={i}
                            className="text-xs text-gray-600 text-right pr-2 select-none"
                            style={{ lineHeight: '1.6', height: '22.4px' }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Code Editor */}
                <textarea
                    value={editorContent}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full pl-14 pr-4 py-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none focus:outline-none"
                    style={{
                        lineHeight: '1.6',
                        tabSize: 4,
                    }}
                    placeholder="# Начните писать код... (main/class/flask + Tab для шаблонов)"
                    spellCheck={false}
                />
            </div>

            {/* Info Bar */}
            <div className="h-6 bg-[#2d2d30] border-t border-[#3e3e42] flex items-center px-4 text-xs text-gray-400">
                <span className="mr-4">{language.toUpperCase()}</span>
                <span className="mr-4">UTF-8</span>
                <span>Строк: {editorContent.split('\n').length}</span>
                <span className="ml-auto text-purple-400">💡 Шаблоны: main, class, flask + Tab</span>
            </div>
        </div>
    )
}

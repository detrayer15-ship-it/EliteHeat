import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface AIMessageProps {
    content: string
    role: 'user' | 'assistant'
    userName?: string
}

export const AIMessage = ({ content, role, userName }: AIMessageProps) => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    // Simple formatter for AI responses
    const formatContent = (text: string) => {
        const lines = text.split('\n')
        const formatted: JSX.Element[] = []
        let inCodeBlock = false
        let codeLanguage = ''
        let codeLines: string[] = []

        lines.forEach((line, index) => {
            // Code block start
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true
                    codeLanguage = line.replace('```', '').trim() || 'code'
                } else {
                    // Code block end
                    inCodeBlock = false
                    const codeContent = codeLines.join('\n')
                    formatted.push(
                        <div key={`code-${index}`} className="relative group/code my-4">
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    onClick={() => handleCopyCode(codeContent)}
                                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                >
                                    {copiedCode === codeContent ? (
                                        <>
                                            <Check className="w-3 h-3" />
                                            Скопировано!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3" />
                                            Копировать
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="rounded-xl overflow-hidden border-2 border-neutral-200">
                                <div className="bg-neutral-800 px-4 py-2">
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                        {codeLanguage}
                                    </span>
                                </div>
                                <pre className="bg-[#1e1e1e] p-6 overflow-x-auto">
                                    <code className="text-sm text-gray-100 font-mono leading-relaxed">
                                        {codeContent}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    )
                    codeLines = []
                    codeLanguage = ''
                }
                return
            }

            if (inCodeBlock) {
                codeLines.push(line)
                return
            }

            // Headings
            if (line.startsWith('# ')) {
                formatted.push(
                    <h1 key={index} className="text-2xl font-black text-neutral-900 mt-6 mb-4 pb-2 border-b-2 border-primary-200">
                        {line.replace('# ', '')}
                    </h1>
                )
            } else if (line.startsWith('## ')) {
                formatted.push(
                    <h2 key={index} className="text-xl font-black text-neutral-900 mt-5 mb-3">
                        {line.replace('## ', '')}
                    </h2>
                )
            } else if (line.startsWith('### ')) {
                formatted.push(
                    <h3 key={index} className="text-lg font-bold text-neutral-800 mt-4 mb-2">
                        {line.replace('### ', '')}
                    </h3>
                )
            }
            // Numbered list
            else if (line.match(/^\d+\./)) {
                const text = line.replace(/^\d+\.\s*/, '')
                formatted.push(
                    <div key={index} className="flex gap-3 text-sm my-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-primary-100 text-primary-700">
                            {line.match(/^\d+/)?.[0]}
                        </span>
                        <span className="flex-1 text-neutral-700 leading-relaxed">{formatInlineText(text)}</span>
                    </div>
                )
            }
            // Bullet list
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const text = line.replace(/^[-*]\s*/, '')
                formatted.push(
                    <div key={index} className="flex gap-3 text-sm my-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-success-100 text-success-700">
                            ✓
                        </span>
                        <span className="flex-1 text-neutral-700 leading-relaxed">{formatInlineText(text)}</span>
                    </div>
                )
            }
            // Emoji numbered items (1️⃣, 2️⃣, etc.)
            else if (line.match(/^[0-9]️⃣/)) {
                formatted.push(
                    <div key={index} className="my-3">
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                            {formatInlineText(line)}
                        </p>
                    </div>
                )
            }
            // Blockquote
            else if (line.startsWith('> ')) {
                formatted.push(
                    <blockquote key={index} className="border-l-4 border-primary-500 bg-primary-50 pl-4 pr-4 py-3 my-4 rounded-r-lg">
                        <div className="text-sm text-primary-900 italic">
                            {formatInlineText(line.replace('> ', ''))}
                        </div>
                    </blockquote>
                )
            }
            // Empty line
            else if (line.trim() === '') {
                formatted.push(<div key={index} className="h-2"></div>)
            }
            // Regular paragraph
            else {
                formatted.push(
                    <p key={index} className="text-sm leading-relaxed text-neutral-700 mb-3">
                        {formatInlineText(line)}
                    </p>
                )
            }
        })

        return formatted
    }

    // Format inline text (bold, italic, inline code)
    const formatInlineText = (text: string) => {
        const parts: (string | JSX.Element)[] = []
        let currentText = text
        let key = 0

        // Inline code `code`
        const codeRegex = /`([^`]+)`/g
        let match
        let lastIndex = 0

        while ((match = codeRegex.exec(currentText)) !== null) {
            if (match.index > lastIndex) {
                parts.push(currentText.substring(lastIndex, match.index))
            }
            parts.push(
                <code key={`code-${key++}`} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded font-mono text-sm font-semibold border border-primary-200">
                    {match[1]}
                </code>
            )
            lastIndex = match.index + match[0].length
        }

        if (lastIndex < currentText.length) {
            parts.push(currentText.substring(lastIndex))
        }

        // Bold **text**
        const processedParts = parts.map((part, idx) => {
            if (typeof part === 'string') {
                const boldParts: (string | JSX.Element)[] = []
                const boldRegex = /\*\*([^*]+)\*\*/g
                let boldMatch
                let boldLastIndex = 0

                while ((boldMatch = boldRegex.exec(part)) !== null) {
                    if (boldMatch.index > boldLastIndex) {
                        boldParts.push(part.substring(boldLastIndex, boldMatch.index))
                    }
                    boldParts.push(
                        <strong key={`bold-${idx}-${key++}`} className="font-black text-neutral-900">
                            {boldMatch[1]}
                        </strong>
                    )
                    boldLastIndex = boldMatch.index + boldMatch[0].length
                }

                if (boldLastIndex < part.length) {
                    boldParts.push(part.substring(boldLastIndex))
                }

                return boldParts.length > 0 ? boldParts : part
            }
            return part
        }).flat()

        return processedParts
    }

    if (role === 'user') {
        return (
            <div className="flex justify-end group animate-slide-in">
                <div className="flex gap-6 max-w-[85%] flex-row-reverse">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white bg-primary-600 text-white">
                        <span className="text-lg font-black">{userName?.[0] || 'У'}</span>
                    </div>
                    <div className="p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden bg-gradient-to-br from-primary-600 to-blue-700 text-white rounded-tr-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                        <div className="text-sm font-black uppercase tracking-widest mb-3 opacity-30 italic">
                            {userName || 'Ученик'}
                        </div>
                        <div className="text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Assistant message with formatted content
    return (
        <div className="flex justify-start group animate-slide-in">
            <div className="flex gap-6 max-w-[90%]">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white bg-[#0a0a0c] text-primary-400">
                    <span className="text-2xl">🤖</span>
                </div>
                <div className="p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden bg-white border border-primary-50 text-neutral-950 rounded-tl-none">
                    <div className="text-sm font-black uppercase tracking-widest mb-4 text-primary-600 italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                        Mita AI
                    </div>
                    <div className="prose prose-sm max-w-none">
                        {formatContent(content)}
                    </div>
                </div>
            </div>
        </div>
    )
}

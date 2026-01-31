import { Copy, Check, Bot, User } from 'lucide-react'
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
                <code key={`code-${key++}`} className="px-1.5 py-0.5 bg-slate-100 text-indigo-600 rounded font-mono text-xs font-medium">
                    {match[1]}
                </code>
            )
            lastIndex = match.index + match[0].length
        }

        if (lastIndex < currentText.length) {
            parts.push(currentText.substring(lastIndex))
        }

        // Bold **text**
        return parts.map((part, idx) => {
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
                        <strong key={`bold-${idx}-${key++}`} className="font-semibold text-slate-900">
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
    }

    // Format content with markdown
    const formatContent = (text: string) => {
        const lines = text.split('\n')
        const formatted: JSX.Element[] = []
        let inCodeBlock = false
        let codeLanguage = ''
        let codeLines: string[] = []

        lines.forEach((line, index) => {
            // Code block
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true
                    codeLanguage = line.replace('```', '').trim() || 'code'
                } else {
                    inCodeBlock = false
                    const codeContent = codeLines.join('\n')
                    formatted.push(
                        <div key={`code-${index}`} className="my-3 group/code">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400">{codeLanguage}</span>
                                    <button
                                        onClick={() => handleCopyCode(codeContent)}
                                        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                    >
                                        {copiedCode === codeContent ? (
                                            <><Check className="w-3 h-3" /> Скопировано</>
                                        ) : (
                                            <><Copy className="w-3 h-3" /> Копировать</>
                                        )}
                                    </button>
                                </div>
                                <pre className="bg-slate-900 p-4 overflow-x-auto">
                                    <code className="text-sm text-slate-100 font-mono">{codeContent}</code>
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
            if (line.startsWith('### ')) {
                formatted.push(<h4 key={index} className="text-sm font-bold text-slate-900 mt-3 mb-1">{line.replace('### ', '')}</h4>)
            } else if (line.startsWith('## ')) {
                formatted.push(<h3 key={index} className="text-base font-bold text-slate-900 mt-4 mb-2">{line.replace('## ', '')}</h3>)
            } else if (line.startsWith('# ')) {
                formatted.push(<h2 key={index} className="text-lg font-bold text-slate-900 mt-4 mb-2">{line.replace('# ', '')}</h2>)
            }
            // Numbered list
            else if (line.match(/^\d+\./)) {
                const text = line.replace(/^\d+\.\s*/, '')
                const num = line.match(/^\d+/)?.[0]
                formatted.push(
                    <div key={index} className="flex gap-2 my-1.5">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{num}</span>
                        <span className="flex-1 text-sm text-slate-600 leading-relaxed">{formatInlineText(text)}</span>
                    </div>
                )
            }
            // Bullet list
            else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                const text = line.replace(/^[-*•]\s*/, '')
                formatted.push(
                    <div key={index} className="flex gap-2 my-1.5">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2" />
                        <span className="flex-1 text-sm text-slate-600 leading-relaxed">{formatInlineText(text)}</span>
                    </div>
                )
            }
            // Blockquote
            else if (line.startsWith('> ')) {
                formatted.push(
                    <blockquote key={index} className="border-l-3 border-indigo-300 bg-indigo-50 pl-3 pr-3 py-2 my-2 rounded-r-lg text-sm text-indigo-800 italic">
                        {formatInlineText(line.replace('> ', ''))}
                    </blockquote>
                )
            }
            // Empty line
            else if (line.trim() === '') {
                formatted.push(<div key={index} className="h-2" />)
            }
            // Regular paragraph
            else {
                formatted.push(
                    <p key={index} className="text-sm leading-relaxed text-slate-600 mb-2">{formatInlineText(line)}</p>
                )
            }
        })

        return formatted
    }

    // User message
    if (role === 'user') {
        return (
            <div className="flex justify-end">
                <div className="flex gap-3 max-w-[80%]">
                    <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                        <p className="text-sm whitespace-pre-wrap">{content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                </div>
            </div>
        )
    }

    // Assistant message
    return (
        <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-100">
                    <div className="prose prose-sm max-w-none">
                        {formatContent(content)}
                    </div>
                </div>
            </div>
        </div>
    )
}

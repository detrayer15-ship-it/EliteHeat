import { useState } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'

export const Terminal = () => {
    const [history, setHistory] = useState<string[]>([
        '$ Welcome to EliteHeat Terminal',
        '$ Type "help" for available commands',
    ])
    const [input, setInput] = useState('')

    const commands: Record<string, string> = {
        help: 'Available commands: help, clear, npm, git, ls',
        clear: '',
        ls: 'README.md  package.json  src/',
        'npm install': '✓ Dependencies installed',
        'npm run dev': '✓ Development server started on http://localhost:5173',
        'git status': 'On branch main\nnothing to commit, working tree clean',
    }

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim()

        if (trimmedCmd === 'clear') {
            setHistory([])
            return
        }

        const output = commands[trimmedCmd] || `Command not found: ${trimmedCmd}`
        setHistory(prev => [...prev, `$ ${trimmedCmd}`, output])
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input)
            setInput('')
        }
    }

    return (
        <div className="h-full bg-[#1e1e1e] flex flex-col">
            {/* Terminal Header */}
            <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3 gap-2">
                <TerminalIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Terminal</span>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
                {history.map((line, idx) => (
                    <div
                        key={idx}
                        className={`${line.startsWith('$') ? 'text-green-400' : 'text-gray-300'
                            }`}
                    >
                        {line}
                    </div>
                ))}

                {/* Input Line */}
                <div className="flex items-center gap-2 text-green-400">
                    <span>$</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-transparent outline-none text-gray-300"
                        placeholder="Type a command..."
                        autoFocus
                    />
                </div>
            </div>
        </div>
    )
}

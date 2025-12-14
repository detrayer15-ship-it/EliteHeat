import { useState } from 'react'
import { FileExplorer } from './FileExplorer'
import { CodeEditor } from './CodeEditor'
import { AIAssistantPanel } from './AIAssistantPanel'
import { Terminal } from './Terminal'
import type { Project } from '@/types/project'

interface IDELayoutProps {
    project: Project
    updateProject: (updates: any) => Promise<void>
}

export const IDELayout = ({ project, updateProject }: IDELayoutProps) => {
    const [selectedFile, setSelectedFile] = useState<string>('README.md')
    const [fileContents, setFileContents] = useState<Record<string, string>>({
        'README.md': `# ${project.title}\n\n${project.description}\n\n## Технологии\n- Frontend: ${project.techStack?.frontend}\n- Backend: ${project.techStack?.backend}\n- Database: ${project.techStack?.db}`,
    })
    const [fileStructure, setFileStructure] = useState<any>({
        'README.md': '',
        'src/': {
            'App.tsx': '',
            'index.tsx': '',
            'components/': {
                'Header.tsx': '',
            }
        },
        'package.json': '',
    })
    const [showTerminal, setShowTerminal] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleFileSelect = (filePath: string) => {
        setSelectedFile(filePath)

        // Load file content if exists
        if (!fileContents[filePath]) {
            // Generate default content based on file type
            let defaultContent = ''

            if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
                const componentName = filePath.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || 'Component'
                defaultContent = `import React from 'react'\n\nexport const ${componentName} = () => {\n  return (\n    <div>\n      <h1>${componentName}</h1>\n    </div>\n  )\n}\n`
            } else if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
                defaultContent = `// ${filePath}\n\n`
            } else if (filePath.endsWith('.css')) {
                defaultContent = `/* ${filePath} */\n\n`
            } else if (filePath.endsWith('.html')) {
                defaultContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>`
            } else if (filePath.endsWith('.json')) {
                defaultContent = `{\n  "name": "${project.title.toLowerCase().replace(/\s+/g, '-')}",\n  "version": "1.0.0"\n}`
            }

            setFileContents(prev => ({ ...prev, [filePath]: defaultContent }))
        }
    }

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setFileContents(prev => ({ ...prev, [selectedFile]: value }))
        }
    }

    const handleCreateFile = (path: string, name: string) => {
        const fullPath = path ? `${path}/${name}` : name
        setFileContents(prev => ({ ...prev, [fullPath]: '' }))

        // Update file structure
        // This is simplified - in real app would need proper tree manipulation
        console.log('Created file:', fullPath)
        setSelectedFile(fullPath)
    }

    const handleCreateFolder = (path: string, name: string) => {
        const fullPath = path ? `${path}/${name}/` : `${name}/`
        console.log('Created folder:', fullPath)
    }

    const handleDeleteItem = (path: string) => {
        setFileContents(prev => {
            const newContents = { ...prev }
            delete newContents[path]
            return newContents
        })

        if (selectedFile === path) {
            setSelectedFile('README.md')
        }
    }

    const currentContent = fileContents[selectedFile] || ''
    const language = selectedFile.endsWith('.tsx') || selectedFile.endsWith('.ts') ? 'typescript' :
        selectedFile.endsWith('.jsx') || selectedFile.endsWith('.js') ? 'javascript' :
            selectedFile.endsWith('.css') ? 'css' :
                selectedFile.endsWith('.html') ? 'html' :
                    selectedFile.endsWith('.json') ? 'json' :
                        'markdown'

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} flex flex-col bg-[#1e1e1e]`}>
            {/* Top Bar */}
            <div className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-4 gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm text-gray-300">{project.title}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{selectedFile}</span>
                </div>
                <button
                    onClick={() => setShowTerminal(!showTerminal)}
                    className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                    {showTerminal ? 'Hide' : 'Show'} Terminal
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - File Explorer */}
                {!isFullscreen && (
                    <div className="w-64 bg-[#252526] border-r border-[#3e3e42] overflow-y-auto">
                        <FileExplorer
                            files={fileStructure}
                            selectedFile={selectedFile}
                            onFileSelect={handleFileSelect}
                            onCreateFile={handleCreateFile}
                            onCreateFolder={handleCreateFolder}
                            onDeleteItem={handleDeleteItem}
                        />
                    </div>
                )}

                {/* Center - Code Editor */}
                <div className="flex-1 flex flex-col">
                    <CodeEditor
                        file={selectedFile}
                        content={currentContent}
                        onChange={handleCodeChange}
                        language={language}
                        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
                        isFullscreen={isFullscreen}
                    />

                    {/* Terminal */}
                    {showTerminal && !isFullscreen && (
                        <div className="h-48 border-t border-[#3e3e42]">
                            <Terminal />
                        </div>
                    )}
                </div>

                {/* Right Sidebar - AI Assistant */}
                {!isFullscreen && (
                    <div className="w-80 bg-[#252526] border-l border-[#3e3e42] overflow-y-auto">
                        <AIAssistantPanel
                            project={project}
                            currentFile={selectedFile}
                            currentCode={currentContent}
                        />
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-purple-600 flex items-center px-4 text-xs text-white">
                <span className="mr-4">✓ Ready</span>
                <span className="mr-4">Файлов: {Object.keys(fileContents).length}</span>
                <span>Строк: {currentContent.split('\n').length}</span>
                <span className="ml-auto">💡 Нажмите ! и Tab для HTML шаблона</span>
            </div>
        </div>
    )
}

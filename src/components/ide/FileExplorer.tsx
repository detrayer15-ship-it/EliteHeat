import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2, Edit2 } from 'lucide-react'

interface FileExplorerProps {
    files: any
    selectedFile: string
    onFileSelect: (path: string) => void
    onCreateFile?: (path: string, name: string) => void
    onCreateFolder?: (path: string, name: string) => void
    onDeleteItem?: (path: string) => void
}

export const FileExplorer = ({
    files,
    selectedFile,
    onFileSelect,
    onCreateFile,
    onCreateFolder,
    onDeleteItem
}: FileExplorerProps) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src/']))
    const [creatingItem, setCreatingItem] = useState<{ type: 'file' | 'folder'; path: string } | null>(null)
    const [newItemName, setNewItemName] = useState('')

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(path)) {
            newExpanded.delete(path)
        } else {
            newExpanded.add(path)
        }
        setExpandedFolders(newExpanded)
    }

    const handleCreateItem = () => {
        if (!creatingItem || !newItemName.trim()) return

        if (creatingItem.type === 'file' && onCreateFile) {
            onCreateFile(creatingItem.path, newItemName)
        } else if (creatingItem.type === 'folder' && onCreateFolder) {
            onCreateFolder(creatingItem.path, newItemName)
        }

        setCreatingItem(null)
        setNewItemName('')
    }

    const renderItem = (name: string, content: any, path: string = '', level: number = 0) => {
        const fullPath = path ? `${path}${name}` : name
        const isFolder = typeof content === 'object' && !name.includes('.')
        const isExpanded = expandedFolders.has(fullPath)
        const isSelected = selectedFile === fullPath

        if (isFolder) {
            return (
                <div key={fullPath}>
                    <div className="group relative">
                        <div
                            className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] transition-colors ${isSelected ? 'bg-[#37373d]' : ''
                                }`}
                            style={{ paddingLeft: `${level * 12 + 8}px` }}
                        >
                            <div className="flex items-center gap-1 flex-1" onClick={() => toggleFolder(fullPath)}>
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                                {isExpanded ? (
                                    <FolderOpen className="w-4 h-4 text-purple-400" />
                                ) : (
                                    <Folder className="w-4 h-4 text-purple-400" />
                                )}
                                <span className="text-sm text-gray-300">{name.replace('/', '')}</span>
                            </div>

                            {/* Action buttons */}
                            <div className="hidden group-hover:flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCreatingItem({ type: 'file', path: fullPath })
                                    }}
                                    className="p-1 hover:bg-[#3e3e42] rounded"
                                    title="Новый файл"
                                >
                                    <File className="w-3 h-3 text-green-400" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCreatingItem({ type: 'folder', path: fullPath })
                                    }}
                                    className="p-1 hover:bg-[#3e3e42] rounded"
                                    title="Новая папка"
                                >
                                    <Plus className="w-3 h-3 text-blue-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isExpanded && (
                        <div>
                            {/* Creating new item */}
                            {creatingItem?.path === fullPath && (
                                <div
                                    className="flex items-center gap-2 px-2 py-1 bg-[#2a2d2e]"
                                    style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                                >
                                    {creatingItem.type === 'file' ? (
                                        <File className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Folder className="w-4 h-4 text-blue-400" />
                                    )}
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
                                        onBlur={handleCreateItem}
                                        className="flex-1 bg-[#3c3c3c] text-gray-300 text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        placeholder={creatingItem.type === 'file' ? 'filename.js' : 'folder-name'}
                                        autoFocus
                                    />
                                </div>
                            )}

                            {Object.entries(content).map(([childName, childContent]) =>
                                renderItem(childName, childContent, fullPath, level + 1)
                            )}
                        </div>
                    )}
                </div>
            )
        }

        // File
        const getFileIcon = (fileName: string) => {
            if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return '⚛️'
            if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return '📜'
            if (fileName.endsWith('.css')) return '🎨'
            if (fileName.endsWith('.json')) return '📦'
            if (fileName.endsWith('.md')) return '📝'
            if (fileName.endsWith('.html')) return '🌐'
            return '📄'
        }

        return (
            <div
                key={fullPath}
                className="group relative"
            >
                <div
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] transition-colors ${isSelected ? 'bg-[#37373d] border-l-2 border-purple-500' : ''
                        }`}
                    style={{ paddingLeft: `${level * 12 + 24}px` }}
                    onClick={() => onFileSelect(fullPath)}
                >
                    <span className="text-sm">{getFileIcon(name)}</span>
                    <span className={`text-sm flex-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {name}
                    </span>

                    {/* Delete button */}
                    {onDeleteItem && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`Удалить ${name}?`)) {
                                    onDeleteItem(fullPath)
                                }
                            }}
                            className="hidden group-hover:block p-1 hover:bg-red-900/30 rounded"
                            title="Удалить"
                        >
                            <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="px-3 py-2 border-b border-[#3e3e42] flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Explorer
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => setCreatingItem({ type: 'file', path: '' })}
                        className="p-1 hover:bg-[#3e3e42] rounded"
                        title="Новый файл"
                    >
                        <File className="w-3 h-3 text-green-400" />
                    </button>
                    <button
                        onClick={() => setCreatingItem({ type: 'folder', path: '' })}
                        className="p-1 hover:bg-[#3e3e42] rounded"
                        title="Новая папка"
                    >
                        <Plus className="w-3 h-3 text-blue-400" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {/* Creating root item */}
                {creatingItem?.path === '' && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-[#2a2d2e] mx-2 mb-2 rounded">
                        {creatingItem.type === 'file' ? (
                            <File className="w-4 h-4 text-green-400" />
                        ) : (
                            <Folder className="w-4 h-4 text-blue-400" />
                        )}
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
                            onBlur={handleCreateItem}
                            className="flex-1 bg-[#3c3c3c] text-gray-300 text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder={creatingItem.type === 'file' ? 'filename.js' : 'folder-name'}
                            autoFocus
                        />
                    </div>
                )}

                {Object.entries(files).map(([name, content]) => renderItem(name, content))}
            </div>
        </div>
    )
}

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Toast Types
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Toast Provider Component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newToast = { ...toast, id, duration: toast.duration || 5000 }
        setToasts(prev => [...prev, newToast])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const success = (title: string, message?: string) => addToast({ type: 'success', title, message })
    const error = (title: string, message?: string) => addToast({ type: 'error', title, message })
    const info = (title: string, message?: string) => addToast({ type: 'info', title, message })
    const warning = (title: string, message?: string) => addToast({ type: 'warning', title, message })

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

// Toast Container
const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

// Single Toast Item
const ToastItem = ({ toast, onClose }: { toast: Toast, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, toast.duration || 5000)
        return () => clearTimeout(timer)
    }, [toast.duration, onClose])

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
    }

    const colors = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-amber-50 border-amber-200'
    }

    const titleColors = {
        success: 'text-emerald-900',
        error: 'text-red-900',
        info: 'text-blue-900',
        warning: 'text-amber-900'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`pointer-events-auto ${colors[toast.type]} border rounded-2xl p-4 shadow-xl backdrop-blur-sm flex items-start gap-3`}
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[toast.type]}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${titleColors[toast.type]}`}>{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-slate-600 mt-1">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
            >
                <X className="w-4 h-4 text-slate-400" />
            </button>

            {/* Progress bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-2xl"
                style={{ color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#3b82f6' }}
            />
        </motion.div>
    )
}

export default ToastProvider

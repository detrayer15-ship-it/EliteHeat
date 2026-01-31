import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ error, errorInfo })

        // You can log to an error reporting service here
        // Example: logErrorToService(error, errorInfo)
    }

    handleReload = () => {
        window.location.reload()
    }

    handleGoHome = () => {
        window.location.href = '/dashboard'
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-lg w-full"
                    >
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                    className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
                                >
                                    <AlertTriangle className="w-10 h-10 text-red-500" />
                                </motion.div>

                                {/* Title */}
                                <h1 className="text-2xl font-black text-slate-900 mb-3">
                                    Что-то пошло не так
                                </h1>

                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    Произошла непредвиденная ошибка. Мы уже работаем над её исправлением!
                                </p>

                                {/* Error Details (Development only) */}
                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Bug className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Детали ошибки (dev)
                                            </span>
                                        </div>
                                        <code className="text-xs text-red-600 break-all">
                                            {this.state.error.message}
                                        </code>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={this.handleReset}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Попробовать снова
                                    </button>

                                    <button
                                        onClick={this.handleGoHome}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white transition-colors shadow-lg shadow-indigo-200"
                                    >
                                        <Home className="w-4 h-4" />
                                        На главную
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-xs text-slate-400 mt-6">
                            Если проблема повторяется, обратитесь в поддержку
                        </p>
                    </motion.div>
                </div>
            )
        }

        return this.props.children
    }
}

// Functional wrapper for easier use with hooks
export const withErrorBoundary = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        )
    }
}

export default ErrorBoundary

import { ReactNode } from 'react'

// Base Skeleton Component
export const Skeleton = ({
    className = '',
    animate = true
}: {
    className?: string
    animate?: boolean
}) => {
    return (
        <div
            className={`bg-slate-200 rounded-lg ${animate ? 'animate-pulse' : ''} ${className}`}
        />
    )
}

// Card Skeleton
export const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
            </div>
        </div>
    )
}

// List Item Skeleton
export const SkeletonListItem = () => {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="w-20 h-8 rounded-xl" />
        </div>
    )
}

// Avatar Skeleton
export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }
    return <Skeleton className={`${sizes[size]} rounded-full`} />
}

// Text Skeleton
export const SkeletonText = ({ lines = 3, className = '' }: { lines?: number, className?: string }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
                />
            ))}
        </div>
    )
}

// Button Skeleton
export const SkeletonButton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
        sm: 'h-8 w-20',
        md: 'h-10 w-28',
        lg: 'h-12 w-36'
    }
    return <Skeleton className={`${sizes[size]} rounded-xl`} />
}

// Stats Card Skeleton
export const SkeletonStats = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-20" />
        </div>
    )
}

// Dashboard Skeleton
export const SkeletonDashboard = () => {
    return (
        <div className="space-y-8 p-6 animate-pulse">
            {/* Hero Section */}
            <div className="bg-slate-900 rounded-[3rem] h-[400px] p-8">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32 bg-slate-700" />
                    <Skeleton className="h-12 w-64 bg-slate-700" />
                    <Skeleton className="h-6 w-48 bg-slate-700" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonStats />
                <SkeletonStats />
                <SkeletonStats />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    )
}

// Table Skeleton
export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 border-b border-slate-100">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    )
}

// Chat Message Skeleton
export const SkeletonChatMessage = ({ isUser = false }: { isUser?: boolean }) => {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isUser ? 'bg-blue-50' : 'bg-slate-50'} rounded-2xl p-4`}>
                <SkeletonText lines={2} />
            </div>
        </div>
    )
}

// Full Page Loading Skeleton
export const SkeletonPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-3">
                        <SkeletonButton size="sm" />
                        <SkeletonAvatar size="md" />
                    </div>
                </div>

                {/* Content */}
                <SkeletonDashboard />
            </div>
        </div>
    )
}

export default Skeleton

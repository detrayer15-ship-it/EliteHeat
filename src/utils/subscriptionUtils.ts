// Subscription utility functions for managing subscription plans and countdown

export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime' | 'family'

export interface SubscriptionInfo {
    plan: SubscriptionPlan
    daysRemaining: number
    startDate: Date
    endDate: Date | null
    status: 'active' | 'expired' | 'cancelled'
}

// Plan duration mapping in days
export const PLAN_DURATIONS: Record<SubscriptionPlan, number> = {
    monthly: 30,
    yearly: 365,
    lifetime: -1, // -1 indicates no expiration
    family: 30
}

/**
 * Calculate subscription end date based on plan type
 */
export function calculateEndDate(startDate: Date, plan: SubscriptionPlan): Date | null {
    const duration = PLAN_DURATIONS[plan]

    if (duration === -1) {
        return null // Lifetime subscription has no end date
    }

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration)
    return endDate
}

/**
 * Calculate days remaining in subscription
 */
export function calculateDaysRemaining(endDate: Date | null): number {
    if (!endDate) {
        return -1 // Lifetime subscription
    }

    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(endDate: Date | null): boolean {
    if (!endDate) {
        return true // Lifetime subscription is always active
    }

    const now = new Date()
    return now < endDate
}

/**
 * Get subscription status
 */
export function getSubscriptionStatus(endDate: Date | null): 'active' | 'expired' {
    return isSubscriptionActive(endDate) ? 'active' : 'expired'
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(days: number): string {
    if (days === -1) {
        return 'Навсегда'
    }

    if (days === 0) {
        return 'Истекает сегодня'
    }

    if (days === 1) {
        return '1 день'
    }

    if (days >= 2 && days <= 4) {
        return `${days} дня`
    }

    return `${days} дней`
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: SubscriptionPlan): string {
    const names: Record<SubscriptionPlan, string> = {
        monthly: 'Месячная',
        yearly: 'Годовая',
        lifetime: 'Пожизненная',
        family: 'Семейная'
    }

    return names[plan]
}

/**
 * Create subscription info from plan
 */
export function createSubscriptionInfo(plan: SubscriptionPlan, startDate: Date = new Date()): SubscriptionInfo {
    const endDate = calculateEndDate(startDate, plan)
    const daysRemaining = calculateDaysRemaining(endDate)
    const status = getSubscriptionStatus(endDate)

    return {
        plan,
        daysRemaining,
        startDate,
        endDate,
        status
    }
}

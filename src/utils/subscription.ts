/**
 * Subscription utilities for calculating expiry dates and days remaining
 */

export type SubscriptionType = 'monthly' | 'yearly' | 'family' | 'lifetime';

export interface SubscriptionInfo {
    type: SubscriptionType;
    startDate: Date;
    expiryDate: Date | null; // null for lifetime
    daysRemaining: number | null; // null for lifetime
    isActive: boolean;
}

/**
 * Get subscription duration in days based on type
 */
export function getSubscriptionDuration(type: SubscriptionType): number | null {
    switch (type) {
        case 'monthly':
            return 30;
        case 'yearly':
            return 365;
        case 'family':
            return 60;
        case 'lifetime':
            return null; // No expiry
        default:
            return 30;
    }
}

/**
 * Calculate subscription expiry date
 */
export function calculateExpiryDate(startDate: Date, type: SubscriptionType): Date | null {
    const duration = getSubscriptionDuration(type);

    if (duration === null) {
        return null; // Lifetime subscription
    }

    const expiry = new Date(startDate);
    expiry.setDate(expiry.getDate() + duration);
    return expiry;
}

/**
 * Calculate days remaining in subscription
 */
export function calculateDaysRemaining(expiryDate: Date | null): number | null {
    if (expiryDate === null) {
        return null; // Lifetime subscription
    }

    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
}

/**
 * Format expiry date for display
 */
export function formatExpiryDate(expiryDate: Date | null): string {
    if (expiryDate === null) {
        return 'Навсегда';
    }

    return expiryDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(days: number | null): string {
    if (days === null) {
        return 'Навсегда';
    }

    if (days === 0) {
        return 'Истекла';
    }

    if (days === 1) {
        return '1 день';
    }

    if (days >= 2 && days <= 4) {
        return `${days} дня`;
    }

    return `${days} дней`;
}

/**
 * Get subscription type label in Russian
 */
export function getSubscriptionTypeLabel(type: SubscriptionType): string {
    switch (type) {
        case 'monthly':
            return 'Месячная';
        case 'yearly':
            return 'Годовая';
        case 'family':
            return 'Семейная';
        case 'lifetime':
            return 'Навсегда';
        default:
            return 'Месячная';
    }
}

/**
 * Calculate progress percentage (0-100)
 */
export function calculateProgress(startDate: Date, expiryDate: Date | null): number {
    if (expiryDate === null) {
        return 100; // Lifetime is always 100%
    }

    const now = new Date();
    const total = expiryDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    const progress = (elapsed / total) * 100;
    return Math.min(100, Math.max(0, 100 - progress));
}

/**
 * Get full subscription info
 */
export function getSubscriptionInfo(
    type: SubscriptionType,
    startDate: Date = new Date()
): SubscriptionInfo {
    const expiryDate = calculateExpiryDate(startDate, type);
    const daysRemaining = calculateDaysRemaining(expiryDate);
    const isActive = daysRemaining === null || daysRemaining > 0;

    return {
        type,
        startDate,
        expiryDate,
        daysRemaining,
        isActive
    };
}

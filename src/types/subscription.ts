export type SubscriptionTier = 'monthly' | 'yearly' | 'lifetime' | 'none'
export type SubscriptionStatus = 'active' | 'expired' | 'none'

export interface Subscription {
    tier: SubscriptionTier
    status: SubscriptionStatus
    startDate: string | null
    expiryDate: string | null
    price: number
}

export interface SubscriptionPlan {
    id: SubscriptionTier
    name: string
    price: number
    duration: string
    features: string[]
    popular?: boolean
}

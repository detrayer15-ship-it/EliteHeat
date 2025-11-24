import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Subscription, SubscriptionTier } from '@/types/subscription'

interface SubscriptionStore {
    subscription: Subscription
    activateSubscription: (tier: SubscriptionTier, price: number) => void
    checkSubscriptionStatus: () => boolean
    getRemainingDays: () => number
}

export const useSubscriptionStore = create<SubscriptionStore>()(
    persist(
        (set, get) => ({
            subscription: {
                tier: 'none',
                status: 'none',
                startDate: null,
                expiryDate: null,
                price: 0,
            },

            activateSubscription: (tier: SubscriptionTier, price: number) => {
                const startDate = new Date()
                let expiryDate: Date | null = null

                if (tier === 'monthly') {
                    expiryDate = new Date(startDate)
                    expiryDate.setMonth(expiryDate.getMonth() + 1)
                } else if (tier === 'yearly') {
                    expiryDate = new Date(startDate)
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
                }
                // lifetime has no expiry date

                set({
                    subscription: {
                        tier,
                        status: 'active',
                        startDate: startDate.toISOString(),
                        expiryDate: expiryDate ? expiryDate.toISOString() : null,
                        price,
                    },
                })
            },

            checkSubscriptionStatus: () => {
                const { subscription } = get()

                if (subscription.tier === 'none') {
                    return false
                }

                if (subscription.tier === 'lifetime') {
                    return true
                }

                if (subscription.expiryDate) {
                    const now = new Date()
                    const expiry = new Date(subscription.expiryDate)

                    if (now > expiry) {
                        set({
                            subscription: {
                                ...subscription,
                                status: 'expired',
                            },
                        })
                        return false
                    }
                }

                return subscription.status === 'active'
            },

            getRemainingDays: () => {
                const { subscription } = get()

                if (subscription.tier === 'lifetime') {
                    return -1 // unlimited
                }

                if (!subscription.expiryDate) {
                    return 0
                }

                const now = new Date()
                const expiry = new Date(subscription.expiryDate)
                const diffTime = expiry.getTime() - now.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                return diffDays > 0 ? diffDays : 0
            },
        }),
        {
            name: 'subscription-storage',
        }
    )
)

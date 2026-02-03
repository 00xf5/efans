/**
 * Loyalty Calibration Utility
 * Manages the distribution of tiered resonance badges and loyalty recognition.
 */

export type LoyaltyTier = 'Acquaintance' | 'Acolyte' | 'Zealot' | 'Sovereign Soul';

export interface TierInfo {
    label: LoyaltyTier;
    minSpend: number;
    color: string;
    icon: string;
}

export const LOYALTY_TIERS: TierInfo[] = [
    { label: 'Sovereign Soul', minSpend: 250000, color: 'text-amber-500', icon: '👑' },
    { label: 'Zealot', minSpend: 50000, color: 'text-rose-500', icon: '🔥' },
    { label: 'Acolyte', minSpend: 5000, color: 'text-blue-500', icon: '💎' },
    { label: 'Acquaintance', minSpend: 0, color: 'text-zinc-500', icon: '✨' }
];

export function calculateLoyaltyTier(lifetimeSpend: number): LoyaltyTier {
    const tier = LOYALTY_TIERS.find(t => lifetimeSpend >= t.minSpend);
    return tier ? tier.label : 'Acquaintance';
}

export function getTierBadge(tier: LoyaltyTier): TierInfo {
    return LOYALTY_TIERS.find(t => t.label === tier) || LOYALTY_TIERS[3];
}

export function hasRequiredTier(currentTier: LoyaltyTier, requiredTier: LoyaltyTier): boolean {
    const currentIndex = LOYALTY_TIERS.findIndex(t => t.label === currentTier);
    const requiredIndex = LOYALTY_TIERS.findIndex(t => t.label === requiredTier);

    // Lower index means higher tier in our array (Sovereign Soul is 0, Acquaintance is 3)
    return currentIndex <= requiredIndex;
}

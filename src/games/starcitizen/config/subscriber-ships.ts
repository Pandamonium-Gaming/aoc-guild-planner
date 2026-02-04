/**
 * Star Citizen Subscriber Ship Promotions
 * 
 * These are the ships granted to subscribers each month based on their subscription tier.
 * Updated monthly from https://robertsspaceindustries.com/en/comm-link/
 * 
 * Tiers:
 * - centurion: Base subscription ($10/month) - Gold/Bronze branding
 * - imperator: Premium subscription ($20/month) - Platinum/Silver branding
 * 
 * Source: https://robertsspaceindustries.com/pledge/subscriptions
 * Comm-Link Pattern: https://robertsspaceindustries.com/comm-link/transmission/[ID]-[Month]-[Year]-Subscriber-Promotions
 */

/**
 * Subscriber tier branding colors
 * Based on RSI's official subscriber page styling
 */
export const SUBSCRIBER_COLORS = {
  centurion: {
    primary: '#D4AF37',   // Gold
    secondary: '#A67C00', // Darker gold
    bg: '#2A2416',        // Dark gold tint
    border: '#8B7355',    // Bronze
  },
  imperator: {
    primary: '#E5E4E2',   // Platinum
    secondary: '#C0C0C0', // Silver
    bg: '#1A1D21',        // Dark platinum tint
    border: '#6B7280',    // Steel grey
  },
} as const;

/**
 * Subscriber tier metadata
 */
export const SUBSCRIBER_TIERS = {
  centurion: {
    label: 'Centurion',
    price: '$10/month',
    shipsPerMonth: 1,
    flairPerMonth: 1,
    insurance: '12 months',
    icon: '🥉', // Bronze medal
  },
  imperator: {
    label: 'Imperator',
    price: '$20/month',
    shipsPerMonth: 2,
    flairPerMonth: 2,
    insurance: '24 months',
    icon: '🥈', // Silver medal
  },
} as const;

export interface SubscriberShipMonth {
  label: string; // e.g., "January 2026"
  centurion: string[]; // Ships for base subscribers
  imperator: string[]; // Ships for premium subscribers (includes centurion ships)
  flair?: string; // Monthly cosmetic item
  notes?: string;
}

export const SUBSCRIBER_SHIPS: Record<string, SubscriberShipMonth> = {
  '2026-01': {
    label: 'January 2026',
    centurion: ['Aegis Sabre'],
    imperator: ['Aegis Sabre', 'Sabre Firebird', 'Sabre Peregrine'],
    flair: "CC's Conversions Azreal Helmet",
    notes: 'Sabre (12m insurance for Centurion, 24m for Imperator)',
  },
  '2026-02': {
    label: 'February 2026',
    centurion: ['MISC Starlancer MAX'],
    imperator: ['MISC Starlancer MAX', 'MISC Starlancer TAC'],
    flair: 'Coramor Décor Collection (Pink Heart Lamp, Carmilla Nightstand)',
    notes: 'Starlancer MAX (12m insurance for Centurion, 24m for Imperator)',
  },
  // Add more months as they're announced
  // '2026-03': { ... }
};

/**
 * Get all ships a subscriber should have for a given month
 */
export function getSubscriberShips(
  tier: 'centurion' | 'imperator' | null | undefined,
  month?: string
): string[] {
  if (!tier) return [];
  
  const key = month || getCurrentMonthKey();
  const monthData = SUBSCRIBER_SHIPS[key];
  
  if (!monthData) return [];
  
  if (tier === 'imperator') {
    return monthData.imperator;
  }
  
  return monthData.centurion;
}

/**
 * Get the current month key (YYYY-MM)
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get subscriber info for display
 */
export function getSubscriberMonthInfo(month?: string): SubscriberShipMonth | null {
  const key = month || getCurrentMonthKey();
  return SUBSCRIBER_SHIPS[key] || null;
}

/**
 * Check if a character has the current month's subscriber ships
 * (useful for detecting if ships need to be re-synced when tier changes)
 */
export function hasCurrentSubscriberShips(
  characterShips: string[],
  subscriberTier: string | null | undefined,
  month?: string
): boolean {
  if (!subscriberTier) return false;
  
  const shouldHave = getSubscriberShips(subscriberTier as any, month);
  return shouldHave.every(ship => characterShips.includes(ship));
}

import { useState, useEffect } from 'react';
import { useSelliOra } from './useSelliora';

export interface SubscriptionLimits {
  users: { max: number; current: number };
  adminUsers: { max: number; current: number };
  clientEntities: { max: number; current: number };
  shops: { max: number; current: number };
  monthlyListings: { max: number; current: number };
  nexPilotRequests: { max: number; current: number };
  socialPilotBots: { max: number; current: number };
  storage: { max: number; current: number }; // in GB
}

export interface PlanLimits {
  starter: SubscriptionLimits;
  essential: SubscriptionLimits;
  popular: SubscriptionLimits;
  premium: SubscriptionLimits;
  enterprise: SubscriptionLimits;
}

const PLAN_LIMITS: PlanLimits = {
  starter: {
    users: { max: 1, current: 0 },
    adminUsers: { max: 1, current: 0 },
    clientEntities: { max: 0, current: 0 },
    shops: { max: 0, current: 0 },
    monthlyListings: { max: 4, current: 0 },
    nexPilotRequests: { max: 90, current: 0 },
    socialPilotBots: { max: 1, current: 0 },
    storage: { max: 1, current: 0 }
  },
  essential: {
    users: { max: 3, current: 0 },
    adminUsers: { max: 1, current: 0 },
    clientEntities: { max: 0, current: 0 },
    shops: { max: 2, current: 0 },
    monthlyListings: { max: 12, current: 0 },
    nexPilotRequests: { max: 200, current: 0 },
    socialPilotBots: { max: 3, current: 0 },
    storage: { max: 5, current: 0 }
  },
  popular: {
    users: { max: 8, current: 0 },
    adminUsers: { max: 3, current: 0 },
    clientEntities: { max: 4, current: 0 },
    shops: { max: 5, current: 0 },
    monthlyListings: { max: 27, current: 0 },
    nexPilotRequests: { max: 500, current: 0 },
    socialPilotBots: { max: 6, current: 0 },
    storage: { max: 20, current: 0 }
  },
  premium: {
    users: { max: 29, current: 0 },
    adminUsers: { max: 5, current: 0 },
    clientEntities: { max: 10, current: 0 },
    shops: { max: -1, current: 0 }, // Unlimited
    monthlyListings: { max: -1, current: 0 },
    nexPilotRequests: { max: 1300, current: 0 },
    socialPilotBots: { max: -1, current: 0 },
    storage: { max: 100, current: 0 }
  },
  enterprise: {
    users: { max: -1, current: 0 }, // Unlimited
    adminUsers: { max: -1, current: 0 },
    clientEntities: { max: -1, current: 0 },
    shops: { max: -1, current: 0 },
    monthlyListings: { max: -1, current: 0 },
    nexPilotRequests: { max: -1, current: 0 },
    socialPilotBots: { max: -1, current: 0 },
    storage: { max: -1, current: 0 }
  }
};

export function useSubscriptionLimits() {
  const { currentOrganization } = useSelliOra();
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrganization) {
      calculateCurrentUsage();
    }
  }, [currentOrganization]);

  const calculateCurrentUsage = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      
      const plan = currentOrganization.subscription_plan as keyof PlanLimits;
      const planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.starter;

      // Note: client_entities table might not exist yet, so we'll set to 0
      const clientEntitiesCount = 0;

      // Get usage stats from organization (note: usage_stats might not exist in current schema)
      const usageStats = (currentOrganization as any).usage_stats || {};


    } catch (error) {
      console.error('Error calculating subscription limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreate = (resource: keyof SubscriptionLimits): boolean => {
    if (!limits) return false;
    const limit = limits[resource];
    return limit.max === -1 || limit.current < limit.max;
  };

  const getRemainingCount = (resource: keyof SubscriptionLimits): number => {
    if (!limits) return 0;
    const limit = limits[resource];
    if (limit.max === -1) return Infinity;
    return Math.max(0, limit.max - limit.current);
  };

  const getUsagePercentage = (resource: keyof SubscriptionLimits): number => {
    if (!limits) return 0;
    const limit = limits[resource];
    if (limit.max === -1) return 0;
    return Math.round((limit.current / limit.max) * 100);
  };

  const isNearLimit = (resource: keyof SubscriptionLimits, threshold = 80): boolean => {
    return getUsagePercentage(resource) >= threshold;
  };

  const refreshLimits = () => {
    calculateCurrentUsage();
  };

  return {
    limits,
    loading,
    canCreate,
    getRemainingCount,
    getUsagePercentage,
    isNearLimit,
    refreshLimits,
    currentPlan: currentOrganization?.subscription_plan || 'starter'
  };
}
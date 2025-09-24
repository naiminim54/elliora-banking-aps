import { useAuth } from "./useAuth";
import { useSelliOra } from "./useSelliora";

export type SubscriptionPlan = 'starter' | 'essential' | 'popular' | 'premium' | 'enterprise';

export function useTrialEnforcement(feature: string, planRequired: SubscriptionPlan = 'essential') {
  const { user } = useAuth();
  const { currentOrganization } = useSelliOra();

  // Get trial status from current organization
  const isTrialExpired = currentOrganization?.is_trial && currentOrganization?.trial_ends_at 
    ? new Date(currentOrganization.trial_ends_at) < new Date() 
    : false;
  
  const trialDaysLeft = currentOrganization?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(currentOrganization.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const currentPlan = currentOrganization?.subscription_plan as SubscriptionPlan || 'starter';
  
  // Check if current plan meets requirements
  const planHierarchy: Record<SubscriptionPlan, number> = {
    starter: 1,
    essential: 2,
    popular: 3,
    premium: 4,
    enterprise: 5
  };

  const canAccess = !isTrialExpired && 
    (currentOrganization?.is_trial || planHierarchy[currentPlan] >= planHierarchy[planRequired]);

  return {
    canAccess,
    isTrialExpired,
    trialDaysLeft,
    currentPlan,
    isInTrial: currentOrganization?.is_trial || false
  };
}
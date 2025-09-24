import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface UserRole {
  id: string;
  role: string;
  organization_id?: string;
  access_mode: 'internal' | 'external' | 'global';
  assigned_entities?: string[];
  permissions: string[];
  is_active: boolean;
}

export interface RolePermissions {
  modules: string[];
  actions: string[];
  redirectPath: string;
}

interface RoleBasedAuthContextType {
  userRole: UserRole | null;
  permissions: RolePermissions | null;
  loading: boolean;
  checkPermission: (module: string, action?: string) => boolean;
  getUserRedirectPath: () => string;
  refreshUserRole: () => Promise<void>;
}

const RoleBasedAuthContext = createContext<RoleBasedAuthContextType | undefined>(undefined);

// Configuration des rôles selon le cahier des charges
const ROLE_CONFIGURATIONS: Record<string, RolePermissions> = {
  // Administrateurs
  'owner': {
    modules: ['*'], // Accès à tous les modules
    actions: ['*'], // Toutes les actions
    redirectPath: '/workspaces'
  },
  'admin_standard': {
    modules: ['*'], // Accès à tous les modules de l'organisation
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard'
  },
  
  // Utilisateurs spécialisés
  'gestionnaire_commandes': {
    modules: ['sync+'],
    actions: ['view', 'update'], // Pas de création/suppression
    redirectPath: '/[organization-name]/dashboard/sync+/orders'
  },
  'responsable_commandes': {
    modules: ['sync+', 'logistics', 'inventory'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/sync+'
  },
  'responsable_marketing': {
    modules: ['marketing'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/marketing'
  },
  'responsable_livraisons': {
    modules: ['logistics'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/logistics'
  },
  'responsable_ventes': {
    modules: ['sales', 'marketing'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/sales'
  },
  'responsable_financier': {
    modules: ['accounting'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/accounting'
  },
  'responsable_stock': {
    modules: ['inventory'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/inventory'
  },
  'office_manager': {
    modules: ['core-manager'],
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard/core-manager'
  },
  'customer_service': {
    modules: ['sync+'],
    actions: ['view', 'update'],
    redirectPath: '/[organization-name]/dashboard/sync+/support'
  },
  'manager': {
    modules: ['*'], // Configurable selon l'assignation
    actions: ['*'],
    redirectPath: '/[organization-name]/dashboard'
  }
};

export function RoleBasedAuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const checkPermission = (module: string, action: string = 'view'): boolean => {
    if (!permissions || !userRole) return false;
    
    // Accès complet pour owner et admin_standard
    if (permissions.modules.includes('*')) return true;
    
    // Vérifier l'accès au module
    if (!permissions.modules.includes(module)) return false;
    
    // Vérifier l'action
    if (permissions.actions.includes('*')) return true;
    
    return permissions.actions.includes(action);
  };

  const getUserRedirectPath = (): string => {
    if (!permissions) return '/login';
    return permissions.redirectPath;
  };

  const value: RoleBasedAuthContextType = {
    userRole,
    permissions,
    loading,
    checkPermission,
    getUserRedirectPath,
    refreshUserRole: function (): Promise<void> {
      throw new Error('Function not implemented.');
    }
  };

  return (
    <RoleBasedAuthContext.Provider value={value}>
      {children}
    </RoleBasedAuthContext.Provider>
  );
}

export function useRoleBasedAuth() {
  const context = useContext(RoleBasedAuthContext);
  if (context === undefined) {
    throw new Error('useRoleBasedAuth must be used within a RoleBasedAuthProvider');
  }
  return context;
}

// Utilitaires pour la génération d'emails automatiques
export const generateUserEmail = (role: string, organizationName: string, existingCount: number = 0): string => {
  const orgSlug = organizationName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  
  if (role === 'admin_standard') {
    const suffix = existingCount > 0 ? String(existingCount + 1).padStart(2, '0') : '';
    return `admin${suffix}@${orgSlug}.com`;
  } else {
    const suffix = existingCount > 0 ? String(existingCount + 1).padStart(2, '0') : '';
    return `user${suffix}@${orgSlug}.com`;
  }
};

// Types pour les modules selon le cahier des charges
export const SELLIORA_MODULES = {
  'sync+': {
    name: 'Sync+ (Gestion Commandes)',
    description: 'Gestion complète des commandes, CRM et support client',
    subModules: ['orders', 'support', 'shipping', 'contacts']
  },
  'scm': {
    name: 'SCM (Supply Chain Management)', 
    description: 'Gestion de la chaîne logistique et des fournisseurs',
    subModules: ['suppliers', 'purchases', 'logistics']
  },
  'inventory': {
    name: 'Stock & Inventaire',
    description: 'Gestion des stocks et contrôle inventaire',
    subModules: ['products', 'stock', 'movements']
  },
  'accounting': {
    name: 'Comptabilité',
    description: 'Gestion comptable multinormes avec NexWallet',
    subModules: ['entries', 'invoices', 'reports', 'taxes']
  },
  'sales': {
    name: 'Ventes',
    description: 'CRM, tunnel de vente et catalogue interactif',
    subModules: ['pipeline', 'prospects', 'catalog', 'quotes']
  },
  'marketing': {
    name: 'Marketing',
    description: 'Campagnes, SocialPilot et marketing automation',
    subModules: ['campaigns', 'social-pilot', 'analytics', 'content']
  },
  'core-manager': {
    name: 'CoreManager (RH)',
    description: 'Gestion des ressources humaines et documents',
    subModules: ['hr', 'projects', 'archives', 'admin', 'communication', 'legal']
  },
  'logistics': {
    name: 'Logistique',
    description: 'Gestion des livraisons et transporteurs',
    subModules: ['deliveries', 'carriers', 'tracking']
  },
  'digital-studio': {
    name: 'Digital Studio',
    description: 'Création de contenu et assets numériques',
    subModules: ['projects', 'templates', 'assets']
  },
  'training-center': {
    name: 'Training Center',
    description: 'Formation et développement des compétences',
    subModules: ['courses', 'certifications', 'progress']
  },
  'renty+': {
    name: 'Renty+',
    description: 'Gestion locative et propriétés',
    subModules: ['properties', 'contracts', 'payments']
  }
} as const;
import { useAuth } from "./useAuth";
import { useSelliOra } from "./useSelliora";

export type UserRole = 
  | 'owner' 
  | 'admin_standard' 
  | 'gestionnaire_commandes'
  | 'responsable_commandes'
  | 'responsable_marketing' 
  | 'responsable_livraisons'
  | 'responsable_ventes'
  | 'responsable_financier'
  | 'responsable_stock'
  | 'office_manager' 
  | 'customer_service' 
  | 'manager' 
  | 'custom';

export type AccessMode = 'internal' | 'external' | 'mixed';

export interface UserPermissions {
  role: UserRole;
  accessMode: AccessMode;
  modules: string[];
  assignedEntities?: string[];
  organizationId?: string;
}

export function useRoleAccess() {
  const { user } = useAuth();
  const { workspace, currentOrganization } = useSelliOra();

  // Determine user role based on context
  const getUserRole = (): UserRole => {
    if (workspace && user && workspace.owner_id === user) {
      return 'owner';
    }
    // TODO: Get role from organization_users table
    return 'owner'; // Default for now
  };

  const userRole = getUserRole();
  
  // Define permissions based on role and organization
  const getUserPermissions = (): UserPermissions => {
    const isOwner = userRole === 'owner';
    
    return {
      role: userRole,
      accessMode: isOwner ? 'mixed' : 'internal',
      modules: isOwner ? ['*'] : getModulesForRole(userRole),
      assignedEntities: [],
      organizationId: currentOrganization?.id
    };
  };

  const permissions = getUserPermissions();

  // Helper function to get modules for specific roles
  const getModulesForRole = (role: UserRole): string[] => {
    switch (role) {
      case 'owner':
      case 'admin_standard':
        return ['*'];
      case 'gestionnaire_commandes':
        return ['sync+'];
      case 'responsable_commandes':
        return ['sync+', 'inventory'];
      case 'responsable_marketing':
        return ['marketing'];
      case 'responsable_livraisons':
        return ['sync+'];
      case 'responsable_ventes':
        return ['sales', 'marketing'];
      case 'responsable_financier':
        return ['accounting'];
      case 'responsable_stock':
        return ['inventory'];
      case 'office_manager':
        return ['core-manager'];
      case 'customer_service':
        return ['sync+'];
      case 'manager':
        return ['*']; // Configurable
      default:
        return [];
    }
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    if (permissions.modules.includes('*')) return true;
    return permissions.modules.includes(moduleId);
  };

  const hasEntityAccess = (entityId: string): boolean => {
    if (permissions.accessMode === 'internal') return false;
    if (permissions.role === 'owner' || permissions.role === 'admin_standard') return true;
    return permissions.assignedEntities?.includes(entityId) || false;
  };

  const canCreateEntity = (): boolean => {
    return permissions.role === 'owner' || permissions.role === 'admin_standard';
  };

  const canManageUsers = (): boolean => {
    return permissions.role === 'owner' || permissions.role === 'admin_standard';
  };

  const canAccessWorkspace = (): boolean => {
    return permissions.role === 'owner';
  };

  const getRedirectPath = (organizationName: string): string => {
    const role = permissions.role;
    
    switch (role) {
      case 'owner':
      case 'admin_standard':
        return `/${organizationName}/dashboard`;
      case 'gestionnaire_commandes':
        return `/${organizationName}/dashboard/sync+/orders`;
      case 'responsable_commandes':
        return `/${organizationName}/dashboard/sync+/orders`;
      case 'responsable_marketing':
        return `/${organizationName}/dashboard/marketing`;
      case 'responsable_livraisons':
        return `/${organizationName}/dashboard/sync+/shipping`;
      case 'responsable_ventes':
        return `/${organizationName}/dashboard/sales`;
      case 'responsable_financier':
        return `/${organizationName}/dashboard/accounting`;
      case 'responsable_stock':
        return `/${organizationName}/dashboard/inventory`;
      case 'office_manager':
        return `/${organizationName}/dashboard/core-manager`;
      case 'customer_service':
        return `/${organizationName}/dashboard/sync+/support`;
      default:
        return `/${organizationName}/dashboard`;
    }
  };

  return {
    permissions,
    hasModuleAccess,
    hasEntityAccess,
    canCreateEntity,
    canManageUsers,
    canAccessWorkspace,
    getRedirectPath
  };
}
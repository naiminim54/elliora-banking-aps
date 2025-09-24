import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  country: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: string;
  workspace_id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  address?: string;
  plan: string;
  status: string;
  admin_email: string;
  admin_password: string;
  currency: string;
  logo_url?: string;
  active_modules: string[];
  organization_slug?: string;
  subscription_plan: string;
  is_trial: boolean;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

interface SelliOraContextType {
  user: null;
  workspace: Workspace | null;
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  refreshWorkspace: () => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const SelliOraContext = createContext<SelliOraContextType | undefined>(undefined);

interface SelliOraProviderProps {
  children: ReactNode;
}

export const SelliOraProvider: React.FC<SelliOraProviderProps> = ({ children }) => {
  const [user, setUser] = useState< null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);




  const value: SelliOraContextType = {
    user,
    workspace,
    organizations,
    loading,
    error,
    currentOrganization,
    setCurrentOrganization,
    refreshWorkspace: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    refreshOrganizations: function (): Promise<void> {
      throw new Error('Function not implemented.');
    }
  };

  return (
    <SelliOraContext.Provider value={value}>
      {children}
    </SelliOraContext.Provider>
  );
};

export const useSelliOra = (): SelliOraContextType => {
  const context = useContext(SelliOraContext);
  if (context === undefined) {
    throw new Error('useSelliOra must be used within a SelliOraProvider');
  }
  return context;
};
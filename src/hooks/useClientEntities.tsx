import { useState, useEffect } from 'react';
import { useSelliOra } from './useSelliora';

export interface ClientEntity {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  contact_email?: string;
  logo_url?: string;
  active_modules: string[];
  status?: string;
  created_at: string;
  updated_at: string;
}

export function useClientEntities() {
  const [entities, setEntities] = useState<ClientEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganization } = useSelliOra();

  const fetchEntities = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    setError(null);

  };

  const createEntity = async (entityData: Partial<ClientEntity>) => {
    if (!currentOrganization) return null;
  };


  useEffect(() => {
    if (currentOrganization) {
      fetchEntities();
    }
  }, [currentOrganization]);

  return {
    entities,
    loading,
    error,
    createEntity,
    refreshEntities: fetchEntities
  };
}
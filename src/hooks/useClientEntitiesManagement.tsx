import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export function useClientEntitiesManagement(organizationId?: string) {
  const [entities, setEntities] = useState<ClientEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  
  return {
    entities,
    loading,
  };
}
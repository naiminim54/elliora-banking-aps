const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    apiRequest<{ token: string; user: { id: string; name: string } }>('/auth', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Accounts
  getAccounts: () =>
    apiRequest<Array<{
      id: string;
      type: string;
      currency: string;
      balance: number;
    }>>('/accounts'),

  // Transactions
  getTransactions: (
    accountId: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiRequest<{
      items: Array<{
        id: string;
        date: string;
        amount: number;
        currency: string;
        description: string;
        status: string;
      }>;
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }>(`/accounts/${accountId}/transactions${query}`);
  },

  // Transfer
  transfer: (transferData: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description?: string;
  }) =>
    apiRequest<{
      transferId: string;
      status: string;
      estimatedCompletion: string;
    }>('/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    }),
};

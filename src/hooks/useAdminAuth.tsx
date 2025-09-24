import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface AdminUser {
  id: string;
  username: string;
  role: string;
  is_2fa_enabled: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (sessionToken: string, adminUser: AdminUser) => void;
  logout: () => void;
  logAction: (action: string, resourceType?: string, resourceId?: string, details?: any) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem("admin_session_token");
    const storedUser = localStorage.getItem("admin_user");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setSessionToken(storedToken);
        setAdminUser(user);
      } catch (error) {
        console.error("Error parsing stored admin user:", error);
        localStorage.removeItem("admin_session_token");
        localStorage.removeItem("admin_user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token: string, user: AdminUser) => {
    setSessionToken(token);
    setAdminUser(user);
    localStorage.setItem("admin_session_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch("/supabase/functions/v1/admin-auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    setSessionToken(null);
    setAdminUser(null);
    localStorage.removeItem("admin_session_token");
    localStorage.removeItem("admin_user");
  };

  const logAction = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    details?: any
  ) => {
    if (!sessionToken || !adminUser) return;

    try {
      await fetch("/supabase/functions/v1/admin-auth/log-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          adminUserId: adminUser.id,
          action,
          resourceType,
          resourceId,
          details,
        }),
      });
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const value = {
    adminUser,
    sessionToken,
    isAuthenticated: !!adminUser && !!sessionToken,
    loading,
    login,
    logout,
    logAction,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
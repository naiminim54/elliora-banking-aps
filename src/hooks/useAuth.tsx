import { createContext, useContext, useEffect, useState } from 'react'

export interface AuthResponse {
  data?: any;
  error?: Error | null;
}

interface AuthContextType {
  user:  | null
  session:  | null
  loading: boolean
  signUp: (email: string, password: string, metadata: Record<string, any>) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
  getUserRoleAndRedirect: () => Promise<{ role: string | null, redirectTo: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState< null>(null)
  const [session, setSession] = useState< null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listeners...')
    return () => {
      console.log('AuthProvider: Cleaning up subscription...')
    }
  }, [])

  const signUp = async (email: string, password: string, metadata: Record<string, any>) => {
    console.log('AuthProvider: Signing up user:', email)
  }

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in user:', email)
  }

  const signOut = async () => {
    console.log('AuthProvider: Signing out user')
  }

  const resetPassword = async (email: string) => {
    console.log('AuthProvider: Resetting password for:', email)
  }

  const getUserRoleAndRedirect = async () => {
    console.log('AuthProvider: Getting user role and redirect for:', user)
    if (!user) {
      return { role: null, redirectTo: '/login' }
    }

  }

  const value = {
    user,
    session,
    loading,
    signOut,
    getUserRoleAndRedirect
  }

  console.log('AuthProvider: Rendering with user:', user, 'loading:', loading)

}

export function useAuth() {
  const context = useContext(AuthContext)
  
  console.log('useAuth: Successfully got auth context')
  return context
}
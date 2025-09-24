/**
 * Page de connexion avec design light cyan professionnel #00BFA5
 *  (j'ai choisi cette couleur car elle est tres professionnelle et elegante)
 * 
 * Features:
 * - Authentification avec validation
 * - Design responsive mobile-first
 * - Stockage token en localStorage
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { validateLoginForm } from '@/lib/validate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Composant principal de la page de connexion
 * Gère l'authentification utilisateur avec validation et feedback
 */
export default function LoginPage() {
  // États locaux pour le formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Gère la soumission du formulaire de connexion
   * Valide les données, appelle l'API et redirige en cas de succès
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const validation = validateLoginForm(username, password);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      // Appel API d'authentification
      const response = await api.login({ username, password });

      // Stockage du token et des informations utilisateur
      auth.setToken(response.token);
      auth.setUser(response.user);

      // Feedback utilisateur et redirection
      toast.success(`Bienvenue, ${response.user.name}!`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Conteneur principal avec design moderne */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
        <div className="flex items-center justify-center">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16"
              >
                <img className='w-14' src="favicon.png" alt="elliora logo" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-1xl font-bold text-gray-900"
                >
                  Elliora Banking
                </motion.h1>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-sm text-gray-600"
                >
                  Secure Digital Banking
                </motion.h1>

              </div>

            </div>
        </div>

        {/* Carte de connexion glassmorphism */}
        <Card className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 bg-primary/5">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your secure banking account
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Formulaire de connexion */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ nom d'utilisateur */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="h-12 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Champ mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-white/20 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>


          </CardContent>
        </Card>


      </div>
    </div>
  );
}
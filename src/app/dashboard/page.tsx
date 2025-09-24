/**
 * Page principale avec comptes + transactions - Dashboard professionnel compact
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { formatCurrency } from '@/lib/format';
import { CreditCard } from '@/components/CreditCard';
import { CreditCardSkeleton } from '@/components/CreditCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionsList } from '@/components/TransactionsList';
import { TransferModal } from '@/components/TransferModal';
import { TransfersList } from '@/components/TransfersList';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Home,
  Activity,
  Send,
  Menu,
  Search,
  Filter,
  FolderUp,
  Plus
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';

interface Account {
  id: string;
  type: string;
  currency: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showTransfers, setShowTransfers] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFromAccount, setTransferFromAccount] = useState<Account | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // États pour l'historique des transactions du dashboard
  const [dashboardTransactions, setDashboardTransactions] = useState<Transaction[]>([]);
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [dashboardCurrentPage, setDashboardCurrentPage] = useState(1);
  const dashboardPageSize = 5;
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadAccounts();
  }, [router]);

  const loadAccounts = async () => {
    try {
      const accountsData = await api.getAccounts();
      setAccounts(accountsData);

      // Charger aussi les transactions pour l'historique du dashboard
      if (accountsData.length > 0) {
        await loadDashboardTransactions(accountsData[0].id);
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement des comptes');
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardTransactions = async (accountId: string) => {
    try {
      const response = await api.getTransactions(accountId, {
        page: 1,
        pageSize: 20, // Charger plus pour avoir des données à filtrer
        sortBy: 'date',
        sortOrder: 'desc',
      });
      setDashboardTransactions(response.items);
    } catch (error: any) {
      console.error('Error loading dashboard transactions:', error);
    }
  };

  // Filtrage et pagination pour le dashboard
  const filteredDashboardTransactions = dashboardTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
    transaction.id.toLowerCase().includes(dashboardSearch.toLowerCase())
  );

  const totalDashboardPages = Math.ceil(filteredDashboardTransactions.length / dashboardPageSize);
  const startIndex = (dashboardCurrentPage - 1) * dashboardPageSize;
  const paginatedDashboardTransactions = filteredDashboardTransactions.slice(startIndex, startIndex + dashboardPageSize);

  const handleViewTransactions = (accountId: string) => {
    setSelectedAccountId(accountId);
    setShowTransactions(true);
    setShowTransfers(false); // Ensure transfers list is hidden
  };

  const handleTransfer = (account?: Account) => {
    setTransferFromAccount(account || null);
    setShowTransferModal(true);
  };

  const handleLogout = () => {
    auth.logout();
  };

  const user = auth.getUser();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, active: !showTransactions && !showTransfers },
    { id: 'transactions', label: 'Transactions', icon: Activity, active: showTransactions },
    { id: 'transfers', label: 'Virements', icon: Send, active: showTransfers },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Skeleton */}
        <div className="w-16 lg:w-64 bg-white border-r border-gray-200 shadow-lg">
          <div className="flex flex-col h-full py-6">
            <div className="px-4 mb-8">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-32 h-5 hidden lg:block" />
              </div>
            </div>
            <nav className="flex-1 px-3 space-y-3">
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="w-full h-12 rounded-xl" />
            </nav>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-40 h-6" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="w-24 h-8" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </header>

          {/* Dashboard Content Skeleton */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center sm:text-left">
                <Skeleton className="w-64 h-8 mb-2 mx-auto sm:mx-0" />
                <Skeleton className="w-80 h-5 mx-auto sm:mx-0" />
              </div>

              {/* Credit Cards Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <Skeleton className="w-32 h-7" />
                  <Skeleton className="w-40 h-10 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CreditCardSkeleton />
                  <CreditCardSkeleton />
                </div>
              </div>



              {/* Quick Actions Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <Skeleton className="w-32 h-6 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div>
                        <Skeleton className="w-32 h-5 mb-1" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex p-2.5">

      <div className={`fixed inset-y-0 left-0  z-50 w-64 bg-gray-900 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-2.5' : '-translate-x-full'} lg:static lg:inset-auto lg:transform-none m-2.5 lg:mr-4`}>
        <div className="flex flex-col h-full py-6">

          <div className="flex items-center space-x-2 justify-center mb-4">

            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-fit"
            >
              <img src="favicon.png" alt="elliora logo" className='w-8' />
            </motion.div>
            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-1xl font-bold text-white"
              >
                Elliora Banking
              </motion.h1>
            </div>
          </div>

          {/* Navigation Modern */}
          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'dashboard') {
                      setShowTransactions(false);
                      setShowTransfers(false);
                    } else if (item.id === 'transfers') {
                      setShowTransactions(false);
                      setShowTransfers(true);
                    } else if (item.id === 'transactions') {
                      if (accounts.length > 0) {
                        setSelectedAccountId(accounts[0].id);
                        setShowTransactions(true);
                        setShowTransfers(false);
                      }
                    }
                    setSidebarOpen(false);
                  }}
                  className={`group relative w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${item.active
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-xl'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-200 ${item.active
                    ? 'bg-white/20'
                    : 'bg-gray-800/50 group-hover:bg-gray-700'
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="font-medium">{item.label}</span>

                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute right-4 w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Modern */}
          <div className="px-4 mt-auto">
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">Premium Account</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-700 transition-all duration-200 group">
                      <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="text-center">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-3xl bg-red-500 flex items-center justify-center shadow-lg">
                        <LogOut className="w-8 h-8 text-white" />
                      </div>
                      <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                        Confirmation de déconnexion
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 mt-3">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 mt-6">
                      <AlertDialogCancel className="flex-1 bg-gray-100 hover:bg-gray-200 border-0">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg"
                      >
                        Se déconnecter
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile - Amélioré */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden transition-all duration-300 ease-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Top Bar - Minimal Wise Style */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2 justify-center mb-4">

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-fit"
                >
                  <img src="favicon.png" alt="elliora logo" className='w-8' />
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
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">

              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - SmartPay Style */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {!showTransactions && !showTransfers ? (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="text-center sm:text-left">
                <h1 className="text-1xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue, {user?.name} 👋
                </h1>
                <p className="text-gray-600">Gérez vos comptes et transactions en toute sécurité</p>
              </div>

              {/* Credit Cards Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-900">Mes Comptes</h2>
                  <Button
                    onClick={() => handleTransfer()}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Nouveau Virement
                  </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  {accounts.map((account) => (
                    <CreditCard
                      key={account.id}
                      account={account}
                      onViewTransactions={() => handleViewTransactions(account.id)}
                      onTransfer={() => handleTransfer(account)}
                    />
                  ))}
                </div>
              </div>


              {/* Transaction History Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-900">Historique des Transactions</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-gray-600 w-full sm:w-auto">
                      <FolderUp className="w-4 h-4" /> Export File
                    </Button>
                    <Button
                      onClick={() => handleTransfer()}
                      className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Virement
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des transactions..."
                      value={dashboardSearch}
                      onChange={(e) => {
                        setDashboardSearch(e.target.value);
                        setDashboardCurrentPage(1); // Reset to first page when searching
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2.5 rounded-xl"
                    onClick={() => {
                      setDashboardSearch('');
                      setDashboardCurrentPage(1);
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Réinitialiser</span>
                  </Button>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bénéficiaire ↕</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">N° Transaction ↕</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Statut ↕</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date ↕</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Heure ↕</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description ↕</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Montant ↕</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDashboardTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                              {dashboardSearch ? 'Aucune transaction trouvée' : 'Aucune transaction disponible'}
                            </td>
                          </tr>
                        ) : (
                          paginatedDashboardTransactions.map((transaction, index) => (
                            <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2 sm:py-4 px-4">
                                <input type="checkbox" className="rounded" />
                              </td>
                              <td className="py-2 sm:py-4 px-4 font-medium text-gray-900">
                                {transaction.amount > 0 ? 'Crédit reçu' : 'Paiement effectué'}
                              </td>
                              <td className="py-2 sm:py-4 px-4 text-gray-600 font-mono text-sm">{transaction.id}</td>
                              <td className="py-2 sm:py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'posted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  ● {transaction.status === 'posted' ? 'Terminé' : 'En attente'}
                                </span>
                              </td>
                              <td className="py-2 sm:py-4 px-4 text-gray-600">
                                {new Date(transaction.date).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-2 sm:py-4 px-4 text-gray-600">
                                {new Date(transaction.date).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="py-2 sm:py-4 px-4">
                                <span className="text-gray-700">{transaction.description}</span>
                              </td>
                              <td className={`py-2 sm:py-4 px-4 text-right font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} FCFA
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      {filteredDashboardTransactions.length > 0 && (
                        <>Page {dashboardCurrentPage} sur {totalDashboardPages} ({filteredDashboardTransactions.length} transaction{filteredDashboardTransactions.length > 1 ? 's' : ''})</>
                      )}
                    </div>

                    {totalDashboardPages > 1 && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDashboardCurrentPage(dashboardCurrentPage - 1)}
                          disabled={dashboardCurrentPage === 1}
                          className="flex items-center space-x-2"
                        >
                          <span>←</span>
                          <span>Précédent</span>
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(3, totalDashboardPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalDashboardPages <= 3) {
                              pageNum = i + 1;
                            } else if (dashboardCurrentPage <= 2) {
                              pageNum = i + 1;
                            } else if (dashboardCurrentPage >= totalDashboardPages - 1) {
                              pageNum = totalDashboardPages - 2 + i;
                            } else {
                              pageNum = dashboardCurrentPage - 1 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={dashboardCurrentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDashboardCurrentPage(pageNum)}
                                className={`w-8 h-8 p-0 ${dashboardCurrentPage === pageNum
                                  ? 'bg-primary text-white'
                                  : 'hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDashboardCurrentPage(dashboardCurrentPage + 1)}
                          disabled={dashboardCurrentPage === totalDashboardPages}
                          className="flex items-center space-x-2"
                        >
                          <span>Suivant</span>
                          <span>→</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : showTransactions ? (
            <TransactionsList
              accountId={selectedAccountId}
              onBack={() => setShowTransactions(false)}
            />
          ) : showTransfers ? (
            <TransfersList
              onBack={() => setShowTransfers(false)}
            />
          ) : null}
        </main>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          accounts={accounts}
          selectedAccountId={transferFromAccount?.id}
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setTransferFromAccount(null);
          }}
          onSuccess={() => {
            setShowTransferModal(false);
            setTransferFromAccount(null);
            loadAccounts();
          }}
        />
      )}
    </div>
  );
}
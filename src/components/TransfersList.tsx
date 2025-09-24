/**
 * Liste des virements avec table responsive - Conforme au cahier des charges
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransfersListSkeleton } from '@/components/TransfersListSkeleton';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Search, 
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Filter
} from 'lucide-react';

interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  estimatedCompletion?: string;
}

interface TransfersListProps {
  onBack: () => void;
}

// Données mock des virements pour la démonstration
const mockTransfers: Transfer[] = [
  {
    id: "tr_001",
    fromAccountId: "acc_1",
    toAccountNumber: "1234567890",
    amount: 50000,
    currency: "XAF",
    description: "Virement famille",
    status: "completed",
    date: "2025-01-15T10:30:00Z",
  },
  {
    id: "tr_002", 
    fromAccountId: "acc_1",
    toAccountNumber: "9876543210",
    amount: 25000,
    currency: "XAF",
    description: "Paiement loyer",
    status: "pending",
    date: "2025-01-14T15:45:00Z",
    estimatedCompletion: "2025-01-16T12:00:00Z"
  },
  {
    id: "tr_003",
    fromAccountId: "acc_2", 
    toAccountNumber: "5555666677",
    amount: 75000,
    currency: "XAF",
    description: "Achat équipement",
    status: "failed",
    date: "2025-01-13T09:15:00Z",
  },
  {
    id: "tr_004",
    fromAccountId: "acc_1",
    toAccountNumber: "1111222233",
    amount: 100000,
    currency: "XAF", 
    description: "Virement business",
    status: "completed",
    date: "2025-01-12T14:20:00Z",
  },
  {
    id: "tr_005",
    fromAccountId: "acc_2",
    toAccountNumber: "4444555566",
    amount: 30000,
    currency: "XAF",
    status: "pending",
    date: "2025-01-11T11:10:00Z",
    estimatedCompletion: "2025-01-17T16:00:00Z"
  }
];

export function TransfersList({ onBack }: TransfersListProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransfers(mockTransfers);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des virements');
      console.error('Error loading transfers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les virements
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.toAccountNumber.includes(search) ||
      transfer.description?.toLowerCase().includes(search.toLowerCase()) ||
      transfer.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Échoué</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  if (isLoading) {
    return <TransfersListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historique des Virements</h2>
            <p className="text-gray-600">Consultez tous vos virements effectués</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par numéro de compte, description ou ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminé</option>
                <option value="pending">En cours</option>
                <option value="failed">Échoué</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des virements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-primary" />
              <span>Liste des Virements</span>
            </div>
            <Badge variant="secondary">
              {filteredTransfers.length} virement{filteredTransfers.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransfers.length === 0 ? (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Aucun virement trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Virement</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTransfers.map((transfer, index) => (
                      <motion.tr
                        key={transfer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="font-mono text-sm text-gray-600 py-2 sm:py-3">
                          {transfer.id}
                        </TableCell>
                        <TableCell className="py-2 sm:py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Send className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{transfer.toAccountNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(transfer.amount, transfer.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3">
                          <span className="text-gray-600">
                            {transfer.description || 'Sans description'}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {formatDate(transfer.date)}
                            </div>
                            {transfer.status === 'pending' && transfer.estimatedCompletion && (
                              <div className="text-xs text-orange-600">
                                Estimé: {formatDate(transfer.estimatedCompletion)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(transfer.status)}
                            {getStatusBadge(transfer.status)}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Virements</p>
                <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
              </div>
              <Send className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    transfers.filter(t => t.status === 'completed')
                            .reduce((sum, t) => sum + t.amount, 0), 
                    'XAF'
                  )}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

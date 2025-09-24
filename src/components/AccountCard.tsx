/**
 * Composant carte de compte - Design professionnel compact
 */

"use client";

import { formatCurrency, formatAccountType } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Send, CreditCard } from 'lucide-react';

interface Account {
  id: string;
  type: string;
  currency: string;
  balance: number;
}

interface AccountCardProps {
  account: Account;
  onViewTransactions: () => void;
  onTransfer: () => void;
}

export function AccountCard({ account, onViewTransactions, onTransfer }: AccountCardProps) {
  const isPositiveBalance = account.balance >= 0;
  
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {formatAccountType(account.type)}
            </h3>
            <p className="text-sm text-gray-500 font-mono">
              {account.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
              {account.currency}
            </Badge>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Solde disponible</p>
          <p className={`text-2xl font-bold ${
            isPositiveBalance ? 'text-gray-900' : 'text-red-600'
          }`}>
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onViewTransactions}
            variant="outline"
            size="sm"
            className="flex-1 border-gray-200 hover:border-gray-300 text-gray-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir
          </Button>
          
          <Button
            onClick={onTransfer}
            size="sm"
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            disabled={account.balance <= 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
        </div>

        {account.balance <= 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">
              Solde insuffisant pour effectuer un virement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
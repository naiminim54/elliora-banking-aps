"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatAccountType } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CreditCard as CreditCardIcon, Send, Activity, MoreHorizontal } from 'lucide-react';

interface Account {
  id: string;
  type: string;
  currency: string;
  balance: number;
}

interface CreditCardProps {
  account: Account;
  onViewTransactions: () => void;
  onTransfer: () => void;
}

export function CreditCard({ account, onViewTransactions, onTransfer }: CreditCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatCardNumber = (accountId: string) => {
    const cleaned = accountId.replace(/\D/g, '');
    const padded = cleaned.padEnd(16, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || accountId;
  };

  const getCardGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case 'current':
        return 'from-primary via-primary-dark to-gray-800';
      case 'savings':
        return 'from-blue-500 via-purple-500 to-indigo-600';
      default:
        return 'from-gray-600 via-gray-700 to-gray-800';
    }
  };

  const maskedBalance = isBalanceVisible 
    ? formatCurrency(account.balance, account.currency)
    : '••• •••';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {/* Clean Credit Card */}
      <div 
        className={`relative w-full h-48 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 cursor-pointer border border-white/10`}
        style={{
          background: account.type === 'current' 
            ? 'linear-gradient(135deg, #00BFA5 0%, #00A693 50%, #008777 100%)' 
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)'
        }}
      >
        {/* Clean Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
              {formatAccountType(account.type)}
            </p>
            <p className="text-sm opacity-80 mt-1">Elliora Banking</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBalanceVisibility}
            className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-xl transition-all"
          >
            {isBalanceVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <p className="text-base font-mono tracking-[0.2em] opacity-90">
            {formatCardNumber(account.id)}
          </p>
        </div>

        {/* Card Bottom - Clean */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-75 mb-1">Solde disponible</p>
            <p className="text-xl font-bold">
              {maskedBalance}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold opacity-90">{account.currency}</p>
          </div>
        </div>

        {/* Simple Card Chip */}
        <div className="absolute top-6 right-6 w-8 h-6 bg-yellow-400/90 rounded-lg shadow-sm backdrop-blur-sm"></div>
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl pointer-events-none"></div>
      </div>

      {/* Clean Action Buttons */}
      <div className="mt-4 flex items-center space-x-3">
        <Button
          onClick={onViewTransactions}
          variant="outline"
          size="sm"
          className="flex-1 h-10 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Activity className="w-4 h-4 mr-2" />
          Transactions
        </Button>
        
        <Button
          onClick={onTransfer}
          size="sm"
          className="flex-1 h-10 bg-primary hover:bg-primary-dark text-white transition-all"
          disabled={account.balance <= 0}
        >
          <Send className="w-4 h-4 mr-2" />
          Virement
        </Button>
      </div>

      {/* Low Balance Warning */}
      {account.balance <= 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 text-center">
            ⚠️ Solde insuffisant pour effectuer un virement
          </p>
        </div>
      )}
    </motion.div>
  );
}


/**
 * Modal de virement - Conforme au cahier des charges
 */

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { validateTransfer } from '@/lib/validate';
import { formatCurrency, formatAccountType } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, CreditCard, Send, X } from 'lucide-react';

interface Account {
  id: string;
  type: string;
  currency: string;
  balance: number;
}

interface TransferModalProps {
  accounts: Account[];
  selectedAccountId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransferModal({ accounts, selectedAccountId, isOpen, onClose, onSuccess }: TransferModalProps) {
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');
  const [fromAccountId, setFromAccountId] = useState(selectedAccountId || (accounts.length > 0 ? accounts[0].id : ''));
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transferId, setTransferId] = useState('');

  // Trouver le compte sélectionné
  const fromAccount = accounts.find(acc => acc.id === fromAccountId) || accounts[0];

  const handleReset = () => {
    setStep('form');
    setFromAccountId(selectedAccountId || (accounts.length > 0 ? accounts[0].id : ''));
    setToAccountNumber('');
    setAmount('');
    setDescription('');
    setTransferId('');
    setIsLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNumber = parseFloat(amount);
    const validation = validateTransfer(amountNumber, fromAccount.balance, toAccountNumber);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setStep('confirmation');
  };

  const handleConfirmTransfer = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.transfer({
        fromAccountId: fromAccount.id,
        toAccountNumber,
        amount: parseFloat(amount),
        description: description || undefined,
      });
      
      setTransferId(response.transferId);
      setStep('success');
      toast.success('Virement initié avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du virement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    onSuccess();
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] p-0 overflow-hidden mx-4 sm:mx-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-3 text-xl font-semibold">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <span>Nouveau virement</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Transférez des fonds entre vos comptes ou vers un bénéficiaire
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 overflow-y-auto flex-1">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Sélecteur de compte source */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Compte source
                </Label>
                <Select value={fromAccountId} onValueChange={setFromAccountId}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Sélectionnez un compte" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-3 h-3 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{formatAccountType(account.type)}</p>
                              <p className="text-xs text-gray-500">{account.id}</p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-sm">
                              {formatCurrency(account.balance, account.currency)}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Informations du compte sélectionné */}
              {fromAccount && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{formatAccountType(fromAccount.type)}</p>
                        <p className="text-sm text-gray-500">{fromAccount.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(fromAccount.balance, fromAccount.currency)}
                      </p>
                      <p className="text-xs text-gray-500">Solde disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer Form - Modern */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="toAccount" className="text-sm font-medium text-gray-700">
                    Compte bénéficiaire
                  </Label>
                  <div className="relative">
                    <Input
                      id="toAccount"
                      type="text"
                      placeholder="Numéro de compte du bénéficiaire"
                      value={toAccountNumber}
                      onChange={(e) => setToAccountNumber(e.target.value)}
                      className="h-12 pl-4 pr-4 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Montant à transférer
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      min="1"
                      max={fromAccount.balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 pl-4 pr-16 border-gray-200 focus:border-primary focus:ring-primary text-lg font-semibold"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-sm font-medium text-gray-500">{fromAccount.currency}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span>Maximum disponible: </span>
                    <span className="font-medium text-primary ml-1">
                      {formatCurrency(fromAccount.balance, fromAccount.currency)}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Motif du virement (optionnel)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Remboursement, cadeau, facture..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="border-gray-200 focus:border-primary focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-100">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose} 
                    className="flex-1 h-11 border-gray-200 hover:border-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-primary hover:bg-primary-dark"
                  >
                    Continuer
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirmer le virement</h3>
                <p className="text-gray-500">
                  Vérifiez attentivement les informations ci-dessous
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 font-medium">Compte source</span>
                  <span className="font-semibold text-gray-900">
                    {formatAccountType(fromAccount.type)}
                  </span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 font-medium">Bénéficiaire</span>
                  <span className="font-semibold text-gray-900 font-mono">{toAccountNumber}</span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 font-medium">Montant</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(parseFloat(amount), fromAccount.currency)}
                  </span>
                </div>
                
                {description && (
                  <>
                    <div className="border-t border-gray-200"></div>
                    <div className="py-2">
                      <span className="text-gray-600 font-medium block mb-1">Motif</span>
                      <span className="text-gray-900">{description}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('form')}
                  className="flex-1 h-11 border-gray-200 hover:border-gray-300"
                >
                  Retour
                </Button>
                <Button 
                  onClick={handleConfirmTransfer}
                  disabled={isLoading}
                  className="flex-1 h-11 bg-primary hover:bg-primary-dark"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Traitement...</span>
                    </div>
                  ) : (
                    'Confirmer le virement'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Virement initié !
                </h3>
                <p className="text-gray-500 text-lg">
                  Votre demande de virement a été transmise avec succès
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">ID de transaction</span>
                  <span className="font-bold text-gray-900 font-mono">{transferId}</span>
                </div>
                <div className="border-t border-green-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Statut</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    En cours de traitement
                  </Badge>
                </div>
                <div className="border-t border-green-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Montant</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(parseFloat(amount), fromAccount.currency)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSuccess} 
                  className="w-full h-11 bg-primary hover:bg-primary-dark"
                >
                  Retour au dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
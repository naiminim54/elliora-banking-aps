export interface TransferValidation {
  isValid: boolean;
  errors: string[];
}

export const validateTransfer = (
  amount: number,
  accountBalance: number,
  toAccountNumber: string
): TransferValidation => {
  const errors: string[] = [];

  // Validation du montant
  if (!amount || amount <= 0) {
    errors.push('Le montant doit être supérieur à 0');
  }

  if (amount > accountBalance) {
    errors.push('Solde insuffisant');
  }

  // Validation du numéro de compte bénéficiaire
  if (!toAccountNumber || toAccountNumber.trim().length === 0) {
    errors.push('Le numéro de compte bénéficiaire est requis');
  }

  if (toAccountNumber && toAccountNumber.length < 10) {
    errors.push('Le numéro de compte doit contenir au moins 10 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginForm = (username: string, password: string): TransferValidation => {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push('Le nom d\'utilisateur est requis');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Le mot de passe est requis');
  }

  if (password && password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

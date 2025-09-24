import { validateTransfer } from '@/lib/validate';

describe('validateTransfer', () => {
  const mockAccountBalance = 100000; // 100,000 XAF
  const validAccountNumber = '1234567890';

  describe('Amount validation', () => {
    it('should reject amount <= 0', () => {
      const result = validateTransfer(0, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le montant doit être supérieur à 0');
    });

    it('should reject negative amount', () => {
      const result = validateTransfer(-100, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le montant doit être supérieur à 0');
    });

    it('should reject amount greater than balance', () => {
      const result = validateTransfer(150000, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Solde insuffisant');
    });

    it('should accept valid amount within balance', () => {
      const result = validateTransfer(50000, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept amount equal to balance', () => {
      const result = validateTransfer(mockAccountBalance, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Account number validation', () => {
    it('should reject empty account number', () => {
      const result = validateTransfer(50000, mockAccountBalance, '');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le numéro de compte bénéficiaire est requis');
    });

    it('should reject account number with only spaces', () => {
      const result = validateTransfer(50000, mockAccountBalance, '   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le numéro de compte bénéficiaire est requis');
    });

    it('should reject account number shorter than 10 characters', () => {
      const result = validateTransfer(50000, mockAccountBalance, '123456789');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le numéro de compte doit contenir au moins 10 caractères');
    });

    it('should accept valid account number with 10 characters', () => {
      const result = validateTransfer(50000, mockAccountBalance, '1234567890');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid account number longer than 10 characters', () => {
      const result = validateTransfer(50000, mockAccountBalance, '12345678901234');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Combined validation', () => {
    it('should return multiple errors for multiple invalid fields', () => {
      const result = validateTransfer(-100, mockAccountBalance, '123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Le montant doit être supérieur à 0');
      expect(result.errors).toContain('Le numéro de compte doit contenir au moins 10 caractères');
    });

    it('should return valid result when all fields are correct', () => {
      const result = validateTransfer(25000, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined amount', () => {
      const result = validateTransfer(null as any, mockAccountBalance, validAccountNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le montant doit être supérieur à 0');
    });

    it('should handle zero balance', () => {
      const result = validateTransfer(100, 0, validAccountNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Solde insuffisant');
    });
  });
});

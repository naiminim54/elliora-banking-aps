import { formatCurrency } from '@/lib/format';

describe('formatCurrency', () => {
  describe('XAF currency formatting', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(542300, 'XAF')).toContain('542');
      expect(formatCurrency(542300, 'XAF')).toContain('300');
      expect(formatCurrency(542300, 'XAF')).toContain('FCFA');
      
      expect(formatCurrency(1200000, 'XAF')).toContain('1');
      expect(formatCurrency(1200000, 'XAF')).toContain('200');
      expect(formatCurrency(1200000, 'XAF')).toContain('000');
      expect(formatCurrency(1200000, 'XAF')).toContain('FCFA');
      
      expect(formatCurrency(100, 'XAF')).toBe('100\u00A0FCFA');
    });

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-25000, 'XAF')).toContain('-');
      expect(formatCurrency(-25000, 'XAF')).toContain('25');
      expect(formatCurrency(-25000, 'XAF')).toContain('000');
      expect(formatCurrency(-25000, 'XAF')).toContain('FCFA');
      
      expect(formatCurrency(-100, 'XAF')).toBe('-100\u00A0FCFA');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0, 'XAF')).toBe('0\u00A0FCFA');
    });

    it('should handle decimal amounts (rounded to whole numbers)', () => {
      expect(formatCurrency(542300.75, 'XAF')).toContain('542');
      expect(formatCurrency(542300.75, 'XAF')).toContain('301');
      expect(formatCurrency(542300.75, 'XAF')).toContain('FCFA');
      
      expect(formatCurrency(999.49, 'XAF')).toBe('999\u00A0FCFA');
      expect(formatCurrency(999.5, 'XAF')).toContain('1');
      expect(formatCurrency(999.5, 'XAF')).toContain('000');
    });
  });

  describe('Default currency', () => {
    it('should use XAF as default currency when not specified', () => {
      expect(formatCurrency(542300)).toContain('FCFA');
      expect(formatCurrency(1200000)).toContain('FCFA');
    });
  });

  describe('Different currencies', () => {
    it('should format EUR correctly', () => {
      expect(formatCurrency(1000, 'EUR')).toContain('1');
      expect(formatCurrency(1000, 'EUR')).toContain('000');
      expect(formatCurrency(1000, 'EUR')).toContain('€');
    });

    it('should format USD correctly', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1');
      expect(formatCurrency(1000, 'USD')).toContain('000');
      expect(formatCurrency(1000, 'USD')).toContain('$US');
    });
  });

  describe('Large numbers', () => {
    it('should format millions correctly', () => {
      expect(formatCurrency(1000000, 'XAF')).toContain('1');
      expect(formatCurrency(1000000, 'XAF')).toContain('000');
      expect(formatCurrency(1000000, 'XAF')).toContain('FCFA');
      
      expect(formatCurrency(5423000, 'XAF')).toContain('5');
      expect(formatCurrency(5423000, 'XAF')).toContain('423');
      expect(formatCurrency(5423000, 'XAF')).toContain('FCFA');
    });

    it('should format billions correctly', () => {
      expect(formatCurrency(1000000000, 'XAF')).toContain('1');
      expect(formatCurrency(1000000000, 'XAF')).toContain('000');
      expect(formatCurrency(1000000000, 'XAF')).toContain('FCFA');
    });
  });

  describe('Small numbers', () => {
    it('should format single digits correctly', () => {
      expect(formatCurrency(1, 'XAF')).toBe('1\u00A0FCFA');
      expect(formatCurrency(9, 'XAF')).toBe('9\u00A0FCFA');
    });

    it('should format two digits correctly', () => {
      expect(formatCurrency(10, 'XAF')).toBe('10\u00A0FCFA');
      expect(formatCurrency(99, 'XAF')).toBe('99\u00A0FCFA');
    });

    it('should format three digits correctly', () => {
      expect(formatCurrency(100, 'XAF')).toBe('100\u00A0FCFA');
      expect(formatCurrency(999, 'XAF')).toBe('999\u00A0FCFA');
    });
  });

  describe('Edge cases', () => {
    it('should handle very small decimal amounts', () => {
      expect(formatCurrency(0.01, 'XAF')).toBe('0\u00A0FCFA');
      expect(formatCurrency(0.49, 'XAF')).toBe('0\u00A0FCFA');
      expect(formatCurrency(0.5, 'XAF')).toBe('1\u00A0FCFA');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999999, 'XAF')).toContain('999');
      expect(formatCurrency(999999999999, 'XAF')).toContain('FCFA');
    });
  });

  describe('Formatting consistency', () => {
    it('should format amounts with proper spacing', () => {
      const result = formatCurrency(542300, 'XAF');
      expect(result).toMatch(/^\d{1,3}(\s\d{3})*\s\w+$/);
      expect(result.includes('FCFA')).toBe(true);
    });

    it('should format negative amounts with proper spacing', () => {
      const result = formatCurrency(-542300, 'XAF');
      expect(result).toMatch(/^-\d{1,3}(\s\d{3})*\s\w+$/);
      expect(result.includes('FCFA')).toBe(true);
    });
  });
});
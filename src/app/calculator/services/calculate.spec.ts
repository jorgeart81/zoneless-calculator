import { TestBed } from '@angular/core/testing';
import { Calculate } from './calculate';

describe('Calculate Service', () => {
  let service: Calculate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calculate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const enterKeys = (keys: string[]) => {
    for (const key of keys) {
      service.setKey(key).startCalculation();
    }
  };

  describe('Percentage calculations', () => {
    it('should correctly calculate 100 * 10% = 10', () => {
      enterKeys(['1', '0', '0', '*', '1', '0', '%']);
      expect(service.resultText()).toBe('10');
    });

    it('should correctly calculate 100 + 10% = 110', () => {
      enterKeys(['1', '0', '0', '+', '1', '0', '%']);
      expect(service.resultText()).toBe('110');
    });

    it('should correctly calculate 100 - 10% = 90', () => {
      enterKeys(['1', '0', '0', '-', '1', '0', '%']);
      expect(service.resultText()).toBe('90');
    });

    it('should correctly calculate 100 / 10% = 1000', () => {
      enterKeys(['1', '0', '0', '/', '1', '0', '%']);
      expect(service.resultText()).toBe('1000');
    });

    it('should correctly calculate unary percentage: 50% = 0.5', () => {
      enterKeys(['5', '0', '%']);
      expect(service.resultText()).toBe('0.5');
    });
  });

  describe('Standard calculations', () => {
    it('should perform basic addition: 15 + 25 = 40', () => {
      enterKeys(['1', '5', '+', '2', '5', 'Enter']);
      expect(service.resultText()).toBe('40');
    });

    it('should perform basic multiplication: 6 * 7 = 42', () => {
      enterKeys(['6', '*', '7', 'Enter']);
      expect(service.resultText()).toBe('42');
    });
  });

  describe('Constant calculations (Equal repeat: 2 + = = =)', () => {
    it('should calculate 2 + = = = as 4 -> 6 -> 8', () => {
      enterKeys(['2', '+', 'Enter']);
      expect(service.resultText()).toBe('4');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('6');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('8');
    });

    it('should calculate 2 + 3 = = = as 5 -> 8 -> 11', () => {
      enterKeys(['2', '+', '3', 'Enter']);
      expect(service.resultText()).toBe('5');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('8');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('11');
    });

    it('should calculate 5 * = = as 25 -> 125', () => {
      enterKeys(['5', '*', 'Enter']);
      expect(service.resultText()).toBe('25');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('125');
    });

    it('should calculate 10 - = = as 0 -> -10', () => {
      enterKeys(['1', '0', '-', 'Enter']);
      expect(service.resultText()).toBe('0');

      enterKeys(['Enter']);
      expect(service.resultText()).toBe('-10');
    });

    it('should reset constant operation when typing a new number after equal', () => {
      enterKeys(['2', '+', '3', 'Enter']);
      expect(service.resultText()).toBe('5');

      // Empezar nuevo número
      enterKeys(['7', '+', '2', 'Enter']);
      expect(service.resultText()).toBe('9');
    });
  });
});

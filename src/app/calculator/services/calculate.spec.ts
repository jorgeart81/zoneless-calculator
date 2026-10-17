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
});

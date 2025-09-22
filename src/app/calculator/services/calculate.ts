import { Injectable, signal } from '@angular/core';
import { mapAllowedCalculatorKey, type CalculatorNumberKey, type CalculatorKey, type CalculatorOperatorKey, calculateOperatorKeys } from './calculatorKeys';


@Injectable({
  providedIn: 'root'
})
export class Calculate {
  public resultText = signal('0')
  public subResultText = signal('0')
  public lastOperatorText = signal('+')
  private _keyCommand: CalculatorKey | null = null
  private _keyNumber: CalculatorNumberKey | null = null
  private _keyOperator: CalculatorOperatorKey | null = null
  private _formula: Array<CalculatorOperatorKey | number> = []
  private _builtTextNumber: string = ''
  private _nativeKey: string = ''
  private _operations: Record<CalculatorOperatorKey, (a: number, b: number) => number> = {
    'ADD': (a: number, b: number) => a + b,
    'SUBTRACT': (a: number, b: number) => a - b,
    'MULTIPLY': (a: number, b: number) => a * b,
    'DIVIDE': (a: number, b: number) => a / b,
    'EQUAL': (a: number, b: number) => b,
    'PERCENT': (a: number) => a / 100,
    'NEGATE': (a: number) => a * -1,
  }

  public static isAllowKey = (key: string) => mapAllowedCalculatorKey(key) !== undefined

  public setKey(key: string) {
    const allowedKey = mapAllowedCalculatorKey(key)

    if (allowedKey === undefined) throw new Error('Key not allowed');
    this._nativeKey = key;

    const { keyNumber, keyCommand, keyOperator } = allowedKey;

    this._keyCommand = keyCommand;
    this._keyNumber = keyNumber;
    this._keyOperator = keyOperator;
    return this
  };

  public startCalculation() {
    if (this._keyCommand === 'CLEAR') {
      this.clear();
      return
    }

    if (this._keyCommand === 'DELETE') this.delete();

    if (this._keyOperator === 'NEGATE') {
      const result = Number(this._builtTextNumber) * -1;
      this._builtTextNumber = result.toString();
    }

    if (this._keyOperator === 'EQUAL' && this._formula.length === 3) {
      const [a, operator, b] = this._formula;
      if (typeof a !== 'number' || typeof b !== 'number' || typeof operator !== 'string') return;

      const result = this._operations[operator](a, b);
      this.clear();
      this._formula = [result];
      this._builtTextNumber = result.toString();
    }

    if (this._keyOperator && this._keyOperator !== 'EQUAL' && this._keyOperator !== 'NEGATE') {
      if (this._builtTextNumber.trim().length > 0 && this._formula.length === 1) this.subResultText.set(this._builtTextNumber);
      this.lastOperatorText.set(this._nativeKey);
    }


    this.buildNumber()
    this.buildFormula()
    this.gerResult()
    this.resultText.set(this._builtTextNumber || '0');
  }

  private buildNumber = () => {
    const inputValue = this._keyNumber;
    const formattedNumber = this._builtTextNumber;

    if (formattedNumber.length >= 8) return
    if (inputValue === null) return
    if (inputValue === '.' && formattedNumber.includes('.')) return
    if (inputValue === '0' && formattedNumber == '0') return
    if (inputValue !== '0' && inputValue !== '.' && formattedNumber == '0') {
      this._builtTextNumber = inputValue;
      return
    }

    this._builtTextNumber = formattedNumber + inputValue.toString();
  }

  private buildFormula = () => {
    const builtNumber = this._builtTextNumber
    const operator = this._keyOperator

    this.addNumerToFormula(builtNumber)
    this.addOperatorToFormula(operator)

    return this
  }

  private addNumerToFormula(builtNumber: string) {
    const lastValue = this._formula[this._formula.length - 1]

    if (builtNumber.trim() === '') return

    if (lastValue === undefined || typeof lastValue === 'number') {
      this._formula.pop()
      this._formula.push(parseFloat(builtNumber));
    }

    if (lastValue !== undefined && typeof lastValue !== 'number') {
      this._formula.push(parseFloat(builtNumber));
    }
  }

  private addOperatorToFormula(operator: CalculatorOperatorKey | null) {
    const currentLastValue = this._formula[this._formula.length - 1]
    if (currentLastValue === undefined || operator === null || operator === 'EQUAL' || operator === 'NEGATE') return
    if (this._formula.length <= 0) return

    if (typeof currentLastValue !== 'number') {
      this._formula.pop();
      this._formula.push(operator);
      this._builtTextNumber = ''
      return
    }

    this._formula.push(operator);
    this._builtTextNumber = ''
  }

  private gerResult() {
    const updateAfterResult = (result: number, operator: CalculatorOperatorKey | null) => {

      this.subResultText.set(`${result}`);
      this._formula = operator === null ? [result] : [result, operator];
      this._builtTextNumber = '';
    }

    if (this._builtTextNumber.trim().length > 0 || this._formula.length <= 1) return

    const [a, operator, b, operator2] = this._formula;

    if (typeof a !== 'number' || typeof operator !== 'string') return;

    if (operator === 'PERCENT' && this._formula.length === 2) {
      updateAfterResult(a / 100, null);
      return
    }

    if (typeof b !== 'number') return;

    switch (operator2) {
      case 'PERCENT':
        const percentValue = (b / 100) * a;
        const percentResult = this._operations[operator](a, percentValue);

        this.clear();
        this._formula = [percentResult];
        this._builtTextNumber = percentResult.toString();
        return;
    }

    switch (operator) {
      case 'ADD':
        updateAfterResult(a + b, this._keyOperator ?? operator);
        break;
      case 'SUBTRACT':
        updateAfterResult(a - b, this._keyOperator ?? operator);
        break;
      case 'MULTIPLY':
        updateAfterResult(a * b, this._keyOperator ?? operator);
        break;
      case 'DIVIDE':
        updateAfterResult(a / b, this._keyOperator ?? operator);
        break;
    }
  }

  private delete = () => {
    if (this._formula.length <= 0) return
    this._keyNumber = null
    this._builtTextNumber = ''

    const lastValue = this._formula[this._formula.length - 1]

    if (typeof lastValue === 'number') {
      const textNumber = lastValue.toString();

      if (textNumber.length > 1) {
        this._builtTextNumber = textNumber.slice(0, -1)
        return
      }

      this._builtTextNumber = ''
    }

    this._formula.pop()
  }

  private clear = () => {
    this._keyCommand = null;
    this._keyNumber = null;
    this._keyOperator = null;
    this._builtTextNumber = ''
    this._formula = [];
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperatorText.set('+');
  }

}

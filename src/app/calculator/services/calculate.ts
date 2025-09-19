import { Injectable, signal } from '@angular/core';
import { mapAllowedCalculatorKey, type CalculatorNumberKey, type CalculatorKey, type CalculatorOperatorKey, calculateOperatorKeys } from './calculatorKeys';


@Injectable({
  providedIn: 'root'
})
export class Calculate {
  public resultText = signal('10')
  public subResultText = signal('0')
  public lastOperatorText = signal('+')
  private _allowKey: number | CalculatorKey | undefined
  private _keyCommand: CalculatorKey | null = null
  private _keyNumber: CalculatorNumberKey | null = null
  private _keyOperator: CalculatorOperatorKey | null = null
  private _lastCalculatorOperator: CalculatorOperatorKey | null = null
  private _formula: Array<CalculatorOperatorKey | number> = []
  private _builtTextNumber: string = ''

  public static isAllowKey = (key: string) => mapAllowedCalculatorKey(key) !== undefined

  public setKey(key: string) {
    const allowedKey = mapAllowedCalculatorKey(key)
    if (allowedKey === undefined) throw new Error('Key not allowed');

    const { keyNumber, keyCommand, keyOperator } = allowedKey;
    this._allowKey = keyCommand || keyNumber || keyOperator;

    this._keyCommand = keyCommand;
    this._keyNumber = keyNumber;
    this._keyOperator = keyOperator;
    return this
  };

  public buildNumber = () => {
    const inputValue = this._keyNumber;
    const formattedNumber = this._builtTextNumber;

    if (inputValue === null) return this;
    if (inputValue === '.' && formattedNumber.includes('.')) return this;
    if (inputValue === '0' && formattedNumber == '0') return this;
    if (inputValue !== '0' && inputValue !== '.' && formattedNumber == '0') {
      this._builtTextNumber = inputValue;
      return this;
    }

    this._builtTextNumber = formattedNumber + inputValue.toString();

    return this
  }

  public buildFormula = () => {
    const builtNumber = this._builtTextNumber
    const operator = this._keyOperator

    this.addNumerToFormula(builtNumber, operator)
    this.addOperatorToFormula(builtNumber, operator)

    return this
  }

  private addNumerToFormula(builtNumber: string, operator: CalculatorOperatorKey | null) {
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

  private addOperatorToFormula(builtNumber: string, operator: CalculatorOperatorKey | null) {
    const lastValue = this._formula[this._formula.length - 1]
    if (lastValue === undefined || operator === null || operator === 'EQUAL' || operator === 'NEGATE') return
    if (this._formula.length <= 0) return

    if (typeof lastValue !== 'number') {
      console.log('replace operator')
      this._formula.pop();
      this._formula.push(operator);
      this._builtTextNumber = ''
      return
    }

    this._formula.push(operator);
    this._builtTextNumber = ''
  }

  public useCommand() {
    if (this._allowKey === 'CLEAR') {
      this.clear();
    }
    if (this._allowKey === 'DELETE') {
      this.delete();
    }

    return this
  }

  private testForm: any[] = []

  private getOperatorFunctions(operator: CalculatorOperatorKey) {
    console.log({ operator })
    const functions = {
      'ADD': (value: number, subValue: number) => {
        this.testForm
        return { result: `${value + subValue}`, operatorSymbol: '+', operatorCalc: operator }
      },

      'SUBTRACT': (value: number, subValue: number) => {
        return { result: `${value - subValue}`, operatorSymbol: '-', operatorCalc: operator }
      },

      'MULTIPLY': (value: number, subValue: number) => {
        let multiplicand = value;
        let multiplier = subValue === 0 ? 1 : subValue;;

        return { result: `${multiplicand * multiplier}`, operatorSymbol: '*', operatorCalc: operator }
      },

      'DIVIDE': (value: number, subValue: number) => {
        let dividend = value;
        let divider = subValue === 0 ? 1 : subValue;

        if (subValue !== 0) {
          dividend = subValue
          divider = value
        }

        return { result: `${dividend / divider}`, operatorSymbol: '/', operatorCalc: operator }
      },

      'PERCENT': (value: number, subValue: number) => {
        return { result: `${(subValue / 100) * value}`, operatorSymbol: '%', operatorCalc: this._lastCalculatorOperator }
      },
    } as const;

    if (operator === 'EQUAL') {

    }

    if (operator in functions) {
      return functions[operator as keyof typeof functions];
    }

    return undefined;
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
    this._lastCalculatorOperator = null;
    this._keyCommand = null;
    this._keyNumber = null;
    this._keyOperator = null;
    this._allowKey = undefined;
    this._builtTextNumber = ''
    this._formula = [];
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperatorText.set('+');
  }

  public tested() {
    console.log('tested', { keyCommand: this._allowKey, builtText: this._builtTextNumber, keyNumber: this._keyNumber })
    console.log('tested', { formula: this._formula })
  }

}

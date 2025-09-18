import { Injectable, signal } from '@angular/core';
import { CalculatorAction, calculatorAllowedKeys, calculatorNumberKeys, CalculatorOperator } from './calculatorKeys';


@Injectable({
  providedIn: 'root'
})
export class Calculate {
  public resultText = signal('10')
  public subResultText = signal('0')
  public lastOperator = signal('+')
  private _lastCalculatorOperator: CalculatorOperator = 'ADD'
  private _allowKey: number | CalculatorAction | undefined

  public static isAllowKey = (key: string) => calculatorAllowedKeys[key] !== undefined

  public setKey(key: string) {
    this._allowKey = calculatorAllowedKeys[key]
    if (this._allowKey === undefined) return this;

    return this
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

  public useOperator() {
    this.calculateOperation(this._allowKey as CalculatorOperator);
    return this;
  }

  public buildNumber = () => {
    const num = `${this._allowKey}`;
    const current = this.resultText();

    if (!calculatorNumberKeys.includes(num)) return;
    if (num === '.' && current.includes('.')) return;
    if (num === '0' && current == '0') return
    if (num !== '0' && num !== '.' && current == '0') {
      this.resultText.set(num);
      return
    }

    this.resultText.update(prev => prev + num.toString());
  }

  private delete = () => {
    const currentValue = this.resultText();
    if (currentValue === '0') return;
    if (currentValue.length === 1) {
      this.resultText.set('0');
      return;
    }

    this.resultText.update(prev => prev.slice(0, -1) || '0');
  }

  private clear = () => {
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperator.set('+');
    this._lastCalculatorOperator = 'ADD';
  }

  private calculateOperation = (operator: CalculatorOperator) => {
    const currentValue = parseFloat(this.resultText());
    const subValue = parseFloat(this.subResultText());
    const isTheSameOperator = operator === this._lastCalculatorOperator;

    if (operator === 'EQUAL') {
      const operatorFunction = this.getOperatorFunctions(this._lastCalculatorOperator);
      if (!operatorFunction) { return };

      const { result } = operatorFunction(currentValue, subValue);
      this.resultText.set(result);
      this.subResultText.set('0');
      this.lastOperator.set('+');
      this._lastCalculatorOperator = 'ADD';
      return;
    }

    const operatorFunction = this.getOperatorFunctions(operator);
    if (!operatorFunction) return;

    const { result, operatorSymbol, operatorCalc } = operatorFunction(currentValue, subValue);

    this.subResultText.set(result);
    this.resultText.set('0');
    this.lastOperator.set(operatorSymbol);
    this._lastCalculatorOperator = operatorCalc;
  }

  private getOperatorFunctions(operator: CalculatorOperator) {
    const functions = {
      'ADD': (value: number, subValue: number) => {
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
}

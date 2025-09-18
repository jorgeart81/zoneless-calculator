import { Injectable, signal } from '@angular/core';
import { calculatorAllowedKeys, calculatorNumberKeys, CalculatorOperator } from './calculatorKeys';


@Injectable({
  providedIn: 'root'
})
export class Calculate {
  public resultText = signal('10')
  public subResultText = signal('0')
  public lastOperator = signal('+')
  private currentCalculatorOperator = signal<CalculatorOperator>('ADD')

  public isAllowKey = (key: string) => calculatorAllowedKeys[key] !== undefined
  public allowKey = (key: string) => calculatorAllowedKeys[key]



  public buildNumber = (num: string) => {
    if (!calculatorNumberKeys.includes(num)) return;
    if (num === '.' && this.resultText().includes('.')) return;
    if (num === '0' && this.resultText() == '0') return

    this.resultText.update(prev => prev + num.toString());
  }

  public delete = () => {
    const currentValue = this.resultText();
    if (currentValue === '0') return;
    if (currentValue.length === 1) {
      this.resultText.set('0');
      return;
    }

    this.resultText.update(prev => prev.slice(0, -1) || '0');
  }

  public clear = () => {
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperator.set('+');
    this.currentCalculatorOperator.set('ADD');
  }

  public calculateOperation = (operator: CalculatorOperator) => {
    const currentValue = parseFloat(this.resultText());
    const subValue = parseFloat(this.subResultText());

    if (operator === 'EQUAL') {
      const operatorFunction = this.getOperatorFunctions(this.currentCalculatorOperator());
      if (!operatorFunction) { return };

      const [result] = operatorFunction(currentValue, subValue);
      this.resultText.set(result.toString());
      this.subResultText.set('0');
      this.lastOperator.set('+');
      this.currentCalculatorOperator.set('ADD');
      return;
    }

    const operatorFunction = this.getOperatorFunctions(operator);
    if (!operatorFunction) return;

    const [result, operatorSymbol] = operatorFunction(currentValue, subValue);

    this.subResultText.set(result.toString());
    this.resultText.set('0');
    this.lastOperator.set(operatorSymbol.toString());
    this.currentCalculatorOperator.set(operator);
  }

  private getOperatorFunctions(operator: CalculatorOperator) {
    const functions = {
      'ADD': (value: number, subValue: number) => [value + subValue, '+'],
      'SUBTRACT': (value: number, subValue: number) => [value - subValue, '-'],
      'MULTIPLY': (value: number, subValue: number) => [value * subValue, '*'],
      'DIVIDE': (value: number, subValue: number) => [value / subValue, '/'],
      'PERCENT': (value: number, subValue: number) => [(subValue / 100) * value, '%'],
    } as const;

    if (operator in functions) {
      return functions[operator as keyof typeof functions];
    }

    return undefined;
  }
}

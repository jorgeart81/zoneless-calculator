import { Injectable, signal } from '@angular/core';
import { calculatorAllowedKeys } from './calculatorKeys';


@Injectable({
  providedIn: 'root'
})
export class Calculate {
  public resultText = signal('10')
  public subResultText = signal('0')
  public lastOperator = signal('+')

  public isAllowKey = (key: string) => calculatorAllowedKeys[key] !== undefined
  public allowKey = (key: string) => calculatorAllowedKeys[key]


}

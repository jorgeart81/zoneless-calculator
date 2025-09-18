import { AfterViewInit, Component, computed, inject, Signal, viewChildren } from '@angular/core';

import { Calculate } from '@/calculator/services/calculate';
import { CalculatorButton } from "../calculator-button/calculator-button";

@Component({
  selector: 'calculator',
  imports: [CalculatorButton],
  templateUrl: './calculator.html',
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)'
  }
})
export class Calculator implements AfterViewInit {
  private caculateService = inject(Calculate)
  private buttonsMatrix: Record<string, CalculatorButton | undefined> = {}
  public calculatorButtons: Signal<readonly CalculatorButton[]> = viewChildren(CalculatorButton)

  public resultText = computed(() => this.caculateService.resultText())
  public subResultText = computed(() => this.caculateService.subResultText())
  public lastOperator = computed(() => this.caculateService.lastOperator())

  ngAfterViewInit(): void {
    this.buttonsMatrix = this.getButtonsMatrix();
  }

  handleClick(key: string) {
    const mappedKey = this.mapButtonToKey(key);
    console.log({ mappedKey })
  }

  // @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.caculateService.isAllowKey(event.key)) return;

    this.handleClick(event.key);

    const key = this.mapKeyToButton(event.key);
    this.buttonsMatrix[key]?.keyboardPressedStyle(key)
  }

  private getButtonsMatrix(): Record<string, CalculatorButton | undefined> {
    let matrix: Record<string, CalculatorButton | undefined> = {}

    this.calculatorButtons().forEach(button => {
      const value = button.contentValue()?.nativeElement?.innerText.trim();
      if (!value) return;

      matrix[value] = button;
    });

    return matrix;
  }

  private mapKeyToButton(key: string): string {
    const keyMap: Record<string, string> = {
      'Escape': 'C',
      'Clear': 'C',
      '/': '÷',
      '*': 'x',
      'Enter': '=',
      '.': '.',
      ',': '.',
      '±': '+/-',
      'Delete': 'C',
    };

    return keyMap[key] || key;
  }

  private mapButtonToKey(key: string): string {
    const keyMap: Record<string, string> = {
      '÷': '/',
      'x': '*',
      '+/-': '±',
      'C': 'Clear',
    };

    return keyMap[key] || key;
  }

}



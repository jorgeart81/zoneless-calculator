import { AfterViewInit, Component, computed, inject, Signal, viewChildren } from '@angular/core';

import { Calculate } from '@/calculator/services/calculate';
import { CalculatorButton } from "../calculator-button/calculator-button";
import { NgClass } from '@angular/common';

@Component({
  selector: 'calculator',
  imports: [CalculatorButton, NgClass],
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
  public lastOperator = computed(() => this.caculateService.lastOperatorText())

  ngAfterViewInit(): void {
    this.buttonsMatrix = this.getButtonsMatrix();
  }

  handleClick(key: string) {
    const mappedKey = this.mapButtonToKey(key);

    this.caculateService
      .setKey(mappedKey)
      .startCalculation()
  }

  // @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!Calculate.isAllowKey(event.key)) return;

    this.handleClick(event.key);

    const key = this.mapKeyToButton(event.key);
    this.buttonsMatrix[key]?.keyboardPressedStyle(key)
  }

  private getButtonsMatrix(): Record<string, CalculatorButton | undefined> {
    let matrix: Record<string, CalculatorButton | undefined> = {}

    this.calculatorButtons().forEach(button => {
      const value = button.contentValue()?.nativeElement?.innerText.trim();
      if (value === undefined) return;

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
      '=': 'Enter',
    };

    return keyMap[key] || key;
  }

}



import { AfterViewInit, Component, Signal, viewChildren } from '@angular/core';
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
  public calculatorButtons: Signal<readonly CalculatorButton[]> = viewChildren(CalculatorButton)
  private buttonsMatrix: Record<string, CalculatorButton | undefined> = {}

  ngAfterViewInit(): void {
    this.buttonsMatrix = this.getButtonsMatrix();
  }

  handleClick(key: string) { console.log({ key }) }

  // @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = this.mapKeyToButtonId(event.key);
    if (!key) return;

    this.handleClick(key)
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

  private mapKeyToButtonId(key: string): string | undefined {
    const keyMap: Record<string, string> = {
      'c': 'C',
      'C': 'C',
      'Escape': 'C',
      'Clear': 'C',
      '%': '%',
      '/': '÷',
      '*': 'x',
      '-': '-',
      '+': '+',
      '=': '=',
      'Enter': '=',
      '.': '.',
      ',': '.',
      '±': '+/-',
      'Backspace': 'DEL',
      'Delete': 'AC',
      '0': '0',
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9',
    };

    return keyMap[key];
  }
}



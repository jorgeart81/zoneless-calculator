import { AfterViewInit, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'calculator-button',
  templateUrl: './calculator-button.html',
  host: {
    class: 'w-1/4 border-r border-b border-indigo-400',
    attribute: 'key-button',
    '[class.is-command]': 'isCommand()',
    '[class.is-double-size]': 'isDoubleSize()',
    '[class.is-pressed]': 'isPressed()',
  }
})
export class CalculatorButton implements AfterViewInit {
  public isPressed = signal(false)
  public onClick = output<string>();
  public contentValue = viewChild<ElementRef<HTMLButtonElement>>('button');
  private button: HTMLButtonElement | undefined
  private timer: ReturnType<typeof setTimeout> | undefined = undefined;

  ngAfterViewInit() {
    this.button = this.contentValue()?.nativeElement
  }

  public isCommand = input(false, {
    transform: (value: string | boolean) => typeof value === 'string' ? value === '' : value
  });
  public isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  handleClick() {
    if (!this.button) return
    this.onClick.emit(this.button.innerText.trim());
  }

  public keyboardPressedStyle(key: string) {
    if (!this.button) return
    const value = this.button.innerText.trim()

    if (key.trim() !== value) return

    this.isPressed.set(true)
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.isPressed.set(false)
    }, 100);
  }

}

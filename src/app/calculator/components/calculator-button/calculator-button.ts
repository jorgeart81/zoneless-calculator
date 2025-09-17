import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'calculator-button',
  templateUrl: './calculator-button.html',
  host: {
    class: 'w-1/4 border-r border-b border-indigo-400',
    attribute: 'key-button',
  }
})
export class CalculatorButton {
  public isCommand = input(false, {
    transform: (value: string | boolean) => typeof value === 'string' ? value === '' : value
  });

  public isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  @HostBinding('class.is-command') get bgIndigo500() {
    return this.isCommand();
  }

  @HostBinding('class.is-double-size') get commandStyle() {
    return this.isDoubleSize();
  }
}

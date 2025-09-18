export type CalculatorDecimalSeparator = '.' | ',';
export type CalculatorOperator = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'EQUAL' | 'PERCENT' | 'NEGATE';
export type CalculatorCommand = 'CLEAR' | 'DELETE';

export type CalculatorAction =
  | CalculatorDecimalSeparator
  | CalculatorOperator
  | CalculatorCommand;

export const calculatorAllowedKeys: Record<string, CalculatorAction | number> = {
  'Escape': 'CLEAR',
  'Clear': 'CLEAR',
  '%': 'PERCENT',
  '/': 'DIVIDE',
  '*': 'MULTIPLY',
  '-': 'SUBTRACT',
  '+': 'ADD',
  'Enter': 'EQUAL',
  '.': '.',
  '±': 'NEGATE',
  'Backspace': 'DELETE',
  'Delete': 'DELETE',
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
};

export const calculatorNumberKeys = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',',
];

export const calculatorNumberKeys = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
] as const;

export const calculatorCommandKeys = [
  'CLEAR', 'DELETE',
] as const;

export const calculateOperatorKeys = [
  'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'EQUAL', 'PERCENT', 'NEGATE',
] as const;


export function mapAllowedCalculatorKey(key: string) {
  const keyToNumberMap: Record<string, CalculatorNumberKey> = {
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
    '.': '.',
  }
  const keyToCommandMap: Record<string, CalculatorCommandKey> = {
    'Escape': 'CLEAR',
    'Clear': 'CLEAR',
    'Backspace': 'DELETE',
    'Delete': 'DELETE',
  }
  const keyToOperatorMap: Record<string, CalculatorOperatorKey> = {
    '%': 'PERCENT',
    '/': 'DIVIDE',
    '*': 'MULTIPLY',
    '-': 'SUBTRACT',
    '+': 'ADD',
    'Enter': 'EQUAL',
    '±': 'NEGATE',
  }

  const result = keyToCommandMap[key] || keyToNumberMap[key] || keyToOperatorMap[key];
  if (result === undefined) return undefined;

  return {
    keyNumber: keyToNumberMap[key] || null,
    keyCommand: keyToCommandMap[key] || null,
    keyOperator: keyToOperatorMap[key] || null
  }
}

export type CalculatorNumberKey = typeof calculatorNumberKeys[number];
export type CalculatorCommandKey = typeof calculatorCommandKeys[number];
export type CalculatorOperatorKey = typeof calculateOperatorKeys[number];
export type CalculatorKey = CalculatorNumberKey | CalculatorCommandKey | CalculatorOperatorKey;

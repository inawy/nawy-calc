export type Operator = '+' | '−' | '×' | '÷'

export type CalculatorState = {
  display: string
  storedValue: number | null
  pendingOperator: Operator | null
  waitingForOperand: boolean
  expression: string
  justEvaluated: boolean
}

export const createInitialState = (): CalculatorState => ({
  display: '0',
  storedValue: null,
  pendingOperator: null,
  waitingForOperand: false,
  expression: '',
  justEvaluated: false,
})

const MAX_DIGITS = 16

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return 'خطأ'
  if (Object.is(value, -0)) return '0'
  const rounded = Number.parseFloat(value.toPrecision(12))
  return String(rounded)
}

const numericDisplay = (display: string): number => Number(display.replace(',', '.'))

const calculate = (left: number, operator: Operator, right: number): number => {
  switch (operator) {
    case '+': return left + right
    case '−': return left - right
    case '×': return left * right
    case '÷': return right === 0 ? Number.NaN : left / right
  }
}

const recover = (): CalculatorState => createInitialState()

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (!/^\d$/.test(digit) || state.display === 'خطأ') return recover()
  if (state.justEvaluated) return { ...createInitialState(), display: digit }
  if (state.waitingForOperand) return { ...state, display: digit, waitingForOperand: false }
  if (state.display.replace('-', '').replace('.', '').length >= MAX_DIGITS) return state
  return { ...state, display: state.display === '0' ? digit : `${state.display}${digit}` }
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.justEvaluated || state.display === 'خطأ') return { ...createInitialState(), display: '0.' }
  if (state.waitingForOperand) return { ...state, display: '0.', waitingForOperand: false }
  return state.display.includes('.') ? state : { ...state, display: `${state.display}.` }
}

export function chooseOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.display === 'خطأ') return recover()
  const current = numericDisplay(state.display)
  if (state.storedValue === null) {
    return { ...state, storedValue: current, pendingOperator: operator, waitingForOperand: true, expression: `${formatNumber(current)} ${operator}`, justEvaluated: false }
  }
  if (state.pendingOperator && !state.waitingForOperand) {
    const result = calculate(state.storedValue, state.pendingOperator, current)
    return { ...state, display: formatNumber(result), storedValue: result, pendingOperator: operator, waitingForOperand: true, expression: `${formatNumber(result)} ${operator}`, justEvaluated: false }
  }
  return { ...state, pendingOperator: operator, expression: `${formatNumber(state.storedValue)} ${operator}` }
}

export function applyPercent(state: CalculatorState): CalculatorState {
  if (state.display === 'خطأ') return recover()
  const current = numericDisplay(state.display)
  const percent = state.storedValue !== null && state.pendingOperator !== null && !['×', '÷'].includes(state.pendingOperator)
    ? current * (state.storedValue / 100)
    : current / 100
  return { ...state, display: formatNumber(percent), waitingForOperand: false, justEvaluated: false }
}

export function toggleSign(state: CalculatorState): CalculatorState {
  if (state.display === 'خطأ' || state.display === '0') return state
  return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}`, justEvaluated: false }
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.waitingForOperand || state.justEvaluated || state.display === 'خطأ') return state
  const next = state.display.length > 1 ? state.display.slice(0, -1) : '0'
  return { ...state, display: next === '-' ? '0' : next }
}

export function clearEntry(state: CalculatorState): CalculatorState {
  return { ...state, display: '0', waitingForOperand: false, justEvaluated: false }
}

export function allClear(): CalculatorState {
  return createInitialState()
}

export function evaluate(state: CalculatorState): CalculatorState {
  if (state.display === 'خطأ') return recover()
  if (state.storedValue === null || state.pendingOperator === null) return state
  const current = numericDisplay(state.display)
  const result = calculate(state.storedValue, state.pendingOperator, current)
  return {
    display: formatNumber(result),
    storedValue: null,
    pendingOperator: null,
    waitingForOperand: true,
    expression: `${formatNumber(state.storedValue)} ${state.pendingOperator} ${formatNumber(current)} =`,
    justEvaluated: true,
  }
}

export const isError = (state: CalculatorState): boolean => state.display === 'خطأ'

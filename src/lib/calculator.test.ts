import { describe, expect, it } from 'vitest'
import {
  allClear, applyPercent, chooseOperator, createInitialState, evaluate,
  inputDecimal, inputDigit, toggleSign,
} from './calculator'

describe('calculator engine', () => {
  const number = (value: string) => value.split('').reduce(inputDigit, createInitialState())

  it('adds two values', () => {
    let state = chooseOperator(number('200'), '+')
    state = inputDigit(state, '2')
    state = inputDigit(state, '0')
    expect(evaluate(state).display).toBe('220')
  })

  it('uses the Windows Calculator percentage rule for addition', () => {
    let state = chooseOperator(number('200'), '+')
    state = inputDigit(state, '1')
    state = inputDigit(state, '0')
    state = applyPercent(state)
    expect(evaluate(state).display).toBe('220')
  })

  it('uses percentage as a fraction for multiplication', () => {
    let state = chooseOperator(number('200'), '×')
    state = inputDigit(state, '1')
    state = inputDigit(state, '0')
    state = applyPercent(state)
    expect(evaluate(state).display).toBe('20')
  })

  it('handles decimal input and sign changes', () => {
    let state = inputDigit(createInitialState(), '4')
    state = inputDecimal(state)
    state = inputDigit(state, '5')
    state = toggleSign(state)
    expect(state.display).toBe('-4.5')
  })

  it('returns an error for division by zero', () => {
    let state = chooseOperator(number('9'), '÷')
    state = inputDigit(state, '0')
    expect(evaluate(state).display).toBe('خطأ')
  })

  it('resets with all clear', () => {
    expect(allClear()).toEqual(createInitialState())
  })
})

import { useEffect, useMemo, useReducer, useState } from 'react'
import {
  allClear, applyPercent, backspace, chooseOperator, clearEntry, createInitialState,
  evaluate, inputDecimal, inputDigit, toggleSign, type CalculatorState, type Operator,
} from './lib/calculator'

type HistoryItem = { expression: string; result: string; time: number }
type Action = { type: 'digit'; value: string } | { type: 'decimal' } | { type: 'operator'; value: Operator } | { type: 'percent' } | { type: 'sign' } | { type: 'backspace' } | { type: 'clear' } | { type: 'allClear' } | { type: 'equals' }

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'digit': return inputDigit(state, action.value)
    case 'decimal': return inputDecimal(state)
    case 'operator': return chooseOperator(state, action.value)
    case 'percent': return applyPercent(state)
    case 'sign': return toggleSign(state)
    case 'backspace': return backspace(state)
    case 'clear': return clearEntry(state)
    case 'allClear': return allClear()
    case 'equals': return evaluate(state)
  }
}

const initialHistory = (): HistoryItem[] => {
  try { return JSON.parse(localStorage.getItem('nawy-calc-history') ?? '[]') as HistoryItem[] } catch { return [] }
}

const buttons: { label: string; action: Action; kind?: string; key?: string; aria: string }[] = [
  { label: 'AC', action: { type: 'allClear' }, kind: 'utility', key: 'Escape', aria: 'مسح الكل' },
  { label: '⌫', action: { type: 'backspace' }, kind: 'utility', key: 'Backspace', aria: 'حذف الرقم الأخير' },
  { label: '%', action: { type: 'percent' }, kind: 'utility', key: '%', aria: 'نسبة مئوية' },
  { label: '÷', action: { type: 'operator', value: '÷' }, kind: 'operator', key: '/', aria: 'قسمة' },
  { label: '7', action: { type: 'digit', value: '7' }, key: '7', aria: 'سبعة' },
  { label: '8', action: { type: 'digit', value: '8' }, key: '8', aria: 'ثمانية' },
  { label: '9', action: { type: 'digit', value: '9' }, key: '9', aria: 'تسعة' },
  { label: '×', action: { type: 'operator', value: '×' }, kind: 'operator', key: '*', aria: 'ضرب' },
  { label: '4', action: { type: 'digit', value: '4' }, key: '4', aria: 'أربعة' },
  { label: '5', action: { type: 'digit', value: '5' }, key: '5', aria: 'خمسة' },
  { label: '6', action: { type: 'digit', value: '6' }, key: '6', aria: 'ستة' },
  { label: '−', action: { type: 'operator', value: '−' }, kind: 'operator', key: '-', aria: 'طرح' },
  { label: '1', action: { type: 'digit', value: '1' }, key: '1', aria: 'واحد' },
  { label: '2', action: { type: 'digit', value: '2' }, key: '2', aria: 'اثنان' },
  { label: '3', action: { type: 'digit', value: '3' }, key: '3', aria: 'ثلاثة' },
  { label: '+', action: { type: 'operator', value: '+' }, kind: 'operator', key: '+', aria: 'جمع' },
  { label: '±', action: { type: 'sign' }, kind: 'utility', key: 'n', aria: 'تغيير الإشارة' },
  { label: '0', action: { type: 'digit', value: '0' }, key: '0', aria: 'صفر' },
  { label: '٫', action: { type: 'decimal' }, key: '.', aria: 'فاصلة عشرية' },
  { label: '=', action: { type: 'equals' }, kind: 'equals', key: 'Enter', aria: 'يساوي' },
]

function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [showHistory, setShowHistory] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('nawy-calc-theme') === 'dark')
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('nawy-calc-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const button = buttons.find((item) => item.key === key)
      if (!button && key !== 'c' && key !== 'C') return
      event.preventDefault()
      dispatch(button?.action ?? { type: 'clear' })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const expression = state.expression || (state.pendingOperator ? `${state.storedValue} ${state.pendingOperator}` : 'حسابك يبدأ من هنا')
  const formattedDisplay = useMemo(() => state.display.replace('.', '٫'), [state.display])

  const run = (action: Action) => {
    if (action.type === 'equals' && state.pendingOperator) {
      const next = evaluate(state)
      if (next.expression && next.display !== 'خطأ') {
        const item = { expression: next.expression, result: next.display, time: Date.now() }
        const nextHistory = [item, ...history].slice(0, 20)
        setHistory(nextHistory)
        localStorage.setItem('nawy-calc-history', JSON.stringify(nextHistory))
      }
    }
    dispatch(action)
  }

  const copyResult = (result: string) => {
    navigator.clipboard?.writeText(result)
    setCopyFeedback('تم النسخ')
    window.setTimeout(() => setCopyFeedback(''), 1600)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">ن</span><div><strong>Nawy Calc</strong><span>أدوات حساب بسيطة، بالعربي</span></div></div>
        <div className="top-actions">
          <button className={`action-button ${showHistory ? 'active' : ''}`} onClick={() => setShowHistory((value) => !value)} aria-label="عرض سجل العمليات" aria-pressed={showHistory}><span className="action-icon">⌁</span><span>السجل</span></button>
          <button className="action-button" onClick={() => setDark((value) => !value)} aria-label={dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}><span className="action-icon">{dark ? '☼' : '◐'}</span><span>{dark ? 'فاتح' : 'داكن'}</span></button>
        </div>
      </header>

      <section className="workspace">
        <div className="calculator-card" aria-label="حاسبة ناوي">
          <div className="display-panel">
            <div className="display-meta"><span className="eyebrow">الحاسبة الأساسية</span><span className="local-badge"><i /> محلي</span></div>
            <span className="expression" dir="ltr">{expression}</span>
            <output className="display" dir="ltr" aria-live="polite">{formattedDisplay}</output>
          </div>
          <div className="keypad">
            {buttons.map((button) => <button key={button.label} className={`calc-key ${button.kind ?? ''}`} onClick={() => run(button.action)} aria-label={button.aria}>{button.label}</button>)}
          </div>
          <div className="card-footer"><p className="keyboard-hint">استخدم لوحة المفاتيح: الأرقام، <kbd>Enter</kbd> للحساب، <kbd>Esc</kbd> للمسح</p><span className="privacy-note">لا يوجد حساب مطلوب</span></div>
        </div>

        {showHistory && <aside className="history-panel" aria-label="سجل العمليات">
          <div className="history-heading"><div><span className="eyebrow">محلي على جهازك</span><h2>السجل</h2></div><button className="text-button" onClick={() => { setHistory([]); localStorage.removeItem('nawy-calc-history') }}>مسح</button></div>
          {history.length === 0 ? <div className="empty-history"><span>⌁</span><p>لسه مفيش عمليات محفوظة.</p><small>نتائجك تفضل على جهازك فقط.</small></div> : <div className="history-list">{history.map((item) => <button className="history-item" key={item.time} onClick={() => copyResult(item.result)}><span dir="ltr">{item.expression}</span><strong dir="ltr">= {item.result.replace('.', '٫')}</strong><small>اضغط للنسخ</small></button>)}</div>}
        </aside>}
      </section>
      <div className={`copy-feedback ${copyFeedback ? 'visible' : ''}`} role="status">✓ {copyFeedback}</div>
      <footer className="footer-note"><span>مصمم للعربي أولًا</span><span className="dot">·</span><span>يعمل بدون حساب</span><span className="dot">·</span><span>بياناتك على جهازك</span></footer>
    </main>
  )
}

export default App

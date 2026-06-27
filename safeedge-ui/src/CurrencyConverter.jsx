import { useState, useEffect } from 'react'

// ── CURRENCY CONVERTER ───────────────────────────────
// fCC Mirror: Build a Currency Converter
// SafeEdge: M9 ESG & Sustainability Reporting
// Context: QHSE budgets, contractor invoices, and ESG
// reporting often involve multi-currency amounts —
// carbon credit pricing, equipment costs, training fees
// Concepts: useEffect, fetch API, controlled inputs,
// derived state

// Static rates — in production, replace with a real
// exchange rate API fetch e.g. exchangerate-api.com
const RATES = {
  USD: 1,
  KES: 129.50,
  EUR: 0.92,
  GBP: 0.79,
  ZAR: 18.63,
  NGN: 1580.00,
  UGX: 3750.00,
  TZS: 2680.00,
}

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar',         symbol: '$' },
  { code: 'KES', label: 'Kenyan Shilling',   symbol: 'KSh' },
  { code: 'EUR', label: 'Euro',              symbol: '€' },
  { code: 'GBP', label: 'British Pound',     symbol: '£' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { code: 'NGN', label: 'Nigerian Naira',    symbol: '₦' },
  { code: 'UGX', label: 'Ugandan Shilling',  symbol: 'USh' },
  { code: 'TZS', label: 'Tanzanian Shilling', symbol: 'TSh' },
]

// QHSE cost categories for context
const COST_CATEGORIES = [
  'Training & Competency',
  'PPE & Safety Equipment',
  'Audit & Certification',
  'Contractor Services',
  'Environmental Remediation',
  'Insurance & Liability',
]

function CurrencyConverter() {
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('KES')
  const [category, setCategory] = useState(COST_CATEGORIES[0])
  const [converted, setConverted] = useState(null)
  const [history, setHistory] = useState([])

  // ── useEffect — recalculate when inputs change ────
  useEffect(() => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setConverted(null)
      return
    }

    const fromRate = RATES[fromCurrency]
    const toRate = RATES[toCurrency]
    const result = (Number(amount) / fromRate) * toRate

    setConverted(result)
  }, [amount, fromCurrency, toCurrency])

  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  function handleAddToReport() {
    if (!converted) return
    const entry = {
      id: Date.now(),
      category,
      amount: Number(amount),
      fromCurrency,
      toCurrency,
      converted: converted.toFixed(2),
      rate: (RATES[toCurrency] / RATES[fromCurrency]).toFixed(4),
      date: new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }),
    }
    setHistory(prev => [entry, ...prev])
  }

  function handleRemove(id) {
    setHistory(prev => prev.filter(e => e.id !== id))
  }

  const fromSymbol = CURRENCIES.find(c => c.code === fromCurrency)?.symbol || ''
  const toSymbol = CURRENCIES.find(c => c.code === toCurrency)?.symbol || ''
  const exchangeRate = (RATES[toCurrency] / RATES[fromCurrency]).toFixed(4)

  const totalConverted = history.reduce((sum, e) => {
    if (e.toCurrency === toCurrency) return sum + Number(e.converted)
    return sum
  }, 0)

  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '800px', margin: '0 auto' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em', marginBottom: '4px' },
    sub: { fontSize: '13px', color: '#8a8070', marginBottom: '32px' },
    card: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' },
    section: { padding: '24px 28px', borderBottom: '1px solid #ddd8c8' },
    sectionLabel: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '16px' },
    row: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end', marginBottom: '16px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#4a4535' },
    input: { padding: '10px 12px', background: '#f0ece0', border: '1px solid #ddd8c8', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    select: { padding: '10px 12px', background: '#f0ece0', border: '1px solid #ddd8c8', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    swapBtn: { background: '#1a4f24', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '2px' },
    resultBox: { background: '#0d2b12', borderRadius: '8px', padding: '24px', marginBottom: '16px', textAlign: 'center' },
    resultLabel: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dca8a', marginBottom: '8px' },
    resultValue: { fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '700', color: '#fff', lineHeight: '1', marginBottom: '8px' },
    resultRate: { fontFamily: 'monospace', fontSize: '11px', color: '#3d6645' },
    addBtn: { background: '#2d7a3e', color: '#fff', fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', padding: '10px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '12px' },
    historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0ece0', gap: '12px' },
    removeBtn: { background: 'transparent', border: 'none', color: '#8a8070', cursor: 'pointer', fontSize: '16px', flexShrink: 0 },
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <header>
          <p style={s.eyebrow}>M9 · ESG & Sustainability Reporting</p>
          <h1 style={s.h1}>QHSE Cost Converter</h1>
          <p style={s.sub}>Convert QHSE budget items across African and global currencies. Aligned to M9 ESG cost tracking.</p>
        </header>

        <div style={s.card}>
          <div style={s.section}>
            <div style={s.sectionLabel}>Conversion</div>

            {/* Amount input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Amount</label>
                <input
                  style={s.input}
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
            </div>

            {/* Currency selectors with swap */}
            <div style={s.row}>
              <div style={s.fieldGroup}>
                <label style={s.label}>From</label>
                <select
                  style={s.select}
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleSwap} style={s.swapBtn} title="Swap currencies">
                ⇄
              </button>

              <div style={s.fieldGroup}>
                <label style={s.label}>To</label>
                <select
                  style={s.select}
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cost category */}
            <div style={s.fieldGroup}>
              <label style={s.label}>QHSE Cost Category</label>
              <select
                style={s.select}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {COST_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div style={{ padding: '24px 28px' }}>
            {converted !== null ? (
              <>
                <div style={s.resultBox}>
                  <div style={s.resultLabel}>Converted Amount</div>
                  <div style={s.resultValue}>
                    {toSymbol} {converted.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={s.resultRate}>
                    1 {fromCurrency} = {exchangeRate} {toCurrency} &nbsp;·&nbsp; {fromSymbol}{Number(amount).toLocaleString()} {fromCurrency}
                  </div>
                </div>

                <button onClick={handleAddToReport} style={s.addBtn}>
                  + Add to Cost Report
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', fontFamily: 'monospace', fontSize: '12px', color: '#8a8070' }}>
                Enter a valid amount to see conversion
              </div>
            )}
          </div>
        </div>

        {/* Cost report history */}
        {history.length > 0 && (
          <div style={s.card}>
            <div style={{ padding: '16px 28px', borderBottom: '1px solid #ddd8c8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={s.sectionLabel}>M9 Cost Report — {history.length} item{history.length !== 1 ? 's' : ''}</span>
              {totalConverted > 0 && (
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2d7a3e' }}>
                  Total: {toSymbol} {totalConverted.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </span>
              )}
            </div>
            <div style={{ padding: '0 28px' }}>
              {history.map(entry => (
                <div key={entry.id} style={s.historyItem}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1810', marginBottom: '2px' }}>
                      {entry.category}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>
                      {entry.fromCurrency} {Number(entry.amount).toLocaleString()} → {entry.toCurrency} {Number(entry.converted).toLocaleString()} · {entry.date}
                    </div>
                  </div>
                  <button onClick={() => handleRemove(entry.id)} style={s.removeBtn} title="Remove">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rate reference */}
        <div style={{ background: '#0d2b12', borderRadius: '8px', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dca8a', marginBottom: '12px' }}>
            Exchange Rate Reference — Base: USD
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
            {CURRENCIES.filter(c => c.code !== 'USD').map(c => (
              <div key={c.code} style={{ fontFamily: 'monospace', fontSize: '11px', color: '#a8d5b5' }}>
                1 USD = {RATES[c.code].toLocaleString()} {c.code}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3d6645', marginTop: '12px' }}>
            Rates are indicative — update with live API in production
          </div>
        </div>

      </div>
    </div>
  )
}

export default CurrencyConverter
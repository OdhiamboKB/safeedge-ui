import { useState } from 'react'

// ── TRIR / LTIFR CALCULATOR ──────────────────────────
// fCC Mirror: JavaScript Calculator certification project
// SafeEdge: M12 Dashboard — KPI frequency rate calculator
// Concepts: useState, derived calculations, input handling
// Formulas:
// TRIR  = (Recordable Incidents × 200,000) / Exposure Hours
// LTIFR = (Lost Time Injuries × 1,000,000) / Exposure Hours
// LTISR = (Lost Days × 1,000,000) / Exposure Hours

const INITIAL = {
  recordableIncidents: '',
  lostTimeInjuries: '',
  lostDays: '',
  exposureHours: '',
  period: '',
  site: '',
}

function ResultCard({ label, value, formula, status }) {
  const colors = {
    ok:      { border: '2px solid #2d7a3e', background: '#f0fdf4', valueColor: '#1a4f24' },
    warn:    { border: '2px solid #8b1a1a', background: '#fdf0f0', valueColor: '#8b1a1a' },
    neutral: { border: '1px solid #ddd8c8', background: '#fdfcf8', valueColor: '#1a1810' },
  }

  const c = colors[status] || colors.neutral

  return (
    <div style={{
      ...c,
      borderRadius: '8px',
      padding: '20px',
    }}>
      <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: c.valueColor, lineHeight: '1', marginBottom: '8px' }}>
        {value}
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#8a8070' }}>
        {formula}
      </p>
    </div>
  )
}

function TRIRCalculator() {
  const [inputs, setInputs] = useState(INITIAL)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!inputs.exposureHours || Number(inputs.exposureHours) <= 0)
      newErrors.exposureHours = 'Exposure hours required and must be greater than 0'
    if (inputs.recordableIncidents === '')
      newErrors.recordableIncidents = 'Enter 0 if none'
    if (inputs.lostTimeInjuries === '')
      newErrors.lostTimeInjuries = 'Enter 0 if none'
    if (inputs.lostDays === '')
      newErrors.lostDays = 'Enter 0 if none'
    return newErrors
  }

  function calculate() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const ri = Number(inputs.recordableIncidents)
    const lti = Number(inputs.lostTimeInjuries)
    const ld = Number(inputs.lostDays)
    const hours = Number(inputs.exposureHours)

    const trir  = ((ri * 200000) / hours).toFixed(2)
    const ltifr = ((lti * 1000000) / hours).toFixed(2)
    const ltisr = ((ld * 1000000) / hours).toFixed(2)

    setResults({
      trir,
      ltifr,
      ltisr,
      daysLTIFree: lti === 0 ? 'No LTIs recorded' : `${lti} LTI(s) recorded`,
      period: inputs.period || 'Not specified',
      site: inputs.site || 'Not specified',
    })
  }

  function handleReset() {
    setInputs(INITIAL)
    setResults(null)
    setErrors({})
  }

  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '800px', margin: '0 auto' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em', marginBottom: '4px' },
    sub: { fontSize: '13px', color: '#8a8070', marginBottom: '32px' },
    card: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' },
    section: { padding: '24px 28px' },
    sectionLabel: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '16px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#4a4535' },
    input: { padding: '10px 12px', background: '#f0ece0', border: '1px solid #ddd8c8', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    inputError: { padding: '10px 12px', background: '#fdf0f0', border: '1px solid #e8c0c0', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    error: { fontSize: '11px', color: '#8b1a1a' },
    footer: { padding: '20px 28px', background: '#f0ece0', borderTop: '1px solid #ddd8c8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btnCalc: { background: '#2d7a3e', color: '#fff', fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', padding: '11px 28px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    btnReset: { background: 'transparent', color: '#4a4535', fontSize: '13px', padding: '11px 20px', border: '1px solid #ddd8c8', borderRadius: '4px', cursor: 'pointer' },
    resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' },
    formulaBox: { background: '#0d2b12', borderRadius: '8px', padding: '20px 24px' },
    formulaTitle: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dca8a', marginBottom: '12px' },
    formulaLine: { fontFamily: 'monospace', fontSize: '12px', color: '#a8d5b5', lineHeight: '2' },
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <header>
          <p style={s.eyebrow}>M12 · Dashboard & AI Analytics</p>
          <h1 style={s.h1}>TRIR / LTIFR Calculator</h1>
          <p style={s.sub}>Calculate frequency rates from exposure hours and incident data. Aligned to ISO 45001 Cl. 9.1.</p>
        </header>

        <div style={s.card}>
          <div style={s.section}>
            <div style={s.sectionLabel}>Incident Data</div>

            <div style={s.row}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Recordable Incidents *</label>
                <input
                  style={errors.recordableIncidents ? s.inputError : s.input}
                  type="number"
                  name="recordableIncidents"
                  value={inputs.recordableIncidents}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
                {errors.recordableIncidents && <span style={s.error}>{errors.recordableIncidents}</span>}
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Lost Time Injuries (LTI) *</label>
                <input
                  style={errors.lostTimeInjuries ? s.inputError : s.input}
                  type="number"
                  name="lostTimeInjuries"
                  value={inputs.lostTimeInjuries}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
                {errors.lostTimeInjuries && <span style={s.error}>{errors.lostTimeInjuries}</span>}
              </div>
            </div>

            <div style={s.row}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Lost Days *</label>
                <input
                  style={errors.lostDays ? s.inputError : s.input}
                  type="number"
                  name="lostDays"
                  value={inputs.lostDays}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
                {errors.lostDays && <span style={s.error}>{errors.lostDays}</span>}
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Exposure Hours *</label>
                <input
                  style={errors.exposureHours ? s.inputError : s.input}
                  type="number"
                  name="exposureHours"
                  value={inputs.exposureHours}
                  onChange={handleChange}
                  placeholder="e.g. 48000"
                  min="1"
                />
                {errors.exposureHours && <span style={s.error}>{errors.exposureHours}</span>}
              </div>
            </div>

            <div style={s.row}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Period</label>
                <input
                  style={s.input}
                  type="text"
                  name="period"
                  value={inputs.period}
                  onChange={handleChange}
                  placeholder="e.g. June 2026"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Site</label>
                <input
                  style={s.input}
                  type="text"
                  name="site"
                  value={inputs.site}
                  onChange={handleChange}
                  placeholder="e.g. Site A — Nairobi"
                />
              </div>
            </div>
          </div>

          <div style={s.footer}>
            <span style={{ fontSize: '12px', color: '#8a8070' }}>* Required fields</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleReset} style={s.btnReset}>Reset</button>
              <button onClick={calculate} style={s.btnCalc}>Calculate Rates</button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '16px' }}>
              Results · {results.site} · {results.period}
            </div>

            <div style={s.resultsGrid}>
              <ResultCard
                label="TRIR"
                value={results.trir}
                formula="(Incidents × 200,000) ÷ Hours"
                status={Number(results.trir) > 0.5 ? 'warn' : 'ok'}
              />
              <ResultCard
                label="LTIFR"
                value={results.ltifr}
                formula="(LTIs × 1,000,000) ÷ Hours"
                status={Number(results.ltifr) > 0 ? 'warn' : 'ok'}
              />
              <ResultCard
                label="LTISR"
                value={results.ltisr}
                formula="(Lost Days × 1,000,000) ÷ Hours"
                status={Number(results.ltisr) > 0 ? 'warn' : 'ok'}
              />
            </div>

            <div style={s.formulaBox}>
              <div style={s.formulaTitle}>Formula Reference — ISO 45001 Cl. 9.1</div>
              <div style={s.formulaLine}>TRIR  = (Recordable Incidents × 200,000) ÷ Exposure Hours</div>
              <div style={s.formulaLine}>LTIFR = (Lost Time Injuries × 1,000,000) ÷ Exposure Hours</div>
              <div style={s.formulaLine}>LTISR = (Lost Days × 1,000,000) ÷ Exposure Hours</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3d6645', marginTop: '12px' }}>
                200,000 = 100 workers × 2,000 hours/year · 1,000,000 = standard international base rate
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default TRIRCalculator
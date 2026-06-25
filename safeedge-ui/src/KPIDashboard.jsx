import { useState, useEffect } from 'react'

// ── KPI DASHBOARD COMPONENT ──────────────────────────
// M12 Dashboard — AI Analytics
// Concept: useEffect simulates a data fetch on mount
// In production: replace simulateFetch with a real
// fetch() call to the Flask API /calculate endpoint

// Simulated API response — mirrors /calculate endpoint
function simulateFetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        trir: 0.42,
        ltifr: 0.18,
        ltisr: 0.00,
        daysLTIFree: 47,
        openActions: 7,
        nearMisses: 3,
        trainingCompliance: 94,
        period: 'June 2026',
        site: 'Site A',
      })
    }, 1500) // 1.5 second delay simulates network request
  })
}

function KPICard({ label, value, unit, status }) {
  const statusColors = {
    ok:      { border: '2px solid #2d7a3e', background: '#f0fdf4' },
    warn:    { border: '2px solid #8b1a1a', background: '#fdf0f0' },
    neutral: { border: '1px solid #ddd8c8', background: '#fdfcf8' },
  }

  const valueColors = {
    ok:      '#1a4f24',
    warn:    '#8b1a1a',
    neutral: '#1a1810',
  }

  return (
    <div style={{
      ...statusColors[status],
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <span style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#8a8070',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'Georgia, serif',
        fontSize: '32px',
        fontWeight: '700',
        color: valueColors[status],
        lineHeight: '1',
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: '14px', fontWeight: '400', color: '#8a8070', marginLeft: '4px' }}>
            {unit}
          </span>
        )}
      </span>
    </div>
  )
}

function KPIDashboard() {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── useEffect — runs once on mount ────────────────
  // Empty dependency array [] means: run this effect
  // once when the component first renders, then stop.
  // In production: replace simulateFetch() with:
  // fetch('https://api.kbsafeedge.com/v1/calculate', { headers })
  //   .then(res => res.json())
  //   .then(data => setKpis(data))
  useEffect(() => {
    setLoading(true)
    simulateFetch()
      .then(data => {
        setKpis(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load KPI data.')
        setLoading(false)
      })
  }, []) // ← empty array = run once on mount

  // ── LOADING STATE ─────────────────────────────────
  if (loading) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px', height: '32px', border: '3px solid #ddd8c8',
            borderTop: '3px solid #2d7a3e', borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8070' }}>
            Loading KPI data...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // ── ERROR STATE ───────────────────────────────────
  if (error) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8b1a1a', fontFamily: 'monospace' }}>{error}</p>
      </div>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────
  return (
    <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' }}>
              M12 · Dashboard & AI Analytics
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em' }}>
              QHSE Dashboard
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>{kpis.site}</p>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>{kpis.period}</p>
          </div>
        </header>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <KPICard label="TRIR"              value={kpis.trir}                unit=""    status="warn" />
          <KPICard label="LTIFR"             value={kpis.ltifr}               unit=""    status="ok" />
          <KPICard label="LTISR"             value={kpis.ltisr}               unit=""    status="ok" />
          <KPICard label="Days LTI-Free"     value={kpis.daysLTIFree}         unit="days" status="ok" />
          <KPICard label="Open Actions"      value={kpis.openActions}         unit=""    status="warn" />
          <KPICard label="Near Misses"       value={kpis.nearMisses}          unit=""    status="neutral" />
          <KPICard label="Training Compliance" value={kpis.trainingCompliance} unit="%"  status="ok" />
        </div>

        {/* AI Insight Panel */}
        <div style={{
          background: '#0d2b12',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#5dca8a',
            whiteSpace: 'nowrap',
            marginTop: '2px',
          }}>
            AI Insight
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#a8d5b5', lineHeight: '1.6', marginBottom: '8px' }}>
              TRIR of <strong style={{ color: '#fff' }}>0.42</strong> is above the target threshold of 0.30. 
              The slip incident at Loading Bay (INC-2026-047) and the chemical spill (INC-2026-046) 
              are the primary contributors. Drainage system inspection overdue action is the highest priority item.
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3d6645', letterSpacing: '0.06em' }}>
              Generated · ISO 45001 Cl. 9.3 · {kpis.period}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default KPIDashboard
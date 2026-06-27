import { useState, useEffect } from 'react'

// ── KPI DASHBOARD COMPONENT ──────────────────────────
// M12 Dashboard — AI Analytics
// Now connected to SafeEdge Flask API
// Endpoint: GET /api/kpis

const API_BASE = 'http://127.0.0.1:5000/api'

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

  // ── useEffect — fetches from Flask API on mount ───
  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/kpis`)
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => {
        setKpis(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Could not connect to SafeEdge API. Is the Flask server running?')
        setLoading(false)
      })
  }, [])

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
            Connecting to SafeEdge API...
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
        <div style={{ background: '#fdf0f0', border: '1px solid #e8c0c0', borderRadius: '8px', padding: '24px', maxWidth: '480px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b1a1a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            API Connection Error
          </p>
          <p style={{ fontSize: '13px', color: '#4a4535' }}>{error}</p>
        </div>
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
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5dca8a', marginTop: '4px' }}>
              ● Live — SafeEdge API
            </p>
          </div>
        </header>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <KPICard label="TRIR"                value={kpis.trir}                unit=""     status="warn" />
          <KPICard label="LTIFR"               value={kpis.ltifr}               unit=""     status="ok" />
          <KPICard label="LTISR"               value={kpis.ltisr}               unit=""     status="ok" />
          <KPICard label="Days LTI-Free"       value={kpis.days_lti_free}       unit="days" status="ok" />
          <KPICard label="Open Actions"        value={kpis.open_actions}        unit=""     status="warn" />
          <KPICard label="Near Misses"         value={kpis.near_misses}         unit=""     status="neutral" />
          <KPICard label="Training Compliance" value={kpis.training_compliance} unit="%"    status="ok" />
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
              TRIR of <strong style={{ color: '#fff' }}>{kpis.trir}</strong> is above the target threshold of 0.30.
              {kpis.open_actions > 0 && ` ${kpis.open_actions} open actions require attention.`}
              {kpis.training_compliance < 100 && ` Training compliance at ${kpis.training_compliance}% — review expiring certificates.`}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3d6645', letterSpacing: '0.06em' }}>
              Generated · ISO 45001 Cl. 9.3 · {kpis.period} · Live from SafeEdge API
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default KPIDashboard
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:5000/api'

const BADGE_STYLES = {
  High:     { background: '#fdf0f0', color: '#8b1a1a', border: '1px solid #e8c0c0' },
  Medium:   { background: '#fdf6e8', color: '#7a4a00', border: '1px solid #e8d4a0' },
  Low:      { background: '#e8f2e9', color: '#1a4f24', border: '1px solid #b8d8bc' },
  NearMiss: { background: '#eef4fb', color: '#1a3a5c', border: '1px solid #b8cce0' },
}

const STATUS_STYLES = {
  Open:           { background: '#fdf0f0', color: '#8b1a1a' },
  'Under Review': { background: '#fdf6e8', color: '#7a4a00' },
  Closed:         { background: '#e8f2e9', color: '#1a4f24' },
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '6px 16px',
        borderRadius: '20px',
        border: active ? '2px solid #1a4f24' : '1px solid #ddd8c8',
        background: active ? '#1a4f24' : '#fdfcf8',
        color: active ? '#fff' : '#8a8070',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function IncidentCard({ id, title, severity, date, time, location, reporter_name, description, status }) {
  const [rcaOpen, setRcaOpen] = useState(false)
  const badge = BADGE_STYLES[severity] || BADGE_STYLES.Low
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Open

  return (
    <article style={{
      background: '#fdfcf8',
      border: '1px solid #ddd8c8',
      borderRadius: '6px',
      marginBottom: '16px',
      overflow: 'hidden',
    }}>
      <header style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid #ddd8c8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '6px' }}>
            {id}
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: '#1a1810', marginBottom: '8px' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>
            {date} {time && `· ${time}`} · {location}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
          <span style={{
            ...badge,
            fontFamily: 'monospace', fontSize: '10px', fontWeight: '500',
            padding: '4px 12px', borderRadius: '3px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {severity}
          </span>
          <span style={{
            ...statusStyle,
            fontFamily: 'monospace', fontSize: '10px',
            padding: '3px 10px', borderRadius: '3px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {status}
          </span>
        </div>
      </header>

      <div style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: '14px', color: '#4a4535', lineHeight: '1.65', marginBottom: '16px' }}>
          {description}
        </p>
        <div style={{ border: '1px solid #ddd8c8', borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => setRcaOpen(!rcaOpen)}
            style={{
              width: '100%', padding: '10px 14px', background: '#f0ece0',
              border: 'none', fontFamily: 'monospace', fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a4535',
              cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <span style={{ fontSize: '9px', transform: rcaOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
            Root Cause Analysis — 5-Why
          </button>
          {rcaOpen && (
            <div style={{ padding: '14px', fontSize: '13px', color: '#4a4535', lineHeight: '1.6' }}>
              RCA investigation in progress. Assign to QHSE officer to complete 5-Why analysis.
            </div>
          )}
        </div>
      </div>

      <footer style={{
        padding: '14px 24px', borderTop: '1px solid #ddd8c8', background: '#f0ece0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8a8070' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#e8f2e9', border: '1px solid #ddd8c8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '700', color: '#1a4f24',
          }}>
            {reporter_name ? reporter_name.split(' ').map(n => n[0]).join('') : '?'}
          </div>
          Reported by <strong style={{ color: '#4a4535' }}>{reporter_name}</strong>
        </div>
        <button style={{
          background: '#1a1810', color: '#fff', fontFamily: 'monospace',
          fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: '3px', border: 'none', cursor: 'pointer',
        }}>
          Investigate
        </button>
      </footer>
    </article>
  )
}

function IncidentFeed() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()

  // ── Fetch incidents from Flask API ───────────────
  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/incidents`)
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => {
        setIncidents(data.incidents)
        setLoading(false)
      })
      .catch(err => {
        setError('Could not load incidents. Is the Flask server running?')
        setLoading(false)
      })
  }, [])

  const filteredIncidents = activeFilter === 'All'
    ? incidents
    : incidents.filter(inc => inc.severity === activeFilter)

  if (loading) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading incidents from SafeEdge API...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fdf0f0', border: '1px solid #e8c0c0', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b1a1a', textTransform: 'uppercase', marginBottom: '8px' }}>API Connection Error</p>
          <p style={{ fontSize: '13px', color: '#4a4535' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' }}>
              M2 · Incident Management
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em' }}>
              Incident Feed
            </h1>
            <p style={{ fontSize: '13px', color: '#8a8070', marginTop: '4px' }}>
              Site A · {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''} · <span style={{ color: '#5dca8a' }}>● Live</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/incidents/new')}
            style={{
              background: '#2d7a3e', color: '#fff',
              fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700',
              padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            }}
          >
            + Report Incident
          </button>
        </header>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['All', 'High', 'Medium', 'NearMiss'].map(filter => (
            <FilterButton
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        {filteredIncidents.length > 0
          ? filteredIncidents.map(incident => (
              <IncidentCard key={incident.id} {...incident} />
            ))
          : (
            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8a8070', textAlign: 'center', padding: '40px' }}>
              No incidents matching this filter.
            </p>
          )
        }

      </div>
    </div>
  )
}

export default IncidentFeed
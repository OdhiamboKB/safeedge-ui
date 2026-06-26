import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── INCIDENT DATA ────────────────────────────────────
const INCIDENTS = [
  {
    id: 'INC-2026-047',
    title: 'Slip on Wet Surface — Loading Bay Entrance',
    severity: 'High',
    date: 'May 2, 2026 · 09:14 EAT',
    location: 'Site A · Loading Bay',
    reporter: 'James Omondi',
    reporterInitials: 'JO',
    description: 'Worker reported a slip and fall near the loading bay entrance following overnight rainfall. The drainage channel was blocked, causing water pooling across the pedestrian walkway. No lost time recorded. Worker received first aid on site.',
    rootCause: 'Why did the worker slip? Water had pooled on the walkway. Why was water pooling? The drainage channel was blocked. Why was it blocked? Weekly drain inspection was overdue by 3 days. Root cause: absence of a digital inspection tracking system.',
    status: 'Open',
  },
  {
    id: 'NM-2026-048',
    title: 'Unsecured Load — Forklift Operation Area',
    severity: 'NearMiss',
    date: 'May 1, 2026 · 14:32 EAT',
    location: 'Site A · Warehouse B',
    reporter: 'Amina Wanjiku',
    reporterInitials: 'AW',
    description: 'Supervisor observed a pallet stack exceeding safe height in the active forklift operating zone. No injury occurred. Work was stopped immediately and the load was re-secured. This is the second near-miss in this area in 30 days.',
    rootCause: 'Immediate cause: pallet stack exceeded safe stacking height. Load re-secured and area barricaded. Forklift operator briefed on safe stacking limits.',
    status: 'Under Review',
  },
  {
    id: 'INC-2026-046',
    title: 'Chemical Spill — Battery Charging Room',
    severity: 'Medium',
    date: 'April 30, 2026 · 07:55 EAT',
    location: 'Site A · Workshop',
    reporter: 'Kamau Mutua',
    reporterInitials: 'KM',
    description: 'Small electrolyte spill occurred during battery top-up procedure. Sulfuric acid solution contacted the floor surface. Spill kit deployed within 4 minutes. No skin contact confirmed.',
    rootCause: 'Immediate cause: battery overfilled during top-up. Area isolated and ventilated. Spill neutralised with sodium bicarbonate.',
    status: 'Closed',
  },
]

const BADGE_STYLES = {
  High:     { background: '#fdf0f0', color: '#8b1a1a', border: '1px solid #e8c0c0' },
  Medium:   { background: '#fdf6e8', color: '#7a4a00', border: '1px solid #e8d4a0' },
  Low:      { background: '#e8f2e9', color: '#1a4f24', border: '1px solid #b8d8bc' },
  NearMiss: { background: '#eef4fb', color: '#1a3a5c', border: '1px solid #b8cce0' },
}

const STATUS_STYLES = {
  Open:         { background: '#fdf0f0', color: '#8b1a1a' },
  'Under Review': { background: '#fdf6e8', color: '#7a4a00' },
  Closed:       { background: '#e8f2e9', color: '#1a4f24' },
}

// ── FILTER BUTTON ────────────────────────────────────
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

// ── INCIDENT CARD ────────────────────────────────────
function IncidentCard({ id, title, severity, date, location, reporter, reporterInitials, description, rootCause, status }) {
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
            {date} · {location}
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
              {rootCause}
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
            {reporterInitials}
          </div>
          Reported by <strong style={{ color: '#4a4535' }}>{reporter}</strong>
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

// ── INCIDENT FEED ────────────────────────────────────
function IncidentFeed() {
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()

  const filteredIncidents = activeFilter === 'All'
    ? INCIDENTS
    : INCIDENTS.filter(inc => inc.severity === activeFilter)

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
              Site A · June 2026 · {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''}
            </p>
          </div>
          {/* useNavigate — programmatic navigation to the form */}
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

        {/* Filter bar */}
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

        {/* Incident list */}
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
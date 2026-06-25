import { useState } from 'react'
import './App.css'

// ── INCIDENT CARD COMPONENT ──────────────────────────
// M2 Incident Management — INC-2026-047
// Converted from safeedge_m2_incident_feed.html
// First SafeEdge React component — KB SafeEdge v2.3
// Concepts: props, useState, conditional rendering, events

function IncidentCard({ id, title, severity, date, location, reporter, reporterInitials, description, rootCause }) {
  const [rcaOpen, setRcaOpen] = useState(false)

  const severityStyles = {
    High:     { background: '#fdf0f0', color: '#8b1a1a', border: '1px solid #e8c0c0' },
    Medium:   { background: '#fdf6e8', color: '#7a4a00', border: '1px solid #e8d4a0' },
    Low:      { background: '#e8f2e9', color: '#1a4f24', border: '1px solid #b8d8bc' },
    NearMiss: { background: '#eef4fb', color: '#1a3a5c', border: '1px solid #b8cce0' },
  }

  const badge = severityStyles[severity] || severityStyles.Low

  return (
    <article style={{
      background: '#fdfcf8',
      border: '1px solid #ddd8c8',
      borderRadius: '6px',
      marginBottom: '16px',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Card Header */}
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
        <span style={{
          ...badge,
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: '500',
          padding: '4px 12px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {severity}
        </span>
      </header>

      {/* Card Body */}
      <div style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: '14px', color: '#4a4535', lineHeight: '1.65', marginBottom: '16px' }}>
          {description}
        </p>

        {/* RCA Toggle — useState controlling open/close */}
        <div style={{ border: '1px solid #ddd8c8', borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => setRcaOpen(!rcaOpen)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#f0ece0',
              border: 'none',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#4a4535',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '9px', transition: 'transform 0.2s', transform: rcaOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
            Root Cause Analysis — 5-Why
          </button>

          {/* Conditional rendering — only shows when rcaOpen is true */}
          {rcaOpen && (
            <div style={{ padding: '14px', fontSize: '13px', color: '#4a4535', lineHeight: '1.6' }}>
              {rootCause}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <footer style={{
        padding: '14px 24px',
        borderTop: '1px solid #ddd8c8',
        background: '#f0ece0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
          background: '#1a1810', color: '#fff',
          fontFamily: 'monospace', fontSize: '10px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: '3px', border: 'none', cursor: 'pointer',
        }}>
          Investigate
        </button>
      </footer>

    </article>
  )
}

// ── APP ROOT ─────────────────────────────────────────
function App() {
  return (
    <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Page Header */}
        <header style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' }}>
            M2 · Incident Management
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em' }}>
            Incident Feed
          </h1>
          <p style={{ fontSize: '13px', color: '#8a8070', marginTop: '4px' }}>Site A · June 2026</p>
        </header>

        {/* Incident Card — props passed in */}
        <IncidentCard
          id="INC-2026-047"
          title="Slip on Wet Surface — Loading Bay Entrance"
          severity="High"
          date="May 2, 2026 · 09:14 EAT"
          location="Site A · Loading Bay"
          reporter="James Omondi"
          reporterInitials="JO"
          description="Worker reported a slip and fall near the loading bay entrance following overnight rainfall. The drainage channel was blocked, causing water pooling across the pedestrian walkway. No lost time recorded. Worker received first aid on site."
          rootCause="Why did the worker slip? Water had pooled on the walkway. Why was water pooling? The drainage channel was blocked. Why was it blocked? Weekly drain inspection was overdue by 3 days. Why was it overdue? No automated reminder was in place. Root cause: absence of a digital inspection tracking system."
        />

        <IncidentCard
          id="NM-2026-048"
          title="Unsecured Load — Forklift Operation Area"
          severity="NearMiss"
          date="May 1, 2026 · 14:32 EAT"
          location="Site A · Warehouse B"
          reporter="Amina Wanjiku"
          reporterInitials="AW"
          description="Supervisor observed a pallet stack exceeding safe height in the active forklift operating zone. No injury occurred. Work was stopped immediately and the load was re-secured. This is the second near-miss in this area in 30 days."
          rootCause="Immediate cause: pallet stack exceeded safe stacking height. Load re-secured and area barricaded. Forklift operator briefed on safe stacking limits. Daily stacking checks assigned for 30 days."
        />

      </div>
    </div>
  )
}

export default App
import { useState, useEffect, useRef } from 'react'

// ── PERMIT TO WORK TIMER ─────────────────────────────
// fCC Mirror: 25+5 Clock certification project
// SafeEdge: M10 Permit to Work — countdown timer
// enforcing permit duration and break intervals
// Concepts: useEffect, useRef, setInterval, clearInterval
// PTW Types: Hot Work, Confined Space, Working at Height

const PERMIT_TYPES = [
  { id: 'hot-work',       label: 'Hot Work',            workMins: 25, breakMins: 5,  color: '#8b1a1a' },
  { id: 'confined-space', label: 'Confined Space Entry', workMins: 20, breakMins: 10, color: '#7a4a00' },
  { id: 'height',         label: 'Working at Height',    workMins: 30, breakMins: 5,  color: '#1a3a5c' },
  { id: 'electrical',     label: 'Electrical Isolation', workMins: 45, breakMins: 15, color: '#1a4f24' },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${pad(mins)}:${pad(secs)}`
}

function PermitTimer() {
  const [selectedPermit, setSelectedPermit] = useState(PERMIT_TYPES[0])
  const [phase, setPhase] = useState('work') // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(PERMIT_TYPES[0].workMins * 60)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [expired, setExpired] = useState(false)

  const intervalRef = useRef(null)

  // ── useEffect — manages the interval ─────────────
  // Runs whenever `running` changes.
  // Cleans up the interval on unmount or when stopped.
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time ran out — switch phase
            clearInterval(intervalRef.current)
            setRunning(false)

            if (phase === 'work') {
              // Work phase ended — start break
              setPhase('break')
              setTimeLeft(selectedPermit.breakMins * 60)
              setCycles(c => c + 1)
            } else {
              // Break phase ended — permit expired
              setPhase('work')
              setExpired(true)
              setTimeLeft(0)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    // Cleanup — runs when effect re-runs or component unmounts
    return () => clearInterval(intervalRef.current)
  }, [running, phase, selectedPermit])

  function handleStart() {
    if (expired) return
    setRunning(true)
  }

  function handlePause() {
    setRunning(false)
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setPhase('work')
    setTimeLeft(selectedPermit.workMins * 60)
    setCycles(0)
    setExpired(false)
  }

  function handleSelectPermit(permit) {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSelectedPermit(permit)
    setPhase('work')
    setTimeLeft(permit.workMins * 60)
    setCycles(0)
    setExpired(false)
  }

  // Progress percentage for the ring
  const totalSeconds = phase === 'work'
    ? selectedPermit.workMins * 60
    : selectedPermit.breakMins * 60
  const progress = timeLeft / totalSeconds
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference * (1 - progress)

  const phaseColor = expired
    ? '#8b1a1a'
    : phase === 'work'
      ? selectedPermit.color
      : '#2d7a3e'

  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '720px', margin: '0 auto' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em', marginBottom: '4px' },
    sub: { fontSize: '13px', color: '#8a8070', marginBottom: '32px' },
    card: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' },
    permitGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', padding: '20px 24px', borderBottom: '1px solid #ddd8c8' },
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <header>
          <p style={s.eyebrow}>M10 · Permit to Work</p>
          <h1 style={s.h1}>PTW Countdown Timer</h1>
          <p style={s.sub}>Select a permit type. Timer enforces work duration and mandatory break intervals per ISO 45001 Cl. 8.1.</p>
        </header>

        <div style={s.card}>

          {/* Permit type selector */}
          <div style={s.permitGrid}>
            {PERMIT_TYPES.map(permit => (
              <button
                key={permit.id}
                onClick={() => handleSelectPermit(permit)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: selectedPermit.id === permit.id
                    ? `2px solid ${permit.color}`
                    : '1px solid #ddd8c8',
                  background: selectedPermit.id === permit.id
                    ? `${permit.color}18`
                    : '#fdfcf8',
                  color: selectedPermit.id === permit.id ? permit.color : '#8a8070',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: '1.6',
                }}
              >
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{permit.label}</div>
                <div style={{ opacity: 0.7 }}>{permit.workMins}min work · {permit.breakMins}min break</div>
              </button>
            ))}
          </div>

          {/* Timer display */}
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

            {/* Phase label */}
            <div style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: phaseColor,
              fontWeight: '700',
            }}>
              {expired ? '⚠ Permit Expired — Cease Work' : phase === 'work' ? '🔧 Work Phase Active' : '☕ Mandatory Break'}
            </div>

            {/* SVG countdown ring */}
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background ring */}
                <circle
                  cx="70" cy="70" r="54"
                  fill="none"
                  stroke="#e8e4d8"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="70" cy="70" r="54"
                  fill="none"
                  stroke={phaseColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              {/* Time display in center */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: phaseColor,
                  letterSpacing: '-0.02em',
                }}>
                  {formatTime(timeLeft)}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#8a8070', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  remaining
                </span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!running && !expired && (
                <button
                  id="start_stop"
                  onClick={handleStart}
                  style={{
                    background: phaseColor,
                    color: '#fff',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Start Permit
                </button>
              )}
              {running && (
                <button
                  id="start_stop"
                  onClick={handlePause}
                  style={{
                    background: '#4a4535',
                    color: '#fff',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Pause
                </button>
              )}
              <button
                id="reset"
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  color: '#4a4535',
                  fontSize: '13px',
                  padding: '12px 24px',
                  border: '1px solid #ddd8c8',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>

            {/* Cycle count */}
            {cycles > 0 && (
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070', textAlign: 'center' }}>
                {cycles} work phase{cycles !== 1 ? 's' : ''} completed · {selectedPermit.label}
              </div>
            )}

          </div>

          {/* PTW info footer */}
          <div style={{ padding: '16px 24px', background: '#f0ece0', borderTop: '1px solid #ddd8c8', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>
              Permit: <strong style={{ color: '#1a1810' }}>{selectedPermit.label}</strong>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>
              Work: <strong style={{ color: '#1a1810' }}>{selectedPermit.workMins} min</strong>
              &nbsp;·&nbsp;
              Break: <strong style={{ color: '#1a1810' }}>{selectedPermit.breakMins} min</strong>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>
              ISO 45001 Cl. 8.1
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PermitTimer
import { useState } from 'react'

// ── AUDIT FINDINGS BOARD ─────────────────────────────
// fCC Mirror: Build a Tic-Tac-Toe Game
// SafeEdge: M4 Audit Management — findings board
// Two auditors mark cells as Conformance (C) or
// Non-Conformance (NC). Win condition = 3 NCs in a row
// triggers an automatic Major NC alert.
// Concepts: useState, 2D array logic, win detection,
// conditional rendering, game state management

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
]

const AUDIT_CLAUSES = [
  'Cl. 4.1 Context',    'Cl. 5.1 Leadership', 'Cl. 6.1 Risk',
  'Cl. 7.1 Resources',  'Cl. 7.2 Competence', 'Cl. 7.4 Communication',
  'Cl. 8.1 Operations', 'Cl. 9.1 Monitoring', 'Cl. 10.2 Incident',
]

function calculateWinner(squares) {
  for (let [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return null
}

function AuditBoard() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isAuditor1Turn, setIsAuditor1Turn] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [stepNumber, setStepNumber] = useState(0)

  const result = calculateWinner(squares)
  const winner = result?.winner
  const winningLine = result?.line || []
  const isDraw = !winner && squares.every(s => s !== null)

  const auditor1 = 'C'   // Conformance
  const auditor2 = 'NC'  // Non-Conformance
  const current = isAuditor1Turn ? auditor1 : auditor2

  function handleClick(index) {
    if (squares[index] || winner) return

    const newSquares = [...squares]
    newSquares[index] = current

    const newHistory = history.slice(0, stepNumber + 1)
    newHistory.push(newSquares)

    setSquares(newSquares)
    setHistory(newHistory)
    setStepNumber(newHistory.length - 1)
    setIsAuditor1Turn(!isAuditor1Turn)
  }

  function handleReset() {
    setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
    setStepNumber(0)
    setIsAuditor1Turn(true)
  }

  function jumpTo(step) {
    setStepNumber(step)
    setSquares(history[step])
    setIsAuditor1Turn(step % 2 === 0)
  }

  const ncCount = squares.filter(s => s === 'NC').length
  const cCount = squares.filter(s => s === 'C').length

  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '800px', margin: '0 auto' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em', marginBottom: '4px' },
    sub: { fontSize: '13px', color: '#8a8070', marginBottom: '32px' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' },
    card: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' },
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <header>
          <p style={s.eyebrow}>M4 · Audit Management</p>
          <h1 style={s.h1}>ISO 45001 Audit Findings Board</h1>
          <p style={s.sub}>
            Two auditors assess 9 ISO clauses. Mark each as Conformance (C) or Non-Conformance (NC).
            Three NCs in a row triggers a Major NC alert.
          </p>
        </header>

        <div style={s.layout}>

          {/* Left — game board */}
          <div>

            {/* Status bar */}
            <div style={{
              background: winner === 'NC' ? '#fdf0f0' : winner === 'C' ? '#e8f2e9' : isDraw ? '#fdf6e8' : '#fdfcf8',
              border: `1px solid ${winner === 'NC' ? '#e8c0c0' : winner === 'C' ? '#b8d8bc' : isDraw ? '#e8d4a0' : '#ddd8c8'}`,
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <div>
                {winner === 'NC' && (
                  <p style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '700', color: '#8b1a1a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ⚠ Major NC Alert — 3 Non-Conformances in sequence
                  </p>
                )}
                {winner === 'C' && (
                  <p style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '700', color: '#1a4f24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ✓ Strong Conformance — 3 consecutive conforming clauses
                  </p>
                )}
                {isDraw && (
                  <p style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '700', color: '#7a4a00', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Audit Complete — Mixed findings. Review required.
                  </p>
                )}
                {!winner && !isDraw && (
                  <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {isAuditor1Turn
                      ? '● Auditor 1 — Mark Conformance (C)'
                      : '● Auditor 2 — Mark Non-Conformance (NC)'}
                  </p>
                )}
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: '#1a1810', color: '#fff',
                  fontFamily: 'monospace', fontSize: '10px',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '6px 16px', borderRadius: '4px',
                  border: 'none', cursor: 'pointer',
                }}
              >
                New Audit
              </button>
            </div>

            {/* 3x3 grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {squares.map((square, i) => {
                const isWinning = winningLine.includes(i)
                const isNC = square === 'NC'
                const isC = square === 'C'

                return (
                  <button
                    key={i}
                    onClick={() => handleClick(i)}
                    style={{
                      background: isWinning
                        ? isNC ? '#fdf0f0' : '#e8f2e9'
                        : square ? '#fdfcf8' : '#f0ece0',
                      border: isWinning
                        ? `2px solid ${isNC ? '#8b1a1a' : '#2d7a3e'}`
                        : square
                          ? '1px solid #ddd8c8'
                          : '1px dashed #c8bfaa',
                      borderRadius: '8px',
                      padding: '12px 8px',
                      cursor: square || winner ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      minHeight: '90px',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Clause label */}
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      color: '#8a8070',
                      textAlign: 'center',
                    }}>
                      {AUDIT_CLAUSES[i]}
                    </span>

                    {/* Finding mark */}
                    {square && (
                      <span style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: isNC ? '16px' : '20px',
                        fontWeight: '700',
                        color: isNC ? '#8b1a1a' : '#1a4f24',
                      }}>
                        {isNC ? 'NC' : '✓'}
                      </span>
                    )}

                    {/* Empty state hint */}
                    {!square && !winner && (
                      <span style={{ fontSize: '10px', color: '#c8bfaa' }}>
                        {isAuditor1Turn ? 'C' : 'NC'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Score strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}>
              <div style={{ background: '#e8f2e9', border: '1px solid #b8d8bc', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#2d7a3e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Conformances</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#1a4f24' }}>{cCount}</div>
              </div>
              <div style={{ background: '#fdf0f0', border: '1px solid #e8c0c0', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#8b1a1a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Non-Conformances</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#8b1a1a' }}>{ncCount}</div>
              </div>
            </div>

          </div>

          {/* Right — audit history */}
          <div>
            <div style={s.card}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #ddd8c8', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070' }}>
                Audit Trail
              </div>
              <div style={{ padding: '12px 18px' }}>
                {history.length === 1 ? (
                  <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070' }}>No findings recorded yet.</p>
                ) : (
                  history.map((_, step) => (
                    <div key={step} style={{ marginBottom: '6px' }}>
                      <button
                        onClick={() => jumpTo(step)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          textAlign: 'left',
                          background: step === stepNumber ? '#e8f2e9' : 'transparent',
                          border: step === stepNumber ? '1px solid #b8d8bc' : '1px solid transparent',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          color: step === stepNumber ? '#1a4f24' : '#8a8070',
                          cursor: 'pointer',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {step === 0 ? 'Start of audit' : `Finding #${step} — ${history[step].filter(Boolean).slice(-1)[0]} on ${AUDIT_CLAUSES[history[step].lastIndexOf(history[step].filter(Boolean).slice(-1)[0])]}`}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Legend */}
            <div style={{ background: '#0d2b12', borderRadius: '8px', padding: '16px 18px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dca8a', marginBottom: '10px' }}>
                Audit Legend
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#a8d5b5', lineHeight: '2' }}>
                <div>C — Clause conforms to standard</div>
                <div>NC — Non-Conformance raised</div>
                <div>3 NCs in row → Major NC</div>
                <div>ISO 45001 · Cl. 9.2</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AuditBoard
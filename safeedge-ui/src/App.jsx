import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import KPIDashboard from './KPIDashboard'
import IncidentForm from './IncidentForm'

// ── NAV COMPONENT ────────────────────────────────────
function Nav() {
  const navStyle = {
    background: '#0d2b12',
    padding: '0 32px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '3px solid #5dca8a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  }

  const logoStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    fontWeight: '700',
    color: '#5dca8a',
    textDecoration: 'none',
    letterSpacing: '0.02em',
  }

  const linkStyle = {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#a8d5b5',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    transition: 'all 0.15s',
  }

  const activeLinkStyle = {
    ...linkStyle,
    background: '#1a4f24',
    color: '#5dca8a',
  }

  return (
    <nav style={navStyle}>
      <NavLink to="/" style={logoStyle}>KB SafeEdge</NavLink>
      <div style={{ display: 'flex', gap: '8px' }}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
        >
          M12 Dashboard
        </NavLink>
        <NavLink
          to="/incidents/new"
          style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
        >
          M2 Report Incident
        </NavLink>
      </div>
    </nav>
  )
}

// ── APP ROOT WITH ROUTER ─────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<KPIDashboard />} />
        <Route path="/incidents/new" element={<IncidentForm onSubmit={(data) => console.log('Submitted:', data)} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
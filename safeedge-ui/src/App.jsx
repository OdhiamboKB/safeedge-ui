import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import KPIDashboard from './KPIDashboard'
import IncidentFeed from './IncidentFeed'
import IncidentForm from './IncidentForm'
import IncidentPreviewer from './IncidentPreviewer'
import TRIRCalculator from './TRIRCalculator'
import PermitTimer from './PermitTimer'
import CurrencyConverter from './CurrencyConverter'
import AuditBoard from './AuditBoard'

function Nav() {
  const navStyle = {
    background: '#0d2b12',
    padding: '8px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '3px solid #5dca8a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '8px',
  }

  const logoStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    fontWeight: '700',
    color: '#5dca8a',
    textDecoration: 'none',
    flexShrink: 0,
  }

  const linkStyle = {
    fontFamily: 'monospace',
    fontSize: '9px',
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: '#a8d5b5',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  }

  const activeLinkStyle = {
    ...linkStyle,
    background: '#1a4f24',
    color: '#5dca8a',
  }

  const links = [
    { to: '/',                  label: 'M12 Dashboard',   end: true },
    { to: '/incidents',         label: 'M2 Incidents',    end: false },
    { to: '/incidents/new',     label: 'Report Incident', end: false },
    { to: '/incidents/editor',  label: 'Editor',          end: false },
    { to: '/calculator',        label: 'TRIR Calc',       end: false },
    { to: '/permit-timer',      label: 'PTW Timer',       end: false },
    { to: '/currency',          label: 'Currency',        end: false },
    { to: '/audit-board',       label: 'M4 Audit Board',  end: false },
  ]

  return (
    <nav style={navStyle}>
      <NavLink to="/" style={logoStyle}>KB SafeEdge</NavLink>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<KPIDashboard />} />
        <Route path="/incidents" element={<IncidentFeed />} />
        <Route path="/incidents/new" element={<IncidentForm onSubmit={(data) => console.log('Submitted:', data)} />} />
        <Route path="/incidents/editor" element={<IncidentPreviewer />} />
        <Route path="/calculator" element={<TRIRCalculator />} />
        <Route path="/permit-timer" element={<PermitTimer />} />
        <Route path="/currency" element={<CurrencyConverter />} />
        <Route path="/audit-board" element={<AuditBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
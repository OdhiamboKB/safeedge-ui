import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import KPIDashboard from './KPIDashboard'
import IncidentFeed from './IncidentFeed'
import IncidentForm from './IncidentForm'
import IncidentPreviewer from './IncidentPreviewer'
import TRIRCalculator from './TRIRCalculator'
import PermitTimer from './PermitTimer'
import CurrencyConverter from './CurrencyConverter'

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
        <NavLink to="/" end style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
          M12 Dashboard
        </NavLink>
        <NavLink to="/incidents" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
          M2 Incidents
        </NavLink>
        <NavLink to="/incidents/new" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
          Report Incident
        </NavLink>
        <NavLink to="/incidents/editor" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
          Editor
        </NavLink>
        <NavLink to="/calculator" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
  TRIR Calc
</NavLink>
<NavLink to="/permit-timer" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
  M10 PTW Timer
</NavLink>
<NavLink to="/currency-converter" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
  Currency Converter
</NavLink>
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
        <Route path="/currency-converter" element={<CurrencyConverter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
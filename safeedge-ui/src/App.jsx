import IncidentForm from './IncidentForm'

function App() {
  return <IncidentForm onSubmit={(data) => console.log('Submitted:', data)} />
}

export default App
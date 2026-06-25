import { useState } from 'react'

// ── M2 INCIDENT FORM COMPONENT ───────────────────────
// Controlled inputs — every field is driven by useState
// Mirror: fCC Superhero Application Form
// SafeEdge: M2 Incident Management — New Incident Report

const INITIAL_STATE = {
  title: '',
  type: '',
  severity: '',
  site: '',
  date: '',
  time: '',
  location: '',
  description: '',
  reporterName: '',
  reporterEmail: '',
  lostTime: false,
  rcaRequired: true,
}

function IncidentForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  // ── HANDLERS ──────────────────────────────────────
  // Single handler for all text/select inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ── VALIDATION ────────────────────────────────────
  function validate() {
    const newErrors = {}
    if (!form.title.trim())        newErrors.title = 'Incident title is required'
    if (!form.type)                newErrors.type = 'Incident type is required'
    if (!form.severity)            newErrors.severity = 'Severity is required'
    if (!form.date)                newErrors.date = 'Date is required'
    if (!form.description.trim())  newErrors.description = 'Description is required'
    if (!form.reporterName.trim()) newErrors.reporterName = 'Reporter name is required'
    if (!form.reporterEmail.trim()) newErrors.reporterEmail = 'Reporter email is required'
    return newErrors
  }

  // ── SUBMIT ────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
    if (onSubmit) onSubmit(form)
  }

  function handleReset() {
    setForm(INITIAL_STATE)
    setErrors({})
    setSubmitted(false)
  }

  // ── STYLES ────────────────────────────────────────
  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '48px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '720px', margin: '0 auto' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '8px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em', marginBottom: '4px' },
    sub: { fontSize: '13px', color: '#8a8070', marginBottom: '32px' },
    card: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' },
    section: { padding: '24px 28px', borderBottom: '1px solid #ddd8c8' },
    sectionLabel: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    rowSingle: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#4a4535' },
    input: { padding: '10px 12px', background: '#f0ece0', border: '1px solid #ddd8c8', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    inputError: { padding: '10px 12px', background: '#fdf0f0', border: '1px solid #e8c0c0', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: '#1a1810', width: '100%' },
    error: { fontSize: '11px', color: '#8b1a1a' },
    checkRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#4a4535', cursor: 'pointer' },
    footer: { padding: '20px 28px', background: '#f0ece0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    btnSubmit: { background: '#2d7a3e', color: '#fff', fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', padding: '11px 28px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    btnReset: { background: 'transparent', color: '#4a4535', fontSize: '13px', padding: '11px 20px', border: '1px solid #ddd8c8', borderRadius: '4px', cursor: 'pointer' },
    successBox: { background: '#e8f2e9', border: '1px solid #b8d8bc', borderRadius: '8px', padding: '32px', textAlign: 'center' },
    successTitle: { fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#1a4f24', marginBottom: '8px' },
    successSub: { fontSize: '13px', color: '#2d7a3e', marginBottom: '20px' },
  }

  const severityOptions = ['Critical', 'High', 'Medium', 'Low']

  // ── SUCCESS STATE ─────────────────────────────────
  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.successBox}>
            <div style={s.successTitle}>✓ Incident Report Submitted</div>
            <p style={s.successSub}>
              Reference: INC-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 900) + 100)}<br />
              Assigned to site QHSE officer for investigation.
            </p>
            <div style={{ marginBottom: '16px', textAlign: 'left', background: '#fff', border: '1px solid #b8d8bc', borderRadius: '6px', padding: '16px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8a8070', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submitted data</p>
              <p style={{ fontSize: '13px', color: '#1a4f24' }}><strong>Title:</strong> {form.title}</p>
              <p style={{ fontSize: '13px', color: '#1a4f24' }}><strong>Type:</strong> {form.type}</p>
              <p style={{ fontSize: '13px', color: '#1a4f24' }}><strong>Severity:</strong> {form.severity}</p>
              <p style={{ fontSize: '13px', color: '#1a4f24' }}><strong>Reporter:</strong> {form.reporterName}</p>
              <p style={{ fontSize: '13px', color: '#1a4f24' }}><strong>Lost Time:</strong> {form.lostTime ? 'Yes' : 'No'}</p>
            </div>
            <button onClick={handleReset} style={s.btnSubmit}>
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ──────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <header>
          <p style={s.eyebrow}>M2 · Incident Management</p>
          <h1 style={s.h1}>New Incident Report</h1>
          <p style={s.sub}>Complete all required fields. Report will be assigned to the site QHSE officer.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>

          {/* Section 1 — Identification */}
          <div style={s.card}>
            <div style={s.section}>
              <div style={s.sectionLabel}>Section 1 · Identification</div>

              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Incident Title *</label>
                  <input
                    style={errors.title ? s.inputError : s.input}
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Slip on wet surface — Loading Bay"
                  />
                  {errors.title && <span style={s.error}>{errors.title}</span>}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Incident Type *</label>
                  <select
                    style={errors.type ? s.inputError : s.input}
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="injury">Injury</option>
                    <option value="near-miss">Near Miss</option>
                    <option value="property-damage">Property Damage</option>
                    <option value="environmental">Environmental</option>
                    <option value="quality">Quality Nonconformance</option>
                  </select>
                  {errors.type && <span style={s.error}>{errors.type}</span>}
                </div>
              </div>

              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Date *</label>
                  <input
                    style={errors.date ? s.inputError : s.input}
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                  {errors.date && <span style={s.error}>{errors.date}</span>}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Time</label>
                  <input
                    style={s.input}
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 — Severity */}
            <div style={s.section}>
              <div style={s.sectionLabel}>Section 2 · Severity</div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Severity Rating *</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {severityOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, severity: opt }))
                        setErrors(prev => ({ ...prev, severity: '' }))
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: form.severity === opt ? '2px solid #1a4f24' : '1px solid #ddd8c8',
                        background: form.severity === opt ? '#1a4f24' : '#fdfcf8',
                        color: form.severity === opt ? '#fff' : '#4a4535',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.severity && <span style={s.error}>{errors.severity}</span>}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={s.checkRow}>
                  <input
                    type="checkbox"
                    name="lostTime"
                    checked={form.lostTime}
                    onChange={handleChange}
                    style={{ accentColor: '#1a4f24' }}
                  />
                  Lost Time Incident (LTI)
                </label>
                <label style={s.checkRow}>
                  <input
                    type="checkbox"
                    name="rcaRequired"
                    checked={form.rcaRequired}
                    onChange={handleChange}
                    style={{ accentColor: '#1a4f24' }}
                  />
                  RCA Required
                </label>
              </div>
            </div>

            {/* Section 3 — Description */}
            <div style={s.section}>
              <div style={s.sectionLabel}>Section 3 · Description</div>
              <div style={s.rowSingle}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Incident Description *</label>
                  <textarea
                    style={{ ...(errors.description ? s.inputError : s.input), minHeight: '90px', resize: 'vertical', lineHeight: '1.5' }}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe what happened, where, and conditions at the time..."
                  />
                  {errors.description && <span style={s.error}>{errors.description}</span>}
                </div>
              </div>
            </div>

            {/* Section 4 — Reporter */}
            <div style={{ ...s.section, borderBottom: 'none' }}>
              <div style={s.sectionLabel}>Section 4 · Reporter</div>
              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Full Name *</label>
                  <input
                    style={errors.reporterName ? s.inputError : s.input}
                    name="reporterName"
                    value={form.reporterName}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                  {errors.reporterName && <span style={s.error}>{errors.reporterName}</span>}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Email *</label>
                  <input
                    style={errors.reporterEmail ? s.inputError : s.input}
                    type="email"
                    name="reporterEmail"
                    value={form.reporterEmail}
                    onChange={handleChange}
                    placeholder="name@company.com"
                  />
                  {errors.reporterEmail && <span style={s.error}>{errors.reporterEmail}</span>}
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div style={s.footer}>
              <span style={{ fontSize: '12px', color: '#8a8070' }}>* Required fields</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={handleReset} style={s.btnReset}>Clear</button>
                <button type="submit" style={s.btnSubmit}>Submit Report</button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default IncidentForm
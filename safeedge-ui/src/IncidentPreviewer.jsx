import { useState } from 'react'

// ── INCIDENT MARKDOWN PREVIEWER ──────────────────────
// fCC Mirror: Markdown Previewer certification project
// SafeEdge: M2 Incident description editor with
// live formatted preview before submission
// Concepts: controlled textarea, string parsing,
// dangerouslySetInnerHTML for rendered output

// Simple markdown parser — covers the patterns used
// in QHSE incident reports
function parseMarkdown(text) {
  if (!text) return ''

  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="font-family:Georgia,serif;font-size:15px;font-weight:700;color:#1a1810;margin:16px 0 6px;">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#1a4f24;margin:20px 0 8px;padding-bottom:6px;border-bottom:1px solid #ddd8c8;">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-family:Georgia,serif;font-size:22px;font-weight:900;color:#0d2b12;margin:0 0 12px;">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1a1810;">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="color:#4a4535;">$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code style="font-family:monospace;font-size:12px;background:#e8f2e9;color:#1a4f24;padding:1px 6px;border-radius:3px;">$1</code>')
    // Unordered lists
    .replace(/^\- (.+)$/gm, '<li style="font-size:13px;color:#4a4535;margin:4px 0;padding-left:4px;">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:8px 0;">$&</ul>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #5dca8a;margin:12px 0;padding:8px 16px;background:#f0fdf4;font-size:13px;color:#2d7a3e;font-style:italic;">$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

// Default incident report template
const DEFAULT_CONTENT = `# INC-2026-047 — Incident Report

## Incident Description
Worker reported a **slip and fall** near the loading bay entrance following overnight rainfall. The \`drainage channel\` was blocked, causing water pooling across the pedestrian walkway.

*No lost time recorded.* Worker received first aid on site.

## Immediate Cause
- Drainage channel blocked with debris
- Water pooling on pedestrian walkway
- No wet floor signage in place

## Root Cause (5-Why)
- Why did the worker slip? Water had pooled on the walkway
- Why was water pooling? The drainage channel was blocked
- Why was the channel blocked? Weekly drain inspection was overdue
- Why was the inspection overdue? No automated reminder in place
- **Root cause:** Absence of a digital inspection tracking system

## Corrective Actions
- Install drainage alert system — *Owner: Site Manager — Due: Jun 15*
- Weekly automated inspection reminders — *Owner: HSE Officer*
- Anti-slip matting installed at Loading Bay entrance

> ISO 45001 Cl. 10.2 — Incident, nonconformity and corrective action
`

function IncidentPreviewer() {
  const [markdown, setMarkdown] = useState(DEFAULT_CONTENT)
  const [view, setView] = useState('split') // 'split' | 'edit' | 'preview'

  const s = {
    page: { background: '#f5f2eb', minHeight: '100vh', padding: '32px 24px', fontFamily: "'DM Sans', sans-serif" },
    wrap: { maxWidth: '1100px', margin: '0 auto' },
    header: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' },
    eyebrow: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d7a3e', marginBottom: '6px' },
    h1: { fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '900', color: '#1a1810', letterSpacing: '-0.02em' },
    viewToggle: { display: 'flex', gap: '6px' },
    grid: {
      display: 'grid',
      gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr',
      gap: '16px',
    },
    panel: { background: '#fdfcf8', border: '1px solid #ddd8c8', borderRadius: '8px', overflow: 'hidden' },
    panelHeader: { padding: '10px 16px', background: '#0d2b12', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    panelLabel: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dca8a' },
    panelMeta: { fontFamily: 'monospace', fontSize: '10px', color: '#3d6645' },
    textarea: {
      width: '100%',
      minHeight: '520px',
      padding: '20px',
      background: '#fdfcf8',
      border: 'none',
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#1a1810',
      lineHeight: '1.7',
      resize: 'vertical',
      outline: 'none',
    },
    preview: { padding: '20px 24px', minHeight: '520px', lineHeight: '1.7', fontSize: '14px', color: '#1a1810' },
    charCount: { padding: '8px 16px', background: '#f0ece0', borderTop: '1px solid #ddd8c8', fontFamily: 'monospace', fontSize: '10px', color: '#8a8070', textAlign: 'right' },
  }

  function ViewButton({ label, value }) {
    return (
      <button
        onClick={() => setView(value)}
        style={{
          fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.08em',
          textTransform: 'uppercase', padding: '6px 14px', borderRadius: '4px',
          border: view === value ? '2px solid #1a4f24' : '1px solid #ddd8c8',
          background: view === value ? '#1a4f24' : '#fdfcf8',
          color: view === value ? '#fff' : '#8a8070',
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <header style={s.header}>
          <div>
            <p style={s.eyebrow}>M2 · Incident Management</p>
            <h1 style={s.h1}>Incident Report Editor</h1>
          </div>
          <div style={s.viewToggle}>
            <ViewButton label="Edit" value="edit" />
            <ViewButton label="Split" value="split" />
            <ViewButton label="Preview" value="preview" />
          </div>
        </header>

        <div style={s.grid}>

          {/* Editor panel — hidden in preview mode */}
          {view !== 'preview' && (
            <div style={s.panel}>
              <div style={s.panelHeader}>
                <span style={s.panelLabel}>Markdown Editor</span>
                <span style={s.panelMeta}>ISO 45001 Cl. 10.2</span>
              </div>
              <textarea
                style={s.textarea}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
              />
              <div style={s.charCount}>
                {markdown.length} characters · {markdown.split('\n').length} lines
              </div>
            </div>
          )}

          {/* Preview panel — hidden in edit mode */}
          {view !== 'edit' && (
            <div style={s.panel}>
              <div style={s.panelHeader}>
                <span style={s.panelLabel}>Formatted Preview</span>
                <span style={s.panelMeta}>Live render</span>
              </div>
              <div
                style={s.preview}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default IncidentPreviewer
'use client'

import { colors } from './styles'

interface ModalProps {
  title: string
  onClose: () => void
  onSave: () => void
  saving?: boolean
  disabled?: boolean
  children: React.ReactNode
  width?: number
}

export default function Modal({ title, onClose, onSave, saving, disabled, children, width = 440 }: ModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }}>
      <div style={{
        background: colors.surface, border: `1px solid ${colors.border2}`,
        borderRadius: 16, padding: 32, width, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 24 }}>
          {title}
        </h2>

        {children}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', background: 'transparent',
            border: `1px solid ${colors.border2}`, borderRadius: 8,
            color: colors.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving || disabled} style={{
            flex: 1, padding: '10px', background: colors.primary, border: 'none',
            borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", opacity: (saving || disabled) ? 0.6 : 1,
          }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
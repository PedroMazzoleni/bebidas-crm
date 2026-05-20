export const colors = {
  bg: '#09090b',
  surface: '#18181b',
  border: '#27272a',
  border2: '#3f3f46',
  text: '#fafafa',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  primary: '#f97316',
  primaryDark: '#ea580c',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  purple: '#a78bfa',
  cyan: '#22d3ee',
}

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: colors.surface,
  border: `1px solid ${colors.border2}`,
  borderRadius: 8,
  color: colors.text,
  fontSize: 14,
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
  boxSizing: 'border-box',
}

export const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  background: colors.primary,
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
}

export const btnSecondary: React.CSSProperties = {
  padding: '10px 20px',
  background: 'transparent',
  border: `1px solid ${colors.border2}`,
  borderRadius: 8,
  color: colors.textMuted,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
}

export const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  color: colors.textDim,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.5px',
}

export const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  color: colors.textMuted,
}

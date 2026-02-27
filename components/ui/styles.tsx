// Estilos base reutilizables

export const colors = {
    bg: '#080b12',
    surface: '#0f1117',
    border: '#1e2130',
    border2: '#2d3348',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    textDim: '#6b7280',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
  }
  
  export const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: colors.surface,
    border: `1px solid ${colors.border2}`,
    borderRadius: 8,
    color: colors.text,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'DM Sans', sans-serif",
  }
  
  export const btnSecondary: React.CSSProperties = {
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${colors.border2}`,
    borderRadius: 8,
    color: colors.textMuted,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
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
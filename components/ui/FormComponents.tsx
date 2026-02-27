'use client'

import { inputStyle, colors } from './styles'

interface FormFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}

export function FormField({ label, value, onChange, type = 'text', placeholder, required }: FormFieldProps) {
  return (
    <div>
      <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, maxWidth: 400, marginBottom: 20 }}
    />
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  color: string
  onClick?: () => void
}

export function StatCard({ label, value, icon, color, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#0f1117', border: '1px solid #1e2130',
        borderRadius: 12, padding: '24px 28px',
        cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.borderColor = color
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.borderColor = '#1e2130'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>{label}</div>
          <div style={{ color: '#f9fafb', fontSize: 34, fontWeight: 700 }}>{value}</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>{icon}</div>
      </div>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  onNew?: () => void
  newLabel?: string
}

export function PageHeader({ title, subtitle, onNew, newLabel = '+ Nuevo' }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
      <div>
        <h1 style={{ color: '#f9fafb', fontSize: 26, fontWeight: 700, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>{subtitle}</p>}
      </div>
      {onNew && (
        <button onClick={onNew} style={{
          padding: '10px 20px', background: '#3b82f6', border: 'none',
          borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>{newLabel}</button>
      )}
    </div>
  )
}

interface DeleteButtonProps {
  onClick: () => void
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: '1px solid #374151',
      borderRadius: 6, color: '#ef4444', padding: '4px 10px',
      cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
    }}>Eliminar</button>
  )
}
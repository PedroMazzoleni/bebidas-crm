'use client'

import { colors, thStyle, tdStyle } from './ui/styles'
import { DeleteButton } from '../components/ui/FormComponents'
import { Cliente } from '../hooks/useClientes'

interface ClientesTableProps {
  clientes: Cliente[]
  onEliminar: (id: string) => void
}

export default function ClientesTable({ clientes, onEliminar }: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: colors.textDim }}>
        No hay clientes registrados
      </div>
    )
  }

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            {['Nombre', 'Teléfono', 'Dirección', 'Comercial', 'Total compras', ''].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}
              style={{ borderBottom: `1px solid ${colors.border}` }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{c.nombre_cliente}</td>
              <td style={tdStyle}>{c.telf || '—'}</td>
              <td style={tdStyle}>{c.direccion || '—'}</td>
              <td style={tdStyle}>{c.comerciales?.nombre || '—'}</td>
              <td style={{ ...tdStyle, color: colors.success, fontWeight: 600 }}>
                €{(c.total_compras || 0).toFixed(2)}
              </td>
              <td style={tdStyle}>
                <DeleteButton onClick={() => onEliminar(c.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

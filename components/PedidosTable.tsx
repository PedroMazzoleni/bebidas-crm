'use client'

import { colors, thStyle, tdStyle } from './ui/styles'
import { Pedido } from '../hooks/usePedidos'
import { generateInvoice } from '../lib/generateInvoice'
import { FileText, Edit2 } from 'lucide-react'

const estadoColor: Record<string, string> = {
  pendiente: '#eab308',
  confirmado: '#f97316',
  entregado: '#22c55e',
  cancelado: '#ef4444',
}

interface PedidosTableProps {
  pedidos: Pedido[]
  onCambiarEstado?: (id: string, estado: string) => void
  onEditar?: (p: Pedido) => void
  soloLectura?: boolean
}

export default function PedidosTable({ pedidos, onCambiarEstado, onEditar, soloLectura }: PedidosTableProps) {
  if (pedidos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: colors.textDim }}>
        No hay pedidos registrados
      </div>
    )
  }

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            {['Nº Pedido', 'Fecha', 'Cliente', 'Comercial', 'Total', 'Estado', ''].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => {
            const color = estadoColor[p.estado] || colors.textMuted
            return (
              <tr key={p.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1c1c1e'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ ...tdStyle, color: colors.primary, fontWeight: 700 }}>#{p.num_pedido}</td>
                <td style={tdStyle}>{p.fecha}</td>
                <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.clientes?.nombre_cliente || '—'}</td>
                <td style={tdStyle}>{p.comerciales?.nombre || '—'}</td>
                <td style={{ ...tdStyle, color: colors.text, fontWeight: 600 }}>€{(p.total || 0).toFixed(2)}</td>
                <td style={tdStyle}>
                  {soloLectura || !onCambiarEstado ? (
                    <span style={{ background: color + '20', color, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                      {p.estado}
                    </span>
                  ) : (
                    <select
                      value={p.estado}
                      onChange={e => onCambiarEstado(p.id, e.target.value)}
                      style={{
                        background: color + '20', color,
                        border: `1px solid ${color}40`,
                        borderRadius: 6, padding: '4px 8px', fontSize: 12,
                        fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'var(--font-sans), system-ui, sans-serif',
                      }}>
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {onEditar && (
                      <button
                        onClick={() => onEditar(p)}
                        style={{ background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.primary, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                    )}
                    <button
                      onClick={() => generateInvoice(p.id)}
                      title="Generar factura"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'transparent', border: `1px solid ${colors.border2}`,
                        borderRadius: 6, color: colors.textMuted, padding: '5px 10px',
                        cursor: 'pointer', fontSize: 12,
                        fontFamily: 'var(--font-sans), system-ui, sans-serif',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.1)'
                        ;(e.currentTarget as HTMLElement).style.color = '#f97316'
                        ;(e.currentTarget as HTMLElement).style.borderColor = '#f97316'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                        ;(e.currentTarget as HTMLElement).style.color = colors.textMuted
                        ;(e.currentTarget as HTMLElement).style.borderColor = colors.border2
                      }}>
                      <FileText size={13} /> PDF
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

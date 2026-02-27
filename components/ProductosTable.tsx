'use client'

import { colors, thStyle, tdStyle } from './ui/styles'
import { DeleteButton } from './ui/FormComponents'
import { Producto } from '../hooks/useProductos'

interface ProductosTableProps {
  productos: Producto[]
  onEliminar: (id: string) => void
}

export default function ProductosTable({ productos, onEliminar }: ProductosTableProps) {
  if (productos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: colors.textDim }}>
        No hay productos registrados
      </div>
    )
  }

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            {['Nombre', 'Marca', 'Categoría', 'Stock', 'P. Compra', 'P. Venta', 'Proveedor', ''].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}
              style={{ borderBottom: `1px solid ${colors.border}` }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1f2e'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <td style={{ ...tdStyle, color: colors.text, fontWeight: 500 }}>{p.nombre}</td>
              <td style={tdStyle}>{p.marca || '—'}</td>
              <td style={tdStyle}>
                {p.categoria
                  ? <span style={{ background: '#1e2d4a', color: colors.primary, padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>{p.categoria}</span>
                  : '—'}
              </td>
              <td style={{ ...tdStyle, color: p.stock < 10 ? colors.danger : colors.success, fontWeight: 600 }}>
                {p.stock}
              </td>
              <td style={tdStyle}>€{(p.precio_compra || 0).toFixed(2)}</td>
              <td style={{ ...tdStyle, color: colors.text, fontWeight: 600 }}>€{(p.precio_venta || 0).toFixed(2)}</td>
              <td style={tdStyle}>{p.proveedores?.nombre || '—'}</td>
              <td style={tdStyle}>
                <DeleteButton onClick={() => onEliminar(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
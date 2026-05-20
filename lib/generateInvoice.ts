const EMPRESA = {
  nombre: 'Distribuciones Bebidas del Norte, S.L.',
  cif: 'B-28123456',
  direccion: 'C/ Industria, 45 — Polígono Industrial Norte',
  ciudad: '28020 Madrid, España',
  telf: '+34 91 234 56 78',
  email: 'info@bebidasdelnorte.es',
  iban: 'ES12 2100 0418 4502 0005 1332',
  web: 'www.bebidasdelnorte.es',
}

interface LineaDetalle {
  producto: { nombre: string; marca?: string }
  cantidad: number
  precio_venta: number
}

interface PedidoDetalle {
  num_pedido: number
  fecha: string
  estado: string
  total: number
  cliente: {
    nombre_cliente: string
    telf?: string
    direccion?: string
  }
  comercial?: { nombre: string }
  lineas: LineaDetalle[]
}

export async function generateInvoice(pedidoId: string) {
  const res = await fetch(`/api/pedidos/${pedidoId}`)
  if (!res.ok) { alert('No se pudo cargar el pedido'); return }
  const pedido: PedidoDetalle = await res.json()

  const subtotal = pedido.lineas.reduce((s, l) => s + l.cantidad * l.precio_venta, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const lineasHTML = pedido.lineas.map(l => `
    <tr>
      <td>${l.producto.nombre}${l.producto.marca ? ` <span class="muted">(${l.producto.marca})</span>` : ''}</td>
      <td class="center">${l.cantidad}</td>
      <td class="right">${l.precio_venta.toFixed(2)} €</td>
      <td class="right bold">${(l.cantidad * l.precio_venta).toFixed(2)} €</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Factura #${pedido.num_pedido} — ${EMPRESA.nombre}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: #1a1a1a;
    background: #fff;
    font-size: 13px;
    line-height: 1.5;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 48px; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .logo-area { display: flex; align-items: center; gap: 14px; }
  .logo-img { width: 64px; height: 64px; object-fit: contain; }
  .company-name { font-size: 20px; font-weight: 700; color: #0a0a0a; letter-spacing: -0.5px; }
  .company-tagline { font-size: 10px; color: #f97316; font-weight: 700; letter-spacing: 2px; margin-top: 2px; }

  .invoice-badge {
    text-align: right;
  }
  .invoice-badge .num {
    font-size: 32px; font-weight: 700; color: #f97316; letter-spacing: -1px;
  }
  .invoice-badge .label {
    font-size: 11px; color: #6b7280; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
  }
  .invoice-badge .fecha { font-size: 13px; color: #374151; margin-top: 4px; }

  /* Divider */
  .divider { border: none; border-top: 2px solid #f97316; margin: 32px 0; opacity: 0.3; }
  .divider-thin { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }

  /* Info blocks */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .info-block .block-title {
    font-size: 10px; color: #f97316; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 10px;
  }
  .info-block p { color: #374151; margin-bottom: 3px; }
  .info-block .name { font-weight: 600; color: #111827; font-size: 14px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
  thead tr { background: #f97316; }
  thead th {
    padding: 12px 14px; text-align: left; color: #fff;
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  }
  thead th.center { text-align: center; }
  thead th.right { text-align: right; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody td { padding: 12px 14px; color: #374151; }
  tbody td.center { text-align: center; }
  tbody td.right { text-align: right; }
  tbody td.bold { font-weight: 600; color: #111827; }
  .muted { color: #9ca3af; font-size: 11px; }

  /* Totals */
  .totals { margin-left: auto; width: 280px; margin-top: 24px; }
  .total-row { display: flex; justify-content: space-between; padding: 6px 0; color: #6b7280; }
  .total-row.iva { color: #374151; }
  .total-final {
    display: flex; justify-content: space-between;
    padding: 14px 16px; background: #f97316; border-radius: 8px;
    color: #fff; font-size: 17px; font-weight: 700; margin-top: 10px;
  }

  /* Footer */
  .footer {
    margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }
  .footer-block .footer-title {
    font-size: 10px; color: #f97316; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;
  }
  .footer-block p { color: #6b7280; font-size: 12px; }
  .iban { font-family: monospace; background: #f3f4f6; padding: 6px 10px; border-radius: 4px; font-size: 12px; display: inline-block; margin-top: 4px; }

  .estado-badge {
    display: inline-block; padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .estado-pendiente { background: #fef3c7; color: #92400e; }
  .estado-confirmado { background: #fff7ed; color: #c2410c; }
  .estado-entregado { background: #dcfce7; color: #166534; }
  .estado-cancelado { background: #fee2e2; color: #991b1b; }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .page { padding: 32px; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="logo-area">
      <img src="/logo.png" alt="Logo" class="logo-img" />
      <div>
        <div class="company-name">BEBIDAS</div>
        <div class="company-tagline">CRM · DISTRIBUCIÓN</div>
      </div>
    </div>
    <div class="invoice-badge">
      <div class="label">Factura</div>
      <div class="num">#${String(pedido.num_pedido).padStart(4, '0')}</div>
      <div class="fecha">${fecha}</div>
      <div style="margin-top:8px">
        <span class="estado-badge estado-${pedido.estado}">${pedido.estado}</span>
      </div>
    </div>
  </div>

  <hr class="divider" />

  <!-- Info emisor / receptor -->
  <div class="info-grid">
    <div class="info-block">
      <div class="block-title">Emisor</div>
      <p class="name">${EMPRESA.nombre}</p>
      <p>CIF: ${EMPRESA.cif}</p>
      <p>${EMPRESA.direccion}</p>
      <p>${EMPRESA.ciudad}</p>
      <p>Tel: ${EMPRESA.telf}</p>
      <p>${EMPRESA.email}</p>
    </div>
    <div class="info-block">
      <div class="block-title">Facturar a</div>
      <p class="name">${pedido.cliente.nombre_cliente}</p>
      ${pedido.cliente.direccion ? `<p>${pedido.cliente.direccion}</p>` : ''}
      ${pedido.cliente.telf ? `<p>Tel: ${pedido.cliente.telf}</p>` : ''}
      ${pedido.comercial ? `<p>Comercial: ${pedido.comercial.nombre}</p>` : ''}
    </div>
  </div>

  <!-- Tabla de productos -->
  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th class="center">Cant.</th>
        <th class="right">Precio unit.</th>
        <th class="right">Importe</th>
      </tr>
    </thead>
    <tbody>
      ${lineasHTML}
    </tbody>
  </table>

  <hr class="divider-thin" />

  <!-- Totales -->
  <div class="totals">
    <div class="total-row">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)} €</span>
    </div>
    <div class="total-row iva">
      <span>IVA (21%)</span>
      <span>${iva.toFixed(2)} €</span>
    </div>
    <div class="total-final">
      <span>Total</span>
      <span>${total.toFixed(2)} €</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-block">
      <div class="footer-title">Datos de pago</div>
      <p>Transferencia bancaria</p>
      <p class="iban">${EMPRESA.iban}</p>
      <p style="margin-top:6px">Indicar nº de factura en el concepto</p>
    </div>
    <div class="footer-block">
      <div class="footer-title">Información legal</div>
      <p>Documento generado el ${new Date().toLocaleDateString('es-ES')}.</p>
      <p style="margin-top:4px">Plazo de pago: 30 días desde la fecha de factura.</p>
      <p style="margin-top:4px">${EMPRESA.web}</p>
    </div>
  </div>

</div>

<script>
  window.onload = function() { window.print(); }
</script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) { alert('Activa las ventanas emergentes para generar la factura'); return }
  win.document.write(html)
  win.document.close()
}

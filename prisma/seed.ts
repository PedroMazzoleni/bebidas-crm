import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando base de datos...')
  await prisma.lineaPedido.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.comercial.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.proveedor.deleteMany()
  await prisma.profile.deleteMany()

  console.log('Creando usuarios...')
  const hash = (p: string) => bcrypt.hashSync(p, 10)

  await prisma.profile.createMany({
    data: [
      { email: 'admin@bebidasnorte.es', password: hash('Admin2024!'), full_name: 'Administrador', role: 'admin' },
      { email: 'carlos.jimenez@bebidasnorte.es', password: hash('Pass2024!'), full_name: 'Carlos Jiménez', role: 'comercial' },
      { email: 'maria.lopez@bebidasnorte.es', password: hash('Pass2024!'), full_name: 'María López', role: 'comercial' },
      { email: 'antonio.garcia@bebidasnorte.es', password: hash('Pass2024!'), full_name: 'Antonio García', role: 'comercial' },
    ],
  })

  console.log('Creando comerciales...')
  const carlos = await prisma.comercial.create({ data: { nombre: 'Carlos Jiménez', telf: '+34 623 456 789', ventas: 84320, comision_asignada: 5 } })
  const maria = await prisma.comercial.create({ data: { nombre: 'María López', telf: '+34 634 567 890', ventas: 61450, comision_asignada: 5 } })
  const antonio = await prisma.comercial.create({ data: { nombre: 'Antonio García', telf: '+34 645 678 901', ventas: 49870, comision_asignada: 4.5 } })

  console.log('Creando proveedores...')
  const bodegaRioja = await prisma.proveedor.create({
    data: { nombre: 'Bodegas Rioja Alta, S.A.', direccion: 'Av. del Vino 12, Logroño, La Rioja', mail: 'pedidos@riojaalta.es', tipo_iva: 'General (21%)', nif: 'A26123456', telefono: '+34 941 345 678' },
  })
  const bodegaCastilla = await prisma.proveedor.create({
    data: { nombre: 'Bodegas Castilla y León, S.L.', direccion: 'Ctra. Nacional km 152, Valladolid', mail: 'comercial@bodegascastilla.es', tipo_iva: 'General (21%)', nif: 'B47234567', telefono: '+34 983 456 789' },
  })
  const cervecera = await prisma.proveedor.create({
    data: { nombre: 'Cervezas Estrella del Sur, S.L.', direccion: 'Pol. Industrial Los Carteros, Sevilla', mail: 'ventas@estrelladelsur.es', tipo_iva: 'Reducido (10%)', nif: 'B41234567', telefono: '+34 954 456 789' },
  })
  const artesana = await prisma.proveedor.create({
    data: { nombre: 'Cervecería Artesana El Lúpulo, S.L.', direccion: 'C/ del Lúpulo 4, Burgos', mail: 'hola@ellupulo.es', tipo_iva: 'Reducido (10%)', nif: 'B09345678', telefono: '+34 947 123 456' },
  })
  const aguaspir = await prisma.proveedor.create({
    data: { nombre: 'Aguas del Pirineo, S.A.', direccion: 'Sierra de Guara s/n, Huesca, Aragón', mail: 'contacto@aguaspirineo.es', tipo_iva: 'Reducido (10%)', nif: 'A22345678', telefono: '+34 974 234 567' },
  })
  const destileria = await prisma.proveedor.create({
    data: { nombre: 'Destilería Don Pepe, S.L.', direccion: 'C/ Las Bodegas 8, Jerez de la Frontera, Cádiz', mail: 'ventas@donpepe.es', tipo_iva: 'General (21%)', nif: 'B11234567', telefono: '+34 956 567 890' },
  })
  const importaciones = await prisma.proveedor.create({
    data: { nombre: 'Importaciones Premium Spirits, S.L.', direccion: 'Av. de Europa 88, Madrid', mail: 'pedidos@premiumspirits.es', tipo_iva: 'General (21%)', nif: 'B28456789', telefono: '+34 914 678 901' },
  })
  const distribRefrescos = await prisma.proveedor.create({
    data: { nombre: 'Distribuidora Iberia Refrescos, S.A.', direccion: 'Pol. La Encina, Nave 12, Madrid', mail: 'pedidos@iberiarefrescos.es', tipo_iva: 'Reducido (10%)', nif: 'A28567890', telefono: '+34 916 789 012' },
  })

  console.log('Creando productos...')

  // ─── CERVEZA ────────────────────────────────────────────────────────────────
  const p_lager = await prisma.producto.create({ data: { nombre: 'Estrella Sur Lager 33cl', marca: 'Estrella del Sur', categoria: 'Cerveza', stock: 1200, precio_venta: 1.20, precio_compra: 0.55, proveedor_id: cervecera.id } })
  const p_tostada = await prisma.producto.create({ data: { nombre: 'Estrella Sur Tostada 33cl', marca: 'Estrella del Sur', categoria: 'Cerveza', stock: 800, precio_venta: 1.35, precio_compra: 0.65, proveedor_id: cervecera.id } })
  await prisma.producto.create({ data: { nombre: 'Estrella Sur Lager 50cl', marca: 'Estrella del Sur', categoria: 'Cerveza', stock: 600, precio_venta: 1.65, precio_compra: 0.75, proveedor_id: cervecera.id } })
  await prisma.producto.create({ data: { nombre: 'Mahou 5 Estrellas 33cl', marca: 'Mahou', categoria: 'Cerveza', stock: 960, precio_venta: 1.25, precio_compra: 0.58, proveedor_id: cervecera.id } })
  await prisma.producto.create({ data: { nombre: 'Voll-Damm Doble Malta 33cl', marca: 'Damm', categoria: 'Cerveza', stock: 480, precio_venta: 1.55, precio_compra: 0.72, proveedor_id: cervecera.id } })
  await prisma.producto.create({ data: { nombre: 'Amstel Oro 33cl', marca: 'Amstel', categoria: 'Cerveza', stock: 720, precio_venta: 1.15, precio_compra: 0.52, proveedor_id: cervecera.id } })

  // ─── CERVEZA ARTESANAL ───────────────────────────────────────────────────────
  const p_ipa = await prisma.producto.create({ data: { nombre: 'IPA Premium 33cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 600, precio_venta: 1.80, precio_compra: 0.90, proveedor_id: artesana.id } })
  await prisma.producto.create({ data: { nombre: 'Stout Negra 33cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 360, precio_venta: 2.10, precio_compra: 1.05, proveedor_id: artesana.id } })
  await prisma.producto.create({ data: { nombre: 'Trigo Hefeweizen 50cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 420, precio_venta: 2.40, precio_compra: 1.15, proveedor_id: artesana.id } })
  await prisma.producto.create({ data: { nombre: 'Session Lager 33cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 480, precio_venta: 1.60, precio_compra: 0.82, proveedor_id: artesana.id } })
  await prisma.producto.create({ data: { nombre: 'Pale Ale Cítrica 33cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 300, precio_venta: 1.95, precio_compra: 0.98, proveedor_id: artesana.id } })
  await prisma.producto.create({ data: { nombre: 'Porter Ahumada 33cl', marca: 'El Lúpulo', categoria: 'Cerveza artesanal', stock: 240, precio_venta: 2.20, precio_compra: 1.10, proveedor_id: artesana.id } })

  // ─── VINO TINTO ─────────────────────────────────────────────────────────────
  const p_reserva = await prisma.producto.create({ data: { nombre: 'Rioja Reserva 2020', marca: 'Rioja Alta', categoria: 'Vino tinto', stock: 240, precio_venta: 18.50, precio_compra: 9.80, proveedor_id: bodegaRioja.id, fecha_caducidad: '2028-12-31' } })
  const p_crianza = await prisma.producto.create({ data: { nombre: 'Tempranillo Crianza 2021', marca: 'Marqués de Riscal', categoria: 'Vino tinto', stock: 320, precio_venta: 12.50, precio_compra: 6.00, proveedor_id: bodegaRioja.id, fecha_caducidad: '2027-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Ribera del Duero Roble 2022', marca: 'Valduero', categoria: 'Vino tinto', stock: 180, precio_venta: 9.80, precio_compra: 4.90, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2027-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Ribera del Duero Reserva 2019', marca: 'Pesquera', categoria: 'Vino tinto', stock: 96, precio_venta: 24.00, precio_compra: 12.50, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2029-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Garnacha Joven 2023', marca: 'Rioja Alta', categoria: 'Vino tinto', stock: 200, precio_venta: 7.50, precio_compra: 3.60, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Mencía Bierzo 2022', marca: 'Pago de Valdoneje', categoria: 'Vino tinto', stock: 144, precio_venta: 11.00, precio_compra: 5.50, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2027-12-31' } })

  // ─── VINO BLANCO ────────────────────────────────────────────────────────────
  const p_albarino = await prisma.producto.create({ data: { nombre: 'Albariño Rías Baixas 2023', marca: 'Pazo de Señoráns', categoria: 'Vino blanco', stock: 180, precio_venta: 14.00, precio_compra: 7.20, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Verdejo Rueda 2023', marca: 'Belondrade', categoria: 'Vino blanco', stock: 200, precio_venta: 11.50, precio_compra: 5.80, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2026-08-31' } })
  await prisma.producto.create({ data: { nombre: 'Godello Valdeorras 2022', marca: 'Valdesil', categoria: 'Vino blanco', stock: 120, precio_venta: 13.00, precio_compra: 6.50, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Chardonnay Barrel 2022', marca: 'Castilla y León', categoria: 'Vino blanco', stock: 96, precio_venta: 16.00, precio_compra: 8.00, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2027-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Sauvignon Blanc 2023', marca: 'Rioja Alta', categoria: 'Vino blanco', stock: 160, precio_venta: 10.00, precio_compra: 5.00, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-06-30' } })

  // ─── VINO ROSADO ────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Rosado Navarra 2023', marca: 'Chivite', categoria: 'Vino rosado', stock: 150, precio_venta: 8.50, precio_compra: 4.20, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Rosado Garnacha 2023', marca: 'Rioja Alta', categoria: 'Vino rosado', stock: 120, precio_venta: 7.80, precio_compra: 3.80, proveedor_id: bodegaRioja.id, fecha_caducidad: '2026-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Rosado Provenzal 2023', marca: 'Castilla y León', categoria: 'Vino rosado', stock: 80, precio_venta: 9.50, precio_compra: 4.70, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2026-08-31' } })

  // ─── ESPUMOSO / CAVA ────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Cava Brut Nature', marca: 'Freixenet', categoria: 'Espumoso', stock: 120, precio_venta: 12.00, precio_compra: 6.00, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2027-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Cava Rosé Brut', marca: 'Codorníu', categoria: 'Espumoso', stock: 80, precio_venta: 14.50, precio_compra: 7.20, proveedor_id: bodegaCastilla.id, fecha_caducidad: '2027-12-31' } })
  await prisma.producto.create({ data: { nombre: 'Prosecco DOC Extra Dry', marca: 'Mionetto', categoria: 'Espumoso', stock: 60, precio_venta: 11.00, precio_compra: 5.50, proveedor_id: importaciones.id, fecha_caducidad: '2027-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Champagne Brut Réserve', marca: 'Moët & Chandon', categoria: 'Espumoso', stock: 24, precio_venta: 48.00, precio_compra: 28.00, proveedor_id: importaciones.id, fecha_caducidad: '2028-12-31' } })

  // ─── AGUA SIN GAS ────────────────────────────────────────────────────────────
  const p_agua = await prisma.producto.create({ data: { nombre: 'Agua Mineral Natural 1.5L', marca: 'Pirineo', categoria: 'Agua sin gas', stock: 2400, precio_venta: 0.65, precio_compra: 0.28, proveedor_id: aguaspir.id, fecha_caducidad: '2027-01-15' } })
  await prisma.producto.create({ data: { nombre: 'Agua Mineral Natural 50cl', marca: 'Pirineo', categoria: 'Agua sin gas', stock: 3000, precio_venta: 0.40, precio_compra: 0.18, proveedor_id: aguaspir.id, fecha_caducidad: '2027-01-15' } })
  await prisma.producto.create({ data: { nombre: 'Agua Mineral Fuente Origen 1L', marca: 'Pirineo Gold', categoria: 'Agua sin gas', stock: 1200, precio_venta: 0.75, precio_compra: 0.32, proveedor_id: aguaspir.id, fecha_caducidad: '2027-06-30' } })
  await prisma.producto.create({ data: { nombre: 'Agua Alcalina Premium 75cl', marca: 'Pirineo', categoria: 'Agua sin gas', stock: 800, precio_venta: 1.20, precio_compra: 0.55, proveedor_id: aguaspir.id, fecha_caducidad: '2027-12-31' } })

  // ─── AGUA CON GAS ───────────────────────────────────────────────────────────
  const p_aguagas = await prisma.producto.create({ data: { nombre: 'Agua con Gas 75cl', marca: 'Pirineo', categoria: 'Agua con gas', stock: 1800, precio_venta: 0.90, precio_compra: 0.38, proveedor_id: aguaspir.id, fecha_caducidad: '2027-03-01' } })
  await prisma.producto.create({ data: { nombre: 'Agua con Gas 33cl', marca: 'Pirineo', categoria: 'Agua con gas', stock: 1200, precio_venta: 0.65, precio_compra: 0.28, proveedor_id: aguaspir.id, fecha_caducidad: '2027-03-01' } })
  await prisma.producto.create({ data: { nombre: 'Agua con Gas Limón 33cl', marca: 'Pirineo Fresh', categoria: 'Agua con gas', stock: 600, precio_venta: 0.80, precio_compra: 0.35, proveedor_id: aguaspir.id, fecha_caducidad: '2027-01-15' } })

  // ─── REFRESCO ───────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Coca-Cola 33cl', marca: 'Coca-Cola', categoria: 'Refresco', stock: 2400, precio_venta: 1.10, precio_compra: 0.48, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Coca-Cola Zero 33cl', marca: 'Coca-Cola', categoria: 'Refresco', stock: 1800, precio_venta: 1.10, precio_compra: 0.48, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Fanta Naranja 33cl', marca: 'Fanta', categoria: 'Refresco', stock: 1600, precio_venta: 1.00, precio_compra: 0.44, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Fanta Limón 33cl', marca: 'Fanta', categoria: 'Refresco', stock: 1200, precio_venta: 1.00, precio_compra: 0.44, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Sprite 33cl', marca: 'Sprite', categoria: 'Refresco', stock: 1000, precio_venta: 1.00, precio_compra: 0.44, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Nestea Limón 33cl', marca: 'Nestea', categoria: 'Refresco', stock: 800, precio_venta: 1.05, precio_compra: 0.46, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Tónica Premium 20cl', marca: 'Fever-Tree', categoria: 'Refresco', stock: 600, precio_venta: 1.80, precio_compra: 0.85, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Bitter Kas 20cl', marca: 'Kas', categoria: 'Refresco', stock: 500, precio_venta: 1.20, precio_compra: 0.52, proveedor_id: distribRefrescos.id } })

  // ─── ENERGÉTICA ─────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Red Bull Original 25cl', marca: 'Red Bull', categoria: 'Energética', stock: 720, precio_venta: 1.95, precio_compra: 0.92, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Monster Energy Original 50cl', marca: 'Monster', categoria: 'Energética', stock: 480, precio_venta: 2.20, precio_compra: 1.05, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Burn Original 25cl', marca: 'Burn', categoria: 'Energética', stock: 360, precio_venta: 1.75, precio_compra: 0.82, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Powerade Limón 50cl', marca: 'Powerade', categoria: 'Energética', stock: 400, precio_venta: 1.60, precio_compra: 0.74, proveedor_id: distribRefrescos.id } })

  // ─── ZUMO ───────────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Zumo de Naranja 1L', marca: 'Don Simón', categoria: 'Zumo', stock: 600, precio_venta: 1.50, precio_compra: 0.68, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Zumo de Melocotón 20cl', marca: 'Granini', categoria: 'Zumo', stock: 480, precio_venta: 0.95, precio_compra: 0.42, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Zumo Multivitaminas 20cl', marca: 'Tropicana', categoria: 'Zumo', stock: 360, precio_venta: 1.10, precio_compra: 0.50, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Zumo de Manzana 1L', marca: 'Don Simón', categoria: 'Zumo', stock: 500, precio_venta: 1.40, precio_compra: 0.62, proveedor_id: distribRefrescos.id } })

  // ─── DESTILADOS ─────────────────────────────────────────────────────────────
  const p_whisky = await prisma.producto.create({ data: { nombre: 'Whisky 12 Años', marca: 'Don Pepe', categoria: 'Destilados', stock: 96, precio_venta: 35.00, precio_compra: 18.00, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Whisky Escocés Single Malt 15Y', marca: 'Glenfiddich', categoria: 'Destilados', stock: 36, precio_venta: 62.00, precio_compra: 38.00, proveedor_id: importaciones.id } })
  await prisma.producto.create({ data: { nombre: 'Gin Premium Botánica', marca: 'Gin Mare', categoria: 'Destilados', stock: 72, precio_venta: 29.00, precio_compra: 15.50, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Gin Hendrick\'s', marca: 'Hendrick\'s', categoria: 'Destilados', stock: 48, precio_venta: 38.00, precio_compra: 22.00, proveedor_id: importaciones.id } })
  await prisma.producto.create({ data: { nombre: 'Vodka Absolut 70cl', marca: 'Absolut', categoria: 'Destilados', stock: 60, precio_venta: 18.00, precio_compra: 9.50, proveedor_id: importaciones.id } })
  const p_ron = await prisma.producto.create({ data: { nombre: 'Ron Añejo Superior', marca: 'Don Pepe', categoria: 'Destilados', stock: 84, precio_venta: 28.00, precio_compra: 14.50, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Tequila Reposado', marca: 'Olmeca', categoria: 'Destilados', stock: 48, precio_venta: 22.00, precio_compra: 11.00, proveedor_id: importaciones.id } })
  const p_brandy = await prisma.producto.create({ data: { nombre: 'Brandy Gran Reserva', marca: 'Don Pepe', categoria: 'Destilados', stock: 60, precio_venta: 42.00, precio_compra: 22.00, proveedor_id: destileria.id } })

  // ─── LICOR ──────────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Baileys Irish Cream 70cl', marca: 'Baileys', categoria: 'Licor', stock: 48, precio_venta: 19.00, precio_compra: 10.50, proveedor_id: importaciones.id } })
  await prisma.producto.create({ data: { nombre: 'Amaretto di Saronno 70cl', marca: 'Disaronno', categoria: 'Licor', stock: 36, precio_venta: 18.00, precio_compra: 9.80, proveedor_id: importaciones.id } })
  await prisma.producto.create({ data: { nombre: 'Licor 43 70cl', marca: 'Licor 43', categoria: 'Licor', stock: 60, precio_venta: 16.00, precio_compra: 8.50, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Pacharán Navarro 70cl', marca: 'Zoco', categoria: 'Licor', stock: 72, precio_venta: 14.50, precio_compra: 7.20, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Orujo de Galicia Blanco 70cl', marca: 'Augalevada', categoria: 'Licor', stock: 48, precio_venta: 12.00, precio_compra: 6.00, proveedor_id: bodegaCastilla.id } })
  await prisma.producto.create({ data: { nombre: 'Limoncello di Capri 50cl', marca: 'Villa Massa', categoria: 'Licor', stock: 30, precio_venta: 15.00, precio_compra: 8.00, proveedor_id: importaciones.id } })

  // ─── VERMUT ─────────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Vermut Rojo 75cl', marca: 'Don Pepe', categoria: 'Vermut', stock: 120, precio_venta: 10.00, precio_compra: 4.90, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Vermut Blanco 75cl', marca: 'Don Pepe', categoria: 'Vermut', stock: 96, precio_venta: 9.50, precio_compra: 4.60, proveedor_id: destileria.id } })
  await prisma.producto.create({ data: { nombre: 'Vermut Rosé Artesano 50cl', marca: 'Rioja Alta', categoria: 'Vermut', stock: 72, precio_venta: 11.00, precio_compra: 5.50, proveedor_id: bodegaRioja.id } })
  await prisma.producto.create({ data: { nombre: 'Martini Bianco 75cl', marca: 'Martini', categoria: 'Vermut', stock: 60, precio_venta: 8.50, precio_compra: 4.20, proveedor_id: importaciones.id } })

  // ─── SIN ALCOHOL ─────────────────────────────────────────────────────────────
  await prisma.producto.create({ data: { nombre: 'Estrella Sur Sin Alcohol 33cl', marca: 'Estrella del Sur', categoria: 'Sin alcohol', stock: 600, precio_venta: 1.10, precio_compra: 0.50, proveedor_id: cervecera.id } })
  await prisma.producto.create({ data: { nombre: 'Vino Desalcoholizado Tinto 75cl', marca: 'Rioja Alta Free', categoria: 'Sin alcohol', stock: 80, precio_venta: 7.50, precio_compra: 3.80, proveedor_id: bodegaRioja.id } })
  await prisma.producto.create({ data: { nombre: 'Tónica Sin Azúcar 20cl', marca: 'Fever-Tree Light', categoria: 'Sin alcohol', stock: 400, precio_venta: 1.80, precio_compra: 0.85, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Bitter Naranja Sin Alcohol 20cl', marca: 'Kas', categoria: 'Sin alcohol', stock: 350, precio_venta: 1.10, precio_compra: 0.48, proveedor_id: distribRefrescos.id } })
  await prisma.producto.create({ data: { nombre: 'Sangría Sin Alcohol 1L', marca: 'Don Simón', categoria: 'Sin alcohol', stock: 200, precio_venta: 2.80, precio_compra: 1.30, proveedor_id: distribRefrescos.id } })

  console.log('Creando clientes...')
  const cli1 = await prisma.cliente.create({ data: { nombre_cliente: 'Restaurante El Marinero', telf: '+34 913 456 789', direccion: 'Av. del Puerto 12, Cádiz', zona: 'Sur', total_compras: 18420, comercial_clie: carlos.id } })
  const cli2 = await prisma.cliente.create({ data: { nombre_cliente: 'Bar La Terraza', telf: '+34 912 345 678', direccion: 'C/ Mayor 45, Madrid', zona: 'Centro', total_compras: 12350, comercial_clie: carlos.id } })
  const cli3 = await prisma.cliente.create({ data: { nombre_cliente: 'Restaurante Casa Blanca', telf: '+34 943 234 567', direccion: 'Av. Principal 56, Bilbao', zona: 'Norte', total_compras: 9870, comercial_clie: carlos.id } })
  const cli4 = await prisma.cliente.create({ data: { nombre_cliente: 'Hotel Gran Sol', telf: '+34 952 234 567', direccion: 'Paseo Marítimo 8, Málaga', zona: 'Sur', total_compras: 24600, comercial_clie: maria.id } })
  const cli5 = await prisma.cliente.create({ data: { nombre_cliente: 'Cafetería El Rincón', telf: '+34 956 345 678', direccion: 'Plaza del Centro 3, Sevilla', zona: 'Sur', total_compras: 8930, comercial_clie: maria.id } })
  const cli6 = await prisma.cliente.create({ data: { nombre_cliente: 'Club Deportivo Olympia', telf: '+34 951 456 789', direccion: 'C/ Deporte 22, Valencia', zona: 'Este', total_compras: 6540, comercial_clie: maria.id } })
  const cli7 = await prisma.cliente.create({ data: { nombre_cliente: 'Distribuciones Sur, S.L.', telf: '+34 954 456 789', direccion: 'C/ Comercial 22, Sevilla', zona: 'Sur', total_compras: 31200, comercial_clie: antonio.id } })
  const cli8 = await prisma.cliente.create({ data: { nombre_cliente: 'Bar El Trocadero', telf: '+34 915 678 901', direccion: 'C/ Luna 9, Madrid', zona: 'Centro', total_compras: 7450, comercial_clie: antonio.id } })

  console.log('Creando pedidos...')
  const createPedido = async (
    num: number, fecha: string, estado: string,
    clienteId: string, comercialId: string,
    lineas: { prodId: string; cant: number; precio: number }[]
  ) => {
    const total = lineas.reduce((s, l) => s + l.cant * l.precio, 0)
    return prisma.pedido.create({
      data: {
        num_pedido: num, fecha, estado, total,
        cliente_id: clienteId, comercial_id: comercialId,
        lineas: { create: lineas.map(l => ({ producto_id: l.prodId, cantidad: l.cant, precio_venta: l.precio })) },
      },
    })
  }

  await createPedido(1, '2026-01-10', 'entregado', cli1.id, carlos.id, [{ prodId: p_lager.id, cant: 200, precio: 1.20 }, { prodId: p_agua.id, cant: 100, precio: 0.65 }, { prodId: p_crianza.id, cant: 24, precio: 12.50 }])
  await createPedido(2, '2026-01-18', 'entregado', cli4.id, maria.id, [{ prodId: p_reserva.id, cant: 48, precio: 18.50 }, { prodId: p_whisky.id, cant: 6, precio: 35.00 }, { prodId: p_aguagas.id, cant: 50, precio: 0.90 }])
  await createPedido(3, '2026-02-03', 'entregado', cli7.id, antonio.id, [{ prodId: p_lager.id, cant: 500, precio: 1.20 }, { prodId: p_tostada.id, cant: 300, precio: 1.35 }, { prodId: p_ipa.id, cant: 200, precio: 1.80 }])
  await createPedido(4, '2026-02-14', 'entregado', cli2.id, carlos.id, [{ prodId: p_crianza.id, cant: 36, precio: 12.50 }, { prodId: p_agua.id, cant: 80, precio: 0.65 }])
  await createPedido(5, '2026-02-27', 'entregado', cli5.id, maria.id, [{ prodId: p_albarino.id, cant: 24, precio: 14.00 }, { prodId: p_aguagas.id, cant: 40, precio: 0.90 }, { prodId: p_ron.id, cant: 3, precio: 28.00 }])
  await createPedido(6, '2026-03-05', 'confirmado', cli3.id, carlos.id, [{ prodId: p_reserva.id, cant: 60, precio: 18.50 }, { prodId: p_whisky.id, cant: 4, precio: 35.00 }])
  await createPedido(7, '2026-03-11', 'confirmado', cli8.id, antonio.id, [{ prodId: p_lager.id, cant: 150, precio: 1.20 }, { prodId: p_ipa.id, cant: 80, precio: 1.80 }, { prodId: p_agua.id, cant: 60, precio: 0.65 }])
  await createPedido(8, '2026-03-18', 'confirmado', cli6.id, maria.id, [{ prodId: p_lager.id, cant: 300, precio: 1.20 }, { prodId: p_tostada.id, cant: 200, precio: 1.35 }, { prodId: p_agua.id, cant: 150, precio: 0.65 }])
  await createPedido(9, '2026-04-02', 'pendiente', cli1.id, carlos.id, [{ prodId: p_albarino.id, cant: 36, precio: 14.00 }, { prodId: p_brandy.id, cant: 3, precio: 42.00 }])
  await createPedido(10, '2026-04-09', 'pendiente', cli7.id, antonio.id, [{ prodId: p_lager.id, cant: 600, precio: 1.20 }, { prodId: p_tostada.id, cant: 400, precio: 1.35 }, { prodId: p_ipa.id, cant: 250, precio: 1.80 }, { prodId: p_agua.id, cant: 200, precio: 0.65 }])
  await createPedido(11, '2026-04-15', 'pendiente', cli4.id, maria.id, [{ prodId: p_reserva.id, cant: 72, precio: 18.50 }, { prodId: p_albarino.id, cant: 48, precio: 14.00 }, { prodId: p_whisky.id, cant: 8, precio: 35.00 }, { prodId: p_ron.id, cant: 6, precio: 28.00 }])
  await createPedido(12, '2026-05-01', 'pendiente', cli2.id, carlos.id, [{ prodId: p_crianza.id, cant: 48, precio: 12.50 }, { prodId: p_aguagas.id, cant: 100, precio: 0.90 }])
  await createPedido(13, '2026-05-08', 'cancelado', cli5.id, maria.id, [{ prodId: p_brandy.id, cant: 5, precio: 42.00 }, { prodId: p_whisky.id, cant: 3, precio: 35.00 }])
  await createPedido(14, '2026-05-12', 'pendiente', cli8.id, antonio.id, [{ prodId: p_lager.id, cant: 240, precio: 1.20 }, { prodId: p_agua.id, cant: 120, precio: 0.65 }])
  await createPedido(15, '2026-05-19', 'pendiente', cli3.id, carlos.id, [{ prodId: p_reserva.id, cant: 24, precio: 18.50 }, { prodId: p_crianza.id, cant: 36, precio: 12.50 }, { prodId: p_ron.id, cant: 4, precio: 28.00 }])

  console.log('\n✓ Base de datos sembrada correctamente')
  console.log('\nUsuarios disponibles:')
  console.log('  Admin:     admin@bebidasnorte.es   /  Admin2024!')
  console.log('  Comercial: carlos.jimenez@bebidasnorte.es  /  Pass2024!')
  console.log('  Comercial: maria.lopez@bebidasnorte.es     /  Pass2024!')
  console.log('  Comercial: antonio.garcia@bebidasnorte.es  /  Pass2024!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

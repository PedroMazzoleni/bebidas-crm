-- Esquema inicial (SQLite / Cloudflare D1)
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active'
);
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

CREATE TABLE "Comercial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telf" TEXT NOT NULL DEFAULT '',
    "ventas" REAL NOT NULL DEFAULT 0,
    "comision_asignada" REAL NOT NULL DEFAULT 0
);

CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre_cliente" TEXT NOT NULL,
    "telf" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "zona" TEXT NOT NULL DEFAULT '',
    "total_compras" REAL NOT NULL DEFAULT 0,
    "comercial_clie" TEXT,
    CONSTRAINT "Cliente_comercial_clie_fkey" FOREIGN KEY ("comercial_clie") REFERENCES "Comercial" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL DEFAULT '',
    "mail" TEXT NOT NULL DEFAULT '',
    "tipo_iva" TEXT NOT NULL DEFAULT '',
    "nif" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL DEFAULT '',
    "categoria" TEXT NOT NULL DEFAULT '',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "precio_venta" REAL NOT NULL DEFAULT 0,
    "precio_compra" REAL NOT NULL DEFAULT 0,
    "proveedor_id" TEXT,
    "fecha_caducidad" TEXT,
    CONSTRAINT "Producto_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_pedido" INTEGER NOT NULL,
    "fecha" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "total" REAL NOT NULL DEFAULT 0,
    "cliente_id" TEXT NOT NULL,
    "comercial_id" TEXT,
    CONSTRAINT "Pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pedido_comercial_id_fkey" FOREIGN KEY ("comercial_id") REFERENCES "Comercial" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "LineaPedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedido_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_venta" REAL NOT NULL,
    CONSTRAINT "LineaPedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LineaPedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type D1Database = ConstructorParameters<typeof PrismaD1>[0]

// Un PrismaClient por binding de D1 (se reutiliza dentro del mismo isolate)
const clients = new WeakMap<D1Database, PrismaClient>()

function getClient(): PrismaClient {
  const db = getCloudflareContext().env.DB as D1Database
  let client = clients.get(db)
  if (!client) {
    client = new PrismaClient({ adapter: new PrismaD1(db) })
    clients.set(db, client)
  }
  return client
}

// Se mantiene la misma API (`prisma.pedido.findMany()`...) que antes con MySQL
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient()
    const value = Reflect.get(client, prop)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

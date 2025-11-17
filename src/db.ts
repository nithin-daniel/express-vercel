import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let dbInstance: Db | null = null

export async function connectToMongo(uri?: string, dbName?: string) {
  const MONGODB_URI = uri ?? process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not set')
  }

  if (client) return { client, db: dbInstance }

  client = new MongoClient(MONGODB_URI)
  await client.connect()

  // Try to derive a database name from the connection string if not provided
  let resolvedName = dbName
  if (!resolvedName) {
    try {
      const url = new URL(MONGODB_URI)
      resolvedName = url.pathname?.replace(/^\//, '') || undefined
    } catch (err) {
      // ignore URL parse errors; leave resolvedName undefined
    }
  }
  dbInstance = client.db(resolvedName)

  console.log('MongoDB connected', resolvedName ?? '(default)')
  return { client, db: dbInstance }
}

export function getDb() {
  if (!dbInstance) throw new Error('MongoDB not connected - call connectToMongo first')
  return dbInstance
}

export async function closeMongo() {
  if (client) await client.close()
  client = null
  dbInstance = null
}

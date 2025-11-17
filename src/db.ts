import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let dbInstance: Db | null = null
let status: 'disconnected' | 'connecting' | 'connected' = 'disconnected'
let lastError: Error | null = null

export async function connectToMongo(uri?: string, dbName?: string) {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Joel:Alphabet@cluster0.fvbebik.mongodb.net/project"
  if (!MONGODB_URI) {
    const err = new Error('MONGODB_URI environment variable not set')
    lastError = err
    status = 'disconnected'
    throw err
  }

  if (client) return { client, db: dbInstance }

  status = 'connecting'
  lastError = null
  client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
  } catch (err) {
    lastError = err as Error
    status = 'disconnected'
    // rethrow so callers can react/log
    throw err
  }

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
  status = 'connected'
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
  status = 'disconnected'
}

export function isConnected() {
  return status === 'connected'
}

export function getConnectionInfo() {
  return { status, lastError: lastError?.message ?? null }
}

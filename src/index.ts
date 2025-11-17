import express from 'express'
import { connectToMongo, isConnected, getConnectionInfo } from './db.js'

const app = express()

app.get('/', (_req, res) => {
  const info = getConnectionInfo()
  res.json({ message: 'Hello Express!', dbConnected: isConnected(), dbStatus: info.status, dbError: info.lastError })
})

// Try to connect to MongoDB on module load. This won't prevent the app from
// being imported in serverless environments; connection errors are logged.
connectToMongo().catch(err => {
  // Keep the app usable even if DB is not available; log for diagnostics.
  // If you want to fail fast, rethrow the error here.
  console.error('Failed to connect to MongoDB:', err)
})

export default app

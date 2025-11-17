import express from 'express'
import { connectToMongo } from './db.js'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

// Try to connect to MongoDB on module load. This won't prevent the app from
// being imported in serverless environments; connection errors are logged.
connectToMongo().catch(err => {
  // Keep the app usable even if DB is not available; log for diagnostics.
  // If you want to fail fast, rethrow the error here.
  console.error('Failed to connect to MongoDB:', err)
})

export default app

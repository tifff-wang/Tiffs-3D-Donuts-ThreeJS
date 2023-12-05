import * as Path from 'node:path'
import express from 'express'
import donutRouter from './routes/donuts-routes'
import errors from './lib/errors'

const server = express()
server.use(express.json())

server.use('/api/v1/donuts', donutRouter)

server.use((err, req, res, next) => {
  if (!err) return
  console.log(`An error has occurred. ${req.path}: ${err}`)

  if (String(err).match(/unauthorized/gi))
    return errors.unauthorizedError(req, res, 'Unauthorized')

  res.status(500).json({ message: 'An unexpected error has occurred.' })
})

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server

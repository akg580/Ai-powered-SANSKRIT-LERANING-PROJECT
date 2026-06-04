import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')
const preferredPort = Number(process.env.PORT || 4173)
const maxPortAttempts = 25

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

function getContentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
}

async function sendFile(res, filePath) {
  const data = await readFile(filePath)
  res.writeHead(200, { 'Content-Type': getContentType(filePath) })
  res.end(data)
}

function startServer(port, attemptsLeft = maxPortAttempts) {
  const server = http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
      const pathname = decodeURIComponent(requestUrl.pathname)
      const assetPath = path.join(distDir, pathname === '/' ? 'index.html' : pathname)

      try {
        await sendFile(res, assetPath)
      } catch {
        await sendFile(res, path.join(distDir, 'index.html'))
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(`Server error: ${error.message}`)
    }
  })

  server.once('error', error => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1
      console.warn(`Port ${port} is busy, trying ${nextPort}...`)
      startServer(nextPort, attemptsLeft - 1)
      return
    }

    console.error(error)
    process.exit(1)
  })

  server.listen(port, '0.0.0.0', () => {
    console.log(`Static server ready at http://localhost:${port}/`)
  })
}

startServer(preferredPort)

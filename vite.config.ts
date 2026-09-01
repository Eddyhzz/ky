import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import generateHandler from './api/generate.js'

function localApi() {
  return {
    name: 'local-api',
    configureServer(server: any) {
      server.middlewares.use('/api/generate', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next()

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk)
        try {
          req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
        } catch {
          res.statusCode = 400
          return res.end('请求格式错误')
        }

        res.status = (code: number) => {
          res.statusCode = code
          return res
        }
        res.send = (body: string) => res.end(body)
        res.json = (body: unknown) => {
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify(body))
        }
        return generateHandler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY

  return {
    plugins: [react(), localApi()],
  }
})

// This file isn't processed by Vite, see https://vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

import express from 'express'
import { renderPage } from 'vike/server'
import 'dotenv/config'
import { root } from './root.js'
import { RequestContext } from './request-context.js'
import type { MessageSendContext } from '@/lib/types'
import { addTelefuncHandlerToApp } from './middleware'
import { getUserFromCookie } from './authentication'
import { setUsageTime } from '#server/user'

startServer()

// @Developer reading this
// This file is only used in development.
// Most endpoints should be telefunc handlers, but a any routes added
// MUST also be added to `server/lambda_api.ts` for production
async function startServer() {
    const app = express()
    app.use(express.text())
    app.use(express.json())

    // Express is only used in dev, in prod lambdas are used
    // We instantiate Vite's development server and integrate its middleware to our server.
    // We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our server in production.)
    const viteImp = await import('vite')
    const vite = await viteImp.createServer({
        root,
        server: {
            hmr: {
                clientPort: 24678,
            },
            middlewareMode: true,
        }
    })

    app.use(vite.middlewares)

    app.post('/api/chat/message', async (req, res) => {
        const ctx = req.body as MessageSendContext
        res.writeHead(200, {
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
            "Content-Type": "text/event-stream",
        })
        const user = await getUserFromCookie(req.headers)
        if (!user) {
            throw new Error('unauthorized, invalid user')
        }
        const { addMessageToChat, chatTranscript  } = await vite.ssrLoadModule('#server/conversation', { fixStacktrace: true })

        const chat = await addMessageToChat(new RequestContext(
            (updated) => {
                res.write('data: ' + JSON.stringify(updated) + '\n\n');
            },
            (msg) => {
                if (msg) {
                    res.write('data: ' + JSON.stringify(msg) + '\n\n');
                }
                res.end()
            },
            { ...ctx, user }
        ))

        res.write('data: ' + JSON.stringify({
            id: chat.id,
            transcript: await chatTranscript(chat.id)
        }) + '\n\n');
    })

    // this call uses sendBeacon, not telefunc
    app.post('/api/user/time', async (req) => {
        const user = await getUserFromCookie(req.headers)
        if (user && req.body.seconds) setUsageTime(user.uuid, req.body.seconds)
    })


    addTelefuncHandlerToApp(app)

    app.get('*', async (req, res, next) => {
        const pageContextInit = {
            urlOriginal: req.originalUrl
        }
        const pageContext = await renderPage(pageContextInit)
        const { httpResponse } = pageContext
        if (!httpResponse) return next()
        const { body, statusCode, headers, earlyHints } = httpResponse
        if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
        res.status(statusCode)
        headers.forEach(([name, value]) => res.setHeader(name, value))
        res.send(body)
    })

    const port = process.env.PORT || 3000
    app.listen(port)
    console.log(`Server running at http://localhost:${port}`)
}

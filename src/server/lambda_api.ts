import serverless from 'serverless-http'
import express from 'express'
import { getUserFromCookie } from './authentication'
import { setUsageTime } from '#server/user'
import { addTelefuncHandlerToApp } from './middleware'
import cookie from 'cookie'
import { sentryLambdaWrapper } from './sentry'

// @Developer reading this
// This file is only used in production.
// Most endpoints should be telefunc handlers, but any routes added
// MUST also be added to `server/express.ts` for development
function server() {

    const app = express()
    app.use(express.text())
    app.use(express.json())

    addTelefuncHandlerToApp(app)

    // this call uses sendBeacon, not telefunc
    app.post('/api/user/time', async (req) => {
        const user = await getUserFromCookie(cookie.parse(req.headers.cookie || ''))
        if (user && req.body.seconds) setUsageTime(user.uuid, req.body.seconds)
    })

    return app

}


export const handler = sentryLambdaWrapper(serverless(server()))

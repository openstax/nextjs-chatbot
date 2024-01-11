import type { Express } from 'express'
import { getUserFromCookie } from './authentication'
import { config, telefunc } from 'telefunc'
import cookie from 'cookie'
import { IS_PROD } from "#server/config";

// telefunc thinks we should put these methods beside the callers
// https://telefunc.com/event-based#naming-convention
config.disableNamingConvention = true
config.telefuncUrl = '/api/tf'

export function addTelefuncHandlerToApp(app: Express) {

    app.all('/api/tf', async (req, res) => {

        const user = await getUserFromCookie(cookie.parse(req.headers.cookie || ''))

        const userLocation = {
            region: IS_PROD ? req.headers['cloudfront-viewer-country-region-name'] : 'Alabama',
            country: IS_PROD ? req.headers['cloudfront-viewer-country'] : 'US'
        }

        const httpResponse = await telefunc({
            url: req.url,
            method: req.method,
            body: req.body,
            context: {
                user,
                userLocation
            },
        })
        const { body, statusCode, contentType } = httpResponse
        res.status(statusCode).type(contentType).send(body)
    })
}

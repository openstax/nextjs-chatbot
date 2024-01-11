import Sentry from '@sentry/serverless'
import { ProfilingIntegration } from '@sentry/profiling-node'
import type { Handler } from 'aws-lambda';

Sentry.AWSLambda.init({
    dsn: 'https://8c276596e91d3778700d7f835ad8c6b3@o484761.ingest.sentry.io/4506260590755840',
    tracesSampleRate: 0.2,
    integrations: [
        new ProfilingIntegration(),
    ],
})

export function sentryLambdaWrapper<TEvent, TResult>(handler: Handler<TEvent, TResult>): Handler<TEvent, TResult>{
    return Sentry.AWSLambda.wrapHandler(handler)
}

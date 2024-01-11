const env = process.env.NODE_ENV

export const ENV = {
    IS_PROD: env == 'production',
    IS_DEV: env !== 'production',
    NAME: env,
}

Object.freeze(ENV)


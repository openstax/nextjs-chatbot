/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true
}

const withTelefunc = require('telefunc/next').default

module.exports = withTelefunc(nextConfig)

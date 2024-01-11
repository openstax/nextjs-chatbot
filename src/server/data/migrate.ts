import { Migrate } from 'onetable-migrate'
import { DynamoClient } from './client'
import { DynamoDBSchema as schema } from './schema'
import fs from 'fs'

import type { Table  } from 'dynamodb-onetable'

export type Migration = {
    version: string
    description: string
    up(db: Table, migrate: Migrate, params: { dry: boolean}): void
}

const MIGRATIONS_PATH = './server/data/migrations'

const migrations: Migration[] = []

async function createCmd(migrate: Migrate) {
    const isDry = process.argv.indexOf('--dry') != -1

    const version = process.argv[process.argv.indexOf('--version') + 1]

    if (!version) {
        console.warn('must specify --version')
        process.exit(1)
    }

    await migrate.apply(version, '0.0.1', { dry: isDry })
}

async function createMigrate() {
    const migrate = new Migrate({
        client: DynamoClient,
        name: process.env.DYNAMO_DATA_TABLE,
        partial: true,

    }, { migrations })

    await migrate.init()

    createCmd(migrate).then(async () => {
        const version = await migrate.getCurrentVersion()
        console.log(`migrations complete.  current version: ${version}`)
    })
}

const files = fs.readdirSync(MIGRATIONS_PATH)

Promise.all(files.map(async (file) => {
    const migration = await import(`./migrations/${file}`)
    migrations.push({
        schema,
        ...migration.default
    })
})).then(createMigrate)

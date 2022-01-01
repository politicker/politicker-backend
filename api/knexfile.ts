import path from 'path'

interface ConnectionConfig {
	client: string
	connection: {
		connectionString: string | undefined
		ssl?: { rejectUnauthorized: boolean }
	}
	migrations: {
		tableName: string
		directory: string
	}
}

const config: ConnectionConfig = {
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: path.join(__dirname, 'migrations'),
	},
}

if (process.env.NODE_ENV === 'production') {
	config.connection.ssl = { rejectUnauthorized: false }
}

export default config

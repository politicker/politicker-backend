import { readFileSync } from 'fs'
import express, { Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'

import resolvers from './graphql/resolvers'

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.disable('x-powered-by')

app.get('/date', (_, res) => {
	const deployDate = readFileSync('/app/DEPLOY_DATE').toString('utf-8')
	res.status(200).send(deployDate)
})

;(async () => {
	const typeDefs = readFileSync('./graphql/schema.graphql').toString('utf-8')

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		mocks: process.env.MOCK_GRAPHQL_SERVER === 'true'
	})

	await server.start()
	server.applyMiddleware({ app })
})()

app.listen(port, () => {
	console.log(`politicker-api listening on ${port}`)
})

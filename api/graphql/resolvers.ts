import { toCamel } from 'snake-camel'
import knex from '../db'
import { date } from './scalars'
import type API from '../generated/schema-types'

const resolvers: API.Resolvers = {
	Query: {
		async matters(): Promise<API.Matter[]> {
			// const row = await

			const rows = await knex<API.Matter>('nyc_council_matters')
				.select('*')
				.select(
					knex.raw(
						'greatest(enacted_at, passed_at, introduced_at, agenda_date) as max_action_date'
					)
				)
				.whereNotNull('enacted_at')
				.orWhereNotNull('agenda_date')
				.orWhereNotNull('passed_at')
				.orWhereNotNull('introduced_at')
				.orderBy('max_action_date', 'desc')
				.limit(100)

			if (!rows) {
				throw new Error('failed to fetch rows')
			}

			return rows.map((r) => toCamel(r) as API.Matter)
		},
		async matter(_: {}, args: API.QueryMatterArgs): Promise<API.Matter> {
			let matter = await knex<API.Matter>('nyc_council_matters')
				.where({
					id: args.id,
				})
				.first()

			if (!matter) {
				throw new Error(`matter ${args.id} not found`)
			}

			matter = toCamel(matter) as API.Matter
			matter.status = matter.status.toUpperCase() as API.MatterStatus

			console.log(matter)

			return matter
		},
	},
	Matter: {
		status(matter: API.Matter): API.MatterStatus {
			return matter.status.toUpperCase() as API.MatterStatus
		},
		async postDate(matter: API.Matter): Promise<Date> {
			const dates: number[] = []

			if (matter.passedAt) {
				dates.push(matter.passedAt.getTime())
			}

			if (matter.introducedAt) {
				dates.push(matter.introducedAt.getTime())
			}

			if (matter.agendaDate) {
				dates.push(matter.agendaDate.getTime())
			}

			return new Date(Math.max(...dates))
		},
	},
	Date: date,
}

export default resolvers

import { toCamel } from 'snake-camel'
import knex from '../db'
import type {
	QueryMatterArgs,
	Resolvers,
	Matter,
} from '../generated/schema-types'
import { MatterStatus } from '../generated/schema-types'
import { date } from './scalars'

const resolvers: Resolvers = {
	Query: {
		async matters(): Promise<Matter[]> {
			const rows = await knex<Matter>('nyc_council_matters')
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

			return rows.map((r) => toCamel(r) as Matter)
		},
		async matter(_: {}, args: QueryMatterArgs): Promise<Matter> {
			let matter = await knex<Matter>('nyc_council_matters')
				.where({
					id: args.id,
				})
				.first()

			if (!matter) {
				throw new Error(`matter ${args.id} not found`)
			}

			matter = toCamel(matter) as Matter
			matter.status = matter.status.toUpperCase() as MatterStatus

			console.log(matter)

			return matter
		},
	},
	Matter: {
		status(matter: Matter): MatterStatus {
			return matter.status.toUpperCase() as MatterStatus
		},
		async postDate(matter: Matter): Promise<Date> {
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

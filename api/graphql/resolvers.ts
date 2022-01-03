import { toCamel } from 'snake-camel'
import knex from '../db'
import type { MutationCreateLikeArgs, CreateLikeResponse, Resolvers, Matter } from '../generated/schema-types'
import { MatterStatus } from '../generated/schema-types'

const resolvers: Resolvers = {
	Query: {
		async matters(): Promise<Matter[]> {
			const rows = await knex<Matter>('nyc_council_matters')
				.select('*')
				.select(knex.raw('greatest(enacted_at, passed_at, introduced_at, agenda_date) as max_action_date'))
				.whereNotNull('enacted_at')
				.orWhereNotNull('agenda_date')
				.orWhereNotNull('passed_at')
				.orWhereNotNull('introduced_at')
				.orderBy('max_action_date', 'desc')
				.limit(100)

			if (!rows) {
				throw new Error('failed to fetch rows')
			}

			console.log(rows)

			return rows.map(r => toCamel(r) as Matter).map(r => ({
				...r,
				shortDescription: r.shortDescription || '',
				longDescription: r.longDescription || '',
				billWould: r.billWould || '',
				fileNumber: r.fileNumber || '',
				typeName: r.typeName || '',
				status: r.status.toUpperCase() as MatterStatus,
				committeeName: r.committeeName || '',
				lastModifiedAt: r.lastModifiedAt || '',
				introducedAt: r.introducedAt || '',
				passedAt: r.passedAt || '',
				enactedAt: r.enactedAt || '',
				agendaDate: r.agendaDate || '',
				enactmentNumber: r.enactmentNumber || '',
				nycLegislatureGuid: r.nycLegislatureGuid || '',
				updatedAt: r.updatedAt || '',
				likeCount: 0,
				liked: false,
			}))
		},
	},

	// Matter: {
	// 	async likes(parent): Promise<Like[]> {
	// 		const rows = await knex<Matter>('likes').where().orderBy('agenda_date').limit(100)

	// 		return []
	// 	}
	// },

	Mutation: {
		createLike(_: {}, args: MutationCreateLikeArgs): CreateLikeResponse {
			console.log(args.input)

			return {
				matter: {
					id: args.input.MatterID,
					shortDescription: '',
					longDescription: '',
					billWould: '',
					fileNumber: '',
					typeName: '',
					status: MatterStatus.General,
					committeeName: '',
					lastModifiedAt: '',
					introducedAt: '',
					passedAt: '',
					enactedAt: '',
					agendaDate: '',
					enactmentNumber: '',
					nycLegislatureGuid: '',
					updatedAt: '',
					liked: true,
					likes: [],
					likeCount: 420,
				}
			}
		}
	}
}

export default resolvers

import knex from '../db'
import type { MutationCreateLikeArgs, CreateLikeResponse, Resolvers, Matter } from '../generated/schema-types'
import { MatterStatus } from '../generated/schema-types'

const resolvers: Resolvers = {
	Query: {
		async matters(): Promise<Matter[]> {
			const rows = await knex<Matter>('nyc_council_matters').orderBy('agenda_date').limit(100)

			if (!rows) {
				throw new Error('failed to fetch rows')
			}

			return rows
		}
	},

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

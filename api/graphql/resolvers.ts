import { MutationCreateLikeArgs, CreateLikeResponse, Resolvers, Bill, Matter, MatterStatus } from '../generated/schema-types'

const resolvers: Resolvers = {
	Query: {
		matters(): [Matter] {
			return [
				{
					id: 'args.input.MatterID',
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
			]
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

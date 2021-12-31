import { CreateLikeInput, CreateLikeResponse, Resolvers } from '../generated/schema-types'

export const resolvers: Resolvers = {
	Query: {},
	Mutation: {
		createLike(CreateLikeInput): CreateLikeResponse {
			return {
				bill: {
					id: '',
					active: true,
					committeeCodes: ['1234'],
					committees: '',
					congressdotgovURL: '',
					cosponsors: 1234,
					enacted: '2021-01-04',
					govtrackURL: 'https://google.com',
					gpoPdfURI: 'https://google.com',
					housePassage: '',
					introducedDate: '2021-01-01',
					latestMajorAction: 'Passed House',
					latestMajorActionDate: '2021-01-01',
					number: 'H.RES.820',
					primarySubject: 'Science',
					senatePassage: '2021-01-01',
					shortTitle: 'A bill about a thing',
					sponsorID: '21301232',
					sponsorName: 'Bernie Sanders',
					sponsorParty: 'D',
					sponsorState: 'VT',
					sponsorTitle: 'Bernie Sanders',
					sponsorURI: 'https://google.com',
					subcommitteeCodes: ['1234'],
					summary: 'A bill about some stuff about stuff.',
					statuses: [],
					liked: true,
					likes: [],
					likeCount: 420,
					categories: []
				}
			}
		}
	}
}

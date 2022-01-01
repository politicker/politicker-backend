import { MutationCreateLikeArgs, CreateLikeResponse, Resolvers, Bill } from '../generated/schema-types'

const resolvers: Resolvers = {
	Query: {
		bills(_: {}): Bill[] {
			return [
				{
					id: '7a4b473f-d5c8-41c3-b4f5-20c25bb71c71',
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
					number: 'H.RES.8201122211',
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
					liked: false,
					likes: [],
					likeCount: 420,
					categories: []
				},
				{
					id: '43b976b4-9e14-4550-985d-b3329fbcaf89',
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
					liked: false,
					likes: [],
					likeCount: 420,
					categories: []
				}
			]
		}
	},
	Mutation: {
		createLike(_: {}, args: MutationCreateLikeArgs): CreateLikeResponse {
			console.log(args.input)

			return {
				bill: {
					id: args.input.billID,
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

export default resolvers

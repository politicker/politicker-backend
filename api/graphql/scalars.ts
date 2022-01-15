import { GraphQLScalarType, Kind } from 'graphql'

export const date = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value): string {
		return new Date(value as string).toISOString()
	},
	parseValue(value): Date {
		return new Date(value as string) // Convert incoming string to Date
	},
	parseLiteral(ast): Date | null {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value)
		}
		return null // Invalid hard-coded value (not an integer)
	},
})

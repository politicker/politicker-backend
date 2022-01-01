import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('bills', (table: Knex.TableBuilder) => {
		table.bigInteger('id').primary()
		table.boolean('active')
		table.text('committees')
		table.text('congress_dot_gov_url')
		table.integer('cosponsors')
		table.string('enacted')
		table.text('gov_track_url')
		table.string('house_passage_date')
		table.string('propublica_id')
		table.string('introduced_date')
		table.text('latest_major_action')
		table.text('latest_major_action_date')
		table.string('number')
		table.text('primary_subject')
		table.string('senate_passage')
		table.text('short_title')
		table.string('sponsor_id')
		table.string('sponsor_name')
		table.string('sponsor_party')
		table.string('sponsor_state')
		table.string('sponsor_title')
		table.text('sponsor_uri')
		table.text('summary')

		table.timestamps(false, true)
	})

	await knex.schema.createTable('bill_events', (table: Knex.TableBuilder) => {
		table.bigInteger('id').primary()
		table.bigInteger('bill_id').references('id').inTable('bills').onDelete('cascade')
		table.dateTime('action_date')
		table.text('action_name')

		table.timestamps(false, true)
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('bills')
	await knex.schema.dropTable('bill_events')
}


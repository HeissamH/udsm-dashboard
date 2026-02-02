import { pgTable, uuid, varchar, date, timestamp, text } from 'drizzle-orm/pg-core';
import { papers } from './papers';

export const citations = pgTable('citations', {
    id: uuid('id').defaultRandom().primaryKey(),
    paperId: uuid('paper_id').references(() => papers.id, { onDelete: 'cascade' }).notNull(),
    citingWorkTitle: varchar('citing_work_title', { length: 500 }).notNull(),
    citingAuthors: text('citing_authors').array().notNull(),
    citationDate: date('citation_date').notNull(),
    source: varchar('source', { length: 100 }).notNull(), // e.g., 'Google Scholar', 'Manual Entry'
    url: varchar('url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Citation = typeof citations.$inferSelect;
export type NewCitation = typeof citations.$inferInsert;

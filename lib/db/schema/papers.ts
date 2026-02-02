import { pgTable, uuid, varchar, text, date, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const paperStatusEnum = pgEnum('paper_status', ['draft', 'published', 'archived']);

export const papers = pgTable('papers', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    abstract: text('abstract').notNull(),
    authors: text('authors').array().notNull(), // Array of author names
    keywords: text('keywords').array().notNull(),
    publicationDate: date('publication_date').notNull(),
    journalName: varchar('journal_name', { length: 255 }).notNull(),
    doi: varchar('doi', { length: 255 }).unique(),
    pdfUrl: varchar('pdf_url', { length: 500 }).notNull(),
    coverImageUrl: varchar('cover_image_url', { length: 500 }),
    category: varchar('category', { length: 100 }).notNull(),
    status: paperStatusEnum('status').notNull().default('draft'),
    uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    titleIdx: index('papers_title_idx').on(table.title),
    publicationDateIdx: index('papers_publication_date_idx').on(table.publicationDate),
    statusIdx: index('papers_status_idx').on(table.status),
    categoryIdx: index('papers_category_idx').on(table.category),
}));

export type Paper = typeof papers.$inferSelect;
export type NewPaper = typeof papers.$inferInsert;

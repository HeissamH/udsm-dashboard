import { pgTable, uuid, varchar, timestamp, pgEnum, decimal, index } from 'drizzle-orm/pg-core';
import { papers } from './papers';

export const eventTypeEnum = pgEnum('event_type', ['view', 'download', 'citation']);

export const analyticsEvents = pgTable('analytics_events', {
    id: uuid('id').defaultRandom().primaryKey(),
    paperId: uuid('paper_id').references(() => papers.id, { onDelete: 'cascade' }).notNull(),
    eventType: eventTypeEnum('event_type').notNull(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(), // SHA-256 hash
    countryCode: varchar('country_code', { length: 2 }), // ISO 3166-1 alpha-2
    countryName: varchar('country_name', { length: 100 }),
    city: varchar('city', { length: 100 }),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    userAgent: varchar('user_agent', { length: 500 }),
    referrer: varchar('referrer', { length: 500 }),
    sessionId: varchar('session_id', { length: 255 }).notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
    paperTimestampIdx: index('analytics_paper_timestamp_idx').on(table.paperId, table.timestamp),
    eventTypeTimestampIdx: index('analytics_event_type_timestamp_idx').on(table.eventType, table.timestamp),
    countryCodeIdx: index('analytics_country_code_idx').on(table.countryCode),
    sessionDedupeIdx: index('analytics_session_dedupe_idx').on(table.sessionId, table.paperId, table.eventType),
}));

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;

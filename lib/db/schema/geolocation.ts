import { pgTable, uuid, varchar, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const geolocationCache = pgTable('geolocation_cache', {
    id: uuid('id').defaultRandom().primaryKey(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull().unique(),
    countryCode: varchar('country_code', { length: 2 }).notNull(),
    countryName: varchar('country_name', { length: 100 }).notNull(),
    city: varchar('city', { length: 100 }),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    cachedAt: timestamp('cached_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
}, (table) => ({
    ipHashIdx: index('geolocation_ip_hash_idx').on(table.ipHash),
    expiresAtIdx: index('geolocation_expires_at_idx').on(table.expiresAt),
}));

export type GeolocationCache = typeof geolocationCache.$inferSelect;
export type NewGeolocationCache = typeof geolocationCache.$inferInsert;

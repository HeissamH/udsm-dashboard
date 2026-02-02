import { db } from '../db';
import { geolocationCache } from '../db/schema';
import { eq, gt, lt } from 'drizzle-orm';
import { hashIp } from './utils';
import { lookupIpGeolocation, type GeolocationData } from './ipapi';

const CACHE_TTL_DAYS = 30;

/**
 * Get geolocation data for an IP address (with caching)
 */
export async function getGeolocation(ip: string): Promise<GeolocationData | null> {
    const ipHash = hashIp(ip);

    // Check cache first
    const cached = await db
        .select()
        .from(geolocationCache)
        .where(eq(geolocationCache.ipHash, ipHash))
        .limit(1);

    if (cached.length > 0) {
        const entry = cached[0];

        // Check if cache is still valid
        if (entry.expiresAt > new Date()) {
            return {
                countryCode: entry.countryCode,
                countryName: entry.countryName,
                city: entry.city || null,
                latitude: entry.latitude ? parseFloat(entry.latitude) : null,
                longitude: entry.longitude ? parseFloat(entry.longitude) : null,
            };
        }

        // Cache expired, delete it
        await db
            .delete(geolocationCache)
            .where(eq(geolocationCache.ipHash, ipHash));
    }

    // Cache miss or expired, lookup from API
    const geoData = await lookupIpGeolocation(ip);

    if (!geoData) {
        return null;
    }

    // Store in cache
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

    try {
        await db.insert(geolocationCache).values({
            ipHash,
            countryCode: geoData.countryCode,
            countryName: geoData.countryName,
            city: geoData.city,
            latitude: geoData.latitude?.toString(),
            longitude: geoData.longitude?.toString(),
            expiresAt,
        });
    } catch (error) {
        // Ignore cache insertion errors
        console.error('Failed to cache geolocation:', error);
    }

    return geoData;
}

/**
 * Clean up expired cache entries
 */
export async function cleanExpiredCache(): Promise<number> {
    const result = await db
        .delete(geolocationCache)
        .where(lt(geolocationCache.expiresAt, new Date()));

    return Array.isArray(result) ? result.length : 0;
}

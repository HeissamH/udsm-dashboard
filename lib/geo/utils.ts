import crypto from 'crypto';

/**
 * Hash IP address for privacy
 */
export function hashIp(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(headers: Headers): string | null {
    // Try various headers in order of preference
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp.trim();
    }

    return null;
}

/**
 * Generate or retrieve session ID from cookie
 */
export function getSessionId(cookies: { get: (name: string) => { value: string } | undefined }): string {
    const existing = cookies.get('session_id');
    if (existing) {
        return existing.value;
    }

    // Generate new session ID
    return crypto.randomBytes(16).toString('hex');
}

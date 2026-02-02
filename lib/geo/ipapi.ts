export interface GeolocationData {
    countryCode: string;
    countryName: string;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface IpApiResponse {
    country_code: string;
    country_name: string;
    city: string;
    latitude: number;
    longitude: number;
    error?: boolean;
    reason?: string;
}

/**
 * Lookup IP geolocation using ipapi.co
 */
export async function lookupIpGeolocation(ip: string): Promise<GeolocationData | null> {
    try {
        const apiKey = process.env.IPAPI_KEY;
        const url = apiKey
            ? `https://ipapi.co/${ip}/json/?key=${apiKey}`
            : `https://ipapi.co/${ip}/json/`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'UDSM-Journal-Analytics/1.0',
            },
        });

        if (!response.ok) {
            console.error(`IP API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data: IpApiResponse = await response.json();

        if (data.error) {
            console.error(`IP API error: ${data.reason}`);
            return null;
        }

        return {
            countryCode: data.country_code || 'XX',
            countryName: data.country_name || 'Unknown',
            city: data.city || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
        };
    } catch (error) {
        console.error('Failed to lookup IP geolocation:', error);
        return null;
    }
}

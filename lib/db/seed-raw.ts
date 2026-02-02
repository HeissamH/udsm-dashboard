import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';
import { subDays, subMonths } from 'date-fns';

// Direct connection ensuring we match the working configuration
const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    ssl: { rejectUnauthorized: false }
});

// Helper for consistent IP hashing (simplified for raw seed)
function hashIp(ip: string) {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// Data Generators (re-used logic)
const SAMPLE_PAPERS = [
    {
        title: 'Climate Change Impact on Tanzanian Agriculture: A Comprehensive Study',
        abstract: 'This study examines the effects of climate variability on agricultural productivity in Tanzania, focusing on smallholder farmers in the Dodoma and Morogoro regions.',
        authors: ['Dr. Amina Hassan', 'Prof. John Mwakasege', 'Dr. Grace Kimaro'],
        journalName: 'East African Journal of Agriculture',
        category: 'Agriculture',
    },
    {
        title: 'Artificial Intelligence Applications in Healthcare: Tanzanian Perspective',
        abstract: 'An exploration of AI-driven diagnostic tools and their potential implementation in Tanzanian healthcare facilities.',
        authors: ['Dr. Emmanuel Mtui', 'Dr. Sarah Ndege'],
        journalName: 'African Journal of Medical Technology',
        category: 'Technology',
    },
    {
        title: 'Swahili Language Processing Using Natural Language Models',
        abstract: 'Development of NLP models specifically designed for Swahili language understanding and generation.',
        authors: ['Prof. Fatuma Simba', 'Dr. Hassan Bakari', 'Ms. Neema Juma'],
        journalName: 'Journal of African Languages and Linguistics',
        category: 'Linguistics',
    },
    {
        title: 'Sustainable Energy Solutions for Rural Tanzania',
        abstract: 'Investigating solar and wind energy potential in off-grid communities across Tanzania.',
        authors: ['Dr. Peter Mollel', 'Prof. Rehema Kilonzo'],
        journalName: 'Renewable Energy Africa',
        category: 'Energy',
    },
    {
        title: 'Marine Biodiversity in the Zanzibar Archipelago',
        abstract: 'A comprehensive survey of coral reef ecosystems and marine species diversity in Zanzibar waters.',
        authors: ['Dr. Ali Khamis', 'Prof. Mwajuma Masoud', 'Dr. Omar Said'],
        journalName: 'Indian Ocean Marine Biology',
        category: 'Marine Biology',
    },
];

const COUNTRIES = [
    { code: 'TZ', name: 'Tanzania', weight: 40 },
    { code: 'KE', name: 'Kenya', weight: 20 },
    { code: 'UG', name: 'Uganda', weight: 15 },
    { code: 'US', name: 'United States', weight: 10 },
    { code: 'GB', name: 'United Kingdom', weight: 8 },
    { code: 'CN', name: 'China', weight: 5 },
    { code: 'IN', name: 'India', weight: 4 },
    { code: 'ZA', name: 'South Africa', weight: 5 },
];

function generatePapers(count: number) {
    const categories = ['Agriculture', 'Technology', 'Health', 'Education', 'Environment', 'Economics', 'Engineering', 'Social Sciences'];
    const journals = ['East African Research Journal', 'Tanzania Science Review', 'African Development Studies'];
    const papers = [...SAMPLE_PAPERS];
    for (let i = SAMPLE_PAPERS.length; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        papers.push({
            title: `Research Study ${i + 1}: ${category} Innovations`,
            abstract: `Comprehensive study exploring ${category.toLowerCase()} in East Africa.`,
            authors: [`Researcher ${i}`],
            journalName: journals[Math.floor(Math.random() * journals.length)],
            category,
        });
    }
    return papers;
}

function getRandomCountry() {
    const totalWeight = COUNTRIES.reduce((sum, c) => sum + c.weight, 0);
    let random = Math.random() * totalWeight;
    for (const country of COUNTRIES) {
        random -= country.weight;
        if (random <= 0) return country;
    }
    return COUNTRIES[0];
}

async function seed() {
    console.log('🌱 Starting RAW SQL seed...');

    try {
        // 1. Users
        console.log('👥 Creating users...');
        const users = await sql`
            INSERT INTO users (email, name, role, password)
            VALUES 
            ('admin@udsm.ac.tz', 'UDSM Administrator', 'admin', '$2a$10$placeholder'),
            ('researcher@udsm.ac.tz', 'Dr. Amina Hassan', 'public', '$2a$10$placeholder'),
            ('viewer@udsm.ac.tz', 'Public Viewer', 'public', '$2a$10$placeholder')
            ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
            RETURNING id, role
        `;
        const adminId = users.find(u => u.role === 'admin')?.id || users[0].id;

        // 2. Papers
        console.log('📄 Inserting papers...');
        const paperData = generatePapers(50);
        const insertedPapers = [];

        for (const p of paperData) {
            const [paper] = await sql`
                INSERT INTO papers (title, abstract, authors, keywords, publication_date, journal_name, pdf_url, category, status, uploaded_by)
                VALUES (${p.title}, ${p.abstract}, ${p.authors}, ${['Research', p.category]}, ${subMonths(new Date(), Math.floor(Math.random() * 24))}, ${p.journalName}, 'https://example.com/paper.pdf', ${p.category}, 'published', ${adminId})
                RETURNING id
            `;
            insertedPapers.push(paper);
        }

        // 3. Analytics
        console.log('📊 Generating analytics events (batching)...');
        const now = new Date();
        let eventCount = 0;

        // Batch insert events to be faster
        for (const paper of insertedPapers) {
            const events = [];

            // Views
            const views = Math.floor(Math.random() * 50) + 10;
            for (let i = 0; i < views; i++) {
                const c = getRandomCountry();
                events.push({
                    paper_id: paper.id,
                    event_type: 'view',
                    ip_hash: hashIp(Math.random().toString()),
                    country_code: c.code,
                    country_name: c.name,
                    session_id: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: subDays(now, Math.floor(Math.random() * 60))
                });
            }
            // Downloads
            const downloads = Math.floor(Math.random() * 20);
            for (let i = 0; i < downloads; i++) {
                const c = getRandomCountry();
                events.push({
                    paper_id: paper.id,
                    event_type: 'download',
                    ip_hash: hashIp(Math.random().toString()),
                    country_code: c.code,
                    country_name: c.name,
                    session_id: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: subDays(now, Math.floor(Math.random() * 60))
                });
            }

            if (events.length > 0) {
                await sql`INSERT INTO analytics_events ${sql(events)}`;
                eventCount += events.length;
            }
        }

        console.log(`✅ Inserted ~${eventCount} events`);

        // 4. Geolocation Cache
        console.log('🌍 Populating Geolocation Cache...');
        const geoData = COUNTRIES.map(c => ({
            ip_hash: hashIp(`sample-${c.code}`),
            country_code: c.code,
            country_name: c.name,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }));
        await sql`INSERT INTO geolocation_cache ${sql(geoData)} ON CONFLICT (ip_hash) DO NOTHING`;

        console.log('🎉 Seed Complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ RAW SEED FAILED:', err);
        process.exit(1);
    }
}

seed();

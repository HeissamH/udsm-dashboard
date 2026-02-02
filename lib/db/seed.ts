import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';

console.log('🔗 SEED DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));

// Diagnostic: Test connection immediately
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
sql`SELECT version()`.then((res) => console.log('✅ DIAGNOSTIC CONNECTION SUCCESS:', res)).catch((err) => console.error('❌ DIAGNOSTIC CONNECTION FAIL:', err));

import { db } from './index';
import { papers } from './schema/papers';
import { analyticsEvents } from './schema/analytics';
import { users } from './schema/users';
import { geolocationCache } from './schema/geolocation';
import { citations } from './schema/citations';
import { hashIp } from '../geo/utils';
import { subDays, subMonths } from 'date-fns';

// Sample UDSM research papers
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

// Generate more papers programmatically
function generatePapers(count: number) {
    const categories = ['Agriculture', 'Technology', 'Health', 'Education', 'Environment', 'Economics', 'Engineering', 'Social Sciences'];
    const journals = [
        'East African Research Journal',
        'Tanzania Science Review',
        'African Development Studies',
        'Journal of Tropical Medicine',
        'UDSM Research Quarterly',
    ];

    const papers = [...SAMPLE_PAPERS];

    for (let i = SAMPLE_PAPERS.length; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        papers.push({
            title: `Research Study ${i + 1}: ${category} Innovations in East Africa`,
            abstract: `This comprehensive study explores recent developments in ${category.toLowerCase()} across the East African region, with particular focus on Tanzania and its neighboring countries.`,
            authors: [
                `Dr. ${['Amina', 'John', 'Grace', 'Emmanuel', 'Sarah', 'Peter', 'Fatuma'][Math.floor(Math.random() * 7)]} ${['Hassan', 'Mwakasege', 'Kimaro', 'Mtui', 'Ndege'][Math.floor(Math.random() * 5)]}`,
                `Prof. ${['Ali', 'Rehema', 'Omar', 'Neema'][Math.floor(Math.random() * 4)]} ${['Khamis', 'Kilonzo', 'Said', 'Juma'][Math.floor(Math.random() * 4)]}`,
            ],
            journalName: journals[Math.floor(Math.random() * journals.length)],
            category,
        });
    }

    return papers;
}

// Country data for geographic distribution
const COUNTRIES = [
    { code: 'TZ', name: 'Tanzania', weight: 30 },
    { code: 'KE', name: 'Kenya', weight: 15 },
    { code: 'UG', name: 'Uganda', weight: 10 },
    { code: 'US', name: 'United States', weight: 12 },
    { code: 'GB', name: 'United Kingdom', weight: 8 },
    { code: 'ZA', name: 'South Africa', weight: 7 },
    { code: 'NG', name: 'Nigeria', weight: 6 },
    { code: 'GH', name: 'Ghana', weight: 4 },
    { code: 'DE', name: 'Germany', weight: 3 },
    { code: 'FR', name: 'France', weight: 2 },
    { code: 'CN', name: 'China', weight: 5 },
    { code: 'IN', name: 'India', weight: 4 },
    { code: 'BR', name: 'Brazil', weight: 2 },
    { code: 'AU', name: 'Australia', weight: 2 },
    { code: 'CA', name: 'Canada', weight: 3 },
];

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
    console.log('🌱 Starting database seed...\n');

    try {
        // 1. Create sample users
        console.log('👥 Creating users...');
        const usersList = await db.insert(users).values([
            {
                email: 'admin@udsm.ac.tz',
                name: 'UDSM Administrator',
                role: 'admin',
                password: '$2a$10$placeholder', // Placeholder hash
            },
            {
                email: 'researcher@udsm.ac.tz',
                name: 'Dr. Amina Hassan',
                role: 'researcher',
                password: '$2a$10$placeholder',
            },
            {
                email: 'viewer@udsm.ac.tz',
                name: 'Public Viewer',
                role: 'viewer',
                password: '$2a$10$placeholder',
            },
        ]).returning();
        console.log(`✅ Created ${usersList.length} users\n`);

        // 2. Insert papers
        console.log('📄 Inserting papers...');
        const paperData = generatePapers(50);
        const insertedPapers = [];

        for (const paperInfo of paperData) {
            const [paper] = await db.insert(papers).values({
                title: paperInfo.title,
                abstract: paperInfo.abstract,
                authors: paperInfo.authors,
                keywords: ['Research', paperInfo.category, 'UDSM', 'Tanzania'],
                publicationDate: subMonths(new Date(), Math.floor(Math.random() * 24)),
                journalName: paperInfo.journalName,
                pdfUrl: `https://repository.udsm.ac.tz/papers/${Math.random().toString(36).substring(7)}.pdf`,
                category: paperInfo.category,
                status: 'published',
                uploadedBy: usersList[Math.floor(Math.random() * usersList.length)].id,
            }).returning();

            insertedPapers.push(paper);
        }
        console.log(`✅ Created ${insertedPapers.length} papers\n`);

        // 3. Generate analytics events
        console.log('📊 Generating analytics events...');
        let eventCount = 0;
        const now = new Date();

        for (const paper of insertedPapers) {
            // Generate views (most common)
            const viewCount = Math.floor(Math.random() * 300) + 50;
            for (let i = 0; i < viewCount; i++) {
                const country = getRandomCountry();
                await db.insert(analyticsEvents).values({
                    paperId: paper.id,
                    eventType: 'view',
                    ipHash: hashIp(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`),
                    countryCode: country.code,
                    countryName: country.name,
                    sessionId: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: subDays(now, Math.floor(Math.random() * 90)),
                });
                eventCount++;
            }

            // Generate downloads (less common)
            const downloadCount = Math.floor(Math.random() * 100) + 10;
            for (let i = 0; i < downloadCount; i++) {
                const country = getRandomCountry();
                await db.insert(analyticsEvents).values({
                    paperId: paper.id,
                    eventType: 'download',
                    ipHash: hashIp(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`),
                    countryCode: country.code,
                    countryName: country.name,
                    sessionId: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: subDays(now, Math.floor(Math.random() * 90)),
                });
                eventCount++;
            }

            // Generate citations (least common)
            const citationCount = Math.floor(Math.random() * 20);
            for (let i = 0; i < citationCount; i++) {
                const country = getRandomCountry();
                await db.insert(analyticsEvents).values({
                    paperId: paper.id,
                    eventType: 'citation',
                    ipHash: hashIp(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`),
                    countryCode: country.code,
                    countryName: country.name,
                    sessionId: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: subDays(now, Math.floor(Math.random() * 90)),
                });
                eventCount++;
            }
        }
        console.log(`✅ Created ${eventCount} analytics events\n`);

        // 4. Create geolocation cache entries
        console.log('🌍 Creating geolocation cache...');
        const geoEntries = [];
        for (const country of COUNTRIES) {
            geoEntries.push({
                ipHash: hashIp(`sample-${country.code}`),
                countryCode: country.code,
                countryName: country.name,
                city: `${country.name} City`,
                latitude: (Math.random() * 180 - 90).toString(),
                longitude: (Math.random() * 360 - 180).toString(),
            });
        }
        await db.insert(geolocationCache).values(geoEntries);
        console.log(`✅ Created ${geoEntries.length} geolocation cache entries\n`);

        // 5. Create sample citations
        console.log('📚 Creating citations...');
        let citationRecordCount = 0;
        for (let i = 0; i < 30; i++) {
            const randomPaper = insertedPapers[Math.floor(Math.random() * insertedPapers.length)];
            await db.insert(citations).values({
                paperId: randomPaper.id,
                citingWork: `Research Paper ${i + 1}`,
                citingAuthors: ['Dr. External Researcher', 'Prof. Another Scholar'],
                citationDate: subMonths(now, Math.floor(Math.random() * 12)),
                source: ['Google Scholar', 'ResearchGate', 'PubMed'][Math.floor(Math.random() * 3)],
            });
            citationRecordCount++;
        }
        console.log(`✅ Created ${citationRecordCount} citation records\n`);

        console.log('🎉 Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${usersList.length} users`);
        console.log(`   - ${insertedPapers.length} papers`);
        console.log(`   - ${eventCount} analytics events`);
        console.log(`   - ${geoEntries.length} geolocation entries`);
        console.log(`   - ${citationRecordCount} citations`);
        console.log('\n✨ Your dashboard is ready to use!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();

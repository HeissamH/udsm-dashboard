import { db } from './index';
import { papers } from './schema/papers';
import { analyticsEvents } from './schema/analytics';
import { users } from './schema/users';
import { MOCK_PAPERS } from './mock-data';
import { hashIp } from '../geo/utils';

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // 1. Create a default admin user
        console.log('Creating admin user...');
        const [admin] = await db.insert(users).values({
            email: 'admin@udsm.ac.tz',
            name: 'UDSM Admin',
            role: 'admin',
            password: 'hashed_password_placeholder', // In a real app, hash this
        }).returning();

        // 2. Insert papers
        console.log('Inserting papers...');
        const paperIds = [];

        for (const mockPaper of MOCK_PAPERS) {
            const [paper] = await db.insert(papers).values({
                title: mockPaper.title,
                abstract: mockPaper.abstract,
                authors: mockPaper.authors,
                keywords: ['Research', mockPaper.category],
                publicationDate: mockPaper.publicationDate,
                journalName: mockPaper.journalName,
                pdfUrl: 'https://example.com/paper.pdf', // Placeholder
                category: mockPaper.category,
                status: 'published',
                uploadedBy: admin.id,
            }).returning();

            paperIds.push({ id: paper.id, mockStats: mockPaper.stats });
        }

        // 3. Generate fake analytics events
        console.log('Generating analytics events...');
        const now = new Date();

        for (const { id, mockStats } of paperIds) {
            // Generate views
            for (let i = 0; i < 20; i++) { // Generate a subset of views to keep it fast
                await db.insert(analyticsEvents).values({
                    paperId: id,
                    eventType: 'view',
                    ipHash: hashIp(`192.168.1.${Math.floor(Math.random() * 255)}`),
                    countryCode: ['TZ', 'KE', 'UG', 'US', 'GB'][Math.floor(Math.random() * 5)],
                    countryName: 'Deduce from code',
                    sessionId: `sess_${Math.random().toString(36).substring(7)}`,
                    timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
                });
            }
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();

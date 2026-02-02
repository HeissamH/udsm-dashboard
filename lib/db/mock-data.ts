import { users } from '../db/schema/users';
import { papers } from '../db/schema/papers';
import { analyticsEvents } from '../db/schema/analytics';

// Mock data for demo purposes since we can't push to DB without env vars
export const MOCK_PAPERS = [
    {
        id: '1',
        title: 'Impact of AI in East African Healthcare Systems',
        abstract: 'This study analyzes the deployment of artificial intelligence diagnostic tools in rural Tanzanian clinics, showing a 40% improvement in early disease detection rates.',
        authors: ['J. K. Nyerere', 'A. M. Turing'],
        publicationDate: '2025-10-15',
        journalName: 'East African Medical Journal',
        category: 'Healthcare',
        stats: {
            views: 1250,
            downloads: 450,
            citations: 12
        }
    },
    {
        id: '2',
        title: 'Sustainable Fisheries Management in Lake Victoria',
        abstract: 'A comprehensive review of community-based fisheries management practices in the Lake Victoria basin, proposing new policy frameworks for sustainability.',
        authors: ['P. L. Lumumba', 'E. Ostrom'],
        publicationDate: '2025-09-22',
        journalName: 'Journal of Environmental Economics',
        category: 'Environment',
        stats: {
            views: 980,
            downloads: 320,
            citations: 8
        }
    },
    {
        id: '3',
        title: 'Mobile Money and Financial Inclusion: A Decade Review',
        abstract: 'Analyzing ten years of M-Pesa data to understand its impact on small business growth and household financial stability in urban centers.',
        authors: ['N. Ndung\'u', 'M. Yunus'],
        publicationDate: '2025-11-05',
        journalName: 'African Journal of Finance',
        category: 'Economics',
        stats: {
            views: 2100,
            downloads: 890,
            citations: 25
        }
    },
    {
        id: '4',
        title: 'Climate Change Adaptation Strategies for Coffee Farmers',
        abstract: 'Investigating resilient coffee varietals and farming techniques adopted by smallholder farmers in the Kilimanjaro region.',
        authors: ['W. Maathai', 'N. Borlaug'],
        publicationDate: '2025-08-30',
        journalName: 'Agricultural Science Review',
        category: 'Agriculture',
        stats: {
            views: 750,
            downloads: 150,
            citations: 5
        }
    },
    {
        id: '5',
        title: 'Machine Learning for Swahili Natural Language Processing',
        abstract: 'Introducing a new corpus and transformer model optimized for Swahili and other Bantu languages, benchmarking state-of-the-art performance.',
        authors: ['A. Ng', 'G. Hinton'],
        publicationDate: '2025-12-01',
        journalName: 'Computational Linguistics',
        category: 'Technology',
        stats: {
            views: 3500,
            downloads: 1200,
            citations: 45
        }
    },
    {
        id: '6',
        title: 'Renewable Energy Microgrids in Off-Grid Communities',
        abstract: 'Case studies of solar-hybrid microgrid implementations in rural Tanzania, analyzing technical viability and economic sustainability.',
        authors: ['E. Musk', 'N. Tesla'],
        publicationDate: '2025-07-12',
        journalName: 'Journal of Energy Policy',
        category: 'Engineering',
        stats: {
            views: 1100,
            downloads: 400,
            citations: 15
        }
    }
];

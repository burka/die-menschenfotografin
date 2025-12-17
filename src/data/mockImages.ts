import type { GalleryImage } from '@/types/gallery'

/**
 * Mock images for development and testing
 * TODO: Replace with CMS data integration
 */
export const MOCK_IMAGES: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=1600&fit=crop',
    alt: 'Wedding ceremony',
    caption: 'A beautiful wedding ceremony',
    date: '2024-06-15',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    alt: 'Wedding couple',
    caption: 'The happy couple',
    date: '2024-06-15',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=1200&fit=crop',
    alt: 'Event photography',
    caption: 'Corporate event',
    date: '2024-07-20',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=1200&fit=crop',
    alt: 'Family portrait',
    caption: 'Family memories',
    date: '2024-08-05',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=1600&fit=crop',
    alt: 'Children playing',
    caption: 'Kindergarten fun',
    date: '2024-09-10',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1200&h=800&fit=crop',
    alt: 'Family outdoor',
    caption: 'Family day out',
    date: '2024-09-25',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=1200&fit=crop',
    alt: 'Kindergarten activities',
    caption: 'Learning through play',
    date: '2024-10-15',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=1200&fit=crop',
    alt: 'Business meeting',
    caption: 'Corporate event',
    date: '2024-11-01',
  },
]

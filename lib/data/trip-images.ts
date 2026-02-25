export interface TripImage {
  id: string;
  tripId: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  type: 'before' | 'after' | 'during' | 'documentation';
}

export const tripImages: TripImage[] = [
  {
    id: 'ti1',
    tripId: 't1',
    url: '/images/trip-before-1.jpg',
    caption: 'Vehicle condition at start of trip',
    uploadedAt: '2026-02-19 08:00',
    type: 'before',
  },
  {
    id: 'ti2',
    tripId: 't1',
    url: '/images/trip-after-1.jpg',
    caption: 'Vehicle condition at end of trip',
    uploadedAt: '2026-02-19 12:30',
    type: 'after',
  },
  {
    id: 'ti3',
    tripId: 't2',
    url: '/images/trip-before-2.jpg',
    caption: 'Pre-trip inspection photo',
    uploadedAt: '2026-02-19 06:15',
    type: 'before',
  },
  {
    id: 'ti4',
    tripId: 't2',
    url: '/images/trip-documentation-1.jpg',
    caption: 'Passenger manifest documentation',
    uploadedAt: '2026-02-19 07:45',
    type: 'documentation',
  },
  {
    id: 'ti5',
    tripId: 't3',
    url: '/images/trip-before-3.jpg',
    caption: 'Initial vehicle state',
    uploadedAt: '2026-02-19 09:30',
    type: 'before',
  },
  {
    id: 'ti6',
    tripId: 't5',
    url: '/images/trip-during-1.jpg',
    caption: 'En route photo',
    uploadedAt: '2026-02-19 14:20',
    type: 'during',
  },
  {
    id: 'ti7',
    tripId: 't5',
    url: '/images/trip-after-2.jpg',
    caption: 'Final vehicle condition',
    uploadedAt: '2026-02-19 16:50',
    type: 'after',
  },
];

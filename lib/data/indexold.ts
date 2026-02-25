export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'on-trip' | 'off-duty';
  vehicle?: string;
  totalTrips: number;
  totalKm: number;
  rating: number;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  driver?: string;
  capacity: number;
  kmUsage: number;
  status: 'available' | 'in-use' | 'maintenance';
  lastMaintenance: string;
}

export interface Trip {
  id: string;
  date: string;
  time: string;
  agency: string;
  hotel: string;
  destination: string;
  driver: string;
  vehicle: string;
  pax: number;
  kmStart: number;
  kmEnd: number;
  status: 'scheduled' | 'assigned' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Agency {
  id: string;
  name: string;
  contact: string;
  phone: string;
  totalTrips: number;
  totalPax: number;
  revenue: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  phone: string;
  totalTrips: number;
  totalPax: number;
}

export const drivers: Driver[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    phone: '+212 6 12 34 56 78',
    email: 'ahmed@transithub.com',
    status: 'available',
    vehicle: 'HY-2025-A',
    totalTrips: 156,
    totalKm: 4200,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    phone: '+212 6 98 76 54 32',
    email: 'fatima@transithub.com',
    status: 'on-trip',
    vehicle: 'MB-2024-B',
    totalTrips: 142,
    totalKm: 3850,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    phone: '+212 6 11 22 33 44',
    email: 'mohammed@transithub.com',
    status: 'off-duty',
    totalTrips: 168,
    totalKm: 4500,
    rating: 4.7,
  },
];

export const vehicles: Vehicle[] = [
  {
    id: '1',
    model: 'Hyundai Starex',
    plate: 'HY-2025-A',
    driver: 'Ahmed Hassan',
    capacity: 8,
    kmUsage: 4200,
    status: 'available',
    lastMaintenance: '2026-01-15',
  },
  {
    id: '2',
    model: 'Mercedes V-Class',
    plate: 'MB-2024-B',
    driver: 'Fatima Zahra',
    capacity: 7,
    kmUsage: 3850,
    status: 'in-use',
    lastMaintenance: '2026-02-01',
  },
  {
    id: '3',
    model: 'Hyundai Starex',
    plate: 'HY-2023-C',
    capacity: 8,
    kmUsage: 5100,
    status: 'maintenance',
    lastMaintenance: '2026-02-10',
  },
];

export const trips: Trip[] = [
  {
    id: '1',
    date: '2026-02-19',
    time: '08:00',
    agency: 'Maroc Tours',
    hotel: 'Riad Marrakech',
    destination: 'Atlas Mountains',
    driver: 'Ahmed Hassan',
    vehicle: 'HY-2025-A',
    pax: 6,
    kmStart: 4200,
    kmEnd: 4250,
    status: 'in-progress',
  },
  {
    id: '2',
    date: '2026-02-19',
    time: '10:30',
    agency: 'Desert Dreams',
    hotel: 'Hotel Atlas',
    destination: 'Sahara Desert Tour',
    driver: 'Fatima Zahra',
    vehicle: 'MB-2024-B',
    pax: 5,
    kmStart: 3850,
    kmEnd: 3920,
    status: 'completed',
  },
  {
    id: '3',
    date: '2026-02-20',
    time: '14:00',
    agency: 'City Guides',
    hotel: 'Grand Hotel',
    destination: 'Medina Walking Tour',
    driver: 'Mohammed Ali',
    vehicle: 'HY-2023-C',
    pax: 8,
    kmStart: 5100,
    kmEnd: 5120,
    status: 'scheduled',
  },
];

export const agencies: Agency[] = [
  {
    id: '1',
    name: 'Maroc Tours',
    contact: 'Hassan El Alaoui',
    phone: '+212 5 24 12 34 56',
    totalTrips: 234,
    totalPax: 1560,
    revenue: 18500,
  },
  {
    id: '2',
    name: 'Desert Dreams',
    contact: 'Karim Benabdessalem',
    phone: '+212 5 24 98 76 54',
    totalTrips: 156,
    totalPax: 980,
    revenue: 12400,
  },
  {
    id: '3',
    name: 'City Guides',
    contact: 'Zainab Khilani',
    phone: '+212 5 24 55 66 77',
    totalTrips: 189,
    totalPax: 1134,
    revenue: 14200,
  },
];

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Riad Marrakech',
    address: 'Medina, Marrakech',
    phone: '+212 5 24 11 22 33',
    totalTrips: 145,
    totalPax: 920,
  },
  {
    id: '2',
    name: 'Hotel Atlas',
    address: 'Gueliz, Marrakech',
    phone: '+212 5 24 44 55 66',
    totalTrips: 120,
    totalPax: 750,
  },
  {
    id: '3',
    name: 'Grand Hotel',
    address: 'Downtown, Marrakech',
    phone: '+212 5 24 77 88 99',
    totalTrips: 98,
    totalPax: 620,
  },
];

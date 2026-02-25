export type MaintenanceType = 'oil-change' | 'inspection' | 'repair' | 'service' | 'tire-replacement' | 'brake-service';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: MaintenanceType;
  cost: number;
  description: string;
  notes?: string;
  nextDueDate?: string;
}

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M1',
    vehicleId: '1',
    date: '2026-02-15',
    type: 'oil-change',
    cost: 250,
    description: 'Oil and filter change',
    notes: 'Used synthetic oil',
    nextDueDate: '2026-05-15',
  },
  {
    id: 'M2',
    vehicleId: '1',
    date: '2026-01-20',
    type: 'inspection',
    cost: 150,
    description: 'Regular safety inspection',
    notes: 'All checks passed',
  },
  {
    id: 'M3',
    vehicleId: '1',
    date: '2025-12-10',
    type: 'tire-replacement',
    cost: 1200,
    description: 'All 4 tires replaced',
    notes: 'Installed Michelin Agilis tires',
  },
  {
    id: 'M4',
    vehicleId: '2',
    date: '2026-02-10',
    type: 'service',
    cost: 450,
    description: 'General vehicle service',
    notes: 'Filter replacements and fluid checks',
    nextDueDate: '2026-05-10',
  },
  {
    id: 'M5',
    vehicleId: '2',
    date: '2026-01-15',
    type: 'brake-service',
    cost: 800,
    description: 'Brake pads and rotor replacement',
    notes: 'Front and rear brakes serviced',
  },
  {
    id: 'M6',
    vehicleId: '2',
    date: '2025-11-20',
    type: 'repair',
    cost: 550,
    description: 'AC system repair',
    notes: 'Refrigerant refill and compressor check',
  },
  {
    id: 'M7',
    vehicleId: '3',
    date: '2026-02-01',
    type: 'inspection',
    cost: 150,
    description: 'Pre-trip safety check',
    notes: 'All systems functional',
  },
  {
    id: 'M8',
    vehicleId: '3',
    date: '2025-12-20',
    type: 'oil-change',
    cost: 250,
    description: 'Oil and filter change',
    notes: 'Standard maintenance',
    nextDueDate: '2026-03-20',
  },
  {
    id: 'M9',
    vehicleId: '4',
    date: '2026-02-05',
    type: 'service',
    cost: 400,
    description: 'Routine maintenance service',
    notes: 'Filter changes and fluid top-ups',
    nextDueDate: '2026-05-05',
  },
  {
    id: 'M10',
    vehicleId: '4',
    date: '2025-10-15',
    type: 'repair',
    cost: 600,
    description: 'Transmission fluid service',
    notes: 'Fluid drained and replaced',
  },
  {
    id: 'M11',
    vehicleId: '5',
    date: '2026-02-08',
    type: 'inspection',
    cost: 150,
    description: 'Regular inspection',
    notes: 'Passed all safety checks',
  },
  {
    id: 'M12',
    vehicleId: '5',
    date: '2025-12-01',
    type: 'tire-replacement',
    cost: 1000,
    description: 'Front tire replacement',
    notes: 'Bridgestone tires installed',
  },
];

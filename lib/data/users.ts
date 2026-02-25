export type UserRole = 'driver' | 'manager' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for demo - never in production
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  assignedVehicle?: string; // For drivers
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin: string;
}

// Sample users for authentication demo
export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'admin@transithub.com',
    password: 'password123',
    phone: '+1-555-0101',
    role: 'admin',
    status: 'active',
    department: 'Operations',
    createdAt: '2025-01-15',
    lastLogin: '2026-02-21',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'superadmin@transithub.com',
    password: 'password123',
    phone: '+1-555-0102',
    role: 'super_admin',
    status: 'active',
    department: 'Management',
    createdAt: '2024-01-01',
    lastLogin: '2026-02-21',
  },
  {
    id: '3',
    name: 'David Wilson',
    email: 'manager@transithub.com',
    password: 'password123',
    phone: '+1-555-0103',
    role: 'manager',
    status: 'active',
    department: 'Operations',
    createdAt: '2025-03-10',
    lastLogin: '2026-02-20',
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'driver1@transithub.com',
    password: 'password123',
    phone: '+212 6 12 34 56 78',
    role: 'driver',
    status: 'active',
    assignedVehicle: 'HY-2025-A',
    createdAt: '2024-06-01',
    lastLogin: '2026-02-19',
  },
  {
    id: '5',
    name: 'Fatima Zahra',
    email: 'driver2@transithub.com',
    password: 'password123',
    phone: '+212 6 98 76 54 32',
    role: 'driver',
    status: 'active',
    assignedVehicle: 'MB-2024-B',
    createdAt: '2024-07-12',
    lastLogin: '2026-02-19',
  },
  {
    id: '6',
    name: 'Mohammed Ali',
    email: 'driver3@transithub.com',
    password: 'password123',
    phone: '+212 6 11 22 33 44',
    role: 'driver',
    status: 'active',
    createdAt: '2024-08-20',
    lastLogin: '2026-02-18',
  },
  {
    id: '7',
    name: 'Karim Benali',
    email: 'driver4@transithub.com',
    password: 'password123',
    phone: '+212 6 55 66 77 88',
    role: 'driver',
    status: 'active',
    assignedVehicle: 'TY-2024-C',
    createdAt: '2024-09-01',
    lastLogin: '2026-02-17',
  },
  {
    id: '8',
    name: 'Leila Moroccan',
    email: 'manager2@transithub.com',
    password: 'password123',
    phone: '+212 6 22 33 44 55',
    role: 'manager',
    status: 'active',
    department: 'Fleet Management',
    createdAt: '2025-02-01',
    lastLogin: '2026-02-21',
  },
  {
    id: '9',
    name: 'Hassan Boudiab',
    email: 'admin2@transithub.com',
    password: 'password123',
    phone: '+212 6 77 88 99 00',
    role: 'admin',
    status: 'active',
    department: 'Administration',
    createdAt: '2025-01-20',
    lastLogin: '2026-02-19',
  },
  {
    id: '10',
    name: 'Youssef Alaoui',
    email: 'driver5@transithub.com',
    password: 'password123',
    phone: '+212 6 33 44 55 66',
    role: 'driver',
    status: 'inactive',
    createdAt: '2024-10-15',
    lastLogin: '2026-01-20',
  },
];

// Demo credentials for testing
export const demoAccounts = {
  superAdmin: { email: 'superadmin@transithub.com', password: 'password123' },
  admin: { email: 'admin@transithub.com', password: 'password123' },
  manager: { email: 'manager@transithub.com', password: 'password123' },
  driver: { email: 'driver1@transithub.com', password: 'password123' },
};

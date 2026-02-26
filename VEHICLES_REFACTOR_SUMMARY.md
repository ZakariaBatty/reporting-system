# Vehicles Page Refactor - Complete Implementation

## Overview
The Vehicles page has been fully refactored to use real backend Prisma database integration with complete role-based access control, matching the exact Trips page architecture.

## Architecture (4-Layer)

### 1. Repository Layer (`lib/vehicles/repositories/vehicle.repository.ts`)
- **Prisma Field Mapping**: Uses ONLY actual Vehicle schema fields:
  - `id`, `model`, `plate`, `vin`, `registrationExpiry`
  - `capacity`, `kmUsage`, `monthlyRent`, `salik`, `owner`
  - `status` (AVAILABLE, IN_USE, MAINTENANCE)
  - `lastMaintenance`, `nextMaintenanceDate`
  - `createdAt`, `updatedAt`, `deletedAt`
- **Role-Aware Queries**:
  - Drivers see only assigned vehicles (via VehicleAssignment.isActive = true)
  - Managers/Admins see all active vehicles
- **Key Methods**:
  - `findVehiclesForUser()` - Role-filtered vehicle list
  - `createVehicle()`, `updateVehicle()`, `deleteVehicle()` - CRUD operations
  - `assignDriverToVehicle()`, `unassignDriver()` - Driver assignment
  - `getVehicleStats()` - Dashboard statistics
  - `getCurrentDriver()` - Get assigned driver for a vehicle

### 2. Service Layer (`lib/vehicles/services/vehicle.service.ts`)
- **Authorization Checks**:
  - Managers/Admins: Full CRUD access
  - Drivers: Read-only access to assigned vehicles
- **Data Validation**:
  - Validates all required Prisma fields (model, plate, vin, registrationExpiry, capacity, monthlyRent)
  - Ensures plate and VIN uniqueness
  - Validates registration expiry dates
- **Business Logic**:
  - `getVehicles()` - Fetch role-filtered vehicles
  - `createVehicle()` - Create with validation
  - `updateVehicle()` - Update with validation
  - `deleteVehicle()` - Soft delete (sets deletedAt)

### 3. Server Actions (`app/vehicles/actions.ts`)
- **NextAuth Protected**: All actions require valid session
- **Role-Based Authorization**: Server-side permission checks
- **Actions**:
  - `getVehiclesAction()` - Fetch vehicles for logged-in user
  - `getVehicleStatsAction()` - Get dashboard statistics
  - `createVehicleAction()` - Create new vehicle (Manager+ only)
  - `updateVehicleAction()` - Update vehicle (Manager+ only)
  - `deleteVehicleAction()` - Delete vehicle (Manager+ only)
  - `assignDriverAction()` - Assign driver (Manager+ only)
  - `unassignDriverAction()` - Remove driver (Manager+ only)
  - `getAvailableDriversAction()` - List drivers for assignment

### 4. UI Components

#### VehiclesContainer (`components/vehicles/VehiclesContainer.tsx`)
- Main component managing state and orchestration
- Loads vehicles and stats on mount
- Handles create/edit form state
- Refreshes data after CRUD operations

#### VehiclesList (`components/vehicles/VehiclesList.tsx`)
- Displays vehicle table with all Prisma fields
- Columns: Plate, Model, VIN, Capacity, KM Usage, Monthly Rent, Salik, Owner, Registration Expiry, Status
- Role-based action buttons (Edit/Delete for Managers+)
- Handles vehicle deletion with confirmation

#### VehiclesFormDrawer (`components/vehicles/VehiclesFormDrawer.tsx`)
- Sidebar form for create/update operations
- Form fields match Prisma schema exactly:
  - Model, Plate, VIN, Registration Expiry (required)
  - Capacity, Monthly Rent (required)
  - Salik, Owner, KM Usage (optional)
  - Status dropdown (for edits)
  - Driver assignment dropdown (Managers+ only)
- Unassigns previous driver before assigning new one
- Form validation and error handling

#### VehiclesHeader (`components/vehicles/VehiclesHeader.tsx`)
- Dashboard with 4 stats cards:
  - Total Vehicles
  - Available (status = AVAILABLE)
  - In Use (status = IN_USE)
  - Maintenance (status = MAINTENANCE)
- "New Vehicle" button (Managers+ only)

## Role-Based Access Control

### Super Admin / Admin / Manager
- ✅ View all vehicles
- ✅ Create new vehicles
- ✅ Edit vehicle details
- ✅ Delete vehicles
- ✅ Assign/unassign drivers
- ✅ Update vehicle status
- ✅ Access all form fields

### Driver
- ✅ View only assigned vehicles
- ❌ Cannot create vehicles
- ❌ Cannot edit vehicles
- ❌ Cannot delete vehicles
- ❌ Cannot assign drivers
- ❌ Cannot access form controls

## Data Flow

```
User Action → Server Action → Service Layer (Auth Check)
  ↓
Repository (Prisma Query) → Database Update
  ↓
UI Refreshes with New Data (Immediate)
```

## Uppercase Status Consistency

The Prisma schema uses uppercase statuses:
- `AVAILABLE` - Vehicle is available for assignment
- `IN_USE` - Vehicle is currently in use
- `MAINTENANCE` - Vehicle is undergoing maintenance

The VehicleStatusBadge component handles both uppercase and lowercase formats for compatibility.

## Key Improvements Over Previous Implementation

1. **Real Database**: All data persists in PostgreSQL via Prisma
2. **Role-Based Filtering**: Drivers see only their assigned vehicles
3. **Schema Alignment**: Uses ONLY fields that exist in Prisma schema
4. **Immediate Updates**: CRUD operations refresh UI instantly
5. **Server-Side Security**: Authorization enforced on backend
6. **Type Safety**: Full TypeScript type checking throughout
7. **Functional Architecture**: No classes, pure functions throughout
8. **SOLID Principles**: Single responsibility per layer/component

## Database Relations

- **Vehicle** ↔ **VehicleAssignment** (one-to-many)
- **VehicleAssignment** ↔ **Driver** (many-to-one)
- **Driver** ↔ **User** (one-to-one)
- **Vehicle** → **Trip** (one-to-many)
- **Vehicle** → **MaintenanceRecord** (one-to-many)

## Status Enum Values (from Prisma)

```
enum VehicleStatus {
  AVAILABLE
  IN_USE
  MAINTENANCE
}
```

All status operations use these exact values from the Prisma enum.

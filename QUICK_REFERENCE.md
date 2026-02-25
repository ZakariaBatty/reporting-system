# TransitHub - Quick Reference Card

## 🎨 Design System at a Glance

### Colors
- **Primary**: Blue (#3b82f6) - Actions, links
- **Success**: Green (#10b981) - Available, completed
- **Warning**: Orange (#f59e0b) - Alerts
- **Error**: Red (#ef4444) - Destructive
- **Neutral**: White bg with gray-100 borders

### Sizes
- **Sidebar**: 224px (w-56)
- **Icon**: 20px (w-5 h-5)
- **Icon Badge**: 40px × 40px
- **Card Padding**: 24px (p-6)
- **Button**: 8px-16px padding

### Fonts
- **Title**: 30px, bold
- **Section**: 18px, semibold
- **Body**: 14px, regular
- **Labels**: 12px, uppercase

---

## 📋 Pages Overview

| Page | Purpose | Status | Export |
|------|---------|--------|--------|
| Dashboard | KPI overview | ✅ Complete | ✅ Yes |
| Trips | Manage trips | ✅ CRUD | ✅ Yes |
| Drivers | Manage drivers | ✅ CRUD | ✅ Yes |
| Vehicles | Fleet management | ✅ CRUD | ✅ Yes |
| Locations | Agencies/Hotels | ✅ CRUD | ✅ Yes |
| Reports | Analytics | ✅ Charts | ✅ Yes |
| Calendar | Trip calendar | ✅ View | ❌ No |

---

## 🔧 Common Tasks

### Add Export to a Page
```typescript
import { exportToExcel } from '@/lib/utils/excel-export';

const handleExport = () => {
  exportToExcel(filteredData, 'filename');
};

<button onClick={handleExport} className="export-btn">
  <Download className="w-4 h-4" />
  Export ({filteredData.length})
</button>
```

### Add a Filter
```typescript
const [filters, setFilters] = useState({ search: '' });
const filtered = items.filter(item => 
  item.name.includes(filters.search)
);

<input
  value={filters.search}
  onChange={(e) => setFilters({...filters, search: e.target.value})}
  className="px-3 py-2 border border-gray-200 rounded-lg"
/>
```

### Add a Status Badge
```typescript
const getStatusColor = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

<span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
  {status}
</span>
```

### Add a Button
```typescript
// Primary button
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Action
</button>

// Secondary button
<button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
  Cancel
</button>

// Export button
<button className="export-btn">
  <Download className="w-4 h-4" />
  Export
</button>

// Action button
<button className="action-btn">
  <Edit2 className="w-4 h-4" />
  Edit
</button>
```

---

## 📊 Data Models

### Trip
```typescript
{
  id: string;
  date: string;           // "2026-02-19"
  time: string;          // "08:30"
  agency: string;        // Agency name
  hotel: string;         // Hotel name
  destination: string;   // Destination
  driver: string;        // Driver name
  vehicle: string;       // Vehicle plate
  pax: number;           // Passengers
  kmStart: number;       // Starting KM
  kmEnd: number;         // Ending KM
  status: 'scheduled' | 'assigned' | 'in-progress' | 'completed';
}
```

### Driver
```typescript
{
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  joinDate: string;
  vehicle: string;       // Assigned vehicle plate
  trips: number;         // Total trips
  km: number;            // Total KM
  status: 'available' | 'on-trip' | 'off-duty';
  rating: number;        // 1-5 stars
}
```

### Vehicle
```typescript
{
  id: string;
  plate: string;         // License plate
  model: string;         // Car model
  type: string;          // Sedan, Van, etc.
  color: string;         // Car color
  driver: string;        // Assigned driver
  km: number;            // Current KM
  lastService: string;   // Last service date
  status: 'available' | 'in-use' | 'maintenance';
}
```

---

## 🎯 Missing Features Priority

### 🔴 CRITICAL (Phase 1)
1. **Customer Management** - Who are your customers?
2. **Booking System** - How do they book?
3. **Invoicing** - Where's the money?
4. **Notifications** - Real-time alerts
5. **Driver Compliance** - Legal safety

### 🟡 HIGH (Phase 2)
6. Route Optimization
7. Fleet Maintenance
8. GPS Tracking
9. Advanced Analytics
10. Communication Platform

### 🟢 NICE (Phase 3)
- Mobile app
- AI forecasting
- Compliance docs
- Full documentation

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/lib/data/index.ts` | All fake data |
| `/lib/utils/excel-export.ts` | Export functionality |
| `/components/AppSidebar.tsx` | Navigation |
| `/components/Drawer.tsx` | Modal/Drawer |
| `/hooks/useCrudState.ts` | State management |
| `/app/globals.css` | Design system |

---

## 🚀 Common Imports

```typescript
// Icons
import { Plus, Edit2, Trash2, Download, Eye } from 'lucide-react';

// Utilities
import { exportToExcel } from '@/lib/utils/excel-export';

// Components
import { Drawer } from '@/components/Drawer';
import { FormField } from '@/components/FormField';

// Hooks
import { useCrudState } from '@/hooks/useCrudState';

// Data
import { trips, drivers, vehicles } from '@/lib/data';
```

---

## 💻 CSS Classes Cheat Sheet

```css
/* Layout */
.flex .items-center .justify-between .gap-3
.space-y-6                    /* Vertical spacing */
.grid .grid-cols-1 .md:grid-cols-2 .lg:grid-cols-3

/* Typography */
.text-3xl .font-bold          /* Big title */
.text-lg .font-semibold       /* Section title */
.text-sm .font-medium         /* Body text */
.text-xs .uppercase           /* Label */

/* Colors */
.text-gray-900                /* Dark text */
.text-blue-600                /* Blue text */
.bg-blue-100 .text-blue-800   /* Colored badge */
.border-gray-100              /* Light border */

/* Components */
.stat-card                    /* Stat card */
.export-btn                   /* Export button */
.action-btn                   /* Action button */
.icon-bg                      /* Icon badge */
.data-table                   /* Table */

/* States */
.hover:bg-gray-50             /* Hover */
.focus:ring-2                 /* Focus */
.transition-colors            /* Animation */
.rounded-lg                   /* Rounded 8px */
```

---

## ⚡ Quick Copy-Paste Templates

### New Page Template
```typescript
'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { useCrudState } from '@/hooks/useCrudState';
import { Drawer } from '@/components/Drawer';
import { exportToExcel } from '@/lib/utils/excel-export';

export default function NewPage() {
  const [state, actions] = useCrudState(initialData);
  const [formData, setFormData] = useState(null);

  const handleExport = () => {
    exportToExcel(state.items, 'filename');
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
        <button onClick={handleExport} className="export-btn">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table or List */}
      <div className="bg-white rounded-lg border border-gray-100">
        {/* Your content */}
      </div>

      {/* Drawer for Create/Edit */}
      <Drawer isOpen={state.mode !== 'view'} title="Form Title">
        {/* Your form */}
      </Drawer>
    </div>
  );
}
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column)
- **Tablet**: 640-1024px (2 columns)
- **Desktop**: > 1024px (3+ columns)

```css
/* Responsive grid */
.grid-cols-1
.md:grid-cols-2
.lg:grid-cols-3

/* Hide on mobile, show on desktop */
.hidden .md:block

/* Show on mobile, hide on desktop */
.md:hidden
```

---

## 🔍 Status Colors Reference

```typescript
const statusColors = {
  'completed': 'bg-green-100 text-green-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  'assigned': 'bg-blue-100 text-blue-800',
  'scheduled': 'bg-yellow-100 text-yellow-800',
  'available': 'bg-green-100 text-green-800',
  'on-trip': 'bg-purple-100 text-purple-800',
  'off-duty': 'bg-gray-100 text-gray-800',
};
```

---

## ✅ Before You Add a New Feature

- [ ] Read QUICK_START_NEW_FEATURES.md
- [ ] Check DESIGN_SYSTEM.md for colors/sizes
- [ ] Use existing components (Drawer, FormField)
- [ ] Follow the same CRUD patterns
- [ ] Add export button if it's a list
- [ ] Test on mobile
- [ ] Add to sidebar navigation

---

## 📞 Where to Find Things

| What | Where |
|------|-------|
| Design specs | DESIGN_SYSTEM.md |
| How to build features | QUICK_START_NEW_FEATURES.md |
| Missing features | DOMAIN_ANALYSIS.md |
| Fake data | `/lib/data/index.ts` |
| Components | `/components/` |
| Pages | `/app/` |
| Utilities | `/lib/utils/` |

---

## 🎯 Your Mission

**Phase 1:** Add Customer Management
1. Create `/app/customers/page.tsx`
2. Use template from QUICK_START_NEW_FEATURES.md
3. Add to sidebar navigation
4. Test export button
5. Add to Trips (assign customers)

**Phase 2:** Add Booking System
1. Create `/app/bookings/page.tsx`
2. Add form for new bookings
3. Add price calculator
4. Add confirmation

**Phase 3:** Add Invoicing
1. Create `/app/invoices/page.tsx`
2. Auto-generate after trips
3. Track payments
4. Export as PDF

---

**Good luck! You've got this! 🚀**


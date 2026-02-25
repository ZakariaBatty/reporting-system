# Quick Start: Adding New Features

This guide shows you exactly how to add new features following the same patterns used in this dashboard.

---

## Template: Adding a New Management Page

### Step 1: Create the Data File

File: `/lib/data/customers.ts`

```typescript
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export const customers: Customer[] = [
  {
    id: 'cust_001',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+212612345678',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust_002',
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+212687654321',
    createdAt: '2026-01-20'
  },
];
```

### Step 2: Create the Page Component

File: `/app/customers/page.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { useCrudState } from '@/hooks/useCrudState';
import { Drawer } from '@/components/Drawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { Customer, customers as initialCustomers } from '@/lib/data/customers';
import { exportToExcel } from '@/lib/utils/excel-export';

export default function CustomersPage() {
  const [state, actions] = useCrudState<Customer>(initialCustomers);
  const [filters, setFilters] = useState({
    search: '',
  });

  // Filter logic
  const filteredCustomers = state.items.filter((customer) => {
    const matchesSearch = !filters.search || 
      customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  // Export handler
  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      alert('No customers to export');
      return;
    }
    exportToExcel(filteredCustomers, 'customers');
  };

  // CRUD handlers
  const [formData, setFormData] = useState<Customer | null>(null);

  const handleCreate = () => {
    setFormData(null);
    actions.openCreateDrawer();
  };

  const handleEdit = (customer: Customer) => {
    setFormData({ ...customer });
    actions.openEditDrawer(customer);
  };

  const handleSave = () => {
    if (!formData) return;

    if (state.mode === 'create') {
      const newCustomer: Customer = {
        ...formData,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split('T')[0],
      };
      actions.createItem(newCustomer);
    } else {
      actions.updateItem(formData);
    }

    setFormData(null);
    actions.closeDrawer();
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Delete ${customer.name}?`)) {
      actions.deleteItem(customer);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Showing {filteredCustomers.length} of {state.items.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="export-btn">
            <Download className="w-4 h-4" />
            Export ({filteredCustomers.length})
          </button>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            New Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="font-medium">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td className="text-gray-600">{customer.createdAt}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="action-btn text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
                      className="action-btn text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Drawer */}
      <Drawer
        isOpen={state.mode === 'create' || state.mode === 'edit'}
        title={state.mode === 'create' ? 'New Customer' : 'Edit Customer'}
        onClose={() => {
          actions.closeDrawer();
          setFormData(null);
        }}
      >
        <div className="space-y-4">
          <FormField
            label="Full Name"
            value={formData?.name || ''}
            onChange={(value) => setFormData({ ...formData!, name: value })}
            placeholder="Ahmed Hassan"
          />
          <FormField
            label="Email"
            type="email"
            value={formData?.email || ''}
            onChange={(value) => setFormData({ ...formData!, email: value })}
            placeholder="ahmed@example.com"
          />
          <FormField
            label="Phone"
            value={formData?.phone || ''}
            onChange={(value) => setFormData({ ...formData!, phone: value })}
            placeholder="+212612345678"
          />
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {state.mode === 'create' ? 'Create' : 'Save'}
            </button>
            <button
              onClick={() => {
                actions.closeDrawer();
                setFormData(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

### Step 3: Add to Navigation

File: `/components/AppSidebar.tsx`

Add to `navItems` array:
```typescript
{ href: '/customers', label: 'Customers', icon: Users },
```

---

## Pattern 1: Adding a New Column to an Existing Table

Example: Add "Rating" column to Drivers page

### In the table header:
```tsx
<th>Name</th>
<th>Phone</th>
<th>Rating</th>  {/* Add this */}
<th>Actions</th>
```

### In the table body:
```tsx
<td>{driver.name}</td>
<td>{driver.phone}</td>
<td>⭐ {driver.rating}/5</td>  {/* Add this */}
<td>/* actions */</td>
```

### In the data file (/lib/data/drivers.ts):
```typescript
export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;  // Add this
  // ... other fields
}
```

---

## Pattern 2: Adding an Export Button

Template (works on any page):

```tsx
import { Download } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel-export';

// In your component:
const handleExport = () => {
  if (filteredData.length === 0) {
    alert('No data to export');
    return;
  }
  exportToExcel(filteredData, 'filename-here');
};

// In your JSX:
<button onClick={handleExport} className="export-btn">
  <Download className="w-4 h-4" />
  Export ({filteredData.length})
</button>
```

---

## Pattern 3: Adding a Filter

Template:

```tsx
// Add to your filters state:
const [filters, setFilters] = useState({
  existingFilter: '',
  newFilter: '',  // Add this
});

// Add to filter logic:
const filteredItems = state.items.filter((item) => {
  const matchesExisting = !filters.existingFilter || 
    item.field === filters.existingFilter;
  const matchesNew = !filters.newFilter || 
    item.newField.includes(filters.newFilter);
  return matchesExisting && matchesNew;
});

// Add to filter UI:
<select
  value={filters.newFilter}
  onChange={(e) => setFilters({ ...filters, newFilter: e.target.value })}
  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
>
  <option value="">All {Field}s</option>
  <option value="value1">Value 1</option>
  <option value="value2">Value 2</option>
</select>
```

---

## Pattern 4: Adding Sorting

```tsx
// Add to your state:
const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

// Add sort function:
const sorted = [...filteredItems].sort((a, b) => {
  let compareA = a[sortBy];
  let compareB = b[sortBy];
  
  if (typeof compareA === 'string') {
    compareA = compareA.toLowerCase();
    compareB = compareB.toLowerCase();
  }
  
  if (sortOrder === 'asc') {
    return compareA > compareB ? 1 : -1;
  } else {
    return compareA < compareB ? 1 : -1;
  }
});

// Add header click handler:
<th
  onClick={() => {
    setSortBy('name');
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }}
  className="cursor-pointer hover:bg-gray-100"
>
  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
</th>
```

---

## Pattern 5: Adding a Status Badge

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// In your table:
<td>
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
    {item.status}
  </span>
</td>
```

---

## Pattern 6: Adding a Modal/Drawer

Already implemented. Just use:

```tsx
import { Drawer } from '@/components/Drawer';

<Drawer
  isOpen={showDrawer}
  title="My Title"
  onClose={() => setShowDrawer(false)}
>
  {/* Your content here */}
</Drawer>
```

---

## Common Imports You'll Need

```typescript
// Icons
import { Plus, Edit2, Trash2, Download, Eye, Search } from 'lucide-react';

// Utilities
import { exportToExcel } from '@/lib/utils/excel-export';

// Components
import { Drawer } from '@/components/Drawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';

// Hooks
import { useCrudState } from '@/hooks/useCrudState';

// Types & Data
import { Customer, customers } from '@/lib/data/customers';
```

---

## CSS Classes Cheat Sheet

```css
/* Layout */
.space-y-6        /* Vertical spacing between sections */
.flex              /* Flexbox */
.items-center      /* Vertical align center */
.justify-between   /* Space between items */
.gap-3             /* Gap between flex items */

/* Colors */
.text-gray-900     /* Dark text */
.text-gray-600     /* Light text */
.bg-blue-600       /* Blue background */
.border-gray-100   /* Light border */

/* Sizing */
.w-full            /* Full width */
.px-4              /* Horizontal padding 16px */
.py-2              /* Vertical padding 8px */

/* States */
.hover:bg-gray-50  /* Hover background */
.focus:ring-2      /* Focus ring */
.transition-colors /* Smooth color change */
.rounded-lg        /* Rounded corners 8px */
.font-medium       /* Semi-bold text */
```

---

## Quick Checklist for New Features

- [ ] Create data file in `/lib/data/`
- [ ] Create page file in `/app/feature/page.tsx`
- [ ] Add navigation item in `/components/AppSidebar.tsx`
- [ ] Import necessary icons from lucide-react
- [ ] Set up CRUD state with `useCrudState` hook
- [ ] Create filter logic
- [ ] Add export button
- [ ] Style components using design system classes
- [ ] Test on mobile (responsive)
- [ ] Test keyboard navigation (accessibility)

---

## Getting Help

- **Design Questions**: Check `/DESIGN_SYSTEM.md`
- **Feature Requirements**: Check `/DOMAIN_ANALYSIS.md`
- **Implementation Guide**: Check `/PROJECT_IMPROVEMENTS.md`
- **Export Reference**: Check `/lib/utils/excel-export.ts`


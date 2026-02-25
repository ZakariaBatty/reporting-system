# TransitHub Design System

## Color Palette

### Primary Colors
- **Blue**: `#3b82f6` - Primary actions, links, active states
- **Green**: `#10b981` - Success, available, positive status
- **Red**: `#ef4444` - Destructive actions, errors, off-duty
- **Orange**: `#f59e0b` - Warning, attention needed

### Neutral Colors
- **White**: `#ffffff` - Background, card backgrounds
- **Gray-50**: `#f9fafb` - Subtle backgrounds
- **Gray-100**: `#f3f4f6` - Hover states, borders
- **Gray-200**: `#e5e7eb` - Dividers
- **Gray-600**: `#4b5563` - Secondary text
- **Gray-900**: `#09090b` - Primary text

## Typography

### Font Family
- **Sans-serif**: Geist (default)
- **Mono**: Geist Mono (for code/numbers)

### Font Sizes
- **Page Title**: 30px (text-3xl), bold
- **Section Title**: 18px (text-lg), semibold
- **Body Text**: 14px (text-sm), regular
- **Small Text**: 12px (text-xs), regular
- **Labels**: 12px (text-xs), uppercase, semibold, tracked

### Line Heights
- **Headings**: 1.2
- **Body**: 1.5 (leading-relaxed)
- **Compact**: 1.25

## Component Sizing

### Sidebar
- **Width**: 224px (w-56)
- **Header Height**: 56px (h-14)
- **Logo Size**: 28px (w-7 h-7)
- **Icon Size**: 16px (w-4 h-4)
- **Nav Item Padding**: 8px 12px (px-3 py-2)

### Icon Badges
- **Container**: 40px × 40px (w-10 h-10)
- **Border**: 1px solid gray-200
- **Border Radius**: 8px (rounded-lg)
- **Icon Size**: 20px (w-5 h-5)
- **Background**: White
- **Icon Color**: Brand color (blue, green, etc.)

### Cards & Tables
- **Border**: 1px solid gray-100
- **Border Radius**: 8px (rounded-lg)
- **Padding**: 24px (p-6)
- **Table Row Height**: 48px
- **Table Cell Padding**: 16px 16px (px-4 py-3)

### Buttons
- **Primary Button**: 
  - Background: Blue (#3b82f6)
  - Text: White
  - Padding: 8px 16px (px-4 py-2)
  - Border Radius: 8px
  - Hover: bg-blue-700

- **Export Button**:
  - Background: Blue (#3b82f6)
  - Text: White
  - Padding: 12px 16px (px-3 py-2)
  - Icon Gap: 8px
  - Font Size: 14px

- **Action Button**:
  - Padding: 8px 8px (px-2 py-1)
  - Font Size: 12px
  - Border Radius: 6px
  - Hover: bg-gray-100

## Spacing

### Grid Gaps
- **6**: 24px - Large sections
- **4**: 16px - Component groups
- **3**: 12px - List items
- **2**: 8px - Grouped buttons

### Margins
- **Section Margin**: 24px (mb-6)
- **Title Margin**: 12px (mt-2)
- **Padding Inside Cards**: 24px (p-6)

## States

### Hover
- **Cards**: Subtle shadow, transition
- **Buttons**: Darker background color
- **Rows**: Light gray background (bg-gray-50)

### Active/Selected
- **Sidebar Link**: Light blue background (bg-blue-50) with blue text
- **Status Badge**: Colored background matching status
- **Input Focus**: 2px blue ring (focus:ring-2 focus:ring-blue-500)

### Disabled
- **Text**: Gray-400
- **Background**: Gray-100
- **Cursor**: Not-allowed

## Status Badge Colors

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Scheduled | Yellow-100 | Yellow-800 | Yellow-500 |
| Assigned | Blue-100 | Blue-800 | Blue-500 |
| In Progress | Purple-100 | Purple-800 | Purple-500 |
| Completed | Green-100 | Green-800 | Green-500 |
| Available | Green-100 | Green-800 | - |
| On Trip | Purple-100 | Purple-800 | - |
| Off Duty | Gray-100 | Gray-800 | - |

## Tailwind CSS Classes

### Custom Classes
```css
.icon-bg
  - inline-flex items-center justify-center
  - w-10 h-10
  - rounded-lg
  - bg-white border border-gray-200

.card-subtle
  - border border-gray-100 rounded-lg

.stat-card
  - card-subtle bg-white p-6
  - hover:shadow-sm transition-shadow

.data-table
  - w-full text-sm
  - Styled thead, tbody, rows

.action-btn
  - inline-flex items-center gap-1
  - px-2 py-1 text-xs rounded
  - hover:bg-gray-100 transition-colors

.export-btn
  - inline-flex items-center gap-2
  - px-3 py-2
  - bg-blue-600 text-white text-sm rounded-lg
  - hover:bg-blue-700 transition-colors
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Sidebar
- **Hidden on mobile** by default (md:translate-x-0)
- **Slides in from left** (transition-transform)
- **Fixed overlay** with close button

### Grid Adjustments
- **Mobile**: Single column (grid-cols-1)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Desktop**: 3+ columns (lg:grid-cols-3)

## Accessibility

### Color Contrast
- All text on backgrounds meets WCAG AA standard (4.5:1 minimum)
- Status indicators include icons + color (not color alone)
- Interactive elements have visible focus states

### Keyboard Navigation
- All buttons are keyboard accessible (tab order)
- Focus ring visible on all interactive elements
- Modal/drawer can be closed with Escape key

### Screen Readers
- Proper semantic HTML (tables, headings, lists)
- ARIA labels on icon buttons
- Form labels associated with inputs

## Animation & Transitions

### Transition Duration
- **Fast**: 150ms (quick feedback)
- **Standard**: 300ms (smooth interactions)
- **Slow**: 500ms (significant changes)

### Common Transitions
- **Hover effects**: 300ms ease-in-out
- **Modal/Drawer**: 300ms ease-out
- **Color changes**: 150ms ease-in

### Disabled Animations
- Respects prefers-reduced-motion if user has enabled it

## Shadows

- **None**: Default (sharp look)
- **Hover**: `shadow-sm` (0 1px 2px rgba)
- **Raised**: `shadow-md` (0 4px 6px rgba)
- **Modal**: `shadow-lg` (0 10px 15px rgba)

---

## Usage Examples

### Creating a Stat Card
```tsx
<div className="stat-card">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        Total Trips
      </p>
      <p className="text-2xl font-bold text-blue-600 mt-2">24</p>
    </div>
    <div className="icon-bg">
      <Activity className="w-5 h-5 text-blue-600" />
    </div>
  </div>
</div>
```

### Creating an Action Button
```tsx
<button className="action-btn">
  <Edit2 className="w-4 h-4" />
  Edit
</button>
```

### Creating an Export Button
```tsx
<button onClick={handleExport} className="export-btn">
  <Download className="w-4 h-4" />
  Export Data
</button>
```


# User Table Structure

## Overview
The user table now displays all the key information from your user data in a clean, organized format.

## Table Columns

The table displays the following 9 columns:

| Column | Field | Description | Example |
|--------|-------|-------------|---------|
| **ID** | `id` | User's unique identifier | #5 |
| **Name** | `name` | Full name of the user | Vikram Singh |
| **Email** | `email` | Email address | vikram.singh@example.com |
| **Phone** | `phoneNumber` | Contact number | +91 98765 43214 |
| **Role** | `role` | User role (capitalized) | Investor |
| **Status** | `status` | Account status with badge | Active (green badge) |
| **Date Joined** | `dateJoined` | Date user registered | 5 Feb 2024 |
| **Verified** | `verified` | Verification status with icon | ✓ (checkmark) or ✗ |
| **Actions** | - | Action buttons | View Details |

## Visual Features

### Status Badges
- **Active**: Green badge with "Active" text
- **Inactive**: Gray badge with "Inactive" text
- **Pending**: Yellow badge with "Pending" text

### Verification Icons
- **Verified**: Green checkmark icon (✓)
- **Not Verified**: Gray X icon (✗)

### Date Formatting
Dates are displayed in Indian format:
- Format: `5 Feb 2024`
- Uses `en-IN` locale

## Data Structure

Your user data follows this structure:

```json
{
  "id": "5",
  "name": "Vikram Singh",
  "email": "vikram.singh@example.com",
  "role": "investor",
  "status": "active",
  "phoneNumber": "+91 98765 43214",
  "dateJoined": "2024-02-05T16:20:00Z",
  "investmentCount": 4,
  "totalInvestment": 300000,
  "verified": true
}
```

## Hidden Columns

These fields are **not shown in the table** but are available in the "View Details" modal:

- `investmentCount` - Number of investments
- `totalInvestment` - Total investment amount
- `address` - Physical address (if available)
- `panNumber` - PAN card number (if available)
- `kycStatus` - KYC verification status (if available)

## User Details Modal

When you click "View Details", a modal shows:

### Basic Information Section
- User ID
- Name
- Email
- Phone Number
- Role
- Status (with colored badge)
- Verification Status (with icon)
- Date Joined

### Investment Information Section (if available)
- Investment Count
- Total Investment (formatted as ₹3,00,000)

### Additional Information Section (if available)
- Address
- PAN Number
- KYC Status

## Responsive Design

### Desktop View
- All 9 columns visible
- Horizontal scroll if needed
- Hover effects on rows

### Mobile/Tablet View
- Table scrolls horizontally
- All columns remain accessible
- Optimized touch targets

## Dark Mode Support

The table fully supports dark mode:

### Light Mode
- White background
- Dark text
- Gray borders
- Colored status badges

### Dark Mode
- Dark gray background
- Light text
- Darker borders
- Adjusted badge colors for visibility

## Interactive Features

### Hover Effects
- Rows highlight on hover
- Buttons change color on hover
- Smooth transitions

### Click Actions
- Click "View Details" to open modal
- Click anywhere on modal overlay to close
- Click "X" button to close modal

## TypeScript Type Definition

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phoneNumber: string;
  dateJoined: string;
  investmentCount?: number;
  totalInvestment?: number;
  verified: boolean;
  address?: string;
  panNumber?: string;
  kycStatus?: string;
}
```

## Component Files

### Main Files
- `components/dashboard/UserTable.tsx` - Table component
- `components/dashboard/UserDetailsModal.tsx` - Details modal
- `types/user.types.ts` - TypeScript types
- `app/dashboard/users/page.tsx` - Users page

### API Files
- `app/api/users/route.ts` - Users list endpoint
- `app/api/users/[id]/route.ts` - Individual user endpoint
- `services/api/userService.ts` - Service layer
- `services/api/config.ts` - API configuration

## Example Usage

### Displaying Users
```tsx
import UserTable from '@/components/dashboard/UserTable';

<UserTable
  users={users}
  onViewDetails={(userId) => handleViewDetails(userId)}
  loading={loading}
/>
```

### User Data Format
```typescript
const users = [
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "investor",
    status: "active",
    phoneNumber: "+91 98765 43214",
    dateJoined: "2024-02-05T16:20:00Z",
    investmentCount: 4,
    totalInvestment: 300000,
    verified: true
  },
  // ... more users
];
```

## Customization

### Adding New Columns
To add a new column to the table:

1. Update `UserTable.tsx`:
```tsx
<th className="...">New Column</th>
```

2. Add the data cell:
```tsx
<td className="...">
  {user.newField}
</td>
```

### Changing Date Format
Modify the `formatDate` function in `UserTable.tsx`:
```tsx
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

### Customizing Status Badges
Edit the `getStatusBadge` function:
```tsx
const statusStyles = {
  active: 'bg-green-100 text-green-800 ...',
  newStatus: 'bg-blue-100 text-blue-800 ...',
};
```

## Performance

- **Optimized Rendering**: Uses React keys properly
- **No Layout Shift**: Fixed column widths
- **Smooth Animations**: CSS transitions
- **Fast Loading**: Efficient data fetching

## Accessibility

- **Keyboard Navigation**: Tab through elements
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast**: Works with system settings
- **Focus Indicators**: Clear focus states

## Browser Support

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers

---

**Status**: ✅ All fields displaying correctly  
**Last Updated**: Table updated with all 8 requested columns

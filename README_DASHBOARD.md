# Admin Dashboard - User Management

This is a comprehensive admin dashboard for managing users with a clean, industry-standard architecture.

## 📁 Project Structure

```
asset-heaven-admin-fe/
├── app/
│   └── dashboard/              # Dashboard route
│       └── page.tsx            # Main dashboard page
├── components/
│   └── dashboard/              # Dashboard-specific components
│       ├── DashboardHeader.tsx # Header with stats and actions
│       ├── UserTable.tsx       # User data table
│       └── UserDetailsModal.tsx # Modal for viewing user details
├── features/
│   └── users/                  # User feature slice
│       └── usersSlice.ts       # Redux slice for user state management
├── services/
│   └── api/                    # API service layer
│       ├── userService.ts      # User API calls
│       └── index.ts            # Service exports
├── types/
│   └── user.types.ts           # TypeScript types for users
└── lib/
    ├── store.ts                # Redux store configuration
    └── hooks.ts                # Redux hooks
```

## 🎯 Features

- **User List Display**: View all users in a responsive table
- **User Details**: Click to view detailed information about each user
- **Real-time Loading**: Loading states and error handling
- **Dark Mode Support**: Fully themed for light and dark modes
- **Refresh Data**: Manual refresh button to reload users
- **Redux State Management**: Centralized state with Redux Toolkit
- **Type Safety**: Full TypeScript support

## 🔌 API Endpoints Used

### Get All Users
```
GET https://mobulous-tech.vercel.app/api/users
```

### Get User by ID
```
GET https://mobulous-tech.vercel.app/api/users/:_id
```

### User Payload Structure
```typescript
{
  "_id": "string",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 How to Use

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the dashboard**:
   ```
   http://localhost:3000/dashboard
   ```

3. **Interact with the dashboard**:
   - View all users in the table
   - Click "View Details" to see complete user information
   - Use the "Refresh" button to reload data
   - Toggle dark mode with the theme button

## 📦 Component Overview

### `app/dashboard/page.tsx`
Main dashboard page that orchestrates the user management interface. Handles data fetching and modal state.

### `components/dashboard/DashboardHeader.tsx`
Header component displaying title, user count, refresh button, and theme toggle.

### `components/dashboard/UserTable.tsx`
Responsive table component for displaying user data with loading and empty states.

### `components/dashboard/UserDetailsModal.tsx`
Modal dialog for viewing detailed user information.

### `features/users/usersSlice.ts`
Redux Toolkit slice managing user state with async thunks for API calls.

### `services/api/userService.ts`
Service layer for all user-related API calls. Includes methods for:
- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch single user
- `createUser(payload)` - Create new user
- `updateUser(id, payload)` - Update existing user
- `deleteUser(id)` - Delete user

### `types/user.types.ts`
TypeScript interfaces for type safety:
- `User` - User entity
- `CreateUserPayload` - User creation data
- `UpdateUserPayload` - User update data
- `UsersState` - Redux state shape

## 🎨 Styling

The dashboard uses Tailwind CSS with full dark mode support. All components are responsive and follow modern UI/UX patterns.

## 🔄 State Management Flow

```
Component → Dispatch Action → Redux Thunk → API Service → Update State → Re-render Component
```

1. Component dispatches async action (e.g., `fetchUsers()`)
2. Redux Toolkit thunk calls the API service
3. Service makes HTTP request to backend
4. Response updates Redux state
5. Component re-renders with new data

## 🛡️ Error Handling

- Network errors are caught and displayed to users
- Loading states prevent multiple simultaneous requests
- Empty states guide users when no data is available

## 🔮 Future Enhancements

The service layer includes methods for:
- ✅ Creating new users
- ✅ Updating user information
- ✅ Deleting users

These can be integrated with UI components when needed.

## 📝 Notes

- All API calls use `cache: 'no-store'` to ensure fresh data
- Password fields are never displayed in the UI
- The service layer is fully typed for IDE autocomplete
- Redux DevTools are enabled in development mode

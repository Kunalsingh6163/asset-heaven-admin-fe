# API Integration Guide - Real API with Axios

## ✅ Implementation Complete!

Your Asset Heaven Admin Panel now integrates with the **real API** using **Axios**.

## 🔗 API Details

### Base URL Configuration
The API base URL is **configurable via environment variables**, allowing you to easily switch between:
- **Production API**: `https://mobulous-tech.vercel.app/api`
- **Local Development**: `http://localhost:3001/api` (or your local port)

#### Quick Setup:
1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_API_URL` to your desired endpoint
3. Restart the dev server

```bash
# In .env.local

# For production (deployed API):
NEXT_PUBLIC_API_URL=https://mobulous-tech.vercel.app/api

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note**: The app will automatically use the production URL if no environment variable is set.

### Current Endpoint
```http
GET /users
```

### Response Format
```json
{
  "data": [
    {
      "_id": "69cedb99aebe058c251fe53d",
      "name": "Kunal",
      "email": "kunal@test.com",
      "authMethods": ["email_password"],
      "lastLoginMethod": "email_password",
      "isEmailVerified": false,
      "admin": false,
      "createdAt": "2026-04-02T21:11:53.953Z",
      "updatedAt": "2026-04-02T21:11:53.953Z",
      "__v": 0
    }
  ]
}
```

## 📦 Dependencies Installed

```bash
npm install axios
```

## 🎯 What Was Changed

### 1. **API Configuration** (`services/api/config.ts`)
- **Environment-based configuration** using `NEXT_PUBLIC_API_URL`
- Supports both localhost and deployed API
- Automatic fallback to production URL
- Console logging for debugging
- Easy switching via `.env.local` file

### 2. **User Service** (`services/api/userService.ts`)
- **Complete rewrite using Axios**
- Added axios instance with interceptors
- Error handling with proper messages
- Response format handling (`response.data.data`)
- 30-second timeout configured

### 3. **User Types** (`types/user.types.ts`)
Updated to match API response:
```typescript
interface User {
  _id: string;              // MongoDB ID
  name: string;
  email: string;
  authMethods: string[];    // e.g., ["email_password"]
  lastLoginMethod: string;  // e.g., "email_password"
  isEmailVerified: boolean;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
```

### 4. **User Table** (`components/dashboard/UserTable.tsx`)
Updated columns to display:
- **#** - Row number (index + 1)
- **Name** - User's name
- **Email** - User's email
- **Auth Method** - Authentication method (formatted)
- **Email Verified** - Badge (Verified/Not Verified)
- **Role** - Badge (Admin/User)
- **Created At** - Formatted date with time
- **Actions** - View Details button

### 5. **User Details Modal** (`components/dashboard/UserDetailsModal.tsx`)
Completely redesigned to show:
- **User ID** - MongoDB _id
- **Basic Information** - Name, Email
- **Authentication** - Auth methods, Last login method
- **Status** - Email verified, User role
- **Timestamps** - Created at, Updated at

### 6. **Dashboard** (`app/dashboard/page.tsx`)
Updated statistics:
- **Total Users** - Count from API
- **Verified Users** - Count of email verified users
- **Admin Users** - Count of admin users
- **Verification %** - Percentage of verified users

## 🎨 Table Display

### Columns Shown:
| Column | Data Field | Format |
|--------|-----------|---------|
| # | Index | 1, 2, 3... |
| Name | `user.name` | Plain text |
| Email | `user.email` | Plain text |
| Auth Method | `user.lastLoginMethod` | Capitalized, spaces |
| Email Verified | `user.isEmailVerified` | Badge (Green/Brass) |
| Role | `user.admin` | Badge (Gold/Gray) |
| Created At | `user.createdAt` | DD MMM YYYY, HH:MM |
| Actions | - | View Details button |

### Badge Colors:
- **Verified Email**: Green badge
- **Not Verified**: Brass/tan badge
- **Admin Role**: Gold badge
- **User Role**: Gray badge

## 🚀 How It Works

### Data Flow:
```
1. Component mounts
   ↓
2. Calls userService.getAllUsers()
   ↓
3. Axios makes GET request
   ↓
4. API returns { data: [...] }
   ↓
5. Service extracts response.data.data
   ↓
6. Returns User[] array
   ↓
7. Component displays in table
```

### Error Handling:
```typescript
try {
  const users = await userService.getAllUsers();
  // Success
} catch (error) {
  // Error displayed in UI
  // Console log for debugging
}
```

## 📊 Dashboard Statistics

### Calculated from API Data:
```typescript
const stats = {
  totalUsers: users.length,
  verifiedUsers: users.filter(u => u.isEmailVerified).length,
  adminUsers: users.filter(u => u.admin).length,
};
```

### Displayed:
- Total Users count
- Verified users count
- Admin users count
- Verification percentage

## 🔧 Axios Configuration

### Dynamic Base URL:
```typescript
// Reads from NEXT_PUBLIC_API_URL environment variable
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    console.log('🌐 Using API URL from environment:', envUrl);
    return envUrl;
  }
  
  // Fallback to production
  const fallbackUrl = 'https://mobulous-tech.vercel.app/api';
  console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using fallback:', fallbackUrl);
  return fallbackUrl;
};
```

### Instance Setup:
```typescript
const apiClient = axios.create({
  baseURL: getApiBaseUrl(), // Dynamic from environment
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 seconds
});
```

### Response Interceptor:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle different error types
    // - Server responded with error status
    // - Request made but no response
    // - Error in request setup
  }
);
```

## 🎯 Features

### ✅ Implemented:
- Real API integration with Axios
- Error handling with user-friendly messages
- Loading states
- Responsive table design
- Modal with detailed user information
- Auto-refresh on mount
- Golden theme styling
- Dark mode support
- Full-width table layout
- Expanded component sizes

### 🔄 API Operations Supported:
- ✅ GET all users
- ✅ GET user by ID
- ✅ POST create user
- ✅ PUT update user
- ✅ DELETE user

## 📱 Usage Examples

### Environment Configuration:

#### Switching to Localhost:
1. Open `.env.local` file
2. Comment the production URL and uncomment localhost:
   ```env
   # NEXT_PUBLIC_API_URL=https://mobulous-tech.vercel.app/api
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
3. Restart the dev server: `npm run dev`
4. Check browser console for: `🌐 Using API URL from environment: http://localhost:3001/api`

#### Switching to Production:
1. Open `.env.local` file
2. Uncomment the production URL:
   ```env
   NEXT_PUBLIC_API_URL=https://mobulous-tech.vercel.app/api
   # NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
3. Restart the dev server
4. Check browser console for: `🌐 Using API URL from environment: https://mobulous-tech.vercel.app/api`

#### Verify Current Configuration:
Open browser console and look for the log message showing which API URL is being used.

### Fetch All Users:
```typescript
const users = await userService.getAllUsers();
console.log(users); // Array of User objects
```

### Fetch Single User:
```typescript
const user = await userService.getUserById('69cedb99aebe058c251fe53d');
console.log(user); // Single User object
```

### Create User:
```typescript
const newUser = await userService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword',
});
```

### Update User:
```typescript
const updated = await userService.updateUser('userId', {
  name: 'Updated Name',
});
```

### Delete User:
```typescript
await userService.deleteUser('userId');
```

## 🎨 UI Components

### Golden Theme Applied:
- **Table Headers**: Bronze/brass colors
- **Table Rows**: Hover effects with cream background
- **Badges**: Gold, brass, green colors
- **Buttons**: Golden gradient
- **Modal**: Luxury design with backdrop blur
- **Loading**: Golden spinner

### Responsive Design:
- **Desktop**: Full-width table, all columns visible
- **Tablet**: Horizontal scroll if needed
- **Mobile**: Horizontal scroll, optimized spacing

## 🐛 Troubleshooting

### No Users Displaying:
1. Check console for errors
2. Verify API is accessible: `https://mobulous-tech.vercel.app/api/users`
3. Check network tab in browser DevTools
4. Look for CORS errors

### Type Errors:
- Ensure User type matches API response
- Check that `_id` is used (not `id`)
- Verify field names match exactly

### Axios Errors:
```typescript
// Check axios error details
console.log(error.response?.status);
console.log(error.response?.data);
console.log(error.message);
```

## 📈 Performance

### Optimizations:
- Axios instance reuse
- Response interceptors
- 30-second timeout
- Error boundary handling
- Loading states
- Memoized calculations

### Network:
- Single API call on mount
- Refresh button for manual update
- No polling (add if needed)
- Efficient data transformation

## 🔐 Security

### Current:
- HTTPS API endpoint
- No sensitive data in localStorage
- No auth tokens (add when needed)

### To Add (Future):
- JWT token authentication
- Authorization headers
- Secure token storage
- Request signing

## 📝 Testing

### Manual Testing:
1. Visit `/dashboard/users`
2. Check users load from API
3. Click "View Details" on a user
4. Verify all fields display correctly
5. Check loading states
6. Test error handling (disconnect internet)

### Browser Console:
```javascript
// Check API response
fetch('https://mobulous-tech.vercel.app/api/users')
  .then(r => r.json())
  .then(d => console.log(d));
```

## 🎯 Next Steps

### Recommended Enhancements:
- [ ] Add pagination for large user lists
- [ ] Add search/filter functionality
- [ ] Add sort by column
- [ ] Implement refresh interval
- [ ] Add user creation form
- [ ] Add user edit functionality
- [ ] Add bulk operations
- [ ] Export to CSV/Excel
- [ ] Add user activity logs

### Advanced Features:
- [ ] Real-time updates (WebSocket)
- [ ] Infinite scroll
- [ ] Advanced filters
- [ ] User analytics dashboard
- [ ] Bulk import/export
- [ ] Role management UI

## 📚 Documentation References

### Axios:
- [Axios Documentation](https://axios-http.com/)
- [Interceptors Guide](https://axios-http.com/docs/interceptors)
- [Error Handling](https://axios-http.com/docs/handling_errors)

### Next.js:
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

**Status**: ✅ API Integration Complete
**Library**: Axios
**Endpoint**: https://mobulous-tech.vercel.app/api/users
**Last Updated**: Real API integrated successfully
